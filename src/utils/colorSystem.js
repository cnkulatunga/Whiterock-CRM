/* ─── CENTRALIZED COLOR SYSTEM ───────────────────────── */

/**
 * All color definitions for the application
 * Single source of truth for consistent theming
 */

/* ─── AVATAR COLORS ───────────────────────────────────── */

export const AVATAR_COLORS = [
    { bg: '#6366f1', text: '#ffffff', grad: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
    { bg: '#8b5cf6', text: '#ffffff', grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    { bg: '#10b981', text: '#ffffff', grad: 'linear-gradient(135deg,#10b981,#059669)' },
    { bg: '#f59e0b', text: '#ffffff', grad: 'linear-gradient(135deg,#f59e0b,#d97706)' },
    { bg: '#14b8a6', text: '#ffffff', grad: 'linear-gradient(135deg,#14b8a6,#0d9488)' },
    { bg: '#ef4444', text: '#ffffff', grad: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    { bg: '#0ea5e9', text: '#ffffff', grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
    { bg: '#ec4899', text: '#ffffff', grad: 'linear-gradient(135deg,#ec4899,#db2777)' },
];

/**
 * User-specific color assignments
 * Maps user IDs to their designated colors
 */
export const USER_COLORS = {
    1:  { color: '#5c6bc0', textColor: '#ffffff' },  // Jane Doe        – indigo blue
    2:  { color: '#00b894', textColor: '#ffffff' },  // Marcus Smith    – emerald green
    3:  { color: '#546e7a', textColor: '#ffffff' },  // Cody Lane       – blue-grey
    4:  { color: '#f39c12', textColor: '#ffffff' },  // Sarah White     – amber orange
    5:  { color: '#e74c3c', textColor: '#ffffff' },  // Diana Fernandez – vivid red
    6:  { color: '#00bcd4', textColor: '#ffffff' },  // Leo Kumar       – cyan
    7:  { color: '#e91e8c', textColor: '#ffffff' },  // Nina Hassan     – hot pink
    8:  { color: '#7c4dff', textColor: '#ffffff' },  // Ryan Patel      – purple
    9:  { color: '#ff7043', textColor: '#ffffff' },  // Aisha Nkosi     – deep orange
    10: { color: '#26a69a', textColor: '#ffffff' },  // Tom Brennan     – teal
    11: { color: '#66bb6a', textColor: '#ffffff' },  // Priya Sharma    – green
    12: { color: '#29b6f6', textColor: '#ffffff' },  // Jake Morrison   – light blue
    13: { color: '#ef5350', textColor: '#ffffff' },  // Elena Vasquez   – red
    14: { color: '#26c6da', textColor: '#ffffff' },  // Omar Khalil     – cyan teal
    15: { color: '#ab47bc', textColor: '#ffffff' },  // Sophie Tan      – purple pink
};

/* ─── LENDER TYPE COLORS ──────────────────────────────── */

export const LENDER_TYPE_COLORS = {
    'Major Bank': { bg: 'rgba(36,71,215,0.08)', color: '#2447d7', border: 'rgba(36,71,215,0.18)' },
    'Non-Bank': { bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
    'Credit Union': { bg: 'rgba(6,182,212,0.08)', color: '#06b6d4', border: 'rgba(6,182,212,0.2)' },
    'Building Society': { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    'Specialist': { bg: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
};

/* ─── WORKFLOW STAGE COLORS ───────────────────────────── */

export const WORKFLOW_STAGE_COLORS = {
    'lead_gather': { color: '#6366f1', label: 'Lead Detail Gather' },
    'doc_collect': { color: '#8b5cf6', label: 'Collect Document' },
    'lender_select': { color: '#ec4899', label: 'Lender Selection' },
    'closed': { color: '#10b981', label: 'Won / Rejected' },
};

/* ─── CHART & VISUALIZATION COLORS ────────────────────── */

export const CHART_COLORS = {
    primary: '#2447d7',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0ea5e9',
    purple: '#8b5cf6',
    pink: '#ec4899',
    gray: '#64748b',
};

/* ─── STATUS COLORS ────────────────────────────────────── */

export const STATUS_COLORS = {
    active: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0', dot: '#059669' },
    inactive: { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', dot: '#94a3b8' },
    pending: { bg: '#fff7ed', color: '#f59e0b', border: '#fed7aa', dot: '#f59e0b' },
    completed: { bg: '#ecfdf5', color: '#059669', border: '#d1fae5', dot: '#10b981' },
    rejected: { bg: '#fef2f2', color: '#dc2626', border: '#fee2e2', dot: '#ef4444' },
    urgent: { bg: '#fef2f2', color: '#dc2626', border: '#fee2e2', dot: '#dc2626' },
};

/* ─── DOCUMENT STATUS COLORS ───────────────────────────── */

export const DOCUMENT_COLORS = {
    pending: { color: '#f59e0b', bg: '#fff7ed' },
    approved: { color: '#10b981', bg: '#ecfdf5' },
    rejected: { color: '#e53e3e', bg: '#fef2f2' },
};

/* ─── ICON BACKGROUND COLORS ───────────────────────────── */

export const ICON_BG_COLORS = {
    blue: '#ebf0ff',
    orange: '#fff7ed',
    green: '#f0fdf4',
    red: '#fef2f2',
    purple: '#f3e8ff',
    cyan: '#ecfeff',
    pink: '#fce7f3',
};

/* ─── LEAD AVATAR COLORS (for SA_RECENT_LEADS) ─────────── */

export const LEAD_AVATAR_COLORS = {
    'Robert Miller': { bg: '#ebf0ff', tc: '#2447d7' },
    'Alice Huang': { bg: '#ecfdf5', tc: '#059669' },
    'Marcus Aurelius': { bg: '#f3e8ff', tc: '#7c3aed' },
    'Sarah Connor': { bg: '#fff7ed', tc: '#ea580c' },
    'Michael Chen': { bg: '#e0f2fe', tc: '#0369a1' },
};

/* ─── ROLE COLORS (for audit logs) ──────────────────────── */

export const ROLE_COLORS = {
    'Super Admin':      { bg: '#5c6bc0', roleCls: 'bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe]' },
    'Team Leader':      { bg: '#7c4dff', roleCls: 'bg-[#ede9fe] text-[#5b21b6] border border-[#ddd6fe]' },
    'Accounts Manager': { bg: '#f39c12', roleCls: 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]' },
    'Tele Agent':       { bg: '#00b894', roleCls: 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]' },
    'Automation':       { bg: '#546e7a', roleCls: 'bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]' },
};

/* ─── QUALIFIED LENDER COLORS ──────────────────────────── */

export const QUALIFIED_LENDER_COLORS = {
    tier1: { color: '#2447d7', bg: '#ebf0ff' },
    tier2: { color: '#16a34a', bg: '#ecfdf5' },
    tier3: { color: '#ea580c', bg: '#fff7ed' },
};

/* ─── HELPER FUNCTIONS ──────────────────────────────────── */

/**
 * Get avatar color for a user by ID
 * Falls back to AVATAR_COLORS array if user ID not found
 */
export const getAvatarColorById = (id) => {
    if (USER_COLORS[id]) {
        return USER_COLORS[id];
    }
    // Fallback to array-based color assignment
    const color = AVATAR_COLORS[id % AVATAR_COLORS.length];
    return { color: color.bg, textColor: color.text };
};

/**
 * Get avatar color by index (for new users or dynamic assignment)
 */
export const getAvatarColorByIndex = (index) => {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { color: color.bg, textColor: color.text };
};

/**
 * Get workflow stage color
 */
export const getWorkflowStageColor = (stageId) => {
    return WORKFLOW_STAGE_COLORS[stageId]?.color || CHART_COLORS.gray;
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
    const statusKey = status.toLowerCase();
    return STATUS_COLORS[statusKey] || STATUS_COLORS.inactive;
};
