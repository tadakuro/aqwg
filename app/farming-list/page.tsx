'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface FarmingEntry {
  id: string;
  category: string;
  label: string;
  value: string;
  order: number;
}

export default function FarmingListPage() {
  const [entries, setEntries] = useState<FarmingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources/farming')
      .then((r) => r.json())
      .then((d) => setEntries(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Group by category
  const grouped = entries.reduce<Record<string, FarmingEntry[]>>((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    acc[e.category].push(e);
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Farming List</h1>
        <p>Quick reference for farming methods and locations</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No farming data yet. Check back soon!</p>
      ) : (
        <section className={styles.content}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className={styles.card}>
              <h2>{category}</h2>
              {items.map((item) => (
                <p key={item.id}>
                  <strong>{item.label}:</strong> {item.value}
                </p>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
