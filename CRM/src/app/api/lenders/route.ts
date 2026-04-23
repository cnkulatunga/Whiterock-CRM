import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const lenders = db.lenders.getAll() || [];
        return NextResponse.json(lenders);
    } catch (error) {
        return NextResponse.json([], { status: 200 }); // Return empty array instead of failing
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newLender = db.lenders.create({
            ...data,
            id: Math.floor(Math.random() * 10000),
            added: new Date().toISOString().split('T')[0]
        });
        return NextResponse.json(newLender);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, ...updates } = await request.json();
        const updated = db.lenders.update(id, updates);
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: 'Lender not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        db.lenders.delete(parseInt(id));
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
