import React, { useState } from 'react';
import './TasksFollowups.css';

// Removed INITIAL_TASKS mock data, using props from layout.

const TasksFollowups = ({ tasks, setTasks, initialDate, onClearPendingDate, notifyReminderSet }) => {

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [isAddingTask, setIsAddingTask] = useState(false);
    
    const [newTask, setNewTask] = useState({
        title: '',
        lead: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none'
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Handle auto-open if coming from dashboard with a specific date
    React.useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
            setNewTask(prev => ({ ...prev, date: initialDate }));
            setIsAddingTask(true);
            if (onClearPendingDate) onClearPendingDate();
        }
    }, [initialDate]);

    const handleAddTask = (e) => {
        e.preventDefault();
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            status: 'Pending'
        };
        setTasks([taskToAdd, ...tasks]);
        if (notifyReminderSet) notifyReminderSet(taskToAdd);
        setIsAddingTask(false);

        setNewTask({
            title: '',
            lead: '',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            type: 'Call',
            reminder: 'none'
        });
    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateTaskReminder = (id, newReminder) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const updatedTask = { ...t, reminder: newReminder };
                if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updatedTask);
                return updatedTask;
            }
            return t;
        }));
    };


    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.lead.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    const renderCalendar = () => {
        const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
        return (
            <div className="calendar-layout">
                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="calendar-day-header">{d}</div>
                    ))}
                    {daysInMonth.map(day => {
                        const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
                        const dayTasks = tasks.filter(t => t.date === dateStr);
                        const isSelected = selectedDate === dateStr;
                        return (
                            <div 
                                key={day} 
                                className={`calendar-day ${dayTasks.length > 0 ? 'has-tasks' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedDate(dateStr)}
                            >
                                <span className="day-num">{day}</span>
                                <div className="day-tasks-dots">
                                    {dayTasks.map(t => (
                                        <div key={t.id} className={`task-dot ${t.status.toLowerCase().replace(' ', '-')}`} title={t.title}></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="date-details-sidebar">
                    <div className="sidebar-header">
                        <h3>Tasks for {selectedDate}</h3>
                        <button className="btn-add-mini" onClick={() => {
                            setNewTask({...newTask, date: selectedDate});
                            setIsAddingTask(true);
                        }}>
                            <IconPlus />
                        </button>
                    </div>
                    <div className="sidebar-tasks">
                        {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                            tasks.filter(t => t.date === selectedDate).map(t => (
                                <div key={t.id} className="mini-task-card">
                                    <div className={`mini-status-indicator ${t.status.toLowerCase().replace(' ', '-')}`}></div>
                                    <div className="mini-task-info">
                                        <span className="mini-title">{t.title}</span>
                                        <span className="mini-meta">{t.time} • {t.lead}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-tasks-msg">No tasks scheduled for this day.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <div className="header-info">
                    <h1>Tasks & Follow-ups</h1>
                    <p>Schedule calls, site visits and manage your daily pipeline.</p>
                </div>
                <div className="header-actions">
                    <div className="notification-center">
                        <button className={`btn-notification ${tasks.some(t => t.reminder !== 'none' && t.status !== 'Completed') ? 'has-alerts' : ''}`} onClick={() => setShowNotifications(!showNotifications)}>
                            <IconBell />
                        </button>
                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="dropdown-header">Reminders & Alerts</div>
                                <div className="dropdown-body">
                                    {tasks.filter(t => t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                        tasks.filter(t => t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                            <div key={t.id} className="notif-item">
                                                <div className="notif-icon"><IconAlarm /></div>
                                                <div className="notif-content">
                                                    <span className="notif-title">Upcoming: {t.title}</span>
                                                    <span className="notif-time">{t.date} at {t.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-notif">No active reminders</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="view-toggle">
                        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><IconList size={16} /> List</button>
                        <button className={viewMode === 'calendar' ? 'active' : ''} onClick={() => setViewMode('calendar')}><IconCalendar size={16} /> Calendar</button>
                    </div>
                    <button className="btn-add-task" onClick={() => setIsAddingTask(true)}>
                        <IconPlus /> <span>New Task</span>
                    </button>
                </div>
            </div>

            {isAddingTask && (
                <div className="modal-overlay">
                    <div className="task-modal">
                        <div className="modal-header">
                            <h2>Create New Task</h2>
                            <button className="close-btn" onClick={() => setIsAddingTask(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddTask}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Task Title</label>
                                    <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Call returning client..." />
                                </div>
                                <div className="form-group">
                                    <label>Related Lead</label>
                                    <input required type="text" value={newTask.lead} onChange={e => setNewTask({...newTask, lead: e.target.value})} placeholder="Client Name" />
                                </div>
                                <div className="form-group">
                                    <label>Task Type</label>
                                    <select value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}>
                                        <option>Call</option>
                                        <option>Document</option>
                                        <option>Review</option>
                                        <option>Meeting</option>
                                        <option>Email</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input required type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input required type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Set Reminder</label>
                                    <select value={newTask.reminder} onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">No Reminder</option>
                                        <option value="15m">15 Minutes Before</option>
                                        <option value="1h">1 Hour Before</option>
                                        <option value="1d">1 Day Before</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsAddingTask(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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

            {viewMode === 'calendar' ? (
                <div className="calendar-view-container tele-card">
                    {renderCalendar()}
                </div>
            ) : (
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
                                                {task.date} • {task.time}
                                            </span>
                                            {task.reminder !== 'none' && (
                                                <span className="reminder-tag">
                                                    <IconBellActive />
                                                    Remind {task.reminder === '1d' ? '1 day before' : task.reminder === '1h' ? '1 hour before' : '15 min before'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <div className="reminder-quick-action">
                                        <select 
                                            className="reminder-mini-select"
                                            value={task.reminder}
                                            onChange={(e) => updateTaskReminder(task.id, e.target.value)}
                                            title="Update Reminder"
                                        >
                                            <option value="none">🔔 Off</option>
                                            <option value="15m">15m</option>
                                            <option value="1h">1h</option>
                                            <option value="1d">1d</option>
                                        </select>
                                    </div>
                                    <div className="status-dropdown">
                                        <select 
                                            className={`status-select-prominent ${task.status.toLowerCase().replace(' ', '-')}`}
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                        >
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-tasks">
                            <p>No tasks found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
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
const IconList = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);
const IconCalendar = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconBellActive = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" width="12" height="12">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconAlarm = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><path d="M6.38 18.7l-.44 1.1a1 1 0 0 1-1.32.5l-2.2-.9a1 1 0 0 1-.5-1.32l.44-1.1" /><path d="M17.62 18.7l.44 1.1a1 1 0 0 1 1.32.5l2.2-.9a1 1 0 0 1 .5-1.32l-.44-1.1" />
    </svg>
);

export default TasksFollowups;
