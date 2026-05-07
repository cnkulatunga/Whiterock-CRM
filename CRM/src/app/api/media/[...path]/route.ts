import { NextResponse } from 'next/server';
import { extractToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const token = await extractToken(request);
    if (!token) return new NextResponse(null, { status: 401 });

    const { path } = await params;
    const filePath = path.join('/');
    const backendUrl = `${BACKEND}/media/${filePath}`;

    try {
        const res = await fetch(backendUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }

        const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
        const contentDisposition = res.headers.get('content-disposition');

        const headers: Record<string, string> = { 'Content-Type': contentType };
        if (contentDisposition) headers['Content-Disposition'] = contentDisposition;

        return new NextResponse(res.body, { status: 200, headers });
    } catch {
        return new NextResponse(null, { status: 502 });
    }
}
