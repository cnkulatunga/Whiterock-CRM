'use client';

interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    leads: number;
    color: string;
}

interface AgentDrawerProps {
    agent: Agent | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AgentDrawer({ agent, isOpen, onClose }: AgentDrawerProps) {
    if (!agent) return null;

    return (
        <div className={`fixed inset-0 z-[1100] flex justify-end overflow-hidden ${isOpen ? 'pointer-events-all' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/28 backdrop-blur-[3px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            {/* Panel */}
            <div className={`relative w-full max-w-[400px] bg-white h-full shadow-[-24px_0_60px_rgba(0,0,0,0.14)] border-l border-slate-100 flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Agent Profile</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                        <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>

                {/* Avatar + Info */}
                <div className="p-6 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
                    <div className={`w-20 h-20 rounded-2xl ${agent.color} flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4`}>
                        {agent.id}
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{agent.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tele Agent</p>
                    <span className={`mt-3 text-[9px] font-black px-2.5 py-1 rounded-md uppercase ${agent.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {agent.status}
                    </span>
                </div>

                {/* Details */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Information</h4>
                        <div className="space-y-2 bg-white border border-slate-100 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-envelope text-slate-300 w-4"></i>
                                <span className="text-[10px] font-bold text-slate-700">{agent.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-phone text-slate-300 w-4"></i>
                                <span className="text-[10px] font-bold text-slate-700">{agent.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Performance</h4>
                        <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Assigned Leads</span>
                                <span className="text-[13px] font-black text-indigo-600">{agent.leads}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((agent.leads / 50) * 100, 100)}%` }}></div>
                            </div>
                            <p className="text-[7px] font-bold text-slate-400 uppercase">{agent.leads} of 50 leads capacity</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Activity</h4>
                        <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
                            {[
                                { label: 'Calls Today', val: agent.status === 'ACTIVE' ? '12' : '0' },
                                { label: 'Follow-ups Due', val: agent.status === 'ACTIVE' ? '4' : '0' },
                                { label: 'Conversions', val: agent.status === 'ACTIVE' ? '3' : '0' },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between items-center text-[9px] font-bold border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                                    <span className="text-slate-400 uppercase">{r.label}</span>
                                    <span className="text-slate-900">{r.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2 shrink-0">
                    <a href={`mailto:${agent.email}`} className="py-2.5 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors text-center">
                        Message
                    </a>
                    <button className="py-2.5 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                        Assign Leads
                    </button>
                </div>
            </div>
        </div>
    );
}
