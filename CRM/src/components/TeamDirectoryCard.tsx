'use client';

const MEMBERS = [
    { name: 'Thanushika', role: 'Senior Agent', status: 'Online', lastActive: 'Now', color: '#6366f1' },
    { name: 'Ravindu', role: 'Support Agent', status: 'Away', lastActive: '12m ago', color: '#0891b2' },
    { name: 'Priya', role: 'Tele Agent', status: 'Online', lastActive: 'Now', color: '#16a34a' },
    { name: 'Amal', role: 'Junior Agent', status: 'Offline', lastActive: '2h ago', color: '#b45309' },
    { name: 'Nirosha', role: 'Tele Agent', status: 'Online', lastActive: 'Now', color: '#b91c1c' },
    { name: 'Kasun', role: 'Senior Agent', status: 'Online', lastActive: 'Now', color: '#7c3aed' },
];

export default function TeamDirectoryCard() {
    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50 sticky top-0 z-10 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-tight">Team Directory</h3>
                    <div className="flex items-center gap-1.5 ml-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Live Now</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {MEMBERS.map((member) => (
                    <div key={member.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm"
                            style={{ backgroundColor: member.color }}
                        >
                            {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-900 truncate">{member.name}</h4>
                                <span className={`text-[7px] font-black uppercase ${member.status === 'Online' ? 'text-emerald-500' :
                                        member.status === 'Away' ? 'text-amber-500' : 'text-slate-400'
                                    }`}>
                                    {member.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{member.role}</p>
                                <p className="text-[7px] font-medium text-slate-300">{member.lastActive}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
