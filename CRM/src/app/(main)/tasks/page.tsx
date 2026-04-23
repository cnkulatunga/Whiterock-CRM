'use client';

import { useState, useEffect } from 'react';
import { followups as initialFollowups, leads, promotions, teamMembers } from '@/data/dummy';
import { usePermissions } from '@/hooks/usePermissions';

const TYPE_META: Record<string, { emoji: string, color: string }> = {
    'Call': { emoji: '📞', color: 'text-blue-500' },
    'Meeting': { emoji: '🤝', color: 'text-purple-500' },
    'Follow-up': { emoji: '🔁', color: 'text-indigo-500' },
    'Email': { emoji: '📨', color: 'text-rose-500' },
    'Document': { emoji: '📄', color: 'text-amber-500' },
    'Research': { emoji: '📊', color: 'text-emerald-500' },
    'Outbound': { emoji: '📞', color: 'text-blue-500' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function TasksPage() {
    const { hasAction, userRole } = usePermissions();
    const canAssign = hasAction('tasks', 'assign');

    // --- State Management ---
    const [tasks, setTasks] = useState(initialFollowups.map((f) => ({
        id: f.id,
        title: f.title,
        type: f.type,
        typeColor: TYPE_META[f.type.split(' ')[1]]?.color || 'text-blue-500',
        client: f.client,
        phone: f.phone,
        email: f.email,
        date: f.date,
        time: f.time,
        taskStatus: 'To Do',
        leadStatus: f.priority as any,
        assignee: f.assignee,
        notes: f.description
    })));

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<any>(null);

    // --- Form State ---
    const [formData, setFormData] = useState({
        title: '',
        assignee: 'Thanushika',
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

    // --- Calendar Logic ---
    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrev = new Date(year, month, 0).getDate();

        const grid = [];

        // Prev month days
        for (let i = firstDay - 1; i >= 0; i--) {
            grid.push({ day: daysInPrev - i, current: false });
        }

        // Current month days
        const today = new Date();
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
            grid.push({ day: d, current: true, isToday, isSelected });
        }

        // Next month days
        const trailing = grid.length % 7 === 0 ? 0 : 7 - (grid.length % 7);
        for (let d = 1; d <= trailing; d++) {
            grid.push({ day: d, current: false });
        }

        return grid;
    };

    const handleDateSelect = (d: number) => {
        setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
    };

    const changeMonth = (offset: number) => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + offset);
        setViewDate(d);
    };

    // --- Actions ---
    const handleCreateTask = () => {
        if (!formData.title || !formData.leadId) return;
        const meta = TYPE_META[formData.type] || { emoji: '📋', color: 'text-gray-500' };
        const newTask = {
            id: tasks.length + 1,
            title: formData.title,
            type: formData.type,
            typeColor: meta.color,
            client: leads.find(l => l.id === formData.leadId)?.name || 'Direct Lead',
            phone: formData.phone,
            email: formData.email,
            date: formData.date,
            time: formData.time,
            taskStatus: formData.taskStatus,
            leadStatus: formData.leadStatus as any,
            assignee: formData.assignee,
            notes: formData.notes
        };
        setTasks([newTask, ...tasks]);
        setFormData({ ...formData, title: '', leadId: '', notes: '' });
    };

    const onLeadSelect = (id: string) => {
        const lead = leads.find(l => l.id === id);
        if (lead) {
            setFormData({
                ...formData,
                leadId: id,
                phone: lead.phone,
                email: lead.email
            });
        } else {
            setFormData({ ...formData, leadId: id, phone: '', email: '' });
        }
    };

    const formatDate = (dateStr: string, time: string) => {
        const d = new Date(dateStr);
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const tmr = new Date(today); tmr.setDate(today.getDate() + 1);
        const tmrStr = tmr.toISOString().split('T')[0];

        if (dateStr === todayStr) return `Today, ${time}`;
        if (dateStr === tmrStr) return `Tmr, ${time}`;
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + `, ${time}`;
    };

    const filteredCalTasks = tasks.filter(t => t.date === selectedDate.toISOString().split('T')[0]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
            {/* Header Mini (Consistent with HTML Dashboard Style) */}
            <header className="h-[48px] bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-white shadow-md">
                        <i className="fa-solid fa-list-check text-xs"></i>
                    </div>
                    <div>
                        <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Integrated Task Hub</h1>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Unified management of follow-ups and lender activities</p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Tasks</span>
                        <span className="text-[11px] font-black text-slate-900">{tasks.filter(t => t.taskStatus !== 'Complete').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Due Today</span>
                        <span className="text-[11px] font-black text-indigo-600">2</span>
                    </div>
                </div>
            </header>

            {/* Dashboard Content (4 Columns) */}
            <main className="flex-1 p-3 grid grid-cols-[240px_220px_1fr_240px] gap-3 overflow-hidden">

                {/* COL 1: CREATE TASK */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#0f172a]">Create New Task</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <div className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Task Description</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                type="text" placeholder="Title..." className="w-full h-8 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assignee</label>
                                <select
                                    disabled={!canAssign}
                                    value={formData.assignee}
                                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                                    className={`w-full h-8 px-2 border border-slate-100 rounded-lg text-[10px] font-bold outline-none transition-all ${!canAssign ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 focus:bg-white focus:border-indigo-500'
                                        }`}
                                >
                                    {!canAssign && <option value={formData.assignee}>{formData.assignee}</option>}
                                    {canAssign && teamMembers.map(m => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Lead</label>
                                <select value={formData.leadId} onChange={e => onLeadSelect(e.target.value)} className="w-full h-8 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none">
                                    <option value="">Select lead...</option>
                                    {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    type="tel" placeholder="+44..." className="w-full h-8 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                                <input
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    type="email" placeholder="mail@example.com" className="w-full h-8 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full h-8 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none">
                                    {Object.keys(TYPE_META).map(k => <option key={k}>{k}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                                <select value={formData.leadStatus} onChange={e => setFormData({ ...formData, leadStatus: e.target.value })} className="w-full h-8 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none">
                                    <option>Hot</option>
                                    <option>Warm</option>
                                    <option>Cool</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                                <input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} type="date" className="w-full h-8 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time</label>
                                <input value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} type="time" className="w-full h-8 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                rows={3} placeholder="..." className="w-full p-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none resize-none focus:bg-white focus:border-indigo-500 transition-all"
                            ></textarea>
                        </div>
                        <button onClick={handleCreateTask} className="w-full py-2.5 bg-[#0f172a] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-sm">
                            Initialize Task Hub Entry
                        </button>
                    </div>
                </section>

                {/* COL 2: CALENDAR VIEW */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#0f172a]">Calendar View</span>
                        <span className="text-[8px] font-bold text-slate-400 font-mono">{viewDate.getFullYear()}</span>
                    </div>
                    <div className="flex-1 p-3 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={() => changeMonth(-1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-all">
                                <i className="fa-solid fa-chevron-left text-[8px]"></i>
                            </button>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#0f172a]">{MONTHS[viewDate.getMonth()]}</span>
                            <button onClick={() => changeMonth(1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-all">
                                <i className="fa-solid fa-chevron-right text-[8px]"></i>
                            </button>
                        </div>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="text-center text-[7px] font-black text-slate-400 uppercase">{d}</div>
                            ))}
                        </div>
                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {renderCalendar().map((cell, i) => (
                                <button
                                    key={i}
                                    onClick={() => cell.current && handleDateSelect(cell.day)}
                                    className={`aspect-square flex items-center justify-center text-[9px] font-black rounded-lg transition-all
                                        ${cell.isSelected ? 'bg-indigo-600 text-white shadow-md' :
                                            cell.isToday ? 'bg-[#0f172a] text-white' :
                                                cell.current ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-200'}`}
                                >
                                    {cell.day}
                                </button>
                            ))}
                        </div>
                        {/* Filtered Task List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 border-t border-slate-50 space-y-2.5">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                                {selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? "Today's Tasks" : `${selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} Tasks`}
                            </label>
                            {filteredCalTasks.length === 0 ? (
                                <p className="text-[9px] text-slate-300 font-bold italic py-4">No tasks found.</p>
                            ) : (
                                filteredCalTasks.map(t => (
                                    <div key={t.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:translate-x-1 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter">{t.time} • {t.type}</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-800 leading-tight truncate group-hover:text-indigo-600">{t.title}</p>
                                        <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{t.client}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* COL 3: ALL TASKS TABLE */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-5 h-[48px] bg-[#0f172a] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-slate-500 text-[10px]"></i>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Global Task Registry</span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{tasks.length} Total</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                                <tr>
                                    <th className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Case Activity</th>
                                    <th className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Lead</th>
                                    <th className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Assignee</th>
                                    <th className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                                    <th className="px-4 py-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Task Status</th>
                                    <th className="px-4 py-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50/50">
                                {tasks.map((t) => {
                                    const isExpanded = expandedId === t.id;
                                    return (
                                        <>
                                            <tr
                                                key={t.id}
                                                onClick={() => setExpandedId(isExpanded ? null : t.id)}
                                                className={`transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <i className={`fa-solid fa-chevron-right text-[7px] text-slate-300 transition-transform ${isExpanded ? 'rotate-90 text-indigo-400' : ''}`}></i>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 leading-tight uppercase tracking-tight">{t.title}</p>
                                                            <p className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${t.typeColor}`}>{t.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-[10px] font-black text-slate-700 leading-none">{t.client}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[7px] font-black text-slate-500 uppercase">
                                                            {t.assignee?.charAt(0)}
                                                        </div>
                                                        <p className="text-[9px] font-black text-slate-600 leading-none">{t.assignee}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{formatDate(t.date, t.time)}</p>
                                                </td>
                                                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={t.taskStatus}
                                                        onChange={e => {
                                                            const newTasks = tasks.map(tk => tk.id === t.id ? { ...tk, taskStatus: e.target.value } : tk);
                                                            setTasks(newTasks as any);
                                                        }}
                                                        className={`h-6 px-2 text-[8px] font-black border border-slate-100 rounded-lg outline-none uppercase tracking-tighter cursor-pointer transition-all
                                                            ${t.taskStatus === 'Complete' ? 'bg-emerald-50 text-emerald-600' :
                                                                t.taskStatus === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                                                    t.taskStatus === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}
                                                    >
                                                        <option>To Do</option>
                                                        <option>In Progress</option>
                                                        <option>Complete</option>
                                                        <option>Overdue</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={t.leadStatus}
                                                        onChange={e => {
                                                            const newTasks = tasks.map(tk => tk.id === t.id ? { ...tk, leadStatus: e.target.value as any } : tk);
                                                            setTasks(newTasks);
                                                        }}
                                                        className={`h-6 px-2 text-[8px] font-black border rounded-lg outline-none uppercase tracking-tighter cursor-pointer transition-all
                                                            ${t.leadStatus === 'Hot' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                t.leadStatus === 'Warm' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                                                    >
                                                        <option>Hot</option>
                                                        <option>Warm</option>
                                                        <option>Cool</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-indigo-50/30 border-b border-indigo-100/50 animate-in slide-in-from-top-1 duration-200">
                                                    <td colSpan={6} className="px-10 py-5">
                                                        <div className="grid grid-cols-4 gap-6">
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assignee</label>
                                                                <p className="text-[10px] font-black text-slate-900 leading-none">{t.assignee}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Full Date</label>
                                                                <p className="text-[10px] font-black text-slate-900 leading-none">{t.date} @ {t.time}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                                                <p className="text-[10px] font-black text-[#2447d7] leading-none">{t.phone}</p>
                                                            </div>
                                                            <div className="space-y-1 text-right">
                                                                <button className="h-7 px-4 bg-slate-900 text-white text-[8px] font-black uppercase rounded-lg shadow-sm">View Full Lead</button>
                                                            </div>
                                                            <div className="col-span-2 space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                                                <p className="text-[10px] font-black text-[#2447d7] leading-none uppercase tracking-tighter">{t.email}</p>
                                                            </div>
                                                            <div className="col-span-2 space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Internal Context</label>
                                                                <p className="text-[10px] text-slate-600 leading-relaxed font-medium uppercase tracking-tighter">{t.notes || 'No notes provided for this task registry entry.'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* COL 4: LENDER PROMOTIONS (Vertical List Like HTML) */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm">
                                <i className="fa-solid fa-tags text-[10px]"></i>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-900">Promotions</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {promotions.map((p, i) => (
                            <div
                                key={i}
                                onClick={() => { setSelectedPromo(p); setIsPromoModalOpen(true); }}
                                className={`p-4 border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-all group cursor-pointer ${p.expiry.includes('Apr') ? '' : 'opacity-60 bg-slate-50/20'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${p.expiry.includes('Apr') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                        {p.expiry.includes('Apr') ? 'Active' : 'Expired'}
                                    </span>
                                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">Exp: {p.expiry}</span>
                                </div>
                                <h4 className="text-[10px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.lender}: {p.title}</h4>
                                <p className="text-[8px] text-slate-500 mt-2 line-clamp-2 leading-relaxed uppercase tracking-tighter font-medium">{p.desc}</p>
                                <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-50/50">
                                    <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                        <i className="fa-solid fa-file-pdf"></i> View Doc
                                    </span>
                                    <i className="fa-solid fa-chevron-right text-[7px] text-slate-200 group-hover:translate-x-0.5 transition-all"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Document Viewer Modal (Matched to HTML Modal) */}
            {isPromoModalOpen && selectedPromo && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-in-center">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                                    <i className="fa-solid fa-file-pdf"></i>
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{selectedPromo.lender.replace(/\s+/g, '_')}_ref.pdf</h3>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[.15em]">Official Lender Documentation</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex"><i className="fa-solid fa-print"></i></button>
                                <button className="w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex"><i className="fa-solid fa-download"></i></button>
                                <div className="w-px h-5 bg-slate-100 mx-2"></div>
                                <button onClick={() => setIsPromoModalOpen(false)} className="w-9 h-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex shadow-sm border border-rose-100"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto custom-scrollbar flex justify-center">
                            <article className="bg-white w-full max-w-[800px] shadow-2xl p-16 min-h-[1100px] relative font-serif text-slate-900">
                                {/* Watermark/Ribbon */}
                                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
                                    <div className="bg-indigo-600 text-white text-[8px] font-black text-center py-1 transform rotate-45 translate-x-10 translate-y-6 w-[150%] uppercase tracking-widest shadow-md">OFFICIAL OFFER</div>
                                </div>

                                <div className="border-b-8 border-indigo-600 pb-12 mb-12 flex justify-between items-end">
                                    <div className="font-serif">
                                        <h1 className="text-4xl font-black text-indigo-600 tracking-tighter leading-none mb-2">WHITEROCK</h1>
                                        <p className="text-[11px] font-black uppercase tracking-[.25em] text-slate-400">Lender Network Ecosystem</p>
                                    </div>
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-[.2em] text-right">
                                        REF ID: LP-2026-XAB<br />ISSUED: 21 APR 2026
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 leading-none mb-4 uppercase tracking-tighter">{selectedPromo.title}</h2>
                                        <p className="text-indigo-600 font-bold uppercase tracking-[.3em] text-[12px]">{selectedPromo.lender}</p>
                                    </div>

                                    <div className="bg-slate-50 border-l-[6px] border-indigo-600 p-8 shadow-inner">
                                        <p className="text-[9px] font-black text-indigo-600 uppercase mb-4 tracking-[.2em]">Promotion Summary</p>
                                        <p className="text-xl text-slate-800 leading-relaxed italic font-medium">"{selectedPromo.desc}"</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-16 pt-8">
                                        <div className="space-y-5">
                                            <h4 className="text-[10px] font-black uppercase text-slate-900 border-b-2 border-slate-100 pb-2 tracking-widest">Key Conditions</h4>
                                            <ul className="text-[10px] text-slate-500 space-y-4 font-sans font-semibold uppercase tracking-tighter leading-relaxed list-none">
                                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1"></div> Exclusive to Whiterock accredited broker nodes.</li>
                                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1"></div> Minimum loan capacity threshold: £100,000.</li>
                                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1"></div> Auto-submission via CRM module registry.</li>
                                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1"></div> Valid across all business sectors in EMEA.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black uppercase text-slate-900 border-b-2 border-slate-100 pb-2 tracking-widest">Validity Period</h4>
                                            <div className="p-6 bg-[#0f172a] rounded-2xl shadow-xl">
                                                <p className="text-[8px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Expiry Threshold</p>
                                                <p className="text-2xl font-black text-white tracking-widest uppercase">{selectedPromo.expiry} 2026</p>
                                            </div>
                                            <p className="text-[10px] font-sans text-slate-400 leading-relaxed uppercase tracking-widest">This document is digitally signed and authorized for internal broker distribution only.</p>
                                        </div>
                                    </div>

                                    <div className="pt-24 border-t-2 border-slate-100 mt-24 flex justify-between items-center opacity-40 grayscale">
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg border-2 border-slate-200 flex items-center justify-center font-black">X</div>
                                            AUTHORIZED DOCUMENT NODE
                                        </div>
                                        <div className="text-[7px] font-black text-slate-400 uppercase tracking-[.25em] text-right leading-loose">
                                            SYST_LOG_REF: WR_P_992<br />WHITEROCK ECOSYSTEM V4.0
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
