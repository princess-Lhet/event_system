import { useState, useEffect, useCallback } from 'react';
import API_BASE from '../config/api';

const useEvents = () => {
    const [events, setEvents] = useState([]);
    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/events`);
            if (!res.ok) {
                console.error('Failed to fetch events', res.status);
                setEvents([]);
                return;
            }
            const ct = res.headers.get('content-type') || '';
            if (!ct.includes('application/json')) {
                console.warn('Non-JSON response for events');
                setEvents([]);
                return;
            }
            const text = await res.text();
            if (!text) {
                setEvents([]);
                return;
            }
            const data = JSON.parse(text);
            setEvents(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error fetching events', e);
            setEvents([]);
        }
    }, []);
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);
    return { events, fetchEvents };
};

export default useEvents;