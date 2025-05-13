import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ListingPage() {
    const listings = await prisma.listing.findMany({
        include: {
            user: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Explore Listings</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <div
                        key={listing.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                        <img
                            src={listing.image}
                            alt={listing.title}
                            className="h-40 w-full object-cover rounded mb-3"
                        />

                        <h2 className="text-lg font-semibold">{listing.title}</h2>
                        <p className="text-gray-600 text-sm">{listing.location}</p>
                        <p className="text-sm mt-1 line-clamp-2">{listing.description}</p>
                        <p className="text-green-600 font-bold mt-2">${listing.price}/night</p>

                        <p className="text-xs mt-1 text-gray-500">
                            Hosted by {listing.user?.name || "Someone"}
                        </p>


                        {<Link href={`/listings/${listing.id}`} className="text-blue-500 text-sm mt-2 block underline">View Details</Link>}
                    </div>
                ))}
            </div>
        </main>
    );
}