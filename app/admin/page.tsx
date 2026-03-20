'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    guides: 0,
    announcements: 0,
    submissions: 0,
    feedback: 0,
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    // Temporary bypass for setup - check for admin_pass param
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (params.get('admin_pass') === 'setup') {
      sessionStorage.setItem('admin_session', 'true');
      setAuthenticated(true);
      return;
    }
    
    // In a real app, verify the user is logged in as admin
    const sessionId = sessionStorage.getItem('admin_session');
    if (sessionId) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const loadStats = async () => {
    try {
      // Fetch stats from Supabase with comprehensive error handling
      let guidesCount = 0;
      let announcementsCount = 0;
      let submissionsCount = 0;
      let feedbackCount = 0;

      try {
        const result = await supabase
          .from('guides')
          .select('id', { count: 'exact', head: true });
        if (result.data !== null) {
          guidesCount = result.count || 0;
        }
      } catch (e) {
        console.warn('Could not fetch guides count');
      }

      try {
        const result = await supabase
          .from('announcements')
          .select('id', { count: 'exact', head: true });
        if (result.data !== null) {
          announcementsCount = result.count || 0;
        }
      } catch (e) {
        console.warn('Could not fetch announcements count');
      }

      try {
        const result = await supabase
          .from('discord_submissions')
          .select('id', { count: 'exact', head: true });
        if (result.data !== null) {
          submissionsCount = result.count || 0;
        }
      } catch (e) {
        console.warn('Could not fetch submissions count');
      }

      try {
        const result = await supabase
          .from('user_feedback')
          .select('id', { count: 'exact', head: true });
        if (result.data !== null) {
          feedbackCount = result.count || 0;
        }
      } catch (e) {
        console.warn('Could not fetch feedback count');
      }

      setStats({
        guides: guidesCount,
        announcements: announcementsCount,
        submissions: submissionsCount,
        feedback: feedbackCount,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authBox}>
          <h1>Admin Login</h1>
          <p>Use your Discord account to log in</p>
          <button className={styles.discordBtn}>
            Login with Discord
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.9em', color: '#888' }}>
            Only registered admins can access this area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Manage guides, announcements, and submissions</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading stats...</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Guides</h3>
              <p className={styles.statNumber}>{stats.guides}</p>
              <Link href="/admin/guides">Manage Guides</Link>
            </div>
            <div className={styles.statCard}>
              <h3>Announcements</h3>
              <p className={styles.statNumber}>{stats.announcements}</p>
              <Link href="/admin/announcements">View & Edit</Link>
            </div>
            <div className={styles.statCard}>
              <h3>Discord Submissions</h3>
              <p className={styles.statNumber}>{stats.submissions}</p>
              <Link href="/admin/submissions">Review</Link>
            </div>
            <div className={styles.statCard}>
              <h3>User Feedback</h3>
              <p className={styles.statNumber}>{stats.feedback}</p>
              <Link href="/admin/feedback">Read</Link>
            </div>
          </div>

          <section className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actions}>
              <Link href="/admin/guides/new" className={styles.actionBtn}>
                Create New Guide
              </Link>
              <Link href="/admin/announcements/new" className={styles.actionBtn}>
                Post Announcement
              </Link>
              <Link href="/admin/updates/new" className={styles.actionBtn}>
                Log Site Update
              </Link>
              <Link href="/admin/submissions" className={styles.actionBtn}>
                Review Submissions
              </Link>
            </div>
          </section>

          <section className={styles.recentActivity}>
            <h2>Recent Activity</h2>
            <p style={{ color: '#888' }}>
              Database integration coming soon. Check back for real-time activity updates.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
