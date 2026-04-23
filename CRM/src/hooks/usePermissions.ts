'use client';

import { useState, useEffect } from 'react';
import { RolePermissions, DEFAULT_ROLE_PERMISSIONS } from '@/data/permissions';

export function usePermissions() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<RolePermissions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from an API or JWT
        // For now, we read the session storage we set during login
        const session = sessionStorage.getItem('crm_session');
        if (session) {
            const data = JSON.parse(session);
            setUserRole(data.role);

            // Map role to its default permissions (or custom permissions from DB if available)
            // For this demo, we assume roles follow the Matrix defaults
            const rolePerms = DEFAULT_ROLE_PERMISSIONS[data.role];
            setPermissions(rolePerms || DEFAULT_ROLE_PERMISSIONS['Tele Agent']);
        }
        setIsLoading(false);
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
