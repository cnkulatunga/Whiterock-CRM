import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useLeads } from '../../../context/LeadsContext';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';

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

const IconFileDoc = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
);

/* ─── DOCUMENT PREVIEW MODAL ───────────────────── */
const PromoPreviewModal = ({ file, onClose, isDark }) => {
    if (!file || !file.fileData) return null;
    const isImage = file.fileData.startsWith('data:image/');
    const isPdf   = file.fileData.startsWith('data:application/pdf');
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
                            <IconFileDoc />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold truncate" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>{file.fileName}</span>
                            <span className="text-[11px] font-semibold" style={{ color: isDark ? '#546298' : '#a0aec0' }}>Document Preview (Security Sandbox View)</span>
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
                            className="p-2 rounded-lg ml-1 transition-colors"
                            style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fff1f2', color: isDark ? '#f87171' : '#dc2626' }}
                            title="Close Preview"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
                {/* Body */}
                <div
                    className="flex-1 overflow-auto flex items-center justify-center relative p-6"
                    style={{
                        background: isDark ? '#0f1222' : '#f1f5f9',
                        backgroundImage: isDark
                            ? 'linear-gradient(#1e2347 1px, transparent 1px), linear-gradient(90deg, #1e2347 1px, transparent 1px)'
                            : 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                >
                    {isImage ? (
                        <img src={file.fileData} alt={file.fileName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }} />
                    ) : isPdf ? (
                        <iframe src={file.fileData} title="PDF Preview" style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }} />
                    ) : (
                        <div className="text-center p-10 rounded-2xl max-w-sm" style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>
                            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: isDark ? '#141829' : '#f8fafc', color: isDark ? '#8ea0d4' : '#a0aec0' }}>
                                <IconFileDoc />
                            </div>
                            <h3 className="text-base font-bold mb-2" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>Preview Not Available</h3>
                            <p className="text-sm mb-5" style={{ color: isDark ? '#8ea0d4' : '#718096' }}>This file format cannot be previewed in the browser. Please download to view the contents.</p>
                            <a href={file.fileData} download={file.fileName} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold no-underline transition-all" style={{ background: '#2447d7', color: '#ffffff' }}>
                                <IconDownload /> Download
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
};

// Removed INITIAL_TASKS mock data, using props from layout.

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

const TasksFollowups = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { promotions } = usePromotions();
    const { leads } = useLeads();
    
    // Merge promotions as pseudo-tasks
    const memoizedPromotions = React.useMemo(() => promotions.map(p => ({
        id: `promo-${p.id}`,
        title: `PROMO: ${p.lenderName}`,
        lead: p.description,
        date: p.startDate, // Shows on start date
        endDate: p.endDate,
        time: '09:00',
        type: 'Promotion',
        status: 'Active',
        isPromotion: true,
        priority: 'High',
        lenderName: p.lenderName,
        fileName: p.fileName,
        fileData: p.fileData
    })), [promotions]);

    const allTasks = React.useMemo(() => [...(tasks || []), ...memoizedPromotions], [tasks, memoizedPromotions]);

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    
    const [newTask, setNewTask] = useState({
        title: '',
        lead: '',
        leadStatus: 'Cool',
        email: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none',
        message: '',
        assignedTo: JSON.parse(localStorage.getItem('user') || '{}').id?.toString() || ''
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const todayDate = new Date();
    const [calYear, setCalYear] = useState(todayDate.getFullYear());
    const [calMonth, setCalMonth] = useState(todayDate.getMonth());

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
        else setCalMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
        else setCalMonth(m => m + 1);
    };


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
        
        if (isEditingTask && editingTask) {
            const taskToUpdate = {
                ...editingTask,
                ...newTask
            };
            setTasks(tasks.map(t => t.id === taskToUpdate.id ? taskToUpdate : t));
            setIsEditingTask(false);
            setEditingTask(null);
        } else {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const taskToAdd = {
                ...newTask,
                id: Date.now(),
                status: 'Pending',
                createdBy: 'Tele Agent',
                creatorId: currentUser.id
            };
            setTasks([taskToAdd, ...tasks]);
            if (notifyReminderSet) notifyReminderSet(taskToAdd);
        }

        setIsAddingTask(false);

        setNewTask({
            title: '',
            lead: '',
            leadStatus: 'Cool',
            email: '',
            phone: '',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            type: 'Call',
            reminder: 'none',
            message: '',
            assignedTo: JSON.parse(localStorage.getItem('user') || '{}').id?.toString() || ''
        });
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsEditingTask(true);
        setNewTask({
            title: task.title,
            lead: task.lead || '',
            leadStatus: task.leadStatus || 'Cool',
            email: task.email || '',
            phone: task.phone || '',
            date: task.date,
            time: task.time,
            type: task.type,
            reminder: task.reminder || 'none',
            message: task.message || '',
            assignedTo: task.assignedTo || JSON.parse(localStorage.getItem('user') || '{}').id?.toString() || ''
        });
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
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.lead.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Add Promotions to the list
    const activePromotions = React.useMemo(() => promotions.map(p => ({
        id: `promo-${p.id}`,
        title: `PROMO: ${p.lenderName}`,
        lead: p.description,
        date: p.startDate, // Primary date for list view
        endDate: p.endDate,
        time: '09:00',
        type: 'Promotion',
        status: 'Active',
        isPromotion: true,
        lenderName: p.lenderName,
        fileName: p.fileName,
        fileData: p.fileData
    })), [promotions]);

    const displayTasks = React.useMemo(() => [...filteredTasks, ...activePromotions].sort((a, b) => new Date(b.date) - new Date(a.date)), [filteredTasks, activePromotions]);

    const renderCalendar = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
        const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
        const monthStr = String(calMonth + 1).padStart(2, '0');
        const cells = [
            ...Array(firstDayOfWeek).fill(null),
            ...Array.from({ length: totalDays }, (_, i) => i + 1)
        ];
        const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const baseYear = new Date().getFullYear();
        const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => baseYear - 3 + i);

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
        const navBg = isDark ? '#1e2347' : '#ffffff';
        const navBorder = isDark ? '#2c3568' : '#e2e8f0';
        const navColor = isDark ? '#8ea0d4' : '#4a5568';
        const selectColor = isDark ? '#e4ecff' : '#1a202c';

        return (
            <div className="grid grid-cols-[340px_1fr] gap-3 lg:grid-cols-1 h-full">
                {/* Calendar Section Wrapper */}
                <div className="flex flex-col h-full gap-3 overflow-y-auto scrollbar-thin pr-1">
                    <div className="rounded-xl overflow-hidden flex flex-col shrink-0 shadow-sm border" style={{ background: isDark ? '#1e2347' : '#ffffff', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: '14px', gap: '10px' }}>
                        {/* Local/Outlook Toggle */}
                        <div className="flex justify-center mb-2">
                        <div className="flex p-0.5 rounded-lg border w-fit shadow-sm" style={{ background: isDark ? '#242b50' : '#f8fafc', borderColor: isDark ? '#2c3568' : '#e2e8f0' }}>
                            <button
                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${!useOutlookCalendar ? 'bg-[#0061ff] text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-[#8ea0d4] dark:hover:text-[#c8d8ff]'}`}
                                onClick={() => setUseOutlookCalendar(false)}
                            >
                                Local
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${useOutlookCalendar ? 'bg-[#0061ff] text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-[#8ea0d4] dark:hover:text-[#c8d8ff]'}`}
                                onClick={() => setUseOutlookCalendar(true)}
                            >
                                Outlook
                            </button>
                        </div>
                    </div>

                    {!useOutlookCalendar ? (
                        <>
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-between px-1 mt-1 mb-1">
                        <button onClick={prevMonth} className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800" style={{ color: isDark ? '#8ea0d4' : '#64748b' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div className="flex items-center gap-1.5">
                            <select value={calMonth} onChange={e => setCalMonth(Number(e.target.value))} className="text-[11px] font-black outline-none rounded-lg px-2 py-1 cursor-pointer transition-all" style={{ background: isDark ? '#242b50' : '#f8fafc', color: isDark ? '#c8d8ff' : '#334155', border: `1px solid ${isDark ? '#2c3568' : '#e2e8f0'}` }}>
                                {MONTH_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                            </select>
                            <select value={calYear} onChange={e => setCalYear(Number(e.target.value))} className="text-[11px] font-black outline-none rounded-lg px-2 py-1 cursor-pointer transition-all" style={{ background: isDark ? '#242b50' : '#f8fafc', color: isDark ? '#c8d8ff' : '#334155', border: `1px solid ${isDark ? '#2c3568' : '#e2e8f0'}` }}>
                                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button onClick={nextMonth} className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800" style={{ color: isDark ? '#8ea0d4' : '#64748b' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest py-1 rounded-md" style={{ color: isDark ? '#8ea0d4' : '#64748b', background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>{d}</div>
                        ))}
                    </div>
                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (day === null) return <div key={`blank-${idx}`} />;
                            const dateStr = `${calYear}-${monthStr}-${String(day).padStart(2, '0')}`;
                            const dayTasks = tasks.filter(t => t.date === dateStr);
                            const dayPromos = promotions.filter(p => {
                                const start = new Date(p.startDate);
                                const end = new Date(p.endDate);
                                const current = new Date(dateStr);
                                return current >= start && current <= end;
                            });
                            const allDayItems = [...dayTasks, ...dayPromos.map(p => ({ ...p, isPromotion: true }))];
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === todayStr;
                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className="rounded-md flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative aspect-square"
                                    style={{
                                        background: isSelected ? '#0061ff' : isToday ? (isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9') : 'transparent',
                                        border: `1px solid ${isSelected ? '#0061ff' : (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc')}`,
                                        boxShadow: isSelected ? '0 4px 12px rgba(0,97,255,0.3)' : 'none',
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? (isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9') : 'transparent'; }}
                                >
                                    <span
                                        className="text-[13px] font-bold"
                                        style={{
                                            color: isSelected ? 'white' : (isDark ? '#e4ecff' : '#334155'),
                                        }}
                                    >{day}</span>
                                    {allDayItems.length > 0 && (
                                        <div className="flex gap-0.5 flex-wrap justify-center px-0.5 mt-0.5">
                                            {allDayItems.slice(0, 4).map((t, i) => (
                                                <div key={t.id || i} className={`w-1 h-1 rounded-full ${t.isPromotion ? 'bg-[#fbbf24]' : t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#f59e0b]' : 'bg-[#60a5fa]'}`} title={t.title || t.lenderName} />
                                            ))}
                                            {allDayItems.length > 4 && <span className="text-[6px] font-bold text-white leading-none">+{allDayItems.length - 4}</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                        </>
                    ) : (
                        <div className="flex-1 rounded-xl flex flex-col items-center justify-center p-6 text-center shadow-inner mt-2 min-h-[250px]" style={{ background: 'rgba(255,255,255,0.1)', border: '1px dashed rgba(255,255,255,0.3)' }}>
                            {!outlookAccount ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" width="24" height="24">
                                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                                            <path d="M2 10h20M6 14h.01M10 14h.01M14 14h.01M18 14h.01"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-[#334155] dark:text-white font-bold text-sm mb-1">Connect your Outlook</h3>
                                        <p className="text-[10px] text-[#64748b] dark:text-white/80">Sync your calendar and manage schedules.</p>
                                    </div>
                                    <button 
                                        onClick={handleOutlookLogin}
                                        className="bg-[#0061ff] text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-105"
                                    >
                                        Connect Now
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full w-full">
                                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-white/20 pb-2 shrink-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <div className="w-5 h-5 shrink-0 bg-[#0061ff] rounded-full flex items-center justify-center shadow-md">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>
                                            </div>
                                            <span className="text-[#334155] dark:text-white font-bold text-[10px] truncate">{outlookAccount.username}</span>
                                        </div>
                                        <button onClick={() => setOutlookAccount(null)} className="text-[9px] bg-red-50 text-red-600 dark:bg-white/20 hover:bg-red-100 px-2 py-1 rounded dark:text-white dark:hover:bg-[#ef4444] transition-all font-bold shrink-0">Disconnect</button>
                                    </div>
                                    
                                    <h4 className="text-[9px] font-bold text-slate-400 dark:text-white/70 uppercase tracking-wider text-left mb-2">Upcoming Events</h4>
                                    <div className="flex-1 overflow-y-auto scrollbar-thin text-left flex flex-col gap-2 pr-1">
                                        {loadingEvents ? (
                                            <p className="text-[10px] text-slate-400 dark:text-white/70 text-center italic mt-6">Syncing with Outlook...</p>
                                        ) : outlookEvents.length > 0 ? (
                                            outlookEvents.map((evt, i) => {
                                                const d = new Date(evt.start.dateTime);
                                                return (
                                                    <div key={i} className="bg-slate-50 dark:bg-white/10 backdrop-blur-sm border border-slate-100 dark:border-white/20 p-2.5 rounded-lg flex flex-col gap-1 hover:bg-blue-50 dark:hover:bg-white/20 transition-all cursor-pointer">
                                                        <span className="text-slate-700 dark:text-white text-[11px] font-bold leading-tight">{evt.subject}</span>
                                                        <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-white/80">
                                                            <div className="flex items-center gap-1">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                                <span>{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            {evt.location?.displayName && (
                                                                <span className="truncate max-w-[80px] text-[8px] opacity-70">📍 {evt.location.displayName}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-[10px] text-slate-400 dark:text-white/70 text-center italic mt-6">No upcoming events found.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                    
                    {/* Today's Summary below Calendar */}
                    <div className="rounded-xl p-4 flex flex-col gap-3 border shadow-sm shrink-0" style={{ background: isDark ? '#1a1e38' : '#ffffff', borderColor: isDark ? '#2c3568' : '#edf2f7' }}>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#a0aec0' }}>Overview for {selectedDate}</h4>
                        <div className="flex justify-between items-center px-1">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl font-black" style={{ color: isDark ? '#c8d8ff' : '#2d3748' }}>{tasks.filter(t => t.date === selectedDate).length}</span>
                                <span className="text-[10px] font-medium" style={{ color: isDark ? '#546298' : '#718096' }}>Tasks</span>
                            </div>
                            <div className="w-px h-8" style={{ background: isDark ? '#2c3568' : '#edf2f7' }}></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl font-black text-[#fbbf24]">
                                    {promotions.filter(p => {
                                        const start = new Date(p.startDate);
                                        const end = new Date(p.endDate);
                                        const current = new Date(selectedDate);
                                        return current >= start && current <= end;
                                    }).length}
                                </span>
                                <span className="text-[10px] font-medium" style={{ color: isDark ? '#546298' : '#718096' }}>Promotions</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task List Panel */}
                <div className="rounded-xl p-3 flex flex-col gap-2 overflow-hidden h-full" style={{ background: isDark ? '#1a1e38' : '#f8fafc', border: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>
                    <div className="flex justify-between items-center pb-1.5" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>
                        <h3 className="text-[10px] font-bold" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>Tasks for {selectedDate}</h3>
                        <button className="flex items-center gap-1.5 bg-[#0061ff] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md hover:bg-blue-700 hover:scale-105 transition-all shadow-blue-500/30" onClick={() => {
                            setNewTask({
                                title: '',
                                lead: '',
                                date: selectedDate,
                                time: '12:00',
                                type: 'Call',
                                reminder: 'none',
                                message: '',
                                assignedTo: JSON.parse(localStorage.getItem('user') || '{}').id?.toString() || ''
                            });
                            setIsEditingTask(false);
                            setIsAddingTask(true);
                        }}>
                            <IconPlus /> <span>New Task</span>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                        {(() => {
                            const dayTasks = tasks.filter(t => t.date === selectedDate);
                            const dayPromos = activePromotions.filter(p => {
                                const start = new Date(p.date);
                                const end = new Date(p.endDate);
                                const current = new Date(selectedDate);
                                return current >= start && current <= end;
                            });
                            
                            return (
                                <div className="grid grid-cols-2 gap-2.5 h-full min-h-0">
                                    {/* Regular Tasks Column */}
                                    <div className="flex flex-col gap-2 h-full">
                                        <h4 className="text-[9px] font-black uppercase tracking-wider pb-0.5" style={{ color: isDark ? '#8ea0d4' : '#718096', borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>Tasks</h4>
                                        {dayTasks.length > 0 ? (
                                            dayTasks.map(t => (
                                                <TaskCard 
                                                    key={t.id} 
                                                    task={t} 
                                                    user={user} 
                                                    users={users} 
                                                    isDark={isDark} 
                                                    highlightTaskId={null} 
                                                    handleEditClick={handleEditClick} 
                                                    updateTaskStatus={(taskId, status) => updateTaskStatus(taskId, status)} 
                                                />
                                            ))
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl" style={{ borderColor: isDark ? '#2c3568' : '#e2e8f0', background: isDark ? '#1e2347' : '#f8fafc' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ color: isDark ? '#546298' : '#cbd5e0', marginBottom: '8px' }}>
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                                <p className="text-[11px] font-semibold" style={{ color: isDark ? '#8ea0d4' : '#a0aec0' }}>No tasks scheduled</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Promotions Column */}
                                    <div className="flex flex-col gap-2 h-full">
                                        <h4 className="text-[10px] font-black uppercase tracking-wider pb-1" style={{ color: isDark ? '#8ea0d4' : '#718096', borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}` }}>Promotions</h4>
                                        {dayPromos.length > 0 ? (
                                            dayPromos.map(p => {
                                                const hue = stringToColor(p.lenderName || p.title);
                                                return (
                                                    <div key={p.id} className="p-3 rounded-2xl flex flex-col gap-2 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer group" style={{ background: isDark ? `hsla(${hue}, 80%, 65%, 0.08)` : `hsla(${hue}, 80%, 45%, 0.04)`, border: `1px solid ${isDark ? `hsla(${hue}, 80%, 65%, 0.15)` : `hsla(${hue}, 80%, 45%, 0.12)}`}` }}>
                                                        <div className="h-1 w-full rounded-full transition-all group-hover:h-1.5" style={{ background: `linear-gradient(90deg, hsl(${hue}, 80%, 60%), hsl(${(hue + 60) % 360}, 80%, 60%))` }}></div>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-[12px] font-black leading-tight" style={{ color: isDark ? '#e4ecff' : '#1e3a8a' }}>{p.title?.replace('PROMO: ', '')}</span>
                                                                <span className="text-white text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider" style={{ background: `hsl(${hue}, 80%, 55%)` }}>Promo</span>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-current/10">
                                                                <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: isDark ? '#8ea0d4' : '#3b82f6' }}>
                                                                    <IconMeeting size={11} /> {p.time}
                                                                </div>
                                                                <StatusSelector 
                                                                    status={p.status} 
                                                                    onStatusChange={(newStatus) => updateTaskStatus(p.id, newStatus)} 
                                                                    isDark={isDark} 
                                                                    isPromotion={true} 
                                                                />
                                                            </div>
                                                            {(p.description || p.lead || p.message || p.notes || p.note) && (
                                                                <div className={`mt-1 p-2.5 rounded-xl text-[10px] font-medium leading-relaxed border-l-2 italic ${isDark ? 'bg-white/5 border-current/20 text-[#8ea0d4]' : 'bg-black/5 border-current/20 text-[#475569]'}`}>
                                                                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                                                        <IconDoc size={10} />
                                                                        <span className="text-[8px] font-black uppercase tracking-widest">Description / Notes</span>
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
                                                                    className="flex items-center gap-2 mt-2 p-2 rounded-xl bg-white/50 dark:bg-black/20 border border-current/20 hover:bg-white dark:hover:bg-white/10 transition-all font-bold text-[9px] uppercase tracking-wider"
                                                                    style={{ color: `hsl(${hue}, 80%, 50%)` }}
                                                                >
                                                                    <IconEye /> View Promotion
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl" style={{ borderColor: isDark ? '#2c3568' : '#e2e8f0', background: isDark ? '#1e2347' : '#f8fafc' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ color: isDark ? '#546298' : '#cbd5e0', marginBottom: '8px' }}>
                                                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                                </svg>
                                                <p className="text-[11px] font-semibold" style={{ color: isDark ? '#8ea0d4' : '#a0aec0' }}>No active promotions</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full animate-fadeIn font-['Sora',sans-serif]" style={{ height: 'calc(100vh - 120px)' }}>

            {isAddingTask && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[2000] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[500px] max-h-[90vh] rounded-2xl p-8 shadow-2xl relative animate-slideUp overflow-y-auto scrollbar-thin">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#1a202c]">{isEditingTask ? 'Edit Task' : 'Create New Task'}</h2>
                            <button className="text-2xl text-[#a0aec0] hover:text-[#4a5568]" onClick={() => { setIsAddingTask(false); setIsEditingTask(false); setEditingTask(null); }}>&times;</button>
                        </div>

                        <form onSubmit={handleAddTask}>
                            <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-1">
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Task Title</label>
                                    <input required type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Call returning client..." />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Related Lead</label>
                                    <select 
                                        required 
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" 
                                        value={newTask.lead} 
                                        onChange={e => {
                                            const name = e.target.value;
                                            const leadMatch = (leads || []).find(l => l.name === name);
                                            setNewTask(prev => ({ 
                                                ...prev, 
                                                lead: name,
                                                email: leadMatch?.email || '',
                                                phone: leadMatch?.phone || ''
                                            }));
                                        }} 
                                    >
                                        <option value="">Select a Lead</option>
                                        {(leads || [])
                                            .filter(l => {
                                                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                                return l.assignedStaffId?.toString() === currentUser.id?.toString();
                                            })
                                            .map(l => (
                                                <option key={l.id} value={l.name}>{l.name} ({l.businessName})</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Lead Status</label>
                                    <select 
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" 
                                        value={newTask.leadStatus} 
                                        onChange={e => setNewTask({...newTask, leadStatus: e.target.value})}
                                    >
                                        <option value="Hot">Hot</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cool">Cool</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Lead Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" 
                                        value={newTask.email} 
                                        onChange={e => setNewTask({...newTask, email: e.target.value})} 
                                        placeholder="email@example.com" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#4a5568]">Lead Phone</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" 
                                        value={newTask.phone} 
                                        onChange={e => setNewTask({...newTask, phone: e.target.value})} 
                                        placeholder="+44 ..." 
                                    />
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
                                <button type="button" className="px-5 py-2.5 bg-[#f7fafc] border border-[#edf2f7] rounded-xl font-bold text-[#4a5568] hover:bg-[#edf2f7] transition-all" onClick={() => { setIsAddingTask(false); setIsEditingTask(false); setEditingTask(null); }}>Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[#2447d7] text-white rounded-xl font-bold hover:bg-[#1a36b1] hover:-translate-y-px shadow-lg transition-all">{isEditingTask ? 'Update Task' : 'Create Task'}</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Promotion Document Preview Modal */}
            {previewFile && (
                <PromoPreviewModal
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                    isDark={isDark}
                />
            )}

            {/* Unified Calendar + Tasks View */}
            <div className="flex-1 overflow-hidden">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default TasksFollowups;

