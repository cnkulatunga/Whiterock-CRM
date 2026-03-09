import React, { useState } from 'react';
import './LeadDetails.css';

const LeadDetails = ({ leadId = 'WR-2026-0001', onBack }) => {
    return (
        <div className="lead-details-container">
            {/* ── BREADCRUMBS ── */}
            <nav className="breadcrumbs">
                <span className="breadcrumb-link" onClick={onBack}>Leads</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{leadId}</span>
            </nav>

            {/* ── HEADER ── */}
            <div className="lead-header-main">
                <div className="header-left">
                    <div className="id-badge-row">
                        <h1>Lead: {leadId}</h1>
                    </div>
                    <p className="header-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Created on Oct 24, 2023 • Assigned to <strong>Sarah Jenkins</strong>
                    </p>
                </div>
            </div>

            {/* ── PROGRESS TRACKER ── */}
            <div className="tele-card progress-tracker-card">
                <div className="tracker-steps">
                    <div className="step completed">
                        <div className="step-icon-wrapper">
                            <div className="step-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="14" height="14">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                        <span className="step-label">Document Collected</span>
                    </div>
                    <div className="step-line active"></div>
                    <div className="step active">
                        <div className="step-icon-wrapper">
                            <div className="step-icon-inner"></div>
                        </div>
                        <span className="step-label active">Document Verifications</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                        <div className="step-icon-wrapper">
                            <div className="step-dot"></div>
                        </div>
                        <span className="step-label">Lender Selection</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                        <div className="step-icon-wrapper">
                            <div className="step-dot"></div>
                        </div>
                        <span className="step-label">Loan Confirmed</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                        <div className="step-icon-wrapper">
                            <div className="step-dot"></div>
                        </div>
                        <span className="step-label">Loan Rejected</span>
                    </div>
                </div>
            </div>

            <div className="details-grid">
                {/* ── LEFT COLUMN ── */}
                <div className="details-left">
                    {/* Lead Details Info */}
                    <div className="tele-card info-card">
                        <div className="card-header-simple">
                            <span className="icon-wrapper blue"><IconInfo /></span>
                            <h3>Lead Details</h3>
                        </div>
                        <div className="card-body">
                            <div className="details-info-grid">
                                <div className="info-item full-width">
                                    <label>LEAD ID</label>
                                    <div className="read-only-badge">
                                        <IconInfo />
                                        <span>{leadId}</span>
                                    </div>
                                </div>
                                
                                <div className="info-item full-width">
                                    <label>CUSTOMER NAME</label>
                                    <div className="prominent-value">Robert C. Mayfield</div>
                                </div>

                                <div className="info-item">
                                    <label>EMAIL ADDRESS</label>
                                    <div className="contact-link">
                                        <div className="link-icon blue"><IconEmail /></div>
                                        <span>r.mayfield@example.com</span>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <label>PHONE NUMBER</label>
                                    <div className="contact-link">
                                        <div className="link-icon green"><IconPhone /></div>
                                        <span>(555) 012-3456</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="details-right">
                    <div className="tele-card info-card verification-card">
                        <div className="card-header-row">
                            <div className="header-title-box">
                                <span className="icon-wrapper purple"><IconDocs /></span>
                                <h3>Documents & Verification</h3>
                            </div>
                            <span className="progress-fraction">1 / 1 COMPLETED</span>
                        </div>
                        <div className="card-body no-padding">
                            <table className="doc-table">
                                <thead>
                                    <tr>
                                        <th>DOCUMENT</th>
                                        <th>TIME IN STAGE</th>
                                        <th>MATCHED</th>
                                        <th>SCORE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="doc-info">
                                                <span className="doc-name">Bank Statements</span>
                                                <span className="doc-file">Uploaded 1h ago</span>
                                            </div>
                                        </td>
                                        <td><span className="status-indicator">2h 15m</span></td>
                                        <td><span className="matched-badge">100%</span></td>
                                        <td><span className="score-badge">8.5</span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="agent-comment">
                                <div className="agent-avatar-mini">
                                    <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=2447d7&color=fff" alt="SJ" />
                                </div>
                                <p>"Bank statement for Sept is blurry. Request clear scan."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── ICONS ─── */
const IconInfo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const IconDocs = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
const IconClock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const IconMatched = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
    </svg>
);
const IconScore = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconCompliance = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

export default LeadDetails;
