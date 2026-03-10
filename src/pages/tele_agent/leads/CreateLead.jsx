import React, { useState } from 'react';
import './CreateLead.css';

const CreateLead = ({ onBack }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        nic: '',
        phoneNumber: '',
        emailAddress: '',
        residentialAddress: '',
        loanAmount: '',
        assignedAgent: '',
        leadSource: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAndSend = () => {
        console.log('Saving Lead & Sending Credentials:', formData);
        alert('Lead Saved and Credentials Sent Successfully!');
        onBack();
    };

    return (
        <div className="create-lead-container">
            {/* ── HEADER ── */}
            <div className="create-lead-header">
                <h1>Create New Lead</h1>
                <p>Initialize a new prospect record by providing the mandatory identity and financial details.</p>
            </div>

            {/* ── FORM CARD ── */}
            <div className="tele-card form-card">
                <div className="card-header-row">
                    <div className="header-title-box">
                        <span className="icon-wrapper blue"><IconDocs /></span>
                        <h3>Lead Specification</h3>
                    </div>
                    <div className="system-id-badge">
                        <span className="label">SYSTEM ID:</span>
                        <span className="value">WR-2026-0001</span>
                    </div>
                </div>

                <div className="card-body">
                    {/* Personal Identification */}
                    <div className="form-section">
                        <h4 className="section-title">PERSONAL IDENTIFICATION</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Customer Name</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    placeholder="e.g. Jonathan Doe"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>NIC / National ID</label>
                                <input
                                    type="text"
                                    name="nic"
                                    placeholder="Enter identification number"
                                    value={formData.nic}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Channels */}
                    <div className="form-section">
                        <h4 className="section-title">CONTACT CHANNELS</h4>
                        <div className="form-grid">
                            <div className="form-group has-icon">
                                <label>Phone Number</label>
                                <div className="input-with-icon">
                                    <IconPhone />
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group has-icon">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <IconMail />
                                    <input
                                        type="email"
                                        name="emailAddress"
                                        placeholder="client@example.com"
                                        value={formData.emailAddress}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Residential Address</label>
                            <input
                                type="text"
                                name="residentialAddress"
                                placeholder="Street, Suite, City, Zip Code"
                                value={formData.residentialAddress}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Financial & Logistics */}
                    <div className="form-section">
                        <h4 className="section-title">FINANCIAL & LOGISTICS</h4>
                        <div className="form-grid three-col">
                            <div className="form-group has-prefix">
                                <label>Loan Amount (USD)</label>
                                <div className="input-with-prefix">
                                    <span className="prefix">$</span>
                                    <input
                                        type="text"
                                        name="loanAmount"
                                        placeholder="0.00"
                                        value={formData.loanAmount}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Assigned Agent</label>
                                <select name="assignedAgent" value={formData.assignedAgent} onChange={handleInputChange}>
                                    <option value="">Select an agent</option>
                                    <option value="sarah-jenkins">Sarah Jenkins</option>
                                    <option value="michael-chen">Michael Chen</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Lead Source</label>
                                <select name="leadSource" value={formData.leadSource} onChange={handleInputChange}>
                                    <option value="">Source channel</option>
                                    <option value="website">Website Form</option>
                                    <option value="referral">Referral</option>
                                    <option value="linkedin">LinkedIn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Commentary */}
                    <div className="form-section">
                        <h4 className="section-title">ADDITIONAL COMMENTARY</h4>
                        <div className="form-group full-width">
                            <label>Notes & Context</label>
                            <textarea
                                name="notes"
                                placeholder="Enter relevant history, preferred contact times, or special requirements..."
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Final Actions */}
                    <div className="form-actions-footer">
                        <button className="btn-cancel" onClick={onBack}>Cancel</button>
                        <button className="btn-save-send" onClick={handleSaveAndSend}>
                            <IconKey />
                            Send Credentials & Save
                        </button>
                    </div>
                </div>
            </div>
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
