import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_LEADS } from '../data/dummyData';

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
    const [leads, setLeads] = useState(() => {
        try {
            const saved = localStorage.getItem('crm_leads');
            if (saved) {
                const parsed = JSON.parse(saved);
                const validStages = ['Document Collection', 'Document Verification Done', 'Document Rejected', 'Lender Selection', 'Completed', 'Rejected'];
                // Filter out stale leads with invalid IDs or unknown stages
                const clean = parsed.filter(l => l.id?.startsWith('AF-') && validStages.includes(l.stage));
                if (clean.length !== parsed.length) {
                    localStorage.setItem('crm_leads', JSON.stringify(clean));
                }
                return clean.length ? clean : MOCK_LEADS;
            }
            return MOCK_LEADS;
        } catch {
            return MOCK_LEADS;
        }
    });

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

        // Resolve agent name: prefer user's stored name, fall back to form field
        let agentName = '';
        if (user.name) {
            agentName = user.name;
        } else if (user.first_name || user.last_name) {
            agentName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        } else {
            agentName = formData.assignedAgent || formData.agentName || 'Unknown Agent';
        }

        const newLead = {
            id: newId,
            leadId: newId,
            agentName,
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

        setLeads(prev => [newLead, ...prev]);
        return newLead;
    };

    /**
     * Update any fields on an existing lead by ID.
     */
    const updateLead = (id, changes) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l));
    };

    /**
     * Delete a lead by ID.
     */
    const deleteLead = (id) => {
        setLeads(prev => prev.filter(l => l.id !== id));
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
