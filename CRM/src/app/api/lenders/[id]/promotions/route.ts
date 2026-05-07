import { NextResponse } from 'next/server';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const token = await extractToken(request);
    const body = await request.json();
    const { data, status, error } = await djangoApi.post<any>(`/lenders/${id}/promotions/`, body, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data, { status: 201 });
}
