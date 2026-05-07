import { NextResponse } from 'next/server';
import { extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const token = await extractToken(request);
    const body = await request.json();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND}/api/v1/docs/${id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const token = await extractToken(request);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND}/api/v1/docs/${id}/`, {
        method: 'DELETE',
        headers,
    });
    return new NextResponse(null, { status: res.status });
}
