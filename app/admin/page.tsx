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
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    checkAuth();
    setTimeout(() => {
      loadStats();
    }, 500);
  }, []);

  const checkAuth = async () => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const adminPass = params.get('admin_pass');
    
    if (adminPass === 'aqwgpub!11!') {
      sessionStorage.setItem('admin_session', 'true');
      setAuthenticated(true);
      return;
    }
    
    const sessionId = sessionStorage.getItem('admin_session');
    if (sessionId) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const handleLogin = () => {
    if (password === 'aqwgpub!11!') {
      sessionStorage.setItem('admin_session', 'true');
      setAuthenticated(true);
    } else {
      setLoginError('Invalid password');
    }
  };

  const loadStats = async () => {
    try {
      setStats({
        guides: 0,
        announcements: 0,
        submissions: 0,
        feedback: 0,
      });
      
      let guidesCount = 0;
      let announcementsCount = 0;
      let submissionsCount = 0;
      let feedbackCount = 0;

      try {
        const result = await supabase
          .from('guides')
          .select('id', { count: 'exact', head: true });
        if (result && !result.error) {
          guidesCount = result.count || 0;
        }
      } catch (e) {
        // Silently fail
      }

      try {
        const result = await supabase
          .from('announcements')
          .select('id', { count: 'exact', head: true });
        if (result && !result.error) {
          announcementsCount = result.count || 0;
        }
      } catch (e) {
        // Silently fail
      }

      try {
        const result = await supabase
          .from('discord_submissions')
          .select('id', { count: 'exact', head: true });
        if (result && !result.error) {
          submissionsCount = result.count || 0;
        }
      } catch (e) {
        // Silently fail
      }

      try {
        const result = await supabase
          .from('user_feedback')
          .select('id', { count: 'exact', head: true });
        if (result && !result.error) {
          feedbackCount = result.count || 0;
        }
      } catch (e) {
        // Silently fail
      }

      setStats({
        guides: guidesCount,
        announcements: announcementsCount,
        submissions: submissionsCount,
        feedback: feedbackCount,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authBox}>
          <h1>Admin Login</h1>
          <p>Enter admin password</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              border: '1px solid #4db8ff',
              background: '#16213e',
              color: '#e0e0e0',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleLogin}
            className={styles.discordBtn}
            style={{ width: '100%' }}
          >
            Login
          </button>
          {loginError && (
            <p style={{ marginTop: '1rem', color: '#ff6b6b' }}>
              ❌ {loginError}
            </p>
          )}
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
              <Link href="/admin/announcements" className={styles.actionBtn}>
                Post Announcement
              </Link>
              <Link href="/admin/updates" className={styles.actionBtn}>
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
