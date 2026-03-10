import React, { useState } from 'react';
import './DocumentVerification.css';

const DocumentVerification = () => {
    const [isRejectionOpen, setIsRejectionOpen] = useState(true); // Open by default as per the image
    const [rejectionReason, setRejectionReason] = useState('');

    const leadInfo = {
        id: 'WR-2026-0001',
        clientName: 'Jonathan Vickers',
        totalDocs: 1,
        pendingReview: 1,
        verified: 0
    };

    const documents = [
        {
            id: 2,
            type: 'Bank Statement',
            fileName: 'q3_statements.pdf',
            uploadDate: 'Oct 25, 2023',
            status: 'Pending',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M3 10h18M7 15h1m4 0h1m4 0h1M3 21h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                </svg>
            )
        }
    ];


    return (
        <div className="dv-page">
            {/* Header */}
            <div className="dv-page-header">
                <h1 className="dv-page-title">Document Verification</h1>
                <p className="dv-page-subtitle">
                    Reviewing assets for <span className="dv-subtitle-highlight">Lead {leadInfo.id}</span> (Client: {leadInfo.clientName})
                </p>
            </div>

            {/* Stats Cards */}
            <div className="dv-stats-row">
                <div className="dv-stat-card dv-stat-card--total">
                    <div className="dv-stat-info">
                        <span className="dv-stat-label">Total Documents</span>
                        <span className="dv-stat-value">{leadInfo.totalDocs.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="dv-stat-icon dv-stat-icon--total">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
                        </svg>
                    </div>
                </div>

                <div className="dv-stat-card dv-stat-card--pending">
                    <div className="dv-stat-info">
                        <span className="dv-stat-label">Pending Review</span>
                        <span className="dv-stat-value dv-stat-value--pending">{leadInfo.pendingReview.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="dv-stat-icon dv-stat-icon--pending">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <circle cx="12" cy="16" r="2" />
                        </svg>
                    </div>
                </div>

                <div className="dv-stat-card dv-stat-card--verified">
                    <div className="dv-stat-info">
                        <span className="dv-stat-label">Verified</span>
                        <span className="dv-stat-value dv-stat-value--verified">{leadInfo.verified.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="dv-stat-icon dv-stat-icon--verified">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="dv-card">
                <div className="dv-table-container">
                    <table className="dv-table">
                        <thead>
                            <tr>
                                <th>Document Type</th>
                                <th>File Name</th>
                                <th>Upload Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <React.Fragment key={doc.id}>
                                    <tr className={doc.status === 'Pending' && isRejectionOpen ? 'dv-row--active' : ''}>
                                        <td>
                                            <div className="dv-doc-type-cell">
                                                <div className="dv-doc-icon">{doc.icon}</div>
                                                <span className="dv-doc-name">{doc.type}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <a href="#" className="dv-file-link">{doc.fileName}</a>
                                        </td>
                                        <td>
                                            <span className="dv-date">{doc.uploadDate}</span>
                                        </td>
                                        <td>
                                            <span className={`dv-status-badge dv-status--${doc.status.toLowerCase()}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="dv-actions">
                                                <button className="dv-btn-view">View</button>
                                                <button className={`dv-btn-approve ${doc.status === 'Pending' ? 'active' : ''}`}>
                                                    Approve
                                                </button>
                                                {doc.status === 'Pending' && (
                                                    <button
                                                        className="dv-btn-reject"
                                                        onClick={() => setIsRejectionOpen(!isRejectionOpen)}
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Rejection Form Integration */}
                                    {doc.status === 'Pending' && isRejectionOpen && (
                                        <tr className="dv-rejection-row">
                                            <td colSpan="5">
                                                <div className="dv-rejection-container">
                                                    <span className="dv-rejection-label">Rejection Reason</span>
                                                    <div className="dv-rejection-form">
                                                        <input
                                                            type="text"
                                                            className="dv-rejection-input"
                                                            placeholder="Please provide specific details for rejection (e.g., 'Image is blurry' or 'Date expired')..."
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                        />
                                                        <button className="dv-btn-submit-rejection">
                                                            Submit Rejection
                                                        </button>
                                                        <button
                                                            className="dv-btn-cancel-rejection"
                                                            onClick={() => setIsRejectionOpen(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Progress Alert */}
            <div className="dv-progress-alert">
                <div className="dv-alert-content">
                    <div className="dv-alert-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>
                    <div className="dv-alert-info">
                        <span className="dv-alert-title">Overall Verification Progress</span>
                        <span className="dv-alert-desc">
                            {leadInfo.verified} out of {leadInfo.totalDocs} documents verified. Final approval requires all documents to be reviewed.
                        </span>
                    </div>
                </div>
                <button className={`dv-btn-final-approval ${leadInfo.verified === leadInfo.totalDocs ? 'active' : ''}`}>
                    Final Lead Approval
                </button>
            </div>
        </div>
    );
};

export default DocumentVerification;

