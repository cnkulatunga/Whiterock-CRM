import React, { useState } from 'react';

const LOGS = [
    {
        date: 'Oct 24, 2023', time: '14:23:45 EST',
        initials: 'JD', name: 'Jane Doe', role: 'Compliance', roleClass: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]',
        icon: 'verify',
        action: <>Verified identity docs for <strong className="font-black text-[#1a202c]">#WR-2026-0442</strong></>,
    },
    {
        date: 'Oct 24, 2023', time: '13:10:12 EST',
        initials: 'MS', name: 'Marcus Smith', role: 'Admin', roleClass: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]',
        icon: 'payment',
        action: <>Approved Payment for <strong className="font-black text-[#1a202c]">#WR-2026-0001</strong></>,
    },
    {
        date: 'Oct 24, 2023', time: '12:55:30 EST',
        initials: 'RK', name: 'Riley King', role: 'Sales', roleClass: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]',
        icon: 'edit',
        action: <>Modified contact details on lead <strong className="font-black text-[#1a202c]">#WR-2026-0511</strong></>,
    },
    {
        date: 'Oct 24, 2023', time: '11:42:01 EST',
        initials: 'SY', name: 'System Automation', role: 'Service', roleClass: 'bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]',
        icon: 'auto',
        action: <>Lender Decision: <strong className="text-[#059669] font-black">Auto-Approved</strong> for #WR-2026-0492</>,
    },
    {
        date: 'Oct 24, 2023', time: '10:05:19 EST',
        initials: 'AH', name: 'Alex Hunter', role: 'Manager', roleClass: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]',
        icon: 'reject',
        action: <>Rejected Payment Approval for <strong className="font-black text-[#1a202c]">#WR-2026-0032</strong></>,
    },
];

const LOG_ICON = {
    verify:  { bg: '#eff6ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    payment: { bg: '#f0fdf4', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    edit:    { bg: '#fefce8', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    auto:    { bg: '#f5f3ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    reject:  { bg: '#fef2f2', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
};

const AuditLogs = () => {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('Last 24 Hours');
    const [category, setCategory] = useState('All Categories');
    const [userRole, setUserRole] = useState('Any Role');

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col sm:mb-2 text-[#1a202c]">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[1.75rem] font-black tracking-tight sm:text-2xl">System Governance Logs</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Immutable historical record of all administrative and financial governance actions.</p>
                </div>
                <div className="flex items-center gap-3 sm:w-full">
                    <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#4a5568] px-5 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wider hover:bg-[#f8fafc] hover:shadow-md transition-all active:scale-95 whitespace-nowrap sm:flex-1 sm:justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2.5 bg-[#1a202c] text-white px-5 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wider hover:bg-black hover:shadow-xl transition-all active:scale-95 whitespace-nowrap sm:flex-1 sm:justify-center group">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="group-hover:rotate-180 transition-transform duration-500">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Refresh
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-white p-8 rounded-[2rem] border border-[#edf2f7] shadow-sm flex items-center gap-8 lg:flex-col lg:items-stretch lg:gap-6 sm:p-6">
                <div className="flex flex-col gap-2 flex-[2] min-w-0">
                    <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] ml-1">Universal Search</span>
                    <div className="relative group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-[#1a202c] outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0] placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
                            placeholder="Lead ID, User, or Action..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex items-end gap-4 flex-[3] lg:flex-col lg:items-stretch lg:gap-6">
                    {[
                        { label: 'Temporal Scope', value: dateRange, setter: setDateRange, options: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'] },
                        { label: 'Action Node', value: category, setter: setCategory, options: ['All Categories', 'Payments', 'Leads', 'Documents', 'System'] },
                        { label: 'Role Authority', value: userRole, setter: setUserRole, options: ['Any Role', 'Admin', 'Manager', 'Compliance', 'Sales', 'Service'] }
                    ].map(filter => (
                        <div key={filter.label} className="flex flex-col gap-2 flex-1">
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] ml-1 whitespace-nowrap">{filter.label}</span>
                            <div className="relative">
                                <select 
                                    value={filter.value} 
                                    onChange={e => filter.setter(e.target.value)} 
                                    className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl px-5 py-3 text-[13px] font-black text-[#4a5568] outline-none appearance-none focus:border-[#2447d7] cursor-pointer transition-all"
                                >
                                    {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><path d="M6 9l6 6 6-6"/></svg>
                            </div>
                        </div>
                    ))}
                    
                    <button className="h-[52px] w-[52px] shrink-0 bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl flex items-center justify-center hover:bg-white hover:border-[#2447d7] hover:text-[#2447d7] transition-all lg:w-full lg:gap-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="4" y1="12" x2="20" y2="12"/>
                            <line x1="4" y1="18" x2="20" y2="18"/>
                        </svg>
                        <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">Advanced Filters</span>
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="grid grid-cols-[180px_250px_1fr] p-6 px-10 bg-[#fcfdff] border-b border-[#f7fafc] lg:hidden">
                    <span className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">TEMPORAL TS</span>
                    <span className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">ACTOR AUTHORITY</span>
                    <span className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest">GOVERNANCE ACTION</span>
                </div>
                
                <div className="flex flex-col divide-y divide-[#f7fafc]">
                    {LOGS.map((log, i) => {
                        const icon = LOG_ICON[log.icon];
                        return (
                            <div className="grid grid-cols-[180px_250px_1fr] items-center p-8 px-10 hover:bg-[#f8faff]/50 transition-all group lg:flex lg:flex-col lg:items-start lg:gap-6 lg:p-6" key={i}>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] font-black text-[#1a202c] tracking-tight">{log.date}</span>
                                    <span className="text-[11px] font-bold text-[#a0aec0] font-mono">{log.time}</span>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-[#1a202c] text-white flex items-center justify-center font-black text-[13px] shadow-lg group-hover:scale-110 transition-transform">{log.initials}</div>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <div className="text-[14px] font-black text-[#1a202c] tracking-tight truncate">{log.name}</div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest w-fit ${log.roleClass}`}>{log.role}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 pl-4 lg:pl-0">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: icon.bg }}>
                                        {icon.svg}
                                    </div>
                                    <span className="text-[14px] font-bold text-[#4a5568] leading-relaxed italic">{log.action}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-8 px-10 border-t border-[#f7fafc] bg-[#fcfdff] flex justify-between items-center lg:flex-col lg:gap-8 lg:p-6">
                    <span className="text-[12px] font-bold text-[#cbd5e0]">DISP: <strong className="text-[#1a202c] font-black">1 – 5</strong> OF 1,284 ENTRIES</span>
                    <div className="flex items-center gap-1.5">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#edf2f7] text-[#cbd5e0] font-black text-lg disabled:opacity-30" disabled>‹</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2447d7] text-white font-black text-[13px] shadow-lg shadow-[#2447d7]/20">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#edf2f7] text-[#4a5568] font-black text-[13px] hover:bg-[#f8fafc] transition-all">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#edf2f7] text-[#4a5568] font-black text-[13px] hover:bg-[#f8fafc] transition-all">3</button>
                        <span className="px-1 text-[#cbd5e0] font-black uppercase text-[10px] tracking-widest">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#edf2f7] text-[#4a5568] font-black text-[13px] hover:bg-[#f8fafc] transition-all">257</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#edf2f7] text-[#2447d7] font-black text-lg hover:bg-[#f8fafc] transition-all">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
