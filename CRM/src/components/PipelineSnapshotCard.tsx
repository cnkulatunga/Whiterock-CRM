'use client';

const AGENTS = [
    { name: 'Thanushika', cases: 24, volume: '£1.2M', perf: 85, color: '#6366f1' },
    { name: 'Ravindu', cases: 18, volume: '£950k', perf: 72, color: '#0891b2' },
    { name: 'Priya', cases: 31, volume: '£2.1M', perf: 94, color: '#16a34a' },
    { name: 'Amal', cases: 15, volume: '£600k', perf: 60, color: '#b45309' },
    { name: 'Nirosha', cases: 22, volume: '£1.1M', perf: 78, color: '#b91c1c' },
];

const STAGES = [
    { label: 'Created', count: 48, status: 'slate' },
    { label: 'Pending', count: 32, status: 'amber' },
    { label: 'Verify', count: 18, status: 'blue' },
];

export default function PipelineSnapshotCard() {
    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-diagram-project text-xs"></i>
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Pipeline Snapshot</h3>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {/* Stage Grid */}
                <div className="grid grid-cols-3 gap-2">
                    {STAGES.map(s => (
                        <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
                            <div className="text-sm font-black text-slate-900 leading-none">{s.count}</div>
                            <div className="text-[7px] font-black text-slate-400 uppercase mt-1 tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Agent Bars */}
                <div>
                    <h4 className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 mb-3">Agent Performance</h4>
                    <div className="space-y-3">
                        {AGENTS.map(agent => (
                            <div key={agent.name} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-tight">{agent.name}</span>
                                    <span className="text-[8px] font-black text-slate-900">{agent.perf}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${agent.perf}%`, backgroundColor: agent.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
