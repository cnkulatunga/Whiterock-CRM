import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);
    const qs = url.searchParams.toString();
    const path = qs ? `/tasks/?${qs}` : '/tasks/';

    const { data, status, error } = await djangoApi.get(path, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    const body = await request.json();

    const { data, status, error } = await djangoApi.post('/tasks/', body, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
    const token = await extractToken(request);
    const { id, ...updates } = await request.json();

    const { data, status, error } = await djangoApi.patch(`/tasks/${id}/`, updates, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}
