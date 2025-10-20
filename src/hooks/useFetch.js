import { useEffect, useRef, useState, useCallback } from 'react';

export default function useFetch(initialUrl = null, options = {}) {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const run = useCallback(async (nextUrl, nextOptions) => {
    const target = nextUrl ?? url;
    if (!target) return;
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(target, { ...options, ...(nextOptions || {}), signal: controller.signal });
      const ct = res.headers.get('content-type') || '';
      let body = null;
      const text = await res.text();
      if (text) body = ct.includes('application/json') ? JSON.parse(text) : text;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(body);
      return body;
    } catch (e) {
      if (e.name !== 'AbortError') setError(e);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (initialUrl) run(initialUrl);
    return () => abortRef.current?.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, loading, run, setUrl };
}
