import React, { useState } from 'react';
import './AuditLogs.css';

const LOGS = [
    {
        date: 'Oct 24, 2023', time: '14:23:45 EST',
        initials: 'JD', name: 'Jane Doe', role: 'Compliance', roleClass: 'role-compliance',
        icon: 'verify',
        action: <>Verified identity docs for <strong>#WR-2026-0442</strong></>,
    },
    {
        date: 'Oct 24, 2023', time: '13:10:12 EST',
        initials: 'MS', name: 'Marcus Smith', role: 'Admin', roleClass: 'role-admin',
        icon: 'payment',
        action: <>Approved Payment for <strong>#WR-2026-0001</strong></>,
    },
    {
        date: 'Oct 24, 2023', time: '12:55:30 EST',
        initials: 'RK', name: 'Riley King', role: 'Sales', roleClass: 'role-sales',
        icon: 'edit',
        action: <>Modified contact details on lead <strong>#WR-2026-0511</strong></>,
    },
    {
        date: 'Oct 24, 2023', time: '11:42:01 EST',
        initials: 'SY', name: 'System Automation', role: 'Service', roleClass: 'role-service',
        icon: 'auto',
        action: <>Lender Decision: <strong className="auto-approved">Auto-Approved</strong> for #WR-2026-0492</>,
    },
    {
        date: 'Oct 24, 2023', time: '10:05:19 EST',
        initials: 'AH', name: 'Alex Hunter', role: 'Manager', roleClass: 'role-manager',
        icon: 'reject',
        action: <>Rejected Payment Approval for <strong>#WR-2026-0032</strong></>,
    },
];

const LOG_ICON = {
    verify:  { bg: '#eff6ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    payment: { bg: '#f0fdf4', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    edit:    { bg: '#fefce8', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    auto:    { bg: '#f5f3ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    reject:  { bg: '#fef2f2', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
};

const AuditLogs = () => {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('Last 24 Hours');
    const [category, setCategory] = useState('All Categories');
    const [userRole, setUserRole] = useState('Any Role');

    return (
        <div className="al-page">
            {/* Header */}
            <div className="al-header">
                <div>
                    <h1 className="al-title">System Audit Logs</h1>
                    <p className="al-subtitle">Review comprehensive history of all administrative and system-level actions.</p>
                </div>
                <div className="al-header-actions">
                    <button className="al-export-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export CSV
                    </button>
                    <button className="al-refresh-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Refresh Logs
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="al-filters">
                <div className="al-filter-group al-filter-search">
                    <span className="al-filter-label">SEARCH LOGS</span>
                    <div className="al-search-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Lead #, user name, or action k..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="al-filter-group">
                    <span className="al-filter-label">DATE RANGE</span>
                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="al-select">
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="al-filter-group">
                    <span className="al-filter-label">CATEGORY</span>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="al-select">
                        <option>All Categories</option>
                        <option>Payments</option>
                        <option>Leads</option>
                        <option>Documents</option>
                        <option>System</option>
                    </select>
                </div>
                <div className="al-filter-group">
                    <span className="al-filter-label">USER ROLE</span>
                    <select value={userRole} onChange={e => setUserRole(e.target.value)} className="al-select">
                        <option>Any Role</option>
                        <option>Admin</option>
                        <option>Manager</option>
                        <option>Compliance</option>
                        <option>Sales</option>
                        <option>Service</option>
                    </select>
                </div>
                <div className="al-filter-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <line x1="4" y1="6" x2="20" y2="6"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                        <line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                </div>
            </div>

            {/* Logs Table */}
            <div className="al-table-card">
                <div className="al-table-head">
                    <span>TIMESTAMP</span>
                    <span>USER</span>
                    <span>ACTION</span>
                </div>
                <div className="al-logs">
                    {LOGS.map((log, i) => {
                        const icon = LOG_ICON[log.icon];
                        return (
                            <div className="al-log-row" key={i}>
                                <div className="al-log-time">
                                    <span className="al-log-date">{log.date}</span>
                                    <span className="al-log-ts">{log.time}</span>
                                </div>
                                <div className="al-log-user">
                                    <div className="al-log-avatar">{log.initials}</div>
                                    <div>
                                        <div className="al-log-name">{log.name}</div>
                                        <span className={`al-log-role ${log.roleClass}`}>{log.role}</span>
                                    </div>
                                </div>
                                <div className="al-log-action">
                                    <div className="al-log-action-icon" style={{ background: icon.bg }}>
                                        {icon.svg}
                                    </div>
                                    <span>{log.action}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="al-pagination">
                    <span className="al-pag-info">Showing <strong>1 – 5</strong> of <strong>1,284</strong> log entries</span>
                    <div className="al-pag-btns">
                        <button className="al-pag-btn" disabled>‹</button>
                        <button className="al-pag-btn al-pag-btn--active">1</button>
                        <button className="al-pag-btn">2</button>
                        <button className="al-pag-btn">3</button>
                        <span className="al-pag-ellipsis">…</span>
                        <button className="al-pag-btn">257</button>
                        <button className="al-pag-btn">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
