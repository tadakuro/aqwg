'use client';

import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>AQWG</h1>
        <p className={styles.subtitle}>AdventureQuest Worlds Community Guides</p>
        <p className={styles.description}>
          The complete resource for classes, items, farming routes, and reputation grinds
        </p>
        
        <div className={styles.cta}>
          <Link href="/guides" className={styles.btnPrimary}>
            Browse Guides
          </Link>
          <Link href="/new-player" className={styles.btnSecondary}>
            New Player? Start Here
          </Link>
        </div>
      </div>

      <section className={styles.featured}>
        <h2>Quick Navigation</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Classes</h3>
            <p>Find guides for every class in the game</p>
            <Link href="/guides?category=class">Explore →</Link>
          </div>
          <div className={styles.card}>
            <h3>Items</h3>
            <p>Farming guides for rare weapons and armor</p>
            <Link href="/guides?category=item">Explore →</Link>
          </div>
          <div className={styles.card}>
            <h3>Reputation</h3>
            <p>Fastest ways to reach Rank 10</p>
            <Link href="/guides?category=reputation">Explore →</Link>
          </div>
          <div className={styles.card}>
            <h3>Farming</h3>
            <p>XP and Gold farming methods</p>
            <Link href="/guides?category=farming">Explore →</Link>
          </div>
        </div>
      </section>

      <section className={styles.announcements}>
        <h2>Latest Announcements</h2>
        <p style={{ color: '#888', marginBottom: '1rem' }}>
          Check back for game updates and patch notes
        </p>
        <Link href="/announcements" className={styles.viewAll}>
          View All Announcements →
        </Link>
      </section>

      <section className={styles.info}>
        <div className={styles.infoBox}>
          <h3>💡 New to AQW?</h3>
          <p>
            Start with our{' '}
            <Link href="/new-player">New Player Guide</Link>
            {' '}to learn game basics and progression tips.
          </p>
        </div>
        <div className={styles.infoBox}>
          <h3>📝 Have Feedback?</h3>
          <p>
            Found an issue? Leave feedback on any guide to help us improve content.
          </p>
        </div>
        <div className={styles.infoBox}>
          <h3>💬 Join Our Discord</h3>
          <p>
            Connect with the community and stay updated on new guides and changes.
          </p>
        </div>
      </section>
    </div>
  );
}
