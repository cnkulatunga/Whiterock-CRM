'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterLeadPage() {
    const router = useRouter();
    const [caseId, setCaseId] = useState('');
    const [existingLoan, setExistingLoan] = useState('No');

    useEffect(() => {
        setCaseId('AF-CASE-' + Math.floor(1000 + Math.random() * 9000));
    }, []);

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
            {/* Header */}
            <header className="h-[64px] bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all">
                            <i className="fa-solid fa-arrow-left text-[10px]"></i>
                        </div>
                        Back
                    </button>

                    <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                            <i className="fa-solid fa-user-plus text-base"></i>
                        </div>
                        <div>
                            <h1 className="text-[13px] font-black text-slate-900 leading-none uppercase tracking-widest">Register New Lead</h1>
                            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Enter client information & loan requirements</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                        <span className="text-[10px] font-black text-indigo-900 font-mono tracking-wider">{caseId}</span>
                    </div>

                    <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</label>
                        <select className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer">
                            <option>Warm</option>
                            <option>Hot</option>
                            <option>Cold (New)</option>
                        </select>
                    </div>

                    <button className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center gap-2">
                        <i className="fa-solid fa-check text-[10px]"></i>
                        Save Lead
                    </button>
                </div>
            </header>

            {/* Form Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1200px] mx-auto space-y-8">

                    {/* Section 1: Contact Information */}
                    <section className="glass-card bg-white p-8">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <i className="fa-solid fa-address-card text-xs"></i>
                            </div>
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Contact Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            {[
                                { label: 'Title', type: 'text', placeholder: 'Mr, Mrs, Dr...', required: true },
                                { label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
                                { label: 'Date of Birth', type: 'date', required: true },
                                { label: 'Company Name', type: 'text', placeholder: 'Business name...', required: true },
                                { label: 'Registration Number', type: 'text', placeholder: 'Company House #', required: true },
                                { label: 'Annual Turnover', type: 'text', placeholder: '£ 0.00', required: true },
                                { label: 'Job Title', type: 'text', placeholder: 'Director, Owner...' },
                                { label: 'Industry', type: 'select', options: ['Real Estate', 'Retail', 'Tech', 'Construction', 'Healthcare'] },
                                { label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
                                { label: 'Phone Number', type: 'tel', placeholder: '+44 0000 000 000', required: true },
                                { label: 'Preferred Contact', type: 'select', options: ['Email', 'Phone', 'WhatsApp', 'SMS'] },
                                { label: 'Home Owner', type: 'select', options: ['Yes', 'No'], required: true },
                            ].map((field, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                                    </label>
                                    {field.type === 'select' ? (
                                        <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                                            <option value="">Select option...</option>
                                            {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Residential Address <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Full address (Street, City, Postcode)"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Loan Details */}
                    <section className="glass-card bg-white p-8">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                                <i className="fa-solid fa-sack-dollar text-xs"></i>
                            </div>
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Loan & Financial Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount Needed <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="£ 0.00"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Purpose of Loan</label>
                                <input
                                    type="text"
                                    placeholder="Refurbishment, Purchase..."
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Existing Loans?</label>
                                <select
                                    value={existingLoan}
                                    onChange={(e) => setExistingLoan(e.target.value)}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                                >
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>

                            {existingLoan === 'Yes' && (
                                <div className="col-span-full bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
                                    <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Existing Indebtedness</div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input placeholder="Lender Name" className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none" />
                                        <input placeholder="Current Balance (£)" className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none" />
                                        <input placeholder="Monthly Payment (£)" className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Main Business Bank</label>
                                <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                                    <option>HSBC</option>
                                    <option>Barclays</option>
                                    <option>Lloyds</option>
                                    <option>Starling</option>
                                    <option>NatWest</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Funding Timeline</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2-4 weeks"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Credit Search Consent <span className="text-rose-500">*</span></label>
                                <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                                    <option>Yes, consented</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Additional Context */}
                    <section className="glass-card bg-white p-8">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                                <i className="fa-solid fa-comment-dots text-xs"></i>
                            </div>
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.15em]">Additional Context</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-2">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Internal Notes</label>
                                <textarea
                                    placeholder="Enter any additional information about the client or case here..."
                                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"
                                ></textarea>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Document Drop</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-500/30 transition-all cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mb-3">
                                            <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Upload Files</p>
                                        <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">PDF, JPG, PNG (Max 10MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pb-12">
                        <button
                            onClick={handleBack}
                            className="h-11 px-8 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button className="h-11 px-10 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                            Create Lead Entry
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
