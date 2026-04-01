import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { useLeads } from '../../../context/LeadsContext';
import { INITIAL_MEMBERSHIPS, MOCK_LEAD_COUNTS, RECENT_LENDERS, LENDER_TYPE_COLORS } from '../../../data/dummyData';
import { useTasks } from '../../../context/TasksContext';
import { usePromotions } from '../../../context/PromotionsContext';
import { DocumentPreviewModal } from '../../shared/promotions/LenderPromotionsView';
import TaskModal from '../../../components/modals/TaskModal';

/* ─── SVG ICONS ─── */
const IconUsers = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...p}><polyline points="20 6 9 17 4 12" /></svg>;
const IconClock = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconTeam = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconCalendar = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IconNote = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>;
const IconCalc = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="16" y2="18" /></svg>;
const IconBank = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconPin = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11" {...p}><path d="M21 4.5a2.5 2.5 0 0 0-2.5-2.5h-13a2.5 2.5 0 0 0-2.5 2.5V8c0 1.25.9 2.3 2.1 2.5l2.4.4V14l-1.5 1.5 1.5 1.5 1.5-1.5L10 14V10.9l2.4-.4c1.2-.2 2.1-1.25 2.1-2.5V4.5z" /></svg>;
const IconArrow = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IconMail = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;

/* ─── MODAL ─── */
const DashboardModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#1e2347] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-zoomIn">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-[#2c3568] shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c3568] rounded-full transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[80vh] custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};

/* ─── MAIN COMPONENT ─── */
const AMDashboard = ({ onNavigate, tasks: initialTasks = [], notifyReminderSet }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { users } = useUsers();
    const { leads } = useLeads();
    const { promotions } = usePromotions();
    const { addTask, updateTask } = useTasks();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const memoizedPromotions = React.useMemo(() => promotions.map(p => ({
        id: `promo-${p.id}`, title: `PROMO: ${p.lenderName}`, lead: p.description,
        date: p.startDate, endDate: p.endDate, time: '09:00', type: 'Promotion',
        status: 'Active', isPromotion: true, priority: 'High',
        fileName: p.fileName, fileData: p.fileData
    })), [promotions]);

    const tasks = React.useMemo(() => [...initialTasks, ...memoizedPromotions], [initialTasks, memoizedPromotions]);

    const [activeModal, setActiveModal] = useState(null);
    const [leadsTab, setLeadsTab] = useState('my_leads');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedPromoDetails, setSelectedPromoDetails] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);

    // Notes state
    const [notesList, setNotesList] = useState(() => {
        try {
            const arr = JSON.parse(localStorage.getItem('am_notes_list'));
            return arr && arr.length > 0 ? arr : [];
        } catch { return []; }
    });
    const [newNote, setNewNote] = useState('');

    // Calculator state
    const [loanAmount, setLoanAmount] = useState(100000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [loanTerm, setLoanTerm] = useState(24);

    // Calendar state
    const today = new Date();
    const getPadded = (n) => String(n).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${getPadded(today.getMonth() + 1)}-${getPadded(today.getDate())}`;
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', lead: '', date: todayStr, time: '12:00', type: 'Call', reminder: 'none' });

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const isToday = (d) => d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const teamLeaders = users ? users.filter(u => u.role === 'Team Leader') : [];

    // Lead counts
    const myLeads = (leads || []).filter(l => l.status !== 'Completed');
    const verifiedLeads = (leads || []).filter(l => l.stage === 'Document Verification Done' || l.status === 'Document Verification Done');
    const pendingApproval = (leads || []).filter(l => l.stage === 'Lender Selection' || l.status === 'Lender Selection');
    const totalTeams = teamLeaders.length;

    const calculateRepayment = () => {
        const p = parseFloat(loanAmount), r = (parseFloat(interestRate) / 100) / 12, n = parseInt(loanTerm);
        if (!p || !n) return '0.00';
        if (r === 0) return (p / n).toFixed(2);
        return (p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)).toFixed(2);
    };

    const addNewNote = () => {
        if (!newNote.trim()) return;
        const now = new Date();
        const note = { id: Date.now(), text: newNote.trim(), date: `${now.getFullYear()}-${getPadded(now.getMonth() + 1)}-${getPadded(now.getDate())}`, time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isPinned: false };
        const updated = [note, ...notesList];
        setNotesList(updated);
        localStorage.setItem('am_notes_list', JSON.stringify(updated));
        setNewNote('');
    };

    const togglePin = (id) => {
        const pinned = notesList.filter(n => n.isPinned).length;
        const note = notesList.find(n => n.id === id);
        if (!note.isPinned && pinned >= 3) { alert('Max 3 pinned notes.'); return; }
        const updated = notesList.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
        setNotesList(updated);
        localStorage.setItem('am_notes_list', JSON.stringify(updated));
    };

    const deleteNote = (id) => {
        const updated = notesList.filter(n => n.id !== id);
        setNotesList(updated);
        localStorage.setItem('am_notes_list', JSON.stringify(updated));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const taskToAdd = { ...newTask, id: Date.now(), status: 'Pending', createdBy: user.role || 'Accounts Manager', assignedTo: user.id?.toString() || 'Self' };
        addTask(taskToAdd);
        if (notifyReminderSet) notifyReminderSet(taskToAdd);
        setIsAddingTask(false);
        setNewTask({ title: '', lead: '', date: todayStr, time: '12:00', type: 'Call', reminder: 'none' });
    };

    const updateTaskStatus = (id, newStatus) => updateTask({ ...tasks.find(t => t.id === id), status: newStatus });

    const renderModalContent = () => {
        switch (activeModal) {
            case 'MY_LEADS':
            case 'VERIFIED':
            case 'PENDING': {
                const currentUserName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
                const allMyLeads = (leads || []).filter(l => (l.assignedStaffId === user.id || l.agentName === currentUserName || l.createdBy === currentUserName) && l.status !== 'Completed');
                const verList = (leads || []).filter(l => l.stage === 'Document Verification Done' || l.status === 'Document Verification Done');
                const pendList = (leads || []).filter(l => l.stage === 'Lender Selection' || l.status === 'Lender Selection');
                const list = activeModal === 'MY_LEADS' ? allMyLeads : activeModal === 'VERIFIED' ? verList : pendList;
                return (
                    <div className="flex flex-col gap-3">
                        {list.length > 0 ? (
                            <div className="rounded-xl border border-slate-100 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {list.map((lead, idx) => (
                                            <tr key={lead.id} className="hover:bg-blue-50/40 transition-all cursor-pointer" onClick={() => { onNavigate && onNavigate('leads'); setActiveModal(null); }}>
                                                <td className="px-4 py-3 text-[11px] font-bold text-slate-400">{idx + 1}</td>
                                                <td className="px-4 py-3 text-[12px] font-bold text-[#2447d7]">{lead.name}</td>
                                                <td className="px-4 py-3 text-[12px] text-slate-600">{lead.businessName || '—'}</td>
                                                <td className="px-4 py-3"><span className="text-[10px] font-black px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase">{lead.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest border border-dashed border-slate-200 rounded-2xl">No leads found</div>}
                    </div>
                );
            }
            case 'TOTAL_TEAMS': {
                return (
                    <div className="flex flex-col gap-3">
                        {teamLeaders.map((tl) => {
                            const members = INITIAL_MEMBERSHIPS[tl.id] || [];
                            return (
                                <div key={tl.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-[#2447d7]/30 transition-all" onClick={() => { setSelectedTeam({ ...tl, members }); setActiveModal(null); }}>
                                    <div className="w-10 h-10 rounded-xl bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center font-black text-sm">{tl.initials}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[13px] text-slate-800">{tl.name}</div>
                                        <div className="text-[11px] text-slate-400 font-medium">{members.length} members</div>
                                    </div>
                                    <IconArrow className="text-slate-300" />
                                </div>
                            );
                        })}
                    </div>
                );
            }
            default: return null;
        }
    };

    const modalTitles = { MY_LEADS: 'My Leads', VERIFIED: 'Verified Leads', PENDING: 'Pending Lead Approval', TOTAL_TEAMS: 'All Teams' };

    return (
        <div className="w-full flex flex-col font-['Sora',sans-serif] animate-fadeIn p-2 gap-3 h-[calc(100vh-140px)] lg:h-[calc(100vh-116px)] sm:h-[calc(100vh-108px)]">

            {/* ROW 1: 6 STAT TILES */}
            <div className="grid grid-cols-6 gap-3 shrink-0">
                {/* My Leads */}
                <div onClick={() => setActiveModal('MY_LEADS')} className="bg-blue-100/40 dark:bg-[#1c2340] rounded-2xl border border-blue-200 dark:border-blue-500/30 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer min-h-[130px] text-center hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center mb-0.5 shadow-md shadow-blue-600/20"><IconUsers width="22" height="22" /></div>
                    <h2 className="text-3xl font-black leading-none text-blue-700 dark:text-blue-300">{myLeads.length}</h2>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">MY LEADS</span>
                </div>

                {/* Create Lead */}
                <div onClick={() => onNavigate && onNavigate('lender_selection')} className="bg-rose-100/40 dark:bg-[#2a1a1c] rounded-2xl border border-rose-200 dark:border-rose-500/30 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer min-h-[130px] text-center hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center mb-1 shadow-md shadow-rose-600/20"><IconPlus width="22" height="22" /></div>
                    <h2 className="text-[14px] font-black leading-tight text-rose-700 dark:text-rose-300">CREATE<br />LEAD</h2>
                </div>

                {/* Verified Leads */}
                <div onClick={() => setActiveModal('VERIFIED')} className="bg-emerald-100/40 dark:bg-[#182724] rounded-2xl border border-emerald-200 dark:border-emerald-500/30 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer min-h-[130px] text-center hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-0.5 shadow-md shadow-emerald-500/20"><IconCheck width="22" height="22" /></div>
                    <h2 className="text-3xl font-black leading-none text-emerald-700 dark:text-emerald-300">{verifiedLeads.length}</h2>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">VERIFIED</span>
                </div>

                {/* Pending Lead Approval */}
                <div onClick={() => setActiveModal('PENDING')} className="bg-amber-100/40 dark:bg-[#282315] rounded-2xl border border-amber-200 dark:border-amber-500/30 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer min-h-[130px] text-center hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center mb-0.5 shadow-md shadow-amber-500/20"><IconClock width="22" height="22" /></div>
                    <h2 className="text-3xl font-black leading-none text-amber-700 dark:text-amber-300">{pendingApproval.length}</h2>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-tight">PENDING</span>
                </div>

                {/* Total Teams */}
                <div onClick={() => setActiveModal('TOTAL_TEAMS')} className="bg-purple-100/40 dark:bg-[#251a3a] rounded-2xl border border-purple-200 dark:border-purple-500/30 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer min-h-[130px] text-center hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center mb-0.5 shadow-md shadow-purple-600/20"><IconTeam width="22" height="22" /></div>
                    <h2 className="text-3xl font-black leading-none text-purple-700 dark:text-purple-300">{totalTeams}</h2>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">TEAMS</span>
                </div>

                {/* MS Teams Connect */}
                <div onClick={() => window.open('msteams://', '_blank')} className="bg-[#5b5fc7]/10 dark:bg-[#5b5fc7]/20 rounded-2xl border border-[#5b5fc7]/30 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer min-h-[130px] text-center hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-full bg-[#5b5fc7] text-white flex items-center justify-center mb-1 shadow-md shadow-[#5b5fc7]/30">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12.5 13.5c1.38 0 2.5 1.12 2.5 2.5v1h-5v-1c0-1.38 1.12-2.5 2.5-2.5zm0-4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm.5 11c1.93 0 3.5-1.57 3.5-3.5v-1c0-.28-.22-.5-.5-.5H9c-.28 0-.5.22-.5.5v1c0 1.93 1.57 3.5 3.5 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>
                    </div>
                    <h2 className="text-[14px] font-black leading-tight text-[#5b5fc7] dark:text-[#a6a9ef]">CONNECT<br />TEAMS</h2>
                </div>
            </div>

            {/* ROW 2: Schedule(2) | Notes+Cal+Calc(4) | Lenders(2) */}
            <div className="grid grid-cols-8 gap-3 flex-1 min-h-0">

                {/* SCHEDULE */}
                <div className="col-span-2 bg-white dark:bg-[#1e2347] rounded-[20px] border border-slate-100 dark:border-white/5 flex flex-col min-h-0 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5 p-2.5 px-4 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-1.5"><IconCalendar className="text-slate-400"/><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule</span></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-slate-200 dark:bg-slate-700 font-bold px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300">{tasks.filter(t => t.date === selectedDate).length}</span>
                            <button onClick={() => setIsAddingTask(true)} className="w-5 h-5 bg-[#2447d7] text-white rounded flex items-center justify-center hover:bg-[#1a32a3] transition-colors" title="Add task">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                            <button onClick={() => onNavigate && onNavigate('tasks_followups')} className="text-[9px] font-bold text-[#2447d7] hover:underline">All</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2">
                        {tasks.filter(t => t.date === selectedDate).length > 0 ? tasks.filter(t => t.date === selectedDate).map(t => (
                            <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5 hover:border-[#2447d7] transition-all group shrink-0">
                                <div className="flex justify-between items-start mb-1 gap-2">
                                    <span className="text-[11px] font-bold dark:text-white leading-tight group-hover:text-[#2447d7] transition-colors">{t.title}</span>
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded uppercase shrink-0">{t.type || 'TASK'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <IconClock width="10" height="10" className="text-slate-300"/>
                                    <span>{t.time}</span>
                                    {t.lead && <><span>�</span><span className="truncate">{t.lead}</span></>}
                                </div>
                                {!t.isPromotion && (
                                    <select className={`mt-2 w-full py-1 px-2 text-[10px] font-black uppercase tracking-widest border outline-none transition-all cursor-pointer rounded-lg ${t.status === 'Completed' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : t.status === 'In Progress' ? 'bg-[#ebf5ff] text-[#2447d7] border-[#d9ebff]' : 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]'}`} value={t.status} onChange={e => updateTaskStatus(t.id, e.target.value)}>
                                        <option>Pending</option><option>In Progress</option><option>Completed</option>
                                    </select>
                                )}
                            </div>
                        )) : <div className="text-[9px] text-slate-400 italic p-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-1">No tasks for this day</div>}
                    </div>
                </div>

                {/* MIDDLE � col 3-5: Notes+Calendar top, Calculator bottom */}
                <div className="col-span-4 flex flex-col gap-3 min-h-0">
                    <div className="flex gap-3 flex-1 min-h-0">

                        {/* NOTES � col 1-2 */}
                        <div className="flex-1 bg-[#fffdf0] dark:bg-[#343224] rounded-[20px] border border-yellow-200/50 dark:border-yellow-700/30 flex flex-col min-h-0 shadow-sm overflow-hidden">
                            <div className="bg-[#fff9c4] dark:bg-[#4d4826] border-b border-yellow-200/50 dark:border-yellow-700/30 p-2.5 px-4 shrink-0 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-yellow-700 dark:text-yellow-500"><IconNote /><span className="text-[10px] font-black uppercase tracking-widest">Notes</span></div>
                                <button onClick={() => { if (window.confirm('Clear all notes?')) { setNotesList([]); localStorage.setItem('am_notes_list', '[]'); } }} className="text-[9px] font-bold text-yellow-700/60 hover:text-red-600 transition-colors uppercase tracking-widest">Clear All</button>
                            </div>
                            <div className="flex-1 p-3 pb-2 flex flex-col min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 mb-2 pr-1">
                                    {notesList.length === 0 ? (
                                        <div className="text-xs text-yellow-700/50 italic text-center mt-4 border border-dashed border-yellow-200 dark:border-yellow-800 p-4 rounded-xl">No notes yet. Type below to start!</div>
                                    ) : [...notesList].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map(note => (
                                        <div key={note.id} className={`p-2.5 rounded-xl text-[11px] relative group transition-all border shrink-0 ${note.isPinned ? 'bg-yellow-100 dark:bg-yellow-600/30 border-yellow-300 dark:border-yellow-500/50 text-yellow-900 dark:text-yellow-50 shadow-sm' : 'bg-white/60 dark:bg-black/20 border-yellow-100 dark:border-yellow-700/20 text-yellow-900 dark:text-yellow-100'}`}>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    {note.isPinned && <IconPin className="text-yellow-600 dark:text-yellow-400" />}
                                                    <span className="text-[9px] font-black text-yellow-600 dark:text-yellow-500/80 uppercase tracking-widest">{note.date} {note.time && `� ${note.time}`}</span>
                                                </div>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => togglePin(note.id)} className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${note.isPinned ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-500' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-300'}`}>{note.isPinned ? 'UNPIN' : 'PIN'}</button>
                                                    <button onClick={() => deleteNote(note.id)} className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold hover:bg-red-200 transition-colors">CLEAR</button>
                                                </div>
                                            </div>
                                            <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="shrink-0 flex gap-2 pt-2 border-t border-yellow-200/50 dark:border-yellow-700/30">
                                    <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNewNote()} placeholder="Type a note & press Enter..." className="flex-1 bg-white/60 dark:bg-black/20 border border-yellow-200/60 dark:border-yellow-700/50 rounded-lg px-3 py-1.5 text-[11px] text-yellow-900 dark:text-yellow-100 outline-none focus:border-yellow-400 transition-colors" />
                                    <button onClick={addNewNote} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black text-[10px] px-3 py-1.5 rounded-lg transition-colors shrink-0">ADD</button>
                                </div>
                            </div>
                        </div>

                        {/* CALENDAR */}
                        <div className="bg-white dark:bg-[#1e2347] rounded-[20px] border border-slate-100 dark:border-white/5 flex flex-col shadow-sm overflow-hidden shrink-0 w-[210px]">
                            <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5 p-2.5 px-3 shrink-0">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calendar</span>
                            </div>
                            <div className="p-2 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <button onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))} className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded text-slate-500 hover:bg-[#ebf0ff] hover:text-[#2447d7] transition-all">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10"><polyline points="15 18 9 12 15 6"/></svg>
                                    </button>
                                    <span className="text-[9px] font-black text-slate-600 dark:text-slate-300">{monthName}</span>
                                    <button onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))} className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded text-slate-500 hover:bg-[#ebf0ff] hover:text-[#2447d7] transition-all">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10"><polyline points="9 18 15 12 9 6"/></svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-0.5">
                                    {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="text-center text-[7px] font-black text-slate-400 uppercase">{d}</div>)}
                                    {[...Array(emptySlots)].map((_, i) => <div key={`e-${i}`} className="aspect-square"/>)}
                                    {calendarDays.map(day => {
                                        const dateStr = `${currentYear}-${getPadded(currentMonth + 1)}-${getPadded(day)}`;
                                        const hasTasks = tasks.some(t => t.date === dateStr);
                                        const isSel = selectedDate === dateStr;
                                        const isTod = isToday(day);
                                        return (
                                            <div key={day} onClick={() => setSelectedDate(dateStr)} className={`aspect-square flex items-center justify-center rounded cursor-pointer relative transition-all border border-transparent ${isTod && !isSel ? 'bg-[#eef2ff] border-[#2447d7]/20' : isSel ? 'bg-[#2447d7] shadow-sm' : 'hover:bg-slate-50'}`}>
                                                <span className={`text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${isTod ? 'bg-[#2447d7] text-white' : isSel ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{day}</span>
                                                {hasTasks && !isSel && <span className="absolute bottom-0 w-0.5 h-0.5 bg-[#2447d7] rounded-full"/>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CALCULATOR */}
                    <div className="bg-white dark:bg-[#1e2347] rounded-[20px] border border-slate-100 dark:border-white/5 flex flex-col shrink-0 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5 p-2.5 px-4 shrink-0 flex items-center gap-1.5">
                            <IconCalc className="text-slate-400"/><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loan Calculator</span>
                        </div>
                        <div className="p-3 flex flex-col gap-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount ($)</label>
                                    <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-bold dark:text-white outline-none focus:border-[#2447d7] transition-colors w-full"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rate (%)</label>
                                    <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-bold dark:text-white outline-none focus:border-[#2447d7] transition-colors w-full"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Term (mo)</label>
                                    <input type="number" value={loanTerm} onChange={e => setLoanTerm(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-bold dark:text-white outline-none focus:border-[#2447d7] transition-colors w-full"/>
                                </div>
                            </div>
                            <div className="bg-[#ebf0ff] dark:bg-[#2447d7]/20 rounded-xl p-3 flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#2447d7] uppercase tracking-widest">Monthly Repayment</span>
                                <span className="text-[18px] font-black text-[#2447d7]">${calculateRepayment()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LENDERS � col 6-7 */}
                <div className="col-span-2 bg-white dark:bg-[#1e2347] rounded-[20px] border border-slate-100 dark:border-white/5 flex flex-col min-h-0 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5 p-2.5 px-4 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-1.5"><IconBank className="text-slate-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Promotions / Lenders</span></div>
                        <button onClick={() => onNavigate && onNavigate('lenders')} className="text-[9px] font-bold text-[#2447d7] hover:underline">All &#x2192;</button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
                        {/* Active Promotions */}
                        {promotions.filter(p => { const d = todayStr; return d >= p.startDate && d <= p.endDate; }).slice(0, 2).map(promo => (
                            <div key={promo.id} onClick={() => setSelectedPromoDetails(promo)} className="p-3 bg-blue-50/70 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer shrink-0">
                                <div className="flex justify-between items-center mb-1 gap-2">
                                    <span className="text-[11px] font-black text-blue-800 dark:text-blue-300 uppercase tracking-tight truncate">{promo.lenderName}</span>
                                    <span className="text-[7px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black tracking-widest uppercase shrink-0">PROMO</span>
                                </div>
                                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-tight line-clamp-2">{promo.description}</p>
                                <div className="flex items-center gap-1 text-[9px] text-blue-500 mt-1.5">
                                    <IconCalendar width="10" height="10" />
                                    <span>{promo.startDate} → {promo.endDate}</span>
                                </div>
                            </div>
                        ))}
                        {/* Recent Lenders */}
                        {RECENT_LENDERS.slice(0, 4).map((lender) => {
                            const tc = LENDER_TYPE_COLORS[lender.type] || LENDER_TYPE_COLORS['Major Bank'];
                            return (
                                <div key={lender.id} onClick={() => onNavigate && onNavigate('lenders', lender)} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5 hover:border-[#2447d7]/30 hover:bg-white transition-all cursor-pointer shrink-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg, color: tc.color }}>
                                                <IconBank width="14" height="14" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[12px] font-bold text-slate-800 dark:text-white truncate">{lender.name}</div>
                                                <div className="text-[10px] text-slate-400">Rate: {lender.interestRate} · Max: {lender.maxLoan}</div>
                                            </div>
                                        </div>
                                        <span className="inline-flex text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0" style={{ backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{lender.type}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-3 shrink-0 border-t border-slate-100 dark:border-white/5">
                        <button onClick={() => onNavigate && onNavigate('lenders')} className="w-full py-2 bg-[#2447d7] text-white rounded-xl text-[11px] font-bold hover:bg-[#1732a3] transition-colors flex items-center justify-center gap-1.5">
                            View All Lenders <IconArrow />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <DashboardModal isOpen={!!activeModal && activeModal !== null} onClose={() => setActiveModal(null)} title={modalTitles[activeModal] || ''}>
                {renderModalContent()}
            </DashboardModal>

            {/* Promo Details Modal */}
            {selectedPromoDetails && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[9999] p-6 animate-fadeIn" onClick={() => setSelectedPromoDetails(null)}>
                    <div className="w-full max-w-lg bg-white dark:bg-[#1e2347] rounded-3xl shadow-2xl overflow-hidden animate-slideUp flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-blue-50 dark:bg-[#141829]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-[#242b58] text-blue-600 dark:text-[#8ea0d4] flex items-center justify-center shadow-inner">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Promotion Details</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Promotion</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPromoDetails(null)} className="p-2 hover:bg-blue-100 dark:hover:bg-[#2c3568] rounded-xl transition-colors text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[22px] font-black text-slate-900 dark:text-white">{selectedPromoDetails.lenderName}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black uppercase tracking-wider rounded border border-[#10b981]/20">Active Now</span>
                                    <span className="text-[11px] font-bold text-slate-500">{selectedPromoDetails.startDate} → {selectedPromoDetails.endDate}</span>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                                <p className="text-[13px] text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">{selectedPromoDetails.description}</p>
                            </div>
                            {selectedPromoDetails.fileData && (
                                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-[#1a2244]/50 border border-blue-100 dark:border-[#2c3568] rounded-2xl">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#242b58] text-[#2447d7] dark:text-[#8ea0d4] shadow-sm flex items-center justify-center border border-slate-100 dark:border-white/5 shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                                        </div>
                                        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate">{selectedPromoDetails.fileName}</span>
                                    </div>
                                    <div className="flex gap-2 shrink-0 ml-4">
                                        <button onClick={() => setPreviewFile(selectedPromoDetails)} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-50 transition-all shadow-sm">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Preview
                                        </button>
                                        <a href={selectedPromoDetails.fileData} download={selectedPromoDetails.fileName} className="flex items-center gap-2 px-4 py-2 bg-[#2447d7] text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#1732a3] transition-all shadow-md no-underline">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-[#141829] border-t border-slate-100 dark:border-white/5 flex justify-center">
                            <button onClick={() => setSelectedPromoDetails(null)} className="px-8 py-2.5 rounded-xl bg-[#2447d7] text-white text-[13px] font-bold shadow-[0_4px_10px_rgba(36,71,215,0.3)] hover:bg-[#1732a3] transition-all">Close View</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewFile && (
                <DocumentPreviewModal 
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                    isDark={isDark}
                />
            )}

            {/* Team Details Modal */}
            {selectedTeam && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[9999] p-6 animate-fadeIn" onClick={() => setSelectedTeam(null)}>
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center bg-[#fcfdfe]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#2447d7] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-[#2447d7]/20">{selectedTeam.initials}</div>
                                <div>
                                    <h3 className="text-lg font-black text-[#1a202c] tracking-tight">{selectedTeam.name}'s Team</h3>
                                    <p className="text-xs font-bold text-[#718096] uppercase tracking-wider">Member Status</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTeam(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-[#a0aec0]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex flex-col gap-3">
                            {selectedTeam.members.length > 0 ? selectedTeam.members.map((member) => (
                                <div key={member.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#f1f5f9] hover:border-[#2447d7]/20 hover:bg-[#fcfdfe] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[13px] font-black text-slate-400">{member.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#1a202c]">{member.name}</span>
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${member.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-slate-100 text-slate-400'}`}>{member.status}</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-[#a0aec0]">{member.email}</span>
                                    </div>
                                </div>
                            )) : <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"><p className="text-sm font-bold text-slate-400">No members assigned.</p></div>}
                        </div>
                        <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-center">
                            <button onClick={() => setSelectedTeam(null)} className="px-8 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold hover:bg-[#0f172a] shadow-lg transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            <TaskModal
                isOpen={isAddingTask}
                onClose={() => setIsAddingTask(false)}
                onSave={(task) => {
                    addTask(task);
                    if (notifyReminderSet) notifyReminderSet(task);
                }}
            />
        </div>
    );
};

export default AMDashboard;


