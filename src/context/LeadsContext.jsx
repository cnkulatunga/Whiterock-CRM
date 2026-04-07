import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MEMBERSHIPS, SHARED_INITIAL_USERS } from '../data/dummyData';
import { leadsApi } from '../services/crmApi';

const LeadsContext = createContext(null);

// Generate next AF-XXX id from current leads list
const generateLeadId = (leads) => {
    const nums = leads.map(l => {
        const match = l.id?.match(/AF-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    });
    const max = nums.length ? Math.max(...nums) : 0;
    return `AF-${String(max + 1).padStart(3, '0')}`;
};

export const LeadsProvider = ({ children }) => {
    const [leads, setLeads] = useState([]);

    // Fetch initial leads from the mocked API
    useEffect(() => {
        leadsApi.getAll().then(data => {
            setLeads(data);
        }).catch(err => console.error("Failed to load leads from API", err));
    }, []);

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem('crm_leads', JSON.stringify(leads));
    }, [leads]);

    /**
     * Create a new lead from CreateLead form data.
     * Maps all form fields to the standard lead shape used across the app.
     */
    const addLead = (formData) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const newId = generateLeadId(leads);

        // Resolve creator name
        let agentName = '';
        if (user.name) {
            agentName = user.name;
        } else if (user.first_name || user.last_name) {
            agentName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        } else {
            agentName = formData.assignedAgent || formData.agentName || 'Unknown Agent';
        }

        const role = user.role || '';

        // Build hierarchy fields based on who is creating the lead
        let tl = formData.tl || '';
        let manager = formData.manager || '';
        let createdByRole = role;

        if (role === 'team_leader' || role === 'Team Leader') {
            tl = agentName;
            manager = formData.manager || '';
        } else if (role === 'accounts_manager' || role === 'Accounts Manager') {
            manager = agentName;
            tl = formData.tl || '';
        } else if (role === 'super_admin' || role === 'Super Admin') {
            // Admin stays as agentName, label handled in UI
            tl = formData.tl || '';
            manager = formData.manager || '';
        } else if (role === 'tele_agent' || role === 'Tele Agent') {
            // tele_agent: agentName is already set, lookup tl
            if (!tl && user.id) {
                for (const leaderId in INITIAL_MEMBERSHIPS) {
                    if (INITIAL_MEMBERSHIPS[leaderId].some(m => m.id === user.id)) {
                        const leader = SHARED_INITIAL_USERS.find(u => u.id === parseInt(leaderId));
                        if (leader) tl = leader.name;
                    }
                }
            }
        }

        const newLead = {
            id: newId,
            leadId: newId,
            agentName,
            tl,
            manager,
            createdByRole,
            assignedStaffId: user.id || null,
            submissionDate: new Date().toISOString().split('T')[0],
            lastContact: 'Just now',
            status: 'Document Collection',
            stage: 'Document Collection',
            progress: 10,

            // Contact / business info
            name: formData.fullName || formData.name || '',
            businessName: formData.companyName || formData.businessName || '',
            email: formData.emailAddress || formData.email || '',
            phone: formData.phoneNumber || formData.phone || '',
            nic: formData.companyHouseNumber || formData.nic || '',
            source: formData.leadSource || formData.source || 'Manual',
            notes: formData.additionalComments || formData.notes || '',

            // Personal / address info
            dob: formData.dob || '',
            residentialAddress: formData.residentialAddress || '',
            timeAtCurrentAddress: formData.timeAtCurrentAddress || '',
            previousAddress: formData.previousAddress || '',

            // Loan / financial fields
            loanAmount: formData.loanAmount || '',
            loanPurpose: formData.loanPurpose || '',
            homeOwner: formData.homeOwner || '',
            companyBank: formData.companyBank || '',
            businessAnnualTurnover: formData.businessAnnualTurnover || '',
            fundingTimeline: formData.fundingTimeline || '',
            existingLoan: formData.existingLoan || '',
            existingLoanLenderName: formData.existingLoanLenderName || '',
            existingLoanAmount: formData.existingLoanAmount || '',
            existingLoanInterestRate: formData.existingLoanInterestRate || '',
            existingLoanMonthlyRepayment: formData.existingLoanMonthlyRepayment || '',
            existingLoanTerm: formData.existingLoanTerm || '',
            overdraftFacility: formData.overdraftFacility || '',
            creditConsent: formData.creditConsent || '',
            industry: formData.industry || '',
            jobTitle: formData.jobTitle || '',
            title: formData.title || '',
            preferredContactMethod: formData.preferredContactMethod || [],

            documents: formData.documents || [],
        };

        // Send to backend via API
        leadsApi.create(newLead).then(createdLead => {
            // Update local state with the exact backend response
            setLeads(prev => [createdLead, ...prev.filter(l => l.id !== createdLead.id)]);
        });

        // Optimistic UI update
        setLeads(prev => [newLead, ...prev]);
        return newLead;
    };

    /**
     * Update any fields on an existing lead by ID.
     */
    const updateLead = (id, changes) => {
        // Optimistic UI update
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l));
        
        // Background API call
        leadsApi.update(id, changes).catch(err => console.error('Failed to update lead', err));
    };

    /**
     * Delete a lead by ID.
     */
    const deleteLead = (id) => {
        setLeads(prev => prev.filter(l => l.id !== id));
        leadsApi.delete(id).catch(err => console.error('Failed to delete lead', err));
    };

    return (
        <LeadsContext.Provider value={{ leads, setLeads, addLead, updateLead, deleteLead }}>
            {children}
        </LeadsContext.Provider>
    );
};

export const useLeads = () => {
    const context = useContext(LeadsContext);
    if (!context) {
        throw new Error('useLeads must be used within a LeadsProvider');
    }
    return context;
};
