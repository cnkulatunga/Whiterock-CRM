import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users
export async function GET() {
    return NextResponse.json(db.users.getAll());
}

// POST /api/users (Create new team member)
export async function POST(request: Request) {
    try {
        const userData = await request.json();
        const newUser = db.users.create(userData);
        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// PUT /api/users (Update existing user permissions or details)
export async function PUT(request: Request) {
    try {
        const { id, ...data } = await request.json();
        const updated = db.users.update(id, data);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
