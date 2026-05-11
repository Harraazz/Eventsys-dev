import { useNavigate } from "react-router-dom";

export default function EventCard({ event }: any) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 hover:bg-gray-800 transition duration-300 cursor-pointer flex flex-col justify-between">
      
      
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2">
          {event.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-400 mb-1">
          📍 {event.location}
        </p>

        <p className="text-yellow-400 font-semibold mb-3 text-sm sm:text-base">
          Rp {event.price ? event.price.toLocaleString("id-ID") : "0"}
        </p>
      </div>

     
      <button
        onClick={() => navigate(`/events/${event.id}`)}
        className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:opacity-90 text-sm sm:text-base"
      >
        View Detail
      </button>
    </div>
  );
}