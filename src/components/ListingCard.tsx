'use client'

import Link from "next/link";

interface ListingCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    image: string;
    hostName?: string;
}

export default function ListingCard({ id, title, description, price, location, image, hostName }: ListingCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img
                src={image}
                alt={title}
                className="h-40 w-full object-cover rounded mb-3"
            />

            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-gray-600 text-sm">{location}</p>
            <p className="text-sm mt-1 line-clamp-2">{description}</p>
            <p className="text-green-600 font-bold mt-2">${price}/night</p>

            {hostName && (
                <p className="text-xs mt-1 text-gray-500">Hosted by {hostName}</p>
            )}

            <Link href={`/listings/${id}`} className="text-blue-500 text-sm mt-2 block underline">
                View Details
            </Link>
        </div>
    );
}