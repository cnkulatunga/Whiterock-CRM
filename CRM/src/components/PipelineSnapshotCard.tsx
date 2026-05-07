'use client';

import { useEffect, useState } from 'react';

const STAGE_COLORS: Record<string, string> = {
    new: '#f59e0b',
    collecting: '#64748b',
    verified: '#3b82f6',
    lender: '#8b5cf6',
    approved: '#16a34a',
    rejected: '#ef4444',
    completed: '#0891b2',
};

const STAGE_LABELS: Record<string, string> = {
    new: 'New',
    collecting: 'Collecting',
    verified: 'Verified',
    lender: 'Lender',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
};

interface StageCount {
    label: string;
    count: number;
    color: string;
}

interface AgentRow {
    id: string;
    name: string;
    total_leads: number;
    converted: number;
    conversion_rate: number;
}

export default function PipelineSnapshotCard() {
    const [stages, setStages] = useState<StageCount[]>([]);
    const [agents, setAgents] = useState<AgentRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/leads').then(r => r.ok ? r.json() : []),
            fetch('/api/analytics').then(r => r.ok ? r.json() : []),
        ]).then(([leadsData, analyticsData]) => {
            // Compute stage counts from leads list
            const leadList: any[] = Array.isArray(leadsData) ? leadsData : (leadsData?.results ?? []);
            const counts: Record<string, number> = {};
            for (const lead of leadList) {
                const s = lead.status || 'new';
                counts[s] = (counts[s] || 0) + 1;
            }
            const stageOrder = ['new', 'collecting', 'verified', 'lender', 'approved', 'rejected'];
            setStages(stageOrder.map(s => ({
                label: STAGE_LABELS[s] || s,
                count: counts[s] || 0,
                color: STAGE_COLORS[s] || '#6366f1',
            })));

            // Agent performance from analytics
            const agentList: AgentRow[] = Array.isArray(analyticsData) ? analyticsData : [];
            setAgents(agentList.slice(0, 5));
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const maxLeads = agents.length > 0 ? Math.max(...agents.map(a => a.total_leads), 1) : 1;

    return (
        <div className="glass-card card-h-std flex flex-col">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-diagram-project text-xs"></i>
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Pipeline Snapshot</h3>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                            ))}
                        </div>
                        <div className="space-y-3 mt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-5 bg-slate-100 rounded" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stage Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {stages.map(s => (
                                <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
                                    <div className="text-sm font-black text-slate-900 leading-none">{s.count}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Agent Bars */}
                        {agents.length > 0 && (
                            <div>
                                <h4 className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 mb-3">Agent Performance</h4>
                                <div className="space-y-3">
                                    {agents.map(agent => {
                                        const barPct = Math.round((agent.total_leads / maxLeads) * 100);
                                        return (
                                            <div key={agent.id} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{agent.name}</span>
                                                    <span className="text-[10px] font-black text-slate-900">{agent.total_leads} leads</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${barPct}%`, backgroundColor: '#6366f1' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {agents.length === 0 && (
                            <p className="text-[10px] text-slate-300 font-bold text-center uppercase tracking-widest">No agent data</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
