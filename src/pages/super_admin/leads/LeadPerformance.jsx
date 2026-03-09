import React, { useState } from 'react';
import './LeadPerformance.css';

/* ─── DATA ─────────────────────────────────────── */
const FUNNEL_STAGES = [
    { label: 'Stage 01: Lead In',      pct: 100, count: 1482, color: '#2447d7' },
    { label: 'Stage 02: Contacted',    pct: 72,  count: 1067, color: '#93c5fd' },
    { label: 'Stage 03: Qualified',    pct: 48,  count: 711,  color: '#bfdbfe' },
    { label: 'Stage 04: Proposal Sent',pct: 32,  count: 474,  color: '#cbd5e1' },
    { label: 'Closed: Won',            pct: 24,  count: 367,  color: '#22c55e' },
];

const SOURCE_SEGMENTS = [
    { label: 'Direct Inbound',  pct: 42, color: '#2447d7' },
    { label: 'Paid Advertising',pct: 28, color: '#38bdf8' },
    { label: 'Social Media',    pct: 18, color: '#a78bfa' },
    { label: 'Referrals',       pct: 12, color: '#cbd5e1' },
];

const RECENT_LEADS = [
    { id: '#LD-9482', name: 'Jonathan Doe',  initials: 'JD', stage: 'STAGE 03',  stageClass: 'stage--03', status: 'Active',    statusClass: 'ls--active',    agent: 'Sarah Jenkins', date: 'Oct 24, 2023' },
    { id: '#LD-9481', name: 'Amanda Smith',  initials: 'AS', stage: 'STAGE 01',  stageClass: 'stage--01', status: 'Active',    statusClass: 'ls--active',    agent: 'Michael Ross',  date: 'Oct 24, 2023' },
    { id: '#LD-9480', name: 'Robert King',   initials: 'RK', stage: 'CLOSED WON',stageClass: 'stage--won',status: 'Completed', statusClass: 'ls--completed', agent: 'Sarah Jenkins', date: 'Oct 23, 2023' },
    { id: '#LD-9479', name: 'Emily Lawson',  initials: 'EL', stage: 'STAGE 04',  stageClass: 'stage--04', status: 'Urgent',    statusClass: 'ls--urgent',    agent: 'David Miller',  date: 'Oct 23, 2023' },
];

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

/* ─── KPI CARD ──────────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trendIcon, trendText, trendClass }) => (
    <div className="lp-kpi-card">
        <div className="lp-kpi-main">
            <div className="lp-kpi-icon" style={{ background: iconBg }}>{icon}</div>
            <div className="lp-kpi-texts">
                <span className="lp-kpi-label">{label}</span>
                <span className="lp-kpi-value">{value}</span>
            </div>
        </div>
        <div className={`lp-kpi-trend ${trendClass}`}>
            {trendIcon}
            <span>{trendText}</span>
        </div>
    </div>
);

/* ─── FUNNEL BAR ─────────────────────────────────── */
const FunnelBar = ({ label, pct, count, color }) => (
    <div className="lp-funnel-row">
        <div className="lp-funnel-meta">
            <span className="lp-funnel-label">{label}</span>
            <span className="lp-funnel-stat">{pct}% ({count.toLocaleString()})</span>
        </div>
        <div className="lp-funnel-track">
            <div className="lp-funnel-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
    </div>
);

/* ─── SOURCE DONUT ───────────────────────────────── */
const SourceDonut = () => {
    const r = 58;
    const cx = 80, cy = 80;
    const circ = 2 * Math.PI * r;
    let cumPct = 0;

    return (
        <svg viewBox="0 0 160 160" width="170" height="170">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="22" />
            {SOURCE_SEGMENTS.map(({ pct, color }) => {
                const dash = (pct / 100) * circ;
                const rotDeg = -90 + (cumPct / 100) * 360;
                cumPct += pct;
                return (
                    <circle key={color} cx={cx} cy={cy} r={r}
                        fill="none" stroke={color} strokeWidth="22"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeDashoffset="0"
                        transform={`rotate(${rotDeg} ${cx} ${cy})`}
                        strokeLinecap="butt"
                    />
                );
            })}
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="800"
                fill="#1a1f36" fontFamily="Sora,sans-serif">Source</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fontWeight="600"
                fill="#94a3b8" fontFamily="Sora,sans-serif" letterSpacing="0.8">METRICS</text>
        </svg>
    );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const LeadPerformance = () => {
    const [dateRange,   setDateRange]   = useState('Last 30 Days');
    const [agent,       setAgent]       = useState('All Agents');
    const [leadStage,   setLeadStage]   = useState('All Stages');
    const [leadStatus,  setLeadStatus]  = useState('Active');

    return (
        <div className="lp-wrapper">

            {/* ── TOPBAR ── */}
            <header className="lp-topbar">
                <nav className="lp-breadcrumb">
                    <span>Home</span>
                    <span className="lp-bc-sep">/</span>
                    <span>Reports</span>
                    <span className="lp-bc-sep">/</span>
                    <span className="lp-bc-active">Lead Performance</span>
                </nav>
                <div className="lp-topbar-right">
                    <div className="lp-search">
                        <IcoSearch />
                        <input placeholder="Quick search..." />
                    </div>
                    <button className="lp-icon-btn"><IcoBell /></button>
                </div>
            </header>

            <div className="lp-content">

                {/* ── PAGE HEADING ── */}
                <div className="lp-heading-row">
                    <div>
                        <h1 className="lp-title">Lead Performance Report</h1>
                        <p className="lp-subtitle">Detailed analysis of lead acquisition and conversion metrics.</p>
                    </div>
                    <div className="lp-export-btns">
                        <button className="lp-export-btn lp-export-btn--outline"><IcoFileCSV /> Export CSV</button>
                        <button className="lp-export-btn lp-export-btn--primary"><IcoFilePDF /> Export PDF</button>
                    </div>
                </div>

                {/* ── FILTERS ── */}
                <div className="lp-filters-card">
                    {[
                        { label: 'DATE RANGE',     value: dateRange,  setter: setDateRange,  opts: ['Last 30 Days','Last 90 Days','This Year'] },
                        { label: 'ASSIGNED AGENT', value: agent,      setter: setAgent,      opts: ['All Agents','Sarah Jenkins','Michael Ross','David Miller'] },
                        { label: 'LEAD STAGE',     value: leadStage,  setter: setLeadStage,  opts: ['All Stages','Stage 01','Stage 02','Stage 03','Stage 04','Closed Won'] },
                        { label: 'LEAD STATUS',    value: leadStatus, setter: setLeadStatus, opts: ['Active','Completed','Urgent','All'] },
                    ].map(f => (
                        <div className="lp-filter-group" key={f.label}>
                            <span className="lp-filter-label">{f.label}</span>
                            <div className="lp-select-wrap">
                                <select value={f.value} onChange={e => f.setter(e.target.value)}>
                                    {f.opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                                <IcoChevron />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── KPI CARDS ── */}
                <div className="lp-kpi-grid">
                    <KpiCard
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
                        label="Total Leads" value="1,482"
                        trendIcon={<IcoTrendUp />} trendText="+12.5% vs last month" trendClass="trend--up"
                    />
                    <KpiCard
                        iconBg="#dcfce7"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                        label="Conversion Rate" value="24.8%"
                        trendIcon={<IcoTrendUp />} trendText="+3.2% vs last month" trendClass="trend--up"
                    />
                    <KpiCard
                        iconBg="#fee2e2"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>}
                        label="Rejection Rate" value="12.1%"
                        trendIcon={<IcoTrendUp />} trendText="+1.4% vs last month" trendClass="trend--danger"
                    />
                    <KpiCard
                        iconBg="#fef9c3"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                        label="Avg Lead Aging" value="4.2 Days"
                        trendIcon={<IcoTrendDown />} trendText="-0.8 days improvement" trendClass="trend--up"
                    />
                </div>

                {/* ── CHARTS ROW ── */}
                <div className="lp-charts-row">
                    {/* Sales Funnel */}
                    <div className="lp-panel">
                        <h3 className="lp-panel-title">Sales Funnel Efficiency</h3>
                        <div className="lp-funnel-list">
                            {FUNNEL_STAGES.map(s => (
                                <FunnelBar key={s.label} {...s} />
                            ))}
                        </div>
                    </div>

                    {/* Lead Source */}
                    <div className="lp-panel">
                        <h3 className="lp-panel-title">Lead Source Breakdown</h3>
                        <div className="lp-source-body">
                            <SourceDonut />
                            <div className="lp-source-legend">
                                {SOURCE_SEGMENTS.map(({ label, pct, color }) => (
                                    <div className="lp-source-row" key={label}>
                                        <div className="lp-source-left">
                                            <span className="lp-legend-dot" style={{ background: color }} />
                                            <span className="lp-legend-label">{label}</span>
                                        </div>
                                        <span className="lp-legend-pct">{pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RECENT LEADS ── */}
                <div className="lp-table-card">
                    <div className="lp-table-header">
                        <span className="lp-panel-title">Recent Leads Activity</span>
                        <button className="lp-view-all">View All Leads</button>
                    </div>
                    <table className="lp-table">
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
                            {RECENT_LEADS.map(lead => (
                                <tr key={lead.id}>
                                    <td><span className="lp-ref-id">{lead.id}</span></td>
                                    <td>
                                        <div className="lp-customer">
                                            <div className="lp-avatar">{lead.initials}</div>
                                            <span className="lp-customer-name">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td><span className={`lp-stage-badge ${lead.stageClass}`}>{lead.stage}</span></td>
                                    <td>
                                        <span className={`lp-status ${lead.statusClass}`}>
                                            <span className="lp-status-dot" />
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td><span className="lp-agent">{lead.agent}</span></td>
                                    <td><span className="lp-date">{lead.date}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default LeadPerformance;
