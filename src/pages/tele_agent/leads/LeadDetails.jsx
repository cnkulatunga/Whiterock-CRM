import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useReminders } from '../../../hooks/useReminders';
import { canManageTask } from '../../../utils/permissionUtils';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import { IconDocs, IconCheck, IconAlert, IconEye, IconPencil } from '../../../components/DocumentManagement/Icons';
import EditLeadModal from './EditLeadModal';
import { useTasks } from '../../../context/TasksContext';
import { useLeads } from '../../../context/LeadsContext';

const LeadDetails = ({ lead: initialLead, onBack, tasks = [], setTasks }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { updateLead } = useLeads();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const safeRole = (currentUser.role || '').toLowerCase();
    const isManagerOrAbove = safeRole.includes('manager') || safeRole.includes('admin');
    const isTeamLeader = safeRole.includes('leader');
    const canApproveReject = isManagerOrAbove || isTeamLeader;
    
    // Use initialLead or a fallback
    const [lead, setLead] = useState(initialLead || { 
        id: 'WR-2026-0000', 
        name: 'Guest Lead', 
        businessName: '',
        email: 'no-email@example.com', 
        phone: 'N/A', 
        documents: [] 
    });

    const leadId = lead.id?.toString().startsWith('WR-') ? lead.id : `WR-2026-${String(lead.id).padStart(4, '0')}`;
    const leadName = lead.name;
    const leadTasks = tasks.filter(t => t.lead === leadName || t.leadId === leadId);

    const [isAddingTask, setIsAddingTask] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [uploadingDocs, setUploadingDocs] = useState({});
    const [previewDoc, setPreviewDoc] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const { addTask, updateTask } = useTasks();

    const handleUpload = (leadId, docId, docName, file) => {
        const targetDocId = docId || Date.now();
        // Capture locally to avoid stale-closure on state reads
        const previewUrl = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        const fileName = file?.name || docName;
        const today = new Date().toISOString().split('T')[0];

        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                const newDoc = { id: targetDocId, type: docName, status: 'Pending', note: '', date: today, url: previewUrl, fileName };
                setLead(prev => {
                    const exists = prev.documents.find(d => d.id === targetDocId);
                    const newDocs = exists
                        ? prev.documents.map(d => d.id === targetDocId ? { ...newDoc, ...d, status: 'Pending', url: previewUrl, fileName } : d)
                        : [...prev.documents, newDoc];
                    const updated = { ...prev, documents: newDocs };
                    // Sync to global context so Document Verification and Lead Monitoring see the change
                    updateLead(prev.id, { documents: newDocs });
                    return updated;
                });
                setUploadingDocs(prev => { const n = { ...prev }; delete n[targetDocId]; return n; });
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);
    };
    const [newTask, setNewTask] = useState({
        title: '',
        lead: leadName,
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none',
        message: ''
    });

    const handleAddTask = (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const taskToAdd = {
            ...newTask,
            id: Date.now(),
            status: 'Pending',
            lead: lead.name,
            leadId: leadId,
            assignedTo: currentUser.id?.toString() || 'Self',
            createdBy: currentUser.role || 'System',
            creatorId: currentUser.id
        };
        
        addTask(taskToAdd);
        setIsAddingTask(false);
        setNewTask({
            title: '',
            lead: leadName,
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            type: 'Call',
            reminder: 'none',
            message: ''
        });
    };

    const updateTaskStatus = (id, newStatus) => {
        updateTask({ ...tasks.find(t => t.id === id), status: newStatus });
    };

    const updateTaskReminder = (id, newReminder) => {
        updateTask({ ...tasks.find(t => t.id === id), reminder: newReminder });
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">
            {/* ── HEADER ── */}
            <div className="flex justify-between items-center mb-2 md:flex-col md:items-start md:gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20" className="text-gray-600"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-xl">Lead: {leadId}</h1>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-[#718096] flex-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Created on Oct 24, 2023 • Assigned to <strong className="text-[#1a202c]">Sarah Jenkins</strong>
                    </p>
                </div>
            </div>

            {/* ── PROGRESS TRACKER ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] p-8 px-12 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-x-auto md:p-6 md:px-4 md:mx-[-12px] md:rounded-none">
                <div className="flex items-start justify-between min-w-[750px] sm:min-w-[600px]">
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="14" height="14">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold text-[#10b981] text-center uppercase tracking-tight max-w-[80px] sm:text-[9px]">Document Collected</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#10b981] mt-[15px] min-w-[15px]"></div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-8 h-8 bg-[#2447d7] rounded-full border-[4px] border-[#ebf0ff]"></div>
                        <span className="text-[10px] font-bold text-[#2447d7] text-center uppercase tracking-tight max-w-[80px] sm:text-[9px]">Document Verification Done</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#edf2f7] mt-[15px] min-w-[15px]"></div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-3.5 h-3.5 bg-[#edf2f7] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#edf2f7] mt-[9px]"></div>
                        <span className="text-[10px] font-bold text-[#a0aec0] text-center uppercase tracking-tight max-w-[80px] sm:text-[9px]">Lender Selection</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#edf2f7] mt-[15px] min-w-[15px]"></div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-3.5 h-3.5 bg-[#edf2f7] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#edf2f7] mt-[9px]"></div>
                        <span className="text-[10px] font-bold text-[#a0aec0] text-center uppercase tracking-tight max-w-[80px] sm:text-[9px]">Loan Confirmed</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#edf2f7] mt-[15px] min-w-[15px]"></div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-3.5 h-3.5 bg-[#edf2f7] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#edf2f7] mt-[9px]"></div>
                        <span className="text-[10px] font-bold text-[#a0aec0] text-center uppercase tracking-tight max-w-[80px] sm:text-[9px]">Loan Rejected</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-6 lg:grid-cols-1">
                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col gap-6">
                    {/* Lead Details Info */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between p-5 border-b border-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#ebf0ff] text-[#2447d7] rounded-lg flex items-center justify-center flex-shrink-0"><IconInfo /></span>
                                <h3 className="text-base font-bold text-[#1a202c]">Lead Details</h3>
                            </div>
                            {isManagerOrAbove && (
                                <button 
                                    onClick={() => setShowEditModal(true)}
                                    className="bg-[#f0f4ff] text-[#2447d7] p-1.5 px-3 rounded-lg text-xs font-bold hover:bg-[#2447d7] hover:text-white transition-all flex items-center gap-1.5"
                                >
                                    <IconPencil size={14} /> Edit
                                </button>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">LEAD ID</label>
                                    <div className="flex items-center gap-2.5 bg-[#f8fafc] border border-[#edf2f7] p-[10px_16px] rounded-xl text-sm font-semibold text-[#4a5568] w-fit">
                                        <IconInfo />
                                        <span>{leadId}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">CUSTOMER NAME</label>
                                    <div className="text-2xl font-bold text-[#1a202c] tracking-tight sm:text-xl">{leadName}</div>
                                </div>

                                {lead.businessName && (
                                    <div className="flex flex-col gap-2 col-span-2 bg-[#f0f4ff]/40 p-3 rounded-xl border border-[#dfe7ff]/50">
                                        <label className="text-[10px] font-bold text-[#2447d7] uppercase tracking-wider">BUSINESS NAME</label>
                                        <div className="text-base font-bold text-[#2447d7]">{lead.businessName}</div>
                                    </div>
                                )}
                                
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">AMOUNT NEEDED</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.amount || 'N/A'}</div>
                                </div>
                                
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">LOAN PURPOSE</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.loanPurpose || 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">INDUSTRY</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.industry || 'N/A'}</div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">LEAD SOURCE</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.leadSource || 'N/A'}</div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">FUNDING TIMELINE</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.fundingTimeline || 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">JOB TITLE</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.jobTitle || 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">COMPANY HOUSE NO.</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.companyHouseNumber || 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">ANNUAL TURNOVER</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.businessAnnualTurnover ? `£${lead.businessAnnualTurnover}` : 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">EXISTING LOAN</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.existingLoan === 'Yes' ? `Yes (${lead.existingLoanAmount ? '£' + lead.existingLoanAmount : 'Amount Unspecified'})` : 'No'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">COMPANY BANK</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.companyBank || 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">PREF. CONTACT</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.preferredContactMethod?.length > 0 ? lead.preferredContactMethod.join(', ') : 'N/A'}</div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">HOME OWNER</label>
                                    <div className="text-sm font-bold text-[#1a202c]">{lead.homeOwner || 'N/A'}</div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">EMAIL ADDRESS</label>
                                    <div className="flex items-center gap-2.5 p-[10px_12px] bg-white border border-[#edf2f7] rounded-xl cursor-pointer hover:border-[#2447d7] hover:bg-[#f0f4ff] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(36,71,215,0.08)] transition-all">
                                        <div className="w-7 h-7 bg-[#ebf0ff] text-[#2447d7] rounded-lg flex items-center justify-center shrink-0"><IconEmail /></div>
                                        <span className="text-[13px] font-semibold text-[#4a5568] break-all leading-tight">{lead.email || 'no-email@example.com'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">PHONE NUMBER</label>
                                    <div className="flex items-center gap-2.5 p-[10px_12px] bg-white border border-[#edf2f7] rounded-xl cursor-pointer hover:border-[#2447d7] hover:bg-[#ecfdf5] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)] transition-all">
                                        <div className="w-7 h-7 bg-[#ecfdf5] text-[#10b981] rounded-lg flex items-center justify-center shrink-0"><IconPhone /></div>
                                        <span className="text-[13px] font-semibold text-[#4a5568] leading-tight">{lead.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lead Notes & Context */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3 p-5 border-b border-[#f7fafc]">
                            <span className="w-8 h-8 bg-[#fff1f2] text-[#f43f5e] rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconInfo />
                            </span>
                            <h3 className="text-base font-bold text-[#1a202c]">Notes & Context</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">ADDITIONAL COMMENTARY</label>
                                <div className="bg-[#fffcfc] border border-dashed border-[#fecaca] p-4 rounded-xl text-[13px] text-[#4a5568] leading-relaxed italic">
                                    {lead.notes || 'No additional notes provided for this lead.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col gap-6">
                    {/* Documents section */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center p-5 border-b border-[#f7fafc] gap-3 sm:flex-col sm:items-start">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#f3e8ff] text-[#7c3aed] rounded-lg flex items-center justify-center flex-shrink-0"><IconDocs /></span>
                                <h3 className="text-base font-bold text-[#1a202c]">Documents & Verification</h3>
                            </div>
                            {!(lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0) && (
                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="bg-[#2447d7] text-white p-1.5 px-4 rounded-lg text-xs font-bold hover:bg-[#1a36b1] transition-all shadow-sm"
                                >
                                    Manage Docs
                                </button>
                            )}
                        </div>
                        <div className="p-8 pb-10 flex flex-col items-center justify-center text-center gap-4">
                            {(() => {
                                const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                const docCount = lead.documents?.length || 0;
                                const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                                if (hasRejected || lead.status === 'Loan Rejected') {
                                    return (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm animate-pulse">
                                                <IconAlert size={14} /> {lead.status === 'Document Verifications' ? 'Docs Rejected' : lead.status}
                                            </span>
                                            <p className="text-[11px] text-[#718096] font-medium leading-relaxed max-w-[200px]">
                                                {lead.status === 'Loan Rejected' ? 'This loan application has been declined.' : 'Some documents were rejected. Please review and re-upload.'}
                                            </p>
                                        </div>
                                    );
                                }
                                if (lead.status === 'Loan Confirmed' || isAllVerified) {
                                    return (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm text-center">
                                                <IconCheck size={14} strokeWidth={3} /> {lead.status === 'Loan Confirmed' ? 'Loan Confirmed' : 'Fully Verified'}
                                            </span>
                                            <p className="text-[11px] text-[#718096] font-medium leading-relaxed max-w-[200px]">
                                                {lead.status === 'Loan Confirmed' ? 'The loan has been successfully approved and confirmed.' : 'All submitted documents have been approved by the Team Leader.'}
                                            </p>
                                        </div>
                                    );
                                }
                                if (lead.status === 'Lender Selection') {
                                    return (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                                                <IconCheck size={14} strokeWidth={3} /> Lender Selection
                                            </span>
                                            <p className="text-[11px] text-[#718096] font-medium leading-relaxed max-w-[200px]">Lead is currently in the lender selection phase.</p>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(36,71,215,0.4)]" />
                                            Checking ({approvedCount}/{docCount})
                                        </span>
                                        <p className="text-[11px] text-[#718096] font-medium leading-relaxed max-w-[200px]">Document verification is currently in progress.</p>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Inline Document List */}
                        {lead.documents?.length > 0 && (
                            <div className="px-5 pb-6">
                                <div className="bg-[#f8fafc] rounded-xl border border-[#edf2f7] overflow-hidden">
                                    <div className="p-3 px-4 bg-[#f1f5f9]/50 border-b border-[#edf2f7]">
                                        <span className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">
                                            {lead.status === 'Loan Confirmed' ? 'CONFIRMED DOCUMENTS' : 'SUBMITTED DOCUMENTS'}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-[#edf2f7]">
                                        {lead.documents.map(doc => (
                                            <div key={doc.id} className="p-3 px-4 flex items-center justify-between hover:bg-white transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.status === 'Approved' ? 'bg-[#ecfdf5] text-[#10b981]' : doc.status === 'Rejected' ? 'bg-[#fff1f2] text-[#f43f5e]' : 'bg-[#f0f4ff] text-[#2447d7]'}`}>
                                                        <IconFile size={16} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#1a202c]">{doc.type}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-tight ${doc.status === 'Approved' ? 'text-[#10b981]' : doc.status === 'Rejected' ? 'text-[#f43f5e]' : 'text-[#718096]'}`}>
                                                            {lead.status === 'Loan Confirmed' && doc.status === 'Approved' ? 'Confirmed' : doc.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                {!(doc.status === 'Approved' && !canApproveReject) && (
                                                    <button 
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="p-1.5 text-[#2447d7] hover:bg-[#2447d7]/10 rounded-lg transition-colors border border-[#2447d7]/10"
                                                        title="View Document"
                                                    >
                                                        <IconEye size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tasks & Follow-ups Section */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center p-5 border-b border-[#f7fafc] gap-3 sm:flex-col sm:items-start">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#fff7ed] text-[#ea580c] rounded-lg flex items-center justify-center flex-shrink-0"><IconBell color="#ea580c" /></span>
                                <h3 className="text-base font-bold text-[#1a202c]">Tasks & Follow-ups</h3>
                            </div>
                            <button 
                                onClick={() => setIsAddingTask(true)}
                                className="bg-[#2447d7] text-white p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#1a36b1] transition-all"
                            >
                                <IconPlus /> Add Task
                            </button>
                        </div>
                        <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto scrollbar-thin">
                            {leadTasks.length > 0 ? (
                                leadTasks.map(task => (
                                    <div key={task.id} className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' : 'bg-[#fef3c7] text-[#d97706]'}`}>
                                                    {task.type === 'Call' ? <IconPhone size={14} /> : <IconDocs size={14} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-[#1a202c]">{task.title}</span>
                                                    <span className="text-[11px] text-[#a0aec0] font-medium">{task.date} at {task.time}</span>
                                                </div>
                                            </div>
                                            <select 
                                                className={`appearance-none px-3 py-1 rounded-lg text-[10px] font-bold border outline-none cursor-pointer ${task.status === 'Completed' ? 'bg-[#ecfdf5] text-[#10b981] border-[#10b981]/20' : 'bg-[#fff7ed] text-[#ea580c] border-[#ea580c]/20'}`}
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                            >
                                                <option>Pending</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                            </select>
                                        </div>
                                        {task.message && <p className="text-[11px] text-[#718096] italic bg-white p-2 rounded-lg border border-[#f1f5f9]">"{task.message}"</p>}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider">Reminder:</span>
                                            <select 
                                                className="bg-transparent border-none text-[10px] font-bold text-[#2447d7] outline-none cursor-pointer"
                                                value={task.reminder}
                                                onChange={(e) => updateTaskReminder(task.id, e.target.value)}
                                            >
                                                <option value="none">Off</option>
                                                <option value="15m">15m</option>
                                                <option value="1h">1h</option>
                                                <option value="1d">1d</option>
                                            </select>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-[#a0aec0] text-sm italic">No tasks assigned to this lead.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ADD TASK MODAL ── */}
            {isAddingTask && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[2000] animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-[450px] rounded-2xl p-8 shadow-2xl relative animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#1a202c]">Add Lead Task</h2>
                            <button className="text-2xl text-[#a0aec0] hover:text-[#4a5568]" onClick={() => setIsAddingTask(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#4a5568]">Task Title</label>
                                <input required type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Call to verify documents" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-[#4a5568]">Date</label>
                                    <input required type="date" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-[#4a5568]">Time</label>
                                    <input required type="time" className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-[#4a5568]">Type</label>
                                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none" value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}>
                                        <option>Call</option>
                                        <option>Document</option>
                                        <option>Review</option>
                                        <option>Email</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-[#4a5568]">Reminder</label>
                                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none" value={newTask.reminder} onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">None</option>
                                        <option value="15m">15m Before</option>
                                        <option value="1h">1h Before</option>
                                        <option value="1d">1d Before</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#4a5568]">Notes</label>
                                <textarea className="w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white transition-all min-h-[80px]" value={newTask.message} onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Additional notes..." rows="3" />
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button type="button" className="px-5 py-2.5 bg-[#f7fafc] border border-[#edf2f7] rounded-xl font-bold text-[#4a5568] hover:bg-[#edf2f7]" onClick={() => setIsAddingTask(false)}>Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[#2447d7] text-white rounded-xl font-bold hover:bg-[#1a36b1] shadow-lg">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showModal && (() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return (
                    <UploadModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        client={lead}
                        onUpload={handleUpload}
                        onDelete={(leadId, docId) => {
                            setLead(prev => {
                                const newDocs = prev.documents.filter(d => d.id !== docId);
                                updateLead(prev.id, { documents: newDocs });
                                return { ...prev, documents: newDocs };
                            });
                        }}
                        onApprove={(leadId, docId) => {
                            setLead(prev => {
                                const newDocs = prev.documents.map(d => d.id === docId ? { ...d, status: 'Approved' } : d);
                                const allApproved = newDocs.length > 0 && newDocs.every(d => d.status === 'Approved');
                                const stageUpdate = allApproved && prev.stage === 'Document Collection'
                                    ? { stage: 'Document Verification Done', status: 'Document Verification Done', progress: 40 }
                                    : {};
                                updateLead(prev.id, { documents: newDocs, ...stageUpdate });
                                return { ...prev, documents: newDocs, ...stageUpdate };
                            });
                        }}
                        onReject={(leadId, docId, reason) => {
                            setLead(prev => {
                                const newDocs = prev.documents.map(d => d.id === docId ? { ...d, status: 'Rejected', note: reason } : d);
                                updateLead(prev.id, { documents: newDocs });
                                return { ...prev, documents: newDocs };
                            });
                        }}
                        uploadingDocs={uploadingDocs}
                        isDark={isDark}
                        isAccountsManager={isManagerOrAbove}
                        isTeamLeader={isTeamLeader}
                    />
                );
            })()}

            <EditLeadModal 
                isOpen={showEditModal} 
                onClose={() => setShowEditModal(false)} 
                lead={lead} 
                onSave={(updatedLead) => {
                    setLead(updatedLead);
                    updateLead(updatedLead.id, updatedLead);
                    setShowEditModal(false);
                }} 
            />

            {/* Document Preview Overlay */}
            {previewDoc && (
                <div className="fixed inset-0 z-[2100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] flex items-center justify-center text-[#2447d7]">
                                    <IconFile size={16} />
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{previewDoc.type || previewDoc.name}</span>
                            </div>
                            <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500"><IconClose size={18} /></button>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[400px] p-8 relative overflow-hidden">
                            {previewDoc.url || previewDoc.previewUrl ? (
                                <img 
                                    src={previewDoc.url || previewDoc.previewUrl} 
                                    alt="Preview" 
                                    className="max-w-full max-h-full object-contain shadow-2xl animate-scaleIn"
                                />
                            ) : (
                                <div className="bg-white w-full h-full max-w-md shadow-lg p-8 flex flex-col gap-5 animate-slideUp border border-gray-100">
                                    <div className="h-6 w-1/2 bg-gray-100 rounded-lg flex items-center px-3 text-[10px] font-bold text-gray-400">FILE METADATA</div>
                                    <div className="flex flex-col gap-4 mt-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Filename</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.fileName || previewDoc.name || 'document.pdf'}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Status</span>
                                            <span className={`text-xs font-bold ${previewDoc.status === 'Approved' ? 'text-[#10b981]' : previewDoc.status === 'Rejected' ? 'text-[#f43f5e]' : 'text-[#718096]'}`}>{previewDoc.status}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                        <IconDocs size={200} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50/50 flex justify-center">
                            <button 
                                onClick={() => setPreviewDoc(null)}
                                className="px-10 py-2.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-95"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── ICONS ─── */
const IconInfo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const IconEmail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconBell = ({ color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" width="18" height="18">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconFile = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
);

const IconClose = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default LeadDetails;
