import React, { useState } from 'react';

const LENDERS = [
    { id: 'bank_of_whiterock', name: 'Bank of Whiterock',  tier: 'Tier 1 • Trusted Partner',  match: 98, color: '#2447d7', bg: '#ebf0ff' },
    { id: 'global_finance',    name: 'Global Finance',     tier: 'Tier 1 • International',     match: 92, color: '#2447d7', bg: '#ebf0ff' },
    { id: 'secure_lenders',    name: 'Secure Lenders',     tier: 'Tier 2 • Private Equity',    match: 85, color: '#16a34a', bg: '#ecfdf5' },
    { id: 'apex_capital',      name: 'Apex Capital Group', tier: 'Tier 1 • High Net Worth',    match: 78, color: '#ea580c', bg: '#fff7ed' },
];

const LenderSelection = ({ lead }) => {
    const clientName = lead?.name || 'Jonathan Doe';
    const initials   = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const leadId     = lead?.id || 'WR-2026-0001';

    const [loanAmount,   setLoanAmount]   = useState(lead?.loanAmount ? lead.loanAmount.replace(/[$,]/g, '') : '500,000');
    const [interestRate, setInterestRate] = useState('3.5 - 5.0');
    const [tenure,       setTenure]       = useState('30 Years');
    const [repayment,    setRepayment]    = useState('Monthly Amortization');
    const [selected,     setSelected]     = useState(['bank_of_whiterock', 'global_finance']);

    const toggleLender = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lead {leadId} – Lender Selection</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Configure the final loan terms and distribute the lead to preferred financial institutions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border border-[#edf2f7] text-[#4a5568] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] transition-colors">Save Draft</button>
                    <button className="flex items-center gap-2 bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        Submit for Approval
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-[1fr_300px] gap-5 xl:grid-cols-1 animate-slideUp [animation-delay:200ms] [animation-fill-mode:both]">

                {/* Left column */}
                <div className="flex flex-col gap-5">

                    {/* Step 1: Loan Details */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#2447d7] text-white flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">1. Loan Details Form</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#a0aec0] bg-[#f1f5f9] px-2.5 py-1 rounded-lg uppercase tracking-widest">STEP 01/02</span>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-5 sm:grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Loan Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#2447d7]">$</span>
                                    <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-8 pr-4 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Interest Rate Range (%)</label>
                                <div className="relative">
                                    <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-4 pr-8 py-2.5 text-[14px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#2447d7]">%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Loan Tenure</label>
                                <div className="relative">
                                    <select value={tenure} onChange={e => setTenure(e.target.value)} className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#4a5568] outline-none appearance-none focus:border-[#2447d7] cursor-pointer">
                                        <option>10 Years</option><option>15 Years</option><option>20 Years</option><option>30 Years</option>
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Repayment Method</label>
                                <div className="relative">
                                    <select value={repayment} onChange={e => setRepayment(e.target.value)} className="w-full bg-[#f8fafc] border border-[#edf2f7] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#4a5568] outline-none appearance-none focus:border-[#2447d7] cursor-pointer">
                                        <option>Monthly Amortization</option><option>Interest Only</option><option>Balloon Payment</option>
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                        <div className="mx-6 mb-6 p-4 bg-[#f0f4ff] border border-[#d9e8ff] rounded-xl flex items-start gap-3">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p className="text-[12px] text-[#4a5568] leading-relaxed">These loan details will be sent as an inquiry to all selected lenders. Ensure the credit score of Lead {leadId} meets the minimum criteria for the chosen interest rate range.</p>
                        </div>
                    </section>

                    {/* Step 2: Lender Selection */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#f3e8ff] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </div>
                                <span className="text-[13px] font-semibold text-[#1a202c]">2. Lender Selection</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#a0aec0] bg-[#f1f5f9] px-2.5 py-1 rounded-lg uppercase tracking-widest">STEP 02/02</span>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                <p className="text-[12px] text-[#718096]">Select multiple banks or lenders to distribute this lead.</p>
                                <div className="flex gap-3">
                                    <button className="text-[12px] font-medium text-[#2447d7] hover:underline" onClick={() => setSelected(LENDERS.map(l => l.id))}>Select All</button>
                                    <button className="text-[12px] font-medium text-[#718096] hover:underline" onClick={() => setSelected([])}>Clear Selection</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
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
                        </div>
                    </section>
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-5">

                    {/* Lead Information */}
                    <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f7fafc]">
                            <span className="text-[13px] font-semibold text-[#1a202c]">Lead Information</span>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-xl bg-[#1a202c] text-white flex items-center justify-center font-bold text-[14px] shrink-0">{initials}</div>
                                <div>
                                    <div className="text-[14px] font-semibold text-[#1a202c]">{clientName}</div>
                                    <span className="text-[10px] font-semibold text-[#2447d7] bg-[#ebf0ff] px-2 py-0.5 rounded-md border border-[#d1e1ff] uppercase tracking-wider">Lead Applicant</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {[
                                    { label: 'Credit Score',   value: '745 (Excellent)', cls: 'text-[#059669] font-semibold' },
                                    { label: 'Annual Income',  value: '$125,000',         cls: 'text-[#1a202c] font-medium' },
                                    { label: 'Employment',     value: 'Full-time',        cls: 'text-[#1a202c] font-medium' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-[#f7fafc] last:border-0">
                                        <span className="text-[12px] text-[#718096]">{row.label}</span>
                                        <span className={`text-[12px] ${row.cls}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final Action */}
                    <section className="bg-[#1a202c] rounded-2xl p-5 text-white">
                        <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-0.5">FINAL ACTION</div>
                        <h3 className="text-[16px] font-bold mb-4">Lead Submission</h3>
                        <div className="flex flex-col gap-2.5 mb-5">
                            <div className="flex items-center gap-2.5 text-[12px] text-white/80">
                                <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                {selected.length} Lenders selected
                            </div>
                            <div className="flex items-center gap-2.5 text-[12px] text-white/80">
                                <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                Repayment method verified
                            </div>
                        </div>
                        <button className="w-full py-3 bg-[#2447d7] text-white rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-lg flex items-center justify-center gap-2 mb-3">
                            Submit for Approval
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        <p className="text-[10px] text-center text-white/40 leading-relaxed">By clicking submit, you confirm that the provided information is accurate and verified by the applicant.</p>
                    </section>
                </div>
            </div>

        </div>
    );
};

export default LenderSelection;
