'use client';

import { followups } from '@/data/dummy';

export default function TasksPage() {
    return (
        <div className="flex-1 overflow-hidden p-6 bg-[#f8fafc]">
            <div className="max-w-[1200px] mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Task Management</h1>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage your follow-ups and daily activities</p>
                    </div>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                        <i className="fa-solid fa-plus mr-2"></i> New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
                    {['To Do', 'In Progress', 'Completed'].map((status) => (
                        <div key={status} className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between px-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status === 'To Do' ? 'bg-indigo-500' : status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">{status}</h3>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-100 rounded-lg px-2 py-0.5">
                                    {status === 'To Do' ? followups.length : 0}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {status === 'To Do' ? (
                                    followups.map((task) => (
                                        <div key={task.id} className="glass-card bg-white p-5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${task.priority === 'Hot' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400">{task.time}</span>
                                            </div>
                                            <h4 className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-relaxed">
                                                {task.title}
                                            </h4>
                                            <p className="text-[9px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                {task.desc}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-[8px] font-black">
                                                        {task.client.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-700">{task.client}</span>
                                                </div>
                                                <div className="flex -space-x-2">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white"></div>
                                                    <div className="w-5 h-5 rounded-full bg-indigo-100 border-2 border-white"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                        <i className="fa-solid fa-plus text-sm"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
