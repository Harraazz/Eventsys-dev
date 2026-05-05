import { useEffect, useState } from "react";
import { getEvents, createEvent, } from "../service/api";

import { useNavigate } from "react-router-dom";



export default function Events() {


const navigate = useNavigate();


    const [events, setEvents] = useState<any[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        fetchEvents();

    }, []);

    const fetchEvents = () => {
        getEvents().then((data) => {
            setEvents(data.data);
        });
    };



    const handleDelete = (id: number) => {
        console.log("delete event:", id);
        // nanti sambung ke API delete
    };

    const handleEdit = (id: number) => {
        console.log("edit event:", id);
        // nanti buka modal/form
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

    const handleCreate = () => {
        console.log("create event");
        setIsOpen(true)
    };

    const handleSubmit = async () => {
        try {
            await createEvent({
                ...form,
                price: Number(form.price),
                totalSeats: Number(form.totalSeats),
            });

            setIsOpen(false);
            fetchEvents(); // reload data
        } catch (err) {
            console.log(err);
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
                                    onClick={() => handleEdit(event.id)}
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
                                placeholder="Title"
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                name="description"
                                placeholder="Description"
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                name="price"
                                type="number"
                                placeholder="Price"
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                name="date"
                                type="date"
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                name="totalSeats"
                                type="number"
                                placeholder="Total Seats"
                                onChange={handleChange}
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

