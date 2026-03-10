import React from 'react';

const STAT_CARDS = [
    {
        label: 'Verified Clients',
        value: '1,284',
        change: '+12%',
        changeLabel: 'vs last month',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        iconBg: '#ebf0ff',
    },
    {
        label: 'Pending Loans',
        value: '42',
        change: '+8%',
        changeLabel: 'vs last week',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
        ),
        iconBg: '#fff7ed',
    },
    {
        label: 'Commission Rate',
        value: '2.4%',
        change: '+0.2%',
        changeLabel: 'avg growth',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <line x1="19" y1="5" x2="5" y2="19" />
                <circle cx="6.5" cy="6.5" r="2.5" />
                <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
        ),
        iconBg: '#f5f3ff',
    },
    {
        label: 'Approved vs Rejected',
        value: '85% / 15%',
        change: '+3%',
        changeLabel: 'approval rate',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
        ),
        iconBg: '#f0fdf4',
    },
];

const LEADS = [
    { id: '#LD-99021', client: 'Sarah Jenkins', amount: '$250,000.00', stage: 'DOCUMENT COLLECTION', stageClass: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]', date: 'Oct 24, 2023' },
    { id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00', stage: 'LENDER SELECTION', stageClass: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]', date: 'Oct 23, 2023' },
    { id: '#LD-98845', client: 'Marcus Aurelius', amount: '$75,000.00', stage: 'COMPLETE', stageClass: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]', date: 'Oct 22, 2023' },
    { id: '#LD-98712', client: 'Peak Dynamics', amount: '$540,000.00', stage: 'REJECTED', stageClass: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]', date: 'Oct 21, 2023' },
];

const PENDING_APPROVALS = [
    {
        deal: 'DEAL-4492',
        priority: 'PRIORITY',
        priorityClass: 'bg-[#ebf0ff] text-[#2447d7] border-[#d1e1ff]',
        company: 'Quantum Capital Fund',
        type: 'Institutional Mortgage Loan',
        avatars: ['QC', 'RP'],
    },
    {
        deal: 'DEAL-4488',
        priority: 'STANDARD',
        priorityClass: 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]',
        company: 'Global Trade Bank',
        type: 'Cross-border Financing Proof',
        avatars: ['3'],
        avatarCount: true,
    },
    {
        deal: 'DEAL-4475',
        priority: 'URGENT',
        priorityClass: 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]',
        company: 'Prime Wealth Trust',
        type: 'Asset Allocation Verification',
        avatars: ['GT', 'PW'],
        extra: '+1',
    },
];

const AMDashboard = ({ onNavigate }) => {
    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col sm:mb-2">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl">Accounts Manager Dashboard</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Real-time overview of financial processing and lender governance.</p>
                </div>
                <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#4a5568] px-6 py-3 rounded-2xl text-sm font-black hover:bg-[#f8fafc] hover:shadow-md transition-all active:scale-95 whitespace-nowrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Wealth Report
                </button>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                {STAT_CARDS.map((card) => (
                    <div className="bg-white rounded-3xl border border-[#edf2f7] p-8 shadow-sm flex flex-col gap-6 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group" key={card.label}>
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pt-1">{card.label}</span>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6" style={{ background: card.iconBg }}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="text-3xl font-black text-[#1a202c] tracking-tight">{card.value}</div>
                            <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${card.positive ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                        strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                        <polyline points="17 6 23 6 23 12" />
                                    </svg>
                                    {card.change}
                                </span>
                                <span className="text-[11px] font-bold text-[#cbd5e0] leading-none">{card.changeLabel}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-[1fr_380px] gap-8 lg:grid-cols-1">
                {/* Recent Lead List */}
                <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
                    <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff] sm:flex-col sm:items-start sm:gap-6 sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center shadow-sm">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h2 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">Recent Deal Repository</h2>
                        </div>
                        <button className="text-[12px] font-black text-[#2447d7] hover:underline underline-offset-4 decoration-2 px-4 py-2 bg-[#f0f4ff] rounded-xl transition-all hover:bg-[#2447d7] hover:text-white" onClick={() => onNavigate && onNavigate('lender_selection')}>
                            Query All
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#fbfeff]">
                                    <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">ENTITY ID</th>
                                    <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">BENEFICIARY</th>
                                    <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">VALUATION</th>
                                    <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">PIPELINE STAGE</th>
                                    <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">GENERATED</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7fafc]">
                                {LEADS.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-[#f8faff]/50 transition-all group">
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#2447d7] font-mono group-hover:underline cursor-pointer">{lead.id}</span></td>
                                        <td className="p-6 px-10"><span className="text-[14px] font-black text-[#1a202c] tracking-tight">{lead.client}</span></td>
                                        <td className="p-6 px-10"><span className="text-[14px] font-bold text-[#4a5568] font-mono">{lead.amount}</span></td>
                                        <td className="p-6 px-10">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider ${lead.stageClass}`}>{lead.stage}</span>
                                        </td>
                                        <td className="p-6 px-10"><span className="text-[12px] font-bold text-[#a0aec0] uppercase whitespace-nowrap">{lead.date}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 border-t border-[#f7fafc] bg-[#fcfdff]">
                        <button className="w-full py-4 text-[13px] font-black text-[#718096] uppercase tracking-[0.2em] border-2 border-dashed border-[#edf2f7] rounded-2xl hover:bg-white hover:border-[#2447d7] hover:text-[#2447d7] transition-all active:scale-95">Load augmented ledger</button>
                    </div>
                </section>

                {/* Pending Lender Approvals */}
                <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-fit">
                    <div className="p-8 border-b border-[#f7fafc] bg-[#fcfdff]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h2 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">Pending Governance</h2>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        {PENDING_APPROVALS.map((item) => (
                            <div className="bg-[#f8fafc] border border-[#edf2f7] rounded-[1.75rem] p-6 hover:bg-white hover:border-[#2447d7]/20 hover:shadow-lg transition-all cursor-pointer group" key={item.deal}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[13px] font-black text-[#2447d7] font-mono group-hover:underline">{item.deal}</span>
                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${item.priorityClass}`}>{item.priority}</span>
                                </div>
                                <div className="text-[15px] font-black text-[#1a202c] mb-1 tracking-tight">{item.company}</div>
                                <div className="text-[12px] font-bold text-[#a0aec0] mb-6 line-clamp-1 uppercase tracking-tight">{item.type}</div>
                                <div className="flex items-center -space-x-3">
                                    {item.avatarCount ? (
                                        <div className="w-10 h-10 rounded-full bg-[#ebf0ff] border-4 border-white text-[#2447d7] flex items-center justify-center font-black text-[12px] shadow-sm">{item.avatars[0]}</div>
                                    ) : (
                                        item.avatars.map((av, i) => (
                                            <div className="w-10 h-10 rounded-full bg-[#f1f5f9] border-4 border-white text-[#64748b] flex items-center justify-center font-black text-[12px] shadow-sm transform transition-transform group-hover:scale-110" key={i} style={{zIndex: item.avatars.length - i}}>{av}</div>
                                        ))
                                    )}
                                    {item.extra && <div className="w-10 h-10 rounded-full bg-[#1a202c] border-4 border-white text-white flex items-center justify-center font-black text-[12px] shadow-sm z-[10] relative">
                                        <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse transition-all"></div>
                                        {item.extra}
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 pt-2">
                        <button className="w-full py-4 bg-[#2447d7] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all active:scale-95 flex items-center justify-center gap-3" onClick={() => onNavigate && onNavigate('lender_selection')}>
                            Initiate Approval Queue
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AMDashboard;
