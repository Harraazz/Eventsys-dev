import { useState } from "react";
import { createReviewService } from "../service/api";

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

      await createReviewService({
        eventId,
        rating,
        comment,
      });

      alert("Review submitted!");

      if (onSuccess) onSuccess();

      setRating(0);
      setComment("");

    } catch (err: any) {
      console.error(err);

      const message =
        err.response?.data?.message || "Failed create review";

      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-xl mt-6 text-white"
    >
      
      <h2 className="font-bold text-base sm:text-lg text-yellow-400 mb-4">
        Leave a Review
      </h2>

      <div className="flex text-2xl sm:text-3xl mb-2">
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
      
      <p className="text-xs sm:text-sm mb-3 text-gray-400">
        {getLabel()}
      </p>

      <textarea
        placeholder="Write your experience..."
        className="p-2 rounded bg-gray-800 text-white w-full mb-3 text-sm sm:text-base"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading}
        className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 text-sm sm:text-base"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}