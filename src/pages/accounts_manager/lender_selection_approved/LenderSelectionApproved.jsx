import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useLeads } from '../../../context/LeadsContext';
import { AM_LENDER_OPTIONS as LENDERS } from '../../../data/dummyData';

/* Rejection Reason Modal */
const RejectionModal = ({ lead, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }
        onConfirm(reason);
        onClose();
    };

    return ReactDOM.createPortal(
        <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.2s ease' }}
            onClick={onClose}
        >
            <div
                style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(36,71,215,0.18)', animation: 'slideUp 0.25s ease' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="24" height="24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Reject Lead</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>{lead?.name} - {lead?.id}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px 28px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Rejection Reason *
                    </label>
                    <textarea
                        style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', padding: '12px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', resize: 'vertical', minHeight: '120px', fontFamily: "'Sora', sans-serif" }}
                        placeholder="Please provide a detailed reason for rejecting this lead..."
                        value={reason}
                        onChange={e => { setReason(e.target.value); setError(''); }}
                        autoFocus
                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    {error && <div style={{ marginTop: '8px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', fontWeight: 700, borderRadius: '10px' }}>{error}</div>}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                    <button style={{ flex: 1, padding: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' }} onClick={onClose}>Cancel</button>
                    <button style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }} onClick={handleSubmit}>
                        Confirm Rejection
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const LenderSelectionApproved = () => {
    const { leads, updateLead } = useLeads();
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
        { label: 'Total Leads',  value: approvedLeads.length,     bg: '#ebf0ff', color: '#2447d7', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
        { label: 'Approved',     value: totalApproved,   bg: '#ecfdf5', color: '#16a34a', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
        { label: 'Rejected',     value: totalRejected,   bg: '#fff1f2', color: '#e11d48', icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
        { label: 'Pending',      value: totalPending,    bg: '#fff7ed', color: '#f97316', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Lender Approved Loans</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Accounts manager can assign lender and approve or reject each lead.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-[#edf2f7] text-[#4a5568] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#f8fafc] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Report
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 animate-kpiPop min-w-0" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">{stat.icon}</svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[15px] font-bold text-[#1a202c] leading-none mb-0.5 truncate">{stat.value}</div>
                            <div className="text-[11px] font-medium text-[#a0aec0]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:500ms] [animation-fill-mode:both]">
                <div className="px-6 py-4 flex justify-between items-center border-b border-[#f7fafc]">
                    <span className="text-[13px] font-semibold text-[#1a202c]">Approved Leads</span>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            type="text"
                            className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl pl-9 pr-4 py-2 text-[13px] font-medium text-[#1a202c] outline-none focus:border-[#2447d7] transition-all w-[280px] placeholder:text-[#cbd5e0]"
                            placeholder="Search by client, ID or lender..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LEAD ID & CLIENT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">BUSINESS NAME</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">AMOUNT</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">LENDER SELECTION</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">INTEREST RATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">TENURE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">APPROVED DATE</th>
                                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7fafc]">
                            {filtered.map((row, i) => {
                                const displayId = row.leadId || row.id;
                                const displayAmount = row.loanAmount ? (typeof row.loanAmount === 'string' ? row.loanAmount : `£${row.loanAmount}K`) : 'N/A';
                                const displayLender = row.selectedLender || row.lender || LENDERS[0];
                                const decision = row.decision || 'pending';
                                
                                return (
                                    <tr key={row.id} className="hover:bg-[#f8faff] transition-colors animate-rowIn" style={{ animationDelay: `${550 + i * 60}ms`, animationFillMode: 'both' }}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-medium text-[#2447d7] cursor-pointer hover:underline">{displayId}</span>
                                                <span className="text-[12px] font-medium text-[#1a202c]">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] text-[#4a5568]">
                                                {row.businessName || row.companyName || <span className="text-[#a0aec0] italic">Personal Lead</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-[13px] text-[#4a5568]">{displayAmount}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 min-w-[190px]">
                                                <div className="w-7 h-7 rounded-lg bg-[#ebf0ff] flex items-center justify-center shrink-0 border border-[#d9e8ff]">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                </div>
                                                <select
                                                    className="bg-transparent border-none text-[13px] font-medium text-[#1a202c] outline-none cursor-pointer focus:text-[#2447d7] transition-colors"
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
                                            <span className="text-[12px] font-semibold text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-lg border border-[#d1fae5]">
                                                {row.interestRate || 'TBD'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#718096]">{row.tenure || row.term || 'N/A'}</span></td>
                                        <td className="px-6 py-4"><span className="text-[12px] text-[#a0aec0]">{row.approvedDate || row.submissionDate || 'N/A'}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${decision === 'approved' ? 'bg-[#10b981] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#dcfce7] hover:text-[#16a34a]'}`}
                                                    onClick={() => handleApprove(row.id)}
                                                    disabled={decision !== 'pending'}
                                                >✓</button>
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${decision === 'rejected' ? 'bg-[#e11d48] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#ffe4e6] hover:text-[#e11d48]'}`}
                                                    onClick={() => handleRejectClick(row)}
                                                    disabled={decision !== 'pending'}
                                                >✕</button>
                                                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wide whitespace-nowrap ${
                                                    decision === 'approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' :
                                                    decision === 'rejected' ? 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]' :
                                                    'bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0]'
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
                        <p className="text-[13px] text-[#a0aec0]">No leads match your search.</p>
                    </div>
                )}

                <div className="px-6 py-4 border-t border-[#f7fafc] bg-[#fcfdff]">
                    <span className="text-[12px] text-[#a0aec0]">Showing <span className="text-[#1a202c] font-medium">{filtered.length}</span> of <span className="text-[#1a202c] font-medium">{approvedLeads.length}</span> approved leads</span>
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
