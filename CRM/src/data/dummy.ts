/* ═══════════════════════════════════════════════════════════════
   CENTRAL MOCK DATA REPOSITORY
   Whiterock CRM Ecosystem
   (Fixed & Consolidated)
═══════════════════════════════════════════════════════════════ */

export const INITIAL_LEADS = [
    { id: 'AL-902', name: 'Robert Miller', company: 'Miller Logistics', email: 'robert.m@miller-logistics.co.uk', phone: '07123 456789', amount: '£12,000', agent: 'Sarah Jenkins', status: 'new', priority: 'hot', days: 2, lender: '—', notes: 'Waiting for bank statements', quality: 'hot', type: 'Asset Finance', leadLevel: 'Level 1' },
    { id: 'AF-550', name: 'Priya Singh', company: 'Singh Media', email: 'contact@singhmedia.com', phone: '07123 987654', amount: '£450,000', agent: 'James White', status: 'new', priority: 'warm', days: 1, lender: '—', notes: 'Large expansion loan request.', quality: 'warm', type: 'Commercial', leadLevel: 'Level 2' },
    { id: 'AF-103', name: 'Lisa Chen', company: 'Chen Retail Ltd', email: 'lisa@chenretail.co.uk', phone: '07123 321654', amount: '£78,000', agent: 'Sarah Jenkins', status: 'collecting', priority: 'warm', days: 3, lender: '—', notes: 'Bank statements submitted, awaiting ID verification.', quality: 'warm', type: 'Commercial', leadLevel: 'Level 1' },
    { id: 'AF-027', name: 'John Smith', company: 'ABC Corp', email: 'jsmith@abccorp.uk', phone: '07123 111222', amount: '£55,000', agent: 'Sarah Jenkins', status: 'lender', priority: 'hot', days: 4, lender: 'Barclays, HSBC', notes: 'Email sent to partners, awaiting offers.', quality: 'hot', type: 'Asset Finance', leadLevel: 'Level 1' },
    { id: 'AL-339', name: 'Mike Johnson', company: 'Urban Scaffolding Ltd', email: 'mike@urban-scaff.co.uk', phone: '07123 444555', amount: '£85,000', agent: 'James White', status: 'verified', priority: 'cool', days: 5, lender: '—', notes: 'Bank statements audited and approved.', quality: 'cool', type: 'Invoice Finance', leadLevel: 'Level 2' },
    { id: 'AF-001', name: 'David Brown', company: 'Miller Logistics', email: 'd.brown@miller-logistics.co.uk', phone: '07123 666777', amount: '£150,000', agent: 'Sarah Jenkins', status: 'approved', priority: 'hot', days: 12, lender: 'Starling', notes: 'Offer accepted, final checks in progress.', quality: 'hot', type: 'Commercial', leadLevel: 'Level 1' },
    { id: 'AL-209', name: 'Kevin Malone', company: 'Malone Paints', email: 'kevin@malonepaints.com', phone: '07123 888999', amount: '£25,000', agent: 'James White', status: 'rejected', priority: 'cool', days: 1, lender: '—', notes: 'Low credit score and high existing debt.', quality: 'cool', type: 'Asset Finance', leadLevel: 'Level 2' },
] as any[];

export const LENDERS_DB: Record<string, { contact: string; email: string; terms: string; phone: string }> = {
    'NAB': { contact: 'Mark Sterling', email: 'm.sterling@nab-business.com', terms: 'Next Day Payout', phone: '+44 20 7123 4567' },
    'ANZ': { contact: 'David Low', email: 'd.low@anz.bank', terms: 'Standard Terms', phone: '+44 20 8888 7777' },
    'Westpac': { contact: 'Emily Thorne', email: 'e.thorne@westpac.com', terms: 'Instant Payout', phone: '+44 20 6666 5555' },
    'Starling': { contact: 'James Cole', email: 'j.cole@starling.com', terms: '2-Day Payout', phone: '+44 20 5555 6666' },
    'Barclays': { contact: 'Rachel Adams', email: 'r.adams@barclays.co.uk', terms: 'Standard Terms', phone: '+44 20 1234 5678' },
    'HSBC': { contact: 'Tom Harding', email: 't.harding@hsbc.co.uk', terms: '3-Day Settlement', phone: '+44 20 9876 5432' },
};

export const STAGE_LABELS: Record<string, string> = { new: 'New Lead', collecting: 'Doc Collection', verified: 'Doc Verified', lender: 'Lender Selection', approved: 'Loan Approved', completed: 'Completed', rejected: 'Rejected' };
export const STAGE_COLOR: Record<string, string> = { new: '#b45309', collecting: '#64748b', verified: '#3b82f6', lender: '#8b5cf6', approved: '#22c55e', completed: '#0f172a', rejected: '#ef4444' };
export const STAGE_BG: Record<string, string> = { new: '#fef9c3', collecting: '#f1f5f9', verified: '#eff6ff', lender: '#f5f3ff', approved: '#f0fdf4', completed: '#f1f5f9', rejected: '#fef2f2' };
export const PRIO_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    High: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
    Medium: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    Low: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
};

export const REM_COLOR: Record<string, string> = { Call: '#3b82f6', Meeting: '#8b5cf6', 'Follow-up': '#f59e0b', Document: '#10b981' };
export const REM_ICON: Record<string, string> = { Call: 'fa-phone', Meeting: 'fa-users', 'Follow-up': 'fa-rotate-right', Document: 'fa-file' };
export const STATUS_COLOR: Record<string, string> = { Pending: '#f59e0b', Completed: '#10b981', Overdue: '#ef4444' };

export const TYPE_META: Record<string, { emoji: string, color: string }> = {
    'Call': { emoji: '📞', color: 'text-blue-500' },
    'Meeting': { emoji: '🤝', color: 'text-purple-500' },
    'Follow-up': { emoji: '🔁', color: 'text-indigo-500' },
    'Email': { emoji: '📨', color: 'text-rose-500' },
    'Document': { emoji: '📄', color: 'text-amber-500' },
    'Research': { emoji: '📊', color: 'text-emerald-500' },
    'Outbound': { emoji: '📞', color: 'text-blue-500' },
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const INITIAL_LENDERS = [
    { id: 1, name: 'ANZ Bank', trading: 'ANZ', type: 'Bank', status: 'Active', email: 'broker@anz.com.au', manager: 'Sarah Collins', managerEmail: 's.collins@anz.com.au', address: '242 Pitt Street, Sydney NSW 2000', regAddress: '242 Pitt Street, Sydney NSW 2000', tradingYears: 185, rateMin: 5.74, rateMax: 9.49, loanMin: 20000, loanMax: 5000000, categories: ['Secured', 'Commercial', 'Refinance'], notes: "One of Australia's Big Four banks.", added: '2026-01-10', promotions: [] },
    { id: 2, name: 'Commonwealth Bank', trading: 'CommBank', type: 'Bank', status: 'Active', email: 'broker@cba.com.au', manager: 'James Wu', managerEmail: 'j.wu@cba.com.au', address: '201 Sussex St, Sydney', regAddress: '201 Sussex St, Sydney', tradingYears: 112, rateMin: 5.69, rateMax: 9.99, loanMin: 10000, loanMax: 10000000, categories: ['Secured', 'Commercial', 'Unsecured'], notes: "Australia's largest bank.", added: '2026-01-10', promotions: [] },
    { id: 3, name: 'NAB', trading: 'NAB', type: 'Bank', status: 'Active', email: 'broker@nab.com.au', manager: 'Emily Tran', managerEmail: 'e.tran@nab.com.au', address: '800 Bourke St, Docklands', regAddress: '800 Bourke St, Docklands', tradingYears: 163, rateMin: 5.79, rateMax: 9.89, loanMin: 20000, loanMax: 8000000, categories: ['Secured', 'Commercial'], notes: 'Strong SME focus.', added: '2026-02-01', promotions: [] },
];

export const INITIAL_TASKS = [
    { id: 1, title: 'Follow up with James Wilson', type: 'Priority Call', status: 'Pending', priority: 'High', date: '2026-04-23', time: '09:30', client: 'Alpha Tech Ltd', phone: '07123 456789', email: 'james@alphatech.com', assignee: 'Thanushika', description: 'Discuss valuation report gaps' },
    { id: 2, title: 'Check valuation report for LD-102', type: 'Case Research', status: 'In Progress', priority: 'Medium', date: '2026-04-23', time: '11:00', client: 'Bright Build Co', phone: '07123 987654', email: 'oliver@brightbuild.co', assignee: 'Ravindu', description: 'Pending lender response' },
    { id: 3, title: 'Review compliance for new Tele Agent', type: 'Critical Document', status: 'Done', priority: 'Low', date: '2026-04-20', time: '14:30', client: 'System Registry', phone: '—', email: 'compliance@whiterock.com', assignee: 'Thanushika', description: 'All docs verified' },
];

export type Notification = {
    id: number;
    title: string;
    desc: string;
    time: string;
    unread: boolean;
    icon: string;
    color: string;
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 1, title: 'New lead assigned', desc: 'Robert Miller from Miller Logistics', time: '5m ago', unread: true, icon: 'fa-user-plus', color: 'bg-indigo-50 text-indigo-600' },
    { id: 2, title: 'Case Approved', desc: 'Case AF-772 has been approved by lender', time: '1h ago', unread: false, icon: 'fa-circle-check', color: 'bg-emerald-50 text-emerald-600' },
    { id: 3, title: 'System Alert', desc: 'Server Maintenance at 12:00 tonight', time: '3h ago', unread: true, icon: 'fa-triangle-exclamation', color: 'bg-amber-50 text-amber-600' }
];

export const INITIAL_LICENSES = [
    { id: 1, type: 'License', name: 'FCA Broker License', desc: 'Financial Conduct Authority primary brokerage authorization.', date: '2026-12-15', remind: 30, status: 'ACTIVE' },
    { id: 2, type: 'Insurance', name: 'Professional Indemnity', desc: 'Annual coverage for brokerage activities.', date: '2026-10-01', remind: 30, status: 'ACTIVE' },
    { id: 3, type: 'License', name: 'Data Protection (ICO)', desc: 'Information Commissioner Office entry renewal.', date: '2026-05-20', remind: 14, status: 'ACTIVE' },
];

export const INITIAL_NOTES = [
    { id: 1, text: 'Remember to check quarterly commission structures.', date: '2026-04-20 | 14:30', pinned: true, highlighted: false },
    { id: 2, text: 'New server migration scheduled for next month.', date: '2026-04-22 | 09:15', pinned: false, highlighted: true },
];

export const INITIAL_PAYOUTS = [
    { id: '#PO-1022', client: 'ABC Corp', lender: 'Barclays', amount: '£4,500', status: 'Pending Approval', statusColor: 'amber', time: '2h ago', leadId: 'AF-027' },
    { id: '#PO-0985', client: 'Malone Paints', lender: 'HSBC', amount: '£2,100', status: 'Verified', statusColor: 'emerald', time: '5h ago', leadId: 'AL-209' },
    { id: '#PO-1104', client: 'Miller Logistics', lender: 'Starling', amount: '£12,300', status: 'In Review', statusColor: 'indigo', time: '1d ago', leadId: 'AL-902' },
];

export const INITIAL_TELE_AGENTS = [
    { id: 'CL', name: 'Cody Lane', email: 'cody@whiterock.com', phone: '07123 456789', status: 'ACTIVE', leads: 12, color: 'bg-indigo-600' },
    { id: 'EW', name: 'Emma Watson', email: 'emma@whiterock.com', phone: '07123 987654', status: 'ACTIVE', leads: 8, color: 'bg-emerald-600' },
    { id: 'LK', name: 'Leo Kumar', email: 'leo@whiterock.com', phone: '07123 111222', status: 'OFFLINE', leads: 0, color: 'bg-slate-400' },
];

export const INITIAL_CALENDAR_EVENTS: Record<string, any[]> = {
    '2026-04-23': [
        { type: 'task', title: 'Review loan application #AF-045', lead: 'Johnathan Doe', time: '09:00', priority: 'high' },
        { type: 'followup', title: 'Contract Signature Call', lead: 'ABC Corp', time: '14:30', priority: 'high' },
    ],
    '2026-04-24': [
        { type: 'task', title: 'Submit valuation report', lead: 'Sarah Smith', time: '11:00', priority: 'medium' },
        { type: 'followup', title: 'Courtesy Check-in', lead: 'James Wilson', time: '15:00', priority: 'low' },
    ],
};

export const promotions = [
    { id: 1, lender: 'Barclays', title: 'Q2 Recovery Plus', desc: 'Up to 90% LVR for hospitality sector recovery loans.', type: 'Exclusive', typeColor: 'indigo', expiry: '30 Jun 2026' },
    { id: 2, lender: 'Starling', title: 'SME Fixed Rate', desc: 'Fixed rates from 6.49% for loans over £50k.', type: 'Standard', typeColor: 'slate', expiry: '15 May 2026' },
    { id: 3, lender: 'HSBC', title: 'Green Asset Fund', desc: 'Lower commission but 0.5% rate discount for green vehicles.', type: 'Exclusive', typeColor: 'indigo', expiry: '31 Aug 2026' },
    { id: 4, lender: 'NatWest', title: 'FastTrack Asset', desc: 'Auto-approval for asset finance under £25k.', type: 'Standard', typeColor: 'slate', expiry: 'Ongoing' },
];

export const ACTIVITIES = [
    { id: 1, user: 'James Smith', action: 'Uploaded Bank Statements', time: '10 mins ago', icon: 'fa-file-arrow-up', color: 'indigo' },
    { id: 2, user: 'NatWest', action: 'Approved Application #AF-022', time: '45 mins ago', icon: 'fa-circle-check', color: 'emerald' },
    { id: 3, user: 'System', action: 'Sent Automated Follow-up to Oliver', time: '2h ago', icon: 'fa-paper-plane', color: 'blue' },
    { id: 4, user: 'Priya', action: 'Rejected Document for #AF-045', time: '3h ago', icon: 'fa-circle-xmark', color: 'rose' },
    { id: 5, user: 'Lloyds Bank', action: 'Requested Further Info', time: '5h ago', icon: 'fa-circle-info', color: 'amber' },
];

// Pipeline shared constants
export const STAGES = ['new', 'collecting', 'verified', 'lender', 'approved', 'rejected'] as const;
export type Stage = typeof STAGES[number];

export const STAGE_META: Record<Stage, { label: string; icon: string; hdr: string; body: string; cnt: string }> = {
    new: { label: 'New Leads', icon: 'fa-bolt', hdr: '#fef9c3', body: '#fefce8', cnt: '#854d0e' },
    collecting: { label: 'Doc Collection', icon: 'fa-file-arrow-up', hdr: '#f1f5f9', body: '#f8fafc', cnt: '#475569' },
    verified: { label: 'Doc Verified', icon: 'fa-file-circle-check', hdr: '#eff6ff', body: '#f0f7ff', cnt: '#1d4ed8' },
    lender: { label: 'Lender Selection', icon: 'fa-building-columns', hdr: '#f5f3ff', body: '#f6f4ff', cnt: '#6d28d9' },
    approved: { label: 'Loan Approved', icon: 'fa-circle-check', hdr: '#f0fdf4', body: '#f2fdf5', cnt: '#166534' },
    rejected: { label: 'Rejected', icon: 'fa-circle-xmark', hdr: '#fef2f2', body: '#fff5f5', cnt: '#b91c1c' },
};

export const PIPELINE_STAGES = [
    { label: 'Created', count: 12, color: 'slate', key: 'created' },
    { label: 'Pending Docs', count: 8, color: 'amber', key: 'collecting' },
    { label: 'Doc Verify', count: 5, color: 'blue', key: 'verified' },
    { label: 'Lender', count: 4, color: 'indigo', key: 'lender' },
    { label: 'Approved', count: 9, color: 'emerald', key: 'approved' },
    { label: 'Rejected', count: 4, color: 'rose', key: 'rejected' },
];

export const LENDER_LIST = ['Barclays', 'HSBC', 'NAB', 'Starling', 'Lloyds', 'NatWest', 'Santander'];

export const AGENTS = [
    { name: 'Lakshan R', role: 'Super Admin', initials: 'LR' },
    { name: 'Sarah White', role: 'Team Leader', initials: 'SW' },
    { name: 'Michael Chen', role: 'Team Leader', initials: 'MC' },
    { name: 'Cody Lane', role: 'Tele Agent', initials: 'CL' },
    { name: 'Emma Watson', role: 'Tele Agent', initials: 'EW' },
    { name: 'Leo Kumar', role: 'Accounts Manager', initials: 'LK' },
];

export const MEMBERS = [
    { name: 'Thanushika', role: 'Senior Agent', status: 'Online', lastActive: 'Now', color: '#6366f1' },
    { name: 'Ravindu', role: 'Support Agent', status: 'Away', lastActive: '12m ago', color: '#0891b2' },
    { name: 'Priya', role: 'Tele Agent', status: 'Online', lastActive: 'Now', color: '#16a34a' },
    { name: 'Amal', role: 'Junior Agent', status: 'Offline', lastActive: '2h ago', color: '#b45309' },
    { name: 'Nirosha', role: 'Tele Agent', status: 'Online', lastActive: 'Now', color: '#b91c1c' },
    { name: 'Kasun', role: 'Senior Agent', status: 'Online', lastActive: 'Now', color: '#7c3aed' },
];

export const FINANCE_LENDERS = [
    { name: 'Lloyds Bank', status: 'Submitted', color: 'blue' },
    { name: 'Barclays', status: 'Approved', color: 'emerald' },
    { name: 'NatWest', status: 'In Review', color: 'amber' },
    { name: 'HSBC', status: 'Pending', color: 'slate' },
];

export const FINANCE_DOCS = [
    { name: 'Bank Statements', status: 'Verified', color: 'emerald', icon: 'fa-check' },
    { name: 'ID Documents', status: 'Verified', color: 'emerald', icon: 'fa-check' },
    { name: 'Financial Accounts', status: 'Pending', color: 'amber', icon: 'fa-clock' },
    { name: 'Tax Returns', status: 'Missing', color: 'rose', icon: 'fa-xmark' },
];

export const DOC_REQUESTS = [
    { id: 1, lead: 'James Smith', doc: 'Bank Statements', company: 'Alpha Tech Ltd', status: 'Pending', quality: 'hot', time: '2h ago' },
    { id: 2, lead: 'Oliver Noah', doc: 'ID Proof', company: 'Bright Build Co', status: 'Rejected', quality: 'warm', time: '5h ago', reason: 'Blurry scan' },
    { id: 3, lead: 'William Davis', doc: 'Payslips', company: 'Summit Retail', status: 'Pending', quality: 'cool', time: 'Yesterday' },
    { id: 4, lead: 'Henry Wilson', doc: 'Utility Bill', company: 'Nova Finance', status: 'Pending', quality: 'hot', time: '2 days ago' },
];

export const AI_OPTIONS = [
    { icon: 'fa-wand-magic-sparkles', bg: 'bg-indigo-50', color: 'text-indigo-600', title: 'AI Lead Summary', desc: 'Detailed lead analysis & summaries' },
    { icon: 'fa-chart-line', bg: 'bg-indigo-50', color: 'text-indigo-600', title: 'Pipeline Analysis', desc: 'AI insights on your loan pipeline' },
    { icon: 'fa-users', bg: 'bg-emerald-50', color: 'text-emerald-600', title: 'Lead Scoring', desc: 'Auto-score and prioritise leads' },
    { icon: 'fa-file-invoice', bg: 'bg-amber-50', color: 'text-amber-600', title: 'Report Generator', desc: 'Generate performance reports' },
    { icon: 'fa-robot', bg: 'bg-rose-50', color: 'text-rose-600', title: 'AI Assistant', desc: 'Ask anything about your CRM' },
];

export const AGENT_PERFORMANCE = [
    { name: 'Thanushika', cases: 24, volume: '£1.2M', perf: 85, color: '#6366f1' },
    { name: 'Ravindu', cases: 18, volume: '£950k', perf: 72, color: '#0891b2' },
    { name: 'Priya', cases: 31, volume: '£2.1M', perf: 94, color: '#16a34a' },
    { name: 'Amal', cases: 15, volume: '£600k', perf: 60, color: '#b45309' },
    { name: 'Nirosha', cases: 22, volume: '£1.1M', perf: 78, color: '#b91c1c' },
];

export const SNAPSHOT_STAGES = [
    { label: 'Created', count: 48, status: 'slate' },
    { label: 'Pending', count: 32, status: 'amber' },
    { label: 'Verify', count: 18, status: 'blue' },
];

export const VAULT_DOCS = [
    { id: 1, title: 'Home Loan Product Guide 2026', category: 'Products', fileType: 'pdf', fileSize: '3.4 MB', version: 'v2.1', uploaded: '2026-04-10', desc: 'Comprehensive guide covering all home loan products, rates, and eligibility criteria.' },
    { id: 2, title: 'AML & KYC Compliance Policy', category: 'Policies', fileType: 'pdf', fileSize: '1.2 MB', version: 'v4.0', uploaded: '2026-04-08', desc: 'Updated AML and KYC policy aligned with AUSTRAC 2026 guidelines.' },
    { id: 3, title: 'Broker Onboarding FAQ', category: 'FAQs', fileType: 'docx', fileSize: '420 KB', version: 'v1.3', uploaded: '2026-04-12', desc: 'Frequently asked questions for new brokers joining the panel.' },
    { id: 4, title: 'Cold Call Script - Refinance', category: 'Scripts', fileType: 'docx', fileSize: '190 KB', version: 'v1.0', uploaded: '2026-04-14', desc: 'Structured outbound call script for refinance lead conversations.' },
    { id: 5, title: 'Lender Panel Overview Guide', category: 'Guides', fileType: 'pdf', fileSize: '5.1 MB', version: 'v3.2', uploaded: '2026-04-05', desc: 'Full overview of all lenders including products, BDMs, and turnaround times.' },
    { id: 6, title: 'CRM Usage Knowledge Base', category: 'Knowledge Base', fileType: 'pdf', fileSize: '2.8 MB', version: 'v1.1', uploaded: '2026-04-15', desc: 'Internal knowledge base for using the CRM platform.' },
    { id: 7, title: 'Commercial Loan Product Sheet', category: 'Products', fileType: 'xlsx', fileSize: '680 KB', version: 'v1.0', uploaded: '2026-04-13', desc: 'Rate and product comparison sheet for commercial lending solutions.' },
    { id: 8, title: 'Privacy Policy 2026', category: 'Policies', fileType: 'pdf', fileSize: '890 KB', version: 'v2.9', uploaded: '2026-03-01', desc: 'Client privacy and data handling policy.' },
    { id: 9, title: 'Settlement Checklist Guide', category: 'Guides', fileType: 'docx', fileSize: '310 KB', version: 'v2.0', uploaded: '2026-04-07', desc: 'Step-by-step settlement checklist for brokers to share with clients.' },
    { id: 10, title: 'Objection Handling Scripts', category: 'Scripts', fileType: 'docx', fileSize: '240 KB', version: 'v1.2', uploaded: '2026-04-11', desc: 'Common objection handling scripts for tele agents.' },
];

export const FILE_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
    pdf: { icon: 'fa-solid fa-file-pdf', bg: '#fee2e2', color: '#dc2626' },
    docx: { icon: 'fa-solid fa-file-word', bg: '#dbeafe', color: '#1d4ed8' },
    xlsx: { icon: 'fa-solid fa-file-excel', bg: '#d1fae5', color: '#059669' },
    png: { icon: 'fa-solid fa-file-image', bg: '#f3e8ff', color: '#7e22ce' },
    pptx: { icon: 'fa-solid fa-file-powerpoint', bg: '#fff7ed', color: '#c2410c' },
};

export const CAT_COLORS: Record<string, string> = {
    'Knowledge Base': '#1d4ed8', 'Guides': '#7e22ce', 'FAQs': '#b45309',
    'Products': '#065f46', 'Policies': '#b91c1c', 'Scripts': '#334155',
};

// Compatibility Aliases
export const leads = INITIAL_LEADS;
export const followups = INITIAL_TASKS;
export const tasks = INITIAL_TASKS;
export const notes = INITIAL_NOTES;
export const licenses = INITIAL_LICENSES;
export const notifications = INITIAL_NOTIFICATIONS;
export const payouts = INITIAL_PAYOUTS;
export const teleAgents = INITIAL_TELE_AGENTS;
export const calEvents = INITIAL_CALENDAR_EVENTS;
export const teamMembers = MEMBERS;
export const financeLenders = FINANCE_LENDERS;
export const financeDocs = FINANCE_DOCS;
export const docRequests = DOC_REQUESTS;
export const aiOptions = AI_OPTIONS;
export const pipelineStages = PIPELINE_STAGES;
export const agentPerformance = AGENT_PERFORMANCE;
export const snapshotStages = SNAPSHOT_STAGES;
export const vaultDocs = VAULT_DOCS;
export const fileIcons = FILE_ICONS;
export const catColors = CAT_COLORS;
