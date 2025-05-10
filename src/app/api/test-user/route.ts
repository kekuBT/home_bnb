import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const user = await prisma.user.create({
            data: {
                name: 'Keku Test',
                email: 'keku@example.com',
                password: 'test123',
            },
        });

        return NextResponse.json({ user });
    } catch (err) {
        return NextResponse.json({ error: 'User already exists or failed' }, { status: 500 });
    }
}
