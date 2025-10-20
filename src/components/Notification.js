import React from 'react';
import useNotifications from '../hooks/useNotifications';

const Notification = () => {
    const { notification } = useNotifications();

    if (!notification) return null;

    const getNotificationStyles = () => {
        switch (notification.type) {
            case 'error':
                return 'alert-error';
            case 'success':
                return 'alert-success';
            case 'warning':
                return 'alert-warning';
            case 'info':
            default:
                return 'alert-info';
        }
    };

    return (
        <div className={`notification-popup ${getNotificationStyles()}`}>
            <div className="notification-content">
                <span className="notification-message">{notification.message}</span>
                <button
                    className="notification-close"
                    onClick={() => window.dispatchEvent(new CustomEvent('clearNotification'))}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;
