import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.leads.getAll());
}

export async function PATCH(request: Request) {
    const { id, status } = await request.json();
    db.leads.update(id, { status });

    // Log the move
    db.audits.log('System', `Moved lead ${id} to ${status}`);

    return NextResponse.json({ success: true });
}
