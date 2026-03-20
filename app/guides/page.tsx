import { Suspense } from 'react';
import styles from './guides.module.css';
import GuidesContent from './guides-content';

export default function GuidesPage() {
  return (
    <div className={styles.guidesPage}>
      <div className={styles.header}>
        <h1>Guides & Resources</h1>
        <p>Complete database of AdventureQuest Worlds guides</p>
      </div>

      <Suspense fallback={<div className={styles.loading}>Loading guides...</div>}>
        <GuidesContent />
      </Suspense>
    </div>
  );
}