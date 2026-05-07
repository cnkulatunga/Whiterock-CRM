import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';
import { DEFAULT_ROLE_PERMISSIONS } from '@/data/permissions';

export const dynamic = 'force-dynamic';

interface MeResponse {
    id: string;
    role: string;
    permissions: {
        modules: Record<string, unknown>;
        features: Record<string, boolean>;
        dashboardCards: Record<string, boolean>;
    };
    [key: string]: unknown;
}

export async function GET(request: Request) {
    const token = await extractToken(request);

    if (token) {
        const { data } = await djangoApi.get<MeResponse>('/users/me/', token);
        if (data?.role) {
            const role = data.role;

            // Super Admin and Admin manage the global matrix — return all roles
            if (role === 'Super Admin' || role === 'Admin') {
                return NextResponse.json({ ...DEFAULT_ROLE_PERMISSIONS });
            }

            const dbPerms = data.permissions;
            const roleDefaults = DEFAULT_ROLE_PERMISSIONS[role] ?? DEFAULT_ROLE_PERMISSIONS['Tele Agent'];
            // Merge per-section: use DB data for each section if it has entries
            const perms = {
                modules: (dbPerms?.modules && Object.keys(dbPerms.modules).length > 0)
                    ? dbPerms.modules
                    : roleDefaults.modules,
                features: (dbPerms?.features && Object.keys(dbPerms.features).length > 0)
                    ? dbPerms.features
                    : roleDefaults.features,
                dashboardCards: (dbPerms?.dashboardCards && Object.keys(dbPerms.dashboardCards).length > 0)
                    ? dbPerms.dashboardCards
                    : roleDefaults.dashboardCards,
            };
            return NextResponse.json({ [role]: perms });
        }
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { role, permissions } = body;
    if (!role || !permissions) {
        return NextResponse.json({ error: 'role and permissions required' }, { status: 400 });
    }
    // Handled by the users PUT endpoint directly
    return NextResponse.json({ success: true, role, permissions });
}
