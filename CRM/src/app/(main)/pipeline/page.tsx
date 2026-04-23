'use client';

import { useState } from 'react';
import { leads } from '@/data/dummy';

const STAGES = [
    { id: 'collecting', label: 'Doc Collection', icon: 'fa-file-arrow-up', color: 'slate' },
    { id: 'verified', label: 'Doc Verified', icon: 'fa-file-circle-check', color: 'blue' },
    { id: 'lender', label: 'Lender Selection', icon: 'fa-building-columns', color: 'indigo' },
    { id: 'approved', label: 'Loan Approved', icon: 'fa-circle-check', color: 'emerald' },
    { id: 'rejected', label: 'Rejected', icon: 'fa-circle-xmark', color: 'rose' },
];

export default function PipelinePage() {
    const [search, setSearch] = useState('');
    const [activeLeads, setActiveLeads] = useState(leads);

    const filteredLeads = (stage: string) =>
        activeLeads.filter(l =>
            l.status.toLowerCase().includes(stage) ||
            (stage === 'collecting' && ['new', 'follow-up'].includes(l.status.toLowerCase())) ||
            (stage === 'approved' && l.status.toLowerCase() === 'appraisal') ||
            (stage === 'rejected' && l.status.toLowerCase() === 'lost')
        ).filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fafafa]">
            <div className="top-bar bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-diagram-project text-indigo-500 text-lg"></i>
                    <h1 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Loan Pipeline Board</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search case or client..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all w-64"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
                    </div>
                    <button className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                        <i className="fa-solid fa-plus text-[10px]"></i> Add Lead
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto p-4 flex gap-4 items-start custom-scrollbar">
                {STAGES.map((stage) => (
                    <div key={stage.id} className="w-[300px] shrink-0 h-full flex flex-col">
                        <div className={`px-4 py-3 rounded-t-2xl flex items-center justify-between bg-${stage.color}-50 text-${stage.color}-700`}>
                            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <i className={`fa-solid ${stage.icon}`}></i> {stage.label}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-white/50`}>
                                {filteredLeads(stage.id).length}
                            </span>
                        </div>

                        <div className={`flex-1 bg-${stage.color}-50/30 rounded-b-2xl p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[200px]`}>
                            {filteredLeads(stage.id).map((lead) => (
                                <div key={lead.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[11px] font-black text-slate-900">{lead.amount}</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{lead.id}</span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-[10px] font-black text-slate-900 leading-none">{lead.name}</div>
                                        <div className="text-[9px] font-black text-indigo-600 mt-1 uppercase tracking-tighter opacity-80">{lead.company}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase ${lead.quality === 'hot' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {lead.quality}
                                        </span>
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-5 h-5 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
                                                <i className="fa-solid fa-eye text-[7px]"></i>
                                            </button>
                                            <button className="w-5 h-5 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-600 transition-all">
                                                <i className="fa-solid fa-trash text-[7px]"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredLeads(stage.id).length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-10 border-2 border-dashed border-slate-200 rounded-xl">
                                    <i className={`fa-solid ${stage.icon} text-2xl mb-2`}></i>
                                    <span className="text-[8px] font-black uppercase tracking-widest">No Cases</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
