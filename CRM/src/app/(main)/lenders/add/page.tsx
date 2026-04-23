'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddLenderPage() {
    const router = useRouter();
    const [status, setStatus] = useState('Active');
    const [categories, setCategories] = useState(['Mainstream', 'Residential', 'Commercial']);
    const [newCategory, setNewCategory] = useState('');

    const handleBack = () => {
        router.back();
    };

    const addCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
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
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <i className="fa-solid fa-building-columns text-base"></i>
                        </div>
                        <div>
                            <h1 className="text-[13px] font-black text-slate-900 leading-none uppercase tracking-widest">Onboard New Lender</h1>
                            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Define partner criteria & compliance details</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-9 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Pending Review</option>
                        </select>
                    </div>
                    <button className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center gap-2">
                        <i className="fa-solid fa-check"></i>
                        Complete Onboarding
                    </button>
                </div>
            </header>

            {/* Form Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1200px] mx-auto space-y-8 pb-12">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Section: Lender Identity & Contact */}
                        <div className="space-y-8">
                            <section className="glass-card bg-white p-8">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Lender Identity</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Lender Name *</label>
                                        <input placeholder="e.g. Barclays Bank" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trading Name</label>
                                        <input placeholder="Trading as..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Contact Email *</label>
                                        <input type="email" placeholder="lending@bank.co.uk" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                            </section>

                            <section className="glass-card bg-white p-8">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Account Management</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Manager</label>
                                            <input placeholder="Full Name" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Manager Phone</label>
                                            <input placeholder="+44..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Broker Support Line</label>
                                        <input placeholder="Phone number" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Criteria & Lending Policy */}
                        <div className="space-y-8">
                            <section className="glass-card bg-white p-8 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6 shrink-0">
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Lending Parameters</h3>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Max LTV (%)</label>
                                            <input type="text" placeholder="e.g. 75%" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Typical Rate (%)</label>
                                            <input type="text" placeholder="e.g. 4.5%" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Categories</label>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {categories.map((cat, i) => (
                                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-[10px] font-bold uppercase tracking-tight">
                                                    {cat}
                                                    <button onClick={() => setCategories(categories.filter((_, idx) => idx !== i))}>
                                                        <i className="fa-solid fa-xmark text-[8px] hover:text-red-500 transition-colors"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                                                placeholder="Add custom category..."
                                                className="flex-1 h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                            />
                                            <button onClick={addCategory} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all">
                                                <i className="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Review Notes</label>
                                        <textarea rows={6} placeholder="Regulatory notes, credit policy overview..." className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"></textarea>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Section: Addresses & Compliance */}
                    <div className="glass-card bg-white p-8">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Address & Locations</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Headquarters (Trading Address)</label>
                                <textarea rows={3} placeholder="Full address..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"></textarea>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Address (If different)</label>
                                <textarea rows={3} placeholder="Same as trading or official registered address..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-900 uppercase leading-none">KYC & Compliance Verified</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Pending final manual approval</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="h-11 px-8 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                            <button className="h-11 px-10 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Register Partner</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
