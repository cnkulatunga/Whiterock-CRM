import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './FinanceReport.css';

/* ─── SAMPLE DATA ─────────────────────────────── */
const TRANSACTIONS = [
    { id: '#TRX-82910', lead: 'LD-4421', name: 'Alice Simpson', initials: 'AS', amount: '$4,250.00', date: 'Oct 24, 2023', status: 'Approved' },
    { id: '#TRX-82911', lead: 'LD-4422', name: 'Brian Miller', initials: 'BM', amount: '$1,800.00', date: 'Oct 24, 2023', status: 'Pending' },
    { id: '#TRX-82912', lead: 'LD-4423', name: 'Catherine West', initials: 'CW', amount: '$12,400.00', date: 'Oct 23, 2023', status: 'Approved' },
    { id: '#TRX-82913', lead: 'LD-4424', name: 'David King', initials: 'DK', amount: '$750.00', date: 'Oct 23, 2023', status: 'Rejected' },
    { id: '#TRX-82914', lead: 'LD-4425', name: 'Emma Lee', initials: 'EL', amount: '$3,120.00', date: 'Oct 22, 2023', status: 'Approved' },
];

const BAR_DATA = [
    { label: 'Jan', a: 45, b: 30 },
    { label: 'Feb', a: 58, b: 40 },
    { label: 'Mar', a: 62, b: 52 },
    { label: 'Apr', a: 75, b: 68 },
    { label: 'May', a: 88, b: 80 },
    { label: 'Jun', a: 95, b: 100 },
];

const DONUT_SEGMENTS = [
    { label: 'Approved', pct: 75, color: '#22c55e' },
    { label: 'Pending', pct: 10, color: '#f59e0b' },
    { label: 'Rejected', pct: 15, color: '#ef4444' },
];

/* ─── ICONS ────────────────────────────────────── */
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
const IcoCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IcoTrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
);
const IcoTrendDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    </svg>
);
const IcoFileCSV = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);
const IcoFilePDF = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

/* ─── KPI CARD ─────────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
    <div className="fr-kpi-card">
        <div className="fr-kpi-top">
            <div className="fr-kpi-icon" style={{ background: iconBg }}>{icon}</div>
            <div className={`fr-kpi-badge ${trend === 'up' ? 'badge--up' : trend === 'down' ? 'badge--down' : 'badge--flat'}`}>
                {trend === 'up' && <IcoTrendUp />}
                {trend === 'down' && <IcoTrendDown />}
                <span>{trendLabel}</span>
            </div>
        </div>
        <div className="fr-kpi-label">{label}</div>
        <div className="fr-kpi-value">{value}</div>
    </div>
);

/* ─── BAR CHART ─────────────────────────────────── */
const BarChart = () => {
    const maxA = Math.max(...BAR_DATA.map(d => d.a));
    const maxB = Math.max(...BAR_DATA.map(d => d.b));
    const max = Math.max(maxA, maxB);
    return (
        <div className="fr-bar-chart">
            {BAR_DATA.map((d) => (
                <div className="fr-bar-col" key={d.label}>
                    <div className="fr-bar-pair">
                        <div className="fr-bar fr-bar--a" style={{ height: `${(d.a / max) * 100}%` }} />
                        <div className="fr-bar fr-bar--b" style={{ height: `${(d.b / max) * 100}%` }} />
                    </div>
                    <span className="fr-bar-label">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── DONUT CHART ───────────────────────────────── */
const DonutChart = () => {
    const r = 52;
    const cx = 70;
    const cy = 70;
    const circ = 2 * Math.PI * r;
    let cumPct = 0;
    return (
        <svg viewBox="0 0 140 140" width="148" height="148">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="15" />
            {DONUT_SEGMENTS.map(({ pct, color }) => {
                const dash = (pct / 100) * circ;
                const rotDeg = -90 + (cumPct / 100) * 360;
                cumPct += pct;
                return (
                    <circle key={color} cx={cx} cy={cy} r={r}
                        fill="none" stroke={color} strokeWidth="15"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeDashoffset="0"
                        transform={`rotate(${rotDeg} ${cx} ${cy})`}
                        strokeLinecap="butt"
                    />
                );
            })}
            {/* Center */}
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="20" fontWeight="800"
                fill="#1a1f36" fontFamily="Sora,sans-serif">94%</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fontWeight="600"
                fill="#94a3b8" fontFamily="Sora,sans-serif" letterSpacing="0.8">SUCCESS RATE</text>
        </svg>
    );
};

/* ─── TRANSACTION STATUS BADGE ─────────────────── */
const StatusBadge = ({ status }) => (
    <span className={`fr-status-badge status--${status.toLowerCase()}`}>{status}</span>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const FinanceReport = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [status, setStatus] = useState('All');
    const [manager, setManager] = useState('All Managers');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    return (
        <div className="fr-wrapper">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="fr-mobile-header-actions">
                    <div className="fr-search fr-search--mobile">
                        <IcoSearch />
                        <input placeholder="Search reports..." />
                    </div>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            {/* ── TOPBAR (Desktop only on mobile) ── */}
            <header className="fr-topbar">
                <div />
                <div className="fr-topbar-right">
                    <div className="fr-search">
                        <IcoSearch />
                        <input placeholder="Search reports..." />
                    </div>
                </div>
            </header>

            <div className="fr-content">

                {/* ── PAGE HEADING + FILTERS ── */}
                <div className="fr-heading-row">
                    <div>
                        <h1 className="fr-title">Financial Report</h1>
                        <p className="fr-subtitle">Real-time financial tracking and payment analysis</p>
                    </div>
                    <div className="fr-filters">
                        <div className="fr-filter-btn">
                            <IcoCalendar />
                            <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
                                <option>Last 30 Days</option>
                                <option>Last 90 Days</option>
                                <option>This Year</option>
                            </select>
                            <IcoChevron />
                        </div>
                        <div className="fr-filter-btn">
                            <span className="fr-filter-label-text">STATUS:</span>
                            <select value={status} onChange={e => setStatus(e.target.value)}>
                                <option>All</option>
                                <option>Approved</option>
                                <option>Pending</option>
                                <option>Rejected</option>
                            </select>
                            <IcoChevron />
                        </div>
                        <div className="fr-filter-btn">
                            <span className="fr-filter-label-text">MANAGER:</span>
                            <select value={manager} onChange={e => setManager(e.target.value)}>
                                <option>All Managers</option>
                                <option>Sarah Miller</option>
                                <option>James Chen</option>
                            </select>
                            <IcoChevron />
                        </div>
                    </div>
                </div>

                {/* ── KPI CARDS ── */}
                <div className="fr-kpi-grid">
                    <KpiCard
                        iconBg="#dcfce7"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
                        label="Total Loans" value="$428,540.00" trend="up" trendLabel="+12%"
                    />
                    <KpiCard
                        iconBg="#fef3c7"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                        label="Pending Loans" value="$42,180.50" trend="flat" trendLabel="-0%"
                    />
                    <KpiCard
                        iconBg="#fee2e2"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
                        label="Rejected Loans" value="$8,240.00" trend="down" trendLabel="-4%"
                    />
                    <KpiCard
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                        label="Monthly Revenue" value="$156,200.00" trend="up" trendLabel="+8%"
                    />
                </div>

                {/* ── CHARTS ROW ── */}
                <div className="fr-charts-row">
                    {/* Bar Chart */}
                    <div className="fr-chart-card">
                        <div className="fr-chart-header">
                            <span className="fr-chart-title">Monthly Revenue Trend</span>
                            <div className="fr-chart-legend">
                                <span className="fr-legend-dot" style={{ background: '#2447d7' }} />
                                <span className="fr-legend-text">Revenue</span>
                            </div>
                        </div>
                        <BarChart />
                    </div>

                    {/* Donut Chart */}
                    <div className="fr-donut-card">
                        <div className="fr-chart-title" style={{ marginBottom: 20 }}>Payment Status Distribution</div>
                        <div className="fr-donut-wrap">
                            <DonutChart />
                        </div>
                        <div className="fr-donut-legend">
                            {DONUT_SEGMENTS.map(({ label, pct, color }) => (
                                <div className="fr-donut-legend-row" key={label}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="fr-legend-dot" style={{ background: color }} />
                                        <span className="fr-legend-label">{label}</span>
                                    </div>
                                    <span className="fr-legend-pct">{pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── TRANSACTION HISTORY ── */}
                <div className="fr-table-card">
                    <div className="fr-table-header">
                        <span className="fr-chart-title">Transaction History</span>
                        <div className="fr-export-btns">
                            <button className="fr-export-btn fr-export-btn--outline">
                                <IcoFileCSV /> Export CSV
                            </button>
                            <button className="fr-export-btn fr-export-btn--primary">
                                <IcoFilePDF /> Export PDF
                            </button>
                        </div>
                    </div>

                    <table className="fr-table">
                        <thead>
                            <tr>
                                <th>REF ID</th>
                                <th>LEAD #</th>
                                <th>CUSTOMER NAME</th>
                                <th>AMOUNT</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TRANSACTIONS.map(t => (
                                <tr key={t.id}>
                                    <td><span className="fr-ref-id">{t.id}</span></td>
                                    <td><span className="fr-lead">{t.lead}</span></td>
                                    <td>
                                        <div className="fr-customer">
                                            <div className="fr-avatar">{t.initials}</div>
                                            <span className="fr-customer-name">{t.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="fr-amount">{t.amount}</span></td>
                                    <td><span className="fr-date">{t.date}</span></td>
                                    <td><StatusBadge status={t.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="fr-pagination">
                        <span className="fr-pagination-info">Showing 1 to 5 of 128 transactions</span>
                        <div className="fr-page-btns">
                            <button className="fr-page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`fr-page-btn ${currentPage === p ? 'fr-page-btn--active' : ''}`}
                                    onClick={() => setCurrentPage(p)}>{p}</button>
                            ))}
                            <button className="fr-page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FinanceReport;
