'use client';

export default function DebugPage() {
  return (
    <div style={{
      padding: '2rem',
      color: '#e0e0e0',
      background: '#0a0e27',
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <h1>🔍 Environment Variables Debug</h1>
      
      <div style={{ marginTop: '2rem', background: '#16213e', padding: '1rem', borderRadius: '4px' }}>
        <h2>Supabase Configuration:</h2>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong><br/>
          {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
            <span style={{ color: '#4db8ff' }}>✅ {process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
          ) : (
            <span style={{ color: '#ff6b6b' }}>❌ NOT SET</span>
          )}
        </p>
        
        <p style={{ marginTop: '1rem' }}>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong><br/>
          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
            <span style={{ color: '#4db8ff' }}>✅ {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...</span>
          ) : (
            <span style={{ color: '#ff6b6b' }}>❌ NOT SET</span>
          )}
        </p>

        <p style={{ marginTop: '1rem' }}>
          <strong>SUPABASE_SERVICE_ROLE_KEY:</strong><br/>
          {process.env.SUPABASE_SERVICE_ROLE_KEY ? (
            <span style={{ color: '#4db8ff' }}>✅ SET (hidden for security)</span>
          ) : (
            <span style={{ color: '#ff6b6b' }}>❌ NOT SET</span>
          )}
        </p>
      </div>

      <div style={{ marginTop: '2rem', background: '#16213e', padding: '1rem', borderRadius: '4px' }}>
        <h2>Discord Configuration:</h2>
        <p>
          <strong>DISCORD_WEBHOOK_URL:</strong><br/>
          {process.env.DISCORD_WEBHOOK_URL ? (
            <span style={{ color: '#4db8ff' }}>✅ SET</span>
          ) : (
            <span style={{ color: '#ff6b6b' }}>❌ NOT SET</span>
          )}
        </p>
      </div>

      <div style={{ marginTop: '2rem', background: '#16213e', padding: '1rem', borderRadius: '4px' }}>
        <h2>Troubleshooting:</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>If any variable shows ❌ NOT SET, you need to add it to Vercel Environment Variables</li>
          <li>After adding variables, you must <strong>REDEPLOY</strong> the project</li>
          <li>Go to Vercel Deployments &gt; Latest &gt; Click Redeploy button</li>
          <li>Wait 2-3 minutes for the deployment to finish</li>
          <li>Then refresh this page - variables should show ✅</li>
        </ul>
      </div>
    </div>
  );
}