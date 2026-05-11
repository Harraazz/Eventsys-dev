import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAccount, becomeOrganizer, getPoint } from "../service/api";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState<any>(null);
    const [point, setPoint] = useState<any>(0);
    const [hasLogin, setHasLogin] = useState<any>(false);
    const [isOpenOrganizer, setIsOpenOrganizer] = useState(false);

    useEffect(() => {
        setHasLogin(!!localStorage.getItem("token"));
        fetchAccount();
        fetchPoint();
    }, []);


    const handleLogout = () => {
    localStorage.removeItem("token");

    setHasLogin(false);

    setAccount(null);

    setPoint(0);

    navigate("/");
};

    const handleLogin = () => {
        navigate("/login");
    };

    const fetchPoint = () => {
        getPoint().then((data) => {
            const totalPoint = data.data?.reduce((acc: number, p: any) => acc + p.amount, 0);
            setPoint(totalPoint);
        });
    }

    const fetchAccount = () => {
        getAccount().then((data) => {
            setAccount(data.data);
        });
    }

    const [form, setForm] = useState({
        name: "",

    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleOrganizer = async () => {
        try {
            await becomeOrganizer({
                name: form.name,
            });

            setIsOpenOrganizer(false);

            fetchAccount(); // 🔥 refresh data biar role berubah

        } catch (error: any) {
            console.error("Error becoming organizer", error);
        }
    };

    const menuCustomer = [
        { name: "Home", path: "/" },
        { name: "History", path: "/transactions" },
    ];

    const menuOrganizer = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Events", path: "/events" },
        { name: "Transactions", path: "/transactions" },
    ];

    const menu =
        account?.role === "ORGANIZER"
            ? menuOrganizer
            : menuCustomer;

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
                hasLogin && account ? (
                    <div>
                        <h3 className="text-yellow-400 font-bold">
                            {account?.email} || {account?.role}
                        </h3>

                        <h3 className="text-yellow-400 font-bold">
                            Your Referral Code: {account?.referralCode}
                        </h3>

                        <h3 className="text-yellow-400 font-bold">
                            Your Balance: {point}
                        </h3>
                    </div>
                ) : (
                    <h3 className="text-yellow-400 font-bold mb-5">
                        Login terlebih dahulu
                    </h3>
                )
            }

                {account?.role === "CUSTOMER" && (
                    <button
                        onClick={() => setIsOpenOrganizer(true)}
                        className="mt-3 w-full bg-yellow-400 text-gray-900 py-1 rounded-lg text-sm font-semibold"
                    >
                        Jadi Organizer
                    </button>
                )}

            {
                hasLogin ? (
                    <button
                        onClick={handleLogout}
                        className="mt-3 mb-4 w-full bg-red-600 text-white py-2 rounded-lg text-sm font-semibold"
                    >
                        Logout
                    </button>
                ) : (
                    <div className="flex flex-col gap-2 mt-3 mb-4">
                        <button
                            onClick={handleLogin}
                            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
                        >
                            Register
                        </button>
                    </div>
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
            {isOpenOrganizer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm">
                        <h2 className="text-yellow-400 text-lg font-bold mb-4">
                            Jadi Organizer
                        </h2>

                        <input
                            name="name"
                            placeholder="Nama Organizer"
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsOpenOrganizer(false)}
                                className="px-4 py-2 bg-gray-700 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleOrganizer}
                                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded font-semibold"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
}