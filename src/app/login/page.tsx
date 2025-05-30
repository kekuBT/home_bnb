'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/dashboard',
        });

        if (res?.error) {
            setError('Invalid email or password');
        } else if (res?.ok) {
            router.push('/dashboard');
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-200 text-black p-6 rounded shadow-md w-80">
                <h1 className="text-xl font-bold">Login</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

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

                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"> Sign In </button>

                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: "/dashboard" })}
                    className="text-white w-full  bg-[#ff3705] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"

                > Sign in with Google </button>

            </form>


        </main>
    );
}
