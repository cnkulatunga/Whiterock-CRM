import React, { useState } from 'react';

const TRANSACTIONS = [
    { id: '#TRX-82910', lead: 'LD-4421', name: 'Alice Simpson',   initials: 'AS', bg: '#ebf0ff', tc: '#2447d7', amount: '$4,250.00',  date: 'Oct 24, 2023', status: 'Approved' },
    { id: '#TRX-82911', lead: 'LD-4422', name: 'Brian Miller',    initials: 'BM', bg: '#ecfdf5', tc: '#059669', amount: '$1,800.00',  date: 'Oct 24, 2023', status: 'Pending' },
    { id: '#TRX-82912', lead: 'LD-4423', name: 'Catherine West',  initials: 'CW', bg: '#fff7ed', tc: '#ea580c', amount: '$12,400.00', date: 'Oct 23, 2023', status: 'Approved' },
    { id: '#TRX-82913', lead: 'LD-4424', name: 'David King',      initials: 'DK', bg: '#f3e8ff', tc: '#7c3aed', amount: '$750.00',    date: 'Oct 23, 2023', status: 'Rejected' },
    { id: '#TRX-82914', lead: 'LD-4425', name: 'Emma Lee',        initials: 'EL', bg: '#e0f2fe', tc: '#0ea5e9', amount: '$3,120.00',  date: 'Oct 22, 2023', status: 'Approved' },
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
    const max = Math.max(...BAR_DATA.map(d => Math.max(d.a, d.b)));
    return (
        <div className="flex items-end justify-between h-[180px] gap-3 pt-2">
            {BAR_DATA.map(d => (
                <div key={d.label} className="flex flex-col items-center gap-2 flex-1 h-full group">
                    <div className="flex-1 w-full flex items-end justify-center gap-1">
                        <div className="w-full max-w-[14px] bg-[#2447d7] rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity" style={{ height: `${(d.a / max) * 100}%` }} />
                        <div className="w-full max-w-[14px] bg-[#a5b4fc] rounded-t-sm opacity-70 group-hover:opacity-90 transition-opacity" style={{ height: `${(d.b / max) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-[#a0aec0] uppercase">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

const DonutChart = () => {
    const r = 52, cx = 70, cy = 70, circ = 2 * Math.PI * r;
    let cumPct = 0;
    return (
        <div className="relative w-[140px] h-[140px] mx-auto">
            <svg viewBox="0 0 140 140" className="w-full h-full">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="15" />
                {DONUT_SEGMENTS.map(({ pct, color }) => {
                    const dash = (pct / 100) * circ;
                    const rotDeg = -90 + (cumPct / 100) * 360;
                    cumPct += pct;
                    return (
                        <circle key={color} cx={cx} cy={cy} r={r}
                            fill="none" stroke={color} strokeWidth="15"
                            strokeDasharray={`${dash} ${circ}`} strokeDashoffset="0"
                            transform={`rotate(${rotDeg} ${cx} ${cy})`}
                            strokeLinecap="round"
                        />
                    );
                })}
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill="#1a202c" fontFamily="Sora,sans-serif">94%</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#a0aec0" fontFamily="Sora,sans-serif" letterSpacing="0.8">SUCCESS RATE</text>
            </svg>
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

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Financial Report</h1>
                    <p className="text-sm text-[#718096]">Real-time financial tracking and payment analysis</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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
                    {/* Manager */}
                    <div className="relative flex items-center gap-2 bg-white border border-[#edf2f7] rounded-xl px-3 py-2 text-[13px] text-[#4a5568]">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-wider">MANAGER:</span>
                        <select className="bg-transparent text-[13px] font-medium outline-none cursor-pointer appearance-none pr-4" value={manager} onChange={e => setManager(e.target.value)}>
                            <option>All Managers</option><option>Sarah Miller</option><option>James Chen</option>
                        </select>
                        <IcoChevron />
                    </div>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                <KpiCard iconBg="#dcfce7" icon={<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>} label="Total Loans" value="$428,540.00" trend="up" trendLabel="+12%" />
                <KpiCard iconBg="#fef3c7" icon={<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Pending Loans" value="$42,180.50" trend="flat" trendLabel="-0%" />
                <KpiCard iconBg="#fef2f2" icon={<svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} label="Rejected Loans" value="$8,240.00" trend="down" trendLabel="-4%" />
                <KpiCard iconBg="#eef2ff" icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} label="Monthly Revenue" value="$156,200.00" trend="up" trendLabel="+8%" />
            </div>

            {/* ── CHARTS ── */}
            <div className="grid grid-cols-[1fr_320px] gap-5 xl:grid-cols-1">
                {/* Bar Chart */}
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-[13px] font-semibold text-[#1a202c]">Monthly Revenue Trend</span>
                        <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#f1f5f9] px-3 py-1.5 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-[#2447d7]" />
                            <span className="text-[11px] font-medium text-[#718096]">Revenue</span>
                        </div>
                    </div>
                    <BarChart />
                </section>

                {/* Donut */}
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm flex flex-col gap-5">
                    <span className="text-[13px] font-semibold text-[#1a202c]">Payment Status Distribution</span>
                    <DonutChart />
                    <div className="flex flex-col gap-2">
                        {DONUT_SEGMENTS.map(({ label, pct, color }) => (
                            <div key={label} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                                    <span className="text-[12px] text-[#718096]">{label}</span>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">{pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TRANSACTION TABLE ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">
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
                            {TRANSACTIONS.map(t => (
                                <tr key={t.id} className="hover:bg-[#f8faff] transition-colors">
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
