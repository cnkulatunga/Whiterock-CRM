import React, { useState } from 'react';
import './LenderSelection.css';

const LENDERS = [
    { id: 'bank_of_whiterock', name: 'Bank of Whiterock', tier: 'Tier 1 • Trusted Partner', match: 98, matchClass: 'match-high' },
    { id: 'global_finance', name: 'Global Finance', tier: 'Tier 1 • International', match: 92, matchClass: 'match-high' },
    { id: 'secure_lenders', name: 'Secure Lenders', tier: 'Tier 2 • Private Equity', match: 85, matchClass: 'match-mid' },
    { id: 'apex_capital', name: 'Apex Capital Group', tier: 'Tier 1 • High Net Worth', match: 78, matchClass: 'match-low' },
];

const LenderSelection = ({ lead }) => {
    const clientName = lead?.name || 'Jonathan Doe';
    const clientEmail = lead?.email || '';
    const clientPhone = lead?.phone || '';
    const clientSource = lead?.source || '';
    const leadId = lead?.id || 'WR-2026-0001';
    const initials = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const [loanAmount, setLoanAmount] = useState(
        lead?.loanAmount ? lead.loanAmount.replace(/[$,]/g, '') : '500,000'
    );
    const [interestRate, setInterestRate] = useState('3.5 - 5.0');
    const [tenure, setTenure] = useState('30 Years');
    const [repayment, setRepayment] = useState('Monthly Amortization');
    const [selected, setSelected] = useState(['bank_of_whiterock', 'global_finance']);

    const toggleLender = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAll = () => setSelected(LENDERS.map(l => l.id));
    const clearAll = () => setSelected([]);

    return (
        <div className="am-ls-page">
            {/* Header */}
            <div className="am-ls-header">
                <div>
                    <h1 className="am-ls-title">Lead WR-2026-0001 – Lender Selection</h1>
                    <p className="am-ls-subtitle">Configure the final loan terms and distribute the lead to preferred financial institutions.</p>
                </div>
                <div className="am-ls-header-actions">
                    <button className="am-ls-save-btn">Save Draft</button>
                    <button className="am-ls-submit-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                        Submit for Approval
                    </button>
                </div>
            </div>

            <div className="am-ls-body">
                {/* Left column */}
                <div className="am-ls-left">
                    {/* Step 1: Loan Details */}
                    <div className="am-ls-card">
                        <div className="am-ls-card-header">
                            <div className="am-ls-card-title-row">
                                <div className="am-ls-step-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <h2 className="am-ls-card-title">1. Loan Details Form</h2>
                            </div>
                            <span className="am-ls-step-badge">STEP 01/02</span>
                        </div>

                        <div className="am-ls-form-grid">
                            <div className="am-ls-form-group">
                                <label>Loan Amount (USD)</label>
                                <div className="am-ls-input-prefix">
                                    <span>$</span>
                                    <input type="text" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                                </div>
                            </div>
                            <div className="am-ls-form-group">
                                <label>Interest Rate Range (%)</label>
                                <div className="am-ls-input-suffix">
                                    <input type="text" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                                    <span>%</span>
                                </div>
                            </div>
                            <div className="am-ls-form-group">
                                <label>Loan Tenure</label>
                                <select value={tenure} onChange={e => setTenure(e.target.value)} className="am-ls-select">
                                    <option>10 Years</option>
                                    <option>15 Years</option>
                                    <option>20 Years</option>
                                    <option>30 Years</option>
                                </select>
                            </div>
                            <div className="am-ls-form-group">
                                <label>Repayment Method</label>
                                <select value={repayment} onChange={e => setRepayment(e.target.value)} className="am-ls-select">
                                    <option>Monthly Amortization</option>
                                    <option>Interest Only</option>
                                    <option>Balloon Payment</option>
                                </select>
                            </div>
                        </div>

                        <div className="am-ls-notice">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            These loan details will be sent as an inquiry to all selected lenders. Ensure the credit score of Lead WR-2026-0001 meets the minimum criteria for the chosen interest rate range.
                        </div>
                    </div>

                    {/* Step 2: Lender Selection */}
                    <div className="am-ls-card">
                        <div className="am-ls-card-header">
                            <div className="am-ls-card-title-row">
                                <div className="am-ls-step-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </div>
                                <h2 className="am-ls-card-title">2. Lender Selection</h2>
                            </div>
                            <span className="am-ls-step-badge">STEP 02/02</span>
                        </div>

                        <div className="am-ls-lender-header">
                            <p className="am-ls-lender-desc">Select multiple banks or lenders to distribute this lead.</p>
                            <div className="am-ls-lender-actions">
                                <button className="am-ls-select-all" onClick={selectAll}>Select All</button>
                                <button className="am-ls-clear" onClick={clearAll}>Clear Selection</button>
                            </div>
                        </div>

                        <div className="am-ls-lender-grid">
                            {LENDERS.map((lender) => {
                                const isSelected = selected.includes(lender.id);
                                return (
                                    <div
                                        key={lender.id}
                                        className={`am-ls-lender-card ${isSelected ? 'am-ls-lender-card--selected' : ''}`}
                                        onClick={() => toggleLender(lender.id)}
                                    >
                                        <div className="am-ls-lender-check">
                                            <div className={`am-ls-checkbox ${isSelected ? 'am-ls-checkbox--checked' : ''}`}>
                                                {isSelected && (
                                                    <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"
                                                        strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                                                        <polyline points="2 6 5 9 10 3" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="am-ls-lender-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                            </svg>
                                        </div>
                                        <div className="am-ls-lender-info">
                                            <span className="am-ls-lender-name">{lender.name}</span>
                                            <span className="am-ls-lender-tier">{lender.tier}</span>
                                        </div>
                                        <div className={`am-ls-match-badge ${lender.matchClass}`}>
                                            {lender.match}%<br />
                                            <span>Match</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="am-ls-right">
                    {/* Lead Information */}
                    <div className="am-ls-info-card">
                        <h3 className="am-ls-info-title">Lead Information</h3>
                        <div className="am-ls-lead-profile">
                            <div className="am-ls-lead-avatar">JD</div>
                            <div>
                                <div className="am-ls-lead-name">Jonathan Doe</div>
                                <div className="am-ls-lead-role">Lead Applicant</div>
                            </div>
                        </div>
                        <div className="am-ls-info-rows">
                            <div className="am-ls-info-row">
                                <span className="am-ls-info-label">Credit Score</span>
                                <span className="am-ls-info-value green">745 (Excellent)</span>
                            </div>
                            <div className="am-ls-info-row">
                                <span className="am-ls-info-label">Annual Income</span>
                                <span className="am-ls-info-value">$125,000</span>
                            </div>
                            <div className="am-ls-info-row">
                                <span className="am-ls-info-label">Employment</span>
                                <span className="am-ls-info-value">Full-time</span>
                            </div>
                        </div>
                    </div>

                    {/* Final Action */}
                    <div className="am-ls-action-card">
                        <div className="am-ls-action-label">FINAL ACTION</div>
                        <div className="am-ls-action-title">Lead Submission</div>
                        <div className="am-ls-action-checks">
                            <div className="am-ls-check-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {selected.length} Lender{selected.length !== 1 ? 's' : ''} selected
                            </div>
                            <div className="am-ls-check-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Repayment method verified
                            </div>
                        </div>
                        <button className="am-ls-final-btn">
                            Submit for Approval
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                        <p className="am-ls-action-note">By clicking submit, you confirm that the provided information is accurate and verified by the applicant.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LenderSelection;
