import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { SA_STATS, DATE_RANGE_OPTIONS, PERFORMANCE_AGENT_OPTIONS, PERFORMANCE_LEAD_STATUSES, FINANCE_TRANSACTIONS as TRANSACTIONS, REVENUE_BAR_DATA as BAR_DATA, PAYMENT_STATUS_DONUT as DONUT_SEGMENTS, FINANCE_STATS, ALL_STATUSES, SHARED_INITIAL_USERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

const FINANCE_MANAGERS = ['All Managers', ...SHARED_INITIAL_USERS.filter(u => ['Accounts Manager', 'Super Admin'].includes(u.role)).map(u => u.name)];

const BarChart = () => {
    const [hovered, setHovered] = useState(null);
    const max = Math.max(...BAR_DATA.map(d => d.revenue));
    const yTicks = [0, 25, 50, 75, 100];
    return (
        <div className="relative select-none">
            <div className="absolute left-0 right-0 top-0 flex flex-col justify-between pointer-events-none" style={{ bottom: '32px' }}>
                {[...yTicks].reverse().map(t => (
                    <div key={t} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#cbd5e1] font-medium w-5 text-right shrink-0">{t}%</span>
                        <div className="flex-1 border-t border-dashed border-[#f1f5f9]" />
                    </div>
                ))}
            </div>
            <div className="flex items-end gap-3 pl-10" style={{ height: '220px', paddingBottom: '32px', paddingTop: '8px' }}>
                {BAR_DATA.map((d, i) => {
                    const revH = (d.revenue / max) * 100;
                    const isHov = hovered === i;
                    return (
                        <div key={d.label} className="relative flex flex-col items-center justify-end flex-1 h-full cursor-pointer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                            {isHov && (
                                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a202c] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap z-20 shadow-lg">
                                    {d.revenue}k
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a202c]" />
                                </div>
                            )}
                            <div className="flex items-end gap-1.5 w-full justify-center" style={{ height: '100%' }}>
                                <div className="rounded-t-xl transition-all duration-300" style={{ width: '20px', height: `${revH}%`, background: isHov ? 'linear-gradient(180deg,#6680f5,#2447d7)' : 'linear-gradient(180deg,#3b5ee8,#1a38b8)', boxShadow: isHov ? '0 4px 16px rgba(36,71,215,0.4)' : '0 2px 6px rgba(36,71,215,0.2)', animation: `barGrow 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 75 + 50}ms both` }} />
                            </div>
                            <span className="absolute text-[10px] font-bold uppercase tracking-wide transition-colors duration-200" style={{ bottom: '-24px', color: isHov ? '#2447d7' : '#94a3b8' }}>{d.label}</span>
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
    useEffect(() => { const t = setTimeout(() => setDrawn(true), 150); return () => clearTimeout(t); }, []);
    const r = 68, cx = 90, cy = 90, circ = 2 * Math.PI * r, GAP_PX = 7;
    let cumPct = 0;
    const hovSeg = hovered !== null ? DONUT_SEGMENTS[hovered] : null;
    return (
        <div className="relative w-[180px] h-[180px] mx-auto">
            <svg viewBox="0 0 180 180" className="w-full h-full">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="20" />
                {DONUT_SEGMENTS.map(({ pct, color, label }, i) => {
                    const startPct = cumPct; cumPct += pct;
                    const dash = Math.max(0, (pct / 100) * circ - GAP_PX);
                    const isHov = hovered === i;
                    return <circle key={label} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={isHov ? 27 : 20} strokeDasharray={drawn ? `${dash} ${circ}` : `0 ${circ}`} strokeDashoffset="0" transform={`rotate(${-90 + (startPct / 100) * 360} ${cx} ${cy})`} style={{ transition: `stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1) ${300 + i * 200}ms, stroke-width 0.25s ease, opacity 0.25s ease`, opacity: hovered !== null && !isHov ? 0.25 : 1, cursor: 'pointer' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[22px] font-bold leading-none transition-all duration-200" style={{ color: hovSeg ? hovSeg.color : (isDark ? '#e4ecff' : '#1a202c') }}>{hovSeg ? `${hovSeg.pct}%` : '94%'}</div>
                <div className="text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest mt-1.5">{hovSeg ? hovSeg.label : 'SUCCESS RATE'}</div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${status === 'Approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : status === 'Pending' ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]' : 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]'}`}>{status}</span>
);

const STAGE_CLS = {
    'Document Collection':        'bg-[#1a202c] text-white',
    'Document Verification Done': 'bg-[#fef9c3] text-[#a16207]',
    'Document Rejected':          'bg-[#fef2f2] text-[#dc2626]',
    'Lender Selection':           'bg-[#f5f3ff] text-[#7c3aed]',
    'Completed':                  'bg-[#ecfdf5] text-[#059669]',
    'Rejected':                   'bg-[#f1f5f9] text-[#64748b]',
};
const mapLeadToPerf = (l) => {
    const initials = l.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return {
        id: l.id,
        name: l.name,
        businessName: l.businessName || '',
        initials,
        bg: '#e2e8f0',
        tc: '#1a202c',
        stage: l.stage,
        stageCls: STAGE_CLS[l.stage] || 'bg-[#f1f5f9] text-[#64748b]',
        status: l.stage || 'Document Collection',
        agent: l.agentName || '',
        date: l.submissionDate || '',
        amount: l.loanAmount || 'N/A',
        purpose: l.loanPurpose || 'N/A',
        homeowner: l.homeOwner || 'N/A',
        bank: l.companyBank || 'N/A',
        lender: l.selectedLender || l.lenderName || '—',
        term: 'N/A',
    };
};

const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IcoTrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
);


const LeadPerformance = () => {
    const { leads } = useLeads();
    const RECENT_LEADS = leads.map(mapLeadToPerf);
    const [search, setSearch]         = useState('');
    const [dateFrom, setDateFrom]     = useState('');
    const [dateTo, setDateTo]         = useState('');
    const [agent, setAgent]           = useState('All Agents');
    const [leadStatus, setLeadStatus] = useState('All');

    const filters = [
        { label: 'ASSIGNED AGENT', value: agent,       setter: setAgent,       opts: PERFORMANCE_AGENT_OPTIONS },
        { label: 'LEAD STATUS',    value: leadStatus,  setter: setLeadStatus,  opts: PERFORMANCE_LEAD_STATUSES },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            <div className="h-2" /> {/* Small spacer instead of header */}

            {/* ── FINANCE: KPI CARDS ── */}
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1 animate-kpiPop [animation-delay:100ms] [animation-fill-mode:both]">
                {[
                    { iconBg: '#dcfce7', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, label: 'Total Loans', value: FINANCE_STATS.totalLoans },
                    { iconBg: '#fef3c7', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: 'Pending Loans', value: FINANCE_STATS.pendingLoans },
                    { iconBg: '#fef2f2', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, label: 'Rejected Loans', value: FINANCE_STATS.rejectedLoans },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.iconBg }}>{kpi.icon}</div>
                        </div>
                        <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest mb-1">{kpi.label}</div>
                        <div className="text-xl font-bold text-[#1a202c]">{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* ── FINANCE: CHARTS ── */}
            <div className="grid grid-cols-[1fr_320px] gap-5 xl:grid-cols-1 animate-slideUp [animation-delay:200ms] [animation-fill-mode:both]">
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-[14px] font-bold text-[#1a202c]">Monthly Loan Distribution</span>
                            <p className="text-[12px] text-[#94a3b8] mt-0.5 font-medium">Jan – Jun 2023 · Hover bars for details</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#3b5ee8,#1a38b8)' }} />
                            <span className="text-[11px] font-semibold text-[#4a5568]">Revenue</span>
                        </div>
                    </div>
                    <BarChart />
                    <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">6-Month Total</span>
                        <span className="text-[15px] font-bold text-[#1a202c]">{FINANCE_STATS.sixMonthTotal}</span>
                    </div>
                </section>
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
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{ color, background: `${color}1a` }}>{pct}%</span>
                                </div>
                                <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden ml-4">
                                    <div className="h-full rounded-full animate-progressFill" style={{ width: `${pct}%`, background: color, transformOrigin: 'left', animationDelay: `${600 + i * 200}ms`, animationFillMode: 'both' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FILTERS ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1 animate-slideDown [animation-delay:350ms] [animation-fill-mode:both]">
                {/* DATE FROM */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">FROM</span>
                    <div className="relative">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none cursor-pointer hover:border-[#2447d7]/30 transition-colors"
                        />
                    </div>
                </div>
                {/* DATE TO */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">TO</span>
                    <div className="relative">
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none cursor-pointer hover:border-[#2447d7]/30 transition-colors"
                        />
                    </div>
                </div>
                {/* AGENT + STATUS dropdowns */}
                {filters.map(f => (
                    <div key={f.label} className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">{f.label}</span>
                        <div className="relative">
                            <select
                                className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 pr-8 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none appearance-none cursor-pointer hover:border-[#2447d7]/30 transition-colors"
                                value={f.value}
                                onChange={e => f.setter(e.target.value)}
                            >
                                {f.opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                <IcoChevron />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── RECENT LEADS TABLE ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc] flex-wrap gap-4">
                    <span className="text-[14px] font-bold text-[#1a202c]">Recent Leads Activity</span>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#edf2f7] text-[#4a5568] text-[12px] font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                CSV
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2447d7] border border-[#2447d7] text-white text-[12px] font-semibold rounded-lg hover:bg-[#1a38b8] transition-colors shadow-sm">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                PDF
                            </button>
                        </div>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input
                                type="text"
                                className="bg-[#f8fafc] border border-[#edf2f7] rounded-lg pl-8 pr-4 py-1.5 text-[12px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all w-[220px] placeholder:text-[#cbd5e0]"
                                placeholder="Search leads..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-fixed">
                        <colgroup><col style={{ width: '15%' }} /><col style={{ width: '12%' }} /><col style={{ width: '20%' }} /><col style={{ width: '8%' }}  /><col style={{ width: '8%' }}  /><col style={{ width: '14%' }} /><col style={{ width: '12%' }} /><col style={{ width: '11%' }} /></colgroup>
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">CLIENT</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">BUSINESS</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">STATUS</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">BANK</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">LENDER</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">ASSIGNED AGENT</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">CREATED</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {RECENT_LEADS.filter(l => {
                                if (agent !== 'All Agents' && l.agent !== agent) return false;
                                if (leadStatus !== 'All' && l.status !== leadStatus) return false;
                                if (dateFrom && l.date && l.date < dateFrom) return false;
                                if (dateTo && l.date && l.date > dateTo) return false;
                                const searchLower = search.toLowerCase();
                                if (searchLower) {
                                    return l.name.toLowerCase().includes(searchLower) ||
                                           l.id.toLowerCase().includes(searchLower) ||
                                           l.agent.toLowerCase().includes(searchLower);
                                }
                                return true;
                            }).map((lead, i) => (
                                <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${450 + i * 60}ms`, animationFillMode: 'both' }}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: lead.bg, color: lead.tc }}>{lead.initials}</div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-semibold text-[#1a202c] leading-tight">{lead.name}</span>
                                                <span className="text-[9px] font-medium text-[#2447d7]">{lead.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] text-[#4a5568] truncate block">{lead.businessName || '—'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {(() => {
                                            const s = lead.status;
                                            const pill = 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide whitespace-nowrap';
                                            const ico = (pts) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="8" height="8">{pts}</svg>;
                                            if (s === 'Rejected' || s === 'Loan Rejected') return <span className={`${pill} bg-red-50 text-red-600 border border-red-100`}>{ico(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>)} {s}</span>;
                                            if (s === 'Document Rejected')                 return <span className={`${pill} bg-red-50 text-red-600 border border-red-100`}>{ico(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>)} {s}</span>;
                                            if (s === 'Completed')                         return <span className={`${pill} bg-teal-50 text-teal-600 border border-teal-100`}>{ico(<polyline points="20 6 9 17 4 12"/>)} {s}</span>;
                                            if (s === 'Document Verification Done')        return <span className={`${pill} bg-emerald-50 text-emerald-600 border border-emerald-100`}>{ico(<polyline points="20 6 9 17 4 12"/>)} {s}</span>;
                                            if (s === 'Lender Selection')                  return <span className={`${pill} bg-purple-50 text-purple-600 border border-purple-100`}><div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" /> {s}</span>;
                                            if (s === 'Document Collection')               return <span className={`${pill} bg-blue-50 text-blue-600 border border-blue-100`}><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> {s}</span>;
                                            return <span className={`${pill} bg-gray-50 text-gray-500 border border-gray-200`}><div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" /> {s}</span>;
                                        })()}
                                    </td>
                                    <td className="px-4 py-3"><span className="text-[11px] font-semibold text-[#1a202c]">{lead.amount || '—'}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568]">{lead.bank || '—'}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568] whitespace-nowrap">{lead.lender}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568]">{lead.agent}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#a0aec0] whitespace-nowrap">{lead.date}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
};

export default LeadPerformance;
