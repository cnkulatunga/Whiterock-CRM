import React, { useState } from 'react';

const LENDERS = [
    { id: 'bank_of_whiterock', name: 'Bank of Whiterock', tier: 'Tier 1 • Trusted Partner', match: 98, matchClass: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]' },
    { id: 'global_finance', name: 'Global Finance', tier: 'Tier 1 • International', match: 92, matchClass: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]' },
    { id: 'secure_lenders', name: 'Secure Lenders', tier: 'Tier 2 • Private Equity', match: 85, matchClass: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]' },
    { id: 'apex_capital', name: 'Apex Capital Group', tier: 'Tier 1 • High Net Worth', match: 78, matchClass: 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]' },
];

const LenderSelection = ({ lead }) => {
    const clientName = lead?.name || 'Jonathan Doe';
    const initials = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const leadId = lead?.id || 'WR-2026-0001';

    const [loanAmount, setLoanAmount] = useState(
        lead?.loanAmount ? lead.loanAmount.replace(/[$,]/g, '') : '500,000'
    );
    const [interestRate, setInterestRate] = useState('3.5 - 5.0');
    const [tenure, setTenure] = useState('30 Years');
    const [repayment, setRepayment] = useState('Monthly Amortization');
    const [selected, setSelected] = useState(['bank_of_whiterock', 'global_finance']);

    const toggleLender = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAll = () => setSelected(LENDERS.map(l => l.id));
    const clearAll = () => setSelected([]);

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col sm:mb-2 text-[#1a202c]">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[1.75rem] font-black tracking-tight sm:text-2xl">Lead {leadId} Selection</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Configure terminal loan parameters and designate authorized financial institutions.</p>
                </div>
                <div className="flex items-center gap-3 sm:w-full">
                    <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#4a5568] px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wider hover:bg-[#f8fafc] transition-all active:scale-95 sm:flex-1 sm:justify-center">
                        Save Draft
                    </button>
                    <button className="flex items-center gap-2.5 bg-[#2447d7] text-white px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wider shadow-xl shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all active:scale-95 sm:flex-1 sm:justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                        Submit Final Approval
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-[1fr_380px] gap-8 lg:grid-cols-1">
                {/* Left column */}
                <div className="flex flex-col gap-8">
                    {/* Step 1: Loan Details */}
                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#2447d7] text-white flex items-center justify-center shadow-lg shadow-[#2447d7]/20">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <h2 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">01. Terminal Loan Parameters</h2>
                            </div>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest bg-[#f1f5f9] px-3 py-1 rounded-lg">PHASE 01/02</span>
                        </div>

                        <div className="p-10 grid grid-cols-2 gap-8 sm:grid-cols-1 sm:p-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] ml-1">Principal Valuation (USD)</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[14px] font-black text-[#2447d7] group-focus-within:scale-125 transition-transform">$</span>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl pl-10 pr-5 py-4 text-[15px] font-black text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" 
                                        value={loanAmount} 
                                        onChange={e => setLoanAmount(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] ml-1">Proposed Interest Yield (%)</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl pl-5 pr-10 py-4 text-[15px] font-black text-[#1a202c] outline-none focus:border-[#2447d7] transition-all" 
                                        value={interestRate} 
                                        onChange={e => setInterestRate(e.target.value)} 
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[14px] font-black text-[#2447d7] group-focus-within:scale-125 transition-transform">%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] ml-1">Maturity Horizon</label>
                                <div className="relative">
                                    <select 
                                        value={tenure} 
                                        onChange={e => setTenure(e.target.value)} 
                                        className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl px-5 py-4 text-[15px] font-black text-[#4a5568] outline-none appearance-none focus:border-[#2447d7] cursor-pointer"
                                    >
                                        <option>10 Years</option>
                                        <option>15 Years</option>
                                        <option>20 Years</option>
                                        <option>30 Years</option>
                                    </select>
                                    <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] ml-1">Amortization Structure</label>
                                <div className="relative">
                                    <select 
                                        value={repayment} 
                                        onChange={e => setRepayment(e.target.value)} 
                                        className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl px-5 py-4 text-[15px] font-black text-[#4a5568] outline-none appearance-none focus:border-[#2447d7] cursor-pointer"
                                    >
                                        <option>Monthly Amortization</option>
                                        <option>Interest Only</option>
                                        <option>Balloon Payment</option>
                                    </select>
                                    <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>

                        <div className="m-8 mt-0 p-6 bg-[#f0f4ff] border border-[#d9e8ff] rounded-[2rem] flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="3" width="14" height="14">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <p className="text-[12px] font-bold text-[#4a5568] leading-relaxed">
                                <strong className="text-[#2447d7] font-black uppercase tracking-wider mr-1">Compliance Alert:</strong> 
                                These terminal loan parameters will be dispatched as a formal inquiry to all authorized financial institutions. Verify technical eligibility of <strong className="text-[#1a202c]">Lead {leadId}</strong> against selected tier metrics.
                            </p>
                        </div>
                    </section>

                    {/* Step 2: Lender Selection */}
                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="p-8 px-10 flex justify-between items-center border-b border-[#f7fafc] bg-[#fcfdff]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center shadow-lg shadow-[#7c3aed]/20">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </div>
                                <h2 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em]">02. Financial Institution Authorization</h2>
                            </div>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest bg-[#f1f5f9] px-3 py-1 rounded-lg">PHASE 02/02</span>
                        </div>

                        <div className="p-10 flex flex-col gap-8 sm:p-6">
                            <div className="flex justify-between items-center sm:flex-col sm:items-start sm:gap-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[15px] font-black text-[#1a202c] tracking-tight">Institutional Distribution Matrix</h3>
                                    <p className="text-[12px] text-[#718096] font-medium">Designate one or more premium lenders for lead propagation.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="text-[11px] font-black text-[#2447d7] uppercase tracking-widest hover:underline px-4 py-2 bg-[#f0f4ff] rounded-xl transition-all" onClick={selectAll}>Authorize All</button>
                                    <button className="text-[11px] font-black text-[#f97316] uppercase tracking-widest hover:underline px-4 py-2 bg-[#fff7ed] rounded-xl transition-all" onClick={clearAll}>Revoke Selection</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-1">
                                {LENDERS.map((lender) => {
                                    const isSelected = selected.includes(lender.id);
                                    return (
                                        <div
                                            key={lender.id}
                                            className={`relative overflow-hidden group p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer flex items-center gap-6 ${isSelected ? 'bg-[#fcfdff] border-[#2447d7] shadow-lg translate-y-[-2px]' : 'bg-white border-[#f1f5f9] hover:border-[#cbd5e0]'}`}
                                            onClick={() => toggleLender(lender.id)}
                                        >
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#2447d7] border-[#2447d7] scale-110 shadow-md' : 'border-[#cbd5e0] group-hover:border-[#2447d7]'}`}>
                                                {isSelected && (
                                                    <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="3"
                                                        strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                                        <polyline points="2 6 5 9 10 3" />
                                                    </svg>
                                                )}
                                            </div>
                                            
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-[#ebf0ff] text-[#2447d7]' : 'bg-[#f1f5f9] text-[#64748b] group-hover:bg-[#ebf0ff] group-hover:text-[#2447d7]'}`}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                    strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                            </div>

                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="text-[15px] font-black text-[#1a202c] tracking-tight truncate group-hover:text-[#2447d7] transition-colors">{lender.name}</span>
                                                <span className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider truncate">{lender.tier}</span>
                                            </div>

                                            <div className={`absolute -right-4 top-1/2 -translate-y-1/2 rotate-12 flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 border-white shadow-xl transition-all duration-500 overflow-hidden ${lender.matchClass} ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-10 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                                                <div className="absolute inset-0 bg-white/10 group-hover:animate-pulse"></div>
                                                <span className="text-[16px] font-black tracking-tighter relative z-10">{lender.match}%</span>
                                                <span className="text-[8px] font-black uppercase relative z-10">Match</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-8">
                    {/* Lead Information */}
                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="p-8 border-b border-[#f7fafc] bg-[#fcfdff]">
                            <h3 className="text-[11px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Applicant Dossier</h3>
                        </div>
                        <div className="p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[1.75rem] bg-[#1a202c] text-white flex items-center justify-center font-black text-xl shadow-xl shadow-black/10 ring-4 ring-[#f1f5f9]">{initials}</div>
                                <div className="flex flex-col gap-1">
                                    <div className="text-[18px] font-black text-[#1a202c] tracking-tight">{clientName}</div>
                                    <span className="text-[11px] font-black px-2.5 py-1 bg-[#ebf0ff] text-[#2447d7] rounded-lg border border-[#d1e1ff] uppercase tracking-widest w-fit">Primary Beneficiary</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'Risk Rating', value: '745 (Excellent)', valueClass: 'text-[#059669]' },
                                    { label: 'Fiscal Velocity', value: '$125,000 / ANNUM', valueClass: 'text-[#1a202c]' },
                                    { label: 'Contract Basis', value: 'FULL-TIME PERMANENT', valueClass: 'text-[#1a202c]' }
                                ].map((row, i) => (
                                    <div className="flex justify-between items-center p-5 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9] hover:bg-white hover:border-[#2447d7]/20 transition-all group" key={i}>
                                        <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest">{row.label}</span>
                                        <span className={`text-[12px] font-black uppercase tracking-tight ${row.valueClass}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final Action */}
                    <section className="bg-gradient-to-br from-[#1a202c] to-[#2d3748] rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Final Governance</span>
                                <h3 className="text-[20px] font-black tracking-tight">Institutional Submission</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[13px] font-bold text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    {selected.length} Institutions Authorized
                                </div>
                                <div className="flex items-center gap-4 text-[13px] font-bold text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    Maturity Structure Verified
                                </div>
                            </div>

                            <button className="w-full py-5 bg-[#2447d7] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2447d7]/40 hover:bg-[#1732a3] hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-3">
                                Execute Submission
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </button>
                            
                            <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-widest leading-relaxed px-4">
                                By executing, you confirm all terminal data is legally verified and audit-ready.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default LenderSelection;
