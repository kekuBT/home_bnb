import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, location, price, image } = body;

    if (!title || !description || !location || !price || !image) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const listing = await prisma.listing.create({
            data: { title, description, location, price, image, userId: user.id, },
        });

        return NextResponse.json({ listing });
    } catch (err) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}