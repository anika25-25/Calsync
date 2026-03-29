import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);
      localStorage.setItem('name', data.name || name);
      localStorage.setItem('userId', data.id);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Left — hero panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 60%, #1a1224 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '5%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 420 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent3)' }} />
            <span style={{ fontSize: 12, color: 'var(--accent2)', fontWeight: 500 }}>Free to use — no credit card</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 42, fontWeight: 700,
            lineHeight: 1.15, marginBottom: 16,
            background: 'linear-gradient(135deg, #f0f0f8, var(--accent2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Schedule smarter.<br />Meet better.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            A professional scheduling platform for people who value their time.
          </p>

          {/* Feature list */}
          {[
            { icon: '📅', title: 'Smart scheduling', desc: 'Share your link, skip the back-and-forth emails' },
            { icon: '⏰', title: 'Custom availability', desc: 'Define exactly when you want to meet' },
            { icon: '👥', title: 'Team ready', desc: 'Manage all your meetings from one dashboard' },
          ].map(f => (
            <div key={f.title} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 10, marginBottom: 10, textAlign: 'left',
            }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{
        width: 460,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'var(--bg2)',
        borderLeft: '1px solid var(--border)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18 }}>
            Cal<span style={{ color: 'var(--accent2)' }}>sync</span>
          </span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
          Welcome back
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>
          Enter your name to get started — no password needed.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.7px', textTransform: 'uppercase',
            color: 'var(--text3)', marginBottom: 8,
          }}>Your name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Anika Sharma"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !name.trim()}
          style={{
            width: '100%', padding: '12px',
            background: loading ? 'var(--bg4)' : 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 8,
            fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', marginTop: 4, letterSpacing: '0.2px',
          }}
        >
          {loading ? 'Signing in...' : 'Continue →'}
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 24 }}>
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
