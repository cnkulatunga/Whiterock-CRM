'use client';

import { useState, useEffect } from 'react';
import { RolePermissions, DEFAULT_ROLE_PERMISSIONS } from '@/data/permissions';

export function usePermissions() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<RolePermissions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const session = sessionStorage.getItem('crm_session');
        if (session) {
            try {
                const data = JSON.parse(session);
                setUserRole(data.role);

                // Fetch live permissions from the server on every mount — ensures
                // any changes made by Super Admin are picked up immediately
                fetch('/api/permissions', { credentials: 'same-origin' })
                    .then(res => res.ok ? res.json() : Promise.reject(res.status))
                    .then(matrix => {
                        const livePerms = matrix[data.role];
                        if (livePerms) {
                            // Merge each section: use live DB data if non-empty, otherwise fall back
                            const roleDefaults = DEFAULT_ROLE_PERMISSIONS[data.role] || DEFAULT_ROLE_PERMISSIONS['Tele Agent'];
                            const resolved = {
                                modules: (livePerms.modules && Object.keys(livePerms.modules).length > 0) ? livePerms.modules : roleDefaults.modules,
                                features: (livePerms.features && Object.keys(livePerms.features).length > 0) ? livePerms.features : roleDefaults.features,
                                dashboardCards: (livePerms.dashboardCards && Object.keys(livePerms.dashboardCards).length > 0) ? livePerms.dashboardCards : roleDefaults.dashboardCards,
                            };
                            setPermissions(resolved);
                            try {
                                const updated = { ...data, permissions: resolved };
                                sessionStorage.setItem('crm_session', JSON.stringify(updated));
                            } catch { /* storage full */ }
                        } else {
                            // No entry for this role in matrix — use role defaults
                            const fallback = DEFAULT_ROLE_PERMISSIONS[data.role] || DEFAULT_ROLE_PERMISSIONS['Tele Agent'];
                            setPermissions(fallback);
                        }
                        setIsLoading(false);
                    })
                    .catch(() => {
                        // On network error, use cached permissions from sessionStorage if available
                        const cached = data.permissions as RolePermissions | undefined;
                        const fallback = cached || DEFAULT_ROLE_PERMISSIONS[data.role] || DEFAULT_ROLE_PERMISSIONS['Tele Agent'];
                        setPermissions(fallback);
                        setIsLoading(false);
                    });
            } catch (e) {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const hasModule = (moduleKey: string) => {
        if (!permissions) return false;
        return permissions.modules[moduleKey]?.enabled ?? false;
    };

    const hasAction = (moduleKey: string, action: string) => {
        if (!permissions) return false;
        // Super Admin has master bypass
        if (userRole === 'Super Admin') return true;
        const mod = permissions.modules[moduleKey];
        return mod?.enabled && (mod.actions[action] ?? false);
    };

    const hasFeature = (featureKey: string) => {
        if (!permissions) return false;
        if (userRole === 'Super Admin') return true;
        return permissions.features[featureKey] ?? false;
    };

    const canSeeCard = (cardKey: string) => {
        if (!permissions) return false;
        if (userRole === 'Super Admin') return true;
        return permissions.dashboardCards[cardKey] ?? false;
    };

    const getViewLevel = (moduleKey: string) => {
        if (!permissions) return 'self';
        if (userRole === 'Super Admin') return 'all';
        return permissions.modules[moduleKey]?.view || 'self';
    };

    return {
        userRole,
        permissions,
        isLoading,
        hasModule,
        hasAction,
        hasFeature,
        canSeeCard,
        getViewLevel
    };
}
