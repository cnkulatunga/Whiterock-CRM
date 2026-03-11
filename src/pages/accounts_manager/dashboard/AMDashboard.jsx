import React from 'react';

const STAT_CARDS = [
    { label: 'Verified Clients', value: '1,284', change: '+12%', changeLabel: 'vs last month', iconBg: '#ebf0ff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { label: 'Pending Loans', value: '42', change: '+8%', changeLabel: 'vs last week', iconBg: '#fff7ed', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
    { label: 'Commission Rate', value: '2.4%', change: '+0.2%', changeLabel: 'avg growth', iconBg: '#f5f3ff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> },
    { label: 'Approved vs Rejected', value: '85% / 15%', change: '+3%', changeLabel: 'approval rate', iconBg: '#f0fdf4', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
];

const LEADS = [
    { id: '#LD-99021', client: 'Sarah Jenkins',       amount: '$250,000.00',    stage: 'DOCUMENT COLLECTION', stageCls: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]',   date: 'Oct 24, 2023' },
    { id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00',  stage: 'LENDER SELECTION',    stageCls: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]',   date: 'Oct 23, 2023' },
    { id: '#LD-98845', client: 'Marcus Aurelius',      amount: '$75,000.00',     stage: 'COMPLETE',            stageCls: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]',   date: 'Oct 22, 2023' },
    { id: '#LD-98712', client: 'Peak Dynamics',        amount: '$540,000.00',    stage: 'REJECTED',            stageCls: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]',   date: 'Oct 21, 2023' },
];

const PENDING_APPROVALS = [
    { deal: 'DEAL-4492', priority: 'PRIORITY', priorityCls: 'bg-[#ebf0ff] text-[#2447d7]',  company: 'Quantum Capital Fund',  type: 'Institutional Mortgage Loan',    avatars: ['QC', 'RP'] },
    { deal: 'DEAL-4488', priority: 'STANDARD', priorityCls: 'bg-[#f1f5f9] text-[#64748b]',  company: 'Global Trade Bank',     type: 'Cross-border Financing Proof',   avatars: ['3'], isCount: true },
    { deal: 'DEAL-4475', priority: 'URGENT',   priorityCls: 'bg-[#fff1f2] text-[#e11d48]',  company: 'Prime Wealth Trust',    type: 'Asset Allocation Verification',  avatars: ['GT', 'PW'], extra: '+1' },
];

const AMDashboard = ({ onNavigate }) => {
    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Accounts Manager Dashboard</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Real-time overview of financial processing and lender governance.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-[#edf2f7] text-[#4a5568] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Report
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">{card.label}</span>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>{card.icon}</div>
                        </div>
                        <div className="text-2xl font-bold text-[#1a202c] mb-3">{card.value}</div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-2 py-1 rounded-lg text-[10px] font-semibold">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="9" height="9"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                {card.change}
                            </span>
                            <span className="text-[11px] text-[#a0aec0]">{card.changeLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-[1fr_340px] gap-5 xl:grid-cols-1">

                {/* Recent Lead List */}
                <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:380ms] [animation-fill-mode:both]">
                    <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <span className="text-[13px] font-semibold text-[#1a202c]">Recent Lead List</span>
                        </div>

                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc]">
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD ID</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CLIENT NAME</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">STAGE</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">DATE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7fafc]">
                                {LEADS.map((lead, i) => (
                                    <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${440 + i * 60}ms`, animationFillMode: 'both' }}>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{lead.id}</span></td>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#1a202c]">{lead.client}</span></td>
                                        <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568]">{lead.amount}</span></td>
                                        <td className="px-6 py-4"><span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${lead.stageCls}`}>{lead.stage}</span></td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0]">{lead.date}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-[#f7fafc]">
                        <button className="w-full py-2.5 text-[12px] font-medium text-[#718096] border border-dashed border-[#edf2f7] rounded-xl hover:bg-[#f8fafc] hover:border-[#2447d7] hover:text-[#2447d7] transition-all">
                            Load more leads
                        </button>
                    </div>
                </section>

                {/* Pending Lender Approvals */}
                <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:480ms] [animation-fill-mode:both] flex flex-col">
                    <div className="px-6 py-4 border-b border-[#f7fafc] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <span className="text-[13px] font-semibold text-[#1a202c]">Pending Lender Approvals</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                        {PENDING_APPROVALS.map((item, i) => (
                            <div key={item.deal} className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl p-4 hover:bg-white hover:border-[#2447d7]/20 hover:shadow-md transition-all cursor-pointer animate-rowIn" style={{ animationDelay: `${540 + i * 80}ms`, animationFillMode: 'both' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[12px] font-semibold text-[#2447d7]">{item.deal}</span>
                                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${item.priorityCls}`}>{item.priority}</span>
                                </div>
                                <div className="text-[13px] font-semibold text-[#1a202c] mb-0.5">{item.company}</div>
                                <div className="text-[11px] text-[#718096] mb-3">{item.type}</div>
                                <div className="flex items-center -space-x-2">
                                    {item.isCount ? (
                                        <div className="w-8 h-8 rounded-full bg-[#ebf0ff] border-2 border-white text-[#2447d7] flex items-center justify-center text-[11px] font-bold">{item.avatars[0]}</div>
                                    ) : (
                                        item.avatars.map((av, j) => (
                                            <div key={j} className="w-8 h-8 rounded-full bg-[#f1f5f9] border-2 border-white text-[#64748b] flex items-center justify-center text-[10px] font-bold">{av}</div>
                                        ))
                                    )}
                                    {item.extra && <div className="w-8 h-8 rounded-full bg-[#1a202c] border-2 border-white text-white flex items-center justify-center text-[10px] font-bold">{item.extra}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 pb-4">
                        <button className="w-full py-2.5 bg-[#2447d7] text-white rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm flex items-center justify-center gap-2" onClick={() => onNavigate && onNavigate('lender_selection')}>
                            Go to Lender Workflow
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default AMDashboard;
