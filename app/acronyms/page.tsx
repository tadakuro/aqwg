'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Acronym {
  id: string;
  category: string;
  abbreviation: string;
  full_name: string;
}

export default function AcronymsPage() {
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources/acronyms')
      .then((r) => r.json())
      .then((d) => setAcronyms(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = acronyms.reduce<Record<string, Acronym[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Game Acronyms</h1>
        <p>Common abbreviations used in the AQW community</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No acronyms yet. Check back soon!</p>
      ) : (
        <div className={styles.acronymsList}>
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className={styles.section}>
              <h2>{category}</h2>
              <table className={styles.table}>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.abbr}>{item.abbreviation}</td>
                      <td className={styles.full}>{item.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
