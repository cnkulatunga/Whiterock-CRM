import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.licenses.getAll());
}

export async function POST(request: Request) {
    const data = await request.json();
    const newLicense = db.licenses.create({
        ...data,
        id: Date.now(),
        status: 'ACTIVE'
    });
    return NextResponse.json(newLicense);
}

export async function PATCH(request: Request) {
    const { id, ...updates } = await request.json();
    const updated = db.licenses.update(id, updates);
    return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        db.licenses.delete(parseInt(id));
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
