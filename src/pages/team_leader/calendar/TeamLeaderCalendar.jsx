import React, { useState } from 'react';
import './TeamLeaderCalendar.css';

const AGENTS = [
    { id: 1, name: 'John Smith', initials: 'JS', color: '#2447d7' },
    { id: 2, name: 'Alice Wong', initials: 'AW', color: '#7c3aed' },
    { id: 3, name: 'Robert King', initials: 'RK', color: '#f59e0b' },
    { id: 4, name: 'Sarah Meow', initials: 'SM', color: '#10b981' },
];

const TeamLeaderCalendar = ({ tasks, setTasks, initialDate, notifyReminderSet }) => {

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('calendar'); // Default to calendar
    const [isAddingTask, setIsAddingTask] = useState(false);
    
    const [newTask, setNewTask] = useState({
        title: '',
        lead: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none',
        assignedTo: 'Self',
        message: ''
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleAddTask = (e) => {
        e.preventDefault();
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            status: 'Pending',
            createdBy: 'Team Leader'
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
            reminder: 'none',
            assignedTo: 'Self',
            message: ''
        });

    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateTaskAssignment = (id, assignedTo) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, assignedTo } : t));
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.lead && task.lead.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filter === 'All' || task.status === filter;
        
        let matchesAssignment = true;
        if (assignmentFilter === 'Personal') {
            matchesAssignment = task.assignedTo === 'Self';
        } else if (assignmentFilter === 'Team') {
            matchesAssignment = task.assignedTo !== 'Self';
        }
        
        return matchesSearch && matchesStatus && matchesAssignment;
    });

    const renderCalendar = () => {
        // Simple calendar grid for March 2026 (placeholder logic)
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
                                        <div 
                                            key={t.id} 
                                            className={`task-dot ${t.status.toLowerCase().replace(' ', '-')} ${t.assignedTo !== 'Self' ? 'assigned' : ''}`} 
                                            title={t.title}
                                        ></div>
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
                                        <span className="mini-title">
                                            {t.title}
                                            {t.assignedTo !== 'Self' && <span className="assigned-badge-mini">#Team</span>}
                                        </span>
                                        <span className="mini-meta">{t.time} • {t.lead || 'Personal'}</span>
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
        <div className="tasks-container tl-calendar-page">
            <div className="tasks-header">
                <div className="header-info">
                    <h1>Team & Personal Calendar</h1>
                    <p>Manage your tasks, follow-ups, and assign work to your team members.</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><IconList size={16} /> List</button>
                        <button className={viewMode === 'calendar' ? 'active' : ''} onClick={() => setViewMode('calendar')}><IconCalendar size={16} /> Calendar</button>
                    </div>
                    <button className="btn-add-task" style={{ background: '#2447D7' }} onClick={() => setIsAddingTask(true)}>
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
                                    <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Portfolio Review..." />
                                </div>
                                <div className="form-group">
                                    <label>Assign To</label>
                                    <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                                        <option value="Self">Myself (Team Leader)</option>
                                        <optgroup label="Team Members">
                                            {AGENTS.map(agent => (
                                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
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
                                    <label>Related Lead (Optional)</label>
                                    <input type="text" value={newTask.lead} onChange={e => setNewTask({...newTask, lead: e.target.value})} placeholder="Lead Name" />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input required type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input required type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Set Reminder</label>
                                    <select value={newTask.reminder} onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">No Reminder</option>
                                        <option value="15m">15 Minutes Before</option>
                                        <option value="1h">1 Hour Before</option>
                                        <option value="1d">1 Day Before</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Reminder Message / Notes</label>
                                    <textarea value={newTask.message} onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Additional details for the reminder..." rows="3" />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsAddingTask(false)}>Cancel</button>
                                <button type="submit" className="btn-save" style={{ background: '#2447D7' }}>Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="tasks-controls">
                <div className="controls-left">
                    <div className="search-box">
                        <IconSearch size={16} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-tabs">
                        {['All', 'Personal', 'Team'].map(f => (
                            <button
                                key={f}
                                className={`filter-tab ${assignmentFilter === f ? 'active' : ''}`}
                                onClick={() => setAssignmentFilter(f)}
                            >
                                {f} View
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-tabs status-filters">
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
                                        <div className="task-title-row">
                                            <h3>{task.title}</h3>
                                            {task.assignedTo === 'Self' ? (
                                                <span className="assignment-badge personal">Personal</span>
                                            ) : (
                                                <span className="assignment-badge team">
                                                    Assigned to {AGENTS.find(a => a.id.toString() === task.assignedTo.toString())?.name || 'Agent'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="task-meta">
                                            <span className="lead-name">
                                                <IconUser size={12} />
                                                {task.lead || 'No Lead'}
                                            </span>
                                            <span className="due-date">
                                                {task.date} • {task.time}
                                            </span>
                                            {task.message && <p className="task-card-message">{task.message}</p>}
                                        </div>

                                    </div>
                                </div>
                                <div className="task-actions">
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

/* ── ICONS ── */
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
const IconSearch = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconUser = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export default TeamLeaderCalendar;
