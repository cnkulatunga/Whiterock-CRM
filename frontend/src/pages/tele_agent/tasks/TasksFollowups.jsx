import React, { useState } from 'react';
import './TasksFollowups.css';

const MOCK_TASKS = [
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', priority: 'High', status: 'Pending', dueDate: 'Today, 2:00 PM', type: 'Call' },
    { id: 2, title: 'Verify Alice Huang\'s documents', lead: 'Alice Huang', priority: 'Medium', status: 'In Progress', dueDate: 'Today, 4:30 PM', type: 'Document' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', priority: 'High', status: 'Completed', dueDate: 'Yesterday', type: 'Review' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', priority: 'Low', status: 'Pending', dueDate: 'Tomorrow, 10:00 AM', type: 'Email' },
    { id: 5, title: 'Re-call Sarah Connor regarding rejection', lead: 'Sarah Connor', priority: 'Medium', status: 'Pending', dueDate: 'Mar 08, 2024', type: 'Call' },
    { id: 6, title: 'Schedule meeting with Lender Team', lead: 'Internal', priority: 'High', status: 'Pending', dueDate: 'Mar 10, 2024', type: 'Meeting' },
];

const TasksFollowups = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = MOCK_TASKS.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.lead.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <div className="header-info">
                    <h1>Tasks & Follow-ups</h1>
                    <p>Manage your daily appointments, calls, and document reviews.</p>
                </div>
            </div>

            <div className="tasks-controls">
                <div className="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tasks or leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tasks-list">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div className="task-card" key={task.id}>
                            <div className="task-main">
                                <div className={`task-type-icon ${task.type.toLowerCase()}`}>
                                    {task.type === 'Call' && <IconPhone />}
                                    {task.type === 'Document' && <IconDoc />}
                                    {task.type === 'Review' && <IconReview />}
                                    {task.type === 'Email' && <IconMail />}
                                    {task.type === 'Meeting' && <IconMeeting />}
                                </div>
                                <div className="task-details">
                                    <h3>{task.title}</h3>
                                    <div className="task-meta">
                                        <span className="lead-name">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                            </svg>
                                            {task.lead}
                                        </span>
                                        <span className="due-date">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {task.dueDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="task-actions">
                                <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                <span className={`status-tag ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                                <button className="btn-action">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                        <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-tasks">
                        <p>No tasks found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconDoc = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
const IconReview = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconMeeting = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export default TasksFollowups;
