import React, { useState } from 'react';

const RECENT_LEADS = [
    { id: '#LD-9482', name: 'Jonathan Doe',  initials: 'JD', bg: '#ebf0ff', tc: '#2447d7', stage: 'STAGE 03', stageCls: 'bg-[#1a202c] text-white',        status: 'Active',    statusCls: 'text-[#059669]', dot: 'bg-[#059669]', agent: 'Sarah Jenkins', date: 'Oct 24, 2023' },
    { id: '#LD-9481', name: 'Amanda Smith',  initials: 'AS', bg: '#ecfdf5', tc: '#059669', stage: 'STAGE 01', stageCls: 'bg-[#fef9c3] text-[#a16207]',    status: 'Active',    statusCls: 'text-[#059669]', dot: 'bg-[#059669]', agent: 'Michael Ross',  date: 'Oct 24, 2023' },
    { id: '#LD-9480', name: 'Robert King',   initials: 'RK', bg: '#f3e8ff', tc: '#7c3aed', stage: 'CLOSED WON', stageCls: 'bg-[#ecfdf5] text-[#059669]', status: 'Completed', statusCls: 'text-[#a0aec0]', dot: 'bg-[#a0aec0]', agent: 'Sarah Jenkins', date: 'Oct 23, 2023' },
    { id: '#LD-9479', name: 'Emily Lawson',  initials: 'EL', bg: '#fff7ed', tc: '#ea580c', stage: 'STAGE 04', stageCls: 'bg-[#f1f5f9] text-[#64748b]',    status: 'Urgent',    statusCls: 'text-[#dc2626]', dot: 'bg-[#dc2626]', agent: 'David Miller',  date: 'Oct 23, 2023' },
];

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
    const [dateRange, setDateRange]   = useState('Last 30 Days');
    const [agent, setAgent]           = useState('All Agents');
    const [leadStage, setLeadStage]   = useState('All Stages');
    const [leadStatus, setLeadStatus] = useState('Active');

    const filters = [
        { label: 'DATE RANGE',     value: dateRange,   setter: setDateRange,   opts: ['Last 30 Days','Last 90 Days','This Year'] },
        { label: 'ASSIGNED AGENT', value: agent,       setter: setAgent,       opts: ['All Agents','Sarah Jenkins','Michael Ross','David Miller'] },
        { label: 'LEAD STAGE',     value: leadStage,   setter: setLeadStage,   opts: ['All Stages','Stage 01','Stage 02','Stage 03','Stage 04','Closed Won'] },
        { label: 'LEAD STATUS',    value: leadStatus,  setter: setLeadStatus,  opts: ['Active','Completed','Urgent','All'] },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lead Performance Report</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Detailed analysis of lead acquisition and conversion metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-[#edf2f7] text-[#4a5568] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Export PDF
                    </button>
                </div>
            </header>

            {/* ── FILTERS ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1 animate-slideDown [animation-delay:100ms] [animation-fill-mode:both]">
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

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:200ms] [animation-fill-mode:both]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-[#eef2ff] rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">Total Leads</div>
                            <div className="text-2xl font-bold text-[#1a202c]">1,482</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-3 py-1.5 rounded-lg w-fit text-[11px] font-medium">
                        <IcoTrendUp />
                        +12.5% vs last month
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:300ms] [animation-fill-mode:both]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-[#fef2f2] rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">Rejection Rate</div>
                            <div className="text-2xl font-bold text-[#1a202c]">12.1%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#dc2626] bg-[#fef2f2] border border-[#fee2e2] px-3 py-1.5 rounded-lg w-fit text-[11px] font-medium">
                        <IcoTrendUp />
                        +1.4% vs last month
                    </div>
                </div>
            </div>

            {/* ── RECENT LEADS TABLE ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                    <span className="text-[13px] font-semibold text-[#1a202c]">Recent Leads Activity</span>
                    <button className="text-[13px] font-medium text-[#2447d7] hover:underline">View All Leads</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD #</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CUSTOMER NAME</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">STATUS</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ASSIGNED AGENT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CREATED</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {RECENT_LEADS.map((lead, i) => (
                                <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${450 + i * 60}ms`, animationFillMode: 'both' }}>
                                    <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{lead.id}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: lead.bg, color: lead.tc }}>{lead.initials}</div>
                                            <span className="text-[13px] font-medium text-[#1a202c]">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-1.5 text-[12px] font-medium ${lead.statusCls}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${lead.dot}`} />
                                            {lead.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568]">{lead.agent}</span></td>
                                    <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0]">{lead.date}</span></td>
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
