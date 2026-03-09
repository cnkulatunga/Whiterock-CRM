import React, { useState } from 'react';
import './LeadPerformanceReport.css';

const FUNNEL = [
    { stage: 'Stage 01: Lead In',       pct: 100, count: 1482 },
    { stage: 'Stage 02: Contacted',     pct: 72,  count: 1067 },
    { stage: 'Stage 03: Qualified',     pct: 48,  count: 711  },
    { stage: 'Stage 04: Proposal Sent', pct: 32,  count: 474  },
    { stage: 'Closed: Won',             pct: 24,  count: 367, green: true },
];

const LEADS = [
    { num: '#LD-9482', initials: 'JD', name: 'Jonathan Doe',  stage: 'STAGE 03',   stageClass: 'lpr-s3', status: 'Active',    statusClass: 'lpr-active',    agent: 'Sarah Jenkins',  date: 'Oct 24, 2023' },
    { num: '#LD-9481', initials: 'AS', name: 'Amanda Smith',  stage: 'STAGE 01',   stageClass: 'lpr-s1', status: 'Active',    statusClass: 'lpr-active',    agent: 'Michael Ross',   date: 'Oct 24, 2023' },
    { num: '#LD-9480', initials: 'RK', name: 'Robert King',   stage: 'CLOSED WON', stageClass: 'lpr-won',status: 'Completed', statusClass: 'lpr-completed', agent: 'Sarah Jenkins',  date: 'Oct 23, 2023' },
    { num: '#LD-9479', initials: 'EL', name: 'Emily Lawson',  stage: 'STAGE 04',   stageClass: 'lpr-s4', status: 'Urgent',    statusClass: 'lpr-urgent',    agent: 'David Miller',   date: 'Oct 23, 2023' },
];

const LeadPerformanceReport = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [agent, setAgent] = useState('All Agents');
    const [stage, setStage] = useState('All Stages');
    const [leadStatus, setLeadStatus] = useState('Active');

    return (
        <div className="lpr-page">
            {/* Header */}
            <div className="lpr-header">
                <div>
                    <h1 className="lpr-title">Lead Performance Report</h1>
                    <p className="lpr-subtitle">Detailed analysis of lead acquisition and conversion metrics.</p>
                </div>
                <div className="lpr-export-btns">
                    <button className="lpr-export-csv">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Export CSV
                    </button>
                    <button className="lpr-export-pdf">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="lpr-filters">
                <div className="lpr-filter-group">
                    <span className="lpr-filter-label">DATE RANGE</span>
                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="lpr-select">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                        <option>Last 90 Days</option>
                    </select>
                </div>
                <div className="lpr-filter-group">
                    <span className="lpr-filter-label">ASSIGNED AGENT</span>
                    <select value={agent} onChange={e => setAgent(e.target.value)} className="lpr-select">
                        <option>All Agents</option>
                        <option>Sarah Jenkins</option>
                        <option>Michael Ross</option>
                        <option>David Miller</option>
                    </select>
                </div>
                <div className="lpr-filter-group">
                    <span className="lpr-filter-label">LEAD STAGE</span>
                    <select value={stage} onChange={e => setStage(e.target.value)} className="lpr-select">
                        <option>All Stages</option>
                        <option>Stage 01</option>
                        <option>Stage 02</option>
                        <option>Stage 03</option>
                        <option>Stage 04</option>
                        <option>Closed Won</option>
                    </select>
                </div>
                <div className="lpr-filter-group">
                    <span className="lpr-filter-label">LEAD STATUS</span>
                    <select value={leadStatus} onChange={e => setLeadStatus(e.target.value)} className="lpr-select">
                        <option>Active</option>
                        <option>Completed</option>
                        <option>Urgent</option>
                        <option>All</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="lpr-stat-grid">
                <div className="lpr-stat-card">
                    <div className="lpr-stat-icon" style={{ background: '#eff6ff' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <div className="lpr-stat-body">
                        <span className="lpr-stat-label">Total Leads</span>
                        <span className="lpr-stat-value">1,482</span>
                        <span className="lpr-stat-change positive">↑ 12.5% vs last month</span>
                    </div>
                </div>
                <div className="lpr-stat-card">
                    <div className="lpr-stat-icon" style={{ background: '#f0fdf4' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="lpr-stat-body">
                        <span className="lpr-stat-label">Conversion Rate</span>
                        <span className="lpr-stat-value">24.8%</span>
                        <span className="lpr-stat-change positive">↑ 3.2% vs last month</span>
                    </div>
                </div>
                <div className="lpr-stat-card">
                    <div className="lpr-stat-icon" style={{ background: '#fef2f2' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className="lpr-stat-body">
                        <span className="lpr-stat-label">Rejection Rate</span>
                        <span className="lpr-stat-value">12.1%</span>
                        <span className="lpr-stat-change negative">↑ 1.4% vs last month</span>
                    </div>
                </div>
                <div className="lpr-stat-card">
                    <div className="lpr-stat-icon" style={{ background: '#fefce8' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="lpr-stat-body">
                        <span className="lpr-stat-label">Avg Lead Aging</span>
                        <span className="lpr-stat-value">4.2 Days</span>
                        <span className="lpr-stat-change positive">↓ 0.8 days improvement</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="lpr-charts-row">
                {/* Funnel */}
                <div className="lpr-chart-card">
                    <h3>Sales Funnel Efficiency</h3>
                    <div className="lpr-funnel">
                        {FUNNEL.map((row) => (
                            <div className="lpr-funnel-row" key={row.stage}>
                                <div className="lpr-funnel-label">{row.stage}</div>
                                <div className="lpr-funnel-track">
                                    <div
                                        className={`lpr-funnel-fill ${row.green ? 'lpr-funnel-fill--green' : ''}`}
                                        style={{ width: `${row.pct}%` }}
                                    />
                                </div>
                                <div className="lpr-funnel-pct">{row.pct}% ({row.count.toLocaleString()})</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Source Breakdown */}
                <div className="lpr-chart-card lpr-source-card">
                    <h3>Lead Source Breakdown</h3>
                    <div className="lpr-source-wrap">
                        <svg viewBox="0 0 120 120" width="150" height="150">
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#f1f5f9" strokeWidth="22" />
                            {/* Direct Inbound 42% */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#2447d7" strokeWidth="22"
                                strokeDasharray="118.7 282.7" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                            {/* Paid Advertising 28% */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#93c5fd" strokeWidth="22"
                                strokeDasharray="79.2 282.7" strokeDashoffset="-118.7" transform="rotate(-90 60 60)" />
                            {/* Social Media 18% */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#c4b5fd" strokeWidth="22"
                                strokeDasharray="50.9 282.7" strokeDashoffset="-197.9" transform="rotate(-90 60 60)" />
                            {/* Referrals 12% */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="22"
                                strokeDasharray="33.9 282.7" strokeDashoffset="-248.8" transform="rotate(-90 60 60)" />
                        </svg>
                        <div className="lpr-source-center">
                            <span className="lpr-source-label-main">Source</span>
                            <span className="lpr-source-label-sub">METRICS</span>
                        </div>
                    </div>
                    <div className="lpr-source-legend">
                        <div className="lpr-source-legend-item"><div className="lpr-legend-dot" style={{ background: '#2447d7' }} /><span>Direct Inbound</span><span className="lpr-legend-pct">42%</span></div>
                        <div className="lpr-source-legend-item"><div className="lpr-legend-dot" style={{ background: '#93c5fd' }} /><span>Paid Advertising</span><span className="lpr-legend-pct">28%</span></div>
                        <div className="lpr-source-legend-item"><div className="lpr-legend-dot" style={{ background: '#c4b5fd' }} /><span>Social Media</span><span className="lpr-legend-pct">18%</span></div>
                        <div className="lpr-source-legend-item"><div className="lpr-legend-dot" style={{ background: '#e2e8f0' }} /><span>Referrals</span><span className="lpr-legend-pct">12%</span></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="lpr-table-card">
                <div className="lpr-table-header">
                    <h3>Recent Leads Activity</h3>
                    <button className="lpr-view-all">View All Leads</button>
                </div>
                <table className="lpr-table">
                    <thead>
                        <tr>
                            <th>LEAD #</th>
                            <th>CUSTOMER NAME</th>
                            <th>STAGE</th>
                            <th>STATUS</th>
                            <th>ASSIGNED AGENT</th>
                            <th>CREATED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LEADS.map((lead) => (
                            <tr key={lead.num}>
                                <td className="lpr-lead-num">{lead.num}</td>
                                <td>
                                    <div className="lpr-customer">
                                        <div className="lpr-avatar">{lead.initials}</div>
                                        <span>{lead.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`lpr-stage ${lead.stageClass}`}>{lead.stage}</span>
                                </td>
                                <td>
                                    <div className={`lpr-status ${lead.statusClass}`}>
                                        <div className="lpr-status-dot" />
                                        {lead.status}
                                    </div>
                                </td>
                                <td className="lpr-agent">{lead.agent}</td>
                                <td className="lpr-date">{lead.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadPerformanceReport;
