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

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      setAnnouncements(data.data || []);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
          {announcements.map((announcement) => (
            <article key={announcement.id} className={styles.announcement}>
              <div className={styles.meta}>
                <span className={`${styles.type} ${styles[announcement.type]}`}>
                  {announcement.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className={styles.date}>{formatDate(announcement.created_at)}</span>
              </div>
              <h2>{announcement.title}</h2>
              <p className={styles.content}>{announcement.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
