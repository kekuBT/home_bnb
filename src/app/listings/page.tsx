import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";

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
                    <ListingCard
                        key={listing.id}
                        id={listing.id}
                        title={listing.title}
                        description={listing.description}
                        price={listing.price}
                        location={listing.location}
                        image={listing.image}
                        hostName={listing.user?.name || "Someone"}
                    />
                ))}
            </div >
        </main >
    );
} 