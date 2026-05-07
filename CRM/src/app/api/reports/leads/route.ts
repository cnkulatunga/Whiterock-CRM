import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);
    const qs = url.searchParams.toString();
    const path = qs ? `/leads/?${qs}` : '/leads/';

    const { data, status, error } = await djangoApi.get<any>(path, token);
    if (error) return NextResponse.json({ error }, { status });
    const list = (data as any)?.results ?? data;
    return NextResponse.json(Array.isArray(list) ? list : []);
}
