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
