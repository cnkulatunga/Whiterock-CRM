import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';
import { useLeads } from '../../../context/LeadsContext';
import TaskModal from '../../../components/modals/TaskModal';
import { DocumentPreviewModal } from '../../shared/promotions/LenderPromotionsView';

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

const IconMail = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);

const IconBriefcase = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const IconActivity = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const StatusSelector = ({ status, onStatusChange, isDark, isPromotion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef(null);
    const options = isPromotion ? ['Active', 'Expired', 'Ended'] : ['Pending', 'In Progress', 'Completed'];

    const getStatusStyle = (s) => {
        if (s === 'Completed' || s === 'Active') return { bg: isDark ? 'bg-emerald-500/15' : 'bg-[#ecfdf5]', text: isDark ? 'text-emerald-400' : 'text-[#059669]', border: isDark ? 'border-emerald-500/20' : 'border-[#d1fae5]' };
        if (s === 'In Progress') return { bg: isDark ? 'bg-blue-500/15' : 'bg-[#ebf5ff]', text: isDark ? 'text-blue-400' : 'text-[#2447d7]', border: isDark ? 'border-blue-500/20' : 'border-[#d9ebff]' };
        return { bg: isDark ? 'bg-amber-500/15' : 'bg-[#fff7ed]', text: isDark ? 'text-amber-400' : 'text-[#ea580c]', border: isDark ? 'border-amber-500/20' : 'border-[#ffedd5]' };
    };
    const currentStyle = getStatusStyle(status);
    const handleOpen = (e) => {
        e.stopPropagation();
        if (!isOpen && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setDropPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
        }
        setIsOpen(o => !o);
    };
    return (
        <div className="relative shrink-0">
            <button ref={btnRef} onClick={handleOpen} className={`p-[4px_12px] rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shadow-sm flex items-center gap-2 ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}>
                {status}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {isOpen && ReactDOM.createPortal(
                <>
                    <div className="fixed inset-0 z-[199]" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                    <div className="fixed z-[200] w-36 rounded-xl border shadow-2xl overflow-hidden animate-fadeIn" style={{ top: dropPos.top, right: dropPos.right, background: isDark ? '#1e2347' : '#ffffff', borderColor: isDark ? '#2c3568' : '#e2e8f0' }}>
                        {options.map(opt => {
                            const isActive = opt === status;
                            return (
                                <button key={opt} onClick={(e) => { e.stopPropagation(); onStatusChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-[#2447d7] text-white' : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')}`} style={{ color: isActive ? 'white' : (isDark ? '#e4ecff' : '#1e293b') }}>{opt}</button>
                            );
                        })}
                    </div>
                </>,
                document.body
            )}
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const taskRefs = useRef({});

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

    const memoizedOutlookEvents = React.useMemo(() => outlookEvents.map(evt => ({
        id: evt.id,
        title: evt.subject,
        lead: evt.location?.displayName || 'Outlook Event',
        date: evt.start?.dateTime?.split('T')[0],
        time: (evt.start?.dateTime?.split('T')[1] || '').substring(0, 5),
        type: 'Meeting',
        status: 'Outlook',
        isOutlook: true,
        webLink: evt.webLink,
        assignedTo: 'Self'
    })), [outlookEvents]);

    const tasks = React.useMemo(() => {
        if (useOutlookCalendar) {
            return memoizedOutlookEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return [...initialTasks, ...memoizedPromotions].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [initialTasks, memoizedPromotions, memoizedOutlookEvents, useOutlookCalendar]);

    // Handle auto-open if coming from dashboard with a specific date
    useEffect(() => {
        if (initialDate && !editingTask) {
            setSelectedDate(initialDate);
            setIsAddingTask(true);
        }
    }, [initialDate]);



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

    const handleDeleteTask = (id) => {
        setTasks(initialTasks.filter(t => t.id !== id));
    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(initialTasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateLeadStatus = (id, newLeadStatus) => {
        setTasks(initialTasks.map(t => t.id === id ? { ...t, leadStatus: newLeadStatus } : t));
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.lead && task.lead.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filter === 'All' || task.status === filter;
        
        let matchesAssignment = true;
        if (assignmentFilter === 'Personal') {
            matchesAssignment = Array.isArray(task.assignedTo) ? task.assignedTo.includes('Self') || task.assignedTo.includes(user.id?.toString()) : (task.assignedTo === 'Self' || task.assignedTo?.toString() === user.id?.toString());
        } else if (assignmentFilter === 'Team') {
            matchesAssignment = Array.isArray(task.assignedTo) ? task.assignedTo.some(id => id !== 'Self' && id !== user.id?.toString()) : (task.assignedTo !== 'Self' && task.assignedTo?.toString() !== user.id?.toString());
        }
        
        return matchesSearch && matchesStatus && (task.isPromotion || matchesAssignment);
    });

    const stats = {
        total: filteredTasks.length,
        pending: filteredTasks.filter(t => t.status !== 'Completed' && t.status !== 'Outlook').length,
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
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#1e2347] border-[#2c3568] shadow-lg' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>Calendar</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096]'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="15 18 9 12 15 6"/></svg></button>
                        <span className={`text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{MONTH_NAMES[calMonth].slice(0, 3)} {calYear}</span>
                        <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#718096]'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="9 18 15 12 9 6"/></svg></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className={`text-center text-[9px] font-black tracking-widest pb-3 ${isDark ? 'text-[#4b5563]' : 'text-[#cbd5e0]'}`}>{d}</div>)}
                    {cells.map((day, idx) => {
                        if (day === null) return <div key={`blank-${idx}`} />;
                        const dateStr = `${calYear}-${monthStr}-${String(day).padStart(2, '0')}`;
                        const dayTasks = tasks.filter(t => t.date === dateStr);
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === todayStr;
                        return (
                            <div key={day} onClick={() => setSelectedDate(dateStr)} className={`h-11 rounded-lg border flex flex-col items-center justify-center relative cursor-pointer transition-all ${isToday && !isSelected ? (isDark ? 'bg-[#2a3258] border-[#6366f1]/50' : 'bg-[#f0f4ff] border-[#2447d7]/30') : isSelected ? (isDark ? 'border-[#6366f1] bg-[#312e81]' : 'border-[#2447d7] bg-[#f5f8ff]') : (isDark ? 'border-[#2c3568]' : 'border-[#edf2f7]')} hover:border-[#6366f1]`}>
                                <span className={`text-[13px] font-bold ${isToday ? (isDark ? '#818cf8' : '#2447d7') : (isDark ? '#94abda' : '#718096')}`}>{day}</span>
                                {dayTasks.length > 0 && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6366f1]" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex flex-col h-[calc(100vh-68px)] gap-0 animate-fadeIn font-['Sora',sans-serif] overflow-hidden ${isDark ? 'text-[#e4ecff]' : 'text-[#0f172a]'}`}>

        {/* ── TOP BAR ── */}
        <div className={`flex items-center justify-between px-5 py-3 border-b shrink-0 ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-3">
                {[
                    { label: 'Total', value: stats.total, color: isDark ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-600' },
                    { label: 'Pending', value: stats.pending, color: isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600' },
                    { label: 'Done', value: stats.completed, color: isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600' },
                    { label: 'Urgent', value: stats.urgent, color: isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600' },
                ].map(k => (
                    <div key={k.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black ${k.color}`}>
                        <span className="text-[15px] leading-none">{k.value}</span>
                        <span className="uppercase tracking-widest text-[9px] opacity-70">{k.label}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <div className={`flex p-0.5 rounded-lg border text-[10px] font-black ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-slate-100 border-slate-200'}`}>
                    <button className={`px-3 py-1.5 rounded-md transition-all ${!useOutlookCalendar ? (isDark ? 'bg-[#6366f1] text-white' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda]' : 'text-slate-500')}`} onClick={() => setUseOutlookCalendar(false)}>Local</button>
                    <button className={`px-3 py-1.5 rounded-md transition-all ${useOutlookCalendar ? (isDark ? 'bg-[#6366f1] text-white' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda]' : 'text-slate-500')}`} onClick={() => setUseOutlookCalendar(true)}>Outlook</button>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-[220px] ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-slate-50 border-slate-200'}`}>
                    <IconSearch size={13} className={isDark ? 'text-[#546298]' : 'text-slate-400'} />
                    <input type="text" className="bg-transparent border-none outline-none text-[12px] font-medium w-full placeholder:text-slate-400" placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className={`flex p-0.5 rounded-lg border text-[10px] font-black ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-slate-100 border-slate-200'}`}>
                    {['All', 'Personal', 'Team'].map(t => (
                        <button key={t} className={`px-3 py-1.5 rounded-md transition-all ${assignmentFilter === t ? (isDark ? 'bg-[#6366f1] text-white' : 'bg-white text-[#2447d7] shadow-sm') : (isDark ? 'text-[#94abda]' : 'text-slate-500')}`} onClick={() => setAssignmentFilter(t)}>{t}</button>
                    ))}
                </div>
                {!useOutlookCalendar && (
                    <button className="flex items-center gap-1.5 bg-[#2447d7] text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] transition-all" onClick={() => { setIsAddingTask(true); setEditingTask(null); }}>
                        <IconPlus size={12} /> New Task
                    </button>
                )}
                {useOutlookCalendar && outlookAccount && (
                    <div className="flex items-center gap-2">
                        <a href="https://outlook.office.com/calendar/view/month" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-blue-400 hover:bg-[#36407a]' : 'bg-blue-50 border-blue-100 text-[#2447d7] hover:bg-blue-100'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Browse Calendar
                        </a>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{outlookAccount.username}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* ── MAIN 3-PANEL LAYOUT ── */}
        <div className="flex flex-1 min-h-0">

            {/* LEFT: Calendar panel */}
            <div className={`w-[380px] shrink-0 flex flex-col border-r overflow-y-hidden ${isDark ? 'bg-[#151932] border-white/5' : 'bg-[#f4f7ff] border-[#e2e8f0]'}`}>
                <div className="p-4">
                    {renderCalendar()}
                </div>
                <div className={`mx-4 mb-4 p-3 rounded-xl border ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{selectedDate}</div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-[22px] font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).length}</span>
                                <span className={`text-[9px] font-bold uppercase ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>tasks</span>
                            </div>
                        </div>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#2447d7]/20 text-[#818cf8]' : 'bg-[#2447d7]/10 text-[#2447d7]'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER: Tasks list */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className={`px-4 py-2.5 border-b shrink-0 flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>
                        OPERATIONS · {filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).length} for {selectedDate}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {useOutlookCalendar && !outlookAccount ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#2a3258] text-[#818cf8]' : 'bg-blue-50 text-blue-600'}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </div>
                            <div className="max-w-[280px]">
                                <h3 className={`text-[15px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Connect Outlook</h3>
                                <p className={`text-[12px] font-medium leading-relaxed ${isDark ? 'text-[#94abda]' : 'text-slate-500'}`}>SignIn with your Outlook account to view and sync your calendar events directly.</p>
                            </div>
                            <button onClick={handleOutlookLogin} className="bg-[#2447d7] text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] transition-all">
                                Connect Now
                            </button>
                        </div>
                    ) : filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).length > 0 ? (
                        filteredTasks.filter(t => !t.isPromotion && t.date === selectedDate).map(task => {
                            const typeStyles = {
                                'Call':     { border: 'border-l-blue-500',   iconBg: 'bg-blue-500',   iconText: 'text-white' },
                                'Document': { border: 'border-l-orange-500', iconBg: 'bg-orange-500', iconText: 'text-white' },
                                'Meeting':  { border: 'border-l-green-500',  iconBg: 'bg-green-500',  iconText: 'text-white' },
                                'Default':  { border: 'border-l-slate-400',  iconBg: 'bg-slate-400',  iconText: 'text-white' },
                            };
                            const style = typeStyles[task.type] || typeStyles.Default;
                            const leadObj = leads.find(l => (l.name || l.clientName) === task.lead);
                            const email = leadObj?.email || task.leadEmail || '—';
                            const phone = leadObj?.phone || task.leadPhone || '—';
                            const business = leadObj?.businessName || 'Not Specified';

                            return (
                                <div key={task.id} className={`rounded-xl border-l-[3px] border transition-all hover:shadow-sm ${isDark ? `bg-[#1e2347] border-white/5 ${style.border}` : `bg-white border-slate-100 ${style.border}`}`}>
                                    <div className="flex items-start gap-3 px-3 pt-3 pb-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isDark ? 'bg-[#2a3258] text-[#818cf8]' : `${style.iconBg} ${style.iconText}`}`}>
                                            {task.type === 'Call' ? <IconPhone size={13} /> : task.type === 'Document' ? <IconDoc size={13} /> : <IconMeeting size={13} />}
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className={`text-[13px] font-black leading-tight break-words min-w-0 flex-1 ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`}>{task.title}</span>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {!task.isPromotion && !task.isOutlook && (
                                                        <select value={task.leadStatus || 'Warm'} onChange={e => { e.stopPropagation(); updateLeadStatus(task.id, e.target.value); }} onClick={e => e.stopPropagation()} className={`text-[9px] font-black px-2 py-1 rounded-full border outline-none cursor-pointer transition-colors ${(task.leadStatus || 'Warm') === 'Hot' ? (isDark ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100') : (task.leadStatus || 'Warm') === 'Cool' ? (isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100') : (isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100')}`}><option value="Hot">🔥 Hot</option><option value="Warm">☀️ Warm</option><option value="Cool">❄️ Cool</option></select>
                                                    )}
                                                    {!task.isOutlook && <StatusSelector status={task.status} onStatusChange={ns => updateTaskStatus(task.id, ns)} isDark={isDark} />}
                                                    {task.isOutlook && <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border ${isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>Outlook Event</span>}
                                                    {canManageTask(task, user) && !task.isOutlook && (
                                                        <>
                                                            <button onClick={() => handleEditClick(task)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'text-[#546298] hover:text-[#94abda] hover:bg-white/5' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}><IconEdit size={11} /></button>
                                                            <button onClick={() => handleDeleteTask(task.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'text-[#546298] hover:text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}><IconTrash size={11} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className={`text-[9px] font-bold ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{task.date} · {task.time}</span>
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${isDark ? 'bg-white/5 text-white/40' : 'bg-slate-100 text-slate-400'}`}>{task.type || 'Task'}</span>
                                                {task.reminder && task.reminder !== 'none' && <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>⏰ {task.reminder}</span>}
                                                {task.assignedTo && <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${Array.isArray(task.assignedTo) && task.assignedTo.includes('Self') ? (isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600') : (isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-50 text-purple-600')}`}>{Array.isArray(task.assignedTo) && task.assignedTo.includes('Self') ? 'Personal' : 'Team'}</span>}
                                                {task.isOutlook && task.webLink && (
                                                    <a href={task.webLink} target="_blank" rel="noopener noreferrer" className={`text-[8px] font-black px-1.5 py-0.5 rounded border transition-colors ${isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-50 text-[#2447d7] border-blue-100 hover:bg-blue-100'}`}>
                                                        Open in Outlook ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 pb-2 pt-1.5 border-t flex items-center gap-3 flex-wrap ${isDark ? 'border-white/5 text-[#546298]' : 'border-slate-50 text-slate-400'}`}>
                                        {task.lead && <span className={`flex items-center gap-1 text-[9px] font-bold ${isDark ? 'text-[#94abda]' : 'text-[#475569]'}`}><IconUser size={9} />{task.lead}</span>}
                                        {business !== 'Not Specified' && <span className="flex items-center gap-1 text-[9px] font-bold"><IconBriefcase size={9} />{business}</span>}
                                        {email !== '—' && <span className="flex items-center gap-1 text-[9px] font-bold truncate max-w-[140px]"><IconMail size={9} />{email}</span>}
                                        {phone !== '—' && <span className="flex items-center gap-1 text-[9px] font-bold"><IconPhone size={9} />{phone}</span>}
                                        {task.message && <span className="text-[9px] italic truncate max-w-[160px]">"{task.message}"</span>}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={`flex flex-col items-center justify-center h-full gap-3 ${isDark ? 'text-[#2c3568]' : 'text-slate-300'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span className="text-[11px] font-black uppercase tracking-widest">No tasks for this day</span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Promotions / Sync Info panel */}
            <div className={`w-[320px] shrink-0 flex flex-col border-l overflow-hidden ${isDark ? 'bg-[#151932] border-white/5' : 'bg-[#f4f7ff] border-[#e2e8f0]'}`}>
                {useOutlookCalendar ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#2a3258] text-[#818cf8]' : 'bg-blue-50 text-blue-600'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </div>
                        <div>
                            <h4 className={`text-[13px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Outlook Synchronized</h4>
                            <p className={`text-[11px] leading-relaxed font-bold opacity-60 ${isDark ? 'text-[#94abda]' : 'text-slate-500'}`}>
                                You are viewing your real-time Microsoft Outlook calendar events. Local CRM tasks and promotions are hidden in this mode.
                            </p>
                        </div>
                        <div className={`mt-4 w-full p-4 rounded-xl border flex flex-col gap-2 ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase opacity-40">Status</span>
                                <span className="text-[10px] font-bold text-emerald-500">Active Sync</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase opacity-40">Account</span>
                                <span className="text-[10px] font-bold truncate max-w-[120px]">{outlookAccount?.username || 'Connected'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={`px-4 py-2.5 border-b shrink-0 flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>PROMOTIONS</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isDark ? 'bg-white/5 text-white/40' : 'bg-slate-200 text-slate-500'}`}>
                                {filteredTasks.filter(t => t.isPromotion && (!t.endDate || t.endDate >= new Date().toISOString().split('T')[0])).length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                            {filteredTasks.filter(t => t.isPromotion && (!t.endDate || t.endDate >= new Date().toISOString().split('T')[0])).length > 0 ? (
                                filteredTasks.filter(t => t.isPromotion && (!t.endDate || t.endDate >= new Date().toISOString().split('T')[0])).map(p => {
                                    const hue = ((p.title.length * 53) % 360);
                                    const accentColor = isDark ? `hsla(${hue}, 70%, 65%, 1)` : `hsla(${hue}, 70%, 45%, 1)`;
                                    return (
                                        <div key={p.id} className={`rounded-xl border-l-[3px] border transition-all hover:shadow-sm ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'}`} style={{ borderLeftColor: accentColor }}>
                                            <div className="flex items-center gap-2.5 px-3 py-3">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: isDark ? `hsla(${hue}, 40%, 25%, 0.5)` : `hsla(${hue}, 70%, 95%, 1)`, color: accentColor }}>
                                                    <IconDoc size={12} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="text-[11px] font-black truncate" style={{ color: accentColor }}>{p.title.replace('PROMO: ', '')}</span>
                                                        <span className={`text-[8px] font-black px-1 py-0.5 rounded ${isDark ? 'bg-white/5 text-white/30' : 'bg-slate-100 text-slate-400'}`}>PROMO</span>
                                                    </div>
                                                    <div className={`text-[9px] font-bold mt-0.5 truncate ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{p.lead}</div>
                                                    <div className={`text-[8px] font-bold mt-0.5 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Expires {p.endDate || 'N/A'}</div>
                                                </div>
                                            </div>
                                            {p.fileData && (
                                                <div className="px-3 pb-2.5">
                                                    <button onClick={() => setPreviewFile({ fileName: p.fileName, fileData: p.fileData })} className={`w-full flex items-center justify-center gap-1.5 text-[9px] font-black px-2 py-1.5 rounded-lg uppercase tracking-wide transition-colors ${isDark ? 'bg-[#2a3258] text-[#818cf8] hover:bg-[#36407a]' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                                                        <IconDoc size={10} /> View Document
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={`flex flex-col items-center justify-center h-full gap-2 ${isDark ? 'text-[#2c3568]' : 'text-slate-300'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">No active promotions</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>

        <TaskModal isOpen={isAddingTask} onClose={() => { setIsAddingTask(false); setEditingTask(null); }} onSave={handleSaveTask} editingTask={editingTask} />
        {previewFile && <DocumentPreviewModal file={previewFile} onClose={() => setPreviewFile(null)} isDark={isDark} />}
    </div>
    );
};

export default TasksFollowups;

