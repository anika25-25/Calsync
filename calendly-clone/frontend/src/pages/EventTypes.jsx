import { useEffect, useState } from 'react';
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '../api';
import toast from 'react-hot-toast';

const COLORS = ['#6c63ff', '#4ade80', '#f472b6', '#fbbf24', '#22d3ee', '#f87171'];

const defaultForm = { name: '', duration: 30, description: '', color: COLORS[0], slug: '' };

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getEventTypes()
      .then(r => setEventTypes(r.data))
      .catch(() => toast.error('Failed to load event types'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (et) => { setForm({ name: et.name, duration: et.duration, description: et.description || '', color: et.color || COLORS[0], slug: et.slug }); setEditId(et.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(defaultForm); setEditId(null); };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editId) {
        const r = await updateEventType(editId, form);
        setEventTypes(e => e.map(et => et.id === editId ? r.data : et));
        toast.success('Event type updated!');
      } else {
        const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const r = await createEventType({ ...form, slug });
        setEventTypes(e => [...e, r.data]);
        toast.success('Event type created!');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event type?')) return;
    try {
      await deleteEventType(id);
      setEventTypes(e => e.filter(et => et.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '10px 14px', borderRadius: 8,
    fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17 }}>Event Types</span>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New event type</button>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Event Types</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Create and manage the meetings people can book with you.</p>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text3)', fontSize: 14 }}>Loading...</div>
        ) : eventTypes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 16 }}>No event types yet. Create one to get started.</p>
            <button className="btn btn-primary" onClick={openCreate}>+ Create event type</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {eventTypes.map((et, idx) => (
              <div key={et.id} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s', cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
              >
                {/* Bottom accent bar */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                  background: et.color || COLORS[idx % COLORS.length],
                }} />

                {/* Duration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {et.duration} min
                </div>

                <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{et.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 18, minHeight: 32 }}>{et.description || 'No description'}</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>/{et.slug}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(et)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(et.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 14, width: '100%', maxWidth: 480,
            padding: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 }}>
                {editId ? 'Edit event type' : 'New event type'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 7 }}>Name *</label>
                <input style={inputStyle} placeholder="e.g. 30 min intro call" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 7 }}>Duration (minutes)</label>
                <select style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) })}>
                  {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 7 }}>Description</label>
                <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="What's this meeting about?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => setForm({ ...form, color: c })} style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: form.color === c ? '3px solid white' : '3px solid transparent',
                      boxSizing: 'border-box', transition: 'all 0.15s',
                    }} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Save changes' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
