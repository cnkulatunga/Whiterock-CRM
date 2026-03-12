import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

/* ─── ICONS ─────────────────────────────────── */
const IcoTrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
);
const IcoTrendDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    </svg>
);

/* ─── KPI CARD ────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
    <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default">
        <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
                {icon}
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                trend === 'up' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' :
                trend === 'down' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]' :
                'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
            }`}>
                {trend === 'up' && <IcoTrendUp />}
                {trend === 'down' && <IcoTrendDown />}
                <span>{trendLabel}</span>
            </div>
        </div>
        <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-bold text-[#1a202c]">{value}</div>
    </div>
);

/* ─── RECENT ACTIVITY ─────────────────────── */
const ACTIVITIES = [
    { color: '#16a34a', label: 'Loan Approved',       detail: 'Ref #4821 — $42,000',           time: '2m ago' },
    { color: '#2447d7', label: 'New Lead Submitted',  detail: 'by Agent Sarah Miller',          time: '8m ago' },
    { color: '#0ea5e9', label: 'Document Uploaded',   detail: 'KYC — John M.',                  time: '15m ago' },
    { color: '#dc2626', label: 'Loan Rejected',       detail: 'Ref #4819 — insufficient docs',  time: '34m ago' },
    { color: '#7c3aed', label: 'New User Registered', detail: 'Agent — Emily Tan',              time: '1h ago' },
    { color: '#16a34a', label: 'Deal Closed',         detail: '$28,500 — Priya Nair',           time: '2h ago' },
];

const RecentActivity = () => (
    <div className="flex flex-col divide-y divide-[#f7fafc]">
        {ACTIVITIES.map((a, i) => (
            <div key={i}
                className="flex items-center gap-3 py-3 hover:bg-[#f8faff] rounded-lg px-2 transition-colors animate-memberSlide"
                style={{ animationDelay: `${i * 60}ms` }}
            >
                <div className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200 hover:scale-150" style={{ background: a.color }} />
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-[#1a202c]">{a.label}</span>
                    <span className="text-[12px] text-[#718096]">{a.detail}</span>
                </div>
                <span className="text-[11px] text-[#a0aec0] whitespace-nowrap">{a.time}</span>
            </div>
        ))}
    </div>
);

/* ─── DONUT CHART ─────────────────────────── */
const DONUT_DATA = [
    { label: 'Active Deals',  pct: 46, color: '#2447d7' },
    { label: 'Approved',      pct: 33, color: '#16a34a' },
    { label: 'Pending Loans', pct: 13, color: '#f59e0b' },
    { label: 'Rejected',      pct: 8,  color: '#dc2626' },
];

const DonutChart = () => {
    const [hovered, setHovered] = useState(null);
    const [drawn, setDrawn] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const t = setTimeout(() => setDrawn(true), 150);
        return () => clearTimeout(t);
    }, []);

    const r = 68, cx = 90, cy = 90;
    const circ = 2 * Math.PI * r;
    const GAP_PX = 7;
    let cumPct = 0;
    const hovSeg = hovered !== null ? DONUT_DATA[hovered] : null;

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-[180px] h-[180px] mx-auto">
                <svg viewBox="0 0 180 180" className="w-full h-full">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="20" />
                    {DONUT_DATA.map(({ pct, color, label }, i) => {
                        const startPct = cumPct;
                        cumPct += pct;
                        const rotDeg = -90 + (startPct / 100) * 360;
                        const dash = Math.max(0, (pct / 100) * circ - GAP_PX);
                        const isHov = hovered === i;
                        return (
                            <circle
                                key={label}
                                cx={cx} cy={cy} r={r}
                                fill="none"
                                stroke={color}
                                strokeWidth={isHov ? 27 : 20}
                                strokeDasharray={drawn ? `${dash} ${circ}` : `0 ${circ}`}
                                strokeDashoffset="0"
                                transform={`rotate(${rotDeg} ${cx} ${cy})`}
                                style={{
                                    transition: `stroke-dasharray 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${300 + i * 150}ms, stroke-width 0.25s ease, opacity 0.25s ease, filter 0.25s ease`,
                                    opacity: hovered !== null && !isHov ? 0.25 : 1,
                                    filter: isHov ? `drop-shadow(0 0 8px ${color}cc)` : 'none',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div
                        className="text-[22px] font-bold leading-none transition-all duration-200"
                        style={{ color: hovSeg ? hovSeg.color : (isDark ? '#e4ecff' : '#1a202c') }}
                    >
                        {hovSeg ? `${hovSeg.pct}%` : '978'}
                    </div>
                    <div className="text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest mt-1.5 transition-all duration-200">
                        {hovSeg ? hovSeg.label : 'TOTAL DEALS'}
                    </div>
                </div>
            </div>
            {/* Legend with progress bars */}
            <div className="flex flex-col gap-3">
                {DONUT_DATA.map(({ label, pct, color }, i) => (
                    <div key={label} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                                <span className="text-[12px] font-medium text-[#4a5568]">{label}</span>
                            </div>
                            <span
                                className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                                style={{ color, background: `${color}1a` }}
                            >{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden ml-4">
                            <div
                                className="h-full rounded-full animate-progressFill"
                                style={{
                                    width: `${pct}%`,
                                    background: color,
                                    transformOrigin: 'left',
                                    animationDelay: `${650 + i * 150}ms`,
                                    animationFillMode: 'both',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── QUICK ACTION ────────────────────────── */
const QuickAction = ({ icon, iconBg, title, desc, onClick }) => (
    <button
        className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] hover:bg-white hover:border-[#e2e8f0] hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex-1 min-w-[200px]"
        onClick={onClick}
    >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: iconBg }}>
            {icon}
        </div>
        <div>
            <div className="text-[14px] font-semibold text-[#1a202c]">{title}</div>
            <div className="text-[12px] text-[#718096]">{desc}</div>
        </div>
    </button>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const SuperAdminDashboard = ({ onNavigate }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.first_name || 'Admin';

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── PAGE HEADING ── */}
            <header className="animate-headerDrop">
                <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Super Admin Overview</h1>
                <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Welcome back, {firstName}. Here's what's happening today.</p>
            </header>

            {/* ── TOP ROW: KPI CARDS ── */}
            <div className="grid grid-cols-3 gap-5 lg:grid-cols-1">
                <div className="animate-kpiPop [animation-delay:100ms] [animation-fill-mode:both]">
                    <KpiCard
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
                        label="Total Leads" value="12,840" trend="up" trendLabel="+12%"
                    />
                </div>

                {/* Monthly Revenue card */}
                <div className="bg-gradient-to-br from-[#2447d7] to-[#1a38b8] rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:200ms] [animation-fill-mode:both]">
                    <div className="absolute -right-2 -top-2 opacity-10">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" width="90" height="90">
                            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <div className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-2">Monthly Revenue</div>
                        <div className="text-3xl font-bold text-white mb-4">$2.4M</div>
                        <div className="flex items-center gap-1.5 bg-[#10b981]/20 text-[#6ee7b7] px-2.5 py-1 rounded-lg w-fit">
                            <IcoTrendUp />
                            <span className="text-[11px] font-medium">18% Increase vs. Last Month</span>
                        </div>
                    </div>
                </div>

                {/* Document Pending */}
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:300ms] [animation-fill-mode:both]">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#f0f9ff] rounded-xl flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">Document Pending Verification</div>
                            <div className="text-2xl font-bold text-[#1a202c]">45</div>
                        </div>
                    </div>
                    <div className="h-1.5 bg-[#f1f5f9] rounded-full mb-3 overflow-hidden">
                        <div className="h-full w-[30%] bg-[#0ea5e9] rounded-full" />
                    </div>
                    <div className="text-[11px] text-[#718096]">Needs executive approval (Priority 1)</div>
                </div>
            </div> {/* end KPI grid */}

            {/* ── QUICK ACTIONS ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm animate-slideUp [animation-delay:350ms] [animation-fill-mode:both]">
                <h3 className="text-[13px] font-semibold text-[#1a202c] mb-4">Quick Actions</h3>
                <div className="flex gap-4 flex-wrap">
                    <QuickAction
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                        title="Manage Leaders" desc="Review team leader performance"
                        onClick={() => onNavigate && onNavigate('team-leaders')}
                    />
                    <QuickAction
                        iconBg="#f3e8ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                        title="Finance Report" desc="Access revenue & transactions"
                        onClick={() => onNavigate && onNavigate('finance')}
                    />
                    <QuickAction
                        iconBg="#e0f2fe"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                        title="Manage Users" desc="Update permissions & access"
                        onClick={() => onNavigate && onNavigate('user-management')}
                    />
                </div>
            </section>

            {/* ── BOTTOM: ACTIVITY + DEAL STATUS ── */}
            <div className="grid grid-cols-[1fr_320px] gap-5 xl:grid-cols-1">
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm animate-slideUp [animation-delay:450ms] [animation-fill-mode:both]">
                    <h3 className="text-[13px] font-semibold text-[#1a202c] mb-2">Recent Activity</h3>
                    <RecentActivity />
                </section>
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm animate-slideUp [animation-delay:550ms] [animation-fill-mode:both]">
                    <div className="mb-4">
                        <h3 className="text-[13px] font-bold text-[#1a202c]">Deal Status Overview</h3>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5 font-medium">Hover segments for details</p>
                    </div>
                    <DonutChart />
                </section>
            </div>

        </div>
    );
};

export default SuperAdminDashboard;
