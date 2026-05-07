import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const { data, status, error } = await djangoApi.get('/leads/', token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function PATCH(request: Request) {
    const token = await extractToken(request);
    const { id, status: leadStatus } = await request.json();

    const { data, status, error } = await djangoApi.patch(`/leads/${id}/`, { status: leadStatus }, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data ?? { success: true });
}
