'use client';

import { teleAgents } from '@/data/dummy';

interface TeleAgentsCardProps {
    onSelect?: (entity: any, type: 'agent') => void;
}

export default function TeleAgentsCard({ onSelect }: TeleAgentsCardProps) {
    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Online Agents</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[8px] font-black text-slate-400 uppercase">Live Now</span>
                </div>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar">
                {teleAgents.map((agent) => (
                    <div
                        key={agent.id}
                        onClick={() => onSelect?.(agent, 'agent')}
                        className={`px-3 py-2 cursor-pointer bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group flex items-center justify-between ${agent.status === 'OFFLINE' ? 'opacity-80 grayscale' : ''
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center text-white text-[9px] font-black shrink-0`}
                            >
                                {agent.id}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-900 leading-tight">{agent.name}</h4>
                                <p className="text-[7px] font-bold text-slate-500 mt-0.5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-envelope text-[8px] w-3"></i> {agent.email}
                                </p>
                                <p className="text-[7px] font-bold text-slate-500 mt-0.5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-phone text-[8px] w-3"></i> {agent.phone}
                                </p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end justify-between h-full gap-1.5">
                            <span
                                className={`${agent.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                    } text-[6px] font-black px-1.5 py-0.5 rounded uppercase`}
                            >
                                {agent.status}
                            </span>
                            <span className="text-[7px] font-black text-indigo-600 uppercase tracking-widest">Leads: {agent.leads}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
