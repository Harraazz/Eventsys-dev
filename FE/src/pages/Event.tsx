import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../service/api";

import { useNavigate } from "react-router-dom";
export default function Events() {


    const navigate = useNavigate();


    const [events, setEvents] = useState<any[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        fetchEvents();

    }, []);

    const fetchEvents = () => {
        getEvents().then((data) => {
            setEvents(data.data);
        });
    };

    const handleDelete = async (id: number) => {
        try {
            if (confirm("Are you sure to delete this event?")) {
                await deleteEvent(id);
                fetchEvents();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (event: any) => {
        setIsEdit(true);
        setIsOpen(true);
        setSelectedId(event.id);

        setForm({
            title: event.title,
            description: event.description,
            price: event.price,
            date: event.date.split("T")[0],
            totalSeats: event.totalSeats,
        });
    };


    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        date: "",
        totalSeats: "",
    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await updateEvent(selectedId, {
                    ...form,
                    price: Number(form.price),
                    totalSeats: Number(form.totalSeats),
                });
            } else {
                await createEvent({
                    ...form,
                    price: Number(form.price),
                    totalSeats: Number(form.totalSeats),
                });
            }

            setIsOpen(false);
            setIsEdit(false);
            fetchEvents();
        } catch (err) {
            console.log(err);
            alert("Error bro");
        }
    };

    return (
        <div className="text-white">
            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yellow-400">
                    Events
                </h1>

                <button
                    onClick={() => navigate("/create-event")}
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
                >
                    + Create Event
                </button>

            </div>

            {/* 🔥 EMPTY STATE */}
            {events.length === 0 ? (
                <p className="text-gray-400">No events available</p>
            ) : (
                /* 🔥 GRID */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="text-lg font-bold text-yellow-400">
                                {event.title}
                            </h3>

                            <p className="text-gray-300 text-sm mt-1">
                                {event.description}
                            </p>

                            <p className="mt-2">
                                💰 Rp {event.price}
                            </p>

                            <p className="text-sm text-gray-400">
                                🎟 Seats: {event.availableSeats}
                            </p>

                            {/* 🔥 ACTION BUTTON */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-lg text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-yellow-400 text-xl font-bold mb-4">
                            Create Event
                        </h2>

                        <div className="flex flex-col gap-3">
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className="p-2 rounded bg-gray-800 text-white"
                            />

                            <input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="p-2 rounded bg-gray-800 text-white"
                            />

                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="p-2 rounded bg-gray-800 text-white"
                            />

                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-800 text-white"
                            />

                            <input
                                name="totalSeats"
                                type="number"
                                value={form.totalSeats}
                                onChange={handleChange}
                                placeholder="Total Seats"
                                className="p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-700 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded font-semibold"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

