import { useState } from "react";
import { createEvent } from "../service/api";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    date: "",
    totalSeats: "",
  });

  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    await createEvent({
      ...form,
      price: isPaid ? Number(form.price) : 0,
      totalSeats: Number(form.totalSeats),
    });

    alert("Event created successfully!");
    window.location.reload();
  } catch (err: any) {
    console.error(err.response?.data || err.message);

    alert(err.response?.data?.message || "Failed connect to server");
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-6 text-white max-w-xl mx-auto"
    >
      
      <h2 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">
        Create Event
      </h2>

      
      <div className="flex flex-col gap-3 sm:gap-4">
        <input
          placeholder="Title"
          className="p-2 rounded bg-gray-800 text-white w-full"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="p-2 rounded bg-gray-800 text-white w-full"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Location"
          className="p-2 rounded bg-gray-800 text-white w-full"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          placeholder="Category"
          className="p-2 rounded bg-gray-800 text-white w-full"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="date"
          className="p-2 rounded bg-gray-800 text-white w-full"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isPaid}
              onChange={() => {
                setIsPaid(false);
                setForm((prev) => ({ ...prev, price: "" }));
              }}
            />
            <span className="text-gray-400">Free Event</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isPaid}
              onChange={() => setIsPaid(true)}
            />
            <span className="text-gray-400">Paid Event</span>
          </label>
        </div>

        {isPaid && (
          <input
            type="number"
            placeholder="Price"
            className="p-2 rounded bg-gray-800 text-white w-full"
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
        )}

        <input
          type="number"
          placeholder="Total Seats"
          className="p-2 rounded bg-gray-800 text-white w-full"
          onChange={(e) =>
            setForm({ ...form, totalSeats: e.target.value })
          }
        />
      </div>

      
      <button className="mt-4 w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90 text-sm sm:text-base">
        Submit
      </button>
    </form>
  );
}