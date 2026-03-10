import React, { useState } from 'react';
import ReactDOM from 'react-dom';

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IcoCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IcoTrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
);
const IcoTrendDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    </svg>
);
const IcoFileCSV = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);
const IcoFilePDF = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

/* ─── KPI CARD ─────────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
    <div className="bg-white rounded-3xl border border-[#edf2f7] p-6 shadow-sm hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110`} style={{ background: iconBg }}>
                {React.cloneElement(icon, { strokeWidth: 2.5 })}
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                trend === 'up' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 
                trend === 'down' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]' : 
                'bg-[#f8fafc] text-[#718096] border-[#e2e8f0]'
            }`}>
                {trend === 'up' && <IcoTrendUp />}
                {trend === 'down' && <IcoTrendDown />}
                <span>{trendLabel}</span>
            </div>
        </div>
        <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-[#1a202c] tracking-tight">{value}</div>
    </div>
);

/* ─── BAR CHART ─────────────────────────────────── */
const BarChart = () => {
    const maxA = Math.max(...BAR_DATA.map(d => d.a));
    const maxB = Math.max(...BAR_DATA.map(d => d.b));
    const max = Math.max(maxA, maxB);
    return (
        <div className="flex items-end justify-between h-[200px] gap-4 pt-4">
            {BAR_DATA.map((d) => (
                <div className="flex flex-col items-center gap-3 flex-1 h-full group" key={d.label}>
                    <div className="flex-1 w-full flex items-end justify-center gap-1.5 px-1 relative">
                        <div 
                            className="w-full max-w-[12px] bg-[#ebf0ff] rounded-t-full transition-all duration-500 overflow-hidden relative group-hover:bg-[#2447d7]/20" 
                            style={{ height: `${(d.a / max) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[#2447d7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div 
                            className="w-full max-w-[12px] bg-[#f1f5f9] rounded-t-full transition-all duration-500 overflow-hidden relative group-hover:bg-[#a5b4fc]/20" 
                            style={{ height: `${(d.b / max) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[#a5b4fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-wider">{d.label}</span>
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
        <svg viewBox="0 0 140 140" className="w-[148px] h-[148px]">
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
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                );
            })}
            {/* Center */}
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="22" fontWeight="900"
                fill="#1a202c" fontFamily="Sora,sans-serif">94%</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fontWeight="800"
                fill="#cbd5e0" fontFamily="Sora,sans-serif" letterSpacing="1">SUCCESS RATE</text>
        </svg>
    );
};

/* ─── TRANSACTION STATUS BADGE ─────────────────── */
const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
        status === 'Approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 
        status === 'Pending' ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]' : 
        'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]'
    }`}>{status}</span>
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
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="p-4 px-6 border-b border-[#edf2f7] bg-white">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <IcoSearch />
                        </div>
                        <input 
                            className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 pl-12 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                            placeholder="Search reports..." 
                        />
                    </div>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            <div className="flex flex-col gap-8">

                {/* ── PAGE HEADING + FILTERS ── */}
                <div className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl">Financial Report</h1>
                        <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Real-time financial tracking and payment analysis</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative group bg-white p-[8px_16px] rounded-xl border border-[#edf2f7] hover:bg-[#f8faff] transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-2.5 text-[#4a5568]">
                                <IcoCalendar />
                                <select 
                                    className="bg-transparent text-[13px] font-bold outline-none cursor-pointer pr-4 appearance-none"
                                    value={dateRange} 
                                    onChange={e => setDateRange(e.target.value)}
                                >
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                    <option>This Year</option>
                                </select>
                                <IcoChevron />
                            </div>
                        </div>
                        <div className="relative group bg-white p-[8px_16px] rounded-xl border border-[#edf2f7] hover:bg-[#f8faff] transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-2.5 text-[#4a5568]">
                                <span className="text-[10px] font-black text-[#cbd5e0] uppercase">STATUS</span>
                                <select 
                                    className="bg-transparent text-[13px] font-bold outline-none cursor-pointer pr-4 appearance-none"
                                    value={status} 
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Approved</option>
                                    <option>Pending</option>
                                    <option>Rejected</option>
                                </select>
                                <IcoChevron />
                            </div>
                        </div>
                        <div className="relative group bg-white p-[8px_16px] rounded-xl border border-[#edf2f7] hover:bg-[#f8faff] transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-2.5 text-[#4a5568]">
                                <span className="text-[10px] font-black text-[#cbd5e0] uppercase">MANAGER</span>
                                <select 
                                    className="bg-transparent text-[13px] font-bold outline-none cursor-pointer pr-4 appearance-none"
                                    value={manager} 
                                    onChange={e => setManager(e.target.value)}
                                >
                                    <option>All Managers</option>
                                    <option>Sarah Miller</option>
                                    <option>James Chen</option>
                                </select>
                                <IcoChevron />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── KPI CARDS ── */}
                <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                    <KpiCard
                        iconBg="#dcfce7"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
                        label="Total Loans" value="$428,540.00" trend="up" trendLabel="+12%"
                    />
                    <KpiCard
                        iconBg="#fef3c7"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                        label="Pending Loans" value="$42,180.50" trend="flat" trendLabel="-0%"
                    />
                    <KpiCard
                        iconBg="#fef2f2"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
                        label="Rejected Loans" value="$8,240.00" trend="down" trendLabel="-4%"
                    />
                    <KpiCard
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                        label="Monthly Revenue" value="$156,200.00" trend="up" trendLabel="+8%"
                    />
                </div>

                {/* ── CHARTS ROW ── */}
                <div className="grid grid-cols-[1fr_360px] gap-8 xl:grid-cols-1">
                    {/* Bar Chart */}
                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] p-10 shadow-sm flex flex-col gap-8 transition-all duration-300 hover:shadow-xl sm:p-6 sm:rounded-[2rem]">
                        <div className="flex justify-between items-center sm:flex-col sm:items-start sm:gap-4">
                            <span className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] border-l-4 border-[#2447d7] pl-3">Monthly Revenue Trend</span>
                            <div className="flex items-center gap-4 bg-[#f8fafc] p-[8px_16px] rounded-xl border border-[#f1f5f9]">
                                <span className="w-2 h-2 rounded-full bg-[#2447d7]" />
                                <span className="text-[11px] font-black text-[#718096] uppercase tracking-widest">Revenue Forecast</span>
                            </div>
                        </div>
                        <BarChart />
                    </section>

                    {/* Donut Chart */}
                    <div className="bg-white rounded-[2.5rem] border border-[#edf2f7] p-10 shadow-sm flex flex-col gap-8 items-center transition-all duration-300 hover:shadow-xl sm:p-6 sm:rounded-[2rem]">
                        <div className="w-full text-left">
                           <span className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] border-l-4 border-[#10b981] pl-3">Payment Distribution</span>
                        </div>
                        <DonutChart />
                        <div className="w-full flex flex-col gap-4">
                            {DONUT_SEGMENTS.map(({ label, pct, color }) => (
                                <div className="flex justify-between items-center p-4 bg-[#f8fafc] rounded-2xl border border-transparent hover:border-[#edf2f7] hover:bg-white transition-all cursor-default" key={label}>
                                    <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                                        <span className="text-[11px] font-black text-[#718096] uppercase tracking-widest">{label}</span>
                                    </div>
                                    <span className="text-[14px] font-black text-[#1a202c]">{pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── TRANSACTION HISTORY ── */}
                <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff] sm:flex-col sm:items-start sm:gap-6 sm:p-6">
                        <span className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] border-l-4 border-[#f59e0b] pl-3">Transaction History</span>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] p-[10px_20px] rounded-xl text-xs font-black text-[#4a5568] hover:bg-white hover:shadow-md transition-all active:scale-95">
                                <IcoFileCSV /> Export CSV
                            </button>
                            <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] p-[10px_20px] rounded-xl text-xs font-black text-[#4a5568] hover:shadow-md transition-all active:scale-95">
                                <IcoFilePDF /> Export PDF
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#fbfeff]">
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">REF ID</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">LEAD #</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">CUSTOMER ENTITY</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">AMOUNT</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">DATE</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">GATEWAY STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7fafc]">
                                {TRANSACTIONS.map(t => (
                                    <tr key={t.id} className="hover:bg-[#f8faff]/50 transition-all group">
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#2447d7] font-mono group-hover:underline cursor-pointer">{t.id}</span></td>
                                        <td className="p-6 px-10"><span className="text-[12px] font-black text-[#1a202c] font-mono bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#edf2f7]">{t.lead}</span></td>
                                        <td className="p-6 px-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center font-black text-[13px] shadow-sm transform transition-transform group-hover:scale-110">{t.initials}</div>
                                                <span className="text-[14px] font-black text-[#1a202c] tracking-tight">{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 px-10"><span className="text-[15px] font-black text-[#1a202c] tracking-tighter">{t.amount}</span></td>
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#718096] uppercase">{t.date}</span></td>
                                        <td className="p-6 px-10"><StatusBadge status={t.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 px-10 border-t border-[#f7fafc] flex justify-between items-center sm:flex-col sm:gap-6 bg-[#fcfdff]">
                        <span className="text-[12px] font-black text-[#cbd5e0] uppercase tracking-widest">Showing <span className="text-[#2447d7]">1 to 5</span> of <span className="text-[#1a202c]">128 transactions</span></span>
                        <div className="flex items-center gap-2">
                            <button 
                                className="w-10 h-10 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                            <div className="flex items-center gap-2 px-2">
                                {[1, 2, 3].map(p => (
                                    <button 
                                        key={p} 
                                        className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all ${currentPage === p ? 'bg-[#2447d7] text-white shadow-lg shadow-[#2447d7]/20 scale-110' : 'text-[#718096] bg-white border border-[#edf2f7] hover:bg-[#f1f5f9]'}`}
                                        onClick={() => setCurrentPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button 
                                className="w-10 h-10 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default FinanceReport;
