import React from 'react';

const RECENT_LENDERS = [
    { id: 1, name: 'ANZ Bank',          type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', status: 'Active' },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', status: 'Active' },
    { id: 3, name: 'Macquarie Bank',    type: 'Non-Bank',   interestRate: '5.59%', maxLoan: '$5,000,000', status: 'Active' },
    { id: 4, name: 'Liberty Financial', type: 'Non-Bank',   interestRate: '6.49%', maxLoan: '$1,500,000', status: 'Inactive' },
];

const TYPE_COLORS = {
    'Major Bank': { bg: 'rgba(36,71,215,0.08)', color: '#2447d7', border: 'rgba(36,71,215,0.18)' },
    'Non-Bank':   { bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

const STAT_CARDS = [
    { label: 'Verified Clients', value: '1,284', change: '+12%', changeLabel: 'vs last month', iconBg: '#ebf0ff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { label: 'Pending Loans', value: '42', change: '+8%', changeLabel: 'vs last week', iconBg: '#fff7ed', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },

    { label: 'Approved vs Rejected', value: '85% / 15%', change: '+3%', changeLabel: 'approval rate', iconBg: '#f0fdf4', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
];

const LEADS = [
    { id: '#LD-99021', client: 'Sarah Jenkins',       amount: '$250,000.00',    stage: 'DOCUMENT COLLECTION', stageCls: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]',   date: 'Oct 24, 2023' },
    { id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00',  stage: 'LENDER SELECTION',    stageCls: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]',   date: 'Oct 23, 2023' },
    { id: '#LD-98845', client: 'Marcus Aurelius',      amount: '$75,000.00',     stage: 'COMPLETE',            stageCls: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]',   date: 'Oct 22, 2023' },
    { id: '#LD-98712', client: 'Peak Dynamics',        amount: '$540,000.00',    stage: 'REJECTED',            stageCls: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]',   date: 'Oct 21, 2023' },
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
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
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
            <div className="grid grid-cols-[1fr_400px] gap-5 xl:grid-cols-1">

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

                {/* Recently Added Lenders */}
                <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:480ms] [animation-fill-mode:both] flex flex-col">
                    {/* Section Header */}
                    <div className="px-6 py-4 border-b border-[#f7fafc] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                            </div>
                            <span className="text-[13px] font-semibold text-[#1a202c]">Recently Added Lenders</span>
                        </div>
                        <span className="text-[10px] font-black text-[#94a3b8] bg-[#f1f5f9] px-2.5 py-1 rounded-lg border border-[#edf2f7]">
                            {RECENT_LENDERS.slice(0, 3).length} lenders
                        </span>
                    </div>

                    {/* Lender Cards */}
                    <div className="p-4 flex flex-col gap-4 flex-1">
                        {RECENT_LENDERS.slice(0, 3).map((lender, i) => {
                            const tc = TYPE_COLORS[lender.type] || TYPE_COLORS['Major Bank'];
                            return (
                                <div
                                    key={lender.id}
                                    className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl p-5 hover:bg-white hover:border-[#2447d7]/20 hover:shadow-md transition-all cursor-pointer animate-rowIn"
                                    style={{ animationDelay: `${540 + i * 70}ms`, animationFillMode: 'both' }}
                                    onClick={() => onNavigate && onNavigate('lenders')}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg, color: tc.color }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                                                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                                </svg>
                                            </div>
                                            <span className="text-[15px] font-bold text-[#1a202c] truncate">{lender.name}</span>
                                        </div>
                                        <span
                                            className="inline-flex text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0"
                                            style={{ backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}
                                        >
                                            {lender.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[13px] text-[#718096]">
                                                Rate: <span className="font-bold text-[#1a202c]">{lender.interestRate}</span>
                                            </span>
                                            <span className="text-[13px] text-[#718096]">
                                                Max: <span className="font-bold text-[#1a202c]">{lender.maxLoan}</span>
                                            </span>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                                            lender.status === 'Active'
                                                ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]'
                                                : 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0]'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full inline-block ${lender.status === 'Active' ? 'bg-[#059669]' : 'bg-[#94a3b8]'}`} />
                                            {lender.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer CTA */}
                    <div className="px-4 pb-4">
                        <button
                            className="w-full py-2.5 bg-[#2447d7] text-white rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm flex items-center justify-center gap-2"
                            onClick={() => onNavigate && onNavigate('lenders')}
                        >
                            View All Lenders
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </button>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default AMDashboard;
