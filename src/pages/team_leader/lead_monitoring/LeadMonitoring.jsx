import React, { useState } from 'react';

// --- Data ---
const LEADS_DATA = [
    {
        id: 'WR-2024-8812',
        customer: 'Jonathan Vane',
        agent: { name: 'Sarah Johnson', color: '#2447d7' },
        progress: 20,
        stage: 'Document Collection',
    },
    {
        id: 'WR-2024-8845',
        customer: 'Amara Okafor',
        agent: { name: 'Michael Smith', color: '#10b981' },
        progress: 100,
        stage: 'Completed',
    },
    {
        id: 'WR-2024-8901',
        customer: 'Robert Taylor',
        agent: { name: 'Elena Rodriguez', color: '#8b5cf6' },
        progress: 40,
        stage: 'Document Verification Done',
    },
    {
        id: 'WR-2024-8722',
        customer: 'Li Wei',
        agent: { name: 'Sarah Johnson', color: '#2447d7' },
        progress: 60,
        stage: 'Lender Selection',
    },
    {
        id: 'WR-2024-8735',
        customer: 'Patricia Moore',
        agent: { name: 'Michael Smith', color: '#10b981' },
        progress: 80,
        stage: 'Final Review',
    },
    {
        id: 'WR-2024-8744',
        customer: 'Kevin Adams',
        agent: { name: 'Elena Rodriguez', color: '#8b5cf6' },
        progress: 100,
        stage: 'Rejected',
    },
    {
        id: 'WR-2024-8756',
        customer: 'David Lee',
        agent: { name: 'Elena Rodriguez', color: '#8b5cf6' },
        progress: 20,
        stage: 'Document Collection',
    },
    {
        id: 'WR-2024-8770',
        customer: 'Fatima Al-Hassan',
        agent: { name: 'Sarah Johnson', color: '#2447d7' },
        progress: 60,
        stage: 'Lender Selection',
    },
    {
        id: 'WR-2024-8785',
        customer: 'Carlos Rivera',
        agent: { name: 'Michael Smith', color: '#10b981' },
        progress: 40,
        stage: 'Document Verification Done',
    },
];

const AGENTS_LIST = ['All Agents', 'Sarah Johnson', 'Michael Smith', 'Elena Rodriguez'];
const STAGES_LIST = ['All Stages', 'Document Collection', 'Document Verification Done', 'Lender Selection', 'Final Review', 'Completed', 'Rejected'];

const STAGE_META = {
    'Document Collection': { color: '#2447d7', bg: 'rgba(36,71,215,0.08)', border: 'rgba(36,71,215,0.18)', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    )},
    'Document Verification Done': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
    )},
    'Lender Selection': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    )},
    'Final Review': { color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    )},
    'Completed': { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
    )},
    'Rejected': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    )},
};

const ITEMS_PER_PAGE = 5;

// --- Stage Progress Bar ---
const StageProgressBar = ({ progress, stage }) => {
    const isRejected = stage === 'Rejected';
    const isCompleted = stage === 'Completed';
    const meta = STAGE_META[stage] || STAGE_META['Document Collection'];
    const barColor = isRejected ? '#ef4444' : meta.color;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: barColor }}>
                    {isRejected ? 'Rejected' : isCompleted ? 'Completed' : `${progress}%`}
                </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-[#f1f5f9] w-full">
                <div
                    className="h-full rounded-full transition-all duration-[1000ms] ease-out"
                    style={{
                        width: `${progress}%`,
                        background: isRejected
                            ? 'linear-gradient(90deg, #ef4444, #f87171)'
                            : `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                    }}
                />
            </div>
        </div>
    );
};

// --- Stage Badge ---
const StageBadge = ({ stage }) => {
    const meta = STAGE_META[stage] || STAGE_META['Document Collection'];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide whitespace-nowrap"
            style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
        >
            <span style={{ color: meta.color }}>{meta.icon}</span>
            {stage}
        </span>
    );
};

// --- Lead Row ---
const LeadRow = ({ lead, idx }) => {
    const initials = lead.agent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div
            className="group grid md:flex md:flex-col items-center md:items-start gap-5 md:gap-6 px-6 md:px-8 py-5 md:py-4 hover:bg-[#f8faff] transition-all duration-200 border-b border-[#f7fafc] last:border-0 animate-rowIn"
            style={{
                gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.4fr) minmax(0, 1.2fr) minmax(0, 1.4fr)',
                animationDelay: `${400 + idx * 55}ms`,
                animationFillMode: 'both',
            }}
        >
            {/* Customer & ID - Desktop Col 1, Mobile Top Row */}
            <div className="flex items-start md:justify-between md:items-center w-full min-w-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[10px] font-black text-[#2447d7] font-mono tracking-widest uppercase">{lead.id}</span>
                    <span className="text-[14px] font-bold text-[#1a202c] tracking-tight truncate mt-0.5">{lead.customer}</span>
                </div>
                {/* Mobile-only Stage Badge */}
                <div className="hidden md:flex shrink-0">
                    <StageBadge stage={lead.stage} />
                </div>
            </div>

            {/* Agent - Desktop Col 2, Mobile Row 2 */}
            <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: lead.agent.color, boxShadow: `0 4px 10px ${lead.agent.color}33` }}
                >
                    {initials}
                </div>
                <div className="flex flex-col">
                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-1">Agent</span>
                    <span className="text-[13px] font-semibold text-[#4a5568] truncate">{lead.agent.name}</span>
                </div>
            </div>

            {/* Progress - Desktop Col 3, Mobile Row 3 */}
            <div className="w-full pr-2">
                <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-1.5">Pipeline Progress</span>
                <StageProgressBar progress={lead.progress} stage={lead.stage} />
            </div>

            {/* Stage - Desktop Col 4, Hidden on mobile (shown above) */}
            <div className="md:hidden flex items-center">
                <StageBadge stage={lead.stage} />
            </div>
        </div>
    );
};

// --- Main Component ---
const LeadMonitoring = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('All Agents');
    const [selectedStage, setSelectedStage] = useState('All Stages');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredLeads = LEADS_DATA.filter(lead => {
        const matchesSearch =
            searchTerm === '' ||
            lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAgent = selectedAgent === 'All Agents' || lead.agent.name === selectedAgent;
        const matchesStage = selectedStage === 'All Stages' || lead.stage === selectedStage;
        return matchesSearch && matchesAgent && matchesStage;
    });

    const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
    const pagedLeads = filteredLeads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalFiltered = filteredLeads.length;
    const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalFiltered);
    const showingStart = totalFiltered === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

    const handleExportCSV = () => {
        const headers = ['ID', 'Customer', 'Agent', 'Progress', 'Stage'];
        const rows = LEADS_DATA.map(l => [l.id, l.customer, l.agent.name, `${l.progress}%`, l.stage]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_export.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // KPI counts
    const totalLeads = LEADS_DATA.length;
    const completedLeads = LEADS_DATA.filter(l => l.stage === 'Completed').length;
    const rejectedLeads = LEADS_DATA.filter(l => l.stage === 'Rejected').length;
    const inProgressLeads = LEADS_DATA.filter(l => l.stage !== 'Completed' && l.stage !== 'Rejected').length;

    const kpis = [
        {
            label: 'Total Leads',
            value: '1,284',
            sub: '+12% this month',
            subPositive: true,
            color: '#2447d7',
            bg: 'rgba(36,71,215,0.06)',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            ),
        },
        {
            label: 'In Progress',
            value: inProgressLeads,
            sub: 'Active pipeline',
            subPositive: null,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.06)',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
            ),
        },
        {
            label: 'Completed',
            value: completedLeads,
            sub: 'Closed deals',
            subPositive: true,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.06)',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            ),
        },
        {
            label: 'Rejected',
            value: rejectedLeads,
            sub: 'Needs review',
            subPositive: false,
            color: '#ef4444',
            bg: 'rgba(239,68,68,0.06)',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── Page Header ── */}
            <header className="flex justify-between items-start gap-6 sm:flex-col animate-headerDrop">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight">Lead Monitoring</h1>
                    </div>
                    <p className="text-[0.9rem] text-[#718096] font-medium leading-relaxed">
                        Real-time pipeline status across{' '}
                        <span className="text-[#2447d7] font-bold">doc collection</span> and{' '}
                        <span className="text-[#2447d7] font-bold">lender processing</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-white border border-[#e2e8f0] px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#4a5568] hover:bg-[#f8fafc] hover:shadow-md transition-all active:scale-95"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export CSV
                    </button>
                </div>
            </header>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-4 gap-5 md:grid-cols-2 sm:grid-cols-1">
                {kpis.map((kpi, i) => (
                    <div
                        key={kpi.label}
                        className="bg-white rounded-2xl border border-[#edf2f7] p-5 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop"
                        style={{ animationDelay: `${150 + i * 70}ms`, animationFillMode: 'both' }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">{kpi.label}</span>
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: kpi.bg, color: kpi.color }}
                            >
                                {kpi.icon}
                            </div>
                        </div>
                        <div className="text-[2rem] font-extrabold text-[#1a202c] tracking-tight leading-none" style={{ color: kpi.color }}>
                            {kpi.value}
                        </div>
                        <div
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg w-fit"
                            style={{
                                backgroundColor: kpi.subPositive === true ? 'rgba(16,185,129,0.08)' : kpi.subPositive === false ? 'rgba(239,68,68,0.08)' : '#f8fafc',
                                color: kpi.subPositive === true ? '#059669' : kpi.subPositive === false ? '#dc2626' : '#94a3b8',
                            }}
                        >
                            {kpi.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Table Card ── */}
            <div className="bg-white rounded-3xl md:rounded-2xl border border-[#edf2f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp [animation-delay:350ms] [animation-fill-mode:both]">

                {/* ── Filters ── */}
                <div className="px-6 py-5 border-b border-[#f7fafc] bg-[#fcfdff] flex flex-wrap items-end gap-4">
                    {/* Search */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Search</label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors pointer-events-none">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#f8fafc] border border-[#edf2f7] pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                placeholder="Name or lead ID..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>

                    {/* Agent Filter */}
                    <div className="flex flex-col gap-1.5 min-w-[160px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Agent</label>
                        <div className="relative">
                            <select
                                className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all appearance-none cursor-pointer pr-9"
                                value={selectedAgent}
                                onChange={(e) => { setSelectedAgent(e.target.value); setCurrentPage(1); }}
                            >
                                {AGENTS_LIST.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Stage Filter */}
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Stage</label>
                        <div className="relative">
                            <select
                                className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all appearance-none cursor-pointer pr-9"
                                value={selectedStage}
                                onChange={(e) => { setSelectedStage(e.target.value); setCurrentPage(1); }}
                            >
                                {STAGES_LIST.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Result count pill */}
                    <div className="flex items-end pb-0.5 md:ml-auto">
                        <span className="text-[11px] font-black text-[#94a3b8] bg-[#f1f5f9] px-3 py-2 rounded-xl border border-[#edf2f7] whitespace-nowrap">
                            {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* ── Table Header ── */}
                <div
                    className="grid md:hidden gap-6 px-8 py-3 bg-[#f8fafc] border-b border-[#f1f5f9]"
                    style={{ gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.4fr) minmax(0, 1.2fr) minmax(0, 1.4fr)' }}
                >
                    {['ID & Customer', 'Agent', 'Progress', 'Stage'].map((h, i) => (
                        <div key={i} className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">{h}</div>
                    ))}
                </div>

                {/* ── Table Body ── */}
                <div className="flex flex-col">
                    {pagedLeads.length === 0 ? (
                        <div className="py-20 flex flex-col items-center gap-5 text-center">
                            <div className="w-16 h-16 bg-[#f1f5f9] rounded-2xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[15px] font-bold text-[#4a5568]">No leads found</p>
                                <p className="text-[12px] text-[#a0aec0]">Try adjusting your search or filters</p>
                            </div>
                        </div>
                    ) : (
                        pagedLeads.map((lead, idx) => (
                            <LeadRow key={lead.id} lead={lead} idx={idx} />
                        ))
                    )}
                </div>

                {/* ── Pagination ── */}
                <div className="px-6 py-4 border-t border-[#f7fafc] flex justify-between items-center gap-4 sm:flex-col">
                    <span className="text-[11px] font-bold text-[#a0aec0]">
                        Showing <span className="text-[#2447d7] font-black">{showingStart}–{showingEnd}</span> of <span className="text-[#2447d7] font-black">{totalFiltered}</span> leads
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            className="w-9 h-9 bg-[#f8fafc] border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`w-9 h-9 rounded-xl text-[12px] font-black transition-all ${
                                    currentPage === page
                                        ? 'bg-[#2447d7] text-white shadow-[0_4px_12px_rgba(36,71,215,0.25)] scale-110'
                                        : 'text-[#718096] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-transparent hover:border-[#edf2f7]'
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="w-9 h-9 bg-[#f8fafc] border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default LeadMonitoring;
