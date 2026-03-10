import React from 'react';

const LoanStatus = () => {
    const milestones = [
        {
            amount: '$450,000',
            date: 'Oct 24, 2023',
            referenceId: 'LN-99281',
            status: 'Approved',
            action: 'APPLICATION CLOSED'
        },
        {
            amount: '$540,000',
            date: 'Oct 20, 2023',
            referenceId: 'LN-88273',
            status: 'In Review',
            action: 'Edit Details'
        },
        {
            amount: '$10,000',
            date: 'Oct 15, 2023',
            referenceId: 'LN-77210',
            status: 'Rejected',
            action: 'Rejected: Re-upload Required',
            note: 'Image blurry, please re-upload clear proof of income.'
        }
    ];

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="mb-10">
                <h1 className="text-[1.75rem] font-bold text-[#1a202c] mb-2 sm:text-2xl tracking-tight">Loan Status</h1>
                <p className="text-[0.95rem] text-[#718096] leading-relaxed max-w-3xl">Monitor your loan application progress and track the verification status of your documents in real-time.</p>
            </header>

            <div className="grid grid-cols-3 gap-6 mb-12 lg:grid-cols-2 md:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg hover:border-[#2447d7]/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#ebf0ff] text-[#2447d7] rounded-xl flex items-center justify-center group-hover:bg-[#2447d7] group-hover:text-white transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">LOAN AMOUNT</span>
                    </div>
                    <div className="text-2xl font-extrabold text-[#1a202c] tracking-tight">$350,000</div>
                </div>

                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg hover:border-[#2447d7]/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#fff7ed] text-[#ea580c] rounded-xl flex items-center justify-center group-hover:bg-[#ea580c] group-hover:text-white transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">INTEREST RATE</span>
                    </div>
                    <div className="text-2xl font-extrabold text-[#1a202c] tracking-tight">4.25% APR</div>
                </div>

                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg hover:border-[#2447d7]/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#f0fdf4] text-[#16a34a] rounded-xl flex items-center justify-center group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">TERM DURATION</span>
                    </div>
                    <div className="text-2xl font-extrabold text-[#1a202c] tracking-tight">30 Years</div>
                </div>
            </div>

            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 px-8 border-b border-[#f7fafc] flex justify-between items-center sm:flex-col sm:items-stretch sm:gap-4 md:px-6">
                    <h2 className="text-base font-bold text-[#1a202c]">Application Milestones</h2>
                    <div className="relative group max-w-xs sm:max-w-none">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search milestones..." className="w-full bg-[#f8fafc] border border-[#e2e8f0] p-[10px_16px_10px_40px] rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#f7fafc]">
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">AMOUNT</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">DATE</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">REFERENCE ID</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">STATUS</th>
                                <th className="p-5 px-8 text-right text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">ACTION / NOTE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {milestones.map((m, i) => (
                                <tr key={i} className="hover:bg-[#f8fafc]/50 transition-colors">
                                    <td className="p-5 px-8 text-[15px] font-bold text-[#1a202c]">{m.amount}</td>
                                    <td className="p-5 px-8 text-[13px] font-semibold text-[#718096]">{m.date}</td>
                                    <td className="p-5 px-8">
                                        <span className="text-[12px] font-black text-[#4a5568] bg-[#f1f5f9] px-2.5 py-1 rounded-lg border border-[#e2e8f0] font-mono">
                                            {m.referenceId}
                                        </span>
                                    </td>
                                    <td className="p-5 px-8">
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border leading-none inline-block ${
                                            m.status === 'Approved' ? 'bg-[#ecfdf5] text-[#067647] border-[#d1fae5]' :
                                            m.status === 'In Review' ? 'bg-[#f0f9ff] text-[#0369a1] border-[#e0f2fe]' :
                                            'bg-[#fef2f2] text-[#991b1b] border-[#fee2e2]'
                                        }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="p-5 px-8 text-right">
                                        <div className="inline-flex flex-col items-end gap-1.5 max-w-[200px] ml-auto">
                                            {m.status === 'Rejected' ? (
                                                <>
                                                    <span className="text-[#e53e3e] text-[12px] font-bold flex items-center justify-end gap-1.5">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                                        </svg>
                                                        {m.action}
                                                    </span>
                                                    <p className="text-[11px] text-[#94a3b8] font-medium leading-tight">{m.note}</p>
                                                </>
                                            ) : (
                                                <button className={`text-[12px] font-bold hover:underline transition-all ${
                                                    m.action === 'APPLICATION CLOSED' ? 'text-[#a0aec0] cursor-not-allowed' : 'text-[#2447d7]'
                                                }`}>
                                                    {m.action}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 px-8 border-t border-[#f7fafc] flex items-center justify-between sm:flex-col sm:gap-5">
                    <span className="text-[13px] font-semibold text-[#a0aec0]">Showing <span className="text-[#4a5568]">1-3</span> of <span className="text-[#4a5568]">8</span> milestones</span>
                    <div className="flex gap-2">
                        <button className="bg-white border border-[#e2e8f0] text-[#cbd5e0] p-[8px_20px] rounded-xl text-sm font-bold cursor-not-allowed transition-all" disabled>Previous</button>
                        <button className="bg-[#2447d7] text-white p-[8px_20px] rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(36,71,215,0.2)] hover:bg-[#1732a3] hover:translate-y-[-1px] transition-all duration-200">Next</button>
                    </div>
                </div>
            </section>

            <section className="mt-10 bg-gradient-to-r from-[#2447d7] to-[#4c6ef5] rounded-3xl p-8 relative overflow-hidden flex items-center gap-8 lg:flex-col lg:items-start lg:gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full -mb-16"></div>
                
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-xl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="10" r="2" />
                    </svg>
                </div>
                <div className="flex flex-col gap-1 mr-auto relative z-10 lg:mr-0">
                    <h3 className="text-xl font-bold text-white tracking-tight">Need help with your loan application?</h3>
                    <p className="text-white/80 text-[15px] font-medium leading-relaxed max-w-2xl">If you encounter any issues with document uploads or have questions about the verification process, our loan officers are available 24/7.</p>
                </div>
                <a
                    href="https://wa.me/15550928834"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#2447d7] p-[14px_32px] rounded-xl text-sm font-extrabold shadow-2xl hover:bg-[#f8fafc] hover:scale-105 active:scale-95 transition-all duration-300 relative z-10 no-underline"
                >
                    Contact Support
                </a>
            </section>
        </div>
    );
};

export default LoanStatus;
