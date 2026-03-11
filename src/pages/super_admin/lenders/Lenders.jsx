import React, { useState } from 'react';

const INITIAL_LENDERS = [
    { id: 1, name: 'ANZ Bank', type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', minDeposit: '10%', status: 'Active', contact: 'lending@anz.com.au' },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', minDeposit: '5%', status: 'Active', contact: 'homeloan@cba.com.au' },
    { id: 3, name: 'Westpac', type: 'Major Bank', interestRate: '5.99%', maxLoan: '$2,500,000', minDeposit: '10%', status: 'Active', contact: 'loans@westpac.com.au' },
    { id: 4, name: 'NAB', type: 'Major Bank', interestRate: '5.84%', maxLoan: '$2,000,000', minDeposit: '5%', status: 'Active', contact: 'homeloan@nab.com.au' },
    { id: 5, name: 'Macquarie Bank', type: 'Non-Bank', interestRate: '5.59%', maxLoan: '$5,000,000', minDeposit: '20%', status: 'Active', contact: 'lending@macquarie.com' },
    { id: 6, name: 'Liberty Financial', type: 'Non-Bank', interestRate: '6.49%', maxLoan: '$1,500,000', minDeposit: '15%', status: 'Inactive', contact: 'info@liberty.com.au' },
];

const LENDER_TYPES = ['Major Bank', 'Non-Bank', 'Credit Union', 'Building Society', 'Specialist'];

const EMPTY_FORM = { name: '', type: 'Major Bank', interestRate: '', maxLoan: '', minDeposit: '', contact: '', status: 'Active' };

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

const TypeBadge = ({ type }) => {
    const colors = {
        'Major Bank': { bg: 'rgba(36,71,215,0.08)', color: '#2447d7', border: 'rgba(36,71,215,0.18)' },
        'Non-Bank': { bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
        'Credit Union': { bg: 'rgba(6,182,212,0.08)', color: '#06b6d4', border: 'rgba(6,182,212,0.2)' },
        'Building Society': { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
        'Specialist': { bg: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
    };
    const c = colors[type] || colors['Major Bank'];
    return (
        <span className="inline-flex text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider"
            style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
            {type}
        </span>
    );
};

const Lenders = ({ readOnly = false }) => {
    const [lenders, setLenders] = useState(INITIAL_LENDERS);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingLender, setEditingLender] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const filtered = lenders.filter(l => {
        const matchSearch = search === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === 'All' || l.type === filterType;
        const matchStatus = filterStatus === 'All' || l.status === filterStatus;
        return matchSearch && matchType && matchStatus;
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

    const handleSave = () => {
        if (!form.name.trim()) return;
        if (editingLender) {
            setLenders(prev => prev.map(l => l.id === editingLender.id ? { ...l, ...form } : l));
        } else {
            setLenders(prev => [...prev, { ...form, id: Date.now() }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setLenders(prev => prev.filter(l => l.id !== id));
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
                    <div className="flex flex-col gap-1.5 min-w-[160px]">
                        <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pl-0.5">Type</label>
                        <div className="relative">
                            <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all appearance-none cursor-pointer pr-9"
                                value={filterType} onChange={e => setFilterType(e.target.value)}>
                                <option>All</option>
                                {LENDER_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
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
                    style={{ gridTemplateColumns: readOnly ? '1.5fr 1fr 1fr 1fr 1fr 1fr' : '1.5fr 1fr 1fr 1fr 1fr 1fr 120px' }}>
                    {['Lender Name', 'Type', 'Interest Rate', 'Max Loan', 'Min Deposit', 'Status', ...(readOnly ? [] : ['Actions'])].map((h, i) => (
                        <div key={i} className={`text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ${!readOnly && i === 6 ? 'text-right' : ''}`}>{h}</div>
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
                                    gridTemplateColumns: readOnly ? '1.5fr 1fr 1fr 1fr 1fr 1fr' : '1.5fr 1fr 1fr 1fr 1fr 1fr 120px',
                                    animationDelay: `${400 + idx * 50}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                {/* Name */}
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[14px] font-bold text-[#1a202c] truncate">{lender.name}</span>
                                    <span className="text-[11px] text-[#94a3b8] font-medium truncate">{lender.contact}</span>
                                </div>

                                {/* Type */}
                                <div><TypeBadge type={lender.type} /></div>

                                {/* Interest Rate */}
                                <span className="text-[13px] font-bold text-[#1a202c]">{lender.interestRate}</span>

                                {/* Max Loan */}
                                <span className="text-[13px] font-semibold text-[#4a5568]">{lender.maxLoan}</span>

                                {/* Min Deposit */}
                                <span className="text-[13px] font-semibold text-[#4a5568]">{lender.minDeposit}</span>

                                {/* Status */}
                                <div><StatusBadge status={lender.status} /></div>

                                {/* Actions (super admin only) */}
                                {!readOnly && (
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(lender)}
                                            className="w-8 h-8 rounded-lg bg-[#f0f4ff] text-[#2447d7] flex items-center justify-center hover:bg-[#2447d7] hover:text-white transition-all"
                                            title="Edit"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
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

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f1f5f9]">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#2447d7]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                    </svg>
                                </div>
                                <h2 className="text-[15px] font-bold text-[#1a202c]">{editingLender ? 'Edit Lender' : 'Add New Lender'}</h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#4a5568] transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lender Name *</label>
                                    <input type="text" className="bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                        placeholder="e.g. ANZ Bank" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Type</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] transition-all appearance-none cursor-pointer pr-9"
                                            value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                            {LENDER_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Status</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] transition-all appearance-none cursor-pointer pr-9"
                                            value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Interest Rate</label>
                                    <input type="text" className="bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                        placeholder="e.g. 5.89%" value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Max Loan Amount</label>
                                    <input type="text" className="bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                        placeholder="e.g. $2,000,000" value={form.maxLoan} onChange={e => setForm(f => ({ ...f, maxLoan: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Min Deposit</label>
                                    <input type="text" className="bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                        placeholder="e.g. 10%" value={form.minDeposit} onChange={e => setForm(f => ({ ...f, minDeposit: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Contact Email</label>
                                    <input type="email" className="bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                        placeholder="e.g. lending@bank.com" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f1f5f9] bg-[#f8fafc]">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] text-[13px] font-bold hover:bg-[#f1f5f9] transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.name.trim()}
                                className="px-5 py-2.5 rounded-xl bg-[#2447d7] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {editingLender ? 'Save Changes' : 'Add Lender'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[380px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 text-center animate-slideUp">
                        <div className="w-14 h-14 bg-[#fef2f2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" width="28" height="28">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                            </svg>
                        </div>
                        <h3 className="text-[16px] font-bold text-[#1a202c] mb-2">Remove Lender?</h3>
                        <p className="text-[13px] text-[#718096] leading-relaxed mb-6">
                            This lender will be permanently removed from the system. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl bg-[#f1f5f9] text-[#64748b] text-[13px] font-bold hover:bg-[#e2e8f0] transition-all">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 rounded-xl bg-[#ef4444] text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:bg-[#dc2626] transition-all">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lenders;
