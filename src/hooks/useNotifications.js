import { useState, useEffect } from 'react';

const useNotifications = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, id: Date.now() });
        setTimeout(() => setNotification(null), 4000);
    };

    const clearNotification = () => {
        setNotification(null);
    };

    // Listen for clear notification events
    useEffect(() => {
        const handleClearNotification = () => clearNotification();
        window.addEventListener('clearNotification', handleClearNotification);

        return () => {
            window.removeEventListener('clearNotification', handleClearNotification);
        };
    }, []);

    return { notification, showNotification, clearNotification };
};

export default useNotifications;