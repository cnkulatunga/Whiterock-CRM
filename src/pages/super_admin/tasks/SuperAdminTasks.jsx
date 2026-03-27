import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';
import TaskModal from '../../../components/modals/TaskModal';

const SuperAdminTasks = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {
    const { promotions } = usePromotions();

    // Merge promotions as pseudo-tasks (read-only, never persisted to localStorage)
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
        fileData: p.fileData,
        assignedTo: 'Self'
    })), [promotions]);

    const tasks = React.useMemo(() => [...initialTasks, ...memoizedPromotions], [initialTasks, memoizedPromotions]);
    const { users } = useUsers();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const assignableUsers = users.filter(u => u.role !== 'Super Admin');

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [categoryFilter, setCategoryFilter] = useState('All'); // All, Tasks, Promotions
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const [viewMode, setViewMode] = useState('list');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [highlightTaskId, setHighlightTaskId] = useState(null);
    const taskRefs = useRef({});

    // Auto-highlight and scroll to task linked from dashboard
    useEffect(() => {
        if (location.state?.taskId) {
            setHighlightTaskId(location.state.taskId);
            setTimeout(() => {
                const el = taskRefs.current[location.state.taskId];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            const timer = setTimeout(() => setHighlightTaskId(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);


    const todayDate = new Date();
    const [calYear, setCalYear] = useState(todayDate.getFullYear());
    const [calMonth, setCalMonth] = useState(todayDate.getMonth());
    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSaveTask = (taskToSave) => {
        if (editingTask) {
            setTasks(tasks.map(t => t.id === taskToSave.id ? taskToSave : t));
        } else {
            setTasks([taskToSave, ...tasks]);
            if (notifyReminderSet) notifyReminderSet(taskToSave);
        }
        setIsAddingTask(false);
        setEditingTask(null);
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsAddingTask(true);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
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
        const matchesSearch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.lead && task.lead.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filter === 'All' || task.status === filter;
        
        const isPromotionItem = task.isPromotion;
        const matchesCategory = categoryFilter === 'All' || 
            (categoryFilter === 'Promotions' && isPromotionItem) || 
            (categoryFilter === 'Tasks' && !isPromotionItem);
        
        let matchesAssignment = true;
        if (assignmentFilter === 'Personal') {
            matchesAssignment = Array.isArray(task.assignedTo) ? task.assignedTo.includes('Self') : task.assignedTo === 'Self';
        } else if (assignmentFilter === 'Team') {
            matchesAssignment = Array.isArray(task.assignedTo) ? (task.assignedTo.length > 1 || (task.assignedTo.length === 1 && task.assignedTo[0] !== 'Self')) : task.assignedTo !== 'Self';
        }
        
        return matchesSearch && matchesStatus && matchesAssignment && matchesCategory;
    });

    // Calculate Stats
    const stats = {
        total: filteredTasks.length,
        pending: filteredTasks.filter(t => t.status !== 'Completed').length,
        completed: filteredTasks.filter(t => t.status === 'Completed').length,
        urgent: filteredTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length
    };

    const renderCalendar = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
        const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
        const monthStr = String(calMonth + 1).padStart(2, '0');
        const cells = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
        const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        
        return (
            <div className={`p-5 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-[#1e2347] border-[#2c3568] shadow-[0_8px_32px_rgba(0,0,0,0.3)]' : 'bg-white border-[#edf2f7] shadow-sm hover:shadow-md'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-[15px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>
                        Operational Calendar
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096] hover:border-[#2447d7] hover:text-[#2447d7]'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <span className={`text-xs font-black uppercase tracking-widest min-w-[100px] text-center ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>
                            {MONTH_NAMES[calMonth]} {calYear}
                        </span>
                        <button onClick={nextMonth} className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096] hover:border-[#2447d7] hover:text-[#2447d7]'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                        <div key={idx} className={`text-center text-[10px] font-black tracking-widest pb-3 transition-colors ${isDark ? 'text-[#4b5563]' : 'text-[#cbd5e0]'}`}>{d}</div>
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
                                onClick={() => setSelectedDate(dateStr)}
                                className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 group
                                    ${isToday && !isSelected 
                                        ? (isDark ? 'bg-[#2a3258] border-[#6366f1]/50' : 'bg-[#f0f4ff] border-[#2447d7]/30') 
                                        : (dayTasks.length > 0 
                                            ? (isDark ? 'bg-[#242b50]' : 'bg-[#f8faff]') 
                                            : (isDark ? 'bg-transparent' : 'bg-white'))
                                    }
                                    ${isSelected 
                                        ? (isDark ? 'border-[#6366f1] ring-4 ring-[#6366f1]/10 bg-[#312e81]' : 'border-[#2447d7] ring-4 ring-[#2447d7]/5 bg-[#f5f8ff]') 
                                        : (isDark ? 'border-[#2c3568]' : 'border-[#edf2f7]')
                                    }
                                    hover:border-[#6366f1] hover:scale-105 active:scale-95
                                `}
                            >
                                <span className={`text-[12px] font-bold ${isToday ? (isDark ? 'text-[#818cf8]' : 'text-[#2447d7]') : (isDark ? 'text-[#94abda]' : 'text-[#718096]')} group-hover:text-[#6366f1]`}>
                                    {day}
                                </span>
                                {dayTasks.length > 0 && (
                                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif] ${isDark ? 'text-[#e4ecff]' : 'text-[#0f172a]'}`}>
            
            {/* KPI STATS */}
            <div className="grid grid-cols-4 gap-3 md:grid-cols-2 sm:grid-cols-1">
                {[
                    { label: 'Total Tasks', value: stats.total, icon: <IconList size={14} />, color: 'from-[#6366f1] to-[#4f46e5]', shadow: 'shadow-indigo-500/20' },
                    { label: 'Pending Items', value: stats.pending, icon: <IconClock size={14} />, color: 'from-[#f59e0b] to-[#d97706]', shadow: 'shadow-amber-500/20' },
                    { label: 'Urgent Action', value: stats.urgent, icon: <IconPlus size={14} />, color: 'from-[#ef4444] to-[#dc2626]', shadow: 'shadow-rose-500/20' },
                    { label: 'Completed Today', value: stats.completed, icon: <IconPlus size={14} />, color: 'from-[#10b981] to-[#059669]', shadow: 'shadow-emerald-500/20' }
                ].map((kpi, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.01] ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white ${kpi.shadow} shadow-lg shrink-0`}>
                            {kpi.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[18px] font-black leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>{kpi.value}</span>
                            <span className={`text-[8.5px] font-black uppercase tracking-widest ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{kpi.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ACTION BAR */}
            <div className={`p-1.5 rounded-[20px] border flex items-center justify-between gap-3 flex-wrap ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                    <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border flex-1 transition-all focus-within:ring-4 ${isDark ? 'bg-[#2a3258] border-[#36407a] focus-within:border-[#6366f1] focus-within:ring-[#6366f1]/10' : 'bg-[#f8fafc] border-[#edf2f7] focus-within:border-[#2447d7] focus-within:ring-[#2447d7]/5'}`}>
                        <IconSearch size={14} />
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none text-[12px] font-medium w-full placeholder:text-[#94a3b8] tracking-tight"
                            placeholder="Search operations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={`hidden md:flex p-1 rounded-xl border ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                        <button className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? (isDark ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20' : 'bg-[#2447d7] text-white') : (isDark ? 'text-[#94abda]' : 'text-[#718096]')}`} onClick={() => setViewMode('list')}><IconList size={14}/></button>
                        <button className={`p-1.5 rounded-lg transition-all ${viewMode === 'calendar' ? (isDark ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20' : 'bg-[#2447d7] text-white') : (isDark ? 'text-[#94abda]' : 'text-[#718096]')}`} onClick={() => setViewMode('calendar')}><IconCalendar size={14}/></button>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                        {['All', 'Pending', 'Progress', 'Done'].map(s => (
                            <button
                                key={s}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filter === (s === 'Done' ? 'Completed' : s === 'Progress' ? 'In Progress' : s) ? (isDark ? 'bg-[#6366f1] text-white shadow-md' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda] hover:text-[#e4ecff]' : 'text-[#718096] hover:text-[#1e293b]')}`}
                                onClick={() => setFilter(s === 'Done' ? 'Completed' : s === 'Progress' ? 'In Progress' : s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button 
                        className={`p-[8px_18px] rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] shadow-[#6366f1]/25`} 
                        onClick={() => { setIsAddingTask(true); setEditingTask(null); }}
                    >
                        <IconPlus size={14} /> <span>New</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-12 gap-6">
                {/* LIST View (8 cols) */}
                <div className={`${viewMode === 'list' ? 'col-span-8 lg:col-span-12' : 'hidden lg:block lg:col-span-12'} flex flex-col gap-4`}>
                    <div className="flex items-center justify-between px-1 flex-wrap gap-4">
                        <div className="flex items-center gap-5">
                            {[
                                { id: 'All', label: 'All Operations' },
                                { id: 'Tasks', label: 'Workflows' },
                                { id: 'Promotions', label: 'Promos' }
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategoryFilter(cat.id)}
                                    className={`relative py-1.5 text-[13px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat.id ? (isDark ? 'text-[#818cf8]' : 'text-[#2447d7]') : (isDark ? 'text-[#4b5563] hover:text-[#94abda]' : 'text-[#94a3b8] hover:text-[#1e293b]')}`}
                                >
                                    {cat.label}
                                    {categoryFilter === cat.id && (
                                        <div className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full ${isDark ? 'bg-[#818cf8] shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-[#2447d7] shadow-[0_4px_12px_rgba(36,71,215,0.3)]'}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className={`flex p-0.5 rounded-lg border ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                            {['All', 'Personal', 'Team'].map(type => (
                                <button
                                    key={type}
                                    className={`px-3 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider transition-all ${assignmentFilter === type ? (isDark ? 'bg-[#6366f1] text-white shadow-md' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda] hover:text-[#e4ecff]' : 'text-[#1e293b]')}`}
                                    onClick={() => setAssignmentFilter(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    ref={el => taskRefs.current[task.id] = el}
                                    className={`p-2.5 rounded-xl border transition-all duration-300 group hover:translate-y-[-0.5px] ${
                                        isDark 
                                            ? 'bg-[#1e2347] border-[#2c3568] hover:border-[#6366f1]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                                            : 'bg-white border-[#edf2f7] hover:border-[#2447d7]/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.01)]'
                                    } ${highlightTaskId === task.id ? (isDark ? 'border-[#6366f1] ring-4 ring-[#6366f1]/20' : 'border-[#2447d7] ring-4 ring-[#2447d7]/20 shadow-[0_0_0_4px_rgba(36,71,215,0.1)] animate-pulse') : ''}`}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                                                    task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' : 
                                                    task.type === 'Document' ? 'bg-[#fff7ed] text-[#ea580c]' : 
                                                    task.type === 'Promotion' ? 'bg-[#2447d7] text-white' : 
                                                    'bg-[#f0fdf4] text-[#16a34a]'
                                                }`}>
                                                    {task.type === 'Call' && <IconPhone size={13} />}
                                                    {task.type === 'Document' && <IconDoc size={13} />}
                                                    {task.type === 'Promotion' ? <IconPlus size={13} /> : (task.type !== 'Call' && task.type !== 'Document' && <IconMeeting size={13} />)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <h3 className={`text-[12.5px] font-black leading-tight truncate ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`} title={task.title}>{task.title}</h3>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        {task.isPromotion && (
                                                            <span className="bg-[#2447d7] text-white text-[6px] font-black px-1 py-0.5 rounded uppercase leading-none">Promo</span>
                                                        )}
                                                        <span className={`text-[8.5px] font-black uppercase tracking-widest ${isDark ? 'text-[#4b5563]' : 'text-[#94a3b8]'}`}>
                                                            {task.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {canManageTask(task, user) && (
                                                    <button 
                                                        onClick={() => handleEditClick(task)}
                                                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f1f3f9] border-[#e2e8f0] text-[#718096] hover:text-[#2447d7]'}`}
                                                    >
                                                        <IconEdit size={11} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-dashed border-[#edf2f7] dark:border-[#2c3568]">
                                            <div className="flex flex-col">
                                                <span className={`text-[9.5px] font-bold truncate max-w-[80px] ${isDark ? 'text-[#94abda]' : 'text-[#718096]'}`}>
                                                    {task.lead || 'Strategy'}
                                                </span>
                                            </div>
                                            {!task.isPromotion ? (
                                                <select 
                                                    className={`p-[4px_10px] rounded-lg text-[9px] font-black uppercase tracking-wider border outline-none transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_0.4rem_center] bg-[length:7px] pr-6
                                                        ${task.status === 'Completed' ? (isDark ? 'bg-[#064e3b] text-[#34d399] border-[#065f46]' : 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]') : 
                                                          task.status === 'In Progress' ? (isDark ? 'bg-[#1e3a8a] text-[#60a5fa] border-[#1e40af]' : 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]') : 
                                                          (isDark ? 'bg-[#1e2347] text-[#94abda] border-[#2c3568]' : 'bg-[#f8fafc] text-[#718096] border-[#edf2f7]')
                                                        }
                                                    `}
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22${task.status === 'Completed' ? (isDark ? '%2334d399' : '%23166534') : task.status === 'In Progress' ? (isDark ? '%2360a5fa' : '%231d4ed8') : (isDark ? '%2394abda' : '%23718096')}%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E")` }}
                                                    value={task.status}
                                                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                >
                                                    <option>Pending</option>
                                                    <option>Progress</option>
                                                    <option>Done</option>
                                                </select>
                                            ) : (
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${isDark ? 'bg-[#2a3258] text-[#818cf8] border-[#36407a]' : 'bg-[#f0f4ff] text-[#2447d7] border-[#dbeafe]'}`}>Active</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={`py-32 text-center rounded-[40px] border-4 border-dashed animate-pulse ${isDark ? 'bg-[#1e2347]/50 border-[#2c3568]' : 'bg-[#fdfdfd] border-[#edf2f7]'}`}>
                                <IconCalendar size={56} className="mx-auto text-[#cbd5e0] mb-6 opacity-20" />
                                <p className={`text-xl font-black ${isDark ? 'text-[#4b5563]' : 'text-[#cbd5e0]'}`}>No matching tasks found</p>
                                <p className={`text-sm font-medium mt-2 ${isDark ? 'text-[#2c3568]' : 'text-[#e2e8f0]'}`}>Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* CALENDAR View (4 cols) */}
                <div className={`${viewMode === 'calendar' ? 'col-span-12' : 'col-span-4 lg:hidden'} sticky top-8 h-fit`}>
                    {renderCalendar()}
                </div>
            </div>

            <TaskModal 
                isOpen={isAddingTask} 
                onClose={() => { setIsAddingTask(false); setEditingTask(null); }}
                onSave={handleSaveTask}
                editingTask={editingTask}
            />
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
const IconClock = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
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


export default SuperAdminTasks;
