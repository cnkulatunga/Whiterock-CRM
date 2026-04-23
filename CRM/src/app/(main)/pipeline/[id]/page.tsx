'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { AGENTS, teamMembers } from '@/data/dummy';

/* ── Types ──────────────────────────────────────────────────── */
interface Lead {
    id: string; name: string; business: string; amount: string;
    agent: string; bank: string; stage: string; priority: 'High' | 'Medium' | 'Low';
    days: number; lender: string; notes: string; payoutStatus: 'Yes' | 'No';
    leadLevel?: string;
}
interface Note { author: string; time: string; text: string; }
interface Reminder { type: string; title: string; assignee: string; due: string; status: string; note?: string; }

/* ── Static data ─────────────────────────────────────────────── */
const ALL_LEADS: Lead[] = [
    { id: 'AL-902', name: 'Robert Miller', business: 'Miller Logistics',      amount: '£12,000',     agent: 'Sarah Jenkins', bank: '—',       stage: 'collecting', priority: 'High',   days: 2,  lender: '—',             notes: 'Waiting for bank statements',            payoutStatus: 'No',  leadLevel: 'Level 1' },
    { id: 'AF-550', name: 'Priya Singh',   business: 'Singh Media',            amount: '£450,000',    agent: 'James White',   bank: '—',       stage: 'collecting', priority: 'Medium', days: 1,  lender: '—',             notes: 'Large expansion loan request.',          payoutStatus: 'No',  leadLevel: 'Level 2' },
    { id: 'AF-027', name: 'John Smith',    business: 'ABC Corp',               amount: '£55,000',     agent: 'Sarah Jenkins', bank: 'Barclays',stage: 'lender',     priority: 'High',   days: 4,  lender: 'Barclays, HSBC',notes: 'Email sent to partners, awaiting offers.',payoutStatus: 'No',  leadLevel: 'Level 1' },
    { id: 'AL-339', name: 'Mike Johnson',  business: 'Urban Scaffolding Ltd',  amount: '£85,000',     agent: 'James White',   bank: '—',       stage: 'verified',   priority: 'Low',    days: 5,  lender: '—',             notes: 'Bank statements audited and approved.',  payoutStatus: 'No',  leadLevel: 'Level 2' },
    { id: 'AF-001', name: 'David Brown',   business: 'Miller Logistics',       amount: '£150,000',    agent: 'Sarah Jenkins', bank: 'Starling',stage: 'approved',   priority: 'High',   days: 12, lender: 'Starling',       notes: 'Offer accepted, final checks in progress.',payoutStatus: 'Yes', leadLevel: 'Level 1' },
    { id: 'AL-209', name: 'Kevin Malone',  business: 'Malone Paints',          amount: '£25,000',     agent: 'James White',   bank: '—',       stage: 'rejected',   priority: 'Low',    days: 1,  lender: '—',             notes: 'Low credit score and high existing debt.',payoutStatus: 'No',  leadLevel: 'Level 2' },
    { id: 'AF-028', name: 'Minosh Example',business: 'ex ABC',                 amount: '£3,456',      agent: 'Sarah White',   bank: 'Starling',stage: 'verified',   priority: 'High',   days: 3,  lender: 'NAB',           notes: 'Awaiting final sign-off.',               payoutStatus: 'Yes', leadLevel: 'Level 1' },
    { id: 'AF-002', name: 'Alice Huang',   business: 'Huang Tech',             amount: '£1,200,000',  agent: 'Leo Kumar',     bank: 'HSBC',    stage: 'lender',     priority: 'High',   days: 4,  lender: 'ANZ',           notes: 'Shortlisting lenders.',                  payoutStatus: 'No',  leadLevel: 'Level 2' },
    { id: 'AF-003', name: 'David Rivera',  business: 'Rivera Designs',         amount: '£85,000',     agent: 'Priya Sharma',  bank: '—',       stage: 'approved',   priority: 'Medium', days: 1,  lender: 'Westpac',       notes: 'Approval letter received.',              payoutStatus: 'Yes', leadLevel: 'Level 1' },
];

const LENDERS_DB: Record<string, { contact: string; email: string; terms: string; phone: string }> = {
    'NAB': { contact: 'Mark Sterling', email: 'm.sterling@nab-business.com', terms: 'Next Day Payout', phone: '+44 20 7123 4567' },
    'ANZ': { contact: 'David Low', email: 'd.low@anz.bank', terms: 'Standard Terms', phone: '+44 20 8888 7777' },
    'Westpac': { contact: 'Emily Thorne', email: 'e.thorne@westpac.com', terms: 'Instant Payout', phone: '+44 20 6666 5555' },
    'Starling': { contact: 'James Cole', email: 'j.cole@starling.com', terms: '2-Day Payout', phone: '+44 20 5555 6666' },
    'Barclays': { contact: 'Rachel Adams', email: 'r.adams@barclays.co.uk', terms: 'Standard Terms', phone: '+44 20 1234 5678' },
    'HSBC': { contact: 'Tom Harding', email: 't.harding@hsbc.co.uk', terms: '3-Day Settlement', phone: '+44 20 9876 5432' },
};

const STAGE_ORDER = ['collecting', 'verified', 'lender', 'approved', 'completed'];
const STAGE_LABELS: Record<string, string> = { collecting: 'Doc Collection', verified: 'Doc Verified', lender: 'Lender Selection', approved: 'Loan Approved', completed: 'Completed', rejected: 'Rejected' };
const STAGE_COLOR: Record<string, string> = { collecting: '#64748b', verified: '#3b82f6', lender: '#8b5cf6', approved: '#22c55e', completed: '#0f172a', rejected: '#ef4444' };
const STAGE_BG: Record<string, string> = { collecting: '#f1f5f9', verified: '#eff6ff', lender: '#f5f3ff', approved: '#f0fdf4', completed: '#f1f5f9', rejected: '#fef2f2' };
const PRIO_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    High: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
    Medium: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    Low: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
};

const REM_COLOR: Record<string, string> = { Call: '#3b82f6', Meeting: '#8b5cf6', 'Follow-up': '#f59e0b', Document: '#10b981' };
const REM_ICON: Record<string, string> = { Call: 'fa-phone', Meeting: 'fa-users', 'Follow-up': 'fa-rotate-right', Document: 'fa-file' };
const STATUS_COLOR: Record<string, string> = { Pending: '#f59e0b', Completed: '#10b981', Overdue: '#ef4444' };

function now() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ═══════════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════════ */
export default function LeadDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { hasAction } = usePermissions();
    const canAssign = hasAction('tasks', 'assign');

    const found = ALL_LEADS.find(l => l.id === id) ?? ALL_LEADS[0];

    const [lead, setLead] = useState<Lead>({ ...found });
    const [editing, setEditing] = useState(false);
    const [aiState, setAiState] = useState<'idle' | 'loading' | 'done'>('idle');
    const [aiText, setAiText] = useState('');
    const [notes, setNotes] = useState<Note[]>([
        { author: found.agent, time: '2026-04-10 10:22', text: found.notes },
        { author: 'Cody Lane', time: '2026-04-08 15:40', text: 'Client confirmed availability for lender call next week.' },
        { author: 'System', time: '2026-04-07 09:00', text: 'Automated reminder sent to client for outstanding documents.' },
    ]);
    const [reminders, setReminders] = useState<Reminder[]>([
        { type: 'Call', title: 'Follow up on bank statements', assignee: found.agent, due: '2026-04-18', status: 'Pending' },
        { type: 'Meeting', title: 'Lender introduction call', assignee: found.agent, due: '2026-04-20', status: 'Pending' },
        { type: 'Follow-up', title: 'Check document verification', assignee: found.agent, due: '2026-04-12', status: 'Overdue' },
        { type: 'Document', title: 'Request updated payslips', assignee: 'Sarah White', due: '2026-04-15', status: 'Completed' },
    ]);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [notifyDone, setNotifyDone] = useState(false);

    /* edit form state */
    const [editForm, setEditForm] = useState({ ...found });

    /* add-note / add-reminder form */
    const [noteText, setNoteText] = useState('');
    const [remType, setRemType] = useState('Call');
    const [remTitle, setRemTitle] = useState('');
    const [remDate, setRemDate] = useState('');
    const [remAssignee, setRemAssignee] = useState(found.agent);
    const [remNote, setRemNote] = useState('');

    /* docs */
    const docs = [
        { name: 'Passport_ID.pdf', type: 'Identity', date: '2026-03-11', status: 'Verified' },
        { name: 'Bank_Statement_3mo.pdf', type: 'Financial', date: '2026-03-12', status: 'Verified' },
        { name: 'Payslips_x3.pdf', type: 'Income', date: '2026-03-14', status: lead.stage === 'collecting' ? 'Pending' : 'Verified' },
        { name: 'Employment_Letter.pdf', type: 'Employment', date: '2026-03-15', status: lead.stage === 'collecting' ? 'Missing' : 'Verified' },
        { name: 'Credit_Report.pdf', type: 'Credit', date: '2026-03-16', status: lead.stage === 'rejected' ? 'Failed' : 'Verified' },
    ];

    /* timeline */
    const stageStep = STAGE_ORDER.indexOf(lead.stage);
    const isRejected = lead.stage === 'rejected';
    const timeline = [
        { icon: 'fa-plus', color: '#6366f1', label: 'Lead Created', sub: 'By ' + lead.agent, time: '2026-03-10 09:12', minStage: 0 },
        { icon: 'fa-file-arrow-up', color: '#3b82f6', label: 'Documents Collected', sub: 'All files submitted', time: '2026-03-14 14:05', minStage: 1 },
        { icon: 'fa-file-circle-check', color: '#10b981', label: 'Docs Verified', sub: 'Reviewed & approved', time: '2026-03-17 11:20', minStage: 2 },
        { icon: 'fa-building-columns', color: '#8b5cf6', label: 'Lender Selected', sub: 'Shortlist confirmed', time: '2026-03-25 10:00', minStage: 3 },
        isRejected
            ? { icon: 'fa-circle-xmark', color: '#ef4444', label: 'Loan Rejected', sub: 'Application declined', time: '2026-04-01 09:00', minStage: 4 }
            : { icon: 'fa-circle-check', color: '#22c55e', label: 'Loan Confirmed', sub: 'Funds approved', time: '2026-04-01 09:00', minStage: 4 },
    ].map(t => ({ ...t, done: isRejected ? t.minStage < 4 : t.minStage <= stageStep }));

    /* ── AI Summary ─────────────────────────────────────────── */
    const generateAI = () => {
        if (aiState === 'loading') return;
        setAiState('loading');
        setTimeout(() => {
            setAiText(`${lead.priority}-priority lead requiring ${lead.priority === 'High' ? 'immediate' : 'timely'} attention. ${lead.name} (${lead.business}) seeking ${lead.amount} for business funding${lead.bank !== '—' ? ', banking with ' + lead.bank : ''}. Currently at <strong>${STAGE_LABELS[lead.stage]}</strong> stage with ${lead.days} day${lead.days !== 1 ? 's' : ''} elapsed. ${lead.payoutStatus === 'Yes' ? 'Payout confirmed via ' + (lead.lender || 'lender') + '.' : 'Payout pending — account manager action required.'}`);
            setAiState('done');
        }, 1400);
    };

    /* ── Edit / Save ─────────────────────────────────────────── */
    const saveChanges = async () => {
        try {
            const response = await fetch('/api/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (response.ok) {
                setLead({ ...editForm });
                setEditing(false);
            } else {
                alert('Failed to save changes to database.');
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('Critical Error: Could not reach lead database');
        }
    };
    const cancelEdit = () => { setEditForm({ ...lead }); setEditing(false); };

    /* ── Notes ───────────────────────────────────────────────── */
    const saveNote = () => {
        if (!noteText.trim()) return;
        setNotes(prev => [{ author: 'You', time: now(), text: noteText.trim() }, ...prev]);
        setNoteText('');
    };

    /* ── Reminders ───────────────────────────────────────────── */
    const addReminder = () => {
        if (!remTitle.trim() || !remDate) return;
        setReminders(prev => [{ type: remType, title: remTitle, assignee: remAssignee, due: remDate, status: 'Pending', note: remNote || undefined }, ...prev]);
        setRemTitle(''); setRemDate(''); setRemNote('');
    };

    /* ── Notify Account Manager ──────────────────────────────── */
    const notifyAccountManager = () => {
        const ts = now();
        const msg = `SYSTEM ALERT: Admin requested an immediate payout update for this file from Account Manager (${lead.agent}).`;
        setNotes(prev => [{ author: 'System', time: ts, text: msg }, ...prev]);
        setReminders(prev => [{ type: 'Follow-up', title: 'URGENT: Payout Update Requested', assignee: lead.agent, due: ts.split(' ')[0], status: 'Pending' }, ...prev]);
        setNotifyDone(true);
        setTimeout(() => setNotifyDone(false), 3000);
    };

    /* ── Helpers ─────────────────────────────────────────────── */
    const ps = PRIO_STYLE[lead.priority];

    /* ═════════════════════════════════════════════════════════
       RENDER
    ═════════════════════════════════════════════════════════ */
    return (
        <>
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
                            onClick={() => router.push('/pipeline')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, background: '#f1f5f9', color: '#475569', border: 'none', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer' }}
                        >
                            <i className="fa-solid fa-arrow-left" style={{ fontSize: 8 }} /> Back
                        </button>
                        <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
                        <div>
                            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>#{lead.id}</p>
                            <h1 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2, letterSpacing: '-.01em' }}>{lead.name}</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '2px 10px', borderRadius: 20, fontSize: 8, fontWeight: 800, textTransform: 'uppercase' }}>{lead.leadLevel || 'Level 1'}</span>
                            <span style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, padding: '2px 10px', borderRadius: 20, fontSize: 8, fontWeight: 700 }}>{lead.priority} Priority</span>
                            <span style={{ background: STAGE_BG[lead.stage], color: STAGE_COLOR[lead.stage], border: `1px solid ${STAGE_COLOR[lead.stage]}33`, padding: '2px 10px', borderRadius: 20, fontSize: 8, fontWeight: 700 }}>{STAGE_LABELS[lead.stage]}</span>
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
                <div style={{ flex: 1, overflow: 'hidden', padding: '12px 14px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: '3fr 2fr', gap: 10 }}>

                        {/* ── AI Summary ── cols 1-4, row 1 ─── */}
                        <Panel style={{ gridColumn: '1 / 5' }}>
                            <div className="panel-hdr" style={{ background: '#fff', borderBottom: '1px solid #eef2ff', padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, background: '#4f46e5', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px #4f46e540' }}>
                                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#fff', fontSize: 14 }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', letterSpacing: '-.01em' }}>AI Lead Summary</div>
                                        <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>Powered by lead data</div>
                                    </div>
                                </div>
                                <button
                                    onClick={generateAI}
                                    style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 13px', fontSize: 8, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', letterSpacing: '.04em', opacity: aiState === 'loading' ? .6 : 1 }}
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
                                        <p style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: '#94a3b8', marginBottom: 8 }}>Key Data Points</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                            {[['Status', lead.priority + ' Priority'], ['Amount', lead.amount], ['Stage', STAGE_LABELS[lead.stage]], ['Bank', lead.bank !== '—' ? lead.bank : 'N/A'], ['Agent', lead.agent], ['Days', lead.days + 'd in stage'], ['Payout', lead.payoutStatus === 'Yes' ? 'Confirmed' : 'Pending'], ['Lender', lead.lender !== '—' ? lead.lender : 'N/A']].map(([l, v]) => (
                                                <div key={l} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 7, padding: '7px 10px' }}>
                                                    <div style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#94a3b8' }}>{l}</div>
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
                                {notes.map((n, i) => (
                                    <div key={i} className="note-item">
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                            <span style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>{n.text}</span>
                                            <span style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</span>
                                        </div>
                                        <div style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', marginTop: 3 }}>{n.author}</div>
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
                                    <button onClick={saveNote} style={{ position: 'absolute', bottom: 6, right: 6, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 5, padding: '3px 10px', fontSize: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </Panel>

                        {/* ── Reminders ── cols 9-12, row 1 ─── */}
                        <Panel style={{ gridColumn: '9 / 13' }}>
                            <div className="panel-hdr">
                                <span><i className="fa-solid fa-bell" style={{ color: '#6366f1', marginRight: 6 }} />Followups &amp; Reminders <span style={{ fontWeight: 400, opacity: .6 }}>{reminders.length}</span></span>
                                <a href="/tasks" style={{ fontSize: 8, color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Task Hub →</a>
                            </div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: 8, minHeight: 0 }}>
                                {reminders.map((r, i) => (
                                    <div key={i} className="reminder-item">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                                                <div style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: REM_COLOR[r.type] + '18', border: `1px solid ${REM_COLOR[r.type]}33` }}>
                                                    <i className={`fa-solid ${REM_ICON[r.type]}`} style={{ fontSize: 7, color: REM_COLOR[r.type] }} />
                                                </div>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                                            </div>
                                            <select
                                                value={r.status}
                                                onChange={e => {
                                                    const next = [...reminders];
                                                    next[i] = { ...next[i], status: e.target.value };
                                                    setReminders(next);
                                                }}
                                                style={{ fontSize: 8, fontWeight: 700, padding: '2px 4px', borderRadius: 6, whiteSpace: 'nowrap', background: STATUS_COLOR[r.status] + '18', color: STATUS_COLOR[r.status], border: `1px solid ${STATUS_COLOR[r.status]}33`, outline: 'none', cursor: 'pointer' }}
                                            >
                                                <option>Pending</option>
                                                <option>Completed</option>
                                                <option>Overdue</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                                            <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: REM_COLOR[r.type] }}>{r.type}</span>
                                            <span style={{ fontSize: 8, color: '#94a3b8' }}>{r.assignee}</span>
                                            <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#94a3b8', marginLeft: 'auto' }}>{r.due}</span>
                                        </div>
                                        {r.note && <div style={{ fontSize: 9, color: '#64748b', marginTop: 5, paddingTop: 5, borderTop: '1px solid #f1f5f9', lineHeight: 1.5 }}>{r.note}</div>}
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
                                        value={remAssignee}
                                        onChange={e => setRemAssignee(e.target.value)}
                                        style={{ flex: 1, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 6px', fontSize: 10, fontWeight: 700, outline: 'none', background: !canAssign ? '#f1f5f9' : '#fff' }}
                                    >
                                        {!canAssign && <option value={remAssignee}>{remAssignee}</option>}
                                        {canAssign && AGENTS.map((a: { name: string }) => <option key={a.name}>{a.name}</option>)}
                                    </select>
                                    <input type="date" value={remDate} onChange={e => setRemDate(e.target.value)} style={{ flex: 1, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 6px', fontSize: 10, outline: 'none' }} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <textarea value={remNote} onChange={e => setRemNote(e.target.value)} rows={2} placeholder="Add a description…" style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 8px', paddingBottom: 26, fontSize: 10, outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
                                    <button onClick={addReminder} style={{ position: 'absolute', bottom: 6, right: 6, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 5, padding: '3px 10px', fontSize: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Add Reminder
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
                                <InfoRow label="Name" value={editing ? <input className="field-edit" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /> : lead.name} />
                                <InfoRow label="Business" value={editing ? <input className="field-edit" value={editForm.business} onChange={e => setEditForm(p => ({ ...p, business: e.target.value }))} /> : lead.business} />
                                <InfoRow label="Agent" value={editing ? <input className="field-edit" value={editForm.agent} onChange={e => setEditForm(p => ({ ...p, agent: e.target.value }))} /> : lead.agent} />
                                <InfoRow label="Priority" value={editing
                                    ? <select className="field-edit" value={editForm.priority} onChange={e => setEditForm(p => ({ ...p, priority: e.target.value as Lead['priority'] }))}>
                                        <option>High</option><option>Medium</option><option>Low</option>
                                    </select>
                                    : <span style={{ background: ps.bg, color: ps.color, padding: '1px 8px', borderRadius: 8, fontSize: 8, fontWeight: 700 }}>{lead.priority}</span>}
                                />
                                <InfoRow label="Stage" value={editing
                                    ? <select className="field-edit" value={editForm.stage} onChange={e => setEditForm(p => ({ ...p, stage: e.target.value }))}>
                                        {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                    : <span style={{ background: STAGE_BG[lead.stage], color: STAGE_COLOR[lead.stage], padding: '1px 8px', borderRadius: 8, fontSize: 8, fontWeight: 700 }}>{STAGE_LABELS[lead.stage]}</span>}
                                />
                                <InfoRow label="Level" value={editing
                                    ? <select className="field-edit" value={editForm.leadLevel || 'Level 1'} onChange={e => setEditForm(p => ({ ...p, leadLevel: e.target.value }))}>
                                        <option>Level 1</option><option>Level 2</option>
                                      </select>
                                    : <span style={{ background: '#eef2ff', color: '#4338ca', padding: '1px 8px', borderRadius: 8, fontSize: 8, fontWeight: 700, border: '1px solid #c7d2fe' }}>{lead.leadLevel || 'Level 1'}</span>}
                                />
                                <InfoRow label="Days" value={`${lead.days}d in stage`} />
                            </div>
                        </Panel>

                        {/* ── Loan Details ── span 3, row 2 ───── */}
                        <Panel style={{ gridColumn: 'span 3' }}>
                            <div className="panel-hdr"><i className="fa-solid fa-coins" style={{ marginRight: 6 }} />Loan Details</div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 0 }}>
                                <InfoRow label="Amount" value={
                                    editing
                                        ? <input className="field-edit" value={editForm.amount} onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))} />
                                        : <span style={{ fontWeight: 900, fontSize: 13 }}>{lead.amount}</span>
                                } />
                                <InfoRow label="Bank" value={editing ? <input className="field-edit" value={editForm.bank} onChange={e => setEditForm(p => ({ ...p, bank: e.target.value }))} /> : lead.bank} />
                                <InfoRow label="Lender" value={editing ? <input className="field-edit" value={editForm.lender} onChange={e => setEditForm(p => ({ ...p, lender: e.target.value }))} /> : lead.lender} />
                                <div onClick={() => setLead(p => ({ ...p, payoutStatus: p.payoutStatus === 'Yes' ? 'No' : 'Yes' }))} style={{ cursor: 'pointer' }} title="Click to toggle status">
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
                                            style={{ width: '100%', padding: '5px 10px', background: notifyDone ? '#f0fdf4' : '#eef2ff', color: notifyDone ? '#166534' : '#4338ca', border: 'none', borderRadius: 6, fontSize: 8, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '.04em' }}
                                        >
                                            <i className={`fa-solid ${notifyDone ? 'fa-check' : 'fa-paper-plane'}`} />
                                            {notifyDone ? 'Notified!' : 'Notify Account Manager'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <InfoRow label="Contact" value={<span style={{ fontSize: 9 }}>{LENDERS_DB[lead.lender]?.contact || 'N/A'}</span>} />
                                        <InfoRow label="Terms" value={<span style={{ fontSize: 9 }}>{LENDERS_DB[lead.lender]?.terms || 'N/A'}</span>} />
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
                                            <i className={`fa-solid ${t.icon}`} style={{ fontSize: 7, color: t.done ? t.color : '#cbd5e1' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 9, fontWeight: 700, color: t.done ? '#0f172a' : '#cbd5e1', lineHeight: 1.3 }}>{t.label}</div>
                                            <div style={{ fontSize: 8, color: t.done ? '#94a3b8' : '#e2e8f0', fontFamily: 'monospace' }}>{t.done ? t.time : '—'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* ── Documents ── span 3, row 2 ──────── */}
                        <Panel style={{ gridColumn: 'span 3' }}>
                            <div className="panel-hdr">
                                <span><i className="fa-solid fa-folder-open" style={{ marginRight: 6 }} />Documents <span style={{ fontWeight: 400, opacity: .6 }}>{docs.length}</span></span>
                            </div>
                            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', minHeight: 0 }}>
                                {docs.map((d, i) => {
                                    const sc = d.status === 'Verified' ? '#10b981' : d.status === 'Missing' || d.status === 'Failed' ? '#ef4444' : '#f59e0b';
                                    return (
                                        <div key={i} onClick={() => setPreviewDoc(d.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderBottom: i < docs.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', borderRadius: 6, transition: 'background .15s' }} className="hover:bg-slate-50">
                                            <div style={{ width: 18, height: 18, background: '#f1f5f9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className="fa-regular fa-file-pdf" style={{ fontSize: 8, color: '#94a3b8' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 9, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                                                <div style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>{d.date} · <span style={{ color: sc }}>{d.status}</span></div>
                                            </div>
                                            <button onClick={() => setPreviewDoc(d.name)} style={{ flexShrink: 0, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 6px', fontSize: 7, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-eye" />
                                            </button>
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
                        <div style={{ background: '#fff', borderRadius: 16, width: 480, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.2)', pointerEvents: 'all', animation: 'fadeIn .2s ease' }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: 10, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>Document Preview</h3>
                                <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}><i className="fa-solid fa-xmark" /></button>
                            </div>
                            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                <div style={{ width: 60, height: 60, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                    <i className="fa-solid fa-file-pdf" style={{ fontSize: 28, color: '#cbd5e1' }} />
                                </div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: '0 0 4px' }}>Preview not available in demo mode.</p>
                                <p style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace', margin: 0 }}>File: {previewDoc}</p>
                            </div>
                            <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setPreviewDoc(null)} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 18px', fontSize: 8, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em' }}>Close</button>
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
