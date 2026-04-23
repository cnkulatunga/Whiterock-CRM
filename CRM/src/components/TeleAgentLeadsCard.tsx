'use client';

import { useState } from 'react';
import { leads } from '@/data/dummy';

import { pipelineStages as STAGES } from '@/data/dummy';

export default function TeleAgentLeadsCard({ title = 'My Leads' }: { title?: string }) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('');

    const filteredLeads = leads.filter(l => {
        if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (stageFilter && l.status !== stageFilter) return false;
        return true;
    });

    const PAGE_SIZE = 5;
    const paginatedLeads = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);

    return (
        <div className="glass-card flex flex-col h-[320px] lg:col-span-2 overflow-hidden">
            {/* Header */}
            <div className="bg-[#0f172a] px-4 min-h-[46px] flex items-center gap-3 shrink-0">
                <i className="fa-solid fa-user-group text-slate-500 text-sm"></i>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">{title}</span>
                <i className="fa-solid fa-chevron-right text-slate-700 text-[8px]"></i>
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Pipeline</span>
                <div className="flex-1"></div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[9px] text-white placeholder:text-white/30 outline-none focus:border-indigo-500 w-32"
                />
                <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[9px] text-white outline-none focus:border-indigo-500 cursor-pointer"
                >
                    <option value="" className="bg-[#0f172a]">All Stages</option>
                    {STAGES.map(s => <option key={s.key} value={s.key} className="bg-[#0f172a]">{s.label}</option>)}
                </select>
                <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-emerald-500 transition-all">
                    <i className="fa-solid fa-plus"></i> New Lead
                </button>
            </div>

            {/* Pipeline Strip */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
                {STAGES.map((s, idx) => (
                    <div
                        key={s.label}
                        onClick={() => setStageFilter(s.key)}
                        className={`flex-1 flex flex-col items-center py-2 px-1 cursor-pointer transition-all border-r border-slate-100 last:border-r-0 hover:bg-white ${stageFilter === s.key ? 'bg-white shadow-[inset_0_-2px_0_0_#6366f1]' : ''
                            }`}
                    >
                        <div className={`text-base font-black leading-none text-${s.color}-600`}>{s.count}</div>
                        <div className="text-[7px] font-black text-slate-400 uppercase tracking-tight mt-1 truncate w-full text-center">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Lead Name</th>
                            <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Business Name</th>
                            <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Stage</th>
                            <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedLeads.map((l) => (
                            <tr key={l.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                <td className="px-4 py-2.5">
                                    <div className="text-[10px] font-black text-slate-900 group-hover:text-indigo-600">{l.name}</div>
                                </td>
                                <td className="px-4 py-2.5">
                                    <div className="text-[9px] font-bold text-slate-500">{l.company}</div>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-tight">
                                        {l.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${l.quality === 'hot' ? 'bg-rose-50 text-rose-600' :
                                        l.quality === 'warm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {l.quality}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-right font-black text-slate-900 text-[10px]">
                                    {l.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                    Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={`w-6 h-6 rounded flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-white hover:text-indigo-600 transition-all ${page === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <i className="fa-solid fa-chevron-left text-[8px]"></i>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-black transition-all ${page === i + 1 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-indigo-600'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={`w-6 h-6 rounded flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-white hover:text-indigo-600 transition-all ${page === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <i className="fa-solid fa-chevron-right text-[8px]"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
