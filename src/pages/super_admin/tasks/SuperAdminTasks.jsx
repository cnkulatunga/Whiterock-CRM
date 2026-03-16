import React, { useState, useEffect } from 'react';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';

const SuperAdminTasks = ({ tasks, setTasks, initialDate, notifyReminderSet }) => {
    const { users } = useUsers();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // All users except Super Admins (or include everyone?)
    // The user said "Super admin also same", likely meaning they can assign to anyone.
    const assignableUsers = users.filter(u => u.role !== 'Super Admin');

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('calendar'); // Default to calendar
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [addToOutlook, setAddToOutlook] = useState(false);
    const [isSyncingOutlook, setIsSyncingOutlook] = useState(false);
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

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
    
    const [newTask, setNewTask] = useState({
        title: '',
        lead: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none',
        assignedTo: 'Self',
        message: ''
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            status: 'Pending',
            createdBy: 'Super Admin'
        };
        setTasks([taskToAdd, ...tasks]);
        if (notifyReminderSet) notifyReminderSet(taskToAdd);
        
        if (addToOutlook) {
            setIsSyncingOutlook(true);
            try {
                if (!getAccount()) {
                    await signIn();
                }
                const startTime = new Date(`${newTask.date}T${newTask.time}`);
                const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
                
                await createCalendarEvent({
                    subject: newTask.title,
                    body: { contentType: "HTML", content: newTask.message || `Task: ${newTask.title}` },
                    start: { dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                    end: { dateTime: endTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                });
            } catch (error) {
                console.error("Failed to sync with outlook", error);
            } finally {
                setIsSyncingOutlook(false);
            }
        }

        setIsAddingTask(false);

        setNewTask({
            title: '',
            lead: '',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            type: 'Call',
            reminder: 'none',
            assignedTo: 'Self',
            message: ''
        });
        setAddToOutlook(false);
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
            (task.lead && task.lead.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filter === 'All' || task.status === filter;
        
        let matchesAssignment = true;
        if (assignmentFilter === 'Personal') {
            matchesAssignment = task.assignedTo === 'Self';
        } else if (assignmentFilter === 'Team') {
            matchesAssignment = task.assignedTo !== 'Self';
        }
        
        return matchesSearch && matchesStatus && matchesAssignment;
    });

    const renderCalendar = () => {
        const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
        const todayStr = new Date().toISOString().split('T')[0];
        return (
            <div className="grid grid-cols-[1fr_320px] gap-8 xl:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-[#cbd5e0] tracking-widest pb-4 uppercase">{d}</div>
                        ))}
                        {daysInMonth.map(day => {
                            const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
                            const dayTasks = tasks.filter(t => t.date === dateStr);
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === todayStr;
                            return (
                                <div
                                    key={day}
                                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 group hover:border-[#2447d7] hover:shadow-md
                                        ${isToday && !isSelected ? 'bg-[#eef2ff] border-[#2447d7]/30' : dayTasks.length > 0 ? 'bg-[#f8faff]' : 'bg-white'}
                                        ${isSelected ? 'border-[#2447d7] ring-4 ring-[#2447d7]/5 z-10' : isToday ? '' : 'border-[#edf2f7]'}
                                    `}
                                    onClick={() => setSelectedDate(dateStr)}
                                >
                                    <span className={`text-[13px] font-bold w-6 h-6 flex items-center justify-center rounded-full
                                        ${isToday ? 'bg-[#2447d7] text-white' : isSelected ? 'text-[#2447d7]' : 'text-[#718096] group-hover:text-[#2447d7]'}
                                    `}>{day}</span>
                                    <div className="flex gap-1 mt-1.5 flex-wrap justify-center px-1">
                                        {dayTasks.slice(0, 3).map(t => (
                                            <div 
                                                key={t.id} 
                                                className={`w-1.5 h-1.5 rounded-full ring-2 ring-white ${t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#3b82f6]' : 'bg-[#f59e0b]'} ${t.assignedTo !== 'Self' ? 'animate-pulse' : ''}`} 
                                                title={t.title}
                                            ></div>
                                        ))}
                                        {dayTasks.length > 3 && <div className="w-1 h-1 bg-[#cbd5e0] rounded-full"></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm flex flex-col gap-5">
                        <div className="flex justify-between items-center pb-4 border-b border-[#f7fafc]">
                            <h3 className="text-[15px] font-bold text-[#1a202c]">Tasks for {selectedDate}</h3>
                            <button className="w-8 h-8 bg-[#2447d7] text-white rounded-lg flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-[#2447d7]/20" onClick={() => {
                                setNewTask({...newTask, date: selectedDate});
                                setIsAddingTask(true);
                            }}>
                                <IconPlus />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                tasks.filter(t => t.date === selectedDate).map(t => (
                                    <div key={t.id} className="p-4 bg-[#f8faff] rounded-xl border border-[#edf2f7] group hover:border-[#2447d7]/20 transition-all duration-300">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-10 rounded-full shrink-0 ${t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#3b82f6]' : 'bg-[#f59e0b]'}`}></div>
                                            <div className="flex flex-col gap-1 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[13px] font-bold text-[#1a202c] leading-tight">
                                                        {t.title}
                                                    </span>
                                                    {t.assignedTo !== 'Self' && <span className="bg-[#ebf0ff] text-[#2447d7] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Assigned</span>}
                                                </div>
                                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">{t.time} • {t.lead || 'Personal'}</span>
                                                {t.assignedTo !== 'Self' && (
                                                    <span className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md w-fit" style={{ background: isDark ? 'rgba(36,71,215,0.15)' : '#f0f4ff', color: '#2447d7' }}>
                                                        Assignee: {users.find(u => u.id.toString() === t.assignedTo.toString())?.name || t.assignedTo}
                                                    </span>
                                                )}
                                                {t.createdBy && t.createdBy !== 'Super Admin' && (
                                                    <span className="text-[9px] font-black mt-1 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit" style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' }}>
                                                        By: {t.createdBy}
                                                    </span>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center gap-3 text-center grayscale opacity-60">
                                    <IconCalendar size={32} />
                                    <p className="text-[13px] font-bold text-[#718096]">No tasks scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-center mb-10 sm:flex-col sm:items-start sm:gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-2xl">Global Tasks & Followups</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium">Monitor and manage all system tasks and assignments.</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-wrap">
                    <div className="relative">
                        <button className={`w-11 h-11 bg-white border border-[#edf2f7] rounded-xl text-[#718096] flex items-center justify-center hover:bg-[#f7fafc] hover:text-[#2447d7] transition-all duration-200 relative ${tasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed') ? 'after:content-[""] after:absolute after:top-2.5 after:right-2.5 after:w-2 after:h-2 after:bg-red-500 after:border-2 after:border-white after:rounded-full' : ''}`} onClick={() => setShowNotifications(!showNotifications)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        {showNotifications && (
                            <div className="absolute top-14 right-0 w-[300px] bg-white rounded-2xl shadow-xl border border-[#edf2f7] z-[100] overflow-hidden animate-fadeIn">
                                <div className="p-4 bg-[#f8fafc] border-b border-[#edf2f7] text-sm font-bold text-[#1a202c]">Reminders & Alerts</div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                        tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                            <div key={t.id} className="p-3 px-4 flex items-center gap-3 border-b border-[#f7fafc] hover:bg-[#f8fafc] transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                                        <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><path d="M6.38 18.7l-.44 1.1a1 1 0 0 1-1.32.5l-2.2-.9a1 1 0 0 1-.5-1.32l.44-1.1" /><path d="M17.62 18.7l.44 1.1a1 1 0 0 1 1.32.5l2.2-.9a1 1 0 0 1 .5-1.32l-.44-1.1" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[13px] font-bold text-[#2d3748] leading-tight flex items-center gap-1.5">{t.title} {t.assignedTo === 'Self' ? <span className="bg-[#f8fafc] text-[#a0aec0] text-[9px] px-1 rounded uppercase tracking-wider border border-[#edf2f7]">Self</span> : ''}</span>
                                                    <span className="text-[11px] text-[#a0aec0] font-medium">{t.date} at {t.time}</span>
                                                    {t.assignedTo !== 'Self' && (
                                                        <span className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md w-fit" style={{ background: '#f0f4ff', color: '#2447d7' }}>
                                                            Assignee: {users.find(u => u.id.toString() === t.assignedTo.toString())?.name || t.assignedTo}
                                                        </span>
                                                    )}
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
                    <div className="flex p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
                        <button className={`p-[6px_16px] rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('list')}><div className="flex items-center gap-2"><IconList size={14} /> List</div></button>
                        <button className={`p-[6px_16px] rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('calendar')}><div className="flex items-center gap-2"><IconCalendar size={14} /> Calendar</div></button>
                    </div>
                    <button className="bg-[#2447d7] text-white p-[10px_20px] rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-2 sm:w-full sm:justify-center" onClick={() => setIsAddingTask(true)}>
                        <IconPlus /> <span>New Task</span>
                    </button>
                </div>
            </header>

            {isAddingTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-6 px-8 border-b border-[#f1f5f9] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#1a202c]">Create New Task</h2>
                            <button className="w-10 h-10 border border-[#f1f5f9] text-[#a0aec0] hover:text-[#e53e3e] hover:bg-[#fff5f5] rounded-xl flex items-center justify-center transition-all text-2xl font-light" onClick={() => setIsAddingTask(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddTask} className="p-8 md:p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Task Title</label>
                                    <input required type="text" value={newTask.title} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. System Wide Sync..." />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Assign To</label>
                                    <select 
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]"
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                                    >
                                        <option value="Self">Self (Admin)</option>
                                        <optgroup label="Team Leaders">
                                            {assignableUsers.filter(u => u.role === 'Team Leader').map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Account Managers">
                                            {assignableUsers.filter(u => u.role === 'Accounts Manager').map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Tele Agents">
                                            {assignableUsers.filter(u => u.role === 'Tele Agent').map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Task Type</label>
                                    <select value={newTask.type} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" onChange={e => setNewTask({...newTask, type: e.target.value})}>
                                        <option>Call</option>
                                        <option>Document</option>
                                        <option>Review</option>
                                        <option>Meeting</option>
                                        <option>Email</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Related Lead</label>
                                    <input type="text" value={newTask.lead} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, lead: e.target.value})} placeholder="Client Name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Date</label>
                                    <input required type="date" value={newTask.date} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Time</label>
                                    <input required type="time" value={newTask.time} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Set Reminder</label>
                                    <select value={newTask.reminder} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">No Reminder</option>
                                        <option value="15m">15 Minutes Before</option>
                                        <option value="1h">1 Hour Before</option>
                                        <option value="1d">1 Day Before</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Reminder Message / Notes</label>
                                    <textarea value={newTask.message} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full min-h-[100px]" onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Additional details..." />
                                </div>
                                <div className="flex items-center gap-3 col-span-2 p-4 bg-[#f8faff] rounded-2xl border border-[#ebf0ff] cursor-pointer" onClick={() => setAddToOutlook(!addToOutlook)}>
                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${addToOutlook ? 'bg-[#2447d7] border-[#2447d7]' : 'bg-white border-[#cbd5e0]'}`}>
                                        {addToOutlook && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-[#1a202c]">Add to Outlook Calendar</span>
                                        <span className="text-[11px] font-medium text-[#718096]">Sync this task with your Microsoft 365 schedule</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-10">
                                <button type="button" className="p-[12px_24px] rounded-xl text-sm font-bold text-[#718096] hover:bg-[#f8fafc] transition-all" onClick={() => setIsAddingTask(false)}>Discard</button>
                                <button type="submit" disabled={isSyncingOutlook} className="bg-[#2447d7] text-white p-[12px_32px] rounded-xl text-sm font-bold shadow-lg shadow-[#2447d7]/25 hover:bg-[#1732a3] hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-70 flex items-center gap-2">
                                    {isSyncingOutlook && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                    {isSyncingOutlook ? 'Syncing...' : 'Save Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8 gap-5 md:flex-col md:items-stretch">
                <div className="flex bg-[#f1f5f9] p-1 rounded-2xl border border-[#e2e8f0] w-fit sm:w-full overflow-x-auto no-scrollbar">
                    {['All', 'Personal', 'Team'].map(type => (
                        <button
                            key={type}
                            className={`p-[10px_24px] rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${assignmentFilter === type ? 'bg-white text-[#2447d7] shadow-sm ring-1 ring-[#2447d7]/10' : 'text-[#718096] hover:text-[#4a5568]'}`}
                            onClick={() => setAssignmentFilter(type)}
                        >
                            {type} Views
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-[500px] md:max-w-full">
                    <div className="flex-1 bg-white border border-[#edf2f7] p-3 px-4 rounded-2xl flex items-center gap-3 shadow-sm focus-within:ring-4 focus-within:ring-[#2447d7]/5 focus-within:border-[#2447d7] transition-all">
                        <IconSearch />
                        <input 
                            type="text" 
                            className="bg-transparent border-none outline-none text-sm w-full text-[#1a202c] placeholder:text-[#a0aec0]" 
                            placeholder="Search all tasks..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-[#f1f5f9] p-1 rounded-2xl border border-[#e2e8f0] shrink-0">
                        {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
                            <button
                                key={s}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${filter === s ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setFilter(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="flex flex-col gap-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div key={task.id} className="bg-white rounded-2xl border border-[#edf2f7] p-6 flex items-center justify-between gap-6 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' : task.type === 'Document' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-[#f0fdf4] text-[#16a34a]'}`}>
                                        {task.type === 'Call' && <IconPhone />}
                                        {task.type === 'Document' && <IconDoc />}
                                        {task.type !== 'Call' && task.type !== 'Document' && <IconMeeting />}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-[#1a202c]">{task.title}</h3>
                                            {task.assignedTo === 'Self' ? (
                                                <span className="text-[9px] font-black text-[#a0aec0] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#edf2f7] uppercase tracking-wider whitespace-nowrap">Personal</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-[0.8rem] font-bold text-[#2447d7] bg-[#f0f4ff] px-2.5 py-1 rounded-lg">
                                                    Assignee: {users.find(u => u.id.toString() === task.assignedTo.toString())?.name || task.assignedTo}
                                                </span>
                                            )}
                                            {task.createdBy && task.createdBy !== 'Super Admin' && (
                                                <span className="bg-[#fff7ed] text-[#ea580c] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#ffedd5]">By: {task.createdBy}</span>
                                            )}

                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#718096]">
                                                <IconUser size={14} />
                                                {task.lead || 'Administrative'}
                                            </span>
                                            <span className="text-[12px] font-bold text-[#a0aec0] uppercase tracking-widest">{task.date} • {task.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <select 
                                        className={`p-[10px_20px] rounded-xl text-sm font-bold border-2 outline-none transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:12px] pr-10
                                            ${task.status === 'Completed' ? 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]' : task.status === 'In Progress' ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]' : 'bg-[#f8fafc] text-[#718096] border-[#edf2f7]'}
                                        `}
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22${task.status === 'Completed' ? '%23166534' : task.status === 'In Progress' ? '%231d4ed8' : '%23718096'}%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E")` }}
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center bg-[#fdfdfd] rounded-[32px] border-2 border-dashed border-[#edf2f7]">
                            <IconCalendar size={48} className="mx-auto text-[#cbd5e0] mb-4" />
                            <p className="text-lg font-bold text-[#718096]">No tasks found</p>
                        </div>
                    )}
                </div>
            ) : (
                renderCalendar()
            )}
        </div>
    );
};

/* ── ICONS ── */
const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconDoc = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
const IconMeeting = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconList = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);
const IconCalendar = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconUser = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export default SuperAdminTasks;
