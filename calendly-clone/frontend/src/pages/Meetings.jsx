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

  const handleExport = () => {
    if (!meetings.length) {
      toast.error('No meetings to export');
      return;
    }

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

  const StatusBadge = ({ status }) => {
    const map = {
      confirmed: { cls: 'badge-green', label: 'Confirmed' },
      pending:   { cls: 'badge-amber', label: 'Pending' },
      cancelled: { cls: 'badge-red',   label: 'Cancelled' },
      completed: { cls: 'badge-blue',  label: 'Completed' },
    };
    const s = map[status?.toLowerCase()] || map.confirmed;
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
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
        <button className="btn btn-secondary btn-sm" onClick={handleExpor