import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useEvents from '../hooks/useEvents';
import { useNotifications } from '../contexts/NotificationContext';
import API_BASE from '../config/api';
import '../styles/event-form.css';

const EventForm = () => {
    const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', capacity: '' });
    const [file, setFile] = useState(null);
    const { user } = useAuth();
    const { fetchEvents } = useEvents();
    const { showNotification } = useNotifications();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!form.title.trim()) {
            showNotification('Please enter an event title', 'error');
            return;
        }

        if (!form.date) {
            showNotification('Please select an event date', 'error');
            return;
        }

        // Validate that the date is not in the past
        const selectedDate = new Date(form.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showNotification('Event date cannot be in the past', 'error');
            return;
        }

        if (form.capacity && (isNaN(form.capacity) || form.capacity < 1)) {
            showNotification('Capacity must be a positive number', 'error');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    organizer_id: user.id,
                    capacity: form.capacity ? parseInt(form.capacity) : null
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success !== false) {
                    // Optional image upload step
                    if (file && data.id) {
                        try {
                            const fd = new FormData();
                            fd.append('image', file);
                            const up = await fetch(`${API_BASE}/events/${data.id}/upload`, { method: 'POST', body: fd });
                            const upJson = await up.json().catch(() => ({ success: false }));
                            if (up.ok && upJson && upJson.success) {
                                showNotification('Image uploaded successfully', 'success');
                            } else {
                                showNotification(upJson.error || 'Image upload failed', 'error');
                            }
                        } catch (err) {
                            showNotification('Image upload failed. Please try again.', 'error');
                        }
                    }
                    fetchEvents();
                    setForm({ title: '', description: '', date: '', time: '', location: '', capacity: '' });
                    setFile(null);
                    showNotification('Event created successfully!', 'success');
                } else {
                    showNotification(data.error || 'Failed to create event', 'error');
                }
            } else {
                showNotification('Failed to create event. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('Network error occurred. Please check your connection and try again.', 'error');
        }
    };

    return (
        <div className="event-form">
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Enter event title"
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image" className="form-label">Background Image (optional)</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe your event..."
                        className="form-control"
                        rows="4"
                    />
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                id="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="time" className="form-label">Time</label>
                            <input
                                type="time"
                                id="time"
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="form-group">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                placeholder="Event location"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="capacity" className="form-label">Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                placeholder="Max attendees"
                                className="form-control"
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    <svg className="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default EventForm;