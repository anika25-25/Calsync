import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api' });

export const getEventTypes = () => api.get('/event-types');
export const createEventType = (data) => api.post('/event-types', data);
export const updateEventType = (id, data) => api.put(`/event-types/${id}`, data);
export const deleteEventType = (id) => api.delete(`/event-types/${id}`);
export const getEventTypeBySlug = (slug) => api.get(`/event-types/${slug}`);

export const getAvailability = (userId) =>
  api.get(`/availability?userId=${userId}`);
export const getSlots = (slug, date) => api.get('/bookings/slots', { params: { slug, date } });
export const createBooking = (data) => api.post('/bookings', data);

export const getUpcomingMeetings = () => api.get('/meetings/upcoming');
export const getPastMeetings = () => api.get('/meetings/past');
export const cancelMeeting = (id) => api.patch(`/meetings/${id}/cancel`);
export const getStats = () => api.get('/meetings/stats');
export const saveAvailability = (data) =>
  api.post('/availability', data);