import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { signIn, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { TL_STATS as stats, TL_AGENT_PERFORMANCE as agentPerformance, TL_DOCUMENT_COLLECTION as documentCollection, TL_PIPELINE_DATA as pipelineData } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

const DONUT_GAP_DEG = 3;

const DonutChart = ({ data, total }) => {
    const [hovered, setHovered] = useState(null);
    const [drawn, setDrawn] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const t = setTimeout(() => setDrawn(true), 200);
        return () => clearTimeout(t);
    }, []);

    const size = 220;
    const cx = size / 2, cy = size / 2;
    const outerR = 88, innerR = 58;
    const hovSeg = hovered !== null ? data[hovered] : null;

    const polarToCartesian = (angle, r) => ({
        x: cx + r * Math.cos((angle - 90) * Math.PI / 180),
        y: cy + r * Math.sin((angle - 90) * Math.PI / 180),
    });

    const describeArc = (startAngle, endAngle, r1, r2) => {
        const s1 = polarToCartesian(startAngle, r1);
        const e1 = polarToCartesian(endAngle, r1);
        const s2 = polarToCartesian(endAngle, r2);
        const e2 = polarToCartesian(startAngle, r2);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return [
            `M ${s1.x} ${s1.y}`,
            `A ${r1} ${r1} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
            `L ${s2.x} ${s2.y}`,
            `A ${r2} ${r2} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
            'Z'
        ].join(' ');
    };

    let cumAngle = 0;
    const segments = data.map((item, i) => {
        const val = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
        const angleDeg = (val / 100) * 360;
        const startAngle = cumAngle + DONUT_GAP_DEG / 2;
        const endAngle = cumAngle + angleDeg - DONUT_GAP_DEG / 2;
        cumAngle += angleDeg;
        return { ...item, startAngle, endAngle, val, index: i };
    });

    const gradientDefs = [
        { id: 'grad0', from: '#f59e0b', to: '#fbbf24' },
        { id: 'grad1', from: '#10b981', to: '#34d399' },
        { id: 'grad2', from: '#ef4444', to: '#f87171' },
    ];

    return (
        <div className="relative flex flex-col items-center w-full">
            {/* Chart */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
                    <defs>
                        {gradientDefs.map(g => (
                            <radialGradient key={g.id} id={g.id} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={g.from} stopOpacity="1" />
                                <stop offset="100%" stopColor={g.to} stopOpacity="0.85" />
                            </radialGradient>
                        ))}
                        <filter id="segShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
                        </filter>
                        <filter id="segGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="0" stdDeviation="10" floodOpacity="0.55" />
                        </filter>
                    </defs>

                    {/* Background ring */}
                    <circle cx={cx} cy={cy} r={(outerR + innerR) / 2} fill="none"
                        stroke="#f1f5f9" strokeWidth={outerR - innerR} />

                    {/* Segments */}
                    {segments.map((seg, i) => {
                        const isHov = hovered === i;
                        const scaleVal = isHov ? 1.06 : 1;
                        return (
                            <g key={seg.label}
                                style={{
                                    transformOrigin: `${cx}px ${cy}px`,
                                    transform: `scale(${drawn ? scaleVal : 0.6})`,
                                    transition: `transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease ${200 + i * 130}ms`,
                                    opacity: drawn ? (hovered !== null && !isHov ? 0.3 : 1) : 0,
                                    cursor: 'pointer',
                                    filter: isHov ? `url(#segGlow)` : `url(#segShadow)`,
                                }}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <path
                                    d={describeArc(seg.startAngle, seg.endAngle, outerR + (isHov ? 6 : 0), innerR - (isHov ? 3 : 0))}
                                    fill={`url(#grad${i})`}
                                    stroke={isDark ? '#1e2347' : 'white'}
                                    strokeWidth="2"
                                />
                            </g>
                        );
                    })}

                    {/* Center circle */}
                    <circle cx={cx} cy={cy} r={innerR - 6} fill={isDark ? '#1e2347' : 'white'}
                        style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div
                        className="font-black leading-none transition-all duration-300"
                        style={{
                            fontSize: hovSeg ? '28px' : '32px',
                            color: hovSeg ? hovSeg.color : (isDark ? '#e4ecff' : '#1a202c'),
                        }}
                    >
                        {hovSeg ? `${hovSeg.value}%` : total}
                    </div>
                    <div
                        className="text-[10px] font-extrabold uppercase tracking-[0.18em] mt-1.5 transition-all duration-300"
                        style={{ color: hovSeg ? hovSeg.color : '#94a3b8' }}
                    >
                        {hovSeg ? hovSeg.label.split(' ')[0] : 'TOTAL'}
                    </div>
                    {hovSeg && (
                        <div className="text-[9px] font-bold text-[#cbd5e0] uppercase tracking-wider mt-0.5">
                            Documents
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TeamLeaderDashboard = ({ onNavigate, tasks = [], setTasks, notifyReminderSet }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leads } = useLeads();


    // Calendar & Interaction State
    const [useOutlookCalendar, setUseOutlookCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [outlookAccount, setOutlookAccount] = useState(null);
    const [outlookEvents, setOutlookEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    const [agentSearch, setAgentSearch] = useState('');
    const filteredAgents = agentPerformance.filter(agent => agent.name.toLowerCase().includes(agentSearch.toLowerCase()) || agent.initials.toLowerCase().includes(agentSearch.toLowerCase()));

    const [selectedAgent, setSelectedAgent] = useState(null);
    const agentLeads = selectedAgent ? leads.filter(l => l.agentName === selectedAgent.name) : [];

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
    const notificationBtnRef = useRef(null);
    const [notificationPopupPos, setNotificationPopupPos] = useState({ top: 0, right: 0 });

    const computeNotificationPopupPos = () => {
        const el = notificationBtnRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();

        const width = 300;
        const margin = 12;
        const desiredTop = rect.bottom + 12;
        const desiredRight = Math.max(margin, window.innerWidth - rect.right);
        const maxRight = Math.max(margin, window.innerWidth - margin - width);
        const right = Math.min(desiredRight, maxRight);

        setNotificationPopupPos({
            top: Math.max(margin, desiredTop),
            right,
        });
    };

    useEffect(() => {
        if (!showNotifications) return;
        computeNotificationPopupPos();

        const onWindowChange = () => computeNotificationPopupPos();
        window.addEventListener('resize', onWindowChange);
        window.addEventListener('scroll', onWindowChange, true);
        return () => {
            window.removeEventListener('resize', onWindowChange);
            window.removeEventListener('scroll', onWindowChange, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNotifications]);

    useEffect(() => {
        if (!showNotifications) return;
        const onDocMouseDown = (e) => {
            const btn = notificationBtnRef.current;
            if (btn && btn.contains(e.target)) return;
            setShowNotifications(false);
        };
        document.addEventListener('mousedown', onDocMouseDown, true);
        return () => document.removeEventListener('mousedown', onDocMouseDown, true);
    }, [showNotifications]);

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-center mb-8 sm:flex-col sm:items-start sm:gap-4 animate-headerDrop">
                <div className="flex flex-col">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1 tracking-tight">Team Lead Dashboard</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Monitoring agent performance and real-time lead flow</p>
                </div>
            </header>


            <div className="grid grid-cols-2 gap-6 mb-10 sm:grid-cols-1">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop" style={{ animationDelay: `${200 + idx * 80}ms`, animationFillMode: 'both' }}>
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
                    <section className="flex flex-col gap-5 animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
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
                        </div>
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead className="md:hidden">
                                        <tr className="border-b border-[#f7fafc]">
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">AGENT NAME</th>
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">ACTIVE LEADS</th>
                                            <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">CLOSED DEALS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f7fafc] table-row-group md:flex md:flex-col">
                                        {filteredAgents.length > 0 ? filteredAgents.map((agent, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-[#f8fafc] transition-colors group animate-rowIn table-row md:flex md:flex-col border-b md:border-b-0 border-[#f7fafc] cursor-pointer"
                                                style={{ animationDelay: `${450 + idx * 60}ms`, animationFillMode: 'both' }}
                                                onClick={() => setSelectedAgent(agent)}
                                                title={`View ${agent.name}'s leads`}
                                            >
                                                <td className="p-5 px-6 table-cell md:flex md:items-center md:gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black transition-transform duration-300 group-hover:scale-110 shadow-lg text-white"
                                                            style={{ backgroundColor: agent.color }}
                                                        >
                                                            <span>{agent.initials}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[14px] font-bold tracking-tight" style={{ color: isDark ? agent.color : '#2d3748' }}>{agent.name}</span>
                                                            <span className="text-[10px] font-semibold text-[#a0aec0] group-hover:text-[#2447d7] transition-colors">View leads →</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5 px-6 table-cell md:flex md:items-center md:justify-between md:border-t md:border-t-[#f1f5f9] md:py-3.5">
                                                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Active Leads</span>
                                                    <span className="text-[14px] font-bold text-[#4a5568]">{agent.activeLeads}</span>
                                                </td>
                                                <td className="p-5 px-6 table-cell md:flex md:items-center md:justify-between md:py-3.5">
                                                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">Closed Deals</span>
                                                    <span className="text-[14px] font-bold text-[#4a5568]">{agent.closedDeals}</span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr className="table-row">
                                                <td colSpan="3" className="p-6 text-center text-sm text-[#a0aec0]">No agents found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] flex flex-col gap-6 animate-slideUp [animation-delay:550ms] [animation-fill-mode:both]">
                        <div className="flex justify-between items-center gap-4 flex-wrap">
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
                            <div className={`relative rounded-xl overflow-hidden min-h-[400px] ${isDark ? 'bg-[#1e293b] border border-[#334155]' : 'bg-[#fdfdfd] border border-[#f1f5f9]'}`}>
                                {!outlookAccount ? (
                                    <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 ${isDark ? 'bg-[#1e293b]/95 backdrop-blur-[2px]' : 'bg-white/90 backdrop-blur-[2px]'}`}>
                                        <svg viewBox="0 0 24 24" width="48" height="48" className="mb-4">
                                            <path d="M11 2h10v10H11V2M2 2h7v7H2V2m9 9h10v10H11V11M2 11h7v10H2v-10z" fill="#0078d4" />
                                        </svg>
                                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>Connect Your Outlook Calendar</h3>
                                        <p className={`text-sm leading-relaxed max-w-[300px] mb-6 ${isDark ? 'text-[#94a3b8]' : 'text-[#718096]'}`}>Sync with your Microsoft 365 account to manage your CRM follow-ups directly from Outlook.</p>
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
                                                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer relative transition-all duration-200 border border-transparent
                                                    ${itoday && !isSelected ? 'bg-[#eef2ff] border-[#2447d7]/20' : isSelected ? 'bg-[#2447d7] shadow-[0_4px_12px_rgba(36,71,215,0.25)]' : 'hover:bg-[#f8fafc] hover:border-[#edf2f7]'}
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
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <span className="text-[12px] font-bold text-[#1a202c] truncate leading-tight group-hover:text-[#2447d7] transition-colors">{t.title}</span>
                                                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                                <span className="text-[10px] text-[#a0aec0] font-medium whitespace-nowrap">{t.time} {t.lead ? `· ${t.lead}` : (t.createdBy && t.createdBy !== 'Team Leader' ? '· Assigned' : '· Personal')}</span>
                                                                {t.createdBy && t.createdBy !== 'Team Leader' && (
                                                                    <span className="bg-[#fff7ed] text-[#ea580c] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#ffedd5] whitespace-nowrap">By: {t.createdBy}</span>
                                                                )}
                                                            </div>
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
                    <section className="flex flex-col gap-5 animate-slideUp [animation-delay:650ms] [animation-fill-mode:both]">
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

                    <section className="flex flex-col gap-5 animate-slideUp [animation-delay:750ms] [animation-fill-mode:both]">
                        {/* Section header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Document Status</h2>
                            <span className="text-[10px] font-black text-[#94a3b8] bg-[#f8fafc] border border-[#edf2f7] px-2.5 py-1 rounded-full uppercase tracking-widest">Live</span>
                        </div>

                        {/* Card */}
                        <div className="relative bg-white rounded-3xl border border-[#edf2f7] shadow-[0_8px_32px_-4px_rgba(36,71,215,0.07),0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">

                            {/* Subtle top gradient accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                                style={{ background: 'linear-gradient(90deg, #f59e0b 35%, #10b981 35% 90%, #ef4444 90%)' }} />

                            <div className="p-6 pt-7 flex flex-col items-center gap-6">

                                {/* Donut Chart */}
                                <DonutChart data={pipelineData} total={120} />

                                {/* Divider */}
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#edf2f7] to-transparent" />

                                {/* Legend Cards */}
                                <div className="w-full flex flex-col gap-2.5">
                                    {pipelineData.map((item, idx) => {
                                        const icons = [
                                            // Pending - clock
                                            <svg key="pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                                            // Approved - check
                                            <svg key="approved" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>,
                                            // Rejected - x
                                            <svg key="rejected" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
                                        ];
                                        const bgColors = ['rgba(245,158,11,0.08)', 'rgba(16,185,129,0.08)', 'rgba(239,68,68,0.08)'];
                                        const borderColors = ['rgba(245,158,11,0.2)', 'rgba(16,185,129,0.2)', 'rgba(239,68,68,0.2)'];
                                        const barWidths = [item.value, item.value, item.value];

                                        return (
                                            <div
                                                key={idx}
                                                className="group flex flex-col gap-2 p-3.5 rounded-2xl border transition-all duration-300 cursor-default"
                                                style={{
                                                    backgroundColor: bgColors[idx],
                                                    borderColor: borderColors[idx],
                                                }}
                                            >
                                                {/* Top row */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        {/* Icon badge */}
                                                        <div
                                                            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                                            style={{ backgroundColor: item.color, color: 'white' }}
                                                        >
                                                            {icons[idx]}
                                                        </div>
                                                        <span className="text-[13px] font-bold tracking-tight leading-tight" style={{ color: isDark ? '#c8d8ff' : '#2d3748' }}>{item.label}</span>
                                                    </div>
                                                    {/* Value pill */}
                                                    <div className="flex items-baseline gap-0.5">
                                                        <span className="text-[18px] font-black leading-none" style={{ color: item.color }}>{item.value}</span>
                                                        <span className="text-[11px] font-bold text-[#94a3b8]">%</span>
                                                    </div>
                                                </div>

                                                {/* Mini progress bar */}
                                                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
                                                    <div
                                                        className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                                                        style={{
                                                            width: `${item.value}%`,
                                                            background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer note */}
                                <p className="text-[10px] text-[#94a3b8] font-semibold text-center leading-relaxed">
                                    Based on <span className="font-black text-[#64748b]">120</span> total documents across all active loan applications
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* ── Agent Leads Modal ─────────────────────────────── */}
            {selectedAgent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
                    <div
                        className="w-full max-w-[680px] rounded-[22px] overflow-hidden shadow-2xl"
                        style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#f0f3fb'}` }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-black text-white shadow-lg shrink-0" style={{ backgroundColor: selectedAgent.color }}>
                                {selectedAgent.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{selectedAgent.name}</h3>
                                <p className="text-xs" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                                    {agentLeads.length} lead{agentLeads.length !== 1 ? 's' : ''} · {selectedAgent.activeLeads} active · {selectedAgent.closedDeals} closed
                                </p>
                            </div>
                            <button onClick={() => setSelectedAgent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#546298' : '#a0aec0' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        {/* Leads List */}
                        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3">
                            {agentLeads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: isDark ? '#242b58' : '#f0f3ff' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#6080f8' : '#2447d7'} strokeWidth="1.5" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    </div>
                                    <p className="text-sm" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>No leads in the system for this agent yet.</p>
                                </div>
                            ) : agentLeads.map(lead => {
                                const stageMeta = {
                                    'Document Collection':        { color: '#2447d7', bg: isDark ? 'rgba(36,71,215,0.15)' : '#eef2ff' },
                                    'Document Verification Done': { color: '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb' },
                                    'Lender Selection':           { color: '#8b5cf6', bg: isDark ? 'rgba(139,92,246,0.15)' : '#f5f3ff' },
                                    'Completed':                  { color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5' },
                                    'Rejected':                   { color: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2' },
                                }[lead.stage] || { color: '#64748b', bg: '#f1f5f9' };
                                return (
                                    <div key={lead.id} className="rounded-xl p-4 flex items-center gap-4"
                                        style={{ background: isDark ? '#242b58' : '#f8fafc', border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}` }}>
                                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono text-[0.65rem] font-bold" style={{ color: isDark ? '#6080f8' : '#2447d7' }}>{lead.leadId}</span>
                                                <span className="font-bold text-sm" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{lead.name}</span>
                                            </div>
                                            {lead.businessName && (
                                                <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md w-fit"
                                                    style={{ background: isDark ? '#1e2347' : '#f0f3ff', color: isDark ? '#8ea0d4' : '#4b5a8a' }}>
                                                    {lead.businessName}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#2c3568' : '#e2e8f0' }}>
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${lead.progress}%`, background: stageMeta.color }} />
                                                </div>
                                                <span className="text-xs font-bold shrink-0" style={{ color: stageMeta.color }}>{lead.progress}%</span>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold whitespace-nowrap"
                                                style={{ background: stageMeta.bg, color: stageMeta.color }}>
                                                {lead.stage}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamLeaderDashboard;
