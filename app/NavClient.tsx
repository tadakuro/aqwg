'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function NavClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar whenever the route changes (user tapped a link)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Toggle the sidebar's CSS class via the DOM so the server-rendered
  // <aside> in layout.tsx doesn't need to be a client component.
  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (sidebarOpen) {
      sidebar.classList.add(styles.open);
    } else {
      sidebar.classList.remove(styles.open);
    }
  }, [sidebarOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          AQWG
        </Link>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <nav className={styles.headerNav}>
          <Link href="/">Home</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/announcements">Announcements</Link>
          <Link href="/updates">Site Updates</Link>
        </nav>
      </div>
    </header>
  );
}
