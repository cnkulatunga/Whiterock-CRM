/**
 * ALPHA FUNDING CRM — FRONTEND API SERVICE
 * ─────────────────────────────────────
 * Single source of truth for all CRM API calls.
 * Leave Management has its own separate API: leaveApi.js
 *
 * Usage:
 *   import { leadsApi, usersApi, ... } from './crmApi';
 *   const lead = await leadsApi.getById('AF-001');
 */

import api from './api';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Authentication endpoints.
 * On success, server returns { user, token }. Token is stored via httpOnly cookie
 * (withCredentials: true is set in the axios instance).
 */
export const authApi = {
    /**
     * Log in with email + password.
     * @param {{ email: string, password: string }} credentials
     * @returns {Promise<{ user: object, token: string }>}
     */
    login: (credentials) =>
        api.post('/auth/login', credentials).then(r => r.data),

    /**
     * Invalidate the current session.
     */
    logout: () =>
        api.post('/auth/logout').then(r => r.data),

    /**
     * Return the currently authenticated user from the session.
     * @returns {Promise<object>} user object
     */
    getMe: () =>
        api.get('/auth/me').then(r => r.data),

    /**
     * Request a password-reset email.
     * @param {{ email: string }} payload
     */
    forgotPassword: (payload) =>
        api.post('/auth/forgot-password', payload).then(r => r.data),

    /**
     * Complete password reset with the token received by email.
     * @param {{ token: string, password: string }} payload
     */
    resetPassword: (payload) =>
        api.post('/auth/reset-password', payload).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS & TEAM MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * User management (Super Admin).
 * Role values: 'Super Admin' | 'Team Leader' | 'Tele Agent' | 'Accounts Manager'
 * Status values: 'Active' | 'Inactive'
 */
export const usersApi = {
    /**
     * List all users, with optional filters.
     * @param {{ role?: string, status?: string, search?: string }} params
     * @returns {Promise<object[]>}
     */
    getAll: (params = {}) =>
        api.get('/users', { params }).then(r => r.data),

    /**
     * Get a single user by ID.
     * @param {number} id
     */
    getById: (id) =>
        api.get(`/users/${id}`).then(r => r.data),

    /**
     * Create a new CRM user.
     * @param {{ name, email, role, status, password }} data
     */
    create: (data) =>
        api.post('/users', data).then(r => r.data),

    /**
     * Update an existing user's details.
     * @param {number} id
     * @param {Partial<{ name, email, role, status }>} data
     */
    update: (id, data) =>
        api.put(`/users/${id}`, data).then(r => r.data),

    /**
     * Delete a user by ID.
     * @param {number} id
     */
    delete: (id) =>
        api.delete(`/users/${id}`).then(r => r.data),

    /**
     * Get all Team Leaders supervised by a given Accounts Manager.
     * @param {number} amId
     * @returns {Promise<object[]>} array of Team Leader user objects
     */
    getTLsByAM: (amId) =>
        api.get(`/users/account-managers/${amId}/team-leaders`).then(r => r.data),

    /**
     * Get all Tele Agents in a given Team Leader's team.
     * @param {number} tlId
     * @returns {Promise<object[]>} array of Tele Agent user objects
     */
    getAgentsByTL: (tlId) =>
        api.get(`/users/team-leaders/${tlId}/agents`).then(r => r.data),

    /**
     * Assign a Tele Agent to a Team Leader's team.
     * @param {number} tlId
     * @param {number} agentId
     */
    assignAgentToTL: (tlId, agentId) =>
        api.post(`/users/team-leaders/${tlId}/agents`, { agentId }).then(r => r.data),

    /**
     * Remove a Tele Agent from a Team Leader's team.
     * @param {number} tlId
     * @param {number} agentId
     */
    removeAgentFromTL: (tlId, agentId) =>
        api.delete(`/users/team-leaders/${tlId}/agents/${agentId}`).then(r => r.data),

    /**
     * Assign a Team Leader to an Accounts Manager.
     * @param {number} amId
     * @param {number} tlId
     */
    assignTLToAM: (amId, tlId) =>
        api.post(`/users/account-managers/${amId}/team-leaders`, { tlId }).then(r => r.data),

    /**
     * Remove a Team Leader from an Accounts Manager.
     * @param {number} amId
     * @param {number} tlId
     */
    removeTLFromAM: (amId, tlId) =>
        api.delete(`/users/account-managers/${amId}/team-leaders/${tlId}`).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Leads CRUD + stage management.
 * Lead ID format: 'AF-XXX'
 * Stage values: 'Document Collection' | 'Document Verification Done' |
 *               'Lender Selection' | 'Final Review' | 'Completed' | 'Rejected'
 */
export const leadsApi = {
    /**
     * List leads with optional filters.
     * @param {{ stage?: string, agentId?: number, status?: string, search?: string, dateRange?: string }} params
     * @returns {Promise<object[]>}
     */
    getAll: (params = {}) =>
        api.get('/leads', { params }).then(r => r.data),

    /**
     * Get a single lead by its ID (e.g. 'AF-001').
     * @param {string} id
     */
    getById: (id) =>
        api.get(`/leads/${id}`).then(r => r.data),

    /**
     * Create a new lead.
     * @param {{
     *   name: string, businessName: string, email: string, phone: string,
     *   nic: string, source: string, notes?: string,
     *   assignedStaffId: number, agentName: string
     * }} data
     */
    create: (data) =>
        api.post('/leads', data).then(r => r.data),

    /**
     * Update a lead's details (full update).
     * @param {string} id  Lead ID e.g. 'AF-001'
     * @param {object} data  Fields to update
     */
    update: (id, data) =>
        api.put(`/leads/${id}`, data).then(r => r.data),

    /**
     * Move a lead to a new workflow stage.
     * @param {string} id
     * @param {string} stage  One of WORKFLOW_STAGES_LIST values
     * @param {number} [progress]  0-100 override (optional, server can derive)
     */
    updateStage: (id, stage, progress) =>
        api.patch(`/leads/${id}/stage`, { stage, progress }).then(r => r.data),

    /**
     * Reassign a lead to a different Tele Agent.
     * @param {string} id
     * @param {number} agentId
     */
    reassign: (id, agentId) =>
        api.patch(`/leads/${id}/assign`, { agentId }).then(r => r.data),

    /**
     * Delete a lead permanently.
     * @param {string} id
     */
    delete: (id) =>
        api.delete(`/leads/${id}`).then(r => r.data),

    /**
     * Get leads grouped by workflow stage (for pipeline / donut charts).
     * @returns {Promise<{ stage: string, count: number, percentage: number }[]>}
     */
    getByStageStats: () =>
        api.get('/leads/stats/by-stage').then(r => r.data),

    /**
     * Get lead performance metrics per agent (for Super Admin Lead Performance page).
     * @param {{ agentName?: string, status?: string, dateRange?: string }} params
     */
    getPerformance: (params = {}) =>
        api.get('/leads/stats/performance', { params }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Document upload and verification (Team Leader / Tele Agent).
 * Document status: 'Pending' | 'Approved' | 'Rejected' | 'Missing'
 */
export const documentsApi = {
    /**
     * List all documents for a lead.
     * @param {string} leadId
     * @returns {Promise<object[]>}
     */
    getByLead: (leadId) =>
        api.get(`/leads/${leadId}/documents`).then(r => r.data),

    /**
     * Upload a document to a lead. Expects multipart/form-data.
     * @param {string} leadId
     * @param {FormData} formData  Must include 'file' and 'type' fields
     */
    upload: (leadId, formData) =>
        api.post(`/leads/${leadId}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(r => r.data),

    /**
     * Update the verification status of a document.
     * @param {string} leadId
     * @param {number} docId
     * @param {'Approved' | 'Rejected' | 'Pending'} status
     * @param {string} [note]  Reviewer note
     */
    updateStatus: (leadId, docId, status, note = '') =>
        api.patch(`/leads/${leadId}/documents/${docId}`, { status, note }).then(r => r.data),

    /**
     * Delete a document from a lead.
     * @param {string} leadId
     * @param {number} docId
     */
    delete: (leadId, docId) =>
        api.delete(`/leads/${leadId}/documents/${docId}`).then(r => r.data),

    /**
     * Get summary counts for document verification queue (Team Leader dashboard).
     * @param {number} [tlId]  Filter to a Team Leader's agents only
     * @returns {Promise<{ pending: number, approved: number, rejected: number }>}
     */
    getVerificationStats: (tlId) =>
        api.get('/documents/stats', { params: { tlId } }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// TASKS & FOLLOW-UPS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Tasks system shared across all roles.
 * Task type: 'Call' | 'Email' | 'Meeting' | 'Document' | 'Review' | 'Administrative'
 * Task status: 'Pending' | 'In Progress' | 'Completed'
 * Reminder: 'none' | '15m' | '1h' | '1d'
 */
export const tasksApi = {
    /**
     * Get tasks visible to the current user.
     * @param {{ status?: string, type?: string, assignedTo?: string }} params
     * @returns {Promise<object[]>}
     */
    getAll: (params = {}) =>
        api.get('/tasks', { params }).then(r => r.data),

    /**
     * Get a single task by ID.
     * @param {number} id
     */
    getById: (id) =>
        api.get(`/tasks/${id}`).then(r => r.data),

    /**
     * Create a new task / follow-up.
     * @param {{ title, lead, date, time, type, status, reminder, assignedTo }} data
     */
    create: (data) =>
        api.post('/tasks', data).then(r => r.data),

    /**
     * Update an existing task.
     * @param {number} id
     * @param {Partial<{ title, lead, date, time, type, status, reminder }>} data
     */
    update: (id, data) =>
        api.put(`/tasks/${id}`, data).then(r => r.data),

    /**
     * Delete a task.
     * @param {number} id
     */
    delete: (id) =>
        api.delete(`/tasks/${id}`).then(r => r.data),

    /**
     * Mark a task as completed.
     * @param {number} id
     */
    complete: (id) =>
        api.patch(`/tasks/${id}/complete`).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// LENDERS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Lender partner management (Accounts Manager / Super Admin).
 * Lender type: 'Major Bank' | 'Non-Bank' | 'Credit Union' | 'Building Society' | 'Specialist'
 */
export const lendersApi = {
    /**
     * List all lenders with optional filters.
     * @param {{ type?: string, status?: string, search?: string }} params
     * @returns {Promise<object[]>}
     */
    getAll: (params = {}) =>
        api.get('/lenders', { params }).then(r => r.data),

    /**
     * Get a single lender by ID.
     * @param {number} id
     */
    getById: (id) =>
        api.get(`/lenders/${id}`).then(r => r.data),

    /**
     * Create a new lender partner.
     * @param {{ name, type, interestRate, maxLoan, minDeposit, contact, status }} data
     */
    create: (data) =>
        api.post('/lenders', data).then(r => r.data),

    /**
     * Update a lender's details.
     * @param {number} id
     * @param {object} data
     */
    update: (id, data) =>
        api.put(`/lenders/${id}`, data).then(r => r.data),

    /**
     * Delete a lender.
     * @param {number} id
     */
    delete: (id) =>
        api.delete(`/lenders/${id}`).then(r => r.data),

    /**
     * Get lenders qualified for a specific lead (match score, tier).
     * @param {string} leadId
     * @returns {Promise<{ id, name, tier, match, rate }[]>}
     */
    getQualifiedForLead: (leadId) =>
        api.get(`/lenders/qualified`, { params: { leadId } }).then(r => r.data),

    /**
     * Assign a lender to a lead (Accounts Manager lender selection step).
     * @param {string} leadId
     * @param {number} lenderId
     * @param {{ rate?: string, terms?: string }} options
     */
    assignToLead: (leadId, lenderId, options = {}) =>
        api.post(`/leads/${leadId}/lender`, { lenderId, ...options }).then(r => r.data),

    /**
     * Get all approved loans with their assigned lenders.
     * @param {{ amId?: number }} params
     * @returns {Promise<object[]>}
     */
    getApprovedLoans: (params = {}) =>
        api.get('/loans/approved', { params }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// LOAN DECISIONS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Final loan approval / rejection by Accounts Manager.
 */
export const loansApi = {
    /**
     * Approve a loan for a lead.
     * @param {string} leadId
     * @param {{ lenderId: number, interestRate: string, tenure: string, notes?: string }} data
     */
    approve: (leadId, data) =>
        api.post(`/leads/${leadId}/approve`, data).then(r => r.data),

    /**
     * Reject a loan for a lead.
     * @param {string} leadId
     * @param {{ reason: string }} data
     */
    reject: (leadId, data) =>
        api.post(`/leads/${leadId}/reject`, data).then(r => r.data),

    /**
     * Get approved loan summary stats (total approved value, count).
     * @returns {Promise<{ totalValue: string, count: number }>}
     */
    getApprovedStats: () =>
        api.get('/loans/approved/stats').then(r => r.data),

    /**
     * Get pipeline leads (leads in qualification stages ready for lender selection).
     * @param {{ amId?: number }} params
     * @returns {Promise<object[]>}
     */
    getPipelineLeads: (params = {}) =>
        api.get('/loans/pipeline', { params }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Aggregated statistics for each role's dashboard.
 */
export const dashboardApi = {
    /**
     * Get Super Admin overview stats (total leads, revenue, pending docs, rejection rate).
     * @returns {Promise<{ totalLeads, leadsChange, rejectionRate, monthlyRevenue, pendingDocs }>}
     */
    getSuperAdminStats: () =>
        api.get('/dashboard/super-admin/stats').then(r => r.data),

    /**
     * Get the Super Admin activity feed (recent system events).
     * @param {{ limit?: number }} params
     * @returns {Promise<{ label, detail, time, color }[]>}
     */
    getActivityFeed: (params = {}) =>
        api.get('/dashboard/activity', { params }).then(r => r.data),

    /**
     * Get lead status distribution for donut chart.
     * @returns {Promise<{ label, pct, color }[]>}
     */
    getLeadDistribution: () =>
        api.get('/dashboard/lead-distribution').then(r => r.data),

    /**
     * Get Team Leader dashboard stats (active leads, pending docs).
     * @param {number} [tlId]  Defaults to the current authenticated TL
     * @returns {Promise<{ label, value, trend, trendType }[]>}
     */
    getTLStats: (tlId) =>
        api.get('/dashboard/team-leader/stats', { params: { tlId } }).then(r => r.data),

    /**
     * Get agent performance table for a Team Leader's team.
     * @param {number} [tlId]
     * @returns {Promise<{ name, initials, activeLeads, closedDeals, color }[]>}
     */
    getAgentPerformance: (tlId) =>
        api.get('/dashboard/team-leader/agent-performance', { params: { tlId } }).then(r => r.data),

    /**
     * Get document collection progress (Team Leader dashboard progress bar).
     * @param {number} [tlId]
     * @returns {Promise<{ label, progress, color }[]>}
     */
    getDocumentCollectionProgress: (tlId) =>
        api.get('/dashboard/team-leader/document-collection', { params: { tlId } }).then(r => r.data),

    /**
     * Get document pipeline breakdown (pending / approved / rejected counts).
     * @param {number} [tlId]
     * @returns {Promise<{ label, value, color }[]>}
     */
    getDocumentPipeline: (tlId) =>
        api.get('/dashboard/team-leader/document-pipeline', { params: { tlId } }).then(r => r.data),

    /**
     * Get Accounts Manager stat cards (verified clients, pending loans, approval rate).
     * @param {number} [amId]
     * @returns {Promise<{ label, value, change, changeLabel, iconBg }[]>}
     */
    getAMStatCards: (amId) =>
        api.get('/dashboard/accounts-manager/stats', { params: { amId } }).then(r => r.data),

    /**
     * Get lead counts breakdown for Accounts Manager (total, pending, approved, rejected, newToday).
     * @param {number} [amId]
     * @returns {Promise<object>}
     */
    getAMLeadCounts: (amId) =>
        api.get('/dashboard/accounts-manager/lead-counts', { params: { amId } }).then(r => r.data),

    /**
     * Get recent leads list for Accounts Manager dashboard.
     * @param {number} [amId]
     * @param {{ limit?: number }} params
     * @returns {Promise<object[]>}
     */
    getAMRecentLeads: (amId, params = {}) =>
        api.get('/dashboard/accounts-manager/recent-leads', { params: { amId, ...params } }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// OPERATIONAL FLOW (Super Admin)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Visual pipeline / Kanban-style operational flow view.
 * Stage IDs: 'lead_gather' | 'doc_collect' | 'lender_select' | 'closed'
 */
export const operationalFlowApi = {
    /**
     * Get all leads grouped into the 4 operational workflow stages.
     * @returns {Promise<object[]>}  Each item includes leadDetails and lenderDetails
     */
    getLeads: () =>
        api.get('/operational-flow/leads').then(r => r.data),

    /**
     * Get the 4 workflow stage definitions (label, color, description).
     * @returns {Promise<{ id, label, color, description }[]>}
     */
    getStages: () =>
        api.get('/operational-flow/stages').then(r => r.data),

    /**
     * Move a lead to a different operational stage.
     * @param {string} leadId
     * @param {string} stage  One of the stage IDs above
     * @param {number} progress  0-100
     */
    updateLeadStage: (leadId, stage, progress) =>
        api.patch(`/operational-flow/leads/${leadId}/stage`, { stage, progress }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE (Super Admin)
// ─────────────────────────────────────────────────────────────────────────────
export const financeApi = {
    /**
     * Get high-level finance KPIs (total loans, pending, rejected, monthly revenue).
     * @returns {Promise<object>}
     */
    getStats: () =>
        api.get('/finance/stats').then(r => r.data),

    /**
     * Get transaction list with optional filters.
     * @param {{ status?: string, search?: string, dateRange?: string }} params
     * @returns {Promise<object[]>}
     */
    getTransactions: (params = {}) =>
        api.get('/finance/transactions', { params }).then(r => r.data),

    /**
     * Get monthly revenue vs target bar chart data.
     * @returns {Promise<{ label, revenue, target }[]>}
     */
    getRevenueData: () =>
        api.get('/finance/revenue').then(r => r.data),

    /**
     * Get payment status donut chart data (Completed / Pending / Rejected %).
     * @returns {Promise<{ label, pct, color }[]>}
     */
    getPaymentStatusDonut: () =>
        api.get('/finance/payment-status').then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS (Super Admin)
// ─────────────────────────────────────────────────────────────────────────────
export const auditApi = {
    /**
     * Get audit log entries with filters.
     * @param {{ category?: string, role?: string, search?: string, dateRange?: string }} params
     * @returns {Promise<object[]>}
     */
    getLogs: (params = {}) =>
        api.get('/audit-logs', { params }).then(r => r.data),

    /**
     * Get audit summary stats (total logs, critical logs, system alerts).
     * @returns {Promise<{ totalLogs, criticalLogs, systemAlerts }>}
     */
    getStats: () =>
        api.get('/audit-logs/stats').then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const notificationsApi = {
    /**
     * Get unread notifications for the current user.
     * @returns {Promise<object[]>}
     */
    getAll: () =>
        api.get('/notifications').then(r => r.data),

    /**
     * Mark a notification as read.
     * @param {number} id
     */
    markRead: (id) =>
        api.patch(`/notifications/${id}/read`).then(r => r.data),

    /**
     * Mark all notifications as read.
     */
    markAllRead: () =>
        api.patch('/notifications/read-all').then(r => r.data),

    /**
     * Delete a notification.
     * @param {number} id
     */
    delete: (id) =>
        api.delete(`/notifications/${id}`).then(r => r.data),
};
