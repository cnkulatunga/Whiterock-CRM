import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';

// Removed INITIAL_TASKS mock data, using props from layout.

const TasksFollowups = ({ tasks, setTasks, initialDate, onClearPendingDate, notifyReminderSet }) => {

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [isAddingTask, setIsAddingTask] = useState(false);
    
    const [newTask, setNewTask] = useState({
        title: '',
        lead: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none',
        message: ''
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(() => {
        const acc = getAccount();
        if (acc) {
            setOutlookAccount(acc);
            fetchOutlookEvents();
        }
    }, [useOutlookCalendar]);

    const fetchOutlookEvents = async () => {
        setLoadingEvents(true);
        try {
            const evts = await getCalendarEvents();
            setOutlookEvents(evts);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleOutlookLogin = async () => {
        try {
            const acc = await signIn();
            setOutlookAccount(acc);
            fetchOutlookEvents();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // Handle auto-open if coming from dashboard with a specific date
    React.useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
            setNewTask(prev => ({ ...prev, date: initialDate }));
            setIsAddingTask(true);
            if (onClearPendingDate) onClearPendingDate();
        }
    }, [initialDate]);

    const handleAddTask = (e) => {
        e.preventDefault();
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            status: 'Pending'
        };
        setTasks([taskToAdd, ...tasks]);
        if (notifyReminderSet) notifyReminderSet(taskToAdd);
        setIsAddingTask(false);

        setNewTask({
            title: '',
            lead: '',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            type: 'Call',
            reminder: 'none',
            message: ''
        });

    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateTaskReminder = (id, newReminder) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const updatedTask = { ...t, reminder: newReminder };
                if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updatedTask);
                return updatedTask;
            }
            return t;
        }));
    };


    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.lead.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    const renderCalendar = () => {
        const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
        const todayStr = new Date().toISOString().split('T')[0];

        const cardBg = isDark ? '#1e2347' : '#ffffff';
        const cardBgHover = isDark ? '#242b58' : '#f7fafc';
        const cardBgSelected = isDark ? '#1e2347' : '#f0f4ff';
        const cardBorder = isDark ? '#2c3568' : '#edf2f7';
        const cardBorderSelected = '#2447d7';
        const cardBorderToday = isDark ? 'rgba(36,71,215,0.5)' : 'rgba(36,71,215,0.3)';
        const headerBg = isDark ? '#181c2e' : '#f8fafc';
        const headerText = isDark ? '#546298' : '#a0aec0';
        const dayText = isDark ? '#8ea0d4' : '#4a5568';
        const sidePanelBg = isDark ? '#1a1e38' : '#f8fafc';
        const sidePanelBorder = isDark ? '#2c3568' : '#edf2f7';
        const taskCardBg = isDark ? '#242b50' : '#ffffff';
        const taskCardBorder = isDark ? '#2c3568' : '#edf2f7';
        const titleColor = isDark ? '#e4ecff' : '#1a202c';
        const mutedColor = isDark ? '#546298' : '#a0aec0';
        const taskTitleColor = isDark ? '#c8d8ff' : '#2d3748';

        return (
            <div className="grid grid-cols-[1fr_300px] gap-6 lg:grid-cols-1">
                {/* Calendar grid */}
                <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? '#141829' : '#f1f5fb', padding: '16px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-2 mb-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest py-2" style={{ color: headerText, background: headerBg, borderRadius: '8px' }}>{d}</div>
                        ))}
                    </div>
                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-2">
                        {daysInMonth.map(day => {
                            const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
                            const dayTasks = tasks.filter(t => t.date === dateStr);
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === todayStr;
                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className="aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative"
                                    style={{
                                        background: isSelected ? cardBgSelected : cardBg,
                                        border: `1.5px solid ${isSelected ? cardBorderSelected : isToday ? cardBorderToday : cardBorder}`,
                                        boxShadow: isSelected ? `0 0 0 3px rgba(36,71,215,0.15)` : 'none',
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = cardBgHover; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = cardBg; }}
                                >
                                    <span
                                        className="text-[13px] font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all"
                                        style={{
                                            background: isToday ? '#2447d7' : 'transparent',
                                            color: isToday ? '#ffffff' : isSelected ? '#2447d7' : dayText,
                                        }}
                                    >{day}</span>
                                    {dayTasks.length > 0 && (
                                        <div className="flex gap-1 mt-1 flex-wrap justify-center px-1">
                                            {dayTasks.slice(0, 3).map(t => (
                                                <div key={t.id} className={`w-1.5 h-1.5 rounded-full ring-1 ring-white/20 ${t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#ed8936]' : 'bg-[#6480c4]'}`} title={t.title} />
                                            ))}
                                            {dayTasks.length > 3 && <div className="w-1 h-1 rounded-full" style={{ background: mutedColor }} />}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Side panel */}
                <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: sidePanelBg, border: `1px solid ${sidePanelBorder}` }}>
                    <div className="flex justify-between items-center pb-3" style={{ borderBottom: `1px solid ${sidePanelBorder}` }}>
                        <h3 className="text-sm font-bold" style={{ color: titleColor }}>Tasks for {selectedDate}</h3>
                        <button className="w-7 h-7 bg-[#2447d7] text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform" onClick={() => {
                            setNewTask({...newTask, date: selectedDate});
                            setIsAddingTask(true);
                        }}>
                            <IconPlus />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                        {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                            tasks.filter(t => t.date === selectedDate).map(t => (
                                <div key={t.id} className="p-3 rounded-xl flex items-center gap-3 shadow-sm hover:translate-y-[-2px] transition-all" style={{ background: taskCardBg, border: `1px solid ${taskCardBorder}` }}>
                                    <div className={`w-1 h-8 rounded-full shrink-0 ${t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#ed8936]' : 'bg-[#cbd5e0]'}`}></div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-bold truncate leading-tight" style={{ color: taskTitleColor }}>{t.title}</span>
                                        <span className="text-[11px] font-medium" style={{ color: mutedColor }}>{t.time} • {t.lead}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[12px] text-center mt-4 italic" style={{ color: mutedColor }}>No tasks scheduled for this day.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <div className="flex justify-between items-center mb-8 md:flex-col md:items-start md:gap-4">
                <div className="flex flex-col">
                    <h1 className="text-[1.75rem] font-bold text-[#1a202c] mb-1 sm:text-2xl tracking-tight">Tasks & Follow-ups</h1>
                    <p className="text-[0.95rem] text-[#718096]">Schedule calls, site visits and manage your daily pipeline.</p>
                </div>
                <div className="flex items-center gap-4 sm:w-full sm:flex-wrap">
                    <div className="relative">
                        <button className={`w-11 h-11 bg-white border border-[#edf2f7] rounded-xl text-[#718096] flex items-center justify-center hover:bg-[#f7fafc] hover:text-[#2447d7] transition-all duration-200 relative ${tasks.some(t => t.reminder !== 'none' && t.status !== 'Completed') ? 'after:content-[""] after:absolute after:top-2.5 after:right-2.5 after:w-2 after:h-2 after:bg-red-500 after:border-2 after:border-white after:rounded-full' : ''}`} onClick={() => setShowNotifications(!showNotifications)}>
                            <IconBell />
                        </button>
                        {showNotifications && (
                            <div className="absolute top-14 right-0 w-[300px] bg-white rounded-2xl shadow-xl border border-[#edf2f7] z-[100] overflow-hidden animate-fadeIn">
                                <div className="p-4 bg-[#f8fafc] border-b border-[#edf2f7] text-sm font-bold text-[#1a202c]">Reminders & Alerts</div>
                                <div className="max-height-[300px] overflow-y-auto">
                                    {tasks.filter(t => t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                        tasks.filter(t => t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                            <div key={t.id} className="p-3 px-4 flex items-center gap-3 border-b border-[#f7fafc] hover:bg-[#f8fafc] transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0"><IconAlarm /></div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[13px] font-bold text-[#2d3748] leading-tight">Upcoming: {t.title}</span>
                                                    <span className="text-[11px] text-[#a0aec0] font-medium">{t.date} at {t.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-[#a0aec0] text-[13px] italic">No active reminders</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex bg-[#edf2f7] p-1 rounded-xl">
                        <button className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('list')}><IconList size={14} /> List</button>
                        <button className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-200 ${viewMode === 'calendar' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('calendar')}><IconCalendar size={14} /> Calendar</button>
                    </div>
                    <button className="flex items-center gap-2 bg-[#2447d7] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_12px_rgba(36,71,215,0.2)] hover:bg-[#1a36b1] hover:-translate-y-px transition-all sm:w-full sm:justify-center" onClick={() => setIsAddingTask(true)}>
                        <IconPlus /> <span>New Task</span>
                    </button>
                </div>
            </div>

            {isAddingTask && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[2000] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[500px] max-h-[90vh] rounded-2xl p-8 shadow-2xl relative animate-slideUp overflow-y-auto scrollbar-thin">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#1a202c]">Create New Task</h2>
                            <button className="text-2xl text-[#a0aec0] hover:text-[#4a5568]" onClick={() => setIsAddingTask(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddTask}>
                            <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-1">
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Task Title</label>
                                    <input required type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Call returning client..." />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Related Lead</label>
                                    <input required type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.lead} onChange={e => setNewTask({...newTask, lead: e.target.value})} placeholder="Client Name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Task Type</label>
                                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}>
                                        <option>Call</option>
                                        <option>Document</option>
                                        <option>Review</option>
                                        <option>Meeting</option>
                                        <option>Email</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Date</label>
                                    <input required type="date" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Time</label>
                                    <input required type="time" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Set Reminder</label>
                                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%20%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" value={newTask.reminder} onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">No Reminder</option>
                                        <option value="15m">15 Minutes Before</option>
                                        <option value="1h">1 Hour Before</option>
                                        <option value="1d">1 Day Before</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Reminder Message / Notes</label>
                                    <textarea className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all min-h-[80px]" value={newTask.message} onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Additional details for the reminder..." rows="3" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="px-5 py-2.5 bg-[#f7fafc] border border-[#edf2f7] rounded-xl font-bold text-[#4a5568] hover:bg-[#edf2f7] transition-all" onClick={() => setIsAddingTask(false)}>Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[#2447d7] text-white rounded-xl font-bold hover:bg-[#1a36b1] hover:-translate-y-px shadow-lg transition-all">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6 gap-5 md:flex-col md:items-stretch">
                <div className="flex items-center gap-3 bg-white border border-[#edf2f7] px-4 py-2.5 rounded-2xl w-full max-w-[350px] shadow-sm md:max-w-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-sm text-[#4a5568] w-full"
                        placeholder="Search tasks or leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={useOutlookCalendar}
                    />
                </div>
                {!useOutlookCalendar && (
                    <div className="flex bg-[#f7fafc] p-1 rounded-2xl border border-[#edf2f7] overflow-x-auto scrollbar-none sm:gap-1">
                        {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                            <button
                                key={status}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${filter === status ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {viewMode === 'calendar' ? (
                <div className="animate-fadeIn flex flex-col gap-6">
                    <div className="flex justify-center">
                        <div className="flex bg-[#f7fafc] p-1.5 rounded-xl border border-[#edf2f7] w-fit shadow-sm relative z-10" style={{ background: isDark ? '#1e2347' : '#f7fafc', borderColor: isDark ? '#2c3568' : '#edf2f7' }}>
                            <button
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${!useOutlookCalendar ? 'bg-[#2447d7] text-white shadow-md' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setUseOutlookCalendar(false)}
                            >
                                Local
                            </button>
                            <button
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${useOutlookCalendar ? 'bg-[#2447d7] text-white shadow-md' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setUseOutlookCalendar(true)}
                            >
                                Outlook Calendar
                            </button>
                        </div>
                    </div>
                    {useOutlookCalendar ? (
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#edf2f7] min-h-[500px] shadow-sm">
                            {!outlookAccount ? (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#f8fafc] to-white">
                                    <div className="w-20 h-20 bg-[#0078d4]/10 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-md">
                                        <svg viewBox="0 0 24 24" width="36" height="36">
                                            <path d="M11 2h10v10H11V2M2 2h7v7H2V2m9 9h10v10H11V11M2 11h7v10H2v-10z" fill="#0078d4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a202c] mb-3">Connect Your Outlook Calendar</h3>
                                    <p className="text-[15px] text-[#718096] leading-relaxed max-w-[400px] mb-8 font-medium">Sync with your Microsoft 365 account to view and manage your schedule directly from Whiterock CRM.</p>
                                    <button className="px-8 py-3.5 bg-[#0078d4] text-white rounded-xl font-bold text-sm shadow-[0_4px_16px_rgba(0,120,212,0.25)] hover:bg-[#005a9e] hover:-translate-y-px transition-all duration-200 active:translate-y-0 flex items-center gap-3" onClick={handleOutlookLogin}>
                                        <svg width="18" height="18" viewBox="0 0 21 21"><path d="M10 0v10H0V0h10zm11 0v10H11V0h10zM10 11v10H0V11h10zm11 0v10H11V11h10z" fill="#fff" /></svg>
                                        Sign in with Microsoft
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 z-5 bg-white flex flex-col p-6 animate-fadeIn">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f1f5f9]">
                                        <div className="flex items-center gap-3 bg-[#f8fafc] px-4 py-2 rounded-xl border border-[#edf2f7]">
                                            <div className="w-8 h-8 bg-[#0078d4] text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">{outlookAccount.name?.charAt(0) || 'U'}</div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#1e293b]">{outlookAccount.name}</span>
                                                <span className="text-[11px] font-medium text-[#64748b] truncate max-w-[200px]">{outlookAccount.username}</span>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-[#f8fafc] text-[#0078d4] rounded-xl font-bold text-sm hover:bg-[#ebf0ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed" onClick={fetchOutlookEvents} disabled={loadingEvents}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className={loadingEvents ? "animate-spin" : ""}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.08 5.08" /></svg>
                                            {loadingEvents ? 'Syncing...' : 'Refresh'}
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-thin">
                                        {outlookEvents.length > 0 ? (
                                            outlookEvents.map((evt, i) => (
                                                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-[#edf2f7] hover:border-[#0078d4]/30 hover:shadow-md transition-all duration-300 bg-white group relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0078d4]"></div>
                                                    <div className="flex flex-col items-center justify-center min-w-[70px] bg-[#f8fafc] rounded-xl p-2 border border-[#edf2f7] group-hover:bg-[#ebf0ff] transition-colors">
                                                        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider group-hover:text-[#0078d4]">{new Date(evt.start.dateTime).toLocaleDateString([], { month: 'short' })}</span>
                                                        <span className="text-xl font-black text-[#1e293b] group-hover:text-[#0078d4]">{new Date(evt.start.dateTime).getDate()}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 min-w-0 flex-1 justify-center">
                                                        <div className="text-[15px] font-bold text-[#1e293b] truncate leading-tight group-hover:text-[#0078d4] transition-colors">{evt.subject}</div>
                                                        <div className="flex items-center gap-4 flex-wrap">
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                                {new Date(evt.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            {evt.location?.displayName && (
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b] truncate max-w-[200px]">
                                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                    {evt.location.displayName}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 bg-[#f8fafc] rounded-2xl border-2 border-dashed border-[#edf2f7]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5" width="48" height="48" className="mb-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                <p className="text-[15px] text-[#718096] font-bold">Your Outlook schedule is clear</p>
                                                <p className="text-sm text-[#a0aec0] mt-1">No upcoming events found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        renderCalendar()
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 flex justify-between items-center gap-4 hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-200 md:flex-col md:items-stretch" key={task.id}>
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' : task.type === 'Document' ? 'bg-[#fef3c7] text-[#d97706]' : task.type === 'Review' ? 'bg-[#f3e8ff] text-[#7c3aed]' : task.type === 'Email' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#e0f2fe] text-[#0369a1]'}`}>
                                        {task.type === 'Call' && <IconPhone />}
                                        {task.type === 'Document' && <IconDoc />}
                                        {task.type === 'Review' && <IconReview />}
                                        {task.type === 'Email' && <IconMail />}
                                        {task.type === 'Meeting' && <IconMeeting />}
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <h3 className="text-base font-bold text-[#1a202c] truncate">{task.title}</h3>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#718096]">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                    {task.lead}
                                                </span>
                                                <span className="text-[12px] font-medium text-[#a0aec0]">
                                                    {task.date} • {task.time}
                                                </span>
                                            </div>
                                            {task.message && <p className="p-2.5 px-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[0.85rem] text-[#4a5568] leading-relaxed max-w-[500px] mt-1 italic"><span className="font-bold text-[#2447d7] not-italic mr-1">Notes:</span>{task.message}</p>}
                                            {task.reminder !== 'none' && (
                                                <span className="bg-[#f0f4ff] text-[#2447d7] px-2 py-0.5 rounded-md text-[11px] font-bold w-fit flex items-center gap-1.5">
                                                    <IconBellActive />
                                                    Remind {task.reminder === '1d' ? '1 day before' : task.reminder === '1h' ? '1 hour before' : '15 min before'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 sm:flex-col sm:items-stretch sm:gap-3">
                                    <div className="flex items-center">
                                        <select 
                                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-[#718096] bg-[#f7fafc] border border-[#edf2f7] outline-none hover:border-[#2447d7] hover:text-[#2447d7] hover:bg-white transition-all cursor-pointer"
                                            value={task.reminder}
                                            onChange={(e) => updateTaskReminder(task.id, e.target.value)}
                                            title="Update Reminder"
                                        >
                                            <option value="none">🔔 Off</option>
                                            <option value="15m">15m</option>
                                            <option value="1h">1h</option>
                                            <option value="1d">1d</option>
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <select 
                                            className={`appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:12px] pr-9 pl-4 py-2 rounded-xl text-[13px] font-bold border outline-none transition-all hover:translate-y-[-1px] hover:shadow-sm min-w-[140px] sm:min-w-full ${task.status === 'Completed' ? 'bg-[#f0fff4] text-[#276749] border-[#9ae6b4]' : task.status === 'In Progress' ? 'bg-[#fffbef] text-[#c05621] border-[#fbd38d]' : 'bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]'}`}
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
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
                        <div className="py-[60px] text-center text-[#a0aec0] bg-[#fdfdfd] rounded-2xl border-2 border-dashed border-[#edf2f7] italic text-sm">
                            <p>No tasks found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconDoc = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
const IconReview = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconMeeting = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconList = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);
const IconCalendar = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconBellActive = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" width="12" height="12">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconAlarm = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><path d="M6.38 18.7l-.44 1.1a1 1 0 0 1-1.32.5l-2.2-.9a1 1 0 0 1-.5-1.32l.44-1.1" /><path d="M17.62 18.7l.44 1.1a1 1 0 0 1 1.32.5l2.2-.9a1 1 0 0 1 .5-1.32l-.44-1.1" />
    </svg>
);

export default TasksFollowups;
