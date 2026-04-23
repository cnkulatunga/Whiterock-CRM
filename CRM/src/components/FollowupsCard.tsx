'use client';

import { followups } from '@/data/dummy';

export default function FollowupsCard() {
    return (
        <div className="glass-card flex flex-col h-[280px] overflow-hidden">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <i className="fa-solid fa-clock-rotate-left text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Upcoming Follow-ups</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all">
                        <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                    <span className="text-[8px] font-black text-indigo-600 uppercase cursor-pointer hover:underline">View All</span>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                {followups.map((f) => (
                    <div
                        key={f.id}
                        className={`p-3 rounded-xl border group hover:shadow-sm transition-all cursor-pointer ${f.priority === 'Hot'
                                ? 'bg-red-50/50 border-red-100 hover:bg-red-50'
                                : f.priority === 'Warm'
                                    ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
                                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span
                                className={`text-[8px] font-black uppercase ${f.priority === 'Hot' ? 'text-red-600' : f.priority === 'Warm' ? 'text-amber-600' : 'text-slate-500'
                                    }`}
                            >
                                Priority: {f.priority}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400">{f.time}</span>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-900">{f.title}</h4>
                        <p className="text-[8px] text-slate-500 mt-1 line-clamp-1">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
