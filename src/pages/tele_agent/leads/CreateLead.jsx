import React, { useState } from 'react';

const CreateLead = ({ onBack }) => {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        nic: '',
        phoneNumber: '',
        emailAddress: '',
        residentialAddress: '',
        loanAmount: '',
        assignedAgent: '',
        notes: ''
    });

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const agentName = user.role === 'tele_agent' ? 'Sarah Jenkins' : `${user.first_name || 'Tele'} ${user.last_name || 'Agent'}`.trim();
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
        console.log('Saving Lead & Sending Credentials:', formData);
        setShowSuccess(true);
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
                            <label className="text-[13px] font-semibold text-[#4a5568]">Notes & Context</label>
                            <textarea
                                name="notes"
                                className="bg-[#fdfdfd] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm outline-none focus:border-[#2447d7] focus:bg-white focus:ring-4 focus:ring-[#2447d7]/5 transition-all w-full min-h-[120px] resize-y"
                                placeholder="Enter relevant history, preferred contact times, or special requirements..."
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Final Actions */}
                    <div className="flex justify-end items-center gap-4 mt-10 pt-8 border-t border-[#f7fafc] md:flex-col-reverse md:items-stretch">
                        <button className="bg-white border border-[#e2e8f0] text-[#718096] p-[10px_24px] rounded-xl text-sm font-semibold hover:bg-[#f7fafc] hover:text-[#4a5568] transition-all" onClick={handleCancelClick}>Cancel</button>
                        <button className="flex items-center justify-center gap-2 bg-[#2447d7] text-white p-[10px_24px] rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(36,71,215,0.2)] hover:bg-[#1732a3] hover:translate-y-[-1px] hover:shadow-[0_6px_15px_rgba(36,71,215,0.3)] transition-all" onClick={handleSaveAndSend}>
                            <div className="mr-0.5"><IconKey /></div>
                            Send Credentials & Save
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
                            <h3 className="font-bold text-base">Saved & Shared</h3>
                        </div>
                        <div className="p-[20px_24px] text-[#475569] text-sm">
                            <p>Lead saved successfully and credentials shared with the customer.</p>
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
        </div>
    );
};

/* ─── ICONS ─── */
const IconDocs = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
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
const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" style={{ marginRight: '8px' }}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconClose = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: '8px' }}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default CreateLead;
