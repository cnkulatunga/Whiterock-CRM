'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

type CalEvent = { type: 'task' | 'followup'; title: string; lead: string; time: string; priority: 'high' | 'medium' | 'low'; done?: boolean; customStatus?: string };
type CalEvents = Record<string, CalEvent[]>;
type DdFilter = 'todo' | 'inprogress' | 'overdue' | 'complete';

import { calEvents as CAL_EVENTS } from '@/data/dummy';

export default function CalendarCard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerDate, setDrawerDate] = useState<{ year: number; month: number; day: number } | null>(null);
    const [ddFilter, setDdFilter] = useState<DdFilter>('todo');
    const [events, setEvents] = useState<CalEvents>(CAL_EVENTS);
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<CalEvent & { status: string }>>({});

    const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const changeMonth = (offset: number) => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + offset);
        setCurrentDate(d);
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const prevDays = daysInMonth(month - 1, year);
    const today = new Date();

    const calendarDays: { day: number; current: boolean; today: boolean; dateKey: string }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevDays - i, m = month === 0 ? 11 : month - 1, y = month === 0 ? year - 1 : year;
        calendarDays.push({ day: d, current: false, today: false, dateKey: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }
    for (let i = 1; i <= days; i++) {
        calendarDays.push({ day: i, current: true, today: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year, dateKey: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }
    for (let i = 1; i <= 42 - calendarDays.length; i++) {
        const m = month === 11 ? 0 : month + 1, y = month === 11 ? year + 1 : year;
        calendarDays.push({ day: i, current: false, today: false, dateKey: `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }

    const openDrawer = (dateKey: string) => {
        const [y, m, d] = dateKey.split('-').map(Number);
        setDrawerDate({ year: y, month: m - 1, day: d });
        setDdFilter('todo'); setEditIdx(null); setDrawerOpen(true);
    };

    const getStatus = (e: CalEvent, dateKey: string) => {
        if (e.done) return 'done';
        if (e.customStatus) return e.customStatus;
        const dd = new Date(dateKey); dd.setHours(0, 0, 0, 0);
        const td = new Date(); td.setHours(0, 0, 0, 0);
        if (dd < td) return 'overdue';
        if (dd.getTime() === td.getTime()) return 'in progress';
        return 'to do';
    };

    const ddKey = drawerDate ? `${drawerDate.year}-${String(drawerDate.month + 1).padStart(2, '0')}-${String(drawerDate.day).padStart(2, '0')}` : '';
    const ddEvents = ddKey ? (events[ddKey] || []) : [];
    const filteredEvents = ddEvents.filter(e => {
        const s = getStatus(e, ddKey);
        if (ddFilter === 'todo') return s === 'to do';
        if (ddFilter === 'inprogress') return s === 'in progress';
        if (ddFilter === 'overdue') return s === 'overdue';
        return s === 'done';
    });

    const saveEdit = (idx: number) => {
        const updated = [...(events[ddKey] || [])];
        const e = { ...updated[idx] };
        if (editForm.title) e.title = editForm.title;
        if (editForm.lead) e.lead = editForm.lead;
        if (editForm.time) e.time = editForm.time;
        if (editForm.priority) e.priority = editForm.priority as 'high' | 'medium' | 'low';
        if (editForm.type) e.type = editForm.type as 'task' | 'followup';
        if (editForm.status === 'done') { e.done = true; e.customStatus = undefined; }
        else { e.done = false; e.customStatus = editForm.status !== 'to do' ? editForm.status : undefined; }
        updated[idx] = e;
        setEvents({ ...events, [ddKey]: updated });
        setEditIdx(null);
    };

    const prioColor = { high: '#b91c1c', medium: '#b45309', low: '#64748b' };
    const prioBg = { high: '#fee2e2', medium: '#fef3c7', low: '#f1f5f9' };
    const sColor = (s: string) => s === 'done' ? '#15803d' : s === 'overdue' ? '#b91c1c' : s === 'in progress' ? '#b45309' : '#64748b';
    const sBg = (s: string) => s === 'done' ? '#dcfce7' : s === 'overdue' ? '#fee2e2' : s === 'in progress' ? '#fef3c7' : '#f1f5f9';

    const drawer = drawerOpen && drawerDate ? (
        <div className="fixed inset-0 z-[1100] flex justify-end overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/28 backdrop-blur-[3px]" onClick={() => setDrawerOpen(false)} />
            <div className="relative w-full max-w-[520px] bg-white h-full shadow-[-24px_0_60px_rgba(0,0,0,0.14)] border-l border-slate-100 flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                            {dayNames[new Date(drawerDate.year, drawerDate.month, drawerDate.day).getDay()]}, {drawerDate.day} {monthNames[drawerDate.month]} {drawerDate.year}
                        </div>
                        <div className="text-[8px] font-bold text-slate-400 mt-0.5">
                            {ddEvents.filter(e => e.type === 'task').length} tasks · {ddEvents.filter(e => e.type === 'followup').length} follow-ups
                        </div>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>
                <div className="flex border-b border-slate-100 shrink-0">
                    {(['todo', 'inprogress', 'overdue', 'complete'] as DdFilter[]).map(f => (
                        <button key={f} onClick={() => setDdFilter(f)}
                            className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest border-b-2 transition-all ${ddFilter === f ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}>
                            {f === 'todo' ? 'To Do' : f === 'inprogress' ? 'In Progress' : f === 'overdue' ? 'Overdue' : 'Complete'}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-8">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                                <i className="fa-solid fa-calendar-xmark text-3xl" />
                            </div>
                            <div className="text-[13px] font-black text-slate-900 uppercase tracking-widest">No Activities</div>
                            <div className="text-[11px] font-medium text-slate-400 mt-2">No activities for this filter.</div>
                            <button onClick={() => setDrawerOpen(false)} className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Return to Calendar</button>
                        </div>
                    ) : (
                        [...filteredEvents].sort((a, b) => a.time.localeCompare(b.time)).map((e, idx) => {
                            const realIdx = ddEvents.indexOf(e);
                            const status = getStatus(e, ddKey);
                            return (
                                <div key={idx} className={`flex items-start gap-3 p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-all ${e.type === 'task' ? 'border-l-[3px] border-l-indigo-500' : 'border-l-[3px] border-l-amber-400'} ${status === 'overdue' ? 'bg-red-50/30' : ''}`}>
                                    {editIdx === realIdx ? (
                                        <div className="flex-1 space-y-2 bg-slate-50 p-3 rounded-xl">
                                            <input type="text" defaultValue={e.title} onChange={ev => setEditForm(f => ({ ...f, title: ev.target.value }))} className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-indigo-500 bg-white" />
                                            <input type="text" defaultValue={e.lead} onChange={ev => setEditForm(f => ({ ...f, lead: ev.target.value }))} className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-indigo-500 bg-white" />
                                            <input type="text" defaultValue={e.time} onChange={ev => setEditForm(f => ({ ...f, time: ev.target.value }))} className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-indigo-500 bg-white" />
                                            <div className="grid grid-cols-3 gap-2">
                                                <select defaultValue={e.priority} onChange={ev => setEditForm(f => ({ ...f, priority: ev.target.value as 'high' | 'medium' | 'low' }))} className="border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none bg-white">
                                                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                                                </select>
                                                <select defaultValue={e.type} onChange={ev => setEditForm(f => ({ ...f, type: ev.target.value as 'task' | 'followup' }))} className="border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none bg-white">
                                                    <option value="task">Task</option><option value="followup">Follow-up</option>
                                                </select>
                                                <select defaultValue={status} onChange={ev => setEditForm(f => ({ ...f, status: ev.target.value }))} className="border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none bg-white">
                                                    <option value="to do">To Do</option><option value="in progress">In Progress</option><option value="overdue">Overdue</option><option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => saveEdit(realIdx)} className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-indigo-700 transition-all">✓ Save</button>
                                                <button onClick={() => setEditIdx(null)} className="flex-1 bg-slate-200 text-slate-600 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all">✕ Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${e.type === 'task' ? 'bg-indigo-50' : 'bg-amber-50'}`}>
                                                <i className={`fa-solid ${e.type === 'task' ? 'fa-list-check' : 'fa-phone-volume'} text-sm ${e.type === 'task' ? 'text-indigo-600' : 'text-amber-600'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    <span style={{ background: e.type === 'task' ? '#ede9fe' : '#fef3c7', color: e.type === 'task' ? '#7c3aed' : '#b45309' }} className="text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">{e.type === 'task' ? 'Task' : 'Follow-up'}</span>
                                                    <span style={{ background: prioBg[e.priority], color: prioColor[e.priority] }} className="text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">{e.priority}</span>
                                                    <span style={{ background: sBg(status), color: sColor(status) }} className="text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">{status}</span>
                                                </div>
                                                <div className={`text-[10px] font-bold text-slate-900 leading-snug ${e.done ? 'line-through opacity-60' : ''}`}>{e.title}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[8px] text-slate-500 font-medium"><i className="fa-solid fa-user text-[7px] mr-1" />{e.lead}</span>
                                                    <span className="text-[8px] text-slate-400 font-bold"><i className="fa-solid fa-clock text-[7px] mr-1" />{e.time}</span>
                                                    <button onClick={() => { setEditIdx(realIdx); setEditForm({ title: e.title, lead: e.lead, time: e.time, priority: e.priority, type: e.type, status }); }}
                                                        className="ml-auto px-2 py-1 rounded bg-slate-100 text-slate-500 text-[8px] border border-slate-200 hover:bg-slate-200 transition-all">
                                                        <i className="fa-solid fa-pencil" /> Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <i className="fa-solid fa-calendar-days text-xs" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Operational Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                        <i className="fa-solid fa-chevron-left text-[8px]" />
                    </button>
                    <span className="text-[9px] font-black text-slate-900 uppercase">{monthNames[month]} {year}</span>
                    <button onClick={() => changeMonth(1)} className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                        <i className="fa-solid fa-chevron-right text-[8px]" />
                    </button>
                </div>
            </div>
            <div className="flex-1 px-3 pt-2 pb-1">
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-center text-[7px] font-black text-slate-400 uppercase">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((d, i) => {
                        const hasEvents = d.current && !!events[d.dateKey]?.length;
                        return (
                            <div key={i} onClick={() => d.current && openDrawer(d.dateKey)}
                                className={`h-[26px] flex items-center justify-center text-[9px] font-bold rounded-lg transition-all relative
                                    ${d.current ? 'text-slate-700 hover:bg-slate-50 cursor-pointer' : 'text-slate-300'}
                                    ${d.today ? 'bg-slate-900 !text-white font-black' : ''}`}>
                                {d.day}
                                {hasEvents && !d.today && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-500" />}
                            </div>
                        );
                    })}
                </div>
            </div>
            {typeof window !== 'undefined' && drawer && createPortal(drawer, document.body)}
        </div>
    );
}
