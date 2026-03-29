import { useLocation, Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const booking = state?.booking;
  const eventType = state?.eventType;

  if (!booking) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:12, background:'var(--bg)' }}>
      <p style={{ color: 'var(--text2)' }}>No booking data found.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );

  const details = [
    { label: 'Event',   value: eventType?.name || booking.EventType?.name },
    { label: 'Date',    value: format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy') },
    { label: 'Time',    value: `${format(new Date(booking.startTime), 'h:mm a')} – ${format(new Date(booking.endTime), 'h:mm a')}` },
    { label: 'Invitee', value: booking.inviteeName },
    { label: 'Email',   value: booking.inviteeEmail },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: 'var(--bg2)', borderRadius: 16, padding: '48px 40px',
        maxWidth: 460, width: '100%', textAlign: 'center',
        border: '1px solid var(--border)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(74,222,128,0.15)', border: '2px solid #4ade80',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 34, color: '#4ade80',
        }}>✓</div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>You're scheduled!</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 32, lineHeight: 1.6 }}>
          A calendar invitation has been sent to <strong style={{ color: 'var(--text)' }}>{booking.inviteeEmail}</strong>.
        </p>

        <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '4px 20px', marginBottom: 28, textAlign: 'left', border: '1px solid var(--border)' }}>
          {details.map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border)', gap: 12,
            }}>
              <span style={{ color: 'var(--text3)', fontSize: 13, flexShrink: 0 }}>{label}</span>
              <span style={{ fontWeight: 500, fontSize: 14, textAlign: 'right', color: 'var(--text)' }}>{value}</span>
            </div>
          ))}
        </div>

        <Link to="/dashboard" className="btn btn-primary"
          style={{ justifyContent: 'center', width: '100%', padding: '13px', fontSize: 15, borderRadius: 8 }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}