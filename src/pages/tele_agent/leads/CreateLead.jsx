import React, { useState, useRef } from 'react';
import { IconUpload, IconFile, IconCheck, IconAlert, IconClose, IconTrash, IconDocs, IconEye, IconUsers } from '../../../components/DocumentManagement/Icons';
import { MOCK_LEADS } from '../../../data/dummyData';

const CreateLead = ({ onBack, tasks, setTasks, notifyReminderSet }) => {
    const [user, setUser] = useState({});
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [duplicateLead, setDuplicateLead] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        businessName: '',
        nic: '',
        phoneNumber: '',
        emailAddress: '',
        residentialAddress: '',
        loanAmount: '',
        assignedAgent: '',
        notes: '',
        documents: []
    });

    const [followUp, setFollowUp] = useState({
        enabled: false,
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'Initial Call',
        priority: 'Medium',
        notes: ''
    });
    const [uploadingDocs, setUploadingDocs] = useState({});
    const [previewDoc, setPreviewDoc] = useState(null);
    const fileInputRef = useRef(null);
    const [customDocName, setCustomDocName] = useState('');

    React.useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        
        let agentName = '';
        if (userData.first_name || userData.last_name) {
            agentName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        } else if (userData.role === 'tele_agent') {
            agentName = 'Sarah Jenkins';
        } else {
            agentName = userData.role || 'System Agent';
        }
        
        setFormData(prev => ({ ...prev, assignedAgent: agentName }));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelClick = () => {
        setShowCancelConfirm(true);
    };

    const handleConfirmCancel = () => {
        setShowCancelConfirm(false);
        onBack();
    };

    const handleSaveAndSend = () => {
        if (formData.documents.length === 0 && Object.keys(uploadingDocs).length === 0) {
            console.log('Saving Lead & Sending Credentials:', formData);
            setShowSuccess(true);
            return;
        }

        // Trigger simulation for all pending docs
        const pendingDocs = Object.keys(uploadingDocs);
        if (pendingDocs.length === 0) {
            setShowSuccess(true);
            return;
        }

        pendingDocs.forEach(tempId => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress >= 100) {
                    clearInterval(interval);
                    setFormData(prev => ({
                        ...prev,
                        documents: [...prev.documents, { id: tempId, type: uploadingDocs[tempId].name, status: 'Pending', date: new Date().toISOString().split('T')[0] }]
                    }));
                    setUploadingDocs(prev => {
                        const next = { ...prev };
                        delete next[tempId];
                        return next;
                    });
                } else {
                    setUploadingDocs(prev => ({ 
                        ...prev, 
                        [tempId]: { ...prev[tempId], progress, isSimulating: true } 
                    }));
                }
            }, 100);
        });
    };

    // Watch for simulation completion
    React.useEffect(() => {
        const isStillSimulating = Object.values(uploadingDocs).some(doc => doc.isSimulating);
        const hasPendingQueue = Object.keys(uploadingDocs).length > 0;
        
        if (!hasPendingQueue && isStillSimulating === false && formData.customerName) {
            // Check if we just finished a batch
            // This is a simple heuristic; in a real app we'd track the submission state
        }
    }, [uploadingDocs]);

    // Update handleSaveAndSend to also show success modal after all are done
    // Let's refine the approach: use a state to track if we are in "submitting" mode
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (isSubmitting && Object.keys(uploadingDocs).length === 0) {
            setIsSubmitting(false);
            setShowSuccess(true);
        }
    }, [isSubmitting, uploadingDocs]);

    const triggerSaveAndSend = () => {
        // --- Duplicate Check Logic ---
        const duplicate = MOCK_LEADS.find(l => 
            (formData.emailAddress && l.email?.toLowerCase() === formData.emailAddress.toLowerCase()) ||
            (formData.phoneNumber && l.phone === formData.phoneNumber) ||
            (formData.nic && l.nic === formData.nic)
        );

        if (duplicate) {
            setDuplicateLead(duplicate);
            setShowDuplicateModal(true);
            return;
        }

        const pendingIds = Object.keys(uploadingDocs);
        
        // Handle Follow-up Task Creation
        if (followUp.enabled && setTasks) {
            const newTask = {
                id: Date.now(),
                title: `${formData.customerName || 'New Lead'} - ${followUp.type}`,
                description: followUp.notes || `Initial follow-up for new lead. Notes: ${formData.notes || 'None'}`,
                date: followUp.date,
                time: followUp.time,
                type: followUp.type,
                reminder: '15m', // Default reminder
                status: 'Pending',
                lead: formData.customerName || 'New Lead',
                assignedTo: user.id || 'Self',
                createdBy: user.role || 'Tele Agent'
            };
            setTasks(prev => [newTask, ...prev]);
            
            // Connect to general reminders system
            if (notifyReminderSet) {
                notifyReminderSet(newTask);
            }
        }

        if (pendingIds.length === 0) {
            setShowSuccess(true);
            return;
        }

        setIsSubmitting(true);
        pendingIds.forEach(tempId => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 15) + 5;
                if (progress >= 100) {
                    clearInterval(interval);
                    setFormData(prev => ({
                        ...prev,
                        documents: [...prev.documents, { id: tempId, type: uploadingDocs[tempId].name, status: 'Pending', date: new Date().toISOString().split('T')[0] }]
                    }));
                    setUploadingDocs(prev => {
                        const next = { ...prev };
                        delete next[tempId];
                        return next;
                    });
                } else {
                    setUploadingDocs(prev => ({ 
                        ...prev, 
                        [tempId]: { ...prev[tempId], progress, isSimulating: true } 
                    }));
                }
            }, 150);
        });
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const docName = customDocName.trim() || `Document ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        const tempId = Date.now();
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

        // Just add to queue, don't start progress
        setUploadingDocs(prev => ({ ...prev, [tempId]: { name: docName, progress: 0, isSimulating: false, file, previewUrl } }));
        setCustomDocName('');
        e.target.value = '';
    };

    const handleDeleteQueuedDoc = (tempId) => {
        setUploadingDocs(prev => {
            const next = { ...prev };
            delete next[tempId];
            return next;
        });
    };

    const handleDeleteDoc = (docId) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter(d => d.id !== docId)
        }));
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            {/* ── HEADER ── */}
            <div className="my-6 mb-8 md:my-4">
                <h1 className="text-[1.75rem] font-bold text-[#1a202c] mb-2 sm:text-2xl tracking-tight">Create New Lead</h1>
                <p className="text-[0.95rem] text-[#718096] max-w-2xl leading-relaxed">Initialize a new prospect record by providing the mandatory identity and financial details.</p>
            </div>

            {/* ── FORM CARD ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 px-8 border-b border-[#f7fafc] flex justify-between items-center md:px-6">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-[#ebf0ff] text-[#2447d7] rounded-lg flex items-center justify-center shrink-0"><IconDocs /></span>
                        <h3 className="text-base font-bold text-[#1a202c]">Lead Specification</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-[#f0f4ff] px-3 py-1.5 rounded-lg">
                        <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">SYSTEM ID:</span>
                        <span className="text-[12px] font-bold text-[#2447d7]">WR-2026-0001</span>
                    </div>
                </div>

                <div className="p-8 md:p-6">
                    {/* Personal Identification */}
                    <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider mb-5">PERSONAL IDENTIFICATION</h4>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-[#4a5568]">Customer Name</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                    placeholder="e.g. Jonathan Doe"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-[#4a5568]">NIC / National ID</label>
                                <input
                                    type="text"
                                    name="nic"
                                    className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                    placeholder="Enter identification number"
                                    value={formData.nic}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Channels */}
                    <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider mb-5">CONTACT CHANNELS</h4>
                        <div className="grid grid-cols-2 gap-6 mb-6 md:grid-cols-1">
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-[13px] font-semibold text-[#4a5568]">Phone Number</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-[#cbd5e0]"><IconPhone /></div>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 pl-11 pr-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-[13px] font-semibold text-[#4a5568]">Email Address</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-[#cbd5e0]"><IconMail /></div>
                                    <input
                                        type="email"
                                        name="emailAddress"
                                        className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 pl-11 pr-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                        placeholder="client@example.com"
                                        value={formData.emailAddress}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-[#4a5568]">Residential Address</label>
                            <input
                                type="text"
                                name="residentialAddress"
                                className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                placeholder="Street, Suite, City, Zip Code"
                                value={formData.residentialAddress}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Financial & Logistics */}
                    <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider mb-5">FINANCIAL & LOGISTICS</h4>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-[13px] font-semibold text-[#4a5568]">Loan Amount (USD)</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-sm font-bold text-[#a0aec0]">$</span>
                                    <input
                                        type="text"
                                        name="loanAmount"
                                        className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 pl-8 pr-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                        placeholder="0.00"
                                        value={formData.loanAmount}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-[#4a5568]">Company/Business Name</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full"
                                    placeholder="Enter registered business name..."
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-[#4a5568]">Assigned Agent</label>
                                <input 
                                    type="text"
                                    name="assignedAgent" 
                                    className="bg-[#f0f4ff] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none text-[#2447d7] font-bold w-full cursor-not-allowed"
                                    value={formData.assignedAgent} 
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Commentary */}
                    <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider mb-5">ADDITIONAL COMMENTARY</h4>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-[#4a5568]">Lead Notes & Context</label>
                            <textarea
                                name="notes"
                                className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full min-h-[100px] resize-y"
                                placeholder="Enter relevant history, preferred contact times, or special requirements..."
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Follow-up & Reminders */}
                    <div className="mb-8 p-6 bg-[#f8faff] rounded-2xl border border-[#ebf0ff] animate-slideUp">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-white text-[#2447d7] rounded-lg flex items-center justify-center shadow-sm border border-[#ebf0ff]"><IconBell size={16} /></span>
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#1a202c]">Follow-up & Reminders</h4>
                                    <p className="text-[10px] text-[#718096] font-medium">Schedule an initial task for this lead</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={followUp.enabled}
                                    onChange={(e) => setFollowUp(prev => ({ ...prev, enabled: e.target.checked }))}
                                />
                                <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2447d7]"></div>
                            </label>
                        </div>

                        {followUp.enabled && (
                            <>
                                <div className="grid grid-cols-3 gap-4 animate-fadeIn md:grid-cols-1">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-semibold text-[#4a5568] flex items-center gap-1.5">
                                            <IconCalendar size={14} className="text-[#a0aec0]" /> Task Date
                                        </label>
                                        <input
                                            type="date"
                                            className="bg-white border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-xs outline-none focus:border-[#2447d7] transition-all"
                                            value={followUp.date}
                                            onChange={(e) => setFollowUp(prev => ({ ...prev, date: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-semibold text-[#4a5568] flex items-center gap-1.5">
                                            <IconClock size={14} className="text-[#a0aec0]" /> Preferred Time
                                        </label>
                                        <input
                                            type="time"
                                            className="bg-white border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-xs outline-none focus:border-[#2447d7] transition-all"
                                            value={followUp.time}
                                            onChange={(e) => setFollowUp(prev => ({ ...prev, time: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-semibold text-[#4a5568] flex items-center gap-1.5">
                                            <IconInfo size={14} className="text-[#a0aec0]" /> Task Type
                                        </label>
                                        <select
                                            className="bg-white border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-xs outline-none focus:border-[#2447d7] transition-all appearance-none"
                                            value={followUp.type}
                                            onChange={(e) => setFollowUp(prev => ({ ...prev, type: e.target.value }))}
                                        >
                                            <option>Initial Call</option>
                                            <option>Document Request</option>
                                            <option>Lender Meeting</option>
                                            <option>Follow-up Email</option>
                                            <option>General Task</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <label className="text-[12px] font-semibold text-[#4a5568] flex items-center gap-1.5">
                                        <IconInfo size={14} className="text-[#a0aec0]" /> Task Context & Notes
                                    </label>
                                    <textarea
                                        className="bg-white border border-[#e2e8f0] p-3 px-4 rounded-xl text-xs outline-none focus:border-[#2447d7] transition-all w-full min-h-[80px] resize-y"
                                        placeholder="Specific instructions for this follow-up..."
                                        value={followUp.notes}
                                        onChange={(e) => setFollowUp(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Documentation */}
                    <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider mb-5">DOCUMENTATION</h4>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        
                        <div className="flex gap-4 mb-6 md:flex-col">
                            <div className="flex-1 flex gap-3">
                                <input
                                    type="text"
                                    className="flex-1 bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] transition-all"
                                    placeholder="Enter document name (e.g. NIC Front)"
                                    value={customDocName}
                                    onChange={(e) => setCustomDocName(e.target.value)}
                                />
                                <button 
                                    className="bg-[#ebf0ff] text-[#2447d7] p-3 px-6 rounded-xl text-sm font-bold hover:bg-[#2447d7] hover:text-white transition-all flex items-center gap-2"
                                    onClick={handleUploadClick}
                                >
                                    <IconUpload size={16} /> Upload
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                            {/* Uploading Progress Items */}
                            {Object.entries(uploadingDocs).map(([id, doc]) => (
                                <div key={id} className="p-4 rounded-2xl border border-[#edf2f7] bg-[#fcfdff]">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            {doc.isSimulating ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-[#2447d7] border-t-transparent" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-[#cbd5e0]" />
                                            )}
                                            <span className="text-[13px] font-bold text-[#1a202c]">{doc.name}</span>
                                        </div>
                                        <span className="text-[11px] font-black text-[#2447d7]">
                                            {doc.isSimulating ? `${doc.progress}%` : 'Queued'}
                                        </span>
                                        {!doc.isSimulating && (
                                            <div className="flex items-center gap-1.5 ml-2">
                                                <button 
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="p-1 text-[#2447d7] hover:bg-[#2447d7]/10 rounded-lg transition-colors"
                                                    title="View Document"
                                                >
                                                    <IconEye size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteQueuedDoc(id)}
                                                    className="p-1 text-[#fb7185] hover:bg-[#fb7185]/10 rounded-lg transition-colors"
                                                    title="Remove from queue"
                                                >
                                                    <IconTrash size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                                        <div className="h-full bg-[#2447d7] transition-all duration-300" style={{ width: `${doc.progress}%` }} />
                                    </div>
                                </div>
                            ))}

                            {/* Completed Items */}
                            {formData.documents.map(doc => (
                                <div key={doc.id} className="p-4 rounded-2xl border border-[#edf2f7] bg-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-[#f8faff] text-[#2447d7] rounded-lg flex items-center justify-center">
                                            <IconFile size={18} />
                                        </div>
                                        <div>
                                            <span className="block text-[13px] font-bold text-[#1a202c]">{doc.type}</span>
                                            <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">Ready to Save</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setPreviewDoc(doc)}
                                            className="p-1.5 text-[#2447d7] hover:bg-[#2447d7]/10 rounded-lg transition-colors border border-[#2447d7]/20"
                                            title="View Document"
                                        >
                                            <IconEye size={14} />
                                        </button>
                                        <div className="text-[#10b981] bg-[#ecfdf5] p-1.5 rounded-lg border border-[#d1fae5]">
                                            <IconCheck size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Actions */}
                    <div className="flex justify-end items-center gap-4 mt-10 pt-8 border-t border-[#f7fafc] md:flex-col-reverse md:items-stretch">
                        <button className="bg-white border border-[#e2e8f0] text-[#718096] p-[10px_24px] rounded-xl text-sm font-semibold hover:bg-[#f7fafc] hover:text-[#4a5568] transition-all" onClick={handleCancelClick} disabled={isSubmitting}>Cancel</button>
                        <button 
                            className={`flex items-center justify-center gap-2 p-[10px_24px] rounded-xl text-sm font-semibold transition-all ${isSubmitting ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#2447d7] text-white shadow-[0_4px_12px_rgba(36,71,215,0.2)] hover:bg-[#1732a3] hover:translate-y-[-1px] hover:shadow-[0_6px_15px_rgba(36,71,215,0.3)]'}`} 
                            onClick={triggerSaveAndSend}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Saving...
                                </div>
                            ) : (
                                'Save Lead'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {showCancelConfirm && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[999] p-6 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="flex items-center gap-3 p-[20px_24px] border-b border-[#f1f5f9] bg-[#fff5f5] text-[#c53030]">
                            <IconClose />
                            <h3 className="font-bold text-base">Cancel Lead Creation?</h3>
                        </div>
                        <div className="p-[20px_24px] text-[#475569] text-sm">
                            <p>Are you sure you want to cancel? Any unsaved changes will be lost.</p>
                        </div>
                        <div className="p-[18px_24px_22px] flex justify-end gap-3 border-t border-[#f1f5f9] md:flex-col md:items-stretch">
                            <button className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] p-[10px_18px] rounded-xl font-semibold hover:bg-[#edf2f7] transition-all" onClick={() => setShowCancelConfirm(false)}>
                                Keep Editing
                            </button>
                            <button className="bg-[#e11d48] text-white border-none p-[10px_18px] rounded-xl font-semibold hover:bg-[#be123c] transition-all" onClick={handleConfirmCancel}>
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[999] p-6 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="flex items-center gap-3 p-[20px_24px] border-b border-[#f1f5f9] bg-[#ecfdf3] text-[#067647]">
                            <IconCheck />
                            <h3 className="font-bold text-base">Lead Saved Successfully</h3>
                        </div>
                        <div className="p-[20px_24px] text-[#475569] text-sm">
                            <p>The new lead has been recorded and the follow-up task has been scheduled.</p>
                        </div>
                        <div className="p-[18px_24px_22px] flex justify-end gap-3 border-t border-[#f1f5f9] md:flex-col md:items-stretch">
                            <button
                                className="bg-[#2447d7] text-white border-none p-[10px_22px] rounded-xl font-semibold hover:bg-[#1732a3] transition-all"
                                onClick={() => {
                                    setShowSuccess(false);
                                    onBack();
                                }}
                            >
                                Back to Leads
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDuplicateModal && duplicateLead && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[999] p-6 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="flex items-center gap-3 p-[24px_32px] border-b border-[#f1f5f9] bg-[#fffaf0] text-[#c05621]">
                            <IconAlert size={24} />
                            <h3 className="font-bold text-lg">Duplicate Lead Found</h3>
                        </div>
                        <div className="p-[32px] flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#4a5568] text-sm leading-relaxed">
                                    A lead with similar contact information already exists in the system. This helps prevent redundancy and ensures data integrity.
                                </p>
                            </div>
                            
                            <div className="bg-[#f7fafc] rounded-2xl p-5 border border-[#edf2f7] flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#ebf0ff] text-[#2447d7] rounded-xl flex items-center justify-center font-bold text-lg">
                                        {duplicateLead.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-[#1a202c]">{duplicateLead.name}</span>
                                        <span className="text-xs font-bold text-[#2447d7] uppercase tracking-wider">{duplicateLead.businessName || 'Individual Lead'}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pt-2 border-t border-[#edf2f7]">
                                    <div className="flex items-center gap-3 text-sm text-[#4a5568]">
                                        <IconMail size={16} className="text-[#a0aec0]" />
                                        <span className="font-medium">{duplicateLead.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[#4a5568]">
                                        <IconPhone size={16} className="text-[#a0aec0]" />
                                        <span className="font-medium">{duplicateLead.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[#4a5568]">
                                        <IconUsers size={16} className="text-[#a0aec0]" />
                                        <span className="text-xs font-bold text-[#718096] uppercase bg-white px-2 py-0.5 rounded border">ID: {duplicateLead.id}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[13px] text-[#718096] italic text-center">
                                Please review the details above. If this is a different person, please use unique contact details.
                            </p>
                        </div>
                        <div className="p-[20px_32px_24px] flex justify-end gap-3 border-t border-[#f1f5f9] bg-[#fdfdfd] md:flex-col md:items-stretch">
                            <button
                                className="bg-white border border-[#e2e8f0] text-[#4a5568] p-[12px_24px] rounded-xl text-sm font-bold hover:bg-[#f7fafc] transition-all"
                                onClick={() => {
                                    setShowDuplicateModal(false);
                                    setDuplicateLead(null);
                                }}
                            >
                                Re-edit Details
                            </button>
                            <button
                                className="bg-[#2447d7] text-white border-none p-[12px_24px] rounded-xl text-sm font-bold hover:bg-[#1732a3] shadow-[0_4px_12px_rgba(36,71,215,0.2)] transition-all"
                                onClick={() => {
                                    setShowDuplicateModal(false);
                                    onBack(); // navigate to leads list where they can find the existing lead
                                }}
                            >
                                View Existing Lead
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                /* Mock Document Preview Content for Non-images */
                                <div className="bg-white w-full h-full max-w-md shadow-lg p-8 flex flex-col gap-5 animate-slideUp border border-gray-100">
                                    <div className="h-6 w-1/2 bg-gray-100 rounded-lg flex items-center px-3 text-[10px] font-bold text-gray-400">FILE METADATA</div>
                                    <div className="flex flex-col gap-4 mt-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Filename</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.fileName || previewDoc.name || 'document.pdf'}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">File Type</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.file?.type || 'application/pdf'}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Size</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.file ? `${(previewDoc.file.size / 1024).toFixed(1)} KB` : '1.2 MB'}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                        <IconFile size={200} />
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
const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" width="16" height="16">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" width="16" height="16">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconKey = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: '8px' }}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l2.5-2.5" />
    </svg>
);

const IconCalendar = ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size} className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconClock = ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size} className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconBell = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconInfo = ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size} className={className}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export default CreateLead;
