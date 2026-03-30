import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';
import TaskModal from '../../../components/modals/TaskModal';

const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const IconEye = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const IconDownload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconPhone = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const IconUser = ({ size = 12 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconDoc = ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);

const IconMeeting = ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconEdit = ({ size = 12 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconPlus = ({ size = 10 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width={size} height={size}>
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconSearch = ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width={size} height={size} className="text-slate-400">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
};

const PromoPreviewModal = ({ file, onClose, isDark }) => {
    if (!file || !file.fileData) return null;
    const isImage = file.fileData.startsWith('data:image/');
    const isPdf = file.fileData.startsWith('data:application/pdf');
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    height: '90vh',
                    background: isDark ? '#1e2347' : '#ffffff',
                    border: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}`,
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center shrink-0" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}`, background: isDark ? '#141829' : '#f8fafc' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: isDark ? '#242b58' : '#ffffff', color: isDark ? '#8ea0d4' : '#2447d7', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.1)' }}>
                            <IconDoc size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold truncate" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>{file.fileName}</span>
                            <span className="text-[11px] font-semibold" style={{ color: isDark ? '#546298' : '#a0aec0' }}>Promotion Document Preview</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={file.fileData}
                            download={file.fileName}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all no-underline shadow-md"
                            style={{ background: '#2447d7', color: '#ffffff' }}
                        >
                            <IconDownload /> Download File
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg ml-1 transition-colors hover:bg-red-500 hover:text-white"
                            style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fff1f2', color: isDark ? '#f87171' : '#dc2626' }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
                {/* Body */}
                <div className="flex-1 overflow-auto flex items-center justify-center relative p-6" style={{ background: isDark ? '#0f1222' : '#f1f5f9' }}>
                    {isImage ? (
                        <img src={file.fileData} alt={file.fileName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }} />
                    ) : isPdf ? (
                        <iframe src={file.fileData} title="PDF Preview" style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }} />
                    ) : (
                        <div className="text-center p-10 rounded-2xl max-w-sm" style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>
                            <p className="text-sm mb-5" style={{ color: isDark ? '#8ea0d4' : '#718096' }}>Preview not available for this format. Please download.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
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
                                    const u = id === 'Self' ? user : users.find(usr => usr.id?.toString() === id?.toString() || usr.name === id);
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

const SuperAdminTasks = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {
    const { promotions } = usePromotions();
    const { users } = useUsers();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const user = JSON.parse(localStorage.getItem('user') || '{}');

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

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [categoryFilter, setCategoryFilter] = useState('All'); // All, Tasks, Promotions
    const [roleFilter, setRoleFilter] = useState('All'); // All, Tele Agent, Team Leader, Accounts Manager, Super Admin
    const [calendarMode, setCalendarMode] = useState('Local'); // Local or Outlook
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [highlightTaskId, setHighlightTaskId] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const taskRefs = useRef({});

    // Outlook Sync Logic
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(() => {
        const acc = getAccount();
        if (acc) {
            setOutlookAccount(acc);
            fetchOutlookEvents();
        }
    }, [calendarMode]);

    const fetchOutlookEvents = async () => {
        setLoadingEvents(true);
        try {
            const evts = await getCalendarEvents();
            setOutlookEvents(evts || []);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoadingEvents(false);
        }
    };

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

    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleSaveTask = (taskToSave) => {
        if (editingTask) {
            setTasks(prev => prev.map(t => t.id === editingTask.id ? taskToSave : t));
        } else {
            setTasks(prev => [...prev, taskToSave]);
        }
        setIsAddingTask(false);
        setEditingTask(null);
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsAddingTask(true);
    };

    const filteredTasks = tasks.filter(task => {
        const titleMatch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const leadMatch = (task.lead || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = titleMatch || leadMatch;

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

        // Role-based matching
        let matchesRole = true;
        if (roleFilter !== 'All') {
            const assignedIds = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
            matchesRole = assignedIds.some(id => {
                if (id === 'Self') return roleFilter.toLowerCase() === 'super admin';
                const assignedUser = users.find(u => u.id?.toString() === id?.toString() || u.name === id);
                return assignedUser?.role?.toLowerCase() === roleFilter?.toLowerCase();
            });
        }

        return matchesSearch && matchesStatus && matchesAssignment && matchesRole;
    });

    const dayTasks = filteredTasks.filter(t => t.date === selectedDate);
    const dayPromos = memoizedPromotions.filter(p => {
        const start = new Date(p.date);
        const end = new Date(p.endDate);
        const current = new Date(selectedDate);
        return current >= start && current <= end;
    });

    const stats = {
        total: dayTasks.length,
        pending: dayTasks.filter(t => t.status !== 'Completed').length,
        completed: dayTasks.filter(t => t.status === 'Completed').length,
        hot: dayTasks.filter(t => t.priority === 'High' || t.leadStatus === 'Hot').length
    };

    const todayDate = new Date();
    const [calYear, setCalYear] = useState(todayDate.getFullYear());
    const [calMonth, setCalMonth] = useState(todayDate.getMonth());
    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

    const renderCalendar = () => {
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStr = String(calMonth + 1).padStart(2, '0');
        const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const cells = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

        return (
            <div className={`p-5 rounded-[24px] border border-[#edf2f7] dark:border-[#2c3568] flex flex-col gap-5 transition-all ${isDark ? 'bg-[#1e2347] shadow-lg' : 'bg-white shadow-xl shadow-[#2447d7]/5'}`}>
                <div className="flex justify-center mb-2">
                    <div className={`inline-flex p-1 rounded-xl border ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-slate-100 shadow-sm'}`}>
                        {['Local', 'Outlook'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setCalendarMode(mode)}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${calendarMode === mode
                                    ? 'bg-[#2447d7] text-white shadow-lg shadow-[#2447d7]/30'
                                    : (isDark ? 'text-[#94abda] hover:text-white' : 'text-slate-400 hover:text-slate-600')
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 mb-2">
                    <button onClick={prevMonth} className={`text-slate-400 hover:text-[#2447d7] transition-all`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#e4ecff]' : 'bg-white border-[#edf2f7] text-[#1e293b]'}`}>
                            {MONTH_NAMES[calMonth]}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                        <div className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-[#2a3258] border-[#36407a] text-[#e4ecff]' : 'bg-white border-[#edf2f7] text-[#1e293b]'}`}>
                            {calYear}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                    </div>
                    <button onClick={nextMonth} className={`text-slate-400 hover:text-[#2447d7] transition-all`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, idx) => (
                        <div key={idx} className={`text-center text-[8px] font-black tracking-widest pb-3 ${isDark ? 'text-[#4b5563]' : 'text-[#cbd5e0]'}`}>{d}</div>
                    ))}
                    {cells.map((day, idx) => {
                        if (day === null) return <div key={`blank-${idx}`} />;
                        const dateStr = `${calYear}-${monthStr}-${String(day).padStart(2, '0')}`;
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === todayStr;
                        const dayTasksForDots = tasks.filter(t => t.date === dateStr);

                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 group
                                    ${isSelected
                                        ? 'bg-[#2447d7] border-[#2447d7] shadow-[0_8px_20px_rgba(36,71,215,0.4)] scale-105 z-10'
                                        : (isToday
                                            ? (isDark ? 'bg-[#6366f1]/20 border-[#6366f1]/50' : 'bg-[#eef2ff] border-[#6366f1]/40')
                                            : (dayTasksForDots.length > 0 
                                                ? (isDark ? 'bg-[#2a3258] border-[#36407a] hover:bg-[#343e6a]' : 'bg-[#f0f9ff] border-[#bae6fd] hover:bg-[#e0f2fe]')
                                                : (isDark ? 'bg-transparent border-[#2c3568]/50 hover:bg-[#2a3258]' : 'bg-white border-[#edf2f7] hover:bg-slate-50')))
                                    }
                                `}
                            >
                                <span className={`text-[12px] font-black ${isSelected ? 'text-white' : (isToday ? (isDark ? 'text-[#818cf8]' : 'text-[#2447d7]') : (dayTasksForDots.length > 0 ? (isDark ? 'text-[#e4ecff]' : 'text-[#0369a1]') : (isDark ? 'text-[#4b5563]' : 'text-[#94a3b8]')))}`}>
                                    {day}
                                </span>
                                <div className="absolute bottom-1.5 flex gap-0.5 justify-center w-full px-1 flex-wrap">
                                    {calendarMode === 'Local' && (() => {
                                        const types = [];
                                        if (dayTasksForDots.some(t => t.type === 'Call')) types.push({ color: '#22c55e', type: 'Call' });
                                        if (dayTasksForDots.some(t => t.type === 'Meeting')) types.push({ color: '#2447d7', type: 'Meeting' });
                                        if (dayTasksForDots.some(t => t.type === 'Document')) types.push({ color: '#f59e0b', type: 'Document' });
                                        return types.slice(0, 4).map((t, idx) => (
                                            <div key={idx} className={`w-1.5 h-1.5 rounded-full border-[0.5px] ${isSelected ? 'border-white/50' : 'border-transparent'}`} style={{ backgroundColor: isSelected ? '#ffffff' : t.color }} />
                                        ));
                                    })()}
                                    {calendarMode === 'Outlook' && outlookEvents.some(evt => {
                                        const evtDate = new Date(evt.start.dateTime).toISOString().split('T')[0];
                                        return evtDate === dateStr;
                                    }) && (
                                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#10b981]'}`} />
                                        )}
                                </div>
                                {dayTasksForDots.length > 0 && !isSelected && (
                                    <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#6366f1]/60' : 'bg-[#2447d7]/40'}`} />
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
            <div className="grid grid-cols-[340px_1fr] gap-6 lg:grid-cols-1 overflow-hidden h-full">
                <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                        {[
                            { label: 'Today Total', value: stats.total, color: 'from-[#6366f1] to-[#4f46e5]' },
                            { label: 'Pending', value: stats.pending, color: 'from-[#f59e0b] to-[#d97706]' },
                            { label: 'Hot Clients', value: stats.hot, color: 'from-[#ef4444] to-[#dc2626]' },
                            { label: 'Done', value: stats.completed, color: 'from-[#10b981] to-[#059669]' }
                        ].map((kpi, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-1.5 transition-all relative overflow-hidden group hover:scale-[1.02] duration-300 ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-[0_4px_12px_rgba(0,0,0,0.03)]'}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${kpi.color}`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-[#94abda]' : 'text-[#64748b]'}`}>{kpi.label}</span>
                                <span className={`text-[22px] font-black leading-none bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`}>{kpi.value}</span>
                            </div>
                        ))}
                    </div>
                    {renderCalendar()}
                    <div className={`p-4 rounded-2xl border shrink-0 ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xl font-black">{dayTasks.length}</span>
                                <span className="text-[9px] font-bold uppercase text-[#94a3b8]">Tasks on {selectedDate}</span>
                            </div>
                            <button
                                className="bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#2447d7]/20 hover:scale-105 transition-all"
                                onClick={() => { setIsAddingTask(true); setEditingTask(null); }}
                            >
                                <IconPlus size={10} /> New Task
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 overflow-hidden h-full">
                    <div className={`p-2 rounded-2xl border flex items-center justify-between gap-3 shrink-0 ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border flex-1 transition-all ${isDark ? 'bg-[#2a3258] border-[#36407a]' : 'bg-[#f8fafc] border-[#edf2f7]'}`}>
                            <IconSearch size={14} />
                            <input
                                type="text"
                                className="bg-transparent border-none outline-none text-[12px] font-medium w-full placeholder:text-[#94abda]"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex p-0.5 rounded-xl border bg-[#f1f5f9] dark:bg-[#2a3258] border-[#e2e8f0] dark:border-[#36407a] shrink-0">
                            {['All', 'Super Admin', 'Team Leader', 'Accounts Manager', 'Tele Agent'].map(role => {
                                const active = roleFilter === role;
                                const displayRole = role === 'Tele Agent' ? 'Agents' : role === 'Accounts Manager' ? 'Managers' : role === 'Team Leader' ? 'Leaders' : role;
                                return (
                                    <button
                                        key={role}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${active 
                                            ? (isDark ? 'bg-[#2447d7] text-white shadow-lg' : 'bg-white text-[#2447d7] shadow-sm ring-1 ring-[#2447d7]/10') 
                                            : (isDark ? 'text-[#94abda] hover:bg-white/5' : 'text-[#718096] hover:bg-slate-50')}`}
                                        onClick={() => setRoleFilter(role)}
                                    >
                                        {displayRole}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                                <h4 className="text-[10px] font-black uppercase tracking-[2px] pb-2 border-b border-[#f1f5f9] dark:border-[#2c3568]" style={{ color: isDark ? '#8ea0d4' : '#64748b' }}>Operations</h4>
                                {dayTasks.length > 0 ? (
                                    dayTasks.map(task => (
                                        <TaskCard 
                                            key={task.id} 
                                            task={task} 
                                            user={user} 
                                            users={users} 
                                            isDark={isDark} 
                                            highlightTaskId={highlightTaskId} 
                                            handleEditClick={handleEditClick} 
                                            updateTaskStatus={updateTaskStatus} 
                                        />
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl" style={{ borderColor: isDark ? '#2c3568' : '#e2e8f0' }}>
                                        <IconDoc size={24} />
                                        <p className="mt-2 text-[11px] text-slate-400 font-bold italic">No operations today</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                                <h4 className="text-[10px] font-black uppercase tracking-[2px] pb-2 border-b border-[#f1f5f9] dark:border-[#2c3568]" style={{ color: isDark ? '#8ea0d4' : '#64748b' }}>Promotions</h4>
                                {dayPromos.length > 0 ? (
                                    dayPromos.map(p => {
                                        const hue = stringToColor(p.lenderName || p.title);
                                        return (
                                            <div key={p.id} className="p-4 rounded-3xl flex flex-col gap-3 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer group" style={{ background: isDark ? `hsla(${hue}, 80%, 65%, 0.08)` : `hsla(${hue}, 80%, 45%, 0.04)`, border: `1px solid ${isDark ? `hsla(${hue}, 80%, 65%, 0.15)` : `hsla(${hue}, 80%, 45%, 0.12)}`}` }}>
                                                <div className="h-1.5 w-full rounded-full transition-all group-hover:h-2" style={{ background: `linear-gradient(90deg, hsl(${hue}, 80%, 60%), hsl(${(hue + 60) % 360}, 80%, 60%))` }}></div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[14px] font-black leading-tight" style={{ color: isDark ? '#e4ecff' : '#1e3a8a' }}>{p.title.replace('PROMO: ', '')}</span>
                                                        <span className="text-white text-[9px] font-black px-3 py-1 rounded-xl uppercase tracking-wider" style={{ background: `hsl(${hue}, 80%, 55%)` }}>Promo</span>
                                                    </div>
                                                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-current/10">
                                                            <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color: isDark ? '#8ea0d4' : '#3b82f6' }}>
                                                                <IconMeeting size={12} /> {p.time}
                                                            </div>
                                                            <StatusSelector 
                                                                status={p.status} 
                                                                onStatusChange={(newStatus) => updateTaskStatus(p.id, newStatus)} 
                                                                isDark={isDark} 
                                                                isPromotion={true} 
                                                            />
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
                                                    {p.fileName && p.fileData && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setPreviewFile({ fileName: p.fileName, fileData: p.fileData }); }}
                                                            className="flex items-center gap-2 mt-2.5 p-2 rounded-2xl bg-white/50 dark:bg-black/20 border border-current/20 hover:bg-white dark:hover:bg-white/10 transition-all"
                                                            style={{ color: `hsl(${hue}, 80%, 50%)` }}
                                                        >
                                                            <IconEye />
                                                            <span className="text-[10px] font-black uppercase tracking-wider">View Document</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl" style={{ borderColor: isDark ? '#2c3568' : '#e2e8f0' }}>
                                        <p className="text-[11px] text-slate-400 font-bold italic">No promotions today</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isAddingTask && (
                <TaskModal 
                    isOpen={isAddingTask} 
                    onClose={() => setIsAddingTask(false)} 
                    onSave={handleSaveTask} 
                    task={editingTask} 
                    isSuperAdmin={true} 
                />
            )}

            {previewFile && <PromoPreviewModal file={previewFile} onClose={() => setPreviewFile(null)} isDark={isDark} />}
        </div>
    );
};

export default SuperAdminTasks;
