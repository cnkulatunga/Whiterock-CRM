'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast, ToastContainer } from '@/components/Toast';

const INDUSTRIES = [
  'Software','Hardware','IT Services','Telecommunications','E-commerce','Digital Media',
  'Robotics','Pharmaceuticals','Medical Devices','Hospitals','Health Insurance',
  'BioTechnology','Wellness','Banking','Insurance','Investment Banking',
  'Venture Capital','Accounting','Aerospace',
];
const BANKS = [
  'Santander','HSBC','Lloyds Bank','Starling','NatWest','Barclays','Metro Bank',
  'Royal Bank of Scotland','The Co-operative Bank','The Cumberland','Tide','TSB',
  'Ulster Bank','Unity Trust Bank','Zempler',
];
const SOURCES = [
  'Advertisement','Cold Call','Web','External Referral','Instagram','Organic Search',
  'Sales Email Alias','Employee Referral','Online Store','Partner','Public Relations',
  'Seminar Partner','Internal Seminar','Trade Show','Chat',
];

export default function RegisterLeadPage() {
    const router = useRouter();
    const { toasts, remove, toast } = useToast();
    const [caseId, setCaseId] = useState('');
    const [formData, setFormData] = useState<any>({
        quality: 'warm',
        preferredMethod: 'Email',
        homeOwner: 'Yes',
        creditConsent: 'Yes',
    });

    useEffect(() => { setCaseId('AF-CASE-' + Math.floor(1000 + Math.random() * 9000)); }, []);

    const handleBack = () => router.push('/leads');

    const saveLead = async () => {
        if (!formData.fullName) {
            toast.warning('Full Name is required');
            return;
        }

        const payload = {
            name: formData.fullName,
            title: formData.title || '',
            company: formData.company || 'Private Individual',
            email: formData.email || '',
            phone: formData.phone || '',
            amount: formData.loanAmount || '£0',
            status: 'new',
            priority: formData.quality || 'warm',
            quality: formData.quality || 'warm',
            level: formData.leadLevel || 'Level 1',
            dob: formData.dob || '',
            notes: formData.additionalComments || '',
            industry: formData.industry || '',
            jobTitle: formData.jobTitle || '',
            companyHouseNumber: formData.companyHouseNumber || '',
            businessAnnualTurnover: formData.businessAnnualTurnover || '',
            preferredMethod: formData.preferredMethod || '',
            homeOwner: formData.homeOwner || 'Yes',
            residentialAddress: formData.residentialAddress || '',
            loanPurpose: formData.loanPurpose || '',
            existingLoan: formData.existingLoan || 'No',
            companyBank: formData.companyBank || '',
            leadSource: formData.leadSource || '',
            creditConsent: formData.creditConsent || 'Yes',
        };

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Lead saved successfully.');
                router.push('/leads');
            } else {
                const err = await response.json().catch(() => ({}));
                toast.error(err?.error ? String(err.error) : 'Failed to save lead');
            }
        } catch {
            toast.error('Could not reach server. Please try again.');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#f8fafc] h-screen overflow-hidden animate-in fade-in duration-300">
            <ToastContainer toasts={toasts} remove={remove} />
            {/* Registration Header */}
            <header className="h-[52px] bg-white border-b border-slate-100 flex items-center px-5 shrink-0 shadow-sm z-10">
                <button onClick={handleBack} className="flex items-center gap-2 group mr-6 text-left outline-none">
                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#2447d7] group-hover:border-[#2447d7] transition-all">
                        <i className="fa-solid fa-arrow-left text-[10px] text-slate-400 group-hover:text-white"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#2447d7]">Exit Process</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#2447d7]">
                        <i className="fa-solid fa-user-plus text-[14px]"></i>
                    </div>
                    <div>
                        <h1 className="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">Register New Lead</h1>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Secure Registry Protocol Active</p>
                    </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono font-black text-[#2447d7] tracking-widest uppercase">{caseId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lead Level</label>
                        <select
                            value={formData.leadLevel || 'Level 1'}
                            onChange={e => setFormData({ ...formData, leadLevel: e.target.value })}
                            className="h-8 px-3 bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-black text-[#2447d7] outline-none cursor-pointer"
                        >
                            <option value="Level 1">LEVEL 1</option>
                            <option value="Level 2">LEVEL 2</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Initial Priority</label>
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
                        <i className="fa-solid fa-check text-[9px]"></i> Terminate & Save
                    </button>
                </div>
            </header>

            {/* Registration Form Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#fcfcfd]">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* 1. Contact Information */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-8 flex items-center gap-3 border-b-2 border-indigo-600 pb-3 w-fit">
                            <i className="fa-solid fa-address-card"></i> 1. Legal Identity &amp; Contact
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Title *</label>
                                <select value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                    <option value="">Select...</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Prof">Prof</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Full Name *</label>
                                <input value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Jonathan Doe" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Date of Birth *</label>
                                <input type="date" value={formData.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Company Entity *</label>
                                <input value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Registered name..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">House Number *</label>
                                <input value={formData.companyHouseNumber || ''} onChange={e => setFormData({ ...formData, companyHouseNumber: e.target.value })} placeholder="e.g. 12345678" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Annual Turnover *</label>
                                <input value={formData.businessAnnualTurnover || ''} onChange={e => setFormData({ ...formData, businessAnnualTurnover: e.target.value })} placeholder="£0.00" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all font-mono shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Designation</label>
                                <input value={formData.jobTitle || ''} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="Managing Director" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Industry</label>
                                <select value={formData.industry || ''} onChange={e => setFormData({ ...formData, industry: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all cursor-pointer shadow-sm">
                                    <option value="">Select industry...</option>
                                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Email Address *</label>
                                <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="client@example.com" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Phone Number *</label>
                                <input type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+44 77..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all font-mono shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Preferred Method</label>
                                <div className="flex gap-2 h-11">
                                    {['Email', 'Phone', 'WhatsApp', 'Other'].map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, preferredMethod: m })}
                                            className={`flex-1 rounded-2xl text-xs font-black transition-all border ${formData.preferredMethod === m ? 'bg-indigo-600 text-white border-indigo-600 shadow-md translate-y-[-1px]' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Residential Ownership</label>
                                <select value={formData.homeOwner || 'Yes'} onChange={e => setFormData({ ...formData, homeOwner: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                    <option>Yes</option><option>No</option>
                                </select>
                            </div>
                            <div className="col-span-3 text-left">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Residential Address *</label>
                                <input value={formData.residentialAddress || ''} onChange={e => setFormData({ ...formData, residentialAddress: e.target.value })} placeholder="Full address (Street, City, Postcode)..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Loan Details */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-8 flex items-center gap-3 border-b-2 border-indigo-600 pb-3 w-fit">
                            <i className="fa-solid fa-sack-dollar"></i> 2. Financial Requirements
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Amount Needed *</label>
                                <input value={formData.loanAmount || ''} onChange={e => setFormData({ ...formData, loanAmount: e.target.value })} placeholder="£0.00" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all font-mono shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 text-left">Loan Purpose</label>
                                <input value={formData.loanPurpose || ''} onChange={e => setFormData({ ...formData, loanPurpose: e.target.value })} placeholder="Business expansion..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm" />
                            </div>
                            <div className="text-left">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Existing Indebtedness</label>
                                <select value={formData.existingLoan || 'No'} onChange={e => setFormData({ ...formData, existingLoan: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                    <option>No</option><option>Yes</option>
                                </select>
                            </div>
                            <div className="text-left">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Bank Institution</label>
                                <select value={formData.companyBank || ''} onChange={e => setFormData({ ...formData, companyBank: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                    <option value="">Select a bank...</option>
                                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="text-left">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Lead Source</label>
                                <select value={formData.leadSource || ''} onChange={e => setFormData({ ...formData, leadSource: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                    <option value="">Select source...</option>
                                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="text-left">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Credit Search Consent *</label>
                                <select value={formData.creditConsent || 'Yes'} onChange={e => setFormData({ ...formData, creditConsent: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                    <option>Yes</option><option>No</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Follow-up & Comments */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-8 flex items-center gap-3 border-b-2 border-amber-500 pb-3 w-fit">
                                <i className="fa-solid fa-calendar-plus text-amber-500"></i> 3. Initial Action Schedule
                            </h3>
                            <div className="space-y-6">
                                <div className="text-left">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Action Protocol</label>
                                    <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm">
                                        <option>Call</option><option>Meeting</option><option>Follow-up</option><option>Email</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black outline-none shadow-sm" />
                                    <input type="time" className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black outline-none shadow-sm" />
                                </div>
                                <textarea placeholder="Instructions for assigned specialist..." rows={2} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:bg-white resize-none shadow-sm"></textarea>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[.2em] mb-8 flex items-center gap-3 border-b-2 border-indigo-600 pb-3 w-fit">
                                <i className="fa-solid fa-comment-dots"></i> 4. Operational Context
                            </h3>
                            <textarea
                                value={formData.additionalComments || ''}
                                onChange={e => setFormData({ ...formData, additionalComments: e.target.value })}
                                placeholder="Enter persistent context/notes for this client record..."
                                className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:bg-white resize-none min-h-[160px] shadow-sm"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-4 pb-12">
                        <button onClick={handleBack} className="h-12 px-10 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] hover:bg-slate-200 transition-all">Discard Registry</button>
                        <button onClick={saveLead} className="h-12 px-12 bg-[#2447d7] text-white text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] hover:bg-black transition-all shadow-2xl shadow-indigo-200">Commit to Database</button>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
}
