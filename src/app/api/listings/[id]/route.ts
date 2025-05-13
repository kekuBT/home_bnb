import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const listing = await prisma.listing.findUnique({
            where: { id: params.id },
            include: { user: true }
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        if (listing.user.email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.listing.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "Listing deleted" });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}