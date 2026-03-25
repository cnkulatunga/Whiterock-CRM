import React, { useState } from 'react';

import { useLenders } from '../../../context/LendersContext';


const EMPTY_FORM = { name: '', contact: '', status: 'Active', unsecured: false, secured: false, commercial: false, refinance: false };

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
        status === 'Active'
            ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]'
            : 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0]'
    }`}>
        <span className={`w-1.5 h-1.5 rounded-full inline-block ${status === 'Active' ? 'bg-[#059669]' : 'bg-[#94a3b8]'}`} />
        {status}
    </span>
);



const Lenders = ({ readOnly = false }) => {
    const { lenders, addLender, updateLender, deleteLender } = useLenders();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingLender, setEditingLender] = useState(null);
    const [viewingLender, setViewingLender] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── Header ── */}
            <header className="flex justify-between items-start gap-4 sm:flex-col animate-headerDrop">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] tracking-tight">Lender Management</h1>
                    <p className="text-[0.9rem] text-[#718096] font-medium">
                        {readOnly
                            ? 'Browse available lenders and their lending criteria.'
                            : 'Add, edit and manage lenders available for loan applications.'}
                    </p>
                </div>
                {!readOnly && (
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-[#2447d7] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all shrink-0"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Lender
                    </button>
                )}
            </header>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-3 gap-5 md:grid-cols-1">
                {[
                    { label: 'Total Lenders', value: stats.total, color: '#2447d7', bg: 'rgba(36,71,215,0.07)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
                    { label: 'Active', value: stats.active, color: '#10b981', bg: 'rgba(16,185,129,0.07)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                    { label: 'Inactive', value: stats.inactive, color: '#94a3b8', bg: '#f1f5f9', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
                ].map((card, i) => (
                    <div key={card.label} className="bg-white rounded-2xl border border-[#edf2f7] p-5 flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop"
                        style={{ animationDelay: `${150 + i * 70}ms`, animationFillMode: 'both' }}>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">{card.label}</span>
                            <span className="text-[2rem] font-extrabold leading-none tracking-tight" style={{ color: card.color }}>{card.value}</span>
                        </div>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: card.bg, color: card.color }}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Table Card ── */}
            <div className="bg-white rounded-3xl border border-[#edf2f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp [animation-delay:350ms] [animation-fill-mode:both]">

                {/* Filters */}
                <div className="px-6 py-5 border-b border-[#f7fafc] bg-[#fcfdff] flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Search</label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors pointer-events-none">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </div>
                            <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                placeholder="Search lender name or contact..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Status</label>
                        <div className="relative">
                            <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all appearance-none cursor-pointer pr-9"
                                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end pb-0.5">
                        <span className="text-[11px] font-black text-[#94a3b8] bg-[#f1f5f9] px-3 py-2 rounded-xl border border-[#edf2f7] whitespace-nowrap">
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid gap-4 px-8 py-3.5 bg-[#f8fafc] border-b border-[#f1f5f9]"
                    style={{ gridTemplateColumns: readOnly ? '1.5fr 2fr 1fr' : '1.5fr 2fr 1fr 120px' }}>
                    {['Lender Name', 'Mail', 'Status', ...(readOnly ? [] : ['Actions'])].map((h, i) => (
                        <div key={i} className={`text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ${!readOnly && i === 3 ? 'text-right' : ''}`}>{h}</div>
                    ))}
                </div>

                {/* Table Body */}
                <div className="flex flex-col divide-y divide-[#f7fafc]">
                    {filtered.length === 0 ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-center">
                            <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" width="28" height="28">
                                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-[14px] font-bold text-[#4a5568]">No lenders found</p>
                                <p className="text-[12px] text-[#a0aec0] mt-0.5">Try adjusting your search or filters</p>
                            </div>
                        </div>
                    ) : (
                        filtered.map((lender, idx) => (
                            <div
                                key={lender.id}
                                className="group grid gap-4 px-8 py-4 items-center hover:bg-[#f8faff] transition-all duration-200 animate-rowIn"
                                style={{
                                    gridTemplateColumns: readOnly ? '1.5fr 2fr 1fr' : '1.5fr 2fr 1fr 120px',
                                    animationDelay: `${400 + idx * 50}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                {/* Name */}
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <button
                                        onClick={() => openDetails(lender)}
                                        className="text-[13px] font-bold text-[#2447d7] hover:underline text-left truncate group-hover:text-[#1732a3] transition-colors"
                                    >
                                        {lender.name}
                                    </button>
                                </div>

                                {/* Mail */}
                                <div className="min-w-0">
                                    <span className="text-[12px] text-[#4a5568] truncate font-medium">{lender.contact}</span>
                                </div>



                                {/* Status */}
                                <div><StatusBadge status={lender.status} /></div>

                                {/* Actions (super admin only) */}
                                {!readOnly && (
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setDeleteConfirmId(lender.id)}
                                            className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#ef4444] flex items-center justify-center hover:bg-[#ef4444] hover:text-white transition-all"
                                            title="Delete"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Details Modal ── */}
            {showDetails && viewingLender && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[500px] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp border border-white/20">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-[#f1f5f9]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center text-[#2447d7] shadow-inner">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-bold text-[#1a202c] leading-tight">Lender Details</h2>
                                    <p className="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider mt-0.5">Comprehensive Profile</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetails(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#1a202c] transition-all duration-200">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 flex flex-col gap-8">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[20px] font-bold text-[#1a202c] tracking-tight">{viewingLender.name}</span>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={viewingLender.status} />
                                        <span className="text-[12px] text-[#94a3b8] font-medium">• Established Partner</span>
                                    </div>
                                </div>
                                {!readOnly && (
                                    <button
                                        onClick={handleEditFromDetails}
                                        className="flex items-center gap-2 bg-[#f0f4ff] text-[#2447d7] px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-[#2447d7] hover:text-white transition-all shadow-sm"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#f1f5f9] flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2447d7] shadow-sm border border-[#f1f5f9]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest leading-none mb-1">Contact Email</span>
                                    <span className="text-[14px] font-bold text-[#1a202c]">{viewingLender.contact}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ml-1">Approved Categories</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'unsecured', label: 'Unsecured' },
                                        { id: 'secured', label: 'Secured' },
                                        { id: 'commercial', label: 'Commercial' },
                                        { id: 'refinance', label: 'Refinance' },
                                    ].map(item => (
                                        <div key={item.id} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${
                                            viewingLender[item.id] 
                                                ? 'bg-[#eef2ff] border-[#2447d7] text-[#2447d7]' 
                                                : 'bg-[#fcfdff] border-[#f1f5f9] text-[#cbd5e0] opacity-60'
                                        }`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                viewingLender[item.id] ? 'bg-[#2447d7] text-white' : 'bg-[#f1f5f9] text-[#cbd5e0]'
                                            }`}>
                                                {viewingLender[item.id] ? (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                )}
                                            </div>
                                            <span className="text-[13px] font-bold">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 border-t border-[#f1f5f9] bg-[#f8fafc]/50 flex justify-center">
                            <button onClick={() => setShowDetails(false)} className="w-full py-3 rounded-2xl bg-[#1a202c] text-white text-[13px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-px active:translate-y-0 transition-all duration-200">
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[540px] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp border border-white/20">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-[#f1f5f9]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center text-[#2447d7] shadow-inner">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-bold text-[#1a202c] leading-tight">{editingLender ? 'Edit Lender Profile' : 'Add New Partner'}</h2>
                                    <p className="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider mt-0.5">Lender Management System</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#1a202c] transition-all duration-200 group">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ml-1">Lender Name *</label>
                                    <input type="text" className="bg-[#f8fafc] border-2 border-[#f1f5f9] px-5 py-3 rounded-2xl text-[14px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_4px_rgba(36,71,215,0.1)] transition-all duration-200 placeholder:text-[#cbd5e0]"
                                        placeholder="e.g. Alpha Funding Partners" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ml-1">Current Status</label>
                                    <div className="relative group">
                                        <select className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] px-5 py-3 rounded-2xl text-[14px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] transition-all duration-200 appearance-none cursor-pointer pr-12 group-hover:border-[#e2e8f0]"
                                            value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8] group-hover:text-[#2447d7] transition-colors">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ml-1">Contact Email</label>
                                    <input type="email" className="bg-[#f8fafc] border-2 border-[#f1f5f9] px-5 py-3 rounded-2xl text-[14px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_4px_rgba(36,71,215,0.1)] transition-all duration-200 placeholder:text-[#cbd5e0]"
                                        placeholder="lender@alphafunding.com" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                                </div>

                                <div className="col-span-2 flex flex-col gap-4 mt-2">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ml-1">Lending Categories</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'unsecured', label: 'Unsecured', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 15v3"/></svg> },
                                            { id: 'secured', label: 'Secured', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="M12 15v3"/></svg> },
                                            { id: 'commercial', label: 'Commercial', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><rect x="5" y="3" width="14" height="18" rx="2"/></svg> },
                                            { id: 'refinance', label: 'Refinance', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
                                        ].map(item => (
                                            <label key={item.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                                                form[item.id] 
                                                    ? 'bg-[#eef2ff] border-[#2447d7] text-[#2447d7] shadow-sm' 
                                                    : 'bg-white border-[#f1f5f9] text-[#718096] hover:border-[#cbd5e0] hover:bg-[#f8fafc]'
                                            }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={form[item.id] || false}
                                                    onChange={e => setForm(f => ({ ...f, [item.id]: e.target.checked }))}
                                                />
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                                                    form[item.id] ? 'bg-[#2447d7] text-white' : 'bg-[#f1f5f9] text-[#94a3b8] group-hover:bg-[#e2e8f0]'
                                                }`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-[13px] font-bold transition-colors ${form[item.id] ? 'text-[#2447d7]' : 'text-[#4a5568]'}`}>{item.label}</span>
                                                    <span className="text-[10px] font-medium opacity-60">Lending Type</span>
                                                </div>
                                                {form[item.id] && (
                                                    <div className="ml-auto animate-fadeIn">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-4 px-8 py-6 border-t border-[#f1f5f9] bg-[#f8fafc]/50">
                            <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-2xl bg-white border-2 border-[#f1f5f9] text-[#64748b] text-[13px] font-bold hover:bg-[#f1f5f9] hover:text-[#1a202c] transition-all duration-200">
                                Cancel Effort
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.name.trim()}
                                className="px-8 py-3 rounded-2xl bg-[#2447d7] text-white text-[13px] font-bold shadow-[0_10px_25px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                            >
                                {editingLender ? 'Update Partner Profile' : 'Confirm New Partner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[400px] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-8 text-center animate-slideUp border border-white/20">
                        <div className="w-20 h-20 bg-[#fef2f2] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner text-[#ef4444]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="40" height="40">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                            </svg>
                        </div>
                        <h3 className="text-[20px] font-bold text-[#1a202c] mb-3">Remove Partner?</h3>
                        <p className="text-[14px] text-[#718096] leading-relaxed mb-8 px-2 font-medium">
                            This lender will be <span className="text-[#ef4444] font-bold">permanently removed</span> from the system. This action cannot be reversed.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3.5 rounded-2xl bg-[#f8fafc] border-2 border-[#f1f5f9] text-[#64748b] text-[13px] font-bold hover:bg-[#f1f5f9] hover:text-[#1a202c] transition-all duration-200">
                                Abort
                            </button>
                            <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3.5 rounded-2xl bg-[#ef4444] text-white text-[13px] font-bold shadow-[0_10px_25px_rgba(239,68,68,0.25)] hover:bg-[#dc2626] hover:-translate-y-px active:translate-y-0 transition-all duration-200">
                                Terminate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lenders;
