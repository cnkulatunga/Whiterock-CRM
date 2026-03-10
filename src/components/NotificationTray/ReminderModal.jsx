import React from 'react';
import './ReminderModal.css';

const ReminderModal = ({ reminder, onDismiss }) => {
    if (!reminder) return null;

    return (
        <div className="reminder-modal-overlay">
            <div className="reminder-modal-card">
                <div className="reminder-modal-header">
                    <div className="bell-ring">
                        <IconBell size={32} />
                    </div>
                    <h3>Task Reminder</h3>
                </div>
                <div className="reminder-modal-body">
                    <h2 className="reminder-title">{reminder.title}</h2>
                    <div className="reminder-meta">
                        <span className="meta-item">
                            <IconUser size={14} /> {reminder.lead || 'Personal Task'}
                        </span>
                        <span className="meta-item">
                            <IconClock size={14} /> {reminder.time}
                        </span>
                    </div>
                    {reminder.message && (
                        <div className="reminder-message-box">
                            <p>{reminder.message}</p>
                        </div>
                    )}
                </div>
                <div className="reminder-modal-footer">
                    <button className="btn-dismiss" onClick={onDismiss}>Dismiss Reminder</button>
                </div>
            </div>
        </div>
    );
};

const IconBell = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconUser = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconClock = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export default ReminderModal;
