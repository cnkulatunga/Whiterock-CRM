import React, { useState } from 'react';
import './FinancialReports.css';

const TRANSACTIONS = [
    { ref: '#TRX-82910', lead: 'LD-4421', initials: 'AS', name: 'Alice Simpson', amount: '$4,250.00', date: 'Oct 24, 2023', status: 'Approved' },
    { ref: '#TRX-82911', lead: 'LD-4422', initials: 'BM', name: 'Brian Miller', amount: '$1,800.00', date: 'Oct 24, 2023', status: 'Pending' },
    { ref: '#TRX-82912', lead: 'LD-4423', initials: 'CW', name: 'Catherine West', amount: '$12,400.00', date: 'Oct 23, 2023', status: 'Approved' },
    { ref: '#TRX-82913', lead: 'LD-4424', initials: 'DK', name: 'David King', amount: '$750.00', date: 'Oct 23, 2023', status: 'Rejected' },
    { ref: '#TRX-82914', lead: 'LD-4425', initials: 'EL', name: 'Emma Lee', amount: '$3,120.00', date: 'Oct 22, 2023', status: 'Approved' },
];

const BAR_DATA = [
    { month: 'Jan', value: 55 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 75 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 92 },
    { month: 'Jun', value: 100 },
];

const FinancialReports = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [status, setStatus] = useState('All');
    const [manager, setManager] = useState('All Managers');

    return (
        <div className="am-fin-reports">
            {/* Header */}
            <div className="am-fin-header">
                <div>
                    <h1 className="am-fin-title">Financial Report</h1>
                    <p className="am-fin-subtitle">Real-time financial tracking and payment analysis</p>
                </div>
                <div className="am-fin-filters">
                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="am-fin-select">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Year</option>
                    </select>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="am-fin-select">
                        <option>All</option>
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                    </select>
                    <select value={manager} onChange={e => setManager(e.target.value)} className="am-fin-select">
                        <option>All Managers</option>
                        <option>Alex Thompson</option>
                        <option>Sarah Jenkins</option>
                    </select>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="am-fin-stat-grid">
                <div className="am-fin-stat-card">
                    <div className="am-fin-stat-icon" style={{ background: '#f0fdf4' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                    </div>
                    <div className="am-fin-stat-body">
                        <span className="am-fin-stat-label">Total Loans</span>
                        <span className="am-fin-stat-value">$428,540.00</span>
                        <span className="am-fin-stat-change positive">+12%</span>
                    </div>
                </div>
                <div className="am-fin-stat-card">
                    <div className="am-fin-stat-icon" style={{ background: '#fff7ed' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="am-fin-stat-body">
                        <span className="am-fin-stat-label">Pending Loans</span>
                        <span className="am-fin-stat-value">$42,180.50</span>
                        <span className="am-fin-stat-change neutral">0%</span>
                    </div>
                </div>
                <div className="am-fin-stat-card">
                    <div className="am-fin-stat-icon" style={{ background: '#fef2f2' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className="am-fin-stat-body">
                        <span className="am-fin-stat-label">Rejected Loans</span>
                        <span className="am-fin-stat-value">$8,240.00</span>
                        <span className="am-fin-stat-change negative">-4%</span>
                    </div>
                </div>
                <div className="am-fin-stat-card">
                    <div className="am-fin-stat-icon" style={{ background: '#eff6ff' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="am-fin-stat-body">
                        <span className="am-fin-stat-label">Monthly Revenue</span>
                        <span className="am-fin-stat-value">$156,200.00</span>
                        <span className="am-fin-stat-change positive">+8%</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="am-fin-charts-row">
                {/* Bar Chart */}
                <div className="am-fin-chart-card">
                    <div className="am-fin-chart-header">
                        <h3>Monthly Revenue Trend</h3>
                        <div className="am-fin-legend-item">
                            <div className="am-fin-legend-dot" style={{ background: '#2447d7' }} />
                            <span>Revenue</span>
                        </div>
                    </div>
                    <div className="am-fin-bar-chart">
                        {BAR_DATA.map((bar) => (
                            <div className="am-fin-bar-col" key={bar.month}>
                                <div className="am-fin-bar-track">
                                    <div
                                        className="am-fin-bar-fill"
                                        style={{ height: `${bar.value}%` }}
                                    />
                                </div>
                                <span className="am-fin-bar-label">{bar.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="am-fin-chart-card am-fin-donut-card">
                    <h3 className="am-fin-chart-header-title">Payment Status Distribution</h3>
                    <div className="am-fin-donut-wrap">
                        <svg viewBox="0 0 120 120" width="160" height="160">
                            {/* Background circle */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                            {/* Rejected - red (15%) */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="18"
                                strokeDasharray="42.4 240"
                                strokeDashoffset="0"
                                transform="rotate(-90 60 60)" />
                            {/* Pending - orange (10%) */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#f97316" strokeWidth="18"
                                strokeDasharray="28.3 240"
                                strokeDashoffset="-42.4"
                                transform="rotate(-90 60 60)" />
                            {/* Approved - green (75%) */}
                            <circle cx="60" cy="60" r="45" fill="none" stroke="#22c55e" strokeWidth="18"
                                strokeDasharray="212.1 240"
                                strokeDashoffset="-70.7"
                                transform="rotate(-90 60 60)" />
                        </svg>
                        <div className="am-fin-donut-center">
                            <span className="am-fin-donut-pct">94%</span>
                            <span className="am-fin-donut-label">SUCCESS RATE</span>
                        </div>
                    </div>
                    <div className="am-fin-donut-legend">
                        <div className="am-fin-donut-legend-item">
                            <div className="am-fin-legend-dot" style={{ background: '#22c55e' }} />
                            <span>Approved</span>
                            <span className="am-fin-legend-pct">75%</span>
                        </div>
                        <div className="am-fin-donut-legend-item">
                            <div className="am-fin-legend-dot" style={{ background: '#f97316' }} />
                            <span>Pending</span>
                            <span className="am-fin-legend-pct">10%</span>
                        </div>
                        <div className="am-fin-donut-legend-item">
                            <div className="am-fin-legend-dot" style={{ background: '#ef4444' }} />
                            <span>Rejected</span>
                            <span className="am-fin-legend-pct">15%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="am-fin-table-card">
                <div className="am-fin-table-header">
                    <h3>Transaction History</h3>
                    <div className="am-fin-export-btns">
                        <button className="am-fin-export-csv">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Export CSV
                        </button>
                        <button className="am-fin-export-pdf">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Export PDF
                        </button>
                    </div>
                </div>
                <table className="am-fin-table">
                    <thead>
                        <tr>
                            <th>REF ID</th>
                            <th>LEAD #</th>
                            <th>CUSTOMER NAME</th>
                            <th>AMOUNT</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TRANSACTIONS.map((tx) => (
                            <tr key={tx.ref}>
                                <td className="am-fin-ref">{tx.ref}</td>
                                <td className="am-fin-lead">{tx.lead}</td>
                                <td>
                                    <div className="am-fin-customer">
                                        <div className="am-fin-customer-avatar">{tx.initials}</div>
                                        <span>{tx.name}</span>
                                    </div>
                                </td>
                                <td className="am-fin-amount">{tx.amount}</td>
                                <td className="am-fin-date">{tx.date}</td>
                                <td>
                                    <span className={`am-fin-status am-fin-status--${tx.status.toLowerCase()}`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="am-fin-pagination">
                    <span className="am-fin-pag-info">Showing 1 to 5 of 128 transactions</span>
                    <div className="am-fin-pag-btns">
                        <button className="am-fin-pag-btn" disabled>‹</button>
                        <button className="am-fin-pag-btn am-fin-pag-btn--active">1</button>
                        <button className="am-fin-pag-btn">2</button>
                        <button className="am-fin-pag-btn">3</button>
                        <button className="am-fin-pag-btn">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;
