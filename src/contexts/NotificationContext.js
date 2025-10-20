import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
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

    return (
        <NotificationContext.Provider value={{ notification, showNotification, clearNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
