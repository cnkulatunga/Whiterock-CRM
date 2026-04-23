import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const leads = db.leads.getAll() || [];
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const lead = await request.json();
        const newLead = {
            ...lead,
            id: `LD-${Math.floor(Math.random() * 900) + 100}`,
            date: new Date().toISOString().split('T')[0]
        };
        db.leads.create(newLead);
        return NextResponse.json(newLead);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, ...updates } = await request.json();
        const updated = db.leads.update(id, updates);
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        db.leads.delete(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
