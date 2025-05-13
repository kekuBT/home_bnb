import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listingId = params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing || listing.userId != user?.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });
        }

        await prisma.listing.delete({
            where: { id: listingId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}