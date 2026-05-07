import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const path = role ? `/analytics/?role=${encodeURIComponent(role)}` : '/analytics/';

    const { data, status, error } = await djangoApi.get<any>(path, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}
