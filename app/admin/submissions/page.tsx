'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import pageStyles from './submissions.module.css';

interface Submission {
  id: string;
  user_id: string;
  username: string;
  message: string;
  message_link: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('discord_submissions')
      .select()
      .order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Submission['status']) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('discord_submissions')
      .update({ status })
      .eq('id', id);
    if (!error)
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    setActionLoading(null);
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    setActionLoading(id);
    const { error } = await supabase.from('discord_submissions').delete().eq('id', id);
    if (!error) setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setActionLoading(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Discord Submissions</h1>
        <p>Review community-submitted guide updates</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <span className={pageStyles.pendingBadge}>
          {counts.pending} pending review
        </span>
      </div>

      <div className={pageStyles.filters}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((v) => (
          <button
            key={v}
            className={`${pageStyles.filterBtn} ${pageStyles[v]} ${filter === v ? pageStyles.active : ''}`}
            onClick={() => setFilter(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} ({counts[v]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className={pageStyles.empty}>
          <p>No {filter !== 'all' ? filter : ''} submissions.</p>
        </div>
      ) : (
        <div className={pageStyles.list}>
          {filtered.map((sub) => (
            <div key={sub.id} className={`${pageStyles.card} ${pageStyles[sub.status]}`}>
              <div className={pageStyles.cardTop}>
                <div className={pageStyles.userInfo}>
                  <span className={pageStyles.username}>@{sub.username}</span>
                  <span className={pageStyles.userId}>ID: {sub.user_id}</span>
                </div>
                <div className={pageStyles.cardRight}>
                  <span className={`${pageStyles.statusBadge} ${pageStyles[sub.status]}`}>
                    {sub.status}
                  </span>
                  <span className={pageStyles.date}>{formatDate(sub.created_at)}</span>
                </div>
              </div>

              <p className={pageStyles.message}>{sub.message}</p>

              {sub.message_link && (
                <a
                  href={sub.message_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pageStyles.discordLink}
                >
                  View in Discord →
                </a>
              )}

              <div className={pageStyles.cardActions}>
                {sub.status !== 'approved' && (
                  <button
                    onClick={() => updateStatus(sub.id, 'approved')}
                    disabled={actionLoading === sub.id}
                    className={pageStyles.approveBtn}
                  >
                    ✅ Approve
                  </button>
                )}
                {sub.status !== 'rejected' && (
                  <button
                    onClick={() => updateStatus(sub.id, 'rejected')}
                    disabled={actionLoading === sub.id}
                    className={pageStyles.rejectBtn}
                  >
                    ✕ Reject
                  </button>
                )}
                {sub.status === 'pending' && (
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    disabled={actionLoading === sub.id}
                    className={pageStyles.deleteBtn}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
