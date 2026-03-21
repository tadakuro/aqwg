'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

interface Card {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

const COLLAPSED_HEIGHT = 120;

function CardItem({ card }: { card: Card }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bodyRef.current) return;
    // Check after a short delay to let dangerouslySetInnerHTML paint
    const timer = setTimeout(() => {
      if (bodyRef.current) {
        setOverflows(bodyRef.current.scrollHeight > COLLAPSED_HEIGHT);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [card.content]);

  return (
    <div className={styles.card}>
      <h2>{card.title}</h2>
      <div
        ref={bodyRef}
        className={styles.cardBody}
        style={{
          maxHeight: expanded ? 'none' : `${COLLAPSED_HEIGHT}px`,
          overflow: 'hidden',
          position: 'relative',
        }}
        dangerouslySetInnerHTML={{ __html: card.content }}
      />
      {!expanded && overflows && (
        <div className={styles.fadeOut} />
      )}
      {overflows && (
        <button
          className={styles.readMoreBtn}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '▲ Show Less' : '▼ Read More'}
        </button>
      )}
    </div>
  );
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
            <CardItem key={card.id} card={card} />
          ))}
        </section>
      )}
    </div>
  );
}
