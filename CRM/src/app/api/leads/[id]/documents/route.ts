import { NextResponse } from 'next/server';
import { extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = await extractToken(request);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND}/api/v1/leads/${id}/documents/`, { headers });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = await extractToken(request);

    const formData = await request.formData();

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND}/api/v1/leads/${id}/documents/`, {
        method: 'POST',
        headers,
        body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
