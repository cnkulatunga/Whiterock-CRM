/**
 * Server-side Django API client used by Next.js route handlers.
 * Never import this in client components — it reads server-only env vars.
 */

import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000';

export interface DjangoError {
    detail?: string;
    error?: string;
    [key: string]: unknown;
}

async function request<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<{ data: T | null; status: number; error: string | null }> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res = await fetch(`${BACKEND}/api/v1${path}`, {
            ...options,
            headers,
        });

        if (res.status === 204) return { data: null, status: 204, error: null };

        const json = await res.json();

        if (!res.ok) {
            const msg =
                (json as DjangoError).detail ||
                (json as DjangoError).error ||
                `HTTP ${res.status}`;
            return { data: null, status: res.status, error: msg };
        }

        return { data: json as T, status: res.status, error: null };
    } catch (err) {
        return { data: null, status: 500, error: 'Backend unreachable' };
    }
}

export const djangoApi = {
    get: <T>(path: string, token?: string) =>
        request<T>(path, { method: 'GET' }, token),

    post: <T>(path: string, body: unknown, token?: string) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),

    patch: <T>(path: string, body: unknown, token?: string) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, token),

    put: <T>(path: string, body: unknown, token?: string) =>
        request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, token),

    delete: <T>(path: string, token?: string) =>
        request<T>(path, { method: 'DELETE' }, token),
};

/**
 * Extract Bearer token — first from the Authorization header,
 * then from the crm_access httpOnly cookie set at login.
 */
export async function extractToken(req: Request): Promise<string | undefined> {
    const header = req.headers.get('Authorization');
    if (header) return header.replace('Bearer ', '');

    const jar = await cookies();
    return jar.get('crm_access')?.value;
}
