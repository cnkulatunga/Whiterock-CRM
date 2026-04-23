'use client';

import React, { useState, useEffect } from 'react';
import { leads, teleAgents } from '@/data/dummy';

interface Lead {
    id: string;
    name: string;
    company: string;
    status: string;
    type: string;
    amount: string;
    quality: 'hot' | 'warm' | 'cool';
    phone: string;
    email: string;
}

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
    const [leadList, setLeadList] = useState<any[]>(leads);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState<any>({});

    const selectedLead = leadList.find(l => l.id === selectedLeadId);

    const filteredLeads = leadList.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.company.toLowerCase().includes(search.toLowerCase()) ||
            l.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || l.quality.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: leadList.length,
        hot: leadList.filter(l => l.quality === 'hot').length,
        warm: leadList.filter(l => l.quality === 'warm').length
    };

    const toggleRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCreateNew = () => {
        setIsCreateMode(true);
        setIsEditing(true);
        setFormData({
            id: `AF-CASE-${Math.floor(1000 + Math.random() * 9000)}`,
            quality: 'warm',
            status: 'Initial'
        });
    };

    const handleEditLead = (lead: any) => {
        setIsCreateMode(true); // Reuse creation view for full-page edit
        setIsEditing(true);
        setFormData({ ...lead });
    };

    const handleCancel = () => {
        setIsCreateMode(false);
        setIsEditing(false);
        setFormData({});
    };

    const saveLead = () => {
        if (!formData.name && !formData.fullName) {
            alert('Full Name is required');
            return;
        }
        const finalLead = {
            ...formData,
            name: formData.fullName || formData.name,
            amount: formData.loanAmount || formData.amount || '£0'
        };

        if (leadList.find(l => l.id === finalLead.id)) {
            setLeadList(prev => prev.map(l => l.id === finalLead.id ? finalLead : l));
        } else {
            setLeadList(prev => [finalLead, ...prev]);
        }
        handleCancel();
    };

    if (isCreateMode) {
        return (
            <div className="flex-1 flex flex-col bg-[#f8fafc] h-screen overflow-hidden animate-in fade-in duration-300">
                {/* Registration Header */}
                <header className="h-[52px] bg-white border-b border-slate-100 flex items-center px-5 shrink-0 shadow-sm z-10">
                    <button onClick={handleCancel} className="flex items-center gap-2 group mr-6 text-left">
                        <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#2447d7] group-hover:border-[#2447d7] transition-all">
                            <i className="fa-solid fa-arrow-left text-[10px] text-slate-400 group-hover:text-white"></i>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#2447d7]">Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#2447d7]">
                            <i className="fa-solid fa-user-plus text-[14px]"></i>
                        </div>
                        <div>
                            <h1 className="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                {formData.id ? 'Modify Lead Context' : 'Register New Lead'}
                            </h1>
                            <p className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Secure Registry Protocol Active</p>
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-mono font-black text-[#2447d7] tracking-widest uppercase">{formData.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Priority</label>
                            <select
                                value={formData.quality}
                                onChange={e => setFormData({ ...formData, quality: e.target.value })}
                                className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-900 outline-none cursor-pointer"
                            >
                                <option value="hot">HOT</option>
                                <option value="warm">WARM</option>
                                <option value="cool">COOL</option>
                            </select>
                        </div>
                        <button onClick={saveLead} className="h-9 px-6 bg-[#2447d7] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg flex items-center gap-2">
                            <i className="fa-solid fa-check text-[9px]"></i> Save Commitment
                        </button>
                    </div>
                </header>

                {/* Registration Form Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* 1. Contact Information */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-6 flex items-center gap-3 border-b-2 border-indigo-600 pb-3 w-fit">
                                <i className="fa-solid fa-address-card"></i> Contact Information
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Title *</label>
                                    <input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Mr, Mrs, Dr..." className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Full Name *</label>
                                    <input value={formData.fullName || formData.name || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Jonathan Doe" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Date of Birth *</label>
                                    <input type="date" value={formData.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Company / Organization *</label>
                                    <input value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Registered name..." className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Company House Number *</label>
                                    <input value={formData.companyHouseNumber || ''} onChange={e => setFormData({ ...formData, companyHouseNumber: e.target.value })} placeholder="e.g. 12345678" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Annual Turnover *</label>
                                    <input value={formData.businessAnnualTurnover || ''} onChange={e => setFormData({ ...formData, businessAnnualTurnover: e.target.value })} placeholder="£0.00" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all font-mono" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Job Title</label>
                                    <input value={formData.jobTitle || ''} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="Managing Director" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Industry</label>
                                    <select value={formData.industry || ''} onChange={e => setFormData({ ...formData, industry: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all cursor-pointer">
                                        <option value="">Select industry...</option>
                                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Email *</label>
                                    <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="client@example.com" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Phone Number *</label>
                                    <input type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+44 77..." className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all font-mono" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Preferred Method</label>
                                    <div className="flex gap-2 h-10">
                                        {['Email', 'Phone', 'WhatsApp', 'Other'].map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, preferredMethod: m })}
                                                className={`flex-1 rounded-xl text-[9px] font-black transition-all border ${formData.preferredMethod === m ? 'bg-indigo-600 text-white border-indigo-600 shadow-md translate-y-[-1px]' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Home Owner</label>
                                    <select value={formData.homeOwner || 'Yes'} onChange={e => setFormData({ ...formData, homeOwner: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all">
                                        <option>Yes</option><option>No</option>
                                    </select>
                                </div>
                                <div className="col-span-3 text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Residential Address *</label>
                                    <input value={formData.residentialAddress || ''} onChange={e => setFormData({ ...formData, residentialAddress: e.target.value })} placeholder="Full address..." className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Loan Details */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-6 flex items-center gap-3 border-b-2 border-indigo-600 pb-3 w-fit">
                                <i className="fa-solid fa-sack-dollar"></i> Operational Finance Details
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Amount Needed *</label>
                                    <input value={formData.loanAmount || formData.amount || ''} onChange={e => setFormData({ ...formData, loanAmount: e.target.value })} placeholder="£0.00" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all font-mono" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Loan Purpose</label>
                                    <input value={formData.loanPurpose || ''} onChange={e => setFormData({ ...formData, loanPurpose: e.target.value })} placeholder="Business expansion..." className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Existing Indebtedness</label>
                                    <select value={formData.existingLoan || 'No'} onChange={e => setFormData({ ...formData, existingLoan: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all">
                                        <option>No</option><option>Yes</option>
                                    </select>
                                </div>
                                <div className="text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Bank Institution</label>
                                    <select value={formData.companyBank || ''} onChange={e => setFormData({ ...formData, companyBank: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all">
                                        <option value="">Select a bank...</option>
                                        {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Lead Source</label>
                                    <select value={formData.leadSource || ''} onChange={e => setFormData({ ...formData, leadSource: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all">
                                        <option value="">Select source...</option>
                                        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Credit Search Consent *</label>
                                    <select value={formData.creditConsent || 'Yes'} onChange={e => setFormData({ ...formData, creditConsent: e.target.value })} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all">
                                        <option>Yes</option><option>No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. Follow-up & Comments */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-6 flex items-center gap-3 border-b-2 border-amber-500 pb-3 w-fit">
                                    <i className="fa-solid fa-calendar-plus text-amber-500"></i> Schedule Initial Action
                                </h3>
                                <div className="space-y-4">
                                    <div className="text-left">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Action Type</label>
                                        <select className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all">
                                            <option>Call</option><option>Meeting</option><option>Follow-up</option><option>Email</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="date" className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black outline-none" />
                                        <input type="time" className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black outline-none" />
                                    </div>
                                    <textarea placeholder="Quick instructions for team leader..." rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black outline-none focus:bg-white resize-none"></textarea>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-6 flex items-center gap-3 border-b-2 border-indigo-600 pb-3 w-fit">
                                    <i className="fa-solid fa-comment-dots"></i> Additional Context
                                </h3>
                                <textarea
                                    value={formData.additionalComments || ''}
                                    onChange={e => setFormData({ ...formData, additionalComments: e.target.value })}
                                    placeholder="Enter persistent context/notes for this client record..."
                                    className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black outline-none focus:bg-white resize-none min-h-[160px]"
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 pb-12">
                            <button onClick={handleCancel} className="h-11 px-8 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Abandon Protocol</button>
                            <button onClick={saveLead} className="h-11 px-10 bg-[#2447d7] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-indigo-100">Synchronize Registry</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex overflow-hidden bg-slate-50 p-3 gap-3 h-screen">
            {/* LEFT PANEL: Database & List */}
            <section className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm relative">
                {/* Dark Header */}
                <header className="h-[52px] bg-[#0f172a] px-5 flex items-center gap-4 shrink-0 shadow-lg z-10">
                    <div className="flex flex-col shrink-0 text-left">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-white leading-none">Lead Database</h2>
                        <span className="text-[7px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{filteredLeads.length} RECORDS ACCESSIBLE</span>
                    </div>

                    <div className="relative flex-1 max-w-sm ml-4">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-500"></i>
                        <input
                            type="text"
                            placeholder="Search by identity, company or registry ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-8 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-[10px] font-bold text-white outline-none focus:bg-white/12 focus:border-white/20 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="h-8 bg-white/5 border border-white/10 rounded-xl px-3 text-[9px] font-black text-slate-300 outline-none cursor-pointer focus:bg-white/12 uppercase tracking-widest"
                        >
                            <option value="All" className="bg-[#1e293b]">ALL STATUS</option>
                            <option value="hot" className="bg-[#1e293b]">HOT</option>
                            <option value="warm" className="bg-[#1e293b]">WARM</option>
                            <option value="cool" className="bg-[#1e293b]">COOL</option>
                        </select>
                    </div>

                    <div className="flex items-center h-[52px] border-l border-white/5 pl-4 gap-0 shrink-0">
                        <div className="flex items-center gap-2 px-3 h-[52px] border-r border-white/5">
                            <span className="text-[14px] font-black text-white leading-none font-mono">{stats.total}</span>
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">TOTAL</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 h-[52px] border-r border-white/5">
                            <span className="text-[14px] font-black text-rose-400 leading-none font-mono">{stats.hot}</span>
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">HOT</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 h-[52px]">
                            <span className="text-[14px] font-black text-amber-400 leading-none font-mono">{stats.warm}</span>
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">WARM</span>
                        </div>
                    </div>

                    <button onClick={handleCreateNew} className="h-8 px-4 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 ml-2">
                        <i className="fa-solid fa-plus-circle text-[10px]"></i> Add Lead
                    </button>
                </header>

                {/* Table Registry */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100 z-10">
                            <tr>
                                <th className="px-6 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">LEAD IDENTITY</th>
                                <th className="px-6 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">COMPANY ENTITY</th>
                                <th className="px-6 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">FUNDING NEED</th>
                                <th className="px-6 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">STATUS</th>
                                <th className="px-2 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLeads.map(lead => {
                                const isSelected = selectedLeadId === lead.id;
                                const isExpanded = expandedRows.includes(lead.id);

                                return (
                                    <React.Fragment key={lead.id}>
                                        <tr
                                            onClick={() => setSelectedLeadId(lead.id)}
                                            className={`group cursor-pointer transition-all border-l-4 ${isSelected ? 'bg-indigo-50/50 border-indigo-600' : 'hover:bg-slate-50/50 border-transparent'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div onClick={(e) => toggleRow(lead.id, e)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
                                                        <span className="text-[10px] font-black">{lead.name.split(' ')[0][0]}{lead.name.split(' ')[1]?.[0] || 'L'}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{lead.name}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter font-mono">{lead.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] font-black text-slate-700 leading-tight uppercase">{lead.company}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1 leading-none">{lead.type || 'SME Finance'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[13px] font-black text-slate-900 leading-none font-mono tracking-tighter">{lead.amount}</p>
                                                <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1 leading-none">Operational</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${lead.quality === 'hot' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                            lead.quality === 'warm' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        }`}>
                                                        {lead.quality}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <i className={`fa-solid fa-chevron-right text-[8px] transition-all duration-300 ${isSelected ? 'translate-x-1 text-indigo-600' : 'text-slate-100 group-hover:text-slate-300'}`}></i>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={5} className="p-0">
                                                    <div className="p-6 grid grid-cols-4 gap-8 animate-in slide-in-from-top-2 duration-300 border-b border-slate-100 shadow-inner">
                                                        <div className="text-left">
                                                            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                <i className="fa-solid fa-building"></i> Entity Detail
                                                            </h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Corporate Email</p>
                                                                    <p className="text-[10px] font-black text-indigo-600 underline decoration-indigo-200 underline-offset-2 uppercase">{lead.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Secure Line</p>
                                                                    <p className="text-[10px] font-black text-slate-800">{lead.phone}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                <i className="fa-solid fa-sack-dollar"></i> Loan Context
                                                            </h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Exp. Timeline</p>
                                                                    <p className="text-[10px] font-black text-slate-800">Within 2 Weeks</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Req. Purpose</p>
                                                                    <p className="text-[10px] font-black text-slate-800 uppercase">Asset Procurement</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2 text-left">
                                                            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                <i className="fa-solid fa-users-gear"></i> Internal Assignment
                                                            </h4>
                                                            <div className="flex gap-4">
                                                                <div className="p-3 bg-white rounded-2xl border border-slate-100 flex-1 shadow-sm">
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none text-center">Primary Agent</p>
                                                                    <div className="flex items-center gap-3 justify-center">
                                                                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-100">TM</div>
                                                                        <span className="text-[10px] font-black text-slate-900 uppercase">Thanushika M</span>
                                                                    </div>
                                                                </div>
                                                                <div className="p-3 bg-white rounded-2xl border border-slate-100 flex-1 shadow-sm">
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none text-center">Protocol Status</p>
                                                                    <div className="flex items-center gap-3 justify-center">
                                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></div>
                                                                        <span className="text-[10px] font-black text-emerald-600 uppercase">Active Engagement</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Status */}
                <footer className="h-10 bg-slate-50 border-t border-slate-100 px-6 flex items-center justify-between shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">End of Lead Registry • Managed by Alpha OS</span>
                    <button onClick={handleCreateNew} className="text-[8px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-2 transition-all">
                        <i className="fa-solid fa-plus-circle"></i> Initialize New Registry Record
                    </button>
                </footer>
            </section>

            {/* RIGHT PANEL: Context Detail */}
            <aside className="w-[480px] bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                {!selectedLead ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200 border-4 border-slate-50/50 border-dashed">
                            <i className="fa-solid fa-user-group text-4xl"></i>
                        </div>
                        <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-widest">Protocol Stalled</h3>
                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter max-w-[200px]">Select a lead record from the database to engage detailed context...</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <header className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                            <div className="flex items-center gap-4 text-left">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-[16px] font-black shadow-xl shadow-slate-200 shrink-0">
                                    {selectedLead.name.split(' ')[0][0]}{selectedLead.name.split(' ')[1]?.[0] || 'L'}
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-black text-slate-900 leading-none uppercase tracking-tight">{selectedLead.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${selectedLead.quality === 'hot' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                            }`}>{selectedLead.quality}</span>
                                        <span className="text-[9px] font-mono font-black text-[#2447d7] uppercase tracking-tighter">{selectedLead.id}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleEditLead(selectedLead)} className="h-9 px-5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md flex items-center gap-2">
                                <i className="fa-solid fa-pen-to-square"></i> Modify
                            </button>
                        </header>

                        {/* Navigation Tabs */}
                        <nav className="flex px-4 pt-4 border-b border-slate-100 bg-slate-50/30 gap-1 shrink-0">
                            {[
                                { id: 'details', label: 'Identity', icon: 'fa-id-card' },
                                { id: 'tasks', label: 'Follow-ups', icon: 'fa-calendar-check' },
                                { id: 'ai', label: 'Alpha Insight', icon: 'fa-bolt' },
                                { id: 'notes', label: 'Context', icon: 'fa-note-sticky' },
                                { id: 'docs', label: 'Vault', icon: 'fa-folder-open' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-t-xl transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                >
                                    <i className={`fa-solid ${tab.icon} text-[11px]`}></i>
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Scrollable Content Container */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {activeTab === 'details' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <section className="text-left">
                                        <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[.2em] mb-4 flex items-center gap-2">
                                            <i className="fa-solid fa-address-book"></i> Communication Matrix
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:border-indigo-200">
                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Corporate Email Protocol</p>
                                                <p className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{selectedLead.email}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:border-indigo-200">
                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Secure Communication Line</p>
                                                <p className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase font-mono">{selectedLead.phone}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="text-left">
                                        <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[.2em] mb-4 flex items-center gap-2">
                                            <i className="fa-solid fa-briefcase"></i> Entity Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Business House</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase leading-tight">{selectedLead.company}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Sector Integration</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase">{selectedLead.type || 'SME Finance'}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'tasks' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-tight leading-none">Discuss Loan Purpose</h4>
                                            <p className="text-[8px] font-black text-indigo-600 mt-2 uppercase tracking-widest font-mono">Initial Call • 14:30 Today</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-2xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                            <i className="fa-solid fa-phone"></i>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4">Initialize Next Action</h5>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <select className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none">
                                                    <option>Call</option><option>Meeting</option>
                                                </select>
                                                <input type="date" className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none" />
                                            </div>
                                            <textarea rows={3} placeholder="Action description / context..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black resize-none outline-none focus:bg-white"></textarea>
                                            <button type="button" className="w-full h-10 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                                <i className="fa-solid fa-plus-circle"></i> Add Task
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ai' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                                    <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden">
                                        <i className="fa-solid fa-bolt absolute top-[-20px] right-[-10px] text-white/5 text-8xl"></i>
                                        <p className="text-[7px] font-black text-[#2447d7] uppercase tracking-[.3em] mb-4">Alpha-01 Analysis</p>
                                        <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                                            "Lead demonstrates strong intent for {selectedLead.company}. Financial liquidity looks optimal for a {selectedLead.amount} commitment. Suggest immediate follow-up via phone to solidify engagement."
                                        </p>
                                        <div className="mt-6 flex items-center gap-4">
                                            <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/5">
                                                <span className="text-[8px] font-black text-white/40 uppercase block mb-1">Health Score</span>
                                                <span className="text-[12px] font-black text-emerald-400 leading-none">94%</span>
                                            </div>
                                            <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/5">
                                                <span className="text-[8px] font-black text-white/40 uppercase block mb-1">Sentiment</span>
                                                <span className="text-[12px] font-black text-indigo-400 leading-none uppercase">POSITIVE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                                    <textarea rows={8} placeholder="Enter persistent context/notes for this client record..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black outline-none focus:bg-white resize-none shadow-inner"></textarea>
                                    <button type="button" className="w-full h-11 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all">Persist Session Notes</button>
                                </div>
                            )}

                            {activeTab === 'docs' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all group cursor-pointer shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-[14px] shadow-sm shrink-0"><i className="fa-solid fa-file-pdf"></i></div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-800 uppercase group-hover:text-indigo-600 transition-colors">Tax_Return_FY24_{i}.pdf</p>
                                                    <p className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-tighter leading-none">1.2 MB • Securely Stored</p>
                                                </div>
                                            </div>
                                            <i className="fa-solid fa-chevron-right text-[10px] text-slate-200 group-hover:text-indigo-600 transition-colors"></i>
                                        </div>
                                    ))}
                                    <div className="mt-4 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:bg-slate-50 hover:border-indigo-400 cursor-pointer group transition-all">
                                        <i className="fa-solid fa-cloud-arrow-up text-slate-200 group-hover:text-indigo-600 text-4xl block mb-4 transition-colors"></i>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[.2em] group-hover:text-slate-600">Secure Vault Injection Point</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
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
