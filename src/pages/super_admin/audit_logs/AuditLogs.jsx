import React, { useState } from 'react';

import { AUDIT_LOG_ENTRIES as LOG_ENTRIES, AUDIT_STATS, DATE_RANGE_OPTIONS, AUDIT_LOG_USER_ROLES } from '../../../data/dummyData';


const ActionIcon = ({ type }) => {
    const map = {
        verify:   { bg: '#ebfef5', color: '#059669', border: '#d1fae5', path: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
        payment:  { bg: '#ebf0ff', color: '#2447d7', border: '#d9e8ff', path: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></> },
        edit:     { bg: '#fff9eb', color: '#d97706', border: '#fef3c7', path: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></> },
        auto:     { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', path: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><line x1="1" y1="1" x2="23" y2="23"/></> },
        reject:   { bg: '#fef2f2', color: '#e53e3e', border: '#fee2e2', path: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
        security: { bg: '#fff1f2', color: '#f43f5e', border: '#ffe4e6', path: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></> },
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
    const [userRole, setUserRole]   = useState('Any Role');
    const [logType, setLogType]     = useState('All Logs'); // New Filter
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL = AUDIT_STATS.totalLogs;

    const filtered = LOG_ENTRIES.filter(e => {
        if (userRole !== 'Any Role' && e.role !== userRole) return false;

        // Log Type Filter Logic
        if (logType === 'Audit Logs') {
            if (e.actionIcon !== 'security' && !e.category?.includes('Security')) return false;
        } else if (logType === 'Operational Logs') {
            if (e.actionIcon === 'security' || e.category?.includes('Security')) return false;
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

            {/* ── LOG TABLE ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:100ms] [animation-fill-mode:both]">
                {/* Consolidated Header & Filters */}
                <div className="px-6 py-5 border-b border-[#edf2f7]">
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        {/* Summary */}
                        <div>
                            <h2 className="text-sm font-black text-[#1a202c] uppercase tracking-wider mb-0.5">Compliance & Audit</h2>
                            <p className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-tighter">{filtered.length} Records Found</p>
                        </div>

                        {/* Action Group */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Log Type Filter - Now next to search */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-[#a0aec0] uppercase tracking-wider">Log Type</span>
                                <div className="flex bg-[#f8fafc] border border-[#edf2f7] p-1 rounded-lg">
                                    {['All Logs', 'Audit Logs', 'Operational Logs'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setLogType(t)}
                                            className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${logType === t ? 'bg-[#2447d7] text-white' : 'text-[#718096] hover:text-[#2447d7]'}`}
                                        >
                                            {t === 'Operational Logs' ? 'Operational' : t === 'Audit Logs' ? 'Audit' : 'All'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-[#a0aec0] uppercase tracking-wider">Search Logs</span>
                                <div className="relative w-64">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2 px-3 pl-9 rounded-lg text-[12px] font-medium text-[#1a202c] outline-none placeholder:text-[#a0aec0] focus:border-[#2447d7]/30 transition-colors"
                                        placeholder="Lead #, user name, or action keyword..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-[#a0aec0] uppercase tracking-wider">Date Range</span>
                                <div className="relative w-40">
                                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2 px-3 pr-8 rounded-lg text-[12px] font-bold text-[#4a5568] outline-none appearance-none cursor-pointer focus:border-[#2447d7]/30 transition-colors" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                                        {DATE_RANGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IcoChevron /></div>
                                </div>
                            </div>

                            {/* User Role */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-[#a0aec0] uppercase tracking-wider">User Role</span>
                                <div className="relative w-40">
                                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2 px-3 pr-8 rounded-lg text-[12px] font-bold text-[#4a5568] outline-none appearance-none cursor-pointer focus:border-[#2447d7]/30 transition-colors" value={userRole} onChange={e => setUserRole(e.target.value)}>
                                        {AUDIT_LOG_USER_ROLES.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IcoChevron /></div>
                                </div>
                            </div>

                            {/* Filter Icon */}
                            <button className="self-end p-2.5 rounded-lg bg-[#f8fafc] border border-[#edf2f7] text-[#718096] hover:bg-white hover:text-[#2447d7] hover:border-[#2447d7]/20 transition-all shadow-sm">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Headers */}
                {/* Headers */}
                <div className="grid grid-cols-[180px_250px_1fr] px-6 py-3 bg-[#f8fafc] border-b border-[#f1f5f9] lg:hidden">
                    <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">TIMESTAMP</span>
                    <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">USER / ACTOR</span>
                    <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">LOG ACTION DETAILS</span>
                </div>

                <div className="divide-y divide-[#f7fafc]">
                    {filtered.map((entry, i) => (
                        <div key={entry.id}
                            className="grid grid-cols-[180px_250px_1fr] px-6 py-3 hover:bg-[#f8faff] transition-colors lg:grid-cols-1 lg:gap-3 animate-rowIn"
                            style={{ animationDelay: `${250 + i * 60}ms` }}
                        >
                            {/* Timestamp */}
                            <div className="py-1">
                                <div className="text-[12px] font-bold text-[#1a202c]">{entry.date}</div>
                                <div className="text-[10px] text-[#a0aec0] font-mono leading-none mt-1 uppercase tracking-tighter">{entry.time}</div>
                            </div>
                            
                            {/* User */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-sm" style={{ background: entry.bg }}>
                                    {entry.initials}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[13px] font-black text-[#1a202c] truncate">{entry.name}</div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter leading-none inline-block mt-1 ${entry.roleCls}`}>{entry.role}</span>
                                </div>
                            </div>

                            {/* Action - Forced to stretch */}
                            <div className="w-full flex flex-col gap-2 bg-[#f8fafc] rounded-xl px-4 py-3 border border-transparent hover:bg-white hover:border-[#edf2f7] transition-all relative group/action">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ActionIcon type={entry.actionIcon} />
                                        <span className="text-[13px] font-medium text-[#4a5568]">
                                            {entry.actionText}{' '}
                                            {entry.autoApproved
                                                ? <><em className="text-[#059669] font-black not-italic bg-[#ecfdf5] px-1.5 py-0.5 rounded text-[10px]">Auto-Approved</em>{' '}for <strong className="text-[#2447d7] font-black">{entry.refId}</strong></>
                                                : <strong className="text-[#2447d7] font-black">{entry.refId}</strong>
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {entry.status && <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${entry.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{entry.status}</span>}
                                        {entry.ip && <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{entry.ip}</span>}
                                    </div>
                                </div>
                                {(entry.turnover || entry.purpose || entry.bank || entry.category) && (
                                    <div className="flex items-center gap-2 mt-0.5 ml-11 flex-wrap">
                                        {entry.category && <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 uppercase tracking-tighter shadow-sm border border-indigo-100">{entry.category}</span>}
                                        {entry.turnover && <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#059669] uppercase tracking-tighter">Turnover: {entry.turnover}</span>}
                                        {entry.purpose && <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#2447d7] uppercase tracking-tighter">Purpose: {entry.purpose}</span>}
                                        {entry.bank && <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#f1f5f9] text-[#64748b] uppercase tracking-tighter">Bank: {entry.bank}</span>}
                                    </div>
                                )}
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
