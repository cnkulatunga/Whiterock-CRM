import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { INITIAL_MEMBERSHIPS, MOCK_LEAD_COUNTS, RECENT_LENDERS, AM_STAT_CARDS as STAT_CARDS, LENDER_TYPE_COLORS } from '../../../data/dummyData';

// TYPE_COLORS removed, using LENDER_TYPE_COLORS from dummyData


import { useTasks } from '../../../context/TasksContext';
import { usePromotions } from '../../../context/PromotionsContext';

const AMDashboard = ({ onNavigate, tasks: initialTasks = [], setTasks, notifyReminderSet }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { users } = useUsers();
    const { promotions } = usePromotions();

    // Merge promotions as pseudo-tasks
    const memoizedPromotions = React.useMemo(() => promotions.map(p => ({
        id: `promo-${p.id}`,
        title: `PROMO: ${p.lenderName}`,
        lead: p.description,
        date: p.startDate,
        endDate: p.endDate,
        time: '09:00',
        type: 'Promotion',
        status: 'Active',
        isPromotion: true,
        priority: 'High',
        fileName: p.fileName,
        fileData: p.fileData
    })), [promotions]);

    const tasks = React.useMemo(() => [...initialTasks, ...memoizedPromotions], [initialTasks, memoizedPromotions]);

    // Team Leader drill-down state
    const [selectedTeam, setSelectedTeam] = useState(null);

    const teamLeaders = users ? users.filter(u => u.role === 'Team Leader').slice(0, 3) : [];

    // Calendar state
    const [viewDate, setViewDate] = useState(new Date());
    const todayStr = new Date().toISOString().split('T')[0];
    const { addTask, updateTask } = useTasks();
    const [selectedDate, setSelectedDate] = useState(todayStr);
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
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();

    const updateTaskStatus = (id, newStatus) => {
        updateTask({ ...tasks.find(t => t.id === id), status: newStatus });
    };

    const updateTaskReminder = (id, newReminder) => {
        if (id.toString().startsWith('promo-')) return;
        const updatedTask = { ...tasks.find(t => t.id === id), reminder: newReminder };
        updateTask(updatedTask);
        if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updatedTask);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            status: 'Pending',
            createdBy: user.role || 'Accounts Manager',
            assignedTo: user.id?.toString() || 'Self'
        };
        addTask(taskToAdd);
        if (notifyReminderSet) notifyReminderSet(taskToAdd);
        setIsAddingTask(false);
        setNewTask({ title: '', lead: '', date: todayStr, time: '12:00', type: 'Call', reminder: 'none', assignedTo: 'Self', message: '' });
    };

    const hasReminders = tasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed');

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-center gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Accounts Manager Dashboard</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Real-time overview of financial processing and lender governance.</p>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">{card.label}</span>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>
                                {i === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                                {i === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>}
                                {i === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>}
                            </div>
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

            {/* Team Leaders Section */}
            <section className="flex flex-col gap-4 animate-fadeIn [animation-delay:300ms] [animation-fill-mode:both]">
                <div className="flex items-center gap-2 px-1">
                    <span className="w-5 h-5 bg-[#ebf0ff] text-[#2447d7] rounded flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </span>
                    <h2 className="text-sm font-bold text-[#1a202c] uppercase tracking-wider">Team Leaders Overview</h2>
                </div>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                    {teamLeaders.map((tl, i) => {
                        const members = INITIAL_MEMBERSHIPS[tl.id] || [];
                        const activeCount = members.filter(m => m.status === 'Active').length;
                        return (
                            <div
                                key={tl.id}
                                onClick={() => setSelectedTeam({ ...tl, members })}
                                className="bg-white rounded-2xl border border-[#edf2f7] p-4 shadow-sm hover:shadow-xl hover:translate-y-[-2px] hover:border-[#2447d7]/30 transition-all cursor-pointer group animate-kpiPop"
                                style={{ animationDelay: `${350 + i * 50}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f0f4ff] border border-[#ebf0ff] flex items-center justify-center text-[#2447d7] font-bold text-sm group-hover:bg-[#2447d7] group-hover:text-white transition-colors">
                                        {tl.initials}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-bold text-[#1a202c] truncate">{tl.name}</span>
                                        <span className="text-[10px] font-medium text-[#718096]">Team Leader</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-[#f7fafc]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Members</span>
                                        <span className="text-[13px] font-bold text-[#1a202c]">{members.length}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Active</span>
                                        <span className="text-[13px] font-bold text-[#10b981]">{activeCount}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Main content + Calendar side-by-side */}
            <div className="grid grid-cols-[1fr_360px] gap-5 xl:grid-cols-1">

                {/* Left: Lenders */}
                <div className="flex flex-col gap-5">

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
                                const tc = LENDER_TYPE_COLORS[lender.type] || LENDER_TYPE_COLORS['Major Bank'];
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
                                                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                                                        <span className="text-[10px] text-[#a0aec0] font-medium truncate">{t.time} {t.lead ? `· ${t.lead}` : '· Personal'}</span>
                                                        {t.reminder && t.reminder !== 'none' && (
                                                            <span className="bg-[#f0f4ff] text-[#2447d7] px-2 py-0.5 rounded-md text-[9px] uppercase font-bold w-fit flex items-center gap-1 mt-1">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10">
                                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                                </svg>
                                                                {t.reminder === '1d' ? '1 day before' : t.reminder === '1h' ? '1 hour before' : '15 min before'}
                                                            </span>
                                                        )}
                                                        {t.isPromotion && (
                                                            <span className="bg-[#2447d7] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">Active Promo</span>
                                                        )}
                                                        {t.isPromotion && t.fileName && t.fileData && (
                                                            <a href={t.fileData} download={t.fileName} className="text-[#2447d7] hover:underline text-[9px] font-bold uppercase ml-auto">Download</a>
                                                        )}
                                                        {t.createdBy && (t.createdBy !== 'Accounts Manager' && t.createdBy !== 'Manager') && !t.isPromotion && (
                                                            <span className="bg-[#fff7ed] text-[#ea580c] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 border border-[#ffedd5]">By: {t.createdBy}</span>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                            {!t.isPromotion && (
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
                                            )}
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
            {/* Team Details Modal */}
            {selectedTeam && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[9999] p-6 animate-fadeIn" onClick={() => setSelectedTeam(null)}>
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center bg-[#fcfdfe]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#2447d7] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-[#2447d7]/20">
                                    {selectedTeam.initials}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#1a202c] tracking-tight">{selectedTeam.name}'s Team</h3>
                                    <p className="text-xs font-bold text-[#718096] uppercase tracking-wider">Performance & Member Status</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTeam(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-[#a0aec0] hover:text-[#1a202c]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-[#f8fafc] rounded-2xl border border-[#edf2f7] flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-widest">Total Members</span>
                                    <span className="text-xl font-black text-[#1a202c]">{selectedTeam.members.length}</span>
                                </div>
                                <div className="p-4 bg-[#ecfdf5] rounded-2xl border border-[#d1fae5] flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest">Active</span>
                                    <span className="text-xl font-black text-[#059669]">{selectedTeam.members.filter(m => m.status === 'Active').length}</span>
                                </div>
                                <div className="p-4 bg-[#ebf0ff] rounded-2xl border border-[#d9e8ff] flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-[#2447d7] uppercase tracking-widest">Leads</span>
                                    <span className="text-xl font-black text-[#2447d7]">
                                        {selectedTeam.members.reduce((sum, m) => sum + (MOCK_LEAD_COUNTS[m.id] || 0), 0)}
                                    </span>
                                </div>
                            </div>

                            <h4 className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest mb-4 px-1">Team Members</h4>
                            <div className="flex flex-col gap-3">
                                {selectedTeam.members.length > 0 ? selectedTeam.members.map((member, mi) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-[#f1f5f9] hover:border-[#2447d7]/20 hover:bg-[#fcfdfe] transition-all group animate-slideUp"
                                        style={{ animationDelay: `${100 + mi * 50}ms`, animationFillMode: 'both' }}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[13px] font-black text-slate-400 group-hover:bg-[#ebf0ff] group-hover:text-[#2447d7] transition-all">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#1a202c]">{member.name}</span>
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${member.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-slate-100 text-slate-400'}`}>
                                                    {member.status}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-medium text-[#a0aec0]">{member.email}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-black text-[#1a202c] leading-none">{MOCK_LEAD_COUNTS[member.id] || 0}</span>
                                            <span className="text-[9px] font-bold text-[#a0aec0] uppercase tracking-widest">Leads</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <p className="text-sm font-bold text-slate-400">No members assigned to this team.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-center">
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="px-8 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold hover:bg-[#0f172a] shadow-lg transition-all active:scale-95"
                            >
                                Close Overview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AMDashboard;
