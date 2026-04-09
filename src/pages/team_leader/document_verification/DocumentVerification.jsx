import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import { IconAlert, IconCheck, IconDocs } from '../../../components/DocumentManagement/Icons';

import { useLeads } from '../../../context/LeadsContext';

const DocumentVerification = () => {
    const { leads, updateLead } = useLeads();
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDateFilter, setSelectedDateFilter] = useState('All Time');
    const [uploadingDocs, setUploadingDocs] = useState({});

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
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;
        const newDocs = lead.documents.map(doc => doc.id === docId ? { ...doc, status: 'Approved' } : doc);
        const allApproved = newDocs.length > 0 && newDocs.every(d => d.status === 'Approved');
        
        const updates = {
            documents: newDocs,
            ...(allApproved && lead.stage === 'Document Collection' ? {
                stage: 'Document Verification Done',
                status: 'Document Verification Done',
                progress: 40,
            } : {})
        };
        
        updateLead(leadId, updates);
        if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, ...updates });
    };

    const handleRejectDoc = (leadId, docId, reason) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;
        const newDocs = lead.documents.map(doc => doc.id === docId ? { ...doc, status: 'Rejected', note: reason } : doc);
        
        updateLead(leadId, { documents: newDocs });
        if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, documents: newDocs });
    };

    const handleUploadClick = (leadId, docId, docName, file) => {
        if (!file) return;
        const targetDocId = docId || Date.now();
        const previewUrl = URL.createObjectURL(file);
        const fileName = file.name;
        const fileType = file.type;

        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                finishUpload(leadId, targetDocId, docName, previewUrl, fileName, fileType);
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);
    };

    const finishUpload = (leadId, targetDocId, docName, previewUrl, fileName, fileType) => {
        const today = new Date().toISOString().split('T')[0];
        const buildDoc = (existing) => existing
            ? { ...existing, status: 'Pending', date: today, url: previewUrl, fileName, fileType }
            : { id: targetDocId, type: docName, status: 'Pending', note: '', date: today, url: previewUrl, fileName, fileType };

        const updateDocList = (docs = []) => {
            const idx = docs.findIndex(d => d.id === targetDocId);
            return idx >= 0
                ? docs.map(d => d.id === targetDocId ? buildDoc(d) : d)
                : [...docs, buildDoc(null)];
        };

        const currentLead = leads.find(l => l.id === leadId);
        if (currentLead) {
            updateLead(leadId, { documents: updateDocList(currentLead.documents) });
        }
        
        setSelectedLead(prev =>
            prev?.id === leadId ? { ...prev, documents: updateDocList(prev.documents) } : prev
        );

        setTimeout(() => {
            setUploadingDocs(prev => { const n = { ...prev }; delete n[targetDocId]; return n; });
        }, 500);
    };

    const handleDeleteDocument = (leadId, docId) => {
        const currentLead = leads.find(l => l.id === leadId);
        if (currentLead) {
            updateLead(leadId, { documents: currentLead.documents.filter(d => d.id !== docId) });
        }
        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: prev.documents.filter(d => d.id !== docId) } : prev);
    };

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

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif] p-2 ${isDark ? '' : ''}`}>
            {/* ── KPI Cards (Dashboard Style Tiles) ── */}
            <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                {[
                    { 
                        label: 'Leads in Queue', 
                        value: stats.totalLeads.toString().padStart(2, '0'), 
                        colorClass: 'text-blue-700 dark:text-blue-300',
                        bgClass: 'bg-blue-100/40 dark:bg-[#1c2340]',
                        borderClass: 'border-blue-200 dark:border-blue-500/30',
                        iconBg: 'bg-blue-600',
                        labelClass: 'text-blue-600 dark:text-blue-400',
                        icon: <IconDocs width="24" height="24" />, 
                    },
                    { 
                        label: 'Pending Review', 
                        value: stats.pendingReview.toString().padStart(2, '0'), 
                        colorClass: 'text-orange-700 dark:text-orange-300',
                        bgClass: 'bg-orange-100/40 dark:bg-[#2a1f1a]',
                        borderClass: 'border-orange-200 dark:border-orange-500/30',
                        iconBg: 'bg-orange-500',
                        labelClass: 'text-orange-600 dark:text-orange-400',
                        icon: <IconAlert width="24" height="24" />, 
                    },
                    { 
                        label: 'Fully Verified', 
                        value: stats.fullyVerified.toString().padStart(2, '0'), 
                        colorClass: 'text-emerald-700 dark:text-emerald-300',
                        bgClass: 'bg-emerald-100/40 dark:bg-[#182724]',
                        borderClass: 'border-emerald-200 dark:border-emerald-500/30',
                        iconBg: 'bg-emerald-500',
                        labelClass: 'text-emerald-600 dark:text-emerald-400',
                        icon: <IconCheck width="24" height="24" strokeWidth={3} />, 
                    },
                ].map((card, i) => (
                    <div
                        key={card.label}
                        className={`rounded-2xl border p-4 flex flex-col justify-center items-center gap-1.5 shadow-sm hover:-translate-y-0.5 transition-transform cursor-default text-center ${card.bgClass} ${card.borderClass}`}
                    >
                        <div className={`w-11 h-11 rounded-full ${card.iconBg} text-white flex items-center justify-center mb-0.5 shadow-md`}>
                            {card.icon}
                        </div>
                        <h2 className={`text-3xl font-black leading-none ${card.colorClass}`}>
                            {card.value}
                        </h2>
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${card.labelClass}`}>
                            {card.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Controls Bar ── */}
            <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'} border shadow-sm`}>
                <div className="flex items-center gap-4 flex-1">
                    {/* Date Filter */}
                    <div className="relative min-w-[150px]">
                        <select
                            className={`w-full px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest outline-none hover:border-[#0061ff] focus:border-[#0061ff] transition-all appearance-none cursor-pointer pr-9 shadow-sm ${isDark ? 'bg-[#141829] border-[#2c3568] text-white' : 'bg-[#f8f9fa] border-slate-100 text-slate-700'}`}
                            value={selectedDateFilter}
                            onChange={(e) => setSelectedDateFilter(e.target.value)}
                        >
                            {['All Time', 'Today', 'Yesterday', 'Last 7 Days'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl w-full max-w-md shadow-sm ${isDark ? 'bg-[#141829] border-[#2c3568]' : 'bg-[#f8f9fa] border-slate-100'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#6b7280' : '#a0aec0'} strokeWidth="2.5" width="16" height="16">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className={`bg-transparent border-none outline-none text-[13px] w-full font-bold ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-300'}`}
                            placeholder="SEARCH LEADS, ID, BUSINESS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Leads Table ── */}
            <div className={`rounded-3xl border shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`bg-slate-50 dark:bg-slate-800/80 border-b ${isDark ? 'border-[#2c3568]' : 'border-slate-100'}`}>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead ID / Client</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Agent</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {filteredLeads.length > 0 ? (
                                filteredLeads.map((lead, idx) => (
                                    <tr
                                        key={lead.id}
                                        className={`group transition-all duration-200 ${isDark ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/40'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`text-[10px] font-black font-mono tracking-wider ${isDark ? 'text-blue-400' : 'text-[#0061ff]'}`}>{lead.leadId}</span>
                                                <span className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.name}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            {lead.businessName ? (
                                                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${isDark ? 'bg-[#1a1f35] text-slate-400 border-[#2c3568]' : 'bg-[#f8faff] text-slate-600 border-slate-100'}`}>
                                                    {lead.businessName}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-medium italic text-slate-400">Personal Lead</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border ${isDark ? 'bg-blue-900/30 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-[#0061ff] border-blue-100'}`}>
                                                    {lead.agentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className={`text-[12px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.agentName}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {(() => {
                                                const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                                const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                                const docCount = lead.documents?.length || 0;
                                                const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                                                if (hasRejected) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                            Docs Rejected
                                                        </span>
                                                    );
                                                }
                                                if (isAllVerified) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                                                            <IconCheck size={10} strokeWidth={4} />
                                                            Fully Verified
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        Checking ({approvedCount}/{docCount})
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenModal(lead)}
                                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 text-white' : 'bg-[#0061ff] text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30'}`}
                                            >
                                                Manage Docs
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20">
                                        <div className="flex flex-col items-center justify-center animate-fadeIn">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-[#1a1f35] text-slate-500' : 'bg-slate-50 text-slate-300'}`}>
                                                <IconDocs width={32} height={32} />
                                            </div>
                                            <h3 className={`text-[15px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No matching leads found</h3>
                                            <p className={`text-[11px] mt-1 font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting your search terms</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <UploadModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    client={selectedLead}
                    onUpload={handleUploadClick}
                    onDelete={handleDeleteDocument}
                    onApprove={handleApproveDoc}
                    onReject={handleRejectDoc}
                    uploadingDocs={uploadingDocs}
                    isDark={isDark}
                    isTeamLeader={true}
                />
            )}
        </div>
    );
};

export default DocumentVerification;
