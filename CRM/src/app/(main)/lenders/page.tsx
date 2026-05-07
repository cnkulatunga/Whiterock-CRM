'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Promotion {
    title: string;
    description: string;
    rate: number;
    valid_until: string;
}

interface Lender {
    id: string;
    name: string;
    trading: string;
    type: string;
    status: string;
    email: string;
    manager: string;
    manager_email: string;
    address: string;
    reg_address: string;
    trading_years: number;
    rates: { min: number; max: number };
    loan_ranges: { min: number; max: number };
    categories: string[];
    lead_levels: string[];
    notes: string;
    added: string;
    promotions: Promotion[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PRESET_CATS = ['Secured', 'Commercial', 'Unsecured', 'Refinance'];
const today = new Date().toISOString().split('T')[0];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt$ = (n: number) =>
    n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M'
    : n >= 1_000 ? '$' + (n / 1_000).toFixed(0) + 'K'
    : '$' + n;

const initials = (n: string) =>
    n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const iconColor = (t: string) =>
    t === 'Bank' ? '#334155' : t === 'Non-Bank' ? '#475569' : '#64748b';

function authHeader(): Record<string, string> {
    try {
        const s = sessionStorage.getItem('crm_session');
        const token = s ? JSON.parse(s).access : null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch { return {}; }
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
    panelCard: { background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.05)' },
    labelText: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', color: '#94a3b8', marginBottom: 3, display: 'block' },
    inputCompact: { width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 8, padding: '7px 10px', fontSize: 10.5, fontWeight: 500, outline: 'none', color: '#1e293b', boxSizing: 'border-box' },
    formSec: { borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 10 },
    formSecTitle: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#cbd5e1', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 },
    catTag: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.03em', border: '1px solid #e2e8f0', cursor: 'pointer' },
    catTagSel: { background: '#0f172a', color: '#fff', borderColor: '#0f172a' },
    categoryChip: { display: 'inline-flex', alignItems: 'center', padding: '3px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.03em' },
    badge: { display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 99, fontSize: 11, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
    tabBtn: { flex: 1, padding: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#94a3b8', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', textAlign: 'center', background: 'none' } as React.CSSProperties,
    tabBtnActive: { color: '#0f172a', borderBottom: '2px solid #0f172a' },
    promoCard: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, marginBottom: 8, cursor: 'pointer', transition: 'transform .1s' },
    dropZone: { border: '2px dashed #e2e8f0', borderRadius: 12, padding: '16px 12px', textAlign: 'center', transition: 'all .2s', background: '#fafafa', marginBottom: 8 },
    // Unified dark header used across all three panels
    panelHeader: { padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,.06)', background: '#111827', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48 },
};

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
    useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', borderRadius: 10, padding: '10px 18px', fontSize: 11, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}>
            {msg}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LenderManagementPage() {
    const { hasAction, isLoading: permsLoading } = usePermissions();

    // data
    const [lenders, setLenders] = useState<Lender[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [loadErr, setLoadErr] = useState('');

    // table state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // drawer state (replaces left panel)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [leftTab, setLeftTab] = useState<'lender' | 'promotions'>('lender');
    const [editId, setEditId] = useState<string | null>(null);

    // lender form
    const [fName, setFName] = useState('');
    const [fTrading, setFTrading] = useState('');
    const [fType, setFType] = useState('Bank');
    const [fStatus, setFStatus] = useState('Active');
    const [fEmail, setFEmail] = useState('');
    const [fManager, setFManager] = useState('');
    const [fManagerEmail, setFManagerEmail] = useState('');
    const [fAddress, setFAddress] = useState('');
    const [fRegAddress, setFRegAddress] = useState('');
    const [fTradingYears, setFTradingYears] = useState('');
    const [fRateMin, setFRateMin] = useState('');
    const [fRateMax, setFRateMax] = useState('');
    const [fLoanMin, setFLoanMin] = useState('');
    const [fLoanMax, setFLoanMax] = useState('');
    const [fNotes, setFNotes] = useState('');
    const [formCats, setFormCats] = useState<string[]>([...PRESET_CATS]);
    const [selCats, setSelCats] = useState<string[]>([]);
    const [fLeadLevels, setFLeadLevels] = useState<string[]>([]);
    const [catInput, setCatInput] = useState('');
    const [formSaving, setFormSaving] = useState(false);
    const [formErr, setFormErr] = useState('');

    // promotions tab
    const [promoLenderId, setPromoLenderId] = useState('');
    const [promoTitle, setPromoTitle] = useState('');
    const [promoDesc, setPromoDesc] = useState('');
    const [promoRate, setPromoRate] = useState('');
    const [promoExpiry, setPromoExpiry] = useState('');
    const [editingPromoIdx, setEditingPromoIdx] = useState<number | null>(null);
    const [promoPreview, setPromoPreview] = useState<{ lender: Lender; pIndex: number } | null>(null);
    const [promoSaving, setPromoSaving] = useState(false);

    // send app
    const [saStep, setSaStep] = useState(0);
    const [saLevel, setSaLevel] = useState<'Level 1' | 'Level 2'>('Level 1');
    const [allLeads, setAllLeads] = useState<any[]>([]);
    const [saLeadSearch, setSaLeadSearch] = useState('');
    const [saSelectedLead, setSaSelectedLead] = useState<any>(null);
    const [saLenders, setSaLenders] = useState<Lender[]>([]);
    const [saNote, setSaNote] = useState('');
    const [saPreview, setSaPreview] = useState('');
    const [saDropOver, setSaDropOver] = useState(false);

    // right panel
    const [promoSearch, setPromoSearch] = useState('');
    const [promoFilterLender, setPromoFilterLender] = useState('All');

    const [toast, setToast] = useState('');
    const dragLenderId = useRef<string | null>(null);
    const showToast = (msg: string) => setToast(msg);

    // ── Fetch lenders ──
    const fetchLenders = useCallback(async () => {
        setFetchLoading(true);
        setLoadErr('');
        try {
            const res = await fetch('/api/lenders', { headers: authHeader() });
            const data = await res.json();
            if (!res.ok) { setLoadErr(data.error || 'Failed to load lenders'); setFetchLoading(false); return; }
            const arr = Array.isArray(data) ? data : (data?.results ?? []);
            setLenders(arr);
        } catch {
            setLoadErr('Network error — could not load lenders');
        } finally {
            setFetchLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLenders();
        fetch('/api/leads', { headers: authHeader() })
            .then(r => r.json())
            .then(d => setAllLeads(Array.isArray(d) ? d : (d?.results ?? [])))
            .catch(() => {});
    }, [fetchLenders]);

    // ── Filtered table ──
    const filtered = lenders.filter(l => {
        if (statusFilter !== 'All' && l.status !== statusFilter) return false;
        if (search) {
            const hay = [l.name, l.trading, l.manager, l.email, l.address, ...l.categories, l.notes].join(' ').toLowerCase();
            if (!hay.includes(search.toLowerCase())) return false;
        }
        return true;
    });

    // ── Lender form ──
    function resetForm() {
        setEditId(null); setFName(''); setFTrading(''); setFType('Bank'); setFStatus('Active');
        setFEmail(''); setFManager(''); setFManagerEmail(''); setFAddress(''); setFRegAddress('');
        setFTradingYears(''); setFRateMin(''); setFRateMax(''); setFLoanMin(''); setFLoanMax('');
        setFNotes(''); setFormCats([...PRESET_CATS]); setSelCats([]); setFLeadLevels([]);
        setFormErr('');
    }

    function loadEditForm(l: Lender) {
        setEditId(l.id);
        setFName(l.name); setFTrading(l.trading); setFType(l.type); setFStatus(l.status);
        setFEmail(l.email); setFManager(l.manager); setFManagerEmail(l.manager_email);
        setFAddress(l.address); setFRegAddress(l.reg_address);
        setFTradingYears(String(l.trading_years));
        setFRateMin(String(l.rates?.min ?? '')); setFRateMax(String(l.rates?.max ?? ''));
        setFLoanMin(String(l.loan_ranges?.min ?? '')); setFLoanMax(String(l.loan_ranges?.max ?? ''));
        setFNotes(l.notes);
        const custom = l.categories.filter(c => !PRESET_CATS.includes(c));
        setFormCats([...PRESET_CATS, ...custom]);
        setSelCats([...l.categories]);
        setFLeadLevels([...(l.lead_levels ?? [])]);
        setFormErr('');
        setLeftTab('lender');
        setDrawerOpen(true);
    }

    async function saveForm() {
        if (!fName.trim()) { setFormErr('Lender name is required'); return; }
        setFormSaving(true);
        setFormErr('');
        const payload = {
            name: fName.trim(),
            trading: fTrading.trim(),
            type: fType,
            status: fStatus,
            email: fEmail.trim(),
            manager: fManager.trim(),
            manager_email: fManagerEmail.trim(),
            address: fAddress.trim(),
            reg_address: fRegAddress.trim(),
            trading_years: parseInt(fTradingYears) || 0,
            rate_min: parseFloat(fRateMin) || 0,
            rate_max: parseFloat(fRateMax) || 0,
            loan_min: parseFloat(fLoanMin) || 0,
            loan_max: parseFloat(fLoanMax) || 0,
            categories: selCats,
            lead_levels: fLeadLevels,
            notes: fNotes.trim(),
        };
        try {
            if (editId !== null) {
                const res = await fetch('/api/lenders', {
                    method: 'PATCH',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editId, ...payload }),
                });
                const data = await res.json();
                if (!res.ok) { setFormErr(data.error || 'Update failed'); return; }
                setLenders(prev => prev.map(l => l.id === editId ? data : l));
                showToast('Lender updated');
            } else {
                const res = await fetch('/api/lenders', {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) { setFormErr(data.error || 'Create failed'); return; }
                setLenders(prev => [data, ...prev]);
                showToast('Lender added');
            }
            resetForm();
            setDrawerOpen(false);
        } catch { setFormErr('Network error — could not save'); }
        finally { setFormSaving(false); }
    }

    async function deleteLender(id: string) {
        try {
            const res = await fetch(`/api/lenders?id=${id}`, {
                method: 'DELETE',
                headers: authHeader(),
            });
            if (res.ok) {
                setLenders(prev => prev.filter(l => l.id !== id));
                if (editId === id) resetForm();
                if (expandedId === id) setExpandedId(null);
                showToast('Lender deleted');
            }
        } catch { showToast('Failed to delete lender'); }
    }

    function toggleCat(cat: string) {
        setSelCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    }

    function addCustomCat() {
        const val = catInput.trim();
        if (!val) return;
        const norm = val.charAt(0).toUpperCase() + val.slice(1);
        if (!formCats.includes(norm)) setFormCats(prev => [...prev, norm]);
        if (!selCats.includes(norm)) setSelCats(prev => [...prev, norm]);
        setCatInput('');
    }

    // ── Promotions ──
    function resetPromoForm() {
        setEditingPromoIdx(null); setPromoLenderId(''); setPromoTitle('');
        setPromoDesc(''); setPromoRate(''); setPromoExpiry('');
    }

    async function savePromotion() {
        if (!promoLenderId || !promoTitle.trim()) { showToast('Select a lender and enter promotion title'); return; }
        const lender = lenders.find(x => x.id === promoLenderId);
        if (!lender) return;
        setPromoSaving(true);

        const newPromo: Promotion = {
            title: promoTitle.trim(),
            description: promoDesc.trim(),
            rate: parseFloat(promoRate) || 0,
            valid_until: promoExpiry || '',
        };

        let updatedPromos: Promotion[];
        if (editingPromoIdx !== null) {
            updatedPromos = lender.promotions.map((p, i) => i === editingPromoIdx ? newPromo : p);
        } else {
            updatedPromos = [...lender.promotions, newPromo];
        }

        try {
            const res = await fetch('/api/lenders', {
                method: 'PATCH',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: promoLenderId, promotions: updatedPromos }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error || 'Failed to save promotion'); return; }
            setLenders(prev => prev.map(l => l.id === promoLenderId ? data : l));
            showToast(editingPromoIdx !== null ? 'Promotion updated' : 'Promotion added');
            resetPromoForm();
            setPromoPreview(null);
        } catch { showToast('Network error'); }
        finally { setPromoSaving(false); }
    }

    async function deletePromotion(lenderId: string, pIndex: number) {
        const lender = lenders.find(x => x.id === lenderId);
        if (!lender) return;
        const updatedPromos = lender.promotions.filter((_, i) => i !== pIndex);
        try {
            const res = await fetch('/api/lenders', {
                method: 'PATCH',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: lenderId, promotions: updatedPromos }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error || 'Failed to delete promotion'); return; }
            setLenders(prev => prev.map(l => l.id === lenderId ? data : l));
            setPromoPreview(null);
            showToast('Promotion deleted');
        } catch { showToast('Network error'); }
    }

    // ── Send Application ──
    function onLenderDrop(e: React.DragEvent) {
        e.preventDefault(); setSaDropOver(false);
        if (!saSelectedLead) { showToast('Select a lead first'); return; }
        const id = dragLenderId.current;
        if (!id) return;
        const l = lenders.find(x => x.id === id);
        if (!l) return;
        if (saLenders.find(x => x.id === id)) { showToast('Already added'); return; }
        if (saLenders.length >= 4) { showToast('Max 4 lenders'); return; }
        setSaLenders(prev => [...prev, l]);
    }

    function buildPreview() {
        if (!saSelectedLead || !saLenders.length) { showToast('Select lead and at least one lender'); return; }
        const lines = [
            `Application Submission — ${new Date().toLocaleDateString('en-GB')}`,
            '',
            `Client: ${saSelectedLead.name} (${saSelectedLead.company || saSelectedLead.business || ''})`,
            `Loan Ref: ${saSelectedLead.id} · ${saSelectedLead.amount} · ${saSelectedLead.type || ''}`,
            '',
            `Lenders Selected (${saLenders.length}):`,
            ...saLenders.map((l, i) => `  ${i + 1}. ${l.name} — Rate: ${l.rates?.min ?? 0}%–${l.rates?.max ?? 0}% | Loan: ${fmt$(l.loan_ranges?.min ?? 0)}–${fmt$(l.loan_ranges?.max ?? 0)}`),
            '',
            saNote ? `Note: ${saNote}` : '',
        ].filter(l => l !== undefined);
        setSaPreview(lines.join('\n'));
    }

    // ── Export CSV ──
    function exportCSV() {
        const rows = [['ID', 'Name', 'Trading', 'Type', 'Status', 'Email', 'Manager', 'Rate Min', 'Rate Max', 'Loan Min', 'Loan Max', 'Categories', 'Added']];
        lenders.forEach(l => rows.push([
            l.id, l.name, l.trading, l.type, l.status, l.email, l.manager,
            String(l.rates?.min ?? 0), String(l.rates?.max ?? 0),
            String(l.loan_ranges?.min ?? 0), String(l.loan_ranges?.max ?? 0),
            l.categories.join('; '), l.added,
        ]));
        const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'lenders.csv'; a.click();
    }

    // ── Derived ──
    const allPromos: { lender: Lender; pIndex: number; p: Promotion }[] = [];
    lenders.forEach(l => l.promotions.forEach((p, i) => allPromos.push({ lender: l, pIndex: i, p })));

    const filteredPromos = allPromos.filter(item => {
        if (promoFilterLender !== 'All' && item.lender.name !== promoFilterLender) return false;
        if (promoSearch) {
            const hay = (item.lender.name + ' ' + item.p.title + ' ' + item.p.description).toLowerCase();
            if (!hay.includes(promoSearch.toLowerCase())) return false;
        }
        return true;
    });

    const saLeads = allLeads.filter(l => {
        const matchesSearch = !saLeadSearch || (l.name + (l.company || l.business || '') + l.id).toLowerCase().includes(saLeadSearch.toLowerCase());
        const matchesLevel = (l.leadLevel || l.lead_level || l.level) === saLevel;
        const isReady = ['verified', 'lender'].includes((l.status || '').toLowerCase());
        return matchesSearch && matchesLevel && isReady;
    });

    if (permsLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative' }}>
            {toast && <Toast msg={toast} onDone={() => setToast('')} />}

            <style>{`
              @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
              @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>

            {/* ===== DRAWER BACKDROP ===== */}
            {drawerOpen && (
                <div
                    onClick={() => { setDrawerOpen(false); resetForm(); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 100, backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* ===== SLIDE-OUT DRAWER ===== */}
            {drawerOpen && (
                <div style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: '#fff',
                    zIndex: 101, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,.15)',
                    animation: 'slideInRight .22s ease'
                }}>
                    {/* Drawer Header */}
                    <div style={{ ...s.panelHeader, flexShrink: 0, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className="fa-solid fa-building-columns" style={{ fontSize: 12, color: '#64748b' }} />
                            <div>
                                <h2 style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>
                                    {editId !== null ? 'Edit Lender' : 'Add Lender'}
                                </h2>
                                {editId !== null && <p style={{ fontSize: 10, color: '#d97706', fontWeight: 600, margin: 0 }}>{lenders.find(l => l.id === editId)?.name}</p>}
                            </div>
                        </div>
                        <button onClick={() => { setDrawerOpen(false); resetForm(); }}
                            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, cursor: 'pointer', color: '#94a3b8', flexShrink: 0 }}>
                            <i className="fa-solid fa-xmark" style={{ fontSize: 12 }} />
                        </button>
                    </div>

                    {/* Drawer Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: 'rgba(249,250,251,.5)', flexShrink: 0 }}>
                        {(['lender', 'promotions'] as const).map(tab => (
                            <button key={tab} onClick={() => setLeftTab(tab)} style={{ ...s.tabBtn, ...(leftTab === tab ? s.tabBtnActive : {}) }}>
                                {tab === 'lender' ? 'Lender Info' : 'Promotions'}
                            </button>
                        ))}
                    </div>

                    {/* Drawer Body */}
                    <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>

                        {/* === LENDER INFO TAB === */}
                        {leftTab === 'lender' && (
                            <div style={{ padding: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div>
                                        <span style={s.labelText}>Lender Name *</span>
                                        <input value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. ANZ Bank" style={s.inputCompact} />
                                    </div>
                                    <div>
                                        <span style={s.labelText}>Trading Name</span>
                                        <input value={fTrading} onChange={e => setFTrading(e.target.value)} placeholder="Trading as..." style={s.inputCompact} />
                                    </div>
                                    <div>
                                        <span style={s.labelText}>Status</span>
                                        <select value={fStatus} onChange={e => setFStatus(e.target.value)} style={s.inputCompact}>
                                            <option>Active</option><option>Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span style={s.labelText}>Type</span>
                                        <select value={fType} onChange={e => setFType(e.target.value)} style={s.inputCompact}>
                                            <option>Bank</option><option>Non-Bank</option><option>Credit Union</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span style={s.labelText}>Trading Years</span>
                                        <input type="number" value={fTradingYears} onChange={e => setFTradingYears(e.target.value)} placeholder="e.g. 25" style={s.inputCompact} />
                                    </div>
                                </div>

                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-percent" style={{ fontSize: 8 }} /> Rates & Loan Range</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div><span style={s.labelText}>Rate Min (%)</span><input type="number" value={fRateMin} onChange={e => setFRateMin(e.target.value)} placeholder="e.g. 5.74" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Rate Max (%)</span><input type="number" value={fRateMax} onChange={e => setFRateMax(e.target.value)} placeholder="e.g. 9.49" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Loan Min ($)</span><input type="number" value={fLoanMin} onChange={e => setFLoanMin(e.target.value)} placeholder="e.g. 20000" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Loan Max ($)</span><input type="number" value={fLoanMax} onChange={e => setFLoanMax(e.target.value)} placeholder="e.g. 5000000" style={s.inputCompact} /></div>
                                    </div>
                                </div>

                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-envelope" style={{ fontSize: 8 }} /> Contact</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div><span style={s.labelText}>Lender Email</span><input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="contact@lender.com.au" style={s.inputCompact} /></div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            <div><span style={s.labelText}>Account Manager</span><input value={fManager} onChange={e => setFManager(e.target.value)} placeholder="Full name" style={s.inputCompact} /></div>
                                            <div><span style={s.labelText}>Manager Email</span><input type="email" value={fManagerEmail} onChange={e => setFManagerEmail(e.target.value)} placeholder="manager@lender.com.au" style={s.inputCompact} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-location-dot" style={{ fontSize: 8 }} /> Address</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div><span style={s.labelText}>Trading Address</span><input value={fAddress} onChange={e => setFAddress(e.target.value)} placeholder="123 Main St, Sydney NSW 2000" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Registered Address</span><input value={fRegAddress} onChange={e => setFRegAddress(e.target.value)} placeholder="Same as trading or different..." style={s.inputCompact} /></div>
                                    </div>
                                </div>

                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-tags" style={{ fontSize: 8 }} /> Categories</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                        {formCats.map(cat => {
                                            const isSel = selCats.includes(cat);
                                            const isCustom = !PRESET_CATS.includes(cat);
                                            return (
                                                <span key={cat} onClick={() => toggleCat(cat)} style={{ ...s.catTag, ...(isSel ? s.catTagSel : {}) }}>
                                                    {cat}
                                                    {isCustom && (
                                                        <i className="fa-solid fa-xmark" style={{ fontSize: 10, opacity: .7 }}
                                                            onClick={e => { e.stopPropagation(); setFormCats(p => p.filter(c => c !== cat)); setSelCats(p => p.filter(c => c !== cat)); }} />
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <input value={catInput} onChange={e => setCatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomCat())} placeholder="Add custom category..." style={{ ...s.inputCompact, flex: 1, fontSize: 9 }} />
                                        <button onClick={addCustomCat} style={{ padding: '6px 12px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}><i className="fa-solid fa-plus" /></button>
                                    </div>
                                </div>

                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-layer-group" style={{ fontSize: 8 }} /> Accepted Lead Levels</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {(['Level 1', 'Level 2'] as const).map(lvl => {
                                            const sel = fLeadLevels.includes(lvl);
                                            return (
                                                <div
                                                    key={lvl}
                                                    onClick={() => setFLeadLevels(prev => sel ? prev.filter(x => x !== lvl) : [...prev, lvl])}
                                                    style={{ padding: '10px 12px', borderRadius: 10, border: `2px solid ${sel ? '#6366f1' : '#e2e8f0'}`, background: sel ? '#eef2ff' : '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s' }}
                                                >
                                                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: sel ? '#6366f1' : '#e2e8f0', color: sel ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, flexShrink: 0 }}>
                                                        {lvl === 'Level 1' ? '1' : '2'}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 10, fontWeight: 800, color: sel ? '#4338ca' : '#475569', margin: 0 }}>{lvl}</p>
                                                        <p style={{ fontSize: 9, color: sel ? '#818cf8' : '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>{sel ? 'Accepted' : 'Not accepted'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={s.formSec}>
                                    <span style={s.labelText}>Notes</span>
                                    <textarea rows={3} value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Internal notes..." style={{ ...s.inputCompact, resize: 'none' }} />
                                </div>

                                {formErr && <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 6 }}>{formErr}</p>}

                                <div style={{ paddingTop: 12, display: 'flex', gap: 8 }}>
                                    <button onClick={saveForm} disabled={formSaving} style={{ flex: 1, padding: '10px 0', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer', opacity: formSaving ? 0.6 : 1 }}>
                                        {formSaving
                                            ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 6 }} />Saving...</>
                                            : <><i className="fa-solid fa-plus" style={{ marginRight: 6 }} />{editId !== null ? 'Update Lender' : 'Add Lender'}</>
                                        }
                                    </button>
                                    {editId !== null && (
                                        <button onClick={() => { resetForm(); setDrawerOpen(false); }} style={{ padding: '10px 16px', background: '#fff', color: '#6b7280', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* === PROMOTIONS TAB === */}
                        {leftTab === 'promotions' && (
                            <div>
                                {/* Promo Preview */}
                                {promoPreview && (() => {
                                    const p = promoPreview.lender.promotions[promoPreview.pIndex];
                                    const expired = p?.valid_until && p.valid_until < today;
                                    return (
                                        <div style={{ padding: 16, background: '#0f172a', color: '#fff', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b' }}>Promotion Details</h3>
                                                <button onClick={() => setPromoPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14 }}><i className="fa-solid fa-xmark" /></button>
                                            </div>
                                            <p style={{ fontSize: 11, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{promoPreview.lender.name}</p>
                                            <p style={{ fontSize: 14, fontWeight: 900, marginBottom: 12 }}>{p?.title}</p>
                                            {p?.description && (
                                                <div style={{ marginBottom: 12 }}>
                                                    <span style={{ ...s.labelText, color: '#475569' }}>Description</span>
                                                    <p style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>{p.description}</p>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 12, marginBottom: 12 }}>
                                                <div>
                                                    <span style={{ ...s.labelText, color: '#475569' }}>Rate Offered</span>
                                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#cbd5e1' }}>{p?.rate ? `${p.rate}%` : '—'}</p>
                                                </div>
                                                <div>
                                                    <span style={{ ...s.labelText, color: '#475569' }}>Valid Until</span>
                                                    <p style={{ fontSize: 10, fontWeight: 700, color: expired ? '#f87171' : '#cbd5e1' }}>{p?.valid_until ? p.valid_until.slice(0, 10) : 'No Expiry'}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => {
                                                    setPromoLenderId(promoPreview.lender.id);
                                                    setPromoTitle(p?.title || '');
                                                    setPromoDesc(p?.description || '');
                                                    setPromoRate(String(p?.rate || ''));
                                                    setPromoExpiry(p?.valid_until ? p.valid_until.slice(0, 10) : '');
                                                    setEditingPromoIdx(promoPreview.pIndex);
                                                    setPromoPreview(null);
                                                }} style={{ flex: 1, padding: '6px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Edit</button>
                                                <button onClick={() => { if (confirm('Delete this promotion?')) deletePromotion(promoPreview.lender.id, promoPreview.pIndex); }} style={{ flex: 1, padding: '6px 0', background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Promo Form */}
                                <div style={{ padding: 16, background: 'rgba(249,250,251,.5)', borderBottom: '1px solid #f1f5f9' }}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-bullhorn" style={{ fontSize: 8 }} /> {editingPromoIdx !== null ? 'Edit Promotion' : 'Add New Promotion'}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div>
                                            <span style={s.labelText}>Lender *</span>
                                            <select value={promoLenderId} onChange={e => setPromoLenderId(e.target.value)} style={{ ...s.inputCompact, background: '#fff' }}>
                                                <option value="">— Select Lender —</option>
                                                {lenders.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <span style={s.labelText}>Promotion Title *</span>
                                            <input value={promoTitle} onChange={e => setPromoTitle(e.target.value)} placeholder="e.g. Q3 Cashback Offer" style={{ ...s.inputCompact, background: '#fff' }} />
                                        </div>
                                        <div>
                                            <span style={s.labelText}>Description</span>
                                            <textarea rows={2} value={promoDesc} onChange={e => setPromoDesc(e.target.value)} placeholder="Describe the offer..." style={{ ...s.inputCompact, background: '#fff', resize: 'none' }} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            <div>
                                                <span style={s.labelText}>Rate Offered (%)</span>
                                                <input type="number" value={promoRate} onChange={e => setPromoRate(e.target.value)} placeholder="e.g. 4.99" style={{ ...s.inputCompact, background: '#fff' }} />
                                            </div>
                                            <div>
                                                <span style={s.labelText}>Valid Until</span>
                                                <input type="date" value={promoExpiry} onChange={e => setPromoExpiry(e.target.value)} style={{ ...s.inputCompact, background: '#fff' }} />
                                            </div>
                                        </div>
                                        <button onClick={savePromotion} disabled={promoSaving} style={{ width: '100%', padding: '10px 0', background: '#374151', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer', opacity: promoSaving ? 0.6 : 1 }}>
                                            {promoSaving ? 'Saving...' : (editingPromoIdx !== null ? 'Update Promotion' : 'Add Promotion')}
                                        </button>
                                        {editingPromoIdx !== null && (
                                            <button onClick={resetPromoForm} style={{ width: '100%', padding: '6px 0', background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#6b7280', cursor: 'pointer' }}>Cancel Edit</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* ===== MAIN LAYOUT: Table + Promotions ===== */}
            <div style={{ display: 'flex', flex: 1, gap: 12, padding: 12, minWidth: 0, overflow: 'hidden' }}>

                {/* ===== MIDDLE PANEL (Lender Table) ===== */}
                <section style={{ ...s.panelCard, flex: 1, minWidth: 0 }}>
                    <div style={{ ...s.panelHeader, justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className="fa-solid fa-building-columns" style={{ fontSize: 12, color: '#64748b' }} />
                            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#fff', margin: 0 }}>Lender Database</h2>
                            {filtered.length !== lenders.length && (
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', fontFamily: 'monospace' }}>({filtered.length} of {lenders.length})</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Search */}
                            <div style={{ position: 'relative' }}>
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lenders..."
                                    style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, padding: '5px 10px 5px 26px', fontSize: 11, fontWeight: 600, color: '#fff', outline: 'none', width: 160 }} />
                                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(255,255,255,.3)' }} />
                            </div>
                            {/* Status filter */}
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                                style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, padding: '5px 22px 5px 9px', fontSize: 11, fontWeight: 700, color: '#d1d5db', outline: 'none', cursor: 'pointer' }}>
                                <option value="All">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
                            </select>
                            {/* Stats */}
                            <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,.1)', paddingLeft: 10, gap: 0 }}>
                                {[
                                    { val: lenders.length, label: 'Total', color: '#fff' },
                                    { val: lenders.filter(l => l.status === 'Active').length, label: 'Active', color: '#4ade80' },
                                    { val: lenders.filter(l => l.status === 'Inactive').length, label: 'Inactive', color: '#f87171' },
                                ].map(({ val, label, color }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRight: label !== 'Inactive' ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                                        <span style={{ fontSize: 13, fontWeight: 900, color }}>{val}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Add Lender button */}
                            <button onClick={() => { resetForm(); setLeftTab('lender'); setDrawerOpen(true); }}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                <i className="fa-solid fa-plus" style={{ fontSize: 10 }} /> Add Lender
                            </button>
                        </div>
                    </div>

                    {/* Load error */}
                    {loadErr && (
                        <div style={{ padding: '12px 16px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444', fontSize: 11 }} />
                            <span style={{ fontSize: 11, color: '#b91c1c', fontWeight: 600 }}>{loadErr}</span>
                            <button onClick={fetchLenders} style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#b91c1c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
                        </div>
                    )}

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#f9fafb', borderBottom: '1px solid #f1f5f9', zIndex: 10 }}>
                                <tr>
                                    {['Lender', 'Account Manager', 'Rate Range', 'Categories', 'Status', ''].map(h => (
                                        <th key={h} style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {fetchLoading && Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f1f5f9', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                                <div>
                                                    <div style={{ height: 11, width: 110, background: '#f1f5f9', borderRadius: 4, marginBottom: 5, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                                    <div style={{ height: 8, width: 60, background: '#f8fafc', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ height: 11, width: 90, background: '#f1f5f9', borderRadius: 4, marginBottom: 5, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                            <div style={{ height: 8, width: 120, background: '#f8fafc', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ height: 11, width: 60, background: '#f1f5f9', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <div style={{ height: 20, width: 60, background: '#f1f5f9', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                                <div style={{ height: 20, width: 50, background: '#f1f5f9', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ height: 20, width: 55, background: '#f1f5f9', borderRadius: 99, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        </td>
                                        <td style={{ padding: '10px 8px' }}>
                                            <div style={{ height: 10, width: 10, background: '#f1f5f9', borderRadius: 3, margin: '0 auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        </td>
                                    </tr>
                                ))}
                                {!fetchLoading && filtered.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa-solid fa-building-columns" style={{ fontSize: 18, color: '#cbd5e1' }} />
                                            </div>
                                            <p style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '.06em', margin: 0 }}>
                                                {lenders.length === 0 ? 'No lenders yet' : 'No lenders match'}
                                            </p>
                                            <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                                                {lenders.length === 0 ? 'Click "Add Lender" to get started' : 'Try adjusting your search or filters'}
                                            </p>
                                        </div>
                                    </td></tr>
                                ) : !fetchLoading && filtered.map(l => (
                                    <React.Fragment key={l.id}>
                                        <tr
                                            id={`row-${l.id}`}
                                            onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                                            draggable
                                            onDragStart={e => { dragLenderId.current = l.id; e.dataTransfer.effectAllowed = 'copy'; }}
                                            style={{ cursor: 'pointer', background: expandedId === l.id ? '#f8fafc' : '#fff', borderBottom: '1px solid #f9fafb', transition: 'background .1s' }}
                                            onMouseOver={e => { if (expandedId !== l.id) e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseOut={e => { if (expandedId !== l.id) e.currentTarget.style.background = '#fff'; }}
                                        >
                                            <td style={{ padding: '10px 12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: iconColor(l.type), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{initials(l.name)}</div>
                                                    <div>
                                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: 0 }}>{l.name}</p>
                                                        <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.03em', margin: 0 }}>{l.trading || l.type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                {l.manager ? (
                                                    <>
                                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', margin: 0 }}>{l.manager}</p>
                                                        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{l.manager_email}</p>
                                                    </>
                                                ) : <span style={{ fontSize: 11, color: '#d1d5db' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>{l.rates?.min ?? 0}% – {l.rates?.max ?? 0}%</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{fmt$(l.loan_ranges?.min ?? 0)} – {fmt$(l.loan_ranges?.max ?? 0)}</p>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                    {l.categories.slice(0, 2).map(c => <span key={c} style={s.categoryChip}>{c}</span>)}
                                                    {l.categories.length > 2 && <span style={{ ...s.categoryChip, color: '#9ca3af' }}>+{l.categories.length - 2}</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{ ...s.badge, background: l.status === 'Active' ? '#f0fdf4' : '#f9fafb', color: l.status === 'Active' ? '#16a34a' : '#94a3b8', border: `1px solid ${l.status === 'Active' ? '#bbf7d0' : '#e2e8f0'}` }}>
                                                    <i className={`fa-solid ${l.status === 'Active' ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ marginRight: 4, fontSize: 8 }} />{l.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                                <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: '#d1d5db', transition: 'transform .2s', transform: expandedId === l.id ? 'rotate(90deg)' : 'none' }} />
                                            </td>
                                        </tr>

                                        {expandedId === l.id && (
                                            <tr>
                                                <td colSpan={6} style={{ padding: 0 }}>
                                                    <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', padding: '16px 24px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                                                            {/* Identity */}
                                                            <div>
                                                                <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-building-columns" style={{ marginRight: 4 }} />Identity</p>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                                    {l.trading && <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Trading As</p><p style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', margin: 0 }}>{l.trading}</p></div>}
                                                                    {l.trading_years > 0 && <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Trading Years</p><p style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', margin: 0 }}>{l.trading_years} yrs</p></div>}
                                                                    <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Rate Range</p><p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>{l.rates?.min ?? 0}% – {l.rates?.max ?? 0}%</p></div>
                                                                    <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Loan Range</p><p style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', margin: 0 }}>{fmt$(l.loan_ranges?.min ?? 0)} – {fmt$(l.loan_ranges?.max ?? 0)}</p></div>
                                                                </div>
                                                            </div>
                                                            {/* Contact */}
                                                            <div>
                                                                <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-envelope" style={{ marginRight: 4 }} />Contact</p>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                                    {l.email && <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Lender Email</p><a href={`mailto:${l.email}`} onClick={e => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', textDecoration: 'none', wordBreak: 'break-all' }}>{l.email}</a></div>}
                                                                    {l.manager && <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Account Manager</p><p style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', margin: 0 }}>{l.manager}</p></div>}
                                                                    {l.manager_email && <div><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Manager Email</p><a href={`mailto:${l.manager_email}`} onClick={e => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', textDecoration: 'none', wordBreak: 'break-all' }}>{l.manager_email}</a></div>}
                                                                </div>
                                                            </div>
                                                            {/* Address + actions */}
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <div>
                                                                    <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-location-dot" style={{ marginRight: 4 }} />Address</p>
                                                                    {l.address && <div style={{ marginBottom: 6 }}><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Trading</p><p style={{ fontSize: 12, fontWeight: 600, color: '#374151', lineHeight: 1.4, margin: 0 }}>{l.address}</p></div>}
                                                                    {l.reg_address && <div style={{ marginBottom: 10 }}><p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Registered</p><p style={{ fontSize: 12, color: l.reg_address === l.address ? '#9ca3af' : '#374151', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>{l.reg_address === l.address ? 'Same as trading' : l.reg_address}</p></div>}
                                                                    <p style={{ ...s.labelText, marginBottom: 6 }}><i className="fa-solid fa-tags" style={{ marginRight: 4 }} />Categories</p>
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>{l.categories.map(c => <span key={c} style={s.categoryChip}>{c}</span>)}</div>
                                                                    {l.notes && <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>{l.notes}</p>}
                                                                </div>
                                                                <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
                                                                    <button onClick={e => { e.stopPropagation(); loadEditForm(l); }}
                                                                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, background: '#111827', color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', border: 'none', cursor: 'pointer' }}>
                                                                        <i className="fa-solid fa-pen" style={{ fontSize: 9 }} />Edit
                                                                    </button>
                                                                    <button onClick={e => { e.stopPropagation(); if (confirm(`Delete ${l.name}?`)) deleteLender(l.id); }}
                                                                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, background: '#fff', color: '#ef4444', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', border: '1px solid #fecaca', cursor: 'pointer' }}>
                                                                        <i className="fa-solid fa-trash" style={{ fontSize: 9 }} />Delete
                                                                    </button>
                                                                    <p style={{ fontSize: 10, color: '#d1d5db', fontFamily: 'monospace', marginLeft: 'auto', margin: 0 }}>Added {l.added ? l.added.slice(0, 10) : '—'}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Promotions in expand */}
                                                        {l.promotions.length > 0 && (
                                                            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                                                                <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-bullhorn" style={{ marginRight: 4 }} />Promotions</p>
                                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                                                                    {l.promotions.map((p, i) => {
                                                                        const expired = p.valid_until && p.valid_until < today;
                                                                        return (
                                                                            <div key={i} style={{ background: '#fff', border: `1px solid ${expired ? '#fecaca' : '#e2e8f0'}`, borderRadius: 8, padding: 8 }}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 3 }}>
                                                                                    <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>{p.title}</p>
                                                                                    <span style={{ background: expired ? '#ef4444' : '#64748b', color: '#fff', padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>{expired ? 'EXPIRED' : 'ACTIVE'}</span>
                                                                                </div>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, color: expired ? '#ef4444' : '#94a3b8', textTransform: 'uppercase' }}>
                                                                                    {p.rate > 0 && <span><i className="fa-solid fa-percent" style={{ marginRight: 2 }} />{p.rate}%</span>}
                                                                                    <span><i className="fa-solid fa-calendar-days" style={{ marginRight: 2 }} />{p.valid_until ? p.valid_until.slice(0, 10) : 'No Expiry'}</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: '10px 16px', borderTop: '1px solid #f9fafb', background: 'rgba(249,250,251,.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>Showing {filtered.length} lender{filtered.length !== 1 ? 's' : ''}</span>
                        <button onClick={exportCSV} style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="fa-solid fa-download" /> Export CSV
                        </button>
                    </div>
                </section>

                {/* ===== RIGHT PANEL (Promotions DB) ===== */}
                <section style={{ ...s.panelCard, width: 300, flexShrink: 0 }}>
                    <div style={{ ...s.panelHeader, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className="fa-solid fa-bullhorn" style={{ fontSize: 11, color: '#64748b' }} />
                            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#fff', margin: 0 }}>Promotions</h2>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>{filteredPromos.length}</span>
                    </div>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 6 }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input value={promoSearch} onChange={e => setPromoSearch(e.target.value)} placeholder="Search..."
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 7, padding: '5px 8px 5px 24px', fontSize: 11, fontWeight: 600, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#d1d5db' }} />
                        </div>
                        <select value={promoFilterLender} onChange={e => setPromoFilterLender(e.target.value)}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 7, padding: '5px 6px', fontSize: 10, fontWeight: 700, color: '#374151', outline: 'none', cursor: 'pointer', maxWidth: 90 }}>
                            <option value="All">All</option>
                            {lenders.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                        </select>
                    </div>

                    {/* Promo detail preview (click-to-expand) */}
                    {promoPreview && (() => {
                        const p = promoPreview.lender.promotions[promoPreview.pIndex];
                        const expired = p?.valid_until && p.valid_until < today;
                        return (
                            <div style={{ padding: 12, background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b' }}>Detail</span>
                                    <button onClick={() => setPromoPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, lineHeight: 1 }}><i className="fa-solid fa-xmark" /></button>
                                </div>
                                <p style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', margin: '0 0 2px' }}>{promoPreview.lender.name}</p>
                                <p style={{ fontSize: 13, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>{p?.title}</p>
                                {p?.description && <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 10px' }}>{p.description}</p>}
                                <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700, color: expired ? '#f87171' : '#64748b', textTransform: 'uppercase', marginBottom: 10 }}>
                                    {p?.rate ? <span><i className="fa-solid fa-percent" style={{ marginRight: 3 }} />{p.rate}%</span> : null}
                                    <span><i className="fa-solid fa-calendar-days" style={{ marginRight: 3 }} />{p?.valid_until ? p.valid_until.slice(0, 10) : 'No Expiry'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button onClick={() => {
                                        setPromoLenderId(promoPreview.lender.id);
                                        setPromoTitle(p?.title || '');
                                        setPromoDesc(p?.description || '');
                                        setPromoRate(String(p?.rate || ''));
                                        setPromoExpiry(p?.valid_until ? p.valid_until.slice(0, 10) : '');
                                        setEditingPromoIdx(promoPreview.pIndex);
                                        setPromoPreview(null);
                                        setLeftTab('promotions');
                                        setDrawerOpen(true);
                                    }} style={{ flex: 1, padding: '6px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 7, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => { if (confirm('Delete this promotion?')) deletePromotion(promoPreview.lender.id, promoPreview.pIndex); }} style={{ flex: 1, padding: '6px 0', background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.2)', borderRadius: 7, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
                        {filteredPromos.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', textAlign: 'center' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                    <i className="fa-solid fa-bullhorn" style={{ fontSize: 18, color: '#cbd5e1' }} />
                                </div>
                                <p style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                                    {lenders.length === 0 ? 'No promotions yet' : 'No promotions match'}
                                </p>
                                <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>
                                    {promoSearch || promoFilterLender !== 'All' ? 'Try adjusting your filter' : 'Add a promotion via the drawer'}
                                </p>
                            </div>
                        ) : filteredPromos.map(({ lender, pIndex, p }) => {
                            const expired = p.valid_until && p.valid_until < today;
                            const isSelected = promoPreview?.lender.id === lender.id && promoPreview?.pIndex === pIndex;
                            return (
                                <div key={`${lender.id}-${pIndex}`}
                                    onClick={() => setPromoPreview(isSelected ? null : { lender, pIndex })}
                                    style={{
                                        background: isSelected ? '#f1f5f9' : '#f8fafc',
                                        border: `1px solid ${isSelected ? '#cbd5e1' : (expired ? '#fecaca' : '#e2e8f0')}`,
                                        borderRadius: 9, padding: '8px 10px', marginBottom: 6, cursor: 'pointer', transition: 'all .1s'
                                    }}
                                    onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = '#f1f5f9'; }}
                                    onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                                            <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>{lender.name}</p>
                                        </div>
                                        <span style={{ background: expired ? '#fef2f2' : '#f0fdf4', color: expired ? '#ef4444' : '#16a34a', border: `1px solid ${expired ? '#fecaca' : '#bbf7d0'}`, padding: '2px 6px', borderRadius: 5, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>{expired ? 'EXPIRED' : 'ACTIVE'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                                        {p.rate > 0 && <span><i className="fa-solid fa-percent" style={{ marginRight: 2 }} />{p.rate}%</span>}
                                        <span><i className="fa-solid fa-calendar-days" style={{ marginRight: 2 }} />{p.valid_until ? p.valid_until.slice(0, 10) : 'No Expiry'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ padding: '8px 12px', borderTop: '1px solid #f9fafb', background: 'rgba(249,250,251,.5)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>{filteredPromos.length} promotion{filteredPromos.length !== 1 ? 's' : ''}</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
