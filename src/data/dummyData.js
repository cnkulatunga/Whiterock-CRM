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
    { id: 1, name: 'Jane Doe', email: 'jane.doe@whiterock.crm', initials: 'JD', ...USER_COLORS[1], role: 'Super Admin', roleColor: 'role--super', status: 'Active' },
    { id: 2, name: 'Marcus Smith', email: 'm.smith@whiterock.crm', initials: 'MS', ...USER_COLORS[2], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 3, name: 'Cody Lane', email: 'cody.l@whiterock.crm', initials: 'CL', ...USER_COLORS[3], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 4, name: 'Sarah White', email: 'sarah.w@whiterock.crm', initials: 'SW', ...USER_COLORS[4], role: 'Accounts Manager', roleColor: 'role--accounts', status: 'Active' },
    { id: 5, name: 'Diana Fernandez', email: 'd.fernandez@whiterock.crm', initials: 'DF', ...USER_COLORS[5], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 6, name: 'Leo Kumar', email: 'leo.k@whiterock.crm', initials: 'LK', ...USER_COLORS[6], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 7, name: 'Nina Hassan', email: 'nina.h@whiterock.crm', initials: 'NH', ...USER_COLORS[7], role: 'Tele Agent', roleColor: 'role--agent', status: 'Inactive' },
    { id: 8, name: 'Ryan Patel', email: 'r.patel@whiterock.crm', initials: 'RP', ...USER_COLORS[8], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 9, name: 'Aisha Nkosi', email: 'a.nkosi@whiterock.crm', initials: 'AN', ...USER_COLORS[9], role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 10, name: 'Tom Brennan', email: 't.brennan@whiterock.crm', initials: 'TB', ...USER_COLORS[10], role: 'Team Leader', roleColor: 'role--leader', status: 'Inactive' },
    { id: 11, name: 'Priya Sharma', email: 'p.sharma@whiterock.crm', initials: 'PS', ...USER_COLORS[11], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 12, name: 'Jake Morrison', email: 'j.morrison@whiterock.crm', initials: 'JM', ...USER_COLORS[12], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 13, name: 'Elena Vasquez', email: 'e.vasquez@whiterock.crm', initials: 'EV', ...USER_COLORS[13], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 14, name: 'Omar Khalil', email: 'o.khalil@whiterock.crm', initials: 'OK', ...USER_COLORS[14], role: 'Tele Agent', roleColor: 'role--agent', status: 'Inactive' },
    { id: 15, name: 'Sophie Tan', email: 's.tan@whiterock.crm', initials: 'ST', ...USER_COLORS[15], role: 'Tele Agent', roleColor: 'role--agent', status: 'Active' },
    { id: 16, name: 'Alex Johnson', email: 'a.johnson@whiterock.crm', initials: 'AJ', color: '#8b5cf6', textColor: '#ffffff', role: 'Accounts Manager', roleColor: 'role--accounts', status: 'Active' },
];

/**
 * SHARED CONSTANTS
 * Reusable lists for filters and configurations.
 */
export const ALL_ROLES = ['All Roles', 'Super Admin', 'Team Leader', 'Tele Agent', 'Accounts Manager'];
export const ALL_STATUSES = ['All', 'Active', 'Inactive', 'Qualified', 'Contacted', 'New'];
export const LOAN_DECISIONS = ['pending', 'approved', 'rejected'];
export const WORKFLOW_STAGES_LIST = ['All Stages', 'Document Collection', 'Document Verification Done', 'Lender Selection', 'Final Review', 'Completed', 'Rejected'];

export const DATE_RANGE_OPTIONS = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'];

export const DOCUMENT_VERIFICATION_DATES = ['All Time', 'Today', 'Yesterday', 'Last 7 Days'];

export const AUDIT_LOG_CATEGORIES = ['All Categories', 'Payment', 'Lead', 'User', 'System'];
export const AUDIT_LOG_USER_ROLES = ['Any Role', 'Admin', 'Compliance', 'Sales', 'Manager', 'Service'];

// Derive Tele Agent names for filters to stay consistent
export const PERFORMANCE_AGENT_OPTIONS = ['All Agents', ...SHARED_INITIAL_USERS.filter(u => u.role === 'Tele Agent').map(u => u.name)];
export const PERFORMANCE_LEAD_STATUSES = ['All', 'Active', 'Completed', 'Urgent'];

export const LENDER_TYPES = ['Major Bank', 'Non-Bank', 'Credit Union', 'Building Society', 'Specialist'];

export { LENDER_TYPE_COLORS } from '../utils/colorSystem';

export const FULL_LENDERS_LIST = [
    { id: 1, name: 'ANZ Bank', type: 'Major Bank', interestRate: '5.89%', maxLoan: '$2,000,000', minDeposit: '10%', contact: 'lending@anz.com', status: 'Active' },
    { id: 2, name: 'Commonwealth Bank', type: 'Major Bank', interestRate: '5.74%', maxLoan: '$3,000,000', minDeposit: '5%', contact: 'brokers@cba.com.au', status: 'Active' },
    { id: 3, name: 'Macquarie Bank', type: 'Non-Bank', interestRate: '5.59%', maxLoan: '$5,000,000', minDeposit: '20%', contact: 'partners@macquarie.com', status: 'Active' },
    { id: 4, name: 'Liberty Financial', type: 'Non-Bank', interestRate: '6.49%', maxLoan: '$1,500,000', minDeposit: '0%', contact: 'support@liberty.com.au', status: 'Inactive' },
    { id: 5, name: 'Westpac', type: 'Major Bank', interestRate: '5.95%', maxLoan: '$2,500,000', minDeposit: '10%', contact: 'loans@westpac.com.au', status: 'Active' },
    { id: 6, name: 'NAB', type: 'Major Bank', interestRate: '5.85%', maxLoan: '$2,200,000', minDeposit: '5%', contact: 'business@nab.com.au', status: 'Active' },
    { id: 7, name: 'Suncorp', type: 'Major Bank', interestRate: '6.12%', maxLoan: '$1,800,000', minDeposit: '15%', contact: 'info@suncorp.com.au', status: 'Active' },
    { id: 8, name: 'Heritage Bank', type: 'Credit Union', interestRate: '5.45%', maxLoan: '$1,200,000', minDeposit: '10%', contact: 'apply@heritage.com.au', status: 'Active' },
];

/**
 * INITIAL_TASKS
 * Seed data for the global tasks and follow-ups system.
 */
export const INITIAL_TASKS = [
    // Super Admin Tasks
    { id: 301, title: 'Compliance Audit', lead: 'Whiterock', status: 'Pending', date: '2026-03-12', time: '10:00', type: 'Review', reminder: '1h', assignedTo: 'Self' },
    { id: 302, title: 'System Maintenance', lead: 'Infrastructure', status: 'In Progress', date: '2026-03-12', time: '15:00', type: 'Administrative', reminder: 'none', assignedTo: 'Self' },

    // Team Leader Tasks
    { id: 101, title: 'Follow up with New Leads', lead: 'Team Alpha', status: 'Pending', date: '2026-03-16', time: '10:00', type: 'Call', reminder: '15m', assignedTo: 'Self' },
    { id: 102, title: 'Quarterly Review Prep', lead: 'Internal', status: 'In Progress', date: '2026-03-17', time: '14:30', type: 'Meeting', reminder: '1h', assignedTo: 'Self' },

    // Account Manager Tasks
    { id: 201, title: 'Portfolio Strategy Review', lead: 'Key Accounts', status: 'Pending', date: '2026-03-16', time: '11:00', type: 'Meeting', reminder: '1h', assignedTo: 'Self' },
    { id: 202, title: 'Quarterly Performance Report', lead: 'Enterprise', status: 'In Progress', date: '2026-03-18', time: '09:00', type: 'Review', reminder: 'none', assignedTo: 'Self' },

    // Tele Agent Tasks
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', status: 'Pending', date: '2026-03-09', time: '14:00', type: 'Call', reminder: '15m', assignedTo: '3' },
    { id: 2, title: "Verify Alice Huang's documents", lead: 'Alice Huang', status: 'In Progress', date: '2026-03-09', time: '16:30', type: 'Document', reminder: '1h', assignedTo: '3' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', status: 'Completed', date: '2026-03-08', time: '10:00', type: 'Review', reminder: 'none', assignedTo: '3' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', status: 'Pending', date: '2026-03-10', time: '10:00', type: 'Email', reminder: '1d', assignedTo: '3' },
];

/**
 * INITIAL_MEMBERSHIPS
 * Maps Team Leaders (by ID) to their team members.
 */
export const INITIAL_MEMBERSHIPS = {
    2: [ // Marcus Smith
        { id: 3, name: 'Cody Lane', email: 'cody.l@whiterock.crm', role: 'Tele Agent', initials: 'CL', ...USER_COLORS[3], status: 'Active' },
        { id: 11, name: 'Priya Sharma', email: 'p.sharma@whiterock.crm', role: 'Tele Agent', initials: 'PS', ...USER_COLORS[11], status: 'Active' },
    ],
    5: [ // Diana Fernandez
        { id: 6, name: 'Leo Kumar', email: 'leo.k@whiterock.crm', role: 'Tele Agent', initials: 'LK', ...USER_COLORS[6], status: 'Active' },
        { id: 7, name: 'Nina Hassan', email: 'nina.h@whiterock.crm', role: 'Tele Agent', initials: 'NH', ...USER_COLORS[7], status: 'Inactive' },
        { id: 13, name: 'Elena Vasquez', email: 'e.vasquez@whiterock.crm', role: 'Tele Agent', initials: 'EV', ...USER_COLORS[13], status: 'Active' },
    ],
    8: [ // Ryan Patel
        { id: 12, name: 'Jake Morrison', email: 'j.morrison@whiterock.crm', role: 'Tele Agent', initials: 'JM', ...USER_COLORS[12], status: 'Active' },
        { id: 15, name: 'Sophie Tan', email: 's.tan@whiterock.crm', role: 'Tele Agent', initials: 'ST', ...USER_COLORS[15], status: 'Active' },
    ],
    9: [ // Aisha Nkosi
        { id: 14, name: 'Omar Khalil', email: 'o.khalil@whiterock.crm', role: 'Tele Agent', initials: 'OK', ...USER_COLORS[14], status: 'Inactive' },
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
    { id: 'closed', label: 'Won / Rejected', color: WORKFLOW_STAGE_COLORS.closed.color, description: 'Final process outcome' },
];

export const OPERATIONAL_FLOW_LEADS = [
    {
        id: 'WR-011', name: 'James Wilson', businessName: 'Global Tech Solutions', manager: 'Sarah White', tl: 'Marcus Smith', agent: 'Priya Sharma', stage: 'lead_gather', progress: 25, lastActive: '2h ago',
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
        id: 'WR-012', name: 'Robert Chen', businessName: 'Apex Industries', manager: 'Sarah White', tl: 'Marcus Smith', agent: 'Jake Morrison', stage: 'doc_collect', progress: 50, lastActive: '45m ago',
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
        id: 'WR-013', name: 'Sarah Miller', businessName: 'Blue Sky Ventures', manager: 'Sarah White', tl: 'Diana Fernandez', agent: 'Nina Hassan', stage: 'lender_select', progress: 75, lastActive: '1d ago',
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
        id: 'WR-014', name: 'Michael Thompson', businessName: 'Summit Realty', manager: 'Sarah White', tl: 'Elena Vasquez', agent: 'Sophie Tan', stage: 'won', progress: 100, lastActive: '3h ago',
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
    { name: 'Cody Lane', initials: 'CL', activeLeads: 156, closedDeals: 24, color: USER_COLORS[3].color },
    { name: 'Leo Kumar', initials: 'LK', activeLeads: 132, closedDeals: 19, color: USER_COLORS[6].color },
    { name: 'Priya Sharma', initials: 'PS', activeLeads: 145, closedDeals: 21, color: USER_COLORS[11].color },
    { name: 'Jake Morrison', initials: 'JM', activeLeads: 142, closedDeals: 18, color: USER_COLORS[12].color },
    { name: 'Elena Vasquez', initials: 'EV', activeLeads: 98, closedDeals: 22, color: USER_COLORS[13].color },
    { name: 'Sophie Tan', initials: 'ST', activeLeads: 115, closedDeals: 12, color: USER_COLORS[15].color },
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
    { id: 'WR-001', name: 'Robert Miller',  businessName: 'Miller Logistics Co.', amount: '$250,000.00', stage: 'Document Collection', stageCls: 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]', date: 'Oct 24, 2023' },
    { id: 'WR-002', name: 'Alice Huang',    businessName: 'Huang Tech Solutions', amount: '$1,200,000.00', stage: 'Lender Selection', stageCls: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]', date: 'Oct 23, 2023' },
    { id: 'WR-008', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting',  amount: '$75,000.00', stage: 'Completed', stageCls: 'bg-[#ecfdf5] text-[#16a34a] border-[#dcfce7]', date: 'Oct 22, 2023' },
    { id: 'WR-004', name: 'Sarah Connor',   businessName: 'Connor Security Group', amount: '$540,000.00', stage: 'Rejected', stageCls: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]', date: 'Oct 21, 2023' },
];

/**
 * MOCK_LEADS
 * Core leads data used for Manage Leads, Create Lead (duplicate check), and Document Verification.
 */
export const MOCK_LEADS = [
    {
        id: 'WR-001', leadId: 'WR-001', agentName: 'Cody Lane', submissionDate: '2026-03-15', name: 'Robert Miller', businessName: 'Miller Logistics Co.', email: 'robert@example.com', phone: '+1 234-567-890', nic: 'NIC-001', source: 'Website Form', status: 'Document Collection', lastContact: '2 hours ago', stage: 'Document Collection', progress: 20, assignedStaffId: 3,
        notes: 'Customer is looking for a home loan for a primary residence. Preferred contact time is evening after 6 PM.',
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Approved', note: 'Verified by SG', date: '2024-03-15' },
            { id: 2, type: 'Payslip', status: 'Approved', note: 'Clear copy', date: '2024-03-15' },
            { id: 3, type: 'ID Document', status: 'Pending', note: '', date: '2024-03-16' }
        ]
    },
    {
        id: 'WR-002', leadId: 'WR-002', agentName: 'Leo Kumar', submissionDate: '2026-03-16', name: 'Alice Huang', businessName: 'Huang Tech Solutions', email: 'alice.h@gmail.com', phone: '+1 987-654-321', nic: 'NIC-002', source: 'Referral', status: 'Document Verification Done', lastContact: 'Today, 10:30 AM', stage: 'Document Verification Done', progress: 40, assignedStaffId: 6,
        notes: 'Interested in business expansion loan. Needs quick turnaround as they have a pending property purchase.',
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Rejected', note: 'Period missing', date: '2024-03-14' },
            { id: 2, type: 'Payslip', status: 'Missing', note: '', date: '' }
        ]
    },
    { id: 'WR-003', leadId: 'WR-003', agentName: 'Priya Sharma', submissionDate: '2026-03-14', name: 'David Rivera', businessName: 'Rivera Designs', email: 'd.rivera@outlook.com', phone: '+1 456-123-789', nic: 'NIC-003', source: 'LinkedIn', status: 'Lender Selection', lastContact: 'Yesterday', stage: 'Lender Selection', progress: 60, assignedStaffId: 11, documents: [] },
    {
        id: 'WR-004', leadId: 'WR-004', agentName: 'Jake Morrison', submissionDate: '2026-03-13', name: 'Sarah Connor', businessName: 'Connor Security Group', email: 'sconnor@tech.co', phone: '+1 555-010-999', nic: 'NIC-004', source: 'Direct Call', status: 'Rejected', lastContact: 'Mar 04, 2024', stage: 'Rejected', progress: 100, assignedStaffId: 12,
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Rejected', note: 'Unclear scan', date: '2024-03-01' },
            { id: 2, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-01' }
        ]
    },
    {
        id: 'WR-005', leadId: 'WR-005', agentName: 'Jake Morrison', submissionDate: '2026-03-12', name: 'Michael Chen', businessName: 'Chen Finance Hub', email: 'm.chen@sales.com', phone: '+1 888-222-333', nic: 'NIC-005', source: 'Facebook Ads', status: 'Completed', lastContact: '3 days ago', stage: 'Completed', progress: 100, assignedStaffId: 12,
        documents: [
            { id: 1, type: 'Bank Statement', status: 'Approved', note: 'Final review OK', date: '2024-03-10' },
            { id: 2, type: 'Payslip', status: 'Approved', note: 'Verified', date: '2024-03-10' },
            { id: 3, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-10' },
            { id: 4, type: 'Loan Agreement', status: 'Approved', note: 'Signed', date: '2024-03-12' }
        ]
    },
    {
        id: 'WR-006', leadId: 'WR-006', agentName: 'Elena Vasquez', submissionDate: '2026-03-16', name: 'Emma Watson', businessName: 'Watson Creative Agency', email: 'emma@watson.inc', phone: '+1 777-555-444', nic: 'NIC-006', source: 'Webinar', status: 'Document Verification Done', lastContact: 'Feb 28, 2024', stage: 'Document Verification Done', progress: 40, assignedStaffId: 13,
        documents: [
            { id: 1, type: 'ID Document', status: 'Approved', note: 'Verified', date: '2024-03-15' }
        ]
    },
    {
        id: 'WR-007', leadId: 'WR-007', agentName: 'Sophie Tan', submissionDate: '2026-03-17', name: 'Liam Neeson', businessName: 'Neeson Security', email: 'liam@security.com', phone: '+1 222-333-444', nic: 'NIC-007', source: 'Referral', status: 'Final Review', lastContact: '1 hour ago', stage: 'Final Review', progress: 80, assignedStaffId: 15, documents: []
    },
    {
        id: 'WR-008', leadId: 'WR-008', agentName: 'Cody Lane', submissionDate: '2026-03-15', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting', email: 'marcus@consulting.it', phone: '+1 555-999-888', nic: 'NIC-008', source: 'LinkedIn', status: 'Completed', lastContact: '2 days ago', stage: 'Completed', progress: 100, assignedStaffId: 3, documents: []
    }
];

/**
 * Super Admin Lead Performance
 */
export const SA_RECENT_LEADS = [
    { id: 'WR-001', name: 'Robert Miller',  businessName: 'Miller Logistics Co.', initials: 'RM', bg: LEAD_AVATAR_COLORS['Robert Miller'].bg, tc: LEAD_AVATAR_COLORS['Robert Miller'].tc, stage: 'Document Collection', stageCls: 'bg-[#1a202c] text-white',        status: 'Active',    statusCls: 'text-[#059669]', dot: STATUS_COLORS.active.dot, agent: 'Cody Lane',      date: 'Oct 24, 2023', amount: '$250,000', purpose: 'Working Capital', homeowner: 'YES', bank: 'Barclays', term: '12 months' },
    { id: 'WR-002', name: 'Alice Huang',    businessName: 'Huang Tech Solutions', initials: 'AH', bg: LEAD_AVATAR_COLORS['Alice Huang'].bg, tc: LEAD_AVATAR_COLORS['Alice Huang'].tc, stage: 'Document Verification Done', stageCls: 'bg-[#fef9c3] text-[#a16207]',    status: 'Active',    statusCls: 'text-[#059669]', dot: STATUS_COLORS.active.dot, agent: 'Leo Kumar',      date: 'Oct 24, 2023', amount: '$1,200,000', purpose: 'Equipment Finance', homeowner: 'YES', bank: 'HSBC', term: '36 months' },
    { id: 'WR-008', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting', initials: 'MA', bg: LEAD_AVATAR_COLORS['Marcus Aurelius'].bg, tc: LEAD_AVATAR_COLORS['Marcus Aurelius'].tc, stage: 'Completed', stageCls: 'bg-[#ecfdf5] text-[#059669]', status: 'Completed', statusCls: 'text-[#a0aec0]', dot: 'bg-[#a0aec0]', agent: 'Cody Lane',      date: 'Oct 23, 2023', amount: '$75,000', purpose: 'Expansion Loan', homeowner: 'NO', bank: 'Lloyds', term: '24 months' },
    { id: 'WR-004', name: 'Sarah Connor',   businessName: 'Connor Security Group', initials: 'SC', bg: LEAD_AVATAR_COLORS['Sarah Connor'].bg, tc: LEAD_AVATAR_COLORS['Sarah Connor'].tc, stage: 'Rejected', stageCls: 'bg-[#f1f5f9] text-[#64748b]',    status: 'Urgent',    statusCls: 'text-[#dc2626]', dot: STATUS_COLORS.urgent.dot, agent: 'Jake Morrison', date: 'Oct 23, 2023', amount: '$540,000', purpose: 'Bridge Loan', homeowner: 'NO', bank: 'Santander', term: '18 months' },
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
    { id: 'WR-005', name: 'Michael Chen', businessName: 'Chen Finance Hub', amount: '$750,000.00', lender: 'ANZ Bank', interestRate: '3.8%', tenure: '30 Years', approvedDate: 'Oct 23, 2023' },
    { id: 'WR-008', name: 'Marcus Aurelius', businessName: 'Aurelius Consulting', amount: '$75,000.00', lender: 'Commonwealth Bank', interestRate: '4.2%', tenure: '15 Years', approvedDate: 'Oct 22, 2023' },
    { id: 'WR-010', name: 'Quantum Capital Fund', businessName: 'Quantum Capital Fund', amount: '$4,500,000.00', lender: 'Macquarie Bank', interestRate: '3.5%', tenure: '20 Years', approvedDate: 'Oct 20, 2023' },
];

export const AM_LOAN_PIPELINE_LEADS = [
    { id: 'WR-001', name: 'Robert Miller', businessName: 'Miller Logistics Co.', status: 'Qualified', email: 'robert@example.com', phone: '+1 234-567-890', loanAmount: '$250,000.00' },
    { id: 'WR-002', name: 'Alice Huang', businessName: 'Huang Tech Solutions', status: 'Contacted', email: 'alice.h@gmail.com', phone: '+1 987-654-321', loanAmount: '$1,200,000.00' },
    { id: 'WR-003', name: 'David Rivera', businessName: 'Rivera Designs', status: 'New', email: 'd.rivera@outlook.com', phone: '+1 456-123-789', loanAmount: '$500,000.00' },
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
    { id: 1, date: 'Oct 24, 2023', time: '14:24:08', name: 'Jane Doe', initials: 'JD', bg: ROLE_COLORS['Super Admin'].bg, role: 'Super Admin', roleCls: ROLE_COLORS['Super Admin'].roleCls, actionIcon: 'verify', actionText: 'Verified compliance docs for', refId: 'WR-001', turnover: '£1,200,000', purpose: 'Working Capital', bank: 'Barclays', homeowner: 'YES' },
    { id: 2, date: 'Oct 24, 2023', time: '13:15:22', name: 'Marcus Smith', initials: 'MS', bg: ROLE_COLORS['Team Leader'].bg, role: 'Team Leader', roleCls: ROLE_COLORS['Team Leader'].roleCls, actionIcon: 'edit',   actionText: 'Modified status of', refId: 'WR-002', turnover: '£3,500,000', purpose: 'Equipment Finance', bank: 'HSBC', homeowner: 'YES' },
    { id: 3, date: 'Oct 24, 2023', time: '11:05:44', name: 'Sarah White', initials: 'SW', bg: ROLE_COLORS['Accounts Manager'].bg, role: 'Accounts Manager', roleCls: ROLE_COLORS['Accounts Manager'].roleCls, actionIcon: 'payment', actionText: 'Confirmed payment for', refId: 'WR-008', turnover: '£900,000', purpose: 'Expansion Loan', bank: 'Lloyds', homeowner: 'NO' },
    { id: 4, date: 'Oct 24, 2023', time: '09:42:12', name: 'System', initials: 'SYS', bg: ROLE_COLORS['Automation'].bg, role: 'Automation', roleCls: ROLE_COLORS['Automation'].roleCls, actionIcon: 'auto',    actionText: 'Auto-assigned lead to agent', refId: 'WR-005', autoApproved: true },
    { id: 5, date: 'Oct 23, 2023', time: '17:30:00', name: 'Jane Doe', initials: 'JD', bg: ROLE_COLORS['Super Admin'].bg, role: 'Super Admin', roleCls: ROLE_COLORS['Super Admin'].roleCls, actionIcon: 'reject',  actionText: 'Flagged suspicious activity on', refId: 'WR-004', turnover: '£5,200,000', purpose: 'Bridge Loan', bank: 'Santander', homeowner: 'YES' },
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
    { id: 'TX-2023-001', lead: 'WR-001', name: 'Robert Miller',  initials: 'RM', bg: LEAD_AVATAR_COLORS['Robert Miller'].bg, tc: LEAD_AVATAR_COLORS['Robert Miller'].tc, amount: '$25,000.00', date: 'Oct 24, 2023', status: 'Approved', manager: 'Sarah White', turnover: '£480,000', purpose: 'Working Capital', bank: 'Barclays', homeowner: 'YES', term: '12 months' },
    { id: 'TX-2023-002', lead: 'WR-002', name: 'Alice Huang',    initials: 'AH', bg: LEAD_AVATAR_COLORS['Alice Huang'].bg, tc: LEAD_AVATAR_COLORS['Alice Huang'].tc, amount: '$120,500.00', date: 'Oct 24, 2023', status: 'Pending', manager: 'Sarah White', turnover: '£2,100,000', purpose: 'Equipment Finance', bank: 'HSBC', homeowner: 'YES', term: '36 months' },
    { id: 'TX-2023-003', lead: 'WR-008', name: 'Marcus Aurelius', initials: 'MA', bg: LEAD_AVATAR_COLORS['Marcus Aurelius'].bg, tc: LEAD_AVATAR_COLORS['Marcus Aurelius'].tc, amount: '$7,500.00',  date: 'Oct 23, 2023', status: 'Approved', manager: 'Sarah White', turnover: '£750,000', purpose: 'Expansion Loan', bank: 'Lloyds', homeowner: 'NO', term: '24 months' },
    { id: 'TX-2023-004', lead: 'WR-004', name: 'Sarah Connor',   initials: 'SC', bg: LEAD_AVATAR_COLORS['Sarah Connor'].bg, tc: LEAD_AVATAR_COLORS['Sarah Connor'].tc, amount: '$54,200.00', date: 'Oct 23, 2023', status: 'Rejected', manager: 'Sarah White', turnover: '£320,000', purpose: 'Bridge Loan', bank: 'Santander', homeowner: 'NO', term: '18 months' },
    { id: 'TX-2023-005', lead: 'WR-005', name: 'Michael Chen',   initials: 'MC', bg: LEAD_AVATAR_COLORS['Michael Chen'].bg, tc: LEAD_AVATAR_COLORS['Michael Chen'].tc, amount: '$75,000.00', date: 'Oct 22, 2023', status: 'Approved', manager: 'Sarah White', turnover: '£1,850,000', purpose: 'Property Purchase', bank: 'NatWest', homeowner: 'YES', term: '48 months' },
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
    { label: 'Lead Assigned', detail: 'Jane Doe assigned WR-001 to Cody Lane', time: '2 mins ago', color: CHART_COLORS.primary },
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

