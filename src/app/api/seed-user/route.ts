import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        const hashedPassword = await hash("test123", 10);

        const user = await prisma.user.upsert({
            where: { email: "bob@example.com" },
            update: {
                password: hashedPassword,
            },
            create: {
                name: "Bob",
                email: "bob@example.com",
                password: hashedPassword,
            },
        });

        return NextResponse.json({ user })
    } catch (error) {
        console.error('seeding error:', error);
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

}