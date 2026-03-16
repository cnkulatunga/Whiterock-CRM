import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import { IconAlert, IconCheck, IconDocs } from '../../../components/DocumentManagement/Icons';

const MOCK_LEADS = [
    {
        id: 1,
        leadId: 'WR-2026-8812',
        name: 'Jonathan Vane',
        agentName: 'Sarah Connor',
        status: 'Document Verifications',
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Approved', note: 'Verified by SG', date: '2024-03-10' },
            { id: 2, type: 'Payslip', status: 'Pending', note: '', date: '2024-03-11' }
        ]
    },
    {
        id: 2,
        leadId: 'WR-2026-8845',
        name: 'Amara Okafor',
        agentName: 'Michael Reese',
        status: 'Document Verifications',
        documents: [
            { id: 3, type: 'Bank Statement', status: 'Approved', note: 'Clear copy', date: '2024-03-09' },
            { id: 4, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-09' }
        ]
    },
    {
        id: 3,
        leadId: 'WR-2026-8901',
        name: 'Robert Taylor',
        agentName: 'Sarah Connor',
        status: 'Document Verifications',
        documents: [
            { id: 5, type: 'Bank Statement', status: 'Pending', note: '', date: '2024-03-11' }
        ]
    },
    {
        id: 4,
        leadId: 'WR-2026-9012',
        name: 'Elena Gilbert',
        agentName: 'Damon Salvatore',
        status: 'Document Verifications',
        documents: [
            { id: 6, type: 'ID Document', status: 'Rejected', note: 'Image is blurry', date: '2024-03-12' },
            { id: 7, type: 'Bank Statement', status: 'Approved', note: 'Verified', date: '2024-03-12' }
        ]
    },
    {
        id: 5,
        leadId: 'WR-2026-9123',
        name: 'Arthur Morgan',
        agentName: 'John Marston',
        status: 'Document Verifications',
        documents: [
            { id: 8, type: 'Payslip', status: 'Pending', note: '', date: '2024-03-13' }
        ]
    },
];

const DocumentVerification = () => {
    const [leads, setLeads] = useState(MOCK_LEADS);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const stats = {
        totalLeads: leads.length,
        pendingReview: leads.filter(l => l.documents?.some(d => d.status === 'Pending')).length,
        fullyVerified: leads.filter(l => l.documents?.length > 0 && l.documents.every(d => d.status === 'Approved')).length,
    };

    const handleOpenModal = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const handleApproveDoc = (leadId, docId) => {
        setLeads(prev => {
            const newLeads = prev.map(lead => {
                if (lead.id === leadId) {
                    const newDocs = lead.documents.map(doc => doc.id === docId ? { ...doc, status: 'Approved' } : doc);
                    const updatedLead = { ...lead, documents: newDocs };
                    if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
                    return updatedLead;
                }
                return lead;
            });
            return newLeads;
        });
    };

    const handleRejectDoc = (leadId, docId, reason) => {
        setLeads(prev => {
            const newLeads = prev.map(lead => {
                if (lead.id === leadId) {
                    const newDocs = lead.documents.map(doc => doc.id === docId ? { ...doc, status: 'Rejected', note: reason } : doc);
                    const updatedLead = { ...lead, documents: newDocs };
                    if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
                    return updatedLead;
                }
                return lead;
            });
            return newLeads;
        });
    };

    const finishUpload = (leadId, targetDocId, docName) => {
        // TL doesn't upload here, but we need the portal parity
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
                <h1 className="text-2xl font-extrabold text-[#1a202c] mb-2 tracking-tight">Verification Batch Complete!</h1>
                <p className="text-[15px] text-[#718096] font-medium max-w-sm mx-auto leading-relaxed mb-8">
                    The selected batch of lead documents has been processed.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-[#2447d7] text-white px-8 py-3 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:-translate-y-px transition-all"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]">
            {/* ── Header ── */}
            <header className="flex justify-between items-start gap-4 sm:flex-col animate-headerDrop">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] tracking-tight">Document Verification</h1>
                    <p className="text-[0.9rem] text-[#718096] font-medium">
                        Verify and approve documents submitted by Tele-Agents for active leads.
                    </p>
                </div>
                {stats.pendingReview === 0 && stats.fullyVerified > 0 && (
                    <button
                        onClick={handleFinalApproval}
                        className="flex items-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:bg-[#059669] hover:-translate-y-px transition-all shrink-0"
                    >
                        <IconCheck size={16} strokeWidth={3} />
                        Release to Lenders
                    </button>
                )}
            </header>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-3 gap-5 md:grid-cols-1">
                {[
                    { label: 'Leads in Queue', value: stats.totalLeads.toString().padStart(2, '0'), color: '#2447d7', bg: 'rgba(36,71,215,0.07)', icon: <IconDocs size={20} />, delay: '200ms' },
                    { label: 'Pending Review', value: stats.pendingReview.toString().padStart(2, '0'), color: stats.pendingReview > 0 ? '#f59e0b' : '#cbd5e0', bg: stats.pendingReview > 0 ? 'rgba(245,158,11,0.07)' : '#f8fafc', pulse: stats.pendingReview > 0, icon: <IconAlert size={20} />, delay: '280ms' },
                    { label: 'Fully Verified', value: stats.fullyVerified.toString().padStart(2, '0'), color: '#10b981', bg: 'rgba(16,185,129,0.07)', icon: <IconCheck size={20} />, delay: '360ms' },
                ].map((card, i) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-2xl border border-[#edf2f7] p-5 flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-kpiPop"
                        style={{ animationDelay: card.delay, animationFillMode: 'both' }}
                    >
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">{card.label}</span>
                            <span className={`text-[2rem] font-extrabold leading-none tracking-tight ${card.pulse ? 'animate-pulse' : ''}`} style={{ color: card.color }}>{card.value}</span>
                        </div>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: card.bg, color: card.color }}>{card.icon}</div>
                    </div>
                ))}
            </div>

            {/* ── Leads Table ── */}
            <div className="bg-white rounded-3xl border border-[#edf2f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp [animation-delay:450ms] [animation-fill-mode:both]">
                <div className="grid md:hidden gap-4 px-8 py-3.5 bg-[#f8fafc] border-b border-[#f1f5f9]" style={{ gridTemplateColumns: '150px 1fr 180px 150px' }}>
                    {['Lead ID', 'Client Name', 'Verification Status', 'Actions'].map((h, i) => (
                        <div key={i} className={`text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>{h}</div>
                    ))}
                </div>

                <div className="flex flex-col divide-y divide-[#f7fafc]">
                    {leads.map((lead, idx) => (
                        <div
                            key={lead.id}
                            className="grid md:flex md:flex-col gap-5 md:gap-4 px-8 py-5 items-center md:items-start hover:bg-[#f8faff] transition-all duration-200 animate-rowIn"
                            style={{ gridTemplateColumns: '150px 1fr 180px 150px', animationDelay: `${500 + idx * 60}ms`, animationFillMode: 'both' }}
                        >
                            <span className="text-[11px] font-black text-[#2447d7] font-mono tracking-wider">{lead.leadId}</span>
                            
                            <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-[#1a202c]">{lead.name}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-4 h-4 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[10px] text-[#718096] border border-[#e2e8f0]">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="8" height="8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <span className="text-[11px] font-medium text-[#718096]">Agent: <span className="font-bold text-[#4a5568]">{lead.agentName}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {(() => {
                                    const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                    const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                    const docCount = lead.documents?.length || 0;
                                    const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                                    if (hasRejected) {
                                        return (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm animate-pulse">
                                                <IconAlert size={12} /> Docs Rejected
                                            </span>
                                        );
                                    }
                                    if (isAllVerified) {
                                        return (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm">
                                                <IconCheck size={12} strokeWidth={3} /> Fully Verified
                                            </span>
                                        );
                                    }
                                    return (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(36,71,215,0.4)]" />
                                            Checking ({approvedCount}/{docCount})
                                        </span>
                                    );
                                })()}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleOpenModal(lead)}
                                    className="px-4 py-1.5 bg-[#2447d7] text-white rounded-lg text-[11px] font-black hover:bg-[#1732a3] transition-all shadow-[0_2px_8px_rgba(36,71,215,0.2)]"
                                >
                                    Manage Docs
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <UploadModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    client={selectedLead}
                    onUpload={finishUpload}
                    onApprove={handleApproveDoc}
                    onReject={handleRejectDoc}
                    uploadingDocs={{}}
                    isDark={isDark}
                    isTeamLeader={true}
                />
            )}
        </div>
    );
};

export default DocumentVerification;
