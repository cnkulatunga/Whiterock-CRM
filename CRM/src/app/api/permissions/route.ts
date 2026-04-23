import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/permissions
export async function GET() {
    return NextResponse.json(db.permissions.getMatrix());
}

// POST /api/permissions
export async function POST(request: Request) {
    try {
        const { role, permissions } = await request.json();
        const updated = db.permissions.updateRole(role, permissions);
        return NextResponse.json({ success: true, permissions: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
    }
}
