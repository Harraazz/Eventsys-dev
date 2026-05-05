import { useState } from "react";

export default function EventReview({
  eventId,
  onSuccess,
}: {
  eventId: number;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const getLabel = () => {
    switch (rating) {
      case 1: return "Bad";
      case 2: return "Poor";
      case 3: return "Fair";
      case 4: return "Good";
      case 5: return "Excellent!!";
      default: return "Unrated";
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select rating");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // 🔥 WAJIB

      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 INI KUNCI
        },
        body: JSON.stringify({
          eventId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.message);
        return;
      }

      alert("🎉 Review berhasil dikirim!");

      if (onSuccess) onSuccess();

      setRating(0);
      setComment("");

    } catch (err: any) {
      console.error(err);
      alert("Failed connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mt-6">
      <h2 className="font-bold mb-3">Leave a Review</h2>

      <div className="flex text-3xl mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className="px-1 hover:scale-110 transition"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>

      <p className="text-sm mb-3 text-gray-600">{getLabel()}</p>

      <textarea
        placeholder="Write your experience..."
        className="border p-2 w-full mb-3 rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}