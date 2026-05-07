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

  const fetchEvent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/event/${eventId}`);
      const data = await res.json();
      setEvent(data.data);
    } catch (err) {
      console.error("FETCH EVENT ERROR:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${eventId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
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

  if (loading) return <p className="p-4 sm:p-6 text-gray-400">Loading...</p>;
  if (!event) return <p className="p-4 sm:p-6 text-gray-400">Event tidak ditemukan</p>;

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      
      <div className="bg-gray-900 border-b border-gray-800 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
            {event.title}
          </h1>

          <div className="text-sm text-gray-400 space-y-1">
            <p>📍 {event.location}</p>
            <p>📅 {new Date(event.date).toLocaleString()}</p>
            <p>🏷️ {event.category}</p>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            <p className="mt-4 text-sm text-gray-400">
  Organized by #{event.organizerId}
</p>
          </p>
        </div>

        <div className="w-full md:w-64 h-40 md:h-64 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      </div>

      
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 max-w-6xl mx-auto">
        
        
        <div className="md:col-span-2 bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-yellow-400">
            Description
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {event.description}
          </p>

          
          <div className="mt-6">
            <EventReview eventId={eventId} onSuccess={fetchReviews} />
          </div>

          
          <div className="mt-8">
            <h2 className="text-base sm:text-lg font-bold mb-4">
              Review User
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No reviews yet. Be the first to review this event!
              </p>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-800 p-3 sm:p-4 rounded-lg mb-3 bg-gray-800"
                >
                  <div className="text-yellow-400 text-sm sm:text-base">
                    {"⭐".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>

                  <p className="text-gray-300 text-sm mt-1">
                    {r.comment || "-"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>

                  {r.user && (
                    <p className="text-xs text-gray-400 mt-1">
                      by {r.user.email}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-800 h-fit flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-sm">
              Price starts from
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400">
              {event.price === 0
                ? "FREE"
                : `Rp ${event.price.toLocaleString()}`}
            </h2>
          </div>

          <button
            onClick={() => navigate(`/checkout/${eventId}`)}
            className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:opacity-90 text-sm sm:text-base"
          >
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
}