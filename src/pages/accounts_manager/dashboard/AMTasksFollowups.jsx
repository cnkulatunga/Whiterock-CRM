import React, { useState, useEffect } from 'react';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';

import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { useTasks } from '../../../context/TasksContext';

const AMTasksFollowups = ({ tasks, setTasks, initialDate, notifyReminderSet }) => {
    const { users } = useUsers();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Leaders (Team Leaders) + Members (Tele Agents)
    const assignableUsers = users.filter(u => u.role === 'Team Leader' || u.role === 'Tele Agent');
    const { addTask, updateTask, deleteTask } = useTasks();

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('calendar'); // Default to calendar
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isSyncingOutlook, setIsSyncingOutlook] = useState(false);
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [addToOutlook, setAddToOutlook] = useState(true);

    const todayDate = new Date();
    const [calYear, setCalYear] = useState(todayDate.getFullYear());
    const [calMonth, setCalMonth] = useState(todayDate.getMonth());
    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };


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
        
        if (isEditingTask && editingTask) {
            const taskToUpdate = {
                ...editingTask,
                ...newTask
            };
            updateTask(taskToUpdate);
            setIsEditingTask(false);
            setEditingTask(null);
        } else {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const taskToAdd = {
                ...newTask,
                id: Date.now(),
                status: 'Pending',
                createdBy: 'Accounts Manager',
                assignedTo: currentUser.id?.toString() || newTask.assignedTo || 'Self',
                creatorId: currentUser.id
            };
            addTask(taskToAdd);
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

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsEditingTask(true);
        setNewTask({
            title: task.title,
            lead: task.lead || '',
            date: task.date,
            time: task.time,
            type: task.type,
            reminder: task.reminder || 'none',
            assignedTo: task.assignedTo || 'Self',
            message: task.message || ''
        });
        setIsAddingTask(true);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(id);
        }
    };

    const updateTaskStatus = (id, newStatus) => {
        updateTask({ ...tasks.find(t => t.id === id), status: newStatus });
    };

    const updateTaskReminder = (id, newReminder) => {
        const updatedTask = { ...tasks.find(t => t.id === id), reminder: newReminder };
        updateTask(updatedTask);
        if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updatedTask);
    };

    const [showNotifications, setShowNotifications] = useState(false);

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
        const todayStr = new Date().toISOString().split('T')[0];
        const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
        const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
        const monthStr = String(calMonth + 1).padStart(2, '0');
        const cells = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
        const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const baseYear = new Date().getFullYear();
        const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => baseYear - 3 + i);

        return (
            <div className="grid grid-cols-[1fr_320px] gap-8 xl:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    {/* Month/Year Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-[#edf2f7] bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:border-[#2447d7] hover:text-[#2447d7] transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <select value={calMonth} onChange={e => setCalMonth(Number(e.target.value))} className="text-sm font-bold outline-none rounded-lg px-2 py-1 border border-[#edf2f7] bg-white text-[#1a202c] cursor-pointer focus:border-[#2447d7]">
                                {MONTH_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                            </select>
                            <select value={calYear} onChange={e => setCalYear(Number(e.target.value))} className="text-sm font-bold outline-none rounded-lg px-2 py-1 border border-[#edf2f7] bg-white text-[#1a202c] cursor-pointer focus:border-[#2447d7]">
                                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-[#edf2f7] bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:border-[#2447d7] hover:text-[#2447d7] transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-[#cbd5e0] tracking-widest pb-4 uppercase">{d}</div>
                        ))}
                        {cells.map((day, idx) => {
                            if (day === null) return <div key={`blank-${idx}`} />;
                            const dateStr = `${calYear}-${monthStr}-${String(day).padStart(2, '0')}`;
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
                                setNewTask({
                                    title: '',
                                    lead: '',
                                    date: selectedDate,
                                    time: '12:00',
                                    type: 'Call',
                                    reminder: 'none',
                                    assignedTo: 'Self',
                                    message: ''
                                });
                                setIsEditingTask(false);
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
                                                    {t.assignedTo !== 'Self' && <span className="bg-[#ebf0ff] text-[#2447d7] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Team</span>}
                                                </div>
                                                    <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">{t.time} • {t.lead || 'Personal'}</span>
                                                    {t.reminder && t.reminder !== 'none' && (
                                                        <span className="bg-[#f0f4ff] text-[#2447d7] px-2 py-0.5 rounded-md text-[9px] uppercase font-bold w-fit flex items-center gap-1 mt-1">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10">
                                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                            </svg>
                                                            {t.reminder === '1d' ? '1 day before' : t.reminder === '1h' ? '1 hour before' : '15 min before'}
                                                        </span>
                                                    )}
                                                {t.assignedTo !== 'Self' && (
                                                    <span className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md w-fit" style={{ background: isDark ? 'rgba(36,71,215,0.15)' : '#f0f4ff', color: '#2447d7' }}>
                                                        Assignee: {users.find(u => u.id.toString() === t.assignedTo.toString())?.name || t.assignedTo}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#f1f5f9]">
                                                    <div className="flex items-center border border-[#edf2f7] rounded-lg bg-white">
                                                        <select
                                                            className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#718096] bg-transparent outline-none hover:text-[#2447d7] transition-all cursor-pointer border-none"
                                                            value={t.reminder || 'none'}
                                                            onChange={(e) => updateTaskReminder(t.id, e.target.value)}
                                                            title="Update Reminder"
                                                        >
                                                            <option value="none">🔔 Off</option>
                                                            <option value="15m">15m</option>
                                                            <option value="1h">1h</option>
                                                            <option value="1d">1d</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center flex-1">
                                                        <select
                                                            className={`w-full py-1 text-[10px] pr-6 font-black uppercase tracking-widest border border-[#edf2f7] outline-none transition-all cursor-pointer shadow-sm rounded-lg ${t.status === 'Completed' ? 'bg-[#ecfdf5] text-[#059669]' :
                                                                    t.status === 'In Progress' ? 'bg-[#ebf5ff] text-[#2447d7]' :
                                                                        'bg-[#fff7ed] text-[#ea580c]'
                                                                }`}
                                                            value={t.status}
                                                            onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                                                        >
                                                            <option>Pending</option>
                                                            <option>In Progress</option>
                                                            <option>Completed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {canManageTask(t, JSON.parse(localStorage.getItem('user') || '{}')) && (
                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#f1f5f9]">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleEditClick(t); }}
                                                            className={`p-1 px-2 rounded-md ${isDark ? 'bg-[#141829] text-[#8ea0d4]' : 'bg-[#f8fafc] text-[#718096]'} hover:text-[#2447d7] hover:bg-[#eef2ff] transition-all text-[10px] font-bold border border-[#edf2f7]`}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(t.id); }}
                                                            className={`p-1 px-2 rounded-md ${isDark ? 'bg-[#141829] text-[#8ea0d4]' : 'bg-[#f8fafc] text-[#718096]'} hover:text-[#e53e3e] hover:bg-[#fff5f5] transition-all text-[10px] font-bold border border-[#edf2f7]`}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
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
                    <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-2xl">Tasks and Followups</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium">Manage your tasks, follow-ups, and assign work to team leaders and members.</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-wrap">

                    <div className="flex p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
                        <button className={`p-[6px_16px] rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('list')}><div className="flex items-center gap-2"><IconList size={14} /> List</div></button>
                        <button className={`p-[6px_16px] rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('calendar')}><div className="flex items-center gap-2"><IconCalendar size={14} /> Calendar</div></button>
                    </div>
                    <button className="bg-[#2447d7] text-white p-[10px_20px] rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-2 sm:w-full sm:justify-center" onClick={() => { setIsAddingTask(true); setIsEditingTask(false); setEditingTask(null); setNewTask({ title: '', lead: '', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Call', reminder: 'none', assignedTo: 'Self', message: '' }); }}>
                        <IconPlus /> <span>New Task</span>
                    </button>

                </div>
            </header>

            {isAddingTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-6 px-8 border-b border-[#f1f5f9] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#1a202c]">{isEditingTask ? 'Edit Task' : 'Create New Task'}</h2>
                            <button className="w-10 h-10 border border-[#f1f5f9] text-[#a0aec0] hover:text-[#e53e3e] hover:bg-[#fff5f5] rounded-xl flex items-center justify-center transition-all text-2xl font-light" onClick={() => { setIsAddingTask(false); setIsEditingTask(false); setEditingTask(null); }}>&times;</button>
                        </div>

                        <form onSubmit={handleAddTask} className="p-8 md:p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Task Title</label>
                                    <input required type="text" value={newTask.title} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Portfolio Review..." />
                                </div>                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Assign To</label>
                                    <select 
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]"
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                                    >
                                        <option value="Self">Self (Account Manager)</option>
                                        <optgroup label="Team Leaders">
                                            {assignableUsers.filter(u => u.role === 'Team Leader').map(leader => (
                                                <option key={leader.id} value={leader.id}>{leader.name}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Tele Agents">
                                            {assignableUsers.filter(u => u.role === 'Tele Agent').map(agent => (
                                                <option key={agent.id} value={agent.id}>{agent.name}</option>
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
                                    <label className="text-[13px] font-bold text-[#4a5568]">Related Lead (Optional)</label>
                                    <input type="text" value={newTask.lead} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, lead: e.target.value})} placeholder="Lead Name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Date</label>
                                    <input required type="date" value={newTask.date} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Time</label>
                                    <input required type="time" value={newTask.time} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Set Reminder</label>
                                    <select value={newTask.reminder} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">No Reminder</option>
                                        <option value="15m">15 Minutes Before</option>
                                        <option value="1h">1 Hour Before</option>
                                        <option value="1d">1 Day Before</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                                    <label className="text-[13px] font-bold text-[#4a5568]">Reminder Message / Notes</label>
                                    <textarea value={newTask.message} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full min-h-[100px] resize-none" onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Additional details for the reminder..." rows="3" />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="flex items-center gap-2 cursor-pointer w-fit text-[13px] font-bold text-[#4a5568] hover:text-[#2447d7] transition-colors">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-[#cbd5e0] rounded-md checked:bg-[#2447d7] checked:border-[#2447d7] transition-all cursor-pointer" checked={addToOutlook} onChange={(e) => setAddToOutlook(e.target.checked)} />
                                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        Sync with Outlook Calendar
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#f1f5f9]">
                                <button type="button" className="p-[10px_24px] rounded-xl text-sm font-bold text-[#718096] hover:bg-[#f8fafc] transition-all" onClick={() => setIsAddingTask(false)} disabled={isSyncingOutlook}>Cancel</button>
                                <button type="submit" className="flex justify-center items-center gap-2 bg-[#2447d7] text-white p-[10px_24px] rounded-xl text-sm font-bold shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-1px] transition-all" disabled={isSyncingOutlook}>
                                    {isSyncingOutlook ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Syncing...
                                        </>
                                    ) : isEditingTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {viewMode === 'list' && <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 mb-8 shadow-sm flex justify-between items-center lg:flex-col lg:items-stretch lg:gap-6">
                <div className="flex items-center gap-6 lg:flex-col lg:items-stretch">
                    <div className="relative group min-w-[300px] lg:min-w-0">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <IconSearch size={16} />
                        </div>
                        <input
                            type="text"
                            className="bg-[#f8fafc] border border-[#e2e8f0] p-[10px_16px_10px_40px] rounded-xl text-sm font-medium w-full focus:bg-white focus:border-[#2447d7] outline-none transition-all"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
                        {['All', 'Personal', 'Team'].map(f => (
                            <button
                                key={f}
                                className={`p-[6px_14px] rounded-lg text-xs font-bold transition-all ${assignmentFilter === f ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setAssignmentFilter(f)}
                            >
                                {f}
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
                    {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                        <button
                            key={status}
                            className={`p-[6px_14px] rounded-lg text-xs font-bold transition-all ${filter === status ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`}
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>}

            {viewMode === 'calendar' ? (
                <div className="animate-fadeIn flex flex-col gap-6">
                    <div className="flex justify-center">
                        <div className="flex bg-[#f7fafc] p-1.5 rounded-xl border border-[#edf2f7] w-fit shadow-sm relative z-10">
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
                        <div className={`relative rounded-3xl overflow-hidden min-h-[500px] shadow-sm mb-8 ${isDark ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-[#edf2f7]'}`}>
                            {!outlookAccount ? (
                                <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 ${isDark ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-[#f8fafc] to-white'}`}>
                                    <div className={`w-20 h-20 bg-[#0078d4]/10 rounded-full flex items-center justify-center mb-6 border-4 shadow-md ${isDark ? 'border-[#1e293b]' : 'border-white'}`}>
                                        <svg viewBox="0 0 24 24" width="36" height="36">
                                            <path d="M11 2h10v10H11V2M2 2h7v7H2V2m9 9h10v10H11V11M2 11h7v10H2v-10z" fill="#0078d4" />
                                        </svg>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>Connect Your Outlook Calendar</h3>
                                    <p className={`text-[15px] leading-relaxed max-w-[400px] mb-8 font-medium ${isDark ? 'text-[#94a3b8]' : 'text-[#718096]'}`}>Sync with your Microsoft 365 account to view and manage your schedule directly from Alpha Funding CRM.</p>
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
                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex justify-between items-center group hover:border-[#2447d7]/30 transition-all duration-300 md:flex-col md:items-stretch md:gap-5" key={task.id}>
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${
                                        task.type === 'Call' ? 'bg-[#ebf5ff] text-[#2447d7] border-[#d9ebff]' :
                                        task.type === 'Document' ? 'bg-[#f0f9ff] text-[#0ea5e9] border-[#e0f2fe]' :
                                        task.type === 'Review' ? 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]' :
                                        task.type === 'Email' ? 'bg-[#fdf2f8] text-[#db2777] border-[#fce7f3]' :
                                        'bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]'
                                    }`}>
                                        {task.type === 'Call' && <IconPhone />}
                                        {task.type === 'Document' && <IconDoc />}
                                        {task.type === 'Review' && <IconReview />}
                                        {task.type === 'Email' && <IconMail />}
                                        {task.type === 'Meeting' && <IconMeeting />}
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[15px] font-bold text-[#1a202c] leading-tight group-hover:text-[#2447d7] transition-colors">{task.title}</h3>
                                            {task.assignedTo === 'Self' ? (
                                                <span className="text-[9px] font-black text-[#a0aec0] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#edf2f7] uppercase tracking-wider whitespace-nowrap">Personal</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-[0.8rem] font-bold text-[#2447d7] bg-[#f0f4ff] px-2.5 py-1 rounded-lg">
                                                    Assignee: {users.find(u => u.id.toString() === task.assignedTo.toString())?.name || task.assignedTo}
                                                </span>
                                            )}
                                            {task.createdBy && (task.createdBy !== 'Accounts Manager' && task.createdBy !== 'Manager') && (
                                                <span className="bg-[#fff7ed] text-[#ea580c] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#ffedd5]">By: {task.createdBy}</span>
                                            )}

                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="text-[12px] font-bold text-[#718096] flex items-center gap-1.5 whitespace-nowrap">
                                                <IconUser size={12} />
                                                {task.lead || 'General Task'}
                                            </span>
                                            <span className="text-[11px] font-bold text-[#cbd5e0] uppercase tracking-widest whitespace-nowrap">
                                                {task.date} • {task.time}
                                            </span>
                                        </div>
                                        {task.message && <p className="text-[12px] text-[#94a3b8] font-medium leading-relaxed mt-1 line-clamp-1 italic">{task.message}</p>}
                                        {task.reminder && task.reminder !== 'none' && (
                                            <span className="bg-[#f0f4ff] text-[#2447d7] px-2 py-0.5 rounded-md text-[10px] uppercase font-bold w-fit flex items-center gap-1 mt-1">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10">
                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                </svg>
                                                Remind {task.reminder === '1d' ? '1 day before' : task.reminder === '1h' ? '1 hour before' : '15 min before'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2">
                                    <div className="flex items-center border border-[#edf2f7] rounded-xl bg-[#f7fafc]">
                                        <select 
                                            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-[#718096] bg-transparent outline-none hover:text-[#2447d7] transition-all cursor-pointer border-none"
                                            value={task.reminder || 'none'}
                                            onChange={(e) => updateTaskReminder(task.id, e.target.value)}
                                            title="Update Reminder"
                                        >
                                            <option value="none">🔔 Off</option>
                                            <option value="15m">15m</option>
                                            <option value="1h">1h</option>
                                            <option value="1d">1d</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <select 
                                            className={`p-[8px_20px] rounded-xl text-xs font-black uppercase tracking-widest border-2 outline-none transition-all cursor-pointer shadow-sm active:scale-95 sm:w-full ${
                                                task.status === 'Completed' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] hover:bg-[#d1fae5]' :
                                                task.status === 'In Progress' ? 'bg-[#ebf5ff] text-[#2447d7] border-[#d9ebff] hover:bg-[#d9ebff]' :
                                                'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] hover:bg-[#ffedd5]'
                                            }`}
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                        >
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                    </div>
                                    {canManageTask(task, JSON.parse(localStorage.getItem('user') || '{}')) && (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleEditClick(task)}
                                                className="w-9 h-9 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-[#718096] flex items-center justify-center hover:bg-[#eef2ff] hover:text-[#2447d7] transition-all group/btn"
                                                title="Edit Task"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="w-9 h-9 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-[#718096] flex items-center justify-center hover:bg-[#fff5f5] hover:text-[#e53e3e] transition-all group/btn"
                                                title="Delete Task"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-[#edf2f7] py-20 flex flex-col items-center gap-4 grayscale opacity-60">
                            <IconList size={40} />
                            <p className="text-sm font-bold text-[#718096]">No tasks found matching your criteria</p>
                        </div>
                    )}
                </div>
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
const IconReview = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconMeeting = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconList = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);
const IconCalendar = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconSearch = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconUser = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

export default AMTasksFollowups;

