import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const { data, status, error } = await djangoApi.get<any>('/docs/categories/', token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    const body = await request.json();
    const { data, status, error } = await djangoApi.post<any>('/docs/categories/', body, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data, { status });
}

export async function DELETE(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { status: s, error } = await djangoApi.delete(`/docs/categories/${id}/`, token);
    if (error) return NextResponse.json({ error }, { status: s });
    return new NextResponse(null, { status: 204 });
}
