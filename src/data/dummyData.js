/* ─── CENTRAL DUMMY DATA REPOSITORY ────────────────────── */

import { 
    USER_COLORS, 
    LENDER_TYPE_COLORS, 
    WORKFLOW_STAGE_COLORS,
    CHART_COLORS,
    ICON_BG_COLORS,
    LEAD_AVATAR_COLORS,
    QUALIFIED_LENDER_COLORS,
    DOCUMENT_COLORS,
    STATUS_COLORS,
    ROLE_COLORS
} from '../utils/colorSystem';

/**
 * SHARED_INITIAL_USERS
 * Centralized user data used across Context Providers and Dashboards.
 */
export const SHARED_INITIAL_USERS = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@alphafunding.com', initials: 'JD', ...USER_COLORS[1], role: 'Super Admin', roleColor: 'role--super', status: 'Active' },
    { id: 2, name: 'Marcus Smith', email: 'm.smith@alphafunding.com', initials: 'MS', ...USER_COLORS[2], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 3, name: 'Cody Lane', email: 'cody.l@alphafunding.com', initials: 'CL', ...USER_COLORS[3], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 4, name: 'Sarah White', email: 'sarah.w@alphafunding.com', initials: 'SW', ...USER_COLORS[4], role: 'Accounts Manager', roleColor: 'role--accounts', status: 'Active' },
    { id: 5, name: 'Diana Fernandez', email: 'd.fernandez@alphafunding.com', initials: 'DF', ...USER_COLORS[5], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 6, name: 'Leo Kumar', email: 'leo.k@alphafunding.com', initials: 'LK', ...USER_COLORS[6], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 7, name: 'Nina Hassan', email: 'nina.h@alphafunding.com', initials: 'NH', ...USER_COLORS[7], role: 'Tele Agent', roleColor: 'role--agent', status: 'Inactive' },
    { id: 8, name: 'Ryan Patel', email: 'r.patel@alphafunding.com', initials: 'RP', ...USER_COLORS[8], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 9, name: 'Aisha Nkosi', email: 'a.nkosi@alphafunding.com', initials: 'AN', ...USER_COLORS[9], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 10, name: 'Tom Brennan', email: 't.brennan@alphafunding.com', initials: 'TB', ...USER_COLORS[10], role: 'Team Leader', roleColor: 'role--leader', status: 'Inactive' },
    { id: 11, name: 'Priya Sharma', email: 'p.sharma@alphafunding.com', initials: 'PS', ...USER_COLORS[11], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 12, name: 'Jake Morrison', email: 'j.morrison@alphafunding.com', initials: 'JM', ...USER_COLORS[12], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 13, name: 'Elena Vasquez', email: 'e.vasquez@alphafunding.com', initials: 'EV', ...USER_COLORS[13], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 14, name: 'Omar Khalil', email: 'o.khalil@alphafunding.com', initials: 'OK', ...USER_COLORS[14], role: 'Tele Agent', roleColor: 'role--agent', status: 'Inactive' },
    { id: 15, name: 'Sophie Tan', email: 's.tan@alphafunding.com', initials: 'ST', ...USER_COLORS[15], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 16, name: 'Alex Johnson', email: 'a.johnson@alphafunding.com', initials: 'AJ', color: '#8b5cf6', textColor: '#ffffff', role: 'Accounts Manager', roleColor: 'role--accounts', status: 'Active' },
];

/**
 * SHARED CONSTANTS
 * Reusable lists for filters and configurations.
 */
export const ALL_ROLES = ['All Roles', 'Super Admin', 'Team Leader', 'Tele Agent', 'Accounts Manager'];
export const ALL_STATUSES = ['All', 'Active', 'Inactive', 'Qualified', 'Contacted', 'New'];
export const LOAN_DECISIONS = ['pending', 'approved', 'rejected'];
export const WORKFLOW_STAGES_LIST = ['All Stages', 'Document Collection', 'Document Verification Done', 'Document Rejected', 'Lender Selection', 'Completed', 'Rejected'];

export const DATE_RANGE_OPTIONS = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'];

export const DOCUMENT_VERIFICATION_DATES = ['All Time', 'Today', 'Yesterday', 'Last 7 Days'];

export const AUDIT_LOG_USER_ROLES = ['Any Role', 'Super Admin', 'Account Manager', 'Team Leader', 'Tele Agent'];

// Derive Tele Agent names for filters to stay consistent
export const PERFORMANCE_AGENT_OPTIONS = ['All Agents', ...SHARED_INITIAL_USERS.filter(u => u.role === 'Tele Agent').map(u => u.name)];
export const PERFORMANCE_LEAD_STATUSES = ['All', 'Document Collection', 'Document Verification Done', 'Document Rejected', 'Lender Selection', 'Completed', 'Rejected'];

export const LENDER_TYPES = ['Major Bank', 'Non-Bank', 'Credit Union', 'Building Society', 'Specialist'];

export { LENDER_TYPE_COLORS } from '../utils/colorSystem';

export const FULL_LENDERS_LIST = [
    { id: 1, name: 'ANZ Bank', type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', minDeposit: '10%', contact: 'lending@anz.com', status: 'Active', commercial: true, secured: true, unsecured: false, refinance: true },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', minDeposit: '5%', contact: 'brokers@cba.com.au', status: 'Active', commercial: true, secured: true, unsecured: false, refinance: true },
    { id: 3, name: 'Macquarie Bank', type: 'Non-Bank', interestRate: '5.59%', maxLoan: '$5,000,000', minDeposit: '20%', contact: 'partners@macquarie.com', status: 'Active', commercial: true, secured: true, unsecured: false, refinance: false },
    { id: 4, name: 'Liberty Financial', type: 'Non-Bank', interestRate: '6.49%', maxLoan: '$1,500,000', minDeposit: '0%', contact: 'support@liberty.com.au', status: 'Inactive', commercial: false, secured: false, unsecured: true, refinance: true },
    { id: 5, name: 'Westpac', type: 'Major Bank', interestRate: '5.95%', maxLoan: '$2,500,000', minDeposit: '10%', contact: 'loans@westpac.com.au', status: 'Active', commercial: true, secured: true, unsecured: false, refinance: true },
    { id: 6, name: 'NAB', type: 'Major Bank', interestRate: '5.85%', maxLoan: '$2,200,000', minDeposit: '5%', contact: 'business@nab.com.au', status: 'Active', commercial: true, secured: true, unsecured: false, refinance: true },
    { id: 7, name: 'Suncorp', type: 'Major Bank', interestRate: '6.12%', maxLoan: '$1,800,000', minDeposit: '15%', contact: 'info@suncorp.com.au', status: 'Active', commercial: true, secured: true, unsecured: false, refinance: false },
    { id: 8, name: 'Heritage Bank', type: 'Credit Union', interestRate: '5.45%', maxLoan: '$1,200,000', minDeposit: '10%', contact: 'apply@heritage.com.au', status: 'Active', commercial: false, secured: true, unsecured: true, refinance: true },
];

/**
 * INITIAL_TASKS
 * Seed data for the global tasks and follow-ups system.
 */
export const INITIAL_TASKS = [
    // Super Admin Tasks
    { id: 301, title: 'Compliance Audit', lead: 'Alpha Funding', status: 'Pending', date: '2026-03-12', time: '10:00', type: 'Review', reminder: '1h', assignedTo: 'Self' },
    { id: 302, title: 'System Maintenance', lead: 'Infrastructure', status: 'In Progress', date: '2026-03-12', time: '15:00', type: 'Administrative', reminder: 'none', assignedTo: 'Self' },

    // Team Leader Tasks
    { id: 101, title: 'Follow up with New Leads', lead: 'Team Alpha', status: 'Pending', date: '2026-03-16', time: '10:00', type: 'Call', reminder: '15m', assignedTo: 'Self' },
    { id: 102, title: 'Quarterly Review Prep', lead: 'Internal', status: 'In Progress', date: '2026-03-17', time: '14:30', type: 'Meeting', reminder: '1h', assignedTo: 'Self' },

    // Account Manager Tasks
    { id: 201, title: 'Leads Strategy Review', lead: 'Key Accounts', status: 'Pending', date: '2026-03-16', time: '11:00', type: 'Meeting', reminder: '1h', assignedTo: 'Self' },
    { id: 202, title: 'Quarterly Performance Report', lead: 'Enterprise', status: 'In Progress', date: '2026-03-18', time: '09:00', type: 'Review', reminder: 'none', assignedTo: 'Self' },

    // Tele Agent Tasks
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', email: 'robert.miller@logistics.com', phone: '+44 20 7946 0123', status: 'Pending', date: '2026-03-26', time: '14:00', type: 'Call', reminder: '15m', assignedTo: '3', description: 'Address concerns about the high interest rate on the proposed working capital loan.' },
    { id: 2, title: "Verify Alice Huang's documents", lead: 'Alice Huang', email: 'alice.huang@techsol.com', phone: '+44 20 7946 0456', status: 'In Progress', date: '2026-03-26', time: '16:30', type: 'Document', reminder: '1h', assignedTo: '3', description: 'Check the business annual turnover figures match the submitted bank statements.' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', email: 'd.rivera@designstudio.uk', phone: '+44 20 7946 0789', status: 'Completed', date: '2026-03-25', time: '10:00', type: 'Review', reminder: 'none', assignedTo: '3', description: 'Eligibility confirmed. Ready to proceed to the next stage of document collection.' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', email: 'm.chen@financehub.com', phone: '+44 20 7946 0111', status: 'Pending', date: '2026-03-27', time: '10:00', type: 'Email', reminder: '1d', assignedTo: '3', description: 'Introduce the team and outline the next steps for documentation submission.' },
];

/**
 * INITIAL_MEMBERSHIPS
 * Maps Team Leaders (by ID) to their team members.
 */
export const INITIAL_MEMBERSHIPS = {
    2: [ // Marcus Smith
        { id: 3, name: 'Cody Lane', email: 'cody.l@alphafunding.com', role: 'Tele Agent', initials: 'CL', ...USER_COLORS[3], status: 'Active' },
        { id: 11, name: 'Priya Sharma', email: 'p.sharma@alphafunding.com', role: 'Tele Agent', initials: 'PS', ...USER_COLORS[11], status: 'Active' },
    ],
    5: [ // Diana Fernandez
        { id: 6, name: 'Leo Kumar', email: 'leo.k@alphafunding.com', role: 'Tele Agent', initials: 'LK', ...USER_COLORS[6], status: 'Active' },
        { id: 7, name: 'Nina Hassan', email: 'nina.h@alphafunding.com', role: 'Tele Agent', initials: 'NH', ...USER_COLORS[7], status: 'Inactive' },
        { id: 13, name: 'Elena Vasquez', email: 'e.vasquez@alphafunding.com', role: 'Tele Agent', initials: 'EV', ...USER_COLORS[13], status: 'Active' },
    ],
    8: [ // Ryan Patel
        { id: 12, name: 'Jake Morrison', email: 'j.morrison@alphafunding.com', role: 'Tele Agent', initials: 'JM', ...USER_COLORS[12], status: 'Active' },
        { id: 15, name: 'Sophie Tan', email: 's.tan@alphafunding.com', role: 'Tele Agent', initials: 'ST', ...USER_COLORS[15], status: 'Active' },
    ],
    9: [ // Aisha Nkosi
        { id: 14, name: 'Omar Khalil', email: 'o.khalil@alphafunding.com', role: 'Tele Agent', initials: 'OK', ...USER_COLORS[14], status: 'Inactive' },
    ],
    10: [], // Tom Brennan
};

export const AM_MEMBERSHIPS = {
    4: [2, 5, 8], // Sarah White -> Marcus, Diana, Ryan
    16: [9, 10],  // Alex Johnson -> Aisha, Tom
};

/**
 * RECENT_LENDERS
 * Mock data for the lender selection and management views.
 */
export const RECENT_LENDERS = [
    { id: 1, name: 'ANZ Bank', type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', status: 'Active' },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', status: 'Active' },
    { id: 3, name: 'Macquarie Bank', type: 'Non-Bank', interestRate: '5.59%', maxLoan: '$5,000,000', status: 'Active' },
    { id: 4, name: 'Liberty Financial', type: 'Non-Bank', interestRate: '6.49%', maxLoan: '$1,500,000', status: 'Inactive' },
];

/**
 * LEADS_BY_STAGE
 * Aggregated stats for Tele Agent dashboards.
 */
export const LEADS_BY_STAGE = [
    { stage: 'Document Collection', count: 42, percentage: 85 },
    { stage: 'Document Verification Done', count: 28, percentage: 60 },
    { stage: 'Lender Selection', count: 34, percentage: 75 },
    { stage: 'Completed', count: 12, percentage: 30 },
    { stage: 'Rejected', count: 3, percentage: 10 },
];

/**
 * WORKFLOW_STAGES & OPERATIONAL_FLOW_LEADS
 * Detailed flow data for Super Admin Operational Flow.
 */
export const WORKFLOW_STAGES = [
    { id: 'lead_gather', label: 'Lead Detail Gather', color: WORKFLOW_STAGE_COLORS.lead_gather.color, description: 'Tele Agent gathering core info' },
    { id: 'doc_collect', label: 'Collect Document', color: WORKFLOW_STAGE_COLORS.doc_collect.color, description: 'Team Leader collecting records' },
    { id: 'lender_select', label: 'Lender Selection', color: WORKFLOW_STAGE_COLORS.lender_select.color, description: 'Manager selecting best partner' },
    { id: 'closed', label: 'Confirmed or Rejected', color: WORKFLOW_STAGE_COLORS.closed.color, description: 'Final process outcome' },
];

export const OPERATIONAL_FLOW_LEADS = [
    {
        id: 'AF-011', name: 'James Wilson', businessName: 'Global Tech Solutions', manager: 'Sarah White', tl: 'Marcus Smith', agent: 'Priya Sharma', stage: 'lead_gather', progress: 25, lastActive: '2h ago',
        leadDetails: {
            phone: '+1 (555) 012-3456', email: 'corp@globaltech.com', source: 'Direct Website',
            amount: '$250,000', purpose: 'Working Capital', nic: '772910293-TX',
            residentialAddress: '88 Tech Plaza, Austin, TX 78701',
            turnover: '£1,200,000', homeowner: 'YES', bank: 'Barclays', overdraft: '£10,000',
            existingLoan: 'NA', term: '24 months', fundingTimeline: 'Within 1 month',
            notes: 'Lead is looking for rapid funding to cover a sudden Q3 inventory spike. High priority.'
        },
        lenderDetails: { partner: 'Pending', rate: 'N/A', status: 'Analysis Stage', terms: 'N/A' }
    },
    {
        id: 'AF-012', name: 'Robert Chen', businessName: 'Apex Industries', manager: 'Sarah White', tl: 'Marcus Smith', agent: 'Jake Morrison', stage: 'doc_collect', progress: 50, lastActive: '45m ago',
        leadDetails: {
            phone: '+1 (555) 987-6543', email: 'fin@apexind.io', source: 'Premium Referral',
            amount: '$1.2M', purpose: 'Equipment Finance', nic: '992010294-NY',
            residentialAddress: '15 Industrial Blvd, Rochester, NY 14623',
            turnover: '£3,500,000', homeowner: 'YES', bank: 'HSBC', overdraft: '£25,000',
            existingLoan: 'HSBC – £180,000 @ 4.5% / £4,200/mo / 36mo', term: '48 months', fundingTimeline: 'Immediately',
            notes: 'Requires heavy machinery leasing. Documents are partially submitted.'
        },
        lenderDetails: { partner: 'Pending', rate: 'N/A', status: 'Document Verification', terms: 'N/A' }
    },
    {
        id: 'AF-013', name: 'Sarah Miller', businessName: 'Blue Sky Ventures', manager: 'Sarah White', tl: 'Diana Fernandez', agent: 'Nina Hassan', stage: 'lender_select', progress: 75, lastActive: '1d ago',
        leadDetails: {
            phone: '+1 (555) 444-2222', email: 'hello@bluesky.vc', source: 'LinkedIn Campaign',
            amount: '$500,000', purpose: 'Expansion Loan', nic: '448291039-SF',
            residentialAddress: '22 Venture Way, San Francisco, CA 94105',
            turnover: '£900,000', homeowner: 'NO', bank: 'Lloyds', overdraft: 'NA',
            existingLoan: 'NA', term: '36 months', fundingTimeline: 'Within 3 months',
            notes: 'Seed-stage startup looking for non-dilutive capital. Financials look strong.'
        },
        lenderDetails: { partner: 'Capital One', rate: '4.2%', status: 'Offer Received', terms: '60 Months' }
    },
    {
        id: 'AF-014', name: 'Michael Thompson', businessName: 'Summit Realty', manager: 'Sarah White', tl: 'Elena Vasquez', agent: 'Sophie Tan', stage: 'won', progress: 100, lastActive: '3h ago',
        leadDetails: {
            phone: '+1 (555) 333-1111', email: 'ops@summitrealty.com', source: 'Cold Outreach',
            amount: '$750,000', purpose: 'Bridge Loan', nic: '331029384-FL',
            residentialAddress: '55 Ocean Dr, Miami, FL 33139',
            turnover: '£5,200,000', homeowner: 'YES', bank: 'Santander', overdraft: '£50,000',
            existingLoan: 'Barclays – £300,000 @ 3.9% / £6,800/mo / 60mo', term: '60 months', fundingTimeline: 'Within 2 weeks',
            notes: 'Urgent bridge loan for a real estate acquisition closing in 2 weeks.'
        },
        lenderDetails: { partner: 'Commonwealth Bank', rate: '3.8%', status: 'Funded', terms: '48 Months' }
    },
];


/**
 * Team Leader Dashboard Data
 */
export const TL_STATS = [
    { label: 'Total Active Leads', value: 1284, trend: '+5.2%', trendType: 'positive' },
    { label: 'Pending Documents', value: '48', trend: null, trendType: 'neutral' },
];

export const TL_AGENT_PERFORMANCE = [
    { name: 'Cody Lane', initials: 'CL', activeLeads: 156, closedDeals: 24, color: USER_COLORS[3].color, role: 'Tele Agent' },
    { name: 'Leo Kumar', initials: 'LK', activeLeads: 132, closedDeals: 19, color: USER_COLORS[6].color, role: 'Tele Agent' },
    { name: 'Priya Sharma', initials: 'PS', activeLeads: 145, closedDeals: 21, color: USER_COLORS[11].color, role: 'Tele Agent' },
    { name: 'Jake Morrison', initials: 'JM', activeLeads: 142, closedDeals: 18, color: USER_COLORS[12].color, role: 'Tele Agent' },
    { name: 'Elena Vasquez', initials: 'EV', activeLeads: 98, closedDeals: 22, color: USER_COLORS[13].color, role: 'Tele Agent' },
    { name: 'Sophie Tan', initials: 'ST', activeLeads: 115, closedDeals: 12, color: USER_COLORS[15].color, role: 'Tele Agent' },
];

export const TL_DOCUMENT_COLLECTION = [
    { label: 'BANK STATEMENTS', progress: 78, color: CHART_COLORS.primary },
];

export const TL_PIPELINE_DATA = [
    { label: 'Pending Documents', value: 35, color: CHART_COLORS.warning },
    { label: 'Approved Documents', value: 55, color: CHART_COLORS.success },
    { label: 'Rejected Documents', value: 10, color: CHART_COLORS.danger },
];

/**
 * Accounts Manager Section specific data
 */
export const MOCK_LEAD_COUNTS = {
    total: 1284,
    pending: 28,
    approved: 442,
    rejected: 15,
    newToday: 12,
    responseRate: '94%',
    3: 15, 11: 12, 6: 22, 7: 5, 13: 18, 12: 14, 15: 20, 14: 3
};

export const AM_STAT_CARDS = [
    { label: 'Verified Clients', value: MOCK_LEAD_COUNTS.total.toLocaleString(), change: '+12%', changeLabel: 'vs last month', iconBg: ICON_BG_COLORS.blue },
    { label: 'Pending Loans', value: '42', change: '+8%', changeLabel: 'vs last week', iconBg: ICON_BG_COLORS.orange },
    { label: 'Approved vs Rejected', value: '85% / 15%', change: '+3%', changeLabel: 'approval rate', iconBg: ICON_BG_COLORS.green },
];

export const AM_RECENT_LEADS = [
    { id: 'AF-001', name: 'Robert Miller',  businessName: 'Miller Logistics Co.', amount: '$250,000.00', stage: 'Document Collection', stageCls: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]', date: 'Oct 24, 2023' },
    { id: 'AF-002', name: 'Alice Huang',    businessName: 'Huang Tech Solutions', amount: '$1,200,000.00', stage: 'Lender Selection', stageCls: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]', date: 'Oct 23, 2023' },
    { id: 'AF-008', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting',  amount: '$75,000.00', stage: 'Completed', stageCls: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]', date: 'Oct 22, 2023' },
    { id: 'AF-004', name: 'Sarah Connor',   businessName: 'Connor Security Group', amount: '$540,000.00', stage: 'Rejected', stageCls: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]', date: 'Oct 21, 2023' },
];

/**
 * MOCK_LEADS
 * Core leads data used for Manage Leads, Create Lead (duplicate check), and Document Verification.
 */
export const MOCK_LEADS = [
    {
        id: 'AF-001', leadId: 'AF-001', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-15', name: 'Robert Miller',
        businessName: 'Miller Logistics Co.', email: 'robert@example.com', phone: '+1 234-567-890', nic: 'NIC-001', source: 'Website Form', status: 'Document Collection', lastContact: '2 hours ago', stage: 'Document Collection', progress: 20, assignedStaffId: 3,
        dob: '1985-05-12', residentialAddress: '123 Logistics Way, London, E1 6AN', timeAtCurrentAddress: '5 years', previousAddress: '',
        loanAmount: '£250,000', loanPurpose: 'Fleet Expansion', homeOwner: 'Yes', companyBank: 'Barclays', businessAnnualTurnover: '1,200,000', fundingTimeline: 'Within 1 month', industry: 'Logistics', jobTitle: 'CEO',
        existingLoan: 'Yes', existingLoanLenderName: 'HSBC', existingLoanAmount: '50,000', existingLoanInterestRate: '4.5', existingLoanMonthlyRepayment: '1,200', existingLoanTerm: '36 months', overdraftFacility: 'Yes',
        notes: 'Customer is looking for a home loan for a primary residence. Preferred contact time is evening after 6 PM.',
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Approved', note: 'Verified by SG', date: '2024-03-15' },
            { id: 2, type: 'Payslip', status: 'Approved', note: 'Clear copy', date: '2024-03-15' },
            { id: 3, type: 'ID Document', status: 'Pending', note: '', date: '2024-03-16' }
        ]
    },
    {
        id: 'AF-002', leadId: 'AF-002', agentName: 'Leo Kumar', tl: 'Diana Fernandez', manager: 'Sarah White', submissionDate: '2026-03-16', name: 'Alice Huang',
        businessName: 'Huang Tech Solutions', email: 'alice.h@gmail.com', phone: '+1 987-654-321', nic: 'NIC-002', source: 'Referral', status: 'Document Verification Done', lastContact: 'Today, 10:30 AM', stage: 'Document Verification Done', progress: 40, assignedStaffId: 6,
        dob: '1992-11-20', residentialAddress: '45 Tech Plaza, Manchester, M1 4BT', timeAtCurrentAddress: '2 years', previousAddress: '12 Old Lane, Liverpool, L3 5DA',
        loanAmount: '£1,200,000', loanPurpose: 'Research & Development', homeOwner: 'No', companyBank: 'HSBC', businessAnnualTurnover: '5,000,000', fundingTimeline: 'ASAP', industry: 'Software', jobTitle: 'Founder',
        existingLoan: 'No', overdraftFacility: 'No',
        notes: 'Interested in business expansion loan. Needs quick turnaround as they have a pending property purchase.',
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Rejected', note: 'Period missing', date: '2024-03-14' },
            { id: 2, type: 'Payslip', status: 'Missing', note: '', date: '' }
        ]
    },
    {
        id: 'AF-011', leadId: 'AF-011', agentName: 'Priya Sharma', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-19', name: 'Bruce Wayne',
        businessName: 'Wayne Enterprises', email: 'bruce@waynecorp.com', phone: '+1 800-BATMAN', nic: 'NIC-011', source: 'Direct Call', status: 'Pending', lastContact: '10 mins ago', stage: 'Document Collection', progress: 10, assignedStaffId: 11,
        dob: '1975-02-19', residentialAddress: 'Wayne Manor, Gotham', timeAtCurrentAddress: '15 years', previousAddress: '',
        loanAmount: '£50,000,000', loanPurpose: 'Infrastructure', homeOwner: 'Yes', companyBank: 'HSBC', businessAnnualTurnover: '500,000,000', fundingTimeline: 'Immediate', industry: 'Hardware', jobTitle: 'Chairman',
        existingLoan: 'No', overdraftFacility: 'Yes',
        notes: 'Customer prefers discretion. Financing for a new R&D facility.',
        documents: []
    },
    { id: 'AF-003', leadId: 'AF-003', agentName: 'Priya Sharma', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-14', name: 'David Rivera', businessName: 'Rivera Designs',
 email: 'd.rivera@outlook.com', phone: '+1 456-123-789', nic: 'NIC-003', source: 'LinkedIn', status: 'Lender Selection', lastContact: 'Yesterday', stage: 'Lender Selection', progress: 60, assignedStaffId: 11, documents: [] },
    {
        id: 'AF-004', leadId: 'AF-004', agentName: 'Jake Morrison', tl: 'Ryan Patel', manager: 'Alex Johnson', submissionDate: '2026-03-13', name: 'Sarah Connor',
 businessName: 'Connor Security Group', email: 'sconnor@tech.co', phone: '+1 555-010-999', nic: 'NIC-004', source: 'Direct Call', status: 'Rejected', lastContact: 'Mar 04, 2024', stage: 'Rejected', progress: 100, assignedStaffId: 12,
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Rejected', note: 'Unclear scan', date: '2024-03-01' },
            { id: 2, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-01' }
        ]
    },
    {
        id: 'AF-005', leadId: 'AF-005', agentName: 'Jake Morrison', tl: 'Ryan Patel', manager: 'Alex Johnson', submissionDate: '2026-03-12', name: 'Michael Chen',
 businessName: 'Chen Finance Hub', email: 'm.chen@sales.com', phone: '+1 888-222-333', nic: 'NIC-005', source: 'Facebook Ads', status: 'Completed', lastContact: '3 days ago', stage: 'Completed', progress: 100, assignedStaffId: 12,
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Approved', note: 'Final review OK', date: '2024-03-10' },
            { id: 2, type: 'Payslip', status: 'Approved', note: 'Verified', date: '2024-03-10' },
            { id: 3, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-10' },
            { id: 4, type: 'Loan Agreement', status: 'Approved', note: 'Signed', date: '2024-03-12' }
        ]
    },
    {
        id: 'AF-006', leadId: 'AF-006', agentName: 'Elena Vasquez', tl: 'Diana Fernandez', manager: 'Sarah White', submissionDate: '2026-03-16', name: 'Emma Watson',
 businessName: 'Watson Creative Agency', email: 'emma@watson.inc', phone: '+1 777-555-444', nic: 'NIC-006', source: 'Webinar', status: 'Document Verification Done', lastContact: 'Feb 28, 2024', stage: 'Document Verification Done', progress: 40, assignedStaffId: 13,
        documents: [
            { id: 1, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-15' }
        ]
    },
    {
        id: 'AF-007', leadId: 'AF-007', agentName: 'Sophie Tan', tl: 'Ryan Patel', manager: 'Alex Johnson', submissionDate: '2026-03-17', name: 'Liam Neeson',
 businessName: 'Neeson Security', email: 'liam@security.com', phone: '+1 222-333-444', nic: 'NIC-007', source: 'Referral', status: 'Lender Selection', lastContact: '1 hour ago', stage: 'Lender Selection', progress: 80, assignedStaffId: 15, documents: []
    },
    {
        id: 'AF-008', leadId: 'AF-008', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-15', name: 'Marcus Aurelius',
        businessName: 'Aurelius Consulting', email: 'marcus@consulting.it', phone: '+1 555-999-888', nic: 'NIC-008', source: 'LinkedIn', status: 'Completed', lastContact: '2 days ago', stage: 'Completed', progress: 100, assignedStaffId: 3, documents: []
    },
    {
        id: 'AF-009', leadId: 'AF-009', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-18', name: 'Thomas Shelby',
        businessName: 'Shelby Company Ltd', email: 'tommy@shelby.co.uk', phone: '+44 121 496 0000', nic: 'NIC-009', source: 'Direct Call', status: 'Document Collection', lastContact: 'Just now', stage: 'Document Collection', progress: 10, assignedStaffId: 3,
        dob: '1890-11-01', residentialAddress: 'Small Heath, Birmingham', timeAtCurrentAddress: '10 years', previousAddress: '',
        loanAmount: '£5,000,000', loanPurpose: 'Expansion', homeOwner: 'Yes', companyBank: 'Lloyds Bank', businessAnnualTurnover: '10,000,000', fundingTimeline: 'Immediate', industry: 'Logistics', jobTitle: 'MD',
        existingLoan: 'No', overdraftFacility: 'Yes',
        notes: 'Very influential customer. Priority handling requested.',
        documents: []
    },
    {
        id: 'AF-010', leadId: 'AF-010', agentName: 'Leo Kumar', tl: 'Diana Fernandez', manager: 'Sarah White', submissionDate: '2026-03-19', name: 'Diana Prince',
        businessName: 'Themyscira Artifacts', email: 'diana@wonder.com', phone: '+1 800-JUSTICE', nic: 'NIC-010', source: 'Partner', status: 'Lender Selection', lastContact: '5 mins ago', stage: 'Lender Selection', progress: 60, assignedStaffId: 6,
        dob: '1900-01-01', residentialAddress: '1 Wonder Way, Gateway City', timeAtCurrentAddress: '20 years', previousAddress: '',
        loanAmount: '£850,000', loanPurpose: 'Museum Acquisition', homeOwner: 'Yes', companyBank: 'Starling', businessAnnualTurnover: '2,500,000', fundingTimeline: '2 weeks', industry: 'Arts', jobTitle: 'Curator',
        existingLoan: 'Yes', existingLoanLenderName: 'Gotham Bank', existingLoanAmount: '200,000', existingLoanInterestRate: '3.2', existingLoanMonthlyRepayment: '4,000', existingLoanTerm: '60 months', overdraftFacility: 'No',
        notes: 'Looking to acquire historical items. Financing needed for auction.',
        documents: [
            { id: 1, type: 'Certificate of Authenticity', status: 'Approved', note: 'Verified by Museum', date: '2024-03-18' }
        ]
    },
    {
        id: 'AF-015', leadId: 'AF-015', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-24', name: 'Tony Stark',
        businessName: 'Stark Industries', email: 'tony@stark.com', phone: '+1 800-IRON-MAN', nic: 'NIC-015', source: 'Direct', status: 'Document Collection', lastContact: 'Just now', stage: 'Document Collection', progress: 15, assignedStaffId: 3,
        loanAmount: '£10,000,000', loanPurpose: 'R&D', homeOwner: 'Yes', companyBank: 'Stark Bank', businessAnnualTurnover: '100,000,000', fundingTimeline: 'ASAP', industry: 'Tech', jobTitle: 'CEO',
        existingLoan: 'No', overdraftFacility: 'Yes',
        notes: 'High priority lead for clean energy project.',
        documents: []
    },
    {
        id: 'AF-016', leadId: 'AF-016', agentName: 'Priya Sharma', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-24', name: 'Steve Rogers',
        businessName: 'Shield Logistics', email: 'steve@shield.gov', phone: '+1 800-CAPTAIN', nic: 'NIC-016', source: 'Referral', status: 'Lender Selection', lastContact: '1 hour ago', stage: 'Lender Selection', progress: 70, assignedStaffId: 11,
        loanAmount: '£500,000', loanPurpose: 'Logistics', homeOwner: 'No', companyBank: 'Army Bank', businessAnnualTurnover: '5,000,000', fundingTimeline: '1 month', industry: 'Security', jobTitle: 'Director',
        existingLoan: 'No', overdraftFacility: 'No',
        notes: 'Needs funding for new transport fleet.',
        documents: []
    },
    {
        id: 'AF-017', leadId: 'AF-017', agentName: 'Jake Morrison', tl: 'Ryan Patel', manager: 'Alex Johnson', submissionDate: '2026-03-24', name: 'Natasha Romanoff',
        businessName: 'Red Room Agency', email: 'natasha@avengers.com', phone: '+1 800-WIDOW', nic: 'NIC-017', source: 'Cold Outreach', status: 'Document Collection', lastContact: '30 mins ago', stage: 'Document Collection', progress: 5, assignedStaffId: 12,
        loanAmount: '£1,000,000', loanPurpose: 'Operations', homeOwner: 'No', companyBank: 'Global Bank', businessAnnualTurnover: '10,000,000', fundingTimeline: 'Immediate', industry: 'Specialized', jobTitle: 'Agent',
        existingLoan: 'No', overdraftFacility: 'No',
        notes: 'Confidential request.',
        documents: []
    },
    {
        id: 'AF-018', leadId: 'AF-018', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-25', name: 'Peter Parker',
        businessName: 'Parker Tech Solutions', email: 'peter@parkertech.com', phone: '+1 212-555-0101', nic: 'NIC-018', source: 'Website Form', status: 'Document Collection', lastContact: '1 hour ago', stage: 'Document Collection', progress: 20, assignedStaffId: 3,
        loanAmount: '£120,000', loanPurpose: 'Working Capital', homeOwner: 'No', companyBank: 'Chase', businessAnnualTurnover: '450,000', fundingTimeline: 'Within 2 weeks', industry: 'Technology', jobTitle: 'Founder',
        existingLoan: 'No', overdraftFacility: 'No',
        notes: 'Young startup founder. Needs quick capital for inventory.',
        documents: []
    },
    {
        id: 'AF-019', leadId: 'AF-019', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-25', name: 'Clark Kent',
        businessName: 'Daily Planet Media', email: 'clark.kent@dailyplanet.com', phone: '+1 312-555-0202', nic: 'NIC-019', source: 'Referral', status: 'Lender Selection', lastContact: '3 hours ago', stage: 'Lender Selection', progress: 70, assignedStaffId: 3,
        loanAmount: '£750,000', loanPurpose: 'Expansion', homeOwner: 'Yes', companyBank: 'Metropolis Bank', businessAnnualTurnover: '3,200,000', fundingTimeline: '1 month', industry: 'Media', jobTitle: 'Editor',
        existingLoan: 'Yes', existingLoanLenderName: 'MetroBank', existingLoanAmount: '100,000', existingLoanInterestRate: '3.9', existingLoanMonthlyRepayment: '2,100', existingLoanTerm: '48 months', overdraftFacility: 'Yes',
        notes: 'Looking for capital to expand digital publishing division.',
        documents: [{ id: 1, type: 'Bank Statement', status: 'Approved', note: 'Verified', date: '2026-03-24' }]
    },
    {
        id: 'AF-020', leadId: 'AF-020', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-25', name: 'Diana Prince',
        businessName: 'Amazonian Exports Ltd', email: 'diana.prince@amazonia.com', phone: '+1 407-555-0303', nic: 'NIC-020', source: 'LinkedIn', status: 'Document Verification Done', lastContact: 'Yesterday', stage: 'Document Verification Done', progress: 45, assignedStaffId: 3,
        loanAmount: '£2,500,000', loanPurpose: 'Import Finance', homeOwner: 'Yes', companyBank: 'ANZ Bank', businessAnnualTurnover: '8,000,000', fundingTimeline: 'Within 3 months', industry: 'Export & Trade', jobTitle: 'Director',
        existingLoan: 'No', overdraftFacility: 'Yes',
        notes: 'Trade finance for new international shipping contract.',
        documents: [{ id: 1, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2026-03-24' }, { id: 2, type: 'Bank Statement', status: 'Approved', note: 'Verified', date: '2026-03-24' }]
    },
    {
        id: 'AF-021', leadId: 'AF-021', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-26', name: 'Bruce Banner',
        businessName: 'Gamma Labs', email: 'b.banner@gammalabs.io', phone: '+1 617-555-0404', nic: 'NIC-021', source: 'Direct Call', status: 'Completed', lastContact: 'Just now', stage: 'Completed', progress: 100, assignedStaffId: 3,
        loanAmount: '£3,000,000', loanPurpose: 'R&D Infrastructure', homeOwner: 'Yes', companyBank: 'Barclays', businessAnnualTurnover: '12,000,000', fundingTimeline: 'Immediate', industry: 'Research', jobTitle: 'Chief Scientist',
        existingLoan: 'No', overdraftFacility: 'No',
        notes: 'Confidential scientific research funding. High priority clearance.',
        documents: [{ id: 1, type: 'Loan Agreement', status: 'Approved', note: 'Signed', date: '2026-03-25' }]
    },
    {
        id: 'AF-022', leadId: 'AF-022', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-26', name: 'Wanda Maximoff',
        businessName: 'Hex Creative Studios', email: 'wanda@hexstudios.com', phone: '+1 718-555-0505', nic: 'NIC-022', source: 'Facebook Ads', status: 'Document Collection', lastContact: '45 mins ago', stage: 'Document Collection', progress: 10, assignedStaffId: 3,
        loanAmount: '£180,000', loanPurpose: 'Equipment Finance', homeOwner: 'No', companyBank: 'HSBC', businessAnnualTurnover: '620,000', fundingTimeline: 'Within 1 month', industry: 'Creative Arts', jobTitle: 'Creative Director',
        existingLoan: 'No', overdraftFacility: 'No',
        notes: 'Film & production studio needing new camera equipment.',
        documents: []
    },
    {
        id: 'AF-023', leadId: 'AF-023', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-26', name: 'Sam Wilson',
        businessName: 'Wilson Aviation', email: 'sam@wilsonaviation.com.au', phone: '+61 400-555-0606', nic: 'NIC-023', source: 'Partner', status: 'Rejected', lastContact: '2 days ago', stage: 'Rejected', progress: 100, assignedStaffId: 3,
        loanAmount: '£4,500,000', loanPurpose: 'Fleet Acquisition', homeOwner: 'Yes', companyBank: 'Commonwealth Bank', businessAnnualTurnover: '9,500,000', fundingTimeline: 'ASAP', industry: 'Aviation', jobTitle: 'Managing Director',
        existingLoan: 'Yes', existingLoanLenderName: 'Westpac', existingLoanAmount: '2,000,000', existingLoanInterestRate: '5.2', existingLoanMonthlyRepayment: '42,000', existingLoanTerm: '60 months', overdraftFacility: 'Yes',
        notes: 'Rejected due to existing debt-to-income ratio exceeding threshold.',
        documents: [{ id: 1, type: 'Bank Statement', status: 'Rejected', note: 'Insufficient balance', date: '2026-03-24' }]
    },
    {
        id: 'AF-024', leadId: 'AF-024', agentName: 'Cody Lane', tl: 'Marcus Smith', manager: 'Sarah White', submissionDate: '2026-03-26', name: 'T\'Challa Udaku',
        businessName: 'Wakanda Resources', email: 'tchalla@wakanda.co', phone: '+27 11-555-0707', nic: 'NIC-024', source: 'Website Form', status: 'Lender Selection', lastContact: '10 mins ago', stage: 'Lender Selection', progress: 65, assignedStaffId: 3,
        loanAmount: '£15,000,000', loanPurpose: 'Infrastructure', homeOwner: 'Yes', companyBank: 'Standard Bank', businessAnnualTurnover: '50,000,000', fundingTimeline: '2 weeks', industry: 'Mining & Resources', jobTitle: 'Chairman',
        existingLoan: 'No', overdraftFacility: 'Yes',
        notes: 'Major infrastructure deal. Lender shortlist in progress.',
        documents: [{ id: 1, type: 'Financial Report', status: 'Approved', note: 'Audited 2025', date: '2026-03-25' }]
    }
];

/**
 * Super Admin Lead Performance
 */
export const SA_RECENT_LEADS = [
    { id: 'AF-001', name: 'Robert Miller',  businessName: 'Miller Logistics Co.', initials: 'RM', bg: LEAD_AVATAR_COLORS['Robert Miller'].bg, tc: LEAD_AVATAR_COLORS['Robert Miller'].tc, stage: 'Document Collection', stageCls: 'bg-[#1a202c] text-white',        status: 'Document Collection',          statusCls: 'text-[#2447d7]', dot: 'bg-blue-400',    agent: 'Cody Lane',      date: 'Oct 24, 2023', amount: '$250,000', purpose: 'Working Capital', homeowner: 'YES', bank: 'Barclays', term: '12 months' },
    { id: 'AF-002', name: 'Alice Huang',    businessName: 'Huang Tech Solutions', initials: 'AH', bg: LEAD_AVATAR_COLORS['Alice Huang'].bg, tc: LEAD_AVATAR_COLORS['Alice Huang'].tc, stage: 'Document Verification Done', stageCls: 'bg-[#fef9c3] text-[#a16207]',    status: 'Document Verification Done',   statusCls: 'text-[#059669]', dot: 'bg-emerald-400', agent: 'Leo Kumar',      date: 'Oct 24, 2023', amount: '$1,200,000', purpose: 'Equipment Finance', homeowner: 'YES', bank: 'HSBC', term: '36 months' },
    { id: 'AF-008', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting', initials: 'MA', bg: LEAD_AVATAR_COLORS['Marcus Aurelius'].bg, tc: LEAD_AVATAR_COLORS['Marcus Aurelius'].tc, stage: 'Completed', stageCls: 'bg-[#ecfdf5] text-[#059669]', status: 'Completed',                    statusCls: 'text-[#0d9488]', dot: 'bg-teal-400',    agent: 'Cody Lane',      date: 'Oct 23, 2023', amount: '$75,000', purpose: 'Expansion Loan', homeowner: 'NO', bank: 'Lloyds', term: '24 months' },
    { id: 'AF-004', name: 'Sarah Connor',   businessName: 'Connor Security Group', initials: 'SC', bg: LEAD_AVATAR_COLORS['Sarah Connor'].bg, tc: LEAD_AVATAR_COLORS['Sarah Connor'].tc, stage: 'Rejected', stageCls: 'bg-[#f1f5f9] text-[#64748b]',    status: 'Document Rejected',            statusCls: 'text-[#dc2626]', dot: 'bg-red-400',     agent: 'Jake Morrison', date: 'Oct 23, 2023', amount: '$540,000', purpose: 'Bridge Loan', homeowner: 'NO', bank: 'Santander', term: '18 months' },
];

export const SA_STATS = {
    totalLeads: '1,482',
    leadsChange: '+12.5%',
    rejectionRate: '12.1%',
    rejectionChange: '+1.4%',
    monthlyRevenue: '$842,500',
    revenueIncrease: '12.5%',
    pendingDocs: '42'
};

/**
 * Accounts Manager Approved Selection
 */
export const AM_APPROVED_LOANS = [
    { id: 'AF-005', name: 'Michael Chen', businessName: 'Chen Finance Hub', amount: '$750,000.00', lender: 'ANZ Bank', interestRate: '3.8%', tenure: '30 Years', approvedDate: 'Oct 23, 2023' },
    { id: 'AF-008', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting', amount: '$75,000.00', lender: 'Commonwealth Bank', interestRate: '4.2%', tenure: '15 Years', approvedDate: 'Oct 22, 2023' },
    { id: 'AF-010', name: 'Quantum Capital Fund', businessName: 'Quantum Capital Fund', amount: '$4,500,000.00', lender: 'Macquarie Bank', interestRate: '3.5%', tenure: '20 Years', approvedDate: 'Oct 20, 2023' },
];

export const AM_LOAN_PIPELINE_LEADS = [
    { id: 'AF-001', name: 'Robert Miller', businessName: 'Miller Logistics Co.', status: 'Qualified', email: 'robert@example.com', phone: '+1 234-567-890', loanAmount: '$250,000.00' },
    { id: 'AF-002', name: 'Alice Huang', businessName: 'Huang Tech Solutions', status: 'Contacted', email: 'alice.h@gmail.com', phone: '+1 987-654-321', loanAmount: '$1,200,000.00' },
    { id: 'AF-003', name: 'David Rivera', businessName: 'Rivera Designs', status: 'New', email: 'd.rivera@outlook.com', phone: '+1 456-123-789', loanAmount: '$500,000.00' },
];

export const AM_LENDER_OPTIONS = [
    'ANZ Bank',
    'Commonwealth Bank',
    'Westpac',
    'NAB',
    'Macquarie Bank',
    'Liberty Financial',
];

export const QUALIFIED_LENDERS = [
    { id: 'anz_bank', name: 'ANZ Bank', tier: 'Tier 1 • Trusted Partner', match: 98, color: QUALIFIED_LENDER_COLORS.tier1.color, bg: QUALIFIED_LENDER_COLORS.tier1.bg },
    { id: 'cba', name: 'Commonwealth Bank', tier: 'Tier 1 • International', match: 92, color: QUALIFIED_LENDER_COLORS.tier1.color, bg: QUALIFIED_LENDER_COLORS.tier1.bg },
    { id: 'macquarie', name: 'Macquarie Bank', tier: 'Tier 2 • Private Equity', match: 85, color: QUALIFIED_LENDER_COLORS.tier2.color, bg: QUALIFIED_LENDER_COLORS.tier2.bg },
    { id: 'westpac', name: 'Westpac', tier: 'Tier 1 • High Net Worth', match: 78, color: QUALIFIED_LENDER_COLORS.tier3.color, bg: QUALIFIED_LENDER_COLORS.tier3.bg },
];

export const AM_APPROVED_STATS = {
    totalValue: '$8,955,000.00'
};

/**
 * Audit Log Data
 */
export const AUDIT_STATS = {
    totalLogs: 1284,
    criticalLogs: 5,
    systemAlerts: 12
};

export const AUDIT_LOG_ENTRIES = [
    { id: 1, date: 'Oct 24, 2023', time: '14:24:08', name: 'Jane Doe', initials: 'JD', bg: ROLE_COLORS['Super Admin'].bg, role: 'Super Admin', roleCls: ROLE_COLORS['Super Admin'].roleCls, actionIcon: 'verify', actionText: 'Verified compliance docs for', refId: 'AF-001' },
    { id: 2, date: 'Oct 24, 2023', time: '13:15:22', name: 'Marcus Smith', initials: 'MS', bg: ROLE_COLORS['Team Leader'].bg, role: 'Team Leader', roleCls: ROLE_COLORS['Team Leader'].roleCls, actionIcon: 'verify', actionText: 'Approved bank statements for', refId: 'AF-011' },
    { id: 3, date: 'Oct 24, 2023', time: '11:05:44', name: 'Sarah White', initials: 'SW', bg: ROLE_COLORS['Accounts Manager'].bg, role: 'Accounts Manager', roleCls: ROLE_COLORS['Accounts Manager'].roleCls, actionIcon: 'verify', actionText: 'Approved final loan terms for', refId: 'AF-008' },
    { id: 4, date: 'Oct 24, 2023', time: '10:12:12', name: 'Sarah White', initials: 'SW', bg: ROLE_COLORS['Accounts Manager'].bg, role: 'Accounts Manager', roleCls: ROLE_COLORS['Accounts Manager'].roleCls, actionIcon: 'verify', actionText: 'Submitted file to ANZ Bank for', refId: 'AF-002' },
    { id: 5, date: 'Oct 23, 2023', time: '17:30:00', name: 'Marcus Smith', initials: 'MS', bg: ROLE_COLORS['Team Leader'].bg, role: 'Team Leader', roleCls: ROLE_COLORS['Team Leader'].roleCls, actionIcon: 'reject', actionText: 'Rejected incomplete ID docs for', refId: 'AF-004', note: 'Unclear photo' },
    { id: 6, date: 'Oct 23, 2023', time: '16:05:44', name: 'Sarah White', initials: 'SW', bg: ROLE_COLORS['Accounts Manager'].bg, role: 'Accounts Manager', roleCls: ROLE_COLORS['Accounts Manager'].roleCls, actionIcon: 'verify', actionText: 'Approved loan for', refId: 'AF-015' },
    { id: 7, date: 'Oct 22, 2023', time: '11:15:22', name: 'Marcus Smith', initials: 'MS', bg: ROLE_COLORS['Team Leader'].bg, role: 'Team Leader', roleCls: ROLE_COLORS['Team Leader'].roleCls, actionIcon: 'verify', actionText: 'Approved proof of earnings for', refId: 'AF-009' }
];

/**
 * Finance & Transactions
 */
export const FINANCE_STATS = {
    totalLoans: '$42.5M',
    pendingLoans: '$5.2M',
    rejectedLoans: '$1.8M',
    monthlyRevenue: '$840k',
    sixMonthTotal: '$4.2M',
    sixMonthTrend: '12%',
    totalTransactions: 257
};

export const FINANCE_TRANSACTIONS = [
    { id: 'TX-2023-001', lead: 'AF-001', name: 'Robert Miller',  initials: 'RM', bg: LEAD_AVATAR_COLORS['Robert Miller'].bg, tc: LEAD_AVATAR_COLORS['Robert Miller'].tc, amount: '$25,000.00', date: 'Oct 24, 2023', status: 'Approved', manager: 'Sarah White', turnover: '£480,000', purpose: 'Working Capital', bank: 'Barclays', homeowner: 'YES', term: '12 months' },
    { id: 'TX-2023-002', lead: 'AF-002', name: 'Alice Huang',    initials: 'AH', bg: LEAD_AVATAR_COLORS['Alice Huang'].bg, tc: LEAD_AVATAR_COLORS['Alice Huang'].tc, amount: '$120,500.00', date: 'Oct 24, 2023', status: 'Pending', manager: 'Sarah White', turnover: '£2,100,000', purpose: 'Equipment Finance', bank: 'HSBC', homeowner: 'YES', term: '36 months' },
    { id: 'TX-2023-003', lead: 'AF-008', name: 'Marcus Aurelius', initials: 'MA', bg: LEAD_AVATAR_COLORS['Marcus Aurelius'].bg, tc: LEAD_AVATAR_COLORS['Marcus Aurelius'].tc, amount: '$7,500.00',  date: 'Oct 23, 2023', status: 'Approved', manager: 'Sarah White', turnover: '£750,000', purpose: 'Expansion Loan', bank: 'Lloyds', homeowner: 'NO', term: '24 months' },
    { id: 'TX-2023-004', lead: 'AF-004', name: 'Sarah Connor',   initials: 'SC', bg: LEAD_AVATAR_COLORS['Sarah Connor'].bg, tc: LEAD_AVATAR_COLORS['Sarah Connor'].tc, amount: '$54,200.00', date: 'Oct 23, 2023', status: 'Rejected', manager: 'Sarah White', turnover: '£320,000', purpose: 'Bridge Loan', bank: 'Santander', homeowner: 'NO', term: '18 months' },
    { id: 'TX-2023-005', lead: 'AF-005', name: 'Michael Chen',   initials: 'MC', bg: LEAD_AVATAR_COLORS['Michael Chen'].bg, tc: LEAD_AVATAR_COLORS['Michael Chen'].tc, amount: '$75,000.00', date: 'Oct 22, 2023', status: 'Approved', manager: 'Sarah White', turnover: '£1,850,000', purpose: 'Property Purchase', bank: 'NatWest', homeowner: 'YES', term: '48 months' },
];

export const REVENUE_BAR_DATA = [
    { label: 'JAN', revenue: 65, target: 80 },
    { label: 'FEB', revenue: 72, target: 80 },
    { label: 'MAR', revenue: 85, target: 80 },
    { label: 'APR', revenue: 78, target: 90 },
    { label: 'MAY', revenue: 94, target: 90 },
    { label: 'JUN', revenue: 91, target: 90 },
];

export const PAYMENT_STATUS_DONUT = [
    { label: 'Completed', pct: 64, color: CHART_COLORS.success },
    { label: 'Pending',   pct: 22, color: CHART_COLORS.warning },
    { label: 'Rejected',  pct: 14, color: CHART_COLORS.danger },
];

/**
 * Super Admin Activity Feed
 */
export const SA_ACTIVITIES = [
    { label: 'Lead Assigned', detail: 'Jane Doe assigned AF-001 to Cody Lane', time: '2 mins ago', color: CHART_COLORS.primary },
    { label: 'Document Approved', detail: 'Marcus Smith approved Bank Statement for ALice Huang', time: '15 mins ago', color: CHART_COLORS.success },
    { label: 'Loan Rejected', detail: 'Sarah White rejected loan for Sarah Connor', time: '1 hour ago', color: CHART_COLORS.danger },
    { label: 'System Update', detail: 'System auto-assigned 5 new leads to active agents', time: '2 hours ago', color: CHART_COLORS.gray },
    { label: 'New Lead', detail: 'New lead Liam Neeson entered the pipeline', time: '3 hours ago', color: CHART_COLORS.purple },
];

export const SA_DONUT_DATA = [
    { label: 'Active', pct: 40, color: CHART_COLORS.primary },
    { label: 'Pending', pct: 30, color: CHART_COLORS.warning },
    { label: 'Qualified', pct: 20, color: CHART_COLORS.success },
    { label: 'Rejected', pct: 10, color: CHART_COLORS.danger },
];

