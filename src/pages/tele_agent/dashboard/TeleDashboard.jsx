import React, { useState, useEffect } from 'react';
import { 
    LEADS_BY_STAGE, MOCK_LEAD_COUNTS, MOCK_LEADS, INITIAL_TASKS, 
    INITIAL_MEMBERSHIPS, SHARED_INITIAL_USERS, KNOWLEDGE_BASE_RESOURCES 
} from '../../../data/dummyData';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useLeads } from '../../../context/LeadsContext';
import { usePromotions } from '../../../context/PromotionsContext';
import { useKnowledgeBase } from '../../../context/KnowledgeBaseContext';
import { canManageTask } from '../../../utils/permissionUtils';
import KBModal from '../../../components/modals/KBModal';

/* ─── SVG ICONS ─── */
const IconUserGroup = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconFolder = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
const IconClock = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconChevronRight = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><polyline points="9 18 15 12 9 6" /></svg>;
const IconCalculator = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="16" y2="18" /></svg>;
const IconStickyNote = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /><line x1="9" y1="10" x2="9.01" y2="10" /></svg>;
const IconTeams = (props) => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}><path d="M12.5 13.5c1.38 0 2.5 1.12 2.5 2.5v1h-5v-1c0-1.38 1.12-2.5 2.5-2.5zm0-4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm.5 11c1.93 0 3.5-1.57 3.5-3.5v-1c0-.28-.22-.5-.5-.5H9c-.28 0-.5.22-.5.5v1c0 1.93 1.57 3.5 3.5 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>;
const IconBulb = (props) => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}><path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z" /></svg>;
const IconMail = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const IconPhone = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const IconCalendar = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IconArrowRight = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IconFile = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>;
const IconPin = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" {...props}><path d="M21 4.5a2.5 2.5 0 0 0-2.5-2.5h-13a2.5 2.5 0 0 0-2.5 2.5V8c0 1.25.9 2.3 2.1 2.5l2.4.4V14l-1.5 1.5 1.5 1.5 1.5-1.5L10 14V10.9l2.4-.4c1.2-.2 2.1-1.25 2.1-2.5V4.5z" /></svg>;
const IconBook = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const IconSearch = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconPlus = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconActivity = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;


/* ─── MODAL COMPONENT ─── */
const DashboardModal = ({ isOpen, onClose, title, children, isFullScreen = false, isWide = false }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center sm:items-end p-4 sm:p-0">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={onClose} />
            <div className={`relative bg-white dark:bg-[#1e2347] w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-zoomIn sm:animate-slideUp ${isFullScreen ? 'h-[98vh] sm:h-[95vh] max-w-[98vw] sm:max-w-full rounded-[32px] sm:rounded-t-[32px] sm:rounded-b-none' : isWide ? 'max-w-[90vw] sm:max-w-full rounded-[28px] sm:rounded-t-[28px] sm:rounded-b-none' : 'max-w-xl sm:max-w-full rounded-[24px] sm:rounded-t-[24px] sm:rounded-b-none'}`}>
                {/* Mobile Drag Handle */}
                <div className="hidden sm:block w-12 h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full mx-auto mt-4 mb-2 shrink-0" />
                
                <div className="flex justify-between items-center p-6 sm:p-5 border-b border-slate-100 dark:border-white/5 shrink-0 bg-gradient-to-r from-white to-slate-50/50 dark:from-[#1e2347] dark:to-white/2">
                    <h3 className="text-2xl sm:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all shrink-0 hover:rotate-90">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20" className="text-slate-400">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className={`p-6 sm:p-5 overflow-y-auto ${isFullScreen ? 'flex-1 custom-scrollbar' : 'max-h-[80vh] sm:max-h-[85vh] custom-scrollbar'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

/* ─── MAIN DASHBOARD ─── */
const TeleDashboard = ({ onNavigate, tasks = [], onViewLeadDetails }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { promotions } = usePromotions();
    const { leads } = useLeads();
    const safePromotions = promotions || [];
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);

    const [activeModal, setActiveModal] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const teamLeader = (() => {
        const tlId = Object.keys(INITIAL_MEMBERSHIPS).find(key =>
            INITIAL_MEMBERSHIPS[key].some(a => a.id === user.id)
        );
        return SHARED_INITIAL_USERS.find(u => u.id?.toString() === tlId?.toString());
    })();

    const [notesList, setNotesList] = useState(() => {
        try {
            const existingArr = JSON.parse(localStorage.getItem('tele_notes_list'));
            if (existingArr && existingArr.length > 0) return existingArr;
            const oldText = localStorage.getItem('tele_notes_v3');
            if (oldText && oldText.trim()) {
                return [{ id: Date.now(), text: oldText, date: 'Legacy', time: '', isPinned: false }];
            }
            return [];
        } catch { return []; }
    });
    const [newNote, setNewNote] = useState('');
    const [loanAmount, setLoanAmount] = useState(100000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [loanTerm, setLoanTerm] = useState(24);
    const { resources: kbResources } = useKnowledgeBase();
    const [localTasks, setLocalTasks] = useState(tasks);
    const [kbSelectedDoc, setKbSelectedDoc] = useState(null);
    const [kbSearch, setKbSearch] = useState('');
    const [kbActiveCat, setKbActiveCat] = useState('All');

    const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
    const [alertDialog, setAlertDialog] = useState({ open: false, message: '' });
    const showConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
    const closeConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });
    const showAlert = (message) => setAlertDialog({ open: true, message });
    const closeAlert = () => setAlertDialog({ open: false, message: '' });

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    useEffect(() => {
        if (!kbSelectedDoc && kbResources.length > 0) {
            setKbSelectedDoc(kbResources[0]);
        }
    }, [kbResources, kbSelectedDoc]);

    const handleUpdateTaskStatus = (taskId, newStatus) => {
        setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleUpdateLeadStatus = (taskId, newLeadStatus) => {
        setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, leadStatus: newLeadStatus } : t));
    };

    const handleAddTask = (newTask) => {
        setLocalTasks(prev => [newTask, ...prev]);
    };

    const ASSET_PRODUCTS = kbResources.filter(r => r.category === 'Products').map(r => ({
        name: r.name,
        productCategory: r.productCategory || 'Other',
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50/50 dark:bg-blue-500/10',
        dotColor: 'bg-blue-400',
        brief: r.content,
        requirements: [],
        fileData: r.fileData,
        fileType: r.fileType,
        size: r.size,
        isAdminAdded: true
    }));

    useEffect(() => {
        const acc = getAccount();
        if (acc) {
            setOutlookAccount(acc);
            getCalendarEvents().then(setOutlookEvents).catch(() => { });
        }
    }, []);

    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
    const getPadded = (num) => String(num).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${getPadded(today.getMonth() + 1)}-${getPadded(today.getDate())}`;
    const [selectedDate, setSelectedDate] = useState(todayStr);

    const todayPromos = safePromotions.filter(p => {
        if (!p.startDate || !p.endDate) return false;
        return todayStr >= p.startDate && todayStr <= p.endDate;
    });

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));
    const closeModal = () => setActiveModal(null);

    const addNewNote = () => {
        if (!newNote.trim()) return;
        const now = new Date();
        const createdNote = {
            id: Date.now(),
            text: newNote.trim(),
            date: `${now.getFullYear()}-${getPadded(now.getMonth() + 1)}-${getPadded(now.getDate())}`,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isPinned: false
        };
        const updated = [createdNote, ...notesList];
        setNotesList(updated);
        localStorage.setItem('tele_notes_list', JSON.stringify(updated));
        setNewNote('');
    };

    const toggleNotePin = (id) => {
        const currentlyPinnedCount = notesList.filter(n => n.isPinned).length;
        const noteToToggle = notesList.find(n => n.id === id);

        if (!noteToToggle.isPinned && currentlyPinnedCount >= 3) {
            showAlert("You can only pin up to 3 notes at a time.");
            return;
        }

        const updated = notesList.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
        setNotesList(updated);
        localStorage.setItem('tele_notes_list', JSON.stringify(updated));
    };

    const clearNote = (id) => {
        const updated = notesList.filter(n => n.id !== id);
        setNotesList(updated);
        localStorage.setItem('tele_notes_list', JSON.stringify(updated));
    };

    const clearAllNotes = () => {
        showConfirm("Are you sure you want to clear all your notes permanently?", () => {
            setNotesList([]);
            localStorage.setItem('tele_notes_list', JSON.stringify([]));
        });
    };

    const calculateRepayment = () => {
        const p = parseFloat(loanAmount);
        const r = (parseFloat(interestRate) / 100) / 12;
        const n = parseInt(loanTerm);
        if (!p || !n) return "0.00";
        if (r === 0) return (p / n).toFixed(2);
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        return emi.toFixed(2);
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'LEAD_COUNT': {
                const myLeads = (leads || []).filter(l => l.assignedStaffId === user.id && l.status !== 'Completed');
                const getStatusBadge = (status) => {
                    const statusConfig = {
                        'Document Collection': {
                            bg: 'bg-[#eff6ff] dark:bg-blue-900/40',
                            text: 'text-[#2563eb] dark:text-blue-300',
                            dot: 'bg-blue-400'
                        },
                        'Document Verification Done': {
                            bg: 'bg-[#ecfdf5] dark:bg-emerald-900/30',
                            text: 'text-[#059669] dark:text-emerald-400',
                            icon: true
                        },
                        'Lender Selection': {
                            bg: 'bg-[#fff7ed] dark:bg-amber-900/30',
                            text: 'text-[#d97706] dark:text-amber-400',
                            dot: 'bg-amber-400'
                        },
                        'Completed': {
                            bg: 'bg-[#f0fdf4] dark:bg-emerald-900/40',
                            text: 'text-[#16a34a] dark:text-emerald-300',
                            icon: true
                        },
                        'Rejected': {
                            bg: 'bg-[#fef2f2] dark:bg-red-900/30',
                            text: 'text-[#dc2626] dark:text-red-400',
                            dot: 'bg-red-400'
                        },
                        'Pending': {
                            bg: 'bg-slate-50 dark:bg-slate-800',
                            text: 'text-slate-500',
                            dot: 'bg-slate-400'
                        },
                    };

                    const config = statusConfig[status] || statusConfig['Pending'];
                    return (
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight ${config.bg} ${config.text}`}>
                            {config.icon ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            )}
                            {status}
                        </span>
                    );
                };

                return (
                    <div className="flex flex-col gap-3">
                        {myLeads.length > 0 ? (
                            <>
                                {/* Mobile Card View */}
                                <div className="hidden sm:flex flex-col gap-3">
                                    {myLeads.map((lead) => (
                                        <div 
                                            key={lead.id} 
                                            onClick={() => { onViewLeadDetails && onViewLeadDetails(lead); closeModal(); }}
                                            className={`p-4 rounded-2xl border flex flex-col gap-3 active:scale-[0.98] transition-all ${isDark ? 'bg-white/5 border-white/5 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] dark:bg-[#253160] text-[#0061ff] flex items-center justify-center text-[11px] font-black shrink-0 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                                                        {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[14px] font-black text-[#0061ff] dark:text-blue-400 leading-tight">{lead.name}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{lead.id}</span>
                                                    </div>
                                                </div>
                                                {getStatusBadge(lead.status)}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-50 dark:border-white/5">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Business</span>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{lead.businessName || '—'}</span>
                                                </div>
                                                <div className="flex flex-col gap-0.5 items-end text-right">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                                                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">{lead.loanAmount || '—'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <IconMail width="12" height="12" /> {lead.email || '—'}
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <IconPhone width="12" height="12" /> {lead.phone || '—'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="sm:hidden rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto custom-scrollbar shadow-sm">
                                    <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[1000px]">
                                        <thead>
                                            <tr className="bg-[#f8f9fa] dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5">
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-8">#</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Contact Name</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Email</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Phone</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Business Name</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Loan Amount</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {myLeads.map((lead, idx) => (
                                                <tr
                                                    key={lead.id}
                                                    onClick={() => { onViewLeadDetails && onViewLeadDetails(lead); closeModal(); }}
                                                    className="group cursor-pointer bg-white dark:bg-transparent hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-all"
                                                >
                                                    <td className="px-4 py-3 text-[11px] font-bold text-slate-400">{idx + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-[#f0f7ff] dark:bg-[#253160] text-[#0061ff] flex items-center justify-center text-[10px] font-black shrink-0 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                                                                {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-[12px] font-bold text-[#0061ff] dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{lead.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                            <IconMail width="13" height="13" className="text-slate-300 dark:text-slate-600" />
                                                            <span className="truncate max-w-[160px]">{lead.email || '—'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                            <IconPhone width="13" height="13" className="text-slate-300 dark:text-slate-600" />
                                                            <span>{lead.phone || '—'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">{lead.businessName || '—'}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">{lead.loanAmount || '—'}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {getStatusBadge(lead.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                No leads assigned yet
                            </div>
                        )}
                        {myLeads.length > 0 && (
                            <button
                                className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                                onClick={() => { onNavigate('leads'); closeModal(); }}
                            >
                                View All Leads →
                            </button>
                        )}
                    </div>
                );
            }
            case 'FOLLOW_UPS': {
                const getProgressBadge = (task) => {
                    const statusConfig = {
                        'Complete': {
                            bg: 'bg-[#ecfdf5] dark:bg-emerald-900/40',
                            text: 'text-[#059669] dark:text-emerald-400',
                            dot: 'bg-emerald-400'
                        },
                        'Pending': {
                            bg: 'bg-[#fff7ed] dark:bg-amber-900/30',
                            text: 'text-[#d97706] dark:text-amber-400',
                            dot: 'bg-amber-400'
                        },
                        'In Progress': {
                            bg: 'bg-[#eff6ff] dark:bg-blue-900/30',
                            text: 'text-[#2563eb] dark:text-blue-400',
                            dot: 'bg-blue-400'
                        },
                    };

                    const config = statusConfig[task.status] || statusConfig['Pending'];
                    return (
                        <select
                            value={task.status}
                            onChange={(e) => {
                                e.stopPropagation();
                                handleUpdateTaskStatus(task.id, e.target.value);
                            }}
                            className={`appearance-none cursor-pointer outline-none inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight transition-all border-none ${config.bg} ${config.text} hover:ring-2 ring-blue-500/20 shadow-sm`}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                        </select>
                    );
                };

                const getLeadStatusBadge = (task) => {
                    const statusConfig = {
                        'Hot': {
                            bg: 'bg-[#fef2f2] dark:bg-red-900/40',
                            text: 'text-[#dc2626] dark:text-red-400',
                            dot: 'bg-red-500 animate-pulse'
                        },
                        'Warm': {
                            bg: 'bg-[#fffbeb] dark:bg-amber-900/30',
                            text: 'text-[#d97706] dark:text-amber-400',
                            dot: 'bg-amber-500'
                        },
                        'Cool': {
                            bg: 'bg-[#f0f9ff] dark:bg-sky-900/30',
                            text: 'text-[#0284c7] dark:text-sky-400',
                            dot: 'bg-sky-500'
                        },
                    };

                    const currentLeadStatus = task.leadStatus || 'Cool';
                    const config = statusConfig[currentLeadStatus];

                    return (
                        <select
                            value={currentLeadStatus}
                            onChange={(e) => {
                                e.stopPropagation();
                                handleUpdateLeadStatus(task.id, e.target.value);
                            }}
                            className={`appearance-none cursor-pointer outline-none inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight transition-all border-none ${config.bg} ${config.text} hover:ring-2 ring-blue-500/20 shadow-sm`}
                        >
                            <option value="Hot">Hot</option>
                            <option value="Warm">Warm</option>
                            <option value="Cool">Cool</option>
                        </select>
                    );
                };

                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-0.5 mb-2 px-1">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Management</h3>
                            <div className="text-[20px] font-black dark:text-white uppercase tracking-tight">Active Follow-ups</div>
                        </div>
                        {localTasks.length > 0 ? (
                            <>
                                {/* Mobile Follow-up Cards */}
                                <div className="hidden sm:flex flex-col gap-3">
                                    {(String(activeModal) === 'FOLLOW_UPS' ? (() => {
                                        const todayStr = new Date().toISOString().split('T')[0];
                                        const LEAD_ORDER = { Hot: 0, Warm: 1, Cool: 2 };
                                        return [...localTasks].sort((a, b) => {
                                            const aComplete = a.status === 'Complete';
                                            const bComplete = b.status === 'Complete';
                                            if (aComplete && !bComplete) return 1;
                                            if (!aComplete && bComplete) return -1;
                                            const lsDiff = (LEAD_ORDER[a.leadStatus] ?? 1) - (LEAD_ORDER[b.leadStatus] ?? 1);
                                            if (lsDiff !== 0) return lsDiff;
                                            if (a.date === todayStr && b.date !== todayStr) return -1;
                                            if (a.date !== todayStr && b.date === todayStr) return 1;
                                            return new Date(b.date + ' ' + (b.time || '00:00')) - new Date(a.date + ' ' + (a.time || '00:00'));
                                        }).slice(0, 6);
                                    })() : []).map((task) => {
                                        const relatedLead = (leads || []).find(l => l.name === task.lead || l.email === task.email);
                                        const combinedNotes = [task.title, task.description, task.message].filter(Boolean).join(' - ');
                                        return (
                                            <div 
                                                key={task.id} 
                                                className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all ${isDark ? 'bg-white/5 border-white/5 shadow-xl' : 'bg-white border-slate-100 shadow-sm'} ${task.status === 'Complete' ? 'opacity-60 grayscale-[0.3]' : ''}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] dark:bg-[#253160] text-[#0061ff] flex items-center justify-center text-[11px] font-black shrink-0 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                                                            {(task.lead || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[14px] font-black text-[#0061ff] dark:text-blue-400 leading-tight uppercase tracking-tight">{task.lead || 'Unknown Lead'}</span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{task.date}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                <span className="text-[10px] font-black text-[#0061ff] dark:text-blue-400 uppercase tracking-tighter">{task.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {getLeadStatusBadge(task)}
                                                </div>

                                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                                                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                                        "{combinedNotes || 'No specific notes'}"
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                        <div className="flex items-center gap-1">
                                                            <IconMail width="12" height="12" className="text-slate-400" /> {task.email || relatedLead?.email || '—'}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <IconPhone width="12" height="12" className="text-slate-400" /> {task.phone || relatedLead?.phone || '—'}
                                                        </div>
                                                    </div>
                                                    {getProgressBadge(task)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Follow-up Table */}
                                <div className="sm:hidden overflow-x-auto custom-scrollbar rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                                    <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-[1200px]">
                                        <thead>
                                            <tr className="bg-[#f8f9fa] dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5">
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-8">#</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Lead Name</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-center">Lead Status</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Email</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Phone Number</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Note / Message</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Schedule</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-center">Progress</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {(() => {
                                                const todayStr = new Date().toISOString().split('T')[0];
                                                const LEAD_ORDER = { Hot: 0, Warm: 1, Cool: 2 };
                                                const sortedTasks = [...localTasks].sort((a, b) => {
                                                    const aComplete = a.status === 'Complete';
                                                    const bComplete = b.status === 'Complete';
                                                    if (aComplete && !bComplete) return 1;
                                                    if (!aComplete && bComplete) return -1;
                                                    const lsDiff = (LEAD_ORDER[a.leadStatus] ?? 1) - (LEAD_ORDER[b.leadStatus] ?? 1);
                                                    if (lsDiff !== 0) return lsDiff;
                                                    if (a.date === todayStr && b.date !== todayStr) return -1;
                                                    if (a.date !== todayStr && b.date === todayStr) return 1;
                                                    return new Date(b.date + ' ' + (b.time || '00:00')) - new Date(a.date + ' ' + (a.time || '00:00'));
                                                });
                                                return sortedTasks.slice(0, 6).map((task, idx) => {
                                                    const relatedLead = (leads || []).find(l => l.name === task.lead || l.email === task.email);
                                                    const displayEmail = task.email || relatedLead?.email || '—';
                                                    const displayPhone = task.phone || relatedLead?.phone || '—';
                                                    const combinedNotes = [task.title, task.description, task.message].filter(Boolean).join(' - ');
                                                    return (
                                                        <tr
                                                            key={task.id}
                                                            className={`group bg-white dark:bg-transparent hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all border-b border-slate-50 dark:border-white/5 last:border-0 ${task.status === 'Complete' ? 'opacity-60 grayscale-[0.3]' : ''}`}
                                                        >
                                                            <td className="px-4 py-3 text-[11px] font-bold text-slate-400">{idx + 1}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="w-8 h-8 rounded-full bg-[#f0f7ff] dark:bg-[#253160] text-[#0061ff] flex items-center justify-center text-[10px] font-black shrink-0 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                                                                        {(task.lead || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <span className="text-[12px] font-bold text-[#0061ff] dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors uppercase tracking-tight">{task.lead || 'Unknown Lead'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {getLeadStatusBadge(task)}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                                    <IconMail width="13" height="13" className="text-slate-300 dark:text-slate-600" />
                                                                    <span className="truncate max-w-[160px]">{displayEmail}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                                    <IconPhone width="13" height="13" className="text-slate-300 dark:text-slate-600" />
                                                                    <span>{displayPhone}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px] leading-relaxed" title={combinedNotes}>
                                                                    {combinedNotes}
                                                                </p>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex flex-col leading-tight text-right">
                                                                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{task.date}</span>
                                                                    <div className="flex items-center justify-end gap-1 text-[10px] font-black text-[#0061ff] dark:text-blue-400 uppercase tracking-tighter">
                                                                        <IconClock width="10" height="10" /> {task.time}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {getProgressBadge(task)}
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                No upcoming followups
                            </div>
                        )}
                        <button
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-black py-3 rounded-2xl mt-1 border border-slate-100 dark:border-white/5"
                            onClick={() => { onNavigate && onNavigate('follow-ups'); closeModal(); }}
                        >
                            View All Follow-ups →
                        </button>
                    </div>
                );
            }
            case 'ADD_TASK': {
                return (
                    <div className="flex flex-col gap-4 max-w-[500px] mx-auto p-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Name</label>
                                <select
                                    id="newTaskLead"
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 text-[13px] font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
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
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Status</label>
                                <select
                                    id="newTaskLeadStatus"
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 text-[13px] font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                                >
                                    <option value="Hot">Hot</option>
                                    <option value="Warm">Warm</option>
                                    <option value="Cool">Cool</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                            <input
                                id="newTaskTitle"
                                type="text"
                                placeholder="e.g., Initial Consultation"
                                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 text-[13px] font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note / Message</label>
                            <textarea
                                id="newTaskMessage"
                                rows="3"
                                placeholder="Details about this follow-up..."
                                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 text-[13px] font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20 resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schedule Date</label>
                                <input
                                    id="newTaskDate"
                                    type="date"
                                    defaultValue={todayStr}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 text-[13px] font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schedule Time</label>
                                <input
                                    id="newTaskTime"
                                    type="time"
                                    defaultValue="10:00"
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 text-[13px] font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setActiveModal('FOLLOW_UPS')}
                                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const lead = document.getElementById('newTaskLead').value;
                                    const leadStatus = document.getElementById('newTaskLeadStatus').value;
                                    const title = document.getElementById('newTaskTitle').value;
                                    const message = document.getElementById('newTaskMessage').value;
                                    const date = document.getElementById('newTaskDate').value;
                                    const time = document.getElementById('newTaskTime').value;

                                    if (!title) return alert('Please enter a task title');

                                    handleAddTask({
                                        id: Date.now(),
                                        lead,
                                        leadStatus,
                                        title,
                                        message,
                                        date,
                                        time,
                                        status: 'Pending'
                                    });
                                    setActiveModal('FOLLOW_UPS');
                                }}
                                className="flex-2 bg-[#0061ff] hover:bg-blue-700 text-white font-black py-3 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/30"
                            >
                                Confirm Task
                            </button>
                        </div>
                    </div>
                );
            }
            case 'PENDING_DOCS': {
                const pendingLeads = (leads || []).filter(l =>
                    l.assignedStaffId === user.id &&
                    (l.status === 'Document Collection' || (l.documents || []).some(d => d.status === 'Pending'))
                );
                return (
                    <div className="flex flex-col gap-3">
                        {pendingLeads.length > 0 ? pendingLeads.map(lead => (
                            <div
                                key={lead.id}
                                onClick={() => { onViewLeadDetails && onViewLeadDetails(lead); closeModal(); }}
                                className="p-5 bg-white dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-[#0061ff] dark:hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-all cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0061ff] dark:text-blue-400 flex items-center justify-center text-[13px] font-black shrink-0 border border-blue-100 dark:border-blue-800/50 group-hover:scale-105 transition-transform shadow-sm">
                                        {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <h3 className="font-bold text-[15px] dark:text-white truncate group-hover:text-[#0061ff] transition-colors">{lead.name}</h3>
                                            <span className="text-[10px] font-black px-2.5 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full uppercase tracking-tighter shrink-0 border border-blue-200 dark:border-blue-700/50">
                                                {lead.documents.filter(d => d.status === 'Pending').length} Pending
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                <span className="truncate max-w-[200px]">{lead.businessName}</span>
                                            </div>
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                                                    <IconMail width="14" height="14" className="text-slate-300 dark:text-slate-600" />
                                                    <span className="truncate max-w-[180px] font-medium">{lead.email || '—'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                                                    <IconPhone width="14" height="14" className="text-slate-300 dark:text-slate-600" />
                                                    <span className="font-medium">{lead.phone || '—'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-300 group-hover:bg-[#0061ff] group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                                    <IconChevronRight width="20" height="20" />
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                All documents verified!
                            </div>
                        )}
                    </div>
                );
            }
            case 'PRODUCT_BRIEF': return selectedProduct && (
                <div className="flex flex-col gap-4">
                    {/* Header Info */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col">
                            <h3 className={`text-[14px] font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedProduct.name}</h3>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{selectedProduct.productCategory}</span>
                        </div>
                        {selectedProduct.size && (
                            <div className="flex items-center gap-2 text-[10px] bg-slate-100 dark:bg-white/5 py-1 px-2 rounded-lg font-bold text-slate-500">
                                <span>{selectedProduct.fileType || 'DOC'}</span>
                                <span className="opacity-30">|</span>
                                <span>{selectedProduct.size}</span>
                            </div>
                        )}
                    </div>

                    {selectedProduct.brief && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <pre className="text-sm font-medium dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{selectedProduct.brief}</pre>
                        </div>
                    )}
                    {selectedProduct.fileData && selectedProduct.fileType?.startsWith('image/') && (
                        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900/50">
                            <img src={selectedProduct.fileData} alt={selectedProduct.name} className="w-full h-auto object-contain max-h-[500px]" />
                        </div>
                    )}
                    {selectedProduct.fileData && selectedProduct.fileType === 'application/pdf' && (
                        <div className="h-[500px] border rounded-2xl overflow-hidden shadow-lg border-slate-200 dark:border-white/10">
                            <iframe src={selectedProduct.fileData} className="w-full h-full" title={selectedProduct.name} />
                        </div>
                    )}
                </div>
            );
            case 'ASSET_PRODUCTS_POPUP': return (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                        <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-[#94abda]' : 'text-slate-400'}`}>Asset Products</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{ASSET_PRODUCTS.length} types</span>
                    </div>
                    {ASSET_PRODUCTS.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {ASSET_PRODUCTS.map(p => (
                                <button key={p.name}
                                    onClick={() => { setSelectedProduct(p); setActiveModal('PRODUCT_BRIEF'); }}
                                    className={`w-full text-left p-3.5 rounded-xl border transition-all hover:shadow-sm group ${isDark ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-indigo-500/30' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-indigo-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${p.dotColor || 'bg-indigo-400'}`} />
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className={`text-[13px] font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${isDark ? 'text-[#e4ecff]' : 'text-slate-800'}`}>{p.name}</span>
                                            {p.productCategory && <span className={`text-[10px] font-medium ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{p.productCategory}</span>}
                                            {p.brief && <p className={`text-[10px] mt-0.5 line-clamp-2 leading-relaxed ${isDark ? 'text-[#546298]' : 'text-slate-500'}`}>{p.brief}</p>}
                                        </div>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}><polyline points="9 18 15 12 9 6"/></svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-10 text-center text-[10px] font-bold uppercase tracking-widest border border-dashed rounded-2xl ${isDark ? 'border-white/10 text-[#546298]' : 'border-slate-200 text-slate-400'}`}>
                            No asset products available
                        </div>
                    )}
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="w-full flex flex-col font-['Sora',sans-serif] animate-fadeIn p-2 gap-3 h-[calc(100vh-140px)] lg:h-auto lg:min-h-0">

            {/* STRICT SINGLE SCREEN GRID (Row 1: Tiles, Row 2: Main Stacks) */}
            <div className="grid grid-cols-7 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-3 min-h-0 w-full mb-1">

                {/* Leads Card */}
                <div onClick={() => setActiveModal('LEAD_COUNT')} className="group bg-blue-50/50 dark:bg-[#1c2340] rounded-2xl border border-blue-200/50 dark:border-blue-500/20 p-4 flex flex-col justify-center items-center gap-2 shadow-sm cursor-pointer text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-1 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform"><IconUserGroup width="24" height="24" /></div>
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-3xl lg:text-3xl font-black leading-none text-blue-700 dark:text-blue-300">
                            {(leads || []).filter(l => l.assignedStaffId === user.id && l.status !== 'Completed').length.toLocaleString()}
                        </h2>
                        <span className="text-[10px] sm:text-[9px] font-black text-blue-600/70 dark:text-blue-400/70 uppercase tracking-[0.2em]">LEADS</span>
                    </div>
                </div>

                {/* Tasks Card */}
                <div onClick={() => setActiveModal('FOLLOW_UPS')} className="group bg-orange-50/50 dark:bg-[#2a1f1a] rounded-2xl border border-orange-200/50 dark:border-orange-500/20 p-4 flex flex-col justify-center items-center gap-2 shadow-sm cursor-pointer text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-1 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform"><IconClock width="24" height="24" /></div>
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-3xl lg:text-3xl font-black leading-none text-orange-700 dark:text-orange-300">{tasks.length}</h2>
                        <span className="text-[10px] sm:text-[9px] font-black text-orange-600/70 dark:text-orange-400/70 uppercase tracking-[0.2em]">TASKS</span>
                    </div>
                </div>

                {/* Docs Card */}
                <div onClick={() => setActiveModal('PENDING_DOCS')} className="group bg-emerald-50/50 dark:bg-[#182724] rounded-2xl border border-emerald-200/50 dark:border-emerald-500/20 p-4 flex flex-col justify-center items-center gap-2 shadow-sm cursor-pointer text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-1 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform"><IconFolder width="24" height="24" /></div>
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-3xl lg:text-3xl font-black leading-none text-emerald-700 dark:text-emerald-300">
                            {(leads || []).filter(l => l.assignedStaffId === user.id && (l.status === 'Document Collection' || (l.documents || []).some(d => d.status === 'Pending'))).length}
                        </h2>
                        <span className="text-[10px] sm:text-[9px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-[0.2em]">DOCS</span>
                    </div>
                </div>

                {/* Create Lead Card */}
                <div onClick={() => onNavigate('create-lead')} className="group bg-rose-50/50 dark:bg-[#2a1a1c] rounded-2xl border border-rose-200/50 dark:border-rose-500/20 p-3 sm:p-2.5 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-2 shadow-sm cursor-pointer text-center sm:text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-2xl bg-rose-600 text-white flex items-center justify-center sm:mb-0 mb-1 shadow-lg shadow-rose-600/20 group-hover:scale-110 transition-transform shrink-0"><IconPlus /></div>
                    <h2 className="text-[12px] font-black leading-tight text-rose-700 dark:text-rose-300 uppercase tracking-[0.1em]">CREATE<br />LEAD</h2>
                </div>

                {/* Asset Products Card */}
                <div 
                    onClick={() => { 
                        window.dispatchEvent(new CustomEvent('OPEN_AI_ASSISTANT', { detail: { mode: 'product' } }));
                    }} 
                    className="group bg-indigo-50/50 dark:bg-[#1c1e3a] rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 p-3 sm:p-2.5 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-2 shadow-sm cursor-pointer text-center sm:text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center sm:mb-0 mb-1 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    <h2 className="text-[12px] font-black leading-tight text-indigo-700 dark:text-indigo-400 uppercase tracking-[0.1em]">ASSET<br />PRODUCTS</h2>
                </div>

                {/* Knowledge Base Card */}
                <div onClick={() => setActiveModal('KNOWLEDGE_BASE')} className="group bg-amber-50/50 dark:bg-[#282315] rounded-2xl border border-amber-200/50 dark:border-amber-500/20 p-3 sm:p-2.5 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-2 shadow-sm cursor-pointer text-center sm:text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-2xl bg-amber-500 text-white flex items-center justify-center sm:mb-0 mb-1 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform shrink-0"><IconBulb width="24" height="24" /></div>
                    <h2 className="text-[12px] font-black leading-tight text-amber-700 dark:text-amber-400 uppercase tracking-[0.1em]">KNOWLEDGE<br />BASE</h2>
                </div>

                {/* MS Teams Card */}
                <div onClick={() => window.open('msteams://', '_blank')} className="group bg-[#5b5fc7]/10 dark:bg-[#5b5fc7]/20 rounded-2xl border border-[#5b5fc7]/30 p-3 sm:p-2.5 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-2 shadow-sm cursor-pointer text-center sm:text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-2xl bg-[#5b5fc7] text-white flex items-center justify-center sm:mb-0 mb-1 shadow-lg shadow-[#5b5fc7]/30 group-hover:scale-110 transition-transform shrink-0"><IconTeams width="24" height="24" /></div>
                    <h2 className="text-[12px] font-black leading-tight text-[#5b5fc7] dark:text-[#a6a9ef] uppercase tracking-[0.1em]">MICROSOFT<br />TEAMS</h2>
                </div>

            </div>

            {/* === MAIN CONTENT GRIDS === */}
            <div className="grid grid-cols-7 lg:grid-cols-2 sm:grid-cols-1 gap-4 flex-1 min-h-0">


                {/* STACK 1: TIMELINE (Cols 1-2) */}
                <div className="col-span-2 lg:col-span-2 sm:col-span-1 flex flex-col min-h-0 bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-200/60 dark:border-white/5 shadow-sm overflow-hidden group/timeline transition-all duration-300 hover:shadow-md">
                    {/* WIDGET TOP MENU BAR */}
                    <div className="bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-b border-slate-100 dark:border-white/5 p-3 px-4 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <h2 className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em] leading-tight">Timeline</h2>
                        </div>
                        <span className="text-[9px] bg-blue-100 dark:bg-blue-600/30 font-black px-2 py-0.5 rounded-full text-blue-600 dark:text-blue-300 shrink-0 border border-blue-200/50 dark:border-blue-500/20">{tasks.filter(t => t.date === selectedDate).length} EVENTS</span>
                    </div>

                    <div className="flex flex-col gap-2.5 overflow-y-auto custom-scrollbar flex-1 p-3">
                        {todayPromos.map(promo => (
                            <div key={promo.id} className="relative p-4 bg-gradient-to-br from-blue-50/80 via-white to-white dark:from-blue-900/10 dark:via-[#1e2347] dark:to-[#1e2347] rounded-2xl border border-blue-200/60 dark:border-blue-500/20 shrink-0 hover:border-blue-400 dark:hover:border-blue-400 transition-all cursor-pointer group/promo shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 p-1">
                                    <div className="bg-blue-600 text-[7px] font-black text-white px-2 py-0.5 rounded-bl-xl rounded-tr-xl tracking-widest uppercase shadow-sm">PROMO</div>
                                </div>
                                <div className="flex justify-between items-center mb-2 gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-600/20 group-hover/promo:scale-110 transition-transform">
                                            {promo.lenderName.slice(0, 1).toUpperCase()}
                                        </div>
                                        <span className="text-[12px] font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight">{promo.lenderName}</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-3 line-clamp-2">{promo.description}</p>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 border-t border-blue-200/40 dark:border-blue-500/10">
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                                        <IconCalendar width="11" height="11" opacity="0.7" />
                                        <span>{promo.startDate}</span>
                                        <IconArrowRight width="8" height="8" opacity="0.5" />
                                        <span>{promo.endDate}</span>
                                    </div>
                                    {promo.fileName && (
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg border border-emerald-200/50 dark:border-emerald-500/20 ml-auto">
                                            <IconFile width="11" height="11" />
                                            <span className="truncate max-w-[90px]">{promo.fileName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                            tasks.filter(t => t.date === selectedDate).map((item) => {
                                const leadObj = (leads || []).find(l => l.name === item.lead || l.name === item.leadName);
                                return (
                                    <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 shrink-0 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group/task hover:shadow-md">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <div className="text-[12px] font-black text-slate-800 dark:text-white leading-tight group-hover/task:text-blue-600 transition-colors min-w-0 break-words tracking-tight">{item.title}</div>
                                            <div className="text-[8px] font-black px-2 py-0.5 bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-300 rounded-lg uppercase tracking-widest shrink-0 border border-blue-200/50 dark:border-blue-500/20">
                                                {item.type || 'TASK'}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 mb-3">
                                            {/* Lead & Business Info */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[9px] font-black shrink-0 border border-blue-100 dark:border-blue-500/10 transition-transform group-hover/task:scale-110">
                                                    {(item.lead || item.leadName || '?').slice(0, 1).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 truncate leading-none mb-0.5">{item.lead || item.leadName || 'No Lead'}</span>
                                                    {leadObj?.businessName && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">{leadObj.businessName}</span>}
                                                </div>
                                            </div>

                                            {/* Contact Details Grid */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-8">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                    <IconClock width="11" height="11" className="text-slate-300" />
                                                    <span>{item.time}</span>
                                                </div>
                                                {leadObj?.email && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                        <IconMail width="11" height="11" className="text-slate-300" />
                                                        <span className="truncate max-w-[120px]">{leadObj.email}</span>
                                                    </div>
                                                )}
                                                {leadObj?.phone && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                        <IconPhone width="11" height="11" className="text-slate-300" />
                                                        <span>{leadObj.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {(item.message || item.description) && (
                                            <div className="relative">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 pl-3 py-1 italic">
                                                    "{item.message || item.description}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] mt-2 bg-slate-50/30 dark:bg-white/2 opacity-60">Focus on Leads • Zero Events Today</div>}
                    </div>
                </div>

                {/* STACK 2: MIDDLE (Cols 3-5) */}
                <div className="col-span-3 lg:col-span-2 sm:col-span-1 flex flex-col gap-4 min-h-0">


                    {/* NOTES */}
                    <div className="bg-[#fffef5] dark:bg-[#2a281a] rounded-[24px] border border-yellow-200/60 dark:border-yellow-700/30 flex flex-col flex-1 min-h-0 shadow-sm overflow-hidden group/notes transition-all duration-300 hover:shadow-md">
                        <div className="bg-[#fff9c4]/60 dark:bg-[#4d4826]/80 backdrop-blur-sm border-b border-yellow-200/50 dark:border-yellow-700/30 p-3 px-4 shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-yellow-700 dark:text-yellow-500">
                                <IconStickyNote className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em]">My Notes</span>
                            </div>
                            <button onClick={clearAllNotes} className="text-[9px] font-black text-yellow-700/60 dark:text-yellow-500/40 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase tracking-[0.1em]">Clear All</button>
                        </div>
                        <div className="flex-1 p-4 pb-3 flex flex-col min-h-0 overflow-hidden">
                            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 mb-3 pr-1">
                                {notesList.length === 0 ? (
                                    <div className="text-[11px] text-yellow-700/50 italic text-center mt-6 border border-dashed border-yellow-200 dark:border-yellow-800/50 p-6 rounded-2xl bg-yellow-50/30 dark:bg-yellow-900/10 uppercase tracking-widest font-black opacity-60">No notes recorded</div>
                                ) : (
                                    [...notesList].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map(note => (
                                        <div key={note.id} className={`p-3.5 rounded-2xl text-[11px] relative group transition-all border shrink-0 hover:shadow-md ${note.isPinned
                                            ? 'bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-[#2a281a] border-yellow-300 dark:border-yellow-500/30 text-yellow-900 dark:text-yellow-50 shadow-sm'
                                            : 'bg-white/90 dark:bg-black/20 border-yellow-100 dark:border-yellow-700/20 text-yellow-900 dark:text-yellow-100'
                                            }`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    {note.isPinned && <IconPin className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />}
                                                    <span className="text-[9px] font-black text-yellow-600/70 dark:text-yellow-500/50 uppercase tracking-[0.1em]">{note.date} {note.time && `• ${note.time}`}</span>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => toggleNotePin(note.id)} className={`text-[8px] px-2 py-1 rounded-lg font-black tracking-widest transition-all shadow-sm ${note.isPinned ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-500' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-300'}`}>
                                                        {note.isPinned ? 'UNPIN' : 'PIN'}
                                                    </button>
                                                    <button onClick={() => clearNote(note.id)} className="text-[8px] px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-black tracking-widest hover:bg-red-200 transition-all shadow-sm uppercase">Clear</button>
                                                </div>
                                            </div>
                                            <p className={`whitespace-pre-wrap leading-relaxed font-medium`}>{note.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="shrink-0 flex gap-2.5 pt-3 border-t border-yellow-200/50 dark:border-yellow-700/30">
                                <input
                                    type="text"
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addNewNote()}
                                    placeholder="Annotate something..."
                                    className="flex-1 bg-white/80 dark:bg-black/30 border border-yellow-200/60 dark:border-yellow-700/50 rounded-xl px-4 py-2 text-[11px] text-yellow-950 dark:text-yellow-50 outline-none focus:border-yellow-400 focus:bg-white dark:focus:bg-black/50 transition-all placeholder:text-yellow-700/30 shadow-inner"
                                />
                                <button onClick={addNewNote} className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-yellow-950 dark:text-white px-5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md shadow-yellow-400/20 active:scale-95">Add</button>
                            </div>
                        </div>
                    </div>



                </div>

                {/* STACK 3: RIGHT (Cols 6-7) */}
                <div className="col-span-2 lg:col-span-2 sm:col-span-1 flex flex-col gap-4 min-h-0">

                    {/* LOAN ESTIMATOR */}
                    <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-200/60 dark:border-white/5 flex flex-col shrink-0 min-h-0 shadow-sm overflow-hidden relative group/estimator hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 dark:bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover/estimator:scale-110 transition-transform duration-700" />
                        <div className="bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-b border-slate-100 dark:border-white/5 p-3 px-4 shrink-0 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <IconCalculator className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Estimator</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 p-3.5 relative z-10 justify-center">
                            <div className="flex items-center bg-slate-50/50 dark:bg-slate-900/40 rounded-xl px-3 py-2 border border-slate-100 dark:border-white/5 focus-within:border-blue-300 transition-all">
                                <label className="text-[9px] font-black text-slate-400 w-14 shrink-0 uppercase tracking-widest">Amount</label>
                                <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="bg-transparent w-full text-right text-xs font-black dark:text-white outline-none min-w-0" />
                            </div>
                            <div className="flex gap-2 w-full">
                                <div className="flex-1 flex items-center bg-slate-50/50 dark:bg-slate-900/40 rounded-xl px-3 py-2 border border-slate-100 dark:border-white/5 focus-within:border-blue-300 transition-all min-w-0">
                                    <label className="text-[9px] font-black text-slate-400 w-10 shrink-0 uppercase tracking-widest">Rate</label>
                                    <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="bg-transparent w-full text-right text-xs font-black dark:text-white outline-none min-w-0" />
                                </div>
                                <div className="flex-1 flex items-center bg-slate-50/50 dark:bg-slate-900/40 rounded-xl px-3 py-2 border border-slate-100 dark:border-white/5 focus-within:border-blue-300 transition-all min-w-0">
                                    <label className="text-[9px] font-black text-slate-400 w-10 shrink-0 uppercase tracking-widest">Term</label>
                                    <input type="number" value={loanTerm} onChange={e => setLoanTerm(e.target.value)} className="bg-transparent w-full text-right text-xs font-black dark:text-white outline-none min-w-0" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10 shrink-0 px-4 pb-3 bg-slate-50/30 dark:bg-white/2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Repay</span>
                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><span className="text-[10px] opacity-70">£</span>{calculateRepayment()} <span className="text-[10px] font-bold opacity-60">/ MO</span></span>
                        </div>
                    </div>

                    {/* CALENDAR */}
                    <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-200/60 dark:border-white/5 flex flex-col flex-1 min-h-0 shadow-sm overflow-hidden group/calendar hover:shadow-md transition-all duration-300">
                        <div className="bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-b border-slate-100 dark:border-white/5 p-3 px-4 shrink-0 flex items-center justify-between">
                            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em]">{shortMonthNames[currentMonth]} {currentYear}</span>
                            <div className="flex gap-1.5 bg-white/80 dark:bg-slate-700/50 rounded-lg p-0.5 shadow-sm border border-slate-100 dark:border-white/5">
                                <button onClick={prevMonth} className="p-1 text-slate-400 hover:text-blue-500 transition-colors"><IconChevronRight className="w-4 h-4" /></button>
                                <button onClick={nextMonth} className="p-1 text-slate-400 hover:text-blue-500 transition-colors transform rotate-180"><IconChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="p-3 flex flex-col flex-1 min-h-0 justify-center">
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase mb-3 shrink-0 tracking-tighter">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <div key={i}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-y-1.5 gap-x-1.5 text-center flex-1 min-h-0 pb-1 auto-rows-fr">
                                {[...Array(emptySlots)].map((_, i) => <div key={`empty-${i}`} />)}
                                {calendarDays.map(day => {
                                    const dStr = `${currentYear}-${getPadded(currentMonth + 1)}-${getPadded(day)}`;
                                    const isSelected = selectedDate === dStr;
                                    const hasTasks = tasks.some(t => t.date === dStr);
                                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                    return (
                                        <div key={day} onClick={() => setSelectedDate(dStr)} className={`flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all border shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-full relative group/day ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 -translate-y-0.5 z-10' :
                                            isToday ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 font-black' :
                                                'bg-white dark:bg-slate-800/60 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                                            }`}>
                                            <span className={`text-[11px] ${isSelected ? 'font-black' : 'font-bold'}`}>{day}</span>
                                            {hasTasks && <div className={`w-[4px] h-[4px] rounded-full mt-1.5 shadow-sm ${isSelected ? 'bg-white' : 'bg-orange-500 animate-pulse'}`} />}
                                            {isToday && !isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>



                </div>

            </div>

            <DashboardModal isOpen={activeModal !== null && activeModal !== 'KNOWLEDGE_BASE'} onClose={closeModal} title={
                activeModal === 'LEAD_COUNT' ? 'My Assigned Leads' :
                    activeModal === 'FOLLOW_UPS' ? 'My Follow-ups' :
                        activeModal === 'PENDING_DOCS' ? 'Pending Documents' :
                                (activeModal ? activeModal.replace(/_/g, ' ') : '')
            } isWide={activeModal === 'LEAD_COUNT' || activeModal === 'FOLLOW_UPS'}>
                {renderModalContent()}
            </DashboardModal>

            {activeModal === 'KNOWLEDGE_BASE' && (
                <KBModal
                    onClose={closeModal}
                    allDocs={kbResources}
                    hideAddButton={true}
                />
            )}

            {/* Alert Dialog */}
            {alertDialog.open && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAlert} />
                    <div className="relative bg-white dark:bg-[#1e2347] rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100 dark:border-white/10 animate-fadeIn">
                        <p className="text-[15px] font-semibold text-slate-800 dark:text-white mb-6">{alertDialog.message}</p>
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
                    <div className="relative bg-white dark:bg-[#1e2347] rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100 dark:border-white/10 animate-fadeIn">
                        <p className="text-[15px] font-semibold text-slate-800 dark:text-white mb-6">{confirmDialog.message}</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={closeConfirm} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button onClick={() => { confirmDialog.onConfirm?.(); closeConfirm(); }} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeleDashboard;
