import React, { useState } from 'react';

const DRAFTS = [
    { id: '#LD-99105', client: 'Marcus Reed',     amount: '$320,000.00',   stage: 'Loan Details',     lastEdited: 'Oct 24, 2023', progress: 30 },
    { id: '#LD-99089', client: 'Priya Nair',      amount: '$875,000.00',   stage: 'Lender Selection', lastEdited: 'Oct 23, 2023', progress: 65 },
    { id: '#LD-99074', client: 'James Whitfield', amount: '$150,000.00',   stage: 'Document Review',  lastEdited: 'Oct 22, 2023', progress: 50 },
    { id: '#LD-99061', client: 'TechBridge Corp', amount: '$2,400,000.00', stage: 'Loan Details',     lastEdited: 'Oct 21, 2023', progress: 20 },
    { id: '#LD-99040', client: 'Sandra Okonkwo',  amount: '$430,000.00',   stage: 'Lender Selection', lastEdited: 'Oct 20, 2023', progress: 70 },
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

    const stats = [
        { label: 'Total Drafts',    value: '5',    bg: '#ebf0ff', color: '#2447d7', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></> },
        { label: 'Awaiting Action', value: '2',    bg: '#fff7ed', color: '#f97316', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
        { label: 'Avg. Completion', value: '48%',  bg: '#ecfdf5', color: '#16a34a', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></> },
        { label: 'Total Draft Value',value: '$4.2M',bg: '#fff1f2', color: '#e11d48', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="animate-headerDrop">
                <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Draft Dashboard</h1>
                <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">All in-progress leads saved as drafts – resume anytime.</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center gap-4 animate-kpiPop" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">{stat.icon}</svg>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-[#1a202c] leading-none mb-0.5">{stat.value}</div>
                            <div className="text-[11px] font-medium text-[#a0aec0]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                    <span className="text-[13px] font-semibold text-[#1a202c]">In-Progress Leads</span>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            type="text"
                            className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-9 pr-4 py-2 text-[13px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all w-[220px] placeholder:text-[#cbd5e0]"
                            placeholder="Search drafts..."
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
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">STAGE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">PROGRESS</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LAST EDITED</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((draft, i) => {
                                const sc = STAGE_COLOR[draft.stage] || { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
                                return (
                                    <tr key={draft.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${450 + i * 60}ms`, animationFillMode: 'both' }}>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{draft.id}</span></td>
                                        <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#1a202c]">{draft.client}</span></td>
                                        <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568]">{draft.amount}</span></td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wider whitespace-nowrap" style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>{draft.stage}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#2447d7] rounded-full animate-progressFill" style={{ width: `${draft.progress}%`, transformOrigin: 'left', animationDelay: `${500 + i * 60}ms`, animationFillMode: 'both' }} />
                                                </div>
                                                <span className="text-[11px] font-medium text-[#718096] whitespace-nowrap">{draft.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0]">{draft.lastEdited}</span></td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="px-4 py-2 bg-[#ebf0ff] text-[#2447d7] rounded-xl text-[12px] font-medium hover:bg-[#2447d7] hover:text-white transition-all"
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
                    <div className="px-6 py-12 text-center">
                        <p className="text-[13px] text-[#a0aec0]">No drafts match your search.</p>
                    </div>
                )}
                <div className="px-6 py-4 border-t border-[#f7fafc] bg-[#fcfdff]">
                    <span className="text-[12px] text-[#a0aec0]">Showing <span className="text-[#1a202c] font-medium">{filtered.length}</span> of <span className="text-[#1a202c] font-medium">{DRAFTS.length}</span> in-progress drafts</span>
                </div>
            </section>

        </div>
    );
};

export default DraftDashboard;
