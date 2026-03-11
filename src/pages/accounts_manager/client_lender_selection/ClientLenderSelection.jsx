import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// ── Data ──────────────────────────────────────────────────────────────────────
const CLIENTS = [
    { id: '#LD-10021', name: 'Jonathan Doe',    email: 'jonathan.doe@email.com',  loanAmount: '$500,000',   purpose: 'Home Purchase' },
    { id: '#LD-10018', name: 'Priya Nair',      email: 'priya.nair@email.com',    loanAmount: '$875,000',   purpose: 'Investment Property' },
    { id: '#LD-10015', name: 'Marcus Reed',     email: 'marcus.reed@email.com',   loanAmount: '$320,000',   purpose: 'Refinance' },
    { id: '#LD-10009', name: 'TechBridge Corp', email: 'contact@techbridge.com',  loanAmount: '$2,400,000', purpose: 'Commercial' },
    { id: '#LD-10003', name: 'Sandra Okonkwo',  email: 'sandra.o@email.com',      loanAmount: '$430,000',   purpose: 'Home Purchase' },
    { id: '#LD-09998', name: 'James Whitfield', email: 'j.whitfield@email.com',   loanAmount: '$150,000',   purpose: 'Refinance' },
];

const LENDERS = [
    { id: 1, name: 'ANZ Bank',          type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', minDeposit: '10%', features: ['Offset Account', 'Redraw Facility', 'Fixed Rate Option'] },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', minDeposit: '5%',  features: ['Low Deposit', 'Offset Account', 'Split Loan'] },
    { id: 3, name: 'Westpac',           type: 'Major Bank', interestRate: '5.99%', maxLoan: '$2,500,000', minDeposit: '10%', features: ['Redraw Facility', 'Fixed Rate Option', 'Package Discount'] },
    { id: 4, name: 'NAB',               type: 'Major Bank', interestRate: '5.84%', maxLoan: '$2,000,000', minDeposit: '5%',  features: ['Low Deposit', 'Offset Account', 'Flexible Repayments'] },
    { id: 5, name: 'Macquarie Bank',    type: 'Non-Bank',   interestRate: '5.59%', maxLoan: '$5,000,000', minDeposit: '20%', features: ['High Loan Limit', 'Offset Account', 'Professional Package'] },
    { id: 6, name: 'Liberty Financial', type: 'Non-Bank',   interestRate: '6.49%', maxLoan: '$1,500,000', minDeposit: '15%', features: ['Flexible Criteria', 'Self-Employed Friendly', 'Fast Approval'] },
];

const TYPE_COLORS = {
    'Major Bank': { bg: 'rgba(36,71,215,0.08)', color: '#2447d7', border: 'rgba(36,71,215,0.18)' },
    'Non-Bank':   { bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

const PURPOSE_COLORS = {
    'Home Purchase':       { bg: '#eef2ff', color: '#2447d7' },
    'Investment Property': { bg: '#f5f3ff', color: '#7c3aed' },
    'Refinance':           { bg: '#ecfdf5', color: '#059669' },
    'Commercial':          { bg: '#fff7ed', color: '#f97316' },
};

const STEPS = ['Select Clients & Lenders', 'Review & Send'];

// ── Step Indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ current }) => (
    <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black transition-all duration-300 ${
                            done   ? 'bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)]' :
                            active ? 'bg-[#2447d7] text-white shadow-[0_4px_12px_rgba(36,71,215,0.25)]' :
                                     'bg-[#f1f5f9] text-[#94a3b8]'
                        }`}>
                            {done
                                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                                : (i + 1)
                            }
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${active ? 'text-[#2447d7]' : done ? 'text-[#10b981]' : 'text-[#94a3b8]'}`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-[2px] mx-3 mb-5 rounded-full transition-all duration-500 ${done ? 'bg-[#10b981]' : 'bg-[#e2e8f0]'}`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ── Lender Multi-Select Dropdown (shows lender names) ────────────────────────
const LenderMultiSelect = ({ selectedIds, onChange }) => {
    const [open, setOpen] = useState(false);
    const btnRef = React.useRef(null);
    const dropRef = React.useRef(null);
    const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 240 });

    const toggle = (id) => onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
    const selectAll = (e) => { e.stopPropagation(); onChange(LENDERS.map(l => l.id)); };
    const clearAll = (e) => { e.stopPropagation(); onChange([]); };

    const label = selectedIds.length === 0
        ? 'Select Lenders'
        : selectedIds.length === LENDERS.length
            ? 'All Lenders'
            : `${selectedIds.length} lender${selectedIds.length !== 1 ? 's' : ''}`;

    const openDropdown = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setDropPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: 240,
            });
        }
        setOpen(true);
    };

    // Close on outside click
    React.useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (btnRef.current && btnRef.current.contains(e.target)) return;
            if (dropRef.current && dropRef.current.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                onClick={() => open ? setOpen(false) : openDropdown()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-black transition-all whitespace-nowrap min-w-[130px] justify-between ${
                    selectedIds.length > 0
                        ? 'bg-[#eef2ff] border-[rgba(36,71,215,0.25)] text-[#2447d7]'
                        : 'bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8] hover:border-[#2447d7]/30 hover:text-[#2447d7]'
                }`}
            >
                <span>{label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10"
                    className={`transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {open && typeof document !== 'undefined' && ReactDOM.createPortal(
                <div
                    ref={dropRef}
                    style={{ position: 'absolute', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
                    className="bg-white border border-[#edf2f7] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] overflow-hidden"
                >
                    {/* Quick actions */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#f7fafc] bg-[#f8fafc]">
                        <button onClick={selectAll} className="text-[10px] font-black text-[#2447d7] hover:underline">All</button>
                        <span className="text-[#e2e8f0]">|</span>
                        <button onClick={clearAll} className="text-[10px] font-black text-[#ef4444] hover:underline">Clear</button>
                        <span className="ml-auto text-[10px] font-black text-[#94a3b8]">{selectedIds.length}/{LENDERS.length}</span>
                    </div>
                    {/* Lender list */}
                    {LENDERS.map(lender => {
                        const tc = TYPE_COLORS[lender.type];
                        const checked = selectedIds.includes(lender.id);
                        return (
                            <div
                                key={lender.id}
                                onClick={() => toggle(lender.id)}
                                className={`px-3 py-2.5 flex items-center gap-2.5 cursor-pointer transition-colors ${checked ? 'bg-[#f0f4ff]' : 'hover:bg-[#f8fafc]'}`}
                            >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-[#2447d7] border-[#2447d7]' : 'border-[#cbd5e0] bg-white'}`}>
                                    {checked && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-bold text-[#1a202c] truncate">{lender.name}</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black" style={{ color: tc.color }}>{lender.type}</span>
                                        <span className="text-[9px] text-[#94a3b8]">{lender.interestRate}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>,
                document.body
            )}
        </>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ClientLenderSelection = ({ onNavigate }) => {
    const [step, setStep] = useState(0);
    const [search, setSearch] = useState('');
    // Per-client state: { [clientId]: { selected: bool, lenderIds: number[] } }
    const [clientConfig, setClientConfig] = useState({});
    const [note, setNote] = useState('');
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const filteredClients = CLIENTS.filter(c =>
        search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const getConfig = (clientId) => clientConfig[clientId] || { selected: false, lenderIds: [] };

    const setConfig = (clientId, patch) => {
        setClientConfig(prev => ({
            ...prev,
            [clientId]: { ...getConfig(clientId), ...patch },
        }));
    };

    const toggleClientSelect = (clientId) => {
        const cfg = getConfig(clientId);
        setConfig(clientId, { selected: !cfg.selected });
    };

    const toggleAll = () => {
        const allSelected = filteredClients.every(c => getConfig(c.id).selected);
        const patch = {};
        filteredClients.forEach(c => { patch[c.id] = { ...getConfig(c.id), selected: !allSelected }; });
        setClientConfig(prev => ({ ...prev, ...patch }));
    };

    const getLendersForClient = (clientId) => {
        const cfg = getConfig(clientId);
        return LENDERS.filter(l => cfg.lenderIds.includes(l.id));
    };

    const selectedClients = CLIENTS.filter(c => getConfig(c.id).selected);
    const readyToSend = selectedClients.length > 0 && selectedClients.every(c => getLendersForClient(c.id).length > 0);
    const allSelected = filteredClients.length > 0 && filteredClients.every(c => getConfig(c.id).selected);

    const handleSend = () => {
        setSending(true);
        setTimeout(() => { setSending(false); setSent(true); }, 1800);
    };

    // ── Success Screen ──
    if (sent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn font-['Sora',sans-serif] text-center px-6">
                <div className="w-20 h-20 bg-[#ecfdf5] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#10b981]/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                        <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
                    </svg>
                </div>
                <h1 className="text-2xl font-extrabold text-[#1a202c] mb-2 tracking-tight">Sent Successfully!</h1>
                <p className="text-[15px] text-[#718096] font-medium max-w-sm mx-auto leading-relaxed mb-2">
                    Lender options sent to <span className="font-bold text-[#1a202c]">{selectedClients.length} client{selectedClients.length !== 1 ? 's' : ''}</span>
                </p>
                <div className="flex flex-col gap-1.5 mb-8 mt-2">
                    {selectedClients.map(c => (
                        <div key={c.id} className="flex items-center gap-2 text-[13px] text-[#2447d7] font-semibold">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
                            {c.name} — {getLendersForClient(c.id).length} lender{getLendersForClient(c.id).length !== 1 ? 's' : ''}
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setSent(false); setStep(0); setClientConfig({}); setNote(''); }}
                        className="bg-[#2447d7] text-white px-8 py-3 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all"
                    >
                        Send Another
                    </button>
                    <button
                        onClick={() => onNavigate && onNavigate('accounts_manager_dashboard')}
                        className="bg-white border border-[#e2e8f0] text-[#64748b] px-8 py-3 rounded-xl text-[14px] font-bold hover:bg-[#f8fafc] transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── Header ── */}
            <header className="flex justify-between items-start gap-4 sm:flex-col animate-headerDrop">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] tracking-tight">Client Lender Selection</h1>
                    <p className="text-[0.9rem] text-[#718096] font-medium">
                        Select clients, assign lender categories in bulk, then send options for clients to choose from.
                    </p>
                </div>
            </header>

            <StepIndicator current={step} />

            {/* ══════════════════════════════════════════════════════════════
                STEP 0 — Client Table with inline lender category selector
            ══════════════════════════════════════════════════════════════ */}
            {step === 0 && (
                <div className="flex flex-col gap-5 animate-fadeIn">

                    {/* Summary bar */}
                    {selectedClients.length > 0 && (
                        <div className="bg-[#f0f4ff] border border-[rgba(36,71,215,0.2)] rounded-2xl px-5 py-3 flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2 text-[13px] font-bold text-[#2447d7]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                {selectedClients.length} client{selectedClients.length !== 1 ? 's' : ''} selected
                            </div>
                            <div className="h-4 w-px bg-[rgba(36,71,215,0.2)]" />
                            <div className="flex flex-wrap gap-2">
                                {selectedClients.map(c => {
                                    const lenders = getLendersForClient(c.id);
                                    return (
                                        <span key={c.id} className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                                            lenders.length > 0
                                                ? 'bg-white text-[#2447d7] border-[rgba(36,71,215,0.2)]'
                                                : 'bg-[#fff7ed] text-[#f97316] border-[#fed7aa]'
                                        }`}>
                                            {c.name.split(' ')[0]} · {lenders.length > 0 ? `${lenders.length} lenders` : 'no lenders'}
                                        </span>
                                    );
                                })}
                            </div>
                            {!readyToSend && selectedClients.length > 0 && (
                                <span className="text-[11px] font-bold text-[#f97316] ml-auto">
                                    ⚠ Assign lenders to all selected clients
                                </span>
                            )}
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-3xl border border-[#edf2f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
                        {/* Toolbar */}
                        <div className="px-6 py-4 border-b border-[#f7fafc] bg-[#fcfdff] flex items-center gap-4 flex-wrap">
                            <div className="relative flex-1 min-w-[200px] max-w-[380px] group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors pointer-events-none">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-[#f8fafc] border border-[#edf2f7] pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0]"
                                    placeholder="Search client name, ID or email..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <span className="text-[11px] font-black text-[#94a3b8] bg-[#f1f5f9] px-3 py-2 rounded-xl border border-[#edf2f7] whitespace-nowrap ml-auto">
                                {filteredClients.length} clients
                            </span>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#f8fafc]">
                                        {/* Select all checkbox */}
                                        <th className="px-5 py-3 w-10">
                                            <div
                                                onClick={toggleAll}
                                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                    allSelected ? 'bg-[#2447d7] border-[#2447d7]' : 'border-[#cbd5e0] bg-white hover:border-[#2447d7]'
                                                }`}
                                            >
                                                {allSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Client</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Loan Amount</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Purpose</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lender Category</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Lenders Assigned</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f7fafc]">
                                    {filteredClients.map((client, i) => {
                                        const cfg = getConfig(client.id);
                                        const lenders = getLendersForClient(client.id);
                                        const pc = PURPOSE_COLORS[client.purpose] || { bg: '#f1f5f9', color: '#64748b' };
                                        return (
                                            <tr
                                                key={client.id}
                                                className={`transition-colors animate-rowIn ${cfg.selected ? 'bg-[#f8faff]' : 'hover:bg-[#fafbff]'}`}
                                                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                                            >
                                                {/* Checkbox */}
                                                <td className="px-5 py-4">
                                                    <div
                                                        onClick={() => toggleClientSelect(client.id)}
                                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                            cfg.selected ? 'bg-[#2447d7] border-[#2447d7]' : 'border-[#cbd5e0] bg-white hover:border-[#2447d7]'
                                                        }`}
                                                    >
                                                        {cfg.selected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}
                                                    </div>
                                                </td>

                                                {/* Client info */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0 ${cfg.selected ? 'bg-[#2447d7] text-white' : 'bg-[#eef2ff] text-[#2447d7]'}`}>
                                                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-bold text-[#1a202c]">{client.name}</div>
                                                            <div className="text-[11px] text-[#94a3b8]">{client.email}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Loan amount */}
                                                <td className="px-4 py-4">
                                                    <span className="text-[13px] font-bold text-[#1a202c]">{client.loanAmount}</span>
                                                </td>

                                                {/* Purpose */}
                                                <td className="px-4 py-4">
                                                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider"
                                                        style={{ backgroundColor: pc.bg, color: pc.color }}>
                                                        {client.purpose}
                                                    </span>
                                                </td>

                                                {/* Lender multi-select */}
                                                <td className="px-4 py-4">
                                                    <LenderMultiSelect
                                                        selectedIds={cfg.lenderIds}
                                                        onChange={(ids) => setConfig(client.id, { lenderIds: ids })}
                                                    />
                                                </td>

                                                {/* Lenders assigned */}
                                                <td className="px-4 py-4">
                                                    {lenders.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {lenders.slice(0, 3).map(l => {
                                                                const tc = TYPE_COLORS[l.type];
                                                                return (
                                                                    <span key={l.id} className="text-[9px] font-black px-2 py-0.5 rounded-md"
                                                                        style={{ backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                                                                        {l.name}
                                                                    </span>
                                                                );
                                                            })}
                                                            {lenders.length > 3 && (
                                                                <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]">
                                                                    +{lenders.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-[#cbd5e0] font-medium">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-[#f7fafc] bg-[#fcfdff] flex items-center justify-between">
                            <span className="text-[12px] text-[#a0aec0]">
                                <span className="font-bold text-[#1a202c]">{selectedClients.length}</span> of <span className="font-bold text-[#1a202c]">{filteredClients.length}</span> clients selected
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
                                <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block" />
                                Ready: {selectedClients.filter(c => getLendersForClient(c.id).length > 0).length}
                                <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block ml-2" />
                                Pending: {selectedClients.filter(c => getLendersForClient(c.id).length === 0).length}
                            </div>
                        </div>
                    </div>

                    {/* Next button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setStep(1)}
                            disabled={!readyToSend}
                            className="flex items-center gap-2 bg-[#2447d7] text-white px-6 py-3 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                        >
                            Next: Review & Send
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 1 — Review & Send
            ══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
                <div className="flex flex-col gap-5 animate-fadeIn">
                    <div className="grid grid-cols-[1fr_340px] gap-5 xl:grid-cols-1">

                        {/* Left — Per-client email previews */}
                        <div className="flex flex-col gap-4">
                            {selectedClients.map((client, ci) => {
                                const lenders = getLendersForClient(client.id);
                                return (
                                    <div key={client.id} className="bg-white rounded-3xl border border-[#edf2f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <div className="px-6 py-4 border-b border-[#f7fafc] flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#2447d7]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[13px] font-bold text-[#1a202c]">Email to {client.name}</div>
                                                <div className="text-[11px] text-[#94a3b8]">{client.email}</div>
                                            </div>
                                            <span className="text-[10px] font-black text-[#2447d7] bg-[#eef2ff] px-2.5 py-1 rounded-lg border border-[rgba(36,71,215,0.18)]">
                                                {lenders.length} lender{lenders.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="px-6 py-4 flex flex-col gap-3">
                                            <p className="text-[12px] text-[#4a5568] leading-relaxed">
                                                Dear <span className="font-bold text-[#1a202c]">{client.name}</span>, we have selected the following lender options for your <span className="font-bold">{client.loanAmount}</span> loan application:
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {lenders.map((lender, i) => {
                                                    const tc = TYPE_COLORS[lender.type];
                                                    return (
                                                        <div key={lender.id} className="flex items-center justify-between border border-[#edf2f7] rounded-xl px-4 py-2.5 bg-[#f8fafc]">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[12px] font-bold text-[#1a202c]">{i + 1}. {lender.name}</span>
                                                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                                                                    style={{ backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                                                                    {lender.type}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[11px] text-[#718096]">
                                                                <span>Rate: <span className="font-black text-[#2447d7]">{lender.interestRate}</span></span>
                                                                <span>Max: <span className="font-bold text-[#1a202c]">{lender.maxLoan}</span></span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Note */}
                            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm">
                                <label className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest block mb-2">Additional Note (sent to all clients)</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-3 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.08)] transition-all placeholder:text-[#a0aec0] resize-none"
                                    placeholder="Add a personal note to all clients..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right — Summary */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm">
                                <div className="text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-3">Send Summary</div>
                                <div className="flex flex-col gap-3">
                                    {selectedClients.map(client => {
                                        const lenders = getLendersForClient(client.id);
                                        return (
                                            <div key={client.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-[#f7fafc] last:border-0">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-[#2447d7] text-white flex items-center justify-center text-[11px] font-black shrink-0">
                                                        {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-[12px] font-bold text-[#1a202c] truncate">{client.name}</div>
                                                        <div className="text-[10px] text-[#94a3b8] truncate">{client.email}</div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-[#2447d7] bg-[#eef2ff] px-2 py-0.5 rounded-md border border-[rgba(36,71,215,0.18)] shrink-0">
                                                    {lenders.length} lenders
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="w-full flex items-center justify-center gap-2 bg-[#2447d7] text-white py-3.5 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {sending ? (
                                    <>
                                        <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                                            <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
                                        </svg>
                                        Send to {selectedClients.length} Client{selectedClients.length !== 1 ? 's' : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <button onClick={() => setStep(0)} className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#64748b] px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#f8fafc] transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientLenderSelection;
