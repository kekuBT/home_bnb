import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReservationForm from "@/components/ReservationForm";

type Props = {
    params: {
        id: string;
    };
};

export default async function ListingDetailPage({ params }: Props) {
    const listing = await prisma.listing.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            reservations: true,
        },

    });

    if (!listing) return notFound();

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-60 object-cover rounded mb-4"
            />

            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-gray-600">{listing.location}</p>
            <p className="mt-2">{listing.description}</p>

            <p className="mt-4 text-green-600 font-bold text-lg">
                ${listing.price} / night
            </p>

            <p className="mt-1 text-sm text-gray-500">
                Hosted by {listing.user?.name || "Someone"}
            </p>

            <ReservationForm listingId={listing.id} />

            listing.reservations.length === 0 ? (
            <p className="text-gray-500 mt-4 text-sm">No reservations for this listing yet.</p>
            ) : (
            <section className="mt-10">
                <h2 className="text-xl font-semibold mb-2">Upcoming Reservations:</h2>
                <ul className="space-y-3">
                    {listing.reservations.map((res) => (
                        <li key={res.id} className="text-sm text-gray-700 border rounded p-3">
                            From <strong>{new Date(res.startDate).toLocaleDateString()}</strong> to{" "}
                            <strong>{new Date(res.endDate).toLocaleDateString()}</strong>
                        </li>
                    ))}
                </ul>
            </section>
            )



        </main>
    );
}