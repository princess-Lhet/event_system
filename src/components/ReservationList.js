import React, { useEffect, useMemo, useState } from 'react';
import useReservations from '../hooks/useReservation';
import useEvents from '../hooks/useEvents';
import API_BASE from '../config/api';
import '../styles/reservation-form.css';
import usePagination from '../hooks/usePagination';

const ReservationList = () => {
  const { reservations, fetchReservations } = useReservations();
  const { events } = useEvents();
  const [updatingId, setUpdatingId] = useState(null);
  const [filters, setFilters] = useState({ q: '', status: '' });
  const [localStatus, setLocalStatus] = useState({});

  const eventById = useMemo(() => Object.fromEntries((events || []).map(e => [String(e.id), e])), [events]);

  const filtered = useMemo(() => {
    let list = Array.isArray(reservations) ? [...reservations] : [];
    const { q, status } = filters;
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(r => {
        const ev = eventById[String(r.event_id)];
        const label = ev ? `${ev.title} ${ev.location || ''}` : '';
        const uname = (r.user_name || '').toLowerCase();
        const uemail = (r.user_email || '').toLowerCase();
        return label.toLowerCase().includes(qq) || uname.includes(qq) || uemail.includes(qq) || String(r.user_id).includes(q);
      });
    }
    if (status) {
      const want = status.toLowerCase();
      list = list.filter(r => {
        const raw = (localStatus[r.id] ?? r.status);
        const current = ((raw && String(raw).trim()) ? String(raw).trim() : 'pending').toLowerCase();
        return current === want;
      });
    }
    return list;
  }, [reservations, filters, eventById, localStatus]);

  // Pagination: apply to the filtered list
  const { page, pages, total, pageItems, setPage, next, prev, reset } = usePagination(filtered, 8, 1);

  // Reset to first page when filters change so users see updated results
  useEffect(() => {
    reset();
  }, [filters.q, filters.status, reset, setPage]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`${API_BASE}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (data && data.success === false)) {
        window.alert((data && data.error) || 'Failed to update status');
      }
      await fetchReservations();
    } finally {
      setUpdatingId(null);
    }
  };

  // Reconcile local optimistic values with server data after each refresh
  useEffect(() => {
    if (!Array.isArray(reservations)) return;
    setLocalStatus(prev => {
      const next = { ...prev };
      for (const r of reservations) {
        const cur = next[r.id];
        if (cur && String(cur).toLowerCase() === String(r.status || '').toLowerCase()) {
          delete next[r.id];
        }
      }
      return next;
    });
  }, [reservations]);

  const remove = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    const res = await fetch(`${API_BASE}/reservations/${id}`, { method: 'DELETE' });
    await res.json().catch(() => ({}));
    fetchReservations();
  };

  return (
    <div className="reservation-list">
      <div className="reservation-toolbar" style={{ display: 'grid', gridTemplateColumns: '1fr max-content', gap: 8, marginBottom: 12 }}>
        <input className="form-control" placeholder="Search by event title/location, user name or email" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="form-control" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {total === 0 ? (
        <div className="text-muted" style={{ textAlign: 'center', padding: '16px 0' }}>No reservations found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 8px' }}>#</th>
                <th style={{ textAlign: 'left', padding: '10px 8px' }}>Event</th>
                <th style={{ textAlign: 'left', padding: '10px 8px' }}>User</th>
                <th style={{ textAlign: 'left', padding: '10px 8px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 8px' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r, idx) => {
                const ev = eventById[String(r.event_id)];
                const label = ev ? `${ev.title} - ${new Date(ev.date).toLocaleDateString()}${ev.time ? ` at ${ev.time}` : ''}` : (r.event_title ? `${r.event_title} - ${new Date(r.event_date).toLocaleDateString()}${r.event_time ? ` at ${r.event_time}` : ''}` : `Event #${r.event_id}`);
                // idx is page-local, compute global index
                const globalIndex = (page - 1) * 8 + idx + 1;
                return (
                  <tr key={r.id || `${r.event_id}-${globalIndex}`}>
                    <td style={{ padding: '8px' }}>{globalIndex}</td>
                    <td style={{ padding: '8px' }}>{label}</td>
                    <td style={{ padding: '8px' }}>{r.user_name || r.user_id}</td>
                    <td style={{ padding: '8px' }}>{r.user_email || ''}</td>
                    <td style={{ padding: '8px' }}>
                      <select
                        className="form-control"
                        value={(localStatus[r.id] ?? r.status) || 'pending'}
                        onChange={e => { const v = e.target.value; setLocalStatus(prev => ({ ...prev, [r.id]: v })); updateStatus(r.id, v); }}
                        disabled={updatingId === r.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      <button className="btn btn-danger" onClick={() => remove(r.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div className="text-muted">Showing {(total === 0) ? 0 : ((page - 1) * 8 + 1)} - {Math.min(page * 8, total)} of {total}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-light" onClick={prev} disabled={page <= 1}>Prev</button>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {Array.from({ length: pages }).map((_, i) => (
                  <button key={i} className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-light'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
              </div>
              <button className="btn btn-light" onClick={next} disabled={page >= pages}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
