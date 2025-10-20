import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import API_BASE from '../config/api';

export default function useUserNotifications(userId, { pollMs = 10000, unreadOnly = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const endpoint = useMemo(() => {
    if (!userId) return null;
    const q = unreadOnly ? `&unread=1` : '';
    return `${API_BASE}/notifications?user_id=${encodeURIComponent(userId)}${q}`;
  }, [userId, unreadOnly]);

  const fetchNotifs = useCallback(async () => {
    if (!endpoint) return;
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const markRead = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j && j.success) {
        setItems(prev => prev.filter(n => String(n.id) !== String(id)));
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifs();
    if (pollMs > 0) {
      timer.current = setInterval(fetchNotifs, pollMs);
      return () => clearInterval(timer.current);
    }
  }, [fetchNotifs, pollMs]);

  return { items, loading, fetchNotifs, markRead };
}
