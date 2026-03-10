import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AuditLogs.css';

/* ─── SAMPLE DATA ─────────────────────────────── */
const LOG_ENTRIES = [
    {
        id: 1,
        date: 'Oct 24, 2023',
        time: '14:23:45 EST',
        initials: 'JD',
        avatarBg: '#22c55e',
        avatarText: '#fff',
        name: 'Jane Doe',
        roleLabel: 'Compliance',
        roleClass: 'role--compliance',
        actionIcon: 'verify',
        actionText: 'Verified identity docs for',
        refId: '#WR-2026-0442',
    },
    {
        id: 2,
        date: 'Oct 24, 2023',
        time: '13:10:12 EST',
        initials: 'MS',
        avatarBg: '#3b82f6',
        avatarText: '#fff',
        name: 'Marcus Smith',
        roleLabel: 'Admin',
        roleClass: 'role--admin',
        actionIcon: 'payment',
        actionText: 'Approved Payment for',
        refId: '#WR-2026-0001',
    },
    {
        id: 3,
        date: 'Oct 24, 2023',
        time: '12:55:30 EST',
        initials: 'RK',
        avatarBg: '#f472b6',
        avatarText: '#fff',
        name: 'Riley King',
        roleLabel: 'Sales',
        roleClass: 'role--sales',
        actionIcon: 'edit',
        actionText: 'Modified contact details on lead',
        refId: '#WR-2026-0511',
    },
    {
        id: 4,
        date: 'Oct 24, 2023',
        time: '11:42:01 EST',
        initials: 'SYS',
        avatarBg: '#475569',
        avatarText: '#fff',
        name: 'System Automation',
        roleLabel: 'Service',
        roleClass: 'role--service',
        actionIcon: 'auto',
        actionText: 'Lender Decision:',
        autoApproved: true,
        refId: '#WR-2026-0492',
    },
    {
        id: 5,
        date: 'Oct 24, 2023',
        time: '10:05:19 EST',
        initials: 'AH',
        avatarBg: '#f97316',
        avatarText: '#fff',
        name: 'Alex Hunter',
        roleLabel: 'Manager',
        roleClass: 'role--manager',
        actionIcon: 'reject',
        actionText: 'Rejected Payment Approval for',
        refId: '#WR-2026-0032',
    },
];

const TOTAL_ENTRIES = 1284;

/* ─── ACTION ICONS ──────────────────────────────── */
const ActionIcon = ({ type }) => {
    switch (type) {
        case 'verify':
            return (
                <div className="al-action-icon al-action-icon--blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
            );
        case 'payment':
            return (
                <div className="al-action-icon al-action-icon--green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                </div>
            );
        case 'edit':
            return (
                <div className="al-action-icon al-action-icon--amber">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </div>
            );
        case 'auto':
            return (
                <div className="al-action-icon al-action-icon--slate">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                </div>
            );
        case 'reject':
            return (
                <div className="al-action-icon al-action-icon--red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </div>
            );
        default: return null;
    }
};

/* ─── ICONS ─────────────────────────────────────── */
const IcoSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IcoBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IcoSettings = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);
const IcoDownload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);
const IcoRefresh = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);
const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IcoFilter = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const AuditLogs = () => {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('Last 24 Hours');
    const [category, setCategory] = useState('All Categories');
    const [userRole, setUserRole] = useState('Any Role');
    const [currentPage, setCurrentPage] = useState(1);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const adminName = `${user.first_name || 'Admin'} ${user.last_name || 'User'}`.trim();

    const filtered = LOG_ENTRIES.filter(e =>
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.refId.toLowerCase().includes(search.toLowerCase()) ||
        e.actionText.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="al-wrapper">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="al-mobile-header-actions">
                    <div className="al-search-wrap al-search-wrap--mobile">
                        <IcoSearch />
                        <input
                            className="al-global-search"
                            type="text"
                            placeholder="Global search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            {/* ── TOPBAR (Desktop only on mobile) ── */}
            <header className="al-topbar">
                <div />
                <div className="al-search-wrap">
                    <IcoSearch />
                    <input
                        className="al-global-search"
                        type="text"
                        placeholder="Global search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="al-content">

                {/* ── PAGE HEADING ── */}
                <div className="al-heading-row">
                    <div>
                        <h1 className="al-title">System Audit Logs</h1>
                        <p className="al-subtitle">Review comprehensive history of all administrative and system-level actions.</p>
                    </div>
                    <div className="al-action-btns">
                        <button className="al-btn al-btn--outline"><IcoDownload /> Export CSV</button>
                        <button className="al-btn al-btn--primary"><IcoRefresh /> Refresh Logs</button>
                    </div>
                </div>

                {/* ── FILTERS ── */}
                <div className="al-filters-card">
                    <div className="al-filter-group al-filter-search">
                        <span className="al-filter-label">SEARCH LOGS</span>
                        <div className="al-search-field">
                            <IcoSearch />
                            <input
                                type="text"
                                placeholder="Lead #, user name, or action keyword..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="al-filter-divider" />
                    <div className="al-filter-group">
                        <span className="al-filter-label">DATE RANGE</span>
                        <div className="al-select-wrap">
                            <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                            <IcoChevron />
                        </div>
                    </div>
                    <div className="al-filter-divider" />
                    <div className="al-filter-group">
                        <span className="al-filter-label">CATEGORY</span>
                        <div className="al-select-wrap">
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option>All Categories</option>
                                <option>Payment</option>
                                <option>Lead</option>
                                <option>User</option>
                                <option>System</option>
                            </select>
                            <IcoChevron />
                        </div>
                    </div>
                    <div className="al-filter-divider" />
                    <div className="al-filter-group">
                        <span className="al-filter-label">USER ROLE</span>
                        <div className="al-select-wrap">
                            <select value={userRole} onChange={e => setUserRole(e.target.value)}>
                                <option>Any Role</option>
                                <option>Admin</option>
                                <option>Compliance</option>
                                <option>Sales</option>
                                <option>Manager</option>
                                <option>Service</option>
                            </select>
                            <IcoChevron />
                        </div>
                    </div>
                    <button className="al-filter-icon-btn" title="Advanced filters">
                        <IcoFilter />
                    </button>
                </div>

                {/* ── LOG TABLE ── */}
                <div className="al-table-card">
                    <div className="al-table-cols">
                        <span className="al-col-head">TIMESTAMP</span>
                        <span className="al-col-head">USER</span>
                        <span className="al-col-head">ACTION</span>
                    </div>

                    <div className="al-log-list">
                        {filtered.map((entry, idx) => (
                            <div className="al-log-row" key={entry.id}
                                style={{ animationDelay: `${idx * 0.06}s` }}>

                                {/* Timestamp */}
                                <div className="al-log-timestamp">
                                    <span className="al-log-date">{entry.date}</span>
                                    <span className="al-log-time">{entry.time}</span>
                                </div>

                                {/* User */}
                                <div className="al-log-user">
                                    <div className="al-log-avatar"
                                        style={{ background: entry.avatarBg, color: entry.avatarText }}>
                                        {entry.initials}
                                    </div>
                                    <div className="al-log-user-info">
                                        <span className="al-log-name">{entry.name}</span>
                                        <span className={`al-log-role ${entry.roleClass}`}>{entry.roleLabel}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="al-log-action">
                                    <ActionIcon type={entry.actionIcon} />
                                    <span className="al-log-action-text">
                                        {entry.actionText}{' '}
                                        {entry.autoApproved && (
                                            <><em className="al-auto-approved">Auto-Approved</em>{' '}for {entry.refId}</>
                                        )}
                                        {!entry.autoApproved && (
                                            <strong>{entry.refId}</strong>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="al-pagination">
                        <span className="al-pagination-info">
                            Showing <strong>1 – 5</strong> of <strong>{TOTAL_ENTRIES.toLocaleString()}</strong> log entries
                        </span>
                        <div className="al-page-btns">
                            <button className="al-page-btn"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}>‹</button>
                            {[1, 2, 3].map(p => (
                                <button key={p}
                                    className={`al-page-btn ${currentPage === p ? 'al-page-btn--active' : ''}`}
                                    onClick={() => setCurrentPage(p)}>{p}</button>
                            ))}
                            <span className="al-page-ellipsis">…</span>
                            <button className="al-page-btn"
                                onClick={() => setCurrentPage(257)}>257</button>
                            <button className="al-page-btn"
                                onClick={() => setCurrentPage(p => Math.min(257, p + 1))}
                                disabled={currentPage === 257}>›</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuditLogs;
