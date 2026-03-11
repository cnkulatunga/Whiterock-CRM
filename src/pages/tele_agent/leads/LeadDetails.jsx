const LeadDetails = ({ leadId = 'WR-2026-0001', onBack }) => {
    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">
            {/* ── HEADER ── */}
            <div className="flex justify-between items-center mb-2 md:flex-col md:items-start md:gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20" className="text-gray-600"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-xl">Lead: {leadId}</h1>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-[#718096] flex-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Created on Oct 24, 2023 • Assigned to <strong className="text-[#1a202c]">Sarah Jenkins</strong>
                    </p>
                </div>
            </div>

            {/* ── PROGRESS TRACKER ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] p-8 px-12 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-x-auto md:p-6 md:px-4 md:mx-[-12px] md:rounded-none">
                <div className="flex items-start justify-between min-w-[750px]">
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="14" height="14">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-bold text-[#10b981] text-center uppercase tracking-tight max-w-[100px]">Document Collected</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#10b981] mt-[15px] min-w-[20px]"></div>
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-[#2447d7] rounded-full border-[4px] border-[#ebf0ff]"></div>
                        <span className="text-[11px] font-bold text-[#2447d7] text-center uppercase tracking-tight max-w-[100px]">Document Verification Done</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#edf2f7] mt-[15px] min-w-[20px]"></div>
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-3.5 h-3.5 bg-[#edf2f7] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#edf2f7] mt-[9px]"></div>
                        <span className="text-[11px] font-bold text-[#a0aec0] text-center uppercase tracking-tight max-w-[100px]">Lender Selection</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#edf2f7] mt-[15px] min-w-[20px]"></div>
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-3.5 h-3.5 bg-[#edf2f7] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#edf2f7] mt-[9px]"></div>
                        <span className="text-[11px] font-bold text-[#a0aec0] text-center uppercase tracking-tight max-w-[100px]">Loan Confirmed</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#edf2f7] mt-[15px] min-w-[20px]"></div>
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-3.5 h-3.5 bg-[#edf2f7] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#edf2f7] mt-[9px]"></div>
                        <span className="text-[11px] font-bold text-[#a0aec0] text-center uppercase tracking-tight max-w-[100px]">Loan Rejected</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-6 lg:grid-cols-1">
                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col gap-6">
                    {/* Lead Details Info */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3 p-5 border-b border-[#f7fafc]">
                            <span className="w-8 h-8 bg-[#ebf0ff] text-[#2447d7] rounded-lg flex items-center justify-center flex-shrink-0"><IconInfo /></span>
                            <h3 className="text-base font-bold text-[#1a202c]">Lead Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">LEAD ID</label>
                                    <div className="flex items-center gap-2.5 bg-[#f8fafc] border border-[#edf2f7] p-[10px_16px] rounded-xl text-sm font-semibold text-[#4a5568] w-fit">
                                        <IconInfo />
                                        <span>{leadId}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">CUSTOMER NAME</label>
                                    <div className="text-2xl font-bold text-[#1a202c] tracking-tight sm:text-lg">Robert C. Mayfield</div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">EMAIL ADDRESS</label>
                                    <div className="flex items-center gap-2.5 p-[10px_12px] bg-white border border-[#edf2f7] rounded-xl cursor-pointer hover:border-[#2447d7] hover:bg-[#f0f4ff] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(36,71,215,0.08)] transition-all">
                                        <div className="w-7 h-7 bg-[#ebf0ff] text-[#2447d7] rounded-lg flex items-center justify-center shrink-0"><IconEmail /></div>
                                        <span className="text-[13px] font-semibold text-[#4a5568] break-all leading-tight">r.mayfield@example.com</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">PHONE NUMBER</label>
                                    <div className="flex items-center gap-2.5 p-[10px_12px] bg-white border border-[#edf2f7] rounded-xl cursor-pointer hover:border-[#2447d7] hover:bg-[#ecfdf5] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)] transition-all">
                                        <div className="w-7 h-7 bg-[#ecfdf5] text-[#10b981] rounded-lg flex items-center justify-center shrink-0"><IconPhone /></div>
                                        <span className="text-[13px] font-semibold text-[#4a5568] leading-tight">(555) 012-3456</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center p-5 border-b border-[#f7fafc] gap-3 sm:flex-col sm:items-start">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#f3e8ff] text-[#7c3aed] rounded-lg flex items-center justify-center flex-shrink-0"><IconDocs /></span>
                                <h3 className="text-base font-bold text-[#1a202c]">Documents & Verification</h3>
                            </div>
                            <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-tight sm:ml-11">1 / 1 COMPLETED</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#fbfeff]">
                                        <th className="text-left p-[12px_24px] text-[11px] font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider">DOCUMENT</th>
                                        <th className="text-left p-[12px_24px] text-[11px] font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider">VERIFICATION STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-[#fcfdfe] transition-colors">
                                        <td className="p-[16px_24px] border-b border-[#f7fafc]">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-[#1a202c]">Bank Statements</span>
                                                <span className="text-xs text-[#a0aec0]">Uploaded 1h ago</span>
                                            </div>
                                        </td>
                                        <td className="p-[16px_24px] border-b border-[#f7fafc]">
                                            <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ecfdf5] text-[#10b981] uppercase tracking-wide">Verified</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex items-center gap-3 p-[16px_24px] bg-[#fdfdfd]">
                                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                    <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=2447d7&color=fff" alt="SJ" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-xs text-[#718096] italic flex-1 break-words">"Bank statement for Sept is blurry. Request clear scan."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── ICONS ─── */
const IconInfo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const IconDocs = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
const IconEmail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

export default LeadDetails;
