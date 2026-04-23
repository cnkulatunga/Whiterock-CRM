import { NextResponse } from 'next/server';

// Mock notifications state
const notifications = [
    { id: 1, text: 'New lead assigned to you', time: '5m ago', read: false },
    { id: 2, text: 'Case AF-772 approved', time: '1h ago', read: true },
    { id: 3, text: 'Server Maintenance scheduled at 12:00', time: '3h ago', read: false }
];

export async function GET() {
    return NextResponse.json(notifications);
}

export async function POST(request: Request) {
    const { id } = await request.json();
    const notification = notifications.find(n => n.id === id);
    if (notification) notification.read = true;
    return NextResponse.json({ success: true });
}
