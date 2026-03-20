'use client';

import styles from './page.module.css';

export default function FarmingListPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Farming List</h1>
        <p>Quick reference for farming methods and locations</p>
      </div>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>XP Farming</h2>
          <p>Level 1-49: /firewar (Fire Dragons)</p>
          <p>Level 50-74: /icestormarena (Icy Winds)</p>
          <p>Level 75-100: /icestormarena (Frost Spirits)</p>
        </div>

        <div className={styles.card}>
          <h2>Item Farming</h2>
          <p>See individual guide pages for detailed item farming routes.</p>
          <p>Most rare items require specific quest chains or daily farming.</p>
        </div>

        <div className={styles.card}>
          <h2>Reputation Farming</h2>
          <p>Each faction has unique farming locations. Check individual reputation guides for details.</p>
        </div>
      </section>

      <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
        More farming data coming soon as guides are added!
      </p>
    </div>
  );
}
