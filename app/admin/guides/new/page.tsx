'use client';

import { useState } from 'react';
import styles from './editor.module.css';

interface Section {
  id: string;
  type: 'overview' | 'requirements' | 'step' | 'preview' | 'tips' | 'notes';
  title: string;
  content: string;
  order: number;
}

export default function GuideEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'class' | 'item' | 'reputation' | 'farming' | 'enhancement'>('class');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: '',
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex((s) => s.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const target = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[target]] = [
      newSections[target],
      newSections[index],
    ];
    setSections(newSections);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const guideData = {
      title,
      description,
      category,
      sections,
      // image handling would go here
    };

    console.log('Saving guide:', guideData);
    // Send to API
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h1>Create Guide</h1>
        <p>Build a new guide with modular sections</p>
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.formSection}>
          <label>Guide Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Void Highlord"
            required
          />
        </div>

        <div className={styles.formSection}>
          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this guide covers"
            rows={3}
            required
          />
        </div>

        <div className={styles.formSection}>
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as
                  | 'class'
                  | 'item'
                  | 'reputation'
                  | 'farming'
                  | 'enhancement'
              )
            }
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
              <button
                type="button"
                onClick={() => addSection('overview')}
                className={styles.addBtn}
              >
                + Overview
              </button>
              <button
                type="button"
                onClick={() => addSection('requirements')}
                className={styles.addBtn}
              >
                + Requirements
              </button>
              <button
                type="button"
                onClick={() => addSection('step')}
                className={styles.addBtn}
              >
                + Step
              </button>
              <button
                type="button"
                onClick={() => addSection('tips')}
                className={styles.addBtn}
              >
                + Tips
              </button>
              <button
                type="button"
                onClick={() => addSection('preview')}
                className={styles.addBtn}
              >
                + Preview
              </button>
              <button
                type="button"
                onClick={() => addSection('notes')}
                className={styles.addBtn}
              >
                + Notes
              </button>
            </div>
          </div>

          {sections.length === 0 ? (
            <p className={styles.noSections}>
              No sections yet. Click above to add your first section.
            </p>
          ) : (
            <div className={styles.sectionsList}>
              {sections.map((section) => (
                <div key={section.id} className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, { title: e.target.value })
                      }
                      className={styles.titleInput}
                    />
                    <span className={styles.sectionType}>{section.type}</span>
                  </div>

                  {section.type === 'preview' ? (
                    <div className={styles.imageUpload}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <p style={{ fontSize: '0.9em', color: '#888', marginTop: '0.5rem' }}>
                        Upload class/item preview image
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(section.id, { content: e.target.value })
                      }
                      placeholder={`Enter ${section.type} content here...`}
                      rows={section.type === 'overview' ? 4 : 6}
                      className={styles.content}
                    />
                  )}

                  <div className={styles.sectionActions}>
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 'up')}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 'down')}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSection(section.id)}
                      className={styles.deleteBtn}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            Save Guide
          </button>
          <button type="button" className={styles.draftBtn}>
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
