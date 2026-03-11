import React, { useState, useEffect } from 'react';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';

const TeamLeaderDashboard = ({ onNavigate, tasks = [], setTasks, notifyReminderSet }) => {
    // Shared Stats & Mock Data
    const stats = [
        { label: 'Total Active Leads', value: '1,284', trend: '+5.2%', trendType: 'positive' },
        { label: 'Pending Documents', value: '48', trend: null, trendType: 'neutral' },
    ];

    const agentPerformance = [
        { name: 'John Smith', initials: 'JS', activeLeads: 142, closedDeals: 18, responseTime: '12m 4s', color: '#2447d7' },
        { name: 'Alice Wong', initials: 'AW', activeLeads: 98, closedDeals: 22, responseTime: '8m 30s', color: '#7c3aed' },
        { name: 'Robert King', initials: 'RK', activeLeads: 115, closedDeals: 12, responseTime: '25m 12s', color: '#f59e0b' },
    ];

    const documentCollection = [
        { label: 'BANK STATEMENTS', progress: 78, color: '#2447d7' },
    ];

    const pipelineData = [
        { label: 'Pending Documents', value: '35%', color: '#f59e0b' },
        { label: 'Approved Documents', value: '55%', color: '#10b981' },
        { label: 'Rejected Documents', value: '10%', color: '#e53e3e' },
    ];

    // Calendar & Interaction State
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    const [agentSearch, setAgentSearch] = useState('');
    const filteredAgents = agentPerformance.filter(agent => agent.name.toLowerCase().includes(agentSearch.toLowerCase()) || agent.initials.toLowerCase().includes(agentSearch.toLowerCase()));

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

    // Calendar Grid Logic
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
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

    const updateTaskStatus = (id, newStatus) => {
        if (!setTasks) return;
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateTaskReminder = (id, newReminder) => {
        if (!setTasks) return;
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const updatedTask = { ...t, reminder: newReminder };
                if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updatedTask);
                return updatedTask;
            }
            return t;
        }));
    };

    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-center mb-8 sm:flex-col sm:items-start sm:gap-4">
                <div className="flex flex-col">
                    <h1 className="text-[1.75rem] font-bold text-[#1a202c] mb-2 sm:text-2xl tracking-tight">Dashboard</h1>
                    <p className="text-[0.95rem] text-[#a0aec0] font-medium">Monitoring agent performance and real-time lead flow</p>
                </div>
                <div className="relative">
                    <button className={`w-11 h-11 bg-white border border-[#edf2f7] rounded-xl text-[#718096] flex items-center justify-center hover:bg-[#f7fafc] hover:text-[#2447d7] transition-all duration-200 relative ${tasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed') ? 'after:content-[""] after:absolute after:top-2.5 after:right-2.5 after:w-2 after:h-2 after:bg-red-500 after:border-2 after:border-white after:rounded-full' : ''}`} onClick={() => setShowNotifications(!showNotifications)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                    {showNotifications && (
                        <div className="absolute top-14 right-0 w-[300px] bg-white rounded-2xl shadow-xl border border-[#edf2f7] z-[100] overflow-hidden animate-fadeIn">
                            <div className="p-4 bg-[#f8fafc] border-b border-[#edf2f7] text-sm font-bold text-[#1a202c]">Reminders & Alerts</div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                    tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                        <div key={t.id} className="p-3 px-4 flex items-center gap-3 border-b border-[#f7fafc] hover:bg-[#f8fafc] transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                                    <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><path d="M6.38 18.7l-.44 1.1a1 1 0 0 1-1.32.5l-2.2-.9a1 1 0 0 1-.5-1.32l.44-1.1" /><path d="M17.62 18.7l.44 1.1a1 1 0 0 1 1.32.5l2.2-.9a1 1 0 0 1 .5-1.32l-.44-1.1" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[13px] font-bold text-[#2d3748] leading-tight flex items-center gap-1.5">{t.title} {t.assignedTo === 'Self' ? <span className="bg-[#f8fafc] text-[#a0aec0] text-[9px] px-1 rounded uppercase tracking-wider border border-[#edf2f7]">Self</span> : ''}</span>
                                                <span className="text-[11px] text-[#a0aec0] font-medium">{t.date} at {t.time}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-[#a0aec0] text-[13px] italic">No active reminders</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-2 gap-6 mb-10 sm:grid-cols-1">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">{stat.label}</span>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-extrabold text-[#1a202c] tracking-tight">{stat.value}</h2>
                                {stat.trend && (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${stat.trendType === 'positive' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#718096] border-[#e2e8f0]'
                                        }`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[1fr_360px] gap-8 xl:grid-cols-1">
                {/* Main Content Areas */}
                <div className="flex flex-col gap-8">
                    <section className="flex flex-col gap-5">
                        <div className="flex justify-between items-center bg-[#f7fafc] rounded-xl px-4 py-3 border border-[#edf2f7] mb-4 gap-4 sm:flex-col sm:items-start">
                            <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">Agent Performance</h2>
                            <div className="flex-1 max-w-[480px] w-full">
                                <div className="relative flex items-center bg-white rounded-lg px-3 border border-[#e2e8f0] transition-all duration-200 focus-within:border-[#2447d7] focus-within:shadow-[0_0_0_2px_rgba(36,71,215,0.1)]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="mr-2 shrink-0">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search agents..."
                                        className="w-full h-9 bg-transparent border-none outline-none text-[13px] text-[#1a202c] font-medium placeholder:text-[#a0aec0]"
                                        value={agentSearch}
                                        onChange={(e) => setAgentSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="text-[12px] font-bold text-[#2447d7] hover:underline underline-offset-4 decoration-2 transition-all whitespace-nowrap" onClick={() => onNavigate && onNavigate('calendar')}>View Full Report</button>
                        </div>
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#f7fafc]">
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">AGENT NAME</th>
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">ACTIVE LEADS</th>
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">CLOSED DEALS</th>
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">RESPONSE TIME</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f7fafc]">
                                        {filteredAgents.length > 0 ? filteredAgents.map((agent, idx) => (
                                            <tr key={idx} className="hover:bg-[#f8fafc]/50 transition-colors group">
                                                <td className="p-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black transition-transform duration-300 group-hover:scale-110 shadow-sm"
                                                            style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
                                                        >
                                                            <span>{agent.initials}</span>
                                                        </div>
                                                        <span className="text-[14px] font-bold text-[#2d3748] tracking-tight">{agent.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 px-6 text-[14px] font-bold text-[#4a5568]">{agent.activeLeads}</td>
                                                <td className="p-5 px-6 text-[14px] font-bold text-[#4a5568]">{agent.closedDeals}</td>
                                                <td className="p-5 px-6 text-[14px] font-bold text-[#4a5568] font-mono">{agent.responseTime}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-sm text-[#a0aec0]">No agents found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] flex flex-col gap-6">
                        <div className="flex justify-between items-center gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-[#1a202c]">Calendar & Events</h2>

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
                            <div className="relative rounded-xl overflow-hidden bg-[#fdfdfd] min-h-[400px] border border-[#f1f5f9]">
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
                                                className={`aspect-square flex items-center justify-center text-[13px] font-bold rounded-xl cursor-pointer relative transition-all duration-200 border border-transparent ${itoday ? 'bg-[#ebf0ff] text-[#2447d7] border-[#2447d7]/20 cursor-pointer pointer-events-auto' :
                                                        isSelected ? 'bg-[#2447d7] text-white shadow-[0_4px_12px_rgba(36,71,215,0.25)]' :
                                                            'text-[#4a5568] hover:bg-[#f8fafc] hover:border-[#edf2f7] hover:text-[#2447d7]'
                                                    }`}
                                                onClick={() => setSelectedDate(dateStr)}
                                            >
                                                {day}
                                                {dayTasks.length > 0 && !isSelected && (
                                                    <span className="absolute bottom-1.5 w-1 h-1 bg-[#2447d7] rounded-full"></span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-4 border border-[#f1f5f9]">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">{new Date(selectedDate).toLocaleDateString([], { month: 'short', day: 'numeric', timeZone: 'UTC' })}</h4>
                                        <button className="w-6 h-6 flex items-center justify-center bg-[#2447d7] text-white rounded-lg hover:bg-[#1a32a3] transition-colors duration-150" onClick={() => onNavigate('calendar')}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
                                        {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                            tasks.filter(t => t.date === selectedDate).map(t => (
                                                <div key={t.id} className="flex flex-col gap-3 group bg-white rounded-xl border border-[#edf2f7] p-3 shadow-sm hover:shadow-md transition-all">
                                                    <div className="flex items-start gap-2.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.status === 'Completed' ? 'bg-[#10b981]' :
                                                                t.status === 'In Progress' ? 'bg-[#f59e0b]' :
                                                                    'bg-[#cbd5e0]'
                                                            }`}></span>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-[12px] font-bold text-[#1a202c] truncate leading-tight group-hover:text-[#2447d7] transition-colors">{t.title}</span>
                                                            <span className="text-[10px] text-[#a0aec0] font-medium mt-0.5">{t.time}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 pl-4">
                                                        <div className="flex items-center border border-[#edf2f7] rounded-lg bg-[#f7fafc]">
                                                            <select
                                                                className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#718096] bg-transparent outline-none hover:text-[#2447d7] transition-all cursor-pointer border-none"
                                                                value={t.reminder || 'none'}
                                                                onChange={(e) => updateTaskReminder(t.id, e.target.value)}
                                                                title="Update Reminder"
                                                            >
                                                                <option value="none">🔔 Off</option>
                                                                <option value="15m">15m</option>
                                                                <option value="1h">1h</option>
                                                                <option value="1d">1d</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center flex-1">
                                                            <select
                                                                className={`w-full py-1 text-[10px] pr-6 font-black uppercase tracking-widest border border-[#edf2f7] outline-none transition-all cursor-pointer shadow-sm rounded-lg ${t.status === 'Completed' ? 'bg-[#ecfdf5] text-[#059669]' :
                                                                        t.status === 'In Progress' ? 'bg-[#ebf5ff] text-[#2447d7]' :
                                                                            'bg-[#fff7ed] text-[#ea580c]'
                                                                    }`}
                                                                value={t.status}
                                                                onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                                                            >
                                                                <option>Pending</option>
                                                                <option>In Progress</option>
                                                                <option>Completed</option>
                                                            </select>
                                                        </div>
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

                {/* Right Column (Secondary metrics) */}
                <div className="flex flex-col gap-8">
                    <section className="flex flex-col gap-5">
                        <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Document Collection</h2>
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6">
                            <div className="flex flex-col gap-6">
                                {documentCollection.map((doc, idx) => (
                                    <div key={idx} className="flex flex-col gap-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black text-[#4a5568] tracking-widest">{doc.label}</span>
                                            <span className="text-lg font-black text-[#2447d7]">{doc.progress}%</span>
                                        </div>
                                        <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#2447d7] to-[#4c6ef5] rounded-full transition-all duration-[1500ms] shadow-sm"
                                                style={{ width: `${doc.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                <p className="text-[10px] text-[#94a3b8] font-bold leading-relaxed bg-[#f8fafc] p-3 rounded-lg border border-[#f1f5f9] border-dashed">Tracking team-wide bank statement verification status across all active loan applications.</p>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Document Status</h2>
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center gap-8">
                            <div className="relative w-44 h-44 group">
                                <div
                                    className="absolute inset-0 rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-700 group-hover:rotate-12"
                                    style={{ background: 'conic-gradient(#f59e0b 0% 35%, #10b981 35% 90%, #e53e3e 90% 100%)' }}
                                ></div>
                                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border border-[#edf2f7]">
                                    <span className="text-[10px] font-black text-[#cbd5e0] tracking-widest mb-1">TOTAL</span>
                                    <span className="text-3xl font-black text-[#1a202c] tracking-tight">120</span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-4">
                                {pipelineData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8fafc] transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full ring-4 ring-offset-2 transition-all group-hover:scale-125" style={{ backgroundColor: item.color, ringColor: `${item.color}20` }}></span>
                                            <span className="text-[12px] font-bold text-[#4a5568]">{item.label}</span>
                                        </div>
                                        <span className="text-[13px] font-black text-[#1a202c] bg-[#f1f5f9] px-2 py-0.5 rounded-md min-w-[40px] text-center">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TeamLeaderDashboard;
