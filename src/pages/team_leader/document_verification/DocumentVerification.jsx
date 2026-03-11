import React, { useState } from 'react';

const DocumentVerification = () => {
    const [rejectionOpenId, setRejectionOpenId] = useState(null);
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
        },
        {
            id: 2,
            leadId: 'WR-2024-8845',
            clientName: 'Amara Okafor',
            type: 'Bank Statement',
            fileName: 'amara_bank_statement.jpg',
            uploadDate: 'Mar 09, 2026',
            status: 'Verified',
        },
        {
            id: 3,
            leadId: 'WR-2024-8901',
            clientName: 'Robert Taylor',
            type: 'Bank Statement',
            fileName: 'taylor_stmt.pdf',
            uploadDate: 'Mar 11, 2026',
            status: 'Pending',
        },
    ]);

    const stats = {
        totalDocs: documents.length,
        pendingReview: documents.filter(d => d.status === 'Pending').length,
        verified: documents.filter(d => d.status === 'Verified').length,
    };

    const handleApprove = (id) => {
        setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'Verified' } : doc));
        if (rejectionOpenId === id) setRejectionOpenId(null);
    };

    const handleRejectSubmit = (id) => {
        setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'Rejected' } : doc));
        setRejectionOpenId(null);
        setRejectionReason('');
    };

    const handleFinalApproval = () => setIsSuccess(true);

    // ── Success Screen ──
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn font-['Sora',sans-serif] text-center px-6">
                <div className="w-20 h-20 bg-[#ecfdf5] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#10b981]/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <h1 className="text-2xl font-extrabold text-[#1a202c] mb-2 tracking-tight">Verification Complete!</h1>
                <p className="text-[15px] text-[#718096] font-medium max-w-sm mx-auto leading-relaxed mb-8">
                    All documents have been successfully verified and approved.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-[#2447d7] text-white px-8 py-3 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all"
                >
                    Back to Queue
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── Header ── */}
            <header className="flex justify-between items-start gap-4 sm:flex-col animate-headerDrop">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] tracking-tight">Document Verification</h1>
                    <p className="text-[0.9rem] text-[#718096] font-medium">
                        Review and verify documents submitted across all active leads.
                    </p>
                </div>
                {stats.pendingReview === 0 && stats.verified > 0 && (
                    <button
                        onClick={handleFinalApproval}
                        className="flex items-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:bg-[#059669] hover:-translate-y-px transition-all shrink-0"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Mark All Verified
                    </button>
                )}
            </header>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-3 gap-5 md:grid-cols-1">
                {[
                    {
                        label: 'Total Documents',
                        value: stats.totalDocs.toString().padStart(2, '0'),
                        color: '#2447d7',
                        bg: 'rgba(36,71,215,0.07)',
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>
                            </svg>
                        ),
                        delay: '200ms',
                    },
                    {
                        label: 'Pending Review',
                        value: stats.pendingReview.toString().padStart(2, '0'),
                        color: stats.pendingReview > 0 ? '#f59e0b' : '#cbd5e0',
                        bg: stats.pendingReview > 0 ? 'rgba(245,158,11,0.07)' : '#f8fafc',
                        pulse: stats.pendingReview > 0,
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                        ),
                        delay: '280ms',
                    },
                    {
                        label: 'Verified',
                        value: stats.verified.toString().padStart(2, '0'),
                        color: '#10b981',
                        bg: 'rgba(16,185,129,0.07)',
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        ),
                        delay: '360ms',
                    },
                ].map((card, i) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-2xl border border-[#edf2f7] p-5 flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop"
                        style={{ animationDelay: card.delay, animationFillMode: 'both' }}
                    >
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">{card.label}</span>
                            <span
                                className={`text-[2rem] font-extrabold leading-none tracking-tight ${card.pulse ? 'animate-pulse' : ''}`}
                                style={{ color: card.color }}
                            >
                                {card.value}
                            </span>
                        </div>
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: card.bg, color: card.color }}
                        >
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Documents Table ── */}
            <div className="bg-white rounded-3xl border border-[#edf2f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp [animation-delay:450ms] [animation-fill-mode:both]">

                {/* Table Header */}
                <div className="grid md:hidden gap-4 px-8 py-3.5 bg-[#f8fafc] border-b border-[#f1f5f9]"
                    style={{ gridTemplateColumns: '130px 1fr 1fr 1fr 110px 110px 180px' }}>
                    {['Lead ID', 'Client', 'Doc Type', 'File', 'Date', 'Status', 'Actions'].map((h, i) => (
                        <div key={i} className={`text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ${i === 6 ? 'text-right' : ''}`}>{h}</div>
                    ))}
                </div>

                {/* Table Body */}
                <div className="flex flex-col divide-y divide-[#f7fafc]">
                    {documents.map((doc, idx) => (
                        <React.Fragment key={doc.id}>
                            {/* Row */}
                            <div
                                className={`grid md:flex md:flex-col gap-5 md:gap-4 px-6 md:px-8 py-5 md:py-4 items-center md:items-start transition-all duration-200 animate-rowIn ${rejectionOpenId === doc.id ? 'bg-[#fff8f8]' : 'hover:bg-[#f8faff]'}`}
                                style={{
                                    gridTemplateColumns: '130px 1fr 1fr 1fr 110px 110px 180px',
                                    animationDelay: `${500 + idx * 60}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                {/* Mobile Header: Lead ID + Status */}
                                <div className="flex justify-between items-center w-full md:contents">
                                    <span className="text-[11px] font-black text-[#2447d7] font-mono tracking-wider">{doc.leadId}</span>
                                    
                                    <div className="hidden md:block">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                                            doc.status === 'Pending'
                                                ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]'
                                                : doc.status === 'Verified'
                                                ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]'
                                                : 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                                                doc.status === 'Pending' ? 'bg-[#ea580c]' : doc.status === 'Verified' ? 'bg-[#059669]' : 'bg-[#dc2626]'
                                            }`}/>
                                            {doc.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Client */}
                                <div className="flex flex-col md:block w-full md:w-auto">
                                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-1">Client</span>
                                    <span className="text-[13px] font-bold text-[#1a202c] truncate">{doc.clientName}</span>
                                </div>

                                {/* Doc Type */}
                                <div className="flex flex-col md:flex-row md:items-start gap-2 w-full md:w-auto">
                                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-1">Document Type</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${doc.status === 'Verified' ? 'bg-[#ecfdf5] text-[#10b981]' : doc.status === 'Rejected' ? 'bg-[#fef2f2] text-[#ef4444]' : 'bg-[#ebf0ff] text-[#2447d7]'}`}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                            </svg>
                                        </div>
                                        <span className="text-[13px] font-semibold text-[#4a5568] truncate">{doc.type}</span>
                                    </div>
                                </div>

                                {/* File */}
                                <div className="flex flex-col md:block w-full md:w-auto">
                                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-1">File Attachment</span>
                                    <a href="#" download className="text-[12px] font-bold text-[#2447d7] hover:underline underline-offset-2 truncate flex items-center gap-1.5 group">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" className="shrink-0 group-hover:translate-y-0.5 transition-transform">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        <span className="truncate">{doc.fileName}</span>
                                    </a>
                                </div>

                                {/* Date */}
                                <div className="flex flex-col md:block w-full md:w-auto">
                                    <span className="hidden md:block text-[10px] font-black text-[#a0aec0] uppercase tracking-widest mb-1">Upload Date</span>
                                    <span className="text-[12px] font-semibold text-[#718096]">{doc.uploadDate}</span>
                                </div>

                                {/* Status Badge (Desktop only) */}
                                <div className="md:hidden block">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                                        doc.status === 'Pending'
                                            ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]'
                                            : doc.status === 'Verified'
                                            ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]'
                                            : 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                                            doc.status === 'Pending' ? 'bg-[#ea580c]' : doc.status === 'Verified' ? 'bg-[#059669]' : 'bg-[#dc2626]'
                                        }`}/>
                                        {doc.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end md:justify-start gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#f7fafc]">
                                    {doc.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(doc.id)}
                                                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2447d7] text-white text-[11px] font-black hover:bg-[#1732a3] transition-all shadow-[0_2px_8px_rgba(36,71,215,0.2)] hover:-translate-y-px"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setRejectionOpenId(rejectionOpenId === doc.id ? null : doc.id);
                                                    setRejectionReason('');
                                                }}
                                                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                                                    rejectionOpenId === doc.id
                                                        ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2]'
                                                        : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#fef2f2] hover:text-[#dc2626]'
                                                }`}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {doc.status === 'Verified' && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ecfdf5] text-[#059669] text-[11px] font-black border border-[#d1fae5]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>
                                            Approved
                                        </span>
                                    )}
                                    {doc.status === 'Rejected' && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fef2f2] text-[#dc2626] text-[11px] font-black border border-[#fee2e2]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            Rejected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Rejection Form */}
                            {rejectionOpenId === doc.id && (
                                <div className="px-8 py-5 bg-[#fff8f8] border-t border-[#fee2e2] animate-fadeIn">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-5 h-5 rounded-md bg-[#fef2f2] flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </div>
                                            <span className="text-[11px] font-black text-[#dc2626] uppercase tracking-widest">Rejection Reason</span>
                                        </div>
                                        <div className="flex items-center gap-3 sm:flex-col sm:items-stretch">
                                            <input
                                                type="text"
                                                className="flex-1 bg-white border border-[#fecaca] px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)] transition-all placeholder:text-[#fca5a5]"
                                                placeholder="e.g. Image is blurry, Date expired, Incorrect document..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                            />
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleRejectSubmit(doc.id)}
                                                    disabled={!rejectionReason.trim()}
                                                    className="px-4 py-2.5 rounded-xl bg-[#ef4444] text-white text-[12px] font-black shadow-[0_2px_8px_rgba(239,68,68,0.2)] hover:bg-[#dc2626] hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    onClick={() => { setRejectionOpenId(null); setRejectionReason(''); }}
                                                    className="px-4 py-2.5 rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] text-[12px] font-black hover:bg-[#f8fafc] transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentVerification;
