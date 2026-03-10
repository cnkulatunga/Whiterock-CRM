import React, { useState } from 'react';
import './TeamLeaderDashboard.css';

const TeamLeaderDashboard = ({ onNavigate }) => {
    // Shared Stats & Mock Data
    const stats = [
        { label: 'Total Active Leads', value: '1,284', trend: '+5.2%', trendType: 'positive' },
        { label: 'Pending Documents', value: '48', trend: null, trendType: 'neutral' },
    ];

    const agentPerformance = [
        { name: 'John Smith', initials: 'JS', activeLeads: 142, closedDeals: 18, responseTime: '12m 4s', color: '#2447d7' },
        { name: 'Alice Wong', initials: 'AW', activeLeads: 98, closedDeals: 22, responseTime: '8m 30s', color: '#7c3aed' },
        { name: 'Robert King', initials: 'RK', activeLeads: 115, closedDeals: 12, responseTime: '25m 12s', color: '#f59e0b' },
    ];

    const documentCollection = [
        { label: 'BANK STATEMENTS', progress: 78, color: '#2447d7' },
    ];

    const pipelineData = [
        { label: 'Pending Documents', value: '35%', color: '#f59e0b' },
        { label: 'Approved Documents', value: '55%', color: '#10b981' },
        { label: 'Rejected Documents', value: '10%', color: '#e53e3e' },
    ];

    // Calendar & Interaction State
    const [isConnecting, setIsConnecting] = useState(false);
    const [isOutlookConnected, setIsOutlookConnected] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); // March 2026

    const handleConnectOutlook = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setIsOutlookConnected(true);
        }, 1500);
    };

    // Calendar Grid Logic
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    return (
        <div className="tl-dashboard">
            <header className="tl-page-header">
                <h1 className="tl-page-title">Dashboard</h1>
                <p className="tl-page-subtitle">Monitoring agent performance and real-time lead flow</p>
            </header>

            <div className="tele-stats-row">
                {stats.map((stat, idx) => (
                    <div key={idx} className="tele-card stat-card-main">
                        <div className="card-info">
                            <span className="card-label">{stat.label}</span>
                            <div className="card-value-row">
                                <h2 className="card-value">{stat.value}</h2>
                                {stat.trend && (
                                    <span className={`trend-badge ${stat.trendType}`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tl-dashboard-layout-grid">
                {/* Main Content Areas */}
                <div className="tl-grid-left">
                    <section className="tl-section">
                        <div className="tl-section-header">
                            <h2 className="tl-section-title">Agent Performance</h2>
                            <button className="view-all-link">View Full Report</button>
                        </div>
                        <div className="tele-card performance-card">
                            <div className="table-responsive">
                                <table className="tele-table">
                                    <thead>
                                        <tr>
                                            <th>AGENT NAME</th>
                                            <th>ACTIVE LEADS</th>
                                            <th>CLOSED DEALS</th>
                                            <th>RESPONSE TIME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agentPerformance.map((agent, idx) => (
                                            <tr key={idx}>
                                                <td className="lead-cell">
                                                    <div className="lead-avatar" style={{ backgroundColor: `${agent.color}15`, color: agent.color }}>
                                                        <span>{agent.initials}</span>
                                                    </div>
                                                    <div className="lead-text">
                                                        <div className="lead-name">{agent.name}</div>
                                                    </div>
                                                </td>
                                                <td>{agent.activeLeads}</td>
                                                <td>{agent.closedDeals}</td>
                                                <td>{agent.responseTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="tl-section">
                        <div className="tl-section-header">
                            <h2 className="tl-section-title">Team Calendar (Outlook)</h2>
                            <div className="calendar-controls-mini">
                                <button onClick={prevMonth} className="cal-nav-btn-mini">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <span className="month-label-mini">{monthName}</span>
                                <button onClick={nextMonth} className="cal-nav-btn-mini">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                        <div className="tele-card tl-calendar-widget">
                            {isOutlookConnected ? (
                                <div className="calendar-grid-wrapper">
                                    <div className="calendar-weekdays">
                                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="calendar-days-grid">
                                        {[...Array(emptySlots)].map((_, i) => <div key={`e-${i}`} className="cal-day-empty"></div>)}
                                        {calendarDays.map(day => (
                                            <div key={day} className={`cal-day-cell ${[9, 12, 18, 24].includes(day) ? 'has-ev' : ''}`}>
                                                {day}
                                                {[9, 12, 18, 24].includes(day) && <span className="ev-dot"></span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="outlook-sync-placeholder">
                                    <div className="outlook-icon-box">
                                        <svg viewBox="0 0 24 24" width="28" height="28" fill="#0078d4">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                        </svg>
                                    </div>
                                    <h3>Team Schedule Integration</h3>
                                    <p>Sync your Microsoft Outlook calendar to monitor team reviews and appointments.</p>
                                    <button 
                                        className="tele-primary-btn" 
                                        onClick={handleConnectOutlook}
                                        disabled={isConnecting}
                                        style={{ background: '#0078d4' }}
                                    >
                                        {isConnecting ? 'Syncing...' : 'Connect Outlook Account'}
                                    </button>
                                    <button 
                                        className="view-all-link" 
                                        onClick={() => onNavigate('calendar')}
                                        style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#2447d7', fontWeight: 600 }}
                                    >
                                        Or use local Team Calendar
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column (Secondary metrics) */}
                <div className="tl-grid-right">
                    <section className="tl-section">
                        <div className="tl-section-header">
                            <h2 className="tl-section-title">Document Collection</h2>
                        </div>
                        <div className="tele-card">
                            <div className="tl-progress-list">
                                {documentCollection.map((doc, idx) => (
                                    <div key={idx} className="tl-progress-item">
                                        <div className="tl-progress-labels">
                                            <span className="tl-progress-label">{doc.label}</span>
                                            <span className="tl-progress-value">{doc.progress}%</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div 
                                                className="progress-bar-fill" 
                                                style={{ width: `${doc.progress}%`, backgroundColor: doc.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                <p style={{ fontSize: '11px', color: '#a0aec0', marginTop: '8px' }}>Tracking team-wide bank statement verification status.</p>
                            </div>
                        </div>
                    </section>

                    <section className="tl-section">
                        <div className="tl-section-header">
                            <h2 className="tl-section-title">Document Status Distribution</h2>
                        </div>
                        <div className="tele-card pipeline-card">
                            <div className="tl-pipeline-content" style={{ marginTop: '0' }}>
                                <div className="tl-chart-container" style={{ width: '160px', height: '160px' }}>
                                    <div className="tl-donut-chart" style={{ background: 'conic-gradient(#f59e0b 0% 35%, #10b981 35% 90%, #e53e3e 90% 100%)' }}>
                                        <div className="tl-donut-inner">
                                            <span className="tl-donut-label">TOTAL</span>
                                            <span className="tl-donut-value" style={{ fontSize: '22px' }}>120</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="tl-legend" style={{ fontSize: '12px' }}>
                                    {pipelineData.map((item, idx) => (
                                        <div key={idx} className="tl-legend-item">
                                            <div className="tl-legend-color-box">
                                                <span className="tl-legend-dot" style={{ backgroundColor: item.color }}></span>
                                                <span className="tl-legend-label">{item.label}</span>
                                            </div>
                                            <span className="tl-legend-value">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TeamLeaderDashboard;
