/**
 * WHITEROCK CRM — LEAVE MANAGEMENT API SERVICE
 * ──────────────────────────────────────────────
 * All API calls for the Leave Management portal.
 * Kept completely separate from crmApi.js — uses the same axios
 * base instance but hits /leave/* endpoints.
 *
 * Auth: Leave portal uses its own session (leave_user in localStorage).
 * The server should validate the leave session independently of the main CRM session.
 *
 * Usage:
 *   import { leaveAuthApi, leaveRequestsApi, ... } from './leaveApi';
 */

import api from './api';

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE AUTH
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Leave portal uses the same CRM credentials but maintains a separate session.
 */
export const leaveAuthApi = {
    /**
     * Login to the Leave Management portal.
     * Same credentials as main CRM but returns a leave-specific token/session.
     * @param {{ email: string, password: string }} credentials
     * @returns {Promise<{ user: object, token: string }>}
     */
    login: (credentials) =>
        api.post('/leave/auth/login', credentials).then(r => r.data),

    /**
     * Log out of the Leave portal (invalidates leave session only).
     */
    logout: () =>
        api.post('/leave/auth/logout').then(r => r.data),

    /**
     * Verify the current leave session and return the user.
     * @returns {Promise<object>} leave_user object
     */
    getMe: () =>
        api.get('/leave/auth/me').then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE BALANCES
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Leave balance per agent.
 * Annual: 7 days | Sick: 7 days total per agent per year.
 */
export const leaveBalancesApi = {
    /**
     * Get the leave balance for a specific Tele Agent.
     * @param {number} agentId
     * @returns {Promise<{
     *   agentId: number, agentName: string,
     *   annualTotal: number, annualUsed: number, annualRemaining: number,
     *   sickTotal: number, sickUsed: number, sickRemaining: number
     * }>}
     */
    getForAgent: (agentId) =>
        api.get(`/leave/balances/${agentId}`).then(r => r.data),

    /**
     * Get leave balances for all Tele Agents (Super Admin view).
     * @param {{ tlId?: number, amId?: number }} params  Optional filters
     * @returns {Promise<object[]>}
     */
    getAll: (params = {}) =>
        api.get('/leave/balances', { params }).then(r => r.data),

    /**
     * Get balances for all agents under a Team Leader.
     * @param {number} tlId
     * @returns {Promise<object[]>}
     */
    getByTL: (tlId) =>
        api.get('/leave/balances', { params: { tlId } }).then(r => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE REQUESTS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Leave request lifecycle: Draft → Pending → Approved | Rejected
 *
 * Leave type:    'Annual' | 'Sick'
 * Duration type: 'Full Day' | 'Half Day'
 * Period:        'Morning' | 'Afternoon'  (only when durationType === 'Half Day')
 * Status:        'Pending' | 'Approved' | 'Rejected'
 */
export const leaveRequestsApi = {
    /**
     * Get all leave requests visible to the current user.
     * - Tele Agent: only their own requests
     * - Team Leader: requests from their agents
     * - Accounts Manager: requests from all agents across their TLs
     * - Super Admin: all requests
     *
     * @param {{ status?: string, type?: string, agentId?: number, tlId?: number, amId?: number }} params
     * @returns {Promise<object[]>}
     */
    getAll: (params = {}) =>
        api.get('/leave/requests', { params }).then(r => r.data),

    /**
     * Get a single leave request by ID.
     * @param {string} id  e.g. 'LR-001'
     * @returns {Promise<object>}
     */
    getById: (id) =>
        api.get(`/leave/requests/${id}`).then(r => r.data),

    /**
     * Submit a new leave request (Tele Agent only).
     * @param {{
     *   type: 'Annual' | 'Sick',
     *   durationType: 'Full Day' | 'Half Day',
     *   period?: 'Morning' | 'Afternoon',
     *   startDate: string,   // YYYY-MM-DD
     *   endDate?: string,    // YYYY-MM-DD (only for multi-day full-day leaves)
     *   days: number,
     *   reason: string
     * }} data
     */
    create: (data) =>
        api.post('/leave/requests', data).then(r => r.data),

    /**
     * Approve a leave request (Team Leader or Accounts Manager).
     * @param {string} id  Leave request ID e.g. 'LR-001'
     * @param {{ note?: string }} data  Optional approval note
     */
    approve: (id, data = {}) =>
        api.patch(`/leave/requests/${id}/approve`, data).then(r => r.data),

    /**
     * Reject a leave request (Team Leader or Accounts Manager).
     * @param {string} id
     * @param {{ note: string }} data  Rejection reason (required)
     */
    reject: (id, data) =>
        api.patch(`/leave/requests/${id}/reject`, data).then(r => r.data),

    /**
     * Cancel a pending leave request (Tele Agent cancelling their own request).
     * @param {string} id
     */
    cancel: (id) =>
        api.patch(`/leave/requests/${id}/cancel`).then(r => r.data),

    /**
     * Get summary stats for a reviewer's dashboard.
     * - Team Leader: pending count, approved this month, rejected this month
     * - Accounts Manager: same but across all supervised agents
     * @param {{ tlId?: number, amId?: number }} params
     * @returns {Promise<{ total, pending, approved, rejected }>}
     */
    getStats: (params = {}) =>
        api.get('/leave/requests/stats', { params }).then(r => r.data),
};
