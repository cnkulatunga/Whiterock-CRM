'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { TYPE_META } from '@/data/dummy';
import { usePermissions } from '@/hooks/usePermissions';

function mapTask(f: any) {
    const typeKey = f.type?.includes(' ') ? f.type.split(' ')[1] : f.type;
    return {
        id: f.id,
        title: f.title,
        type: f.type || 'General',
        typeColor: TYPE_META[typeKey]?.color || 'text-blue-500',
        client: f.client || f.lead?.name || '',
        leadId: f.lead?.id || '',
        phone: f.phone,
        email: f.email,
        date: f.date ? f.date.split('T')[0] : '',
        time: f.time,
        taskStatus: f.status || 'To Do',
        leadStatus: f.priority || 'Warm',
        assignee: f.assignee,
        notes: f.description
    };
}

function formatPromoExpiry(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const panelHeader: React.CSSProperties = {
    padding: '0 16px',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    background: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    flexShrink: 0
};

export default function TasksPage() {
    const router = useRouter();
    const { hasAction, userRole } = usePermissions();
    const canAssign = hasAction('tasks', 'assign');

    const [tasks, setTasks] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [leadsList, setLeadsList] = useState<any[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selfUserId, setSelfUserId] = useState<string>('');
    const [promoPreview, setPromoPreview] = useState<number | null>(null);
    const [promotions, setPromotions] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        assigneeId: '',
        leadId: '',
        type: 'Call',
        taskStatus: 'To Do',
        leadStatus: 'Warm',
        phone: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:30',
        notes: ''
    });

    const resetForm = () => setFormData({
        title: '',
        assigneeId: users.length > 0 ? users[0].id : '',
        leadId: '',
        type: 'Call',
        taskStatus: 'To Do',
        leadStatus: 'Warm',
        phone: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:30',
        notes: ''
    });

    const loadTasks = () => {
        setDataLoading(true);
        return fetch('/api/tasks')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.results ?? []);
                setTasks(list.map(mapTask));
            })
            .catch(err => console.error('Tasks fetch error:', err))
            .finally(() => setDataLoading(false));
    };

    useEffect(() => {
        try {
            const session = sessionStorage.getItem('crm_session');
            if (session) {
                const parsed = JSON.parse(session);
                if (parsed.id) setSelfUserId(parsed.id);
            }
        } catch {}

        loadTasks();

        fetch('/api/users')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.results ?? []);
                setUsers(list);
                if (list.length > 0 && !formData.assigneeId) {
                    setFormData(f => ({ ...f, assigneeId: list[0].id }));
                }
            })
            .catch(() => {});

        fetch('/api/leads')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.results ?? []);
                setLeadsList(list);
            })
            .catch(() => {});

        fetch('/api/lenders/promotions')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.results ?? []);
                setPromotions(list.map((p: any) => ({
                    lender_id: p.lender_id,
                    lender: p.lender,
                    title: p.title,
                    desc: p.description,
                    rate: p.rate,
                    expiry: p.valid_until ?? null,
                })));
            })
            .catch(() => {});
    }, []);

    const onLeadSelect = (id: string) => {
        const lead = leadsList.find((l: any) => l.id === id);
        setFormData(f => ({
            ...f,
            leadId: id,
            phone: lead?.phone || f.phone,
            email: lead?.email || f.email
        }));
    };

    const handleCreateTask = async () => {
        if (!formData.title) return;
        setSubmitting(true);
        const payload: any = {
            title: formData.title,
            type: formData.type,
            phone: formData.phone,
            email: formData.email,
            date: formData.date,
            time: formData.time,
            status: formData.taskStatus,
            priority: formData.leadStatus,
            description: formData.notes,
        };
        const effectiveAssigneeId = canAssign ? formData.assigneeId : selfUserId;
        if (effectiveAssigneeId) payload.assignee_id = effectiveAssigneeId;
        if (formData.leadId) {
            payload.lead_id = formData.leadId;
            payload.client = leadsList.find((l: any) => l.id === formData.leadId)?.name || '';
        }

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                await loadTasks();
                resetForm();
                setDrawerOpen(false);
            }
        } catch (e) {
            console.error('Failed to create task', e);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string, time: string) => {
        if (!dateStr) return time || '—';
        const today = new Date().toISOString().split('T')[0];
        const tmr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        if (dateStr === today) return `Today, ${time}`;
        if (dateStr === tmr) return `Tmr, ${time}`;
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + (time ? `, ${time}` : '');
    };

    const dueTodayCount = tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).length;

    const today = new Date();
    const isExpired = (expiry: string) => {
        if (!expiry || expiry === 'Ongoing') return false;
        const d = new Date(expiry);
        return !isNaN(d.getTime()) && d < today;
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
            <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>

            <header className="h-12 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-white shadow-md">
                        <i className="fa-solid fa-list-check text-xs"></i>
                    </div>
                    <div>
                        <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Integrated Task Hub</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Unified management of follow-ups and lender activities</p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Tasks</span>
                        <span className="text-[11px] font-black text-slate-900">{tasks.filter(t => t.taskStatus !== 'Complete' && t.taskStatus !== 'Done').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Today</span>
                        <span className="text-[11px] font-black text-indigo-600">{dueTodayCount}</span>
                    </div>
                </div>
            </header>

            {/* Drawer backdrop */}
            {drawerOpen && (
                <div
                    onClick={() => { setDrawerOpen(false); resetForm(); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 100, backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* Create Task Drawer */}
            {drawerOpen && (
                <div style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
                    background: '#fff', zIndex: 101, display: 'flex', flexDirection: 'column',
                    boxShadow: '-8px 0 40px rgba(0,0,0,.15)', animation: 'slideInRight .22s ease'
                }}>
                    <div style={panelHeader}>
                        <i className="fa-solid fa-plus" style={{ color: '#6366f1', fontSize: 13 }}></i>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', flex: 1 }}>Create New Task</span>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></div>
                        <button
                            onClick={() => { setDrawerOpen(false); resetForm(); }}
                            style={{ marginLeft: 8, width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <i className="fa-solid fa-xmark" style={{ fontSize: 12 }}></i>
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Task Description *</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                type="text" placeholder="Title..."
                                style={{ width: '100%', height: 34, padding: '0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Assignee</label>
                                <select
                                    disabled={!canAssign}
                                    value={formData.assigneeId}
                                    onChange={e => setFormData(f => ({ ...f, assigneeId: e.target.value }))}
                                    style={{ height: 34, padding: '0 8px', background: canAssign ? '#f8fafc' : '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none', cursor: canAssign ? 'pointer' : 'not-allowed', color: canAssign ? '#0f172a' : '#94a3b8' }}
                                >
                                    <option value="">Select...</option>
                                    {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Lead</label>
                                <select
                                    value={formData.leadId}
                                    onChange={e => onLeadSelect(e.target.value)}
                                    style={{ height: 34, padding: '0 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer', color: '#0f172a' }}
                                >
                                    <option value="">Select lead...</option>
                                    {leadsList.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Phone</label>
                                <input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} type="tel" placeholder="+44..."
                                    style={{ height: 34, padding: '0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Email</label>
                                <input value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} type="email" placeholder="mail@example.com"
                                    style={{ height: 34, padding: '0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Type</label>
                                <select value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}
                                    style={{ height: 34, padding: '0 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer', color: '#0f172a' }}>
                                    {Object.keys(TYPE_META).map(k => <option key={k}>{k}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Priority</label>
                                <select value={formData.leadStatus} onChange={e => setFormData(f => ({ ...f, leadStatus: e.target.value }))}
                                    style={{ height: 34, padding: '0 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer', color: '#0f172a' }}>
                                    <option>Hot</option><option>Warm</option><option>Cool</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Date</label>
                                <input value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} type="date"
                                    style={{ height: 34, padding: '0 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Time</label>
                                <input value={formData.time} onChange={e => setFormData(f => ({ ...f, time: e.target.value }))} type="time"
                                    style={{ height: 34, padding: '0 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 700, outline: 'none' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Notes</label>
                            <textarea value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} rows={4} placeholder="..."
                                style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 600, outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
                        </div>
                    </div>

                    <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                        <button
                            onClick={handleCreateTask}
                            disabled={submitting || !formData.title}
                            style={{ width: '100%', height: 40, background: submitting || !formData.title ? '#e2e8f0' : '#0f172a', color: submitting || !formData.title ? '#94a3b8' : '#fff', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', cursor: submitting || !formData.title ? 'not-allowed' : 'pointer' }}
                        >
                            {submitting ? 'Creating...' : 'Initialize Task Hub Entry'}
                        </button>
                    </div>
                </div>
            )}

            <main style={{ flex: 1, display: 'flex', gap: 12, padding: 12, overflow: 'hidden', position: 'relative' }}>

                {/* TABLE PANEL */}
                <section style={{ flex: 1, background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,.04)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                    <div style={{ ...panelHeader, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className="fa-solid fa-layer-group" style={{ color: '#6366f1', fontSize: 11 }}></i>
                            <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>Global Task Registry</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tasks.length} Total</span>
                            <button
                                onClick={() => { resetForm(); setDrawerOpen(true); }}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                            >
                                <i className="fa-solid fa-plus" style={{ fontSize: 10 }} /> New Task
                            </button>
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {['Case Activity', 'Lead', 'Assignee', 'Schedule', 'Task Status', 'Priority'].map(h => (
                                        <th key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {dataLoading && Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '12px 14px' }}><div style={{ height: 10, width: 140, background: '#f1f5f9', borderRadius: 4, marginBottom: 6 }} /><div style={{ height: 8, width: 80, background: '#f8fafc', borderRadius: 4 }} /></td>
                                        <td style={{ padding: '12px 14px' }}><div style={{ height: 10, width: 96, background: '#f1f5f9', borderRadius: 4 }} /></td>
                                        <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9' }} /><div style={{ height: 10, width: 80, background: '#f1f5f9', borderRadius: 4 }} /></div></td>
                                        <td style={{ padding: '12px 14px' }}><div style={{ height: 10, width: 80, background: '#f1f5f9', borderRadius: 4 }} /></td>
                                        <td style={{ padding: '12px 14px' }}><div style={{ height: 22, width: 64, background: '#f1f5f9', borderRadius: 20 }} /></td>
                                        <td style={{ padding: '12px 14px' }}><div style={{ height: 22, width: 56, background: '#f1f5f9', borderRadius: 20 }} /></td>
                                    </tr>
                                ))}
                                {!dataLoading && tasks.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '64px 16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 48, height: 48, background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fa-solid fa-list-check" style={{ color: '#cbd5e1', fontSize: 20 }}></i>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>No tasks yet</p>
                                                    <p style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', marginTop: 4 }}>Click "+ New Task" to create your first task</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!dataLoading && tasks.map((t) => {
                                    const isExpanded = expandedId === t.id;
                                    const assigneeName = typeof t.assignee === 'object' ? t.assignee?.name : t.assignee;
                                    return (
                                        <Fragment key={t.id}>
                                            <tr
                                                onClick={() => setExpandedId(isExpanded ? null : t.id)}
                                                style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: isExpanded ? '#eef2ff' : 'transparent', transition: 'background .15s' }}
                                                onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'; }}
                                                onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                                            >
                                                <td style={{ padding: '10px 14px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <i className={`fa-solid fa-chevron-right`} style={{ fontSize: 10, color: isExpanded ? '#6366f1' : '#cbd5e1', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}></i>
                                                        <div>
                                                            <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{t.title}</p>
                                                            <p style={{ fontSize: 10, fontWeight: 800, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '.04em' }} className={t.typeColor}>{t.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#334155', margin: 0 }}>{t.client || '—'}</p>
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#64748b' }}>
                                                            {assigneeName?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0 }}>{assigneeName || '—'}</p>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{formatDate(t.date, t.time)}</p>
                                                </td>
                                                <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={t.taskStatus}
                                                        onChange={async e => {
                                                            const newStatus = e.target.value;
                                                            try {
                                                                await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id, status: newStatus }) });
                                                                setTasks(prev => prev.map(tk => tk.id === t.id ? { ...tk, taskStatus: newStatus } : tk));
                                                            } catch (err) { console.error('Update failed', err); }
                                                        }}
                                                        style={{
                                                            height: 26, padding: '0 8px', fontSize: 10, fontWeight: 800, border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.04em',
                                                            background: t.taskStatus === 'Complete' || t.taskStatus === 'Done' ? '#f0fdf4' : t.taskStatus === 'In Progress' ? '#eff6ff' : t.taskStatus === 'Overdue' ? '#fff1f2' : '#f8fafc',
                                                            color: t.taskStatus === 'Complete' || t.taskStatus === 'Done' ? '#16a34a' : t.taskStatus === 'In Progress' ? '#2563eb' : t.taskStatus === 'Overdue' ? '#e11d48' : '#64748b'
                                                        }}
                                                    >
                                                        <option>To Do</option><option>In Progress</option><option>Complete</option><option>Overdue</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={t.leadStatus}
                                                        onChange={async e => {
                                                            const newPriority = e.target.value;
                                                            try {
                                                                await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id, priority: newPriority }) });
                                                                setTasks(prev => prev.map(tk => tk.id === t.id ? { ...tk, leadStatus: newPriority } : tk));
                                                            } catch (err) { console.error('Update failed', err); }
                                                        }}
                                                        style={{
                                                            height: 26, padding: '0 8px', fontSize: 10, fontWeight: 800, borderRadius: 8, outline: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.04em',
                                                            background: t.leadStatus === 'Hot' ? '#fff1f2' : t.leadStatus === 'Warm' ? '#fffbeb' : '#eff6ff',
                                                            color: t.leadStatus === 'Hot' ? '#e11d48' : t.leadStatus === 'Warm' ? '#d97706' : '#2563eb',
                                                            border: `1px solid ${t.leadStatus === 'Hot' ? '#fecdd3' : t.leadStatus === 'Warm' ? '#fde68a' : '#bfdbfe'}`
                                                        }}
                                                    >
                                                        <option>Hot</option><option>Warm</option><option>Cool</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr style={{ background: '#eef2ff', borderBottom: '1px solid #e0e7ff' }}>
                                                    <td colSpan={6} style={{ padding: '16px 24px 16px 48px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                                                            <div>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 4px' }}>Assignee</p>
                                                                <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: 0 }}>{assigneeName || '—'}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 4px' }}>Full Date</p>
                                                                <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.date} @ {t.time}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 4px' }}>Phone</p>
                                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#2447d7', margin: 0 }}>{t.phone || '—'}</p>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <button
                                                                    onClick={e => { e.stopPropagation(); e.preventDefault(); if (t.leadId) window.location.href = `/pipeline/${t.leadId}`; }}
                                                                    disabled={!t.leadId}
                                                                    style={{ height: 28, padding: '0 16px', background: t.leadId ? '#0f172a' : '#e2e8f0', color: t.leadId ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', cursor: t.leadId ? 'pointer' : 'not-allowed' }}
                                                                >View Full Lead</button>
                                                            </div>
                                                            <div style={{ gridColumn: 'span 2' }}>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 4px' }}>Email Address</p>
                                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#2447d7', margin: 0 }}>{t.email || '—'}</p>
                                                            </div>
                                                            <div style={{ gridColumn: 'span 2' }}>
                                                                <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 4px' }}>Internal Context</p>
                                                                <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', margin: 0, lineHeight: 1.5 }}>{t.notes || 'No notes provided for this task registry entry.'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* PROMOTIONS PANEL */}
                <section style={{ width: 280, background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,.04)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={panelHeader}>
                        <div style={{ width: 24, height: 24, borderRadius: 8, background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-tags" style={{ color: '#fff', fontSize: 10 }}></i>
                        </div>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', flex: 1 }}>Promotions</span>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}></div>
                    </div>

                    {/* Preview block — shown when a promo is selected */}
                    {promoPreview !== null && promotions[promoPreview] && (
                        <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', background: '#fffbeb' }}>
                            <p style={{ fontSize: 10, fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 6px' }}>{promotions[promoPreview].lender}</p>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{promotions[promoPreview].title}</p>
                            <p style={{ fontSize: 11, color: '#78350f', margin: 0, lineHeight: 1.5 }}>{promotions[promoPreview].desc}</p>
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <i className="fa-solid fa-file-pdf" style={{ fontSize: 10, color: '#d97706' }}></i>
                                <span style={{ fontSize: 10, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '.06em' }}>View Doc</span>
                            </div>
                        </div>
                    )}

                    <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                        {promotions.map((p: any, i: number) => {
                            const expired = isExpired(p.expiry);
                            const selected = promoPreview === i;
                            return (
                                <div
                                    key={i}
                                    onClick={() => setPromoPreview(selected ? null : i)}
                                    style={{
                                        padding: '12px 14px',
                                        borderBottom: '1px solid #f8fafc',
                                        cursor: 'pointer',
                                        background: selected ? '#fef3c7' : expired ? '#fafafa' : '#fff',
                                        opacity: expired ? 0.65 : 1,
                                        transition: 'background .15s',
                                        border: selected ? '0 0 0 2px #fbbf24 inset' : undefined
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{
                                            fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.06em',
                                            background: expired ? '#f1f5f9' : '#ecfdf5',
                                            color: expired ? '#94a3b8' : '#16a34a'
                                        }}>
                                            {expired ? 'Expired' : 'Active'}
                                        </span>
                                        <span style={{ fontSize: 9, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '.04em' }}>Exp {p.expiry ? formatPromoExpiry(p.expiry) : 'Ongoing'}</span>
                                    </div>
                                    <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{p.lender}: {p.title}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
