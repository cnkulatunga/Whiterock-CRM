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
    // Unwrap paginated response
    const list = data?.results ?? data;
    return NextResponse.json(list);
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    const body = await request.json();

    const { data, status, error } = await djangoApi.post('/leads/', body, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
    const token = await extractToken(request);
    const { id, ...updates } = await request.json();

    const { data, status, error } = await djangoApi.patch(`/leads/${id}/`, updates, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const token = await extractToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { status, error } = await djangoApi.delete(`/leads/${id}/`, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json({ success: true });
}
