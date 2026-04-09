import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useLeads } from '../../../context/LeadsContext';
import { AM_LENDER_OPTIONS as LENDERS } from '../../../data/dummyData';
import { useTheme } from '../../../context/ThemeContext';

/* Rejection Reason Modal */
const RejectionModal = ({ lead, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) { setError('Please provide a rejection reason'); return; }
        onConfirm(reason);
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/55 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white dark:bg-[#1e2347] rounded-3xl w-full max-w-[480px] overflow-hidden shadow-2xl animate-slideUp border border-transparent dark:border-white/10" onClick={e => e.stopPropagation()}>
                <div className="p-7 pb-5 border-b border-slate-100 dark:border-white/10 flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0 p-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="24" height="24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    </div>
                    <div>
                        <h3 className="text-[17px] font-black text-slate-900 dark:text-white tracking-tight">Reject Lead</h3>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{lead?.name} — {lead?.id}</p>
                    </div>
                </div>
                <div className="p-7">
                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Rejection Reason *</label>
                    <textarea
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors resize-vertical min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-slate-600 font-['Sora',sans-serif]"
                        placeholder="Please provide a detailed reason for rejecting this lead..."
                        value={reason}
                        onChange={e => { setReason(e.target.value); setError(''); }}
                        autoFocus
                    />
                    {error && <div className="mt-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/15 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[12px] font-bold rounded-xl">{error}</div>}
                </div>
                <div className="px-7 pb-7 pt-0 border-t border-slate-100 dark:border-white/10 flex gap-3 pt-5">
                    <button className="flex-1 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[14px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors" onClick={onClose}>Cancel</button>
                    <button className="flex-1 py-3 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all" onClick={handleSubmit}>Confirm Rejection</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const LenderSelectionApproved = () => {
    const { leads, updateLead } = useLeads();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [search, setSearch] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedLeadForRejection, setSelectedLeadForRejection] = useState(null);

    // Filter leads that are in "Lender Selection" stage
    const approvedLeads = leads.filter(lead => {
        const stage = lead.stage || lead.status;
        return stage === 'Lender Selection' || stage === 'Completed';
    });

    const setLender = (leadId, lender) => {
        updateLead(leadId, { selectedLender: lender });
    };

    const handleApprove = (leadId) => {
        updateLead(leadId, { 
            decision: 'approved',
            stage: 'Completed',
            status: 'Completed',
            progress: 100
        });
    };

    const handleRejectClick = (lead) => {
        setSelectedLeadForRejection(lead);
        setShowRejectionModal(true);
    };

    const handleRejectConfirm = (reason) => {
        if (selectedLeadForRejection) {
            updateLead(selectedLeadForRejection.id, { 
                decision: 'rejected',
                rejectionReason: reason,
                rejectionDate: new Date().toISOString().split('T')[0],
                stage: 'Rejected',
                status: 'Rejected',
                progress: 100
            });
        }
    };

    const filtered = approvedLeads.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.id || a.leadId || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.selectedLender || '').toLowerCase().includes(search.toLowerCase())
    );

    const totalApproved = approvedLeads.filter(a => a.decision === 'approved').length;
    const totalRejected = approvedLeads.filter(a => a.decision === 'rejected').length;
    const totalPending = approvedLeads.filter(a => !a.decision || a.decision === 'pending').length;

    // Calculate total value
    const totalValue = approvedLeads
        .filter(a => a.decision === 'approved')
        .reduce((sum, a) => {
            const amount = typeof a.loanAmount === 'string' 
                ? parseFloat(a.loanAmount.replace(/[£$,K]/g, '')) || 0
                : a.loanAmount || 0;
            return sum + amount;
        }, 0);

    const stats = [
        { label: 'Total Leads', value: approvedLeads.length,  bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',         iconBg: 'bg-blue-600',    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
        { label: 'Approved',    value: totalApproved,         bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20', iconBg: 'bg-emerald-600', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
        { label: 'Rejected',    value: totalRejected,         bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20',           iconBg: 'bg-rose-600',    icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
        { label: 'Pending',     value: totalPending,          bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',       iconBg: 'bg-amber-500',   icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
                {stats.map((stat, i) => (
                    <div key={i} className={`rounded-xl border p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${stat.bg}`} style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0 ${stat.iconBg}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">{stat.icon}</svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
                                <div className="text-base font-black text-slate-900 dark:text-white leading-none">{stat.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Leads Management Section */}
            <section className="bg-white dark:bg-[#1e2347] rounded-3xl border border-[#edf2f7] dark:border-white/5 shadow-xl overflow-hidden animate-slideUp [animation-delay:400ms] [animation-fill-mode:both]">
                <div className="px-6 py-5 flex justify-between items-center border-b border-[#f7fafc] dark:border-white/5 flex-wrap gap-4">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-[#1a202c] dark:text-white uppercase tracking-tight leading-none mb-1">Approved Leads</span>
                        <span className="text-[11px] font-bold text-slate-400">Manage lender assignments and final approvals</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:flex-col lg:w-auto">
                        <div className="relative w-full lg:w-[280px]">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input
                                type="text"
                                className="bg-[#f8fafc] dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-[13px] font-bold text-[#1a202c] dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#2447d7] dark:focus:border-blue-500 transition-all w-full placeholder:text-[#cbd5e0] dark:placeholder:text-slate-600"
                                placeholder="Search client, ID or lender..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 text-[#4a5568] dark:text-slate-300 px-5 py-2.5 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-[#f1f5f9] dark:hover:bg-white/10 transition-all shrink-0 sm:w-full">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export
                        </button>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="hidden sm:flex flex-col gap-4 p-4 bg-slate-50/50 dark:bg-[#141829]/50">
                    {filtered.length > 0 ? filtered.map((row, i) => {
                        const displayId = row.leadId || row.id;
                        const displayAmount = row.loanAmount ? (typeof row.loanAmount === 'string' ? row.loanAmount : `£${row.loanAmount}K`) : 'N/A';
                        const displayLender = row.selectedLender || row.lender || LENDERS[0];
                        const decision = row.decision || 'pending';

                        return (
                            <div 
                                key={row.id} 
                                className={`rounded-3xl border flex flex-col gap-4 p-5 transition-all animate-slideUp ${isDark ? 'bg-[#1e2347] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}
                                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.1em] mb-1">{displayId}</span>
                                        <span className="text-[16px] font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{row.name}</span>
                                        <span className={`text-[12px] font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{row.businessName || 'Personal Lead'}</span>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-2xl border text-[14px] font-black ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                        {displayAmount}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rate</span>
                                        <span className="text-[12px] font-black text-emerald-500">{row.interestRate || 'TBD'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Tenure</span>
                                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{row.tenure || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assign Lender</span>
                                    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="14" height="14"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                        </div>
                                        <select
                                            className="bg-transparent border-none text-[13px] font-black text-slate-800 dark:text-white outline-none w-full appearance-none cursor-pointer"
                                            value={displayLender}
                                            onChange={e => setLender(row.id, e.target.value)}
                                            disabled={decision !== 'pending'}
                                        >
                                            {LENDERS.map(lender => <option key={lender} value={lender} className="dark:bg-[#1a1f35]">{lender}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        className={`flex-1 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${decision === 'approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                                        onClick={() => handleApprove(row.id)}
                                        disabled={decision !== 'pending'}
                                    >
                                        {decision === 'approved' ? '✓ Approved' : 'Approve'}
                                    </button>
                                    <button
                                        className={`flex-1 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${decision === 'rejected' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'}`}
                                        onClick={() => handleRejectClick(row)}
                                        disabled={decision !== 'pending'}
                                    >
                                        {decision === 'rejected' ? '✕ Rejected' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                            </div>
                            <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">No matching leads found</span>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="sm:hidden overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] dark:bg-white/[0.02]">
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">LEAD ID & CLIENT</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">BUSINESS NAME</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">AMOUNT</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">LENDER SELECTION</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">RATE</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">TENURE</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">DATE</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-[#a0aec0] dark:text-slate-500 uppercase tracking-[0.2em]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc] dark:divide-white/5">
                            {filtered.map((row, i) => {
                                const displayId = row.leadId || row.id;
                                const displayAmount = row.loanAmount ? (typeof row.loanAmount === 'string' ? row.loanAmount : `£${row.loanAmount}K`) : 'N/A';
                                const displayLender = row.selectedLender || row.lender || LENDERS[0];
                                const decision = row.decision || 'pending';
                                
                                return (
                                    <tr key={row.id} className={`transition-all group ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#f8faff]'}`}>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[11px] font-black text-[#2447d7] dark:text-blue-400 uppercase tracking-tight">{displayId}</span>
                                                <span className="text-[14px] font-black text-[#1a202c] dark:text-white uppercase truncate max-w-[140px] leading-tight group-hover:text-blue-600 transition-colors tracking-tight">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[13px] font-bold text-[#4a5568] dark:text-slate-400">
                                                {row.businessName || row.companyName || <span className="text-[#a0aec0] dark:text-slate-600 italic font-medium">Personal Lead</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5"><span className="text-[14px] font-black text-slate-800 dark:text-slate-200">{displayAmount}</span></td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 min-w-[190px]">
                                                <div className="w-8 h-8 rounded-xl bg-[#ebf0ff] dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-[#d9e8ff] dark:border-blue-500/20 shadow-sm">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                </div>
                                                <select
                                                    className={`bg-transparent border-none text-[13px] font-black outline-none cursor-pointer transition-colors ${isDark ? 'text-slate-200 focus:text-blue-400' : 'text-[#1a202c] focus:text-[#2447d7]'}`}
                                                    value={displayLender}
                                                    onChange={e => setLender(row.id, e.target.value)}
                                                    disabled={decision !== 'pending'}
                                                >
                                                    {LENDERS.map(lender => (
                                                        <option key={lender} value={lender} className="dark:bg-[#1a1f35]">{lender}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[12px] font-black text-[#059669] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                                                {row.interestRate || 'TBD'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5"><span className="text-[13px] font-bold text-[#718096] dark:text-slate-400">{row.tenure || row.term || 'N/A'}</span></td>
                                        <td className="px-6 py-5"><span className="text-[12px] font-bold text-[#a0aec0] dark:text-slate-500 truncate">{row.approvedDate || row.submissionDate || 'N/A'}</span></td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-[14px] font-black transition-all ${decision === 'approved' ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-500/20' : isDark ? 'bg-white/5 text-slate-500 hover:bg-emerald-500/20 hover:text-emerald-400' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-emerald-500 hover:text-white'}`}
                                                    onClick={() => handleApprove(row.id)}
                                                    disabled={decision !== 'pending'}
                                                >✓</button>
                                                <button
                                                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-[14px] font-black transition-all ${decision === 'rejected' ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-500/20' : isDark ? 'bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-rose-500 hover:text-white'}`}
                                                    onClick={() => handleRejectClick(row)}
                                                    disabled={decision !== 'pending'}
                                                >✕</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-5 border-t border-[#f7fafc] dark:border-white/5 bg-[#fcfdff] dark:bg-white/[0.02] flex justify-between items-center sm:flex-col sm:gap-3">
                    <span className="text-[12px] font-bold text-[#a0aec0] dark:text-slate-500">
                        Showing <span className="text-[#1a202c] dark:text-white">{filtered.length}</span> records
                    </span>
                    <div className="flex gap-2">
                         <button className="px-4 py-2 rounded-xl text-[11px] font-black border border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed uppercase tracking-[0.2em]">Prev</button>
                         <button className="px-4 py-2 rounded-xl text-[11px] font-black border border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed uppercase tracking-[0.2em]">Next</button>
                    </div>
                </div>
            </section>

            {/* Rejection Modal */}
            {showRejectionModal && selectedLeadForRejection && (
                <RejectionModal
                    lead={selectedLeadForRejection}
                    onClose={() => {
                        setShowRejectionModal(false);
                        setSelectedLeadForRejection(null);
                    }}
                    onConfirm={handleRejectConfirm}
                />
            )}

        </div>
    );
};

export default LenderSelectionApproved;
