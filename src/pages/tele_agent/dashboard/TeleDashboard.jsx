import React, { useState, useEffect } from 'react';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';

/* ─── SVG ICONS ─── */
const IconBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

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

/* ─── DATA MOCK ─── */
// Removed FOLLOW_UPS mock data, using prop instead.

const LEADS_BY_STAGE = [
    { stage: 'DOCUMENT COLLECTED', count: 42, percentage: 85 },
    { stage: 'DOCUMENT VERIFICATIONS', count: 28, percentage: 60 },
    { stage: 'LENDER SELECTION', count: 34, percentage: 75 },
    { stage: 'LOAN CONFIRMED', count: 12, percentage: 30 },
    { stage: 'LOAN REJECTED', count: 3, percentage: 10 },
];

/* ─── MAIN COMPONENT ─── */
const TeleDashboard = ({ onNavigate, tasks }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

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

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Adjust for Monday start (Original view used MON-SUN)
    // getDay() returns 0 for SUN, 1 for MON...
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

    return (
        <div className="flex flex-col gap-6 w-full max-w-full overflow-x-hidden font-['Sora',sans-serif] animate-fadeIn">

            {/* ── HEADER ── */}
            <header className="flex flex-col gap-1 animate-headerDrop">
                <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Tele Agent Dashboard</h1>
                <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Real-time overview of your lead activity and schedule.</p>
            </header>

            {/* ── TOP STATS ── */}
            <section className="flex gap-6 sm:flex-col">
                <div className="flex-1 bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] flex flex-col gap-5 min-w-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:200ms] [animation-fill-mode:both]">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-[#ebf0ff] text-[#2447d7] rounded-xl flex items-center justify-center">
                            <IconUserGroup />
                        </div>
                    </div>
                    <div>
                        <span className="text-sm text-[#718096] font-medium">My Active Leads</span>
                        <h2 className="text-[2rem] font-bold text-[#1a202c] mt-1">1,284</h2>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] flex flex-col gap-5 min-w-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop [animation-delay:280ms] [animation-fill-mode:both]">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-[#fffbef] text-[#ed8936] rounded-xl flex items-center justify-center">
                            <IconFolder />
                        </div>
                    </div>
                    <div>
                        <span className="text-sm text-[#718096] font-medium">Pending Documents</span>
                        <h2 className="text-[2rem] font-bold text-[#1a202c] mt-1">28</h2>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-[1fr_340px] gap-6 lg:grid-cols-1">

                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col gap-6 min-w-0">

                    <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                        <div className="flex justify-between items-center mb-6 gap-3 sm:flex-col sm:items-start">
                            <h2 className="text-lg font-bold text-[#1a202c]">Today's Follow-ups</h2>
                            <button className="bg-none border-none text-[#2447d7] font-semibold text-sm cursor-pointer hover:underline" onClick={() => onNavigate('follow-ups')}>View all schedule</button>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse table-auto">
                                <thead>
                                    <tr>
                                        <th className="text-left text-xs font-bold text-[#a0aec0] pb-4 border-b border-[#f7fafc] w-[45%] sm:w-[50%] uppercase tracking-wider">LEAD NAME</th>
                                        <th className="text-left text-xs font-bold text-[#a0aec0] pb-4 border-b border-[#f7fafc] w-[20%] md:hidden uppercase tracking-wider">TYPE</th>
                                        <th className="text-left text-xs font-bold text-[#a0aec0] pb-4 border-b border-[#f7fafc] w-[15%] sm:w-[20%] uppercase tracking-wider">TIME</th>
                                        <th className="text-left text-xs font-bold text-[#a0aec0] pb-4 border-b border-[#f7fafc] w-[20%] sm:w-[30%] uppercase tracking-wider">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.filter(t => t.date === todayStr).length > 0 ? (
                                        tasks.filter(t => t.date === todayStr).map((item, idx) => (
                                            <tr key={item.id} className="border-b border-[#f7fafc] last:border-0 hover:bg-[#f8fafc] transition-colors duration-150 animate-rowIn" style={{ animationDelay: `${500 + idx * 60}ms`, animationFillMode: 'both' }}>
                                                <td className="py-4 pr-3 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#ebf0ff] flex items-center justify-center font-bold text-[13px] shrink-0">
                                                        <span className="text-[#2447d7]">{item.lead.split(' ').map(n => n[0]).join('')}</span>
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="text-sm font-bold text-[#1a202c] truncate">{item.lead}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-3 md:hidden">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${item.type === 'Call' ? 'bg-blue-100 text-blue-700' :
                                                            item.type === 'Document' ? 'bg-purple-100 text-purple-700' :
                                                                item.type === 'Email' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>{item.type}</span>
                                                </td>
                                                <td className="py-4 pr-3">
                                                    <div className="text-sm font-medium text-[#1a202c]">{item.time}</div>
                                                    <div className="text-[11px] text-[#a0aec0] font-medium">Scheduled</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#4a5568]">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Completed' ? 'bg-[#10b981]' :
                                                                item.status === 'In Progress' ? 'bg-[#f59e0b]' :
                                                                    'bg-[#cbd5e0]'
                                                            }`}></span>
                                                        {item.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-[#a0aec0] text-sm">No follow-ups for today</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] animate-slideUp [animation-delay:550ms] [animation-fill-mode:both]">
                        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-[#1a202c]">Tasks and Followups</h2>

                            <div className="flex bg-[#f7fafc] p-1 rounded-xl gap-1">
                                <button
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${!useOutlookCalendar ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#a0aec0] hover:text-[#4a5568]'}`}
                                    onClick={() => setUseOutlookCalendar(false)}
                                >
                                    Local
                                </button>
                                <button
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${useOutlookCalendar ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#a0aec0] hover:text-[#4a5568]'}`}
                                    onClick={() => setUseOutlookCalendar(true)}
                                >
                                    Outlook <span className="sm:hidden">Calendar</span>
                                </button>
                            </div>

                            {!useOutlookCalendar && (
                                <div className="flex items-center gap-3">
                                    <button className="w-7 h-7 flex items-center justify-center bg-[#f7fafc] border border-[#edf2f7] rounded-lg text-[#718096] cursor-pointer hover:bg-[#ebf0ff] hover:text-[#2447d7] hover:border-[#2447d7] transition-all duration-200" onClick={prevMonth}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    <div className="text-sm font-bold text-[#1a202c] min-w-[120px] text-center">{monthName}</div>
                                    <button className="w-7 h-7 flex items-center justify-center bg-[#f7fafc] border border-[#edf2f7] rounded-lg text-[#718096] cursor-pointer hover:bg-[#ebf0ff] hover:text-[#2447d7] hover:border-[#2447d7] transition-all duration-200" onClick={nextMonth}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {useOutlookCalendar ? (
                            <div className="relative rounded-xl overflow-hidden bg-[#fdfdfd] min-h-[400px]">
                                {!outlookAccount ? (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center bg-white/90 backdrop-blur-[2px] p-8">
                                        <svg viewBox="0 0 24 24" width="48" height="48" className="mb-4">
                                            <path d="M11 2h10v10H11V2M2 2h7v7H2V2m9 9h10v10H11V11M2 11h7v10H2v-10z" fill="#0078d4" />
                                        </svg>
                                        <h3 className="text-lg font-bold text-[#1a202c] mb-2">Connect Your Outlook Calendar</h3>
                                        <p className="text-sm text-[#718096] leading-relaxed max-w-[300px] mb-6">Sync with your Microsoft 365 account to manage your CRM follow-ups directly from Outlook.</p>
                                        <button className="px-6 py-2.5 bg-[#0078d4] text-white rounded-xl font-bold text-sm shadow-[0_4px_12px_rgba(0,120,212,0.2)] hover:bg-[#005a9e] hover:-translate-y-px transition-all duration-200 active:translate-y-0" onClick={handleOutlookLogin}>
                                            Sign in with Microsoft
                                        </button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 z-5 bg-white flex flex-col p-4 animate-fadeIn">
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#f1f5f9]">
                                            <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-1.5 rounded-full">
                                                <div className="w-5 h-5 bg-[#0078d4] text-white rounded-full flex items-center justify-center font-bold text-[10px] uppercase">{outlookAccount.name?.charAt(0) || 'U'}</div>
                                                <span className="text-[11px] font-semibold text-[#64748b] truncate max-w-[150px]">{outlookAccount.username}</span>
                                            </div>
                                            <button className="text-[11px] font-bold text-[#0078d4] hover:underline cursor-pointer disabled:text-[#94a3b8] disabled:cursor-not-allowed" onClick={fetchOutlookEvents} disabled={loadingEvents}>
                                                {loadingEvents ? 'Updating...' : 'Refresh'}
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                                            {outlookEvents.length > 0 ? (
                                                outlookEvents.map((evt, i) => (
                                                    <div key={i} className="flex gap-3 p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors duration-200">
                                                        <div className="flex flex-col min-w-[60px]">
                                                            <span className="text-[11px] font-bold text-[#0078d4]">{new Date(evt.start.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                            <span className="text-[10px] text-[#94a3b8] font-medium">{new Date(evt.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-0.5 min-w-0">
                                                            <div className="text-xs font-bold text-[#1e293b] truncate">{evt.subject}</div>
                                                            <div className="text-[10px] text-[#64748b] truncate">{evt.location?.displayName || 'No location'}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 text-[#94a3b8] text-sm italic">No upcoming events found in Outlook.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="h-[400px] bg-[#f8fafc] opacity-30"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-[1fr_200px] gap-5 lg:grid-cols-1">
                                <div className="grid grid-cols-7 gap-1 w-full">
                                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                        <div key={day} className="text-center text-[10px] font-bold text-[#a0aec0] mb-2 uppercase tracking-tight">{day}</div>
                                    ))}
                                    {[...Array(emptySlots)].map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
                                    {calendarDays.map(day => {
                                        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                        const dayTasks = tasks.filter(t => t.date === dateStr);
                                        const isSelected = selectedDate === dateStr;
                                        const itoday = isToday(day);
                                        return (
                                            <div
                                                key={day}
                                                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer relative transition-all duration-200
                                                    ${itoday && !isSelected ? 'bg-[#eef2ff]' : isSelected ? 'bg-[#2447d7] shadow-[0_4px_12px_rgba(36,71,215,0.25)]' : 'hover:bg-[#f8fafc]'}
                                                `}
                                                onClick={() => setSelectedDate(dateStr)}
                                            >
                                                <span className={`text-[13px] font-bold w-6 h-6 flex items-center justify-center rounded-full
                                                    ${itoday ? 'bg-[#2447d7] text-white' : isSelected ? 'text-white' : 'text-[#4a5568] hover:text-[#2447d7]'}
                                                `}>{day}</span>
                                                {dayTasks.length > 0 && !isSelected && (
                                                    <span className="absolute bottom-1.5 w-1 h-1 bg-[#2447d7] rounded-full"></span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-4 border border-[#f1f5f9]">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">{new Date(selectedDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</h4>
                                        <button className="w-6 h-6 flex items-center justify-center bg-[#2447d7] text-white rounded-lg hover:bg-[#1a32a3] transition-colors duration-150" onClick={() => onNavigate('follow-ups', selectedDate)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
                                        {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                            tasks.filter(t => t.date === selectedDate).map(t => (
                                                <div key={t.id} className="flex items-start gap-2.5 group">
                                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.status === 'Completed' ? 'bg-[#10b981]' :
                                                            t.status === 'In Progress' ? 'bg-[#f59e0b]' :
                                                                'bg-[#cbd5e0]'
                                                        }`}></span>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[11px] font-bold text-[#1a202c] truncate leading-tight group-hover:text-[#2447d7] transition-colors">{t.title}</span>
                                                        <span className="text-[10px] text-[#a0aec0] font-medium mt-0.5">{t.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-[#a0aec0] italic text-center py-4">No tasks for this day</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col gap-6 w-full">

                    {/* Leads by Stage */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] animate-slideUp [animation-delay:650ms] [animation-fill-mode:both]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#1a202c]">Leads by Stage</h2>
                            <span className="text-[10px] font-bold text-[#a0aec0] tracking-widest uppercase">128 TOTAL</span>
                        </div>
                        <div className="flex flex-col gap-5">
                            {LEADS_BY_STAGE.map(item => (
                                <div className="flex flex-col gap-2" key={item.stage}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-[#718096] uppercase tracking-tight">{item.stage}</span>
                                        <span className="text-xs font-bold text-[#1a202c]">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                                        <div className="h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${item.percentage}%`, background: item.percentage > 80 ? '#2447d7' : (item.percentage > 50 ? '#6366f1' : '#a5b4fc') }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Productivity Streak */}
                    <div className="bg-gradient-to-br from-[#2447d7] to-[#1732a3] rounded-2xl p-6 shadow-[0_10px_20px_rgba(36,71,215,0.2)] text-white relative overflow-hidden group animate-slideUp [animation-delay:750ms] [animation-fill-mode:both]">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="relative z-10 flex flex-col gap-4">
                            <h3 className="text-sm font-bold tracking-wide uppercase opacity-90">Productivity Streak</h3>
                            <p className="text-sm leading-relaxed font-medium opacity-90">You've reached 85% of your daily call goal. 12 more to hit your target!</p>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="h-full bg-white transition-all duration-700 ease-out" style={{ width: '85%' }}></div>
                                </div>
                                <span className="text-xs font-bold">85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleDashboard;
