'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import pageStyles from './feedback.module.css';

interface Feedback {
  id: string;
  guide_id: string;
  user_name: string;
  user_email?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  guides?: { title: string; slug: string };
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_feedback')
      .select('*, guides(title, slug)')
      .order('created_at', { ascending: false });
    setFeedback(data || []);
    setLoading(false);
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    setDeleting(id);
    const { error } = await supabase.from('user_feedback').delete().eq('id', id);
    if (!error) setFeedback((prev) => prev.filter((f) => f.id !== id));
    setDeleting(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const stars = (n: number) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
      : '—';

  const filtered =
    filter === 'all' ? feedback : feedback.filter((f) => f.rating === Number(filter));

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>User Feedback</h1>
        <p>Community ratings and comments on guides</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <div className={pageStyles.summary}>
          <span>{feedback.length} total</span>
          <span>Avg rating: {avgRating}/5</span>
        </div>
      </div>

      <div className={pageStyles.filters}>
        {(['all', '5', '4', '3', '2', '1'] as const).map((v) => (
          <button
            key={v}
            className={`${pageStyles.filterBtn} ${filter === v ? pageStyles.active : ''}`}
            onClick={() => setFilter(v)}
          >
            {v === 'all' ? 'All' : `${v}★`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading feedback...</div>
      ) : filtered.length === 0 ? (
        <div className={pageStyles.empty}>
          <p>No feedback {filter !== 'all' ? `with ${filter} stars` : 'yet'}.</p>
        </div>
      ) : (
        <div className={pageStyles.list}>
          {filtered.map((item) => (
            <div key={item.id} className={pageStyles.card}>
              <div className={pageStyles.cardTop}>
                <div>
                  <span className={pageStyles.stars}>{stars(item.rating)}</span>
                  <span className={pageStyles.username}>{item.user_name}</span>
                  {item.user_email && (
                    <span className={pageStyles.email}>{item.user_email}</span>
                  )}
                </div>
                <span className={pageStyles.date}>{formatDate(item.created_at)}</span>
              </div>

              {item.guides && (
                <div className={pageStyles.guideRef}>
                  Guide:{' '}
                  <Link href={`/guides/${item.guides.slug}`} target="_blank">
                    {item.guides.title}
                  </Link>
                </div>
              )}

              <p className={pageStyles.comment}>{item.comment}</p>

              <div className={pageStyles.cardActions}>
                <span className={pageStyles.helpful}>
                  👍 {item.helpful_count} found helpful
                </span>
                <button
                  onClick={() => deleteFeedback(item.id)}
                  disabled={deleting === item.id}
                  className={pageStyles.deleteBtn}
                >
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
