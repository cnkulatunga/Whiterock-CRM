'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { leads as initialLeads } from '@/data/dummy';

export default function PortfolioCard() {
    const router = useRouter();
    const [leads, setLeads] = useState<any[]>(initialLeads);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('/api/leads')
            .then(res => res.ok ? res.json() : Promise.reject('API Error'))
            .then(data => {
                if (Array.isArray(data)) {
                    setLeads(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Portfolio fetch error:', err);
                setLeads(initialLeads);
                setLoading(false);
            });
    }, []);

    const filteredLeads = Array.isArray(leads) 
        ? (filter === 'all' ? leads : leads.filter((l: any) => l.quality === filter))
        : [];

    return (
        <div className="glass-card card-h-std flex flex-col">
            <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                <i className="fa-solid fa-list-check" style={{ color: '#818cf8', fontSize: 13, flexShrink: 0 }}></i>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>Lead Portfolio</p>
                    <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Pipeline Overview</p>
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: 2, gap: 2 }}>
                    {['all', 'hot', 'warm', 'cool'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '2px 7px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '.05em',
                                borderRadius: 6,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all .15s',
                                background: filter === f ? '#fff' : 'transparent',
                                color: filter === f ? '#0f172a' : f === 'hot' ? '#f87171' : f === 'warm' ? '#fbbf24' : f === 'cool' ? '#60a5fa' : '#64748b',
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-3">
                <table className="w-full text-left table-fixed">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="w-[60%] pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Client</th>
                            <th className="w-[20%] pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-none">Status</th>
                            <th className="w-[20%] pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right leading-none">Amount</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-[clamp(140px,18vh,220px)] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left table-fixed">
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="py-10 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fa-solid fa-circle-notch fa-spin text-indigo-500"></i>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Loading Leads...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-10 text-center">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No leads found</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} onClick={() => router.push(`/pipeline/${lead.id}`)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="py-2.5 w-[60%]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {lead.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{lead.company}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 w-[20%] text-center">
                                            <span
                                                className={`text-[6px] font-black px-1.5 py-0.5 rounded uppercase ${lead.quality === 'hot'
                                                        ? 'bg-rose-50 text-rose-600'
                                                        : lead.quality === 'warm'
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : 'bg-blue-50 text-blue-600'
                                                    }`}
                                            >
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="py-2.5 w-[20%] text-right">
                                            <span className="text-xs font-black text-slate-900">{lead.amount}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
