'use client';

import { useState } from 'react';
import Link from 'next/link';
import { leads } from '@/data/dummy';

export default function LeadsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const filteredLeads = leads.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || l.quality.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-screen overflow-hidden p-3 gap-3 bg-[#f8fafc]">
            {/* Lead Database Panel */}
            <section className="flex-1 min-w-0 glass-card bg-white flex flex-col overflow-hidden">
                <div className="px-4 border-b border-slate-100 bg-slate-900 flex items-center gap-3 min-h-[48px]">
                    <h2 className="text-[9px] font-black uppercase tracking-widest text-white shrink-0">Lead Database</h2>
                    <div className="relative flex-1 min-w-[80px]">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] font-semibold text-white outline-none focus:bg-white/20 transition-all"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-[8px]"></i>
                    </div>
                    <Link href="/leads/add" className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                        <i className="fa-solid fa-plus text-[7px]"></i> Add Lead
                    </Link>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/10 border border-white/10 rounded-lg py-1.5 px-3 text-[9px] font-black text-white outline-none cursor-pointer"
                    >
                        <option value="All" className="bg-slate-800">All Status</option>
                        <option value="Hot" className="bg-slate-800">Hot</option>
                        <option value="Warm" className="bg-slate-800">Warm</option>
                        <option value="Cool" className="bg-slate-800">Cool</option>
                    </select>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                            <tr>
                                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Lead</th>
                                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`hover:bg-slate-50 cursor-pointer transition-all ${selectedLead?.id === lead.id ? 'bg-indigo-50/50' : ''}`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-900">{lead.name}</span>
                                            <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">{lead.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[9px] font-bold text-slate-600">{lead.company}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[9px] font-bold text-slate-500">{lead.type}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${lead.quality === 'hot'
                                                ? 'bg-red-50 text-red-600'
                                                : lead.quality === 'warm'
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-blue-50 text-blue-600'
                                                }`}
                                        >
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Lead Detail Panel */}
            <aside className={`w-[480px] glass-card bg-white flex flex-col transition-all overflow-hidden ${!selectedLead ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex flex-col">
                        <h2 className="text-[12px] font-black text-slate-900 uppercase leading-none">
                            {selectedLead?.name || 'Select a Lead'}
                        </h2>
                        <p className="text-[9px] text-indigo-600 font-black mt-1 uppercase tracking-widest">
                            {selectedLead?.company || 'Lead Details'}
                        </p>
                    </div>
                    <button className="h-7 px-3 bg-slate-900 text-white text-[8px] font-black rounded-lg uppercase tracking-widest hover:bg-black transition-all">
                        Edit Lead
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                    {selectedLead ? (
                        <>
                            <section>
                                <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3 border-b-2 border-slate-50 pb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-address-card text-indigo-600"></i> Contact Information
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Full Name', value: selectedLead.name },
                                        { label: 'Company', value: selectedLead.company },
                                        { label: 'Loan Amount', value: selectedLead.amount },
                                        { label: 'Loan Type', value: selectedLead.type },
                                        { label: 'Status', value: selectedLead.status },
                                        { label: 'Lead ID', value: selectedLead.id },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{field.label}</label>
                                            <div className="text-[10px] font-black text-slate-900 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                                {field.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-3 border-b-2 border-slate-50 pb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-clock-rotate-left text-indigo-600"></i> Activity Feed
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { type: 'Follow-up', text: 'Call scheduled with the client.', time: '2 hours ago' },
                                        { type: 'Status Change', text: 'Lead moved to "Appraisal".', time: '1 day ago' },
                                        { type: 'Document', text: 'Financial statements uploaded.', time: '2 days ago' },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex gap-3 relative pb-3 before:absolute before:left-[11px] before:top-[24px] before:bottom-0 before:w-[2px] before:bg-slate-50 last:before:hidden">
                                            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-[8px] shrink-0">
                                                <i className="fa-solid fa-bolt"></i>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-slate-900">{activity.type}</div>
                                                <div className="text-[9px] text-slate-500 font-medium">{activity.text}</div>
                                                <div className="text-[7px] text-slate-400 font-bold uppercase mt-1">{activity.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <i className="fa-solid fa-user-group text-4xl mb-4"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest">Select a lead to view details</p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
