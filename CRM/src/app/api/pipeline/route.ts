import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    // Pipeline usually shows Leads but in a Board view
    return NextResponse.json(db.leads.getAll());
}

export async function POST(request: Request) {
    const { id, stage } = await request.json();
    db.leads.update(id, { stage });

    // Log the move
    db.audits.log('System', `Moved lead ${id} to ${stage}`);

    return NextResponse.json({ success: true });
}
