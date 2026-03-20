'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './layout.module.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    const sessionId = sessionStorage.getItem('admin_session');
    setIsAdmin(!!sessionId);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AQWG - AdventureQuest Worlds Guides</title>
        <meta
          name="description"
          content="Community guides for AdventureQuest Worlds - Classes, Items, Farming, Reputations"
        />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
            color: #e0e0e0;
            line-height: 1.6;
          }
          
          a {
            color: #4db8ff;
            text-decoration: none;
            transition: color 0.2s;
          }
          
          a:hover {
            color: #7ec8ff;
          }
        `}</style>
      </head>
      <body>
        <div className={styles.layout}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.logo}>
                AQWG
              </Link>
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <nav className={styles.headerNav}>
                <Link href="/">Home</Link>
                <Link href="/guides">Guides</Link>
                <Link href="/announcements">Announcements</Link>
                <Link href="/updates">Site Updates</Link>
              </nav>
            </div>
          </header>

          <div className={styles.container}>
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
              <nav className={styles.sidebarNav}>
                <h3>Categories</h3>
                <Link href="/guides?category=class">Classes</Link>
                <Link href="/guides?category=item">Items</Link>
                <Link href="/guides?category=reputation">Reputation</Link>
                <Link href="/guides?category=farming">Farming</Link>
                <Link href="/guides?category=enhancement">Enhancements</Link>
                
                <hr />
                
                <h3>Resources</h3>
                <Link href="/new-player">New Player Guide</Link>
                <Link href="/farming-list">Farming List</Link>
                <Link href="/acronyms">Acronyms</Link>
                
                {isAdmin && (
                  <>
                    <hr />
                    <h3>Admin</h3>
                    <Link href="/admin">Dashboard</Link>
                  </>
                )}
              </nav>
            </aside>

            <main className={styles.main}>
              {children}
            </main>
          </div>

          <footer className={styles.footer}>
            <p>AQWG - Community Guides for AdventureQuest Worlds</p>
            <p>
              <Link href="https://discord.gg/your-server" target="_blank">
                Join Discord
              </Link>
            </p>
            <p style={{ fontSize: '0.9em', marginTop: '1rem', opacity: 0.7 }}>
              This is a community resource. Not affiliated with Artix Entertainment.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}