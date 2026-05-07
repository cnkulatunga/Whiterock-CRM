'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';
import { INITIAL_LEADS, STAGES, Stage, STAGE_META } from '@/data/dummy';

/* ── Types ─────────────────────────────────────────────────── */
interface Lead {
    id: string; name: string; company: string; email: string;
    amount: string; agent: string | { id: string; name: string } | null;
    assigned_to?: { id: string; name: string } | null;
    status: string;
    priority: 'hot' | 'warm' | 'cool'; days: number; lender: string | { id: string; name: string } | null;
    notes: string; leadLevel?: string;
}

/* ── Helpers ────────────────────────────────────────────────── */
function agentName(agent: Lead['agent']): string {
    if (!agent) return '—';
    if (typeof agent === 'string') return agent;
    return agent.name || '—';
}

function lenderName(lender: Lead['lender']): string {
    if (!lender) return '—';
    if (typeof lender === 'string') return lender;
    return lender.name || '—';
}

/* ── Constants ──────────────────────────────────────────────── */
const PRIORITY_STYLE: Record<string, { bar: string; badge: string }> = {
    hot: { bar: '#ef4444', badge: 'bg-red-50 text-red-500' },
    warm: { bar: '#f59e0b', badge: 'bg-amber-50 text-amber-500' },
    cool: { bar: '#22c55e', badge: 'bg-green-50 text-green-600' },
};

const ROLE_LABEL: Record<string, string> = {
    'Super Admin': 'All Leads — Organisation Wide',
    'Accounts Manager': 'All Leads — All Teams',
    'Team Leader': 'Your Team Leads',
    'Tele Agent': 'Your Leads',
};

/* ── Small helpers ──────────────────────────────────────────── */
function Backdrop({ onClick, zIndex = 1000 }: { onClick: () => void; zIndex?: number }) {
    return (
        <div
            onClick={onClick}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.48)', backdropFilter: 'blur(2px)', zIndex }}
        />
    );
}

function ModalBox({ children, width = 480, zIndex = 1001, style }: { children: React.ReactNode; width?: number; zIndex?: number; style?: React.CSSProperties }) {
    return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex, pointerEvents: 'none' }}>
            <div style={{
                background: '#fff', borderRadius: 16, width, maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 24px 64px rgba(0,0,0,.2)', animation: 'slideUp .18s ease',
                pointerEvents: 'all', ...style,
            }}>
                {children}
            </div>
        </div>
    );
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            background: type === 'success' ? '#0f172a' : '#ef4444',
            color: '#fff', borderRadius: 10, padding: '10px 18px',
            fontSize: 11, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,.2)',
            animation: 'slideUp .2s ease', display: 'flex', alignItems: 'center', gap: 8,
        }}>
            <i className={`fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
            {msg}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════ */
export default function PipelinePage() {
    const { userRole, hasAction, isLoading: permsLoading } = usePermissions();
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [dataLoading, setDataLoading] = useState(true);
    const [lenderList, setLenderList] = useState<{ id: string; name: string; email: string; manager: string; manager_email: string }[]>([]);
    const [pipelineUsers, setPipelineUsers] = useState<{ id: string; name: string; role: string }[]>([]);

    useEffect(() => {
        setDataLoading(true);
        fetch('/api/pipeline')
            .then(res => res.json())
            .then(data => {
                const list = data.results ?? data;
                if (Array.isArray(list) && list.length > 0) setLeads(list);
            })
            .catch(() => {})
            .finally(() => setDataLoading(false));
    }, []);

    useEffect(() => {
        fetch('/api/users')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list: any[] = Array.isArray(data) ? data : (data?.results ?? []);
                setPipelineUsers(list.map(u => ({ id: u.id, name: u.name, role: u.role })));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        fetch('/api/lenders?status=Active')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                const items: any[] = Array.isArray(data) ? data : (data?.results ?? []);
                setLenderList(items.map(l => ({
                    id: l.id ?? l._id ?? '',
                    name: l.name ?? '',
                    email: l.email ?? '',
                    manager: l.manager ?? '',
                    manager_email: l.manager_email ?? '',
                })));
            })
            .catch(() => {});
    }, []);

    const finalizeMove = async () => {
        if (!pendingId || !pendingStage) return;
        try {
            const res = await fetch('/api/pipeline', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: pendingId, status: pendingStage }),
            });
            if (!res.ok) throw new Error('Update failed');
            setLeads(leads.map(l => l.id === pendingId ? { ...l, status: pendingStage } : l));
            showToast(`Lead moved to ${STAGE_META[pendingStage].label}`);
            setConfirmOpen(false);
            setPendingId(null);
            setPendingStage(null);
        } catch {
            showToast('Failed to move lead', 'error');
        }
    };

    const [search, setSearch] = useState('');
    const [agentFilter, setAgentFilter] = useState('');
    const [prioFilter, setPrioFilter] = useState('');

    const dragId = useRef<string | null>(null);

    const [pendingId, setPendingId] = useState<string | null>(null);
    const [pendingStage, setPendingStage] = useState<Stage | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [docViewerOpen, setDocViewerOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [reassignOpen, setReassignOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [addDrawerOpen, setAddDrawerOpen] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [showWorkflowViz, setShowWorkflowViz] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<{ name: string; docType: 'pdf' | 'img' } | null>(null);
    const [reassignQuery, setReassignQuery] = useState('');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const auditNotesRef = useRef<HTMLTextAreaElement>(null);
    const lenderNotesRef = useRef<HTMLTextAreaElement>(null);
    const finalLenderRef = useRef<HTMLSelectElement>(null);
    const rejNoteRef = useRef<HTMLTextAreaElement>(null);
    const genNoteRef = useRef<HTMLTextAreaElement>(null);
    const [selLenders, setSelLenders] = useState<string[]>([]);
    const [lenderDdOpen, setLenderDdOpen] = useState(false);

    const [newLead, setNewLead] = useState({ name: '', company: '', amount: '', agent: 'Sarah Jenkins', priority: 'warm', notes: '', leadLevel: 'Level 1' });

    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    /* ── Filter ─────────────────────────────────────────────── */
    const getFiltered = (stage: Stage) =>
        leads.filter(l =>
            l.status === stage &&
            (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase())) &&
            (!agentFilter || agentName(l.agent) === agentFilter) &&
            (!prioFilter || l.priority === prioFilter)
        );

    const totalValue = (stage: Stage) => {
        const list = getFiltered(stage);
        if (!list.length) return '';
        const sum = list.reduce((acc, l) => {
            const n = parseFloat(l.amount.replace(/[^0-9.]/g, ''));
            return acc + (isNaN(n) ? 0 : n);
        }, 0);
        const symbol = leads[0]?.amount?.startsWith('£') ? '£' : '$';
        if (sum >= 1_000_000) return `${symbol}${(sum / 1_000_000).toFixed(1)}M`;
        if (sum >= 1_000) return `${symbol}${(sum / 1_000).toFixed(0)}K`;
        return `${symbol}${sum}`;
    };

    /* ── Drag & Drop ────────────────────────────────────────── */
    const onDragStart = (e: React.DragEvent, id: string) => { dragId.current = id; };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,.07)';
        (e.currentTarget as HTMLElement).style.outline = '2px dashed #6366f1';
    };

    const onDragLeave = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).style.background = '';
        (e.currentTarget as HTMLElement).style.outline = '';
    };

    const onDrop = (e: React.DragEvent, targetStage: Stage) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.background = '';
        (e.currentTarget as HTMLElement).style.outline = '';
        const id = dragId.current;
        if (!id) return;
        const l = leads.find(x => x.id === id);
        if (!l || l.status === targetStage) { dragId.current = null; return; }

        const fromIdx = STAGES.indexOf(l.status as Stage);
        const toIdx = STAGES.indexOf(targetStage);
        const isNext = toIdx === fromIdx + 1;
        const isBack = toIdx < fromIdx;
        const isReject = targetStage === 'rejected';
        const isSkipOk = (l.status === 'collecting' && targetStage === 'lender') ||
                         (l.status === 'new' && targetStage === 'lender');

        if (!isNext && !isBack && !isReject && !isSkipOk) {
            showError(`You cannot skip to "${STAGE_META[targetStage].label}" from "${STAGE_META[l.status as Stage].label}". Follow the pipeline sequence.`, true);
            dragId.current = null;
            return;
        }

        if (!hasAction('pipeline', 'move_stages')) {
            showError('You do not have permission to move leads across the pipeline.');
            dragId.current = null;
            return;
        }

        if (targetStage === 'approved' && !['Super Admin', 'Admin', 'Team Leader'].includes(userRole || '')) {
            showError('Only Management roles can approve loans.');
            dragId.current = null;
            return;
        }

        setPendingId(dragId.current);
        setPendingStage(targetStage);
        setConfirmOpen(true);
        dragId.current = null;
    };

    const showError = (msg: string, withViz = false) => {
        setErrorMsg(msg);
        setShowWorkflowViz(withViz);
        setErrorOpen(true);
    };

    const confirmMove = () => {
        setConfirmOpen(false);
        setSelLenders([]);
        setLenderDdOpen(false);
        setUpdateOpen(true);
    };

    const saveAndMove = async () => {
        const l = leads.find(x => x.id === pendingId);
        if (!l || !pendingStage) return;
        const to = pendingStage;

        if (to === 'lender' && selLenders.length === 0) { showError('Select at least one target lender.'); return; }
        if (to === 'approved' && !finalLenderRef.current?.value) { showError('Select a confirmed funding partner before approving.'); return; }
        if (to === 'rejected' && !rejNoteRef.current?.value.trim()) { showError('Provide a specific rejection reason.'); return; }

        const auditNote = auditNotesRef.current?.value || '';
        const notes = auditNote ? `[AUDIT]: ${auditNote}\n${l.notes}` : (genNoteRef.current?.value || rejNoteRef.current?.value || l.notes);
        const lenderDisplay = to === 'lender' ? selLenders.join(', ') : to === 'approved' ? (finalLenderRef.current?.value || lenderName(l.lender)) : lenderName(l.lender);

        try {
            const body: Record<string, unknown> = { status: to, notes, days: 0 };
            const response = await fetch(`/api/leads/${l.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                setLeads(prev => prev.map(x => x.id === pendingId ? { ...x, status: to, notes, lender: lenderDisplay, days: 0 } : x));
                setUpdateOpen(false);
                showToast(`${l.name} moved to ${STAGE_META[to].label}`);
            } else {
                showError('Failed to save move to database.');
            }
        } catch {
            showError('Failed to save move to database.');
        }
    };

    /* ── Reassign ───────────────────────────────────────────── */
    const [reassignTargetId, setReassignTargetId] = useState<string | null>(null);
    const openReassign = (id: string) => { setReassignTargetId(id); setReassignQuery(''); setReassignOpen(true); };
    const doReassign = async (agentId: string, agentName_: string) => {
        if (!reassignTargetId) return;
        try {
            const res = await fetch(`/api/leads/${reassignTargetId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent_id: agentId }),
            });
            if (!res.ok) throw new Error();
            setLeads(prev => prev.map(x => x.id === reassignTargetId ? { ...x, agent: { id: agentId, name: agentName_ } } : x));
            setReassignOpen(false);
            showToast(`Lead reassigned to ${agentName_}`);
        } catch {
            showError('Failed to reassign lead.');
        }
    };

    /* ── Delete ─────────────────────────────────────────────── */
    const openDelete = (id: string) => { setDeleteTargetId(id); setDeleteOpen(true); };
    const doDelete = async () => {
        const l = leads.find(x => x.id === deleteTargetId);
        try {
            const response = await fetch(`/api/leads?id=${deleteTargetId}`, { method: 'DELETE' });
            if (response.ok) {
                setLeads(prev => prev.filter(x => x.id !== deleteTargetId));
                setDeleteOpen(false);
                showToast(`${l?.name} removed from pipeline`, 'error');
            }
        } catch {
            showError('Failed to delete lead from database.');
        }
    };

    /* ── Add lead ───────────────────────────────────────────── */
    const saveNewLead = async () => {
        if (!newLead.name || !newLead.company || !newLead.amount) { showError('Fill all required fields.'); return; }
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newLead.name, company: newLead.company, email: '',
                    amount: newLead.amount, agent: newLead.agent, status: 'new',
                    priority: newLead.priority, notes: newLead.notes, leadLevel: newLead.leadLevel
                })
            });
            if (response.ok) {
                const saved = await response.json();
                setLeads(prev => [saved, ...prev]);
                setNewLead({ name: '', company: '', amount: '', agent: 'Sarah Jenkins', priority: 'warm', notes: '', leadLevel: 'Level 1' });
                setAddDrawerOpen(false);
                showToast(`Lead registered: ${saved.id}`);
            }
        } catch {
            showError('Failed to register lead in database.');
        }
    };

    const pendingLead = leads.find(x => x.id === pendingId);

    const activeLeads = leads.filter(l => l.status !== 'rejected' && l.status !== 'completed');
    const totalPipeVal = activeLeads.reduce((a, l) => a + parseFloat(l.amount?.replace(/[^0-9.]/g, '') || '0'), 0);
    const symb = leads[0]?.amount?.startsWith('£') ? '£' : '$';
    const fmtVal = (v: number) => v >= 1_000_000 ? `${symb}${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${symb}${(v / 1_000).toFixed(0)}K` : `${symb}${v}`;

    const scopeLabel = userRole ? (ROLE_LABEL[userRole] || '') : '';

    if (permsLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

    return (
        <>
            <style>{`
                @keyframes slideUp { from { transform:translateY(10px);opacity:0 } to { transform:translateY(0);opacity:1 } }
                @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
                .lead-card { transition: box-shadow .15s, transform .15s; }
                .lead-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.09); transform: translateY(-2px); }
                .card-btn { transition: all .15s; cursor: pointer; border: none; }
                .card-btn:hover { filter: brightness(.9); }
                .doc-btn:hover { transform: scale(1.08); }
                input, select, textarea { font-family: inherit; }
                .custom-scroll::-webkit-scrollbar { width: 3px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scroll-h::-webkit-scrollbar { height: 4px; }
                .custom-scroll-h::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .lender-dd-item:hover { background: #f8fafc; }
                .lender-dd-item.selected { background: #eef2ff; }
                .lender-dd-item.selected label { color: #6366f1; }
                .agent-row:hover { background: #f8fafc; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#fafafa', minWidth: 0, height: '100vh', overflow: 'hidden' }}>

                {/* ── Top Bar ─────────────────────────────────── */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: 54 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <i className="fa-solid fa-diagram-project" style={{ color: '#6366f1', fontSize: 15 }} />
                        <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em', color: '#0f172a' }}>Loan Pipeline Board</span>
                        {scopeLabel && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginLeft: 2 }}>— {scopeLabel}</span>
                        )}
                        <div style={{ display: 'flex', gap: 12, marginLeft: 16, paddingLeft: 16, borderLeft: '1px solid #f1f5f9' }}>
                            <Stat label="Active" value={String(activeLeads.length)} color="#6366f1" />
                            <Stat label="Pipeline" value={fmtVal(totalPipeVal)} color="#166534" />
                            <Stat label="Approved" value={String(leads.filter(l => l.status === 'approved').length)} color="#1d4ed8" />
                            <Stat label="New Leads" value={String(leads.filter(l => l.status === 'new').length)} color="#f59e0b" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search case or client..."
                                style={inputStyle}
                            />
                            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8' }} />
                        </div>
                        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} style={inputStyle}>
                            <option value="">All Agents</option>
                            {pipelineUsers.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                        </select>
                        <select value={prioFilter} onChange={e => setPrioFilter(e.target.value)} style={inputStyle}>
                            <option value="">All Priority</option>
                            <option value="hot">Hot</option>
                            <option value="warm">Warm</option>
                            <option value="cool">Cool</option>
                        </select>
                        {hasAction('leads', 'create') && (
                            <Link
                                href="/leads/add"
                                style={{ height: 30, padding: '0 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                            >
                                <i className="fa-solid fa-plus" style={{ fontSize: 10 }} /> New Lead
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Kanban Board ─────────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', gap: 12, padding: 14, overflowX: 'auto', overflowY: 'hidden', alignItems: 'flex-start' }} className="custom-scroll-h">
                    {STAGES.map(stage => {
                        const m = STAGE_META[stage];
                        const cards = getFiltered(stage);
                        const val = totalValue(stage);
                        return (
                            <div key={stage} style={{ flex: '0 0 220px', minWidth: 220, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ background: m.hdr, borderRadius: '10px 10px 0 0', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: m.cnt, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <i className={`fa-solid ${m.icon}`} style={{ fontSize: 11 }} />
                                        {m.label}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {val && <span style={{ fontSize: 12, fontWeight: 900, color: m.cnt }}>{val}</span>}
                                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,.85)', color: m.cnt, minWidth: 20, textAlign: 'center' }}>{cards.length}</span>
                                    </div>
                                </div>

                                <div
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={e => onDrop(e, stage)}
                                    className="custom-scroll"
                                    style={{ flex: 1, background: m.body, borderRadius: '0 0 10px 10px', padding: 8, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7, minHeight: 200, transition: 'background .15s, outline .15s', outlineOffset: -3 }}
                                >
                                    {dataLoading && Array.from({ length: stage === 'new' ? 3 : stage === 'collecting' ? 2 : 1 }).map((_, i) => (
                                        <div key={i} className="animate-pulse" style={{ background: '#fff', borderRadius: 8, padding: 10, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                                            <div style={{ height: 9, width: '70%', background: '#f1f5f9', borderRadius: 4, marginBottom: 8 }} />
                                            <div style={{ height: 8, width: '50%', background: '#f8fafc', borderRadius: 4, marginBottom: 10 }} />
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <div style={{ height: 18, width: 40, background: '#f1f5f9', borderRadius: 20 }} />
                                                <div style={{ height: 18, width: 32, background: '#f1f5f9', borderRadius: 20 }} />
                                            </div>
                                        </div>
                                    ))}
                                    {!dataLoading && cards.map(l => (
                                        <LeadCard
                                            key={l.id}
                                            l={l}
                                            onReassign={openReassign}
                                            onDelete={openDelete}
                                            onDragStart={onDragStart}
                                            canDelete={hasAction('leads', 'delete')}
                                            canAssign={hasAction('leads', 'assign')}
                                            showAgentBadge={['Super Admin', 'Accounts Manager', 'Team Leader'].includes(userRole || '')}
                                        />
                                    ))}
                                    {!dataLoading && cards.length === 0 && (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 8px', border: '2px dashed #e2e8f0', borderRadius: 8 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: m.hdr, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                                <i className={`fa-solid ${m.icon}`} style={{ fontSize: 14, color: m.cnt }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#475569' }}>No cases here</span>
                                            <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', marginTop: 3, textAlign: 'center' }}>Drag a lead in or adjust filters</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                MODALS
            ══════════════════════════════════════════════════ */}

            {/* Confirm Move */}
            {confirmOpen && pendingId && pendingStage && (() => {
                const l = leads.find(x => x.id === pendingId)!;
                const to = pendingStage;
                const isToReject = to === 'rejected';
                return (
                    <>
                        <Backdrop onClick={() => setConfirmOpen(false)} zIndex={1000} />
                        <ModalBox width={420} zIndex={1001}>
                            <div style={{ background: '#0f172a', borderRadius: '14px 14px 0 0', padding: '16px 20px' }}>
                                <p style={{ fontSize: 11, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '.07em', margin: 0 }}>Confirm Lead Move</p>
                            </div>
                            <div style={{ padding: 20 }}>
                                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 2px' }}>{l.id}</p>
                                    <p style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', margin: 0 }}>{l.name}</p>
                                </div>
                                <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textAlign: 'center', marginBottom: 14 }}>
                                    Move this lead to <strong>{STAGE_META[to].label}</strong>?
                                </p>
                                {isToReject ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div style={{ flex: 1, padding: '8px 0', borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>{STAGE_META[l.status as Stage].label}</div>
                                        <i className="fa-solid fa-arrow-right" style={{ alignSelf: 'center', color: '#cbd5e1' }} />
                                        <div style={{ flex: 1, padding: '8px 0', borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>{STAGE_META[to].label}</div>
                                    </div>
                                ) : (
                                    <PipelineViz from={l.status as Stage} to={to} />
                                )}
                            </div>
                            <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button onClick={() => setConfirmOpen(false)} style={btnCancel}>Cancel</button>
                                <button onClick={confirmMove} style={btnConfirm}>Confirm & Continue</button>
                            </div>
                        </ModalBox>
                    </>
                );
            })()}

            {/* Update / Audit Modal */}
            {updateOpen && pendingId && pendingStage && (() => {
                const l = leads.find(x => x.id === pendingId)!;
                const from = l.status as Stage;
                const to = pendingStage;
                return (
                    <>
                        <Backdrop onClick={() => setUpdateOpen(false)} zIndex={1002} />
                        <ModalBox width={500} zIndex={1003}>
                            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 2px' }}>{l.id}</p>
                                    <p style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', margin: 0 }}>{l.name}</p>
                                </div>
                                <button onClick={() => setUpdateOpen(false)} style={closeBtn}><i className="fa-solid fa-xmark" /></button>
                            </div>

                            <div style={{ maxHeight: '65vh', overflowY: 'auto' }} className="custom-scroll">
                                {(to === 'verified' || (from === 'collecting' && to === 'lender')) && (
                                    <Section title="Audit Required Documents" icon="fa-file-shield" color="#1d4ed8">
                                        {[
                                            { name: 'Bank Statement Jan.pdf', type: 'pdf' as const, icon: 'fa-file-pdf', iconColor: '#ef4444', bg: '#fef2f2', date: 'PDF • 14 Apr 2026' },
                                            { name: 'ID Verification.jpg', type: 'img' as const, icon: 'fa-image', iconColor: '#3b82f6', bg: '#eff6ff', date: 'JPG • 14 Apr 2026' },
                                        ].map(doc => (
                                            <DocRow key={doc.name} doc={doc} onView={() => { setViewingDoc({ name: doc.name, docType: doc.type }); setDocViewerOpen(true); }} />
                                        ))}
                                        <ULabel>Verification Notes</ULabel>
                                        <textarea ref={auditNotesRef} placeholder="Document audit findings..." style={{ ...uInput, height: 64 }} />
                                    </Section>
                                )}

                                {(from === 'collecting' && to === 'lender') && <div style={{ height: 6, background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }} />}

                                {to === 'lender' && (
                                    <Section title="Selection & Submission" icon="fa-building-columns" color="#6d28d9">
                                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Classification:</span>
                                            <span style={{ background: '#eef2ff', color: '#4338ca', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, border: '1px solid #c7d2fe' }}>
                                                {l.leadLevel || 'Level 1'}
                                            </span>
                                        </div>
                                        <div style={{ position: 'relative', marginBottom: 12 }}>
                                            <div
                                                onClick={() => setLenderDdOpen(v => !v)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#1e293b' }}
                                            >
                                                <span>{selLenders.length === 0 ? 'Select Target Lenders (Max 4)' : selLenders.length === 1 ? selLenders[0] : `${selLenders.length} Lenders Selected`}</span>
                                                <i className={`fa-solid fa-chevron-${lenderDdOpen ? 'up' : 'down'}`} style={{ fontSize: 10, color: '#94a3b8' }} />
                                            </div>
                                            {lenderDdOpen && (
                                                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,.1)', zIndex: 50, padding: 8, maxHeight: 220, overflowY: 'auto' }} className="custom-scroll">
                                                    {lenderList.length === 0 && (
                                                        <div style={{ padding: '10px', textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>No active lenders found</div>
                                                    )}
                                                    {lenderList.map(ln => {
                                                        const checked = selLenders.includes(ln.name);
                                                        return (
                                                            <div
                                                                key={ln.id}
                                                                className={`lender-dd-item ${checked ? 'selected' : ''}`}
                                                                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 2 }}
                                                                onClick={() => {
                                                                    if (!checked && selLenders.length >= 4) { showError('Maximum 4 lenders per submission.'); return; }
                                                                    setSelLenders(prev => checked ? prev.filter(x => x !== ln.name) : [...prev, ln.name]);
                                                                }}
                                                            >
                                                                <input type="checkbox" checked={checked} onChange={() => { }} style={{ accentColor: '#6366f1', width: 14, height: 14, cursor: 'pointer' }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <label style={{ fontSize: 10, fontWeight: 700, color: checked ? '#6366f1' : '#475569', cursor: 'pointer', display: 'block' }}>{ln.name}</label>
                                                                    {ln.manager && <span style={{ fontSize: 9, color: '#94a3b8' }}>{ln.manager}{ln.manager_email ? ` · ${ln.manager_email}` : ''}</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <ULabel>Submission Email Draft</ULabel>
                                            <button onClick={() => setEmailOpen(true)} style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <i className="fa-solid fa-eye" /> PREVIEW FULL DRAFT
                                            </button>
                                        </div>
                                        <ULabel>Lender Submission Notes</ULabel>
                                        <textarea ref={lenderNotesRef} placeholder="Notes for lenders..." style={{ ...uInput, height: 64 }} />
                                    </Section>
                                )}

                                {to === 'approved' && (
                                    <Section title="Loan Approval Details" icon="fa-circle-check" color="#166534">
                                        <ULabel>Confirmed Lender *</ULabel>
                                        <select ref={finalLenderRef} style={{ ...uInput, marginBottom: 12 }}>
                                            <option value="">-- Select Partner --</option>
                                            {lenderList.map(ln => <option key={ln.id} value={ln.name}>{ln.name}</option>)}
                                        </select>
                                        <ULabel>Final Approval Notes</ULabel>
                                        <textarea ref={genNoteRef} placeholder="Offer details, rates, etc..." style={{ ...uInput, height: 72 }} />
                                    </Section>
                                )}

                                {to === 'rejected' && (
                                    <Section title="Rejection Details" icon="fa-circle-xmark" color="#b91c1c">
                                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#b91c1c', marginBottom: 10 }}>
                                            Provide the specific reason for rejecting this lead.
                                        </div>
                                        <ULabel>Rejection Reason *</ULabel>
                                        <textarea ref={rejNoteRef} placeholder="e.g. Credit score too low..." style={{ ...uInput, height: 88, borderColor: '#fca5a5' }} />
                                    </Section>
                                )}

                                {!['verified', 'lender', 'approved', 'rejected'].includes(to) && !(from === 'collecting' && to === 'lender') && (
                                    <div style={{ padding: 20 }}>
                                        <ULabel>Update Notes (Optional)</ULabel>
                                        <textarea ref={genNoteRef} defaultValue={l.notes} placeholder="Update details..." style={{ ...uInput, height: 80 }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button onClick={() => setUpdateOpen(false)} style={btnCancel}>Cancel</button>
                                <button onClick={saveAndMove} style={{ ...btnConfirm, background: '#4f46e5' }}>Save & Move Lead</button>
                            </div>
                        </ModalBox>
                    </>
                );
            })()}

            {/* Document Viewer */}
            {docViewerOpen && viewingDoc && (
                <>
                    <Backdrop onClick={() => setDocViewerOpen(false)} zIndex={2100} />
                    <ModalBox width={780} zIndex={2101} style={{ height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ background: '#0f172a', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderRadius: '14px 14px 0 0' }}>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '.07em' }}>
                                <i className="fa-solid fa-file-lines" style={{ marginRight: 8 }} /> Document Viewer — <span style={{ color: '#a5b4fc' }}>{viewingDoc.name}</span>
                            </span>
                            <button onClick={() => setDocViewerOpen(false)} style={closeBtn}><i className="fa-solid fa-xmark" /></button>
                        </div>
                        <div style={{ flex: 1, background: '#e2e8f0', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} className="custom-scroll">
                            {viewingDoc.docType === 'pdf' ? (
                                <div style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,.2)', padding: 48, width: '100%', maxWidth: 600, borderRadius: 10 }}>
                                    <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 14, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>STARLING BANK</div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>STATEMENT OF ACCOUNT</div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>JANUARY 2026</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 20 }}>
                                        <div><div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Customer Name</div><div style={{ fontSize: 13, fontWeight: 700 }}>Robert Miller</div></div>
                                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Account</div><div style={{ fontSize: 13, fontWeight: 700 }}>XXXX-5678</div></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8 }}><div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Total Inbound</div><div style={{ fontSize: 20, fontWeight: 900, color: '#16a34a' }}>£12,450.00</div></div>
                                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8 }}><div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Total Outbound</div><div style={{ fontSize: 20, fontWeight: 900, color: '#dc2626' }}>£8,120.45</div></div>
                                    </div>
                                    <div style={{ height: 140, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                                        <i className="fa-solid fa-table" style={{ fontSize: 28, color: '#cbd5e1' }} />
                                        <span style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase' }}>Transaction Log</span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', background: 'rgba(255,255,255,.8)', padding: '8px 18px', borderRadius: 99 }}>
                                        <i className="fa-solid fa-fingerprint" style={{ marginRight: 8, color: '#6366f1' }} /> Identity Verification Source
                                    </div>
                                    <div style={{ width: 480, height: 320, background: '#475569', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '8px solid #fff', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>
                                        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                            <i className="fa-solid fa-id-card" style={{ fontSize: 48, marginBottom: 10, display: 'block' }} />
                                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>ID Card Preview</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', flexShrink: 0, borderRadius: '0 0 14px 14px' }}>
                            <button onClick={() => setDocViewerOpen(false)} style={{ ...btnConfirm, padding: '9px 36px', background: '#6366f1' }}>Back to Audit</button>
                        </div>
                    </ModalBox>
                </>
            )}

            {/* Email Preview */}
            {emailOpen && pendingLead && (() => {
                const lenderNames = selLenders;
                const toAddresses = lenderNames.map(name => {
                    const found = lenderList.find(l => l.name === name);
                    if (!found) return name;
                    const email = found.manager_email || found.email;
                    const contact = found.manager || name;
                    return email ? `${contact} <${email}>` : contact;
                }).join('; ');

                const loanPurpose = pendingLead.notes?.trim() ? pendingLead.notes.trim() : 'General Business Funding';
                const lenderNote = lenderNotesRef.current?.value?.trim() || 'No additional notes provided.';
                const prio = typeof pendingLead.priority === 'string'
                    ? pendingLead.priority.charAt(0).toUpperCase() + pendingLead.priority.slice(1)
                    : 'Standard';

                const emailBody = `Dear ${lenderNames.length === 1 ? (lenderList.find(l => l.name === lenderNames[0])?.manager || 'Team') : 'Lending Partners'},

We are pleased to submit the following loan application on behalf of our client. Please review the details below and revert with your indicative pricing at your earliest convenience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENT & DEAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Case Reference   : ${pendingLead.id}
Client Name      : ${pendingLead.name}
Trading Name     : ${pendingLead.company || '—'}
Funding Required : ${pendingLead.amount}
Case Level       : ${pendingLead.leadLevel || 'Level 1'}
Priority         : ${prio}
Current Stage    : Document Verified — Ready for Lender Review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PURPOSE OF FUNDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${loanPurpose}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBMISSION NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${lenderNote}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All KYC, bank statements and supporting documents are attached to this submission. Please do not hesitate to contact us should you require any further information.

We look forward to receiving your offer.

Kind regards,
Whiterock Deal Desk
deal-flow@whiterock.com`;

                return (
                    <>
                        <Backdrop onClick={() => { setEmailOpen(false); setEmailSent(false); }} zIndex={2200} />
                        <ModalBox width={720} zIndex={2201}>
                            <div style={{ background: '#0f172a', borderRadius: '14px 14px 0 0', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '.07em' }}>
                                    <i className="fa-solid fa-envelope-open-text" style={{ marginRight: 8 }} /> Submission Email Preview
                                </span>
                                <button onClick={() => { setEmailOpen(false); setEmailSent(false); }} style={closeBtn}><i className="fa-solid fa-xmark" /></button>
                            </div>
                            <div style={{ padding: 24, background: '#f8fafc' }}>
                                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                    {/* Email headers */}
                                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                        {([
                                            ['From', 'Whiterock Deal Desk <deal-flow@whiterock.com>'],
                                            ['To', lenderNames.length > 0 ? toAddresses : '— Select lenders first —'],
                                            ['Subject', `LOAN APPLICATION — ${pendingLead.id} | ${pendingLead.name} | ${pendingLead.amount}`],
                                        ] as [string, string][]).map(([lbl, val]) => (
                                            <div key={lbl} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                                                <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', width: 52, flexShrink: 0, paddingTop: 1 }}>{lbl}:</span>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: lbl === 'To' ? '#6366f1' : lbl === 'Subject' ? '#0f172a' : '#475569', wordBreak: 'break-all' }}>{val}</span>
                                            </div>
                                        ))}
                                        {/* Selected lenders summary chips */}
                                        {lenderNames.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                                                {lenderNames.map(name => (
                                                    <span key={name} style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>
                                                        <i className="fa-solid fa-building-columns" style={{ marginRight: 5, fontSize: 9 }} />{name}
                                                    </span>
                                                ))}
                                                <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', alignSelf: 'center' }}>
                                                    {lenderNames.length} lender{lenderNames.length > 1 ? 's' : ''} selected (max 4)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Email body */}
                                    <div style={{ padding: '24px 28px', fontSize: 12, color: '#374151', lineHeight: 1.85, fontWeight: 500, whiteSpace: 'pre-line', minHeight: 320, fontFamily: 'monospace' }}>
                                        {emailBody}
                                    </div>
                                    {/* Attachments */}
                                    <div style={{ padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                                        <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Attachments</p>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {[{ icon: 'fa-file-pdf', color: '#ef4444', name: 'Bank_Statements.pdf' }, { icon: 'fa-file-image', color: '#3b82f6', name: 'DirectorID_Verification.jpg' }].map(f => (
                                                <div key={f.name} style={{ padding: '6px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                                                    <i className={`fa-solid ${f.icon}`} style={{ color: f.color }} />
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{f.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                <button onClick={() => setEmailOpen(false)} style={btnCancel}>Close Preview</button>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    {emailSent && (
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <i className="fa-solid fa-circle-check" /> Opened in email client
                                        </span>
                                    )}
                                    <button
                                        disabled={lenderNames.length === 0}
                                        onClick={() => {
                                            if (lenderNames.length === 0) return;
                                            const subject = encodeURIComponent(`LOAN APPLICATION — ${pendingLead.id} | ${pendingLead.name} | ${pendingLead.amount}`);
                                            const body = encodeURIComponent(emailBody);
                                            const toRaw = lenderNames.map(name => {
                                                const found = lenderList.find(l => l.name === name);
                                                return found?.manager_email || found?.email || '';
                                            }).filter(Boolean).join(',');
                                            window.open(`mailto:${toRaw}?subject=${subject}&body=${body}`, '_blank');
                                            setEmailSent(true);
                                        }}
                                        style={{
                                            ...btnConfirm,
                                            background: lenderNames.length === 0 ? '#cbd5e1' : '#16a34a',
                                            cursor: lenderNames.length === 0 ? 'not-allowed' : 'pointer',
                                            padding: '9px 22px',
                                            borderRadius: 99,
                                            boxShadow: lenderNames.length > 0 ? '0 4px 14px rgba(22,163,74,.3)' : 'none',
                                        }}
                                    >
                                        <i className="fa-solid fa-paper-plane" />
                                        Send Application
                                    </button>
                                </div>
                            </div>
                        </ModalBox>
                    </>
                );
            })()}

            {/* Reassign Modal */}
            {reassignOpen && (
                <>
                    <Backdrop onClick={() => setReassignOpen(false)} zIndex={3000} />
                    <ModalBox width={400} zIndex={3001}>
                        <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.07em', margin: 0 }}>Reassign Agent</p>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', margin: '2px 0 0' }}>
                                    {reassignTargetId} — Current: {agentName(leads.find(x => x.id === reassignTargetId)?.agent ?? null)}
                                </p>
                            </div>
                            <button onClick={() => setReassignOpen(false)} style={closeBtn}><i className="fa-solid fa-xmark" /></button>
                        </div>
                        <div style={{ padding: '14px 20px 6px' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    value={reassignQuery} onChange={e => setReassignQuery(e.target.value)}
                                    placeholder="Search team member..."
                                    style={{ ...uInput, paddingLeft: 32, marginBottom: 0 }}
                                />
                                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8' }} />
                            </div>
                        </div>
                        <div style={{ maxHeight: 280, overflowY: 'auto', padding: '8px 12px 14px' }} className="custom-scroll">
                            {pipelineUsers.filter(a => a.name.toLowerCase().includes(reassignQuery.toLowerCase()) || a.role.toLowerCase().includes(reassignQuery.toLowerCase())).map(a => (
                                <div
                                    key={a.id}
                                    className="agent-row"
                                    onClick={() => doReassign(a.id, a.name)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px', borderRadius: 10, cursor: 'pointer', border: '1px solid transparent', marginBottom: 2, transition: 'all .15s' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>{a.name[0]}</div>
                                        <div>
                                            <p style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', margin: 0 }}>{a.name}</p>
                                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: 0 }}>{a.role}</p>
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right" style={{ fontSize: 11, color: '#e2e8f0' }} />
                                </div>
                            ))}
                            {pipelineUsers.length === 0 && (
                                <p style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>No users found</p>
                            )}
                        </div>
                    </ModalBox>
                </>
            )}

            {/* Delete Modal */}
            {deleteOpen && deleteTargetId && (() => {
                const l = leads.find(x => x.id === deleteTargetId)!;
                return (
                    <>
                        <Backdrop onClick={() => setDeleteOpen(false)} zIndex={4000} />
                        <ModalBox width={380} zIndex={4001}>
                            <div style={{ padding: '32px 28px', textAlign: 'center' }}>
                                <div style={{ width: 60, height: 60, background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22 }}>
                                    <i className="fa-solid fa-trash-can" />
                                </div>
                                <h2 style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Delete Lead?</h2>
                                <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
                                    Are you sure you want to permanently delete <strong>{l.name}</strong> from the pipeline? This action cannot be undone.
                                </p>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => setDeleteOpen(false)} style={{ flex: 1, padding: '11px 0', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '.05em' }}>Go Back</button>
                                    <button onClick={doDelete} style={{ flex: 1, padding: '11px 0', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 10, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '.05em', boxShadow: '0 4px 14px rgba(220,38,38,.3)' }}>Delete</button>
                                </div>
                            </div>
                        </ModalBox>
                    </>
                );
            })()}

            {/* Error Alert */}
            {errorOpen && (
                <>
                    <Backdrop onClick={() => setErrorOpen(false)} zIndex={5000} />
                    <ModalBox width={460} zIndex={5001}>
                        <div style={{ background: '#ef4444', borderRadius: '14px 14px 0 0', padding: '14px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '.07em', margin: 0 }}>
                                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 8 }} />Action Restricted
                            </p>
                        </div>
                        <div style={{ padding: '22px 24px' }}>
                            <p style={{ fontSize: 11, color: '#374151', fontWeight: 600, textAlign: 'center', lineHeight: 1.6, marginBottom: showWorkflowViz ? 20 : 4 }}>{errorMsg}</p>
                            {showWorkflowViz && (
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px' }}>
                                    <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Required Pipeline Workflow</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {(['New', 'Collection', 'Verified', 'Lender', 'Approved'] as const).map((lbl, i) => (
                                            <React.Fragment key={lbl}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 4 ? '#eef2ff' : '#fff', border: `2px solid ${i === 4 ? '#6366f1' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: i === 4 ? '#6366f1' : '#94a3b8' }}>{i + 1}</div>
                                                    <span style={{ fontSize: 10, fontWeight: 800, color: i === 4 ? '#6366f1' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em' }}>{lbl}</span>
                                                </div>
                                                {i < 4 && <i className="fa-solid fa-arrow-right-long" style={{ color: '#e2e8f0', fontSize: 12 }} />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', background: '#f8fafc', borderRadius: '0 0 14px 14px' }}>
                            <button onClick={() => setErrorOpen(false)} style={{ ...btnConfirm, background: '#0f172a', padding: '10px 56px' }}>UNDERSTOOD</button>
                        </div>
                    </ModalBox>
                </>
            )}

            {/* Add Lead Drawer */}
            <>
                <div
                    onClick={() => setAddDrawerOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 6000, opacity: addDrawerOpen ? 1 : 0, pointerEvents: addDrawerOpen ? 'all' : 'none', transition: 'opacity .25s' }}
                />
                <div style={{ position: 'fixed', top: 0, right: addDrawerOpen ? 0 : -520, width: 500, height: '100vh', background: '#fff', zIndex: 6001, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,.15)', transition: 'right .3s cubic-bezier(.4,0,.2,1)' }}>
                    <div style={{ background: '#0f172a', padding: '16px 20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em' }}>Register New Lead</span>
                        <button onClick={() => setAddDrawerOpen(false)} style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-xmark" />
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} className="custom-scroll">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {([['Full Name', 'name', 'text'], ['Company Name', 'company', 'text'], ['Amount Needed', 'amount', 'text']] as [string, keyof typeof newLead, string][]).map(([lbl, key, typ]) => (
                                <div key={key}>
                                    <ULabel>{lbl} *</ULabel>
                                    <input type={typ} value={newLead[key]} onChange={e => setNewLead(p => ({ ...p, [key]: e.target.value }))} style={uInput} />
                                </div>
                            ))}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <ULabel>Agent</ULabel>
                                    <select value={newLead.agent} onChange={e => setNewLead(p => ({ ...p, agent: e.target.value }))} style={uInput}>
                                        {pipelineUsers.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <ULabel>Priority</ULabel>
                                    <select value={newLead.priority} onChange={e => setNewLead(p => ({ ...p, priority: e.target.value }))} style={uInput}>
                                        <option value="hot">Hot</option>
                                        <option value="warm">Warm</option>
                                        <option value="cool">Cool</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <ULabel>Lead Classification</ULabel>
                                <select value={newLead.leadLevel} onChange={e => setNewLead(p => ({ ...p, leadLevel: e.target.value }))} style={uInput}>
                                    <option value="Level 1">Level 1</option>
                                    <option value="Level 2">Level 2</option>
                                </select>
                            </div>
                            <div>
                                <ULabel>Notes</ULabel>
                                <textarea value={newLead.notes} onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))} style={{ ...uInput, height: 96 }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, flexShrink: 0 }}>
                        <button onClick={() => setAddDrawerOpen(false)} style={{ flex: 1, padding: '10px 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', color: '#64748b', letterSpacing: '.05em' }}>Cancel</button>
                        <button onClick={saveNewLead} style={{ flex: 1, padding: '10px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '.05em' }}>Register Lead</button>
                    </div>
                </div>
            </>

            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════════════ */

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 900, color }}>{value}</span>
        </div>
    );
}

function LeadCard({ l, onReassign, onDelete, onDragStart, canDelete, canAssign, showAgentBadge }: {
    l: Lead;
    onReassign: (id: string) => void;
    onDelete: (id: string) => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
    canDelete: boolean;
    canAssign: boolean;
    showAgentBadge: boolean;
}) {
    const ps = PRIORITY_STYLE[l.priority] || PRIORITY_STYLE.warm;
    const pLabel = l.priority.charAt(0).toUpperCase() + l.priority.slice(1);
    const [dragging, setDragging] = useState(false);
    const creator = agentName(l.agent);
    const assignee = l.assigned_to ? l.assigned_to.name : null;

    return (
        <div
            draggable
            onDragStart={(e) => { onDragStart(e, l.id); setTimeout(() => setDragging(true), 0); }}
            onDragEnd={() => setDragging(false)}
            className="lead-card"
            style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                padding: '8px 10px', cursor: 'grab', userSelect: 'none', position: 'relative',
                opacity: dragging ? .4 : 1,
                transform: dragging ? 'rotate(1.5deg) scale(.97)' : undefined,
            }}
        >
            <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 2px 2px 0', background: ps.bar }} />

            <div style={{ background: '#f8fafc', margin: '-8px -10px 8px', padding: '6px 12px', borderBottom: '1px solid #f1f5f9', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>{l.amount}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em' }}>{l.id}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, overflow: 'hidden' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', flexShrink: 0 }}>{l.name}</span>
                <span style={{ fontSize: 10, fontWeight: 900, background: '#eef2ff', color: '#4338ca', padding: '1px 6px', borderRadius: 5, border: '1px solid #c7d2fe', textTransform: 'uppercase' }}>{l.leadLevel === 'Level 2' ? 'L2' : 'L1'}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: .85 }}>{l.company}</span>
            </div>

            <div style={{ background: 'rgba(248,250,252,.6)', borderLeft: '2px solid #e2e8f0', padding: '5px 8px', marginBottom: 8 }}>
                <p style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as any }}>{l.notes || 'No notes.'}</p>
            </div>

            {/* Agent & assigned-to row */}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <i className="fa-solid fa-user" style={{ fontSize: 7 }} />
                <span>{creator}</span>
                {showAgentBadge && assignee && assignee !== creator && (
                    <>
                        <span style={{ color: '#e2e8f0' }}>·</span>
                        <i className="fa-solid fa-arrow-right-to-bracket" style={{ fontSize: 10, color: '#6366f1' }} />
                        <span style={{ color: '#6366f1' }}>{assignee}</span>
                    </>
                )}
                {lenderName(l.lender) !== '—' && (
                    <><span style={{ marginLeft: 4 }}>·</span> <i className="fa-solid fa-building-columns" style={{ fontSize: 7 }} /> {lenderName(l.lender)}</>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 7 }}>
                <span className={ps.badge} style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase', display: 'inline-block' }}>{pLabel}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {canAssign && (
                        <ActionBtn icon="fa-user-pen" title="Reassign" hoverColor="#6366f1" onClick={e => { e.stopPropagation(); onReassign(l.id); }} />
                    )}
                    {canDelete && (
                        <ActionBtn icon="fa-trash" title="Delete" hoverColor="#ef4444" onClick={e => { e.stopPropagation(); onDelete(l.id); }} />
                    )}
                    <a
                        href={`/leads/${l.id}`}
                        onClick={e => e.stopPropagation()}
                        style={{ height: 28, padding: '0 10px', background: '#f8fafc', color: '#6366f1', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', textDecoration: 'none', border: '1px solid #e0e7ff', transition: 'all .15s' }}
                    >
                        <i className="fa-solid fa-eye" style={{ fontSize: 8 }} /> VIEW
                    </a>
                </div>
            </div>
        </div>
    );
}

function ActionBtn({ icon, title, hoverColor, onClick }: { icon: string; title: string; hoverColor: string; onClick: (e: React.MouseEvent) => void }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            title={title}
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', color: hover ? hoverColor : '#94a3b8', transition: 'all .15s' }}
        >
            <i className={`fa-solid ${icon}`} style={{ fontSize: 10 }} />
        </button>
    );
}

function PipelineViz({ from, to }: { from: Stage; to: Stage }) {
    const mainStages: Stage[] = ['new', 'collecting', 'verified', 'lender', 'approved'];
    const nums: Record<Stage, number> = { new: 1, collecting: 2, verified: 3, lender: 4, approved: 5, rejected: 6 };
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '14px 20px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 42, right: 42, height: 2, background: '#e2e8f0', transform: 'translateY(-50%)', zIndex: 0 }} />
            {mainStages.map(s => {
                const isFrom = s === from;
                const isTo = s === to;
                return (
                    <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, zIndex: 1 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 900,
                            background: isTo ? '#6366f1' : isFrom ? '#f1f5f9' : '#fff',
                            border: `2px solid ${isTo ? '#6366f1' : isFrom ? '#94a3b8' : '#e2e8f0'}`,
                            color: isTo ? '#fff' : isFrom ? '#475569' : '#cbd5e1',
                        }}>{nums[s]}</div>
                        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', color: isTo ? '#6366f1' : isFrom ? '#475569' : '#cbd5e1' }}>
                            {STAGE_META[s].label.split(' ')[0]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function Section({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
    return (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f8fafc' }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className={`fa-solid ${icon}`} /> {title}
            </p>
            {children}
        </div>
    );
}

function DocRow({ doc, onView }: { doc: { name: string; icon: string; iconColor: string; bg: string; date: string }; onView: () => void }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: doc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: doc.iconColor, flexShrink: 0 }}>
                <i className={`fa-solid ${doc.icon}`} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', margin: 0 }}>{doc.date}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: '#f1f5f9', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em' }}>PENDING</span>
            <div style={{ display: 'flex', gap: 4, paddingLeft: 8, borderLeft: '1px solid #f1f5f9' }}>
                {[
                    { ic: 'fa-eye', cl: '#94a3b8', action: onView },
                    { ic: 'fa-arrow-up-from-bracket', cl: '#6366f1', action: () => { } },
                    { ic: 'fa-xmark', cl: '#ef4444', action: () => { } },
                    { ic: 'fa-check', cl: '#16a34a', action: () => { } },
                ].map((b, i) => (
                    <button key={i} onClick={b.action} className="doc-btn" style={{ width: 26, height: 26, borderRadius: 6, background: '#f8fafc', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: b.cl, transition: 'transform .15s' }}>
                        <i className={`fa-solid ${b.ic}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

function ULabel({ children }: { children: React.ReactNode }) {
    return <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{children}</label>;
}

/* ── Shared style objects ────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '7px 10px 7px 32px', fontSize: 10, fontWeight: 600, color: '#1e293b',
    outline: 'none', fontFamily: 'inherit',
};

const uInput: React.CSSProperties = {
    width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '8px 11px', fontSize: 11, fontWeight: 500, color: '#0f172a',
    outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, boxSizing: 'border-box',
};

const closeBtn: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 7, border: '1px solid #e2e8f0', background: '#f8fafc',
    color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
};

const btnCancel: React.CSSProperties = {
    padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
    color: '#64748b', fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em',
};

const btnConfirm: React.CSSProperties = {
    padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a',
    color: '#fff', fontSize: 10, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase',
    letterSpacing: '.05em', display: 'flex', alignItems: 'center', gap: 6,
};
