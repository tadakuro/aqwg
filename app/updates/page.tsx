'use client';

import { useEffect, useState } from 'react';
import styles from './updates.module.css';

interface SiteUpdate {
  id: string;
  version: string;
  title: string;
  changes: string[];
  created_at: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources/updates')
      .then((r) => r.json())
      .then((d) => setUpdates(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Site Updates</h1>
        <p>Track changes and improvements to AQWG</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      ) : updates.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No updates logged yet.</p>
      ) : (
        <section className={styles.timeline}>
          {updates.map((update) => (
            <div key={update.id} className={styles.update}>
              <div className={styles.version}>{update.version}</div>
              <div className={styles.date}>{formatDate(update.created_at)}</div>
              <h3>{update.title}</h3>
              <ul>
                {update.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
