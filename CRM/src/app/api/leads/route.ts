import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { INITIAL_LEADS } from '@/data/dummy';

export async function GET() {
    try {
        let leads = db.leads.getAll();
        
        // If DB is empty, something might have failed during initialization
        if (!leads || leads.length === 0) {
            console.log('API GET /api/leads: DB was empty, using INITIAL_LEADS fallback.');
            leads = INITIAL_LEADS;
        }

        console.log(`API GET /api/leads: Found ${leads.length} leads.`);
        return NextResponse.json(leads);
    } catch (error) {
        console.error('API GET /api/leads ERROR:', error);
        return NextResponse.json(INITIAL_LEADS || [], { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const lead = await request.json();
        const newLead = {
            ...lead,
            id: lead.id || `LD-${Math.floor(Math.random() * 900) + 100}`,
            date: lead.date || new Date().toISOString().split('T')[0]
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
