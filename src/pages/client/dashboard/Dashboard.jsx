import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>Application Summary</h1>
                    <p className="lead-id">Lead ID: <span className="highlight">#WR-882910</span> (Read-only)</p>
                </div>
                {/*<div className="header-right">
                    <span className="status-badge processing">Processing</span>
                    <button className="btn-details">View Full Details</button>
                </div>*/}
            </div>

            <div className="dashboard-grid">
                {/* Main Content Column */}
                <div className="main-col">
                    {/* Progress Card */}
                    <div className="card progress-card">
                        <div className="progress-header">
                            <div>
                                <span className="card-label">CURRENT STAGE</span>
                                <h2 className="stage-title">Lender Selection</h2>
                            </div>
                            <span className="percentage">75%</span>
                        </div>

                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: '75%' }}></div>
                            <div className="progress-steps">
                                <div className="step completed">
                                    <div className="step-dot"></div>
                                    <span className="step-label">Document Collection</span>
                                </div>
                                <div className="step completed">
                                    <div className="step-dot"></div>
                                    <span className="step-label">Verification</span>
                                </div>
                                <div className="step active">
                                    <div className="step-dot"></div>
                                    <span className="step-label">Lender Selection</span>
                                </div>
                                <div className="step">
                                    <div className="step-dot"></div>
                                    <span className="step-label">Complete</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-box">
                            <div className="info-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </div>
                            <div className="info-text">
                                <h3>Next Step: Final Decision</h3>
                                <p>We are currently matching your profile with the best available lenders. You will be notified once a match is confirmed.</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="stats-row">
                        <div className="card stat-card">
                            <div className="stat-icon amount">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">REQUESTED LOAN AMOUNT</span>
                                <span className="stat-value">$450,000.00</span>
                            </div>
                        </div>
                        <div className="card stat-card">
                            <div className="stat-icon date">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">SUBMISSION DATE</span>
                                <span className="stat-value">Oct 24, 2023</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="sidebar-col">
                    {/* Agent Card */}
                    <div className="card agent-card">
                        <span className="card-label uppercase">ASSIGNED AGENT</span>
                        <div className="agent-profile">
                            <div className="agent-avatar">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&auto=format&fit=crop" alt="Sarah Jenkins" />
                            </div>
                            <div className="agent-details">
                                <h3 className="agent-name">Sarah Jenkins</h3>
                                <span className="agent-role">Senior Loan Officer</span>
                            </div>
                        </div>
                        <div className="agent-contact">
                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>s.jenkins@whiterock.com</span>
                            </div>
                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>+1 (555) 092-8834</span>
                            </div>
                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>Mon - Fri, 9AM - 5PM EST</span>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/15550928834"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-message"
                            style={{ textDecoration: 'none' }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            Message Sarah (WhatsApp)
                        </a>
                    </div>

                    {/* Documents Card */}
                    <div className="card docs-card">
                        <input
                            type="file"
                            id="dashboard-file-input"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    alert(`Ready to upload: ${e.target.files[0].name}`);
                                }
                            }}
                        />
                        <h3 className="card-title">Required Documents</h3>
                        <div className="doc-list">
                            <div className="doc-item">
                                <div className="doc-name-group">
                                    <span className="doc-icon pending">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                            <circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </span>
                                    <span className="doc-name">Bank Statement</span>
                                </div>
                                <span className="doc-status required">REQUIRED</span>
                            </div>
                        </div>
                        <button
                            className="btn-upload"
                            onClick={() => document.getElementById('dashboard-file-input').click()}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload Bank Statement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
