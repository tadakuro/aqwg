'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Card {
  id: string;
  title: string;
  content: string;
  order: number;
}

export default function NewPlayerPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources/new-player')
      .then((r) => r.json())
      .then((d) => setCards(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>New Player Guide</h1>
        <p>Everything you need to know to get started in AdventureQuest Worlds</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      ) : cards.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No content yet. Check back soon!</p>
      ) : (
        <section className={styles.content}>
          {cards.map((card) => (
            <div key={card.id} className={styles.card}>
              <h2>{card.title}</h2>
              <div
                className={styles.cardBody}
                dangerouslySetInnerHTML={{ __html: card.content }}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
