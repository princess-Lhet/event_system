import { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const useReservations = () => {
    const [reservations, setReservations] = useState([]);
    const fetchReservations = async () => {
        try {
            const res = await fetch(`${API_BASE}/reservations`);
            if (!res.ok) {
                console.error('Failed to fetch reservations', res.status);
                setReservations([]);
                return;
            }
            const ct = res.headers.get('content-type') || '';
            if (!ct.includes('application/json')) {
                console.warn('Non-JSON response for reservations');
                setReservations([]);
                return;
            }
            const text = await res.text();
            if (!text) {
                setReservations([]);
                return;
            }
            const data = JSON.parse(text);
            setReservations(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error fetching reservations', e);
            setReservations([]);
        }
    };
    useEffect(() => {
        fetchReservations();
        const t = setInterval(fetchReservations, 10000);
        return () => clearInterval(t);
    }, []);
    return { reservations, fetchReservations };
};

export default useReservations;