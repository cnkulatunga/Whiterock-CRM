'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMemberPage() {
    const router = useRouter();
    const [role, setRole] = useState('Tele Agent');
    const [permissions, setPermissions] = useState({
        leads: true,
        pipeline: true,
        tasks: true,
        lenders: false,
        users: false,
        reports: false,
        docs: true
    });

    const handleBack = () => {
        router.back();
    };

    const togglePermission = (key: keyof typeof permissions) => {
        setPermissions({ ...permissions, [key]: !permissions[key] });
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
            {/* Header */}
            <header className="h-[64px] bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <i className="fa-solid fa-arrow-left text-[10px]"></i>
                        </div>
                        Back
                    </button>
                    <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                            <i className="fa-solid fa-user-plus text-base"></i>
                        </div>
                        <div>
                            <h1 className="text-[13px] font-black text-slate-900 leading-none uppercase tracking-widest">Add Team Member</h1>
                            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Configure initial access and secure credentials</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="h-10 px-8 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                        <i className="fa-solid fa-paper-plane"></i>
                        Send Invitation
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">

                    {/* Left: Identity Form (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <section className="glass-card bg-white p-8">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">01</span>
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Personal Identification</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-full">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Professional Name *</label>
                                    <input placeholder="e.g. Alexander Hamilton" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email Address *</label>
                                    <input type="email" placeholder="alex@whiterock.com" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                    <input placeholder="+44..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                </div>
                            </div>
                        </section>

                        <section className="glass-card bg-white p-8">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">02</span>
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">System Role & Credentials</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role *</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black outline-none cursor-pointer"
                                    >
                                        <option>Admin</option>
                                        <option>Team Leader</option>
                                        <option>Tele Agent</option>
                                        <option>Accounts Manager</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">User Status</label>
                                    <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black outline-none cursor-pointer">
                                        <option>Active</option>
                                        <option>Pending Invite</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Permissions (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <section className="glass-card bg-white p-8 h-full">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">03</span>
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Module Access Flow</h3>
                            </div>
                            <div className="space-y-4">
                                {(Object.keys(permissions) as Array<keyof typeof permissions>).map((key) => (
                                    <div
                                        key={key}
                                        onClick={() => togglePermission(key)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${permissions[key] ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${permissions[key] ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                                                }`}>
                                                <i className={`fa-solid ${key === 'leads' ? 'fa-user-group' :
                                                        key === 'pipeline' ? 'fa-diagram-project' :
                                                            key === 'tasks' ? 'fa-tasks' :
                                                                key === 'lenders' ? 'fa-hand-holding-dollar' :
                                                                    key === 'users' ? 'fa-user-gear' :
                                                                        key === 'reports' ? 'fa-chart-line' : 'fa-folder-open'
                                                    } text-[10px]`}></i>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${permissions[key] ? 'text-slate-900' : 'text-slate-400'
                                                }`}>{key}</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition-all ${permissions[key] ? 'bg-indigo-600' : 'bg-slate-300'
                                            }`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${permissions[key] ? 'left-6' : 'left-1'
                                                }`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-info text-indigo-400"></i>
                                    Access Inheritance
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                                    Members with the <span className="text-white">Admin</span> role will automatically inherit full module access regardless of these settings.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
