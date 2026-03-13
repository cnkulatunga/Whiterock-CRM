import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const TRANSACTIONS = [
    { id: '#TRX-82910', lead: 'LD-4421', name: 'Alice Simpson',   initials: 'AS', bg: '#ebf0ff', tc: '#2447d7', amount: '$4,250.00',  date: 'Oct 24, 2023', status: 'Approved', manager: 'Alex Thompson' },
    { id: '#TRX-82911', lead: 'LD-4422', name: 'Brian Miller',    initials: 'BM', bg: '#ecfdf5', tc: '#059669', amount: '$1,800.00',  date: 'Oct 24, 2023', status: 'Pending', manager: 'Sarah Miller' },
    { id: '#TRX-82912', lead: 'LD-4423', name: 'Catherine West',  initials: 'CW', bg: '#fff7ed', tc: '#ea580c', amount: '$12,400.00', date: 'Oct 23, 2023', status: 'Approved', manager: 'Alex Thompson' },
    { id: '#TRX-82913', lead: 'LD-4424', name: 'David King',      initials: 'DK', bg: '#f3e8ff', tc: '#7c3aed', amount: '$750.00',    date: 'Oct 23, 2023', status: 'Rejected', manager: 'James Chen' },
    { id: '#TRX-82914', lead: 'LD-4425', name: 'Emma Lee',        initials: 'EL', bg: '#e0f2fe', tc: '#0ea5e9', amount: '$3,120.00',  date: 'Oct 22, 2023', status: 'Approved', manager: 'Alex Thompson' },
];

const BAR_DATA = [
    { label: 'Jan', revenue: 120, target: 100 },
    { label: 'Feb', revenue: 148, target: 130 },
    { label: 'Mar', revenue: 162, target: 150 },
    { label: 'Apr', revenue: 195, target: 175 },
    { label: 'May', revenue: 228, target: 200 },
    { label: 'Jun', revenue: 256, target: 240 },
];

const DONUT_SEGMENTS = [
    { label: 'Approved', pct: 75, color: '#22c55e' },
    { label: 'Pending',  pct: 10, color: '#f59e0b' },
    { label: 'Rejected', pct: 15, color: '#ef4444' },
];

const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
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

const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
    <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>{icon}</div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
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
        <div className="text-xl font-bold text-[#1a202c]">{value}</div>
    </div>
);

const BarChart = () => {
    const [hovered, setHovered] = useState(null);
    const max = Math.max(...BAR_DATA.map(d => Math.max(d.revenue, d.target)));
    const yTicks = [0, 25, 50, 75, 100];
    const fmt = v => `$${v}k`;

    return (
        <div className="relative select-none">
            {/* Y-axis grid */}
            <div className="absolute left-0 right-0 top-0 flex flex-col justify-between pointer-events-none" style={{ bottom: '32px' }}>
                {[...yTicks].reverse().map(t => (
                    <div key={t} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#cbd5e1] font-medium w-5 text-right shrink-0">{t}%</span>
                        <div className="flex-1 border-t border-dashed border-[#f1f5f9]" />
                    </div>
                ))}
            </div>

            {/* Bars */}
            <div className="flex items-end gap-3 pl-10" style={{ height: '220px', paddingBottom: '32px', paddingTop: '8px' }}>
                {BAR_DATA.map((d, i) => {
                    const revH = (d.revenue / max) * 100;
                    const tarH = (d.target / max) * 100;
                    const isHov = hovered === i;
                    return (
                        <div
                            key={d.label}
                            className="relative flex flex-col items-center justify-end flex-1 h-full cursor-pointer"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* Tooltip */}
                            {isHov && (
                                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a202c] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap z-20 animate-fadeIn shadow-lg">
                                    {fmt(d.revenue)}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a202c]" />
                                </div>
                            )}

                            {/* Bar group */}
                            <div className="flex items-end gap-1.5 w-full justify-center" style={{ height: '100%' }}>
                                {/* Target bar */}
                                <div
                                    className="rounded-t-xl transition-all duration-300"
                                    style={{
                                        width: '14px',
                                        height: `${tarH}%`,
                                        background: isHov
                                            ? 'linear-gradient(180deg,#c7d2fe,#a5b4fc)'
                                            : 'linear-gradient(180deg,#e0e7ff,#c7d2fe)',
                                        animation: `barGrow 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 75}ms both`,
                                    }}
                                />
                                {/* Revenue bar */}
                                <div
                                    className="rounded-t-xl transition-all duration-300"
                                    style={{
                                        width: '14px',
                                        height: `${revH}%`,
                                        background: isHov
                                            ? 'linear-gradient(180deg,#6680f5,#2447d7)'
                                            : 'linear-gradient(180deg,#3b5ee8,#1a38b8)',
                                        boxShadow: isHov ? '0 4px 16px rgba(36,71,215,0.4)' : '0 2px 6px rgba(36,71,215,0.2)',
                                        animation: `barGrow 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 75 + 50}ms both`,
                                    }}
                                />
                            </div>

                            {/* Month label */}
                            <span
                                className="absolute text-[10px] font-bold uppercase tracking-wide transition-colors duration-200"
                                style={{ bottom: '-24px', color: isHov ? '#2447d7' : '#94a3b8' }}
                            >
                                {d.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

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
    const hovSeg = hovered !== null ? DONUT_SEGMENTS[hovered] : null;

    return (
        <div className="relative w-[180px] h-[180px] mx-auto">
            <svg viewBox="0 0 180 180" className="w-full h-full">
                {/* Track ring */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="20" />
                {DONUT_SEGMENTS.map(({ pct, color, label }, i) => {
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
                                transition: `stroke-dasharray 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${300 + i * 200}ms, stroke-width 0.25s ease, opacity 0.25s ease, filter 0.25s ease`,
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
            {/* Center text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div
                    className="text-[22px] font-bold leading-none transition-all duration-200"
                    style={{ color: hovSeg ? hovSeg.color : (isDark ? '#e4ecff' : '#1a202c') }}
                >
                    {hovSeg ? `${hovSeg.pct}%` : '94%'}
                </div>
                <div className="text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest mt-1.5 transition-all duration-200">
                    {hovSeg ? hovSeg.label : 'SUCCESS RATE'}
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
        status === 'Approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' :
        status === 'Pending'  ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]' :
        'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]'
    }`}>{status}</span>
);

const FinanceReport = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [status, setStatus]       = useState('All');
    const [manager, setManager]     = useState('All Managers');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role;
    const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    const filteredTransactions = TRANSACTIONS.filter(t => {
        if (status !== 'All' && t.status !== status) {
            return false;
        }

        if (userRole === 'accounts_manager') {
            return t.manager === userName;
        }
        if ((userRole === 'super_admin' || userRole === 'admin') && manager !== 'All Managers') {
            return t.manager === manager;
        }
        return true;
    });

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <div className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Financial Report</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Real-time financial tracking and payment analysis</p>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {[
                    { iconBg: '#dcfce7', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, label: 'Total Loans', value: '$428,540.00', trend: 'up', trendLabel: '+12%' },
                    { iconBg: '#fef3c7', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: 'Pending Loans', value: '$42,180.50', trend: 'flat', trendLabel: '-0%' },
                    { iconBg: '#fef2f2', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, label: 'Rejected Loans', value: '$8,240.00', trend: 'down', trendLabel: '-4%' },
                    { iconBg: '#eef2ff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'Monthly Revenue', value: '$156,200.00', trend: 'up', trendLabel: '+8%' },
                ].map((kpi, i) => (
                    <div key={i} className="animate-kpiPop" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <KpiCard {...kpi} />
                    </div>
                ))}
            </div>

            {/* ── CHARTS ── */}
            <div className="grid grid-cols-[1fr_320px] gap-5 xl:grid-cols-1 animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                {/* Bar Chart */}
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-[14px] font-bold text-[#1a202c]">Monthly Revenue Trend</span>
                            <p className="text-[12px] text-[#94a3b8] mt-0.5 font-medium">Jan – Jun 2023 · Hover bars for details</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#3b5ee8,#1a38b8)' }} />
                                <span className="text-[11px] font-semibold text-[#4a5568]">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#e0e7ff,#c7d2fe)' }} />
                                <span className="text-[11px] font-semibold text-[#94a3b8]">Target</span>
                            </div>
                        </div>
                    </div>
                    <BarChart />
                    {/* X-axis total */}
                    <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">6-Month Total</span>
                        <span className="text-[15px] font-bold text-[#1a202c]">$1,109k <span className="text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-full ml-1">↑ 18.2%</span></span>
                    </div>
                </section>

                {/* Donut */}
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm flex flex-col gap-4">
                    <div>
                        <span className="text-[13px] font-bold text-[#1a202c]">Payment Status Distribution</span>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5 font-medium">Hover segments for details</p>
                    </div>
                    <DonutChart />
                    <div className="flex flex-col gap-3 pt-1">
                        {DONUT_SEGMENTS.map(({ label, pct, color }, i) => (
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
                                            animationDelay: `${600 + i * 200}ms`,
                                            animationFillMode: 'both',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FILTERS ── */}
            <div className="flex items-center gap-3 flex-wrap animate-slideUp [animation-delay:450ms] [animation-fill-mode:both]">
                {/* Date Range */}
                <div className="relative flex items-center gap-2 bg-white border border-[#edf2f7] rounded-xl px-3 py-2 text-[13px] text-[#4a5568] cursor-pointer hover:border-[#2447d7]/20 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <select className="bg-transparent text-[13px] font-medium outline-none cursor-pointer appearance-none pr-4" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                        <option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option>
                    </select>
                    <IcoChevron />
                </div>
                {/* Status */}
                <div className="relative flex items-center gap-2 bg-white border border-[#edf2f7] rounded-xl px-3 py-2 text-[13px] text-[#4a5568]">
                    <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-wider">STATUS:</span>
                    <select className="bg-transparent text-[13px] font-medium outline-none cursor-pointer appearance-none pr-4" value={status} onChange={e => setStatus(e.target.value)}>
                        <option>All</option><option>Approved</option><option>Pending</option><option>Rejected</option>
                    </select>
                    <IcoChevron />
                </div>
                {/* Manager - Only visible to super_admin or admin */}
                {(userRole === 'super_admin' || userRole === 'admin') && (
                    <div className="relative flex items-center gap-2 bg-white border border-[#edf2f7] rounded-xl px-3 py-2 text-[13px] text-[#4a5568]">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-wider">MANAGER:</span>
                        <select className="bg-transparent text-[13px] font-medium outline-none cursor-pointer appearance-none pr-4" value={manager} onChange={e => setManager(e.target.value)}>
                            <option>All Managers</option>
                            <option>Sarah Miller</option>
                            <option>James Chen</option>
                            <option>Alex Thompson</option>
                        </select>
                        <IcoChevron />
                    </div>
                )}
            </div>

            {/* ── TRANSACTION TABLE ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:500ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                    <span className="text-[13px] font-semibold text-[#1a202c]">Transaction History</span>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2 rounded-xl text-[12px] font-medium text-[#4a5568] hover:bg-white hover:shadow-sm transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            Export CSV
                        </button>
                        <button className="flex items-center gap-1.5 bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[12px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            Export PDF
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">REF ID</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD #</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CUSTOMER NAME</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">DATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filteredTransactions.map((t, i) => (
                                <tr key={t.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${550 + i * 55}ms`, animationFillMode: 'both' }}>
                                    <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{t.id}</span></td>
                                    <td className="px-6 py-4"><span className="text-[12px] font-medium text-[#1a202c] bg-[#f1f5f9] px-2 py-0.5 rounded-md">{t.lead}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: t.bg, color: t.tc }}>{t.initials}</div>
                                            <span className="text-[13px] font-medium text-[#1a202c]">{t.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-[14px] font-semibold text-[#1a202c]">{t.amount}</span></td>
                                    <td className="px-6 py-4"><span className="text-[12px] text-[#718096]">{t.date}</span></td>
                                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-[#f7fafc] flex justify-between items-center bg-[#fcfdff]">
                    <span className="text-[12px] text-[#a0aec0]">Showing <span className="text-[#2447d7] font-medium">1 to 5</span> of <span className="text-[#1a202c] font-medium">128 transactions</span></span>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 bg-white border border-[#edf2f7] rounded-lg flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] disabled:opacity-30 transition-all" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${currentPage === p ? 'bg-[#2447d7] text-white' : 'text-[#718096] bg-white border border-[#edf2f7] hover:bg-[#f8fafc]'}`} onClick={() => setCurrentPage(p)}>{p}</button>
                        ))}
                        <button className="w-8 h-8 bg-white border border-[#edf2f7] rounded-lg flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] disabled:opacity-30 transition-all" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default FinanceReport;
