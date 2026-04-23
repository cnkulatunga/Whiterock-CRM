import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.tasks.getAll());
}

export async function POST(request: Request) {
    const data = await request.json();
    db.tasks.create(data);
    return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
    const { id, status } = await request.json();
    db.tasks.update(id, status);
    return NextResponse.json({ success: true });
}
