import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.notifications.getAll());
}

export async function POST(request: Request) {
    const { id } = await request.json();
    const notification = db.notifications.getById(id);
    if (notification) notification.unread = false;
    return NextResponse.json({ success: true });
}
