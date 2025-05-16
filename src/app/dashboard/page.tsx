import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import ListingList from "@/components/ListingList";
import DeleteButton from "@/components/DeleteButton";



export default async function DashboardPage() {

    const session = await getServerSession(authOptions);

    console.log("Session:", session);


    if (!session?.user?.email) {
        return redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            Listing: true,
            reservations: {
                include: {
                    listing: true,
                },
            },
        },
    });

    return (
        <main className="min-h-screen p-6 bg-white text-black">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}</h1>

            <div className="my-4">
                <LogoutButton />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-2">Your Reservations:</h2>

            {user?.reservations.length === 0 ? (
                <p className="text-sm text-gray-600">No reservations yet.</p>
            ) : (
                <ul className="space-y-4">
                    {user?.reservations.map((res) => (
                        <li key={res.id} className="border p-4 rounded shadow-sm">
                            <h3 className="text-lg font-bold">{res.listing.title}</h3>
                            <p className="text-gray-600 text-sm">{res.listing.location}</p>
                            <p className="text-sm">{res.listing.description}</p>
                            <p className="text-sm font-semibold text-green-600">${res.listing.price}/night</p>
                            <p className="text-sm mt-1">
                                From <strong>{new Date(res.startDate).toLocaleDateString()}</strong> to{" "}
                                <strong>{new Date(res.endDate).toLocaleDateString()}</strong>
                            </p>

                            <DeleteButton id={res.id} />

                        </li>
                    ))}
                </ul>
            )}

            <div className="mb-4">
                <a href="/dashboard/listings/new" className="text-blue-600 underline">Create a new listing →</a>
            </div>

            <h2 className="text-xl font-semibold mb-2">Your Listings:</h2>

            <ListingList listings={user?.Listing || []} />

        </main>
    );
}