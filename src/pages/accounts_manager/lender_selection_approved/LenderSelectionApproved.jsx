import React, { useState } from 'react';

const APPROVED = [
    { id: '#LD-98912', client: 'TechStream Solutions',  amount: '$1,200,000.00', lender: 'Bank of Whiterock',  interestRate: '3.8%', tenure: '30 Years', approvedDate: 'Oct 23, 2023' },
    { id: '#LD-98845', client: 'Marcus Aurelius',        amount: '$75,000.00',    lender: 'Global Finance',     interestRate: '4.2%', tenure: '15 Years', approvedDate: 'Oct 22, 2023' },
    { id: '#LD-98721', client: 'Quantum Capital Fund',   amount: '$4,500,000.00', lender: 'Apex Capital Group', interestRate: '3.5%', tenure: '20 Years', approvedDate: 'Oct 20, 2023' },
    { id: '#LD-98614', client: 'Prime Wealth Trust',     amount: '$980,000.00',   lender: 'Secure Lenders',     interestRate: '4.9%', tenure: '25 Years', approvedDate: 'Oct 18, 2023' },
    { id: '#LD-98502', client: 'Global Trade Bank',      amount: '$2,200,000.00', lender: 'Bank of Whiterock',  interestRate: '3.6%', tenure: '30 Years', approvedDate: 'Oct 15, 2023' },
];

const LENDERS = [
    'Bank of Whiterock',
    'Global Finance',
    'Apex Capital Group',
    'Secure Lenders',
    'Northline Credit',
    'PrimeLend Partners',
];

const LenderSelectionApproved = () => {
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(
        APPROVED.map(item => ({ ...item, selectedLender: item.lender, decision: 'pending' }))
    );

    const setLender   = (id, lender)   => setRows(prev => prev.map(r => r.id === id ? { ...r, selectedLender: lender }   : r));
    const setDecision = (id, decision) => setRows(prev => prev.map(r => r.id === id ? { ...r, decision }                  : r));

    const filtered       = rows.filter(a =>
        a.client.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.selectedLender.toLowerCase().includes(search.toLowerCase())
    );
    const totalApproved  = rows.filter(a => a.decision === 'approved').length;
    const totalRejected  = rows.filter(a => a.decision === 'rejected').length;
    const totalPending   = rows.filter(a => a.decision === 'pending').length;

    const stats = [
        { label: 'Total Leads',  value: rows.length,     bg: '#ebf0ff', color: '#2447d7', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
        { label: 'Approved',     value: totalApproved,   bg: '#ecfdf5', color: '#16a34a', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
        { label: 'Rejected',     value: totalRejected,   bg: '#fff1f2', color: '#e11d48', icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
        { label: 'Pending',      value: totalPending,    bg: '#fff7ed', color: '#f97316', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
        { label: 'Total Value',  value: '$8,955,000.00', bg: '#f5f3ff', color: '#7c3aed', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lender Selection Approved</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Accounts manager can assign lender and approve or reject each lead.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-[#edf2f7] text-[#4a5568] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Report
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 animate-kpiPop min-w-0" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">{stat.icon}</svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[15px] font-bold text-[#1a202c] leading-none mb-0.5 truncate">{stat.value}</div>
                            <div className="text-[11px] font-medium text-[#a0aec0]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:500ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                    <span className="text-[13px] font-semibold text-[#1a202c]">Approved Leads</span>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            type="text"
                            className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-9 pr-4 py-2 text-[13px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all w-[280px] placeholder:text-[#cbd5e0]"
                            placeholder="Search by client, ID or lender..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD ID</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CLIENT NAME</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LENDER SELECTOR</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">INTEREST RATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">TENURE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">APPROVED DATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((row, i) => (
                                <tr key={row.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${550 + i * 60}ms`, animationFillMode: 'both' }}>
                                    <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{row.id}</span></td>
                                    <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#1a202c]">{row.client}</span></td>
                                    <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568]">{row.amount}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 min-w-[190px]">
                                            <div className="w-7 h-7 rounded-lg bg-[#ebf0ff] flex items-center justify-center shrink-0 border border-[#d9e8ff]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                            </div>
                                            <select
                                                className="bg-transparent border-none text-[13px] font-medium text-[#1a202c] outline-none cursor-pointer focus:text-[#2447d7] transition-colors"
                                                value={row.selectedLender}
                                                onChange={e => setLender(row.id, e.target.value)}
                                            >
                                                {LENDERS.map(lender => (
                                                    <option key={lender} value={lender}>{lender}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[12px] font-semibold text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-lg border border-[#d1fae5]">{row.interestRate}</span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-[12px] text-[#718096]">{row.tenure}</span></td>
                                    <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0]">{row.approvedDate}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${row.decision === 'approved' ? 'bg-[#10b981] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#dcfce7] hover:text-[#16a34a]'}`}
                                                onClick={() => setDecision(row.id, 'approved')}
                                            >✓</button>
                                            <button
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${row.decision === 'rejected' ? 'bg-[#e11d48] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#ffe4e6] hover:text-[#e11d48]'}`}
                                                onClick={() => setDecision(row.id, 'rejected')}
                                            >✕</button>
                                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wide whitespace-nowrap ${
                                                row.decision === 'approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' :
                                                row.decision === 'rejected' ? 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]' :
                                                'bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0]'
                                            }`}>
                                                {row.decision}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-[13px] text-[#a0aec0]">No leads match your search.</p>
                    </div>
                )}

                <div className="px-6 py-4 border-t border-[#f7fafc] bg-[#fcfdff]">
                    <span className="text-[12px] text-[#a0aec0]">Showing <span className="text-[#1a202c] font-medium">{filtered.length}</span> of <span className="text-[#1a202c] font-medium">{APPROVED.length}</span> approved leads</span>
                </div>
            </section>

        </div>
    );
};

export default LenderSelectionApproved;
