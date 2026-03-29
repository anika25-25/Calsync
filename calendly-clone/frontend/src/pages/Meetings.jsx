import { useEffect, useState } from 'react';
import { getUpcomingMeetings, getPastMeetings, cancelMeeting } from '../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Meetings() {
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUpcomingMeetings().then(r => setUpcoming(r.data)).catch(() => {}),
      getPastMeetings().then(r => setPast(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this meeting?')) return;
    try {
      await cancelMeeting(id);
      setUpcoming(u => u.filter(m => m.id !== id));
      toast.success('Meeting cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const meetings = tab === 'upcoming' ? upcoming : past;

  const StatusBadge = ({ status }) => {
    const map = {
      confirmed:  { cls: 'badge-green',  label: 'Confirmed' },
      pending:    { cls: 'badge-amber',  label: 'Pending' },
      cancelled:  { cls: 'badge-red',    label: 'Cancelled' },
      completed:  { cls: 'badge-blue',   label: 'Completed' },
    };
    const s = map[status?.toLowerCase()] || map.confirmed;
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };
const handleExport = () => {
  const data = meetings.map(m => ({
    Event: m.EventType?.name || 'Meeting',
    Date: format(new Date(m.startTime), 'EEEE, MMMM d, yyyy'),
    Time: format(new Date(m.startTime), 'h:mm a'),
    Invitee: m.inviteeName,
    Email: m.inviteeEmail,
    Status: tab === 'past' ? (m.status || 'completed') : 'confirmed',
  }));

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meetings-${tab}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17 }}>Meetings</span>
        <button className="btn btn-secondary btn-sm">Export</button>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Your meetings</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>All scheduled and past meetings in one place.</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2, background: 'var(--bg3)',
          padding: 3, borderRadius: 10, width: 'fit-content', marginBottom: 24,
        }}>
          {['upcoming', 'past'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 20px', borderRadius: 8, border: 'none',
              background: tab === t ? 'var(--bg2)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--text2)',
              fontWeight: tab === t ? 500 : 400,
              fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)',
              textTransform: 'capitalize', transition: 'all 0.15s',
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ color: 'var(--text3)', fontSize: 14 }}>Loading...</div>
        ) : meetings.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text3)', background: 'var(--bg2)',
            border: '1px solid var(--border)', borderRadius: 12,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 14 }}>No {tab} meetings yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meetings.map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 20px',
                opacity: tab === 'past' ? 0.75 : 1,
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* Date block */}
                <div style={{ textAlign: 'center', minWidth: 52 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text3)' }}>
                    {format(new Date(m.startTime), 'EEE')}
                  </div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, lineHeight: 1.1, color: 'var(--text)' }}>
                    {format(new Date(m.startTime), 'd')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    {format(new Date(m.startTime), 'MMM')}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 44, background: 'var(--border)', flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    {m.EventType?.name || 'Meeting'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{format(new Date(m.startTime), 'h:mm a')}</span>
                    <span>·</span>
                    <span>{m.inviteeName}</span>
                    {m.inviteeEmail && <><span>·</span><span>{m.inviteeEmail}</span></>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={tab === 'past' ? (m.status || 'completed') : 'confirmed'} />
                  {tab === 'upcoming' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(m.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
