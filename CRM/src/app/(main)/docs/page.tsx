'use client';

import { useState } from 'react';

const INITIAL_DOCS = [
    { id: 1, title: 'Home Loan Product Guide 2026', category: 'Products', type: 'PDF', size: '3.4 MB', updated: '2026-04-10' },
    { id: 2, title: 'AML & KYC Compliance Policy', category: 'Policies', type: 'PDF', size: '1.2 MB', updated: '2026-04-08' },
    { id: 3, title: 'Broker Onboarding FAQ', category: 'General', type: 'DOCX', size: '420 KB', updated: '2026-04-12' },
    { id: 4, title: 'Cold Call Script — Refinance', category: 'Scripts', type: 'PDF', size: '190 KB', updated: '2026-04-14' },
    { id: 5, title: 'Lender Panel Overview', category: 'Lenders', type: 'XLSX', size: '5.1 MB', updated: '2026-04-05' },
    { id: 6, title: 'CRM Usage Knowledge Base', category: 'Technical', type: 'PDF', size: '2.8 MB', updated: '2026-04-15' },
];

export default function DocsPage() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocs = INITIAL_DOCS.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
            {/* Header */}
            <header className="h-[64px] bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <i className="fa-solid fa-vault text-base"></i>
                    </div>
                    <div>
                        <h1 className="text-[13px] font-black text-slate-900 leading-none uppercase tracking-widest">Document Vault</h1>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Secure centralized repository for all corporate assets</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-[300px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                        <input
                            type="text"
                            placeholder="Search by title, category or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                    <button className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upload Asset
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">

                {/* Left: Upload & Filters (3 Cols) */}
                <aside className="lg:col-span-3 space-y-6 flex flex-col overflow-hidden">
                    <section className="glass-card bg-white p-6 shrink-0">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Storage Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-bold text-slate-500">Vault Capacity</span>
                                <span className="text-[10px] font-black text-slate-900">64%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '64%' }}></div>
                            </div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">8.4 GB used of 10.0 GB legacy storage</p>
                        </div>
                    </section>

                    <section className="glass-card bg-white p-6 flex-1 flex flex-col overflow-hidden">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Asset Categories</h3>
                        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                            {['Products', 'Policies', 'Lenders', 'Scripts', 'Technical', 'Marketing'].map((cat) => (
                                <button key={cat} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <i className="fa-solid fa-folder text-[10px]"></i>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{cat}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300">12</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </aside>

                {/* Right: Vault Explorer (9 Cols) */}
                <div className="lg:col-span-9 flex flex-col gap-6 overflow-hidden">
                    <section className="glass-card bg-white flex flex-col flex-1 overflow-hidden">
                        <div className="h-[56px] px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setViewMode('list')} className={`text-[10px] font-black uppercase tracking-widest pb-4 mt-4 border-b-2 transition-all ${viewMode === 'list' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400'}`}>List View</button>
                                <button onClick={() => setViewMode('grid')} className={`text-[10px] font-black uppercase tracking-widest pb-4 mt-4 border-b-2 transition-all ${viewMode === 'grid' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400'}`}>Grid Layout</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Sort by:</span>
                                <select className="h-8 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 outline-none px-3 cursor-pointer">
                                    <option>Most Recent</option>
                                    <option>Alphabetical</option>
                                    <option>File Size</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {viewMode === 'list' ? (
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20">
                                        <tr>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Document Asset</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Category</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Format</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">File Size</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Modified</th>
                                            <th className="px-6 py-3 border-b border-slate-100"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredDocs.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-[10px] ${doc.type === 'PDF' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                                                            }`}>
                                                            <i className={`fa-solid ${doc.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-word'}`}></i>
                                                        </div>
                                                        <span className="text-[11px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{doc.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-tighter">{doc.category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-[10px] font-black text-slate-400">{doc.type}</td>
                                                <td className="px-6 py-4 text-[10px] font-black text-slate-400">{doc.size}</td>
                                                <td className="px-6 py-4 text-[10px] font-black text-slate-400">{doc.updated}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                                                            <i className="fa-solid fa-download text-[10px]"></i>
                                                        </button>
                                                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                                                            <i className="fa-solid fa-ellipsis text-[10px]"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredDocs.map((doc) => (
                                        <div key={doc.id} className="glass-card bg-white p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-500/20 transition-all cursor-pointer group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 ${doc.type === 'PDF' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    <i className={`fa-solid ${doc.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-word'}`}></i>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{doc.size}</span>
                                            </div>
                                            <h4 className="text-[12px] font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{doc.title}</h4>
                                            <div className="flex items-center gap-2 mb-6">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Updated {doc.updated}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Download</button>
                                                <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
                                                    <i className="fa-solid fa-eye text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
