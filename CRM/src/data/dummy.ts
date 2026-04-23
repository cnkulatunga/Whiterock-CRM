export const leads = [
    { id: '#AF-001', name: 'James Wilson', company: 'Wilson Real Estate', status: 'In Progress', type: 'Residential Land', amount: '$450,000', quality: 'hot' },
    { id: '#AF-002', name: 'Robert Fox', company: 'Fox Construction', status: 'Review', type: 'Commercial Build', amount: '$1,200,000', quality: 'warm' },
    { id: '#AF-003', name: 'Darlene Robertson', company: 'Robertson & Co', status: 'Pending', type: 'Bridge Loan', amount: '$250,500', quality: 'cool' },
    { id: '#AF-004', name: 'Courtney Henry', company: 'Henry Logistics', status: 'Closing', type: 'Asset Finance', amount: '$150,000', quality: 'hot' },
    { id: '#AF-005', name: 'Jane Cooper', company: 'Cooper Group', status: 'Appraisal', type: 'Mortgage', amount: '$850,000', quality: 'warm' },
    { id: '#AF-006', name: 'Arlene McCoy', company: 'McCoy Dev', status: 'Underwriting', type: 'Construction', amount: '$2,100,000', quality: 'hot' },
    { id: '#AF-007', name: 'Eleanor Pena', company: 'Pena Holdings', status: 'Approved', type: 'Commercial', amount: '$500,000', quality: 'cool' },
];

export const followups = [
    {
        id: '#AF-045',
        title: 'Johnathan Doe - Contract Signature',
        desc: 'Follow up on the pending expansion loan documentation. Client requires physical copies sent via courier.',
        client: 'Johnathan Doe',
        time: 'Today, 14:30',
        priority: 'Hot',
    },
    {
        id: '#AF-022',
        title: 'ABC Corp - Valuation Review',
        desc: 'Discuss the new asset valuation report with the client. Check if they agree with the commercial premises appraisal.',
        client: 'ABC Corp',
        time: 'Tmr, 09:00',
        priority: 'Warm',
    },
    {
        id: '#AF-018',
        title: 'Sarah Smith - Courtesy Call',
        desc: 'Routine check-in call to ensure client is happy with the current application progress.',
        client: 'Sarah Smith',
        time: '21 Apr, 11:30',
        priority: 'Cool',
    },
];

export const notes = [
    { id: 1, text: 'System audit scheduled for Monday morning.', date: '2026-04-09 | 01:54 PM', pinned: true, highlighted: false },
    { id: 2, text: 'Remember to call James regarding the appraisal.', date: '2026-04-10 | 10:30 AM', pinned: false, highlighted: true },
];

export const licenses = [
    {
        id: 1,
        name: 'FCA Regulatory License',
        type: 'License',
        date: '24 May 2026',
        remind: 30,
        status: 'ACTIVE',
        desc: 'Financial Conduct Authority regulatory license for brokerage operations.',
    },
    {
        id: 2,
        name: 'Professional Indemnity',
        type: 'Insurance',
        date: '15 June 2026',
        remind: 14,
        status: 'PENDING',
        desc: 'Annual PI insurance renewal required.',
    },
];

export const teleAgents = [
    { id: 'TM', name: 'Thanushika M.', email: 'thanushika@whiterock.com', phone: '+44 7700 900123', status: 'ACTIVE', leads: 42, color: 'bg-indigo-600' },
    { id: 'JS', name: 'John Smith', email: 'john.smith@whiterock.com', phone: '+44 7700 900555', status: 'OFFLINE', leads: 28, color: 'bg-slate-400' },
    { id: 'SJ', name: 'Sarah Jones', email: 'sarah.jones@whiterock.com', phone: '+44 7700 900222', status: 'ACTIVE', leads: 35, color: 'bg-rose-500' },
    { id: 'MB', name: 'Michael Brown', email: 'michael.b@whiterock.com', phone: '+44 7700 900333', status: 'ACTIVE', leads: 19, color: 'bg-teal-500' },
];

export const notifications = [
    { id: 1, title: 'New lead assigned', desc: 'James Wilson has been assigned to you.', time: '2 mins ago', unread: true, icon: 'fa-user-plus', color: 'bg-indigo-50 text-indigo-600' },
    { id: 2, title: 'Loan approved', desc: 'Loan #AF-007 has been approved.', time: '1 hour ago', unread: true, icon: 'fa-check-circle', color: 'bg-emerald-50 text-emerald-600' },
    { id: 3, title: 'Upcoming followup', desc: 'Followup with Johnathan Doe in 30 mins.', time: '30 mins ago', unread: true, icon: 'fa-clock', color: 'bg-amber-50 text-amber-600' },
];

export const stats = [
    { label: 'Leads', value: '1,284', change: '+12%', icon: 'fa-users', color: 'indigo' },
    { label: 'Active Pipeline', value: '$4.2M', change: '+8%', icon: 'fa-chart-line', color: 'emerald' },
    { label: 'Applications', value: '156', change: '-3%', icon: 'fa-file-invoice', color: 'blue' },
    { label: 'Closure Rate', value: '64%', change: '+5%', icon: 'fa-percentage', color: 'amber' },
];

export const lenders = [
    { id: 1, name: 'Barclays Bank', rating: 'A+', type: 'Mainstream', rate: '4.5%', maxLtv: '75%', active: true },
    { id: 2, name: 'Starling Bank', rating: 'A', type: 'Digital', rate: '4.8%', maxLtv: '80%', active: true },
    { id: 3, name: 'HSBC Commercial', rating: 'A+', type: 'Mainstream', rate: '4.2%', maxLtv: '70%', active: true },
    { id: 4, name: 'LendInvest', rating: 'B+', type: 'Bridge', rate: '0.85% (m)', maxLtv: '75%', active: true },
    { id: 5, name: 'Together Money', rating: 'B', type: 'Specialist', rate: '5.2%', maxLtv: '65%', active: false },
];

export const payouts = [
    { id: '#AF-028', client: 'A. Thompson', lender: 'Lloyds Bank', amount: '£4,250', status: 'PENDING SUBMISSION', statusColor: 'amber', time: '2h ago' },
    { id: '#AF-027', client: 'Global Logistics', lender: 'Funding Circle', amount: '£12,800', status: 'LENDER REVIEW', statusColor: 'blue', time: 'Yesterday' },
    { id: '#AF-026', client: 'Retail Ventures', lender: 'Allica Bank', amount: '£7,400', status: 'PENDING SUBMISSION', statusColor: 'amber', time: '5h ago' },
    { id: '#AF-025', client: 'Cresthold Dev', lender: 'Shawbrook', amount: '£9,100', status: 'LENDER REVIEW', statusColor: 'blue', time: '1d ago' },
];

export const promotions = [
    { id: 1, lender: 'Lloyds Bank', title: '0.25% Rate Cut', desc: 'Applicable to all new business expansion loans...', type: 'Exclusive', typeColor: 'indigo', expiry: '30 Apr' },
    { id: 2, lender: 'Funding Circle', title: '1% Fee Rebate', desc: 'Bonus commission on all asset finance deals...', type: 'Bonus', typeColor: 'emerald', expiry: '15 May' },
    { id: 3, lender: 'Starling Bank', title: 'Speedy Approval', desc: '48h turnaround time for Small Business Loans...', type: 'SLA', typeColor: 'amber', expiry: 'Ongoing' },
];

