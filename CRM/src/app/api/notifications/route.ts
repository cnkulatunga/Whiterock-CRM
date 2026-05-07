import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const { data, status, error } = await djangoApi.get('/notifications/', token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    const body = await request.json();

    // Mark-read action: { id, action: 'read' }
    if (body.action === 'read' && body.id) {
        const { data, status, error } = await djangoApi.post(`/notifications/${body.id}/read/`, {}, token);
        if (error) return NextResponse.json({ error }, { status });
        return NextResponse.json(data ?? { success: true });
    }

    // Create notification: { title, desc, user_id }
    const { data, status, error } = await djangoApi.post('/notifications/', body, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data, { status: 201 });
}
