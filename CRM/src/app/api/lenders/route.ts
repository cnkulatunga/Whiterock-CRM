import { NextResponse } from 'next/server';

// Simplified INIT_LENDERS
const lenders = [
    { id: 1, name: 'ANZ Bank', type: 'Bank', status: 'Active', categories: ['Secured', 'Commercial'], added: '2026-01-10', promotions: [] },
    { id: 2, name: 'CommBank', type: 'Bank', status: 'Active', categories: ['Secured', 'Commercial'], added: '2026-01-10', promotions: [] },
];

export async function GET() {
    return NextResponse.json(lenders);
}

export async function POST(request: Request) {
    const data = await request.json();
    const newLender = { ...data, id: lenders.length + 1, added: new Date().toISOString().split('T')[0] };
    lenders.push(newLender);
    return NextResponse.json(newLender);
}
