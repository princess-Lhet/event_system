import { useEffect, useState, useCallback } from 'react';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readValue = (key, initialValue) => {
  if (!isBrowser) return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readValue(key, initialValue));

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (isBrowser) {
          const serialized = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
          // Force same-tab listeners as well
          window.dispatchEvent(new StorageEvent('storage', { key, newValue: serialized }));
        }
      } catch {
        // noop
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    if (!isBrowser) return;
    const handleStorage = (event) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
