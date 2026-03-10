import React, { useState } from 'react';
import ReactDOM from 'react-dom';

/* ─── SAMPLE DATA ─────────────────────────────── */
const LOG_ENTRIES = [
    {
        id: 1,
        date: 'Oct 24, 2023',
        time: '14:23:45 EST',
        initials: 'JD',
        avatarBg: '#22c55e',
        avatarText: '#fff',
        name: 'Jane Doe',
        roleLabel: 'Compliance',
        roleClass: 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]',
        actionIcon: 'verify',
        actionText: 'Verified identity docs for',
        refId: '#WR-2026-0442',
    },
    {
        id: 2,
        date: 'Oct 24, 2023',
        time: '13:10:12 EST',
        initials: 'MS',
        avatarBg: '#3b82f6',
        avatarText: '#fff',
        name: 'Marcus Smith',
        roleLabel: 'Admin',
        roleClass: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
        actionIcon: 'payment',
        actionText: 'Approved Payment for',
        refId: '#WR-2026-0001',
    },
    {
        id: 3,
        date: 'Oct 24, 2023',
        time: '12:55:30 EST',
        initials: 'RK',
        avatarBg: '#f472b6',
        avatarText: '#fff',
        name: 'Riley King',
        roleLabel: 'Sales',
        roleClass: 'bg-[#fdf2f8] text-[#db2777] border-[#fce7f3]',
        actionIcon: 'edit',
        actionText: 'Modified contact details on lead',
        refId: '#WR-2026-0511',
    },
    {
        id: 4,
        date: 'Oct 24, 2023',
        time: '11:42:01 EST',
        initials: 'SYS',
        avatarBg: '#475569',
        avatarText: '#fff',
        name: 'System Automation',
        roleLabel: 'Service',
        roleClass: 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]',
        actionIcon: 'auto',
        actionText: 'Lender Decision:',
        autoApproved: true,
        refId: '#WR-2026-0492',
    },
    {
        id: 5,
        date: 'Oct 24, 2023',
        time: '10:05:19 EST',
        initials: 'AH',
        avatarBg: '#f97316',
        avatarText: '#fff',
        name: 'Alex Hunter',
        roleLabel: 'Manager',
        roleClass: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
        actionIcon: 'reject',
        actionText: 'Rejected Payment Approval for',
        refId: '#WR-2026-0032',
    },
];

const TOTAL_ENTRIES = 1284;

/* ─── ACTION ICONS ──────────────────────────────── */
const ActionIcon = ({ type }) => {
    switch (type) {
        case 'verify':
            return (
                <div className="w-8 h-8 rounded-lg bg-[#ebfef5] text-[#059669] flex items-center justify-center shrink-0 border border-[#d1fae5]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
            );
        case 'payment':
            return (
                <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center shrink-0 border border-[#d9e8ff]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                </div>
            );
        case 'edit':
            return (
                <div className="w-8 h-8 rounded-lg bg-[#fff9eb] text-[#d97706] flex items-center justify-center shrink-0 border border-[#fef3c7]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </div>
            );
        case 'auto':
            return (
                <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#475569] flex items-center justify-center shrink-0 border border-[#e2e8f0]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                </div>
            );
        case 'reject':
            return (
                <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#e53e3e] flex items-center justify-center shrink-0 border border-[#fee2e2]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </div>
            );
        default: return null;
    }
};

/* ─── ICONS ─────────────────────────────────────── */
const IcoSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IcoDownload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);
const IcoRefresh = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);
const IcoChevron = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IcoFilter = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const AuditLogs = () => {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('Last 24 Hours');
    const [category, setCategory] = useState('All Categories');
    const [userRole, setUserRole] = useState('Any Role');
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = LOG_ENTRIES.filter(e =>
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.refId.toLowerCase().includes(search.toLowerCase()) ||
        e.actionText.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="p-4 px-6 border-b border-[#edf2f7] bg-white flex flex-col gap-4">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <IcoSearch />
                        </div>
                        <input
                            className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 pl-12 rounded-2xl text-sm font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                            type="text"
                            placeholder="Global search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            <div className="flex flex-col gap-8">

                {/* ── PAGE HEADING ── */}
                <header className="flex justify-between items-center mb-2 sm:flex-col sm:items-start sm:gap-6">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl">System Audit Logs</h1>
                        <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Review comprehensive history of all administrative and system-level actions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#4a5568] px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#f8fafc] hover:translate-y-[-1px] transition-all shadow-sm"><IcoDownload /> Export CSV</button>
                        <button className="flex items-center gap-2.5 bg-[#2447d7] text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#1732a3] hover:translate-y-[-1px] transition-all shadow-lg shadow-[#2447d7]/20"><IcoRefresh /> Refresh Logs</button>
                    </div>
                </header>

                {/* ── FILTERS ── */}
                <div className="bg-white rounded-3xl border border-[#edf2f7] p-8 shadow-sm grid grid-cols-[1fr_auto_180px_auto_180px_auto_180px_auto] items-center gap-6 lg:grid-cols-1 lg:items-stretch lg:p-6 lg:gap-5">
                    <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">SEARCH LOGS</span>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                                <IcoSearch />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 pl-12 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                                placeholder="Lead #, user name, or keyword..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-[1.5px] h-10 bg-[#f1f5f9] lg:hidden" />
                    <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">DATE RANGE</span>
                        <div className="relative group">
                            <select 
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all"
                                value={dateRange} 
                                onChange={e => setDateRange(e.target.value)}
                            >
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                                <IcoChevron />
                            </div>
                        </div>
                    </div>
                    <div className="w-[1.5px] h-10 bg-[#f1f5f9] lg:hidden" />
                    <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">CATEGORY</span>
                        <div className="relative group">
                            <select 
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all"
                                value={category} 
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option>All Categories</option>
                                <option>Payment</option>
                                <option>Lead</option>
                                <option>User</option>
                                <option>System</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                                <IcoChevron />
                            </div>
                        </div>
                    </div>
                    <div className="w-[1.5px] h-10 bg-[#f1f5f9] lg:hidden" />
                    <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">USER ROLE</span>
                        <div className="relative group">
                            <select 
                                className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all"
                                value={userRole} 
                                onChange={e => setUserRole(e.target.value)}
                            >
                                <option>Any Role</option>
                                <option>Admin</option>
                                <option>Compliance</option>
                                <option>Sales</option>
                                <option>Manager</option>
                                <option>Service</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                                <IcoChevron />
                            </div>
                        </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-[#f8fafc] border border-[#f1f5f9] text-[#718096] flex items-center justify-center hover:bg-white hover:text-[#2447d7] hover:border-[#2447d7]/20 transition-all hover:shadow-md" title="Advanced filters">
                        <IcoFilter />
                    </button>
                </div>

                {/* ── LOG TABLE ── */}
                <div className="bg-white rounded-[2rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="p-5 px-10 grid grid-cols-[180px_260px_1fr] bg-[#fcfdff] border-b border-[#f7fafc] lg:hidden">
                        <span className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest pl-2">TIMESTAMP</span>
                        <span className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest pl-2">USER ENTITY</span>
                        <span className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest pl-2">SYSTEM ACTION</span>
                    </div>

                    <div className="flex flex-col divide-y divide-[#f7fafc]">
                        {filtered.map((entry, idx) => (
                            <div 
                                className="p-6 px-10 grid grid-cols-[180px_260px_1fr] items-center hover:bg-[#f8faff]/50 transition-all duration-300 group lg:grid-cols-1 lg:gap-5" 
                                key={entry.id}
                            >
                                {/* Timestamp */}
                                <div className="flex flex-col gap-0.5 pl-2 relative before:absolute before:left-[-1.25rem] before:top-0 before:bottom-0 before:w-1 before:bg-[#2447d7] before:rounded-full before:opacity-0 group-hover:before:opacity-100 transition-all">
                                    <span className="text-[14px] font-black text-[#1a202c] tracking-tight">{entry.date}</span>
                                    <span className="text-[12px] font-bold text-[#a0aec0] font-mono">{entry.time}</span>
                                </div>

                                {/* User */}
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[13px] shadow-sm transform transition-transform group-hover:scale-110" 
                                        style={{ background: entry.avatarBg, color: entry.avatarText }}
                                    >
                                        {entry.initials}
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-[14px] font-black text-[#1a202c] truncate tracking-tight">{entry.name}</span>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest w-fit shadow-sm ${entry.roleClass}`}>{entry.roleLabel}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center gap-5 p-4 bg-[#f8fafc] rounded-2xl border border-transparent group-hover:bg-white group-hover:border-[#2447d7]/10 group-hover:shadow-md transition-all duration-300">
                                    <ActionIcon type={entry.actionIcon} />
                                    <span className="text-[14px] font-medium text-[#4a5568] leading-relaxed">
                                        {entry.actionText}{' '}
                                        {entry.autoApproved ? (
                                            <><em className="text-[#059669] font-black uppercase text-[10px] tracking-widest not-italic ml-1 bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#d1fae5]">Auto-Approved</em>{' '}for <span className="text-[#2447d7] font-black font-mono ml-1">{entry.refId}</span></>
                                        ) : (
                                            <strong className="text-[#2447d7] font-black font-mono ml-1">{entry.refId}</strong>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="p-6 px-10 border-t border-[#f7fafc] flex justify-between items-center sm:flex-col sm:gap-6 bg-[#fcfdff]">
                        <span className="text-[12px] font-black text-[#cbd5e0] uppercase tracking-widest">
                            Showing <span className="text-[#2447d7]">1 – 5</span> of <span className="text-[#1a202c]">{TOTAL_ENTRIES.toLocaleString()}</span> entries
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                className="w-10 h-10 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                            <div className="flex items-center gap-2 px-2">
                                {[1, 2, 3].map(p => (
                                    <button 
                                        key={p}
                                        className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all ${currentPage === p ? 'bg-[#2447d7] text-white shadow-lg shadow-[#2447d7]/20 scale-110' : 'text-[#718096] bg-white border border-[#edf2f7] hover:bg-[#f1f5f9]'}`}
                                        onClick={() => setCurrentPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <span className="text-[#cbd5e0] font-black px-2">…</span>
                                <button 
                                    className={`w-12 h-10 rounded-xl text-[13px] font-black bg-white border border-[#edf2f7] text-[#718096] hover:bg-[#f1f5f9] transition-all ${currentPage === 257 ? 'bg-[#2447d7] text-white' : ''}`}
                                    onClick={() => setCurrentPage(257)}
                                >
                                    257
                                </button>
                            </div>
                            <button 
                                className="w-10 h-10 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(p => Math.min(257, p + 1))}
                                disabled={currentPage === 257}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuditLogs;
