import React from 'react';
import './NotificationTray.css';

const NotificationTray = ({ notifications, onRemove }) => {
    return (
        <div className="notification-tray">
            {notifications.map(n => (
                <div key={n.id} className={`notification-toast ${n.type}`} onClick={() => onRemove(n.id)}>
                    <div className="notification-icon">
                        {n.type === 'reminder' ? <IconBell size={24} /> : <IconInfo size={24} />}
                    </div>
                    <div className="notification-content">
                        <h4>{n.title}</h4>
                        <p>{n.message}</p>
                    </div>
                    <button className="notification-close">&times;</button>
                </div>
            ))}
        </div>
    );
};

const IconBell = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconInfo = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export default NotificationTray;
