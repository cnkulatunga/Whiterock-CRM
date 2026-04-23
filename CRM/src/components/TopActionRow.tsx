'use client';

import { useState } from 'react';
import { notifications } from '@/data/dummy';

export default function TopActionRow() {
    const [showNotifs, setShowNotifs] = useState(false);

    return (
        <div className="flex items-center gap-2 px-6 pt-4 w-full shrink-0 min-h-[60px]">
            <div className="flex items-center gap-2 flex-nowrap flex-1 min-w-0 overflow-x-auto pb-2 custom-scrollbar">
                {[
                    { label: 'Leads', value: '1,284', trend: '+12%', icon: 'fa-users', color: 'indigo' },
                    { label: 'Connect', value: 'TEAMS', icon: 'fa-brands fa-microsoft', color: 'indigo' },
                    { label: 'Chat', value: 'WHATSAPP', icon: 'fa-brands fa-whatsapp', color: 'emerald' },
                    { label: 'Official', value: 'MAIL HUB', icon: 'fa-envelope', color: 'blue' },
                    { label: 'Utility', value: 'CALCULATOR', icon: 'fa-calculator', color: 'amber' },
                    { label: 'Layout', value: 'DESIGN MODE', icon: 'fa-wand-magic-sparkles', color: 'indigo' },
                    { label: 'Docs', value: 'UPLOAD', icon: 'fa-folder-open', color: 'indigo' },
                ].map((action, idx) => (
                    <div
                        key={idx}
                        className="glass-card p-2.5 flex items-center gap-3 hover:border-indigo-500/50 group transition-all min-w-[130px] cursor-pointer"
                    >
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 bg-${action.color}-50 text-${action.color}-600 group-hover:bg-${action.color}-600 group-hover:text-white`}
                        >
                            <i className={`fa-solid ${action.icon} text-sm`}></i>
                        </div>
                        <div className="truncate">
                            <h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {action.label}
                            </h4>
                            <p className="text-[10px] font-black text-slate-900 mt-1">
                                {action.value} {action.trend && <span className="text-[7px] text-emerald-500 ml-0.5">{action.trend}</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative shrink-0 ml-2">
                <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all hover:-translate-y-0.5"
                >
                    <i className="fa-solid fa-bell text-slate-400 text-sm"></i>
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center px-1 border-2 border-slate-50">
                        3
                    </span>
                </button>

                {showNotifs && (
                    <div className="absolute top-[50px] right-0 w-[340px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[500] overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <div className="text-[11px] font-black text-slate-900">Notifications</div>
                                <div className="text-[8px] font-bold text-slate-400">3 unread</div>
                            </div>
                            <button className="text-[8px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                Mark all read
                            </button>
                        </div>
                        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-3 border-b border-slate-50 flex items-start gap-3 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-indigo-50/30' : ''
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${n.color}`}>
                                        <i className={`fa-solid ${n.icon} text-xs`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-900">{n.title}</span>
                                            <span className="text-[7px] text-slate-400">{n.time}</span>
                                        </div>
                                        <p className="text-[8px] text-slate-500 mt-0.5">{n.desc}</p>
                                    </div>
                                    {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
