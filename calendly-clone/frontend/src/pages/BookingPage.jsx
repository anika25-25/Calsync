import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay,
} from 'date-fns';
import { getEventTypeBySlug, getSlots, createBooking } from '../api';

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [eventType, setEventType] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState('calendar');
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getEventTypeBySlug(slug).then(r => setEventType(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!selectedDate || !eventType) return;
    setSlotsLoading(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    getSlots(slug, dateStr)
      .then(r => { setSlots(r.data.slots || []); setSuggestions(r.data.suggestions || []); })
      .catch(() => { setSlots([]); setSuggestions([]); })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, slug, eventType]);

  const calendarDays = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const firstDayOffset = calendarDays[0].getDay();

  const handleBook = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true); setError('');
    try {
      const result = await createBooking({
        slug, inviteeName: form.name, inviteeEmail: form.email,
        startTime: selectedSlot.startTime, notes: form.notes,
      });
      navigate('/booking/confirmed', { state: { booking: result.data, eventType } });
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (notFound) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
      <div style={{ fontSize: 48 }}>😕</div>
      <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>Event not found</h2>
      <p style={{ color: 'var(--text2)' }}>This booking link doesn't exist or has been removed.</p>
    </div>
  );

  if (!eventType) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--text3)' }}>Loading...</p>
    </div>
  );

  const inputStyle = {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '10px 14px', borderRadius: 8,
    fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)',
        display: 'flex', overflow: 'hidden',
        maxWidth: 880, width: '100%', minHeight: 540,
      }}>

        {/* Left panel */}
        <div style={{ width: 280, padding: '36px 28px', borderRight: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, marginBottom: 16,
          }}>
            {(localStorage.getItem('name') || 'A')[0].toUpperCase()}
          </div>
          <div style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>
            {localStorage.getItem('name') || 'User'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
            {eventType.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: 13, marginBottom: 8 }}>
            <span>⏱</span> {eventType.duration} minutes
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: 13 }}>
            <span>🌐</span> Web conferencing
          </div>
          {eventType.description && (
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 20, lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              {eventType.description}
            </p>
          )}
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: '36px 32px', overflowY: 'auto' }}>
          {step === 'calendar' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17, marginBottom: 24 }}>Select a date & time</h2>

              {/* Month nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} style={{
                  border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text)',
                  width: 32, height: 32, borderRadius: 6, cursor: 'pointer', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>‹</button>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15 }}>
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} style={{
                  border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text)',
                  width: 32, height: 32, borderRadius: 6, cursor: 'pointer', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>›</button>
              </div>

              {/* Calendar grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 24 }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
                ))}
                {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`pad${i}`} />)}
                {calendarDays.map(day => {
                  const isPast = isBefore(day, startOfDay(new Date()));
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isTodayDay = isToday(day);
                  return (
                    <button key={day.toISOString()} disabled={isPast}
                      onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                      style={{
                        border: isSelected ? '2px solid var(--accent)' : isTodayDay ? '1px solid var(--accent)' : '1px solid transparent',
                        borderRadius: 8, width: '100%', aspectRatio: '1',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        color: isSelected ? '#fff' : isPast ? 'var(--text3)' : 'var(--text)',
                        fontWeight: isTodayDay ? 600 : 400, fontSize: 13, transition: 'all 0.1s',
                        fontFamily: 'var(--font-body)',
                      }}>
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>

              {/* Slots */}
              {selectedDate && (
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                  {slotsLoading && <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading slots...</p>}
                  {!slotsLoading && slots.length === 0 && (
                    <p style={{ color: 'var(--text3)', fontSize: 13 }}>No available slots on this day.</p>
                  )}
                  {!slotsLoading && slots.length === 0 && suggestions.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text2)' }}>Next available slots</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: 8 }}>
                        {suggestions.map((s, i) => (
                          <button key={i} onClick={() => { setSelectedSlot(s); setStep('form'); }} style={{
                            padding: 10, borderRadius: 8, border: '1px solid var(--accent)',
                            background: 'rgba(108,99,255,0.1)', color: 'var(--accent2)',
                            cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)',
                          }}>
                            {format(new Date(s.startTime), 'EEE, d MMM')}<br/>
                            {format(new Date(s.startTime), 'h:mm a')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                    {slots.map(slot => (
                      <button key={slot.startTime} onClick={() => { setSelectedSlot(slot); setStep('form'); }}
                        style={{
                          padding: '10px 8px', border: '1px solid var(--accent)', borderRadius: 8,
                          background: 'transparent', color: 'var(--accent2)', fontWeight: 600, fontSize: 13,
                          cursor: 'pointer', textAlign: 'center', transition: 'all 0.1s',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent2)'; }}>
                        {format(new Date(slot.startTime), 'h:mm a')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'form' && (
            <>
              <button onClick={() => { setStep('calendar'); setSelectedSlot(null); }} style={{
                border: 'none', background: 'none', color: 'var(--text2)', cursor: 'pointer',
                marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'var(--font-body)',
              }}>← Back</button>

              <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17, marginBottom: 8 }}>Enter your details</h2>
              <div style={{
                color: 'var(--accent2)', fontSize: 13, fontWeight: 500, marginBottom: 24,
                background: 'rgba(108,99,255,0.1)', padding: '8px 12px',
                borderRadius: 8, display: 'inline-block', border: '1px solid rgba(108,99,255,0.2)',
              }}>
                📅 {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d')} at {format(new Date(selectedSlot.startTime), 'h:mm a')} – {format(new Date(selectedSlot.endTime), 'h:mm a')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { key: 'name', label: 'Name *', placeholder: 'Your full name', type: 'text' },
                  { key: 'email', label: 'Email *', placeholder: 'your@email.com', type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 7 }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 7 }}>
                    Notes <span style={{ color: 'var(--text3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <textarea value={form.notes} placeholder="Anything to share before the meeting?"
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    style={{ ...inputStyle, height: 88, resize: 'vertical' }} />
                </div>

                {error && (
                  <div style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(248,113,113,0.2)' }}>{error}</div>
                )}

                <button className="btn btn-primary" onClick={handleBook}
                  disabled={submitting || !form.name.trim() || !form.email.trim()}
                  style={{ padding: 13, justifyContent: 'center', fontSize: 15, borderRadius: 8, fontFamily: 'var(--font-head)' }}>
                  {submitting ? 'Scheduling...' : 'Schedule Event'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
