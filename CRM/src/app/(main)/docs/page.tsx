'use client';

import { useState, useRef } from 'react';

// ── Types & Constants ─────────────────────────────────────────────────────────

interface Doc {
    id: number;
    title: string;
    category: string;
    status: string;
    version: string;
    filename: string;
    fileType: string;
    fileSize: string;
    desc: string;
    uploaded: string;
}

const PRESET_CATS = ['Knowledge Base', 'Guides', 'FAQs', 'Products', 'Policies', 'Scripts'];

const CAT_STYLE: Record<string, { icon: string; bg: string; color: string }> = {
    'Knowledge Base': { icon: 'fa-solid fa-book-open',      bg: '#dbeafe', color: '#1d4ed8' },
    'Guides':         { icon: 'fa-solid fa-map',             bg: '#f3e8ff', color: '#7e22ce' },
    'FAQs':           { icon: 'fa-solid fa-circle-question', bg: '#fef3c7', color: '#b45309' },
    'Products':       { icon: 'fa-solid fa-box',             bg: '#d1fae5', color: '#065f46' },
    'Policies':       { icon: 'fa-solid fa-shield-halved',   bg: '#fee2e2', color: '#b91c1c' },
    'Scripts':        { icon: 'fa-solid fa-terminal',        bg: '#f1f5f9', color: '#334155' },
    '_custom':        { icon: 'fa-solid fa-tag',             bg: '#fdf4ff', color: '#86198f' },
};

const FILE_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
    pdf:  { icon: 'fa-solid fa-file-pdf',        bg: '#fee2e2', color: '#dc2626' },
    docx: { icon: 'fa-solid fa-file-word',        bg: '#dbeafe', color: '#1d4ed8' },
    doc:  { icon: 'fa-solid fa-file-word',        bg: '#dbeafe', color: '#1d4ed8' },
    xlsx: { icon: 'fa-solid fa-file-excel',       bg: '#d1fae5', color: '#059669' },
    xls:  { icon: 'fa-solid fa-file-excel',       bg: '#d1fae5', color: '#059669' },
    png:  { icon: 'fa-solid fa-file-image',       bg: '#f3e8ff', color: '#7e22ce' },
    jpg:  { icon: 'fa-solid fa-file-image',       bg: '#f3e8ff', color: '#7e22ce' },
    pptx: { icon: 'fa-solid fa-file-powerpoint',  bg: '#fff7ed', color: '#c2410c' },
};

const INITIAL_DOCS: Doc[] = [
    { id: 1,  title: 'Home Loan Product Guide 2026',  category: 'Products',       status: 'New',      version: 'v2.1', filename: 'home_loan_guide_2026.pdf',      fileType: 'pdf',  fileSize: '3.4 MB', desc: 'Comprehensive guide covering all home loan products, rates, and eligibility criteria for 2026.', uploaded: '2026-04-10' },
    { id: 2,  title: 'AML & KYC Compliance Policy',   category: 'Policies',       status: 'Updated',  version: 'v4.0', filename: 'aml_kyc_policy.pdf',            fileType: 'pdf',  fileSize: '1.2 MB', desc: 'Updated anti-money laundering and know-your-customer policy document aligned with AUSTRAC 2026 guidelines.', uploaded: '2026-04-08' },
    { id: 3,  title: 'Broker Onboarding FAQ',          category: 'FAQs',           status: 'New',      version: 'v1.3', filename: 'broker_onboarding_faq.docx',    fileType: 'docx', fileSize: '420 KB', desc: 'Frequently asked questions for new brokers joining the Alpha Funding panel.', uploaded: '2026-04-12' },
    { id: 4,  title: 'Cold Call Script — Refinance',   category: 'Scripts',        status: 'New',      version: 'v1.0', filename: 'cold_call_refi_script.docx',    fileType: 'docx', fileSize: '190 KB', desc: 'Structured outbound call script for refinance lead conversations.', uploaded: '2026-04-14' },
    { id: 5,  title: 'Lender Panel Overview Guide',    category: 'Guides',         status: 'Updated',  version: 'v3.2', filename: 'lender_panel_guide.pdf',        fileType: 'pdf',  fileSize: '5.1 MB', desc: 'Full overview of all lenders on the Alpha Funding panel including products, BDMs, and turnaround times.', uploaded: '2026-04-05' },
    { id: 6,  title: 'CRM Usage Knowledge Base',       category: 'Knowledge Base', status: 'New',      version: 'v1.1', filename: 'crm_knowledge_base.pdf',        fileType: 'pdf',  fileSize: '2.8 MB', desc: 'Internal knowledge base for using the Alpha Funding CRM platform.', uploaded: '2026-04-15' },
    { id: 7,  title: 'Commercial Loan Product Sheet',  category: 'Products',       status: 'New',      version: 'v1.0', filename: 'commercial_loan_sheet.xlsx',    fileType: 'xlsx', fileSize: '680 KB', desc: 'Rate and product comparison sheet for commercial lending solutions.', uploaded: '2026-04-13' },
    { id: 8,  title: 'Privacy Policy 2026',            category: 'Policies',       status: 'Archived', version: 'v2.9', filename: 'privacy_policy_2026.pdf',       fileType: 'pdf',  fileSize: '890 KB', desc: 'Client privacy and data handling policy. Superseded by v3.0.', uploaded: '2026-03-01' },
    { id: 9,  title: 'Settlement Checklist Guide',     category: 'Guides',         status: 'Updated',  version: 'v2.0', filename: 'settlement_checklist.docx',     fileType: 'docx', fileSize: '310 KB', desc: 'Step-by-step settlement checklist for brokers to share with clients.', uploaded: '2026-04-07' },
    { id: 10, title: 'Product FAQ — Investment Loans', category: 'FAQs',           status: 'New',      version: 'v1.0', filename: 'investment_faq.pdf',            fileType: 'pdf',  fileSize: '540 KB', desc: 'Common questions and answers for investment property loan enquiries.', uploaded: '2026-04-11' },
    { id: 11, title: 'Inbound Lead Response Script',   category: 'Scripts',        status: 'Updated',  version: 'v2.3', filename: 'inbound_lead_script.docx',      fileType: 'docx', fileSize: '220 KB', desc: 'Script for handling inbound lead calls from various marketing channels.', uploaded: '2026-04-09' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getFileIcon(type: string) {
    return FILE_ICONS[type?.toLowerCase()] || { icon: 'fa-solid fa-file', bg: '#f1f5f9', color: '#475569' };
}
function getCatStyle(cat: string) {
    return CAT_STYLE[cat] || CAT_STYLE['_custom'];
}
function formatDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' });
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
    const [documents, setDocuments]     = useState<Doc[]>(INITIAL_DOCS);
    const [formCats, setFormCats]       = useState<string[]>([...PRESET_CATS]);
    const [selectedCat, setSelectedCat] = useState('');
    const [customCatInput, setCustomCatInput] = useState('');

    // Upload / edit state
    const [mode, setMode]               = useState<'upload' | 'edit'>('upload');
    const [activeDocId, setActiveDocId] = useState<number | null>(null);
    const [formTitle, setFormTitle]     = useState('');
    const [formDesc, setFormDesc]       = useState('');
    const [dragOver, setDragOver]       = useState(false);
    const [uploadQueue, setUploadQueue] = useState<{ name: string; size: string; ext: string; pct: number }[]>([]);
    const fileInputRef                  = useRef<HTMLInputElement>(null);
    const nextId                        = useRef(12);

    // Vault state
    const [search, setSearch]           = useState('');
    const [catFilter, setCatFilter]     = useState('All');
    const [viewMode, setViewMode]       = useState<'list' | 'grid'>('list');

    // ── Computed ──
    const allCats = [...new Set([...PRESET_CATS, ...documents.map(d => d.category), ...formCats])];

    const filtered = documents.filter(d => {
        if (catFilter !== 'All' && d.category !== catFilter) return false;
        if (search) {
            const hay = [d.title, d.category, d.desc, d.filename].join(' ').toLowerCase();
            if (!hay.includes(search.toLowerCase())) return false;
        }
        return true;
    });

    // ── Left panel actions ──
    const openEdit = (doc: Doc) => {
        setMode('edit');
        setActiveDocId(doc.id);
        setFormTitle(doc.title);
        setFormDesc(doc.desc);
        setSelectedCat(doc.category);
        if (!formCats.includes(doc.category)) setFormCats(prev => [...prev, doc.category]);
    };

    const cancelEdit = () => {
        setMode('upload');
        setActiveDocId(null);
        setFormTitle('');
        setFormDesc('');
        setSelectedCat('');
        setUploadQueue([]);
    };

    const updateDocument = () => {
        if (!activeDocId || !formTitle.trim()) return;
        setDocuments(prev => prev.map(d => d.id === activeDocId
            ? { ...d, title: formTitle, desc: formDesc, category: selectedCat || d.category }
            : d
        ));
        cancelEdit();
    };

    const deleteDocument = (id: number) => {
        if (!confirm('Delete this document? This cannot be undone.')) return;
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (activeDocId === id) cancelEdit();
    };

    const uploadDocument = () => {
        if (!formTitle.trim()) return;
        const lastFile = uploadQueue[uploadQueue.length - 1];
        const filename = lastFile
            ? lastFile.name
            : formTitle.toLowerCase().replace(/\s+/g, '_') + '.pdf';
        const ext = filename.split('.').pop()?.toLowerCase() || 'pdf';
        const newDoc: Doc = {
            id: nextId.current++,
            title: formTitle,
            category: selectedCat || 'Knowledge Base',
            status: 'New',
            version: 'v1.0',
            filename,
            fileType: ext,
            fileSize: lastFile?.size || '—',
            desc: formDesc,
            uploaded: new Date().toISOString().slice(0, 10),
        };
        setDocuments(prev => [newDoc, ...prev]);
        cancelEdit();
    };

    const addCustomCat = () => {
        const val = customCatInput.trim();
        if (!val) return;
        const norm = val.charAt(0).toUpperCase() + val.slice(1);
        if (!formCats.includes(norm)) setFormCats(prev => [...prev, norm]);
        setSelectedCat(norm);
        setCustomCatInput('');
    };

    const removeCustomCat = (cat: string) => {
        setFormCats(prev => prev.filter(c => c !== cat));
        if (selectedCat === cat) setSelectedCat('');
    };

    const processFiles = (files: File[]) => {
        const items = files.map(f => {
            const ext = f.name.split('.').pop()?.toLowerCase() || '';
            const size = f.size > 1048576
                ? (f.size / 1048576).toFixed(1) + ' MB'
                : (f.size / 1024).toFixed(0) + ' KB';
            return { name: f.name, size, ext, pct: 0 };
        });
        setUploadQueue(items);
        if (!formTitle && items[0]) {
            setFormTitle(items[0].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
        }
        // Simulate progress
        items.forEach((_, i) => {
            let pct = 0;
            const iv = setInterval(() => {
                pct = Math.min(100, pct + Math.random() * 30 + 10);
                setUploadQueue(prev => prev.map((it, idx) => idx === i ? { ...it, pct: Math.round(pct) } : it));
                if (pct >= 100) clearInterval(iv);
            }, 160);
        });
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden bg-white">
            <style>{`
                .upload-zone { border:2px dashed #e2e8f0; border-radius:10px; padding:40px 16px; text-align:center; cursor:pointer; transition:all .2s; background:#f8fafc; position:relative; }
                .upload-zone:hover, .upload-zone.drag-over { border-color:#6366f1; background:#eef2ff; }
                .upload-zone input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
                .cat-tag { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:#f1f5f9; border-radius:6px; font-size:9px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:.03em; border:1px solid #e2e8f0; cursor:pointer; transition:all .15s; }
                .cat-tag.selected { background:#0f172a; color:#fff; border-color:#0f172a; }
                .doc-row { transition:background .1s; cursor:pointer; }
                .doc-row:hover { background:#f8fafc; }
                .doc-card { background:#fff; border:1px solid #f1f5f9; border-radius:10px; padding:14px; cursor:pointer; transition:all .15s; }
                .doc-card:hover { border-color:#e2e8f0; box-shadow:0 4px 14px rgba(0,0,0,.07); transform:translateY(-1px); }
                .progress-bar-bg { background:#f1f5f9; border-radius:99px; height:3px; overflow:hidden; margin-top:5px; }
                .progress-bar { height:100%; border-radius:99px; background:#6366f1; transition:width .35s ease; }
                .dark-select { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); border-radius:7px; padding:5px 22px 5px 9px; font-size:9px; font-weight:700; color:#d1d5db; outline:none; cursor:pointer; appearance:none; }
                .dark-select option { background:#1e293b; color:#fff; }
                .view-btn { padding:5px 8px; border-radius:6px; font-size:10px; color:#94a3b8; cursor:pointer; border:none; background:transparent; transition:all .15s; }
                .view-btn.active { background:rgba(255,255,255,.12); color:#fff; }
            `}</style>

            {/* ── LEFT: Upload / Edit Panel ── */}
            <section className="w-[420px] flex-shrink-0 border-r border-slate-100 flex flex-col overflow-hidden bg-white">
                {/* Panel header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                    <h2 className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">
                        {mode === 'edit' ? 'Document Details' : 'Upload Document'}
                    </h2>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: mode === 'edit' ? '#eab308' : '#6366f1' }}></div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 space-y-3">

                        {/* Upload zone OR file display */}
                        {mode === 'upload' ? (
                            <>
                                <div
                                    className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); processFiles(Array.from(e.dataTransfer.files)); }}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={e => e.target.files && processFiles(Array.from(e.target.files))}
                                    />
                                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-indigo-300 mb-2 block"></i>
                                    <p className="text-[10px] font-bold text-slate-600 mb-0.5">Drop files here or <span className="text-indigo-500">browse</span></p>
                                    <p className="text-[8px] text-slate-400">PDF, DOCX, XLSX, PNG — Max 20 MB each</p>
                                </div>

                                {/* Upload queue */}
                                {uploadQueue.length > 0 && (
                                    <div className="space-y-1.5">
                                        {uploadQueue.map((f, i) => {
                                            const fi = getFileIcon(f.ext);
                                            return (
                                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: fi.bg }}>
                                                            <i className={`${fi.icon} text-[9px]`} style={{ color: fi.color }}></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[9px] font-bold text-slate-700 truncate">{f.name}</p>
                                                            <p className="text-[7px] text-slate-400">{f.size}</p>
                                                        </div>
                                                        <span className={`text-[7px] font-bold flex-shrink-0 ${f.pct >= 100 ? 'text-emerald-600' : 'text-indigo-500'}`}>
                                                            {f.pct >= 100 ? 'Ready' : 'Uploading...'}
                                                        </span>
                                                    </div>
                                                    <div className="progress-bar-bg">
                                                        <div className="progress-bar" style={{ width: `${f.pct}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Edit mode: show file icon display */
                            (() => {
                                const doc = documents.find(d => d.id === activeDocId);
                                const fi = doc ? getFileIcon(doc.fileType) : getFileIcon('');
                                return (
                                    <div className="border-2 border-slate-200 rounded-lg bg-white text-center py-8 px-4">
                                        <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: fi.bg }}>
                                            <i className={`${fi.icon} text-xl`} style={{ color: fi.color }}></i>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-900 mb-1 truncate">{doc?.filename}</p>
                                        <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">{doc?.fileSize} • {doc?.fileType?.toUpperCase()}</p>
                                    </div>
                                );
                            })()
                        )}

                        {/* Document Details form */}
                        <div className="border-t border-slate-100 pt-3">
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                <i className="fa-solid fa-tag text-[8px]"></i> Document Details
                            </p>
                            <div className="space-y-2.5">
                                <div>
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={e => setFormTitle(e.target.value)}
                                        placeholder="e.g. Home Loan Product Guide 2026"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10.5px] font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formDesc}
                                        onChange={e => setFormDesc(e.target.value)}
                                        placeholder="Brief description..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[10.5px] font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category tags */}
                        <div className="border-t border-slate-100 pt-3">
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                <i className="fa-solid fa-tags text-[8px]"></i> Category
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {formCats.map(cat => {
                                    const isCustom = !PRESET_CATS.includes(cat);
                                    return (
                                        <span
                                            key={cat}
                                            onClick={() => setSelectedCat(selectedCat === cat ? '' : cat)}
                                            className={`cat-tag${selectedCat === cat ? ' selected' : ''}`}
                                        >
                                            {cat}
                                            {isCustom && (
                                                <i
                                                    className="fa-solid fa-xmark text-[8px] ml-0.5"
                                                    onClick={e => { e.stopPropagation(); removeCustomCat(cat); }}
                                                ></i>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                            <div className="flex gap-1.5">
                                <input
                                    type="text"
                                    value={customCatInput}
                                    onChange={e => setCustomCatInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomCat(); } }}
                                    placeholder="Add category..."
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[9px] font-medium text-slate-900 outline-none focus:border-slate-400"
                                />
                                <button
                                    onClick={addCustomCat}
                                    className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold hover:bg-black transition-all flex-shrink-0"
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-1">
                            {mode === 'upload' ? (
                                <button
                                    onClick={uploadDocument}
                                    className="w-full py-2.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-cloud-arrow-up text-[10px]"></i>
                                    Upload Document
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={updateDocument}
                                        className="w-full py-2.5 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-floppy-disk text-[10px]"></i>
                                        Update Details
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5">
                                            <i className="fa-solid fa-eye"></i> View
                                        </button>
                                        <button className="flex-1 py-1.5 bg-slate-900 hover:bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5">
                                            <i className="fa-solid fa-download"></i> Download
                                        </button>
                                        <button
                                            onClick={() => activeDocId && deleteDocument(activeDocId)}
                                            className="flex-1 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <i className="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </div>
                                    <button
                                        onClick={cancelEdit}
                                        className="w-full py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all"
                                    >
                                        Cancel / New Upload
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── RIGHT: Document Vault ── */}
            <section className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Dark header */}
                <div className="bg-slate-900 px-4 flex items-center gap-3 flex-shrink-0" style={{ minHeight: 48 }}>
                    <i className="fa-solid fa-vault text-indigo-400 text-[13px] flex-shrink-0"></i>
                    <h2 className="text-[9px] font-bold uppercase tracking-widest text-white flex-shrink-0">Document Vault</h2>
                    <span className="text-[8px] font-bold text-slate-500 font-mono flex-shrink-0">
                        {filtered.length !== documents.length ? `(${filtered.length} of ${documents.length})` : ''}
                    </span>

                    {/* Search */}
                    <div className="relative flex-1 min-w-[100px]">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full rounded-lg px-3 py-1.5 pl-7 text-[9px] font-semibold text-white outline-none"
                            style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)' }}
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: 'rgba(255,255,255,.3)' }}></i>
                    </div>

                    {/* Category filter */}
                    <select
                        value={catFilter}
                        onChange={e => setCatFilter(e.target.value)}
                        className="dark-select"
                    >
                        <option value="All">All Categories</option>
                        {allCats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* View toggle */}
                    <div className="flex items-center gap-0.5 rounded-lg p-0.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,.05)' }}>
                        <button className={`view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title="Grid">
                            <i className="fa-solid fa-grip"></i>
                        </button>
                        <button className={`view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} title="List">
                            <i className="fa-solid fa-list"></i>
                        </button>
                    </div>

                    {/* Clear */}
                    {(search || catFilter !== 'All') && (
                        <button
                            onClick={() => { setSearch(''); setCatFilter('All'); }}
                            className="flex-shrink-0 text-[8px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            <i className="fa-solid fa-xmark mr-0.5"></i>Clear
                        </button>
                    )}

                    {/* Total count */}
                    <div className="flex items-center gap-1.5 px-2.5 py-2 border-l border-white/10 ml-1 flex-shrink-0">
                        <span className="text-[13px] font-black text-white">{documents.length}</span>
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <i className="fa-solid fa-folder-open text-2xl text-slate-200"></i>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400">No documents found</p>
                            <p className="text-[9px] text-slate-300 mt-1">Adjust filters or upload your first document</p>
                            <button onClick={() => { setSearch(''); setCatFilter('All'); }} className="mt-3 text-[9px] font-bold text-slate-900 underline">Clear filters</button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* Grid view */
                        <div className="p-4 grid grid-cols-3 gap-3" style={{ alignContent: 'start' }}>
                            {filtered.map(d => {
                                const cs = getCatStyle(d.category);
                                return (
                                    <div key={d.id} className="doc-card" onClick={() => openEdit(d)}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cs.bg }}>
                                                <i className={`${cs.icon} text-sm`} style={{ color: cs.color }}></i>
                                            </div>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{d.title}</p>
                                        <p className="text-[8px] text-slate-400 mb-3 truncate">{d.filename}</p>
                                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
                                            <span className="text-[8px] font-bold" style={{ color: cs.color }}>{d.category}</span>
                                            <span className="text-[7px] font-mono text-slate-400">{formatDate(d.uploaded)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* List view */
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-3 py-2 w-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(d => {
                                    const fi = getFileIcon(d.fileType);
                                    const cs = getCatStyle(d.category);
                                    return (
                                        <tr key={d.id} className="doc-row" onClick={() => openEdit(d)}>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: fi.bg }}>
                                                        <i className={`${fi.icon} text-[11px]`} style={{ color: fi.color }}></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-900">{d.title}</p>
                                                        <p className="text-[7px] text-slate-400 mt-0.5">{d.filename} · {d.fileSize}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                    <i className={`${cs.icon} text-[9px]`} style={{ color: cs.color }}></i>
                                                    <span className="text-[9px] font-semibold text-slate-600">{d.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className="text-[9px] font-mono text-slate-400">{formatDate(d.uploaded)}</span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center"></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between flex-shrink-0">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {filtered.length} document{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <button className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                        <i className="fa-solid fa-download mr-1"></i>Export CSV
                    </button>
                </div>
            </section>
        </div>
    );
}
