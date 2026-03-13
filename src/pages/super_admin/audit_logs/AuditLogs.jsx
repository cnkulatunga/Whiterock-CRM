import React, { useState } from 'react';

const LOG_ENTRIES = [
    { id: 1, date: 'Oct 24, 2023', time: '14:23:45 EST', initials: 'JD',  bg: '#22c55e', initBg: '#22c55e', name: 'Jane Doe',          role: 'Compliance', roleCls: 'bg-[#ecfdf5] text-[#059669]',  actionIcon: 'verify',  actionText: 'Verified identity docs for',      refId: '#WR-2026-0442' },
    { id: 2, date: 'Oct 24, 2023', time: '13:10:12 EST', initials: 'MS',  bg: '#3b82f6', initBg: '#3b82f6', name: 'Marcus Smith',       role: 'Admin',      roleCls: 'bg-[#eff6ff] text-[#2563eb]',  actionIcon: 'payment', actionText: 'Approved Payment for',            refId: '#WR-2026-0001' },
    { id: 3, date: 'Oct 24, 2023', time: '12:55:30 EST', initials: 'RK',  bg: '#f472b6', initBg: '#f472b6', name: 'Riley King',         role: 'Sales',      roleCls: 'bg-[#fdf2f8] text-[#db2777]',  actionIcon: 'edit',    actionText: 'Modified contact details on lead', refId: '#WR-2026-0511' },
    { id: 4, date: 'Oct 24, 2023', time: '11:42:01 EST', initials: 'SYS', bg: '#475569', initBg: '#475569', name: 'System Automation',  role: 'Service',    roleCls: 'bg-[#f8fafc] text-[#475569]',  actionIcon: 'auto',    actionText: 'Lender Decision:',                refId: '#WR-2026-0492', autoApproved: true },
    { id: 5, date: 'Oct 24, 2023', time: '10:05:19 EST', initials: 'AH',  bg: '#f97316', initBg: '#f97316', name: 'Alex Hunter',        role: 'Manager',    roleCls: 'bg-[#fff7ed] text-[#ea580c]',  actionIcon: 'reject',  actionText: 'Rejected Payment Approval for',   refId: '#WR-2026-0032' },
];

const ActionIcon = ({ type }) => {
    const map = {
        verify:  { bg: '#ebfef5', color: '#059669', border: '#d1fae5', path: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
        payment: { bg: '#ebf0ff', color: '#2447d7', border: '#d9e8ff', path: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></> },
        edit:    { bg: '#fff9eb', color: '#d97706', border: '#fef3c7', path: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></> },
        auto:    { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', path: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><line x1="1" y1="1" x2="23" y2="23"/></> },
        reject:  { bg: '#fef2f2', color: '#e53e3e', border: '#fee2e2', path: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
    };
    const m = map[type];
    if (!m) return null;
    return (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" style={{ background: m.bg, borderColor: m.border, color: m.color }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">{m.path}</svg>
        </div>
    );
};

const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
);

const AuditLogs = () => {
    const [search, setSearch]       = useState('');
    const [dateRange, setDateRange] = useState('Last 24 Hours');
    const [category, setCategory]   = useState('All Categories');
    const [userRole, setUserRole]   = useState('Any Role');
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL = 1284;

    const filtered = LOG_ENTRIES.filter(e => {
        if (userRole !== 'Any Role' && e.role !== userRole) return false;
        
        if (category !== 'All Categories') {
            const cat = category.toLowerCase();
            if (cat === 'payment' && e.actionIcon !== 'payment' && !e.actionText.toLowerCase().includes('payment')) return false;
            if (cat === 'lead' && e.actionIcon !== 'edit' && !e.actionText.toLowerCase().includes('lead')) return false;
            if (cat === 'user' && !e.actionText.toLowerCase().includes('user') && e.actionIcon !== 'verify') return false;
            if (cat === 'system' && e.actionIcon !== 'auto') return false;
        }

        if (search) {
            const searchLower = search.toLowerCase();
            return e.name.toLowerCase().includes(searchLower) ||
                   e.refId.toLowerCase().includes(searchLower) ||
                   e.actionText.toLowerCase().includes(searchLower);
        }
        return true;
    });

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">System Audit Logs</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Review comprehensive history of all administrative and system-level actions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-[#edf2f7] text-[#4a5568] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        Refresh Logs
                    </button>
                </div>
            </header>

            {/* ── FILTERS ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm animate-slideDown [animation-delay:100ms] [animation-fill-mode:both]">
                <div className="grid grid-cols-[1fr_auto_160px_auto_160px_auto_160px_auto] items-end gap-3 lg:grid-cols-1">
                    {/* Search */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">SEARCH LOGS</span>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 pl-9 pr-3 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none placeholder:text-[#a0aec0] focus:border-[#2447d7]/30 transition-colors"
                                placeholder="Lead #, user name, or action keyword..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-9 bg-[#f1f5f9] lg:hidden" />

                    {/* Date Range */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">DATE RANGE</span>
                        <div className="relative">
                            <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 pr-8 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none appearance-none cursor-pointer focus:border-[#2447d7]/30 transition-colors" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                                <option>Last 24 Hours</option><option>Last 7 Days</option><option>Last 30 Days</option><option>This Year</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IcoChevron /></div>
                        </div>
                    </div>

                    <div className="w-px h-9 bg-[#f1f5f9] lg:hidden" />

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">CATEGORY</span>
                        <div className="relative">
                            <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 pr-8 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none appearance-none cursor-pointer focus:border-[#2447d7]/30 transition-colors" value={category} onChange={e => setCategory(e.target.value)}>
                                <option>All Categories</option><option>Payment</option><option>Lead</option><option>User</option><option>System</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IcoChevron /></div>
                        </div>
                    </div>

                    <div className="w-px h-9 bg-[#f1f5f9] lg:hidden" />

                    {/* User Role */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">USER ROLE</span>
                        <div className="relative">
                            <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 pr-8 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none appearance-none cursor-pointer focus:border-[#2447d7]/30 transition-colors" value={userRole} onChange={e => setUserRole(e.target.value)}>
                                <option>Any Role</option><option>Admin</option><option>Compliance</option><option>Sales</option><option>Manager</option><option>Service</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IcoChevron /></div>
                        </div>
                    </div>

                    {/* Filter btn */}
                    <button className="self-end w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-[#718096] flex items-center justify-center hover:bg-white hover:text-[#2447d7] hover:border-[#2447d7]/20 transition-all">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                    </button>
                </div>
            </div>

            {/* ── LOG TABLE ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:200ms] [animation-fill-mode:both]">
                {/* Headers */}
                <div className="grid grid-cols-[180px_220px_1fr] px-6 py-3 bg-[#f8fafc] border-b border-[#f1f5f9] lg:hidden">
                    <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">TIMESTAMP</span>
                    <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">USER</span>
                    <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ACTION</span>
                </div>

                <div className="divide-y divide-[#f7fafc]">
                    {filtered.map((entry, i) => (
                        <div key={entry.id}
                            className="grid grid-cols-[180px_220px_1fr] px-6 py-4 items-center hover:bg-[#f8faff] transition-colors lg:grid-cols-1 lg:gap-3 animate-rowIn"
                            style={{ animationDelay: `${250 + i * 60}ms` }}
                        >
                            {/* Timestamp */}
                            <div>
                                <div className="text-[13px] font-medium text-[#1a202c]">{entry.date}</div>
                                <div className="text-[11px] text-[#a0aec0] font-mono">{entry.time}</div>
                            </div>
                            {/* User */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: entry.bg }}>
                                    {entry.initials}
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-[#1a202c]">{entry.name}</div>
                                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${entry.roleCls}`}>{entry.role}</span>
                                </div>
                            </div>
                            {/* Action */}
                            <div className="flex items-center gap-3 bg-[#f8fafc] rounded-xl px-4 py-3 border border-transparent hover:bg-white hover:border-[#edf2f7] transition-all">
                                <ActionIcon type={entry.actionIcon} />
                                <span className="text-[13px] text-[#4a5568]">
                                    {entry.actionText}{' '}
                                    {entry.autoApproved
                                        ? <><em className="text-[#059669] font-semibold not-italic bg-[#ecfdf5] px-1.5 py-0.5 rounded text-[10px]">Auto-Approved</em>{' '}for <strong className="text-[#2447d7] font-medium">{entry.refId}</strong></>
                                        : <strong className="text-[#2447d7] font-medium">{entry.refId}</strong>
                                    }
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#f7fafc] flex justify-between items-center bg-[#fcfdff]">
                    <span className="text-[12px] text-[#a0aec0]">Showing <span className="text-[#2447d7] font-medium">1 – 5</span> of <span className="text-[#1a202c] font-medium">{TOTAL.toLocaleString()} log entries</span></span>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 bg-white border border-[#edf2f7] rounded-lg flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] disabled:opacity-30 transition-all" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${currentPage === p ? 'bg-[#2447d7] text-white' : 'text-[#718096] bg-white border border-[#edf2f7] hover:bg-[#f8fafc]'}`} onClick={() => setCurrentPage(p)}>{p}</button>
                        ))}
                        <span className="text-[#a0aec0] text-sm px-1">…</span>
                        <button className={`w-9 h-8 rounded-lg text-[13px] font-medium bg-white border border-[#edf2f7] text-[#718096] hover:bg-[#f8fafc] transition-all`} onClick={() => setCurrentPage(257)}>257</button>
                        <button className="w-8 h-8 bg-white border border-[#edf2f7] rounded-lg flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] disabled:opacity-30 transition-all" onClick={() => setCurrentPage(p => Math.min(257, p + 1))} disabled={currentPage === 257}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AuditLogs;
