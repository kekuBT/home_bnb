import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import ListingList from "@/components/ListingList";


export default async function DashboardPage() {

    const session = await getServerSession(authOptions);

    console.log("Session:", session);


    if (!session?.user?.email) {
        return redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { Listing: true },
    });

    return (
        <main className="min-h-screen p-6 bg-white text-black">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}</h1>

            <div className="my-4">
                <LogoutButton />
            </div>

            <div className="mb-4">
                <a href="/dashboard/listings/new" className="text-blue-600 underline">Create a new listing →</a>
            </div>

            <h2 className="text-xl font-semibold mb-2">Your Listings:</h2>

            <ListingList listings={user?.Listing || []} />

        </main>
    );
}