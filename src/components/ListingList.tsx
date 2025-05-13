'use client'

type Listing = {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    image: string;
};

type Props = {
    listings: Listing[];
};

export default function ListingList({ listings }: Props) {
    const handleDelete = async (id: string) => {
        await fetch(`/api/listings/${id}`, { method: 'Delete' });
        window.location.reload();
    };

    return (
        <ul className="space-y-4" >
            {
                listings.map((listing) => (
                    <li key={listing.id} className="border p-4 rounded shadow-sm">
                        <h3 className="text-lg font-bold">{listing.title}</h3>
                        <p className="text-sm text-gray-600">{listing.location}</p>
                        <p className="text-sm">{listing.description}</p>
                        <p className="text-sm font-semibold text-green-600">${listing.price}/night</p>
                        <img src={listing.image} alt={listing.title} className="mt-2 w-full h-40 object-cover rounded" />
                        <a
                            href={`/dashboard/listings/${listing.id}/edit`}
                            className="text-blue-600 text-sm underline"
                        >
                            Edit
                        </a>

                        <button
                            onClick={() => handleDelete(listing.id)}
                            className="text-red-600 mt-2 text-sm underline"
                        >
                            Delete
                        </button>
                    </li>
                ))
            }
        </ul>
    );

}