import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/login")
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4"> Welcome back </h1>
                <p className="text-lg">Hello, {session.user?.name || "User"}!</p>
                <p className="text-sm text-gray-500 mt-2">Email: {session.user?.email}</p>

                <div className="my-4">
                    <LogoutButton />
                </div>
            </div>
        </main>
    );
}