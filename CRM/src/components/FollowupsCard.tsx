'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { followups as initialFollowups, leads, teamMembers } from '@/data/dummy';
import { usePermissions } from '@/hooks/usePermissions';

type Followup = {
    id: string;
    title: string;
    desc: string;
    client: string;
    leadId?: string;
    time: string;
    rawTime: string;
    priority: 'Hot' | 'Warm' | 'Cool';
    assignee?: string;
};

type View = 'list' | 'addForm' | 'detail' | 'editForm';

const seed: Followup[] = (initialFollowups as any[]).map(f => ({
    ...f,
    rawTime: '',
    assignee: f.assignee || 'Thanushika'
}));

export default function FollowupsCard() {
    const router = useRouter();
    const { hasAction } = usePermissions();
    const canAssign = hasAction('tasks', 'assign');

    const [followups, setFollowups] = useState<Followup[]>([]);
    const [view, setView] = useState<View>('list');
    const [selected, setSelected] = useState<Followup | null>(null);

    const loadTasks = () => {
        fetch('/api/tasks?upcoming=true')
            .then(res => res.ok ? res.json() : Promise.reject('API Error'))
            .then(data => {
                const items = Array.isArray(data) ? data : (data?.results ?? []);
                if (!items.length) return setFollowups([]);
                const mapped = items.map((f: any) => {
                    let normalizedPrio = f.priority || 'Warm';
                    if (normalizedPrio === 'High') normalizedPrio = 'Hot';
                    if (normalizedPrio === 'Medium') normalizedPrio = 'Warm';
                    if (normalizedPrio === 'Low') normalizedPrio = 'Cool';

                    const datePart = f.date || 'TBD';
                    const timePart = (f.time && f.time !== 'undefined') ? f.time : '';
                    const assigneeName = f.assignee?.name ?? f.assignee ?? '';

                    return {
                        id: f.id,
                        title: f.title,
                        desc: f.description,
                        client: f.client,
                        leadId: f.lead?.id ?? null,
                        time: datePart + (timePart ? ' ' + timePart : ''),
                        rawTime: datePart + 'T' + timePart,
                        priority: normalizedPrio as any,
                        assignee: assigneeName
                    };
                });
                setFollowups(mapped);
            })
            .catch(err => {
                console.error('Tasks fetch error:', err);
                // Fallback to initial followups if API fails
                const fallbackMapped: Followup[] = (initialFollowups as any[]).map(f => ({
                    id: String(f.id),
                    title: f.title,
                    desc: f.description,
                    client: f.client,
                    time: (f.date || 'TBD') + ' ' + (f.time || ''),
                    rawTime: (f.date || 'TBD') + 'T' + (f.time || ''),
                    priority: 'Hot',
                    assignee: f.assignee
                }));
                setFollowups(fallbackMapped);
            });
    };

    useEffect(() => {
        loadTasks();
    }, []);

    // Add form state
    const [addForm, setAddForm] = useState({ title: '', priority: 'Hot', time: '', lead: '', remarks: '', assignee: 'Thanushika' });

    // Edit form state
    const [editForm, setEditForm] = useState({ title: '', priority: 'Hot', time: '', lead: '', remarks: '', assignee: '' });

    /* ── helpers ── */
    const fmtTime = (raw: string) => {
        if (!raw) return 'TBD';
        const d = new Date(raw);
        return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const prioTextColor = (p: string) =>
        p === 'Hot' ? 'text-red-600' : p === 'Warm' ? 'text-amber-600' : 'text-slate-600';

    const prioBadge = (p: string) =>
        p === 'Hot'
            ? 'bg-red-50 text-red-600'
            : p === 'Warm'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-slate-100 text-slate-600';

    const prioBg = (p: string) =>
        p === 'Hot'
            ? 'bg-red-50/50 border-red-100 hover:bg-red-50'
            : p === 'Warm'
                ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100';

    /* ── actions ── */
    const openDetail = (f: Followup) => {
        setSelected(f);
        setView('detail');
    };

    const closeDetail = () => {
        setSelected(null);
        setView('list');
    };

    const openEditForm = () => {
        if (!selected) return;
        setEditForm({
            title: selected.title,
            priority: selected.priority,
            time: selected.rawTime,
            lead: selected.client,
            remarks: selected.desc,
            assignee: selected.assignee || 'Thanushika',
        });
        setView('editForm');
    };

    const saveEdit = async () => {
        if (!selected || !editForm.title.trim()) return;
        const payload = {
            id: selected.id,
            title: editForm.title,
            priority: editForm.priority,
            date: editForm.time?.split('T')[0],
            time: editForm.time?.split('T')[1],
            client: editForm.lead,
            description: editForm.remarks,
            assignee: editForm.assignee
        };

        try {
            const res = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                loadTasks();
                setView('list');
                setSelected(null);
            }
        } catch (e) { console.error(e); }
    };

    const addFollowup = async () => {
        if (!addForm.title.trim() || !addForm.time || !addForm.lead) return;
        const payload = {
            title: addForm.title,
            priority: addForm.priority,
            date: addForm.time.split('T')[0],
            time: addForm.time.split('T')[1],
            client: addForm.lead,
            description: addForm.remarks,
            assignee: addForm.assignee,
            status: 'To Do'
        };

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                loadTasks();
                setAddForm({ title: '', priority: 'Hot', time: '', lead: '', remarks: '', assignee: 'Thanushika' });
                setView('list');
            }
        } catch (e) { console.error(e); }
    };

    const completeTask = async () => {
        if (!selected) return;
        try {
            await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selected.id, status: 'Complete' })
            });
            loadTasks();
            closeDetail();
        } catch (e) { console.error(e); }
    };

    /* ── render ── */
    return (
        <div className="glass-card card-h-std flex flex-col overflow-hidden">

            {/* ── Header: List / Add Form ── */}
            {(view === 'list' || view === 'addForm') && (
                <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ color: '#818cf8', fontSize: 13, flexShrink: 0 }}></i>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>Upcoming Follow-ups</p>
                        <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>{view === 'addForm' ? 'New Activity' : 'Tasks & Reminders'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setView(view === 'addForm' ? 'list' : 'addForm')}
                            style={{ width: 24, height: 24, borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.08)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <i className={`fa-solid ${view === 'addForm' ? 'fa-xmark' : 'fa-plus'} text-[10px]`}></i>
                        </button>
                        <span onClick={() => router.push('/tasks')} style={{ fontSize: 10, fontWeight: 900, color: '#818cf8', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '.05em' }}>View All</span>
                    </div>
                </div>
            )}

            {/* ── Header: Detail / Edit ── */}
            {(view === 'detail' || view === 'editForm') && (
                <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                    <button
                        onClick={view === 'editForm' ? () => setView('detail') : closeDetail}
                        style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.06)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                    >
                        <i className="fa-solid fa-arrow-left text-[10px]"></i>
                    </button>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>
                            {view === 'editForm' ? 'Edit Follow-up' : 'Follow-up Details'}
                        </p>
                        <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>
                            {view === 'editForm' ? 'Editing' : 'Activity Record'}
                        </p>
                    </div>
                    {view === 'detail' && (
                        <button
                            onClick={openEditForm}
                            style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.08)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                    )}
                </div>
            )}

            {/* ── Add Form ── */}
            {view === 'addForm' && (
                <div className="flex-1 flex flex-col p-3 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2 flex-1">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">Title / Subject</label>
                            <input
                                type="text"
                                value={addForm.title}
                                onChange={e => setAddForm({ ...addForm, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                                placeholder="e.g. Contract Signing"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">Priority</label>
                            <select
                                value={addForm.priority}
                                onChange={e => setAddForm({ ...addForm, priority: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                            >
                                <option>Hot</option><option>Warm</option><option>Cool</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={addForm.time}
                                onChange={e => setAddForm({ ...addForm, time: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">Linked Lead / ID</label>
                            <select
                                value={addForm.lead}
                                onChange={e => setAddForm({ ...addForm, lead: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                            >
                                <option value="">-- Select Lead --</option>
                                {leads.map(l => (
                                    <option key={l.id} value={l.name}>{l.name} ({l.id})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">Assign To</label>
                            <select
                                disabled={!canAssign}
                                value={addForm.assignee}
                                onChange={e => setAddForm({ ...addForm, assignee: e.target.value })}
                                className={`w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none transition-all ${!canAssign ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white focus:border-indigo-500'
                                    }`}
                            >
                                {!canAssign && <option value={addForm.assignee}>{addForm.assignee}</option>}
                                {canAssign && teamMembers.map(m => (
                                    <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">Remarks</label>
                            <textarea
                                value={addForm.remarks}
                                onChange={e => setAddForm({ ...addForm, remarks: e.target.value })}
                                rows={2}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500 resize-none"
                                placeholder="Enter follow-up details..."
                            />
                        </div>
                        <div className="col-span-2 flex gap-2 pt-1 mt-auto">
                            <button
                                onClick={addFollowup}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                            >
                                Save Activity
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className="px-4 bg-slate-200 text-slate-600 py-2 rounded-lg text-[10px] font-black uppercase transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── List ── */}
            {view === 'list' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                    {followups.map(f => (
                        <div
                            key={f.id}
                            onClick={() => openDetail(f)}
                            className={`p-3 rounded-xl border group transition-all cursor-pointer ${prioBg(f.priority)}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <select
                                    value={f.priority}
                                    onChange={e => {
                                        e.stopPropagation();
                                        setFollowups(followups.map(tk => tk.id === f.id ? { ...tk, priority: e.target.value as any } : tk));
                                    }}
                                    className={`text-[10px] font-black uppercase rounded px-1.5 py-0.5 border-none outline-none cursor-pointer transition-all ${prioBadge(f.priority)}`}
                                >
                                    <option>Hot</option>
                                    <option>Warm</option>
                                    <option>Cool</option>
                                </select>
                                <span className="text-[10px] font-bold text-slate-400">{f.time}</span>
                            </div>
                            <h4 className="text-[10px] font-black text-slate-900">{f.title}</h4>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-[10px] text-slate-500 line-clamp-1 flex-1">{f.desc}</p>
                                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-tighter ml-2 shrink-0">
                                    {f.assignee?.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Detail View ── */}
            {view === 'detail' && selected && (
                <div className="flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                    {/* Priority + time row */}
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${prioBadge(selected.priority)}`}>
                            Priority: {selected.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{selected.time}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-[11px] font-black text-slate-900 leading-tight mb-3">{selected.title}</h2>

                    <div className="space-y-2 flex-1">
                        {/* Associated Lead */}
                        <div className="flex items-center gap-3 p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                <i className="fa-solid fa-user text-[10px]"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Associated Lead</p>
                                <p className="text-xs font-black text-slate-900 leading-none truncate">
                                    {selected.client} <span className="text-indigo-600 ml-1">{selected.id}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => { window.location.href = selected.leadId ? `/pipeline/${selected.leadId}` : '/pipeline'; }}
                                className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shrink-0"
                            >
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </button>
                        </div>

                        {/* Remarks */}
                        <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <i className="fa-solid fa-align-left text-indigo-400"></i> Narrative & Remarks
                            </p>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">{selected.desc}</p>
                        </div>

                        {/* Assignee */}
                        <div className="p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black uppercase">
                                    {selected.assignee?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Assigned To</p>
                                    <p className="text-xs font-black text-indigo-900 leading-none">{selected.assignee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2">
                        <button
                            onClick={completeTask}
                            className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Complete Task
                        </button>
                        <button className="px-3 bg-slate-100 text-slate-600 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-slate-200 transition-all">
                            Reschedule
                        </button>
                    </div>
                </div>
            )}

            {/* ── Edit Form ── */}
            {view === 'editForm' && selected && (
                <div className="flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                    <div className="space-y-3 flex-1">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Activity Title</label>
                            <input
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[10px] font-bold outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Priority</label>
                                <select
                                    value={editForm.priority}
                                    onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-none focus:border-indigo-500"
                                >
                                    <option>Hot</option><option>Warm</option><option>Cool</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={editForm.time}
                                    onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Linked Lead</label>
                            <select
                                value={editForm.lead}
                                onChange={e => setEditForm({ ...editForm, lead: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-none focus:border-indigo-500"
                            >
                                <option value="">-- Select Lead --</option>
                                {leads.map(l => (
                                    <option key={l.id} value={l.name}>{l.name} ({l.id})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Assign To</label>
                            <select
                                disabled={!canAssign}
                                value={editForm.assignee}
                                onChange={e => setEditForm({ ...editForm, assignee: e.target.value })}
                                className={`w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[10px] font-bold outline-none transition-all ${!canAssign ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white focus:border-indigo-500'
                                    }`}
                            >
                                {!canAssign && <option value={editForm.assignee}>{editForm.assignee}</option>}
                                {canAssign && teamMembers.map(m => (
                                    <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Narrative / Remarks</label>
                            <textarea
                                value={editForm.remarks}
                                onChange={e => setEditForm({ ...editForm, remarks: e.target.value })}
                                rows={3}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[10px] font-medium outline-none focus:border-indigo-500 resize-none"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                        <button
                            onClick={saveEdit}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                        >
                            Update Follow-up
                        </button>
                        <button
                            onClick={() => setView('detail')}
                            className="px-4 bg-slate-100 text-slate-600 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
