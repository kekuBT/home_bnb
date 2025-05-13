'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { POST } from "@/app/api/register/route";

export default function CreateListingPage() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        image: '',
    });

    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/listings', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            const data = await res.json();
            setError(data.error || 'something went wrong');
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Create Listing</h1>

                {error && <p className="text-red-500">{error}</p>}

                <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 rounded" />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border p-2 rounded" />

                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </main>
    )
}

