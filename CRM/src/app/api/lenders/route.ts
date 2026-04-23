import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.lenders.getAll());
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
