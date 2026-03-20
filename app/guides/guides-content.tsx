'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './guides.module.css';

interface Guide {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
}

export default function GuidesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive category directly from the URL — no separate state.
  // Sidebar links and filter buttons stay in sync automatically.
  const selectedCategory = searchParams.get('category') || 'all';

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      try {
        const params =
          selectedCategory === 'all' ? '' : `?category=${selectedCategory}`;
        const response = await fetch(`/api/guides${params}`);
        const data = await response.json();
        setGuides(data.data || []);
      } catch (error) {
        console.error('Failed to load guides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, [selectedCategory]);

  // Push a new URL so the address bar updates and the back button works.
  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      router.push('/guides');
    } else {
      router.push(`/guides?category=${value}`);
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
              onClick={() => handleCategoryChange(cat.value)}
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
