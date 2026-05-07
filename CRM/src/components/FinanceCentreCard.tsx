'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LenderEntry {
    id: string;
    name: string;
    status: string;
    type: string;
}

interface DocEntry {
    doc_id: string;
    doc_name: string;
    doc_status: string;
    lead_name: string;
    lead_id: string;
}

const STATUS_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
    Active:    { color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
    Inactive:  { color: '#94a3b8', bg: '#f8fafc', dot: '#94a3b8' },
    Pending:   { color: '#d97706', bg: '#fffbeb', dot: '#d97706' },
    Verified:  { color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
    Missing:   { color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
    Failed:    { color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
};

function statusStyle(s: string) {
    return STATUS_STYLE[s] ?? { color: '#64748b', bg: '#f8fafc', dot: '#64748b' };
}

export default function FinanceCentreCard() {
    const router = useRouter();
    const [tab, setTab] = useState<'lenders' | 'docs'>('lenders');
    const [lenders, setLenders] = useState<LenderEntry[]>([]);
    const [docs, setDocs] = useState<DocEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/lenders').then(r => r.ok ? r.json() : []),
            fetch('/api/leads/documents').then(r => r.ok ? r.json() : []),
        ]).then(([lenderData, docData]) => {
            const lenderList: any[] = Array.isArray(lenderData) ? lenderData : (lenderData?.results ?? []);
            setLenders(lenderList.map(l => ({ id: l.id, name: l.name, status: l.status, type: l.type })));
            setDocs(Array.isArray(docData) ? docData.slice(0, 20) : []);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <div className="glass-card card-h-tall flex flex-col lg:col-span-1 overflow-hidden">
            <div className="bg-[#0f172a] px-4 min-h-[46px] flex items-center gap-3 shrink-0">
                <i className="fa-solid fa-building-columns text-slate-500 text-sm"></i>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Finance Centre</span>
                <div className="flex-1"></div>
                <div className="flex bg-white/10 rounded-lg p-0.5">
                    {(['lenders', 'docs'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                                tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-white/50 hover:text-white'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {loading && (
                    <div className="space-y-2 animate-pulse">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-2.5 w-28 bg-slate-200 rounded" />
                                <div className="h-5 w-16 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && tab === 'lenders' && (
                    <div className="space-y-2">
                        {lenders.length === 0 && (
                            <p className="text-[10px] text-slate-300 font-bold text-center uppercase tracking-widest py-8">No lenders</p>
                        )}
                        {lenders.map(l => {
                            const st = statusStyle(l.status);
                            return (
                                <div key={l.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
                                        <div>
                                            <span className="text-[10px] font-black text-slate-900">{l.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1.5">{l.type}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded" style={{ color: st.color, background: st.bg }}>{l.status}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && tab === 'docs' && (
                    <div className="space-y-2">
                        {docs.length === 0 && (
                            <p className="text-[10px] text-slate-300 font-bold text-center uppercase tracking-widest py-8">No documents</p>
                        )}
                        {docs.map(d => {
                            const st = statusStyle(d.doc_status);
                            return (
                                <div
                                    key={d.doc_id}
                                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all"
                                    onClick={() => router.push(`/pipeline/${d.lead_id}`)}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: st.bg }}>
                                            <i className="fa-solid fa-file text-[10px]" style={{ color: st.color }}></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-900 truncate">{d.doc_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 truncate">{d.lead_name}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase shrink-0 ml-2" style={{ color: st.color }}>{d.doc_status}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="px-4 py-2 border-t border-slate-50 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    {loading ? '…' : tab === 'lenders' ? `${lenders.length} lenders` : `${docs.length} documents`}
                </span>
                <button
                    onClick={() => router.push(tab === 'lenders' ? '/lenders' : '/leads')}
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest"
                >
                    View All
                </button>
            </div>
        </div>
    );
}
