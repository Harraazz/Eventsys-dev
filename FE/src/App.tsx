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
import Checkout from "./pages/Checkout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/checkout/:id" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;