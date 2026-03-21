'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RichEditor from '@/app/components/RichEditor';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import pageStyles from './announcements.module.css';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'game_update' | 'event' | 'maintenance';
  published: boolean;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState<Announcement['type']>('game_update');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('announcements')
      .select()
      .order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  };

  const togglePublished = async (ann: Announcement) => {
    setActionLoading(ann.id);
    const { error } = await supabase
      .from('announcements')
      .update({ published: !ann.published })
      .eq('id', ann.id);
    if (!error)
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === ann.id ? { ...a, published: !a.published } : a))
      );
    setActionLoading(null);
  };

  const deleteAnnouncement = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setActionLoading(id);
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setActionLoading(null);
  };

  const handleCreate = async (publish: boolean) => {
    if (!formTitle.trim() || !formContent.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    const { data, error: err } = await supabase
      .from('announcements')
      .insert([{ title: formTitle, content: formContent, type: formType, published: publish }])
      .select();
    if (err) {
      setError('Failed to save. Check your Supabase connection.');
    } else {
      setAnnouncements((prev) => [data[0], ...prev]);
      setFormTitle('');
      setFormContent('');
      setFormType('game_update');
      setShowForm(false);
    }
    setSaving(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const typeLabel: Record<Announcement['type'], string> = {
    game_update: 'Game Update',
    event: 'Event',
    maintenance: 'Maintenance',
  };

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Announcements</h1>
        <p>Post game updates, events, and maintenance notices</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <button className={pageStyles.newBtn} onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancel' : '📢 New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className={pageStyles.form}>
          <h2>New Announcement</h2>
          {error && <p className={pageStyles.error}>{error}</p>}
          <div className={pageStyles.field}>
            <label>Title *</label>
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., New Event: Frostveil Festival" />
          </div>
          <div className={pageStyles.field}>
            <label>Type *</label>
            <select value={formType} onChange={(e) => setFormType(e.target.value as Announcement['type'])}>
              <option value="game_update">Game Update</option>
              <option value="event">Event</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className={pageStyles.field}>
            <label>Content *</label>
            <RichEditor
              value={formContent}
              onChange={setFormContent}
              placeholder="Announcement details..."
              minHeight={180}
            />
          </div>
          <div className={pageStyles.formActions}>
            <button onClick={() => handleCreate(true)} disabled={saving} className={pageStyles.publishBtn}>
              {saving ? 'Saving…' : '✅ Publish Now'}
            </button>
            <button onClick={() => handleCreate(false)} disabled={saving} className={pageStyles.draftBtn}>
              {saving ? 'Saving…' : '💾 Save as Draft'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className={pageStyles.empty}><p>No announcements yet. Create one above!</p></div>
      ) : (
        <div className={pageStyles.list}>
          {announcements.map((ann) => (
            <div key={ann.id} className={pageStyles.card}>
              <div className={pageStyles.cardMeta}>
                <span className={pageStyles[ann.type]}>{typeLabel[ann.type]}</span>
                <span className={ann.published ? pageStyles.published : pageStyles.draft}>
                  {ann.published ? 'Published' : 'Draft'}
                </span>
                <span className={pageStyles.date}>{formatDate(ann.created_at)}</span>
              </div>
              <h3 className={pageStyles.cardTitle}>{ann.title}</h3>
              <div
                className={`${pageStyles.cardContent} ${expandedCards.has(ann.id) ? pageStyles.expanded : ''}`}
                dangerouslySetInnerHTML={{ __html: ann.content }}
              />
              <button
                className={pageStyles.readMoreBtn}
                onClick={() => toggleExpanded(ann.id)}
              >
                {expandedCards.has(ann.id) ? '▲ Show Less' : '▼ Read More'}
              </button>
              <div className={pageStyles.cardActions}>
                <button onClick={() => togglePublished(ann)} disabled={actionLoading === ann.id} className={pageStyles.toggleBtn}>
                  {ann.published ? '🙈 Unpublish' : '✅ Publish'}
                </button>
                <button onClick={() => deleteAnnouncement(ann.id, ann.title)} disabled={actionLoading === ann.id} className={pageStyles.deleteBtn}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
