import React, { useState } from 'react';

const LEADS = [
    {
        id: '#LD-10021', name: 'Jonathan Doe', email: 'jonathan.doe@email.com',
        phone: '+1 (555) 201-4432', source: 'Referral', status: 'New',
        lastContact: 'Oct 24, 2023', loanAmount: '$500,000.00',
    },
    {
        id: '#LD-10018', name: 'Priya Nair', email: 'priya.nair@email.com',
        phone: '+1 (555) 318-9901', source: 'Website', status: 'Contacted',
        lastContact: 'Oct 23, 2023', loanAmount: '$875,000.00',
    },
    {
        id: '#LD-10015', name: 'Marcus Reed', email: 'marcus.reed@email.com',
        phone: '+1 (555) 442-7712', source: 'Cold Call', status: 'Qualified',
        lastContact: 'Oct 22, 2023', loanAmount: '$320,000.00',
    },
    {
        id: '#LD-10009', name: 'TechBridge Corp', email: 'contact@techbridge.com',
        phone: '+1 (555) 670-3348', source: 'Partner', status: 'Qualified',
        lastContact: 'Oct 21, 2023', loanAmount: '$2,400,000.00',
    },
    {
        id: '#LD-10003', name: 'Sandra Okonkwo', email: 'sandra.o@email.com',
        phone: '+1 (555) 899-1120', source: 'Referral', status: 'New',
        lastContact: 'Oct 20, 2023', loanAmount: '$430,000.00',
    },
    {
        id: '#LD-09998', name: 'James Whitfield', email: 'j.whitfield@email.com',
        phone: '+1 (555) 504-2291', source: 'Website', status: 'Contacted',
        lastContact: 'Oct 19, 2023', loanAmount: '$150,000.00',
    },
];

const LenderSelector = ({ onNavigate }) => {
    const [search, setSearch] = useState('');

    const filtered = LEADS.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectLender = (lead) => {
        onNavigate && onNavigate('lender_selection', lead);
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="flex flex-col gap-1.5 sm:mb-2 text-[#1a202c]">
                <h1 className="text-[1.75rem] font-black tracking-tight sm:text-2xl">Institutional Target Selector</h1>
                <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Evaluation and designation of tele-agent submitted leads for financial institutional distribution.</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                {[
                    { label: 'Aggregate Lead Count', value: LEADS.length, icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, bg: '#ebf0ff', color: '#2447d7' },
                    { label: 'Validated Qualified', value: LEADS.filter(l => l.status === 'Qualified').length, icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>, bg: '#ecfdf5', color: '#16a34a' },
                    { label: 'Active Engagement', value: LEADS.filter(l => l.status === 'Contacted').length, icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, bg: '#dbeafe', color: '#1d4ed8' },
                    { label: 'Initial Influx', value: LEADS.filter(l => l.status === 'New').length, icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>, bg: '#fff7ed', color: '#f97316' }
                ].map((stat, i) => (
                    <div className="bg-white p-8 rounded-[2rem] border border-[#edf2f7] shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300" key={i}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ background: stat.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="3"
                                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                {stat.icon}
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="text-2xl font-black text-[#1a202c] tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff] sm:flex-col sm:items-start sm:gap-6 sm:p-6">
                    <h3 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">Tele-Agent Propagation Ledger</h3>
                    <div className="relative group min-w-[350px] sm:min-w-full">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-[#1a202c] outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em]"
                            placeholder="Search Entity Name or ID..."
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
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">COMMUNICATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">VALUATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">ORIGINATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">LAST MUTATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">DISTRIBUTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((lead) => {
                                const isSubmitted = lead.status === 'Qualified';
                                return (
                                    <tr key={lead.id} className="hover:bg-[#f8faff]/50 transition-all group">
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#2447d7] font-mono group-hover:underline cursor-pointer tracking-tight">{lead.id}</span></td>
                                        <td className="p-6 px-10"><span className="text-[14px] font-black text-[#1a202c] tracking-tight">{lead.name}</span></td>
                                        <td className="p-6 px-10">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[12px] font-bold text-[#4a5568]">{lead.email}</span>
                                                <span className="text-[11px] font-bold text-[#a0aec0] font-mono">{lead.phone}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 px-10"><span className="text-[14px] font-bold text-[#4a5568] font-mono tracking-tighter">{lead.loanAmount}</span></td>
                                        <td className="p-6 px-10"><span className="text-[10px] font-black px-2.5 py-1 bg-[#f1f5f9] text-[#64748b] rounded-lg border border-[#e2e8f0] uppercase tracking-widest">{lead.source}</span></td>
                                        <td className="p-6 px-10"><span className="text-[12px] font-bold text-[#a0aec0] uppercase whitespace-nowrap">{lead.lastContact}</span></td>
                                        <td className="p-6 px-10 text-right">
                                            {isSubmitted ? (
                                                <span className="flex items-center gap-2 text-[10px] font-black text-[#059669] uppercase tracking-[0.1em] bg-[#ecfdf5] px-4 py-2 rounded-xl border border-[#d1fae5] shadow-sm">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>
                                                    Assigned to Lender
                                                </span>
                                            ) : (
                                                <button
                                                    className="flex items-center justify-center gap-2.5 bg-[#2447d7] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all active:scale-95 whitespace-nowrap"
                                                    onClick={() => handleSelectLender(lead)}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                    </svg>
                                                    Designate Lender
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4 bg-[#fcfdff]">
                        <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center border-2 border-dashed border-[#edf2f7]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2.5" width="24" height="24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <p className="text-[13px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Zero entities match current propagation parameters</p>
                    </div>
                )}

                <div className="p-8 px-10 border-t border-[#f7fafc] bg-[#fcfdff] text-[12px] font-bold text-[#cbd5e0] uppercase tracking-widest">
                    Showing <strong className="text-[#1a202c] font-black">{filtered.length}</strong> of <strong className="text-[#1a202c] font-black">{LEADS.length}</strong> propagation nodes
                </div>
            </section>
        </div>
    );
};

export default LenderSelector;
