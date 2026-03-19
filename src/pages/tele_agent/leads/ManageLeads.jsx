import React, { useState, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import EditLeadModal from './EditLeadModal';
import { IconUpload, IconAlert, IconCheck, IconDocs, IconPencil, IconTrash, IconUsers } from '../../../components/DocumentManagement/Icons';

import { INITIAL_MEMBERSHIPS, MOCK_LEAD_COUNTS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

const ITEMS_PER_PAGE = 5;

const ManageLeads = ({ onViewDetails, onSelectLender, isAccountsManager = false }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { users } = useUsers() || {};
    const { leads, setLeads } = useLeads();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [leadToReassign, setLeadToReassign] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState(null);
    const [uploadContext, setUploadContext] = useState(null);
    const [uploadingDocs, setUploadingDocs] = useState({});

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const handleOpenModal = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const handleUploadClick = (leadId, docId, docName, file) => {
        if (!file) return;
        const targetDocId = docId || Date.now();
        // Capture file info in local variables — avoids stale-closure bug when reading state later
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        const fileName = file.name;

        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                // Pass captured values directly — no stale closure on uploadingDocs state
                finishUpload(leadId, targetDocId, docName, previewUrl, fileName);
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);
    };

    const finishUpload = (leadId, targetDocId, docName, previewUrl, fileName) => {
        const today = new Date().toISOString().split('T')[0];
        const buildDoc = (existing) => existing
            ? { ...existing, status: 'Pending', date: today, url: previewUrl, fileName }
            : { id: targetDocId, type: docName, status: 'Pending', note: '', date: today, url: previewUrl, fileName };

        const updateDocList = (docs = []) => {
            const idx = docs.findIndex(d => d.id === targetDocId);
            return idx >= 0
                ? docs.map(d => d.id === targetDocId ? buildDoc(d) : d)
                : [...docs, buildDoc(null)];
        };

        setLeads(prev => prev.map(l =>
            l.id === leadId ? { ...l, documents: updateDocList(l.documents) } : l
        ));
        setSelectedLead(prev =>
            prev?.id === leadId ? { ...prev, documents: updateDocList(prev.documents) } : prev
        );

        setTimeout(() => {
            setUploadingDocs(prev => { const n = { ...prev }; delete n[targetDocId]; return n; });
        }, 500);
    };

    const handleDeleteDocument = (leadId, docId) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, documents: l.documents.filter(d => d.id !== docId) } : l));
        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: prev.documents.filter(d => d.id !== docId) } : prev);
    };

    const handleReassign = (leadId, newStaffId) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedStaffId: parseInt(newStaffId) } : l));
        setShowReassignModal(false);
        setLeadToReassign(null);
    };

    const handleEditLead = (lead) => {
        setLeadToEdit(lead);
        setShowEditModal(true);
    };

    const handleSaveEditedLead = (updatedLead) => {
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
        setShowEditModal(false);
        setLeadToEdit(null);
    };

    const handleDeleteLead = (lead) => {
        setLeadToDelete(lead);
        setShowDeleteModal(true);
    };

    const confirmDeleteLead = () => {
        if (leadToDelete) {
            setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
            setShowDeleteModal(false);
            setLeadToDelete(null);
        }
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>
            <div className="mb-8 animate-headerDrop">
                <div className="flex flex-col">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Manage Leads</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Track, organize and manage your customer leads efficiently.</p>
                </div>
            </div>

            <div className="flex gap-5 mb-8 flex-wrap lg:gap-4 sm:gap-3">
                {[
                    { label: 'Total Leads', value: MOCK_LEAD_COUNTS.total.toLocaleString() },
                    { label: 'New Today', value: MOCK_LEAD_COUNTS.newToday },
                    { label: 'Response Rate', value: MOCK_LEAD_COUNTS.responseRate }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-[16px_24px] sm:p-4 rounded-xl border border-[#edf2f7] flex flex-col gap-1 flex-1 min-w-[200px] lg:min-w-[calc(33.33%-14px)] md:min-w-[calc(50%-10px)] sm:min-w-[calc(50%-6px)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop" style={{ animationDelay: `${200 + i * 80}ms`, animationFillMode: 'both' }}>
                        <span className="text-[11px] sm:text-[9px] font-bold text-[#a0aec0] uppercase tracking-wider">{stat.label}</span>
                        <span className="text-[1.25rem] sm:text-[1rem] font-bold text-[#1a202c]">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden animate-slideUp [animation-delay:450ms] [animation-fill-mode:both]">
                <div className="p-6 flex justify-between items-center border-b border-[#f7fafc] flex-wrap gap-4 md:p-4">
                    <h2 className="text-lg font-bold text-[#1a202c]">Lead Directory</h2>
                    <div className="flex items-center gap-2.5 bg-[#f7fafc] px-4 py-2 border border-[#edf2f7] rounded-[10px] w-[300px] md:w-full">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" width="16" height="16">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none text-sm text-[#4a5568] w-full"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#fbfeff]">
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px] sm:p-3 sm:text-[10px]">Client / Business</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px] sm:hidden">EMAIL / PHONE</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px] sm:p-3 sm:text-[10px]">ASSIGNED TO</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px] sm:p-3 sm:text-[10px]">STATUS</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px] sm:p-3 sm:text-[10px]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedLeads.map((lead, idx) => (
                                <tr key={lead.id} className="hover:bg-[#fcfdfe] transition-colors border-b border-[#f7fafc] last:border-0 animate-rowIn" style={{ animationDelay: `${550 + idx * 50}ms`, animationFillMode: 'both' }}>
                                    <td className="p-[16px_24px] md:p-[12px_16px] sm:p-3">
                                        <div className="flex items-center gap-3 sm:gap-2">
                                            <div className="w-8 h-8 sm:w-6 sm:h-6 bg-[#f0f4ff] text-[#2447d7] rounded-lg flex items-center justify-center text-[11px] sm:text-[9px] font-bold">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm sm:text-[11px] font-bold text-[#1a202c] leading-tight">{lead.name}</span>
                                                {lead.businessName && <span className="text-[10px] sm:text-[8px] font-bold text-[#2447d7] uppercase tracking-wider">{lead.businessName}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px] sm:p-3 sm:hidden">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1a202c]">{lead.email}</span>
                                            <span className="text-xs text-[#a0aec0]">{lead.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px] sm:p-3">
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const staff = users?.find(u => u.id === lead.assignedStaffId);
                                                if (!staff) return <span className="text-[11px] text-[#a0aec0] italic">Unassigned</span>;
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm" style={{ backgroundColor: staff.textColor || '#2447d7' }}>
                                                            {staff.initials}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-[12px] font-bold text-[#1a202c] truncate">{staff.name}</span>
                                                            <span className="text-[9px] font-medium text-[#718096] uppercase tracking-wider">{staff.role}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px] sm:p-3">
                                        <div className="flex items-center">
                                            {(() => {
                                                const isDecisionMade = ['Loan Confirmed', 'Loan Rejected', 'Lender Selection'].includes(lead.status);
                                                const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                                const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                                const docCount = lead.documents?.length || 0;
                                                const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                                                // 1. Critical Rejection (Document or Loan level)
                                                if (hasRejected || lead.status === 'Loan Rejected') {
                                                    return (
                                                        <span className="inline-flex items-center gap-1 sm:gap-1 px-2 sm:px-1.5 py-1 rounded-full text-[9px] sm:text-[8px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm">
                                                            <IconAlert size={12} /> {lead.status === 'Document Verifications' ? 'Docs Rejected' : lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 2. Success / Post-Verification Stage
                                                if (lead.status === 'Loan Confirmed' || isAllVerified) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1 sm:gap-1 px-2 sm:px-1.5 py-1 rounded-full text-[9px] sm:text-[8px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm">
                                                            <IconCheck size={12} strokeWidth={3} /> {lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 3. Selection / Advanced Stage
                                                if (lead.status === 'Lender Selection') {
                                                    return (
                                                        <span className="inline-flex items-center gap-1 sm:gap-1 px-2 sm:px-1.5 py-1 rounded-full text-[9px] sm:text-[8px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                                                            <IconCheck size={12} strokeWidth={3} /> {lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 4. Collection / Pending Stage
                                                if (docCount > 0) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1 sm:gap-1 px-2 sm:px-1.5 py-1 rounded-full text-[9px] sm:text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(36,71,215,0.4)]" />
                                                            {lead.status === 'Document Collected' ? 'Docs' : lead.status} ({approvedCount}/{docCount})
                                                        </span>
                                                    );
                                                }

                                                // 4. Default / Missing Docs Stage
                                                return (
                                                    <span className="inline-flex items-center gap-1 sm:gap-1 px-2 sm:px-1.5 py-1 rounded-full text-[9px] sm:text-[8px] font-black uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                        {lead.status}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px] sm:p-3">
                                        <div className="flex items-center gap-2 sm:gap-1">
                                            <button 
                                                className="px-2 sm:px-1.5 py-1 sm:py-1 border border-[#edf2f7] rounded-lg text-[11px] sm:text-[9px] font-semibold text-[#2447d7] hover:bg-[#2447d7] hover:text-white transition-all duration-200" 
                                                onClick={() => onViewDetails(lead)}
                                            >
                                                Details
                                            </button>
                                            {!(lead.status === 'Document Verifications' && lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0) && !isAccountsManager && (
                                                <button 
                                                    className="p-1 sm:p-1 border border-[#edf2f7] rounded-lg text-[#2447d7] hover:bg-[#2447d7] hover:text-white transition-all duration-200"
                                                    title="Upload/Manage Documents"
                                                    onClick={() => handleOpenModal(lead)}
                                                >
                                                    <IconUpload size={16} />
                                                </button>
                                            )}
                                            {isAccountsManager && (
                                                <>
                                                    {['Document Verification Done', 'Lender Selection', 'Final Review'].includes(lead.stage) && onSelectLender && (
                                                        <button
                                                            className="px-2 py-1 text-[10px] font-semibold border border-[#e9d5ff] bg-[#f5f3ff] rounded-lg text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all duration-200 whitespace-nowrap"
                                                            title="Select Lender"
                                                            onClick={() => onSelectLender(lead)}
                                                        >
                                                            Lender
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-1 sm:p-0.5 border border-[#ebf0ff] bg-[#f0f4ff] rounded-lg text-[#2447d7] hover:bg-[#2447d7] hover:text-white transition-all duration-200"
                                                        title="Reassign Lead"
                                                        onClick={() => {
                                                            setLeadToReassign(lead);
                                                            setShowReassignModal(true);
                                                        }}
                                                    >
                                                        <IconUsers size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1 sm:p-0.5 border border-[#fee2e2] bg-[#fef2f2] rounded-lg text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all duration-200"
                                                        title="Delete Lead"
                                                        onClick={() => handleDeleteLead(lead)}
                                                    >
                                                        <IconTrash size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-[20px_24px] flex justify-between items-center bg-[#fdfdfd] border-t border-[#f7fafc] sm:flex-col sm:gap-4">
                    <span className="text-sm text-[#718096] font-medium">
                        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length} leads
                    </span>
                    <div className="flex gap-2.5 sm:w-full">
                        <button 
                            className="bg-white border border-[#e2e8f0] px-4 py-2 rounded-lg text-sm font-semibold text-[#4a5568] hover:bg-[#f7fafc] disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1" 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1 || filteredLeads.length === 0}
                        >
                            Previous
                        </button>
                        <button 
                            className="bg-white border border-[#e2e8f0] px-4 py-2 rounded-lg text-sm font-semibold text-[#4a5568] hover:bg-[#f7fafc] disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1" 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages || filteredLeads.length === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <UploadModal 
                    client={selectedLead}
                    onClose={() => setShowModal(false)}
                    onUpload={handleUploadClick}
                    onDelete={handleDeleteDocument}
                    onApprove={(leadId, docId) => {
                        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, documents: (l.documents || []).map(d => d.id === docId ? { ...d, status: 'Approved' } : d) } : l));
                        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: (prev.documents || []).map(d => d.id === docId ? { ...d, status: 'Approved' } : d) } : prev);
                    }}
                    onReject={(leadId, docId, reason) => {
                        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, documents: (l.documents || []).map(d => d.id === docId ? { ...d, status: 'Rejected', note: reason } : d) } : l));
                        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: (prev.documents || []).map(d => d.id === docId ? { ...d, status: 'Rejected', note: reason } : d) } : prev);
                    }}
                    uploadingDocs={uploadingDocs}
                    isDark={isDark}
                    isAccountsManager={isAccountsManager}
                />
            )}
            {showReassignModal && leadToReassign && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" onClick={() => setShowReassignModal(false)}>
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#1a202c]">Reassign Lead</h3>
                            <button onClick={() => setShowReassignModal(false)} className="text-[#a0aec0] hover:text-[#1a202c] transition-colors text-2xl font-light">&times;</button>
                        </div>
                        <div className="p-8">
                            <p className="text-sm text-[#718096] mb-6">Assign <span className="font-bold text-[#1a202c]">{leadToReassign.name}</span> to a Team:</p>
                            <div className="flex flex-col gap-6">
                                <div className="max-h-[400px] overflow-y-auto flex flex-col gap-8 pr-2 custom-scrollbar">
                                    {users?.filter(u => u.role === 'Team Leader').map(leader => {
                                        const teamMembers = INITIAL_MEMBERSHIPS[leader.id] || [];
                                        return (
                                            <div key={leader.id} className="flex flex-col gap-3">
                                                {/* Team Leader Header */}
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-[#2447d7] uppercase tracking-[2px] bg-[#f0f4ff] px-2 py-0.5 rounded">Team: {leader.name}</span>
                                                    <div className="h-[1px] flex-1 bg-[#f1f5f9]"></div>
                                                </div>

                                                {/* Leader Card */}
                                                <button
                                                    onClick={() => handleReassign(leadToReassign.id, leader.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${leadToReassign.assignedStaffId === leader.id ? 'border-[#2447d7] bg-[#f0f4ff] shadow-sm' : 'border-[#f1f5f9] hover:border-[#2447d7]/30 hover:bg-[#fcfdfe]'}`}
                                                >
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white shadow-sm" style={{ backgroundColor: leader.textColor || '#2447d7' }}>
                                                        {leader.initials}
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <span className={`text-[14px] font-black truncate ${leadToReassign.assignedStaffId === leader.id ? 'text-[#2447d7]' : 'text-[#1a202c]'}`}>{leader.name}</span>
                                                        <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">Team Leader</span>
                                                    </div>
                                                    {leadToReassign.assignedStaffId === leader.id && (
                                                        <div className="w-6 h-6 bg-[#2447d7] text-white rounded-full flex items-center justify-center">
                                                            <IconCheck size={14} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>

                                                {/* Team Members Grid */}
                                                <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-[#f1f5f9]">
                                                    {teamMembers.map(member => (
                                                        <button
                                                            key={member.id}
                                                            onClick={() => handleReassign(leadToReassign.id, member.id)}
                                                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${leadToReassign.assignedStaffId === member.id ? 'border-[#2447d7] bg-[#f0f4ff]' : 'border-transparent hover:bg-[#f8fafc]'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: member.color || '#94a3b8' }}>
                                                                {member.initials}
                                                            </div>
                                                            <div className="flex flex-col min-w-0 flex-1">
                                                                <span className={`text-[13px] font-bold truncate ${leadToReassign.assignedStaffId === member.id ? 'text-[#2447d7]' : 'text-[#4a5568]'}`}>{member.name}</span>
                                                                <span className="text-[9px] font-semibold text-[#a0aec0] uppercase">Tele Agent</span>
                                                            </div>
                                                            {leadToReassign.assignedStaffId === member.id && (
                                                                <div className="w-5 h-5 bg-[#2447d7] text-white rounded-full flex items-center justify-center">
                                                                    <IconCheck size={12} strokeWidth={3} />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-end gap-3">
                            <button onClick={() => setShowReassignModal(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-[#718096] hover:bg-white transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && leadToDelete && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" onClick={() => setShowDeleteModal(false)}>
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp text-center" onClick={e => e.stopPropagation()}>
                        <div className="p-8 pb-6 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                                <IconTrash size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a202c] mb-2">Delete Lead?</h3>
                                <p className="text-sm text-[#718096]">
                                    Are you sure you want to delete <strong className="text-[#1a202c]">{leadToDelete.name}</strong>? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-center gap-3">
                            <button 
                                onClick={() => setShowDeleteModal(false)} 
                                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-bold text-[#4a5568] border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDeleteLead} 
                                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <EditLeadModal 
                isOpen={showEditModal} 
                onClose={() => {
                    setShowEditModal(false);
                    setLeadToEdit(null);
                }} 
                lead={leadToEdit} 
                onSave={handleSaveEditedLead} 
            />
        </div>
    );
};

export default ManageLeads;
