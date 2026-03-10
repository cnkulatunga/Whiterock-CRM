import React, { useState } from 'react';

const TeamLeaderDashboard = ({ onNavigate }) => {
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
    const [isConnecting, setIsConnecting] = useState(false);
    const [isOutlookConnected, setIsOutlookConnected] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); // March 2026

    const handleConnectOutlook = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setIsOutlookConnected(true);
        }, 1500);
    };

    // Calendar Grid Logic
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="mb-8">
                <h1 className="text-[1.75rem] font-bold text-[#1a202c] mb-2 sm:text-2xl tracking-tight">Dashboard</h1>
                <p className="text-[0.95rem] text-[#a0aec0] font-medium">Monitoring agent performance and real-time lead flow</p>
            </header>

            <div className="grid grid-cols-2 gap-6 mb-10 sm:grid-cols-1">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">{stat.label}</span>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-extrabold text-[#1a202c] tracking-tight">{stat.value}</h2>
                                {stat.trend && (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                                        stat.trendType === 'positive' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#718096] border-[#e2e8f0]'
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
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Agent Performance</h2>
                            <button className="text-[12px] font-bold text-[#2447d7] hover:underline underline-offset-4 decoration-2 transition-all">View Full Report</button>
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
                                        {agentPerformance.map((agent, idx) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Team Calendar (Outlook)</h2>
                            <div className="flex items-center gap-2 bg-[#f8fafc] p-1 rounded-xl border border-[#edf2f7]">
                                <button onClick={prevMonth} className="p-1 text-[#a0aec0] hover:text-[#2447d7] hover:bg-white rounded-lg transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <span className="text-[12px] font-black text-[#4a5568] px-2 min-w-[120px] text-center">{monthName}</span>
                                <button onClick={nextMonth} className="p-1 text-[#a0aec0] hover:text-[#2447d7] hover:bg-white rounded-lg transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-8">
                            {isOutlookConnected ? (
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-7 gap-2">
                                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                                            <div key={d} className="text-center text-[10px] font-black text-[#cbd5e0] tracking-widest pb-2">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {[...Array(emptySlots)].map((_, i) => <div key={`e-${i}`} className="aspect-square bg-[#f8fafc] rounded-xl border border-[#f1f5f9]/50"></div>)}
                                        {calendarDays.map(day => (
                                            <div key={day} className={`aspect-square rounded-xl border border-[#edf2f7] flex flex-col items-center justify-center relative group cursor-pointer hover:border-[#2447d7] hover:bg-[#f0f4ff] hover:shadow-md transition-all duration-300 ${[9, 12, 18, 24].includes(day) ? 'bg-[#fcfdff]' : 'bg-white'}`}>
                                                <span className={`text-[13px] font-bold transition-colors group-hover:text-[#2447d7] ${[9, 12, 18, 24].includes(day) ? 'text-[#1a202c]' : 'text-[#718096]'}`}>{day}</span>
                                                {[9, 12, 18, 24].includes(day) && (
                                                    <span className="w-1.5 h-1.5 bg-[#2447d7] rounded-full mt-1.5 ring-4 ring-[#2447d7]/10 animate-pulse"></span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 flex flex-col items-center text-center gap-6 max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-[#ebf3ff] rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="#0078d4">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-bold text-[#1a202c]">Team Schedule Integration</h3>
                                        <p className="text-[13px] text-[#718096] font-medium leading-relaxed">Sync your Microsoft Outlook calendar to monitor team reviews and appointments.</p>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full">
                                        <button 
                                            className="w-full bg-[#0078d4] text-white p-[14px_24px] rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(0,120,212,0.25)] hover:bg-[#005a9e] hover:translate-y-[-2px] hover:shadow-[0_12px_24px_rgba(0,120,212,0.35)] active:translate-y-[0] transition-all disabled:opacity-70" 
                                            onClick={handleConnectOutlook}
                                            disabled={isConnecting}
                                        >
                                            {isConnecting ? 'Syncing...' : 'Connect Outlook Account'}
                                        </button>
                                        <button 
                                            className="text-[13px] font-bold text-[#2447d7] hover:underline underline-offset-4 decoration-2" 
                                            onClick={() => onNavigate('calendar')}
                                        >
                                            Or use local Team Calendar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
