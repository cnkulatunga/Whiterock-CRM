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

            {/* Table */}
            <section className="bg-white dark:bg-[#1e2347] rounded-2xl border border-[#edf2f7] dark:border-white/5 shadow-sm overflow-hidden animate-slideUp [animation-delay:500ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc] dark:border-white/5">
                    <span className="text-[13px] font-semibold text-[#1a202c] dark:text-white">Approved Leads</span>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input
                                type="text"
                                className="bg-[#f8fafc] dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-[13px] font-medium text-[#1a202c] dark:text-white outline-none focus:border-[#2447d7] dark:focus:border-blue-500 transition-all w-[280px] placeholder:text-[#cbd5e0] dark:placeholder:text-slate-600"
                                placeholder="Search by client, ID or lender..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-white dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 text-[#4a5568] dark:text-slate-300 px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] dark:hover:bg-white/10 transition-colors shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] dark:bg-white/[0.02]">
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">LEAD ID & CLIENT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">BUSINESS NAME</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">AMOUNT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">LENDER SELECTION</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">INTEREST RATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">TENURE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">APPROVED DATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] dark:text-slate-500 uppercase tracking-widest">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc] dark:divide-white/5">
                            {filtered.map((row, i) => {
                                const displayId = row.leadId || row.id;
                                const displayAmount = row.loanAmount ? (typeof row.loanAmount === 'string' ? row.loanAmount : `£${row.loanAmount}K`) : 'N/A';
                                const displayLender = row.selectedLender || row.lender || LENDERS[0];
                                const decision = row.decision || 'pending';
                                
                                return (
                                    <tr key={row.id} className={`transition-colors animate-rowIn ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#f8faff]'}`} style={{ animationDelay: `${550 + i * 60}ms`, animationFillMode: 'both' }}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-medium text-[#2447d7] dark:text-blue-400 cursor-pointer hover:underline">{displayId}</span>
                                                <span className="text-[12px] font-medium text-[#1a202c] dark:text-white">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] text-[#4a5568] dark:text-slate-300">
                                                {row.businessName || row.companyName || <span className="text-[#a0aec0] dark:text-slate-600 italic">Personal Lead</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568] dark:text-slate-300">{displayAmount}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 min-w-[190px]">
                                                <div className="w-7 h-7 rounded-lg bg-[#ebf0ff] dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-[#d9e8ff] dark:border-blue-500/20">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                </div>
                                                <select
                                                    className={`bg-transparent border-none text-[13px] font-medium outline-none cursor-pointer transition-colors ${isDark ? 'text-slate-200 focus:text-blue-400' : 'text-[#1a202c] focus:text-[#2447d7]'}`}
                                                    value={displayLender}
                                                    onChange={e => setLender(row.id, e.target.value)}
                                                    disabled={decision !== 'pending'}
                                                >
                                                    {LENDERS.map(lender => (
                                                        <option key={lender} value={lender}>{lender}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] font-semibold text-[#059669] dark:text-emerald-400 bg-[#ecfdf5] dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-[#d1fae5] dark:border-emerald-500/20">
                                                {row.interestRate || 'TBD'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#718096] dark:text-slate-400">{row.tenure || row.term || 'N/A'}</span></td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0] dark:text-slate-500">{row.approvedDate || row.submissionDate || 'N/A'}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${decision === 'approved' ? 'bg-[#10b981] text-white shadow-sm' : isDark ? 'bg-white/5 text-slate-500 hover:bg-emerald-500/15 hover:text-emerald-400' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#dcfce7] hover:text-[#16a34a]'}`}
                                                    onClick={() => handleApprove(row.id)}
                                                    disabled={decision !== 'pending'}
                                                >✓</button>
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${decision === 'rejected' ? 'bg-[#e11d48] text-white shadow-sm' : isDark ? 'bg-white/5 text-slate-500 hover:bg-red-500/15 hover:text-red-400' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#ffe4e6] hover:text-[#e11d48]'}`}
                                                    onClick={() => handleRejectClick(row)}
                                                    disabled={decision !== 'pending'}
                                                >✕</button>
                                                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wide whitespace-nowrap ${
                                                    decision === 'approved' ? 'bg-[#ecfdf5] dark:bg-emerald-500/15 text-[#059669] dark:text-emerald-400 border-[#d1fae5] dark:border-emerald-500/20' :
                                                    decision === 'rejected' ? 'bg-[#fff1f2] dark:bg-red-500/15 text-[#e11d48] dark:text-red-400 border-[#ffe4e6] dark:border-red-500/20' :
                                                    'bg-[#f8fafc] dark:bg-white/5 text-[#94a3b8] dark:text-slate-500 border-[#e2e8f0] dark:border-white/10'
                                                }`}>
                                                    {decision}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-[13px] text-[#a0aec0] dark:text-slate-600">No leads match your search.</p>
                    </div>
                )}

                <div className="px-6 py-4 border-t border-[#f7fafc] dark:border-white/5 bg-[#fcfdff] dark:bg-white/[0.02]">
                    <span className="text-[12px] text-[#a0aec0] dark:text-slate-500">Showing <span className="text-[#1a202c] dark:text-white font-medium">{filtered.length}</span> of <span className="text-[#1a202c] dark:text-white font-medium">{approvedLeads.length}</span> approved leads</span>
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
