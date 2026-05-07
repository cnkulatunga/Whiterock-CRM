import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = await extractToken(request);

    const { data, status, error } = await djangoApi.get(`/leads/${id}/`, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = await extractToken(request);
    const body = await request.json();

    // Strip read-only / relational fields that Django cannot deserialise from raw form values
    const { agent, lender, created_at, updated_at, ...updates } = body;

    const { data, status, error } = await djangoApi.patch(`/leads/${id}/`, updates, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = await extractToken(request);

    const { status, error } = await djangoApi.delete(`/leads/${id}/`, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json({ success: true });
}
