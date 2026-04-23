import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Basic mock authentication
        const user = db.users.getByEmail(email);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // In production, use bcrypt.compare here
        if (password !== 'Admin@123' && password !== 'CEO@123') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return user info and role (In production, return a JWT)
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            permissions: user.permissions || db.permissions.getMatrix()[user.role]
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
