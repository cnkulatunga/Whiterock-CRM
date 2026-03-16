import React, { useState, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import { IconUpload, IconAlert, IconCheck, IconDocs } from '../../../components/DocumentManagement/Icons';

const MOCK_LEADS = [
    { id: 1, name: 'Robert Miller', email: 'robert@example.com', phone: '+1 234-567-890', source: 'Website Form', status: 'Document Collected', lastContact: '2 hours ago', stage: 'Initial', 
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Approved', note: 'Verified by SG', date: '2024-03-15' },
            { id: 2, type: 'Payslip', status: 'Approved', note: 'Clear copy', date: '2024-03-15' },
            { id: 3, type: 'ID Document', status: 'Pending', note: '', date: '2024-03-16' }
        ] 
    },
    { id: 2, name: 'Alice Huang', email: 'alice.h@gmail.com', phone: '+1 987-654-321', source: 'Referral', status: 'Document Verifications', lastContact: 'Today, 10:30 AM', stage: 'In Progress',
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Rejected', note: 'Period missing', date: '2024-03-14' },
            { id: 2, type: 'Payslip', status: 'Missing', note: '', date: '' }
        ]
    },
    { id: 3, name: 'David Rivera', email: 'd.rivera@outlook.com', phone: '+1 456-123-789', source: 'LinkedIn', status: 'Lender Selection', lastContact: 'Yesterday', stage: 'In Progress', documents: [] },
    { id: 4, name: 'Sarah Connor', email: 'sconnor@tech.co', phone: '+1 555-010-999', source: 'Direct Call', status: 'Loan Rejected', lastContact: 'Mar 04, 2024', stage: 'Lost', documents: [] },
    { id: 5, name: 'Michael Chen', email: 'm.chen@sales.com', phone: '+1 888-222-333', source: 'Facebook Ads', status: 'Loan Confirmed', lastContact: '3 days ago', stage: 'Closed', documents: [] },
    { id: 6, name: 'Emma Watson', email: 'emma@watson.inc', phone: '+1 777-555-444', source: 'Webinar', status: 'Document Verifications', lastContact: 'Feb 28, 2024', stage: 'In Progress', documents: [] },
];

const ITEMS_PER_PAGE = 5;

const ManageLeads = ({ onViewDetails }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const fileInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [leads, setLeads] = useState(MOCK_LEADS);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    const handleUploadClick = (leadId, docId, docName) => {
        setUploadContext({ leadId, docId, docName });
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !uploadContext) return;

        const { leadId, docId, docName } = uploadContext;
        const targetDocId = docId || Date.now();
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                finishUpload(leadId, targetDocId, docName);
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);

        setUploadContext(null);
        e.target.value = '';
    };

    const finishUpload = (leadId, targetDocId, docName) => {
        const docInfo = uploadingDocs[targetDocId];
        const updateDocList = (docs) => {
            const exists = docs.find(d => d.id === targetDocId);
            if (exists) {
                return docs.map(d => d.id === targetDocId ? { ...d, status: 'Pending', date: new Date().toISOString().split('T')[0], url: docInfo?.previewUrl, fileName: docInfo?.file?.name } : d);
            }
            return [...docs, { id: targetDocId, type: docName, status: 'Pending', note: '', date: new Date().toISOString().split('T')[0], url: docInfo?.previewUrl, fileName: docInfo?.file?.name }];
        };

        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, documents: updateDocList(l.documents || []) } : l));
        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: updateDocList(prev.documents || []) } : prev);
        
        setTimeout(() => {
            setUploadingDocs(prev => {
                const next = { ...prev };
                delete next[targetDocId];
                return next;
            });
        }, 500);
    };

    const handleDeleteDocument = (leadId, docId) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, documents: l.documents.filter(d => d.id !== docId) } : l));
        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: prev.documents.filter(d => d.id !== docId) } : prev);
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.png,.doc,.docx" />
            <div className="mb-8 animate-headerDrop">
                <div className="flex flex-col">
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Manage Leads</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Track, organize and manage your customer leads efficiently.</p>
                </div>
            </div>

            <div className="flex gap-5 mb-8 flex-wrap lg:gap-4 sm:gap-3">
                {[
                    { label: 'Total Leads', value: '1,284' },
                    { label: 'New Today', value: '12' },
                    { label: 'Response Rate', value: '94%' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-[16px_24px] rounded-xl border border-[#edf2f7] flex flex-col gap-1 flex-1 min-w-[200px] lg:min-w-[calc(33.33%-14px)] md:min-w-[calc(50%-10px)] sm:min-w-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-kpiPop" style={{ animationDelay: `${200 + i * 80}ms`, animationFillMode: 'both' }}>
                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">{stat.label}</span>
                        <span className="text-[1.25rem] font-bold text-[#1a202c]">{stat.value}</span>
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
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px]">LEAD NAME</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px]">EMAIL / PHONE</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px]">STATUS</th>
                                <th className="text-left p-[16px_24px] text-xs font-bold text-[#a0aec0] border-b border-[#f7fafc] uppercase tracking-wider md:p-[12px_16px]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedLeads.map((lead, idx) => (
                                <tr key={lead.id} className="hover:bg-[#fcfdfe] transition-colors border-b border-[#f7fafc] last:border-0 animate-rowIn" style={{ animationDelay: `${550 + idx * 50}ms`, animationFillMode: 'both' }}>
                                    <td className="p-[16px_24px] md:p-[12px_16px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#f0f4ff] text-[#2447d7] rounded-lg flex items-center justify-center text-[11px] font-bold">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-bold text-[#1a202c]">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px]">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1a202c]">{lead.email}</span>
                                            <span className="text-xs text-[#a0aec0]">{lead.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px]">
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
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm">
                                                            <IconAlert size={12} /> {lead.status === 'Document Verifications' ? 'Docs Rejected' : lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 2. Success / Post-Verification Stage
                                                if (lead.status === 'Loan Confirmed' || isAllVerified) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm">
                                                            <IconCheck size={12} strokeWidth={3} /> {lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 3. Selection / Advanced Stage
                                                if (lead.status === 'Lender Selection') {
                                                    return (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                                                            <IconCheck size={12} strokeWidth={3} /> {lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 4. Collection / Pending Stage
                                                if (docCount > 0) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(36,71,215,0.4)]" />
                                                            {lead.status} ({approvedCount}/{docCount})
                                                        </span>
                                                    );
                                                }

                                                // 4. Default / Missing Docs Stage
                                                return (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                        {lead.status}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    <td className="p-[16px_24px] md:p-[12px_16px]">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                className="px-3 py-1.5 border border-[#edf2f7] rounded-lg text-[13px] font-semibold text-[#2447d7] hover:bg-[#2447d7] hover:text-white transition-all duration-200" 
                                                onClick={() => onViewDetails(`WR-2026-${String(lead.id).padStart(4, '0')}`)}
                                            >
                                                Details
                                            </button>
                                            <button 
                                                className="p-1.5 border border-[#edf2f7] rounded-lg text-[#2447d7] hover:bg-[#2447d7] hover:text-white transition-all duration-200"
                                                title="Upload/Manage Documents"
                                                onClick={() => handleOpenModal(lead)}
                                            >
                                                <IconUpload size={18} />
                                            </button>
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
                    uploadingDocs={uploadingDocs}
                    isDark={isDark}
                />
            )}
        </div>
    );
};

export default ManageLeads;
