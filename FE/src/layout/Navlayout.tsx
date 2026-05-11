import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Navlayout() {
    return (
        <>
            <Navbar />
            <div className="md:ml-64 p-4">
                <Outlet />
            </div>
        </>
    );
}