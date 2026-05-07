import React from 'react';
import './LoanStatus.css';

const LoanStatus = () => {
    const milestones = [
        {
            amount: '$450,000',
            date: 'Oct 24, 2023',
            referenceId: 'LN-99281',
            status: 'Approved',
            action: 'APPLICATION CLOSED'
        },
        {
            amount: '$540,000',
            date: 'Oct 20, 2023',
            referenceId: 'LN-88273',
            status: 'In Review',
            action: 'Edit Details'
        },
        {
            amount: '$10,000',
            date: 'Oct 15, 2023',
            referenceId: 'LN-77210',
            status: 'Rejected',
            action: 'Rejected: Re-upload Required',
            note: 'Image blurry, please re-upload clear proof of income.'
        }
    ];

    return (
        <div className="loan-status-container">
            <header className="page-header">
                <h1>Loan Status</h1>
                <p>Monitor your loan application progress and track the verification status of your documents in real-time.</p>
            </header>

            <div className="summary-cards">
                <div className="summary-card">
                    <div className="card-header-row">
                        <div className="card-icon blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
                            </svg>
                        </div>
                        <span className="card-label">LOAN AMOUNT</span>
                    </div>
                    <div className="card-value">$350,000</div>
                </div>

                <div className="summary-card">
                    <div className="card-header-row">
                        <div className="card-icon orange">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
                            </svg>
                        </div>
                        <span className="card-label">INTEREST RATE</span>
                    </div>
                    <div className="card-value">4.25% APR</div>
                </div>

                <div className="summary-card">
                    <div className="card-header-row">
                        <div className="card-icon green">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <span className="card-label">TERM DURATION</span>
                    </div>
                    <div className="card-value">30 Years</div>
                </div>
            </div>

            <section className="milestones-section">
                <div className="section-header">
                    <h2>Application Milestones</h2>
                    <div className="search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search milestones..." />
                    </div>
                </div>

                <div className="milestone-table-wrapper">
                    <table className="milestone-table">
                        <thead>
                            <tr>
                                <th>AMOUNT</th>
                                <th>DATE</th>
                                <th>REFERENCE ID</th>
                                <th>STATUS</th>
                                <th className="text-right">ACTION / NOTE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milestones.map((m, i) => (
                                <tr key={i}>
                                    <td className="font-bold">{m.amount}</td>
                                    <td>{m.date}</td>
                                    <td>{m.referenceId}</td>
                                    <td>
                                        <span className={`status-pill ${m.status.toLowerCase().replace(' ', '-')}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-cell">
                                            {m.status === 'Rejected' ? (
                                                <div className="rejected-action">
                                                    <span className="error-text">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                                        </svg>
                                                        {m.action}
                                                    </span>
                                                    <p className="note-text">{m.note}</p>
                                                </div>
                                            ) : (
                                                <span className={`action-link ${m.action === 'APPLICATION CLOSED' ? 'closed' : 'edit'}`}>
                                                    {m.action}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer">
                    <span>Showing 1-3 of 8 milestones</span>
                    <div className="pagination">
                        <button disabled>Previous</button>
                        <button className="next-btn">Next</button>
                    </div>
                </div>
            </section>

            <section className="support-banner">
                <div className="support-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="10" r="2" />
                    </svg>
                </div>
                <div className="support-text">
                    <h3>Need help with your loan application?</h3>
                    <p>If you encounter any issues with document uploads or have questions about the verification process, our loan officers are available 24/7.</p>
                </div>
                <a
                    href="https://wa.me/15550928834"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-contact"
                >
                    Contact Support
                </a>
            </section>
        </div>
    );
};

export default LoanStatus;
