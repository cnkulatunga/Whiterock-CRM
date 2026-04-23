import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.notes.getAll());
}

export async function POST(request: Request) {
    const { text } = await request.json();
    const newNote = db.notes.create({
        id: Date.now(),
        text,
        date: new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        pinned: false,
        highlighted: false
    });
    return NextResponse.json(newNote);
}

export async function PATCH(request: Request) {
    const { id, ...updates } = await request.json();
    const updated = db.notes.update(id, updates);
    return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        db.notes.delete(parseInt(id));
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
