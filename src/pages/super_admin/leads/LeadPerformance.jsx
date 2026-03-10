import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const RECENT_LEADS = [
    { id: '#LD-9482', name: 'Jonathan Doe', initials: 'JD', stage: 'STAGE 03', stageClass: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]', status: 'Active', statusClass: 'text-[#2447d7]', statusBg: 'bg-[#2447d7]', agent: 'Sarah Jenkins', date: 'Oct 24, 2023' },
    { id: '#LD-9481', name: 'Amanda Smith', initials: 'AS', stage: 'STAGE 01', stageClass: 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]', status: 'Active', statusClass: 'text-[#2447d7]', statusBg: 'bg-[#2447d7]', agent: 'Michael Ross', date: 'Oct 24, 2023' },
    { id: '#LD-9480', name: 'Robert King', initials: 'RK', stage: 'CLOSED WON', stageClass: 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]', status: 'Completed', statusClass: 'text-[#10b981]', statusBg: 'bg-[#10b981]', agent: 'Sarah Jenkins', date: 'Oct 23, 2023' },
    { id: '#LD-9479', name: 'Emily Lawson', initials: 'EL', stage: 'STAGE 04', stageClass: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]', status: 'Urgent', statusClass: 'text-[#e53e3e]', statusBg: 'bg-[#e53e3e]', agent: 'David Miller', date: 'Oct 23, 2023' },
];

/* ─── ICONS ─────────────────────────────────────── */
const IcoSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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


/* ─── KPI CARD ──────────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trendIcon, trendText, trendClass }) => (
    <div className="bg-white rounded-3xl border border-[#edf2f7] p-8 shadow-sm flex flex-col gap-6 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6" style={{ background: iconBg }}>
                {React.cloneElement(icon, { strokeWidth: 2.5 })}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest leading-none">{label}</span>
                <span className="text-3xl font-black text-[#1a202c] tracking-tight">{value}</span>
            </div>
        </div>
        <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border w-fit ${trendClass}`}>
            {trendIcon}
            <span>{trendText}</span>
        </div>
    </div>
);



/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const LeadPerformance = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [agent, setAgent] = useState('All Agents');
    const [leadStage, setLeadStage] = useState('All Stages');
    const [leadStatus, setLeadStatus] = useState('Active');

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
                            placeholder="Quick search..." 
                        />
                    </div>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            <div className="flex flex-col gap-8">

                {/* ── PAGE HEADING ── */}
                <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl">Lead Performance Report</h1>
                        <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Detailed analysis of lead acquisition and conversion metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#4a5568] px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#f8fafc] hover:shadow-md transition-all active:scale-95"><IcoFileCSV /> Export CSV</button>
                        <button className="flex items-center gap-2.5 bg-[#2447d7] text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#1732a3] hover:shadow-lg shadow-[#2447d7]/20 transition-all active:scale-95"><IcoFilePDF /> Export PDF</button>
                    </div>
                </header>

                {/* ── FILTERS ── */}
                <div className="bg-white rounded-3xl border border-[#edf2f7] p-8 shadow-sm grid grid-cols-4 gap-6 lg:grid-cols-2 sm:grid-cols-1 sm:p-6">
                    {[
                        { label: 'DATE RANGE', value: dateRange, setter: setDateRange, opts: ['Last 30 Days', 'Last 90 Days', 'This Year'] },
                        { label: 'ASSIGNED AGENT', value: agent, setter: setAgent, opts: ['All Agents', 'Sarah Jenkins', 'Michael Ross', 'David Miller'] },
                        { label: 'LEAD STAGE', value: leadStage, setter: setLeadStage, opts: ['All Stages', 'Stage 01', 'Stage 02', 'Stage 03', 'Stage 04', 'Closed Won'] },
                        { label: 'LEAD STATUS', value: leadStatus, setter: setLeadStatus, opts: ['Active', 'Completed', 'Urgent', 'All'] },
                    ].map(f => (
                        <div className="flex flex-col gap-2.5" key={f.label}>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">{f.label}</span>
                            <div className="relative group">
                                <select 
                                    className="w-full bg-[#f1f5f9] border-2 border-transparent p-3.5 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all"
                                    value={f.value} 
                                    onChange={e => f.setter(e.target.value)}
                                >
                                    {f.opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                                    <IcoChevron />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── KPI CARDS ── */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-1">
                    <KpiCard
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
                        label="Total Leads" value="1,482"
                        trendIcon={<IcoTrendUp />} trendText="+12.5% vs last month" trendClass="bg-[#ecfdf5] text-[#059669] border-[#d1fae5]"
                    />
                    <KpiCard
                        iconBg="#fef2f2"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>}
                        label="Rejection Rate" value="12.1%"
                        trendIcon={<IcoTrendUp />} trendText="+1.4% vs last month" trendClass="bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]"
                    />
                </div>



                {/* ── RECENT LEADS ── */}
                <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff] sm:flex-col sm:items-start sm:gap-6 sm:p-6">
                        <span className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] border-l-4 border-[#2447d7] pl-3">Recent Leads Activity</span>
                        <button className="text-[12px] font-black font-['Sora',sans-serif] text-[#2447d7] hover:underline underline-offset-4 decoration-2">View All Leads</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#fbfeff]">
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">LEAD ENTITY</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">CUSTOMER NAME</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">CURRENT STAGE</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">GATEWAY STATUS</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">ASSIGNED AGENT</th>
                                    <th className="p-5 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">DATA GENERATED</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7fafc]">
                                {RECENT_LEADS.map((lead, idx) => (
                                    <tr key={lead.id} className="hover:bg-[#f8faff]/50 transition-all group">
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#2447d7] font-mono group-hover:underline cursor-pointer">{lead.id}</span></td>
                                        <td className="p-6 px-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center font-black text-[13px] shadow-sm transform transition-transform group-hover:scale-110">{lead.initials}</div>
                                                <span className="text-[14px] font-black text-[#1a202c] tracking-tight">{lead.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 px-10"><span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider ${lead.stageClass}`}>{lead.stage}</span></td>
                                        <td className="p-6 px-10">
                                            <div className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest ${lead.statusClass}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ring-4 ${lead.statusBg} ring-opacity-20 animate-pulse`} />
                                                {lead.status}
                                            </div>
                                        </td>
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#4a5568]">{lead.agent}</span></td>
                                        <td className="p-6 px-10"><span className="text-[12px] font-bold text-[#a0aec0] uppercase">{lead.date}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default LeadPerformance;
