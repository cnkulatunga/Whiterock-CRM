'use client';

import { useState } from 'react';

export default function ProfileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState('details');

    return (
        <>
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 z-[998] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 h-screen w-[360px] bg-white z-[999] shadow-2xl transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-5 pb-0 shrink-0">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Profile</p>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-[10px] text-slate-500"></i>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shrink-0">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-black text-slate-900 leading-none">Super Admin</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1.5 truncate">admin@taskflow.com</p>
                            <div className="inline-flex items-center mt-2 px-2.5 py-0.5 bg-indigo-50 rounded-full text-[8px] font-black text-indigo-600 uppercase tracking-widest">
                                ADMIN
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-slate-100 px-5 shrink-0 mt-2">
                    {['details', 'password'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                    {activeTab === 'details' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Super Admin"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="admin@taskflow.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Role</label>
                                <input
                                    type="text"
                                    defaultValue="Admin"
                                    disabled
                                    className="w-full bg-slate-100 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-400 outline-none cursor-not-allowed"
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white rounded-xl py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3">
                                <i className="fa-solid fa-triangle-exclamation text-amber-600 text-xs mt-0.5"></i>
                                <p className="text-[9px] font-bold text-amber-800 leading-relaxed">
                                    Choose a strong password with at least 8 characters including uppercase, numbers and symbols.
                                </p>
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white rounded-xl py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                Update Password
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-slate-100 shrink-0">
                    <button className="w-full bg-red-50 text-red-600 border border-red-100 rounded-xl py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
