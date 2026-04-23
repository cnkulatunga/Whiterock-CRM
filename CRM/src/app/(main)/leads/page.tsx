'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { leads, teleAgents } from '@/data/dummy';

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
    "Advertisement", "Cold Call", "Web", "External Referral", "Instagram", "Organic Search", "Sales Email Alias",
    "Employee Referral", "Online Store", "Partner", "Public Relations",
    "Seminar Partner", "Internal Seminar", "Trade Show", "Chat"
];

export default function LeadsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
    const [activeTab, setActiveTab] = useState('details'); // details, tasks, notes, docs
    const [isEditing, setIsEditing] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [existingLoanActive, setExistingLoanActive] = useState('No');

    const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

    const filteredLeads = leads.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.company.toLowerCase().includes(search.toLowerCase()) ||
            l.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || l.quality.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleCreateNew = () => {
        setIsCreateMode(true);
        setIsEditing(true);
        setSelectedLeadId(null);
    };

    const handleCancel = () => {
        setIsCreateMode(false);
        setIsEditing(false);
        setSelectedLeadId(leads[0]?.id || null);
    };

    return (
        <div className="flex-1 flex overflow-hidden bg-[#f8fafc] p-3 gap-3 h-screen">
            {/* LEFT PANEL: Lead Details/Form (480px) */}
            <section className="w-[480px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
                <div className="px-4 border-b border-slate-100 flex items-center justify-between min-h-[48px] shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">
                            {isCreateMode ? 'Add New Lead' : isEditing ? 'Edit Lead Entry' : 'Lead Context'}
                        </h2>
                        {!isCreateMode && (
                            <p className="text-[8px] text-[#2447d7] font-black mt-1 uppercase tracking-tighter">
                                {selectedLead?.id} • {selectedLead?.company}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <button
                                onClick={handleCancel}
                                className="h-7 px-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-xmark text-[7px]"></i> Cancel
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button className="h-7 px-3 bg-[#2447d7] text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5" onClick={handleCreateNew}>
                                    <i className="fa-solid fa-plus text-[7px]"></i> New Lead
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-7 h-7 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all"
                                >
                                    <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs for Panels (Details, Notes, Tasks, etc) */}
                {!isCreateMode && (
                    <div className="flex bg-slate-50/50 border-b border-slate-100 shrink-0">
                        {[
                            { id: 'details', label: 'Lead Info' },
                            { id: 'tasks', label: 'Follow-ups' },
                            { id: 'notes', label: 'Context Notes' },
                            { id: 'docs', label: 'Vault' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'border-[#2447d7] text-[#2447d7] bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    {isCreateMode || activeTab === 'details' ? (
                        <div className="space-y-8">
                            {/* 1. Contact Information */}
                            <div className="space-y-4">
                                <h4 className="text-[8px] font-black text-slate-300 uppercase tracking-[.2em] flex items-center gap-2">
                                    <i className="fa-solid fa-user-circle text-[10px]"></i> Contact Information
                                </h4>
                                <div className="grid grid-cols-6 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Title *</label>
                                        <input disabled={!isEditing} defaultValue={isCreateMode ? '' : 'Mr'} placeholder="Mr/Dr" className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none focus:bg-white transition-all uppercase" />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Full Name *</label>
                                        <input disabled={!isEditing} defaultValue={isCreateMode ? '' : selectedLead?.name} className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none focus:bg-white transition-all" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Date of Birth *</label>
                                        <input disabled={!isEditing} type="date" className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none transition-all uppercase" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Industry</label>
                                        <select disabled={!isEditing} className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none cursor-pointer">
                                            {INDUSTRIES.map(ind => <option key={ind}>{ind}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Company Name *</label>
                                        <input disabled={!isEditing} defaultValue={isCreateMode ? '' : selectedLead?.company} className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none focus:bg-white transition-all" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">House Number *</label>
                                        <input disabled={!isEditing} placeholder="e.g. 12345678" className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Annual Turnover *</label>
                                        <input disabled={!isEditing} placeholder="£0.00" className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none font-mono" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Email *</label>
                                        <input disabled={!isEditing} type="email" placeholder="client@example.com" className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none text-[#2447d7]" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Phone *</label>
                                        <input disabled={!isEditing} type="tel" placeholder="+44 77..." className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none font-mono" />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Residential Address *</label>
                                        <input disabled={!isEditing} className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none" placeholder="Full residential context..." />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Loan Details */}
                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <h4 className="text-[8px] font-black text-slate-300 uppercase tracking-[.2em] flex items-center gap-2">
                                    <i className="fa-solid fa-sack-dollar text-[10px]"></i> Financial Requirements
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Amount Needed *</label>
                                        <input disabled={!isEditing} defaultValue={isCreateMode ? '' : selectedLead?.amount} className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none font-mono" placeholder="£0.00" />
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Existing Loan</label>
                                        <select
                                            disabled={!isEditing}
                                            value={existingLoanActive}
                                            onChange={(e) => setExistingLoanActive(e.target.value)}
                                            className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none cursor-pointer"
                                        >
                                            <option>No</option><option>Yes</option>
                                        </select>
                                    </div>

                                    {existingLoanActive === 'Yes' && (
                                        <div className="col-span-2 p-4 bg-[#f8fafc] rounded-xl border border-slate-100 space-y-3 animate-in fade-in transition-all">
                                            <p className="text-[7px] font-black text-[#2447d7] uppercase tracking-widest">Existing Indebtedness</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input disabled={!isEditing} placeholder="Lender Name" className="w-full h-7 px-2 text-[9px] font-black border border-slate-100 bg-white rounded-lg outline-none" />
                                                <input disabled={!isEditing} placeholder="Monthly Repayment" className="w-full h-7 px-2 text-[9px] font-black border border-slate-100 bg-white rounded-lg outline-none" />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Bank Partner</label>
                                        <select disabled={!isEditing} className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none cursor-pointer">
                                            {BANKS.map(bank => <option key={bank}>{bank}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Lead Source</label>
                                        <select disabled={!isEditing} className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none cursor-pointer">
                                            {SOURCES.map(src => <option key={src}>{src}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Timeline to Fund</label>
                                        <input disabled={!isEditing} className="w-full h-8 px-3 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none" placeholder="e.g. Within 2 weeks" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Credit Consent *</label>
                                        <select disabled={!isEditing} className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none">
                                            <option>Yes</option><option>No</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Overdraft</label>
                                        <select disabled={!isEditing} className="w-full h-8 px-2 text-[10px] font-black border border-slate-100 bg-slate-50/50 rounded-lg outline-none">
                                            <option>No</option><option>Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Notes & Status */}
                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <h4 className="text-[8px] font-black text-slate-300 uppercase tracking-[.2em] flex items-center gap-2">
                                    <i className="fa-solid fa-comment-dots text-[10px]"></i> Operational Context
                                </h4>
                                <textarea disabled={!isEditing} rows={4} placeholder="Enter persistent context/notes for this client..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none focus:bg-white resize-none"></textarea>
                            </div>

                            {/* 4. Action Buttons */}
                            {isEditing && (
                                <div className="pt-6 grid grid-cols-2 gap-3 pb-8">
                                    <button className="h-10 px-4 bg-[#0f172a] text-white text-[9px] font-black uppercase tracking-[.2em] rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
                                        {isCreateMode ? 'Initialize Lead' : 'Commit Changes'}
                                    </button>
                                    {!isCreateMode && (
                                        <button className="h-10 px-4 border border-rose-100 text-rose-500 text-[9px] font-black uppercase tracking-[.2em] rounded-xl hover:bg-rose-50 transition-all">
                                            Purge Record
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'tasks' ? (
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-[#2447d7] pl-2 mb-4">Follow-up Schedule</h4>
                            <div className="space-y-2.5">
                                {[1, 2].map(i => (
                                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 group hover:border-[#2447d7]/20 transition-all cursor-pointer">
                                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#2447d7] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                            <i className="fa-solid fa-phone text-[12px]"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate leading-none">Consultation Call #{i}</p>
                                            <p className="text-[8px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest font-mono">24 APR • 15:30</p>
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-[8px] text-slate-200 group-hover:text-[#2447d7] transition-colors"></i>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full h-9 mt-4 border border-dashed border-slate-300 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-[#2447d7] hover:border-[#2447d7]/30 transition-all flex items-center justify-center gap-2">
                                <i className="fa-solid fa-plus text-[7px]"></i> Initialize Follow-up
                            </button>
                        </div>
                    ) : activeTab === 'notes' ? (
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-[#2447d7] pl-2 mb-4">Internal Discussion</h4>
                            <textarea className="w-full h-48 p-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none focus:bg-white resize-none" placeholder="Add session notes or internal comments..."></textarea>
                            <button className="w-full h-9 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest active:scale-95 transition-all">Persist Session Note</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-[#2447d7] pl-2 mb-4">Document Vault</h4>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-[#2447d7]/30 transition-all group cursor-pointer shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-[13px] shadow-sm"><i className="fa-solid fa-file-pdf"></i></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-800 leading-none truncate max-w-[120px] uppercase">verification_{i}.pdf</p>
                                            <p className="text-[7px] font-bold text-slate-400 mt-1.5 uppercase font-mono tracking-tighter">1.2MB • 14 APR</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><i className="fa-solid fa-eye text-[10px]"></i></button>
                                        <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><i className="fa-solid fa-trash text-[10px]"></i></button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-[#2447d7]/30 cursor-pointer group transition-all">
                                <i className="fa-solid fa-cloud-arrow-up text-slate-200 group-hover:text-[#2447d7] text-3xl block mb-3 transition-colors"></i>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[.2em] group-hover:text-slate-600">Drag & Drop Secure Documents</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Protocol: E2EE ACTIVE</span>
                    <i className="fa-solid fa-shield-halved text-[#10b981] text-[12px]"></i>
                </div>
            </section>

            {/* MAIN DATABASE PANEL (Center - flex-1) */}
            <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 border-b border-white/5 bg-[#0f172a] flex items-center gap-3 min-h-[48px] shrink-0">
                    <h2 className="text-[9px] font-black uppercase tracking-[.2em] text-white flex-shrink-0">Lead Registry Interface</h2>
                    <span className="text-[8px] font-black text-slate-500 font-mono flex-shrink-0 whitespace-nowrap uppercase tracking-tighter">
                        {filteredLeads.length} SECURED RECORDS
                    </span>
                    <div className="relative flex-1 min-w-[120px] max-w-sm ml-6">
                        <input
                            type="text"
                            placeholder="Search by name, company or registry ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-[9px] font-black text-white outline-none focus:bg-white/12 focus:border-white/20 transition-all placeholder:text-white/20 uppercase tracking-widest"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[9px]"></i>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-[7px] font-black text-white/20 uppercase tracking-widest">Quality Filter</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg py-1.5 pr-9 pl-3 text-[9px] font-black text-slate-300 outline-none cursor-pointer uppercase tracking-widest hover:bg-white/12 active:scale-95 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff40%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:10px]"
                            >
                                <option value="All" className="bg-[#0f172a]">ALL RECORDS</option>
                                <option value="Hot" className="bg-[#0f172a]">HOT LEADS</option>
                                <option value="Warm" className="bg-[#0f172a]">WARM LEADS</option>
                                <option value="Cool" className="bg-[#0f172a]">COOL LEADS</option>
                            </select>
                        </div>
                        <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                        <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/5 rounded-lg active:scale-90"><i className="fa-solid fa-rotate-right text-xs"></i></button>
                        <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/5 rounded-lg active:scale-90"><i className="fa-solid fa-download text-xs"></i></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md border-b border-slate-100 z-10 shadow-sm">
                            <tr>
                                {['Lead Context & Identity', 'Business Entity', 'Financial Profile', 'Current Priority'].map(h => (
                                    <th key={h} className="px-6 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                                <th className="px-2 py-3 w-12 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => {
                                        setSelectedLeadId(lead.id);
                                        setIsEditing(false);
                                        setIsCreateMode(false);
                                    }}
                                    className={`transition-all cursor-pointer border-l-4 group ${selectedLeadId === lead.id ? 'bg-[#ebf0ff]/50 border-[#2447d7]' : 'hover:bg-slate-50/70 border-transparent'}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-center text-white text-[12px] font-black shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                {lead.name.split(' ')[0][0]}{lead.name.split(' ')[1]?.[0] || 'L'}
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-black text-slate-900 leading-tight uppercase tracking-tight mb-1 group-hover:text-[#2447d7] transition-colors">{lead.name}</div>
                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter leading-none font-mono">ID: {lead.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1.5">{lead.company}</div>
                                        <div className="inline-flex items-center px-1.5 py-0.5 bg-[#ebf0ff] text-[#2447d7] text-[8px] font-black uppercase tracking-widest rounded-md leading-none">Software / Tech</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[13px] font-black text-slate-900 leading-none mb-1.5 font-mono tracking-tighter">{lead.amount}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Capital</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm transition-all border ${lead.quality === 'hot' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                lead.quality === 'warm' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2.5 animate-pulse ${lead.quality === 'hot' ? 'bg-rose-500' :
                                                    lead.quality === 'warm' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`}></span>
                                            {lead.quality} LEADS
                                        </span>
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        <i className={`fa-solid fa-chevron-right text-[10px] transition-all duration-300 ${selectedLeadId === lead.id ? 'translate-x-1.5 text-[#2447d7]' : 'text-slate-100 group-hover:text-slate-300'}`}></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{filteredLeads.length} RECORDS ACCESSIBLE • ACCESS LEVEL: ADMIN-01</span>
                    <div className="flex items-center gap-4">
                        <button className="text-[8px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2 group">
                            <i className="fa-solid fa-angle-left group-hover:-translate-x-1 transition-transform"></i> Previous
                        </button>
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(p => <span key={p} className={`w-6 h-6 flex items-center justify-center text-[9px] font-black rounded-lg cursor-pointer shadow-sm transition-all ${p === 1 ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}>{p}</span>)}
                        </div>
                        <button className="text-[8px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2 group">
                            Next <i className="fa-solid fa-angle-right group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* RIGHT PANEL: Analytics & Team (300px) */}
            <aside className="w-[300px] flex flex-col gap-3 shrink-0 h-full overflow-hidden">
                {/* Visual Distribution Analytics */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 shrink-0">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] border-b border-slate-50 pb-4 mb-4 flex items-center justify-between">
                        DB Analytics
                        <i className="fa-solid fa-wave-square text-[#2447d7] text-[11px]"></i>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Hot Priority', val: '24', color: 'text-rose-600', bg: 'bg-rose-50/50' },
                            { label: 'Monthly Delta', val: '+22.4%', color: 'text-[#10b981]', bg: 'bg-emerald-50/50' },
                            { label: 'Avg Liquidity', val: '£68k', color: 'text-[#2447d7]', bg: 'bg-indigo-50/50' },
                            { label: 'Conversion', val: '14.8%', color: 'text-amber-600', bg: 'bg-amber-50/50' }
                        ].map((s, i) => (
                            <div key={i} className={`p-4 rounded-2xl border border-slate-50 transition-all hover:bg-white hover:shadow-md cursor-help ${s.bg}`}>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{s.label}</p>
                                <p className={`text-[18px] font-black leading-none font-mono ${s.color}`}>{s.val}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Real-time Agent Registry */}
                <section className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-5 py-4 bg-[#0f172a] flex items-center justify-between shrink-0">
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Team Specialist Grid</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-2.5">
                        {teleAgents.map(agent => (
                            <div key={agent.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#2447d7]/30 transition-all group hover:bg-[#ebf0ff]/20 cursor-pointer shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl ${agent.color} text-white flex items-center justify-center text-[12px] font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                                        {agent.id[0]}{agent.id.slice(-1)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[11px] font-black text-slate-900 uppercase truncate leading-none">{agent.name}</p>
                                            <span className="text-[8px] font-black text-slate-300 font-mono tracking-tighter">{agent.leads} ACTIVE</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ACTIVE' ? 'bg-emerald-500 pulse-dot' : 'bg-slate-300'}`}></span>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{agent.status} SYSTEM</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 hidden group-hover:flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                                    <button className="text-[8px] font-black text-[#2447d7] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Assign Record</button>
                                    <button className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Performance</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center shrink-0">
                        <button className="text-[8px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[.2em] transition-all">Consolidated Performance Overview</button>
                    </div>
                </section>
            </aside>
            <style jsx global>{`
                .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
}
