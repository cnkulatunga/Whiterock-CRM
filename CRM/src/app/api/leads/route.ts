import { NextResponse } from 'next/server';

// Mock leads storage (Reset on server restart, but works for the session)
let leads: any[] = [
    { id: 'LD-101', name: 'James Wilson', business: 'Wilson Tech', email: 'james@wilson.com', amount: '£45,000', status: 'In Progress', date: '2026-04-20' },
    { id: 'LD-102', name: 'Sarah Connor', business: 'Cyberdyne', email: 'sarah@res.com', amount: '£120,000', status: 'New', date: '2026-04-21' }
];

export async function GET() {
    return NextResponse.json(leads);
}

export async function POST(request: Request) {
    try {
        const lead = await request.json();
        const newLead = {
            ...lead,
            id: `LD-${Math.floor(Math.random() * 900) + 100}`,
            date: new Date().toISOString().split('T')[0]
        };
        leads.unshift(newLead);
        return NextResponse.json(newLead);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, ...updates } = await request.json();
        const idx = leads.findIndex(l => l.id === id);
        if (idx !== -1) {
            leads[idx] = { ...leads[idx], ...updates };
            return NextResponse.json(leads[idx]);
        }
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    leads = leads.filter(l => l.id !== id);
    return NextResponse.json({ success: true });
}
