'use client';

import { useState } from 'react';

export default function FinanceCentreCard() {
    const [tab, setTab] = useState<'lenders' | 'docs' | 'summary'>('lenders');

    return (
        <div className="glass-card flex flex-col h-[320px] lg:col-span-1 overflow-hidden">
            <div className="bg-[#0f172a] px-4 min-h-[46px] flex items-center gap-3 shrink-0">
                <i className="fa-solid fa-building-columns text-slate-500 text-sm"></i>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Finance Centre</span>
                <div className="flex-1"></div>
                <div className="flex bg-white/10 rounded-lg p-0.5">
                    {['lenders', 'docs', 'summary'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {tab === 'lenders' && (
                    <div className="space-y-2">
                        {[
                            { name: 'Lloyds Bank', status: 'Submitted', color: 'blue' },
                            { name: 'Barclays', status: 'Approved', color: 'emerald' },
                            { name: 'NatWest', status: 'In Review', color: 'amber' },
                            { name: 'HSBC', status: 'Pending', color: 'slate' },
                        ].map((l) => (
                            <div key={l.name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full bg-${l.color}-500`}></div>
                                    <span className="text-[10px] font-black text-slate-900">{l.name}</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase text-${l.color}-600 bg-${l.color}-50 px-2 py-0.5 rounded`}>{l.status}</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'docs' && (
                    <div className="space-y-2">
                        {[
                            { name: 'Bank Statements', status: 'Verified', color: 'emerald', icon: 'fa-check' },
                            { name: 'ID Documents', status: 'Verified', color: 'emerald', icon: 'fa-check' },
                            { name: 'Financial Accounts', status: 'Pending', color: 'amber', icon: 'fa-clock' },
                            { name: 'Tax Returns', status: 'Missing', color: 'rose', icon: 'fa-xmark' },
                        ].map((d) => (
                            <div key={d.name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-lg bg-${d.color}-50 flex items-center justify-center text-${d.color}-600`}>
                                        <i className={`fa-solid ${d.icon} text-[10px]`}></i>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900">{d.name}</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase text-${d.color}-600`}>{d.status}</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'summary' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Lender Feedback</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-medium text-slate-700 outline-none focus:border-indigo-500 resize-none h-20"
                                placeholder="Enter lender feedback here..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Internal Notes</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-medium text-slate-700 outline-none focus:border-indigo-500 resize-none h-20"
                                placeholder="Internal team notes..."
                            ></textarea>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 border-t border-slate-50 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic">Last updated: 12 mins ago</span>
                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest">Update Centre</button>
            </div>
        </div>
    );
}
