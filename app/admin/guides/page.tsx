'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import pageStyles from './guides.module.css';

interface Guide {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  created_at: string;
  created_by: string;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guides')
      .select('id, title, slug, category, published, created_at, created_by')
      .order('created_at', { ascending: false });

    if (!error) setGuides(data || []);
    setLoading(false);
  };

  const togglePublished = async (guide: Guide) => {
    setActionLoading(guide.id);
    const { error } = await supabase
      .from('guides')
      .update({ published: !guide.published })
      .eq('id', guide.id);

    if (!error) {
      setGuides((prev) =>
        prev.map((g) =>
          g.id === guide.id ? { ...g, published: !g.published } : g
        )
      );
    }
    setActionLoading(null);
  };

  const deleteGuide = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setActionLoading(id);
    const { error } = await supabase.from('guides').delete().eq('id', id);
    if (!error) setGuides((prev) => prev.filter((g) => g.id !== id));
    setActionLoading(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Manage Guides</h1>
        <p>Publish, unpublish, or delete guides</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>
          ← Dashboard
        </Link>
        <Link href="/admin/guides/new" className={pageStyles.newBtn}>
          ➕ New Guide
        </Link>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading guides...</div>
      ) : guides.length === 0 ? (
        <div className={pageStyles.empty}>
          <p>No guides yet.</p>
          <Link href="/admin/guides/new">Create your first guide →</Link>
        </div>
      ) : (
        <div className={pageStyles.table}>
          <div className={pageStyles.tableHeader}>
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Created</span>
            <span>Actions</span>
          </div>
          {guides.map((guide) => (
            <div key={guide.id} className={pageStyles.tableRow}>
              <span className={pageStyles.title}>{guide.title}</span>
              <span className={pageStyles.category}>{guide.category}</span>
              <span>
                <span
                  className={
                    guide.published ? pageStyles.published : pageStyles.draft
                  }
                >
                  {guide.published ? 'Published' : 'Draft'}
                </span>
              </span>
              <span className={pageStyles.date}>{formatDate(guide.created_at)}</span>
              <span className={pageStyles.actions}>
                <button
                  onClick={() => togglePublished(guide)}
                  disabled={actionLoading === guide.id}
                  className={pageStyles.toggleBtn}
                  title={guide.published ? 'Unpublish' : 'Publish'}
                >
                  {guide.published ? '🙈 Unpublish' : '✅ Publish'}
                </button>
                <Link
                  href={`/guides/${guide.slug}`}
                  target="_blank"
                  className={pageStyles.viewBtn}
                  title="View guide"
                >
                  👁
                </Link>
                <button
                  onClick={() => deleteGuide(guide.id, guide.title)}
                  disabled={actionLoading === guide.id}
                  className={pageStyles.deleteBtn}
                  title="Delete"
                >
                  🗑
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}