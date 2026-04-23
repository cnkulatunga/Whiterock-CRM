'use client';

import { stats } from '@/data/dummy';

export default function ReportsPage() {
    return (
        <div className="flex-1 flex flex-col p-6 bg-[#fafafa] overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reporting & Logs</h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time performance analytics and system logs</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Daily Report
                    </button>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        Export Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card bg-white p-6">
                        <div className={`w-10 h-10 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-slate-900 leading-none">{stat.value}</span>
                            <span className={`text-[9px] font-black ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 overflow-hidden">
                {/* Analytics Chart Representation */}
                <div className="glass-card bg-white p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Revenue Growth</h3>
                        <select className="bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest px-2 py-1 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-end gap-3 pb-4">
                        {[45, 65, 55, 85, 75, 95].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg shadow-lg shadow-indigo-100 transition-all hover:scale-105"
                                    style={{ height: `${val}%` }}
                                ></div>
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Logs */}
                <div className="glass-card bg-white p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Activity Logs</h3>
                        <button className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">View All</button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {[
                            { user: 'Admin', act: 'Updated Lender Rate', target: 'Barclays Bank', time: '10:42 AM' },
                            { user: 'Sarah Jenkins', act: 'Added Note to Lead', target: '#AF-001', time: '09:15 AM' },
                            { user: 'Thanushika M.', act: 'Assigned New Lead', target: 'James Wilson', time: 'Yesterday' },
                            { user: 'System', act: 'Auto-Archived Case', target: '#AF-992', time: 'Yesterday' },
                            { user: 'Admin', act: 'Modified Role', target: 'Tele Agent', time: '2 days ago' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">
                                        {log.user[0]}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-900">{log.act}</div>
                                        <div className="text-[9px] font-bold text-indigo-600">{log.target}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{log.time}</div>
                                    <div className="text-[7px] font-bold text-slate-300 uppercase mt-0.5">{log.user}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
