import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenders } from '../../../context/LendersContext';
import { useTheme } from '../../../context/ThemeContext';


const EMPTY_FORM = { name: '', contact: '', status: 'Active', unsecured: false, secured: false, commercial: false, refinance: false, managerName: '', managerEmail: '' };

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${status === 'Active'
            ? 'bg-[#ecfdf5] dark:bg-emerald-500/15 text-[#059669] dark:text-emerald-400 border-[#d1fae5] dark:border-emerald-500/20'
            : 'bg-[#f1f5f9] dark:bg-white/5 text-[#94a3b8] dark:text-slate-500 border-[#e2e8f0] dark:border-white/10'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full inline-block ${status === 'Active' ? 'bg-[#059669] dark:bg-emerald-400' : 'bg-[#94a3b8]'}`} />
        {status}
    </span>
);



const Lenders = ({ readOnly = false }) => {
    const { lenders, addLender, updateLender, deleteLender } = useLenders();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingLender, setEditingLender] = useState(null);
    const [viewingLender, setViewingLender] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.targetLender) {
            setViewingLender(location.state.targetLender);
            setShowDetails(true);
            // Clear the state so it doesn't reopen on page refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filtered = lenders.filter(l => {
        const matchSearch = search === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || l.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const openAdd = () => {
        setEditingLender(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (lender) => {
        setEditingLender(lender);
        setForm({ ...lender });
        setShowModal(true);
    };

    const openDetails = (lender) => {
        setViewingLender(lender);
        setShowDetails(true);
    };

    const handleEditFromDetails = () => {
        setShowDetails(false);
        openEdit(viewingLender);
    };

    const handleSave = () => {
        if (!form.name.trim()) return;
        if (editingLender) {
            updateLender(editingLender.id, form);
        } else {
            addLender(form);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        deleteLender(id);
        setDeleteConfirmId(null);
    };

    const stats = {
        total: lenders.length,
        active: lenders.filter(l => l.status === 'Active').length,
        inactive: lenders.filter(l => l.status === 'Inactive').length,
    };

    return (
        <div className="flex flex-col gap-5 animate-fadeIn font-['Sora',sans-serif]">


            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-2 sm:gap-2">
                {[
                    { label: 'Total Lenders',     value: stats.total.toLocaleString(), color: 'text-blue-700 dark:text-blue-400',    bg: 'bg-blue-100/40 dark:bg-blue-500/10',    border: 'border-blue-200 dark:border-blue-500/20',    iconBg: 'bg-blue-600',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
                    { label: 'Active Partners',   value: stats.active,                  color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100/40 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', iconBg: 'bg-emerald-500', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                    { label: 'Inactive / Pending',value: stats.inactive,                color: 'text-slate-700 dark:text-slate-400',    bg: 'bg-slate-100/30 dark:bg-white/5',       border: 'border-slate-200 dark:border-white/10',      iconBg: 'bg-slate-500',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
                ].map((card, i) => (
                    <div key={card.label} className={`${card.bg} ${card.border} border rounded-2xl sm:rounded-xl p-4 sm:p-2 flex items-center gap-4 sm:gap-2 shadow-sm hover:-translate-y-1 transition-all duration-300 animate-kpiPop`}
                        style={{ animationDelay: `${150 + i * 70}ms`, animationFillMode: 'both' }}>
                        
                        <div className={`w-12 h-12 sm:w-8 sm:h-8 rounded-full ${card.iconBg} text-white flex-shrink-0 flex items-center justify-center shadow-md`}>
                            {card.icon}
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                            <span className={`text-[10px] sm:text-[7px] font-black ${card.color} uppercase tracking-widest leading-none mb-1 opacity-70`}>
                                {card.label}
                            </span>
                            <h2 className={`text-[28px] sm:text-sm font-black leading-none tracking-tight ${card.color}`}>
                                {card.value}
                            </h2>
                        </div>
                    </div>
                ))}
                {!readOnly && (
                    <button 
                        onClick={openAdd}
                        className="bg-rose-100/40 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 border rounded-2xl sm:rounded-xl p-4 sm:p-2 flex items-center gap-4 sm:gap-2 shadow-sm hover:-translate-y-1 transition-all duration-300 animate-kpiPop group"
                        style={{ animationDelay: `${150 + 3 * 70}ms`, animationFillMode: 'both' }}
                    >
                        <div className="w-12 h-12 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white flex-shrink-0 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] sm:text-[7px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1 opacity-70">
                                Quick Action
                            </span>
                            <h2 className="text-[16px] sm:text-sm font-black leading-none text-rose-700 dark:text-rose-400 uppercase tracking-tighter">
                                ADD LENDER
                            </h2>
                        </div>
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-[#1e2347] rounded-3xl border border-[#edf2f7] dark:border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp [animation-delay:350ms] [animation-fill-mode:both]">

                {/* Filters */}
                <div className="px-6 py-3 border-b border-[#f7fafc] dark:border-white/5 bg-[#fcfdff] dark:bg-white/[0.02] flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Search</label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors pointer-events-none">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <input type="text" className="w-full bg-[#f8fafc] dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:bg-white dark:focus:bg-white/10 focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0] dark:placeholder:text-slate-600"
                                placeholder="Search lender name or contact..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Status</label>
                        <div className="relative">
                            <select className="w-full bg-[#f8fafc] dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:bg-white dark:focus:bg-white/10 focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all appearance-none cursor-pointer pr-9"
                                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 ml-auto">
                        <label className="text-[10px] font-black text-transparent uppercase tracking-widest pl-0.5 select-none">Count</label>
                        <div className="flex items-center h-[42px]">
                            <span className="text-[11px] font-black text-[#94a3b8] dark:text-slate-500 bg-[#f1f5f9] dark:bg-white/5 px-4 py-2 rounded-xl border border-[#edf2f7] dark:border-white/10 whitespace-nowrap">
                                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table Header — desktop only */}
                <div className="lg:hidden grid gap-4 px-8 py-2.5 bg-[#f8fafc] dark:bg-white/[0.02] border-b border-[#f1f5f9] dark:border-white/5"
                    style={{ gridTemplateColumns: readOnly ? '1.1fr 1.4fr 1.3fr 1.2fr 1.2fr 1fr' : '1.1fr 1.4fr 1.3fr 1.2fr 1.2fr 0.8fr 90px' }}>
                    {['Lender Name', 'Categories', 'Mail', 'Account Manager', 'Manager Email', 'Status', ...(readOnly ? [] : ['Actions'])].map((h, i) => (
                        <div key={i} className={`text-[10px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest ${!readOnly && i === 6 ? 'text-right' : ''}`}>{h}</div>
                    ))}
                </div>

                {/* Table Body — desktop only */}
                <div className="lg:hidden flex flex-col divide-y divide-[#f7fafc] dark:divide-white/5">
                    {filtered.length === 0 ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-center">
                            <div className="w-14 h-14 bg-[#f1f5f9] dark:bg-white/5 rounded-2xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" width="28" height="28">
                                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[14px] font-bold text-[#4a5568] dark:text-slate-400">No lenders found</p>
                                <p className="text-[12px] text-[#a0aec0] dark:text-slate-600 mt-0.5">Try adjusting your search or filters</p>
                            </div>
                        </div>
                    ) : (
                        filtered.map((lender, idx) => (
                                <div
                                    key={lender.id}
                                    onClick={() => openDetails(lender)}
                                    className={`group grid gap-4 px-8 py-2.5 items-center transition-all duration-200 animate-rowIn cursor-pointer ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#f8faff]'}`}
                                    style={{
                                        gridTemplateColumns: readOnly ? '1.1fr 1.4fr 1.3fr 1.2fr 1.2fr 1fr' : '1.1fr 1.4fr 1.3fr 1.2fr 1.2fr 0.8fr 90px',
                                        animationDelay: `${400 + idx * 50}ms`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-[12px] font-bold text-[#2447d7] group-hover:underline group-hover:text-[#1732a3] transition-colors truncate uppercase tracking-tight">{lender.name}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 min-w-0">
                                        {[{id:'unsecured',label:'Unsecured',color:'#6366f1',bg:'#eef2ff'},{id:'secured',label:'Secured',color:'#10b981',bg:'#ecfdf5'},{id:'commercial',label:'Commercial',color:'#f59e0b',bg:'#fffbeb'},{id:'refinance',label:'Refinance',color:'#f43f5e',bg:'#fff1f2'}].filter(cat=>lender[cat.id]).map(cat=>(
                                            <span key={cat.id} className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter shrink-0 border" style={{color:cat.color,backgroundColor:cat.bg,borderColor:`${cat.color}20`}}>{cat.label}</span>
                                        ))}
                                        {![lender.unsecured,lender.secured,lender.commercial,lender.refinance].some(Boolean)&&<span className="text-[10px] font-bold text-slate-300 italic">No categories</span>}
                                    </div>
                                    <div className="min-w-0"><span className="text-[11px] text-[#4a5568] dark:text-slate-400 truncate font-bold">{lender.contact||'—'}</span></div>
                                    <div className="min-w-0"><span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-black uppercase tracking-tight truncate border-l-2 border-indigo-100 dark:border-indigo-500/30 pl-3">{lender.managerName||'—'}</span></div>
                                    <div className="min-w-0"><span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-bold truncate opacity-80">{lender.managerEmail||'—'}</span></div>
                                    <div className="flex justify-center"><StatusBadge status={lender.status} /></div>
                                    {!readOnly && (
                                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setDeleteConfirmId(lender.id)} className="w-8 h-8 rounded-lg bg-[#fef2f2] dark:bg-red-500/10 text-[#ef4444] dark:text-red-400 flex items-center justify-center hover:bg-[#ef4444] hover:text-white transition-all shadow-sm" title="Delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                        ))
                    )}
                </div>

                {/* Mobile card list — hidden on desktop */}
                <div className="hidden lg:flex flex-col divide-y divide-[#f7fafc] dark:divide-white/5">
                    {filtered.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3 text-center">
                            <p className="text-[13px] font-bold text-[#4a5568] dark:text-slate-400">No lenders found</p>
                            <p className="text-[11px] text-[#a0aec0] dark:text-slate-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filtered.map((lender, idx) => (
                            <div key={lender.id}
                                onClick={() => openDetails(lender)}
                                className={`px-4 py-3.5 flex flex-col gap-2 animate-rowIn cursor-pointer ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#f8faff]'} transition-colors`}
                                style={{ animationDelay: `${400 + idx * 50}ms`, animationFillMode: 'both' }}>
                                {/* Top: avatar + name + status + delete */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#eef2ff] dark:bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-[#2447d7] shrink-0">
                                        {lender.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[13px] font-bold text-[#2447d7] truncate">{lender.name}</span>
                                        {lender.contact && <span className="text-[11px] text-[#94a3b8] truncate">{lender.contact}</span>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                                        <StatusBadge status={lender.status} />
                                        {!readOnly && (
                                            <button onClick={() => setDeleteConfirmId(lender.id)} className="w-8 h-8 rounded-lg bg-[#fef2f2] dark:bg-red-500/10 text-[#ef4444] dark:text-red-400 flex items-center justify-center hover:bg-[#ef4444] hover:text-white transition-all" title="Delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* Bottom: categories + manager name */}
                                <div className="flex items-center gap-2 pl-[48px] flex-wrap">
                                    {[{id:'unsecured',label:'Unsecured',color:'#6366f1',bg:'#eef2ff'},{id:'secured',label:'Secured',color:'#10b981',bg:'#ecfdf5'},{id:'commercial',label:'Commercial',color:'#f59e0b',bg:'#fffbeb'},{id:'refinance',label:'Refinance',color:'#f43f5e',bg:'#fff1f2'}].filter(cat=>lender[cat.id]).map(cat=>(
                                        <span key={cat.id} className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border" style={{color:cat.color,backgroundColor:cat.bg,borderColor:`${cat.color}20`}}>{cat.label}</span>
                                    ))}
                                    {lender.managerName && <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 ml-auto">{lender.managerName}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── UNIFIED DETAILS + EDIT MODAL ── */}
            {showDetails && viewingLender && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white dark:bg-[#1e2347] w-full max-w-[520px] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp border border-white/20 dark:border-white/10" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9] dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#eef2ff] dark:bg-blue-500/10 flex items-center justify-center text-[#2447d7] dark:text-blue-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-bold text-[#1a202c] dark:text-white leading-tight">{viewingLender.name}</h2>
                                    <div className="mt-0.5"><StatusBadge status={viewingLender.status} /></div>
                                </div>
                            </div>
                            <button onClick={() => { setShowDetails(false); setEditingLender(null); }} className="w-8 h-8 rounded-xl flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-white/10 transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Tabs — super admin only */}
                        {!readOnly && (
                            <div className="flex border-b border-[#f1f5f9] dark:border-white/10 px-6">
                                {['Details', 'Edit'].map(tab => {
                                    const active = tab === 'Edit' ? !!editingLender : !editingLender;
                                    return (
                                        <button key={tab} onClick={() => {
                                            if (tab === 'Edit') { setEditingLender(viewingLender); setForm({ ...viewingLender }); }
                                            else setEditingLender(null);
                                        }} className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest border-b-2 -mb-px transition-all ${active ? 'border-[#2447d7] text-[#2447d7]' : 'border-transparent text-[#94a3b8] hover:text-[#4a5568]'}`}>
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Body */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                            {!editingLender ? (
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                                        <div className="bg-[#f8fafc] dark:bg-white/5 rounded-2xl p-4 border border-[#f1f5f9] dark:border-white/10 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-[#2447d7] border border-[#f1f5f9] dark:border-white/10 shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[9px] font-black text-[#a0aec0] uppercase tracking-widest leading-none mb-0.5">Company Email</span>
                                                <span className="text-[11px] font-bold text-[#1a202c] dark:text-white break-all">{viewingLender.contact || '—'}</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#f8fafc] dark:bg-white/5 rounded-2xl p-4 border border-[#f1f5f9] dark:border-white/10 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-indigo-600 border border-[#f1f5f9] dark:border-white/10 shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-0.5">Account Manager</span>
                                                <span className="text-[11px] font-bold text-[#1a202c] dark:text-white">{viewingLender.managerName || '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {viewingLender.managerEmail && (
                                        <div className="bg-indigo-50/30 dark:bg-indigo-500/10 rounded-xl p-3.5 border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">Manager Email</span>
                                                <span className="text-[12px] font-bold text-indigo-900 dark:text-indigo-300">{viewingLender.managerEmail}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lending Categories</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[{id:'unsecured',label:'Unsecured'},{id:'secured',label:'Secured'},{id:'commercial',label:'Commercial'},{id:'refinance',label:'Refinance'}].map(item => (
                                                <div key={item.id} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 ${viewingLender[item.id] ? 'bg-[#eef2ff] dark:bg-blue-500/10 border-[#2447d7] dark:border-blue-500/40 text-[#2447d7]' : 'bg-[#fcfdff] dark:bg-white/[0.02] border-[#f1f5f9] dark:border-white/5 text-[#cbd5e0] opacity-60'}`}>
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${viewingLender[item.id] ? 'bg-[#2447d7] text-white' : 'bg-[#f1f5f9] dark:bg-white/5 text-[#cbd5e0]'}`}>
                                                        {viewingLender[item.id] ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                                                    </div>
                                                    <span className="text-[12px] font-bold">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2 flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lender Name *</label>
                                            <input type="text" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Status</label>
                                            <div className="relative">
                                                <select className="w-full bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all appearance-none cursor-pointer pr-8"
                                                    value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                                    <option>Active</option><option>Inactive</option>
                                                </select>
                                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Contact Email</label>
                                            <input type="email" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                                value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Manager Name</label>
                                            <input type="text" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                                value={form.managerName} onChange={e => setForm(f => ({ ...f, managerName: e.target.value }))} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Manager Email</label>
                                            <input type="email" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                                value={form.managerEmail} onChange={e => setForm(f => ({ ...f, managerEmail: e.target.value }))} />
                                        </div>
                                        <div className="col-span-2 flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lending Categories</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[{id:'unsecured',label:'Unsecured'},{id:'secured',label:'Secured'},{id:'commercial',label:'Commercial'},{id:'refinance',label:'Refinance'}].map(item => (
                                                    <label key={item.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${form[item.id] ? 'bg-[#eef2ff] dark:bg-blue-500/10 border-[#2447d7] text-[#2447d7]' : 'bg-white dark:bg-white/[0.02] border-[#e2e8f0] dark:border-white/10 text-[#718096]'}`}>
                                                        <input type="checkbox" className="hidden" checked={form[item.id] || false} onChange={e => setForm(f => ({ ...f, [item.id]: e.target.checked }))} />
                                                        <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${form[item.id] ? 'bg-[#2447d7] border-[#2447d7]' : 'border-[#cbd5e0] dark:border-white/20'}`}>
                                                            {form[item.id] && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>}
                                                        </div>
                                                        <span className="text-[12px] font-bold">{item.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-[#f1f5f9] dark:border-white/10 bg-[#f8fafc]/50 dark:bg-white/[0.02] flex items-center gap-3">
                            {editingLender ? (
                                <>
                                    <button onClick={() => setEditingLender(null)} className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-[#64748b] text-[12px] font-bold hover:bg-[#f1f5f9] transition-all">Cancel</button>
                                    <button onClick={() => { handleSave(); setShowDetails(false); setEditingLender(null); }} disabled={!form.name.trim()} className="flex-1 py-2 rounded-xl bg-[#2447d7] text-white text-[12px] font-bold shadow-[0_4px_12px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] transition-all disabled:opacity-40">
                                        Update Partner
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => { setShowDetails(false); setEditingLender(null); }} className="w-full py-2.5 rounded-xl bg-[#1a202c] dark:bg-white/10 text-white text-[13px] font-bold hover:opacity-90 transition-all">
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDetails && viewingLender && false && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white dark:bg-[#1e2347] w-full max-w-[500px] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp border border-white/20 dark:border-white/10">
                        <div className="flex items-center justify-between px-8 py-6 sm:px-5 sm:py-4 border-b border-[#f1f5f9] dark:border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] dark:bg-blue-500/10 flex items-center justify-center text-[#2447d7] dark:text-blue-400 shadow-inner">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-bold text-[#1a202c] dark:text-white leading-tight">Lender Details</h2>
                                    <p className="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider mt-0.5">Comprehensive Profile</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetails(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-white/10 hover:text-[#1a202c] dark:hover:text-white transition-all duration-200">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="p-8 md:p-5 flex flex-col gap-8">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[20px] font-bold text-[#1a202c] dark:text-white tracking-tight">{viewingLender.name}</span>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={viewingLender.status} />
                                        <span className="text-[12px] text-[#94a3b8] font-medium">• Established Partner</span>
                                    </div>
                                </div>
                                {!readOnly && (
                                    <button onClick={handleEditFromDetails} className="flex items-center gap-2 bg-[#f0f4ff] dark:bg-blue-500/10 text-[#2447d7] dark:text-blue-400 px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-[#2447d7] hover:text-white transition-all shadow-sm">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#f8fafc] dark:bg-white/5 rounded-2xl p-5 border border-[#f1f5f9] dark:border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-[#2447d7] shadow-sm border border-[#f1f5f9] dark:border-white/10">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest leading-none mb-1">Company Email</span>
                                        <span className="text-[12px] font-bold text-[#1a202c] dark:text-white truncate max-w-[120px]" title={viewingLender.contact}>{viewingLender.contact}</span>
                                    </div>
                                </div>
                                <div className="bg-[#f8fafc] dark:bg-white/5 rounded-2xl p-5 border border-[#f1f5f9] dark:border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-indigo-600 shadow-sm border border-[#f1f5f9] dark:border-white/10">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Account Manager</span>
                                        <span className="text-[12px] font-bold text-[#1a202c] dark:text-white truncate max-w-[120px]">{viewingLender.managerName || '—'}</span>
                                    </div>
                                </div>
                            </div>
                            {viewingLender.managerEmail && (
                                <div className="bg-indigo-50/30 dark:bg-indigo-500/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-4 -mt-4">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Manager Direct Email</span>
                                        <span className="text-[13px] font-bold text-indigo-900 dark:text-indigo-300">{viewingLender.managerEmail}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ml-1">Lending Categories</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'unsecured', label: 'Unsecured' },
                                        { id: 'secured', label: 'Secured' },
                                        { id: 'commercial', label: 'Commercial' },
                                        { id: 'refinance', label: 'Refinance' },
                                    ].map(item => (
                                        <div key={item.id} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${viewingLender[item.id]
                                                ? 'bg-[#eef2ff] dark:bg-blue-500/10 border-[#2447d7] dark:border-blue-500/40 text-[#2447d7] dark:text-blue-400'
                                                : 'bg-[#fcfdff] dark:bg-white/[0.02] border-[#f1f5f9] dark:border-white/5 text-[#cbd5e0] opacity-60'
                                            }`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${viewingLender[item.id] ? 'bg-[#2447d7] text-white' : 'bg-[#f1f5f9] dark:bg-white/5 text-[#cbd5e0]'}`}>
                                                {viewingLender[item.id] ? (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                )}
                                            </div>
                                            <span className="text-[13px] font-bold">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6 sm:px-5 sm:py-4 border-t border-[#f1f5f9] dark:border-white/10 bg-[#f8fafc]/50 dark:bg-white/[0.02] flex justify-center">
                            <button onClick={() => setShowDetails(false)} className="w-full py-3 rounded-2xl bg-[#1a202c] dark:bg-white/10 text-white text-[13px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-px active:translate-y-0 transition-all duration-200">
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white dark:bg-[#1e2347] w-full max-w-[480px] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp border border-white/20 dark:border-white/10" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9] dark:border-white/10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#eef2ff] dark:bg-blue-500/10 flex items-center justify-center text-[#2447d7] dark:text-blue-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-bold text-[#1a202c] dark:text-white leading-tight">{editingLender ? 'Edit Lender Profile' : 'Add New Partner'}</h2>
                                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">Lender Management</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-white/10 hover:text-[#1a202c] dark:hover:text-white transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lender Name *</label>
                                    <input type="text" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                        placeholder="e.g. Alpha Funding Partners" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Status</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all appearance-none cursor-pointer pr-8"
                                            value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                            <option>Active</option><option>Inactive</option>
                                        </select>
                                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" width="12" height="12"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Contact Email</label>
                                    <input type="email" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                        placeholder="lender@example.com" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Manager Name</label>
                                    <input type="text" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                        placeholder="e.g. John Smith" value={form.managerName} onChange={e => setForm(f => ({ ...f, managerName: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Manager Email</label>
                                    <input type="email" className="bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] transition-all placeholder:text-[#cbd5e0]"
                                        placeholder="john@example.com" value={form.managerEmail} onChange={e => setForm(f => ({ ...f, managerEmail: e.target.value }))} />
                                </div>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lending Categories</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'unsecured', label: 'Unsecured' },
                                            { id: 'secured', label: 'Secured' },
                                            { id: 'commercial', label: 'Commercial' },
                                            { id: 'refinance', label: 'Refinance' },
                                        ].map(item => (
                                            <label key={item.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${form[item.id]
                                                    ? 'bg-[#eef2ff] dark:bg-blue-500/10 border-[#2447d7] dark:border-blue-500/40 text-[#2447d7] dark:text-blue-400'
                                                    : 'bg-white dark:bg-white/[0.02] border-[#e2e8f0] dark:border-white/10 text-[#718096] dark:text-slate-500 hover:border-[#cbd5e0]'
                                                }`}>
                                                <input type="checkbox" className="hidden" checked={form[item.id] || false} onChange={e => setForm(f => ({ ...f, [item.id]: e.target.checked }))} />
                                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${form[item.id] ? 'bg-[#2447d7] border-[#2447d7]' : 'border-[#cbd5e0] dark:border-white/20'}`}>
                                                    {form[item.id] && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" width="10" height="10"><polyline points="20 6 9 17 4 12" /></svg>}
                                                </div>
                                                <span className="text-[12px] font-bold">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#f1f5f9] dark:border-white/10 bg-[#f8fafc]/50 dark:bg-white/[0.02] shrink-0">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-[#64748b] dark:text-slate-400 text-[12px] font-bold hover:bg-[#f1f5f9] dark:hover:bg-white/10 transition-all">Cancel</button>
                            <button onClick={handleSave} disabled={!form.name.trim()} className="px-6 py-2 rounded-xl bg-[#2447d7] text-white text-[12px] font-bold shadow-[0_4px_12px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                {editingLender ? 'Update Partner' : 'Add Partner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmId && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white dark:bg-[#1e2347] w-full max-w-[400px] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-8 text-center animate-slideUp border border-white/20 dark:border-white/10">
                        <div className="w-20 h-20 bg-[#fef2f2] dark:bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner text-[#ef4444]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="40" height="40">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" /><path d="M14 11v6" />
                            </svg>
                        </div>
                        <h3 className="text-[20px] font-bold text-[#1a202c] dark:text-white mb-3">Remove Partner?</h3>
                        <p className="text-[14px] text-[#718096] dark:text-slate-400 leading-relaxed mb-8 px-2 font-medium">
                            This lender will be <span className="text-[#ef4444] font-bold">permanently removed</span> from the system. This action cannot be reversed.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3.5 rounded-2xl bg-[#f8fafc] dark:bg-white/5 border-2 border-[#f1f5f9] dark:border-white/10 text-[#64748b] dark:text-slate-400 text-[13px] font-bold hover:bg-[#f1f5f9] dark:hover:bg-white/10 transition-all duration-200">Abort</button>
                            <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3.5 rounded-2xl bg-[#ef4444] text-white text-[13px] font-bold shadow-[0_10px_25px_rgba(239,68,68,0.25)] hover:bg-[#dc2626] hover:-translate-y-px active:translate-y-0 transition-all duration-200">Terminate</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lenders;
