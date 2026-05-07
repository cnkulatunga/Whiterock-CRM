import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);
    const qs = url.searchParams.toString();
    const path = qs ? `/audit/?${qs}` : '/audit/';

    const { data, status, error } = await djangoApi.get(path, token);
    if (error) return NextResponse.json({ error }, { status });
    const list = (data as any)?.results ?? data;
    return NextResponse.json(list);
}
