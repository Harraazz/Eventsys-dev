import { useEffect, useState } from "react";
import { getEvents } from "../service/api";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  // PAGINATION
  const [page, setPage] = useState(1);
  const perPage = 6;

  // FETCH
  useEffect(() => {
    getEvents()
      .then((res) => {
        console.log("EVENTS:", res);

        
        const safeData = Array.isArray(res?.data) ? res.data : [];

        setEvents(safeData);
        setFiltered(safeData);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setEvents([]);
        setFiltered([]);
      });
  }, []);

  // DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // FILTER
  useEffect(() => {
    let data = Array.isArray(events) ? [...events] : [];

    if (debouncedSearch) {
      data = data.filter((e) =>
        e.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (category) {
      data = data.filter((e) => e.category === category);
    }

    if (location) {
      data = data.filter((e) =>
        e.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFiltered(data);
    setPage(1);
  }, [debouncedSearch, category, location, events]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = Array.isArray(filtered)
    ? filtered.slice((page - 1) * perPage, page * perPage)
    : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-yellow-400">
          🎟️ Events
        </h1>

        
        <input
          type="text"
          placeholder="Search events..."
          className="w-full p-3 mb-4 rounded-xl bg-gray-800 text-white outline-none border border-gray-800 focus:border-yellow-400 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            placeholder="Filter location"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white outline-none border border-gray-800 focus:border-yellow-400 transition"
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="w-full md:w-56 p-3 rounded-xl bg-gray-800 text-white outline-none border border-gray-800 focus:border-yellow-400 transition cursor-pointer"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Category</option>
            <option value="music">Music</option>
            <option value="fanmeet">Fanmeet</option>
          </select>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginated.length > 0 ? (
            paginated.map((e: any) => (
              <EventCard key={e.id} event={e} />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No events found
            </p>
          )}
        </div>

        
        <div className="flex justify-center items-center mt-8 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm text-gray-400">
            {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}