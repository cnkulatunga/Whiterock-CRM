'use client';

import { lenders } from '@/data/dummy';

export default function LendersPage() {
    return (
        <div className="flex-1 flex flex-col p-6 bg-[#fafafa] overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lender Management</h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage lending partners and their criteria</p>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                    <i className="fa-solid fa-plus mr-2"></i> Add Lender
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
                {lenders.map((lender) => (
                    <div key={lender.id} className="glass-card bg-white p-6 hover:border-indigo-500/30 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 text-xl shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {lender.name[0]}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${lender.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {lender.active ? 'Active' : 'Disabled'}
                                </span>
                                <span className="text-[14px] font-black text-slate-900 mt-2">{lender.rate}</span>
                                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Base Rate</span>
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{lender.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{lender.type}</span>
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Rating: {lender.rating}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Max LTV</span>
                                <span className="text-[10px] font-black text-slate-900">{lender.maxLtv}</span>
                            </div>
                            <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Update</span>
                                <span className="text-[10px] font-black text-slate-900">2 days ago</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 pt-1">
                            <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">Criteria</button>
                            <button className="flex-1 py-2 bg-slate-50 text-indigo-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all border border-indigo-50">Submit Case</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
