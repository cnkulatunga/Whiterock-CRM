import React, { useState } from 'react';
import { QUALIFIED_LENDERS as LENDERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

const LenderSelection = ({ lead, onNavigate }) => {
    const { updateLead } = useLeads();
    const clientName = lead?.name || 'Jonathan Doe';
    const initials   = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const leadId     = lead?.id || 'AF-2026-0001';

    const clientDetails = {
        name: lead?.name || '',
        businessName: lead?.businessName || lead?.companyName || '',
        dob: lead?.dob || '',
        contactNumber: lead?.phone || '',
        email: lead?.email || '',
        residentialAddress: lead?.residentialAddress || '',
        timeAtAddress: lead?.timeAtCurrentAddress || '',
        previousAddress: lead?.previousAddress || '',
        homeowner: lead?.homeOwner || '',
        companyHouseNumber: lead?.nic || lead?.companyHouseNumber || '',
        businessTurnover: lead?.businessAnnualTurnover ? `£${lead.businessAnnualTurnover}` : '',
        jobTitle: lead?.jobTitle || ''
    };

    const documents = (lead?.documents || []).map(doc => ({
        name: doc.type || doc.fileName || 'Document',
        status: doc.status || 'Uploaded',
        date: doc.date || '',
        previewUrl: doc.previewUrl || null,
        fileName: doc.fileName || null,
    }));

    // Editable loan fields (pre-fill from lead)
    const [loanAmount, setLoanAmount] = useState(lead?.loanAmount || '');
    const [loanPurpose, setLoanPurpose] = useState(lead?.loanPurpose || '');
    const [overdraft, setOverdraft] = useState(lead?.overdraftFacility || '');
    const [businessOverview, setBusinessOverview] = useState('');

    // Existing Loans (pre-fill from lead)
    const [existingLenderName, setExistingLenderName] = useState(lead?.existingLoanLenderName || '');
    const [existingAmountTaken, setExistingAmountTaken] = useState(lead?.existingLoanAmount || '');
    const [existingInterestRate, setExistingInterestRate] = useState(lead?.existingLoanInterestRate || '');
    const [existingMonthlyRepayment, setExistingMonthlyRepayment] = useState(lead?.existingLoanMonthlyRepayment || '');
    const [existingTerm, setExistingTerm] = useState(lead?.existingLoanTerm || '');

    // Note & Lender Selection
    const [note, setNote] = useState('');
    const [selected, setSelected] = useState([]);
    const [previewDoc, setPreviewDoc] = useState(null);

    const toggleLender = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <div className="flex flex-col gap-5 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => onNavigate && onNavigate('lender_selector')}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748b] hover:text-[#2447d7] transition-colors w-fit group"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="transition-transform group-hover:-translate-x-0.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back to Loan Pipeline
                    </button>
                    <div>
                        <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lead {leadId} – Lender Selection</h1>
                        <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Configure the final loan terms and distribute the lead to preferred financial institutions.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-[1fr_360px] gap-5 xl:grid-cols-1 animate-slideUp [animation-delay:200ms] [animation-fill-mode:both]">

                {/* Left column */}
                <div className="flex flex-col gap-5 xl:contents">

                    {/* Section 1: Client Details (Read-only Table) */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden xl:order-1">
                        <div className="px-5 py-3 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#2447d7] text-white flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Client Details</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#10b981] bg-[#ecfdf5] px-2.5 py-1 rounded-lg uppercase tracking-widest border border-[#d1fae5]">FROM LEAD</span>
                        </div>
                        <div className="p-5">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody className="divide-y divide-[#f7fafc]">
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096] w-[200px]">Name</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.name}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Business Name</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.businessName}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Date of Birth</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.dob}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Contact Number</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.contactNumber}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Email Address</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#2447d7]">{clientDetails.email}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Residential Address</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.residentialAddress}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Time at Current Address</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.timeAtAddress}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Previous Address</td>
                                            <td className="py-2.5 text-[13px] font-medium text-[#1a202c]">{clientDetails.previousAddress}</td>
                                        </tr>
                                        <tr className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#718096]">Homeowner</td>
                                            <td className="py-2.5">
                                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${clientDetails.homeowner === 'YES' ? 'bg-[#ecfdf5] text-[#059669] border border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]'}`}>
                                                    {clientDetails.homeowner}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Loan Details */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden xl:order-3">
                        <div className="px-5 py-3 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#10b981] text-white flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Loan Details</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#a0aec0] bg-[#f1f5f9] px-2.5 py-1 rounded-lg uppercase tracking-widest">SECTION 02/03</span>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-4 sm:grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Amount Requested (K)</label>
                                <div className="relative">
                                    <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-4 pr-8 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} placeholder="Enter amount" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#2447d7]">K</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Loan Purpose</label>
                                <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" value={loanPurpose} onChange={e => setLoanPurpose(e.target.value)} placeholder="Enter loan purpose" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Overdraft (K)</label>
                                <div className="relative">
                                    <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-4 pr-8 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" value={overdraft} onChange={e => setOverdraft(e.target.value)} placeholder="Enter amount" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#2447d7]">K</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Business Overview</label>
                                <textarea className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all resize-none" rows="3" value={businessOverview} onChange={e => setBusinessOverview(e.target.value)} placeholder="Brief description of business activities"></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Step 5: Lender Selection & Note */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden xl:order-5">
                        <div className="px-5 py-3 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#f3e8ff] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Lender Selection & Note</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#a0aec0] bg-[#f1f5f9] px-2.5 py-1 rounded-lg uppercase tracking-widest">SECTION 03/03</span>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                                <p className="text-[12px] text-[#718096]">Select lenders to pitch this application to.</p>
                                <div className="flex gap-3">
                                    <button className="text-[12px] font-medium text-[#2447d7] hover:underline" onClick={() => setSelected(LENDERS.map(l => l.id))}>Select All</button>
                                    <button className="text-[12px] font-medium text-[#718096] hover:underline" onClick={() => setSelected([])}>Clear Selection</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 mb-4">
                                {LENDERS.map(lender => {
                                    const isSel = selected.includes(lender.id);
                                    return (
                                        <div
                                            key={lender.id}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSel ? 'border-[#2447d7] bg-[#f8faff] shadow-sm' : 'border-[#edf2f7] bg-white hover:border-[#cbd5e0]'}`}
                                            onClick={() => toggleLender(lender.id)}
                                        >
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isSel ? 'bg-[#2447d7] border-[#2447d7]' : 'border-[#cbd5e0]'}`}>
                                                {isSel && <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><polyline points="2 6 5 9 10 3"/></svg>}
                                            </div>
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSel ? 'bg-[#ebf0ff]' : 'bg-[#f1f5f9]'}`}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke={isSel ? '#2447d7' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-[13px] font-semibold text-[#1a202c] truncate">{lender.name}</span>
                                                <span className="text-[10px] text-[#a0aec0]">{lender.tier}</span>
                                            </div>
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0" style={{ color: lender.color, background: lender.bg }}>{lender.match}%<br/><span className="text-[9px] font-medium">Match</span></span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Note</label>
                                <textarea className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all resize-none" rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="Please mention the lender and term you wish to proceed with"></textarea>
                                <p className="text-[10px] text-[#a0aec0] mt-1">Please mention the lender and term you wish to proceed with.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-5 xl:contents">

                    {/* Documents Attached */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden xl:order-2">
                        <div className="px-5 py-3 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Documents</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded-lg uppercase tracking-widest border border-[#d1fae5]">FROM LEAD</span>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-col gap-2">
                                {documents.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8fafc] border border-[#edf2f7] hover:bg-[#f0f4ff] transition-colors group">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[11px] font-semibold text-[#1a202c] truncate">{doc.name}</div>
                                                <div className="text-[9px] text-[#a0aec0] mt-0.5">{doc.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <button 
                                                type="button"
                                                className="w-7 h-7 rounded-lg bg-white border border-[#edf2f7] text-[#2447d7] flex items-center justify-center hover:bg-[#2447d7] hover:text-white transition-all xl:opacity-100 opacity-0 group-hover:opacity-100"
                                                title="View Document"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setPreviewDoc(doc);
                                                }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            </button>
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#ecfdf5] text-[#059669] border border-[#d1fae5]">
                                                {doc.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Existing Loans (Read-only) */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden xl:order-4">
                        <div className="px-5 py-3 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] text-white flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">Existing Loans</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#8b5cf6] bg-[#f5f3ff] px-2.5 py-1 rounded-lg uppercase tracking-widest border border-[#ede9fe]">FROM LEAD</span>
                        </div>
                        <div className="p-5">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody className="divide-y divide-[#f7fafc]">
                                        {[
                                            { label: 'Lender Name', value: existingLenderName || '—' },
                                            { label: 'Amount Taken', value: existingAmountTaken ? `£${existingAmountTaken}` : '—' },
                                            { label: 'Interest Rate', value: existingInterestRate ? `${existingInterestRate}%` : '—' },
                                            { label: 'Monthly Repayment', value: existingMonthlyRepayment ? `£${existingMonthlyRepayment}` : '—' },
                                            { label: 'Term', value: existingTerm || '—' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                                                <td className="py-2.5 pr-4 text-[11px] font-semibold text-[#718096] whitespace-nowrap">{row.label}</td>
                                                <td className="py-2.5 text-[12px] font-medium text-[#1a202c] text-right">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Lead Information */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden xl:order-6">
                        <div className="px-6 py-4 border-b border-[#f7fafc]">
                            <span className="text-[13px] font-semibold text-[#1a202c]">Application Summary</span>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-xl bg-[#1a202c] text-white flex items-center justify-center font-bold text-[14px] shrink-0">{initials}</div>
                                <div>
                                    <div className="text-[14px] font-semibold text-[#1a202c]">{clientDetails.name || clientName}</div>
                                    <span className="text-[10px] font-semibold text-[#2447d7] bg-[#ebf0ff] px-2 py-0.5 rounded-md border border-[#d1e1ff] uppercase tracking-wider">Lead {leadId}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {[
                                    { label: 'Business Name', value: clientDetails.businessName || 'Not provided', cls: 'text-[#1a202c] font-medium' },
                                    { label: 'Loan Amount', value: loanAmount ? `${loanAmount}K` : 'Not set', cls: 'text-[#10b981] font-semibold' },
                                    { label: 'Loan Purpose', value: loanPurpose || 'Not set', cls: 'text-[#1a202c] font-medium' },
                                    { label: 'Lenders Selected', value: `${selected.length} selected`, cls: 'text-[#2447d7] font-semibold' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-start gap-3 py-3 border-b border-[#f7fafc] last:border-0">
                                        <span className="text-[12px] text-[#718096] shrink-0">{row.label}</span>
                                        <span className={`text-[12px] ${row.cls} text-right break-words`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final Action */}
                    <section className="bg-[#1a202c] rounded-2xl p-5 text-white xl:order-7">
                        <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-0.5">FINAL ACTION</div>
                        <h3 className="text-[16px] font-bold mb-4">Submit Application</h3>
                        <div className="flex flex-col gap-2.5 mb-5">
                            <div className="flex items-center gap-2.5 text-[12px] text-white/80">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${selected.length > 0 ? 'bg-[#10b981]' : 'bg-white/20'}`}>
                                    {selected.length > 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                {selected.length} Lender{selected.length !== 1 ? 's' : ''} selected
                            </div>
                            <div className="flex items-center gap-2.5 text-[12px] text-white/80">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${clientDetails.name && clientDetails.businessName ? 'bg-[#10b981]' : 'bg-white/20'}`}>
                                    {clientDetails.name && clientDetails.businessName && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                Client details {clientDetails.name && clientDetails.businessName ? 'completed' : 'pending'}
                            </div>
                            <div className="flex items-center gap-2.5 text-[12px] text-white/80">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${loanAmount && loanPurpose ? 'bg-[#10b981]' : 'bg-white/20'}`}>
                                    {loanAmount && loanPurpose && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                Loan details {loanAmount && loanPurpose ? 'completed' : 'pending'}
                            </div>
                        </div>
                        <button
                            className="w-full py-3 bg-[#2447d7] text-white rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-lg flex items-center justify-center gap-2 mb-3"
                            disabled={selected.length === 0}
                            onClick={() => {
                                if (lead?.id) {
                                    const selectedLenderNames = LENDERS.filter(l => selected.includes(l.id)).map(l => l.name);
                                    updateLead(lead.id, {
                                        stage: 'Lender Selection',
                                        status: 'Lender Selection',
                                        progress: 60,
                                        selectedLenders: selectedLenderNames,
                                        loanAmount: loanAmount,
                                        loanPurpose: loanPurpose,
                                    });
                                }
                                if (onNavigate) onNavigate('lender_selection_approved');
                            }}
                        >
                            Submit Application
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        <p className="text-[10px] text-center text-white/40 leading-relaxed">This will generate and send the application to selected lenders.</p>
                    </section>
                </div>
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setPreviewDoc(null)}>
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{previewDoc.name}</span>
                            </div>
                            <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[400px] p-8 relative overflow-hidden">
                            {previewDoc.previewUrl ? (
                                <img src={previewDoc.previewUrl} alt={previewDoc.name} className="max-w-full max-h-[400px] object-contain rounded-xl shadow-lg" />
                            ) : (
                                <div className="relative z-10 text-center space-y-4">
                                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#fff7ed] to-[#fed7aa] flex items-center justify-center shadow-lg">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-sm mx-auto space-y-2 text-left">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Document Name</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.name}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Status</span>
                                            <span className="text-xs font-bold text-[#10b981]">{previewDoc.status}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-400">Upload Date</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.date}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50/50 flex justify-center">
                            <button 
                                onClick={() => setPreviewDoc(null)}
                                className="px-10 py-2.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-95"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LenderSelection;
