'use client';

import { useEffect, useState } from 'react';

interface DetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    entity: any;
    type: 'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null;
    showQuickEdit?: boolean;
}

export default function DetailDrawer({ isOpen, onClose, entity, type, showQuickEdit = false }: DetailDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const renderContent = () => {
        if (!entity) return null;

        switch (type) {
            case 'task':
                return (
                    <div className="space-y-8">
                        <section>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Task Information</h4>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h1 className="text-xl font-black text-slate-900 mb-2">{entity.title}</h1>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">{entity.desc}</p>
                            </div>
                        </section>
                        <section className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                <p className="text-[11px] font-black text-indigo-600">IN PROGRESS</p>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Assignee</p>
                                <p className="text-[11px] font-black text-slate-900">{entity.assignee || 'Unassigned'}</p>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Due Date</p>
                                <p className="text-[11px] font-black text-slate-900">{entity.time}</p>
                            </div>
                        </section>
                        <section>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Associated Lead</h4>
                            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">LH</div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-900">Lakshan Habaraduwa</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Home Loan | $450k</p>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'agent':
                return (
                    <div className="space-y-8">
                        <div className="flex flex-col items-center text-center py-8">
                            <div className={`w-24 h-24 rounded-3xl ${entity.color} flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6`}>
                                {entity.id}
                            </div>
                            <h1 className="text-2xl font-black text-slate-900">{entity.name}</h1>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{entity.role || 'Tele Agent Specialist'}</p>
                            <div className="flex items-center gap-2 mt-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[9px] font-black text-emerald-600 uppercase">Active Now</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Leads', value: entity.leads, color: 'indigo' },
                                { label: 'Success', value: '88%', color: 'emerald' },
                                { label: 'Calls', value: '142', color: 'blue' },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:border-indigo-200 transition-all">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{stat.label}</p>
                                    <p className="text-lg font-black text-slate-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <section className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect Directly</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="h-10 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                                    <i className="fa-solid fa-phone"></i> Dial Now
                                </button>
                                <button className="h-10 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                                    <i className="fa-brands fa-whatsapp"></i> WhatsApp
                                </button>
                            </div>
                        </section>
                    </div>
                );
            case 'promotion':
                return (
                    <div className="space-y-8">
                        <div className="relative h-48 rounded-3xl overflow-hidden mb-8">
                            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600 to-slate-900 opacity-90`}></div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[.2em] mb-2">{entity.lender}</span>
                                <h1 className="text-2xl font-black text-white leading-tight">{entity.title}</h1>
                            </div>
                        </div>
                        <section className="space-y-6">
                            {entity.rate > 0 && (
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Rate Breakdown</h4>
                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-slate-500">Rate</span>
                                            <span className="text-xl font-black text-indigo-600">{entity.rate}% p.a.</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {entity.valid_until && (
                                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <i className="fa-solid fa-calendar-xmark text-amber-500"></i>
                                    <div>
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Expires</p>
                                        <p className="text-[11px] font-bold text-slate-700">
                                            {new Date(entity.valid_until).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {entity.description && (
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Description</h4>
                                    <p className="text-[12px] text-slate-600 leading-relaxed font-medium bg-slate-50 border border-slate-100 rounded-2xl p-5">
                                        {entity.description}
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                );
            default:
                return <div className="text-[12px] font-bold text-slate-400">Registry Detail View Under Development</div>;
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[1000] flex justify-end transition-all duration-300 ${isOpen ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
                }`}
            onClick={onClose}
        >
            <div
                className={`w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drawer Header */}
                <header className="h-[72px] px-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {type} Context
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {showQuickEdit && (
                            <button className="h-10 px-6 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                                <i className="fa-solid fa-pen-to-square"></i>
                                Quick Edit
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </header>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {renderContent()}
                </div>

                {/* Drawer Footer */}
                <footer className="p-8 border-t border-slate-100 flex gap-4">
                    <button className="flex-1 h-12 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Archive</button>
                    <button onClick={onClose} className="flex-1 h-12 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">Close Entry</button>
                </footer>
            </div>
        </div>
    );
}
