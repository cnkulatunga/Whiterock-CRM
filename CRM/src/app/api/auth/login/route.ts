import { NextResponse } from 'next/server';
import { djangoApi } from '@/lib/api';

interface LoginResponse {
    access: string;
    refresh: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
        permissions: Record<string, unknown>;
    };
}

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const { data, status, error } = await djangoApi.post<LoginResponse>(
            '/auth/login/',
            { email, password },
        );

        if (error || !data) {
            // Forward lockout details so the login page can show the countdown
            const raw = data as any;
            return NextResponse.json(
                {
                    error: error ?? 'Authentication failed',
                    locked: raw?.locked ?? false,
                    locked_until: raw?.locked_until ?? null,
                    remaining_seconds: raw?.remaining_seconds ?? null,
                    attempts_left: raw?.attempts_left ?? null,
                    detail: raw?.detail ?? error ?? 'Authentication failed',
                },
                { status: status >= 400 ? status : 401 },
            );
        }

        const { access, refresh, user } = data;
        const mustSetPassword = (data as any).must_set_password ?? false;

        const landingPath =
            user.role === 'Super Admin' || user.role === 'Admin'
                ? '/dashboard/super_admin'
                : user.role === 'Team Leader'
                ? '/dashboard/team_lead'
                : user.role === 'Accounts Manager'
                ? '/dashboard/accounts_manager'
                : '/dashboard/tele_agent';

        // access is included so client components can attach Authorization headers
        // while direct client→backend calls are progressively migrated to Next.js route handlers.
        // Tokens are also stored in httpOnly cookies for server-side route handlers.
        const res = NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar ?? null,
            permissions: user.permissions,
            access,
            landing: landingPath,
            must_set_password: mustSetPassword,
        });

        const secure = process.env.NODE_ENV === 'production';

        // Tokens are stored only in httpOnly cookies — never exposed to client JS
        res.cookies.set('crm_access', access, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });
        res.cookies.set('crm_refresh', refresh, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
