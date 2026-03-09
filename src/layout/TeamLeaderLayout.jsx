import React, { useState } from 'react';
import './TeamLeaderLayout.css';
import TeamLeaderSidebar from '../components/team_leader_sidebar/TeamLeaderSidebar';
import TeamLeaderDashboard from '../pages/team_leader/dashboard/TeamLeaderDashboard';
import LeadMonitoring from '../pages/team_leader/lead_monitoring/LeadMonitoring';
import DocumentVerification from '../pages/team_leader/document_verification/DocumentVerification';

const TeamLeaderLayout = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page) => {
        setActivePage(page);
        setIsSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <TeamLeaderDashboard />;
            case 'lead-monitoring':
                return <LeadMonitoring />;
            case 'document-verification':
                return <DocumentVerification />;
            default:
                return (
                    <div style={{ padding: '40px' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{activePage.replace('-', ' ').toUpperCase()}</h1>
                        <div style={{ marginTop: '20px', padding: '40px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#fff' }}>
                            <p style={{ color: '#718096' }}>This section is currently under development.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`tele-layout tl-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <TeamLeaderSidebar 
                activePage={activePage} 
                onNavigate={handleNavigate} 
                onLogout={onLogout} 
            />
            <div className="tele-main tl-main">
                <div className="tele-top-bar">
                    <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <div className="tele-search-container">
                        <div className="tele-search-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" placeholder="Search leads, agents, or files..." />
                        </div>
                    </div>

                </div>



                <div className="tele-content tl-content" key={activePage}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TeamLeaderLayout;
