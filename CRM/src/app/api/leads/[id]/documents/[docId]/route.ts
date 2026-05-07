import { NextResponse } from 'next/server';
import { extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; docId: string }> }
) {
    const { id, docId } = await params;
    const token = await extractToken(request);
    const body = await request.json();

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND}/api/v1/leads/${id}/documents/${docId}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; docId: string }> }
) {
    const { id, docId } = await params;
    const token = await extractToken(request);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND}/api/v1/leads/${id}/documents/${docId}/`, {
        method: 'DELETE',
        headers,
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
