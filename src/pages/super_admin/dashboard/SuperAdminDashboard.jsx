import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileModal from '../../../components/modals/UserProfileModal';
import { useLeads } from '../../../context/LeadsContext';
import { useLenders } from '../../../context/LendersContext';
import { useTheme } from '../../../context/ThemeContext';
import {
    SA_STATS,
    SHARED_INITIAL_USERS,
    INITIAL_TASKS,
    TL_AGENT_PERFORMANCE,
    DATE_RANGE_OPTIONS,
} from '../../../data/dummyData';
import { useTasks } from '../../../context/TasksContext';
import TaskModal from '../../../components/modals/TaskModal';

/* ─── ICONS ─────────────────────────────────── */
const IconUsers = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconMoney = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconClock = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconDoc = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
const IconTeam = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IconOnline = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const IconMSTeams = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.625 7.5h-5.25A1.125 1.125 0 0 0 14.25 8.625v5.25c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125v-5.25A1.125 1.125 0 0 0 20.625 7.5zM18 11.25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-5.25 3.75H9.375A1.125 1.125 0 0 1 8.25 13.875v-5.25c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125zM11.25 11.25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-6 6H3.375A1.125 1.125 0 0 1 2.25 16.125v-3.75c0-.621.504-1.125 1.125-1.125H5.25c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125z" /></svg>;
const IconHR = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IconShield = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
const IconPromo = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
const IconBook = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const IconSocial = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
const IconPayout = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconChevron = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="9 18 15 12 9 6" /></svg>;
const IconFilter = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconKey = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>;

/* ─── SHARED CARD SHELL ──────────────────── */
const Card = ({ children, className = '' }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <div className={`rounded-2xl border flex flex-col overflow-hidden min-h-0 ${isDark ? 'bg-[#1e2347] border-white/5 shadow-lg' : 'bg-white border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)]'} ${className}`}>
            {children}
        </div>
    );
};
const CardHeader = ({ dotColor = '#6366f1', title, badge, badgeClass, action }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}80` }} />
                <span className={`text-[11px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-[#94abda]' : 'text-slate-600'}`}>{title}</span>
            </div>
            <div className="flex items-center gap-1.5">
                {badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeClass}`}>{badge}</span>}
                {action}
            </div>
        </div>
    );
};

/* ─── STAT TILE ──────────────────────────── */
const StatTile = ({ icon, value, label, iconBg, tileBg, tileBorder, darkBg, darkBorder, darkText, onClick }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <button onClick={onClick}
            className={`border rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm hover:-translate-y-0.5 transition-transform text-center w-full ${isDark ? `${darkBg || 'bg-[#1e2347]'} ${darkBorder || 'border-white/5'}` : `${tileBg} ${tileBorder}`}`}>
            <div className={`w-9 h-9 rounded-full ${iconBg} text-white flex items-center justify-center shadow-md`}>
                {React.cloneElement(icon, { width: 16, height: 16 })}
            </div>
            <h2 className={`text-xl font-black leading-none mt-1 ${isDark ? (darkText || 'text-white') : 'text-slate-800'}`}>{value}</h2>
            <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${isDark ? 'text-[#546298]' : 'text-slate-500'}`}>{label}</span>
        </button>
    );
};

/* ─── ONLINE USERS POPUP ─────────────────── */
const OnlineUsersPopup = ({ onClose, onUserClick, onNavigate }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const users = SHARED_INITIAL_USERS.filter(u => u.role !== 'Super Admin');
    const online = users.filter(u => u.status === 'Active');
    const offline = users.filter(u => u.status !== 'Active');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className={`w-full max-w-[560px] rounded-2xl border shadow-2xl animate-fadeIn overflow-hidden ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-200 shadow-slate-900/15'}`} onClick={e => e.stopPropagation()}>
                {/* header */}
                <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                        <span className={`text-[12px] font-black uppercase tracking-widest ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>Online Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{online.length} online</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-[#94abda]' : 'bg-slate-100 text-slate-500'}`}>{offline.length} offline</span>
                        <button onClick={onClose} className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                            <IconX width="12" height="12" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                        </button>
                    </div>
                </div>
                {/* user grid */}
                <div className="p-4 grid grid-cols-2 gap-4 max-h-[420px] overflow-y-auto">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 px-1">Online ({online.length})</p>
                        {online.map(user => (
                            <div key={user.id} onClick={() => { onUserClick(user); onClose(); }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-transparent transition-all cursor-pointer ${isDark ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                                <div className="relative shrink-0">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ background: user.color }}>{user.initials}</div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-emerald-500 ${isDark ? 'border-[#1e2347]' : 'border-white'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[11px] font-semibold truncate ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{user.name}</p>
                                    <p className={`text-[9px] italic truncate ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{user.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`flex flex-col gap-1.5 border-l pl-4 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 px-1 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Offline ({offline.length})</p>
                        {offline.map(user => (
                            <div key={user.id} onClick={() => { onUserClick(user); onClose(); }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-transparent transition-all cursor-pointer opacity-60 hover:opacity-100 ${isDark ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                                <div className="relative shrink-0">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ background: user.color }}>{user.initials}</div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-slate-400 ${isDark ? 'border-[#1e2347]' : 'border-white'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[11px] font-semibold truncate ${isDark ? 'text-[#94abda]' : 'text-slate-600'}`}>{user.name}</p>
                                    <p className={`text-[9px] italic truncate ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{user.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* footer */}
                <div className={`px-5 py-3 border-t flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                    <span className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{users.length} total users</span>
                    <button onClick={() => { onClose(); onNavigate?.('user-management'); }}
                        className="text-[9px] font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                        User Management <IconChevron width="10" height="10" />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── TASK SCHEDULE ──────────────────────── */
const TaskSchedule = () => {
    const navigate = useNavigate();
    const { tasks, addTask } = useTasks();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isAddingTask, setIsAddingTask] = useState(false);

    const allRecentTasks = tasks
        .filter(t => t.status !== 'Completed')
        .sort((a, b) => {
            // Pending first, then In Progress
            const statusOrder = { 'Pending': 0, 'In Progress': 1 };
            const aStatus = statusOrder[a.status] ?? 2;
            const bStatus = statusOrder[b.status] ?? 2;
            if (aStatus !== bStatus) return aStatus - bStatus;
            // Then High priority
            const aPriority = a.priority === 'High' ? 0 : 1;
            const bPriority = b.priority === 'High' ? 0 : 1;
            if (aPriority !== bPriority) return aPriority - bPriority;
            // Then soonest date/time
            return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
        })
        .slice(0, 5);

    const handleSaveTask = (task) => {
        addTask(task);
        setIsAddingTask(false);
    };

    return (
        <>
            <Card className="h-full">
                <CardHeader dotColor="#8b5cf6" title="Global Task Queue" badge="Top 5 Urgent" badgeClass="bg-red-100 text-red-600 animate-pulse"
                    action={
                        <button onClick={() => setIsAddingTask(true)}
                            className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center hover:bg-violet-200 transition-colors">
                            <IconPlus width="12" height="12" />
                        </button>
                    }
                />
                <div className="p-3 flex flex-col gap-2.5 flex-1 overflow-y-auto custom-scrollbar">
                    {allRecentTasks.map(t => {
                        const assignedUser = t.assignedTo === 'Self' ? { initials: 'SA', name: 'Super Admin', color: '#2447d7' } : SHARED_INITIAL_USERS.find(u => u.id?.toString() === t.assignedTo?.toString() || u.name === t.assignedTo) || { initials: 'U', name: 'Unassigned', color: '#cbd5e1' };
                        return (
                            <div
                                key={t.id}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer group border border-transparent ${isDark ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}
                                onClick={() => navigate('/super-admin/tasks', { state: { taskId: t.id } })}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-sm" style={{ background: assignedUser.color }}>
                                    {assignedUser.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[11px] font-bold truncate leading-tight mb-1 ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{t.title}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[9px] font-medium ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{t.date} · {t.time}</span>
                                        <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
                                        <span className={`text-[9px] font-bold uppercase tracking-tight ${isDark ? 'text-[#94abda]' : 'text-slate-500'}`}>{assignedUser.name}</span>
                                    </div>
                                </div>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 tracking-widest ${t.status === 'Completed' ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : t.status === 'In Progress' ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700') : (isDark ? 'bg-white/5 text-white/40' : 'bg-slate-100 text-slate-500')}`}>{t.status === 'In Progress' ? 'IN PRG' : t.status.toUpperCase()}</span>
                            </div>
                        );
                    })}
                    {allRecentTasks.length === 0 && (
                        <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-2xl ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <p className={`text-[10px] font-bold italic ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>No active tasks in the queue</p>
                        </div>
                    )}
                </div>
            </Card>
            <TaskModal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} onSave={handleSaveTask} />
        </>
    );
};

/* ─── AGENT PERFORMANCE ──────────────────── */
const AgentPerformance = () => {
    const [range, setRange] = useState('Last 30 Days');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleAgentClick = (agent) => {
        const user = SHARED_INITIAL_USERS.find(u => u.name === agent.name);
        if (user) setSelectedUser(user);
    };

    return (
        <>
            <Card className="h-full">
                <CardHeader dotColor="#3b82f6" title="Agent Performance"
                    action={
                        <div className="relative">
                            <button onClick={() => setShowFilter(s => !s)}
                                className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg transition-colors ${isDark ? 'text-blue-400 bg-blue-500/15 hover:bg-blue-500/25' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                                <IconFilter width="9" height="9" /> {range}
                            </button>
                            {showFilter && (
                                <div className={`absolute right-0 top-7 z-20 border rounded-xl shadow-lg py-1 min-w-[130px] ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'}`}>
                                    {DATE_RANGE_OPTIONS.map(opt => (
                                        <button key={opt} onClick={() => { setRange(opt); setShowFilter(false); }}
                                            className={`w-full text-left px-3 py-1.5 text-[10px] font-semibold transition-colors ${range === opt ? 'text-blue-500' : (isDark ? 'text-[#94abda] hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    }
                />
                <div className="p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar">
                    {TL_AGENT_PERFORMANCE.map((agent, i) => {
                        const max = Math.max(...TL_AGENT_PERFORMANCE.map(a => a.activeLeads));
                        const pct = Math.round((agent.activeLeads / max) * 100);
                        return (
                            <div key={i} onClick={() => handleAgentClick(agent)}
                                className={`flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1 transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 group-hover:scale-110 transition-transform shadow-sm" style={{ background: agent.color }}>
                                    {agent.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-1">
                                        <span className={`text-[11px] font-bold truncate group-hover:text-blue-500 transition-colors ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{agent.name}</span>
                                        <span className={`text-[10px] font-black shrink-0 ml-1 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{agent.activeLeads}</span>
                                    </div>
                                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: agent.color }} />
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 shrink-0 ml-2">{agent.closedDeals}✓</span>
                            </div>
                        );
                    })}
                </div>
            </Card>
            {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} onUserClick={(u) => setSelectedUser(u)} />}
        </>
    );
};

const Notes = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [notesList, setNotesList] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('sa_notes_list'));
            return Array.isArray(saved) ? saved : [];
        } catch { return []; }
    });
    const [newNote, setNewNote] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
    const [alertDialog, setAlertDialog] = useState({ open: false, message: '' });
    const showConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
    const closeConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });
    const showAlert = (message) => setAlertDialog({ open: true, message });
    const closeAlert = () => setAlertDialog({ open: false, message: '' });

    const getPadded = n => String(n).padStart(2, '0');

    const addNote = () => {
        if (!newNote.trim()) return;
        const now = new Date();
        const note = {
            id: Date.now(),
            text: newNote.trim(),
            date: `${now.getFullYear()}-${getPadded(now.getMonth() + 1)}-${getPadded(now.getDate())}`,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            highlighted: false,
            pinned: false,
        };
        const updated = [note, ...notesList];
        setNotesList(updated);
        localStorage.setItem('sa_notes_list', JSON.stringify(updated));
        setNewNote('');
    };

    const toggleHL = (id) => {
        const updated = notesList.map(n => n.id === id ? { ...n, highlighted: !n.highlighted } : n);
        setNotesList(updated);
        localStorage.setItem('sa_notes_list', JSON.stringify(updated));
    };

    const togglePin = (id) => {
        const updated = notesList.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
        setNotesList(updated);
        localStorage.setItem('sa_notes_list', JSON.stringify(updated));
    };

    const clearNote = (id) => {
        const updated = notesList.filter(n => n.id !== id);
        setNotesList(updated);
        localStorage.setItem('sa_notes_list', JSON.stringify(updated));
    };

    const clearAll = () => {
        showConfirm('Clear all notes?', () => {
            setNotesList([]);
            localStorage.setItem('sa_notes_list', JSON.stringify([]));
        });
    };

    return (
        <>
            <div className={`rounded-2xl border flex flex-col h-full overflow-hidden min-h-0 shadow-[0_4px_20px_rgb(0,0,0,0.04)] ${isDark ? 'bg-[#343224] border-yellow-700/30' : 'bg-[#fffdf0] border-yellow-200/60'}`}>
                {/* header */}
                <div className={`border-b px-4 py-2.5 shrink-0 flex items-center justify-between ${isDark ? 'bg-[#4d4826] border-yellow-700/30' : 'bg-[#fff9c4] border-yellow-200/50'}`}>
                    <div className={`flex items-center gap-1.5 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">My Notes</span>
                    </div>
                    <button onClick={clearAll} className={`text-[9px] font-bold transition-colors uppercase tracking-widest ${isDark ? 'text-yellow-500/60 hover:text-rose-400' : 'text-yellow-700/60 hover:text-rose-600'}`}>Clear All</button>
                </div>
                {/* list */}
                <div className="flex-1 overflow-y-auto min-h-0 p-3 flex flex-col gap-2 custom-scrollbar"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? '#92400e transparent' : '#fde68a transparent' }}>
                    {notesList.length === 0 ? (
                        <div className={`text-[10px] italic text-center mt-4 border border-dashed p-4 rounded-xl ${isDark ? 'text-yellow-500/40 border-yellow-700/30' : 'text-yellow-700/40 border-yellow-200'}`}>No notes yet. Type below to start!</div>
                    ) : [...notesList].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(note => (
                        <div key={note.id} className={`p-2.5 rounded-xl text-[11px] relative group border shrink-0 transition-all ${note.pinned ? (isDark ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50/60') : note.highlighted ? (isDark ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200' : 'bg-yellow-200 border-yellow-300 text-yellow-900') : (isDark ? 'bg-white/5 border-yellow-700/20 text-yellow-100' : 'bg-white/60 border-yellow-100 text-yellow-900')}`}>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1.5">
                                    {note.pinned && (
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 ${isDark ? 'text-blue-400 bg-blue-500/15' : 'text-blue-600 bg-blue-100'}`}>
                                            📌 Pinned
                                        </span>
                                    )}
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{note.date}{note.time ? ` · ${note.time}` : ''}</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => togglePin(note.id)} title={note.pinned ? 'Unpin' : 'Pin'}
                                        className={`text-[8px] px-1.5 py-0.5 rounded font-bold transition-colors ${note.pinned ? 'bg-blue-200 text-blue-700 hover:bg-blue-300' : 'bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600'}`}>
                                        📌
                                    </button>
                                    <button onClick={() => toggleHL(note.id)} className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-300 transition-colors">HL</button>
                                    <button onClick={() => clearNote(note.id)} className="text-[8px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 font-bold hover:bg-rose-200 transition-colors">✕</button>
                                </div>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                        </div>
                    ))}
                </div>
                {/* input */}
                <div className={`shrink-0 flex gap-2 p-3 pt-2 border-t ${isDark ? 'border-yellow-700/30' : 'border-yellow-200/50'}`}>
                    <input
                        value={newNote} onChange={e => setNewNote(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addNote()}
                        placeholder="Type a note & press Enter..."
                        className={`flex-1 border rounded-lg px-3 py-1.5 text-[11px] outline-none transition-colors ${isDark ? 'bg-white/5 border-yellow-700/30 text-yellow-100 focus:border-yellow-500 placeholder-yellow-700' : 'bg-white/60 border-yellow-200/60 text-yellow-900 focus:border-yellow-400 focus:bg-white placeholder-yellow-300'}`}
                    />
                    <button onClick={addNote} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors">Add</button>
                </div>
            </div>

            {/* Alert Dialog */}
            {alertDialog.open && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAlert} />
                    <div className={`relative rounded-2xl shadow-2xl p-6 w-full max-w-sm border animate-fadeIn ${isDark ? 'bg-[#1e2347] border-white/5 text-white' : 'bg-white border-slate-100'}`}>
                        <p className={`text-[15px] font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{alertDialog.message}</p>
                        <div className="flex justify-end">
                            <button onClick={closeAlert} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-[#2447d7] hover:bg-[#1732a3] transition-colors">OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Dialog */}
            {confirmDialog.open && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeConfirm} />
                    <div className={`relative rounded-2xl shadow-2xl p-6 w-full max-w-sm border animate-fadeIn ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'}`}>
                        <p className={`text-[15px] font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{confirmDialog.message}</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={closeConfirm} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button onClick={() => { confirmDialog.onConfirm?.(); closeConfirm(); }} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ─── PENDING PAYOUTS ────────────────────── */
const PendingPayouts = ({ onNavigate, leads = [] }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showAll, setShowAll] = useState(false);

    // Pending payouts = leads at Lender Selection stage
    const pendingLeads = leads.filter(l => l.stage === 'Lender Selection' || l.status === 'Lender Selection');
    const preview = pendingLeads.slice(0, 3);

    const PayoutRow = ({ lead, onClick }) => (
        <div
            onClick={onClick}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer ${isDark ? 'bg-orange-500/5 border-orange-500/10 hover:border-orange-500/30 hover:bg-orange-500/10' : 'bg-orange-50/50 border-orange-100/60 hover:border-orange-200 hover:bg-orange-50'}`}>
            <div className="min-w-0 flex-1">
                <p className={`text-[12px] font-bold truncate ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{lead.name}</p>
                <p className={`text-[10px] font-medium truncate ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{lead.businessName || lead.submissionDate}</p>
            </div>
            <div className="text-right shrink-0 ml-2">
                <p className={`text-[12px] font-black ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{lead.loanAmount || '—'}</p>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>Pending</span>
            </div>
        </div>
    );

    return (
        <>
            <Card className="h-full">
                <CardHeader dotColor="#f97316" title="Pending Payouts" badge={`${pendingLeads.length}`} badgeClass="bg-orange-100 text-orange-600" />
                <div className="p-2 flex flex-col gap-1">
                    {preview.length > 0 ? preview.map(lead => (
                        <PayoutRow key={lead.id} lead={lead} onClick={() => onNavigate?.('lead-details', lead)} />
                    )) : (
                        <p className={`text-[11px] text-center py-4 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>No pending payouts</p>
                    )}
                    {pendingLeads.length > 0 && (
                        <button
                            onClick={() => setShowAll(true)}
                            className={`text-[10px] font-black flex items-center gap-1 self-end py-1 mt-1 ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
                            View all ({pendingLeads.length}) <IconChevron width="11" height="11" />
                        </button>
                    )}
                </div>
            </Card>

            {/* Full popup modal */}
            {showAll && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAll(false)} />
                    <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-zoomIn ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`}
                        style={{ maxHeight: 'calc(100vh - 2rem)' }}>
                        {/* Header */}
                        <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <div>
                                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Pending Payouts</h3>
                                <p className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{pendingLeads.length} leads awaiting payout</p>
                            </div>
                            <button onClick={() => setShowAll(false)} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        {/* List */}
                        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
                            {pendingLeads.map(lead => (
                                <div key={lead.id}
                                    onClick={() => { setShowAll(false); onNavigate?.('lead-details', lead); }}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer group ${isDark ? 'bg-orange-500/5 border-orange-500/10 hover:border-orange-500/30 hover:bg-orange-500/10' : 'bg-orange-50/40 border-orange-100 hover:border-orange-300 hover:bg-orange-50'}`}>
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                                            {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-[13px] font-black truncate group-hover:text-orange-600 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{lead.name}</p>
                                            <p className={`text-[10px] font-medium truncate ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{lead.businessName} · #{lead.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <p className={`text-[13px] font-black ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{lead.loanAmount || '—'}</p>
                                        <p className={`text-[10px] font-medium ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{lead.submissionDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ─── LICENSES & INSURANCE ───────────────── */
/* ─── ADD LICENSE POPUP ──────────────────── */
const getAutoStatus = (expiryYearMonth) => {
    if (!expiryYearMonth) return 'Active';
    const expiry = new Date(expiryYearMonth + '-01');
    const now = new Date();
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'Expired';
    if (diffDays <= 60) return 'Expiring';
    return 'Active';
};

const formatExpiry = (yearMonth) => {
    if (!yearMonth) return '';
    const [y, m] = yearMonth.split('-');
    return new Date(y, m - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
};

const AddLicensePopup = ({ onClose, onAdd }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [form, setForm] = useState({ label: '', expiry: '', reminder: '1 month' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const autoStatus = getAutoStatus(form.expiry);

    const statusStyle = {
        Active: 'bg-emerald-100 text-emerald-700',
        Expiring: 'bg-amber-100 text-amber-700',
        Expired: 'bg-rose-100 text-rose-700',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.label.trim() || !form.expiry) return;
        onAdd({ label: form.label, expiry: formatExpiry(form.expiry), status: autoStatus, reminder: form.reminder });
        onClose();
    };

    const inputCls = `text-[11px] px-3 py-2 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-[#151932] border-white/10 text-[#e4ecff] placeholder-white/20 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-400 placeholder-slate-300'}`;
    const labelCls = `text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-[#546298]' : 'text-slate-500'}`;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn overflow-hidden ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`}>
                <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <IconShield width="13" height="13" className="text-emerald-600" />
                        </div>
                        <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>Add License / Insurance</p>
                    </div>
                    <button onClick={onClose} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                        <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Name</label>
                        <input value={form.label} onChange={e => set('label', e.target.value)} required placeholder="e.g. Public Liability Insurance" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Expiry Date</label>
                        <div className="flex items-center gap-2">
                            <input type="month" value={form.expiry} onChange={e => set('expiry', e.target.value)} required className={`flex-1 ${inputCls}`} />
                            {form.expiry && <span className={`text-[8px] font-bold px-2 py-1 rounded-full shrink-0 ${statusStyle[autoStatus]}`}>{autoStatus}</span>}
                        </div>
                        {form.expiry && <p className={`text-[9px] pl-1 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Status auto-calculated from expiry date</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Remind me before expiry</label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {['1 week', '2 weeks', '1 month', '2 months'].map(opt => (
                                <button key={opt} type="button" onClick={() => set('reminder', opt)}
                                    className={`text-[9px] font-bold py-1.5 rounded-xl border transition-colors ${form.reminder === opt ? 'bg-emerald-600 text-white border-emerald-600' : (isDark ? 'bg-white/5 text-[#94abda] border-white/10 hover:border-emerald-500' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300')}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className={`text-[10px] font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'text-[#94abda] bg-white/5 hover:bg-white/10' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                        <button type="submit" className="text-[10px] font-bold text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── LICENSES & INSURANCE ───────────────── */
const LicensesInsurance = () => {
    const [showAdd, setShowAdd] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [items, setItems] = useState([
        { label: 'Business License', expiry: 'Dec 2026', status: 'Active' },
        { label: 'Insurance Policy', expiry: 'Jun 2026', status: 'Active' },
        { label: 'Compliance Cert', expiry: 'Mar 2026', status: 'Expiring' },
    ]);

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const ORDER = { Expired: 0, Expiring: 1, Active: 2 };
    const sorted = [...items].sort((a, b) => ORDER[a.status] - ORDER[b.status]);

    return (
        <>
            <Card className="h-full">
                <CardHeader dotColor="#10b981" title="Licenses & Insurance" badge="Compliance" badgeClass="bg-emerald-100 text-emerald-600"
                    action={
                        <button onClick={() => setShowAdd(true)}
                            className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                            <IconPlus width="12" height="12" />
                        </button>
                    }
                />
                <div className="p-2 flex flex-col gap-1">
                    {sorted.map((item, i) => (
                        <div key={i} className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${item.status === 'Expiring' ? (isDark ? 'bg-amber-500/10 hover:bg-amber-500/15' : 'bg-amber-50/60 hover:bg-amber-50') : item.status === 'Expired' ? (isDark ? 'bg-rose-500/10 hover:bg-rose-500/15' : 'bg-rose-50/60 hover:bg-rose-50') : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${item.status === 'Expiring' ? 'bg-amber-100' : item.status === 'Expired' ? 'bg-rose-100' : 'bg-emerald-50'}`}>
                                    <IconShield width="14" height="14" className={item.status === 'Expiring' ? 'text-amber-600' : item.status === 'Expired' ? 'text-rose-600' : 'text-emerald-600'} />
                                </div>
                                <div>
                                    <p className={`text-[12px] font-bold ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{item.label}</p>
                                    <p className={`text-[10px] font-medium ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Exp: {item.expiry}</p>
                                </div>
                            </div>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.status === 'Expiring' ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700') : item.status === 'Expired' ? (isDark ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-100 text-rose-700') : (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700')}`}>{item.status}</span>
                        </div>
                    ))}
                    <button onClick={() => setShowAll(true)} className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors self-start flex items-center gap-1 mt-2 ${isDark ? 'text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}>
                        View All ({items.length})
                    </button>
                </div>
            </Card>
            {showAll && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAll(false)}>
                    <div className={`rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn overflow-hidden ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <IconShield width="13" height="13" className="text-emerald-600" />
                                </div>
                                <div>
                                    <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>Licenses & Insurance</p>
                                    <p className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{items.length} records · {items.filter(i => i.status !== 'Active').length} need attention</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setShowAll(false); setShowAdd(true); }}
                                    className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                    <IconPlus width="10" height="10" /> Add New
                                </button>
                                <button onClick={() => setShowAll(false)} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                                    <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2 max-h-[420px] overflow-y-auto">
                            {[...items].sort((a, b) => ({ Expired: 0, Expiring: 1, Active: 2 }[a.status] - { Expired: 0, Expiring: 1, Active: 2 }[b.status])).map((item, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${item.status === 'Expiring' ? (isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100') : item.status === 'Expired' ? (isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100') : (isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100')}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.status === 'Expiring' ? 'bg-amber-100' : item.status === 'Expired' ? 'bg-rose-100' : 'bg-emerald-50'}`}>
                                            <IconShield width="16" height="16" className={item.status === 'Expiring' ? 'text-amber-600' : item.status === 'Expired' ? 'text-rose-600' : 'text-emerald-600'} />
                                        </div>
                                        <div>
                                            <p className={`text-[12px] font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{item.label}</p>
                                            <p className={`text-[10px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Expires: {item.expiry}{item.reminder ? ` · Reminder: ${item.reminder} before` : ''}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${item.status === 'Expiring' ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700') : item.status === 'Expired' ? (isDark ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-100 text-rose-700') : (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700')}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`px-5 py-3 border-t flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                            <span className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{items.filter(i => i.status === 'Active').length} active · {items.filter(i => i.status === 'Expiring').length} expiring · {items.filter(i => i.status === 'Expired').length} expired</span>
                        </div>
                    </div>
                </div>
            )}
            {showAdd && (
                <AddLicensePopup
                    onClose={() => setShowAdd(false)}
                    onAdd={item => setItems(p => [...p, item])}
                />
            )}
        </>
    );
};

/* ─── KNOWLEDGE BASE TELE AGENT POPUP ───── */
const KB_TELE_DOCS = [
    { id: 1, category: 'Guides', name: 'Lead Qualification Checklist', type: 'PDF', size: '0.8 MB', tag: 'blue', content: '✓ Business trading 6+ months\n✓ Annual turnover £100K+\n✓ No active insolvency\n✓ Director/owner contact confirmed\n✓ Loan purpose clearly defined\n✓ Funding timeline captured' },
    { id: 2, category: 'Guides', name: 'Document Collection SOP', type: 'DOCX', size: '1.5 MB', tag: 'blue', content: 'Required documents per lead:\n1. Last 6 months bank statements\n2. Latest 2 years accounts\n3. Photo ID (passport/driving licence)\n4. Proof of address (utility bill < 3 months)\n5. Signed authority form' },
    { id: 3, category: 'FAQs', name: 'Common Customer FAQs', type: 'PDF', size: '0.6 MB', tag: 'violet', content: 'Q: How long does approval take?\nA: Typically 24–72 hours once all documents are received.\n\nQ: What loan amounts are available?\nA: £10,000 to £5,000,000 depending on turnover.\n\nQ: Is my credit score checked?\nA: A soft search is done initially — no impact on credit.' },
    { id: 4, category: 'Products', name: 'Lender Products Overview 2026', type: 'PDF', size: '3.8 MB', tag: 'orange', content: 'Key products available:\n• Working Capital Loans — 3–36 months\n• Equipment Finance — up to 60 months\n• Commercial Mortgages — up to 25 years\n• Invoice Finance — revolving facility\n• Bridging Loans — 1–24 months' },
];

const TAG_COLORS = {
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', dot: 'bg-teal-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', dot: 'bg-violet-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
};

const KBModal = ({ onClose, onAddClick, initialDoc = null, allDocs = KB_TELE_DOCS }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selected, setSelected] = useState(initialDoc);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', ...new Set(allDocs.map(d => d.category))];
    const filtered = allDocs.filter(d =>
        (activeCategory === 'All' || d.category === activeCategory) &&
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`}>
                {/* header */}
                <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                            <IconBook width="14" height="14" className="text-teal-600" />
                        </div>
                        <div>
                            <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>Tele Agent Knowledge Base</p>
                            <p className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{KB_TELE_DOCS.length} resources available</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                        <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                    </button>
                </div>
                {/* search + category filter */}
                <div className={`px-4 pt-3 pb-2 shrink-0 flex flex-col gap-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
                        className={`w-full text-[11px] px-3 py-2 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-[#151932] border-white/10 text-[#e4ecff] placeholder-white/20 focus:border-teal-500' : 'bg-slate-50 border-slate-200 focus:border-teal-400 placeholder-slate-300'}`} />
                    <div className="flex gap-1.5 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`text-[9px] font-bold px-2.5 py-1 rounded-full transition-colors ${activeCategory === cat ? 'bg-teal-600 text-white' : (isDark ? 'bg-white/5 text-[#94abda] hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {/* body */}
                <div className="flex flex-1 min-h-0">
                    <div className={`w-56 shrink-0 border-r overflow-y-auto p-2 flex flex-col gap-1 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        {filtered.map(doc => {
                            const c = TAG_COLORS[doc.tag];
                            return (
                                <button key={doc.id} onClick={() => setSelected(doc)}
                                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${selected?.id === doc.id ? (isDark ? `bg-white/10 border-white/10` : `${c.bg} ${c.border} border`) : (isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-slate-50')}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                                        <span className={`text-[8px] font-bold uppercase tracking-wider ${c.text}`}>{doc.category}</span>
                                    </div>
                                    <p className={`text-[10px] font-semibold leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{doc.name}</p>
                                </button>
                            );
                        })}
                        {filtered.length === 0 && <p className={`text-[10px] text-center py-6 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>No results</p>}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {selected ? (
                            <div className="flex flex-col gap-3">
                                <div>
                                    <span className={`text-[8px] font-bold uppercase tracking-wider ${TAG_COLORS[selected.tag].text}`}>{selected.category}</span>
                                    <h3 className={`text-[13px] font-black mt-0.5 ${isDark ? 'text-[#e4ecff]' : 'text-slate-800'}`}>{selected.name}</h3>
                                </div>
                                <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : `${TAG_COLORS[selected.tag].bg} ${TAG_COLORS[selected.tag].border}`}`}>
                                    <pre className={`text-[10px] leading-relaxed whitespace-pre-wrap font-['Sora',sans-serif] ${isDark ? 'text-[#94abda]' : 'text-slate-700'}`}>{selected.content}</pre>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                {/* footer */}
                <div className={`px-4 py-2.5 border-t flex justify-between items-center shrink-0 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                    <span className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Tele Agent resources · Super Admin view</span>
                    <button onClick={onAddClick} className={`text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${isDark ? 'text-teal-400 bg-teal-500/15 hover:bg-teal-500/25' : 'text-teal-600 bg-teal-50 hover:bg-teal-100'}`}>
                        <IconPlus width="10" height="10" /> Add Resource
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── ADD RESOURCE POPUP ─────────────────── */
const AddResourcePopup = ({ onClose, onAdd }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [form, setForm] = useState({ name: '', category: 'Guides', type: 'PDF', content: '' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.content.trim()) return;
        onAdd({ ...form, id: Date.now(), tag: { Guides: 'blue', FAQs: 'violet', Products: 'orange' }[form.category] || 'blue', size: '—' });
        onClose();
    };
    const inputCls = `text-[11px] px-3 py-2 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-[#151932] border-white/10 text-[#e4ecff] placeholder-white/20 focus:border-teal-500' : 'bg-slate-50 border-slate-200 focus:border-teal-400 placeholder-slate-300'}`;
    const labelCls = `text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-[#546298]' : 'text-slate-500'}`;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`}>
                <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                            <IconPlus width="13" height="13" className="text-teal-600" />
                        </div>
                        <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>Add Resource</p>
                    </div>
                    <button onClick={onClose} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                        <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Resource Name</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. New Call Script Q2 2026" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Category</label>
                        <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                            {['Guides', 'FAQs', 'Products'].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Content / Notes</label>
                        <textarea value={form.content} onChange={e => set('content', e.target.value)} required rows={5}
                            placeholder="Paste the resource content or notes here..."
                            className={`${inputCls} resize-none leading-relaxed`} />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className={`text-[10px] font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'text-[#94abda] bg-white/5 hover:bg-white/10' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                        <button type="submit" className="text-[10px] font-bold text-white bg-teal-600 px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">Add Resource</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── KNOWLEDGE BASE CARD ────────────────── */
const KnowledgeBase = () => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [extraDocs, setExtraDocs] = useState([]);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const allDocs = [...KB_TELE_DOCS, ...extraDocs];
    const previewDocs = allDocs.slice(0, 3);

    return (
        <>
            <Card className="h-full">
                <CardHeader dotColor="#14b8a6" title="Knowledge Base" badge="Tele Agent" badgeClass="bg-teal-100 text-teal-600"
                    action={
                        <button onClick={() => setShowAdd(true)}
                            className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center hover:bg-teal-200 transition-colors">
                            <IconPlus width="12" height="12" />
                        </button>
                    }
                />
                <div className="p-2 flex flex-col gap-1.5">
                    {previewDocs.map((doc) => {
                        const c = TAG_COLORS[doc.tag];
                        return (
                            <div key={doc.id} onClick={() => setSelectedDoc(doc)}
                                className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors cursor-pointer group border border-transparent ${isDark ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                                    <IconBook width="14" height="14" className={c.text} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[12px] font-bold truncate ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{doc.name}</p>
                                    <p className={`text-[9px] font-black uppercase tracking-wider ${c.text}`}>{doc.category}</p>
                                </div>
                                <IconChevron width="11" height="11" className={`transition-colors ${isDark ? 'text-white/20 group-hover:text-white/40' : 'text-slate-300 group-hover:text-slate-500'}`} />
                            </div>
                        );
                    })}
                    <button onClick={() => setSelectedDoc(allDocs[0])}
                        className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-colors self-start flex items-center gap-1 mt-1 ${isDark ? 'text-teal-400 bg-teal-500/15 hover:bg-teal-500/25' : 'text-teal-600 bg-teal-50 hover:bg-teal-100'}`}>
                        View All ({allDocs.length})
                    </button>
                </div>
            </Card>
            {selectedDoc && (
                <KBModal
                    initialDoc={selectedDoc}
                    allDocs={allDocs}
                    onClose={() => setSelectedDoc(null)}
                    onAddClick={() => { setSelectedDoc(null); setShowAdd(true); }}
                />
            )}
            {showAdd && <AddResourcePopup onClose={() => setShowAdd(false)} onAdd={doc => setExtraDocs(p => [...p, doc])} />}
        </>
    );
};

/* ─── SOCIAL MEDIA ───────────────────────── */
const SocialMedia = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const channels = [
        { name: 'LinkedIn', followers: '4.2K', bg: 'bg-blue-700', posts: 12 },
        { name: 'Facebook', followers: '8.1K', bg: 'bg-blue-500', posts: 24 },
        { name: 'Instagram', followers: '2.9K', bg: 'bg-pink-600', posts: 18 },
        { name: 'Twitter/X', followers: '1.5K', bg: 'bg-slate-800', posts: 31 },
    ];
    return (
        <Card className="h-full">
            <CardHeader dotColor="#ec4899" title="Social Media" badge="Channels" badgeClass="bg-pink-100 text-pink-600" />
            <div className="p-3 grid grid-cols-2 gap-2 flex-1">
                {channels.map((ch, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex flex-col gap-1 ${isDark ? 'border-white/5 hover:border-white/10 hover:bg-white/5' : 'border-slate-100 hover:border-slate-200'}`}>
                        <div className={`w-6 h-6 rounded-lg ${ch.bg} flex items-center justify-center`}>
                            <IconSocial width="12" height="12" className="text-white" />
                        </div>
                        <p className={`text-[10px] font-bold ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{ch.name}</p>
                        <p className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{ch.followers} followers</p>
                        <span className={`text-[8px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{ch.posts} posts</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

/* ─── RIGHT SIDEBAR QUICK-LAUNCH BUTTON ─── */
const SidebarBtn = ({ icon, label, sub, iconBg, textColor, borderColor, onClick, disabled }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full xl:flex-1 flex flex-col items-center justify-center gap-1.5 px-1 py-2 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'} ${isDark ? 'bg-[#1e2347] border-white/5 hover:bg-[#242b58]' : `bg-white ${borderColor} hover:bg-slate-50`}`}
            style={{ minHeight: '72px' }}
        >
            <div className={`w-9 h-9 xl:w-8 xl:h-8 rounded-xl ${iconBg} flex items-center justify-center shadow-sm shrink-0`}>
                {React.cloneElement(icon, { width: 18, height: 18 })}
            </div>
            <div className="text-center px-1">
                <p className={`text-[10px] xl:text-[9px] font-black ${textColor} leading-tight`}>{label}</p>
                <p className={`text-[7.5px] xl:text-[7px] uppercase tracking-wider mt-0.5 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{sub}</p>
            </div>
        </button>
    );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const SuperAdminDashboard = ({ onNavigate }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showOnlineUsers, setShowOnlineUsers] = useState(false);
    const { leads } = useLeads();
    const { lenders } = useLenders();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [statModal, setStatModal] = useState(null); // 'leads' | 'pending-leads' | 'pending-docs'
    const onlineUsers = SHARED_INITIAL_USERS.filter(u => u.status === 'Active').length;
    const totalTeams = SHARED_INITIAL_USERS.filter(u => u.role === 'Team Leader').length;
    const pendingLeads = leads.filter(l => l.stage === 'Lender Selection').length;
    const pendingDocs = leads.reduce((acc, lead) => acc + (lead.documents || []).filter(d => d.status === 'Pending').length, 0);
    const totalLoan = leads.reduce((acc, l) => acc + (parseFloat((l.loanAmount || '').replace(/[^0-9.]/g, '')) || 0), 0);
    const loanDisplay = totalLoan >= 1_000_000 ? `${(totalLoan / 1_000_000).toFixed(1)}M` : totalLoan > 0 ? `$${totalLoan.toLocaleString()}` : SA_STATS.monthlyRevenue;

    return (
        <div className={`w-full font-['Sora',sans-serif] animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col pb-8 ${isDark ? 'text-[#e4ecff]' : ''}`}>
            {/* ── OUTER: main content + right sidebar ── */}
            <div className="flex xl:flex-col gap-2 p-2 flex-1 min-h-0 items-stretch">

                {/* ── LEFT / MAIN CONTENT ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-2 xl:gap-2 min-h-0">

                    {/* ROW 1 — 6 stat tiles */}
                    <div className="grid grid-cols-6 xl:grid-cols-3 md:grid-cols-2 gap-2 xl:gap-3">
                        <StatTile icon={<IconUsers width="18" height="18" />} value={SA_STATS.totalLeads} label="Total Leads" iconBg="bg-blue-600" tileBg="bg-blue-50/60" tileBorder="border-blue-200" darkBg="bg-[#1c2340]" darkBorder="border-blue-500/30" darkText="text-blue-300" onClick={() => setStatModal('leads')} />
                        <StatTile icon={<IconMoney width="18" height="18" />} value={loanDisplay} label="Total Loan Amount" iconBg="bg-orange-500" tileBg="bg-orange-50/60" tileBorder="border-orange-200" darkBg="bg-[#2a1e10]" darkBorder="border-orange-500/30" darkText="text-orange-300" />
                        <StatTile icon={<IconClock width="18" height="18" />} value={pendingLeads} label="Pending Lender Approvals" iconBg="bg-amber-500" tileBg="bg-amber-50/60" tileBorder="border-amber-200" darkBg="bg-[#282315]" darkBorder="border-amber-500/30" darkText="text-amber-300" onClick={() => setStatModal('pending-leads')} />
                        <StatTile icon={<IconDoc width="18" height="18" />} value={pendingDocs} label="Pending Doc Approvals" iconBg="bg-rose-500" tileBg="bg-rose-50/60" tileBorder="border-rose-200" darkBg="bg-[#2a1a1c]" darkBorder="border-rose-500/30" darkText="text-rose-300" onClick={() => setStatModal('pending-docs')} />
                        <StatTile icon={<IconTeam width="18" height="18" />} value={totalTeams} label="Total Teams" iconBg="bg-violet-600" tileBg="bg-violet-50/60" tileBorder="border-violet-200" darkBg="bg-[#251a3a]" darkBorder="border-violet-500/30" darkText="text-violet-300" onClick={() => onNavigate?.('team-leaders')} />
                        <StatTile icon={<IconOnline width="18" height="18" />} value={onlineUsers} label="Online Users" iconBg="bg-emerald-600" tileBg="bg-emerald-50/60" tileBorder="border-emerald-200" darkBg="bg-[#182724]" darkBorder="border-emerald-500/30" darkText="text-emerald-300" onClick={() => setShowOnlineUsers(true)} />
                    </div>

                    {/* ROW 2 — Task Schedule | Agent Performance | Notes */}
                    <div className="grid grid-cols-3 xl:grid-cols-2 lg:grid-cols-1 gap-2 xl:gap-3">
                        <TaskSchedule />
                        <AgentPerformance />
                        <Notes />
                    </div>

                    {/* ROW 3 — Pending Payouts | Licenses & Insurance | Knowledge Base */}
                    <div className="grid grid-cols-3 xl:grid-cols-2 lg:grid-cols-1 gap-2 xl:gap-3">
                        <PendingPayouts onNavigate={onNavigate} leads={leads} />
                        <LicensesInsurance />
                        <KnowledgeBase />
                    </div>

                </div>

                {/* ── RIGHT SIDEBAR — quick-launch buttons ── */}
                <div className="w-[85px] xl:w-full shrink-0 flex flex-col xl:flex-row xl:flex-wrap gap-1.5 xl:gap-2 self-start min-h-0">
                    <SidebarBtn
                        icon={<IconMSTeams width="22" height="22" className="text-white" />}
                        label="MS Teams"
                        sub="Open Hub"
                        iconBg="bg-indigo-600"
                        textColor="text-indigo-700"
                        borderColor="border-indigo-200 hover:border-indigo-300 bg-indigo-50/60"
                        onClick={() => window.open('msteams://', '_blank')}
                    />
                    <SidebarBtn
                        icon={<IconHR width="20" height="20" className="text-blue-600" />}
                        label="Accounts & HR"
                        sub="Enter Portal"
                        iconBg="bg-blue-100"
                        textColor="text-blue-700"
                        borderColor="border-blue-200 hover:border-blue-300 bg-blue-50/60"
                        onClick={() => onNavigate?.('accounts-hr')}
                    />
                    <SidebarBtn
                        icon={<IconPromo width="20" height="20" className="text-pink-600" />}
                        label="Lender Promos"
                        sub="View Offers"
                        iconBg="bg-pink-100"
                        textColor="text-pink-700"
                        borderColor="border-pink-200 hover:border-pink-300 bg-pink-50/60"
                        onClick={() => onNavigate?.('promotions')}
                    />
                    <SidebarBtn
                        icon={<IconSocial width="20" height="20" className="text-purple-600" />}
                        label="Social Media"
                        sub="Channels"
                        iconBg="bg-purple-100"
                        textColor="text-purple-700"
                        borderColor="border-purple-200 hover:border-purple-300 bg-purple-50/60"
                        onClick={() => { }}
                    />
                    <SidebarBtn
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" className="text-sky-600"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>}
                        label="Email"
                        sub="Compose"
                        iconBg="bg-sky-100"
                        textColor="text-sky-700"
                        borderColor="border-sky-200 hover:border-sky-300 bg-sky-50/60"
                        onClick={() => window.open('mailto:', '_blank')}
                    />
                    <SidebarBtn
                        icon={<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.432l-.372-.22-3.853.925.944-3.792-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>}
                        label="WhatsApp"
                        sub="Message"
                        iconBg="bg-green-100"
                        textColor="text-green-700"
                        borderColor="border-green-200 hover:border-green-300 bg-green-50/60"
                        onClick={() => window.open('whatsapp://', '_blank')}
                    />
                    <SidebarBtn
                        icon={<IconUsers width="20" height="20" className="text-slate-500" />}
                        label="Field Agent"
                        sub="Coming Soon"
                        iconBg="bg-slate-200"
                        textColor="text-slate-500"
                        borderColor="border-slate-200"
                        disabled
                    />
                </div>

            </div>

            {/* ── ONLINE USERS POPUP ── */}
            {/* ── STAT MODALS ── */}
            {statModal && (() => {
                const allLeads = leads;
                const pendingLeadsList = leads.filter(l => l.stage === 'Lender Selection');
                const pendingDocLeads = leads.filter(l => (l.documents || []).some(d => d.status === 'Pending'));

                const data = statModal === 'leads' ? allLeads
                    : statModal === 'pending-leads' ? pendingLeadsList
                        : pendingDocLeads;

                const titles = { leads: 'Total Leads', 'pending-leads': 'Pending Lender Approvals', 'pending-docs': 'Pending Document Approvals' };
                const accents = { leads: 'blue', 'pending-leads': 'amber', 'pending-docs': 'rose' };
                const ac = accents[statModal];

                const STAGE_COLORS = {
                    'Document Collection': 'bg-blue-100 text-blue-700',
                    'Document Verification Done': 'bg-teal-100 text-teal-700',
                    'Lender Selection': 'bg-amber-100 text-amber-700',
                    'Completed': 'bg-emerald-100 text-emerald-700',
                    'Rejected': 'bg-rose-100 text-rose-700',
                    'Pending': 'bg-slate-100 text-slate-600',
                };

                return (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setStatModal(null)}>
                        <div className={`rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col animate-fadeIn overflow-hidden ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                            {/* header */}
                            <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-${ac}-500`} />
                                    <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{titles[statModal]}</p>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-${ac}-100 text-${ac}-700`}>{data.length} records</span>
                                </div>
                                <button onClick={() => setStatModal(null)} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                                    <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                                </button>
                            </div>
                            {/* table */}
                            <div className="overflow-auto flex-1">
                                {data.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#151932]' : 'bg-slate-50'}`}>
                                            <tr>
                                                {['#', 'Lead', 'Business', 'Agent', 'Loan Amount', 'Stage'].map(h => (
                                                    <th key={h} className={`px-3 py-2.5 text-[9px] font-black uppercase tracking-widest border-b ${isDark ? 'text-[#546298] border-white/5' : 'text-slate-400 border-slate-100'}`}>{h}</th>
                                                ))}
                                                {statModal === 'pending-docs' && <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Pending Docs</th>}
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                            {data.map((lead, idx) => {
                                                const pendingDocCount = (lead.documents || []).filter(d => d.status === 'Pending').length;
                                                return (
                                                    <tr key={lead.id}
                                                        className={`transition-colors cursor-pointer group ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/40'}`}
                                                        onClick={() => { setStatModal(null); onNavigate?.('lead-details', lead); }}
                                                    >
                                                        <td className={`px-3 py-2 text-[10px] font-bold ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{idx + 1}</td>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-[9px] font-black shrink-0">
                                                                    {(lead.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-[11px] font-bold ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{lead.name}</p>
                                                                    <p className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{lead.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`px-3 py-2 text-[11px] ${isDark ? 'text-[#94abda]' : 'text-slate-600'}`}>{lead.businessName || '—'}</td>
                                                        <td className={`px-3 py-2 text-[11px] ${isDark ? 'text-[#94abda]' : 'text-slate-600'}`}>{lead.agentName || '—'}</td>
                                                        <td className="px-3 py-2 text-[11px] font-bold text-blue-500">{lead.loanAmount || '—'}</td>
                                                        <td className="px-3 py-2">
                                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${STAGE_COLORS[lead.stage || lead.status] || 'bg-slate-100 text-slate-600'}`}>
                                                                {lead.stage || lead.status}
                                                            </span>
                                                        </td>
                                                        {statModal === 'pending-docs' && (
                                                            <td className="px-3 py-2">
                                                                <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">{pendingDocCount} pending</span>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className={`py-16 text-center text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>No records found</div>
                                )}
                            </div>
                            {/* footer */}
                            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                                <span className="text-[9px] text-slate-400">{data.length} total records</span>
                                <button onClick={() => { setStatModal(null); onNavigate?.('operational-flow'); }}
                                    className="text-[9px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                                    View in Operational Flow <IconChevron width="10" height="10" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {showOnlineUsers && (
                <OnlineUsersPopup
                    onClose={() => setShowOnlineUsers(false)}
                    onUserClick={(u) => { setSelectedUser(u); setShowOnlineUsers(false); }}
                    onNavigate={onNavigate}
                />
            )}

            {selectedUser && (
                <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} onUserClick={(u) => setSelectedUser(u)} />
            )}
        </div>
    );
};

export default SuperAdminDashboard;
