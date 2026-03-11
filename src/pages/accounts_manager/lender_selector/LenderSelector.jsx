import React, { useState } from 'react';

const LEADS = [
    { id: '#LD-10021', name: 'Jonathan Doe',    email: 'jonathan.doe@email.com', phone: '+1 (555) 201-4432', source: 'Referral',  status: 'New',       lastContact: 'Oct 24, 2023', loanAmount: '$500,000.00' },
    { id: '#LD-10018', name: 'Priya Nair',      email: 'priya.nair@email.com',   phone: '+1 (555) 318-9901', source: 'Website',   status: 'Contacted', lastContact: 'Oct 23, 2023', loanAmount: '$875,000.00' },
    { id: '#LD-10015', name: 'Marcus Reed',     email: 'marcus.reed@email.com',  phone: '+1 (555) 442-7712', source: 'Cold Call', status: 'Qualified', lastContact: 'Oct 22, 2023', loanAmount: '$320,000.00' },
    { id: '#LD-10009', name: 'TechBridge Corp', email: 'contact@techbridge.com', phone: '+1 (555) 670-3348', source: 'Partner',   status: 'Qualified', lastContact: 'Oct 21, 2023', loanAmount: '$2,400,000.00' },
    { id: '#LD-10003', name: 'Sandra Okonkwo',  email: 'sandra.o@email.com',     phone: '+1 (555) 899-1120', source: 'Referral',  status: 'New',       lastContact: 'Oct 20, 2023', loanAmount: '$430,000.00' },
    { id: '#LD-09998', name: 'James Whitfield', email: 'j.whitfield@email.com',  phone: '+1 (555) 504-2291', source: 'Website',   status: 'Contacted', lastContact: 'Oct 19, 2023', loanAmount: '$150,000.00' },
];

const LenderSelector = ({ onNavigate }) => {
    const [search, setSearch] = useState('');

    const filtered = LEADS.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Leads', value: LEADS.length, bg: '#ebf0ff', color: '#2447d7', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
        { label: 'Qualified',   value: LEADS.filter(l => l.status === 'Qualified').length, bg: '#ecfdf5', color: '#16a34a', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
        { label: 'Contacted',  value: LEADS.filter(l => l.status === 'Contacted').length, bg: '#dbeafe', color: '#1d4ed8', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
        { label: 'New',        value: LEADS.filter(l => l.status === 'New').length, bg: '#fff7ed', color: '#f97316', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lender Selector</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Review tele-agent submitted leads and assign them to financial lenders.</p>
                </div>

            </header>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center gap-4 animate-kpiPop" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">{stat.icon}</svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1a202c] leading-none mb-0.5">{stat.value}</div>
                            <div className="text-[11px] font-medium text-[#a0aec0]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                    <span className="text-[13px] font-semibold text-[#1a202c]">Tele-Agent Leads</span>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            type="text"
                            className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-9 pr-4 py-2 text-[13px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all w-[280px] placeholder:text-[#cbd5e0]"
                            placeholder="Search by name, ID or email..."
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
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CONTACT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LOAN AMOUNT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">SOURCE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LAST CONTACT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((lead, i) => {
                                const isSelected = lead.status === 'Qualified';
                                return (
                                    <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${450 + i * 60}ms`, animationFillMode: 'both' }}>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{lead.id}</span></td>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#1a202c]">{lead.name}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[12px] text-[#4a5568]">{lead.email}</span>
                                                <span className="text-[11px] text-[#a0aec0]">{lead.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#1a202c]">{lead.loanAmount}</span></td>
                                        <td className="px-6 py-4"><span className="text-[10px] font-semibold px-2.5 py-1 bg-[#f1f5f9] text-[#64748b] rounded-lg border border-[#e2e8f0] uppercase tracking-wide">{lead.source}</span></td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#718096]">{lead.lastContact}</span></td>
                                        <td className="px-6 py-4">
                                            {isSelected ? (
                                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] px-3 py-1.5 rounded-lg border border-[#d1fae5] w-fit">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
                                                    Lender Selected
                                                </span>
                                            ) : (
                                                <button
                                                    className="flex items-center gap-2 bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[12px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm"
                                                    onClick={() => onNavigate && onNavigate('lender_selection', lead)}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                    Select Lender
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
                    <div className="px-6 py-12 text-center">
                        <p className="text-[13px] text-[#a0aec0]">No leads match your search.</p>
                    </div>
                )}
                <div className="px-6 py-4 border-t border-[#f7fafc] bg-[#fcfdff]">
                    <span className="text-[12px] text-[#a0aec0]">Showing <span className="text-[#1a202c] font-medium">{filtered.length}</span> of <span className="text-[#1a202c] font-medium">{LEADS.length}</span> leads</span>
                </div>
            </section>

        </div>
    );
};

export default LenderSelector;
