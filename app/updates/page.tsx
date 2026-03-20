'use client';

import styles from './updates.module.css';

export default function UpdatesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Site Updates</h1>
        <p>Track changes and improvements to AQWG</p>
      </div>

      <section className={styles.timeline}>
        <div className={styles.update}>
          <div className={styles.version}>v1.0.0</div>
          <div className={styles.date}>March 20, 2026</div>
          <h3>Site Launch</h3>
          <ul>
            <li>Initial AQWG revival launch</li>
            <li>Admin dashboard with guide editor</li>
            <li>Discord integration</li>
            <li>User feedback system</li>
            <li>Announcements section</li>
          </ul>
        </div>

        <p className={styles.empty}>
          More updates coming as community contributes!
        </p>
      </section>
    </div>
  );
}
