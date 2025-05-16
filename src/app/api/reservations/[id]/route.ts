import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
        return NextResponse.json({ error: "Missing dates" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const reservation = await prisma.reservation.create({
            data: {
                userId: user.id,
                listingId: params.id,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });

        return NextResponse.json({ reservation });
    } catch (error) {
        console.error("Reservation error: ", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    const reservation = await prisma.reservation.findUnique({
        where: { id: params.id },
    });

    if (!reservation || reservation.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.reservation.delete({
        where: { id: params.id },
    });

    return NextResponse.json({ message: "Reservation Cancelled" });
}