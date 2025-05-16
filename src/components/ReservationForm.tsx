'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservationForm({ listingId }: { listingId: string }) {
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        const res = await fetch(`/api/reservations/${listingId}`, {
            method: "POST",
            body: JSON.stringify({ startDate, endDate }),
            headers: { "Content-type": "application/json" },
        });

        if (res.ok) {
            setMessage(" Reservation successful");
            router.refresh();
        } else {
            const data = await res.json();
            setMessage(data.error || " Something went wrong.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Make a Reservation</h3>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded w-full"
                required
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded w-full"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Reserve
            </button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
}