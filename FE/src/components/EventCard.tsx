import { useNavigate } from "react-router-dom";

export default function EventCard({ event }: any) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-xl hover:scale-105 transition duration-300">
      <h2 className="text-xl font-bold mb-2">{event.title}</h2>

      <p className="text-gray-500 mb-1">📍 {event.location}</p>

      <p className="text-green-600 font-semibold mb-3">
       
        Rp {event.price ? event.price.toLocaleString("id-ID") : "0"}
      </p>

      <button
        onClick={() => navigate(`/events/${event.id}`)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
      >
        View Detail
      </button>
    </div>
  );
}