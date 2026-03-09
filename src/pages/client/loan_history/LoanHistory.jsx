import React from 'react';
import './LoanHistory.css';

const LoanHistory = () => {
    const historyData = [
        {
            leadNumber: 'LD-7612',
            type: 'Business Expansion',
            date: 'Sep 05, 2023',
            amount: '$120,000.00',
            outcome: 'Approved'
        },
        {
            leadNumber: 'LD-7401',
            type: 'Equipment Lease',
            date: 'Aug 22, 2023',
            amount: '$35,500.00',
            outcome: 'Closed'
        },
        {
            leadNumber: 'LD-6992',
            type: 'Real Estate Loan',
            date: 'Jul 10, 2023',
            amount: '$450,000.00',
            outcome: 'Withdrawn'
        },
        {
            leadNumber: 'LD-6551',
            type: 'Working Capital',
            date: 'May 14, 2023',
            amount: '$25,000.00',
            outcome: 'Approved'
        }
    ];

    return (
        <div className="loan-history-container">
            <header className="history-header">
                <div className="header-text">
                    <h1>My History</h1>
                    <p>Track and manage your commercial loan applications.</p>
                </div>
                {/* <button className="btn-new-app">
                    <span className="plus-icon">+</span> New Application
                </button> */}
            </header>

            <section className="history-section">
                <div className="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <polyline points="12 8 12 12 16 14" />
                        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                    </svg>
                    <h2>Application History</h2>
                </div>

                <div className="history-table-card">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>LEAD NUMBER</th>
                                <th>TYPE</th>
                                <th>COMPLETED DATE</th>
                                <th>AMOUNT</th>
                                <th>OUTCOME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.map((item, index) => (
                                <tr key={index}>
                                    <td className="lead-num">{item.leadNumber}</td>
                                    <td className="loan-type">{item.type}</td>
                                    <td className="comp-date">{item.date}</td>
                                    <td className="amount-cell">{item.amount}</td>
                                    <td>
                                        <span className={`outcome-pill ${item.outcome.toLowerCase()}`}>
                                            {item.outcome}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="table-footer">
                        <span className="pagination-info">Showing 4 of 12 historical applications</span>
                        <div className="pagination-btns">
                            <button className="page-btn" disabled>Previous</button>
                            <button className="page-btn">Next</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoanHistory;
