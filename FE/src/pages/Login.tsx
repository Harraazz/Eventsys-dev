import { useState } from "react";
import { login } from "../service/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        try {
            const res = await login(form);

            // 🔥 simpan token
            localStorage.setItem("token", res.data.token);

            // redirect ke dashboard
            navigate("/");
        } catch (err) {
            console.log(err);
            alert("Login gagal");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm">
                <h1 className="text-yellow-400 text-xl font-bold mb-4">
                    Login
                </h1>

                <div className="flex flex-col gap-3">
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="p-2 rounded bg-gray-800"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="p-2 rounded bg-gray-800"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="mt-4 w-full bg-yellow-400 text-gray-900 py-2 rounded font-semibold"
                >
                    Login
                </button>
            </div>
        </div>
    );
}