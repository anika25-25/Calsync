import { useEffect, useState } from 'react';
import { getAvailability, saveAvailability } from '../api';
import toast from 'react-hot-toast';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const defaultSchedule = DAYS.map((_, i) => ({
  dayOfWeek: i,
  isActive: i >= 1 && i <= 5,
  startTime: '09:00',
  endTime: '17:00',
}));

export default function Availability() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { setSchedule(defaultSchedule); return; }

    getAvailability(userId)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const newSchedule = [...defaultSchedule];
          res.data.forEach(d => {
            if (d.dayOfWeek !== undefined) {
              newSchedule[d.dayOfWeek] = { ...newSchedule[d.dayOfWeek], ...d };
            }
          });
          setSchedule(newSchedule);
        } else {
          setSchedule(defaultSchedule);
        }
      })
      .catch(() => setSchedule(defaultSchedule));
  }, []);

  if (!schedule || schedule.length !== 7) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text3)' }}>
      Loading...
    </div>
  );

  const toggle = (i) => setSchedule(s => s.map((d, idx) => idx === i ? { ...d, isActive: !d.isActive } : d));
  const setTime = (i, field, val) => setSchedule(s => s.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = parseInt(localStorage.getItem('userId'));
      if (!userId) { toast.error('User not found. Please log in again.'); setSaving(false); return; }

      const payload = schedule.map((day, index) => ({
        dayOfWeek: index,
        startTime: day.startTime,
        endTime: day.endTime,
        isActive: day.isActive,
        userId,
      }));

      await saveAvailability(payload);
      toast.success('Availability saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const selectStyle = {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17 }}>Availability</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Set your availability</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Define the hours you're open for meetings each week.</p>
        </div>

        {/* Schedule card */}
        <div className="card" style={{ maxWidth: 680, padding: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px', borderBottom: '1px solid var(--border)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 600 }}>Weekly schedule</h3>
            <select style={{ ...selectStyle, fontSize: 12, padding: '5px 10px' }}>
              <option>Asia/Kolkata (IST)</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>

          <div style={{ padding: '8px 24px' }}>
            {schedule.map((day, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 0',
                borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
              }}>
                {/* Checkbox + Day */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 140 }}>
                  <input
                    type="checkbox"
                    checked={day.isActive}
                    onChange={() => toggle(i)}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: 13, fontWeight: day.isActive ? 500 : 400,
                    color: day.isActive ? 'var(--text)' : 'var(--text3)',
                  }}>{DAYS[i]}</span>
                </div>

                {/* Time selectors or unavailable */}
                {day.isActive ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <select
                      value={day.startTime}
                      onChange={e => setTime(i, 'startTime', e.target.value)}
                      style={selectStyle}
                    >
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{ color: 'var(--text3)', fontSize: 12 }}>→</span>
                    <select
                      value={day.endTime}
                      onChange={e => setTime(i, 'endTime', e.target.value)}
                      style={selectStyle}
                    >
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text3)', fontSize: 13, fontStyle: 'italic' }}>Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 16, maxWidth: 680,
          padding: '12px 18px',
          background: 'rgba(108,99,255,0.06)',
          border: '1px solid rgba(108,99,255,0.18)',
          borderRadius: 10,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>
            Changes apply immediately to all your booking links.
          </span>
        </div>
      </div>
    </div>
  );
}
