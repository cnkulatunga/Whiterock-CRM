'use client';

import { useState, useEffect, useRef } from 'react';
import { vaultDocs as DOCS, fileIcons as FILE_ICONS, catColors as CAT_COLORS, notifications, Notification } from '@/data/dummy';

type Doc = { id: number; title: string; category: string; fileType: string; fileSize: string; version: string; uploaded: string; desc: string };

interface TopActionRowProps {
    designMode?: boolean;
    onToggleDesignMode?: () => void;
}

export default function TopActionRow({ designMode = false, onToggleDesignMode }: TopActionRowProps) {
    const [showNotifs, setShowNotifs] = useState(false);
    const [showCalc, setShowCalc] = useState(false);
    const [showDocs, setShowDocs] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
    const [docView, setDocView] = useState<'list' | 'detail'>('list');
    const [notifList, setNotifList] = useState<Notification[]>(notifications);
    const [calcInputs, setCalcInputs] = useState({ amount: 75000, term: 18, annual: '30', monthly: '', flat: '', factor: '', feePercent: '2', feeFixed: '' });
    const [calcResult, setCalcResult] = useState({ monthly: 0, principal: 0, fee: 0, interest: 0, total: 0, daily: 0, yieldRate: 0, factor: 0, flatRate: 0 });
    const [docSearch, setDocSearch] = useState('');
    const [docCat, setDocCat] = useState('');
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifList.filter(n => n.unread).length;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const a = Number(calcInputs.amount) || 0;
        const t = Number(calcInputs.term) || 1;
        let rate = 0;
        if (calcInputs.annual) rate = Number(calcInputs.annual) / 100 / 12;
        else if (calcInputs.monthly) rate = Number(calcInputs.monthly) / 100;
        else if (calcInputs.flat) rate = Number(calcInputs.flat) / 100;
        else if (calcInputs.factor) rate = Number(calcInputs.factor) - 1;
        const interest = a * rate * t;
        const feeAmt = calcInputs.feeFixed ? Number(calcInputs.feeFixed) : a * (Number(calcInputs.feePercent) / 100);
        const total = a + interest + feeAmt;
        const monthly = total / t;
        setCalcResult({ monthly, principal: a, fee: feeAmt, interest, total, daily: monthly / 30, yieldRate: a ? interest / a * 100 : 0, factor: a ? total / a : 0, flatRate: a && t ? (interest / a / t) * 100 : 0 });
    }, [calcInputs]);

    const fmt = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fmtPct = (n: number) => `${n.toFixed(2)}%`;
    const markAllRead = () => setNotifList(notifList.map(n => ({ ...n, unread: false })));
    const clearAll = () => setNotifList([]);

    const handleDocumentClick = (doc: Doc) => {
        setSelectedDoc(doc);
        setDocView('detail');
    };

    const handleBackToList = () => {
        setDocView('list');
        setSelectedDoc(null);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
    };

    const filteredDocs = DOCS.filter(d => {
        if (docCat && d.category !== docCat) return false;
        if (docSearch && !d.title.toLowerCase().includes(docSearch.toLowerCase()) && !d.category.toLowerCase().includes(docSearch.toLowerCase())) return false;
        return true;
    });

    return (
        <>
            {/* Top Bar */}
            <div className="flex items-center gap-2 px-6 pt-4 w-full shrink-0 min-h-[60px]">
                <div className="flex items-center gap-2 flex-nowrap flex-1 min-w-0 overflow-x-auto pb-2 custom-scrollbar">
                    <a href="/leads" className="glass-card p-2.5 flex items-center gap-3 hover:border-indigo-500/50 group transition-all min-w-[140px] cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0"><i className="fa-solid fa-users text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Leads</h4><p className="text-[10px] font-black text-slate-900 mt-1">1,284 <span className="text-[7px] text-emerald-500 ml-0.5">+12%</span></p></div>
                    </a>
                    <a href="https://teams.microsoft.com" target="_blank" rel="noreferrer" className="glass-card p-2.5 flex items-center gap-3 hover:border-indigo-400/50 group transition-all min-w-[130px] cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500 group-hover:bg-[#464EB8] group-hover:text-white transition-all shrink-0"><i className="fa-brands fa-microsoft text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Connect</h4><p className="text-[10px] font-black text-slate-900 mt-1">TEAMS</p></div>
                    </a>
                    <a href="https://web.whatsapp.com" target="_blank" rel="noreferrer" className="glass-card p-2.5 flex items-center gap-3 hover:border-emerald-400/50 group transition-all min-w-[130px] cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-500 group-hover:bg-[#25D366] group-hover:text-white transition-all shrink-0"><i className="fa-brands fa-whatsapp text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Chat</h4><p className="text-[10px] font-black text-slate-900 mt-1">WHATSAPP</p></div>
                    </a>
                    <a href="mailto:admin@whiterock.com" className="glass-card p-2.5 flex items-center gap-3 hover:border-blue-400/50 group transition-all min-w-[130px] cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sky-500 group-hover:bg-[#0EA5E9] group-hover:text-white transition-all shrink-0"><i className="fa-solid fa-envelope text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Official</h4><p className="text-[10px] font-black text-slate-900 mt-1">MAIL HUB</p></div>
                    </a>
                    <div onClick={() => { setShowCalc(true); setShowDocs(false); }} className="glass-card p-2.5 flex items-center gap-3 hover:border-amber-400/50 group transition-all min-w-[130px] cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-amber-500 group-hover:bg-[#fbbf24] group-hover:text-white transition-all shrink-0"><i className="fa-solid fa-calculator text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Utility</h4><p className="text-[10px] font-black text-slate-900 mt-1">CALCULATOR</p></div>
                    </div>
                    <div onClick={onToggleDesignMode} className={`glass-card p-2.5 flex items-center gap-3 hover:border-indigo-400/50 group transition-all min-w-[130px] cursor-pointer ${designMode ? 'border-indigo-500 bg-indigo-50/30' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${designMode ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-indigo-500 group-hover:bg-[#4f46e5] group-hover:text-white'}`}><i className="fa-solid fa-wand-magic-sparkles text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Layout</h4><p className="text-[10px] font-black text-slate-900 mt-1">{designMode ? 'SAVE LAYOUT' : 'DESIGN MODE'}</p></div>
                    </div>
                    <div onClick={() => { setShowDocs(true); setShowCalc(false); }} className="glass-card p-2.5 flex items-center gap-3 hover:border-indigo-400/50 group transition-all min-w-[130px] cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0"><i className="fa-solid fa-folder-open text-sm"></i></div>
                        <div className="truncate"><h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Docs</h4><p className="text-[10px] font-black text-slate-900 mt-1">UPLOAD</p></div>
                    </div>
                </div>

                {/* Notification Bell */}
                <div className="relative shrink-0 ml-2" ref={notifRef}>
                    <button onClick={() => setShowNotifs(!showNotifs)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all hover:-translate-y-0.5 relative">
                        <i className="fa-solid fa-bell text-slate-400 text-sm"></i>
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center px-1 border-2 border-white">{unreadCount}</span>}
                    </button>
                    {showNotifs && (
                        <div className="absolute top-[50px] right-0 w-[340px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[500] overflow-hidden">
                            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                                <div><div className="text-[11px] font-black text-slate-900">Notifications</div><div className="text-[8px] font-bold text-slate-400">{unreadCount} unread</div></div>
                                <button onClick={markAllRead} className="text-[8px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                                {notifList.map(n => (
                                    <div key={n.id} className={`p-3 border-b border-slate-50 flex items-start gap-3 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-indigo-50/30' : ''}`}>
                                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${n.color}`}><i className={`fa-solid ${n.icon} text-xs`}></i></div>
                                        <div className="flex-1"><div className="flex items-center justify-between"><span className="text-[9px] font-black text-slate-900">{n.title}</span><span className="text-[7px] text-slate-400">{n.time}</span></div><p className="text-[8px] text-slate-500 mt-0.5">{n.desc}</p></div>
                                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-slate-50 text-center"><button onClick={clearAll} className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Clear All</button></div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Calculator Drawer ── */}
            {showCalc && (
                <div className="fixed inset-0 z-[1100] flex justify-end overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setShowCalc(false)} />
                    <div className="relative w-full max-w-[520px] bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100 flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500"><i className="fa-solid fa-calculator text-lg"></i></div>
                                <div><h2 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Business Loan</h2><p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Calculator Hub</p></div>
                            </div>
                            <button onClick={() => setShowCalc(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-50/30">
                            <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Loan Amount (£)</label><input type="number" value={calcInputs.amount} onChange={e => setCalcInputs({ ...calcInputs, amount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[12px] font-black text-slate-900 focus:bg-white outline-none" /></div>
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Term (Months)</label><input type="number" value={calcInputs.term} onChange={e => setCalcInputs({ ...calcInputs, term: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[12px] font-black text-slate-900 focus:bg-white outline-none" /></div>
                                    <div className="col-span-2 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] pt-2 pb-0.5 border-t border-slate-100">Interest Rate Inputs</div>
                                    {(['Annual (%)|annual', 'Monthly (%)|monthly', 'Flat (%)|flat', 'Factor (Dec)|factor'] as string[]).map(s => { const [label, key] = s.split('|'); return (<div key={key} className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label><input type="number" step="0.01" value={(calcInputs as any)[key]} onChange={e => setCalcInputs({ ...calcInputs, [key]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[12px] font-black text-slate-900 focus:bg-white outline-none" /></div>); })}
                                    <div className="col-span-2 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] pt-2 pb-0.5 border-t border-slate-100">Arrangement Fees</div>
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Percentage (%)</label><input type="number" step="0.1" value={calcInputs.feePercent} onChange={e => setCalcInputs({ ...calcInputs, feePercent: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[12px] font-black text-slate-900 focus:bg-white outline-none" /></div>
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fixed Amount (£)</label><input type="number" step="1" value={calcInputs.feeFixed} onChange={e => setCalcInputs({ ...calcInputs, feeFixed: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[12px] font-black text-slate-900 focus:bg-white outline-none" /></div>
                                </div>
                                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-center mb-4"><span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Monthly Payment</span><span className="block text-2xl font-black text-emerald-600 mt-1">{fmt(calcResult.monthly)}</span></div>
                                    <div className="space-y-2">
                                        {[['Loan Principal', fmt(calcResult.principal)], ['Arrangement Fees', fmt(calcResult.fee)], ['Total Interest', fmt(calcResult.interest)]].map(([l, v]) => (<div key={l} className="flex justify-between items-center text-[10px] font-bold border-b border-dotted border-slate-200 pb-1.5"><span className="text-slate-400 uppercase tracking-tight">{l}</span><span className="text-slate-900">{v}</span></div>))}
                                        <div className="flex justify-between items-center text-[11px] font-black bg-indigo-50 text-indigo-700 p-2 rounded-lg"><span className="uppercase tracking-widest">Total Payable</span><span>{fmt(calcResult.total)}</span></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-200">
                                        {[['Daily:', fmt(calcResult.daily)], ['Yield:', fmtPct(calcResult.yieldRate)], ['Factor:', calcResult.factor.toFixed(4)], ['Flat:', fmtPct(calcResult.flatRate)]].map(([l, v]) => (<div key={l} className="flex justify-between items-center text-[9px] font-bold"><span className="text-slate-400 uppercase">{l}</span><span className="text-slate-900">{v}</span></div>))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Docs Drawer ── */}
            {showDocs && (
                <div className="fixed inset-0 z-[1100] flex justify-end overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => { setShowDocs(false); setDocView('list'); setSelectedDoc(null); }} />
                    <div className="relative w-full max-w-[500px] bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100 flex flex-col">

                        {/* Dark header */}
                        <div className="px-5 py-3.5 flex items-center justify-between shrink-0" style={{ background: docView === 'detail' && selectedDoc ? (CAT_COLORS[selectedDoc.category] || '#0f172a') : '#0f172a' }}>
                            <div className="flex items-center gap-2.5">
                                {docView === 'detail' && (
                                    <button
                                        onClick={handleBackToList}
                                        className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all mr-1"
                                    >
                                        <i className="fa-solid fa-arrow-left text-xs"></i>
                                    </button>
                                )}
                                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                                    {docView === 'detail' && selectedDoc ? (
                                        <i className={`${(FILE_ICONS[selectedDoc.fileType] || FILE_ICONS.pdf).icon} text-white text-sm`}></i>
                                    ) : (
                                        <i className="fa-solid fa-vault text-white text-sm"></i>
                                    )}
                                </div>
                                <div>
                                    <div className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
                                        {docView === 'detail' && selectedDoc ? selectedDoc.title : 'Document Vault'}
                                    </div>
                                    <div className="text-[8px] text-slate-300 mt-0.5">
                                        {docView === 'detail' && selectedDoc
                                            ? `${selectedDoc.category} • ${selectedDoc.fileType.toUpperCase()}`
                                            : `${filteredDocs.length} document${filteredDocs.length !== 1 ? 's' : ''}`
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {docView === 'detail' && selectedDoc && (
                                    <button
                                        onClick={() => console.log('Downloading:', selectedDoc.title)}
                                        className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all"
                                        title="Download"
                                    >
                                        <i className="fa-solid fa-download text-xs"></i>
                                    </button>
                                )}
                                <a href="/docs" className="text-[8px] font-black text-indigo-400 bg-indigo-500/15 px-2.5 py-1 rounded-md uppercase tracking-widest hover:bg-indigo-500/25 transition-all">Full View</a>
                                <button onClick={() => { setShowDocs(false); setDocView('list'); setSelectedDoc(null); }} className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"><i className="fa-solid fa-xmark text-xs"></i></button>
                            </div>
                        </div>

                        {/* Search + filter - only show in list view */}
                        {docView === 'list' && (
                            <div className="px-4 py-2.5 border-b border-slate-100 flex gap-2 items-center shrink-0 bg-slate-50">
                                <div className="relative flex-1">
                                    <input type="text" value={docSearch} onChange={e => setDocSearch(e.target.value)} placeholder="Search documents..."
                                        className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-[9px] font-semibold text-slate-800 outline-none focus:border-indigo-400" />
                                    <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px]"></i>
                                </div>
                                <select value={docCat} onChange={e => setDocCat(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[9px] font-bold text-slate-600 outline-none cursor-pointer">
                                    <option value="">All Categories</option>
                                    {['Knowledge Base', 'Guides', 'FAQs', 'Products', 'Policies', 'Scripts'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {docView === 'list' ? (
                                // Document List View
                                filteredDocs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                                        <i className="fa-solid fa-folder-open text-3xl text-slate-200 mb-3"></i>
                                        <div className="text-[10px] font-bold text-slate-400">No documents found</div>
                                    </div>
                                ) : filteredDocs.map(d => {
                                    const fi = FILE_ICONS[d.fileType] || { icon: 'fa-solid fa-file', bg: '#f1f5f9', color: '#475569' };
                                    const cc = CAT_COLORS[d.category] || '#475569';
                                    const date = formatDate(d.uploaded);
                                    return (
                                        <div
                                            key={d.id}
                                            className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer"
                                            onClick={() => handleDocumentClick(d)}
                                        >
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: fi.bg }}>
                                                <i className={`${fi.icon} text-sm`} style={{ color: fi.color }}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-black text-slate-900 truncate">{d.title}</div>
                                                <div className="text-[8px] text-slate-500 mt-0.5 truncate">{d.desc}</div>
                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                    <span className="text-[7px] font-black px-1.5 py-0.5 rounded-full" style={{ background: cc + '22', color: cc }}>{d.category}</span>
                                                    <span className="text-[7px] font-bold text-slate-400">{d.version}</span>
                                                    <span className="text-[7px] font-bold text-slate-400">{d.fileSize}</span>
                                                    <span className="text-[7px] font-bold text-slate-400 ml-auto">{date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                // Document Detail View
                                selectedDoc && (
                                    <div className="flex flex-col h-full">
                                        {/* Metadata strip */}
                                        <div className="grid grid-cols-4 gap-0 border-b border-slate-100 shrink-0">
                                            <div className="p-2 border-r border-slate-100">
                                                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</div>
                                                <div className="text-[9px] font-black text-slate-900 uppercase">{selectedDoc.fileType}</div>
                                            </div>
                                            <div className="p-2 border-r border-slate-100">
                                                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Size</div>
                                                <div className="text-[9px] font-black text-slate-900">{selectedDoc.fileSize}</div>
                                            </div>
                                            <div className="p-2 border-r border-slate-100">
                                                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Version</div>
                                                <div className="text-[9px] font-black text-slate-900">{selectedDoc.version}</div>
                                            </div>
                                            <div className="p-2">
                                                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Uploaded</div>
                                                <div className="text-[9px] font-black text-slate-900">{formatDate(selectedDoc.uploaded)}</div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="p-4 border-b border-slate-100 shrink-0">
                                            <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</div>
                                            <div className="text-[10px] font-medium text-slate-700 leading-relaxed">{selectedDoc.desc}</div>
                                        </div>

                                        {/* Document preview */}
                                        <div className="bg-slate-100 p-5 flex-1">
                                            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[400px] flex flex-col">
                                                {/* Document Header */}
                                                <div className="text-center mb-6">
                                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Alpha Funding CRM</div>
                                                    <h1 className="text-xl font-black text-slate-900 mb-2">{selectedDoc.title}</h1>
                                                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{selectedDoc.category} • {selectedDoc.version}</div>
                                                </div>

                                                {/* Document Content Preview */}
                                                <div className="flex-1">
                                                    {selectedDoc.category === 'Products' && (
                                                        <div className="space-y-4">
                                                            <div className="border-l-4 border-indigo-500 pl-4">
                                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overview</h3>
                                                                <p className="text-[10px] text-slate-600 leading-relaxed">Comprehensive guide covering all home loan products, rates, and eligibility criteria for 2026.</p>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Key Rates & Features</h3>
                                                                <ul className="space-y-2 text-[9px] text-slate-600">
                                                                    <li>• Competitive variable rate from 5.99% p.a.</li>
                                                                    <li>• Maximum LVR 90% with LMI</li>
                                                                    <li>• Minimum loan amount £50,000</li>
                                                                    <li>• Fast-track approval available</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedDoc.category === 'Policies' && (
                                                        <div className="space-y-4">
                                                            <div className="border-l-4 border-red-500 pl-4">
                                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Policy Overview</h3>
                                                                <p className="text-[10px] text-slate-600 leading-relaxed">Updated anti-money laundering and know-your-customer policy document aligned with AUSTRAC 2026 guidelines.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedDoc.category === 'Scripts' && (
                                                        <div className="space-y-4">
                                                            <div className="border-l-4 border-slate-500 pl-4">
                                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Script Guidelines</h3>
                                                                <p className="text-[10px] text-slate-600 leading-relaxed">Structured outbound call script for refinance lead conversations.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!['Products', 'Policies', 'Scripts'].includes(selectedDoc.category) && (
                                                        <div className="border-l-4 border-indigo-500 pl-4">
                                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Document Content</h3>
                                                            <p className="text-[10px] text-slate-600 leading-relaxed">{selectedDoc.desc}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 shrink-0">
                                            <button
                                                onClick={() => console.log('Sharing:', selectedDoc.title)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 border border-slate-200 rounded-lg text-[8px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-all"
                                            >
                                                <i className="fa-solid fa-share-nodes text-indigo-600"></i> Share
                                            </button>
                                            <button
                                                onClick={() => console.log('Printing:', selectedDoc.title)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 border border-slate-200 rounded-lg text-[8px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-all"
                                            >
                                                <i className="fa-solid fa-print text-sky-500"></i> Print
                                            </button>
                                            <button
                                                onClick={() => console.log('Downloading:', selectedDoc.title)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 rounded-lg text-[8px] font-black text-white uppercase tracking-widest hover:bg-black transition-all"
                                            >
                                                <i className="fa-solid fa-download"></i> Download
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
