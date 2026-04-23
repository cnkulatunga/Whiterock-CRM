'use client';

import { teleAgents } from '@/data/dummy';

export default function UsersPage() {
    return (
        <div className="flex-1 flex flex-col p-6 bg-[#fafafa] overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage organization members and permissions</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                        <i className="fa-solid fa-download mr-2"></i> Export
                    </button>
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
                        <i className="fa-solid fa-user-plus mr-2"></i> Add Member
                    </button>
                </div>
            </div>

            <div className="glass-card bg-white overflow-hidden flex flex-col flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Leads</th>
                                <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Active</th>
                                <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teleAgents.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${user.color} flex items-center justify-center text-white text-[10px] font-black shadow-md`}>
                                                {user.id}
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-black text-slate-900">{user.name}</div>
                                                <div className="text-[9px] font-bold text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">Tele Agent</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                            <span className={`text-[10px] font-black uppercase tracking-tight ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-black text-slate-900">{user.leads}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-slate-500">2 hours ago</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="w-8 h-8 rounded-lg border border-slate-100 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 transition-all">
                                            <i className="fa-solid fa-ellipsis-vertical text-[10px]"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
