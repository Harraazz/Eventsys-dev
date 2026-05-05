import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Event";
import Transactions from "./pages/Transaction";
import Users from "./pages/User";
import MainLayout from "./layout/Navlayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <BrowserRouter>
      \
      <Routes>
        {/* ❌ TANPA NAVBAR */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✔ PAKAI NAVBAR */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;