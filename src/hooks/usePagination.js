import { useMemo, useState, useCallback } from 'react';

export default function usePagination(items = [], pageSize = 10, initialPage = 1) {
  const [page, setPageState] = useState(initialPage);
  const total = Array.isArray(items) ? items.length : 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const next = useCallback(() => setPageState(p => Math.min(pages, p + 1)), [pages]);
  const prev = useCallback(() => setPageState(p => Math.max(1, p - 1)), []);
  const goto = useCallback((p) => setPageState(() => Math.min(pages, Math.max(1, p))), [pages]);

  // Stable reset helper (always same identity) so consumers can safely include
  // it in effect dependency arrays without causing size/identity churn.
  const reset = useCallback(() => setPageState(1), []);

  return { page, pages, total, pageItems, setPage: goto, next, prev, reset };
}
