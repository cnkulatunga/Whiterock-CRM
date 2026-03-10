import React, { useState } from 'react';

// --- Data ---
const LEADS_DATA = [
    {
        id: 'WR-2024-8812',
        customer: 'Jonathan Vane',
        agent: { name: 'Sarah Johnson', avatar: 'Sarah Johnson' },
        progress: 20,
        stage: 'Document Collection',
    },
    {
        id: 'WR-2024-8845',
        customer: 'Amara Okafor',
        agent: { name: 'Michael Smith', avatar: 'Michael Smith' },
        progress: 100,
        stage: 'Completed',
    },
    {
        id: 'WR-2024-8901',
        customer: 'Robert Taylor',
        agent: { name: 'Elena Rodriguez', avatar: 'Elena Rodriguez' },
        progress: 40,
        stage: 'Document Verification',
    },
    {
        id: 'WR-2024-8722',
        customer: 'Li Wei',
        agent: { name: 'Sarah Johnson', avatar: 'Sarah Johnson' },
        progress: 60,
        stage: 'Lender Selection',
    },
    {
        id: 'WR-2024-8735',
        customer: 'Patricia Moore',
        agent: { name: 'Michael Smith', avatar: 'Michael Smith' },
        progress: 80,
        stage: 'Final Review',
    },
    {
        id: 'WR-2024-8744',
        customer: 'Kevin Adams',
        agent: { name: 'Elena Rodriguez', avatar: 'Elena Rodriguez' },
        progress: 100,
        stage: 'Rejected',
    },
    {
        id: 'WR-2024-8756',
        customer: 'David Lee',
        agent: { name: 'Elena Rodriguez', avatar: 'Elena Rodriguez' },
        progress: 20,
        stage: 'Document Collection',
    },
    {
        id: 'WR-2024-8770',
        customer: 'Fatima Al-Hassan',
        agent: { name: 'Sarah Johnson', avatar: 'Sarah Johnson' },
        progress: 60,
        stage: 'Lender Selection',
    },
    {
        id: 'WR-2024-8785',
        customer: 'Carlos Rivera',
        agent: { name: 'Michael Smith', avatar: 'Michael Smith' },
        progress: 40,
        stage: 'Document Verification',
    },
];

const AGENTS_LIST = ['All Agents', 'Sarah Johnson', 'Michael Smith', 'Elena Rodriguez'];
const STAGES_LIST = ['All Stages', 'Document Collection', 'Document Verification', 'Lender Selection', 'Final Review', 'Completed', 'Rejected'];

const STAGE_COLORS = {
    'Document Collection': '#2447d7',
    'Document Verification': '#f59e0b',
    'Lender Selection': '#8b5cf6',
    'Final Review': '#06b6d4',
    'Completed': '#10b981',
    'Rejected': '#ef4444',
};

const ITEMS_PER_PAGE = 4;
const TOTAL_PAGES = 12;

// --- Stage Progress Bar Component ---
const StageProgressBar = ({ progress, stage }) => {
    const segments = 5;
    const filledSegments = Math.round((progress / 100) * segments);
    const isRejected = stage === 'Rejected';

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 h-1.5 w-[140px]">
                {Array.from({ length: segments }, (_, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-full ${
                            i < filledSegments 
                                ? (isRejected ? 'bg-[#ef4444]' : 'bg-[#2447d7]') 
                                : 'bg-[#f1f5f9]'
                        } transition-colors duration-500`}
                    />
                ))}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isRejected ? 'text-[#ef4444]' : 'text-[#a0aec0]'}`}>
                {isRejected ? 'REJECTED' : `${progress}% COMPLETE`}
            </span>
        </div>
    );
};

// --- Lead Row Component ---
const LeadRow = ({ lead }) => {
    const stageColor = STAGE_COLORS[lead.stage] || '#2447d7';

    return (
        <div className="p-4 px-8 grid grid-cols-[1fr_240px_180px_200px] items-center hover:bg-[#f8fafc]/50 transition-all group lg:grid-cols-1 lg:gap-6 lg:p-6 lg:border-b last:border-0 border-[#f7fafc]">
            <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-black text-[#2447d7] font-mono leading-none">{lead.id}</span>
                <span className="text-[15px] font-bold text-[#1a202c] tracking-tight">{lead.customer}</span>
            </div>
            <div className="flex items-center gap-3">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lead.agent.name)}&background=2447d7&color=fff&size=36`}
                    alt={lead.agent.name}
                    className="w-10 h-10 rounded-xl shadow-sm border border-[#fff] group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-[14px] font-bold text-[#556987]">{lead.agent.name}</span>
            </div>
            <div className="flex items-center">
                <StageProgressBar progress={lead.progress} stage={lead.stage} />
            </div>
            <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full ring-4" style={{ background: stageColor, ringColor: `${stageColor}20` }} />
                <span className="text-[13px] font-extrabold text-[#1a202c] tracking-tight">{lead.stage}</span>
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

    const visiblePages = [1, 2, 3, '...', TOTAL_PAGES];

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            {/* Page Header */}
            <header className="flex justify-between items-center mb-10 sm:flex-col sm:items-start sm:gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-2xl">Active Pipeline</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">
                        Real-time status of all leads currently in{' '}
                        <span className="text-[#2447d7] font-bold">doc collection</span> or{' '}
                        <span className="text-[#2447d7] font-bold">lender processing</span>.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] p-[10px_20px] rounded-xl text-sm font-bold text-[#4a5568] hover:bg-white hover:shadow-md transition-all active:scale-95" onClick={handleExportCSV}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Export CSV</span>
                    </button>
                    <button className="bg-[#2447d7] text-white p-[10px_24px] rounded-xl text-sm font-bold shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all">
                        View Analytics
                    </button>
                </div>
            </header>

            {/* Main Table Card */}
            <div className="bg-white rounded-[2rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
                {/* Filters Row */}
                <div className="p-8 grid grid-cols-3 gap-8 border-b border-[#f7fafc] bg-[#fcfdff] md:grid-cols-1 md:p-6">
                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest pl-1">SEARCH LEAD</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3.5 px-12 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 transition-all"
                                placeholder="Search name or ID..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest pl-1">AGENT</label>
                        <div className="relative group">
                            <select
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3.5 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 transition-all appearance-none cursor-pointer"
                                value={selectedAgent}
                                onChange={(e) => { setSelectedAgent(e.target.value); setCurrentPage(1); }}
                            >
                                {AGENTS_LIST.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#2447d7] transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest pl-1">CURRENT STAGE</label>
                        <div className="relative group">
                            <select
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3.5 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 transition-all appearance-none cursor-pointer"
                                value={selectedStage}
                                onChange={(e) => { setSelectedStage(e.target.value); setCurrentPage(1); }}
                            >
                                {STAGES_LIST.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#2447d7] transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Table Content */}
                <div className="flex flex-col">
                    {/* Table Header */}
                    <div className="p-5 px-8 grid grid-cols-[1fr_240px_180px_200px] border-b border-[#f7fafc] bg-[#fff] lg:hidden">
                        <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">ID &amp; CUSTOMER</div>
                        <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">ASSIGNED AGENT</div>
                        <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">PROGRESSION</div>
                        <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">CURRENT STAGE</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex flex-col divide-y divide-[#f7fafc]">
                        {pagedLeads.length === 0 ? (
                            <div className="py-24 flex flex-col items-center gap-6 text-center grayscale opacity-50">
                                <div className="w-20 h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                                <p className="text-[15px] font-bold text-[#4a5568]">No leads match your search criteria.</p>
                            </div>
                        ) : (
                            pagedLeads.map((lead, idx) => (
                                <LeadRow key={lead.id} lead={lead} />
                            ))
                        )}
                    </div>
                </div>


                {/* Table Footer / Pagination */}
                <div className="p-6 px-10 border-t border-[#f7fafc] flex justify-between items-center sm:flex-col sm:gap-6">
                    <span className="text-[13px] font-black text-[#cbd5e0] uppercase tracking-widest">
                        Showing <span className="text-[#2447d7]">{showingStart} to {showingEnd}</span> of <span className="text-[#1a202c]">{totalFiltered} leads</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            className="w-10 h-10 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2 px-2">
                            {visiblePages.map((page, idx) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="text-[#cbd5e0] font-black">…</span>
                                ) : (
                                    <button
                                        key={page}
                                        className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all ${currentPage === page ? 'bg-[#2447d7] text-white shadow-lg shadow-[#2447d7]/20 scale-110' : 'text-[#718096] bg-[#f8fafc] hover:bg-[#f1f5f9]'}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>
                        <button
                            className="w-10 h-10 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                            disabled={currentPage === TOTAL_PAGES}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-10 md:grid-cols-1">
                <div className="bg-white rounded-[2rem] border border-[#edf2f7] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-5 hover:shadow-xl transition-all duration-500 group">
                    <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-[0.2em] leading-none">TOTAL LEADS</span>
                    <h2 className="text-[2.5rem] font-extrabold text-[#1a202c] tracking-tighter leading-none group-hover:text-[#2447d7] transition-colors">1,284</h2>
                    <div className="flex items-center gap-2 text-[#10b981] font-black text-[11px] uppercase tracking-widest bg-[#f0fdf4] p-2.5 rounded-xl border border-[#dcfce7] w-fit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="animate-bounce">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                        +12% this month
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-[#edf2f7] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-5 hover:shadow-xl transition-all duration-500 group">
                    <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-[0.2em] leading-none">AVG. LEAD TIME</span>
                    <h2 className="text-[2.5rem] font-extrabold text-[#1a202c] tracking-tighter leading-none">4.2 <span className="text-[1.5rem] text-[#cbd5e0]">days</span></h2>
                    <div className="flex items-center gap-2 text-[#718096] font-black text-[11px] uppercase tracking-widest bg-[#f8fafc] p-2.5 rounded-xl border border-[#edf2f7] w-fit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Stable Pattern
                    </div>
                </div>

                <div className="bg-[#fef2f2] rounded-[2rem] border-2 border-[#fee2e2] p-8 shadow-[0_4px_20px_rgba(239,68,68,0.05)] flex flex-col gap-5 hover:bg-white hover:border-[#e53e3e]/30 transition-all duration-500 group">
                    <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.2em] leading-none">REJECTED LEADS</span>
                    <h2 className="text-[2.5rem] font-extrabold text-[#e53e3e] tracking-tighter leading-none">14</h2>
                    <div className="flex items-center gap-2 text-[#991b1b] font-black text-[11px] uppercase tracking-widest bg-white p-2.5 rounded-xl border border-[#fee2e2] w-fit shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="animate-pulse">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Disposition Required
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadMonitoring;
