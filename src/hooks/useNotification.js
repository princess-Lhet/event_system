import { useCallback } from 'react';

// Emits a DOM event that NotificationContext can listen for
export default function useNotification() {
  const notify = useCallback((message, type = 'info') => {
    const evt = new CustomEvent('app:notification', { detail: { message, type } });
    window.dispatchEvent(evt);
  }, []);

  return notify;
}
