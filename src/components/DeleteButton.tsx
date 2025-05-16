'use client';

export default function DeleteButton({ id }: { id: string }) {
    const handleDelete = async () => {
        await fetch(`/api/reservations/${id}`, {
            method: "DELETE",
        });
        window.location.reload(); // Or use a router refresh if using App Router
    };

    return (
        <button
            onClick={handleDelete}
            className="text-red-600 mt-2 text-sm underline"
        >
            Cancel Reservation
        </button>
    );
}
