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

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // ✅ FIXED FETCH
  useEffect(() => {
    getEvents()
      .then((res) => {
        console.log("EVENTS:", res);

        // 🔥 ambil dari res.data (karena backend pakai { data: [] })
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

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // filter logic
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

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = Array.isArray(filtered)
    ? filtered.slice((page - 1) * perPage, page * perPage)
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Events</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search events..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Filter location"
          className="p-2 border rounded"
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Category</option>
          <option value="music">Music</option>
          <option value="fanmeet">Fanmeet</option>
        </select>
      </div>

      {/* EVENTS */}
      <div className="grid md:grid-cols-3 gap-6">
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

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}