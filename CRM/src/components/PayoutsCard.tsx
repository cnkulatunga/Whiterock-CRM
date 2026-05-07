'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
    id: string;
    name: string;
    amount: string;
    status: string;
    priority: string;
    company: string;
    notes: string;
    leadLevel?: string;
    lender: string | { id: string; name: string } | null;
    agent: string | { id: string; name: string } | null;
}

function lenderName(lender: Lead['lender']): string {
    if (!lender) return '—';
    if (typeof lender === 'string') return lender || '—';
    return lender.name || '—';
}

function agentName(agent: Lead['agent']): string {
    if (!agent) return '—';
    if (typeof agent === 'string') return agent || '—';
    return agent.name || '—';
}

function parseAmount(amount: string): number {
    return parseFloat((amount ?? '').replace(/[^0-9.]/g, '')) || 0;
}

function fmtAmount(amount: string): string {
    const symbol = (amount ?? '').startsWith('£') ? '£' : '$';
    const n = parseAmount(amount);
    if (!n) return amount || '—';
    if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(0)}K`;
    return `${symbol}${n.toLocaleString()}`;
}

const PRIO_STYLE: Record<string, { bar: string; badge: string; text: string }> = {
    hot:  { bar: '#ef4444', badge: '#fef2f2', text: '#ef4444' },
    warm: { bar: '#f59e0b', badge: '#fffbeb', text: '#d97706' },
    cool: { bar: '#22c55e', badge: '#f0fdf4', text: '#16a34a' },
};

export default function PayoutsCard() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/pipeline')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                const list: Lead[] = Array.isArray(data) ? data : (data?.results ?? []);
                setLeads(list.filter(l => l.status === 'lender'));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const total = leads.reduce((acc, l) => acc + parseAmount(l.amount), 0);
    const symbol = leads[0]?.amount?.startsWith('£') ? '£' : '$';
    const totalLabel = total >= 1_000_000
        ? `${symbol}${(total / 1_000_000).toFixed(1)}M`
        : total >= 1_000
        ? `${symbol}${(total / 1_000).toFixed(0)}K`
        : `${symbol}${total.toLocaleString()}`;

    return (
        <div className="glass-card card-h-std flex flex-col overflow-hidden">
            <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#34d399', fontSize: 13, flexShrink: 0 }}></i>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>Pending Payouts</p>
                    <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Finance Centre</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Total:</span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#34d399' }}>{loading ? '...' : totalLabel}</span>
                </div>
                {!loading && leads.length > 0 && (
                    <span style={{ background: '#1f2937', color: '#6366f1', fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 20, border: '1px solid rgba(99,102,241,.3)' }}>
                        {leads.length}
                    </span>
                )}
            </div>

            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-1.5">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>Loading...</span>
                    </div>
                )}
                {!loading && leads.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>No leads in lender selection</span>
                    </div>
                )}
                {!loading && leads.map((lead) => {
                    const prio = lead.priority?.toLowerCase();
                    const ps = PRIO_STYLE[prio] ?? PRIO_STYLE.warm;
                    const ln = lenderName(lead.lender);
                    const ag = agentName(lead.agent);
                    const lvl = lead.leadLevel === 'Level 2' ? 'L2' : 'L1';

                    return (
                        <div
                            key={lead.id}
                            onClick={() => router.push(`/pipeline/${lead.id}`)}
                            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', position: 'relative', transition: 'border-color .15s' }}
                            className="hover:border-indigo-200"
                        >
                            {/* Priority bar */}
                            <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 2px 2px 0', background: ps.bar }} />

                            {/* Amount + ID header */}
                            <div style={{ background: '#f8fafc', margin: '-8px -10px 8px', padding: '5px 12px', borderBottom: '1px solid #f1f5f9', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>{lead.amount}</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{lead.id}</span>
                            </div>

                            {/* Name + Level + Company */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, overflow: 'hidden' }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', flexShrink: 0 }}>{lead.name}</span>
                                <span style={{ fontSize: 9, fontWeight: 900, background: '#eef2ff', color: '#4338ca', padding: '1px 5px', borderRadius: 5, border: '1px solid #c7d2fe', flexShrink: 0 }}>{lvl}</span>
                                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.company}</span>
                            </div>

                            {/* Notes */}
                            <div style={{ background: 'rgba(248,250,252,.6)', borderLeft: '2px solid #e2e8f0', padding: '4px 7px', marginBottom: 6 }}>
                                <p style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as any }}>
                                    {lead.notes || 'No notes.'}
                                </p>
                            </div>

                            {/* Agent + Lender */}
                            <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                <i className="fa-solid fa-user" style={{ fontSize: 7 }} />
                                <span>{ag}</span>
                                {ln !== '—' && (
                                    <>
                                        <span style={{ marginLeft: 2 }}>·</span>
                                        <i className="fa-solid fa-building-columns" style={{ fontSize: 7 }} />
                                        <span>{ln}</span>
                                    </>
                                )}
                            </div>

                            {/* Priority badge */}
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 6 }}>
                                <span style={{ background: ps.badge, color: ps.text, fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase' }}>
                                    {lead.priority?.charAt(0).toUpperCase()}{lead.priority?.slice(1)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
