import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const RECENT_LENDERS = [
    { id: 1, name: 'ANZ Bank', type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', status: 'Active' },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', status: 'Active' },
    { id: 3, name: 'Macquarie Bank', type: 'Non-Bank', interestRate: '5.59%', maxLoan: '$5,000,000', status: 'Active' },
    { id: 4, name: 'Liberty Financial', type: 'Non-Bank', interestRate: '6.49%', maxLoan: '$1,500,000', status: 'Inactive' },
];

const TYPE_COLORS = {
    'Major Bank': { bg: 'rgba(36,71,215,0.08)', color: '#2447d7', border: 'rgba(36,71,215,0.18)' },
    'Non-Bank': { bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

const STAT_CARDS = [
    { label: 'Verified Clients', value: '1,284', change: '+12%', changeLabel: 'vs last month', iconBg: '#ebf0ff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
    { label: 'Pending Loans', value: '42', change: '+8%', changeLabel: 'vs last week', iconBg: '#fff7ed', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg> },
    { label: 'Approved vs Rejected', value: '85% / 15%', change: '+3%', changeLabel: 'approval rate', iconBg: '#f0fdf4', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg> },
];

const LEADS = [
    { id: '#LD-99021', client: 'Sarah Jenkins', amount: '$250,000.00', stage: 'DOCUMENT COLLECTION', stageCls: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]', date: 'Oct 24, 2023' },
    { id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00', stage: 'LENDER SELECTION', stageCls: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]', date: 'Oct 23, 2023' },
    { id: '#LD-98845', client: 'Marcus Aurelius', amount: '$75,000.00', stage: 'COMPLETE', stageCls: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]', date: 'Oct 22, 2023' },
    { id: '#LD-98712', client: 'Peak Dynamics', amount: '$540,000.00', stage: 'REJECTED', stageCls: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]', date: 'Oct 21, 2023' },
];

const AMDashboard = ({ onNavigate, tasks = [], setTasks, notifyReminderSet }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Calendar state
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '', lead: '',
        date: todayStr, time: '12:00',
        type: 'Call', reminder: 'none',
        assignedTo: 'Self', message: ''
    });

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const isToday = (day) =>
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    const updateTaskStatus = (id, newStatus) => {
        if (!setTasks) return;
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateTaskReminder = (id, newReminder) => {
        if (!setTasks) return;
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const updated = { ...t, reminder: newReminder };
                if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updated);
                return updated;
            }
            return t;
        }));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const taskToAdd = { ...newTask, id: Date.now(), status: 'Pending', createdBy: 'Manager' };
        if (setTasks) setTasks([taskToAdd, ...tasks]);
        if (notifyReminderSet) notifyReminderSet(taskToAdd);
        setIsAddingTask(false);
        setNewTask({ title: '', lead: '', date: todayStr, time: '12:00', type: 'Call', reminder: 'none', assignedTo: 'Self', message: '' });
    };

    const hasReminders = tasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed');

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop relative z-[100]">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Accounts Manager Dashboard</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Real-time overview of financial processing and lender governance.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 relative border ${
                                isDark
                                    ? 'bg-[#1e2347] border-[#2c3568] text-[#8ea0d4] hover:bg-[#242b58] hover:text-[#e4ecff]'
                                    : 'bg-white border-[#edf2f7] text-[#718096] hover:bg-[#f7fafc] hover:text-[#2447d7]'
                            } ${hasReminders ? 'after:content-[""] after:absolute after:top-2.5 after:right-2.5 after:w-2 after:h-2 after:bg-red-500 after:border-2 after:rounded-full after:border-white' : ''}`}
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Reminders"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        {showNotifications && (
                            <div className={`absolute top-14 right-0 w-[300px] rounded-2xl shadow-xl z-[100] overflow-hidden animate-fadeIn border ${
                                isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'
                            }`}>
                                <div className={`p-4 border-b text-sm font-bold ${
                                    isDark ? 'bg-[#141829] border-[#2c3568] text-[#e4ecff]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#1a202c]'
                                }`}>Reminders &amp; Alerts</div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                        tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                            <div key={t.id} className={`p-3 px-4 flex items-center gap-3 border-b transition-colors ${
                                                isDark ? 'border-[#2c3568] hover:bg-[#242b58]' : 'border-[#f7fafc] hover:bg-[#f8fafc]'
                                            }`}>
                                                <div className={`w-8 h-8 rounded-lg text-red-500 flex items-center justify-center shrink-0 ${
                                                    isDark ? 'bg-red-500/15' : 'bg-red-50'
                                                }`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                                        <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className={`text-[13px] font-bold leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>{t.title}</span>
                                                    <span className={`text-[11px] font-medium ${isDark ? 'text-[#8ea0d4]' : 'text-[#a0aec0]'}`}>{t.date} at {t.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={`p-6 text-center text-[13px] italic ${isDark ? 'text-[#8ea0d4]' : 'text-[#a0aec0]'}`}>No active reminders</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">{card.label}</span>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>{card.icon}</div>
                        </div>
                        <div className="text-2xl font-bold text-[#1a202c] mb-3">{card.value}</div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-2 py-1 rounded-lg text-[10px] font-semibold">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="9" height="9"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                                {card.change}
                            </span>
                            <span className="text-[11px] text-[#a0aec0]">{card.changeLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main content + Calendar side-by-side */}
            <div className="grid grid-cols-[1fr_360px] gap-5 xl:grid-cols-1">

                {/* Left: Lead Table + Lenders */}
                <div className="flex flex-col gap-5">

                    {/* Recent Lead List */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:380ms] [animation-fill-mode:both]">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Recent Lead List</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#f8fafc]">
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD ID</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">CLIENT NAME</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">STAGE</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">DATE</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f7fafc]">
                                    {LEADS.map((lead, i) => (
                                        <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${440 + i * 60}ms`, animationFillMode: 'both' }}>
                                            <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{lead.id}</span></td>
                                            <td className="px-6 py-4"><span className="text-[13px] font-medium text-[#1a202c]">{lead.client}</span></td>
                                            <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568]">{lead.amount}</span></td>
                                            <td className="px-6 py-4"><span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${lead.stageCls}`}>{lead.stage}</span></td>
                                            <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0]">{lead.date}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-[#f7fafc]">
                            <button className="w-full py-2.5 text-[12px] font-medium text-[#718096] border border-dashed border-[#edf2f7] rounded-xl hover:bg-[#f8fafc] hover:border-[#2447d7] hover:text-[#2447d7] transition-all">
                                Load more leads
                            </button>
                        </div>
                    </section>

                    {/* Recently Added Lenders */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:480ms] [animation-fill-mode:both] flex flex-col">
                        <div className="px-6 py-4 border-b border-[#f7fafc] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Recently Added Lenders</span>
                            </div>
                            <span className="text-[10px] font-black text-[#94a3b8] bg-[#f1f5f9] px-2.5 py-1 rounded-lg border border-[#edf2f7]">
                                {RECENT_LENDERS.slice(0, 3).length} lenders
                            </span>
                        </div>
                        <div className="p-4 flex flex-col gap-4 flex-1">
                            {RECENT_LENDERS.slice(0, 3).map((lender, i) => {
                                const tc = TYPE_COLORS[lender.type] || TYPE_COLORS['Major Bank'];
                                return (
                                    <div
                                        key={lender.id}
                                        className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl p-5 hover:bg-white hover:border-[#2447d7]/20 hover:shadow-md transition-all cursor-pointer animate-rowIn"
                                        style={{ animationDelay: `${540 + i * 70}ms`, animationFillMode: 'both' }}
                                        onClick={() => onNavigate && onNavigate('lenders')}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg, color: tc.color }}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                    </svg>
                                                </div>
                                                <span className="text-[15px] font-medium text-[#1a202c] truncate">{lender.name}</span>
                                            </div>
                                            <span
                                                className="inline-flex text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0"
                                                style={{ backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}
                                            >
                                                {lender.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[13px] text-[#718096]">Rate: <span className="font-medium text-[#4a5568]">{lender.interestRate}</span></span>
                                                <span className="text-[13px] text-[#718096]">Max: <span className="font-medium text-[#4a5568]">{lender.maxLoan}</span></span>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${lender.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0]'}`}>
                                                <span className={`w-2 h-2 rounded-full inline-block ${lender.status === 'Active' ? 'bg-[#059669]' : 'bg-[#94a3b8]'}`} />
                                                {lender.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-4 pb-4">
                            <button
                                className="w-full py-2.5 bg-[#2447d7] text-white rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm flex items-center justify-center gap-2"
                                onClick={() => onNavigate && onNavigate('lenders')}
                            >
                                View All Lenders
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right: Calendar + Tasks Widget */}
                <div className="flex flex-col gap-5">
                    <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm flex flex-col gap-5 animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">

                        {/* Calendar header */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-[15px] font-bold text-[#1a202c]">Tasks &amp; Calendar</h2>
                            <div className="flex items-center gap-2">
                                <button className="w-7 h-7 flex items-center justify-center bg-[#f7fafc] border border-[#edf2f7] rounded-lg text-[#718096] hover:bg-[#ebf0ff] hover:text-[#2447d7] hover:border-[#2447d7] transition-all" onClick={prevMonth}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <span className="text-[12px] font-bold text-[#4a5568] min-w-[110px] text-center">{monthName}</span>
                                <button className="w-7 h-7 flex items-center justify-center bg-[#f7fafc] border border-[#edf2f7] rounded-lg text-[#718096] hover:bg-[#ebf0ff] hover:text-[#2447d7] hover:border-[#2447d7] transition-all" onClick={nextMonth}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={i} className="text-center text-[10px] font-bold text-[#a0aec0] mb-1 uppercase">{d}</div>
                            ))}
                            {[...Array(emptySlots)].map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
                            {calendarDays.map(day => {
                                const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                const dayTasks = tasks.filter(t => t.date === dateStr);
                                const isSelected = selectedDate === dateStr;
                                const itoday = isToday(day);
                                return (
                                    <div
                                        key={day}
                                        className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer relative transition-all duration-200 border border-transparent
                                            ${itoday && !isSelected ? 'bg-[#eef2ff] border-[#2447d7]/20' :
                                                isSelected ? 'bg-[#2447d7] shadow-[0_4px_12px_rgba(36,71,215,0.25)]' :
                                                    'hover:bg-[#f8fafc]'}`}
                                        onClick={() => setSelectedDate(dateStr)}
                                    >
                                        <span className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full
                                            ${itoday ? 'bg-[#2447d7] text-white' : isSelected ? 'text-white' : 'text-[#4a5568] hover:text-[#2447d7]'}
                                        `}>{day}</span>
                                        {dayTasks.length > 0 && !isSelected && (
                                            <span className="absolute bottom-1 w-1 h-1 bg-[#2447d7] rounded-full" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected date tasks */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-[#2447d7] text-white rounded-lg hover:bg-[#1a32a3] transition-colors duration-150"
                                        onClick={() => { setNewTask(t => ({ ...t, date: selectedDate })); setIsAddingTask(true); }}
                                        title="Add task"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                    <button
                                        className="text-[11px] font-bold text-[#2447d7] hover:underline"
                                        onClick={() => onNavigate && onNavigate('tasks_followups')}
                                    >
                                        View all →
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                                {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                    tasks.filter(t => t.date === selectedDate).map(t => (
                                        <div key={t.id} className="flex flex-col gap-2.5 bg-[#f8fafc] rounded-xl border border-[#edf2f7] p-3 hover:shadow-md transition-all group">
                                            <div className="flex items-start gap-2.5">
                                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#f59e0b]' : 'bg-[#cbd5e0]'}`} />
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-[12px] font-bold text-[#1a202c] truncate leading-tight group-hover:text-[#2447d7] transition-colors">{t.title}</span>
                                                    <span className="text-[10px] text-[#a0aec0] font-medium mt-0.5">{t.time} {t.lead ? `· ${t.lead}` : ''}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pl-4">
                                                <div className="flex items-center border border-[#edf2f7] rounded-lg bg-white">
                                                    <select
                                                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#718096] bg-transparent outline-none hover:text-[#2447d7] transition-all cursor-pointer border-none"
                                                        value={t.reminder || 'none'}
                                                        onChange={e => updateTaskReminder(t.id, e.target.value)}
                                                        title="Set Reminder"
                                                    >
                                                        <option value="none">🔔 Off</option>
                                                        <option value="15m">15m</option>
                                                        <option value="1h">1h</option>
                                                        <option value="1d">1d</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <select
                                                        className={`w-full py-1 px-2 text-[10px] font-black uppercase tracking-widest border outline-none transition-all cursor-pointer rounded-lg ${t.status === 'Completed' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : t.status === 'In Progress' ? 'bg-[#ebf5ff] text-[#2447d7] border-[#d9ebff]' : 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]'}`}
                                                        value={t.status}
                                                        onChange={e => updateTaskStatus(t.id, e.target.value)}
                                                    >
                                                        <option>Pending</option>
                                                        <option>In Progress</option>
                                                        <option>Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[11px] text-[#a0aec0] italic text-center py-6">No tasks for this day</p>
                                )}
                            </div>
                        </div>

                        {/* Go to full page CTA */}
                        <button
                            className="w-full py-2.5 border border-dashed border-[#2447d7]/30 text-[#2447d7] rounded-xl text-[12px] font-bold hover:bg-[#ebf0ff] transition-all flex items-center justify-center gap-2"
                            onClick={() => onNavigate && onNavigate('tasks_followups')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <rect x="3" y="5" width="6" height="6" rx="1" /><path d="M15 6h5" /><path d="M15 12h5" /><rect x="3" y="13" width="6" height="6" rx="1" /><path d="M15 18h5" />
                            </svg>
                            Open Tasks &amp; Followups
                        </button>
                    </section>
                </div>
            </div>

            {/* Add Task Modal */}
            {isAddingTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-6 px-8 border-b border-[#f1f5f9] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#1a202c]">New Task</h2>
                            <button className="w-10 h-10 border border-[#f1f5f9] text-[#a0aec0] hover:text-[#e53e3e] hover:bg-[#fff5f5] rounded-xl flex items-center justify-center transition-all text-2xl font-light" onClick={() => setIsAddingTask(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddTask} className="p-8 md:p-6 overflow-y-auto max-h-[80vh] flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-bold text-[#4a5568]">Task Title</label>
                                <input required type="text" value={newTask.title} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Follow up with lender..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Type</label>
                                    <select value={newTask.type} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] outline-none transition-all w-full" onChange={e => setNewTask({ ...newTask, type: e.target.value })}>
                                        <option>Call</option><option>Document</option><option>Review</option><option>Meeting</option><option>Email</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Reminder</label>
                                    <select value={newTask.reminder} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] outline-none transition-all w-full" onChange={e => setNewTask({ ...newTask, reminder: e.target.value })}>
                                        <option value="none">No Reminder</option>
                                        <option value="15m">15 Minutes Before</option>
                                        <option value="1h">1 Hour Before</option>
                                        <option value="1d">1 Day Before</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Date</label>
                                    <input required type="date" value={newTask.date} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] outline-none transition-all w-full" onChange={e => setNewTask({ ...newTask, date: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Time</label>
                                    <input required type="time" value={newTask.time} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] outline-none transition-all w-full" onChange={e => setNewTask({ ...newTask, time: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-bold text-[#4a5568]">Related Lead (Optional)</label>
                                <input type="text" value={newTask.lead} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] outline-none transition-all w-full" onChange={e => setNewTask({ ...newTask, lead: e.target.value })} placeholder="Lead name or reference" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#f1f5f9]">
                                <button type="button" className="p-[10px_24px] rounded-xl text-sm font-bold text-[#718096] hover:bg-[#f8fafc] transition-all" onClick={() => setIsAddingTask(false)}>Cancel</button>
                                <button type="submit" className="bg-[#2447d7] text-white p-[10px_24px] rounded-xl text-sm font-bold shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-1px] transition-all">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AMDashboard;
