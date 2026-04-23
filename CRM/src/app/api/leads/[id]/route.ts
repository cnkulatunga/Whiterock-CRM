import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const lead = db.leads.getAll().find((l: any) => l.id === id);
    if (lead) {
        return NextResponse.json(lead);
    }
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
}
