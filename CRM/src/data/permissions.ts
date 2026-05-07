
export interface Permission {
    key: string;
    label: string;
    type: 'module' | 'submodule' | 'feature' | 'dashboard_card';
    actions?: string[]; // e.g., ['create', 'read', 'update', 'delete', 'assign']
    viewOptions?: string[]; // e.g., ['self', 'team', 'all']
}

export const PERMISSIONS_SCHEMA = [
    {
        key: 'tasks',
        label: 'Task & Follow-Ups',
        type: 'module',
        actions: ['add', 'edit', 'delete', 'assign'],
        viewOptions: ['self', 'team', 'all']
    },
    {
        key: 'leads',
        label: 'Lead Management',
        type: 'module',
        actions: ['add', 'edit', 'delete', 'assign', 'upload_docs', 'view_docs', 'approve_docs', 'reject_docs', 'reupload_docs'],
        viewOptions: ['self', 'team', 'all']
    },
    {
        key: 'pipeline',
        label: 'Loan Pipeline',
        type: 'module',
        actions: ['full_access', 'view_stages', 'move_stages', 'edit_data'],
        viewOptions: ['self', 'team', 'all']
    },
    {
        key: 'lenders',
        label: 'Lender Management',
        type: 'module',
        actions: ['add', 'view', 'edit', 'delete'],
        viewOptions: ['self', 'team', 'all']
    },
    {
        key: 'promotions',
        label: 'Lender Promotions',
        type: 'module',
        actions: ['add', 'edit', 'delete', 'view', 'send_application'],
        viewOptions: ['all']
    },
    {
        key: 'docs',
        label: 'Document Vault',
        type: 'module',
        actions: ['add', 'view', 'edit', 'delete'],
        viewOptions: ['self', 'team', 'all']
    },
    {
        key: 'users',
        label: 'User Management',
        type: 'module',
        actions: ['add', 'edit', 'delete'],
        viewOptions: ['all']
    },
    {
        key: 'reports',
        label: 'Reporting & Analytics',
        type: 'module',
        actions: ['view', 'export', 'filter'],
        viewOptions: ['self', 'team', 'all']
    }
];

export const FEATURES_SCHEMA = [
    { key: 'ai_assistant', label: 'AI Assistant', icon: 'fa-robot' },
    { key: 'premium_calculator', label: 'Premium Calculator', icon: 'fa-calculator' },
    { key: 'whatsapp_direct', label: 'WhatsApp Direct', icon: 'fa-brands fa-whatsapp' },
    { key: 'teams', label: 'Teams', icon: 'fa-users-gear' },
    { key: 'mail', label: 'Corporate Mail', icon: 'fa-envelope' }
];

export const DASHBOARD_CARDS_SCHEMA = [
    { key: 'notes', label: 'Notes', icon: 'fa-note-sticky' },
    { key: 'op_calendar', label: 'Operation Calendar', icon: 'fa-calendar-days' },
    { key: 'license_insurance', label: 'License & Insurance', icon: 'fa-file-shield' },
    { key: 'online_agents', label: 'Online Agents', icon: 'fa-user-clock' },
    { key: 'lead_portfolio', label: 'Lead Portfolio', icon: 'fa-briefcase' },
    { key: 'upcoming_followups', label: 'Upcoming Follow-Ups', icon: 'fa-clock-rotate-left' },
    { key: 'pending_payouts', label: 'Pending Payouts', icon: 'fa-money-bill-transfer' },
    { key: 'lender_promotions', label: 'Lender Promotions', icon: 'fa-percent' },
    { key: 'my_leads_pipeline', label: 'My Leads Pipeline', icon: 'fa-diagram-project' },
    { key: 'document_request', label: 'Document Request', icon: 'fa-file-circle-question' },
    { key: 'my_team_leads', label: 'My Team\'s Leads', icon: 'fa-users-rectangle' },
    { key: 'pipeline_snapshot', label: 'Pipeline Snapshot', icon: 'fa-chart-pie' },
    { key: 'team_directory', label: 'Team Directory', icon: 'fa-address-book' },
    { key: 'finance_center', label: 'Finance Center', icon: 'fa-building-columns' }
];

export type RolePermissions = {
    modules: Record<string, {
        enabled: boolean;
        actions: Record<string, boolean>;
        view: 'self' | 'team' | 'all';
    }>;
    features: Record<string, boolean>;
    dashboardCards: Record<string, boolean>;
};

export const DEFAULT_ROLE_PERMISSIONS: Record<string, RolePermissions> = {
    'Super Admin': {
        modules: {
            tasks: { enabled: true, actions: { add: true, edit: true, delete: true, assign: true }, view: 'all' },
            leads: { enabled: true, actions: { add: true, edit: true, delete: true, assign: true, upload_docs: true, view_docs: true, approve_docs: true, reject_docs: true, reupload_docs: true }, view: 'all' },
            pipeline: { enabled: true, actions: { full_access: true, view_stages: true, move_stages: true, edit_data: true }, view: 'all' },
            lenders: { enabled: true, actions: { add: true, view: true, edit: true, delete: true }, view: 'all' },
            promotions: { enabled: true, actions: { add: true, edit: true, delete: true, view: true, send_application: true }, view: 'all' },
            docs: { enabled: true, actions: { add: true, view: true, edit: true, delete: true }, view: 'all' },
            users: { enabled: true, actions: { add: true, edit: true, delete: true }, view: 'all' },
            reports: { enabled: true, actions: { view: true, export: true, filter: true }, view: 'all' }
        },
        features: { ai_assistant: true, premium_calculator: true, whatsapp_direct: true, teams: true, mail: true },
        dashboardCards: {
            notes: true, op_calendar: true, license_insurance: true, online_agents: true, lead_portfolio: true,
            upcoming_followups: true, pending_payouts: true, lender_promotions: true, my_leads_pipeline: true,
            document_request: true, my_team_leads: true, pipeline_snapshot: true, team_directory: true, finance_center: true
        }
    },
    'Admin': {
        modules: {
            tasks: { enabled: true, actions: { add: true, edit: true, delete: true, assign: true }, view: 'all' },
            leads: { enabled: true, actions: { add: true, edit: true, delete: true, assign: true, upload_docs: true, view_docs: true, approve_docs: true, reject_docs: true, reupload_docs: true }, view: 'all' },
            pipeline: { enabled: true, actions: { full_access: true, view_stages: true, move_stages: true, edit_data: true }, view: 'all' },
            lenders: { enabled: true, actions: { add: true, view: true, edit: true, delete: true }, view: 'all' },
            promotions: { enabled: true, actions: { add: true, edit: true, delete: true, view: true, send_application: true }, view: 'all' },
            docs: { enabled: true, actions: { add: true, view: true, edit: true, delete: true }, view: 'all' },
            users: { enabled: true, actions: { add: true, edit: true, delete: true }, view: 'all' },
            reports: { enabled: true, actions: { view: true, export: true, filter: true }, view: 'all' }
        },
        features: { ai_assistant: true, premium_calculator: true, whatsapp_direct: true, teams: true, mail: true },
        dashboardCards: {
            notes: true, op_calendar: true, license_insurance: true, online_agents: true, lead_portfolio: true,
            upcoming_followups: true, pending_payouts: true, lender_promotions: true, my_leads_pipeline: true,
            document_request: true, my_team_leads: true, pipeline_snapshot: true, team_directory: true, finance_center: true
        }
    },
    'Accounts Manager': {
        modules: {
            tasks: { enabled: true, actions: { add: true, edit: true, delete: false, assign: false }, view: 'all' },
            leads: { enabled: true, actions: { add: false, edit: true, delete: true, assign: false, upload_docs: false, view_docs: true, approve_docs: true, reject_docs: false, reupload_docs: false }, view: 'all' },
            pipeline: { enabled: true, actions: { full_access: false, view_stages: true, move_stages: false, edit_data: false }, view: 'all' },
            lenders: { enabled: true, actions: { add: true, view: true, edit: true, delete: false }, view: 'all' },
            promotions: { enabled: true, actions: { add: false, edit: false, delete: false, view: true, send_application: false }, view: 'all' },
            docs: { enabled: true, actions: { add: true, view: true, edit: true, delete: false }, view: 'all' },
            users: { enabled: false, actions: { add: false, edit: false, delete: false }, view: 'all' },
            reports: { enabled: true, actions: { view: true, export: true, filter: true }, view: 'all' }
        },
        features: { ai_assistant: false, premium_calculator: true, whatsapp_direct: true, teams: true, mail: true },
        dashboardCards: {
            notes: true, op_calendar: true, license_insurance: true, online_agents: false, lead_portfolio: false,
            upcoming_followups: false, pending_payouts: true, lender_promotions: true, my_leads_pipeline: false,
            document_request: true, my_team_leads: false, pipeline_snapshot: true, team_directory: true, finance_center: true
        }
    },
    'Team Leader': {
        modules: {
            tasks: { enabled: true, actions: { add: true, edit: true, delete: false, assign: true }, view: 'team' },
            leads: { enabled: true, actions: { add: true, edit: false, delete: false, assign: true, upload_docs: true, view_docs: true, approve_docs: true, reject_docs: true, reupload_docs: true }, view: 'team' },
            pipeline: { enabled: true, actions: { full_access: false, view_stages: true, move_stages: true, edit_data: true }, view: 'team' },
            lenders: { enabled: true, actions: { add: false, view: true, edit: false, delete: false }, view: 'all' },
            promotions: { enabled: true, actions: { add: true, edit: true, delete: false, view: true, send_application: true }, view: 'all' },
            docs: { enabled: true, actions: { add: true, view: true, edit: true, delete: false }, view: 'team' },
            users: { enabled: false, actions: { add: false, edit: false, delete: false }, view: 'all' },
            reports: { enabled: true, actions: { view: true, export: true, filter: true }, view: 'team' }
        },
        features: { ai_assistant: true, premium_calculator: true, whatsapp_direct: true, teams: true, mail: true },
        dashboardCards: {
            notes: true, op_calendar: true, license_insurance: false, online_agents: true, lead_portfolio: true,
            upcoming_followups: true, pending_payouts: false, lender_promotions: true, my_leads_pipeline: true,
            document_request: true, my_team_leads: true, pipeline_snapshot: true, team_directory: true, finance_center: false
        }
    },
    'Tele Agent': {
        modules: {
            tasks: { enabled: true, actions: { add: true, edit: true, delete: false, assign: false }, view: 'self' },
            leads: { enabled: true, actions: { add: true, edit: false, delete: false, assign: false, upload_docs: true, view_docs: true, approve_docs: false, reject_docs: false, reupload_docs: true }, view: 'self' },
            pipeline: { enabled: false, actions: { full_access: false, view_stages: true, move_stages: false, edit_data: false }, view: 'self' },
            lenders: { enabled: false, actions: { add: false, view: true, edit: false, delete: false }, view: 'self' },
            promotions: { enabled: true, actions: { add: false, edit: false, delete: false, view: true, send_application: true }, view: 'all' },
            docs: { enabled: true, actions: { add: true, view: true, edit: false, delete: false }, view: 'self' },
            users: { enabled: false, actions: { add: false, edit: false, delete: false }, view: 'self' },
            reports: { enabled: false, actions: { view: true, export: false, filter: false }, view: 'self' }
        },
        features: { ai_assistant: false, premium_calculator: false, whatsapp_direct: true, teams: false, mail: true },
        dashboardCards: {
            notes: true, op_calendar: false, license_insurance: false, online_agents: false, lead_portfolio: true,
            upcoming_followups: true, pending_payouts: false, lender_promotions: true, my_leads_pipeline: true,
            document_request: true, my_team_leads: false, pipeline_snapshot: false, team_directory: false, finance_center: false
        }
    }
};

export const ROLES = ['Super Admin', 'Admin', 'Accounts Manager', 'Team Leader', 'Tele Agent'];
