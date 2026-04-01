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

const IconCalendar = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconSearch = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
};

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
                                className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-[#2447d7] text-white' : (isDark ? 'text-[#ea580c] hover:bg-white/5' : 'text-[#ea580c] hover:bg-slate-50')}`}
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

const TaskCard = ({ task, user, users, isDark, highlightTaskId, handleEditClick, updateTaskStatus }) => {
    const [showAllNames, setShowAllNames] = useState(false);
    const assignedIds = Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : ['Self']);

    const getAssignedInfo = () => {
        const fullNames = assignedIds.map(id => id === 'Self' ? 'Self' : users?.find(usr => usr.id?.toString() === id?.toString() || usr.name === id)?.name || 'User');
        const firstId = assignedIds[0];
        const firstUser = firstId === 'Self' ? user : users?.find(usr => usr.id?.toString() === firstId?.toString() || usr.name === firstId);
        
        const rawRole = firstUser?.role || 'Tele Agent';
        const norm = rawRole.toLowerCase().trim();
        
        const roleThemes = {
            'super admin': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', hex: '#2447d7' },
            'super_admin': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', hex: '#2447d7' },
            'team leader': { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500', hex: '#8b5cf6' },
            'team_leader': { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500', hex: '#8b5cf6' },
            'accounts manager': { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500', hex: '#f59e0b' },
            'accounts_manager': { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500', hex: '#f59e0b' },
            'tele agent': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', hex: '#10b981' },
            'tele_agent': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', hex: '#10b981' }
        };

        const roleTheme = roleThemes[norm] || roleThemes['tele agent'];
        const displayRole = norm === 'tele agent' ? 'Tele Agent' : 
                          norm === 'accounts manager' ? 'Accounts Manager' :
                          norm === 'team leader' ? 'Team Leader' :
                          norm === 'super admin' ? 'Super Admin' : rawRole;

        return { 
            fullNames, 
            summary: fullNames.length > 1 ? `${fullNames[0]}, +${fullNames.length - 1}` : fullNames[0], 
            role: displayRole,
            theme: roleTheme
        };
    };

    const info = getAssignedInfo();

    return (
        <div
            className={`p-4 rounded-3xl border transition-all duration-300 group relative ${isDark
                ? 'bg-[#1e2347] border-[#2c3568] hover:border-[#6366f1]/30'
                : 'bg-white border-slate-100 hover:shadow-xl hover:-translate-y-1'
                } ${highlightTaskId === task.id ? 'border-[#2447d7] ring-4 ring-[#2447d7]/10 animate-pulse' : ''}`}
        >
            <div className={`absolute left-0 top-0 w-1.5 h-full ${info.theme.dot}`} />
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' :
                            task.type === 'Document' ? 'bg-[#fff7ed] text-[#ea580c]' :
                                'bg-[#f0fdf4] text-[#16a34a]'
                            }`}>
                            {task.type === 'Call' && <IconPhone size={14} />}
                            {task.type === 'Document' && <IconDoc size={14} />}
                            {(task.type !== 'Call' && task.type !== 'Document' && <IconMeeting size={14} />)}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className={`text-[14px] font-extrabold leading-tight truncate ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'}`} title={task.title}>{task.title}</h3>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#818cf8]' : 'text-[#64748b]'}`}>{task.time}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {canManageTask(task, user) && (
                            <button
                                onClick={() => handleEditClick(task)}
                                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#94abda] hover:text-[#6366f1]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#718096] hover:text-[#2447d7]'}`}
                            >
                                <IconEdit size={12} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2.5 pt-3 border-t border-[#f1f5f9] dark:border-[#2c3568]">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: isDark ? '#e4ecff' : '#1e3a8a' }}>
                                <IconUser size={12} />
                                <span className="truncate">{task.lead || 'Strategic Task'}</span>
                            </div>
                            {task.leadStatus && (
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${task.leadStatus === 'Hot' ? 'bg-[#fff1f2] text-[#f43f5e] border-[#ffe4e6]' :
                                        task.leadStatus === 'Warm' ? 'bg-[#fffbeb] text-[#f59e0b] border-[#fef3c7]' :
                                            'bg-[#f0f9ff] text-[#0ea5e9] border-[#e0f2fe]'
                                    }`}>
                                    {task.leadStatus === 'Hot' ? '🔥' : task.leadStatus === 'Warm' ? '☀️' : '❄️'} {task.leadStatus}
                                </span>
                            )}
                        </div>

                        {(task.leadEmail || task.leadPhone) && (
                            <div className="flex flex-col gap-1.5 pl-5">
                                {task.leadEmail && (
                                    <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: isDark ? '#94abda' : '#64748b' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2-2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        {task.leadEmail}
                                    </div>
                                )}
                                {task.leadPhone && (
                                    <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: isDark ? '#94abda' : '#64748b' }}>
                                        <IconPhone size={10} />
                                        {task.leadPhone}
                                    </div>
                                )}
                            </div>
                        )}

                        {(task.message || task.description || task.notes || task.note) && (
                            <div className={`mt-2 p-3 rounded-xl text-[11px] font-medium leading-relaxed border-l-2 italic ${isDark ? 'bg-white/5 border-[#4f46e5]/40 text-[#8ea0d4]' : 'bg-[#f8fafc] border-[#2447d7]/20 text-[#475569]'
                                }`}>
                                <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                    <IconDoc size={10} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Notes / Message</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {task.message && <div>{task.message}</div>}
                                    {task.description && <div>{task.description}</div>}
                                    {(task.notes || task.note) && <div>{task.notes || task.note}</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f1f5f9] dark:border-[#2c3568]">
                        <div 
                            className="flex items-center gap-3 cursor-pointer group/names min-w-0 flex-1"
                            onClick={() => setShowAllNames(!showAllNames)}
                        >
                            <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                                {assignedIds.slice(0, 3).map((id, idx) => {
                                    const u = id === 'Self' ? user : users?.find(usr => usr.id?.toString() === id?.toString() || usr.name === id);
                                    return (
                                        <div key={idx} className={`w-8 h-8 rounded-lg ring-2 ring-white dark:ring-[#1e2347] flex items-center justify-center text-[10px] font-black shadow-md ${isDark ? 'bg-[#2a3258] text-[#818cf8]' : 'bg-[#f1f5f9] text-[#2447d7]'}`} title={u?.name || 'Self'}>
                                            {u?.initials || u?.name?.charAt(0) || 'U'}
                                        </div>
                                    );
                                })}
                                {(assignedIds.length > 3) && (
                                    <div className={`w-8 h-8 rounded-lg ring-2 ring-white dark:ring-[#1e2347] flex items-center justify-center text-[10px] font-black shadow-md ${isDark ? 'bg-[#141829] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                        +{assignedIds.length - 3}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className={`text-[11px] font-extrabold uppercase leading-none mb-1 transition-colors ${isDark ? 'text-[#e4ecff]' : 'text-[#1e293b]'} group-hover/names:text-[#2447d7]`}>
                                    {showAllNames ? info.fullNames.join(', ') : (info.summary === 'Self' ? user.name : info.summary)}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${info.theme.text}`}>
                                    {info.role}
                                </span>
                            </div>
                        </div>

                        <StatusSelector status={task.status} onStatusChange={(newStatus) => updateTaskStatus(task.id, newStatus)} isDark={isDark} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AMTasksFollowups = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {
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

    // Outlook Sync Logic
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
                                                                {(p.description || p.lead || p.message || p.notes || p.note) && (
                                                <div className={`mt-1 p-3 rounded-xl text-[11px] font-medium leading-relaxed border-l-2 italic ${isDark ? 'bg-white/5 border-current/20 text-[#8ea0d4]' : 'bg-black/5 border-current/20 text-[#475569]'}`}>
                                                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                                        <IconDoc size={10} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Description / Notes</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {p.description && <div>{p.description}</div>}
                                                        {(p.lead && p.lead !== p.description) && <div>{p.lead}</div>}
                                                        {(p.notes || p.note) && <div>{p.notes || p.note}</div>}
                                                        {p.message && <div>{p.message}</div>}
                                                    </div>
                                                </div>
                                            )}
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

export default AMTasksFollowups;
