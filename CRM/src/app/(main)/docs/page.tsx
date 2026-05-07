'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Doc {
    id: string;
    title: string;
    description: string;
    category: string;
    filename: string;
    file_type: string;
    file_size: string;
    file_url: string;
    version: string;
    status: string;
    uploaded_by: { id: string; name: string } | null;
    created_at: string;
}

interface CustomCat {
    id: string;
    name: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

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
    pdf:  { icon: 'fa-solid fa-file-pdf',       bg: '#fee2e2', color: '#dc2626' },
    docx: { icon: 'fa-solid fa-file-word',       bg: '#dbeafe', color: '#1d4ed8' },
    doc:  { icon: 'fa-solid fa-file-word',       bg: '#dbeafe', color: '#1d4ed8' },
    xlsx: { icon: 'fa-solid fa-file-excel',      bg: '#d1fae5', color: '#059669' },
    xls:  { icon: 'fa-solid fa-file-excel',      bg: '#d1fae5', color: '#059669' },
    png:  { icon: 'fa-solid fa-file-image',      bg: '#f3e8ff', color: '#7e22ce' },
    jpg:  { icon: 'fa-solid fa-file-image',      bg: '#f3e8ff', color: '#7e22ce' },
    jpeg: { icon: 'fa-solid fa-file-image',      bg: '#f3e8ff', color: '#7e22ce' },
    pptx: { icon: 'fa-solid fa-file-powerpoint', bg: '#fff7ed', color: '#c2410c' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getFileIcon(type: string) {
    return FILE_ICONS[type?.toLowerCase()] || { icon: 'fa-solid fa-file', bg: '#f1f5f9', color: '#475569' };
}
function getCatStyle(cat: string) {
    return CAT_STYLE[cat] || CAT_STYLE['_custom'];
}
function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' });
}
function authHeader(): Record<string, string> {
    try {
        const s = sessionStorage.getItem('crm_session');
        const token = s ? JSON.parse(s).access : null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch { return {}; }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
    // ── Session / role ──
    const [userRole, setUserRole] = useState('');
    const isSuperAdmin = userRole === 'Super Admin' || userRole === 'Admin';

    // ── Docs state ──
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [loading, setLoading]     = useState(true);
    const [loadErr, setLoadErr]     = useState('');

    // ── Categories state ──
    const [customCats, setCustomCats]       = useState<CustomCat[]>([]);
    const [customCatInput, setCustomCatInput] = useState('');
    const [catSaving, setCatSaving]         = useState(false);
    const allCats = [...PRESET_CATS, ...customCats.map(c => c.name).filter(n => !PRESET_CATS.includes(n))];

    // ── Upload / edit state ──
    const [mode, setMode]             = useState<'upload' | 'edit'>('upload');
    const [activeDoc, setActiveDoc]   = useState<Doc | null>(null);
    const [formTitle, setFormTitle]   = useState('');
    const [formDesc, setFormDesc]     = useState('');
    const [formVersion, setFormVersion] = useState('v1.0');
    const [selectedCat, setSelectedCat] = useState('');
    const [dragOver, setDragOver]     = useState(false);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [uploadPct, setUploadPct]   = useState(0);
    const [saving, setSaving]         = useState(false);
    const [saveErr, setSaveErr]       = useState('');
    const fileInputRef                = useRef<HTMLInputElement>(null);

    // ── Vault state ──
    const [search, setSearch]       = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [viewMode, setViewMode]   = useState<'list' | 'grid'>('list');

    // ── Load session role ──
    useEffect(() => {
        try {
            const s = sessionStorage.getItem('crm_session');
            if (s) setUserRole(JSON.parse(s).role || '');
        } catch { /* ignore */ }
    }, []);

    // ── Fetch docs ──
    const fetchDocs = useCallback(async () => {
        setLoading(true);
        setLoadErr('');
        try {
            const res = await fetch('/api/docs', { headers: authHeader() });
            const data = await res.json();
            if (!res.ok) { setLoadErr(data.error || 'Failed to load documents'); return; }
            setDocuments(Array.isArray(data) ? data : []);
        } catch {
            setLoadErr('Network error — could not load documents');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Fetch categories ──
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/docs/categories', { headers: authHeader() });
            if (!res.ok) return;
            const data = await res.json();
            setCustomCats(Array.isArray(data?.custom) ? data.custom : []);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => { fetchDocs(); fetchCategories(); }, [fetchDocs, fetchCategories]);

    // ── Computed filtered list ──
    const filtered = documents.filter(d => {
        if (catFilter !== 'All' && d.category !== catFilter) return false;
        if (search) {
            const hay = [d.title, d.category, d.description, d.filename].join(' ').toLowerCase();
            if (!hay.includes(search.toLowerCase())) return false;
        }
        return true;
    });

    // ── Panel actions ──
    const openEdit = (doc: Doc) => {
        setMode('edit');
        setActiveDoc(doc);
        setFormTitle(doc.title);
        setFormDesc(doc.description);
        setFormVersion(doc.version);
        setSelectedCat(doc.category);
        setStagedFile(null);
        setUploadPct(0);
        setSaveErr('');
    };

    const cancelEdit = () => {
        setMode('upload');
        setActiveDoc(null);
        setFormTitle('');
        setFormDesc('');
        setFormVersion('v1.0');
        setSelectedCat('');
        setStagedFile(null);
        setUploadPct(0);
        setSaveErr('');
    };

    const processFile = (file: File) => {
        setStagedFile(file);
        if (!formTitle) {
            setFormTitle(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
        }
        // Simulate progress animation
        setUploadPct(0);
        let pct = 0;
        const iv = setInterval(() => {
            pct = Math.min(100, pct + Math.random() * 30 + 10);
            setUploadPct(Math.round(pct));
            if (pct >= 100) clearInterval(iv);
        }, 160);
    };

    const uploadDocument = async () => {
        if (!formTitle.trim()) { setSaveErr('Title is required.'); return; }
        if (!stagedFile) { setSaveErr('Please select a file to upload.'); return; }
        setSaving(true);
        setSaveErr('');
        try {
            const fd = new FormData();
            fd.append('file', stagedFile);
            fd.append('title', formTitle.trim());
            fd.append('description', formDesc.trim());
            fd.append('category', selectedCat || 'Knowledge Base');
            fd.append('version', formVersion.trim() || 'v1.0');
            const res = await fetch('/api/docs', {
                method: 'POST',
                headers: authHeader(),
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) { setSaveErr(data.error || 'Upload failed'); return; }
            setDocuments(prev => [data, ...prev]);
            cancelEdit();
        } catch {
            setSaveErr('Network error — upload failed');
        } finally {
            setSaving(false);
        }
    };

    const updateDocument = async () => {
        if (!activeDoc || !formTitle.trim()) { setSaveErr('Title is required.'); return; }
        setSaving(true);
        setSaveErr('');
        try {
            const res = await fetch(`/api/docs/${activeDoc.id}`, {
                method: 'PATCH',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formTitle.trim(),
                    description: formDesc.trim(),
                    category: selectedCat || activeDoc.category,
                    version: formVersion.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) { setSaveErr(data.error || 'Update failed'); return; }
            setDocuments(prev => prev.map(d => d.id === data.id ? data : d));
            cancelEdit();
        } catch {
            setSaveErr('Network error — update failed');
        } finally {
            setSaving(false);
        }
    };

    const deleteDocument = async (id: string) => {
        if (!confirm('Delete this document? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/docs/${id}`, {
                method: 'DELETE',
                headers: authHeader(),
            });
            if (res.ok || res.status === 204) {
                setDocuments(prev => prev.filter(d => d.id !== id));
                if (activeDoc?.id === id) cancelEdit();
            }
        } catch { /* ignore */ }
    };

    // ── Category actions (Super Admin only) ──
    const addCustomCat = async () => {
        const val = customCatInput.trim();
        if (!val) return;
        setCatSaving(true);
        try {
            const res = await fetch('/api/docs/categories', {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: val }),
            });
            const data = await res.json();
            if (res.ok) {
                setCustomCats(prev => {
                    if (prev.find(c => c.id === data.id)) return prev;
                    return [...prev, data];
                });
                setSelectedCat(data.name);
                setCustomCatInput('');
            }
        } catch { /* ignore */ }
        setCatSaving(false);
    };

    const removeCustomCat = async (cat: CustomCat) => {
        try {
            await fetch(`/api/docs/categories?id=${cat.id}`, {
                method: 'DELETE',
                headers: authHeader(),
            });
            setCustomCats(prev => prev.filter(c => c.id !== cat.id));
            if (selectedCat === cat.name) setSelectedCat('');
        } catch { /* ignore */ }
    };

    // ── Render ────────────────────────────────────────────────────────────────
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

            {/* ── LEFT: Upload / Edit Panel (Super Admin only) or Read-only info ── */}
            <section className="w-[420px] flex-shrink-0 border-r border-slate-100 flex flex-col overflow-hidden bg-white">
                <div className="flex items-center gap-2 flex-shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                    <i className="fa-solid fa-file-arrow-up" style={{ color: mode === 'edit' ? '#fbbf24' : '#818cf8', fontSize: 13, flexShrink: 0 }}></i>
                    <div>
                        <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>
                            {isSuperAdmin ? (mode === 'edit' ? 'Document Details' : 'Upload Document') : 'Document Info'}
                        </p>
                        <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>
                            {mode === 'edit' ? 'Editing' : 'Document Vault'}
                        </p>
                    </div>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: mode === 'edit' ? '#eab308' : '#6366f1' }}></div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 space-y-3">

                        {isSuperAdmin ? (
                            /* ── Super Admin: full upload / edit UI ── */
                            <>
                                {mode === 'upload' ? (
                                    <>
                                        <div
                                            className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.pptx"
                                                onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
                                            />
                                            <i className="fa-solid fa-cloud-arrow-up text-2xl text-indigo-300 mb-2 block"></i>
                                            <p className="text-[10px] font-bold text-slate-600 mb-0.5">Drop file here or <span className="text-indigo-500">browse</span></p>
                                            <p className="text-[10px] text-slate-400">PDF, DOCX, XLSX, PNG — Max 20 MB</p>
                                        </div>

                                        {stagedFile && (
                                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: getFileIcon(stagedFile.name.split('.').pop() || '').bg }}>
                                                        <i className={`${getFileIcon(stagedFile.name.split('.').pop() || '').icon} text-[9px]`} style={{ color: getFileIcon(stagedFile.name.split('.').pop() || '').color }}></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-700 truncate">{stagedFile.name}</p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {stagedFile.size >= 1_048_576 ? `${(stagedFile.size / 1_048_576).toFixed(1)} MB` : `${Math.round(stagedFile.size / 1024)} KB`}
                                                        </p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold flex-shrink-0 ${uploadPct >= 100 ? 'text-emerald-600' : 'text-indigo-500'}`}>
                                                        {uploadPct >= 100 ? 'Ready' : 'Staged'}
                                                    </span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar" style={{ width: `${uploadPct}%` }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Edit mode: file icon display */
                                    (() => {
                                        const fi = activeDoc ? getFileIcon(activeDoc.file_type) : getFileIcon('');
                                        return (
                                            <div className="border-2 border-slate-200 rounded-lg bg-white text-center py-8 px-4">
                                                <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: fi.bg }}>
                                                    <i className={`${fi.icon} text-xl`} style={{ color: fi.color }}></i>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-900 mb-1 truncate">{activeDoc?.filename}</p>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{activeDoc?.file_size} • {activeDoc?.file_type?.toUpperCase()}</p>
                                            </div>
                                        );
                                    })()
                                )}

                                {/* Document Details form */}
                                <div className="border-t border-slate-100 pt-3">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <i className="fa-solid fa-tag text-[10px]"></i> Document Details
                                    </p>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title *</label>
                                            <input
                                                type="text"
                                                value={formTitle}
                                                onChange={e => setFormTitle(e.target.value)}
                                                placeholder="e.g. Home Loan Product Guide 2026"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10.5px] font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                            <textarea
                                                rows={3}
                                                value={formDesc}
                                                onChange={e => setFormDesc(e.target.value)}
                                                placeholder="Brief description..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[10.5px] font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Version</label>
                                            <input
                                                type="text"
                                                value={formVersion}
                                                onChange={e => setFormVersion(e.target.value)}
                                                placeholder="v1.0"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10.5px] font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category tags */}
                                <div className="border-t border-slate-100 pt-3">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <i className="fa-solid fa-tags text-[10px]"></i> Category
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {allCats.map(cat => {
                                            const isCustom = !PRESET_CATS.includes(cat);
                                            const customObj = customCats.find(c => c.name === cat);
                                            return (
                                                <span
                                                    key={cat}
                                                    onClick={() => setSelectedCat(selectedCat === cat ? '' : cat)}
                                                    className={`cat-tag${selectedCat === cat ? ' selected' : ''}`}
                                                >
                                                    {cat}
                                                    {isCustom && customObj && (
                                                        <i
                                                            className="fa-solid fa-xmark text-[10px] ml-0.5"
                                                            onClick={e => { e.stopPropagation(); removeCustomCat(customObj); }}
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
                                            placeholder="Add custom category..."
                                            className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-slate-400"
                                        />
                                        <button
                                            onClick={addCustomCat}
                                            disabled={catSaving}
                                            className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all flex-shrink-0 disabled:opacity-50"
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Error message */}
                                {saveErr && (
                                    <p className="text-xs text-red-500 font-semibold">{saveErr}</p>
                                )}

                                {/* Action buttons */}
                                <div className="pt-1">
                                    {mode === 'upload' ? (
                                        <button
                                            onClick={uploadDocument}
                                            disabled={saving}
                                            className="w-full py-2.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {saving
                                                ? <><i className="fa-solid fa-spinner fa-spin text-[10px]"></i> Uploading...</>
                                                : <><i className="fa-solid fa-cloud-arrow-up text-[10px]"></i> Upload Document</>
                                            }
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <button
                                                onClick={updateDocument}
                                                disabled={saving}
                                                className="w-full py-2.5 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                            >
                                                {saving
                                                    ? <><i className="fa-solid fa-spinner fa-spin text-[10px]"></i> Saving...</>
                                                    : <><i className="fa-solid fa-floppy-disk text-[10px]"></i> Update Details</>
                                                }
                                            </button>
                                            <div className="flex gap-2">
                                                {activeDoc?.file_url && (
                                                    <a
                                                        href={activeDoc.file_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                                                    >
                                                        <i className="fa-solid fa-eye"></i> View
                                                    </a>
                                                )}
                                                {activeDoc?.file_url && (
                                                    <a
                                                        href={activeDoc.file_url}
                                                        download={activeDoc.filename}
                                                        className="flex-1 py-1.5 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                                                    >
                                                        <i className="fa-solid fa-download"></i> Download
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => activeDoc && deleteDocument(activeDoc.id)}
                                                    className="flex-1 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <i className="fa-solid fa-trash"></i> Delete
                                                </button>
                                            </div>
                                            <button
                                                onClick={cancelEdit}
                                                className="w-full py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
                                            >
                                                Cancel / New Upload
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* ── Non-admin: read-only info panel ── */
                            activeDoc ? (
                                <div className="space-y-3">
                                    <div className="border-2 border-slate-100 rounded-lg bg-white text-center py-8 px-4">
                                        <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: getFileIcon(activeDoc.file_type).bg }}>
                                            <i className={`${getFileIcon(activeDoc.file_type).icon} text-xl`} style={{ color: getFileIcon(activeDoc.file_type).color }}></i>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-900 mb-1">{activeDoc.title}</p>
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{activeDoc.file_size} • {activeDoc.file_type?.toUpperCase()}</p>
                                    </div>
                                    <div className="space-y-2">
                                        {activeDoc.description && (
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Description</p>
                                                <p className="text-[10px] text-slate-600 leading-relaxed">{activeDoc.description}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                                            <span>Version: <span className="text-slate-700 font-bold">{activeDoc.version}</span></span>
                                            <span>•</span>
                                            <span>Status: <span className="text-slate-700 font-bold">{activeDoc.status}</span></span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Category</p>
                                            <span className="cat-tag selected">{activeDoc.category}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Uploaded</p>
                                            <p className="text-xs text-slate-600">{formatDate(activeDoc.created_at)}{activeDoc.uploaded_by ? ` by ${activeDoc.uploaded_by.name}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        {activeDoc.file_url && (
                                            <>
                                                <a
                                                    href={activeDoc.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <i className="fa-solid fa-eye"></i> View
                                                </a>
                                                <a
                                                    href={activeDoc.file_url}
                                                    download={activeDoc.filename}
                                                    className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <i className="fa-solid fa-download"></i> Download
                                                </a>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={cancelEdit}
                                        className="w-full py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-file-lines text-xl text-slate-200"></i>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400">Select a document</p>
                                    <p className="text-xs text-slate-300 mt-1">Click any document to view details</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* ── RIGHT: Document Vault ── */}
            <section className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Dark header */}
                <div className="bg-slate-900 px-4 flex items-center gap-3 flex-shrink-0" style={{ minHeight: 48 }}>
                    <i className="fa-solid fa-vault text-indigo-400 text-[13px] flex-shrink-0"></i>
                    <h2 className="text-[9px] font-bold uppercase tracking-widest text-white flex-shrink-0">Document Vault</h2>
                    <span className="text-[10px] font-bold text-slate-500 font-mono flex-shrink-0">
                        {filtered.length !== documents.length ? `(${filtered.length} of ${documents.length})` : ''}
                    </span>

                    {/* Search */}
                    <div className="relative flex-1 min-w-[100px]">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full rounded-lg px-3 py-1.5 pl-7 text-xs font-semibold text-white outline-none"
                            style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)' }}
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: 'rgba(255,255,255,.3)' }}></i>
                    </div>

                    {/* Category filter */}
                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="dark-select">
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

                    {/* Refresh */}
                    <button
                        onClick={fetchDocs}
                        className="flex-shrink-0 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                        title="Refresh"
                    >
                        <i className="fa-solid fa-rotate-right"></i>
                    </button>

                    {/* Clear filters */}
                    {(search || catFilter !== 'All') && (
                        <button
                            onClick={() => { setSearch(''); setCatFilter('All'); }}
                            className="flex-shrink-0 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            <i className="fa-solid fa-xmark mr-0.5"></i>Clear
                        </button>
                    )}

                    {/* Total count */}
                    <div className="flex items-center gap-1.5 px-2.5 py-2 border-l border-white/10 ml-1 flex-shrink-0">
                        <span className="text-[13px] font-black text-white">{documents.length}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <i className="fa-solid fa-spinner fa-spin text-2xl text-slate-300 mb-3"></i>
                            <p className="text-[10px] text-slate-400">Loading documents...</p>
                        </div>
                    ) : loadErr ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-300 mb-3"></i>
                            <p className="text-[11px] font-bold text-slate-400">{loadErr}</p>
                            <button onClick={fetchDocs} className="mt-3 text-xs font-bold text-indigo-600 underline">Retry</button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <i className="fa-solid fa-folder-open text-2xl text-slate-200"></i>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400">No documents found</p>
                            <p className="text-xs text-slate-300 mt-1">
                                {documents.length === 0 ? 'No documents have been uploaded yet' : 'Adjust filters or clear search'}
                            </p>
                            {(search || catFilter !== 'All') && (
                                <button onClick={() => { setSearch(''); setCatFilter('All'); }} className="mt-3 text-xs font-bold text-slate-900 underline">Clear filters</button>
                            )}
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="p-4 grid grid-cols-3 gap-3" style={{ alignContent: 'start' }}>
                            {filtered.map(d => {
                                const cs = getCatStyle(d.category);
                                return (
                                    <div key={d.id} className="doc-card" onClick={() => openEdit(d)}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cs.bg }}>
                                                <i className={`${cs.icon} text-sm`} style={{ color: cs.color }}></i>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-300">{d.version}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{d.title}</p>
                                        <p className="text-[10px] text-slate-400 mb-3 truncate">{d.filename}</p>
                                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
                                            <span className="text-[10px] font-bold" style={{ color: cs.color }}>{d.category}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{formatDate(d.created_at)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-3 py-2 w-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(d => {
                                    const fi = getFileIcon(d.file_type);
                                    const cs = getCatStyle(d.category);
                                    const isActive = activeDoc?.id === d.id;
                                    return (
                                        <tr key={d.id} className={`doc-row${isActive ? ' bg-indigo-50/60' : ''}`} onClick={() => openEdit(d)}>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: fi.bg }}>
                                                        <i className={`${fi.icon} text-[11px]`} style={{ color: fi.color }}></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-900">{d.title}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{d.filename} · {d.file_size}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                    <i className={`${cs.icon} text-[9px]`} style={{ color: cs.color }}></i>
                                                    <span className="text-xs font-semibold text-slate-600">{d.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className="text-[10px] font-mono text-slate-400">{d.version}</span>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className="text-xs font-mono text-slate-400">{formatDate(d.created_at)}</span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                {isSuperAdmin && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); deleteDocument(d.id); }}
                                                        className="text-slate-300 hover:text-red-400 transition-colors text-[10px]"
                                                        title="Delete"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {filtered.length} document{filtered.length !== 1 ? 's' : ''}
                    </span>
                    {!isSuperAdmin && (
                        <span className="text-[10px] text-slate-300 font-medium">
                            <i className="fa-solid fa-lock mr-1"></i>Read-only — documents uploaded by admin
                        </span>
                    )}
                </div>
            </section>
        </div>
    );
}
