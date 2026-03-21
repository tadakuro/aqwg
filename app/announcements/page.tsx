'use client';

import { useEffect, useState } from 'react';
import styles from './announcements.module.css';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((d) => setAnnouncements(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.announcementsPage}>
      <div className={styles.header}>
        <h1>Game Announcements</h1>
        <p>Latest updates, events, and maintenance notices</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className={styles.empty}>
          <p>No announcements yet. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {announcements.map((ann) => {
            const isExpanded = expanded.has(ann.id);
            return (
              <article key={ann.id} className={styles.announcement}>
                <div className={styles.meta}>
                  <span className={`${styles.type} ${styles[ann.type]}`}>
                    {ann.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={styles.date}>{formatDate(ann.created_at)}</span>
                </div>
                <h2>{ann.title}</h2>
                <div
                  className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}
                  dangerouslySetInnerHTML={{ __html: ann.content }}
                />
                <button className={styles.readMoreBtn} onClick={() => toggleExpanded(ann.id)}>
                  {isExpanded ? '▲ Show Less' : '▼ Read More'}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
