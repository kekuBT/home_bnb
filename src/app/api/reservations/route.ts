import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData()
    const listingId = formData.get("listingId") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);

    if (startDate >= endDate) {
        return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
    });

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId === user!.id) {
        return NextResponse.json({ error: "You cannot reserve your own listing" }, { status: 403 });
    }

    const overlapping = await prisma.reservation.findFirst({
        where: {
            listingId,
            OR: [
                { startDate: { lte: endDate }, endDate: { gte: endDate } },
                { startDate: { lte: startDate }, endDate: { gte: startDate } },
                { startDate: { gte: startDate }, endDate: { lte: endDate } },
            ],
        },
    });

    if (overlapping) {
        return NextResponse.json({ error: "Data not available" }, { status: 400 });
    }

    await prisma.reservation.create({
        data: {
            userId: user!.id,
            listingId,
            startDate,
            endDate,
        },
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));
}
