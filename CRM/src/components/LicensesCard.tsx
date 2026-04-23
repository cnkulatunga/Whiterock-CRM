'use client';

import { useState, useEffect } from 'react';
import { licenses as initialLicenses } from '@/data/dummy';

type License = {
    id: number;
    name: string;
    type: string;
    date: string;
    remind: number;
    status: string;
    desc: string;
};

type View = 'list' | 'form' | 'detail' | 'editForm';

export default function LicensesCard() {
    const [licenses, setLicenses] = useState<License[]>(initialLicenses);
    const [view, setView] = useState<View>('list');
    const [selected, setSelected] = useState<License | null>(null);
    const [form, setForm] = useState({ type: 'License', name: '', desc: '', date: '', remind: '30' });

    useEffect(() => {
        fetch('/api/licenses')
            .then(res => res.ok ? res.json() : Promise.reject('API Error'))
            .then(data => setLicenses(Array.isArray(data) ? data : initialLicenses))
            .catch(err => {
                console.error('Licenses fetch error:', err);
                setLicenses(initialLicenses);
            });
    }, []);

    const openDetail = (l: License) => { setSelected(l); setView('detail'); };
    const closeDetail = () => { setSelected(null); setView('list'); };

    const addLicense = async () => {
        if (!form.name.trim()) return;
        const res = await fetch('/api/licenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const newL = await res.json();
            setLicenses([...licenses, newL]);
            setForm({ type: 'License', name: '', desc: '', date: '', remind: '30' });
            setView('list');
        }
    };

    const deleteLicense = async (id: number) => {
        const res = await fetch(`/api/licenses?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setLicenses(licenses.filter(l => l.id !== id));
            setView('list');
            setSelected(null);
        }
    };

    const openEditForm = () => {
        if (!selected) return;
        setForm({ type: selected.type, name: selected.name, desc: selected.desc, date: selected.date, remind: String(selected.remind) });
        setView('editForm');
    };

    const saveEdit = async () => {
        if (!selected) return;
        const res = await fetch('/api/licenses', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selected.id, ...form, remind: parseInt(form.remind) })
        });
        if (res.ok) {
            const updated = await res.json();
            setLicenses(licenses.map(l => l.id === selected.id ? updated : l));
            setSelected(updated);
            setView('detail');
        }
    };

    const statusColor = (s: string) => s === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600';

    return (
        <div className="glass-card flex flex-col h-[280px] overflow-hidden">
            {/* Header: List/Form Mode */}
            {(view === 'list' || view === 'form') && (
                <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-100">
                            <i className="fa-solid fa-file-shield text-xs"></i>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Licenses & Insurance</h3>
                    </div>
                    <button onClick={() => setView(view === 'form' ? 'list' : 'form')}
                        className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all">
                        <i className={`fa-solid ${view === 'form' ? 'fa-xmark' : 'fa-plus'} text-[10px]`}></i>
                    </button>
                </div>
            )}

            {/* Header: Detail/Edit Mode */}
            {(view === 'detail' || view === 'editForm') && (
                <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-3">
                        <button onClick={view === 'editForm' ? () => setView('detail') : closeDetail}
                            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all">
                            <i className="fa-solid fa-arrow-left text-[10px]"></i>
                        </button>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                            {view === 'editForm' ? 'Edit Entry' : selected?.name}
                        </h3>
                    </div>
                    {view === 'detail' && selected && (
                        <div className="flex items-center gap-1.5">
                            <button onClick={openEditForm}
                                className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all">
                                <i className="fa-solid fa-pen text-[10px]"></i>
                            </button>
                            <button onClick={() => deleteLicense(selected.id)}
                                className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-all">
                                <i className="fa-solid fa-trash-can text-[10px]"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Add Form */}
            {view === 'form' && (
                <div className="flex-1 flex flex-col p-3 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500">
                                <option>License</option><option>Insurance</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500"
                                placeholder="e.g. FCA License" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Description</label>
                            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={2}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500 resize-none"
                                placeholder="Brief description..." />
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Expiry Date</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500" />
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Remind Period</label>
                            <select value={form.remind} onChange={e => setForm({ ...form, remind: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500">
                                <option value="30">30 Days Before</option>
                                <option value="14">14 Days Before</option>
                                <option value="7">7 Days Before</option>
                            </select>
                        </div>
                        <div className="col-span-2 flex gap-2 mt-1">
                            <button onClick={addLicense} className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">Save</button>
                            <button onClick={() => setView('list')} className="px-4 bg-slate-200 text-slate-600 py-2 rounded-lg text-[8px] font-black uppercase transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* List View */}
            {view === 'list' && (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                    {licenses.map((lic) => (
                        <div key={lic.id} onClick={() => openDetail(lic)}
                            className="bg-white border border-slate-100 rounded-xl transition-all cursor-pointer hover:border-rose-200 hover:shadow-sm p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900">{lic.name}</h4>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Expires: {lic.date}</p>
                                </div>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded ${statusColor(lic.status)}`}>{lic.status}</span>
                            </div>
                            <span className="text-[7px] font-bold text-rose-500 uppercase tracking-tight flex items-center gap-1">
                                <i className="fa-solid fa-bell text-[7px]"></i> Remind {lic.remind} days before
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail View */}
            {view === 'detail' && selected && (
                <div className="flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase ${statusColor(selected.status)}`}>{selected.status}</span>
                        <span className="text-[7px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{selected.type}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed mb-3">{selected.desc}</p>
                    <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500">
                            <i className="fa-solid fa-calendar text-rose-400 w-3"></i> Expires: {selected.date}
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500">
                            <i className="fa-solid fa-bell text-rose-400 w-3"></i> Remind {selected.remind} days before
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Form */}
            {view === 'editForm' && selected && (
                <div className="flex-1 flex flex-col p-3 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500">
                                <option>License</option><option>Insurance</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Description</label>
                            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={2}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500 resize-none" />
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Expiry Date</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500" />
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-slate-400 uppercase mb-0.5 block">Remind Period</label>
                            <select value={form.remind} onChange={e => setForm({ ...form, remind: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] outline-none focus:border-rose-500">
                                <option value="30">30 Days Before</option>
                                <option value="14">14 Days Before</option>
                                <option value="7">7 Days Before</option>
                            </select>
                        </div>
                        <div className="col-span-2 flex gap-2 mt-1">
                            <button onClick={saveEdit} className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">Save Changes</button>
                            <button onClick={() => setView('detail')} className="px-4 bg-slate-200 text-slate-600 py-2 rounded-lg text-[8px] font-black uppercase transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
