import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const listing = await prisma.listing.findUnique({
        where: { id: params.id },
    });

    if (!listing || listing.userId !== user?.id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const form = await req.formData();
    const data = {
        title: form.get("title") as string,
        location: form.get("location") as string,
        price: Number(form.get("price")),
        image: form.get("image") as string,
        description: form.get("description") as string,
    };

    await prisma.listing.update({
        where: { id: params.id },
        data,
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));


}