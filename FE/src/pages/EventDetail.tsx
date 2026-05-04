import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EventReview from "./Review";

export default function EventDetail() {
  const { id } = useParams();
  const eventId = Number(id);
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH EVENT (FIXED)
  const fetchEvent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/event/${eventId}`);
      const data = await res.json();

      setEvent(data.data); // ✅ ambil dari data.data
    } catch (err) {
      console.error("FETCH EVENT ERROR:", err);
    }
  };

  // 🔥 FETCH REVIEWS (FIXED)
  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${eventId}`);
      const data = await res.json();

      setReviews(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("FETCH REVIEW ERROR:", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (!eventId) return;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEvent(), fetchReviews()]);
      setLoading(false);
    };

    loadData();
  }, [eventId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6">Event tidak ditemukan</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-black text-white p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p>📍 {event.location}</p>
          <p>📅 {new Date(event.date).toLocaleString()}</p>
          <p>🏷️ {event.category}</p>
          <p className="mt-4 text-sm text-gray-400">
            Diselenggarakan oleh Organizer #{event.organizerId}
          </p>
        </div>

        <div className="w-64 h-64 bg-gray-700 rounded-xl flex items-center justify-center">
          <span>No Image</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* LEFT */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Deskripsi</h2>
          <p className="text-gray-700 leading-relaxed">
            {event.description}
          </p>

          {/* REVIEW */}
          <EventReview eventId={eventId} onSuccess={fetchReviews} />
          

          {/* LIST REVIEW */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Review User</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500">Belum ada review</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border p-4 rounded-lg mb-3">
                  <div className="text-yellow-400 text-lg">
                    {"⭐".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>

                  <p className="text-gray-700">{r.comment || "-"}</p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>

                  {r.user && (
                    <p className="text-xs text-gray-500 mt-1">
                      by {r.user.email}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <p className="text-gray-500 text-sm">Harga mulai dari</p>

          <h2 className="text-2xl font-bold mb-4">
            {event.price === 0
              ? "FREE"
              : `Rp ${event.price.toLocaleString()}`}
          </h2>

          <button
            onClick={() => navigate(`/checkout/${eventId}`)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-4"
          >
            Beli Tiket
          </button>
        </div>
      </div>
    </div>
  );
}