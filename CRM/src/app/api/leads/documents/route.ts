import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);
    const qs = url.searchParams.toString();
    const path = qs ? `/leads/documents/?${qs}` : '/leads/documents/';
    const { data, status, error } = await djangoApi.get(path, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}
