'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import pageStyles from './updates.module.css';

interface SiteUpdate {
  id: string;
  version: string;
  title: string;
  changes: string[];
  created_at: string;
}

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [changesText, setChangesText] = useState('');

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_updates')
      .select()
      .order('created_at', { ascending: false });
    setUpdates(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    const changes = changesText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (!version.trim() || !title.trim() || changes.length === 0) {
      setError('Version, title, and at least one change are required.');
      return;
    }

    setSaving(true);
    setError('');
    const { data, error: err } = await supabase
      .from('site_updates')
      .insert([{ version, title, changes }])
      .select();

    if (err) {
      setError('Failed to save. Check your Supabase connection.');
    } else {
      setUpdates((prev) => [data[0], ...prev]);
      setVersion('');
      setTitle('');
      setChangesText('');
      setShowForm(false);
    }
    setSaving(false);
  };

  const deleteUpdate = async (id: string) => {
    if (!confirm('Delete this update entry?')) return;
    setDeleting(id);
    const { error } = await supabase.from('site_updates').delete().eq('id', id);
    if (!error) setUpdates((prev) => prev.filter((u) => u.id !== id));
    setDeleting(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Site Updates</h1>
        <p>Log new versions and changes to AQWG</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <button className={pageStyles.newBtn} onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancel' : '📝 Log Update'}
        </button>
      </div>

      {showForm && (
        <div className={pageStyles.form}>
          <h2>New Site Update</h2>
          {error && <p className={pageStyles.error}>{error}</p>}
          <div className={pageStyles.formRow}>
            <div className={pageStyles.field}>
              <label>Version *</label>
              <input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g., v1.1.0" />
            </div>
            <div className={pageStyles.field}>
              <label>Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Search & Performance" />
            </div>
          </div>
          <div className={pageStyles.field}>
            <label>Changes * <span className={pageStyles.hint}>(one per line)</span></label>
            <textarea
              value={changesText}
              onChange={(e) => setChangesText(e.target.value)}
              rows={6}
              placeholder={"Added guide search\nFixed mobile sidebar\nImproved load times"}
            />
          </div>
          <div className={pageStyles.formActions}>
            <button onClick={handleCreate} disabled={saving} className={pageStyles.saveBtn}>
              {saving ? 'Saving…' : '💾 Save Update'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading updates...</div>
      ) : updates.length === 0 ? (
        <div className={pageStyles.empty}>
          <p>No updates logged yet.</p>
        </div>
      ) : (
        <div className={pageStyles.timeline}>
          {updates.map((update) => (
            <div key={update.id} className={pageStyles.entry}>
              <div className={pageStyles.entryHeader}>
                <div className={pageStyles.entryMeta}>
                  <span className={pageStyles.version}>{update.version}</span>
                  <h3>{update.title}</h3>
                  <span className={pageStyles.date}>{formatDate(update.created_at)}</span>
                </div>
                <button
                  onClick={() => deleteUpdate(update.id)}
                  disabled={deleting === update.id}
                  className={pageStyles.deleteBtn}
                >
                  🗑
                </button>
              </div>
              <ul className={pageStyles.changeList}>
                {update.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
