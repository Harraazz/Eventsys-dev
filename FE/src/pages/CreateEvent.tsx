import { useState } from "react";
import axios from "axios";

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
      const token = localStorage.getItem("token"); // 🔥 WAJIB

      const res = await axios.post(
        "http://localhost:3000/api/create-event",
        {
          ...form,
          price: isPaid ? Number(form.price) : 0,
          totalSeats: Number(form.totalSeats),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event created successfully!");
      window.location.reload();

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed connect to server");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
      <h2 className="font-bold mb-2">Create Event</h2>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        placeholder="Location"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <input
        placeholder="Category"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      {/* FREE / PAID */}
      <div className="mb-2">
        <label className="mr-4">
          <input
            type="radio"
            checked={!isPaid}
            onChange={() => {
              setIsPaid(false);
              setForm((prev) => ({ ...prev, price: "" }));
            }}
          />{" "}
          Free Event
        </label>

        <label>
          <input
            type="radio"
            checked={isPaid}
            onChange={() => setIsPaid(true)}
          />{" "}
          Paid Event
        </label>
      </div>

      {isPaid && (
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
      )}

      <input
        type="number"
        placeholder="Total Seats"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, totalSeats: e.target.value })
        }
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Submit
      </button>
    </form>
  );
}