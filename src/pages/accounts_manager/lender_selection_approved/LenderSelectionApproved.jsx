import React, { useState } from 'react';
import './LenderSelectionApproved.css';

const APPROVED = [
    {
        id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00',
        lender: 'Bank of Whiterock', lenderTier: 'Tier 1 • Trusted Partner',
        approvedDate: 'Oct 23, 2023', interestRate: '3.8%', tenure: '30 Years',
        status: 'Funded',
    },
    {
        id: '#LD-98845', client: 'Marcus Aurelius', amount: '$75,000.00',
        lender: 'Global Finance', lenderTier: 'Tier 1 • International',
        approvedDate: 'Oct 22, 2023', interestRate: '4.2%', tenure: '15 Years',
        status: 'Disbursed',
    },
    {
        id: '#LD-98721', client: 'Quantum Capital Fund', amount: '$4,500,000.00',
        lender: 'Apex Capital Group', lenderTier: 'Tier 1 • High Net Worth',
        approvedDate: 'Oct 20, 2023', interestRate: '3.5%', tenure: '20 Years',
        status: 'Funded',
    },
    {
        id: '#LD-98614', client: 'Prime Wealth Trust', amount: '$980,000.00',
        lender: 'Secure Lenders', lenderTier: 'Tier 2 • Private Equity',
        approvedDate: 'Oct 18, 2023', interestRate: '4.9%', tenure: '25 Years',
        status: 'Processing',
    },
    {
        id: '#LD-98502', client: 'Global Trade Bank', amount: '$2,200,000.00',
        lender: 'Bank of Whiterock', lenderTier: 'Tier 1 • Trusted Partner',
        approvedDate: 'Oct 15, 2023', interestRate: '3.6%', tenure: '30 Years',
        status: 'Disbursed',
    },
];

const STATUS_STYLE = {
    Funded:     { bg: '#dcfce7', color: '#15803d' },
    Disbursed:  { bg: '#dbeafe', color: '#1d4ed8' },
    Processing: { bg: '#fef9c3', color: '#854d0e' },
};

const LenderSelectionApproved = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filtered = APPROVED.filter(a => {
        const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) ||
            a.id.toLowerCase().includes(search.toLowerCase()) ||
            a.lender.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || a.status === filter;
        return matchSearch && matchFilter;
    });

    const totalFunded = APPROVED.filter(a => a.status === 'Funded').length;
    const totalDisbursed = APPROVED.filter(a => a.status === 'Disbursed').length;
    const totalProcessing = APPROVED.filter(a => a.status === 'Processing').length;
    const totalValue = '$8,955,000.00';

    return (
        <div className="lsa-page">
            {/* Header */}
            <div className="lsa-header">
                <div>
                    <h1 className="lsa-title">Lender Selection Approved</h1>
                    <p className="lsa-subtitle">All approved leads with confirmed lender assignments and disbursement status.</p>
                </div>
                <button className="lsa-export-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Report
                </button>
            </div>

            {/* Stats */}
            <div className="lsa-stat-row">
                <div className="lsa-stat-card lsa-stat-total">
                    <div className="lsa-stat-icon" style={{ background: '#ebf0ff' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div>
                        <div className="lsa-stat-value">{APPROVED.length}</div>
                        <div className="lsa-stat-label">Total Approved</div>
                    </div>
                </div>
                <div className="lsa-stat-card">
                    <div className="lsa-stat-icon" style={{ background: '#dcfce7' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                    </div>
                    <div>
                        <div className="lsa-stat-value">{totalFunded}</div>
                        <div className="lsa-stat-label">Funded</div>
                    </div>
                </div>
                <div className="lsa-stat-card">
                    <div className="lsa-stat-icon" style={{ background: '#dbeafe' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div>
                        <div className="lsa-stat-value">{totalDisbursed}</div>
                        <div className="lsa-stat-label">Disbursed</div>
                    </div>
                </div>
                <div className="lsa-stat-card">
                    <div className="lsa-stat-icon" style={{ background: '#fef9c3' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div>
                        <div className="lsa-stat-value">{totalProcessing}</div>
                        <div className="lsa-stat-label">Processing</div>
                    </div>
                </div>
                <div className="lsa-stat-card">
                    <div className="lsa-stat-icon" style={{ background: '#f0fdf4' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <div>
                        <div className="lsa-stat-value">{totalValue}</div>
                        <div className="lsa-stat-label">Total Value</div>
                    </div>
                </div>
            </div>

            {/* Table card */}
            <div className="lsa-table-card">
                <div className="lsa-table-top">
                    <h3>Approved Leads</h3>
                    <div className="lsa-controls">
                        <div className="lsa-search-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by client, ID or lender..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="lsa-filter-tabs">
                            {['All', 'Funded', 'Disbursed', 'Processing'].map(f => (
                                <button
                                    key={f}
                                    className={`lsa-filter-tab ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <table className="lsa-table">
                    <thead>
                        <tr>
                            <th>LEAD ID</th>
                            <th>CLIENT NAME</th>
                            <th>AMOUNT</th>
                            <th>LENDER</th>
                            <th>INTEREST RATE</th>
                            <th>TENURE</th>
                            <th>APPROVED DATE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row) => {
                            const ss = STATUS_STYLE[row.status] || {};
                            return (
                                <tr key={row.id}>
                                    <td className="lsa-lead-id">{row.id}</td>
                                    <td className="lsa-client">{row.client}</td>
                                    <td className="lsa-amount">{row.amount}</td>
                                    <td>
                                        <div className="lsa-lender-cell">
                                            <div className="lsa-lender-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="1.5"
                                                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="lsa-lender-name">{row.lender}</div>
                                                <div className="lsa-lender-tier">{row.lenderTier}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="lsa-rate">{row.interestRate}</td>
                                    <td className="lsa-tenure">{row.tenure}</td>
                                    <td className="lsa-date">{row.approvedDate}</td>
                                    <td>
                                        <span className="lsa-status" style={{ background: ss.bg, color: ss.color }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="lsa-empty">No approved leads match your filter.</div>
                )}

                <div className="lsa-footer-info">
                    Showing {filtered.length} of {APPROVED.length} approved leads
                </div>
            </div>
        </div>
    );
};

export default LenderSelectionApproved;
