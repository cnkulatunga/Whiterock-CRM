'use client';

import { useState } from 'react';

import { docRequests as DOC_REQUESTS } from '@/data/dummy';

export default function DocumentRequestsCard() {
    const [tab, setTab] = useState<'pending' | 'rejected'>('pending');

    const filteredDocs = DOC_REQUESTS.filter(d =>
        tab === 'pending' ? d.status === 'Pending' : d.status === 'Rejected'
    );

    return (
        <div className="glass-card flex flex-col h-[280px] lg:col-span-2 overflow-hidden">
            <div className="bg-[#0f172a] px-4 min-h-[46px] flex items-center gap-3 shrink-0">
                <i className="fa-solid fa-folder-open text-slate-500 text-sm"></i>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Document Requests</span>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab('pending')}
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${tab === 'pending' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        Pending <span className="ml-1 bg-black/20 px-1.5 rounded-full">{DOC_REQUESTS.filter(d => d.status === 'Pending').length}</span>
                    </button>
                    <button
                        onClick={() => setTab('rejected')}
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${tab === 'rejected' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        Rejected <span className="ml-1 bg-black/20 px-1.5 rounded-full">{DOC_REQUESTS.filter(d => d.status === 'Rejected').length}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-0 px-4 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Lead / Doc</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Business</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Lead Status</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Status</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Action</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((d) => (
                        <div key={d.id} className="grid grid-cols-5 items-center px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                            <div>
                                <div className="text-[10px] font-black text-slate-900 leading-none">{d.lead}</div>
                                <div className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{d.doc}</div>
                            </div>
                            <div className="text-[9px] font-bold text-slate-500 text-center truncate px-2">{d.company}</div>
                            <div className="flex justify-center">
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${d.quality?.toLowerCase() === 'hot' ? 'bg-rose-50 text-rose-600' :
                                    d.quality?.toLowerCase() === 'warm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {d.quality}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`text-[8px] font-black uppercase ${d.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'
                                    }`}>
                                    {d.status}
                                </span>
                                {d.reason && <span className="text-[7px] font-bold text-slate-400 mt-0.5">{d.reason}</span>}
                            </div>
                            <div className="flex justify-end">
                                <button className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                    <i className="fa-solid fa-chevron-right text-[8px]"></i>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                        <i className="fa-solid fa-folder-open text-2xl mb-2"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest">No documents found</p>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 border-t border-slate-50 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredDocs.length} requests</span>
                <button className="text-[8px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Leads →</button>
            </div>
        </div>
    );
}
