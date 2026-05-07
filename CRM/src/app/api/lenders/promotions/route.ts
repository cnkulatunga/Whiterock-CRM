import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const { data, status, error } = await djangoApi.get('/lenders/promotions/', token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}
