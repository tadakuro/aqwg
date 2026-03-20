'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './guides.module.css';

interface Guide {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
}

export default function GuidesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  useEffect(() => {
    loadGuides();
  }, [selectedCategory]);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const params = selectedCategory === 'all' ? '' : `?category=${selectedCategory}`;
      const response = await fetch(`/api/guides${params}`);
      const data = await response.json();
      setGuides(data.data || []);
    } catch (error) {
      console.error('Failed to load guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Guides' },
    { value: 'class', label: 'Classes' },
    { value: 'item', label: 'Items' },
    { value: 'reputation', label: 'Reputation' },
    { value: 'farming', label: 'Farming' },
    { value: 'enhancement', label: 'Enhancements' },
  ];

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.categoryFilter}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${
                selectedCategory === cat.value ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading guides...</div>
      ) : guides.length === 0 ? (
        <div className={styles.empty}>
          <p>No guides found in this category.</p>
          <Link href="/">← Back to Home</Link>
        </div>
      ) : (
        <div className={styles.guidesList}>
          {guides.map((guide) => (
            <div key={guide.id} className={styles.guideCard}>
              <div className={styles.guideHeader}>
                <h3>{guide.title}</h3>
                <span className={styles.category}>{guide.category}</span>
              </div>
              <p className={styles.description}>{guide.description}</p>
              <Link href={`/guides/${guide.slug}`} className={styles.readMore}>
                Read Guide →
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}