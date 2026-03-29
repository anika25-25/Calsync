import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEventTypes, getUpcomingMeetings, getStats } from '../api';
import { format } from 'date-fns';

const ACCENT_COLORS = ['#6c63ff', '#4ade80', '#fbbf24', '#f472b6'];

export default function Dashboard() {
  const name = localStorage.getItem('name') || 'User';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [eventTypes, setEventTypes] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    getEventTypes().then(r => setEventTypes(r.data)).catch(() => {});
    getUpcomingMeetings().then(r => setUpcoming(r.data)).catch(() => {});
    getStats().then(r => setStatsData(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Total Meetings', value: statsData?.total ?? 0, color: '#6c63ff', bg: 'rgba(108,99,255,0.08)', top: 'linear-gradient(90deg,#6c63ff,#a78bfa)' },
    { label: 'Upcoming',       value: statsData?.upcoming ?? 0, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', top: 'linear-gradient(90deg,#4ade80,#22d3ee)' },
    { label: 'Past',           value: statsData?.past ?? 0,     color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', top: 'linear-gradient(90deg,#fbbf24,#f97316)' },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17 }}>Dashboard</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">Share link</button>
          <Link to="/event-types" className="btn btn-primary btn-sm">+ New event</Link>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            {greeting}, {name} 👋
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Here's an overview of your scheduling activity.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.top }} />
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Popular event */}
        {statsData?.popular && (
          <div style={{
            background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 12, padding: '14px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 20 }}>🏆</div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, marginBottom: 2 }}>Most popular event</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {statsData.popular.EventType?.name}
                <span style={{ color: 'var(--text3)', fontWeight: 400, marginLeft: 6 }}>
                  ({statsData.popular.dataValues?.count} bookings)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Booking links */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 600 }}>Your Booking Links</h2>
              <Link to="/event-types" style={{ fontSize: 12, color: 'var(--accent2)' }}>Manage →</Link>
            </div>
            <div style={{ padding: '8px 20px' }}>
              {eventTypes.length === 0 && (
                <p style={{ color: 'var(--text3)', fontSize: 13, padding: '12px 0' }}>No event types yet.</p>
              )}
              {eventTypes.map((et, idx) => (
                <div key={et.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: et.color || ACCENT_COLORS[idx % 4], flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{et.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{et.duration} min</div>
                    </div>
                  </div>
                  <Link to={`/${localStorage.getItem('name')?.toLowerCase()}/${et.slug}`} target="_blank"
                    style={{ fontSize: 12, color: 'var(--accent2)', padding: '4px 10px', background: 'rgba(108,99,255,0.1)', borderRadius: 6 }}>
                    Share →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming meetings */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 600 }}>Upcoming Meetings</h2>
              <Link to="/meetings" style={{ fontSize: 12, color: 'var(--accent2)' }}>View all →</Link>
            </div>
            <div style={{ padding: '8px 20px' }}>
              {upcoming.length === 0 && (
                <p style={{ color: 'var(--text3)', fontSize: 13, padding: '12px 0' }}>No upcoming meetings.</p>
              )}
              {upcoming.slice(0, 4).map((m, idx) => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: m.EventType?.color || ACCENT_COLORS[idx % 4],
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{format(new Date(m.startTime), 'd')}</div>
                    <div style={{ fontSize: 10 }}>{format(new Date(m.startTime), 'MMM')}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{m.inviteeName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {format(new Date(m.startTime), 'h:mm a')} · {m.EventType?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
