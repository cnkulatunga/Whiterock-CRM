import React, { useState } from 'react';
import './TeleDashboard.css';

/* ─── SVG ICONS ─── */
const IconBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconUserGroup = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconFolder = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

/* ─── DATA MOCK ─── */
// Removed FOLLOW_UPS mock data, using prop instead.

const LEADS_BY_STAGE = [
    { stage: 'DOCUMENT COLLECTED', count: 42, percentage: 85 },
    { stage: 'DOCUMENT VERIFICATIONS', count: 28, percentage: 60 },
    { stage: 'LENDER SELECTION', count: 34, percentage: 75 },
    { stage: 'LOAN CONFIRMED', count: 12, percentage: 30 },
    { stage: 'LOAN REJECTED', count: 3, percentage: 10 },
];

/* ─── MAIN COMPONENT ─── */
const TeleDashboard = ({ onNavigate, tasks }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [useGoogleCalendar, setUseGoogleCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Calendar Logic
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Adjust for Monday start (Original view used MON-SUN)
    // getDay() returns 0 for SUN, 1 for MON...
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const isToday = (day) => {
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    return (
        <div className="tele-dashboard-container">

            {/* ── TOP STATS ── */}
            <section className="top-stats-row">
                <div className="tele-card stat-card-main">
                    <div className="card-top">
                        <div className="icon-box-blue"><IconUserGroup /></div>
                        <span className="trend-badge positive">+12%</span>
                    </div>
                    <div className="card-info">
                        <span className="card-label">My Active Leads</span>
                        <h2 className="card-value">1,284</h2>
                    </div>
                </div>
                <div className="tele-card stat-card-main">
                    <div className="card-top">
                        <div className="icon-box-yellow"><IconFolder /></div>
                        <span className="trend-badge stable">Stable</span>
                    </div>
                    <div className="card-info">
                        <span className="card-label">Pending Documents</span>
                        <h2 className="card-value">28</h2>
                    </div>
                </div>
            </section>

            <div className="dashboard-grid-main">

                {/* ── LEFT COLUMN ── */}
                <div className="grid-left">

                    {/* Today's Follow-ups */}
                    <div className="tele-card follow-ups-card">
                        <div className="card-header-row">
                            <h2 className="card-title">Today's Follow-ups</h2>
                            <button className="view-all-link" onClick={() => onNavigate('follow-ups')}>View all schedule</button>
                        </div>
                        <div className="table-responsive">
                            <table className="tele-table">
                                <thead>
                                    <tr>
                                        <th>LEAD NAME</th>
                                        <th>SCHEDULED TIME</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.slice(0, 3).map(item => (
                                        <tr key={item.id}>
                                            <td className="lead-cell">
                                                <div className="lead-avatar" style={{ backgroundColor: '#ebf0ff' }}>
                                                    <span style={{ color: '#2447d7' }}>{item.lead.split(' ').map(n=>n[0]).join('')}</span>
                                                </div>
                                                <div className="lead-text">
                                                    <div className="lead-name">{item.lead}</div>
                                                    <div className="lead-phone">{item.type}</div>
                                                </div>
                                            </td>
                                            <td className="time-cell">
                                                <div className="time-main">{item.time}</div>
                                                <div className="time-rel" style={{ color: '#a0aec0' }}>Scheduled</div>
                                            </td>
                                            <td className="status-cell">
                                                <div className="status-indicator">
                                                    <span className="status-dot-small" style={{ backgroundColor: item.status === 'Completed' ? '#10b981' : (item.status === 'In Progress' ? '#ed8936' : '#cbd5e0') }}></span>
                                                    {item.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Integrated Calendar / Google Calendar */}
                    <section className="tele-card calendar-section-alt">
                        <div className="section-header">
                            <h2 className="card-title">Calendar & Events</h2>

                            <div className="calendar-type-tabs">
                                <button
                                    className={`tab-btn ${!useGoogleCalendar ? 'active' : ''}`}
                                    onClick={() => setUseGoogleCalendar(false)}
                                >
                                    Local
                                </button>
                                <button
                                    className={`tab-btn ${useGoogleCalendar ? 'active' : ''}`}
                                    onClick={() => setUseGoogleCalendar(true)}
                                >
                                    Google Calendar
                                </button>
                            </div>

                            {!useGoogleCalendar && (
                                <div className="calendar-controls">
                                    <button className="cal-nav-btn" onClick={prevMonth}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    <div className="month-selector">{monthName}</div>
                                    <button className="cal-nav-btn" onClick={nextMonth}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {useGoogleCalendar ? (
                            <div className="google-calendar-wrapper">
                                <div className="google-overlay-notice">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="#2447d7">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                    </svg>
                                    <h3>Connect Your Calendar</h3>
                                    <p>Sync with your Google account to manage your Whiterock CRM appointments directly.</p>
                                    <button className="tele-primary-btn" style={{ margin: '16px 0' }}>
                                        Link Account
                                    </button>
                                </div>
                                <iframe
                                    src="https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York"
                                    style={{ border: 0, width: '100%', height: '400px', borderRadius: '12px', opacity: 0.7 }}
                                    frameBorder="0"
                                    scrolling="no"
                                    title="Google Calendar Placeholder"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="dashboard-calendar-layout">
                                <div className="calendar-grid-mini">
                                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                        <div key={day} className="cal-day-label">{day}</div>
                                    ))}
                                    {[...Array(emptySlots)].map((_, i) => <div key={`empty-${i}`} className="cal-cell empty"></div>)}
                                    {calendarDays.map(day => {
                                        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                        const dayTasks = tasks.filter(t => t.date === dateStr);
                                        const isSelected = selectedDate === dateStr;
                                        return (
                                            <div 
                                                key={day} 
                                                className={`cal-cell ${isToday(day) ? 'today' : ''} ${dayTasks.length > 0 ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                                                onClick={() => setSelectedDate(dateStr)}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="dash-date-sidebar">
                                    <div className="dash-sidebar-header">
                                        <h4>{selectedDate}</h4>
                                        <button className="btn-add-dash" onClick={() => onNavigate('follow-ups', selectedDate)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="dash-sidebar-list">
                                        {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                            tasks.filter(t => t.date === selectedDate).map(t => (
                                                <div key={t.id} className="dash-mini-task">
                                                    <span className={`dash-task-dot ${t.status.toLowerCase().replace(' ', '-')}`}></span>
                                                    <div className="dash-task-txt">
                                                        <span className="task-name">{t.title}</span>
                                                        <span className="task-meta">{t.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="dash-empty-msg">No tasks</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="grid-right">

                    {/* Leads by Stage */}
                    <div className="tele-card leads-stage-card">
                        <div className="card-header-row">
                            <h2 className="card-title">Leads by Stage</h2>
                            <span className="total-label">128 TOTAL</span>
                        </div>
                        <div className="stage-list">
                            {LEADS_BY_STAGE.map(item => (
                                <div className="stage-item" key={item.stage}>
                                    <div className="stage-info">
                                        <span className="stage-name">{item.stage}</span>
                                        <span className="stage-count">{item.count}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${item.percentage}%`, background: item.percentage > 80 ? '#2447d7' : (item.percentage > 50 ? '#6366f1' : '#a5b4fc') }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Productivity Streak */}
                    <div className="tele-card streak-card">
                        <div className="streak-content">
                            <h3 className="streak-title">Productivity Streak</h3>
                            <p className="streak-text">You've reached 85% of your daily call goal. 12 more to hit your target!</p>
                            <div className="streak-progress-container">
                                <div className="streak-progress-bg">
                                    <div className="streak-progress-fill" style={{ width: '85%' }}></div>
                                </div>
                                <span className="streak-pct">85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleDashboard;
