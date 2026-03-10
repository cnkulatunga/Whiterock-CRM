import React, { useState } from 'react';

const DRAFTS = [
    { id: '#LD-99105', client: 'Marcus Reed',       amount: '$320,000.00', stage: 'Loan Details',    lastEdited: 'Oct 24, 2023', progress: 30 },
    { id: '#LD-99089', client: 'Priya Nair',        amount: '$875,000.00', stage: 'Lender Selection',lastEdited: 'Oct 23, 2023', progress: 65 },
    { id: '#LD-99074', client: 'James Whitfield',   amount: '$150,000.00', stage: 'Document Review', lastEdited: 'Oct 22, 2023', progress: 50 },
    { id: '#LD-99061', client: 'TechBridge Corp',   amount: '$2,400,000.00',stage: 'Loan Details',   lastEdited: 'Oct 21, 2023', progress: 20 },
    { id: '#LD-99040', client: 'Sandra Okonkwo',    amount: '$430,000.00', stage: 'Lender Selection',lastEdited: 'Oct 20, 2023', progress: 70 },
];

const STAGE_COLOR = {
    'Loan Details':     { bg: '#ebf0ff', text: '#2447d7', border: '#d9e8ff' },
    'Lender Selection': { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
    'Document Review':  { bg: '#fff7ed', text: '#f97316', border: '#ffedd5' },
};

const DraftDashboard = ({ onNavigate }) => {
    const [search, setSearch] = useState('');

    const filtered = DRAFTS.filter(d =>
        d.client.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="flex flex-col gap-1.5 sm:mb-2 text-[#1a202c]">
                <h1 className="text-[1.75rem] font-black tracking-tight sm:text-2xl">Draft Repository</h1>
                <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">System-wide persistent drafts of in-progress financial ledger entries.</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                {[
                    { label: 'Total Active Drafts', value: '5', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>, bg: '#ebf0ff', color: '#2447d7' },
                    { label: 'Mandatory Action', value: '2', icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, bg: '#fff7ed', color: '#f97316' },
                    { label: 'Completion Velocity', value: '48%', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, bg: '#ecfdf5', color: '#16a34a' },
                    { label: 'Total Valuation', value: '$4.2M', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>, bg: '#fff1f2', color: '#e11d48' }
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

            {/* Table card */}
            <div className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff] sm:flex-col sm:items-start sm:gap-6 sm:p-6">
                    <h3 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">In-Progress Ledger Entries</h3>
                    <div className="relative group min-w-[300px] sm:min-w-full">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-[#1a202c] outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em]"
                            placeholder="Universal Ledger Query..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#fbfeff]">
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">LEDGER ID</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">BENEFICIARY</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">VALUATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">PROCESS NODE</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">COMPLETION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">LAST MUTATION</th>
                                <th className="p-6 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">GOVERNANCE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((draft) => {
                                const sc = STAGE_COLOR[draft.stage] || { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
                                return (
                                    <tr key={draft.id} className="hover:bg-[#f8faff]/50 transition-all group">
                                        <td className="p-6 px-10"><span className="text-[13px] font-bold text-[#2447d7] font-mono tracking-tight group-hover:underline cursor-pointer">{draft.id}</span></td>
                                        <td className="p-6 px-10"><span className="text-[14px] font-black text-[#1a202c] tracking-tight">{draft.client}</span></td>
                                        <td className="p-6 px-10"><span className="text-[14px] font-bold text-[#4a5568] font-mono tracking-tighter">{draft.amount}</span></td>
                                        <td className="p-6 px-10">
                                            <span className="text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider whitespace-nowrap" style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                {draft.stage}
                                            </span>
                                        </td>
                                        <td className="p-6 px-10">
                                            <div className="flex items-center gap-4 min-w-[140px]">
                                                <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-[#2447d7] to-[#7c3aed] rounded-full transition-all duration-1000 ease-out" 
                                                        style={{ width: `${draft.progress}%` }} 
                                                    />
                                                </div>
                                                <span className="text-[11px] font-black text-[#1a202c] font-mono">{draft.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="p-6 px-10"><span className="text-[12px] font-bold text-[#a0aec0] uppercase whitespace-nowrap">{draft.lastEdited}</span></td>
                                        <td className="p-6 px-10">
                                            <button
                                                className="px-5 py-2.5 bg-white border-2 border-[#f1f5f9] text-[#2447d7] rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#2447d7] hover:text-white hover:border-[#2447d7] hover:shadow-lg transition-all active:scale-95 group/btn"
                                                onClick={() => onNavigate && onNavigate('lender_selection')}
                                            >
                                                Resume
                                            </button>
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
                        <p className="text-[13px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Zero results found for current query parameters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraftDashboard;
