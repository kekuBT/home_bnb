'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handlerRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
            headers: { 'Content-type': 'application/json' },
        });

        if (res.ok) {
            router.push('/login');
        } else {
            const data = await res.json();
            setError(data.error || 'Something went wrong')
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handlerRegister} className="flex flex-col gap-4 bg-white p-6 rounded shadow-md w-80">
                <h1 className="text-xl font-bold">Register</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Create Account
                </button>
            </form>
        </main>
    );
}