'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#e0e0e0'
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#ff6b6b' }}>Oops! Something went wrong</h2>
      <p style={{ marginBottom: '2rem', color: '#999' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4db8ff',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        Try again
      </button>
    </div>
  );
}