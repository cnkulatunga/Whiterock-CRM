import React, { useState } from 'react';
import './ManageLeads.css';

const MOCK_LEADS = [
    { id: 1, name: 'Robert Miller', email: 'robert@example.com', phone: '+1 234-567-890', source: 'Website Form', status: 'Document Collected', lastContact: '2 hours ago', stage: 'Initial' },
    { id: 2, name: 'Alice Huang', email: 'alice.h@gmail.com', phone: '+1 987-654-321', source: 'Referral', status: 'Document Verifications', lastContact: 'Today, 10:30 AM', stage: 'In Progress' },
    { id: 3, name: 'David Rivera', email: 'd.rivera@outlook.com', phone: '+1 456-123-789', source: 'LinkedIn', status: 'Lender Selection', lastContact: 'Yesterday', stage: 'In Progress' },
    { id: 4, name: 'Sarah Connor', email: 'sconnor@tech.co', phone: '+1 555-010-999', source: 'Direct Call', status: 'Loan Rejected', lastContact: 'Mar 04, 2024', stage: 'Lost' },
    { id: 5, name: 'Michael Chen', email: 'm.chen@sales.com', phone: '+1 888-222-333', source: 'Facebook Ads', status: 'Loan Confirmed', lastContact: '3 days ago', stage: 'Closed' },
    { id: 6, name: 'Emma Watson', email: 'emma@watson.inc', phone: '+1 777-555-444', source: 'Webinar', status: 'Document Verifications', lastContact: 'Feb 28, 2024', stage: 'In Progress' },
];

const ManageLeads = ({ onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = MOCK_LEADS.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-leads-container">
            <div className="leads-page-header">
                <div className="header-info">
                    <h1>Manage Leads</h1>
                    <p>Track, organize and manage your customer leads efficiently.</p>
                </div>
            </div>

            <div className="leads-stats-row">
                <div className="lead-stat-mini">
                    <span className="stat-label">Total Leads</span>
                    <span className="stat-value">1,284</span>
                </div>
                <div className="lead-stat-mini">
                    <span className="stat-label">New Today</span>
                    <span className="stat-value">12</span>
                </div>
                <div className="lead-stat-mini">
                    <span className="stat-label">Response Rate</span>
                    <span className="stat-value">94%</span>
                </div>
            </div>

            <div className="leads-table-container">
                <div className="table-header-actions">
                    <h2 className="table-title">Lead Directory</h2>
                    <div className="table-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" width="16" height="16">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="leads-responsive-table">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>LEAD NAME</th>
                                <th>EMAIL / PHONE</th>
                                <th>SOURCE</th>
                                <th>STATUS</th>
                                <th>LAST CONTACT</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id}>
                                    <td className="lead-name-cell">
                                        <div className="lead-avatar-sm">
                                            {lead.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="lead-full-name">{lead.name}</span>
                                    </td>
                                    <td>
                                        <div className="lead-contact-info">
                                            <span className="lead-email">{lead.email}</span>
                                            <span className="lead-phone">{lead.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="lead-source-tag">{lead.source}</span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${lead.status.toLowerCase().replace(' ', '-')}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td>{lead.lastContact}</td>
                                    <td>
                                        <button className="btn-edit-lead" onClick={() => onViewDetails(`WR-2026-${String(lead.id).padStart(4, '0')}`)}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <span className="footer-count">Showing 1-{filteredLeads.length} of {MOCK_LEADS.length} leads</span>
                    <div className="footer-pagination">
                        <button className="btn-page" disabled>Previous</button>
                        <button className="btn-page" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLeads;
