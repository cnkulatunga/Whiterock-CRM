import React, { useState, useEffect } from 'react';
import { LEADS_BY_STAGE, MOCK_LEAD_COUNTS, MOCK_LEADS, INITIAL_TASKS } from '../../../data/dummyData';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';

/* ─── SVG ICONS ─── */
const IconUserGroup = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconFolder = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const IconClock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconChevronRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

/* ─── MODAL COMPONENT ─── */
const DashboardModal = ({ isOpen, onClose, title, children, isFullScreen = false }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white dark:bg-[#1e2347] w-full shadow-2xl overflow-hidden flex flex-col animate-zoomIn ${isFullScreen ? 'h-[98vh] max-w-[98vw] rounded-3xl' : 'max-w-4xl rounded-2xl'}`}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-[#2c3568] shrink-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c3568] rounded-full transition-colors shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className={`p-6 overflow-y-auto ${isFullScreen ? 'flex-1 custom-scrollbar' : 'max-h-[70vh]'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const TeleDashboard = ({ onNavigate, tasks, onViewLeadDetails }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Modal State
    const [activeModal, setActiveModal] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const ASSET_PRODUCTS = [
        {
            name: 'Unsecured',
            iconColor: 'text-indigo-500',
            bgColor: 'bg-indigo-50/50 dark:bg-indigo-500/10',
            dotColor: 'bg-indigo-400',
            brief: 'Clean funding for rapid growth without asset pledges.',
            requirements: ['6+ Months Trading', '$10k+ Monthly Revenue', 'Clear Bank Statements', 'Australian Registered Business']
        },
        {
            name: 'Secured',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-50/50 dark:bg-emerald-500/10',
            dotColor: 'bg-emerald-400',
            brief: 'High-limit financing backed by business or personal assets.',
            requirements: ['Property/Equipment Equity', '12+ Months Trading', 'Good Credit Score', 'Full Financial Statements']
        },
        {
            name: 'Commercial',
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-50/50 dark:bg-amber-500/10',
            dotColor: 'bg-amber-400',
            brief: 'Strategic capital for property purchase or large-scale expansion.',
            requirements: ['20% Initial Deposit', 'Proven Cash Flow', 'Property Appraisal', 'Detailed Business Plan']
        },
        {
            name: 'Refinance',
            iconColor: 'text-rose-500',
            bgColor: 'bg-rose-50/50 dark:bg-rose-500/10',
            dotColor: 'bg-rose-400',
            brief: 'Debt restructuring to lower payments and optimize cash flow.',
            requirements: ['Current Loan Status Active', 'Improved Financial Ratios', 'Latest Facility Agreement', 'No Arrears in 6 Months']
        }
    ];

    useEffect(() => {
        const acc = getAccount();
        if (acc) {
            setOutlookAccount(acc);
            fetchOutlookEvents();
        }
    }, []);

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

    // Calendar Logic
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const isToday = (day) => {
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    const closeModal = () => setActiveModal(null);

    const renderModalContent = () => {
        switch (activeModal) {
            case 'LEAD_COUNT':
                return (
                    <div className="flex flex-col gap-4">
                        {MOCK_LEADS.slice(0, 5).map(lead => (
                            <div key={lead.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1a202c] rounded-xl">
                                <div>
                                    <div className="font-bold dark:text-white">{lead.name}</div>
                                    <div className="text-sm text-gray-500">{lead.businessName}</div>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{lead.status}</span>
                            </div>
                        ))}
                        <button className="text-blue-600 font-bold mt-2" onClick={() => { onNavigate('leads'); closeModal(); }}>View All Leads</button>
                    </div>
                );
            case 'FOLLOW_UPS':
                return (
                    <div className="flex flex-col gap-4">
                        {tasks.slice(0, 5).map(task => (
                            <div key={task.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1a202c] rounded-xl">
                                <div>
                                    <div className="font-bold dark:text-white">{task.title}</div>
                                    <div className="text-sm text-gray-500">{task.date} at {task.time}</div>
                                </div>
                                <span className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            </div>
                        ))}
                        <button className="text-blue-600 font-bold mt-2" onClick={() => { onNavigate('follow-ups'); closeModal(); }}>View Monthly Schedule</button>
                    </div>
                );
            case 'PENDING_DOCS':
                return (
                    <div className="flex flex-col gap-4">
                        {MOCK_LEADS.filter(l => l.documents.some(d => d.status === 'Pending')).map(lead => (
                            <div key={lead.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1a202c] rounded-xl">
                                <div>
                                    <div className="font-bold dark:text-white">{lead.name}</div>
                                    <div className="text-sm text-gray-500">{lead.documents.filter(d => d.status === 'Pending').length} Pending Documents</div>
                                </div>
                                <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg" onClick={() => { onViewLeadDetails(lead); closeModal(); }}>View Details</button>
                            </div>
                        ))}
                    </div>
                );
            case 'PRODUCT_BRIEF':
                if (!selectedProduct) return null;
                return (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                        <div className="p-5 bg-blue-50/30 dark:bg-blue-500/5 rounded-2xl border border-blue-100/50 dark:border-blue-500/20">
                            <h4 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Category Overview</h4>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{selectedProduct.brief}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Minimum Requirements</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {selectedProduct.requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-white/5">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'AI_SUMMARY':
                return (
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Weekly Performance Recap</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">Total leads handled increased by 15%. Verification speed improved by 20% compared to previous week.</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl">
                            <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Next Steps Recommendation</h4>
                            <p className="text-sm text-purple-700 dark:text-purple-400">Prioritize \"Robert Miller\" as document verification is 90% complete. Follow up with \"Michael Chen\" for missing ID.</p>
                        </div>
                    </div>
                );
            case 'KNOWLEDGE_BASE':
                const requiredDetails = [
                    'Turnover', 'Amount', 'Purpose', 'Homeowner', 'Bank',
                    'Overdraft', 'Existing Loan', 'Term', 'Contact', 'Email',
                    'How soon do you need this funding?'
                ];
                return (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Required Call Details</h4>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                                {requiredDetails.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-white/5">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <p className="text-gray-500">Details for this section will be displayed here.</p>;
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-full overflow-x-hidden font-['Sora',sans-serif] animate-fadeIn pb-10 px-1">

            {/* ── HEADER ── */}
            <header className="flex items-center justify-between mb-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Tele <span className="text-blue-600">Dashboard</span>
                    </h1>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Command Center & Lead Management</p>
                </div>
            </header>

            {/* ── MAIN CONTENT GRID ── */}
            <div className="grid grid-cols-[1fr_340px] gap-8 xl:grid-cols-1">

                {/* ── LEFT MAIN COLUMN ── */}
                <div className="flex flex-col gap-8 overflow-hidden">
                    {/* ── TOP KPI CARDS ── */}
                    <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
                        {/* MY LEAD COUNT */}
                        <div
                            onClick={() => setActiveModal('LEAD_COUNT')}
                            className="bg-white dark:bg-[#1a202c] rounded-[24px] border-t-4 border-t-blue-600 border border-slate-100 dark:border-white/5 p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">My Lead Count</span>
                                <div className="text-blue-600 dark:text-blue-400">
                                    <IconUserGroup />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{(MOCK_LEAD_COUNTS[user.id] || 0).toLocaleString()}</h2>
                                <span className="text-emerald-500 text-[11px] font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">+5.2%</span>
                            </div>
                        </div>

                        {/* MY FOLLOWUPS */}
                        <div
                            onClick={() => setActiveModal('FOLLOW_UPS')}
                            className="bg-white dark:bg-[#1a202c] rounded-[24px] border-t-4 border-t-orange-500 border border-slate-100 dark:border-white/5 p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">My Followups</span>
                                <div className="text-orange-500 dark:text-orange-400">
                                    <IconClock />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{tasks.length}</h2>
                                <div className="px-2 py-1 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider">Today</div>
                            </div>
                        </div>

                        {/* PENDING LEADS DOCUMENTS */}
                        <div
                            onClick={() => setActiveModal('PENDING_DOCS')}
                            className="bg-white dark:bg-[#1a202c] rounded-[24px] border-t-4 border-t-emerald-500 border border-slate-100 dark:border-white/5 p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pending Leads Docs</span>
                                <div className="text-emerald-500 dark:text-emerald-400">
                                    <IconFolder />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {MOCK_LEADS.filter(l => l.assignedStaffId === user.id && l.documents.some(d => d.status === 'Pending')).length}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* ── CENTRAL DASHBOARD ── */}
                    <div className="grid grid-cols-[1fr_360px] gap-6 lg:grid-cols-1">
                        {/* TODAY'S TASKS LIST */}
                        <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-100 dark:border-white/5 p-7 shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Today's Schedule</h2>
                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Operations Workflow</span>
                                </div>
                                <button
                                    className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-[#2447d7] dark:text-[#6080f8] text-[11px] font-bold rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700"
                                    onClick={() => onNavigate('follow-ups')}
                                >
                                    View Full
                                </button>
                            </div>
                            <div className="flex flex-col gap-3.5 flex-1">
                                {tasks.filter(t => t.date === todayStr).length > 0 ? (
                                    tasks.filter(t => t.date === todayStr).slice(0, 4).map((item) => (
                                        <div key={item.id} className="group flex flex-col p-5 bg-slate-50/40 dark:bg-slate-800/20 rounded-[18px] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-lg ${item.type === 'Followup' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-600/10 text-blue-600'} flex items-center justify-center`}>
                                                        {item.type === 'Followup' ? <IconClock /> : <IconUserGroup />}
                                                    </div>
                                                    <span className={`text-[12px] font-bold ${isDark ? 'text-[#e4ecff]' : 'text-slate-900'}`}>{item.title}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{item.status}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px]">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <span className="flex items-center gap-1.5"><IconClock /> {item.time}</span>
                                                    <span className="flex items-center gap-1.5">Lead: {item.leadName}</span>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-50 dark:border-white/5 flex items-center justify-center text-[8px] font-bold">TJ</div>
                                            </div>
                                        </div>
                                    ))
                                ) : <div className="text-slate-400 italic text-sm">No tasks for today.</div>}
                            </div>
                        </div>

                        {/* MINI CALENDAR */}
                        <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-100 dark:border-white/5 p-7 shadow-sm">
                            <div className="flex items-center justify-between mb-8 px-1">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{monthNames[currentMonth]} {currentYear}</h2>
                                <div className="flex gap-1">
                                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition-all border border-slate-100 dark:border-slate-700"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg></button>
                                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition-all border border-slate-100 dark:border-slate-700"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                                {[...Array(emptySlots)].map((_, i) => <div key={i} />)}
                                {calendarDays.map(day => {
                                    const dStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                    const it = isToday(day);
                                    const isChecked = selectedDate === dStr;
                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(dStr)}
                                            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-xs font-semibold transition-all
                                                ${isChecked ? 'bg-blue-600 text-white shadow-sm scale-105' : it ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}
                                            `}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">Task Highlights</span>
                                <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto">
                                    {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                        tasks.filter(t => t.date === selectedDate).map(t => (
                                            <div key={t.id} className="text-[11px] p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-teal-700/50 shadow-sm text-slate-700 dark:text-slate-300">
                                                {t.title}
                                            </div>
                                        ))
                                    ) : <div className="text-[10px] text-slate-300 italic text-center py-4">No events scheduled</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CREATE ACTION */}
                    <div className="mt-6">
                        <button
                            onClick={() => onNavigate('create-lead')}
                            className="w-full bg-white dark:bg-[#1e2347] border border-slate-200 dark:border-white/5 rounded-[24px] p-8 flex items-center justify-center gap-5 text-blue-600 dark:text-[#6080f8] font-bold hover:bg-slate-50 dark:hover:bg-blue-900/10 transition-all duration-300 shadow-sm group"
                        >
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </div>
                            <div className="text-left">
                                <span className="text-xl font-bold block">Create New Lead</span>
                                <span className="text-[12px] font-medium text-slate-400 uppercase tracking-wider">Initialize customer acquisition flow</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* ── RIGHT MINI COLUMN ── */}
                <div className="flex flex-col gap-6">
                    {/* ASSET CLASSES */}
                    <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-100 dark:border-white/5 p-7 shadow-sm">
                        <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider flex items-center justify-between">
                            Asset Classes
                            <svg viewBox="0 0 24 24" width="14" height="14" className="opacity-40" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5" /></svg>
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {ASSET_PRODUCTS.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => {
                                        setSelectedProduct(p);
                                        setActiveModal('PRODUCT_BRIEF');
                                    }}
                                    className="flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-white dark:hover:bg-blue-500/5 transition-all group scale-100 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className={`w-2 h-2 rounded-full ${p.dotColor} shadow-sm group-hover:scale-125 transition-transform`} />
                                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{p.name}</span>
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-[10px] text-center text-slate-400 font-medium italic">Click category for quick brief & requirements</p>
                    </div>

                    {/* KNOWLEDGE SEARCH */}
                    <div
                        onClick={() => setActiveModal('KNOWLEDGE_BASE')}
                        className="bg-blue-600 rounded-[24px] p-7 text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:bg-blue-700 transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-5 px-1">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="22"
                                    height="22"
                                    fill="currentColor"
                                    style={{ animation: 'bulbFlicker 3s ease-in-out infinite' }}
                                    className="text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.9)]"
                                >
                                    <path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z" />
                                    <rect x="9" y="18" width="6" height="1" rx="0.5" fill="currentColor" opacity="0.6" />
                                    <rect x="9.5" y="19.5" width="5" height="1" rx="0.5" fill="currentColor" opacity="0.4" />
                                </svg>
                            </div>
                            <h2 className="text-base font-bold">Knowledge Base</h2>
                        </div>
                        <style>{`
                            @keyframes bulbFlicker {
                                0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px rgba(253,224,71,0.9)); }
                                40% { opacity: 0.55; filter: drop-shadow(0 0 2px rgba(253,224,71,0.3)); }
                                50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(253,224,71,1)); }
                                70% { opacity: 0.7; filter: drop-shadow(0 0 3px rgba(253,224,71,0.5)); }
                                80% { opacity: 1; filter: drop-shadow(0 0 6px rgba(253,224,71,0.9)); }
                            }
                        `}</style>
                        <p className="text-[11px] text-blue-100/70 font-medium leading-relaxed">Instantly access policy guidelines and lender requirements.</p>
                    </div>

                    {/* AI ANALYTICS placeholder */}
                    <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-100 dark:border-white/5 p-7 shadow-sm flex-1 min-h-[160px] flex flex-col gap-5">
                        <div className="flex items-center justify-between shrink-0">
                            <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Intelligence</h2>
                            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">Ready</span>
                        </div>
                        <div className="flex flex-col justify-center gap-3 opacity-50 flex-1">
                            <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full" />
                            <div className="h-1.5 w-[85%] bg-slate-50 dark:bg-slate-800 rounded-full" />
                            <div className="h-1.5 w-[65%] bg-slate-50 dark:bg-slate-800 rounded-full" />
                            <div className="h-1.5 w-[90%] bg-slate-50 dark:bg-slate-800 rounded-full mt-2" />
                            <div className="h-1.5 w-[75%] bg-slate-50 dark:bg-slate-800 rounded-full" />
                        </div>
                        <div className="mt-auto shrink-0 flex items-center justify-center py-2 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                            Sync with AI Analytics
                        </div>
                    </div>

                    {/* TEAM COMMUNICATION / MS TEAMS */}
                    <div className="bg-white dark:bg-[#1e2347] rounded-[24px] border border-slate-100 dark:border-white/5 p-6 shadow-sm mt-auto">
                        <button
                            onClick={() => window.open('msteams://', '_blank')}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-[#5b5fc7] hover:bg-[#4e52b1] text-white rounded-xl transition-all shadow-md shadow-[#5b5fc7]/20 group active:scale-[0.98]"
                            title="Open Microsoft Teams"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M12.5 13.5c1.38 0 2.5 1.12 2.5 2.5v1h-5v-1c0-1.38 1.12-2.5 2.5-2.5zm0-4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm.5 11c1.93 0 3.5-1.57 3.5-3.5v-1c0-.28-.22-.5-.5-.5H9c-.28 0-.5.22-.5.5v1c0 1.93 1.57 3.5 3.5 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-widest">Connect to MS Teams</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── DASHBOARD MODAL ── */}
            <DashboardModal
                isOpen={activeModal !== null}
                onClose={closeModal}
                title={activeModal === 'KNOWLEDGE_BASE' ? 'Knowledge Base' : activeModal?.replace(/_/g, ' ')}
            >
                {renderModalContent()}
            </DashboardModal>
        </div>
    );
};

export default TeleDashboard;
