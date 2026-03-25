import React, { useState } from 'react';

import { SA_STATS, DATE_RANGE_OPTIONS, PERFORMANCE_AGENT_OPTIONS, PERFORMANCE_LEAD_STATUSES } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

const STAGE_CLS = {
    'Document Collection':        'bg-[#1a202c] text-white',
    'Document Verification Done': 'bg-[#fef9c3] text-[#a16207]',
    'Lender Selection':           'bg-[#f5f3ff] text-[#7c3aed]',
    'Completed':                  'bg-[#ecfdf5] text-[#059669]',
    'Rejected':                   'bg-[#f1f5f9] text-[#64748b]',
};
const mapLeadToPerf = (l) => {
    const initials = l.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const isComplete = l.stage === 'Completed';
    const isRejected = l.stage === 'Rejected';
    return {
        id: l.id,
        name: l.name,
        businessName: l.businessName || '',
        initials,
        bg: '#e2e8f0',
        tc: '#1a202c',
        stage: l.stage,
        stageCls: STAGE_CLS[l.stage] || 'bg-[#f1f5f9] text-[#64748b]',
        status: isComplete ? 'Completed' : isRejected ? 'Urgent' : 'Active',
        statusCls: isComplete ? 'text-[#a0aec0]' : isRejected ? 'text-[#dc2626]' : 'text-[#059669]',
        dot: isComplete ? 'bg-[#a0aec0]' : isRejected ? 'bg-red-500' : 'bg-green-500',
        agent: l.agentName || '',
        date: l.submissionDate || '',
        amount: l.loanAmount || 'N/A',
        purpose: l.loanPurpose || 'N/A',
        homeowner: l.homeOwner || 'N/A',
        bank: l.companyBank || 'N/A',
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
    const [dateRange, setDateRange]   = useState('Last 30 Days');
    const [agent, setAgent]           = useState('All Agents');
    const [leadStatus, setLeadStatus] = useState('All');

    const filters = [
        { label: 'DATE RANGE',     value: dateRange,   setter: setDateRange,   opts: DATE_RANGE_OPTIONS.slice(2) }, // Use 30 days, 90 days, Year
        { label: 'ASSIGNED AGENT', value: agent,       setter: setAgent,       opts: PERFORMANCE_AGENT_OPTIONS },
        { label: 'LEAD STATUS',    value: leadStatus,  setter: setLeadStatus,  opts: PERFORMANCE_LEAD_STATUSES },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lead Performance Report</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Detailed analysis of lead acquisition and conversion metrics.</p>
                </div>
            </header>

            {/* ── KPI SECTION ── */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:200ms] [animation-fill-mode:both]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-[#eef2ff] rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">Total Leads</div>
                            <div className="text-2xl font-bold text-[#1a202c]">{SA_STATS.totalLeads}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:300ms] [animation-fill-mode:both]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-[#fef2f2] rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">Rejection Rate</div>
                            <div className="text-2xl font-bold text-[#1a202c]">{SA_STATS.rejectionRate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── FILTERS ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1 animate-slideDown [animation-delay:350ms] [animation-fill-mode:both]">
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
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD #</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">CUSTOMER NAME</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">STATUS</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">PURPOSE</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">HOMEOWNER</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">BANK</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">TERM</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">ASSIGNED AGENT</th>
                                <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-[#a0aec0] uppercase tracking-widest">CREATED</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {RECENT_LEADS.filter(l => {
                                if (agent !== 'All Agents' && l.agent !== agent) return false;
                                if (leadStatus !== 'All' && l.status !== leadStatus) return false;
                                
                                const searchLower = search.toLowerCase();
                                if (searchLower) {
                                    return l.name.toLowerCase().includes(searchLower) ||
                                           l.id.toLowerCase().includes(searchLower) ||
                                           l.agent.toLowerCase().includes(searchLower);
                                }
                                return true;
                            }).map((lead, i) => (
                                <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${450 + i * 60}ms`, animationFillMode: 'both' }}>
                                    <td className="px-4 py-3"><span className="text-[11px] font-medium text-[#2447d7] cursor-pointer hover:underline">{lead.id}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: lead.bg, color: lead.tc }}>{lead.initials}</div>
                                            <span className="text-[11px] font-medium text-[#1a202c]">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className={`flex items-center gap-1.5 text-[10px] font-medium ${lead.statusCls}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${lead.dot}`} />
                                            {lead.status}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-[11px] font-semibold text-[#1a202c]">{lead.amount || '—'}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568]">{lead.purpose || '—'}</span></td>
                                    <td className="px-4 py-3">
                                        {lead.homeowner === 'YES' ? (
                                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="9" height="9"><polyline points="20 6 9 17 4 12"/></svg>
                                                Yes
                                            </span>
                                        ) : lead.homeowner === 'NO' ? (
                                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="9" height="9"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                No
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-[#a0aec0]">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568]">{lead.bank || '—'}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568]">{lead.term || '—'}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#4a5568]">{lead.agent}</span></td>
                                    <td className="px-4 py-3"><span className="text-[11px] text-[#a0aec0]">{lead.date}</span></td>
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
