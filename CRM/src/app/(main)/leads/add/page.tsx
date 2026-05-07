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

const inputCls = 'w-full bg-[#fdfdfd] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[10px] font-semibold text-[#1e293b] outline-none transition-all focus:border-[#2447d7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(36,71,215,0.05)] font-[Inter,sans-serif]';
const labelCls = 'text-[9px] font-bold text-[#475569] mb-1 block';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#f1f5f9] p-[18px_22px] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <h3 className="text-[9px] font-black text-[#1e293b] uppercase tracking-[.12em] mb-3 pb-2 border-b-2 border-[#f1f5f9] flex items-center gap-1.5">
        <i className={`fa-solid ${icon} text-[#2447d7]`}></i> {title}
      </h3>
      {children}
    </div>
  );
}

export default function RegisterLeadPage() {
    const router = useRouter();
    const { toasts, remove, toast } = useToast();
    const [caseId, setCaseId] = useState('');
    const [existingLoan, setExistingLoan] = useState('No');
    const [formData, setFormData] = useState<any>({
        quality: 'warm',
        preferredMethod: 'Email',
        homeOwner: 'Yes',
        creditConsent: 'Yes'
    });

  useEffect(() => { setCaseId('AF-CASE-' + Math.floor(1000 + Math.random() * 9000)); }, []);

  const saveLead = async () => {
    if (!fd.fullName) { alert('Full Name is required'); return; }
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: caseId, name: fd.fullName, company: fd.companyName || 'Private Individual',
          email: fd.emailAddress, phone: fd.phoneNumber, amount: fd.loanAmount || '£0',
          status: 'New', quality: fd.quality?.toLowerCase() || 'warm', type: fd.loanPurpose || '',
          leadLevel: fd.leadLevel, ...fd,
        }),
      });
      if (res.ok) { alert('Lead saved successfully.'); router.push('/leads'); }
      else throw new Error();
    } catch { alert('Failed to save lead'); }
  };

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
                            <i className="fa-solid fa-address-card"></i> 1. Legal Identity & Contact
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

        <div className="flex-1"></div>

        {/* Case ID */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          <span className="text-[9px] font-black text-[#2447d7] font-mono tracking-[.04em]">{caseId}</span>
        </div>

        {/* Lead Level */}
        <div className="flex items-center gap-1.5">
          <label className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-tight">Level</label>
          <select value={fd.leadLevel} onChange={e => set('leadLevel', e.target.value)}
            className="h-7 px-2 text-[9px] font-bold border border-[#e2e8f0] rounded-lg bg-[#f8fafc] outline-none text-[#1e293b] cursor-pointer">
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <label className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-tight">Status</label>
          <select value={fd.quality} onChange={e => set('quality', e.target.value)}
            className="h-7 px-2 text-[9px] font-bold border border-[#e2e8f0] rounded-lg bg-[#f8fafc] outline-none text-[#1e293b] cursor-pointer">
            <option value="Warm">Warm</option>
            <option value="Hot">Hot</option>
            <option value="Cool">Cool</option>
          </select>
        </div>

        <button onClick={saveLead}
          className="h-[34px] px-5 bg-[#2447d7] text-white border-none rounded-[10px] text-[9px] font-black uppercase tracking-[.06em] cursor-pointer flex items-center gap-1.5 hover:bg-[#1a38b1] transition-all">
          <i className="fa-solid fa-check text-[8px]"></i> Save Lead
        </button>
      </header>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 1. Contact Information */}
        <SectionCard icon="fa-address-card" title="Contact Information">
          <div className="grid gap-x-6 gap-y-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <Field label="Title" required><input value={fd.title||''} onChange={e=>set('title',e.target.value)} placeholder="e.g. Mr, Mrs, Dr..." className={inputCls}/></Field>
            <Field label="Full Name" required><input value={fd.fullName||''} onChange={e=>set('fullName',e.target.value)} placeholder="e.g. Jonathan Doe" className={inputCls}/></Field>
            <Field label="Date of Birth" required><input type="date" value={fd.dob||''} onChange={e=>set('dob',e.target.value)} className={inputCls}/></Field>
            <Field label="Company / Organization Name" required><input value={fd.companyName||''} onChange={e=>set('companyName',e.target.value)} placeholder="Registered name..." className={inputCls}/></Field>
            <Field label="Company House Number" required><input value={fd.companyHouseNumber||''} onChange={e=>set('companyHouseNumber',e.target.value)} placeholder="e.g. 12345678" className={inputCls}/></Field>
            <Field label="Business Annual Turnover" required><input value={fd.businessAnnualTurnover||''} onChange={e=>set('businessAnnualTurnover',e.target.value)} placeholder="£0.00" className={inputCls}/></Field>
            <Field label="Job Title / Position"><input value={fd.jobTitle||''} onChange={e=>set('jobTitle',e.target.value)} placeholder="Managing Director" className={inputCls}/></Field>
            <Field label="Industry">
              <select value={fd.industry||''} onChange={e=>set('industry',e.target.value)} className={inputCls}>
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Email Address" required><input type="email" value={fd.emailAddress||''} onChange={e=>set('emailAddress',e.target.value)} placeholder="client@example.com" className={inputCls}/></Field>
            <Field label="Phone Number" required><input type="tel" value={fd.phoneNumber||''} onChange={e=>set('phoneNumber',e.target.value)} placeholder="+44 77..." className={inputCls}/></Field>
            <Field label="Preferred Method">
              <div className="flex gap-2">
                {['Email','Phone','WhatsApp','Other'].map(m=>(
                  <button key={m} type="button" onClick={()=>set('preferredMethod',m)}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-semibold border transition-all cursor-pointer ${fd.preferredMethod===m?'border-[#2447d7] bg-[#ebf0ff] text-[#2447d7]':'border-[#e2e8f0] bg-white text-[#64748b] hover:bg-slate-50'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Home Owner" required>
              <select value={fd.homeOwner} onChange={e=>set('homeOwner',e.target.value)} className={inputCls}>
                <option>Yes</option><option>No</option>
              </select>
            </Field>
            <Field label="Time at Current Address"><input value={fd.timeAtCurrentAddress||''} onChange={e=>set('timeAtCurrentAddress',e.target.value)} placeholder="e.g. 3 years" className={inputCls}/></Field>
            <div className="col-span-3">
              <Field label="Residential Address" required><input value={fd.residentialAddress||''} onChange={e=>set('residentialAddress',e.target.value)} placeholder="Full address..." className={inputCls}/></Field>
            </div>
            <div className="col-span-3">
              <Field label="Previous Address"><input value={fd.previousAddress||''} onChange={e=>set('previousAddress',e.target.value)} placeholder="Previous if < 3 years..." className={inputCls}/></Field>
            </div>
          </div>
        </SectionCard>

        {/* 2. Loan Details */}
        <SectionCard icon="fa-sack-dollar" title="Loan Details">
          <div className="grid gap-x-6 gap-y-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <Field label="Amount Needed" required><input value={fd.loanAmount||''} onChange={e=>set('loanAmount',e.target.value)} placeholder="£0.00" className={inputCls}/></Field>
            <Field label="Loan Purpose"><input value={fd.loanPurpose||''} onChange={e=>set('loanPurpose',e.target.value)} placeholder="Business expansion..." className={inputCls}/></Field>
            <Field label="Existing Loan">
              <select value={fd.existingLoan} onChange={e=>set('existingLoan',e.target.value)} className={inputCls}>
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </Field>

            {/* Conditional existing loan section */}
            {fd.existingLoan === 'Yes' && (
              <div className="col-span-3 bg-[#f8fafc] p-5 rounded-[16px] border border-[#e2e8f0]">
                <p className="text-[10px] font-black text-[#2447d7] uppercase tracking-[.08em] mb-3">Existing Indebtedness</p>
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                  <input value={fd.existingLender||''} onChange={e=>set('existingLender',e.target.value)} placeholder="Lender Name" className={inputCls+' bg-white'}/>
                  <input value={fd.existingAmount||''} onChange={e=>set('existingAmount',e.target.value)} placeholder="Amount Taken (£)" className={inputCls+' bg-white'}/>
                  <input value={fd.existingRate||''} onChange={e=>set('existingRate',e.target.value)} placeholder="Interest Rate (%)" className={inputCls+' bg-white'}/>
                  <input value={fd.existingRepayment||''} onChange={e=>set('existingRepayment',e.target.value)} placeholder="Monthly Repayment (£)" className={inputCls+' bg-white'}/>
                  <div className="col-span-2">
                    <input value={fd.existingTerm||''} onChange={e=>set('existingTerm',e.target.value)} placeholder="Loan Term" className={inputCls+' bg-white'}/>
                  </div>
                </div>
              </div>
            )}

            <Field label="Overdraft Facility">
              <select value={fd.overdraftFacility||'No'} onChange={e=>set('overdraftFacility',e.target.value)} className={inputCls}>
                <option>No</option><option>Yes</option>
              </select>
            </Field>
            <Field label="Which Bank is your Company with">
              <select value={fd.companyBank||''} onChange={e=>set('companyBank',e.target.value)} className={inputCls}>
                <option value="">Select a bank...</option>
                {BANKS.map(b=><option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Lead Source">
              <select value={fd.leadSource||''} onChange={e=>set('leadSource',e.target.value)} className={inputCls}>
                <option value="">Select source...</option>
                {SOURCES.map(s=><option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="How soon do you need this funding?"><input value={fd.fundingTimeline||''} onChange={e=>set('fundingTimeline',e.target.value)} placeholder="e.g. Within 2 weeks" className={inputCls}/></Field>
            <Field label="Have you taken any loans before from Alpha Funding?" required>
              <select value={fd.previousAlphaFundingLoan||'No'} onChange={e=>set('previousAlphaFundingLoan',e.target.value)} className={inputCls}>
                <option>No</option><option>Yes</option>
              </select>
            </Field>
            <Field label="Credit Search Consent" required>
              <p className="text-[7px] text-gray-500 italic mb-1">Does the client consent to a credit search being carried out?</p>
              <select value={fd.creditConsent} onChange={e=>set('creditConsent',e.target.value)} className={inputCls}>
                <option>Yes</option><option>No</option>
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* 3. Docs & Comments */}
        <div className="bg-white rounded-[20px] border border-[#f1f5f9] p-[18px_22px] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="grid gap-x-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <div>
              <h3 className="text-[9px] font-black text-[#1e293b] uppercase tracking-[.12em] mb-2 pb-1.5 border-b-2 border-[#f1f5f9] flex items-center gap-1.5">
                <i className="fa-solid fa-paperclip text-[#2447d7]"></i> Supporting Documents
              </h3>
              <DocUpload />
            </div>
            <div>
              <h3 className="text-[9px] font-black text-[#1e293b] uppercase tracking-[.12em] mb-2 pb-1.5 border-b-2 border-[#f1f5f9] flex items-center gap-1.5">
                <i className="fa-solid fa-comment-dots text-[#2447d7]"></i> Additional Comments
              </h3>
              <textarea value={fd.additionalComments||''} onChange={e=>set('additionalComments',e.target.value)}
                rows={4} placeholder="Enter context/notes..."
                className={inputCls+' resize-none'} style={{ height: 100 }}/>
            </div>
          </div>
        </div>

        {/* 4. Schedule Follow-up */}
        <div className="bg-[#f0f4ff] rounded-[20px] border border-[#dbeafe] p-[18px_22px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dbeafe]">
            <h4 className="text-[10px] font-black text-[#2447d7] uppercase tracking-[.1em] m-0 flex items-center gap-1.5">
              <i className="fa-solid fa-calendar-plus"></i> Schedule Follow-up
            </h4>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
          <div className="grid gap-x-6 gap-y-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="col-span-2">
              <Field label="Task Description"><input placeholder="Title..." className={inputCls+' bg-white'}/></Field>
            </div>
            <Field label="Assignee">
              <select className={inputCls+' bg-white'}><option>Thanushika</option><option>Admin</option></select>
            </Field>
            <Field label="Client"><input placeholder="Client Name" className={inputCls+' bg-white'}/></Field>
            <Field label="Phone"><input type="tel" placeholder="077..." className={inputCls+' bg-white'}/></Field>
            <Field label="Task Type">
              <select className={inputCls+' bg-white'}><option>Call</option><option>Meeting</option><option>Follow-up</option><option>Email</option><option>Document</option></select>
            </Field>
            <Field label="Task Status">
              <select className={inputCls+' bg-white'}><option>Warm</option><option>Hot</option><option>Cold</option></select>
            </Field>
            <div className="col-span-2">
              <Field label="Email Address"><input type="email" placeholder="mail@lead.com" className={inputCls+' bg-white'}/></Field>
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><Field label="Date"><input type="date" className={inputCls+' bg-white'}/></Field></div>
              <div className="flex-1"><Field label="Time"><input type="time" className={inputCls+' bg-white'}/></Field></div>
            </div>
            <div className="col-span-2">
              <Field label="Notes / Instructions"><textarea rows={1} placeholder="..." className={inputCls+' bg-white resize-none'}/></Field>
            </div>
            <div className="flex items-end">
              <button type="button" className="w-full py-2 bg-[#2447d7] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#1a38b1] transition-all border-none cursor-pointer">
                Create Task
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pb-8">
          <button onClick={() => router.push('/leads')}
            className="h-10 px-8 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all border-none cursor-pointer">
            Discard
          </button>
          <button onClick={saveLead}
            className="h-10 px-10 bg-[#2447d7] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1a38b1] transition-all border-none cursor-pointer flex items-center gap-2">
            <i className="fa-solid fa-check text-[8px]"></i> Save Lead
          </button>
        </div>
      </div>
    </div>
  );
}

function DocUpload() {
  const [docs, setDocs] = useState<{ name: string }[]>([]);
  const add = (files: FileList | null) => {
    if (!files) return;
    setDocs(p => [...p, ...Array.from(files).map(f => ({ name: f.name }))]);
  };
  return (
    <>
      <div
        onClick={() => document.getElementById('reg-doc-input')?.click()}
        onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor='#2447d7'; (e.currentTarget as HTMLElement).style.background='#ebf0ff'; }}
        onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.background='#f8fafc'; }}
        style={{ padding:14, border:'2px dashed #e2e8f0', borderRadius:12, background:'#f8fafc', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
      >
        <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize:18, color:'#cbd5e1', marginBottom:4, display:'block' }}></i>
        <p style={{ fontSize:8, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', margin:0 }}>Drop Docs / Click to Upload</p>
        <input id="reg-doc-input" type="file" multiple className="hidden" onChange={e => add(e.target.files)} />
      </div>
      <div className="mt-2 space-y-1">
        {docs.map((d, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-white border border-[#f1f5f9] rounded-lg shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <i className="fa-solid fa-file-pdf text-[10px] text-red-500"></i>
              <span className="text-[9px] font-bold text-gray-700 truncate">{d.name}</span>
            </div>
            <button onClick={() => setDocs(p => p.filter((_,j)=>j!==i))} className="text-gray-300 hover:text-red-500 transition-colors border-none bg-none cursor-pointer">
              <i className="fa-solid fa-xmark text-[9px]"></i>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
