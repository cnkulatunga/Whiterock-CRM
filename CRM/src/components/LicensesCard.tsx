'use client';

import { licenses } from '@/data/dummy';

export default function LicensesCard() {
    return (
        <div className="glass-card flex flex-col h-[280px] overflow-hidden">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-100">
                        <i className="fa-solid fa-file-shield text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Licenses & Insurance</h3>
                </div>
                <button className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all">
                    <i className="fa-solid fa-plus text-[10px]"></i>
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                {licenses.map((lic) => (
                    <div
                        key={lic.id}
                        className="bg-white border border-slate-100 rounded-xl transition-all cursor-pointer hover:border-rose-200 hover:shadow-sm p-3"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-900">{lic.name}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">Expires: {lic.date}</p>
                            </div>
                            <span
                                className={`text-[7px] font-black px-1.5 py-0.5 rounded ${lic.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}
                            >
                                {lic.status}
                            </span>
                        </div>
                        <span className="text-[7px] font-bold text-rose-500 uppercase tracking-tight flex items-center gap-1">
                            <i className="fa-solid fa-bell text-[7px]"></i> Remind {lic.remind} days before
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
