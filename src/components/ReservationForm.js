import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useReservations from '../hooks/useReservation';
import useEvents from '../hooks/useEvents';
import { useNotifications } from '../contexts/NotificationContext';
import useUserNotifications from '../hooks/useUserNotifications';
import API_BASE from '../config/api';
import '../styles/reservation-form.css';

const ReservationForm = () => {
    const [eventId, setEventId] = useState('');
    const { user } = useAuth();
    const { reservations, fetchReservations } = useReservations();
    const { events } = useEvents();
    const { showNotification } = useNotifications();
    const [showPanel, setShowPanel] = useState(false);
    const { items: notifs, markRead, fetchNotifs } = useUserNotifications(user?.id, { pollMs: 10000, unreadOnly: true });
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!eventId) {
            showNotification('Please select an event to reserve', 'error');
            return;
        }

        const selected = (events || []).find(ev => String(ev.id) === String(eventId));
        if (selected) {
            const dt = new Date(`${selected.date} ${selected.time || '23:59:59'}`);
            if (isFinite(dt) && dt < new Date()) {
                showNotification('Event already ended', 'error');
                return;
            }
        }

        try {
            const res = await fetch(`${API_BASE}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: eventId, user_id: user.id })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success !== false) {
                    fetchReservations();
                    setEventId('');
                    showNotification('Reservation created successfully!', 'success');
                } else {
                    showNotification(data.error || 'Failed to create reservation', 'error');
                }
            } else {
                showNotification('Failed to create reservation. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('Network error occurred. Please check your connection and try again.', 'error');
        }
    };

    return (
        <div className="reservation-form">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ marginBottom: 0 }}>Make a Reservation</h2>
                {user && (
                    <div style={{ position: 'relative' }}>
                        <button type="button" className="btn" onClick={() => { setShowPanel(s => !s); fetchNotifs(); }}>
                            <span role="img" aria-label="bell">🔔</span>
                            {notifs && notifs.length > 0 && (
                                <span className="badge bg-danger" style={{ marginLeft: 6 }}>{notifs.length}</span>
                            )}
                        </button>
                        {showPanel && (
                            <div className="card" style={{ position: 'absolute', right: 0, top: '110%', width: 320, zIndex: 5 }}>
                                <div className="card-body" style={{ maxHeight: 300, overflow: 'auto', padding: 8 }}>
                                    {(!notifs || notifs.length === 0) ? (
                                        <div className="text-muted" style={{ padding: 8 }}>No new notifications</div>
                                    ) : (
                                        notifs.map(n => {
                                            let code = '';
                                            try { const dj = n.data_json ? JSON.parse(n.data_json) : null; code = dj && dj.code ? dj.code : ''; } catch {}
                                            return (
                                                <div key={n.id} className="notif-item" style={{ padding: 8, borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => markRead(n.id)}>
                                                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                                                    <div style={{ fontSize: 12 }}>{n.message}{code ? ` (Code: ${code})` : ''}</div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="eventSelect" className="form-label">Select Event</label>
                    <select
                        id="eventSelect"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Choose an event...</option>
                        {events.map(event => {
                            const ended = (() => {
                                const dt = new Date(`${event.date} ${event.time || '23:59:59'}`);
                                return isFinite(dt) && dt < new Date();
                            })();
                            return (
                                <option key={event.id} value={event.id} disabled={ended}>
                                    {event.title} - {new Date(event.date).toLocaleDateString()}{event.time && ` at ${event.time}`} {ended ? '(Ended)' : ''}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    <svg className="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reserve Spot
                </button>
            </form>

            {/* Attendee's reservations list */}
            {user && (
                (() => {
                    const myReservations = (reservations || []).filter(r => String(r.user_id) === String(user.id));
                    if (myReservations.length === 0) return null;
                    const byId = Object.fromEntries(events.map(e => [String(e.id), e]));
                    return (
                        <div className="my-reservations" style={{ marginTop: 24 }}>
                            <h3 style={{ marginBottom: 12 }}>Your Reservations ({myReservations.length})</h3>
                            <ol style={{ paddingLeft: 18 }}>
                                {myReservations.map((r, idx) => {
                                    const ev = byId[String(r.event_id)];
                                    const label = ev
                                        ? `${ev.title} - ${new Date(ev.date).toLocaleDateString()}${ev.time ? ` at ${ev.time}` : ''}`
                                        : `Event #${r.event_id}`;
                                    return (
                                        <li key={r.id || `${r.event_id}-${idx}`}>
                                            <span>{label}</span>
                                            {r.status && <span className="text-muted" style={{ marginLeft: 8 }}>({r.status})</span>}
                                            {String((r.status || '').toLowerCase()) === 'approved' && r.approval_code && (
                                                <span className="badge bg-success" style={{ marginLeft: 8 }}>Code: {r.approval_code}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    );
                })()
            )}
        </div>
    );
};

export default ReservationForm;