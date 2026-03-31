import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
    PERFORMANCE_AGENT_OPTIONS, PERFORMANCE_LEAD_STATUSES,
    REVENUE_BAR_DATA as BAR_DATA, PAYMENT_STATUS_DONUT as DONUT_SEGMENTS,
    FINANCE_STATS, SHARED_INITIAL_USERS
} from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

/* ─── tiny icons ─── */
const Icon = ({ d, size = 16, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...p}>
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);
const ChevronDown = () => <Icon size={13} d={<polyline points="6 9 12 15 18 9" />} />;
const SearchIcon  = () => <Icon size={13} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />;
const TrendUp     = () => <Icon size={11} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></>} />;
const TrendDown   = () => <Icon size={11} d={<><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></>} />;

/* ─── Bar Chart ─── */
const STYLES = `
@keyframes barGrow {
    from { transform: scaleY(0); opacity: 0; }
    to { transform: scaleY(1); opacity: 1; }
}
.animate-bar {
    transform-origin: bottom;
    animation: barGrow 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('bar-chart-styles')) {
    const s = document.createElement('style');
    s.id = 'bar-chart-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
}

const BarChart = ({ isDark }) => {
    const [hovered, setHovered] = useState(null);
    const max = Math.max(...BAR_DATA.map(d => d.revenue));
    return (
        <div className="relative select-none mt-2">
            {/* y-axis grid */}
            <div className="absolute left-0 right-0 top-0 flex flex-col justify-between pointer-events-none" style={{ bottom: 32 }}>
                {[120, 80, 40, 0].map(t => (
                    <div key={t} className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 w-7 text-right shrink-0">{t}k</span>
                        <div className={`flex-1 border-t border-dashed ${isDark ? 'border-white/5' : 'border-slate-100'}`} />
                    </div>
                ))}
            </div>
            {/* bars */}
            <div className="flex items-end gap-3 pl-10" style={{ height: 280, paddingBottom: 18, paddingTop: 8 }}>
                {BAR_DATA.map((d, i) => {
                    const h = (d.revenue / max) * 100;
                    const isHov = hovered === i;
                    return (
                        <div key={d.label} className="relative flex flex-col items-center justify-end flex-1 h-full cursor-pointer group"
                            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                            {isHov && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-20 shadow-xl animate-fadeIn">
                                    ${d.revenue}k
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                </div>
                            )}
                            <div className="w-full flex justify-center" style={{ height: '100%', alignItems: 'flex-end' }}>
                                <div className="rounded-t-md transition-all duration-500 w-full max-w-[24px] animate-bar hover:brightness-110"
                                    style={{
                                        height: `${h}%`,
                                        background: isDark
                                            ? (isHov 
                                                ? 'linear-gradient(180deg, #b45309, #78350f)' 
                                                : `linear-gradient(180deg, hsl(${30 + i * 4}, 70%, 55%), hsl(${25 + i * 4}, 70%, 35%))`)
                                            : (isHov 
                                                ? 'linear-gradient(180deg, #2563eb, #1d4ed8)' 
                                                : 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)'),
                                        boxShadow: isHov 
                                            ? (isDark ? '0 10px 25px -5px rgba(180, 83, 9, 0.5)' : '0 10px 25px -5px rgba(37, 99, 235, 0.4)') 
                                            : 'none',
                                        animationDelay: `${i * 60}ms`
                                    }} />
                            </div>
                            <span className={`absolute text-[9px] font-black uppercase tracking-tighter transition-colors ${isHov ? (isDark ? 'text-amber-500' : 'text-blue-600') : 'text-slate-500/80'}`}
                                style={{ bottom: -14 }}>{d.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─── Donut Chart ─── */
const DonutChart = ({ isDark }) => {
    const [hovered, setHovered] = useState(null);
    const [drawn, setDrawn] = useState(false);
    useEffect(() => { const t = setTimeout(() => setDrawn(true), 200); return () => clearTimeout(t); }, []);
    const r = 66, cx = 88, cy = 88, circ = 2 * Math.PI * r, GAP = 6;
    let cum = 0;
    const hov = hovered !== null ? DONUT_SEGMENTS[hovered] : null;
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-44 h-44">
                <svg viewBox="0 0 176 176" className="w-full h-full -rotate-90">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke={isDark ? '#ffffff08' : '#f1f5f9'} strokeWidth="18" />
                        {DONUT_SEGMENTS.map(({ pct, color, label }, i) => {
                            const start = cum; cum += pct;
                            const dash = Math.max(0, (pct / 100) * circ - GAP);
                            const isHov = hovered === i;
                            return (
                                <circle key={label} cx={cx} cy={cy} r={r} fill="none" stroke={color}
                                    strokeWidth={isHov ? 24 : 18}
                                    strokeDasharray={`${dash} ${circ}`}
                                    strokeDashoffset={drawn ? 0 : dash}
                                    transform={`rotate(${(start / 100) * 360} ${cx} ${cy})`}
                                    style={{ 
                                        transition: `stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 150}ms, stroke-width 0.3s, opacity 0.3s`, 
                                        opacity: hovered !== null && !isHov ? 0.3 : 1, 
                                        cursor: 'pointer' 
                                    }}
                                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
                            );
                        })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black leading-none" style={{ color: hov ? hov.color : (isDark ? '#e2e8f0' : '#1e293b') }}>
                        {hov ? `${hov.pct}%` : '94%'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {hov ? hov.label : 'Success Rate'}
                    </span>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                {DONUT_SEGMENTS.map(({ label, pct, color }, i) => (
                    <div key={label} className="flex flex-col gap-1 cursor-default group" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
                                <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ color, background: `${color}20` }}>{pct}%</span>
                        </div>
                        <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: drawn ? `${pct}%` : '0%', background: color, transitionDelay: `${400 + i * 120}ms` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Stage pill config ─── */
const STAGE_MAP = {
    'Document Collection':        { label: 'Collecting Docs',   cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    'Document Verification Done': { label: 'Docs Verified',     cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    'Document Rejected':          { label: 'Docs Rejected',     cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    'Lender Selection':           { label: 'Selecting Lender',  cls: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
    'Completed':                  { label: 'Completed',         cls: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
    'Rejected':                   { label: 'Rejected',          cls: 'bg-slate-400/10 text-slate-400 border-slate-400/20' },
};

const StagePill = ({ stage }) => {
    const cfg = STAGE_MAP[stage] || { label: stage, cls: 'bg-slate-400/10 text-slate-400 border-slate-400/20' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
};

const mapLead = (l) => ({
    id: l.id,
    name: l.name,
    initials: l.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    businessName: l.businessName || '—',
    stage: l.stage || 'Document Collection',
    agent: l.agentName || '—',
    date: l.submissionDate || '—',
    amount: l.loanAmount || '—',
    bank: l.companyBank || '—',
    lender: l.selectedLender || l.lenderName || '—',
});

/* ─── KPI card data ─── */
const KPI_CARDS = [
    {
        label: 'Total Volume', value: () => FINANCE_STATS.totalLoans,
        icon: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
        color: 'blue',
    },
    {
        label: 'Pending Deals', value: () => FINANCE_STATS.pendingLoans,
        icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
        color: 'amber',
    },
    {
        label: 'Rejected', value: () => FINANCE_STATS.rejectedLoans,
        icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
        color: 'rose',
    },
    {
        label: 'Monthly Revenue', value: () => FINANCE_STATS.monthlyRevenue,
        icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
        color: 'emerald',
    },
];

const COLOR_MAP = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-500/10',     border: 'border-blue-100 dark:border-blue-500/20',     icon: 'bg-blue-600',   trend: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-100 dark:border-amber-500/20',   icon: 'bg-amber-500',  trend: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
    rose:   { bg: 'bg-rose-50 dark:bg-rose-500/10',     border: 'border-rose-100 dark:border-rose-500/20',     icon: 'bg-rose-600',   trend: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' },
    emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-500/10',border:'border-emerald-100 dark:border-emerald-500/20',icon: 'bg-emerald-600',trend: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
};

/* ─── Main Component ─── */
const LeadPerformance = () => {
    const { leads } = useLeads();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [search, setSearch]         = useState('');
    const [dateFrom, setDateFrom]     = useState('');
    const [dateTo, setDateTo]         = useState('');
    const [agent, setAgent]           = useState('All Agents');
    const [leadStatus, setLeadStatus] = useState('All');
    const [expandedRow, setExpandedRow] = useState(null);

    const totalRevenue = BAR_DATA.reduce((a, c) => a + c.revenue, 0);
    const allLeads = leads.map(mapLead);

    const filtered = allLeads.filter(l => {
        if (agent !== 'All Agents' && l.agent !== agent) return false;
        if (leadStatus !== 'All' && l.stage !== leadStatus) return false;
        if (dateFrom && l.date && l.date < dateFrom) return false;
        if (dateTo && l.date && l.date > dateTo) return false;
        if (search) {
            const q = search.toLowerCase();
            return l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.agent.toLowerCase().includes(q);
        }
        return true;
    });

    const card = isDark
        ? 'bg-[#1a1f3a] border-white/5'
        : 'bg-white border-slate-100';

    return (
        <div className="flex flex-col gap-6 font-['Inter',sans-serif] animate-fadeIn">


            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1">
                {KPI_CARDS.map((kpi, i) => {
                    const c = COLOR_MAP[kpi.color];
                    return (
                        <div key={i} className={`rounded-xl border p-3 shadow-sm hover:shadow-md transition-all group ${c.bg} ${c.border}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0 ${c.icon}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">{kpi.icon}</svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
                                    <p className={`text-base font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{kpi.value()}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-[1fr_300px] gap-5 xl:grid-cols-1">
                {/* Bar chart */}
                <div className={`rounded-2xl border p-5 shadow-sm ${card}`}>
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Loan Distribution</p>
                            <p className="text-xs text-slate-400 mt-0.5">Full year performance · 2025</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-400/5 border border-slate-400/10">
                            <span className="w-2.5 h-2.5 rounded-sm animate-pulse" style={{ background: isDark ? '#f59e0b' : '#6366f1' }} />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Volume</span>
                        </div>
                    </div>
                    <BarChart isDark={isDark} />
                    <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <span className="text-xs text-slate-400">Aggregate Annual Revenue</span>
                        <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ${(totalRevenue / 100).toFixed(1)}M
                        </span>
                    </div>
                </div>

                {/* Donut chart */}
                <div className={`rounded-2xl border p-5 shadow-sm ${card}`}>
                    <p className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Deal Status</p>
                    <p className="text-xs text-slate-400 mb-4">Pipeline overview</p>
                    <DonutChart isDark={isDark} />
                </div>
            </div>

            {/* ── Filters ── */}
            <div className={`rounded-2xl border p-4 shadow-sm ${card}`}>
                <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                    {/* Date From */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none ml-1">Period From</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            className={`w-full rounded-xl px-4 py-2 text-[12px] font-bold outline-none border transition-all focus:border-indigo-500/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                    </div>
                    {/* Date To */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none ml-1">Period To</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            className={`w-full rounded-xl px-4 py-2 text-[12px] font-bold outline-none border transition-all focus:border-indigo-500/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                    </div>
                    {/* Agent */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none ml-1">Assigned Agent</label>
                        <div className="relative">
                            <select value={agent} onChange={e => setAgent(e.target.value)}
                                className={`w-full rounded-xl px-4 py-2 pr-10 text-[12px] font-bold outline-none border appearance-none cursor-pointer transition-all focus:border-indigo-500/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                {PERFORMANCE_AGENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown /></div>
                        </div>
                    </div>
                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none ml-1">Lead Milestone</label>
                        <div className="relative">
                            <select value={leadStatus} onChange={e => setLeadStatus(e.target.value)}
                                className={`w-full rounded-xl px-4 py-2 pr-10 text-[12px] font-bold outline-none border appearance-none cursor-pointer transition-all focus:border-indigo-500/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                {PERFORMANCE_LEAD_STATUSES.map(o => <option key={o}>{o}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Leads Table ── */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
                {/* Table header bar */}
                <div className={`px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <div>
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Lead Intelligence</p>
                        <p className="text-xs text-slate-400 mt-0.5">{filtered.length} records found</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <button className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg border transition-all uppercase tracking-wider ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}>
                                <Icon size={12} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>} />
                                CSV
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md uppercase tracking-wider">
                                <Icon size={12} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>} />
                                PDF
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></div>
                            <input type="text" placeholder="Quick find lead..." value={search} onChange={e => setSearch(e.target.value)}
                                className={`pl-9 pr-4 py-2 rounded-xl text-xs font-bold outline-none border w-52 transition-all focus:border-indigo-500/50 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'}`} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className={isDark ? 'bg-white/[0.02]' : 'bg-slate-50/70'}>
                                {['Lead Entity', 'Personnel Flow', 'Application Stage', 'Finance Detail', 'Lender Partner'].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400 font-medium">No leads found matching criteria.</td>
                                </tr>
                            )}
                            {filtered.map((lead) => (
                                <React.Fragment key={lead.id}>
                                    <tr
                                        className={`transition-colors cursor-pointer ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-indigo-50/40'} ${expandedRow === lead.id ? (isDark ? 'bg-white/[0.03]' : 'bg-indigo-50/40') : ''}`}
                                        onClick={() => setExpandedRow(expandedRow === lead.id ? null : lead.id)}
                                    >
                                        {/* Lead Entity */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm ${isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-100 text-blue-700'}`}>
                                                    {lead.initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-[12px] font-black leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400 font-bold tracking-tighter">#{lead.id}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        <span className="text-[10px] text-slate-500 font-medium truncate">{lead.businessName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Personnel Flow */}
                                        <td className="px-4 py-3">
                                            <p className={`text-[11px] font-black leading-none mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{lead.agent}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{lead.date}</p>
                                        </td>
                                        {/* Stage */}
                                        <td className="px-4 py-3"><StagePill stage={lead.stage} /></td>
                                        {/* Finance Detail */}
                                        <td className="px-4 py-3">
                                            <p className={`text-[12px] font-black leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.amount}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{lead.bank}</p>
                                        </td>
                                        {/* Lender Partner */}
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                                {lead.lender || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                    {/* Expanded detail row */}
                                    {expandedRow === lead.id && (
                                        <tr className={isDark ? 'bg-white/[0.015]' : 'bg-indigo-50/20'}>
                                            <td colSpan={7} className="px-6 py-3">
                                                <div className="flex flex-wrap gap-6 text-xs">
                                                    {[
                                                        { label: 'Lead ID', value: lead.id },
                                                        { label: 'Agent', value: lead.agent },
                                                        { label: 'Lender', value: lead.lender },
                                                        { label: 'Bank', value: lead.bank },
                                                        { label: 'Amount', value: lead.amount },
                                                        { label: 'Submission Date', value: lead.date },
                                                    ].map(({ label, value }) => (
                                                        <div key={label}>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                                                            <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default LeadPerformance;
