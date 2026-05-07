'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocEntry {
    doc_id: string;
    doc_name: string;
    doc_type: string;
    doc_status: 'Pending' | 'Verified' | 'Missing' | 'Failed';
    lead_id: string;
    lead_name: string;
    company: string;
    quality: string;
    lead_status: string;
    uploaded_by: string;
    uploaded_at: string | null;
}

export default function DocumentRequestsCard() {
    const router = useRouter();
    const [tab, setTab] = useState<'Pending' | 'Failed'>('Pending');
    const [docs, setDocs] = useState<DocEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leads/documents')
            .then(r => r.ok ? r.json() : [])
            .then(data => setDocs(Array.isArray(data) ? data : []))
            .catch(() => setDocs([]))
            .finally(() => setLoading(false));
    }, []);

    const pendingCount = docs.filter(d => d.doc_status === 'Pending').length;
    const failedCount = docs.filter(d => d.doc_status === 'Failed' || d.doc_status === 'Missing').length;
    const filtered = docs.filter(d =>
        tab === 'Pending' ? d.doc_status === 'Pending' : (d.doc_status === 'Failed' || d.doc_status === 'Missing')
    );

    return (
        <div className="glass-card card-h-std flex flex-col lg:col-span-2 overflow-hidden">
            <div className="bg-[#0f172a] px-4 min-h-[46px] flex items-center gap-3 shrink-0">
                <i className="fa-solid fa-folder-open text-slate-500 text-sm"></i>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Document Requests</span>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab('Pending')}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${tab === 'Pending' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        Pending <span className="ml-1 bg-black/20 px-1.5 rounded-full">{loading ? '…' : pendingCount}</span>
                    </button>
                    <button
                        onClick={() => setTab('Failed')}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${tab === 'Failed' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        Failed <span className="ml-1 bg-black/20 px-1.5 rounded-full">{loading ? '…' : failedCount}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-0 px-4 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead / Doc</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Business</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lead Status</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 items-center px-4 py-3 border-b border-slate-50 animate-pulse">
                        <div className="space-y-1.5">
                            <div className="h-2.5 w-24 bg-slate-100 rounded" />
                            <div className="h-2 w-16 bg-slate-50 rounded" />
                        </div>
                        <div className="h-2.5 w-20 bg-slate-100 rounded mx-auto" />
                        <div className="h-5 w-12 bg-slate-100 rounded-full mx-auto" />
                        <div className="h-2.5 w-14 bg-slate-100 rounded mx-auto" />
                        <div className="h-7 w-7 bg-slate-100 rounded-lg ml-auto" />
                    </div>
                ))}

                {!loading && filtered.length > 0 && filtered.map(d => (
                    <div
                        key={d.doc_id}
                        className="grid grid-cols-5 items-center px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group"
                        onClick={() => router.push(`/pipeline/${d.lead_id}`)}
                    >
                        <div>
                            <div className="text-[10px] font-black text-slate-900 leading-none">{d.lead_name}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{d.doc_name}</div>
                        </div>
                        <div className="text-xs font-bold text-slate-500 text-center truncate px-2">{d.company}</div>
                        <div className="flex justify-center">
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                                d.quality === 'hot' ? 'bg-rose-50 text-rose-600' :
                                d.quality === 'warm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                                {d.quality}
                            </span>
                        </div>
                        <div className="flex justify-center">
                            <span className={`text-[10px] font-black uppercase ${
                                d.doc_status === 'Pending' ? 'text-amber-500' : 'text-rose-500'
                            }`}>
                                {d.doc_status}
                            </span>
                        </div>
                        <div className="flex justify-end">
                            <button className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                <i className="fa-solid fa-chevron-right text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && filtered.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                        <i className="fa-solid fa-folder-open text-2xl mb-2"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest">No documents found</p>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 border-t border-slate-50 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {loading ? '…' : filtered.length} requests</span>
                <button onClick={() => router.push('/leads')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Leads →</button>
            </div>
        </div>
    );
}
