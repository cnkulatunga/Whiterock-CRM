import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.set('crm_access', '', { maxAge: 0, path: '/' });
    res.cookies.set('crm_refresh', '', { maxAge: 0, path: '/' });
    return res;
}
