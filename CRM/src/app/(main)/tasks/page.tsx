'use client';

import { useState } from 'react';
import { followups, leads, promotions } from '@/data/dummy';
import CalendarCard from '@/components/CalendarCard';
import DetailDrawer from '@/components/DetailDrawer';

export default function TasksPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [taskStatus, setTaskStatus] = useState('All');
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [drawerType, setDrawerType] = useState<'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSelect = (entity: any, type: any) => {
        setSelectedEntity(entity);
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
            {/* Top Header */}
            <header className="h-[64px] bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <i className="fa-solid fa-tasks text-base"></i>
                    </div>
                    <div>
                        <h1 className="text-[13px] font-black text-slate-900 leading-none uppercase tracking-widest">Integrated Task Hub</h1>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Unified management of follow-ups and lender activities</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 px-6 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Active Tasks</span>
                            <span className="text-[14px] font-black text-slate-900 leading-none mt-1.5">{followups.length}</span>
                        </div>
                        <div className="w-[1px] h-6 bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Due Today</span>
                            <span className="text-[14px] font-black text-indigo-600 leading-none mt-1.5">2</span>
                        </div>
                    </div>
                    <button className="h-10 px-6 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                        <i className="fa-solid fa-plus"></i> New Task
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">

                {/* Left Column: Create Task Form (3 Cols) */}
                <aside className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
                    <section className="glass-card bg-white p-6 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.15em]">Quick Creation</h3>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-1">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                                <input type="text" placeholder="Title..." className="w-full h-10 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee</label>
                                    <select className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer">
                                        <option>Thanushika</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead</label>
                                    <select className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer">
                                        <option>Search Lead...</option>
                                        {leads.map(l => <option key={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Type</label>
                                    <select className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer">
                                        <option>Call</option>
                                        <option>Meeting</option>
                                        <option>Email</option>
                                        <option>Document</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                                    <select className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer">
                                        <option>Warm</option>
                                        <option>Hot</option>
                                        <option>Cold</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                    <input type="date" className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                                    <input type="time" className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Notes</label>
                                <textarea rows={4} placeholder="Detailed instructions..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"></textarea>
                            </div>
                            <button className="w-full py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg mt-2">
                                Create Log Entry
                            </button>
                        </div>
                    </section>
                </aside>

                {/* Middle Column: Calendar & Today (3 Cols) */}
                <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
                    <CalendarCard />
                    <section className="glass-card bg-white p-6 flex flex-col flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.15em]">Today's Schedule</h3>
                            <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-indigo-100">2 Pending</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                            {followups.slice(0, 2).map((t, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelect(t, 'task')}
                                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-500/20 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[8px] font-black text-indigo-600 uppercase tracking-[.1em]">{t.time}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-50"></div>
                                    </div>
                                    <h4 className="text-[11px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{t.title}</h4>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400">
                                                {t.client[0]}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-500">{t.client}</span>
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-[7px] text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"></i>
                                    </div>
                                </div>
                            ))}
                            {followups.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <i className="fa-solid fa-calendar-check text-4xl mb-4"></i>
                                    <p className="text-[10px] font-black uppercase tracking-widest">No activities</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: All Tasks Table (6 Cols) */}
                <div className="lg:col-span-6 flex flex-col gap-4 overflow-hidden">
                    <section className="glass-card bg-white flex flex-col flex-1 overflow-hidden">
                        <div className="px-6 h-[56px] border-b border-slate-100 bg-slate-900 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-layer-group text-white/40 text-xs"></i>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[.15em]">Global Task Registry</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    className="h-8 px-3 bg-white/10 border border-white/10 rounded-lg text-[9px] font-black text-white outline-none cursor-pointer hover:bg-white/20 transition-all font-mono"
                                    onChange={(e) => setTaskStatus(e.target.value)}
                                >
                                    <option value="All" className="bg-slate-800">All Status</option>
                                    <option value="Pending" className="bg-slate-800">Pending</option>
                                    <option value="Complete" className="bg-slate-800">Complete</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-20">
                                    <tr>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Case Activity</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Client & Role</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Date</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {followups.map((t, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => handleSelect(t, 'task')}
                                            className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                                                        <i className="fa-solid fa-phone text-[10px]"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 leading-none">{t.title}</p>
                                                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter mt-1 opacity-80">Outbound Follow-up</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-900 leading-none">{t.client}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Primary Lead</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-900 leading-none">{t.time.split(',')[0]}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{t.time.split(',')[1]}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-tight shadow-sm border ${t.priority === 'Hot' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {t.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                                                    <i className="fa-solid fa-ellipsis"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Bottom Section: Lender Promotions Mini Registry */}
                    <section className="h-[200px] glass-card bg-white flex flex-col overflow-hidden">
                        <div className="px-6 h-[48px] bg-amber-50 border-b border-amber-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm">
                                    <i className="fa-solid fa-bullhorn text-[10px]"></i>
                                </div>
                                <h3 className="text-[10px] font-black text-amber-900 uppercase tracking-[.15em]">Lender Promotions</h3>
                            </div>
                            <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">{promotions.length} Live Offers</span>
                        </div>
                        <div className="flex-1 overflow-x-auto custom-scrollbar flex p-4 gap-4 items-start pb-6">
                            {promotions.map((p, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelect(p, 'promotion')}
                                    className="min-w-[280px] bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{p.lender}</span>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Exp: {p.expiry}</span>
                                    </div>
                                    <h5 className="text-[11px] font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{p.title}</h5>
                                    <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed mb-4">{p.desc}</p>
                                    <button className="mt-auto w-full py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                                        View Documentation
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                entity={selectedEntity}
                type={drawerType}
            />
        </div>
    );
}
