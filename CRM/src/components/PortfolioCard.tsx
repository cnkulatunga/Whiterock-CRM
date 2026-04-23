'use client';

import { useState, useEffect } from 'react';
import { leads as initialLeads } from '@/data/dummy';

export default function PortfolioCard() {
    const [leads, setLeads] = useState<any[]>(initialLeads);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('/api/leads')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setLeads(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Portfolio fetch error:', err);
                setLoading(false);
            });
    }, []);

    const filteredLeads = Array.isArray(leads) 
        ? (filter === 'all' ? leads : leads.filter((l: any) => l.quality === filter))
        : [];

    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <i className="fa-solid fa-list-check text-[10px]"></i>
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Lead Portfolio</h3>
                </div>
                <div className="flex bg-white border border-slate-200 shadow-sm rounded-lg p-0.5">
                    {['all', 'hot', 'warm', 'cool'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest rounded transition-all ${filter === f
                                    ? 'bg-slate-900 text-white'
                                    : `text-${f === 'hot' ? 'rose' : f === 'warm' ? 'amber' : f === 'cool' ? 'blue' : 'slate'}-500 hover:bg-slate-50`
                                }`}
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
                            <th className="w-[60%] pb-2 text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Client</th>
                            <th className="w-[20%] pb-2 text-[7px] font-black text-slate-400 uppercase tracking-widest text-center leading-none">Status</th>
                            <th className="w-[20%] pb-2 text-[7px] font-black text-slate-400 uppercase tracking-widest text-right leading-none">Amount</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-[185px] overflow-y-auto custom-scrollbar">
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
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="py-2.5 w-[60%]">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {lead.name}
                                                </span>
                                                <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">{lead.company}</span>
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
                                            <span className="text-[9px] font-black text-slate-900">{lead.amount}</span>
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
