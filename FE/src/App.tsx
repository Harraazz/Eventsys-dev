import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Event";
import Transactions from "./pages/Transaction";
import Users from "./pages/User";
import Navbar from "./components/Navbar";
import "./index.css";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="md:ml-64 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;