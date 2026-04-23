'use client';

import { useState, useRef } from 'react';

// --- Constants & Types ---
const PRESET_CATS = ["KNOWLEDGE BASE", "GUIDES", "FAQs", "PRODUCTS", "POLICIES", "SCRIPTS"];

const CAT_STYLES: Record<string, { icon: string, color: string }> = {
    "KNOWLEDGE BASE": { icon: "fa-solid fa-square", color: "text-blue-500" },
    "GUIDES": { icon: "fa-solid fa-lines-leaning", color: "text-purple-500" },
    "FAQs": { icon: "fa-solid fa-circle", color: "text-amber-500" },
    "PRODUCTS": { icon: "fa-solid fa-square", color: "text-emerald-500" },
    "POLICIES": { icon: "fa-solid fa-circle", color: "text-rose-500" },
    "SCRIPTS": { icon: "fa-solid fa-terminal", color: "text-slate-500" },
    "_default": { icon: "fa-solid fa-tag", color: "text-indigo-500" }
};

const FILE_FORMAT_INFO: Record<string, { icon: string, bg: string, color: string }> = {
    pdf: { icon: "fa-solid fa-file-pdf", bg: "bg-rose-50", color: "text-rose-500" },
    docx: { icon: "fa-solid fa-file-word", bg: "bg-blue-50", color: "text-blue-500" },
    doc: { icon: "fa-solid fa-file-word", bg: "bg-blue-50", color: "text-blue-500" },
    xlsx: { icon: "fa-solid fa-file-excel", bg: "bg-emerald-50", color: "text-emerald-500" },
    xls: { icon: "fa-solid fa-file-excel", bg: "bg-emerald-50", color: "text-emerald-500" },
};

const INITIAL_DOCS = [
    { id: 1, title: "Home Loan Product Guide 2026", category: "PRODUCTS", filename: "home_loan_guide_2026.pdf", fileType: "pdf", fileSize: "3.4 MB", desc: "Comprehensive guide covering all home loan products, rates, and eligibility criteria for 2026.", date: "10 Apr 26" },
    { id: 2, title: "AML & KYC Compliance Policy", category: "POLICIES", filename: "aml_kyc_policy.pdf", fileType: "pdf", fileSize: "1.2 MB", desc: "Updated anti-money laundering and know-your-customer policy document.", date: "8 Apr 26" },
    { id: 3, title: "Broker Onboarding FAQ", category: "FAQs", filename: "broker_onboarding_faq.docx", fileType: "docx", fileSize: "420 KB", desc: "Frequently asked questions for new brokers.", date: "12 Apr 26" },
    { id: 4, title: "Cold Call Script — Refinance", category: "SCRIPTS", filename: "cold_call_refi_script.docx", fileType: "docx", fileSize: "190 KB", desc: "Structured outbound call script for refinance conversations.", date: "14 Apr 26" },
    { id: 5, title: "Lender Panel Overview Guide", category: "GUIDES", filename: "lender_panel_guide.pdf", fileType: "pdf", fileSize: "5.1 MB", desc: "Full overview of all lenders on the Alpha Funding panel.", date: "5 Apr 26" },
    { id: 6, title: "CRM Usage Knowledge Base", category: "KNOWLEDGE BASE", filename: "crm_knowledge_base.pdf", fileType: "pdf", fileSize: "2.8 MB", desc: "Internal knowledge base for using the Alpha Funding CRM platform.", date: "15 Apr 26" },
    { id: 7, title: "Commercial Loan Product Sheet", category: "PRODUCTS", filename: "commercial_loan_sheet.xlsx", fileType: "xlsx", fileSize: "680 KB", desc: "Rate and product comparison sheet.", date: "13 Apr 26" },
    { id: 8, title: "Privacy Policy 2026", category: "POLICIES", filename: "privacy_policy_2026.pdf", fileType: "pdf", fileSize: "890 KB", desc: "Client privacy and data handling policy.", date: "1 Mar 26" },
    { id: 9, title: "Settlement Checklist Guide", category: "GUIDES", filename: "settlement_checklist.docx", fileType: "docx", fileSize: "310 KB", desc: "Standard operating procedure for settlements.", date: "7 Apr 26" },
    { id: 10, title: "Product FAQ — Investment Loans", category: "FAQs", filename: "investment_faq.pdf", fileType: "pdf", fileSize: "840 KB", desc: "Specific FAQs for investor clients.", date: "11 Apr 26" },
    { id: 11, title: "Inbound Lead Response Script", category: "SCRIPTS", filename: "inbound_lead_script.docx", fileType: "docx", fileSize: "220 KB", desc: "Script for handling inbound inquiries.", date: "9 Apr 26" },
];

export default function DocsPage() {
    const [documents, setDocuments] = useState(INITIAL_DOCS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedDocId, setSelectedDocId] = useState<number | null>(1); // Default select first for UI parity

    // Form State
    const [formTitle, setFormTitle] = useState(INITIAL_DOCS[0].title);
    const [formDesc, setFormDesc] = useState(INITIAL_DOCS[0].desc);
    const [formCat, setFormCat] = useState(INITIAL_DOCS[0].category);
    const [categories, setCategories] = useState(PRESET_CATS);
    const [customCatInput, setCustomCatInput] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Computed ---
    const filteredDocs = documents.filter(d => {
        const matchesCategory = filterCategory === 'All' || d.category === filterCategory;
        const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const selectedDoc = documents.find(d => d.id === selectedDocId);

    // --- Actions ---
    const handleUpdate = () => {
        if (!selectedDocId) return;
        setDocuments(documents.map(d => d.id === selectedDocId ? {
            ...d,
            title: formTitle,
            desc: formDesc,
            category: formCat
        } : d));
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this document?')) return;
        setDocuments(documents.filter(d => d.id !== id));
        if (selectedDocId === id) resetForm();
    };

    const resetForm = () => {
        setSelectedDocId(null);
        setFormTitle('');
        setFormDesc('');
        setFormCat('');
    };

    const selectDoc = (doc: typeof INITIAL_DOCS[0]) => {
        setSelectedDocId(doc.id);
        setFormTitle(doc.title);
        setFormDesc(doc.desc);
        setFormCat(doc.category);
    };

    const addCustomCategory = () => {
        if (!customCatInput.trim()) return;
        const norm = customCatInput.toUpperCase();
        if (!categories.includes(norm)) setCategories([...categories, norm]);
        setFormCat(norm);
        setCustomCatInput('');
    };

    const getFileInfo = (ext: string) => FILE_FORMAT_INFO[ext.toLowerCase()] || { icon: "fa-solid fa-file", bg: "bg-slate-50", color: "text-slate-400" };
    const getCatInfo = (cat: string) => CAT_STYLES[cat] || CAT_STYLES["_default"];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#eff3f6]">

            <main className="flex-1 h-full min-h-0 overflow-hidden grid grid-cols-[450px_1fr] p-6 gap-6">

                {/* LEFT PANEL: DOCUMENT DETAILS */}
                <aside className="bg-white rounded-[24px] border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <span className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800">
                            DOCUMENT DETAILS
                        </span>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
                    </div>

                    <div className="flex-1 flex flex-col p-6 pt-4 space-y-3 overflow-hidden min-h-0">
                        {/* File Preview Card - Highly Dynamic for small heights */}
                        <div className="bg-[#f4f7ff] rounded-[24px] border border-slate-100 p-4 min-h-[100px] flex flex-col items-center justify-center text-center shrink-0">
                            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-2 shadow-sm ${getFileInfo(selectedDoc?.fileType || '').bg}`}>
                                <i className={`${getFileInfo(selectedDoc?.fileType || '').icon} text-xl ${getFileInfo(selectedDoc?.fileType || '').color}`}></i>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-900 mb-0.5 uppercase tracking-tighter truncate w-full px-2">
                                {selectedDoc?.filename || 'No File Selected'}
                            </h4>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                {selectedDoc?.fileSize} • {selectedDoc?.fileType?.toUpperCase()}
                            </p>
                        </div>

                        {/* Form Fields - Compressed for small screens */}
                        <div className="space-y-3 min-h-0 flex-1 overflow-y-auto no-scrollbar">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">TITLE *</label>
                                <input
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                    type="text"
                                    className="w-full h-[40px] bg-[#f8fafc] border border-slate-200 rounded-[12px] px-4 text-[11px] font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-400 transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">DESCRIPTION</label>
                                <textarea
                                    value={formDesc}
                                    onChange={e => setFormDesc(e.target.value)}
                                    rows={2}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-4 text-[10px] font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-400 transition-all shadow-sm resize-none leading-tight"
                                ></textarea>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <i className="fa-solid fa-tags text-[8px] opacity-40"></i> CATEGORY
                                </label>
                                <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto custom-scrollbar pr-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFormCat(cat)}
                                            className={`px-3 py-1.5 rounded-[8px] text-[9px] font-black uppercase tracking-widest transition-all border ${formCat === cat ? 'bg-[#1a1f2c] text-white border-[#1a1f2c] shadow-lg' : 'bg-[#f4f7ff] text-[#4a5568] border-slate-100 hover:bg-slate-100'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={customCatInput}
                                        onChange={e => setCustomCatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addCustomCategory()}
                                        type="text" placeholder="Add..."
                                        className="flex-1 h-[36px] bg-[#f8fafc] border border-slate-200 rounded-[10px] px-4 text-[10px] font-bold outline-none"
                                    />
                                    <button onClick={addCustomCategory} className="w-[36px] h-[36px] bg-[#1a1f2c] text-white rounded-[10px] flex items-center justify-center">
                                        <i className="fa-solid fa-plus text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Compact heights for small screens */}
                        <div className="pt-2 space-y-2 shrink-0">
                            <button
                                onClick={handleUpdate}
                                className="w-full h-[50px] bg-[#5a56e9] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[14px] shadow-lg flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-floppy-disk text-xs"></i>
                                UPDATE DETAILS
                            </button>

                            <div className="grid grid-cols-3 gap-2">
                                <button className="h-[42px] bg-[#f0f3ff] rounded-[11px] text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
                                    <i className="fa-solid fa-eye text-[10px]"></i> VIEW
                                </button>
                                <button className="h-[42px] bg-[#1a1f2c] rounded-[11px] text-[9px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-1.5">
                                    <i className="fa-solid fa-download text-[10px]"></i> DOWN
                                </button>
                                <button
                                    onClick={() => selectedDocId && handleDelete(selectedDocId)}
                                    className="h-[42px] bg-white border border-rose-100 rounded-[11px] text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center justify-center gap-1.5"
                                >
                                    <i className="fa-solid fa-trash text-[10px]"></i> DEL
                                </button>
                            </div>

                            <button onClick={resetForm} className="w-full h-[38px] border border-slate-100 rounded-[12px] text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center">
                                CANCEL / NEW UPLOAD
                            </button>
                        </div>
                    </div>
                </aside>

                {/* RIGHT PANEL: DOCUMENT VAULT */}
                <div className="flex flex-col gap-6 overflow-hidden min-h-0">
                    <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
                        {/* Header */}
                        <div className="h-[72px] px-8 bg-[#1e2330] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <i className="fa-solid fa-vault text-indigo-400 text-sm"></i>
                                </div>
                                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white">DOCUMENT VAULT</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="relative w-[320px]">
                                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[11px]"></i>
                                    <input
                                        type="text"
                                        placeholder="Search documents..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-11 pr-4 bg-[#2a3040] border border-transparent rounded-[12px] text-[11px] font-bold text-white outline-none focus:bg-[#32394a] transition-all placeholder:text-slate-500"
                                    />
                                </div>

                                <select
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                    className="bg-[#2a3040] border border-transparent rounded-[12px] h-10 px-6 text-[10px] font-black text-white outline-none cursor-pointer focus:bg-[#32394a] uppercase tracking-widest"
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <div className="flex items-center gap-1.5 p-1 bg-[#2a3040] rounded-[14px]">
                                    <button className="w-8 h-8 rounded-[11px] bg-slate-900 flex items-center justify-center text-white"><i className="fa-solid fa-grip text-[11px]"></i></button>
                                    <button className="w-8 h-8 rounded-[11px] flex items-center justify-center text-slate-500 hover:text-white"><i className="fa-solid fa-list text-[11px]"></i></button>
                                </div>

                                <div className="h-10 px-5 bg-black rounded-[14px] flex items-center justify-center gap-3">
                                    <span className="text-[13px] font-black text-white">{documents.length}</span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TOTAL</span>
                                </div>
                            </div>
                        </div>

                        {/* Document List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#f8fafc]/90 backdrop-blur-md z-10">
                                    <tr>
                                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DOCUMENT</th>
                                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">CATEGORY</th>
                                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">DATE</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredDocs.map((doc) => {
                                        const fileInfo = getFileInfo(doc.fileType);
                                        const catInfo = getCatInfo(doc.category);
                                        const isSelected = selectedDocId === doc.id;
                                        return (
                                            <tr
                                                key={doc.id}
                                                onClick={() => selectDoc(doc)}
                                                className={`group cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/60'}`}
                                            >
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm border border-white ${fileInfo.bg}`}>
                                                            <i className={`${fileInfo.icon} text-lg ${fileInfo.color}`}></i>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[12px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                                {doc.title}
                                                            </p>
                                                            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                                                                {doc.filename} · <span className="opacity-70 italic">{doc.fileSize}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <div className="inline-flex items-center gap-2.5">
                                                        <i className={`${catInfo.icon} text-[9px] ${catInfo.color}`}></i>
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{doc.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <span className="text-[11px] font-black text-slate-400 font-mono italic tracking-tighter uppercase">{doc.date}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {filteredDocs.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                                    <i className="fa-solid fa-folder-open text-5xl mb-6"></i>
                                    <p className="text-[13px] font-black uppercase tracking-[0.2em]">Zero Records Found</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="h-[64px] px-10 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm mt-auto">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SHOWING {filteredDocs.length} DOCUMENTS</span>
                            <button onClick={() => alert('Exporting to CSV...')} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] hover:text-indigo-600 transition-all flex items-center gap-2">
                                <i className="fa-solid fa-file-export opacity-50"></i> EXPORT CSV
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
