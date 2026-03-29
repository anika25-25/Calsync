import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

// ── Inline theme hook ──────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return { theme, toggleTheme };
}

// ── Icons ──────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

// ── Nav items ──────────────────────────────────────────────────
const NAV = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: '/event-types',
    label: 'Event Types',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>
    ),
  },
  {
    to: '/availability',
    label: 'Availability',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    to: '/meetings',
    label: 'Meetings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
];

// ── Layout ─────────────────────────────────────────────────────
export default function Layout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const name = localStorage.getItem('name') || 'User';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17 }}>
              Cal<span style={{ color: 'var(--accent2)' }}>sync</span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '14px 12px', flex: 1 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: 'var(--text3)',
            padding: '0 8px', marginBottom: 6, marginTop: 8,
          }}>Main</div>

          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8,
                color: isActive ? 'var(--accent2)' : 'var(--text2)',
                background: isActive ? 'rgba(108,99,255,0.12)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                fontSize: 13, marginBottom: 2,
                transition: 'all 0.15s', textDecoration: 'none',
                border: 'none',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.background.includes('108')) {
                  e.currentTarget.style.background = 'var(--bg3)';
                  e.currentTarget.style.color = 'var(--text)';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.color = 'var(--text2)';
                }
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12, color: 'white',
              flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Free plan</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'none', border: 'none', color: 'var(--text3)',
                cursor: 'pointer', padding: 4, borderRadius: 4, flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>

        {/* Top bar with theme toggle in top-right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '10px 24px',
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}>
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              border: '1px solid var(--border2)',
              background: 'var(--bg3)',
              color: 'var(--text2)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg4)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg3)';
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.borderColor = 'var(--border2)';
            }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
