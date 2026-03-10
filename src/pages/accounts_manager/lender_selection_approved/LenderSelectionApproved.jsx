import React, { useState } from 'react';

const APPROVED = [
    {
        id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00',
        lender: 'Bank of Whiterock', lenderTier: 'Tier 1 • Trusted Partner',
        approvedDate: 'Oct 23, 2023', interestRate: '3.8%', tenure: '30 Years',
    },
    {
        id: '#LD-98845', client: 'Marcus Aurelius', amount: '$75,000.00',
        lender: 'Global Finance', lenderTier: 'Tier 1 • International',
        approvedDate: 'Oct 22, 2023', interestRate: '4.2%', tenure: '15 Years',
    },
    {
        id: '#LD-98721', client: 'Quantum Capital Fund', amount: '$4,500,000.00',
        lender: 'Apex Capital Group', lenderTier: 'Tier 1 • High Net Worth',
        approvedDate: 'Oct 20, 2023', interestRate: '3.5%', tenure: '20 Years',
    },
    {
        id: '#LD-98614', client: 'Prime Wealth Trust', amount: '$980,000.00',
        lender: 'Secure Lenders', lenderTier: 'Tier 2 • Private Equity',
        approvedDate: 'Oct 18, 2023', interestRate: '4.9%', tenure: '25 Years',
    },
    {
        id: '#LD-98502', client: 'Global Trade Bank', amount: '$2,200,000.00',
        lender: 'Bank of Whiterock', lenderTier: 'Tier 1 • Trusted Partner',
        approvedDate: 'Oct 15, 2023', interestRate: '3.6%', tenure: '30 Years',
    },
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
        APPROVED.map((item) => ({
            ...item,
            selectedLender: item.lender,
            decision: 'pending', // pending | approved | rejected
        }))
    );

    const setLender = (id, lender) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, selectedLender: lender } : r)));
    };

    const setDecision = (id, decision) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, decision } : r)));
    };

    const filtered = rows.filter(a => {
        const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) ||
            a.id.toLowerCase().includes(search.toLowerCase()) ||
            a.selectedLender.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const totalApproved = rows.filter(a => a.decision === 'approved').length;
    const totalRejected = rows.filter(a => a.decision === 'rejected').length;
    const totalPending = rows.filter(a => a.decision === 'pending').length;
    const totalValue = '$8,955,000.00';

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col sm:mb-2 text-[#1a202c]">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[1.75rem] font-black tracking-tight sm:text-2xl text-[#1a202c]">Lender Fulfillment Registry</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Authorized accounts manager portal for lender finalization and governance adjudication.</p>
                </div>
                <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#4a5568] px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wider hover:bg-[#f8fafc] hover:shadow-md transition-all active:scale-95 whitespace-nowrap sm:w-full sm:justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Fulfillment Audit
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-6 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
                {[
                    { label: 'Cumulative Entity Count', value: rows.length, icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>, bg: '#ebf0ff', color: '#2447d7' },
                    { label: 'Fulfillment Approved', value: totalApproved, icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>, bg: '#ecfdf5', color: '#16a34a' },
                    { label: 'Governance Rejected', value: totalRejected, icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>, bg: '#fff1f2', color: '#e11d48' },
                    { label: 'Evaluation Pending', value: totalPending, icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, bg: '#fff7ed', color: '#f97316' },
                    { label: 'Aggregate Ledger Value', value: totalValue, icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, bg: '#f5f3ff', color: '#7c3aed' }
                ].map((stat, i) => (
                    <div className="bg-white p-6 rounded-[2rem] border border-[#edf2f7] shadow-sm flex items-center gap-5 group hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300" key={i}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ background: stat.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="3"
                                strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                {stat.icon}
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="text-xl font-black text-[#1a202c] tracking-tight">{stat.value}</div>
                            <div className="text-[9px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] truncate">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff] sm:flex-col sm:items-start sm:gap-6 sm:p-6">
                    <h3 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">Authorized Fulfilment Matrix</h3>
                    <div className="relative group min-w-[350px] sm:min-w-full">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-[#1a202c] outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em]"
                            placeholder="Search Entity, ID or Institution..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#fbfeff]">
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">ENTITY ID</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">BENEFICIARY</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">VALUATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">INSTITUTIONAL NODE</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">YIELD</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">MATURITY</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">TS APPROVED</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">GOVERNANCE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((row) => (
                                <tr key={row.id} className="hover:bg-[#f8faff]/50 transition-all group">
                                    <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#2447d7] font-mono group-hover:underline cursor-pointer">{row.id}</span></td>
                                    <td className="p-6 px-10"><span className="text-[14px] font-black text-[#1a202c] tracking-tight">{row.client}</span></td>
                                    <td className="p-6 px-10"><span className="text-[14px] font-bold text-[#4a5568] font-mono tracking-tighter">{row.amount}</span></td>
                                    <td className="p-6 px-10">
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center shrink-0 border border-[#d1e1ff]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                            </div>
                                            <select
                                                className="bg-transparent border-none text-[13px] font-black text-[#1a202c] outline-none cursor-pointer focus:text-[#2447d7] transition-colors truncate"
                                                value={row.selectedLender}
                                                onChange={(e) => setLender(row.id, e.target.value)}
                                            >
                                                {LENDERS.map((lender) => (
                                                    <option key={`${row.id}-${lender}`} value={lender}>
                                                        {lender}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="p-6 px-10"><span className="text-[13px] font-black text-[#059669] px-2 py-0.5 bg-[#ecfdf5] rounded-md border border-[#d1fae5]">{row.interestRate}</span></td>
                                    <td className="p-6 px-10"><span className="text-[12px] font-bold text-[#4a5568] uppercase whitespace-nowrap">{row.tenure}</span></td>
                                    <td className="p-6 px-10"><span className="text-[12px] font-bold text-[#a0aec0] uppercase whitespace-nowrap">{row.approvedDate}</span></td>
                                    <td className="p-6 px-10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex bg-[#f1f5f9] p-1 rounded-xl gap-1">
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-[12px] transition-all ${row.decision === 'approved' ? 'bg-[#10b981] text-white shadow-lg' : 'text-[#94a3b8] hover:text-[#4a5568] hover:bg-[#e2e8f0]'}`}
                                                    onClick={() => setDecision(row.id, 'approved')}
                                                    title="Approve Institutional Fulfillment"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-[12px] transition-all ${row.decision === 'rejected' ? 'bg-[#e11d48] text-white shadow-lg' : 'text-[#94a3b8] hover:text-[#4a5568] hover:bg-[#e2e8f0]'}`}
                                                    onClick={() => setDecision(row.id, 'rejected')}
                                                    title="Reject Institutional Fulfillment"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border min-w-[75px] text-center ${row.decision === 'approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : row.decision === 'rejected' ? 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]' : 'bg-[#f8fafc] text-[#cbd5e0] border-[#f1f5f9]'}`}>
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
                    <div className="p-20 text-center flex flex-col items-center gap-4 bg-[#fcfdff]">
                        <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center border-2 border-dashed border-[#edf2f7]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2.5" width="24" height="24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <p className="text-[13px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Zero entities match current fulfillment parameters</p>
                    </div>
                )}

                <div className="p-8 px-10 border-t border-[#f7fafc] bg-[#fcfdff] text-[12px] font-bold text-[#cbd5e0] uppercase tracking-widest">
                    Showing <strong className="text-[#1a202c] font-black">{filtered.length}</strong> of <strong className="text-[#1a202c] font-black">{APPROVED.length}</strong> active fulfillment nodes
                </div>
            </section>
        </div>
    );
};

export default LenderSelectionApproved;
