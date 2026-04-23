'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Promotion { name: string; commission: string; offer: string; expiry: string; document: string; }
interface Lender {
    id: number; name: string; trading: string; type: string; status: string;
    email: string; manager: string; managerEmail: string; address: string; regAddress: string;
    tradingYears: number; rateMin: number; rateMax: number; loanMin: number; loanMax: number;
    categories: string[]; notes: string; added: string; promotions: Promotion[];
}

const PRESET_CATS = ['Secured', 'Commercial', 'Unsecured', 'Refinance'];
const fmt$ = (n: number) => n >= 1000000 ? '$' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M' : n >= 1000 ? '$' + (n / 1000).toFixed(0) + 'K' : '$' + n;
const initials = (n: string) => n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
const iconColor = (t: string) => t === 'Bank' ? '#334155' : t === 'Non-Bank' ? '#475569' : '#64748b';
const today = new Date().toISOString().split('T')[0];

const INIT_LENDERS: Lender[] = [
    { id: 1, name: 'ANZ Bank', trading: 'ANZ', type: 'Bank', status: 'Active', email: 'broker@anz.com.au', manager: 'Sarah Collins', managerEmail: 's.collins@anz.com.au', address: '242 Pitt Street, Sydney NSW 2000', regAddress: '242 Pitt Street, Sydney NSW 2000', tradingYears: 185, rateMin: 5.74, rateMax: 9.49, loanMin: 20000, loanMax: 5000000, categories: ['Secured', 'Commercial', 'Refinance'], notes: "One of Australia's Big Four banks. Strong digital platform. Good for first home buyers.", added: '2026-01-10', promotions: [{ name: 'Q1 Cashback', commission: '0.25%', offer: '$2000 Cashback for first home owners', expiry: '2026-06-30', document: 'TC_ANZ_Q1.pdf' }, { name: 'Loyalty Bonus', commission: '0.15%', offer: 'Reduced interest rate for existing ANZ customers', expiry: '2026-12-31', document: 'Loyalty_Terms.jpg' }] },
    { id: 2, name: 'Commonwealth Bank', trading: 'CommBank', type: 'Bank', status: 'Active', email: 'broker@cba.com.au', manager: 'James Wu', managerEmail: 'j.wu@cba.com.au', address: 'Ground Floor, Tower 1, 201 Sussex St, Sydney NSW 2000', regAddress: 'Level 1, 201 Sussex St, Sydney NSW 2000', tradingYears: 112, rateMin: 5.69, rateMax: 9.99, loanMin: 10000, loanMax: 10000000, categories: ['Secured', 'Commercial', 'Unsecured', 'Refinance'], notes: "Australia's largest bank by market cap. Excellent branch network. NetBank is market-leading.", added: '2026-01-10', promotions: [{ name: 'SME Boost', commission: '0.50%', offer: 'Reduced rates for logistics industry', expiry: '2026-05-15', document: 'CommBank_SME.pdf' }] },
    { id: 3, name: 'Macquarie Bank', trading: 'Macquarie', type: 'Bank', status: 'Active', email: 'brokers@macquarie.com', manager: 'Priya Sharma', managerEmail: 'p.sharma@macquarie.com', address: '50 Martin Place, Sydney NSW 2000', regAddress: '50 Martin Place, Sydney NSW 2000', tradingYears: 55, rateMin: 5.59, rateMax: 8.75, loanMin: 50000, loanMax: 20000000, categories: ['Secured', 'Commercial'], notes: 'Highly competitive rates for investment and SMSF lending. Tech-forward platform. No physical branches.', added: '2026-01-15', promotions: [{ name: 'Investor Special', commission: '0.40%', offer: 'LVR up to 90% for investment properties', expiry: '2026-08-20', document: 'Macq_Investor.pdf' }] },
    { id: 4, name: 'Westpac', trading: 'Westpac', type: 'Bank', status: 'Active', email: 'broker@westpac.com.au', manager: 'Tom Nguyen', managerEmail: 't.nguyen@westpac.com.au', address: '275 Kent Street, Sydney NSW 2000', regAddress: '275 Kent Street, Sydney NSW 2000', tradingYears: 207, rateMin: 5.89, rateMax: 10.49, loanMin: 20000, loanMax: 5000000, categories: ['Secured', 'Commercial', 'Unsecured', 'Refinance'], notes: "Australia's oldest bank. Strong in construction loans and family guarantee products.", added: '2026-01-20', promotions: [{ name: 'Build-A-Home', commission: '0.60%', offer: 'Incentives for green construction projects', expiry: '2026-07-01', document: 'Westpac_Green.png' }] },
    { id: 5, name: 'NAB', trading: 'NAB', type: 'Bank', status: 'Active', email: 'broker@nab.com.au', manager: 'Emily Tran', managerEmail: 'e.tran@nab.com.au', address: 'Level 1, 800 Bourke St, Docklands VIC 3008', regAddress: 'Level 1, 800 Bourke St, Docklands VIC 3008', tradingYears: 163, rateMin: 5.79, rateMax: 9.89, loanMin: 20000, loanMax: 8000000, categories: ['Secured', 'Commercial', 'Refinance'], notes: 'Strong SME lending focus. Good for self-employed applicants. UBank is digital subsidiary.', added: '2026-02-01', promotions: [{ name: 'SME Recovery', commission: '0.75%', offer: 'Special rates for post-disaster business loans', expiry: '2026-04-30', document: 'NAB_SME_Recovery.pdf' }] },
    { id: 6, name: 'Suncorp', trading: 'Suncorp Bank', type: 'Non-Bank', status: 'Inactive', email: 'broker@suncorp.com.au', manager: 'Mark Patel', managerEmail: 'm.patel@suncorp.com.au', address: 'Level 28, 266 George St, Brisbane QLD 4000', regAddress: 'Level 28, 266 George St, Brisbane QLD 4000', tradingYears: 31, rateMin: 6.19, rateMax: 11.25, loanMin: 15000, loanMax: 3000000, categories: ['Secured', 'Unsecured', 'Refinance'], notes: 'Regional bank focus. Good for QLD and NSW clients. Limited to certain postcodes for investment.', added: '2026-02-10', promotions: [{ name: 'Sun State Special', commission: '0.30%', offer: 'QLD first home owner bonus grant', expiry: '2024-12-31', document: 'Suncorp_QLD.pdf' }] },
    { id: 7, name: 'Pepper Money', trading: 'Pepper', type: 'Non-Bank', status: 'Active', email: 'broker@peppermoney.com.au', manager: 'Lisa Nguyen', managerEmail: 'l.nguyen@peppermoney.com.au', address: 'Level 33, 2 Park St, Sydney NSW 2000', regAddress: 'Level 33, 2 Park St, Sydney NSW 2000', tradingYears: 24, rateMin: 6.49, rateMax: 14.99, loanMin: 5000, loanMax: 2000000, categories: ['Unsecured', 'Refinance', 'Commercial'], notes: 'Specialist lender for near-prime and self-employed borrowers. Fast turnaround times.', added: '2026-02-15', promotions: [{ name: 'Near-Prime Special', commission: '0.55%', offer: 'Reduced rate for near-prime applicants with 12 months clean history', expiry: '2026-09-30', document: 'Pepper_NearPrime.pdf' }] },
    { id: 8, name: 'Liberty Financial', trading: 'Liberty', type: 'Non-Bank', status: 'Active', email: 'brokers@liberty.com.au', manager: 'David Kim', managerEmail: 'd.kim@liberty.com.au', address: 'Level 7, 535 Bourke St, Melbourne VIC 3000', regAddress: 'Level 7, 535 Bourke St, Melbourne VIC 3000', tradingYears: 28, rateMin: 6.29, rateMax: 13.49, loanMin: 10000, loanMax: 3000000, categories: ['Secured', 'Unsecured', 'Refinance'], notes: 'Flexible lending solutions. Strong in alt-doc and low-doc loans. Good broker support.', added: '2026-02-20', promotions: [{ name: 'Alt-Doc Advantage', commission: '0.45%', offer: 'Streamlined alt-doc approval for ABN holders 2+ years', expiry: '2026-10-15', document: 'Liberty_AltDoc.pdf' }, { name: 'Refi Rebate', commission: '0.35%', offer: '$500 rebate on refinance settlements over $300K', expiry: '2026-07-31', document: 'Liberty_Refi.pdf' }] },
    { id: 9, name: 'Resimac', trading: 'Resimac', type: 'Non-Bank', status: 'Active', email: 'broker@resimac.com.au', manager: 'Angela Foster', managerEmail: 'a.foster@resimac.com.au', address: 'Level 9, 45 Clarence St, Sydney NSW 2000', regAddress: 'Level 9, 45 Clarence St, Sydney NSW 2000', tradingYears: 38, rateMin: 5.99, rateMax: 12.75, loanMin: 20000, loanMax: 5000000, categories: ['Secured', 'Refinance'], notes: 'Strong residential and asset finance. Competitive prime rates. Good for complex income structures.', added: '2026-03-01', promotions: [{ name: 'Prime Rate Drop', commission: '0.30%', offer: '0.15% rate reduction on prime residential loans settled before Q3', expiry: '2026-09-01', document: 'Resimac_Prime.pdf' }] },
    { id: 10, name: 'Bank of Queensland', trading: 'BOQ', type: 'Bank', status: 'Active', email: 'broker@boq.com.au', manager: 'Chris Lawson', managerEmail: 'c.lawson@boq.com.au', address: 'Level 6, 100 Skyring Tce, Newstead QLD 4006', regAddress: 'Level 6, 100 Skyring Tce, Newstead QLD 4006', tradingYears: 149, rateMin: 5.84, rateMax: 10.99, loanMin: 15000, loanMax: 4000000, categories: ['Secured', 'Commercial', 'Refinance'], notes: 'Strong QLD presence. Good for regional clients. Owner-managed branch model.', added: '2026-03-05', promotions: [{ name: 'QLD Business Boost', commission: '0.50%', offer: 'Preferential rates for QLD-based SME borrowers', expiry: '2026-08-31', document: 'BOQ_Business.pdf' }, { name: 'Regional Reward', commission: '0.20%', offer: 'Bonus commission for settlements in regional postcodes', expiry: '2026-12-31', document: 'BOQ_Regional.pdf' }] },
    { id: 11, name: 'Heritage Bank', trading: 'Heritage', type: 'Credit Union', status: 'Active', email: 'broker@heritage.com.au', manager: 'Sandra Mills', managerEmail: 's.mills@heritage.com.au', address: '400 Ruthven St, Toowoomba QLD 4350', regAddress: '400 Ruthven St, Toowoomba QLD 4350', tradingYears: 145, rateMin: 5.94, rateMax: 10.25, loanMin: 10000, loanMax: 2000000, categories: ['Secured', 'Unsecured', 'Refinance'], notes: 'Member-owned. Competitive rates for owner-occupiers. Strong community focus in QLD.', added: '2026-03-10', promotions: [{ name: 'Member Rate', commission: '0.25%', offer: 'Exclusive rate discount for new Heritage members', expiry: '2026-11-30', document: 'Heritage_Member.pdf' }] },
    { id: 12, name: 'Latitude Financial', trading: 'Latitude', type: 'Non-Bank', status: 'Inactive', email: 'broker@latitudefinancial.com.au', manager: 'Ryan Cho', managerEmail: 'r.cho@latitudefinancial.com.au', address: 'Level 8, 360 Collins St, Melbourne VIC 3000', regAddress: 'Level 8, 360 Collins St, Melbourne VIC 3000', tradingYears: 12, rateMin: 7.99, rateMax: 19.99, loanMin: 5000, loanMax: 100000, categories: ['Unsecured'], notes: 'Consumer-focused personal loans. Currently paused for new broker submissions pending policy review.', added: '2026-03-15', promotions: [] },
];

const SEND_APP_LEADS = [
    { id: '#AF-004', name: 'Courtney Henry', company: 'Henry Logistics', amount: '£150,000', type: 'Asset Finance' },
    { id: '#AF-007', name: 'Eleanor Pena', company: 'Pena Holdings', amount: '£500,000', type: 'Commercial' },
    { id: '#AF-006', name: 'Arlene McCoy', company: 'McCoy Dev', amount: '£2,100,000', type: 'Construction' },
    { id: '#AF-011', name: 'Cody Fisher', company: 'Fisher Marine', amount: '£750,000', type: 'Asset Finance' },
];

const s: Record<string, React.CSSProperties> = {
    panelCard: { background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.05)' },
    labelText: { fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', color: '#94a3b8', marginBottom: 3, display: 'block' },
    inputCompact: { width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 8, padding: '7px 10px', fontSize: 10.5, fontWeight: 500, outline: 'none', color: '#1e293b', boxSizing: 'border-box' },
    formSec: { borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 10 },
    formSecTitle: { fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#cbd5e1', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 },
    catTag: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.03em', border: '1px solid #e2e8f0', cursor: 'pointer' },
    catTagSel: { background: '#0f172a', color: '#fff', borderColor: '#0f172a' },
    categoryChip: { display: 'inline-flex', alignItems: 'center', padding: '3px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.03em' },
    badge: { display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 99, fontSize: 8, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
    tabBtn: { flex: 1, padding: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#94a3b8', borderBottom: '2px solid transparent', cursor: 'pointer', textAlign: 'center', background: 'none', border: 'none' } as React.CSSProperties,
    tabBtnActive: { color: '#0f172a', borderBottom: '2px solid #0f172a' },
    promoCard: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, marginBottom: 8, cursor: 'pointer', transition: 'transform .1s' },
    dropZone: { border: '2px dashed #e2e8f0', borderRadius: 12, padding: '16px 12px', textAlign: 'center', transition: 'all .2s', background: '#fafafa', marginBottom: 8 },
};

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
    useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
    return <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', borderRadius: 10, padding: '10px 18px', fontSize: 11, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}>{msg}</div>;
}

export default function LenderManagementPage() {
    const [lenders, setLenders] = useState<Lender[]>(INIT_LENDERS);
    const [nextId, setNextId] = useState(13);

    // table state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // left panel
    const [leftTab, setLeftTab] = useState<'lender' | 'promotions' | 'sendapp'>('lender');
    const [editId, setEditId] = useState<number | null>(null);

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
    const [catInput, setCatInput] = useState('');

    // promotions tab
    const [promoLenderId, setPromoLenderId] = useState('');
    const [promoName, setPromoName] = useState('');
    const [promoOffer, setPromoOffer] = useState('');
    const [promoExpiry, setPromoExpiry] = useState('');
    const [promoDoc, setPromoDoc] = useState('');
    const [editingPromo, setEditingPromo] = useState<{ lenderId: number; pIndex: number } | null>(null);
    const [promoPreview, setPromoPreview] = useState<{ lender: Lender; pIndex: number } | null>(null);

    // send app
    const [saStep, setSaStep] = useState(1);
    const [saLeadSearch, setSaLeadSearch] = useState('');
    const [saSelectedLead, setSaSelectedLead] = useState<typeof SEND_APP_LEADS[0] | null>(null);
    const [saLenders, setSaLenders] = useState<Lender[]>([]);
    const [saNote, setSaNote] = useState('');
    const [saPreview, setSaPreview] = useState('');
    const [saDropOver, setSaDropOver] = useState(false);

    // doc viewer
    const [docViewer, setDocViewer] = useState<{ filename: string; title: string; lender: string; offer: string; expiry: string } | null>(null);

    // right panel
    const [promoSearch, setPromoSearch] = useState('');
    const [promoFilterLender, setPromoFilterLender] = useState('All');

    const [toast, setToast] = useState('');
    const dragLenderId = useRef<number | null>(null);

    const showToast = (msg: string) => setToast(msg);

    // --- filtered table ---
    const filtered = lenders.filter(l => {
        if (statusFilter !== 'All' && l.status !== statusFilter) return false;
        if (search) {
            const hay = [l.name, l.trading, l.manager, l.email, l.address, ...l.categories, l.notes].join(' ').toLowerCase();
            if (!hay.includes(search.toLowerCase())) return false;
        }
        return true;
    });

    // --- lender form helpers ---
    function resetForm() {
        setEditId(null); setFName(''); setFTrading(''); setFType('Bank'); setFStatus('Active');
        setFEmail(''); setFManager(''); setFManagerEmail(''); setFAddress(''); setFRegAddress('');
        setFTradingYears(''); setFRateMin(''); setFRateMax(''); setFLoanMin(''); setFLoanMax('');
        setFNotes(''); setFormCats([...PRESET_CATS]); setSelCats([]);
    }

    function loadEditForm(id: number) {
        const l = lenders.find(x => x.id === id);
        if (!l) return;
        setEditId(id); setFName(l.name); setFTrading(l.trading); setFType(l.type); setFStatus(l.status);
        setFEmail(l.email); setFManager(l.manager); setFManagerEmail(l.managerEmail);
        setFAddress(l.address); setFRegAddress(l.regAddress);
        setFTradingYears(String(l.tradingYears)); setFRateMin(String(l.rateMin)); setFRateMax(String(l.rateMax));
        setFLoanMin(String(l.loanMin)); setFLoanMax(String(l.loanMax)); setFNotes(l.notes);
        const custom = l.categories.filter(c => !PRESET_CATS.includes(c));
        setFormCats([...PRESET_CATS, ...custom]);
        setSelCats([...l.categories]);
        setLeftTab('lender');
    }

    function saveForm() {
        if (!fName.trim()) { showToast('Lender name is required'); return; }
        const data: Omit<Lender, 'id' | 'added' | 'promotions'> = {
            name: fName.trim(), trading: fTrading.trim(), type: fType, status: fStatus,
            email: fEmail.trim(), manager: fManager.trim(), managerEmail: fManagerEmail.trim(),
            address: fAddress.trim(), regAddress: fRegAddress.trim(),
            tradingYears: parseFloat(fTradingYears) || 0,
            rateMin: parseFloat(fRateMin) || 0, rateMax: parseFloat(fRateMax) || 0,
            loanMin: parseFloat(fLoanMin) || 0, loanMax: parseFloat(fLoanMax) || 0,
            categories: selCats, notes: fNotes.trim(),
        };
        if (editId !== null) {
            setLenders(prev => prev.map(l => l.id === editId ? { ...l, ...data } : l));
            showToast('Lender updated');
        } else {
            const id = nextId; setNextId(id + 1);
            setLenders(prev => [...prev, { id, added: today, promotions: [], ...data }]);
            showToast('Lender added');
        }
        resetForm();
    }

    function deleteLender(id: number) {
        setLenders(prev => prev.filter(l => l.id !== id));
        if (editId === id) resetForm();
        if (expandedId === id) setExpandedId(null);
        showToast('Lender deleted');
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

    // --- promotions ---
    function resetPromoForm() {
        setEditingPromo(null); setPromoLenderId(''); setPromoName(''); setPromoOffer(''); setPromoExpiry(''); setPromoDoc('');
    }

    function savePromotion() {
        if (!promoLenderId || !promoName.trim()) { showToast('Select a lender and enter promotion name'); return; }
        const lid = parseInt(promoLenderId);
        const p: Promotion = { name: promoName, commission: '', offer: promoOffer, expiry: promoExpiry, document: promoDoc };
        if (editingPromo) {
            setLenders(prev => prev.map(l => l.id === editingPromo.lenderId
                ? { ...l, promotions: l.promotions.map((pr, i) => i === editingPromo.pIndex ? p : pr) }
                : l));
            showToast('Promotion updated');
        } else {
            setLenders(prev => prev.map(l => l.id === lid ? { ...l, promotions: [...l.promotions, p] } : l));
            showToast('Promotion added');
        }
        resetPromoForm(); setPromoPreview(null);
    }

    function deletePromotion(lenderId: number, pIndex: number) {
        setLenders(prev => prev.map(l => l.id === lenderId ? { ...l, promotions: l.promotions.filter((_, i) => i !== pIndex) } : l));
        setPromoPreview(null); showToast('Promotion deleted');
    }

    // --- send application ---
    function openSendApp(lenderId: number) {
        const l = lenders.find(x => x.id === lenderId);
        if (!l) return;
        setSaLenders([l]); setSaStep(1); setSaSelectedLead(null);
        setLeftTab('sendapp');
    }

    function onLenderDrop(e: React.DragEvent) {
        e.preventDefault(); setSaDropOver(false);
        if (!saSelectedLead) { showToast('Select a lead first'); return; }
        const id = dragLenderId.current;
        if (id === null) return;
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
            `Client: ${saSelectedLead.name} (${saSelectedLead.company})`,
            `Loan Ref: ${saSelectedLead.id} · ${saSelectedLead.amount} · ${saSelectedLead.type}`,
            '',
            `Lenders Selected (${saLenders.length}):`,
            ...saLenders.map((l, i) => `  ${i + 1}. ${l.name} — Rate: ${l.rateMin}%–${l.rateMax}% | Loan: ${fmt$(l.loanMin)}–${fmt$(l.loanMax)}`),
            '',
            saNote ? `Note: ${saNote}` : '',
        ].filter(l => l !== undefined);
        setSaPreview(lines.join('\n'));
    }

    // --- export CSV ---
    function exportCSV() {
        const rows = [['ID', 'Name', 'Trading', 'Type', 'Status', 'Email', 'Manager', 'Rate Min', 'Rate Max', 'Loan Min', 'Loan Max', 'Categories', 'Added']];
        lenders.forEach(l => rows.push([String(l.id), l.name, l.trading, l.type, l.status, l.email, l.manager, String(l.rateMin), String(l.rateMax), String(l.loanMin), String(l.loanMax), l.categories.join('; '), l.added]));
        const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'lenders.csv'; a.click();
    }

    // --- promotions database (right panel) ---
    const allPromos: { lender: Lender; pIndex: number; p: Promotion }[] = [];
    lenders.forEach(l => l.promotions.forEach((p, i) => allPromos.push({ lender: l, pIndex: i, p })));
    const filteredPromos = allPromos.filter(item => {
        if (promoFilterLender !== 'All' && item.lender.name !== promoFilterLender) return false;
        if (promoSearch) {
            const hay = (item.lender.name + ' ' + item.p.name + ' ' + item.p.offer).toLowerCase();
            if (!hay.includes(promoSearch.toLowerCase())) return false;
        }
        return true;
    });

    const saLeads = SEND_APP_LEADS.filter(l => !saLeadSearch || (l.name + l.company + l.id).toLowerCase().includes(saLeadSearch.toLowerCase()));

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {toast && <Toast msg={toast} onDone={() => setToast('')} />}

            {/* Doc Viewer Modal */}
            {docViewer && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.9)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: 800, maxHeight: '90vh', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 32, height: 32, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}><i className="fa-solid fa-file-pdf" /></div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111827', textTransform: 'uppercase' }}>{docViewer.filename}</p>
                                    <p style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Promotion Reference Document</p>
                                </div>
                            </div>
                            <button onClick={() => setDocViewer(null)} style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14 }}><i className="fa-solid fa-xmark" /></button>
                        </div>
                        <div style={{ flex: 1, background: '#f1f5f9', padding: 32, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ background: '#fff', width: '100%', maxWidth: 680, boxShadow: '0 4px 24px rgba(0,0,0,.1)', padding: 48, minHeight: 800, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, overflow: 'hidden' }}>
                                    <div style={{ background: '#4f46e5', color: '#fff', fontSize: 8, fontWeight: 700, textAlign: 'center', padding: '4px 0', transform: 'rotate(45deg) translate(28px, 18px)', width: '200%', textTransform: 'uppercase', letterSpacing: '.05em' }}>Official Offer</div>
                                </div>
                                <div style={{ borderBottom: '4px solid #4f46e5', paddingBottom: 24, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.02em' }}>WHITEROCK <span style={{ color: '#e2e8f0' }}>|</span> <span style={{ color: '#111827', fontSize: 16, textTransform: 'uppercase', letterSpacing: '.05em' }}>Lender Promo</span></div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em' }}>Issued: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                </div>
                                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 4 }}>{docViewer.title.toUpperCase()}</h1>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 24 }}>{docViewer.lender.toUpperCase()}</p>
                                <div style={{ background: '#f8fafc', borderLeft: '4px solid #4f46e5', padding: 20, marginBottom: 24 }}>
                                    <p style={{ fontSize: 9, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Promotion Summary</p>
                                    <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>"{docViewer.offer}"</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                    <div>
                                        <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginBottom: 12 }}>Terms & Conditions</h4>
                                        <ul style={{ fontSize: 10, color: '#6b7280', listStyle: 'disc', paddingLeft: 16, lineHeight: 1.8 }}>
                                            <li>Minimum loan amount applies.</li>
                                            <li>Available to accredited brokers only.</li>
                                            <li>Applicable to eligible loan products.</li>
                                            <li>Lender reserves right to withdraw offer.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginBottom: 12 }}>Eligibility</h4>
                                        <p style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>Exclusively available through accredited Whiterock partners. Electronic submission via CRM is required.</p>
                                        <div style={{ padding: 16, background: '#eff6ff', borderRadius: 12 }}>
                                            <p style={{ fontSize: 8, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: 4 }}>Valid Until</p>
                                            <p style={{ fontSize: 18, fontWeight: 900, color: '#1e1b4b' }}>{docViewer.expiry.toUpperCase() || 'ONGOING'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 60, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', opacity: .4 }}>
                                    <p style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Ref: WR-LENDER-PROMO-2026</p>
                                    <p style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Whiterock CRM Ecosystem<br />Authorized Electronic Document</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3-column dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr 300px', gap: 12, height: '100vh', padding: 12, flex: 1, minWidth: 0 }}>

                {/* ===== LEFT PANEL ===== */}
                <section style={s.panelCard}>
                    {/* Header */}
                    <div style={{ padding: '0 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 }}>
                        <div>
                            <h2 style={{ fontSize: 9, fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '.08em' }}>{editId !== null ? 'Edit Lender' : 'Add New Lender'}</h2>
                            {editId !== null && <p style={{ fontSize: 8, color: '#d97706', fontWeight: 600 }}>Editing — {lenders.find(l => l.id === editId)?.name}</p>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {editId !== null && (
                                <button onClick={resetForm} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 8, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', background: '#fff' }}>
                                    <i className="fa-solid fa-xmark" style={{ fontSize: 7 }} /> Cancel
                                </button>
                            )}
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: editId !== null ? '#22c55e' : '#94a3b8' }} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: 'rgba(249,250,251,.5)' }}>
                        {(['lender', 'promotions', 'sendapp'] as const).map(tab => (
                            <button key={tab} onClick={() => setLeftTab(tab)} style={{ ...s.tabBtn, ...(leftTab === tab ? s.tabBtnActive : {}) }}>
                                {tab === 'lender' ? 'Lender Info' : tab === 'promotions' ? 'Promotions' : 'Send Application'}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>

                        {/* === LENDER INFO TAB === */}
                        {leftTab === 'lender' && (
                            <div style={{ padding: 16 }}>
                                {/* Identity */}
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

                                {/* Rates & Loan */}
                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-percent" style={{ fontSize: 8 }} /> Rates & Loan Range</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div><span style={s.labelText}>Rate Min (%)</span><input type="number" value={fRateMin} onChange={e => setFRateMin(e.target.value)} placeholder="e.g. 5.74" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Rate Max (%)</span><input type="number" value={fRateMax} onChange={e => setFRateMax(e.target.value)} placeholder="e.g. 9.49" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Loan Min ($)</span><input type="number" value={fLoanMin} onChange={e => setFLoanMin(e.target.value)} placeholder="e.g. 20000" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Loan Max ($)</span><input type="number" value={fLoanMax} onChange={e => setFLoanMax(e.target.value)} placeholder="e.g. 5000000" style={s.inputCompact} /></div>
                                    </div>
                                </div>

                                {/* Contact */}
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

                                {/* Address */}
                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-location-dot" style={{ fontSize: 8 }} /> Address</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div><span style={s.labelText}>Trading Address</span><input value={fAddress} onChange={e => setFAddress(e.target.value)} placeholder="123 Main St, Sydney NSW 2000" style={s.inputCompact} /></div>
                                        <div><span style={s.labelText}>Registered Address</span><input value={fRegAddress} onChange={e => setFRegAddress(e.target.value)} placeholder="Same as trading or different..." style={s.inputCompact} /></div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div style={s.formSec}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-tags" style={{ fontSize: 8 }} /> Categories</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                        {formCats.map(cat => {
                                            const isSel = selCats.includes(cat);
                                            const isCustom = !PRESET_CATS.includes(cat);
                                            return (
                                                <span key={cat} onClick={() => toggleCat(cat)} style={{ ...s.catTag, ...(isSel ? s.catTagSel : {}) }}>
                                                    {cat}
                                                    {isCustom && <i className="fa-solid fa-xmark" style={{ fontSize: 7, opacity: .7 }} onClick={e => { e.stopPropagation(); setFormCats(p => p.filter(c => c !== cat)); setSelCats(p => p.filter(c => c !== cat)); }} />}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <input value={catInput} onChange={e => setCatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomCat())} placeholder="Add custom category..." style={{ ...s.inputCompact, flex: 1, fontSize: 9 }} />
                                        <button onClick={addCustomCat} style={{ padding: '6px 12px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 9, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}><i className="fa-solid fa-plus" /></button>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div style={s.formSec}>
                                    <span style={s.labelText}>Notes</span>
                                    <textarea rows={3} value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Internal notes..." style={{ ...s.inputCompact, resize: 'none' }} />
                                </div>

                                <div style={{ paddingTop: 12 }}>
                                    <button onClick={saveForm} style={{ width: '100%', padding: '10px 0', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />{editId !== null ? 'Update Lender' : 'Add Lender'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* === PROMOTIONS TAB === */}
                        {leftTab === 'promotions' && (
                            <div>
                                {/* Promo Preview */}
                                {promoPreview && (
                                    <div style={{ padding: 16, background: '#0f172a', color: '#fff', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <h3 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b' }}>Promotion Details</h3>
                                            <button onClick={() => setPromoPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14 }}><i className="fa-solid fa-xmark" /></button>
                                        </div>
                                        <p style={{ fontSize: 8, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{promoPreview.lender.name}</p>
                                        <p style={{ fontSize: 14, fontWeight: 900, marginBottom: 12 }}>{promoPreview.lender.promotions[promoPreview.pIndex]?.name}</p>
                                        <div style={{ marginBottom: 12 }}>
                                            <span style={{ ...s.labelText, color: '#475569' }}>Offer Detail</span>
                                            <p style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>{promoPreview.lender.promotions[promoPreview.pIndex]?.offer}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 12, marginBottom: 12 }}>
                                            <div>
                                                <span style={{ ...s.labelText, color: '#475569' }}>Expiry Date</span>
                                                <p style={{ fontSize: 10, fontWeight: 700, color: '#cbd5e1' }}>{promoPreview.lender.promotions[promoPreview.pIndex]?.expiry || 'No Expiry'}</p>
                                            </div>
                                            {promoPreview.lender.promotions[promoPreview.pIndex]?.document && (
                                                <button onClick={() => { const p = promoPreview.lender.promotions[promoPreview.pIndex]; setDocViewer({ filename: p.document, title: p.name, lender: promoPreview.lender.name, offer: p.offer, expiry: p.expiry }); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#1e293b', border: '1px solid rgba(255,255,255,.05)', borderRadius: 8, color: '#fff', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
                                                    <i className="fa-solid fa-file-pdf" /> View Doc
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => { const pv = promoPreview; setPromoLenderId(String(pv.lender.id)); const p = pv.lender.promotions[pv.pIndex]; setPromoName(p.name); setPromoOffer(p.offer); setPromoExpiry(p.expiry); setPromoDoc(p.document); setEditingPromo({ lenderId: pv.lender.id, pIndex: pv.pIndex }); setPromoPreview(null); }} style={{ flex: 1, padding: '6px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => { if (confirm('Delete this promotion?')) deletePromotion(promoPreview.lender.id, promoPreview.pIndex); }} style={{ flex: 1, padding: '6px 0', background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                )}

                                {/* Promo Form */}
                                <div style={{ padding: 16, background: 'rgba(249,250,251,.5)', borderBottom: '1px solid #f1f5f9' }}>
                                    <p style={s.formSecTitle}><i className="fa-solid fa-bullhorn" style={{ fontSize: 8 }} /> {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div>
                                            <span style={s.labelText}>Lender *</span>
                                            <select value={promoLenderId} onChange={e => setPromoLenderId(e.target.value)} style={{ ...s.inputCompact, background: '#fff' }}>
                                                <option value="">— Select Lender —</option>
                                                {lenders.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <span style={s.labelText}>Promotion Name</span>
                                            <input value={promoName} onChange={e => setPromoName(e.target.value)} placeholder="e.g. Q3 Cashback" style={{ ...s.inputCompact, background: '#fff' }} />
                                        </div>
                                        <div>
                                            <span style={s.labelText}>Offer Details</span>
                                            <textarea rows={2} value={promoOffer} onChange={e => setPromoOffer(e.target.value)} placeholder="Describe the offer..." style={{ ...s.inputCompact, background: '#fff', resize: 'none' }} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            <div>
                                                <span style={s.labelText}>Expiry Date</span>
                                                <input type="date" value={promoExpiry} onChange={e => setPromoExpiry(e.target.value)} style={{ ...s.inputCompact, background: '#fff' }} />
                                            </div>
                                            <div>
                                                <span style={s.labelText}>Document Name</span>
                                                <input value={promoDoc} onChange={e => setPromoDoc(e.target.value)} placeholder="e.g. TC_ANZ.pdf" style={{ ...s.inputCompact, background: '#fff' }} />
                                            </div>
                                        </div>
                                        <button onClick={savePromotion} style={{ width: '100%', padding: '10px 0', background: '#374151', color: '#fff', border: 'none', borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer' }}>
                                            {editingPromo ? 'Update Promotion' : 'Add Promotion'}
                                        </button>
                                        {editingPromo && <button onClick={resetPromoForm} style={{ width: '100%', padding: '6px 0', background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 9, fontWeight: 700, color: '#6b7280', cursor: 'pointer' }}>Cancel Edit</button>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === SEND APPLICATION TAB === */}
                        {leftTab === 'sendapp' && (
                            <div>
                                {/* Step 1 */}
                                {saStep === 1 && (
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <div>
                                                <p style={{ fontSize: 10, fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: '.06em' }}>Step 1: Select Lead</p>
                                                <p style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 2 }}>Approved documentation leads</p>
                                            </div>
                                            <input value={saLeadSearch} onChange={e => setSaLeadSearch(e.target.value)} placeholder="Search..." style={{ ...s.inputCompact, width: 120, fontSize: 9 }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {saLeads.map(lead => (
                                                <div key={lead.id} onClick={() => { setSaSelectedLead(lead); setSaStep(2); setSaLenders([]); }} style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff', transition: 'all .1s' }} onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')} onMouseOut={e => (e.currentTarget.style.background = '#fff')}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <p style={{ fontSize: 10, fontWeight: 800, color: '#111827' }}>{lead.name}</p>
                                                            <p style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em' }}>{lead.company} · {lead.type}</p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a' }}>{lead.amount}</p>
                                                            <p style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>{lead.id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2 */}
                                {saStep === 2 && saSelectedLead && (
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                                            <button onClick={() => setSaStep(1)} style={{ fontSize: 8, fontWeight: 700, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em', display: 'flex', alignItems: 'center', gap: 6 }}><i className="fa-solid fa-arrow-left" /> Change Lead</button>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 11, fontWeight: 900, color: '#111827' }}>{saSelectedLead.name.toUpperCase()}</p>
                                                <p style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>{saSelectedLead.id} · {saSelectedLead.amount}</p>
                                            </div>
                                        </div>

                                        <p style={{ fontSize: 8, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Step 2: Select Lenders (Max 4)</p>
                                        <div
                                            onDragOver={e => { e.preventDefault(); setSaDropOver(true); }}
                                            onDragLeave={() => setSaDropOver(false)}
                                            onDrop={onLenderDrop}
                                            style={{ ...s.dropZone, borderColor: saDropOver ? '#6366f1' : '#e2e8f0', background: saDropOver ? '#eff6ff' : '#fafafa' }}
                                        >
                                            <i className="fa-solid fa-building-columns" style={{ fontSize: 20, color: '#cbd5e1', display: 'block', marginBottom: 6 }} />
                                            <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Drag lenders from table here</p>
                                            <p style={{ fontSize: 8, color: '#cbd5e1', marginTop: 4 }}>Selection: <span style={{ color: '#6366f1', fontWeight: 800 }}>{saLenders.length} / 4</span></p>
                                        </div>

                                        {saLenders.length > 0 && (
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                    <p style={{ fontSize: 8, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em' }}>Current Selection</p>
                                                    <button onClick={() => setSaLenders([])} style={{ fontSize: 7, fontWeight: 800, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Clear All</button>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {saLenders.map(l => (
                                                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div style={{ width: 24, height: 24, borderRadius: 6, background: iconColor(l.type), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 900 }}>{initials(l.name)}</div>
                                                                <div>
                                                                    <p style={{ fontSize: 9, fontWeight: 800, color: '#111827' }}>{l.name}</p>
                                                                    <p style={{ fontSize: 7, color: '#94a3b8', textTransform: 'uppercase' }}>{l.rateMin}%–{l.rateMax}%</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => setSaLenders(p => p.filter(x => x.id !== l.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}><i className="fa-solid fa-xmark" /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ marginBottom: 12 }}>
                                            <span style={s.labelText}>Final Submission Note</span>
                                            <textarea rows={3} value={saNote} onChange={e => setSaNote(e.target.value)} placeholder="e.g. Pitched ANZ for 72 months..." style={{ ...s.inputCompact, resize: 'none', background: 'rgba(249,250,251,.5)' }} />
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
                                            <button onClick={buildPreview} style={{ flex: 1, padding: '10px 0', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-eye" style={{ marginRight: 6 }} />Preview
                                            </button>
                                            <button onClick={() => { buildPreview(); showToast('Application copied to clipboard'); }} style={{ flex: 1, padding: '10px 0', background: '#d97706', color: '#fff', border: 'none', borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-paper-plane" style={{ marginRight: 6 }} />Send / Copy
                                            </button>
                                        </div>

                                        {saPreview && (
                                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: '#94a3b8' }}>Application Preview</span>
                                                    <button onClick={() => setSaPreview('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}><i className="fa-solid fa-xmark" /></button>
                                                </div>
                                                <pre style={{ fontSize: 9, fontFamily: "'Inter', sans-serif", color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{saPreview}</pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== MIDDLE PANEL (Table) ===== */}
                <section style={s.panelCard}>
                    {/* Dark header */}
                    <div style={{ padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: '#111827', display: 'flex', alignItems: 'center', gap: 12, minHeight: 48 }}>
                        <h2 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#fff', flexShrink: 0 }}>Lender Database</h2>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#4b5563', fontFamily: 'monospace', flexShrink: 0 }}>{filtered.length !== lenders.length ? `(${filtered.length} of ${lenders.length})` : ''}</span>
                        <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lenders..." style={{ width: '100%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, padding: '5px 10px 5px 26px', fontSize: 9, fontWeight: 600, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 8, color: 'rgba(255,255,255,.3)' }} />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, padding: '5px 22px 5px 9px', fontSize: 9, fontWeight: 700, color: '#d1d5db', outline: 'none', cursor: 'pointer', flexShrink: 0 }}>
                            <option value="All">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,.1)', paddingLeft: 12, marginLeft: 4, gap: 0, flexShrink: 0 }}>
                            {[{ val: lenders.length, label: 'Total', color: '#fff' }, { val: lenders.filter(l => l.status === 'Active').length, label: 'Active', color: '#4ade80' }, { val: lenders.filter(l => l.status === 'Inactive').length, label: 'Inactive', color: '#f87171' }].map(({ val, label, color }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRight: label !== 'Inactive' ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                                    <span style={{ fontSize: 13, fontWeight: 900, color }}>{val}</span>
                                    <span style={{ fontSize: 7, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#f9fafb', borderBottom: '1px solid #f1f5f9', zIndex: 10 }}>
                                <tr>
                                    {['Lender', 'Account Manager', 'Categories', 'Status', ''].map(h => (
                                        <th key={h} style={{ padding: '6px 12px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: 10, fontWeight: 700 }}>No lenders match your filters</td></tr>
                                ) : filtered.map(l => (
                                    <React.Fragment key={l.id}>
                                        <tr
                                            id={`row-${l.id}`}
                                            onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                                            draggable
                                            onDragStart={e => { dragLenderId.current = l.id; e.dataTransfer.effectAllowed = 'copy'; }}
                                            style={{ cursor: 'grab', background: expandedId === l.id ? '#f8fafc' : '#fff', borderBottom: '1px solid #f9fafb', transition: 'background .1s' }}
                                            onMouseOver={e => { if (expandedId !== l.id) e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseOut={e => { if (expandedId !== l.id) e.currentTarget.style.background = '#fff'; }}
                                        >
                                            <td style={{ padding: '8px 12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: iconColor(l.type), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 900, flexShrink: 0 }}>{initials(l.name)}</div>
                                                    <div>
                                                        <p style={{ fontSize: 10, fontWeight: 700, color: '#111827' }}>{l.name}</p>
                                                        <p style={{ fontSize: 7, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.03em' }}>{l.trading}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                {l.manager ? <>
                                                    <p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937' }}>{l.manager}</p>
                                                    <p style={{ fontSize: 7, color: '#9ca3af', marginTop: 2, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.managerEmail}</p>
                                                </> : <span style={{ fontSize: 9, color: '#d1d5db' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                    {l.categories.slice(0, 2).map(c => <span key={c} style={s.categoryChip}>{c}</span>)}
                                                    {l.categories.length > 2 && <span style={{ ...s.categoryChip, color: '#9ca3af' }}>+{l.categories.length - 2}</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <span style={{ ...s.badge, background: l.status === 'Active' ? '#f1f5f9' : '#f1f5f9', color: l.status === 'Active' ? '#0f172a' : '#94a3b8', border: l.status === 'Active' ? '1px solid #e2e8f0' : 'none' }}>
                                                    <i className={`fa-solid ${l.status === 'Active' ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ marginRight: 4, fontSize: 7 }} />{l.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                                                <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: '#d1d5db', transition: 'transform .2s', transform: expandedId === l.id ? 'rotate(90deg)' : 'none' }} />
                                            </td>
                                        </tr>
                                        {expandedId === l.id && (
                                            <tr>
                                                <td colSpan={5} style={{ padding: 0 }}>
                                                    <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', padding: '16px 24px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                                                            {/* Identity */}
                                                            <div>
                                                                <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-building-columns" style={{ marginRight: 4 }} />Identity</p>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                                    {l.trading && <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Trading As</p><p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937' }}>{l.trading}</p></div>}
                                                                    {l.tradingYears ? <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Trading Years</p><p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937' }}>{l.tradingYears} yrs</p></div> : null}
                                                                    <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Rate Range</p><p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937' }}>{l.rateMin}% – {l.rateMax}%</p></div>
                                                                    <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Loan Range</p><p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937' }}>{fmt$(l.loanMin)} – {fmt$(l.loanMax)}</p></div>
                                                                </div>
                                                            </div>
                                                            {/* Contact */}
                                                            <div>
                                                                <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-envelope" style={{ marginRight: 4 }} />Contact</p>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                                    {l.email && <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Lender Email</p><a href={`mailto:${l.email}`} onClick={e => e.stopPropagation()} style={{ fontSize: 9, fontWeight: 600, color: '#2563eb', textDecoration: 'none', wordBreak: 'break-all' }}>{l.email}</a></div>}
                                                                    {l.manager && <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Account Manager</p><p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937' }}>{l.manager}</p></div>}
                                                                    {l.managerEmail && <div><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Manager Email</p><a href={`mailto:${l.managerEmail}`} onClick={e => e.stopPropagation()} style={{ fontSize: 9, fontWeight: 600, color: '#2563eb', textDecoration: 'none', wordBreak: 'break-all' }}>{l.managerEmail}</a></div>}
                                                                </div>
                                                            </div>
                                                            {/* Address + actions */}
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <div>
                                                                    <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-location-dot" style={{ marginRight: 4 }} />Address</p>
                                                                    {l.address && <div style={{ marginBottom: 6 }}><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Trading</p><p style={{ fontSize: 9, fontWeight: 600, color: '#374151', lineHeight: 1.4 }}>{l.address}</p></div>}
                                                                    {l.regAddress && <div style={{ marginBottom: 10 }}><p style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Registered</p><p style={{ fontSize: 9, color: l.regAddress === l.address ? '#9ca3af' : '#374151', fontWeight: 600, lineHeight: 1.4 }}>{l.regAddress === l.address ? 'Same as trading' : l.regAddress}</p></div>}
                                                                    <p style={{ ...s.labelText, marginBottom: 6 }}><i className="fa-solid fa-tags" style={{ marginRight: 4 }} />Categories</p>
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>{l.categories.map(c => <span key={c} style={s.categoryChip}>{c}</span>)}</div>
                                                                    {l.notes && <p style={{ fontSize: 8, color: '#9ca3af', lineHeight: 1.5 }}>{l.notes}</p>}
                                                                </div>
                                                                <div>
                                                                    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                                                                        <button onClick={e => { e.stopPropagation(); openSendApp(l.id); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: '#4f46e5', color: '#fff', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                                            <i className="fa-solid fa-paper-plane" style={{ fontSize: 7 }} />Send App
                                                                        </button>
                                                                        <button onClick={e => { e.stopPropagation(); loadEditForm(l.id); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: '#111827', color: '#fff', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                                            <i className="fa-solid fa-pen" style={{ fontSize: 7 }} />Edit
                                                                        </button>
                                                                        <button onClick={e => { e.stopPropagation(); if (confirm(`Delete ${l.name}?`)) deleteLender(l.id); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: '#fff', color: '#f87171', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', border: '1px solid #fecaca', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                                            <i className="fa-solid fa-trash" style={{ fontSize: 7 }} />Delete
                                                                        </button>
                                                                    </div>
                                                                    <p style={{ fontSize: 7, color: '#d1d5db', fontFamily: 'monospace', marginTop: 4 }}>Added {l.added} · ID #{String(l.id).padStart(3, '0')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Promotions in expand */}
                                                        {l.promotions.length > 0 && (
                                                            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                                                                <p style={{ ...s.labelText, marginBottom: 8 }}><i className="fa-solid fa-bullhorn" style={{ marginRight: 4 }} />Promotions</p>
                                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                                                                    {l.promotions.map((p, i) => {
                                                                        const expired = p.expiry && p.expiry < today;
                                                                        return (
                                                                            <div key={i} style={{ background: '#fff', border: `1px solid ${expired ? '#fecaca' : '#e2e8f0'}`, borderRadius: 8, padding: 8 }}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 3 }}>
                                                                                    <p style={{ fontSize: 9, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{p.name}</p>
                                                                                    <span style={{ background: expired ? '#ef4444' : '#64748b', color: '#fff', padding: '1px 5px', borderRadius: 4, fontSize: 7, fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>{expired ? 'EXPIRED' : 'ACTIVE'}</span>
                                                                                </div>
                                                                                <p style={{ fontSize: 8, color: '#475569', lineHeight: 1.3, marginBottom: 4 }}>{p.offer}</p>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 7, fontWeight: 700, color: expired ? '#ef4444' : '#94a3b8', textTransform: 'uppercase' }}>
                                                                                    <span><i className="fa-solid fa-calendar-days" style={{ marginRight: 2 }} />{p.expiry || 'No Expiry'}</span>
                                                                                    {p.document && <span><i className="fa-solid fa-file" style={{ marginRight: 2 }} />{p.document}</span>}
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

                    {/* Table footer */}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #f9fafb', background: 'rgba(249,250,251,.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>Showing {filtered.length} lender{filtered.length !== 1 ? 's' : ''}</span>
                        <button onClick={exportCSV} style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="fa-solid fa-download" /> Export CSV
                        </button>
                    </div>
                </section>

                {/* ===== RIGHT PANEL (Promotions DB) ===== */}
                <section style={s.panelCard}>
                    <div style={{ padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: '#1e293b', display: 'flex', alignItems: 'center', gap: 8, minHeight: 48 }}>
                        <i className="fa-solid fa-bullhorn" style={{ fontSize: 11, color: '#64748b' }} />
                        <h2 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#fff', flex: 1 }}>Active Promotions</h2>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>{filteredPromos.length}</span>
                    </div>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input value={promoSearch} onChange={e => setPromoSearch(e.target.value)} placeholder="Search promotions..." style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 7, padding: '5px 10px 5px 24px', fontSize: 9, fontWeight: 600, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 8, color: '#d1d5db' }} />
                        </div>
                        <select value={promoFilterLender} onChange={e => setPromoFilterLender(e.target.value)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 7, padding: '5px 22px 5px 8px', fontSize: 9, fontWeight: 700, color: '#374151', outline: 'none', cursor: 'pointer', flexShrink: 0 }}>
                            <option value="All">All Lenders</option>
                            {lenders.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                        {filteredPromos.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
                                <i className="fa-solid fa-bullhorn" style={{ fontSize: 24, color: '#e2e8f0', marginBottom: 8 }} />
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>No promotions found</p>
                            </div>
                        ) : filteredPromos.map(({ lender, pIndex, p }) => {
                            const expired = p.expiry && p.expiry < today;
                            return (
                                <div key={`${lender.id}-${pIndex}`}
                                    onClick={() => setPromoPreview({ lender, pIndex })}
                                    style={{ ...s.promoCard, border: `1px solid ${expired ? '#fecaca' : '#e2e8f0'}` }}
                                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                                        <div>
                                            <p style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', marginBottom: 1 }}>{p.name}</p>
                                            <p style={{ fontSize: 7, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em' }}>{lender.name}</p>
                                        </div>
                                        <span style={{ background: expired ? '#ef4444' : '#64748b', color: '#fff', padding: '2px 7px', borderRadius: 5, fontSize: 8, fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>{expired ? 'EXPIRED' : 'ACTIVE'}</span>
                                    </div>
                                    <p style={{ fontSize: 9, color: '#475569', lineHeight: 1.4, marginBottom: 6 }}>{p.offer}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 8, fontWeight: 700, color: expired ? '#ef4444' : '#94a3b8', textTransform: 'uppercase' }}>
                                        <span><i className="fa-solid fa-calendar-days" style={{ marginRight: 3 }} />{p.expiry || 'No Expiry'}</span>
                                        {p.document && <span><i className="fa-solid fa-file" style={{ marginRight: 2 }} />{p.document}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ padding: '8px 12px', borderTop: '1px solid #f9fafb', background: 'rgba(249,250,251,.5)' }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>{filteredPromos.length} promotion{filteredPromos.length !== 1 ? 's' : ''}</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
