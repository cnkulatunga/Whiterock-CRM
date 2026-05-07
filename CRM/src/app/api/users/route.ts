import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { djangoApi, extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const token = await extractToken(request);
    const url = new URL(request.url);

    // Directory endpoint: returns all visible users with lead counts
    if (url.searchParams.get('directory') === 'true') {
        const { data, status, error } = await djangoApi.get<any>('/users/directory/', token);
        if (error) return NextResponse.json({ error }, { status });
        return NextResponse.json(data);
    }

    const qs = url.searchParams.toString();
    const path = qs ? `/users/?${qs}` : '/users/';

    const { data, status, error } = await djangoApi.get<any>(path, token);
    if (error) return NextResponse.json({ error }, { status });
    // Unwrap paginated response
    const list = data?.results ?? data;
    return NextResponse.json(list);
}

export async function POST(request: Request) {
    const token = await extractToken(request);
    const body = await request.json();

    const generatedPassword = body.password ? null : randomBytes(12).toString('base64url');
    if (generatedPassword) body.password = generatedPassword;

    const { data, status, error } = await djangoApi.post('/users/', body, token);
    if (error || !data) return NextResponse.json({ error }, { status });
    return NextResponse.json({ ...(data as object), temporary_password: generatedPassword }, { status: 201 });
}

export async function PUT(request: Request) {
    const token = await extractToken(request);
    const { id, email, joined, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // email and joined are read-only in UserUpdateSerializer — strip before forwarding
    const { data, status, error } = await djangoApi.put(`/users/${id}/`, updates, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const token = await extractToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { status, error } = await djangoApi.delete(`/users/${id}/`, token);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
    const token = await extractToken(request);
    const { id, action } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (action === 'reset-lock') {
        const { data, status, error } = await djangoApi.post(`/users/${id}/reset-lock/`, {}, token);
        if (error) return NextResponse.json({ error }, { status });
        return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
