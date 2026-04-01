import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';
import { useLeads } from '../../../context/LeadsContext';
import TaskModal from '../../../components/modals/TaskModal';

const TeamLeaderCalendar = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {
    const { promotions } = usePromotions();
    const { leads } = useLeads();
    const { users } = useUsers();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const location = useLocation();

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
        fileData: p.fileData,
        assignedTo: 'Self'
    })), [promotions]);

    const tasks = React.useMemo(() => [...initialTasks, ...memoizedPromotions], [initialTasks, memoizedPromotions]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [categoryFilter, setCategoryFilter] = useState('All'); // All, Tasks, Promotions
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [highlightTaskId, setHighlightTaskId] = useState(null);
    const taskRefs = useRef({});

    // Outlook Sync
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(() => {
        const acc = getAccount();
        if (acc) {
            setOutlookAccount(acc);
            if (useOutlookCalendar) fetchOutlookEvents();
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
            setTasks(initialTasks.map(t => t.id === taskToSave.id ? taskToSave : t));
        } else {
            setTasks([taskToSave, ...initialTasks]);
            if (notifyReminderSet) notifyReminderSet(taskToSave);
        }
        setIsAddingTask(false);
        setEditingTask(null);
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsAddingTask(true);
    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(initialTasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
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
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#1e2347] border-[#2c3568] shadow-lg' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>
                        Calendar
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096] hover:border-[#2447d7]'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <span className={`text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>
                            {MONTH_NAMES[calMonth].slice(0, 3)} {calYear}
                        </span>
                        <button onClick={nextMonth} className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096] hover:border-[#2447d7]'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                        <div key={idx} className={`text-center text-[9px] font-black tracking-widest pb-2 ${isDark ? 'text-[#4b5563]' : 'text-[#cbd5e0]'}`}>{d}</div>
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
                                className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 group
                                    ${isToday && !isSelected 
                                        ? (isDark ? 'bg-[#2a3258] border-[#6366f1]/50' : 'bg-[#f0f4ff] border-[#2447d7]/30') 
                                        : (dayTasks.length > 0 
                                            ? (isDark ? 'bg-[#242b50]' : 'bg-[#f8faff]') 
                                            : (isDark ? 'bg-transparent' : 'bg-white'))
                                    }
                                    ${isSelected 
                                        ? (isDark ? 'border-[#6366f1] bg-[#312e81]' : 'border-[#2447d7] bg-[#f5f8ff]') 
                                        : (isDark ? 'border-[#2c3568]' : 'border-[#edf2f7]')
                                    }
                                    hover:border-[#6366f1]
                                `}
                            >
                                <span className={`text-[11px] font-bold ${isToday ? (isDark ? 'text-[#818cf8]' : 'text-[#2447d7]') : (isDark ? 'text-[#94abda]' : 'text-[#718096]')} group-hover:text-[#6366f1]`}>
                                    {day}
                                </span>
                                {dayTasks.length > 0 && (
                                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6366f1]" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif] ${isDark ? 'text-[#e4ecff]' : 'text-[#0f172a]'} h-[calc(100vh-120px)]`}>
            
            <div className="flex justify-between items-center mb-2">
                <div className="flex bg-[#f1f5f9] dark:bg-[#2a3258] p-1 rounded-xl border border-[#e2e8f0] dark:border-[#36407a] gap-1">
                    <button
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${!useOutlookCalendar ? 'bg-white dark:bg-[#6366f1] text-[#2447d7] dark:text-white shadow-sm' : 'text-[#718096] dark:text-[#94abda]'}`}
                        onClick={() => setUseOutlookCalendar(false)}
                    >
                        Local Tasks
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${useOutlookCalendar ? 'bg-white dark:bg-[#6366f1] text-[#2447d7] dark:text-white shadow-sm' : 'text-[#718096] dark:text-[#94abda]'}`}
                        onClick={() => setUseOutlookCalendar(true)}
                    >
                        Outlook Calendar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[340px_1fr] gap-6 lg:grid-cols-1 overflow-hidden">
                {/* Left Sidebar: Calendar & Stats */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Total', value: stats.total, color: 'from-[#6366f1] to-[#4f46e5]' },
                            { label: 'Pending', value: stats.pending, color: 'from-[#f59e0b] to-[#d97706]' },
                            { label: 'Urgent', value: stats.urgent, color: 'from-[#ef4444] to-[#dc2626]' },
                            { label: 'Done', value: stats.completed, color: 'from-[#10b981] to-[#059669]' }
                        ].map((kpi, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-1.5 transition-all relative overflow-hidden group hover:scale-[1.02] duration-300 ${
                                isDark 
                                    ? 'bg-[#1e2347] border-[#2c3568]' 
                                    : 'bg-white border-[#edf2f7] shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
                            }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${kpi.color}`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{kpi.label}</span>
                                <span className={`text-[22px] font-black leading-none bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`}>{kpi.value}</span>
                            </div>
                        ))}
                    </div>

                    {renderCalendar()}

                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                         <h4 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: isDark ? '#8ea0d4' : '#a0aec0' }}>Selected: {selectedDate}</h4>
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xl font-black">{tasks.filter(t => t.date === selectedDate).length}</span>
                                <span className="text-[9px] font-bold uppercase text-[#94a3b8]">Tasks</span>
                            </div>
                            <button 
                                className="bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#2447d7]/20 hover:scale-105 transition-all flex items-center gap-2"
                                onClick={() => { setIsAddingTask(true); setEditingTask(null); }}
                            >
                                <IconPlus size={10} /> New Task
                            </button>
                         </div>
                    </div>
                </div>

                {/* Right Content: Task List or Outlook */}
                <div className="flex flex-col gap-4 overflow-hidden">
                    {useOutlookCalendar ? (
                        <div className={`flex-1 rounded-2xl border overflow-y-auto pr-2 scrollbar-thin ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                            {!outlookAccount ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                                    <h3 className="text-xl font-black mb-4">Connect Outlook</h3>
                                    <button className="px-8 py-3 bg-[#0078d4] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all" onClick={handleOutlookLogin}>
                                        Sign in with Microsoft
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-sm font-black uppercase tracking-widest text-[#94a3b8]">Outlook Schedule</h2>
                                        <button className="text-[10px] font-black uppercase text-[#2447d7] hover:underline" onClick={fetchOutlookEvents}>Refresh</button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {outlookEvents.length > 0 ? (
                                            outlookEvents.map((evt, i) => (
                                                <div key={i} className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f8fafc] border-[#edf2f7]'}`}>
                                                    <div className="text-[13px] font-bold">{evt.subject}</div>
                                                    <div className="text-[10px] text-[#94a3b8] mt-1">{new Date(evt.start.dateTime).toLocaleString()}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center py-12 text-[#94a3b8] italic">No upcoming events found</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className={`p-2 rounded-2xl border flex items-center justify-between gap-3 ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border flex-1 transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f8fafc] border-[#edf2f7]'}`}>
                                    <IconSearch size={14} />
                                    <input
                                        type="text"
                                        className="bg-transparent border-none outline-none text-[12px] font-medium w-full placeholder:text-[#94a3b8]"
                                        placeholder="Search operations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex p-0.5 rounded-xl border bg-[#f1f5f9] dark:bg-[#2a3258] border-[#e2e8f0] dark:border-[#36407a]">
                                    {['All', 'Personal', 'Team'].map(type => (
                                        <button
                                            key={type}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${assignmentFilter === type ? (isDark ? 'bg-[#6366f1] text-white shadow-md' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda]' : 'text-[#718096]')}`}
                                            onClick={() => setAssignmentFilter(type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col gap-3">
                                 <div className="flex items-center gap-4 px-1">
                                    {['All', 'Tasks', 'Promotions'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`relative py-1 text-[11px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? (isDark ? 'text-[#818cf8]' : 'text-[#2447d7]') : (isDark ? 'text-[#4b5563]' : 'text-[#94a3b8]')}`}
                                        >
                                            {cat}
                                            {categoryFilter === cat && (
                                                <div className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isDark ? 'bg-[#818cf8]' : 'bg-[#2447d7]'}`} />
                                            )}
                                        </button>
                                    ))}
                                </div>

                            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                                {(() => {
                                    const dayTasks = filteredTasks.filter(t => t.date === selectedDate);
                                    const dayPromos = memoizedPromotions.filter(p => {
                                        const start = new Date(p.date);
                                        const end = new Date(p.endDate);
                                        const current = new Date(selectedDate);
                                        return current >= start && current <= end;
                                    });
                                    
                                    return (
                                        <div className="grid grid-cols-2 gap-3 h-full min-h-0">
                                            {/* Operations Column */}
                                            <div className="flex flex-col gap-2 h-full">
                                                <h4 className="text-[9px] font-black uppercase tracking-wider pb-1" style={{ color: isDark ? '#8ea0d4' : '#718096', borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>Operations</h4>
                                                {dayTasks.length > 0 ? (
                                                    dayTasks.map(task => (
                                                        <div 
                                                            key={task.id} 
                                                            ref={el => taskRefs.current[task.id] = el}
                                                            className={`p-3 rounded-xl border transition-all duration-300 group ${
                                                                isDark 
                                                                    ? 'bg-[#1e2347] border-[#2c3568] hover:border-[#6366f1]/30' 
                                                                    : 'bg-white border-[#edf2f7] hover:shadow-sm'
                                                            } ${highlightTaskId === task.id ? 'border-[#2447d7] ring-4 ring-[#2447d7]/10 animate-pulse' : ''}`}
                                                        >
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                                                                            task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' : 
                                                                            task.type === 'Document' ? 'bg-[#fff7ed] text-[#ea580c]' : 
                                                                            'bg-[#f0fdf4] text-[#16a34a]'
                                                                        }`}>
                                                                            {task.type === 'Call' && <IconPhone size={12} />}
                                                                            {task.type === 'Document' && <IconDoc size={12} />}
                                                                            {(task.type !== 'Call' && task.type !== 'Document' && <IconMeeting size={12} />)}
                                                                        </div>
                                                                        <div className="flex flex-col min-w-0">
                                                                            <h3 className={`text-[11px] font-bold leading-tight truncate ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`} title={task.title}>{task.title}</h3>
                                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? '#4b5563' : '#94a3b8'}`}>{task.time}</span>
                                                                        </div>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => handleEditClick(task)}
                                                                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f1f3f9] border-[#e2e8f0] text-[#718096] hover:text-[#2447d7]'}`}
                                                                    >
                                                                        <IconEdit size={10} />
                                                                    </button>
                                                                </div>
                                                                <div className="flex flex-col gap-1.5 pt-2 border-t border-[#f1f5f9] dark:border-[#2c3568]">
                                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold" style={{ color: isDark ? '#94abda' : '#718096' }}>
                                                                        <IconUser size={9} />
                                                                        <span className="truncate">{task.lead || 'Strategic Task'}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${Array.isArray(task.assignedTo) && task.assignedTo.includes('Self') ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                                                                            {Array.isArray(task.assignedTo) && task.assignedTo.includes('Self') ? 'PERSONAL' : 'TEAM'}
                                                                        </span>
                                                                        <select 
                                                                            className={`p-[2px_6px] rounded text-[8px] font-black uppercase tracking-wider border outline-none transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_0.2rem_center] bg-[length:6px] pr-4
                                                                                ${task.status === 'Completed' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 
                                                                                task.status === 'In Progress' ? 'bg-[#ebf5ff] text-[#2447d7] border-[#d9ebff]' : 
                                                                                'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]'}
                                                                            `}
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
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl" style={{ borderColor: isDark ? '#2c3568' : '#e2e8f0' }}>
                                                        <p className="text-[10px] text-slate-400 font-bold italic">No tasks</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Promotions Column */}
                                            <div className="flex flex-col gap-2 h-full">
                                                <h4 className="text-[9px] font-black uppercase tracking-wider pb-1" style={{ color: isDark ? '#8ea0d4' : '#718096', borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>Promotions</h4>
                                                {dayPromos.length > 0 ? (
                                                    dayPromos.map(p => {
                                                        const hue = (p.id.toString().length * 137) % 360;
                                                        return (
                                                            <div key={p.id} className="p-3 rounded-xl flex flex-col gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer border relative overflow-hidden" style={{ background: isDark ? `hsla(${hue}, 80%, 65%, 0.05)` : `hsla(${hue}, 80%, 45%, 0.03)`, borderColor: isDark ? `hsla(${hue}, 80%, 65%, 0.1)` : `hsla(${hue}, 80%, 45%, 0.08)` }}>
                                                                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `hsl(${hue}, 80%, 55%)` }} />
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="text-[10px] font-black leading-tight" style={{ color: isDark ? '#e4ecff' : '#1e3a8a' }}>{p.title.replace('PROMO: ', '')}</span>
                                                                    <span className="bg-white/20 px-1 py-0.5 rounded text-[7px] font-black text-white uppercase" style={{ background: `hsl(${hue}, 80%, 55%)` }}>Promo</span>
                                                                </div>
                                                                <p className="text-[9px] font-medium leading-relaxed line-clamp-2" style={{ color: isDark ? '#8ea0d4' : '#4a5568' }}>{p.lead}</p>
                                                                {p.fileName && (
                                                                    <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-dashed" style={{ borderColor: isDark ? '#2c3568' : '#edf2f7' }}>
                                                                        <IconDoc size={10} />
                                                                        <span className="text-[8px] font-bold truncate flex-1">{p.fileName}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl" style={{ borderColor: isDark ? '#2c3568' : '#e2e8f0' }}>
                                                        <p className="text-[10px] text-slate-400 font-bold italic">No promos</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            </div>
                        </>
                    )}
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
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

export default TeamLeaderCalendar;
