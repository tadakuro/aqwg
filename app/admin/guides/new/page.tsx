'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichEditor from '@/app/components/RichEditor';
import styles from './editor.module.css';

interface Section {
  id: string;
  type: 'overview' | 'requirements' | 'step' | 'preview' | 'tips' | 'notes';
  title: string;
  content: string;
  order: number;
  previewFile?: File | null;
}

export default function GuideEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<
    'class' | 'item' | 'reputation' | 'farming' | 'enhancement'
  >('class');
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addSection = (type: Section['type']) => {
    setSections([...sections, {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: '',
      order: sections.length,
    }]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex((s) => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const next = [...sections];
    const target = direction === 'up' ? index - 1 : index + 1;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSaving(true);
    setError('');

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'admin',
      },
      body: JSON.stringify({
        title,
        slug,
        category,
        description,
        sections: sections.map(({ previewFile, ...s }) => s),
        published: publish,
      }),
    });

    if (res.ok) {
      router.push('/admin/guides');
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to save. Check your Supabase connection.');
    }
    setSaving(false);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h1>Create Guide</h1>
        <p>Build a new guide with modular sections</p>
      </div>

      {error && (
        <p style={{ color: '#ff6b6b', marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,107,107,0.1)', borderRadius: '4px', border: '1px solid rgba(255,107,107,0.3)' }}>
          ❌ {error}
        </p>
      )}

      <div className={styles.form}>
        <div className={styles.formSection}>
          <label>Guide Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Void Highlord"
          />
        </div>

        <div className={styles.formSection}>
          <label>Description *</label>
          <RichEditor
            value={description}
            onChange={setDescription}
            placeholder="Brief description of what this guide covers"
            minHeight={100}
          />
        </div>

        <div className={styles.formSection}>
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
          >
            <option value="class">Class</option>
            <option value="item">Item</option>
            <option value="reputation">Reputation</option>
            <option value="farming">Farming</option>
            <option value="enhancement">Enhancement</option>
          </select>
        </div>

        <div className={styles.sectionsContainer}>
          <div className={styles.sectionHeader}>
            <h2>Sections</h2>
            <div className={styles.addButtons}>
              {(['overview', 'requirements', 'step', 'tips', 'preview', 'notes'] as const).map((type) => (
                <button key={type} type="button" onClick={() => addSection(type)} className={styles.addBtn}>
                  + {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {sections.length === 0 ? (
            <p className={styles.noSections}>No sections yet. Click above to add your first section.</p>
          ) : (
            <div className={styles.sectionsList}>
              {sections.map((section) => (
                <div key={section.id} className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className={styles.titleInput}
                    />
                    <span className={styles.sectionType}>{section.type}</span>
                  </div>

                  {section.type === 'preview' ? (
                    <div className={styles.imageUpload}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateSection(section.id, { previewFile: e.target.files?.[0] ?? null })}
                      />
                      {section.previewFile ? (
                        <p style={{ fontSize: '0.9em', color: '#4db8ff', marginTop: '0.5rem' }}>
                          Selected: {section.previewFile.name}
                        </p>
                      ) : (
                        <p style={{ fontSize: '0.9em', color: '#888', marginTop: '0.5rem' }}>
                          Upload class/item preview image
                        </p>
                      )}
                    </div>
                  ) : (
                    <RichEditor
                      value={section.content}
                      onChange={(val) => updateSection(section.id, { content: val })}
                      placeholder={`Enter ${section.type} content here...`}
                      minHeight={section.type === 'overview' ? 120 : 180}
                    />
                  )}

                  <div className={styles.sectionActions}>
                    <button type="button" onClick={() => moveSection(section.id, 'up')} title="Move up">↑</button>
                    <button type="button" onClick={() => moveSection(section.id, 'down')} title="Move down">↓</button>
                    <button type="button" onClick={() => deleteSection(section.id)} className={styles.deleteBtn} title="Delete">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className={styles.submitBtn}
          >
            {saving ? 'Saving…' : '✅ Publish Guide'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className={styles.draftBtn}
          >
            {saving ? 'Saving…' : '💾 Save as Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}
