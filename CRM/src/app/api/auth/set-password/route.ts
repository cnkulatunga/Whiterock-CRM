import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export async function POST(request: Request) {
    try {
        const token = await extractToken(request);
        const { new_password } = await request.json();

        const { data, status, error } = await djangoApi.post(
            '/auth/set-password/',
            { new_password },
            token,
        );

        if (error) {
            return NextResponse.json({ error }, { status: status >= 400 ? status : 400 });
        }

        return NextResponse.json(data ?? { detail: 'Password updated.' });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
