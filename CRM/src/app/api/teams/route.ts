import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const { data, status, error } = await djangoApi.get<any>('/teams/', token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(Array.isArray(data) ? data : (data?.results ?? []));
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    const body = await request.json();
    const { data, status, error } = await djangoApi.post('/teams/', body, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
    const token = await extractToken(request);
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { data, status, error } = await djangoApi.put(`/teams/${id}/`, updates, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const token = await extractToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { status, error } = await djangoApi.delete(`/teams/${id}/`, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json({ success: true });
}
