'use client';

import { useState, useEffect, useCallback } from 'react';

export const DEFAULT_CARD_ORDERS: Record<string, string[]> = {
    super_admin: [
        'upcoming_followups',
        'notes',
        'license_insurance',
        'online_agents',
        'lead_portfolio',
        'pending_payouts',
        'lender_promotions',
        'op_calendar',
    ],
    tele_agent: [
        'my_leads_pipeline',
        'upcoming_followups',
        'notes',
        'lender_promotions',
        'op_calendar',
        'document_request',
    ],
    team_lead: [
        'my_team_leads',
        'pipeline_snapshot',
        'team_directory',
        'upcoming_followups',
        'notes',
        'lender_promotions',
        'op_calendar',
    ],
    accounts_manager: [
        'my_leads_pipeline',
        'finance_center',
        'pipeline_snapshot',
        'team_directory',
        'pending_payouts',
        'upcoming_followups',
        'notes',
        'lender_promotions',
        'op_calendar',
    ],
};

function getStorageKey(userId: string, role: string) {
    return `dashboard_layout_${role}_${userId}`;
}

function getUserId(): string {
    try {
        const session = sessionStorage.getItem('crm_session');
        if (session) {
            const data = JSON.parse(session);
            return String(data.id || data.user_id || data.email || 'default');
        }
    } catch { /* ignore */ }
    return 'default';
}

export function useDashboardLayout(role: string) {
    const defaultOrder = DEFAULT_CARD_ORDERS[role] ?? [];
    const [cardOrder, setCardOrder] = useState<string[]>(defaultOrder);
    const [userId, setUserId] = useState<string>('default');

    useEffect(() => {
        const uid = getUserId();
        setUserId(uid);
        try {
            const saved = localStorage.getItem(getStorageKey(uid, role));
            if (saved) {
                const parsed: string[] = JSON.parse(saved);
                const merged = [
                    ...parsed.filter(k => defaultOrder.includes(k)),
                    ...defaultOrder.filter(k => !parsed.includes(k)),
                ];
                setCardOrder(merged);
            }
        } catch { /* ignore */ }
    }, [role]);

    const saveLayout = useCallback((order: string[]) => {
        try {
            localStorage.setItem(getStorageKey(userId, role), JSON.stringify(order));
        } catch { /* ignore */ }
        setCardOrder(order);
    }, [userId, role]);

    const resetLayout = useCallback(() => {
        try {
            localStorage.removeItem(getStorageKey(userId, role));
        } catch { /* ignore */ }
        setCardOrder(defaultOrder);
    }, [userId, role]);

    return { cardOrder, saveLayout, resetLayout };
}
