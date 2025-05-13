import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: { id: string };
};

export default async function EditListingPage({ params }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return redirect("/login");

    const listing = await prisma.listing.findUnique({
        where: { id: params.id },
    });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!listing || listing.userId !== user?.id) return notFound();

    return (
        <main className="min-h-screen p-6">
            <h1 className="text-xl font-bold mb-4">Edit Listing</h1>

            <form
                action={`/api/listings/${listing.id}/edit`}
                method="POST"
                className="flex flex-col gap-4 max-w-md"
            >
                <input
                    type="text"
                    name="title"
                    defaultValue={listing.title}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="location"
                    defaultValue={listing.location}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="price"
                    defaultValue={listing.price}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="image"
                    defaultValue={listing.image}
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    defaultValue={listing.description}
                    className="border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Update Listing
                </button>
            </form>
        </main>
    );
}