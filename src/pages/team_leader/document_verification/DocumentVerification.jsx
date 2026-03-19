import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import { IconAlert, IconCheck, IconDocs } from '../../../components/DocumentManagement/Icons';

import { useLeads } from '../../../context/LeadsContext';

const DocumentVerification = () => {
    const { leads, setLeads } = useLeads();
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDateFilter, setSelectedDateFilter] = useState('All Time');

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
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const newDocs = lead.documents.map(doc =>
                doc.id === docId ? { ...doc, status: 'Approved' } : doc
            );
            const allApproved = newDocs.length > 0 && newDocs.every(d => d.status === 'Approved');
            const updatedLead = {
                ...lead,
                documents: newDocs,
                ...(allApproved && lead.stage === 'Document Collection' ? {
                    stage: 'Document Verification Done',
                    status: 'Document Verification Done',
                    progress: 40,
                } : {}),
            };
            if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
            return updatedLead;
        }));
    };

    const handleRejectDoc = (leadId, docId, reason) => {
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const newDocs = lead.documents.map(doc =>
                doc.id === docId ? { ...doc, status: 'Rejected', note: reason } : doc
            );
            const updatedLead = { ...lead, documents: newDocs };
            if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
            return updatedLead;
        }));
    };

    const finishUpload = (leadId, targetDocId, docName) => {
        // TL doesn't upload here, but we need the portal parity
    };

    const handleFinalApproval = () => setIsSuccess(true);

    const filteredLeads = leads.filter(lead => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            lead.name.toLowerCase().includes(searchLower) ||
            lead.leadId.toLowerCase().includes(searchLower) ||
            lead.businessName?.toLowerCase().includes(searchLower) ||
            lead.agentName.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        const submissionDate = new Date(lead.submissionDate);
        const today = new Date('2026-03-16');
        const diffDays = (today - submissionDate) / (1000 * 60 * 60 * 24);

        if (selectedDateFilter === 'Today') return lead.submissionDate === '2026-03-16';
        if (selectedDateFilter === 'Yesterday') return lead.submissionDate === '2026-03-15';
        if (selectedDateFilter === 'Last 7 Days') return diffDays >= 0 && diffDays <= 7;
        
        return true;
    });

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
            <header className="flex justify-between items-center gap-4 sm:flex-col animate-headerDrop">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] tracking-tight">Document Verification</h1>
                    <p className="text-[0.9rem] text-[#718096] font-medium">
                        Verify and approve documents submitted by Tele-Agents for active leads.
                    </p>
                </div>
                <div className="flex items-center gap-4 sm:w-full">
                    {/* Date Filter */}
                    <div className="relative min-w-[140px]">
                        <select
                            className="w-full bg-white border border-[#edf2f7] px-4 py-2 rounded-xl text-[13px] font-bold text-[#4a5568] outline-none hover:border-[#2447d7] focus:border-[#2447d7] transition-all appearance-none cursor-pointer pr-9 shadow-sm"
                            value={selectedDateFilter}
                            onChange={(e) => setSelectedDateFilter(e.target.value)}
                        >
                            {['All Time', 'Today', 'Yesterday', 'Last 7 Days'].map(opt => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-white px-4 py-2 border border-[#edf2f7] rounded-xl w-[280px] sm:w-full shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2.5" width="16" height="16">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none text-[13px] text-[#4a5568] w-full font-medium placeholder:text-[#cbd5e0]"
                            placeholder="Search leads, ID, business..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                </div>
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
                <div className="grid md:hidden gap-4 px-8 py-3.5 bg-[#f8fafc] border-b border-[#f1f5f9]" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.8fr) minmax(0, 1.5fr) minmax(0, 1.4fr) minmax(0, 1fr)' }}>
                    {['Lead ID / Client', 'Business Name', 'Assigned Agent', 'Verification Status', 'Actions'].map((h, i) => (
                        <div key={i} className={`text-[10px] font-black text-[#a0aec0] uppercase tracking-widest ${i === 4 ? 'text-center' : ''}`}>{h}</div>
                    ))}
                </div>

                <div className="flex flex-col divide-y divide-[#f7fafc]">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead, idx) => (
                        <div
                            key={lead.id}
                            className="grid md:flex md:flex-col gap-5 md:gap-4 px-8 py-5 items-center md:items-start hover:bg-[#f8faff] transition-all duration-200 border-b border-[#f7fafc] last:border-0 animate-rowIn"
                            style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.8fr) minmax(0, 1.5fr) minmax(0, 1.4fr) minmax(0, 1fr)', animationDelay: `${500 + idx * 60}ms`, animationFillMode: 'both' }}
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-[#2447d7] font-mono tracking-wider">{lead.leadId}</span>
                                <span className="text-[14px] font-bold text-[#1a202c]">{lead.name}</span>
                            </div>
                            
                            <div className="flex items-center min-w-0">
                                {lead.businessName ? (
                                    <span className="text-[11px] font-bold text-[#4a5568] uppercase tracking-wider truncate bg-[#f8faff] px-2.5 py-1 rounded-lg border border-[#edf2f7]">
                                        {lead.businessName}
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-medium text-[#cbd5e0] italic">Personal Lead</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-[#f0f4ff] flex items-center justify-center text-[10px] font-bold text-[#2447d7] border border-[#dfe7ff]">
                                    {lead.agentName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-[12px] font-semibold text-[#4a5568] truncate max-w-[120px]">{lead.agentName}</span>
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

                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleOpenModal(lead)}
                                    className="px-4 py-1.5 bg-[#2447d7] text-white rounded-lg text-[11px] font-black hover:bg-[#1732a3] transition-all shadow-[0_2px_8px_rgba(36,71,215,0.2)]"
                                >
                                    Manage Docs
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
                        <div className="w-16 h-16 bg-[#f8fafc] rounded-2xl flex items-center justify-center mb-4 text-[#cbd5e0]">
                            <IconDocs size={32} />
                        </div>
                        <h3 className="text-[15px] font-bold text-[#4a5568]">No matching leads found</h3>
                        <p className="text-[13px] text-[#a0aec0] mt-1">Try adjusting your search terms</p>
                    </div>
                )}
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
