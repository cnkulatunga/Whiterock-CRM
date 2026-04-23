'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { leads } from '@/data/dummy';

const INDUSTRIES = [
    "Software", "Hardware", "IT Services", "Telecommunications", "E-commerce ",
    "Digital Media", "Robotics", "Pharmaceuticals", "Medical Devices", "Hospitals ",
    "Health Insurance", "BioTechnology", "Wellness", "Banking", "Insurance",
    "Investment Banking", "Venture Capital", "Accounting", "Aerospace"
];

const BANKS = [
    "Santander", "HSBC", "Lloyds Bank", "Starling", "NatWest", "Barclays",
    "Metro Bank", "Royal Bank of Scotland", "The Co-operative Bank", "The Cumberland",
    "Tide", "TSB", "Ulster Bank", "Unity Trust Bank", "Zempler"
];

const SOURCES = [
    "Advertisement", "Cold Call", "Web", "External Referral", "Sales Email Alias",
    "Employee Referral", "Online Store", "Partner", "Public Relations",
    "Seminar Partner", "Internal Seminar", "Trade Show", "Chat"
];

export default function LeadsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
    const [activeTab, setActiveTab] = useState('details'); // details, tasks, ai, notes, docs
    const [isEditing, setIsEditing] = useState(false);
    const [existingLoanActive, setExistingLoanActive] = useState('No');
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const filteredLeads = leads.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.company.toLowerCase().includes(search.toLowerCase()) ||
            l.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || l.quality.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

    return (
        <div className="flex-1 flex overflow-hidden bg-[#f8fafc] p-3 gap-3 h-full">

            {/* MAIN DATABASE PANEL (Left) */}
            <section className={`flex flex-col bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 ease-in-out ${isPanelOpen ? 'flex-1 min-w-0' : 'w-full'}`}>
                <div className="px-4 border-b border-white/5 bg-[#0f172a] flex items-center gap-3 min-h-[48px] shrink-0">
                    <h2 className="text-[9px] font-bold uppercase tracking-[.2em] text-white flex-shrink-0">Lead Database</h2>
                    <span className="text-[8px] font-bold text-slate-500 font-mono flex-shrink-0 whitespace-nowrap">
                        {filteredLeads.length} RESULTS
                    </span>
                    <div className="relative flex-1 min-w-[80px]">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] font-semibold text-white outline-none focus:bg-white/12 transition-all placeholder:text-white/20"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-[8px]"></i>
                    </div>
                    <Link href="/leads/add" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2447d7] hover:bg-indigo-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shadow-sm">
                        <i className="fa-solid fa-plus text-[7px]"></i> Add Lead
                    </Link>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg py-1.5 pr-6 pl-2.5 text-[9px] font-bold text-slate-300 outline-none cursor-pointer uppercase tracking-widest hover:bg-white/10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff60%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_6px_center] bg-[length:10px]"
                    >
                        <option value="All" className="bg-[#1e293b]">All Status</option>
                        <option value="Hot" className="bg-[#1e293b]">Hot</option>
                        <option value="Warm" className="bg-[#1e293b]">Warm</option>
                        <option value="Cool" className="bg-[#1e293b]">Cool</option>
                    </select>

                    <div className="flex items-center gap-0 shrink-0 border-l border-white/10 pl-3 ml-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-white/10">
                            <span className="text-[13px] font-black text-white">{leads.length}</span>
                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-white/10">
                            <span className="text-[13px] font-black text-red-100">{leads.filter(l => l.quality === 'hot').length}</span>
                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Hot</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-2">
                            <span className="text-[13px] font-black text-amber-100">{leads.filter(l => l.quality === 'warm').length}</span>
                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Warm</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 z-10">
                            <tr>
                                {['Lead', 'Company', 'Need', 'Status'].map(h => (
                                    <th key={h} className="px-3 py-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                                <th className="px-2 py-1.5 w-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLeads.map((lead) => (
                                <React.Fragment key={lead.id}>
                                    <tr
                                        onClick={() => {
                                            setSelectedLeadId(lead.id);
                                            setExpandedId(expandedId === lead.id ? null : lead.id);
                                        }}
                                        className={`transition-all cursor-pointer border-l-2 ${selectedLeadId === lead.id ? 'bg-slate-50 border-[#2447d7]' : 'hover:bg-slate-50/50 border-transparent'}`}
                                    >
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-lg">
                                                    {lead.name.split(' ')[0][0]}{lead.name.split(' ')[1]?.[0] || 'L'}
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-black text-slate-900 leading-tight uppercase tracking-tight">{lead.name}</div>
                                                    <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter leading-none">{lead.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <div className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{lead.company}</div>
                                            <div className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Software</div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <div className="text-[11px] font-black text-slate-900 leading-none">{lead.amount}</div>
                                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5 leading-none">Within 2 weeks</div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${lead.quality === 'hot' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                lead.quality === 'warm' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                }`}>
                                                {lead.quality}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2.5 text-center">
                                            <i className={`fa-solid fa-chevron-down text-[10px] transition-all duration-300 ${expandedId === lead.id ? 'rotate-180 text-[#2447d7]' : 'text-slate-300'}`}></i>
                                        </td>
                                    </tr>

                                    {expandedId === lead.id && (
                                        <tr>
                                            <td colSpan={5} className="p-0 border-none">
                                                <div className="bg-[#fcfcfd] border-y border-slate-100 py-8 px-10 grid grid-cols-5 gap-12 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {/* Company */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2.5">
                                                            <i className="fa-solid fa-building text-slate-900"></i> Company
                                                        </h4>
                                                        <div className="space-y-5 pl-1">
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[.15em] mb-1.5">Business</p>
                                                                <p className="text-[12px] font-black text-slate-900 leading-tight">{lead.company}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[.15em] mb-1.5">Job Title</p>
                                                                <p className="text-[11px] font-black text-slate-900 leading-tight">Managing Director</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Contact */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2.5">
                                                            <i className="fa-solid fa-address-card text-slate-900"></i> Contact
                                                        </h4>
                                                        <div className="space-y-5 pl-1">
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[.15em] mb-1.5">Email</p>
                                                                <p className="text-[11px] font-black text-[#2447d7] leading-none hover:underline cursor-pointer">john@abc.com</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[.15em] mb-1.5">Phone</p>
                                                                <p className="text-[12px] font-black text-slate-900 leading-tight">+44 7700 900000</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Funding */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2.5">
                                                            <i className="fa-solid fa-sack-dollar text-slate-900"></i> Funding
                                                        </h4>
                                                        <div className="space-y-5 pl-1">
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[.15em] mb-1.5">Amount</p>
                                                                <p className="text-[14px] font-black text-slate-900 leading-none">{lead.amount}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[.15em] mb-1.5">Purpose</p>
                                                                <p className="text-[11px] font-black text-slate-900 leading-tight">Business Expansion</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Note */}
                                                    <div className="col-span-1 space-y-4">
                                                        <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2.5">
                                                            <i className="fa-solid fa-note-sticky text-slate-900"></i> Note
                                                        </h4>
                                                        <div className="pl-1">
                                                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic tracking-tight mb-5 pr-6">
                                                                Engaged lead showing strong interest. {lead.company} (Software) seeking {lead.amount} for Business Expansion, a homeowner. Annual turnover £250,000. Banks with Santander. Funding required within 2 weeks.
                                                            </p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-7 h-7 rounded-lg bg-[#ebf0ff] text-[#2447d7] text-[9px] flex items-center justify-center font-black shadow-sm ring-1 ring-blue-100">SW</div>
                                                                <div className="leading-tight">
                                                                    <p className="text-[9px] font-black text-slate-900 uppercase">Sarah White</p>
                                                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Added note · 14 Apr 2026</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Assigned Agents */}
                                                    <div className="col-span-1 space-y-4">
                                                        <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2.5">
                                                            <i className="fa-solid fa-user-group text-[#2447d7]"></i> Assigned Agents
                                                        </h4>
                                                        <div className="space-y-2 pl-1">
                                                            {[
                                                                { role: 'Tele Agent', name: 'Sarah White', date: '03/18 09:12', active: true, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-headset' },
                                                                { role: 'Team Leader', name: 'Michael Chen', date: '03/18 10:30', active: true, color: 'text-[#2447d7]', bg: 'bg-[#ebf0ff]', icon: 'fa-user-tie' },
                                                                { role: 'Account Manager', name: 'Pending', date: '\u2014', active: false, color: 'text-slate-300', bg: 'bg-slate-50', icon: 'fa-briefcase' }
                                                            ].map((agent, idx) => (
                                                                <div key={idx} className={`flex items-center justify-between p-2.5 px-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-[#2447d7]/20 ${agent.active ? 'bg-white' : 'bg-slate-50/50 opacity-60'}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-7 h-7 rounded-lg ${agent.bg} ${agent.color} flex items-center justify-center text-xs shadow-sm ring-1 ring-slate-100`}>
                                                                            <i className={`fa-solid ${agent.icon}`}></i>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">{agent.role}</p>
                                                                            <p className={`text-[10px] font-black mt-1 leading-none ${agent.active ? 'text-slate-900' : 'text-slate-300 italic'}`}>{agent.name}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap ml-4">{agent.date}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-slate-100/50 flex justify-end">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                                                                className="text-[8px] font-black text-slate-300 hover:text-slate-600 uppercase tracking-widest flex items-center gap-1.5 transition-all"
                                                            >
                                                                <i className="fa-solid fa-eye-slash text-[7px]"></i> Hide Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-2 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{filteredLeads.length} Lead Records found</span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            className="text-[8px] font-black text-[#2447d7] hover:text-indigo-900 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                        >
                            <i className={`fa-solid ${isPanelOpen ? 'fa-arrow-right-long' : 'fa-arrow-left-long'} text-[7px]`}></i>
                            {isPanelOpen ? 'Hide Panel' : 'Show Panel'}
                        </button>
                        <Link href="/leads/add" className="text-[8px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-1 transition-colors">
                            <i className="fa-solid fa-plus text-[7px]"></i> New Lead
                        </Link>
                    </div>
                </div>
            </section>

            {/* DETAIL PANEL (Right) */}
            <aside id="lead-detail-panel" className={`flex flex-col bg-white border-l border-slate-100 overflow-hidden shrink-0 transition-all duration-500 ease-in-out ${isPanelOpen ? 'w-[520px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
                {/* Header - Matched to Screenshot */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm border border-slate-100/50"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                        <div>
                            <h2 className="text-[13px] font-black text-slate-900 leading-none uppercase tracking-tight truncate max-w-[180px]">
                                {selectedLead?.name || 'SELECT A LEAD'}
                            </h2>
                            <p className="text-[10px] text-[#2447d7] font-black mt-1 tracking-wider uppercase">
                                {selectedLead?.company || 'CHOOSE FROM THE LIST'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 pr-5 border-r border-slate-100">
                            <div className="flex items-center gap-2">
                                <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[.15em]">Status</label>
                                <div className="relative">
                                    <select className="h-8 px-3 pr-8 text-[10px] font-black border border-slate-100 rounded-lg bg-slate-50/30 outline-none uppercase tracking-widest cursor-pointer appearance-none hover:bg-white transition-all">
                                        <option>HOT</option>
                                        <option>WARM</option>
                                        <option>COOL</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 pointer-events-none"></i>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[.15em]">Id</label>
                                <span className="px-3 h-8 flex items-center text-[10px] font-mono font-black border border-slate-100 rounded-lg bg-slate-50/30 text-[#2447d7] uppercase tracking-tighter">
                                    {selectedLead?.id}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`h-9 px-5 text-[10px] font-black rounded-xl uppercase tracking-[.15em] transition-all shadow-sm ${isEditing ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-[#0f172a] hover:bg-black text-white'
                                }`}
                        >
                            {isEditing ? 'Save' : 'Edit Lead'}
                        </button>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-0 px-3 bg-white border-b border-slate-50 shrink-0 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'details', icon: 'fa-address-card', label: 'Contact Info' },
                        { id: 'tasks', icon: 'fa-list-check', label: 'Follow-ups' },
                        { id: 'ai', icon: 'fa-robot', label: 'AI Summary' },
                        { id: 'notes', icon: 'fa-note-sticky', label: 'Notes' },
                        { id: 'docs', icon: 'fa-folder-open', label: 'Documents' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2.5 transition-all text-[#94a3b8] hover:text-slate-600 border-b-2 font-black uppercase tracking-widest text-[8px] whitespace-nowrap ${activeTab === tab.id ? 'border-[#2447d7] text-[#2447d7] bg-[#ebf0ff]/50' : 'border-transparent'
                                }`}
                        >
                            <i className={`fa-solid ${tab.icon} text-[9px]`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#fcfcfd]">
                    {activeTab === 'details' && (
                        <div className="space-y-6 animate-in fade-in duration-300 pb-10">
                            <div>
                                <h3 className="flex items-center gap-2 text-[9px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4">
                                    <i className="fa-solid fa-address-card text-[#2447d7]"></i> Contact Information
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {[
                                        { label: 'Title', value: 'Mr', req: true },
                                        { label: 'Full Name', value: selectedLead?.name, req: true },
                                        { label: 'Date of Birth', value: '19/02/1985', req: true, type: 'date' },
                                        { label: 'Company / Organization Name', value: selectedLead?.company, req: true },
                                        { label: 'Company House Number', value: '12345678', req: true },
                                        { label: 'Business Annual Turnover', value: '£45k+', req: true },
                                        { label: 'Job Title / Position', value: 'Director' },
                                        { label: 'Industry', type: 'select', options: INDUSTRIES },
                                        { label: 'Email Address', value: 'john@abc.com', req: true, color: 'text-[#2447d7] font-bold' },
                                        { label: 'Phone Number', value: '+44 7700 900000', req: true },
                                        { label: 'Preferred Method', type: 'method' },
                                        { label: 'Home Owner', type: 'select', options: ['Yes', 'No'], req: true },
                                        { label: 'Time at Current Address', value: '3 Years' },
                                    ].map((field, i) => (
                                        <div key={i} className="space-y-1.5 focus-within:z-10">
                                            <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block ml-1">
                                                {field.label} {field.req && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'select' ? (
                                                <select
                                                    disabled={!isEditing}
                                                    className={`w-full h-8 px-2.5 text-[10px] font-black rounded-lg border outline-none transition-all cursor-pointer ${isEditing ? 'border-amber-200 bg-white ring-2 ring-amber-500/5' : 'border-slate-100 bg-[#f8fafc] text-slate-900'
                                                        }`}
                                                >
                                                    <option>Select...</option>
                                                    {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                                </select>
                                            ) : field.type === 'method' ? (
                                                <div className="flex gap-1">
                                                    {['Email', 'Phone', 'WhatsApp', 'Other'].map((m) => (
                                                        <div key={m} className={`h-8 flex-1 flex items-center justify-center border text-[8px] font-black rounded-lg cursor-pointer transition-all ${m === 'Email' ? 'bg-[#ebf0ff] border-[#2447d7] text-[#2447d7]' : 'bg-white border-slate-100 text-slate-400'}`}>
                                                            {m}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type || 'text'}
                                                    disabled={!isEditing}
                                                    defaultValue={field.value}
                                                    className={`w-full h-8 px-2.5 text-[10px] font-black rounded-lg border outline-none transition-all ${isEditing ? 'border-amber-200 bg-white shadow-sm ring-2 ring-amber-500/5' : 'border-slate-100 bg-[#f8fafc] text-slate-900'
                                                        } ${field.color || ''}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div className="col-span-2">
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block ml-1">Residential Address <span className="text-red-500">*</span></label>
                                        <input
                                            disabled={!isEditing}
                                            defaultValue="12 Kensington High St, London W8 4PU"
                                            className={`w-full h-8 px-2.5 text-[10px] font-black rounded-lg border outline-none transition-all ${isEditing ? 'border-amber-200 bg-white' : 'border-slate-100 bg-[#f8fafc]'
                                                }`}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block ml-1">Previous Address</label>
                                        <input
                                            disabled={!isEditing}
                                            defaultValue="N/A"
                                            className={`w-full h-8 px-2.5 text-[10px] font-black rounded-lg border outline-none transition-all ${isEditing ? 'border-amber-200 bg-white' : 'border-slate-100 bg-[#f8fafc]'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 text-[9px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4">
                                    <i className="fa-solid fa-sack-dollar text-[#2447d7]"></i> Loan Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Amount Needed', value: selectedLead?.amount, req: true },
                                        { label: 'Purpose of Taking Loan', value: 'Business Expansion' },
                                        { label: 'Existing Loan', type: 'select', options: ['Yes', 'No'], val: existingLoanActive, setter: setExistingLoanActive },
                                        { label: 'Overdraft Facility', type: 'select', options: ['Yes', 'No'], val: 'No' },
                                        { label: 'Company Bank', type: 'select', options: BANKS },
                                        { label: 'Lead Source', type: 'select', options: SOURCES },
                                        { label: 'Funding Timeline', value: 'Within 2 weeks' },
                                        { label: 'Alpha Loans Before?', type: 'select', options: ['Yes', 'No'], val: 'No' },
                                        { label: 'Credit Search Consent', type: 'select', options: ['Yes', 'No'], val: 'Yes', req: true },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block ml-1">{field.label} {field.req && <span className="text-red-500">*</span>}</label>
                                            {field.type === 'select' ? (
                                                <select
                                                    disabled={!isEditing}
                                                    value={field.val}
                                                    onChange={(e) => field.setter?.(e.target.value)}
                                                    className={`w-full h-8 px-2.5 text-[10px] font-black rounded-lg border outline-none transition-all ${isEditing ? 'border-amber-200 bg-white' : 'border-slate-100 bg-[#f8fafc]'}`}
                                                >
                                                    <option>Select...</option>
                                                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <input disabled={!isEditing} defaultValue={field.value} className={`w-full h-8 px-2.5 text-[10px] font-black rounded-lg border outline-none transition-all ${isEditing ? 'border-amber-200 bg-white' : 'border-slate-100 bg-[#f8fafc]'}`} />
                                            )}
                                        </div>
                                    ))}

                                    {/* Existing Loan Details - Conditionally Shown */}
                                    {existingLoanActive === 'Yes' && (
                                        <div className="col-span-2 mt-2 bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <p className="text-[8px] font-black text-[#2447d7] uppercase tracking-widest border-b border-blue-100 pb-2">Existing Indebtedness</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Lender Name</label>
                                                    <input disabled={!isEditing} placeholder="Lender..." className="w-full h-7 px-2 text-[9px] font-black rounded-lg border border-slate-200 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Amount Taken (£)</label>
                                                    <input disabled={!isEditing} placeholder="Amount..." className="w-full h-7 px-2 text-[9px] font-black rounded-lg border border-slate-200 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Interest Rate (%)</label>
                                                    <input disabled={!isEditing} placeholder="Rate..." className="w-full h-7 px-2 text-[9px] font-black rounded-lg border border-slate-200 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Monthly Repayment (£)</label>
                                                    <input disabled={!isEditing} placeholder="Repayment..." className="w-full h-7 px-2 text-[9px] font-black rounded-lg border border-slate-200 bg-white" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Loan Term</label>
                                                    <input disabled={!isEditing} placeholder="Term..." className="w-full h-7 px-2 text-[9px] font-black rounded-lg border border-slate-200 bg-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 mt-10 border-t border-slate-100">
                                <button className="w-full h-10 border border-rose-100 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-trash-can text-[8px]"></i> Delete Lead
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-[#2447d7] pl-2">Scheduled Follow-ups</h3>
                                <span className="text-[7px] font-black text-slate-300 uppercase">1 Active Task</span>
                            </div>

                            <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2447d7] shrink-0 shadow-sm">
                                        <i className="fa-solid fa-phone text-[10px]"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-slate-900 uppercase truncate tracking-tight">Discuss loan purpose</p>
                                            <span className="text-[7px] font-black text-slate-400 uppercase">14:30 Today</span>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-medium leading-relaxed mt-1">Client requested a callback after discussing with partner.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 space-y-4">
                                <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[.2em]">Add Follow-up</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase px-1">Description</label>
                                        <input className="w-full h-9 px-3 text-[10px] font-black rounded-xl border border-slate-100 bg-white outline-none focus:ring-2 focus:ring-[#2447d7]/5" placeholder="Title/Topic..." />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase px-1">Task Type</label>
                                        <select className="w-full h-9 px-3 text-[10px] font-black rounded-xl border border-slate-100 bg-white outline-none cursor-pointer">
                                            <option>Call</option>
                                            <option>Meeting</option>
                                            <option>Email</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase px-1">Date</label>
                                        <input type="date" className="w-full h-9 px-3 text-[10px] font-black rounded-xl border border-slate-100 bg-white outline-none" />
                                    </div>
                                </div>
                                <button className="w-full h-9 bg-slate-900 hover:bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-plus text-[8px]"></i> Add Task
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="p-5 bg-gradient-to-br from-white to-[#f0f4ff] border border-blue-100 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-lg bg-[#2447d7] flex items-center justify-center text-white">
                                        <i className="fa-solid fa-robot text-[10px]"></i>
                                    </div>
                                    <h3 className="text-[10px] font-black text-[#2447d7] uppercase tracking-widest">Lead Intelligence</h3>
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        'Client shows strong intent for business expansion.',
                                        'Verified company turnover matches stated requirements.',
                                        'Recommended interest rate tier: B+ (Standard Commercial).',
                                        'Risk Assessment: LOW (Stable industry sector).'
                                    ].map((point, i) => (
                                        <li key={i} className="flex gap-3 text-[10px] font-black text-slate-700 leading-relaxed">
                                            <i className="fa-solid fa-circle-check text-blue-400 mt-1"></i>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <textarea className="w-full h-32 p-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:ring-4 focus:ring-[#2447d7]/5 shadow-sm resize-none" placeholder="Enter persistent context/notes for this client..." />
                            <button className="h-8 px-4 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-black transition-all">Save Note</button>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            {[
                                { name: 'PassportID_JohnP.pdf', sz: '1.2MB', date: '14/04' },
                                { name: 'BankStatement_Q4.pdf', sz: '2.5MB', date: '12/04' },
                                { name: 'CompanyReg_Cert.pdf', sz: '0.8MB', date: '12/04' }
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-all group shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-[11px] group-hover:scale-110 transition-transform">
                                            <i className="fa-solid fa-file-pdf"></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-800 leading-none">{doc.name}</p>
                                            <p className="text-[7px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{doc.sz} · {doc.date}</p>
                                        </div>
                                    </div>
                                    <button className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#2447d7] hover:bg-[#ebf0ff] rounded-lg transition-all"><i className="fa-solid fa-eye text-[9px]"></i></button>
                                </div>
                            ))}

                            <div className="mt-4 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-[#ebf0ff] hover:border-[#2447d7] transition-all group cursor-pointer">
                                <i className="fa-solid fa-cloud-arrow-up text-slate-300 group-hover:text-[#2447d7] text-xl mb-2 block"></i>
                                <span className="text-[8px] font-black text-slate-400 group-hover:text-[#2447d7] uppercase tracking-[.2em]">Click to Upload Docs</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
