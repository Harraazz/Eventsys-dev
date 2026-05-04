import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Event";
import Transactions from "./pages/Transaction";
import Users from "./pages/User";
import MainLayout from "./layout/Navlayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";


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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;