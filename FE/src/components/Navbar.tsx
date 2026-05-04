import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAccount } from "../service/api";

export default function Navbar() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState<any>(null);

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = () => {
        getAccount().then((data) => {
            setAccount(data.data);
        });
    }

    console.log(account);
    const menu = [
        { name: "Dashboard", path: "/" },
        { name: "Events", path: "/events" },
        { name: "Transactions", path: "/transactions" },
        { name: "Users", path: "/users" },
    ];

    return (
        <>
            {/* 🔥 Topbar (mobile) */}
            <div className="md:hidden flex items-center justify-between bg-gray-900 p-4">
                <button
                    onClick={() => setOpen(!open)}
                    className="text-yellow-400 text-2xl"
                >
                    ☰
                </button>
                <h1 className="text-yellow-400 font-bold">LiteRate</h1>
            </div>

            {/* 🔥 Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-900 p-5 z-50
                    transform ${open ? "translate-x-0" : "-translate-x-full"}
                    transition-transform duration-300
                    md:translate-x-0
                    `}
            >
                <h2 className="text-yellow-400 text-xl font-bold mb-6">
                    LiteRate
                </h2>
                {
                    account === null ? (
                        <h3 className="text-yellow-400 font-bold mb-5">Login terlebih dahulu</h3>
                    ) : (
                        <h3 className="text-yellow-400 font-bold">{account?.email}||{account?.role}</h3>
                    )
                }

                <div className="flex flex-col gap-2">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={`
                                    px-4 py-2 rounded-lg font-medium
                                    ${location.pathname === item.path
                                    ? "bg-yellow-400 text-gray-900"
                                    : "text-white hover:bg-gray-800"
                                }
                                `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}