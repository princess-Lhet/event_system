import React, { useEffect, useMemo, useState } from 'react';
import useEvents from '../hooks/useEvents';
import useAuth from '../hooks/useAuth';
import API_BASE from '../config/api';
import '../styles/event-list.css';

const EventList = () => {
    const { events, fetchEvents } = useEvents();
    const { user } = useAuth();
    const [filters, setFilters] = useState({ q: '', date: '', sortBy: 'date', sortDir: 'ASC' });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', date: '', time: '', location: '', capacity: '' });

    useEffect(() => {
        console.log('Events loaded');
        fetchEvents();
    }, [fetchEvents]);

    const handleDelete = async (id) => {
        await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
        fetchEvents();
    };

    const startEdit = (evt) => {
        setEditId(evt.id);
        setEditForm({
            title: evt.title || '',
            description: evt.description || '',
            date: evt.date || '',
            time: evt.time || '',
            location: evt.location || '',
            capacity: evt.capacity || ''
        });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditForm({ title: '', description: '', date: '', time: '', location: '', capacity: '' });
    };

    const saveEdit = async (id) => {
        const res = await fetch(`${API_BASE}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });
        await res.json().catch(() => ({}));
        setEditId(null);
        fetchEvents();
    };

    const filtered = useMemo(() => {
        let list = Array.isArray(events) ? [...events] : [];
        const { q, date, sortBy, sortDir } = filters;
        if (q) {
            const qq = q.toLowerCase();
            list = list.filter(e => (e.title || '').toLowerCase().includes(qq) || (e.location || '').toLowerCase().includes(qq));
        }
        if (date) {
            list = list.filter(e => (e.date || '') === date);
        }
        const cmp = (a, b) => {
            const av = a[sortBy] ?? '';
            const bv = b[sortBy] ?? '';
            if (sortBy === 'capacity') {
                return (parseInt(av || 0) - parseInt(bv || 0)) * (sortDir === 'ASC' ? 1 : -1);
            }
            return (String(av).localeCompare(String(bv))) * (sortDir === 'ASC' ? 1 : -1);
        };
        list.sort(cmp);
        return list;
    }, [events, filters]);

    if (filtered.length === 0) {
        return (
            <div className="container mt-4">
                <div className="event-toolbar">
                    <input type="text" className="form-control" placeholder="Search title or location" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
                    <input type="date" className="form-control" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                    <select className="form-control" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                        <option value="title">Title</option>
                        <option value="capacity">Capacity</option>
                    </select>
                    <select className="form-control" value={filters.sortDir} onChange={(e) => setFilters({ ...filters, sortDir: e.target.value })}>
                        <option value="ASC">Asc</option>
                        <option value="DESC">Desc</option>
                    </select>
                </div>
                <div className="text-center py-5">
                    <div className="mb-4">
                        <svg className="mx-auto text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="mb-2">No Events Found</h3>
                    <p className="text-muted">Try adjusting your filters.</p>
                    {user?.role === 'organizer' && (
                        <p className="text-muted">Create your first event to get started!</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="event-list-wrap">
            <div className="event-toolbar">
                <input type="text" className="form-control" placeholder="Search title or location" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
                <input type="date" className="form-control" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                <select className="form-control" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="title">Title</option>
                    <option value="capacity">Capacity</option>
                </select>
                <select className="form-control" value={filters.sortDir} onChange={(e) => setFilters({ ...filters, sortDir: e.target.value })}>
                    <option value="ASC">Asc</option>
                    <option value="DESC">Desc</option>
                </select>
            </div>

            <div className="row g-4">
            {filtered.map(event => (
                <div key={event.id} className="col-12 col-sm-6 col-md-4">
                    <div
                        className={`card event-card ${event.image_path ? 'bg-cover' : 'bg-fallback'}`}
                        style={event.image_path ? { backgroundImage: `url(${API_BASE}/${event.image_path}?v=${encodeURIComponent(event.image_path)})` } : undefined}
                    >
                        <div className="bg-overlay" />
                        <div className="card-body">
                            {editId === event.id ? (
                                <>
                                    <input className="form-control mb-2" placeholder="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                                    <textarea className="form-control mb-2" placeholder="Description" rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                    <div className="row g-2 mb-2">
                                        <div className="col-6"><input type="date" className="form-control" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} /></div>
                                        <div className="col-6"><input type="time" className="form-control" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} /></div>
                                    </div>
                                    <input className="form-control mb-2" placeholder="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                                    <input className="form-control mb-2" placeholder="Capacity" type="number" min="0" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} />
                                    {user && user.role === 'organizer' && (
                                        <div className="mb-2">
                                            <label className="form-label" style={{ fontSize: 12, opacity: .9 }}>Background Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="form-control"
                                                onChange={async (e) => {
                                                    const f = e.target.files && e.target.files[0];
                                                    if (!f) return;
                                                    try {
                                                        const fd = new FormData();
                                                        fd.append('image', f);
                                                        const resp = await fetch(`${API_BASE}/events/${event.id}/upload`, { method: 'POST', body: fd });
                                                        const data = await resp.json().catch(() => ({ success: false }));
                                                        if (resp.ok && data && data.success) {
                                                            fetchEvents();
                                                            window.alert('Image uploaded successfully');
                                                        } else {
                                                            window.alert((data && data.error) || 'Image upload failed');
                                                        }
                                                    } catch (err) {
                                                        window.alert('Image upload failed.');
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-text">{event.description}</p>
                                </>
                            )}

                            <div className="event-meta">
                                <div className="mb-2">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{editId === event.id ? editForm.location : event.location}</span>
                                </div>

                                <div className="mb-2">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {new Date(editId === event.id ? editForm.date || event.date : event.date).toLocaleDateString()} { (editId === event.id ? editForm.time : event.time) && `at ${editId === event.id ? editForm.time : event.time}`}
                                    </span>
                                </div>

                                {(editId === event.id ? editForm.capacity : event.capacity) && (
                                    <div>
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        <span>Capacity: {editId === event.id ? editForm.capacity : event.capacity}</span>
                                    </div>
                                )}
                            </div>

                            {user && user.role === 'organizer' && (
                                editId === event.id ? (
                                    <div className="d-grid gap-2 mt-3">
                                        <button className="btn btn-primary" onClick={() => saveEdit(event.id)}>Save</button>
                                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                                    </div>
                                ) : (
                                    <div className="d-grid gap-2 mt-3">
                                        <button className="btn btn-primary" onClick={() => startEdit(event)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default EventList;