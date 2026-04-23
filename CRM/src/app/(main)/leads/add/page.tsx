'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
        <div className="flex flex-col h-full overflow-hidden bg-[#f8fafc]">
            {/* ══ Page Header ══ */}
            <header className="bg-white border-b border-slate-100 shadow-sm flex items-center gap-4 px-5 h-[52px] shrink-0 z-20">
                <button className="flex items-center gap-2 text-slate-400 hover:text-[#2447d7] transition-all group outline-none" onClick={handleBack}>
                    <div className="w-[26px] h-[26px] rounded-full bg-[#f8fafc] border border-slate-200 flex items-center justify-center group-hover:bg-[#2447d7] group-hover:border-[#2447d7] transition-all">
                        <i className="fa-solid fa-arrow-left text-[9px] group-hover:text-white"></i>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Back</span>
                </button>

                <div className="w-[1px] h-6 bg-slate-100 shrink-0"></div>

                <div className="flex items-center gap-3">
                    <div className="w-[30px] h-[30px] rounded-xl bg-[#ebf0ff] flex items-center justify-center shrink-0 shadow-sm">
                        <i className="fa-solid fa-user-plus text-[#2447d7] text-xs"></i>
                    </div>
                    <div>
                        <h1 className="text-[12px] font-black text-slate-900 leading-none uppercase tracking-widest m-0">Register New Lead</h1>
                        <p className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter m-0 whitespace-nowrap">Integrated Case Registration System • {caseId}</p>
                    </div>
                </div>

                <div className="flex-1"></div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 border-l border-slate-100">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Status</label>
                        <select className="h-7 px-2 text-[9px] font-black border border-slate-200 rounded-lg bg-slate-50 outline-none uppercase cursor-pointer">
                            <option>Warm</option>
                            <option>Hot</option>
                            <option>Cool</option>
                        </select>
                    </div>

                    <button className="h-8.5 px-5 bg-[#2447d7] hover:bg-indigo-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
                        <i className="fa-solid fa-check text-[8px]"></i> Save Lead
                    </button>
                </div>
            </header>

            {/* ══ Scrollable Form Body ══ */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-[#fcfcfd]">

                {/* 1. Contact Information */}
                <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 pb-2.5 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-address-card text-[#2447d7]"></i> 1. Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                        {[
                            { label: 'Title', placeholder: 'Mr, Mrs, Dr...', required: true },
                            { label: 'Full Name', placeholder: 'Jonathan Doe', required: true },
                            { label: 'Date of Birth', type: 'date', required: true },
                            { label: 'Company / Organization Name', placeholder: 'Registered name...', required: true },
                            { label: 'Company House Number', placeholder: 'e.g. 12345678', required: true },
                            { label: 'Business Annual Turnover', placeholder: '£0.00', required: true },
                            { label: 'Job Title / Position', placeholder: 'Managing Director' },
                            { label: 'Industry', type: 'select', options: INDUSTRIES },
                            { label: 'Email Address', type: 'email', placeholder: 'client@example.com', required: true },
                            { label: 'Phone Number', type: 'tel', placeholder: '+44 77...', required: true },
                            { label: 'Preferred Method', type: 'method' },
                            { label: 'Home Owner', type: 'select', options: ['Yes', 'No'], required: true },
                            { label: 'Time at Current Address', placeholder: 'e.g. 3 years' },
                        ].map((field, i) => (
                            <div key={i} className="space-y-1.5 focus-within:z-10">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block ml-1">
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>
                                {field.type === 'select' ? (
                                    <select className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 outline-none focus:bg-white focus:border-[#2447d7] transition-all cursor-pointer">
                                        <option value="">Select industry...</option>
                                        {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                ) : field.type === 'method' ? (
                                    <div className="flex gap-1.5">
                                        {['Email', 'Phone', 'WhatsApp', 'Other'].map((m) => (
                                            <div key={m} className={`h-9 flex-1 flex items-center justify-center border text-[9px] font-black rounded-xl cursor-pointer transition-all ${m === 'Email' ? 'bg-[#ebf0ff] border-[#2447d7] text-[#2447d7]' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        placeholder={field.placeholder}
                                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 outline-none focus:bg-white focus:border-[#2447d7] transition-all"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="lg:col-span-3 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Residential Address <span className="text-rose-500">*</span></label>
                            <input className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none focus:bg-white transition-all" placeholder="Full address (Street, City, Postcode)..." />
                        </div>
                        <div className="lg:col-span-3 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Previous Address</label>
                            <input className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none focus:bg-white transition-all" placeholder="Previous address if at current for < 3 years..." />
                        </div>
                    </div>
                </section>

                {/* 2. Loan Details */}
                <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 pb-2.5 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-sack-dollar text-[#2447d7]"></i> 2. Loan & Financial Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Amount Needed <span className="text-rose-500">*</span></label>
                            <input className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none focus:bg-white transition-all" placeholder="£0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Loan Purpose</label>
                            <input className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none focus:bg-white transition-all" placeholder="Business expansion..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Existing Loan</label>
                            <select
                                value={existingLoan}
                                onChange={(e) => setExistingLoan(e.target.value)}
                                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer"
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>

                        {existingLoan === 'Yes' && (
                            <div className="col-span-full bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                <p className="text-[9px] font-black text-[#2447d7] uppercase tracking-widest m-0 leading-none">Existing Indebtedness</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    <input placeholder="Lender Name" className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black outline-none" />
                                    <input placeholder="Amount (£)" className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black outline-none" />
                                    <input placeholder="Interest %" className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black outline-none" />
                                    <input placeholder="Monthly (£)" className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black outline-none" />
                                    <input placeholder="Term" className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black outline-none" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Overdraft Facility</label>
                            <select className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer">
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Company Bank</label>
                            <select className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer">
                                <option value="">Select a bank...</option>
                                {BANKS.map(bank => <option key={bank}>{bank}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Lead Source</label>
                            <select className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer">
                                <option value="">Select source...</option>
                                {SOURCES.map(source => <option key={source}>{source}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Funding Timeline</label>
                            <input className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none" placeholder="e.g. Within 2 weeks" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Alpha Loan Before? <span className="text-rose-500">*</span></label>
                            <select className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer">
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Credit Consent <span className="text-rose-500">*</span></label>
                            <select className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer">
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 3. Docs & Comments */}
                <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 pb-2.5 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-paperclip text-[#2447d7]"></i> Supporting Docs
                        </h3>
                        <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center hover:bg-[#ebf0ff] hover:border-[#2447d7] transition-all group cursor-pointer">
                            <i className="fa-solid fa-cloud-arrow-up text-slate-300 group-hover:text-[#2447d7] text-xl mb-2 block"></i>
                            <span className="text-[8px] font-black text-slate-400 group-hover:text-[#2447d7] uppercase tracking-[.2em]">Click to Upload</span>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 pb-2.5 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-comment-dots text-[#2447d7]"></i> Additional Comments
                        </h3>
                        <textarea className="w-full h-[88px] p-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black outline-none focus:bg-white resize-none" placeholder="Enter persistent context/notes for this client..." />
                    </div>
                </section>

                {/* 4. Schedule Follow-up */}
                <section className="bg-[#f0f4ff]/40 border border-blue-100 rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 border-b border-blue-100 pb-2.5">
                        <h4 className="text-[10px] font-black text-[#2447d7] uppercase tracking-[.15em] m-0 flex items-center gap-2">
                            <i className="fa-solid fa-calendar-plus"></i> 4. Schedule Follow-up
                        </h4>
                        <div className="w-2 h-2 rounded-full bg-[#2447d7] animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Task Description</label>
                            <input className="w-full h-9 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black outline-none shadow-sm" placeholder="e.g. Initial Consultation..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Assignee</label>
                            <select className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer shadow-sm">
                                <option>Thanushika</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Task Type</label>
                            <select className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black outline-none cursor-pointer shadow-sm">
                                <option>Call</option>
                                <option>Meeting</option>
                                <option>Follow-up</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Date</label>
                            <input type="date" className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black outline-none shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Time</label>
                            <input type="time" className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black outline-none shadow-sm" />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 block">Instructions</label>
                            <input className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black outline-none shadow-sm" placeholder="Additional notes for the task..." />
                        </div>
                    </div>
                </section>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 pb-8">
                    <button onClick={handleBack} className="h-10 px-6 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-200">
                        Cancel
                    </button>
                    <button className="h-10 px-8 bg-[#2447d7] hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
                        <i className="fa-solid fa-check text-[8px]"></i> Complete Registration
                    </button>
                </div>

            </main>
        </div>
    );
}
