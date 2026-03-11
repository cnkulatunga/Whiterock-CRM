import React, { useState } from 'react';

const DocumentVerification = () => {
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [documents, setDocuments] = useState([
        {
            id: 1,
            leadId: 'WR-2024-8812',
            clientName: 'Jonathan Vane',
            type: 'Bank Statement',
            fileName: 'vane_bank_stmt.pdf',
            uploadDate: 'Mar 10, 2026',
            status: 'Pending',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M3 10h18M7 15h1m4 0h1m4 0h1M3 21h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                </svg>
            )
        },
        {
            id: 2,
            leadId: 'WR-2024-8845',
            clientName: 'Amara Okafor',
            type: 'Bank Statement',
            fileName: 'amara_bank_statement.jpg',
            uploadDate: 'Mar 09, 2026',
            status: 'Verified',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M3 10h18M7 15h1m4 0h1m4 0h1M3 21h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                </svg>
            )
        },
        {
            id: 3,
            leadId: 'WR-2024-8901',
            clientName: 'Robert Taylor',
            type: 'Bank Statement',
            fileName: 'taylor_stmt.pdf',
            uploadDate: 'Mar 11, 2026',
            status: 'Pending',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M3 10h18M7 15h1m4 0h1m4 0h1M3 21h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                </svg>
            )
        }
    ]);

    const stats = {
        totalDocs: documents.length,
        pendingReview: documents.filter(d => d.status === 'Pending').length,
        verified: documents.filter(d => d.status === 'Verified').length
    };

    const handleApprove = (id) => {
        setDocuments(prev => prev.map(doc => 
            doc.id === id ? { ...doc, status: 'Verified' } : doc
        ));
    };

    const handleFinalApproval = () => {
        setIsSuccess(true);
        console.log("System stage updated to: Document Verification Done");
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn font-['Sora',sans-serif] text-center">
                <div className="w-24 h-24 bg-[#ecfdf5] text-[#10b981] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#10b981]/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-[#1a202c] mb-4 tracking-tight">Verification Complete!</h1>
                <p className="text-lg text-[#718096] font-medium max-w-md mx-auto leading-relaxed">
                    The requested documents have been successfully verified and approved.
                </p>
                <div className="mt-10 flex gap-4">
                    <button onClick={() => window.location.reload()} className="bg-[#2447d7] text-white p-[14px_32px] rounded-2xl text-[15px] font-bold shadow-xl shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all">
                        Back to Queue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            {/* Header */}
            <header className="mb-10 animate-headerDrop">
                <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1 tracking-tight">Document Verification</h1>
                <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">
                    Review and verify documents submitted across all active leads.
                </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10 md:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex justify-between items-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop [animation-delay:200ms] [animation-fill-mode:both]">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">Total Documents</span>
                        <span className="text-2xl font-extrabold text-[#1a202c]">{stats.totalDocs.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="w-12 h-12 bg-[#ebf3ff] text-[#2447d7] rounded-xl flex items-center justify-center group-hover:bg-[#2447d7] group-hover:text-white transition-colors duration-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex justify-between items-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop [animation-delay:280ms] [animation-fill-mode:both]">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">Pending Review</span>
                        <span className={`text-2xl font-extrabold ${stats.pendingReview > 0 ? 'text-[#f59e0b] animate-pulse' : 'text-[#cbd5e0]'}`}>{stats.pendingReview.toString().padStart(2, '0')}</span>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${stats.pendingReview > 0 ? 'bg-[#fff7ed] text-[#f59e0b] group-hover:bg-[#f59e0b] group-hover:text-white' : 'bg-[#f8fafc] text-[#cbd5e0]'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <circle cx="12" cy="16" r="2" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex justify-between items-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop [animation-delay:360ms] [animation-fill-mode:both]">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">Verified</span>
                        <span className="text-2xl font-extrabold text-[#10b981]">{stats.verified.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="w-12 h-12 bg-[#ecfdf5] text-[#10b981] rounded-xl flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-white transition-colors duration-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden animate-slideUp [animation-delay:450ms] [animation-fill-mode:both]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#f7fafc]">
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">Lead ID</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">Client Name</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">Document Type</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">File Name</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">Upload Date</th>
                                <th className="p-5 px-8 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">Status</th>
                                <th className="p-5 px-8 text-right text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {documents.map((doc, idx) => (
                                <React.Fragment key={doc.id}>
                                    <tr className={`transition-colors animate-rowIn ${doc.status === 'Pending' && isRejectionOpen ? 'bg-[#fcfdff]' : 'hover:bg-[#f8fafc]/50'}`} style={{ animationDelay: `${550 + idx * 50}ms`, animationFillMode: 'both' }}>
                                        <td className="p-5 px-8 text-[13px] font-black text-[#2447d7] font-mono leading-none">{doc.leadId}</td>
                                        <td className="p-5 px-8 text-[14px] font-bold text-[#1a202c] tracking-tight">{doc.clientName}</td>
                                        <td className="p-5 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${doc.status === 'Verified' ? 'bg-[#f0fdf4] text-[#10b981]' : 'bg-[#ebf0ff] text-[#2447d7]'}`}>{doc.icon}</div>
                                                <span className="text-[14px] font-bold text-[#1a202c] tracking-tight">{doc.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 px-8">
                                            <a href="#" download className="text-[13px] font-bold text-[#2447d7] hover:underline underline-offset-4 decoration-2">{doc.fileName}</a>
                                        </td>
                                        <td className="p-5 px-8">
                                            <span className="text-[13px] font-semibold text-[#718096]">{doc.uploadDate}</span>
                                        </td>
                                        <td className="p-5 px-8">
                                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                                                doc.status === 'Pending' ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]' : 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]'
                                            }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="p-5 px-8 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <a href="#" download className="p-[8px_16px] rounded-xl text-[12px] font-bold text-[#2447d7] hover:bg-[#ebf0ff] transition-all flex items-center gap-1.5 group">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="group-hover:translate-y-0.5 transition-transform">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                                    </svg>
                                                    Download
                                                </a>
                                                <button 
                                                    className={`p-[8px_16px] rounded-xl text-[12px] font-bold transition-all ${doc.status === 'Pending' ? 'bg-[#2447d7] text-white shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-1px]' : 'bg-[#f1f5f9] text-[#cbd5e0] cursor-not-allowed'}`}
                                                    onClick={() => doc.status === 'Pending' && handleApprove(doc.id)}
                                                >
                                                    {doc.status === 'Verified' ? 'Approved' : 'Approve'}
                                                </button>
                                                {doc.status === 'Pending' && (
                                                    <button
                                                        className={`p-[8px_16px] rounded-xl text-[12px] font-bold transition-all ${isRejectionOpen ? 'bg-[#fef2f2] text-[#e53e3e] border border-[#fee2e2]' : 'bg-[#f1f5f9] text-[#4a5568] hover:bg-[#ffebed] hover:text-[#e53e3e]'}`}
                                                        onClick={() => setIsRejectionOpen(!isRejectionOpen)}
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Rejection Form Integration */}
                                    {doc.status === 'Pending' && isRejectionOpen && (
                                        <tr className="bg-[#fef2f2]/30 animate-fadeIn">
                                            <td colSpan="7" className="p-0">
                                                <div className="p-8 px-10 border-t border-[#fee2e2] flex flex-col gap-5 md:p-6">
                                                    <span className="text-[11px] font-bold text-[#991b1b] uppercase tracking-widest leading-none">REJECTION REASON</span>
                                                    <div className="flex items-center gap-4 md:flex-col md:items-stretch">
                                                        <input
                                                            type="text"
                                                            className="flex-1 bg-white border-2 border-[#fee2e2] p-3 px-5 rounded-2xl text-[13px] font-medium text-[#1a202c] outline-none focus:border-[#e53e3e] focus:ring-4 focus:ring-[#e53e3e]/5 transition-all w-full"
                                                            placeholder="Please provide specific details for rejection (e.g., 'Image is blurry' or 'Date expired')..."
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <button className="bg-[#e53e3e] text-white p-[11px_24px] rounded-2xl text-[13px] font-bold shadow-lg shadow-[#e53e3e]/20 hover:bg-[#c53030] hover:translate-y-[-1px] transition-all whitespace-nowrap">
                                                                Submit Rejection
                                                            </button>
                                                            <button
                                                                className="bg-white border border-[#fee2e2] text-[#991b1b] p-[11px_24px] rounded-2xl text-[13px] font-bold hover:bg-[#fff5f5] transition-all whitespace-nowrap"
                                                                onClick={() => setIsRejectionOpen(false)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default DocumentVerification;
