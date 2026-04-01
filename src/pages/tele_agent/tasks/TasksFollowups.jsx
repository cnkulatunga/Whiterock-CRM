import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';
import { useLeads } from '../../../context/LeadsContext';
import TaskModal from '../../../components/modals/TaskModal';

// Icon Components
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconPhone = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const IconDoc = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);

const IconMeeting = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconUser = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconEdit = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconTrash = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const IconSearch = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

const StatusSelector = ({ status, onStatusChange, isDark, isPromotion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = isPromotion ? ['Active', 'Expired', 'Ended'] : ['Pending', 'In Progress', 'Completed'];

    const getStatusStyle = (s) => {
        if (s === 'Completed' || s === 'Active') return { bg: 'bg-[#ecfdf5]', text: 'text-[#059669]', border: 'border-[#d1fae5]' };
        if (s === 'In Progress') return { bg: 'bg-[#ebf5ff]', text: 'text-[#2447d7]', border: 'border-[#d9ebff]' };
        return { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]', border: 'border-[#ffedd5]' };
    };

    const currentStyle = getStatusStyle(status);

    return (
        <div className="relative shrink-0">
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`p-[4px_12px] rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shadow-sm flex items-center gap-2 ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}
            >
                {status}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
            </button>

            {isOpen && (
                <div 
                    className="absolute right-0 bottom-full mb-2 z-[100] w-36 rounded-xl border shadow-2xl overflow-hidden animate-fadeIn"
                    style={{ background: isDark ? '#1e2347' : '#ffffff', borderColor: isDark ? '#2c3568' : '#e2e8f0', backdropFilter: 'blur(10px)' }}
                >
                    {options.map(opt => {
                        const isActive = opt === status;
                        return (
                            <button
                                key={opt}
                                onClick={(e) => { e.stopPropagation(); onStatusChange(opt); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-[#2447d7] text-white' : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')}`}
                                style={{ color: isActive ? 'white' : (isDark ? '#e4ecff' : '#1e293b') }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-[99]" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />}
        </div>
    );
};

const TasksFollowups = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {
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

    const tasks = React.useMemo(() => [...initialTasks, ...memoizedPromotions].sort((a, b) => new Date(b.date) - new Date(a.date)), [initialTasks, memoizedPromotions]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
    const taskRefs = useRef({});

    // Handle auto-open if coming from dashboard with a specific date
    useEffect(() => {
        if (initialDate && !editingTask) {
            setSelectedDate(initialDate);
            setIsAddingTask(true);
        }
    }, [initialDate]);

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
        const matchesCategory = categoryFilter === 'All' || 
            (categoryFilter === 'Promotions' && task.isPromotion) || 
            (categoryFilter === 'Tasks' && !task.isPromotion);
        
        let matchesAssignment = true;
        if (assignmentFilter === 'Personal') {
            matchesAssignment = Array.isArray(task.assignedTo) ? task.assignedTo.includes('Self') || task.assignedTo.includes(user.id?.toString()) : (task.assignedTo === 'Self' || task.assignedTo?.toString() === user.id?.toString());
        } else if (assignmentFilter === 'Team') {
            matchesAssignment = Array.isArray(task.assignedTo) ? task.assignedTo.some(id => id !== 'Self' && id !== user.id?.toString()) : (task.assignedTo !== 'Self' && task.assignedTo?.toString() !== user.id?.toString());
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
        const [calYear, setCalYear] = useState(new Date(selectedDate).getFullYear());
        const [calMonth, setCalMonth] = useState(new Date(selectedDate).getMonth());
        
        const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
        const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
        const monthStr = String(calMonth + 1).padStart(2, '0');
        const cells = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
        const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        
        return (
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#1e2347] border-[#2c3568] shadow-lg' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>Calendar</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }} className={`w-6 h-6 rounded-lg border flex items-center justify-center ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096]'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="15 18 9 12 15 6"/></svg></button>
                        <span className={`text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{MONTH_NAMES[calMonth].slice(0, 3)} {calYear}</span>
                        <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }} className={`w-6 h-6 rounded-lg border flex items-center justify-center ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096]'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="9 18 15 12 9 6"/></svg></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className={`text-center text-[9px] font-black tracking-widest pb-2 ${isDark ? 'text-[#4b5563]' : 'text-[#cbd5e0]'}`}>{d}</div>)}
                    {cells.map((day, idx) => {
                        if (day === null) return <div key={`blank-${idx}`} />;
                        const dateStr = `${calYear}-${monthStr}-${String(day).padStart(2, '0')}`;
                        const dayTasks = tasks.filter(t => t.date === dateStr);
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === todayStr;
                        return (
                            <div key={day} onClick={() => setSelectedDate(dateStr)} className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative cursor-pointer transition-all ${isToday && !isSelected ? (isDark ? 'bg-[#2a3258] border-[#6366f1]/50' : 'bg-[#f0f4ff] border-[#2447d7]/30') : isSelected ? (isDark ? 'border-[#6366f1] bg-[#312e81]' : 'border-[#2447d7] bg-[#f5f8ff]') : (isDark ? 'border-[#2c3568]' : 'border-[#edf2f7]')} hover:border-[#6366f1]`}>
                                <span className={`text-[11px] font-bold ${isToday ? (isDark ? '#818cf8' : '#2447d7') : (isDark ? '#94abda' : '#718096')}`}>{day}</span>
                                {dayTasks.length > 0 && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6366f1]" />}
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
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-black tracking-tight">Tasks and Follow-ups</h1>
                    <p className={`text-[12px] font-bold ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>Agent Operations & Strategic Reminders</p>
                </div>
                <div className="flex bg-[#f1f5f9] dark:bg-[#2a3258] p-1 rounded-xl border border-[#e2e8f0] dark:border-[#36407a] gap-1">
                    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!useOutlookCalendar ? 'bg-white dark:bg-[#6366f1] text-[#2447d7] dark:text-white shadow-sm' : 'text-[#718096] dark:text-[#94abda]'}`} onClick={() => setUseOutlookCalendar(false)}>Local Tasks</button>
                    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${useOutlookCalendar ? 'bg-white dark:bg-[#6366f1] text-[#2447d7] dark:text-white shadow-sm' : 'text-[#718096] dark:text-[#94abda]'}`} onClick={() => setUseOutlookCalendar(true)}>Outlook Calendar</button>
                </div>
            </div>

            <div className="grid grid-cols-[340px_1fr] gap-6 lg:grid-cols-1 overflow-hidden">
                <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Total', value: stats.total, color: 'from-[#6366f1] to-[#4f46e5]' },
                            { label: 'Pending', value: stats.pending, color: 'from-[#f59e0b] to-[#d97706]' },
                            { label: 'Hot Leads', value: stats.urgent, color: 'from-[#ff4d4d] to-[#f70000]' },
                            { label: 'Done', value: stats.completed, color: 'from-[#10b981] to-[#059669]' }
                        ].map((kpi, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-1.5 relative overflow-hidden group hover:scale-[1.02] duration-300 ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${kpi.color}`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{kpi.label}</span>
                                <span className={`text-[22px] font-black leading-none bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`}>{kpi.value}</span>
                            </div>
                        ))}
                    </div>
                    {renderCalendar()}
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                         <h4 className="text-[11px] font-bold uppercase tracking-wider mb-3 text-[#94a3b8]">Selected: {selectedDate}</h4>
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xl font-black">{filteredTasks.filter(t => t.date === selectedDate).length}</span>
                                <span className="text-[9px] font-bold uppercase text-[#94a3b8]">Items</span>
                            </div>
                            <button className="bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#2447d7]/20 hover:scale-105 transition-all flex items-center gap-2" onClick={() => { setIsAddingTask(true); setEditingTask(null); }}>
                                <IconPlus size={10} /> New Task
                            </button>
                         </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 overflow-hidden">
                    <div className={`p-2 rounded-2xl border flex items-center justify-between gap-3 ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border flex-1 transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f8fafc] border-[#edf2f7]'}`}>
                            <IconSearch size={14} />
                            <input type="text" className="bg-transparent border-none outline-none text-[12px] font-medium w-full placeholder:text-[#94a3b8]" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex p-0.5 rounded-xl border bg-[#f1f5f9] dark:bg-[#2a3258] border-[#e2e8f0] dark:border-[#36407a]">
                            {['All', 'Personal', 'Team'].map(type => (
                                <button key={type} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${assignmentFilter === type ? (isDark ? 'bg-[#6366f1] text-white shadow-md' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda]' : 'text-[#718096]')}`} onClick={() => setAssignmentFilter(type)}>{type}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col gap-3">
                         <div className="flex items-center gap-4 px-1">
                            {['All', 'Tasks', 'Promotions'].map(cat => (
                                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`relative py-1 text-[11px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? (isDark ? 'text-[#818cf8]' : 'text-[#2447d7]') : (isDark ? 'text-[#4b5563]' : 'text-[#94a3b8]')}`}>{cat}{categoryFilter === cat && <div className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isDark ? 'bg-[#818cf8]' : 'bg-[#2447d7]'}`} />}</button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-6">
                            <div className="flex flex-col gap-3">
                                <h4 className="text-[10px] font-black uppercase tracking-wider pb-1.5 border-b dark:border-[#2c3568] border-[#edf2f7] flex items-center justify-between" style={{ color: isDark ? '#8ea0d4' : '#718096' }}>
                                    OPERATIONS
                                    <span className="text-[9px] opacity-50 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">{filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).length}</span>
                                </h4>
                                {filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).length > 0 ? (
                                    filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).map(task => {
                                        const typeStyles = {
                                            'Call': { bg: 'bg-[#f0f7ff]', border: 'border-l-[#3b82f6]', iconBg: 'bg-[#3b82f6]', iconText: 'text-white' },
                                            'Document': { bg: 'bg-[#fff7ed]', border: 'border-l-[#f97316]', iconBg: 'bg-[#f97316]', iconText: 'text-white' },
                                            'Meeting': { bg: 'bg-[#f0fdf4]', border: 'border-l-[#22c55e]', iconBg: 'bg-[#22c55e]', iconText: 'text-white' },
                                            'Default': { bg: 'bg-[#f8fafc]', border: 'border-l-[#64748b]', iconBg: 'bg-[#64748b]', iconText: 'text-white' }
                                        };
                                        const style = typeStyles[task.type] || typeStyles.Default;
                                        
                                        return (
                                            <div key={task.id} className={`p-4 rounded-2xl border border-l-[6px] transition-all duration-300 group hover:shadow-md hover:scale-[1.01] ${isDark ? 'bg-[#1e2347] border-[#2c3568] border-l-[#6366f1]' : `${style.bg} border-[#e2e8f0] ${style.border}`}`}>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isDark ? 'bg-[#2a3258] text-[#818cf8]' : `${style.iconBg} ${style.iconText}`}`}>
                                                                {task.type === 'Call' ? <IconPhone size={14} /> : task.type === 'Document' ? <IconDoc size={14} /> : <IconPhone size={14} />}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <h3 className={`text-[12px] font-black leading-tight tracking-tight truncate ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>{task.title}</h3>
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{task.time || '10:00 AM'}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleEditClick(task)} className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:bg-[#36407a]' : 'bg-white border-[#e2e8f0] text-[#718096] hover:bg-slate-50'}`}>
                                                            <IconEdit size={12} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className={`flex flex-col gap-2.5 pt-3 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#475569] dark:text-[#94a3b8]">
                                                            <IconUser size={12} />
                                                            <span className="truncate">{task.lead || 'Administrative Task'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-2 mt-1">
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${Array.isArray(task.assignedTo) && task.assignedTo.includes('Self') ? (isDark ? 'bg-[#2d3a8c] text-[#818cf8]' : 'bg-[#eff6ff] text-[#2563eb]') : 'bg-slate-100 text-slate-600'}`}>
                                                                {Array.isArray(task.assignedTo) && task.assignedTo.includes('Self') ? 'PERSONAL' : 'TEAM TASK'}
                                                            </span>
                                                            <StatusSelector status={task.status} onStatusChange={(newStatus) => updateTaskStatus(task.id, newStatus)} isDark={isDark} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? 'border-[#2c3568] text-[#4b5563]' : 'border-slate-100 text-[#94a3b8]'}`}>
                                        <p className="text-[11px] font-black uppercase tracking-widest">No operations scheduled</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <h4 className="text-[10px] font-black uppercase tracking-wider pb-1.5 border-b dark:border-[#2c3568] border-[#edf2f7] flex items-center justify-between" style={{ color: isDark ? '#8ea0d4' : '#718096' }}>
                                    STRATEGIC PROMOS
                                    <span className="text-[9px] opacity-50 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">{filteredTasks.filter(t => t.isPromotion && t.date === selectedDate).length}</span>
                                </h4>
                                {filteredTasks.filter(t => t.isPromotion && t.date === selectedDate).length > 0 ? (
                                    filteredTasks.filter(t => t.isPromotion && t.date === selectedDate).map(p => {
                                        const hue = ((p.title.length * 37) % 360);
                                        return (
                                            <div key={p.id} className="p-4 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden" 
                                                 style={{ 
                                                     background: isDark ? `hsla(${hue}, 40%, 15%, 0.3)` : `hsla(${hue}, 70%, 97%, 1)`,
                                                     borderColor: isDark ? `hsla(${hue}, 40%, 30%, 0.4)` : `hsla(${hue}, 70%, 90%, 1)`,
                                                 }}>
                                                <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-125`} style={{ color: isDark ? `hsla(${hue}, 70%, 70%, 1)` : `hsla(${hue}, 70%, 40%, 1)` }}>
                                                    <IconDoc size={64} />
                                                </div>
                                                <div className="flex flex-col gap-2 relative z-10">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className={`text-[12px] font-black leading-tight uppercase tracking-tight ${isDark ? 'text-white' : `text-[hsla(${hue}, 70%, 30%, 1)]`}`}>
                                                            {p.title.replace('PROMO: ', '')}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-lg text-[8px] font-black text-white uppercase tracking-widest shadow-sm" style={{ background: isDark ? `hsla(${hue}, 50%, 40%, 1)` : `hsla(${hue}, 70%, 50%, 1)` }}>
                                                            PROMO
                                                        </span>
                                                    </div>
                                                    <p className={`text-[11px] font-medium leading-relaxed line-clamp-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{p.lead}</p>
                                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                                                        <span className="text-[9px] font-bold opacity-60">Expires: {p.endDate || 'N/A'}</span>
                                                        <button className="text-[9px] font-black uppercase tracking-widest hover:underline px-2 py-1 rounded-md bg-white/50 dark:bg-black/20">Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? 'border-[#2c3568] text-[#4b5563]' : 'border-slate-100 text-[#94a3b8]'}`}>
                                        <p className="text-[11px] font-black uppercase tracking-widest">No active promotions</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TaskModal isOpen={isAddingTask} onClose={() => { setIsAddingTask(false); setEditingTask(null); }} onSave={handleSaveTask} editingTask={editingTask} />
        </div>
    );
};

export default TasksFollowups;
