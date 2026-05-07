'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast, ToastContainer } from '@/components/Toast';
import {
    LENDERS_DB, STAGE_LABELS, STAGE_COLOR,
    STAGE_BG, PRIO_STYLE, REM_COLOR, REM_ICON, STATUS_COLOR
} from '@/data/dummy';

/* ── Types ──────────────────────────────────────────────────── */
interface Lead {
    id: string; name: string;
    company: string; business?: string;
    amount: string;
    agent: string | { id: string; name: string } | null;
    companyBank?: string; bank?: string;
    status: string; stage?: string;
    priority: string;
    days: number;
    lender: string | { id: string; name: string } | null;
    notes: string; payoutStatus?: 'Yes' | 'No';
    leadLevel?: string; level?: string;
    email?: string; phone?: string;
    quality?: string; type?: string;
}
interface Note { id?: string; author: string; time: string; text: string; }
interface Reminder { id?: string; type: string; title: string; assignee: string; assignee_id?: string; due: string; status: string; note?: string; }
interface DocRecord { id: string; name: string; type: string; status: string; uploadedBy: string; uploadedAt: string; url: string; }
interface AuditEntry { id: string; user_name: string; action: string; entity_type: string; entity_id: string; timestamp: string; }
interface UserOption { id: string; name: string; role: string; }

const STAGE_ORDER = ['new', 'collecting', 'verified', 'lender', 'approved', 'completed'];

function normalizeLead(raw: any): Lead {
    return {
        ...raw,
        business: raw.company || raw.business || '',
        bank: raw.companyBank || raw.bank || '—',
        stage: raw.status || raw.stage || 'new',
        agent: typeof raw.agent === 'object' && raw.agent ? raw.agent.name : (raw.agent || '—'),
        lender: typeof raw.lender === 'object' && raw.lender ? raw.lender.name : (raw.lender || '—'),
        priority: raw.priority === 'hot' ? 'High' : raw.priority === 'cool' ? 'Low' : 'Medium',
        payoutStatus: raw.payoutStatus ?? (raw.status === 'approved' ? 'Yes' : 'No'),
        leadLevel: raw.level || raw.leadLevel || 'Level 1',
    };
}

// Store raw agent object so we can get agent id for notifications
function extractAgentId(raw: any): string | null {
    if (raw?.agent && typeof raw.agent === 'object') return raw.agent.id ?? null;
    return null;
}

function fmtTimestamp(ts: string) {
    if (!ts) return '—';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function now() {
    return fmtTimestamp(new Date().toISOString());
}

/* ═══════════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════════ */
export default function LeadDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { hasAction } = usePermissions();
    const { toasts, remove, toast } = useToast();
    const canAssign = hasAction('tasks', 'assign');

    const [lead, setLead] = useState<Lead | null>(null);
    const [agentId, setAgentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [aiState, setAiState] = useState<'idle' | 'loading' | 'done'>('idle');
    const [aiText, setAiText] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [remindersLoading, setRemindersLoading] = useState(true);
    const [docs, setDocs] = useState<DocRecord[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [previewDoc, setPreviewDoc] = useState<DocRecord | null>(null);
    const [uploading, setUploading] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);
    const [notifyDone, setNotifyDone] = useState(false);
    const [editForm, setEditForm] = useState<Lead | null>(null);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [remType, setRemType] = useState('Call');
    const [remTitle, setRemTitle] = useState('');
    const [remDate, setRemDate] = useState('');
    const [remAssignee, setRemAssignee] = useState('');
    const [remAssigneeId, setRemAssigneeId] = useState('');
    const [remNote, setRemNote] = useState('');
    const [savingRem, setSavingRem] = useState(false);

    // Load lead
    useEffect(() => {
        fetch(`/api/leads/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                const normalized = normalizeLead(data);
                setLead(normalized);
                setEditForm(normalized);
                setAgentId(extractAgentId(data));
                const agentName = typeof normalized.agent === 'string' ? normalized.agent : '—';
                setRemAssignee(agentName);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    // Load notes scoped to this lead
    useEffect(() => {
        if (!id) return;
        setNotesLoading(true);
        fetch(`/api/notes?lead_id=${id}`)
            .then(r => r.json())
            .then(data => {
                const list: Note[] = (Array.isArray(data) ? data : []).map((n: any) => ({
                    id: n.id,
                    author: n.created_by?.name ?? 'Unknown',
                    time: fmtTimestamp(n.created_at),
                    text: n.text,
                }));
                setNotes(list);
            })
            .catch(() => {})
            .finally(() => setNotesLoading(false));
    }, [id]);

    // Load tasks/reminders scoped to this lead
    const loadReminders = useCallback(() => {
        if (!id) return;
        setRemindersLoading(true);
        fetch(`/api/tasks?lead_id=${id}`)
            .then(r => r.json())
            .then(data => {
                const list = (Array.isArray(data) ? data : (data?.results ?? [])).map((t: any) => ({
                    id: t.id,
                    type: t.type || 'Call',
                    title: t.title,
                    assignee: t.assignee?.name ?? '',
                    assignee_id: t.assignee?.id ?? '',
                    due: t.date ?? '',
                    status: t.status ?? 'Pending',
                    note: t.description ?? '',
                }));
                setReminders(list);
            })
            .catch(() => {})
            .finally(() => setRemindersLoading(false));
    }, [id]);

    useEffect(() => { loadReminders(); }, [loadReminders]);

    // Load documents
    useEffect(() => {
        if (!id) return;
        fetch(`/api/leads/${id}/documents`)
            .then(r => r.json())
            .then(data => { setDocs(Array.isArray(data) ? data : []); setDocsLoading(false); })
            .catch(() => setDocsLoading(false));
    }, [id]);

    // Load audit log for timeline
    useEffect(() => {
        if (!id) return;
        fetch(`/api/audit?entity_type=Lead&entity_id=${id}`)
            .then(r => r.json())
            .then(data => { setAuditLog(Array.isArray(data) ? data : []); })
            .catch(() => {});
    }, [id]);

    // Load real users for assignee dropdown
    useEffect(() => {
        if (!canAssign) return;
        fetch('/api/users')
            .then(r => r.json())
            .then(data => {
                const list: UserOption[] = (Array.isArray(data) ? data : []).map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    role: u.role,
                }));
                setUsers(list);
                if (list.length > 0 && !remAssigneeId) {
                    setRemAssignee(list[0].name);
                    setRemAssigneeId(list[0].id);
                }
            })
            .catch(() => {});
    }, [canAssign]);

    if (loading) return (
        <div className="flex-1 flex flex-col bg-[#fafafa] h-screen overflow-hidden animate-pulse">
            <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3 shrink-0">
                <div className="h-7 w-16 bg-slate-100 rounded-lg" />
                <div className="w-px h-5 bg-slate-100" />
                <div className="space-y-1.5">
                    <div className="h-2.5 w-10 bg-slate-100 rounded" />
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                </div>
                <div className="flex gap-2 ml-2">
                    <div className="h-5 w-16 bg-slate-100 rounded-full" />
                    <div className="h-5 w-20 bg-slate-100 rounded-full" />
                    <div className="h-5 w-18 bg-slate-100 rounded-full" />
                </div>
                <div className="ml-auto h-7 w-16 bg-slate-100 rounded-lg" />
            </div>
            <div className="flex-1 p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-hidden lg:grid-rows-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                        <div className="h-9 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-2">
                            <div className="h-2.5 w-24 bg-slate-100 rounded" />
                        </div>
                        <div className="flex-1 p-3 space-y-2.5">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="flex items-center gap-2 py-1">
                                    <div className="h-2 w-12 bg-slate-100 rounded shrink-0" />
                                    <div className={`h-2.5 bg-slate-100 rounded ${j % 3 === 0 ? 'w-32' : j % 3 === 1 ? 'w-24' : 'w-20'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    if (!lead) return <div className="flex-1 flex items-center justify-center">Lead not found</div>;

    const leadStage = (lead as any).stage || lead.status || 'new';
    const leadAgent = typeof lead.agent === 'string' ? lead.agent : (lead.agent as any)?.name || '—';
    const leadLender = typeof lead.lender === 'string' ? lead.lender : (lead.lender as any)?.name || '—';
    const leadBusiness = lead.company || (lead as any).business || '';
    const leadBank = (lead as any).companyBank || (lead as any).bank || '—';

    /* docs handlers */
    const uploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        try {
            const res = await fetch(`/api/leads/${id}/documents`, { method: 'POST', body: form });
            if (res.ok) {
                const doc = await res.json();
                setDocs(prev => [...prev, doc]);
                toast.success('Document uploaded.');
            } else {
                toast.error('Upload failed.');
            }
        } finally {
            setUploading(false);
            if (uploadRef.current) uploadRef.current.value = '';
        }
    };

    const deleteDoc = async (docId: string) => {
        await fetch(`/api/leads/${id}/documents/${docId}`, { method: 'DELETE' });
        setDocs(prev => prev.filter(d => d.id !== docId));
        if (previewDoc?.id === docId) setPreviewDoc(null);
    };

    const updateDocStatus = async (docId: string, newStatus: string) => {
        const res = await fetch(`/api/leads/${id}/documents/${docId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            const updated = await res.json();
            setDocs(prev => prev.map(d => d.id === docId ? updated : d));
        }
    };

    /* timeline — built from real audit log */
    const TIMELINE_STAGES = [
        { action: /created/i, icon: 'fa-plus', color: '#6366f1', label: 'Lead Created' },
        { action: /collecting|documents collected/i, icon: 'fa-file-arrow-up', color: '#3b82f6', label: 'Documents Collected' },
        { action: /verified|docs verified/i, icon: 'fa-file-circle-check', color: '#10b981', label: 'Docs Verified' },
        { action: /lender/i, icon: 'fa-building-columns', color: '#8b5cf6', label: 'Lender Selected' },
        { action: /approved|completed|rejected/i, icon: leadStage === 'rejected' ? 'fa-circle-xmark' : 'fa-circle-check', color: leadStage === 'rejected' ? '#ef4444' : '#22c55e', label: leadStage === 'rejected' ? 'Loan Rejected' : 'Loan Confirmed' },
    ];

    const stageStep = STAGE_ORDER.indexOf(leadStage);
    const timeline = TIMELINE_STAGES.map((def, idx) => {
        const match = auditLog.find(a => def.action.test(a.action));
        const done = idx <= stageStep || (leadStage === 'rejected' && idx === 4);
        return {
            ...def,
            sub: match ? `By ${match.user_name}` : (idx === 0 ? `By ${leadAgent}` : '—'),
            time: match ? fmtTimestamp(match.timestamp) : (done ? '—' : ''),
            done,
        };
    });

    /* ── AI Summary ─────────────────────────────────────────── */
    const generateAI = () => {
        if (aiState === 'loading') return;
        setAiState('loading');
        setTimeout(() => {
            setAiText(`${lead.priority}-priority lead requiring ${lead.priority === 'High' ? 'immediate' : 'timely'} attention. ${lead.name} (${leadBusiness}) seeking ${lead.amount} for business funding${leadBank !== '—' ? ', banking with ' + leadBank : ''}. Currently at <strong>${STAGE_LABELS[leadStage]}</strong> stage with ${lead.days} day${lead.days !== 1 ? 's' : ''} elapsed. ${lead.payoutStatus === 'Yes' ? 'Payout confirmed via ' + (leadLender || 'lender') + '.' : 'Payout pending — account manager action required.'}`);
            setAiState('done');
        }, 1400);
    };

    /* ── Edit / Save ─────────────────────────────────────────── */
    const saveChanges = async () => {
        if (!editForm) return;
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editForm.name,
                    company: editForm.company || (editForm as any).business,
                    amount: editForm.amount,
                    status: (editForm as any).stage || editForm.status,
                    priority: editForm.priority === 'High' ? 'hot' : editForm.priority === 'Low' ? 'cool' : 'warm',
                    level: editForm.leadLevel || editForm.level || 'Level 1',
                    notes: editForm.notes,
                    companyBank: (editForm as any).bank || (editForm as any).companyBank || '',
                })
            });
            if (response.ok) {
                const saved = normalizeLead(await response.json());
                setLead(saved);
                setEditing(false);
                toast.success('Changes saved.');
            } else {
                toast.error('Failed to save changes.');
            }
        } catch {
            toast.error('Could not reach server. Please try again.');
        }
    };
    const cancelEdit = () => { setEditForm({ ...lead }); setEditing(false); };

    /* ── Notes ───────────────────────────────────────────────── */
    const saveNote = async () => {
        if (!noteText.trim() || savingNote) return;
        setSavingNote(true);
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: noteText.trim(), lead_id: id }),
            });
            if (res.ok) {
                const n = await res.json();
                setNotes(prev => [{
                    id: n.id,
                    author: n.created_by?.name ?? 'You',
                    time: fmtTimestamp(n.created_at),
                    text: n.text,
                }, ...prev]);
                setNoteText('');
            } else {
                toast.error('Failed to save note.');
            }
        } catch {
            toast.error('Could not reach server.');
        } finally {
            setSavingNote(false);
        }
    };

    /* ── Reminders / Tasks ───────────────────────────────────── */
    const addReminder = async () => {
        if (!remTitle.trim() || !remDate || savingRem) return;
        setSavingRem(true);
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: remTitle,
                    type: remType,
                    status: 'Pending',
                    date: remDate,
                    description: remNote,
                    assignee_id: remAssigneeId || undefined,
                    lead_id: id,
                }),
            });
            if (res.ok) {
                const t = await res.json();
                setReminders(prev => [{
                    id: t.id,
                    type: t.type || remType,
                    title: t.title,
                    assignee: t.assignee?.name ?? remAssignee,
                    assignee_id: t.assignee?.id ?? remAssigneeId,
                    due: t.date ?? remDate,
                    status: t.status ?? 'Pending',
                    note: t.description ?? remNote,
                }, ...prev]);
                setRemTitle(''); setRemDate(''); setRemNote('');
            } else {
                toast.error('Failed to add reminder.');
            }
        } catch {
            toast.error('Could not reach server.');
        } finally {
            setSavingRem(false);
        }
    };

    const updateReminderStatus = async (idx: number, newStatus: string) => {
        const rem = reminders[idx];
        const next = [...reminders];
        next[idx] = { ...next[idx], status: newStatus };
        setReminders(next);
        if (rem.id) {
            await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: rem.id, status: newStatus }),
            }).catch(() => {});
        }
    };

    /* ── Payout toggle — persisted ───────────────────────────── */
    const togglePayout = async () => {
        if (!lead) return;
        const newStatus = lead.payoutStatus === 'Yes' ? 'No' : 'Yes';
        setLead({ ...lead, payoutStatus: newStatus });
        await fetch(`/api/leads/${lead.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payoutStatus: newStatus }),
        }).catch(() => {});
    };

    /* ── Notify Account Manager ──────────────────────────────── */
    const notifyAccountManager = async () => {
        const ts = now();
        const msg = `SYSTEM ALERT: Admin requested an immediate payout update for this file from Account Manager (${leadAgent}).`;

        // Create task linked to this lead
        const taskRes = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'URGENT: Payout Update Requested',
                type: 'Follow-up',
                status: 'Pending',
                date: ts.split(' ')[0],
                description: msg,
                assignee_id: agentId || undefined,
                lead_id: id,
            }),
        });

        if (taskRes.ok) {
            const t = await taskRes.json();
            setReminders(prev => [{
                id: t.id,
                type: 'Follow-up',
                title: 'URGENT: Payout Update Requested',
                assignee: t.assignee?.name ?? leadAgent,
                assignee_id: t.assignee?.id ?? agentId ?? '',
                due: ts.split(' ')[0],
                status: 'Pending',
                note: msg,
            }, ...prev]);
        }

        // Create notification for agent if we have their id
        if (agentId) {
            await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Payout Update Required',
                    desc: `Action needed on lead: ${lead.name}`,
                    user_id: agentId,
                }),
            }).catch(() => {});
        }

        // Add a system note
        const noteRes = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: msg, lead_id: id }),
        });
        if (noteRes.ok) {
            const n = await noteRes.json();
            setNotes(prev => [{ id: n.id, author: n.created_by?.name ?? 'System', time: fmtTimestamp(n.created_at), text: n.text }, ...prev]);
        }

        setNotifyDone(true);
        setTimeout(() => setNotifyDone(false), 3000);
        toast.success('Account Manager notified.');
    };

    /* ── Helpers ─────────────────────────────────────────────── */
    const ps = PRIO_STYLE[lead.priority] || PRIO_STYLE['Medium'];

    /* ═════════════════════════════════════════════════════════
       RENDER
    ═════════════════════════════════════════════════════════ */
    return (
        <>
            <ToastContainer toasts={toasts} remove={remove} />
            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 3px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .panel-hdr { padding: 7px 12px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #64748b; border-bottom: 1px solid #f1f5f9; background: #f8fafc; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
                .info-row { display: flex; align-items: center; gap: 6px; padding: 5px 0; border-bottom: 1px solid #f8fafc; transition: background .15s; }
                .info-row:hover { background: #f8fafc; }
                .info-lbl { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; width: 58px; flex-shrink: 0; }
                .info-val { font-size: 10px; font-weight: 600; color: #0f172a; flex: 1; min-width: 0; }
                .note-item { padding: 7px 9px; border-radius: 7px; background: #f8fafc; margin-bottom: 5px; border: 1px solid #f1f5f9; }
                .reminder-item { padding: 7px 9px; border-radius: 7px; background: #f8fafc; margin-bottom: 5px; border: 1px solid #f1f5f9; }
                .btn-sm { display:inline-flex; align-items:center; gap:4px; padding:4px 11px; border-radius:6px; font-size:8px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; border:none; font-family:inherit; transition:all .15s; }
                input, select, textarea { font-family: inherit; }
                .field-edit { width:100%; border:1px solid #c7d2fe; border-radius:5px; padding:3px 7px; font-size:10px; font-weight:700; outline:none; background:#fff; }
                .field-edit:focus { box-shadow: 0 0 0 2px #e0e7ff; }
                @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
                .fade-in { animation: fadeIn .2s ease; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#fafafa', minWidth: 0, height: '100vh', overflow: 'hidden' }}>

                {/* ── Top Bar ───────────────────────────────── */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            onClick={() => router.back()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, background: '#f1f5f9', color: '#475569', border: 'none', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer' }}
                        >
                            <i className="fa-solid fa-arrow-left" style={{ fontSize: 8 }} /> Back
                        </button>
                        <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>#{lead.id}</p>
                            <h1 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2, letterSpacing: '-.01em' }}>{lead.name}</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>{lead.leadLevel || 'Level 1'}</span>
                            <span style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{lead.priority} Priority</span>
                            <span style={{ background: STAGE_BG[leadStage], color: STAGE_COLOR[leadStage], border: `1px solid ${STAGE_COLOR[leadStage]}33`, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{STAGE_LABELS[leadStage]}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {editing ? (
                            <>
                                <button onClick={saveChanges} className="btn-sm" style={{ background: '#eef2ff', color: '#4338ca' }}><i className="fa-solid fa-check" /> Save Changes</button>
                                <button onClick={cancelEdit} className="btn-sm" style={{ background: '#f1f5f9', color: '#475569' }}><i className="fa-solid fa-xmark" /> Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => { setEditForm({ ...lead }); setEditing(true); }} className="btn-sm" style={{ background: '#f1f5f9', color: '#475569' }}>
                                <i className="fa-solid fa-pen" /> Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Content Grid ──────────────────────────── */}
                <style>{`
                  @media (max-width: 900px) {
                    .lead-panel-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; overflow-y: auto !important; }
                    .lead-panel-grid > * { grid-column: span 1 !important; }
                  }
                  @media (max-width: 580px) {
                    .lead-panel-grid { grid-template-columns: 1fr !important; }
                  }
                `}</style>
                <div style={{ flex: 1, overflow: 'hidden', padding: '12px 14px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div className="lead-panel-grid" style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: '3fr 2fr', gap: 10 }}>

                        {/* ── AI Summary ── cols 1-4, row 1 ─── */}
                        <Panel style={{ gridColumn: '1 / 5' }}>
                            <div className="panel-hdr" style={{ background: '#fff', borderBottom: '1px solid #eef2ff', padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, background: '#4f46e5', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px #4f46e540' }}>
                                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#fff', fontSize: 14 }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', letterSpacing: '-.01em' }}>AI Lead Summary</div>
                                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Powered by lead data</div>
                                    </div>
                                </div>
                                <button
                                    onClick={generateAI}
                                    style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 13px', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', letterSpacing: '.04em', opacity: aiState === 'loading' ? .6 : 1 }}
                                >
                                    <i className={`fa-solid ${aiState === 'loading' ? 'fa-spinner fa-spin' : aiState === 'done' ? 'fa-rotate' : 'fa-wand-magic-sparkles'}`} />
                                    {aiState === 'loading' ? 'GENERATING...' : aiState === 'done' ? 'REGENERATE' : 'GENERATE'}
                                </button>
                            </div>
                            <div className="panel-body custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', minHeight: 0 }}>
                                {aiState === 'done' ? (
                                    <div className="fade-in">
                                        <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                                            <p style={{ fontSize: 10, color: '#312e81', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }} dangerouslySetInnerHTML={{ __html: aiText }} />
                                        </div>
                                        <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: '#94a3b8', marginBottom: 8 }}>Key Data Points</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                            {[['Status', lead.priority + ' Priority'], ['Amount', lead.amount], ['Stage', STAGE_LABELS[leadStage] || leadStage], ['Bank', leadBank !== '—' ? leadBank : 'N/A'], ['Agent', leadAgent], ['Days', lead.days + 'd in stage'], ['Payout', lead.payoutStatus === 'Yes' ? 'Confirmed' : 'Pending'], ['Lender', leadLender !== '—' ? leadLender : 'N/A']].map(([l, v]) => (
                                                <div key={l} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 7, padding: '7px 10px' }}>
                                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#94a3b8' }}>{l}</div>
                                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{v}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
                                        {aiState === 'loading' ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 28, color: '#c7d2fe' }} />
                                                <span style={{ fontSize: 10, color: '#94a3b8' }}>Generating summary...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 28, color: '#c7d2fe' }} />
                                                <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>Click Generate to create an AI summary for this lead</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Panel>

                        {/* ── Notes ── cols 5-8, row 1 ──────── */}
                        <Panel style={{ gridColumn: '5 / 9' }}>
                            <div className="panel-hdr">
                                <span><i className="fa-solid fa-note-sticky" style={{ color: '#f59e0b', marginRight: 6 }} />Notes <span style={{ fontWeight: 400, opacity: .6 }}>{notes.length}</span></span>
                            </div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: 8, minHeight: 0 }}>
                                {notesLoading ? (
                                    <div style={{ padding: '8px 0' }}>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="animate-pulse note-item" style={{ marginBottom: 6 }}>
                                                <div style={{ height: 8, width: '80%', background: '#f1f5f9', borderRadius: 4, marginBottom: 6 }} />
                                                <div style={{ height: 8, width: '50%', background: '#f1f5f9', borderRadius: 4 }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : notes.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6, padding: '24px 0' }}>
                                        <i className="fa-solid fa-note-sticky" style={{ fontSize: 22, color: '#e2e8f0' }} />
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>No notes yet</span>
                                    </div>
                                ) : notes.map((n, i) => (
                                    <div key={n.id ?? i} className="note-item">
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                            <span style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>{n.text}</span>
                                            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</span>
                                        </div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginTop: 3 }}>{n.author}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: 8, borderTop: '1px solid #f1f5f9', background: '#fafafa', flexShrink: 0 }}>
                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        value={noteText} onChange={e => setNoteText(e.target.value)}
                                        rows={3} placeholder="Write a note…"
                                        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', paddingBottom: 28, fontSize: 10, outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
                                    />
                                    <button
                                        onClick={saveNote}
                                        disabled={savingNote || !noteText.trim()}
                                        style={{ position: 'absolute', bottom: 6, right: 6, background: savingNote ? '#64748b' : '#0f172a', color: '#fff', border: 'none', borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: savingNote ? 'default' : 'pointer', fontFamily: 'inherit' }}
                                    >
                                        {savingNote ? 'Saving…' : 'Save Note'}
                                    </button>
                                </div>
                            </div>
                        </Panel>

                        {/* ── Reminders ── cols 9-12, row 1 ─── */}
                        <Panel style={{ gridColumn: '9 / 13' }}>
                            <div className="panel-hdr">
                                <span><i className="fa-solid fa-bell" style={{ color: '#6366f1', marginRight: 6 }} />Followups &amp; Reminders <span style={{ fontWeight: 400, opacity: .6 }}>{reminders.length}</span></span>
                                <a href="/tasks" style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Task Hub →</a>
                            </div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: 8, minHeight: 0 }}>
                                {remindersLoading ? (
                                    <div style={{ padding: '8px 0' }}>
                                        {[1, 2].map(i => (
                                            <div key={i} className="animate-pulse reminder-item" style={{ marginBottom: 6 }}>
                                                <div style={{ height: 8, width: '70%', background: '#f1f5f9', borderRadius: 4, marginBottom: 6 }} />
                                                <div style={{ height: 8, width: '40%', background: '#f1f5f9', borderRadius: 4 }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : reminders.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, padding: '24px 0' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-bell" style={{ fontSize: 16, color: '#cbd5e1' }} />
                                        </div>
                                        <p style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '.06em', margin: 0 }}>No follow-ups yet</p>
                                        <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', margin: 0, textAlign: 'center' }}>Add one using the form below</p>
                                    </div>
                                ) : reminders.map((r, i) => (
                                    <div key={r.id ?? i} className="reminder-item">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                                                <div style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: (REM_COLOR[r.type] || '#6366f1') + '18', border: `1px solid ${(REM_COLOR[r.type] || '#6366f1')}33` }}>
                                                    <i className={`fa-solid ${REM_ICON[r.type] || 'fa-bell'}`} style={{ fontSize: 10, color: REM_COLOR[r.type] || '#6366f1' }} />
                                                </div>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                                            </div>
                                            <select
                                                value={r.status}
                                                onChange={e => updateReminderStatus(i, e.target.value)}
                                                style={{ fontSize: 11, fontWeight: 700, padding: '2px 4px', borderRadius: 6, whiteSpace: 'nowrap', background: (STATUS_COLOR[r.status] || '#64748b') + '18', color: STATUS_COLOR[r.status] || '#64748b', border: `1px solid ${(STATUS_COLOR[r.status] || '#64748b')}33`, outline: 'none', cursor: 'pointer' }}
                                            >
                                                <option>Pending</option>
                                                <option>Completed</option>
                                                <option>Overdue</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: REM_COLOR[r.type] || '#6366f1' }}>{r.type}</span>
                                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{r.assignee}</span>
                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', marginLeft: 'auto' }}>{r.due}</span>
                                        </div>
                                        {r.note && <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, paddingTop: 5, borderTop: '1px solid #f1f5f9', lineHeight: 1.5 }}>{r.note}</div>}
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: 8, borderTop: '1px solid #f1f5f9', background: '#fafafa', flexShrink: 0 }}>
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 }}>
                                    <select value={remType} onChange={e => setRemType(e.target.value)} style={{ flex: 1, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 6px', fontSize: 10, fontWeight: 700, outline: 'none' }}>
                                        <option>Call</option><option>Meeting</option><option>Follow-up</option><option>Document</option>
                                    </select>
                                    <input value={remTitle} onChange={e => setRemTitle(e.target.value)} placeholder="Task title…" style={{ flex: 2, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', fontSize: 10, outline: 'none' }} />
                                    <select
                                        disabled={!canAssign}
                                        value={remAssigneeId || remAssignee}
                                        onChange={e => {
                                            const selected = users.find(u => u.id === e.target.value);
                                            if (selected) { setRemAssignee(selected.name); setRemAssigneeId(selected.id); }
                                            else { setRemAssignee(e.target.value); setRemAssigneeId(''); }
                                        }}
                                        style={{ flex: 1, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 6px', fontSize: 10, fontWeight: 700, outline: 'none', background: !canAssign ? '#f1f5f9' : '#fff' }}
                                    >
                                        {!canAssign
                                            ? <option value={remAssignee}>{remAssignee}</option>
                                            : users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                                        }
                                    </select>
                                    <input type="date" value={remDate} onChange={e => setRemDate(e.target.value)} style={{ flex: 1, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 6px', fontSize: 10, outline: 'none' }} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <textarea value={remNote} onChange={e => setRemNote(e.target.value)} rows={2} placeholder="Add a description…" style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 8px', paddingBottom: 26, fontSize: 10, outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
                                    <button
                                        onClick={addReminder}
                                        disabled={savingRem}
                                        style={{ position: 'absolute', bottom: 6, right: 6, background: savingRem ? '#64748b' : '#0f172a', color: '#fff', border: 'none', borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: savingRem ? 'default' : 'pointer', fontFamily: 'inherit' }}
                                    >
                                        {savingRem ? 'Adding…' : 'Add Reminder'}
                                    </button>
                                </div>
                            </div>
                        </Panel>

                        {/* ── Lead Info ── span 3, row 2 ──────── */}
                        <Panel style={{ gridColumn: 'span 3' }}>
                            <div className="panel-hdr">
                                <span><i className="fa-solid fa-user" style={{ marginRight: 6 }} />Lead Info</span>
                                {editing
                                    ? <button onClick={saveChanges} className="btn-sm" style={{ background: '#eef2ff', color: '#4338ca', padding: '2px 8px', fontSize: 8 }}>Save</button>
                                    : <button onClick={() => { setEditForm({ ...lead }); setEditing(true); }} className="btn-sm" style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', fontSize: 8 }}><i className="fa-solid fa-pen" /></button>
                                }
                            </div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 0 }}>
                                <InfoRow label="ID" value={<span style={{ fontFamily: 'monospace', fontWeight: 900 }}>#{lead.id}</span>} />
                                <InfoRow label="Name" value={editing && editForm ? <input className="field-edit" value={editForm.name} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, name: e.target.value }) : null)} /> : lead.name} />
                                <InfoRow label="Business" value={editing && editForm ? <input className="field-edit" value={(editForm as any).business || editForm.company || ''} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, company: e.target.value, business: e.target.value }) : null)} /> : leadBusiness} />
                                <InfoRow label="Agent" value={leadAgent} />
                                <InfoRow label="Priority" value={editing && editForm
                                    ? <select className="field-edit" value={editForm.priority} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, priority: e.target.value }) : null)}>
                                        <option>High</option><option>Medium</option><option>Low</option>
                                    </select>
                                    : <span style={{ background: ps.bg, color: ps.color, padding: '1px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{lead.priority}</span>}
                                />
                                <InfoRow label="Stage" value={editing && editForm
                                    ? <select className="field-edit" value={(editForm as any).stage || editForm.status || 'new'} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, stage: e.target.value, status: e.target.value }) : null)}>
                                        {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                    : <span style={{ background: STAGE_BG[leadStage] || '#f1f5f9', color: STAGE_COLOR[leadStage] || '#64748b', padding: '1px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{STAGE_LABELS[leadStage] || leadStage}</span>}
                                />
                                <InfoRow label="Level" value={editing && editForm
                                    ? <select className="field-edit" value={editForm.leadLevel || editForm.level || 'Level 1'} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, leadLevel: e.target.value, level: e.target.value }) : null)}>
                                        <option>Level 1</option><option>Level 2</option>
                                      </select>
                                    : <span style={{ background: '#eef2ff', color: '#4338ca', padding: '1px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: '1px solid #c7d2fe' }}>{lead.leadLevel || lead.level || 'Level 1'}</span>}
                                />
                                <InfoRow label="Days" value={`${lead.days}d in stage`} />
                            </div>
                        </Panel>

                        {/* ── Loan Details ── span 3, row 2 ───── */}
                        <Panel style={{ gridColumn: 'span 3' }}>
                            <div className="panel-hdr"><i className="fa-solid fa-coins" style={{ marginRight: 6 }} />Loan Details</div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 0 }}>
                                <InfoRow label="Amount" value={
                                    editing && editForm
                                        ? <input className="field-edit" value={editForm.amount} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, amount: e.target.value }) : null)} />
                                        : <span style={{ fontWeight: 900, fontSize: 13 }}>{lead.amount}</span>
                                } />
                                <InfoRow label="Bank" value={editing && editForm ? <input className="field-edit" value={(editForm as any).bank || (editForm as any).companyBank || ''} onChange={e => setEditForm((p: Lead | null) => p ? ({ ...p, bank: e.target.value, companyBank: e.target.value }) : null)} /> : leadBank} />
                                <InfoRow label="Lender" value={leadLender} />
                                <div onClick={togglePayout} style={{ cursor: 'pointer' }} title="Click to toggle payout status">
                                    <InfoRow label="Payout" value={
                                        lead.payoutStatus === 'Yes'
                                            ? <span style={{ color: '#10b981', fontWeight: 900, fontSize: 9 }}>✓ CONFIRMED</span>
                                            : <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: 9 }}>⏳ PENDING</span>
                                    } />
                                </div>
                                {lead.payoutStatus !== 'Yes' ? (
                                    <div className="info-row" style={{ marginTop: 4 }}>
                                        <button
                                            onClick={notifyAccountManager}
                                            style={{ width: '100%', padding: '5px 10px', background: notifyDone ? '#f0fdf4' : '#eef2ff', color: notifyDone ? '#166534' : '#4338ca', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '.04em' }}
                                        >
                                            <i className={`fa-solid ${notifyDone ? 'fa-check' : 'fa-paper-plane'}`} />
                                            {notifyDone ? 'Notified!' : 'Notify Account Manager'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <InfoRow label="Contact" value={<span style={{ fontSize: 9 }}>{LENDERS_DB[leadLender]?.contact || 'N/A'}</span>} />
                                        <InfoRow label="Terms" value={<span style={{ fontSize: 9 }}>{LENDERS_DB[leadLender]?.terms || 'N/A'}</span>} />
                                    </>
                                )}
                            </div>
                        </Panel>

                        {/* ── Activity Timeline ── span 3, row 2 */}
                        <Panel style={{ gridColumn: 'span 3' }}>
                            <div className="panel-hdr"><i className="fa-solid fa-timeline" style={{ marginRight: 6 }} />Activity Timeline</div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', minHeight: 0 }}>
                                {timeline.map((t, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0', borderBottom: i < timeline.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <div style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, background: t.done ? t.color + '22' : '#f1f5f9', border: `1px solid ${t.done ? t.color + '44' : '#e2e8f0'}` }}>
                                            <i className={`fa-solid ${t.icon}`} style={{ fontSize: 10, color: t.done ? t.color : '#cbd5e1' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: t.done ? '#0f172a' : '#cbd5e1', lineHeight: 1.3 }}>{t.label}</div>
                                            <div style={{ fontSize: 11, color: t.done ? '#64748b' : '#e2e8f0' }}>{t.done ? t.sub : '—'}</div>
                                            <div style={{ fontSize: 11, color: t.done ? '#94a3b8' : '#e2e8f0', fontFamily: 'monospace' }}>{t.done && t.time ? t.time : (t.done ? '—' : '')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* ── Documents ── span 3, row 2 ──────── */}
                        <Panel style={{ gridColumn: 'span 3' }}>
                            <div className="panel-hdr">
                                <span><i className="fa-solid fa-folder-open" style={{ marginRight: 6 }} />Documents <span style={{ fontWeight: 400, opacity: .6 }}>{docs.length}</span></span>
                                <>
                                    <input ref={uploadRef} type="file" style={{ display: 'none' }} onChange={uploadDoc} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                    <button
                                        onClick={() => uploadRef.current?.click()}
                                        disabled={uploading}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: uploading ? '#f1f5f9' : '#eef2ff', color: uploading ? '#94a3b8' : '#4338ca', border: '1px solid #c7d2fe', borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: uploading ? 'default' : 'pointer', fontFamily: 'inherit' }}
                                    >
                                        <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'}`} style={{ fontSize: 7 }} />
                                        {uploading ? 'Uploading…' : 'Upload'}
                                    </button>
                                </>
                            </div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', minHeight: 0 }}>
                                {docsLoading ? (
                                    <div style={{ padding: '8px 0' }}>
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderBottom: '1px solid #f8fafc' }} className="animate-pulse">
                                                <div style={{ width: 18, height: 18, background: '#f1f5f9', borderRadius: 4, flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ height: 9, width: '65%', background: '#f1f5f9', borderRadius: 4, marginBottom: 4 }} />
                                                    <div style={{ height: 7, width: '45%', background: '#f8fafc', borderRadius: 4 }} />
                                                </div>
                                                <div style={{ display: 'flex', gap: 3 }}>
                                                    <div style={{ width: 22, height: 22, background: '#f1f5f9', borderRadius: 4 }} />
                                                    <div style={{ width: 22, height: 22, background: '#f1f5f9', borderRadius: 4 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : docs.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
                                        <i className="fa-solid fa-folder-open" style={{ fontSize: 22, color: '#e2e8f0' }} />
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>No documents uploaded yet</span>
                                    </div>
                                ) : docs.map((d, i) => {
                                    const sc = d.status === 'Verified' ? '#10b981' : d.status === 'Missing' || d.status === 'Failed' ? '#ef4444' : '#f59e0b';
                                    return (
                                        <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderBottom: i < docs.length - 1 ? '1px solid #f8fafc' : 'none', borderRadius: 6 }}>
                                            <div style={{ width: 18, height: 18, background: '#f1f5f9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className="fa-regular fa-file-pdf" style={{ fontSize: 11, color: '#94a3b8' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                                                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{d.uploadedAt} · <span style={{ color: sc }}>{d.status}</span></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                                                <button onClick={() => setPreviewDoc(d)} title="View" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 5px', fontSize: 10, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
                                                    <i className="fa-solid fa-eye" />
                                                </button>
                                                <button onClick={() => deleteDoc(d.id)} title="Delete" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '2px 5px', fontSize: 10, fontWeight: 700, color: '#ef4444', cursor: 'pointer' }}>
                                                    <i className="fa-solid fa-trash" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Panel>

                    </div>
                </div>
            </div>

            {/* ── Document Preview Modal ───────────────────── */}
            {previewDoc && (
                <>
                    <div onClick={() => setPreviewDoc(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.6)', backdropFilter: 'blur(3px)', zIndex: 1000 }} />
                    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, pointerEvents: 'none' }}>
                        <div style={{ background: '#fff', borderRadius: 16, width: 600, maxWidth: '95vw', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.2)', pointerEvents: 'all', animation: 'fadeIn .2s ease' }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                    <i className={`fa-solid ${/\.(png|jpe?g|gif|webp|svg)$/i.test(previewDoc.name) ? 'fa-file-image' : /\.pdf$/i.test(previewDoc.name) ? 'fa-file-pdf' : /\.(docx?)$/i.test(previewDoc.name) ? 'fa-file-word' : /\.(xlsx?|csv)$/i.test(previewDoc.name) ? 'fa-file-excel' : 'fa-file'}`} style={{ color: '#94a3b8', fontSize: 13 }} />
                                    <h3 style={{ fontSize: 10, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewDoc.name}</h3>
                                </div>
                                <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}><i className="fa-solid fa-xmark" /></button>
                            </div>
                            {/* Inline preview */}
                            {/\.(png|jpe?g|gif|webp|svg)$/i.test(previewDoc.name) && (
                                <div style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: 340, overflow: 'hidden' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewDoc.url} alt={previewDoc.name} style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain' }} />
                                </div>
                            )}
                            {/\.pdf$/i.test(previewDoc.name) && (
                                <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <iframe src={previewDoc.url} title={previewDoc.name} style={{ width: '100%', height: 380, border: 'none', display: 'block' }} />
                                </div>
                            )}
                            <div style={{ padding: '16px 20px' }}>
                                <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 12px' }}>Uploaded {previewDoc.uploadedAt} · by {previewDoc.uploadedBy || '—'}</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {[['Pending','#f59e0b'],['Verified','#10b981'],['Missing','#ef4444'],['Failed','#ef4444']].map(([s, c]) => (
                                        <button
                                            key={s}
                                            onClick={() => { updateDocStatus(previewDoc.id, s); setPreviewDoc({ ...previewDoc, status: s }); }}
                                            style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${previewDoc.status === s ? c : '#e2e8f0'}`, background: previewDoc.status === s ? c + '18' : '#fff', color: previewDoc.status === s ? c : '#94a3b8', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <a
                                    href={previewDoc.url}
                                    download={previewDoc.name}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#eef2ff', color: '#4338ca', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 11, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.05em' }}
                                >
                                    <i className="fa-solid fa-download" /> Download
                                </a>
                                <button onClick={() => setPreviewDoc(null)} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 18px', fontSize: 11, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em' }}>Close</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

/* ── Tiny sub-components ──────────────────────────────────────── */
function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, ...style }}>
            {children}
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="info-row">
            <span className="info-lbl">{label}</span>
            <span className="info-val">{value}</span>
        </div>
    );
}
