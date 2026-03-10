import React, { useState, useEffect } from 'react';
import './TeleDashboard.css';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';

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
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(() => {
        const acc = getAccount();
        if (acc) {
            setOutlookAccount(acc);
            fetchOutlookEvents();
        }
    }, []);

    const fetchOutlookEvents = async () => {
        setLoadingEvents(true);
        try {
            const evts = await getCalendarEvents();
            setOutlookEvents(evts);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleOutlookLogin = async () => {
        try {
            const acc = await signIn();
            setOutlookAccount(acc);
            fetchOutlookEvents();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // Calendar Logic
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

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
                    </div>
                    <div className="card-info">
                        <span className="card-label">My Active Leads</span>
                        <h2 className="card-value">1,284</h2>
                    </div>
                </div>
                <div className="tele-card stat-card-main">
                    <div className="card-top">
                        <div className="icon-box-yellow"><IconFolder /></div>
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
                                        <th>TYPE</th>
                                        <th>SCHEDULED TIME</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.filter(t => t.date === todayStr).length > 0 ? (
                                        tasks.filter(t => t.date === todayStr).map(item => (
                                            <tr key={item.id}>
                                                <td className="lead-cell">
                                                    <div className="lead-avatar" style={{ backgroundColor: '#ebf0ff' }}>
                                                        <span style={{ color: '#2447d7' }}>{item.lead.split(' ').map(n=>n[0]).join('')}</span>
                                                    </div>
                                                    <div className="lead-text">
                                                        <div className="lead-name">{item.lead}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`task-type-badge ${item.type?.toLowerCase().replace(' ', '-')}`}>{item.type}</span>
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>No follow-ups for today</td>
                                        </tr>
                                    )}
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
                                    className={`tab-btn ${!useOutlookCalendar ? 'active' : ''}`}
                                    onClick={() => setUseOutlookCalendar(false)}
                                >
                                    Local
                                </button>
                                <button
                                    className={`tab-btn ${useOutlookCalendar ? 'active' : ''}`}
                                    onClick={() => setUseOutlookCalendar(true)}
                                >
                                    Outlook Calendar
                                </button>
                            </div>

                            {!useOutlookCalendar && (
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

                        {useOutlookCalendar ? (
                            <div className="outlook-calendar-wrapper">
                                {!outlookAccount ? (
                                    <div className="outlook-overlay-notice">
                                        <svg viewBox="0 0 24 24" width="36" height="36">
                                            <path d="M11 2h10v10H11V2M2 2h7v7H2V2m9 9h10v10H11V11M2 11h7v10H2v-10z" fill="#0078d4" />
                                        </svg>
                                        <h3>Connect Your Outlook Calendar</h3>
                                        <p>Sync with your Microsoft 365 account to manage your CRM follow-ups directly from Outlook.</p>
                                        <button className="tele-primary-btn" style={{ margin: '16px 0', background: '#0078d4' }} onClick={handleOutlookLogin}>
                                            Sign in with Microsoft
                                        </button>
                                    </div>
                                ) : (
                                    <div className="outlook-events-container">
                                        <div className="outlook-header">
                                            <div className="user-pill">
                                                <div className="user-icon">{outlookAccount.name[0]}</div>
                                                <span>{outlookAccount.username}</span>
                                            </div>
                                            <button className="refresh-btn" onClick={fetchOutlookEvents} disabled={loadingEvents}>
                                                {loadingEvents ? 'Updating...' : 'Refresh'}
                                            </button>
                                        </div>
                                        <div className="outlook-event-list">
                                            {outlookEvents.length > 0 ? (
                                                outlookEvents.map((evt, i) => (
                                                    <div key={i} className="outlook-event-item">
                                                        <div className="evt-time">
                                                            <span className="evt-date">{new Date(evt.start.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                            <span className="evt-hour">{new Date(evt.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="evt-details">
                                                            <div className="evt-subject">{evt.subject}</div>
                                                            <div className="evt-loc">{evt.location?.displayName || 'No location'}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-events">No upcoming events found in Outlook.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="outlook-placeholder-img" style={{ height: '400px', background: '#f8fafc', borderRadius: '12px', opacity: 0.3 }}>
                                </div>
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
