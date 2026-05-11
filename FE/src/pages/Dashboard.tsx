import { useEffect, useState } from "react";
import { getDashboard } from "../service/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";


export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [filter, setFilter] = useState("day");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getDashboard();
        setData(res);
    };

    if (!data) return <p>Loading...</p>;

    const chartData = data.transactions.map((t: any) => ({
        date: new Date(t.createdAt).toLocaleDateString(),
        total: t.finalPrice,
    }));

    const grouped = {};

    data.transactions.forEach((t: any) => {
        const date = new Date(t.createdAt);

        let key;
        if (filter === "day") key = date.toLocaleDateString();
        if (filter === "month") key = date.getMonth() + 1;
        if (filter === "year") key = date.getFullYear();

        grouped[key] = (grouped[key] || 0) + t.finalPrice;
    });



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard Organizer</h1>

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 shadow rounded">
                    <p>Total Event</p>
                    <h2 className="text-xl">{data.totalEvents}</h2>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p>Total Transaksi</p>
                    <h2 className="text-xl">{data.totalTransactions}</h2>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p>Total Revenue</p>
                    <h2 className="text-xl">Rp {data.totalRevenue}</h2>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p>Total Attendees</p>
                    <h2 className="text-xl">{data.totalAttendees}</h2>
                </div>
            </div>

            <div className="mt-10 bg-white p-6 shadow rounded">
                <h2 className="text-xl font-bold mb-4">Grafik Penjualan</h2>
                <LineChart width={600} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        strokeWidth={2}
                    />
                </LineChart>
                <select onChange={(e) => setFilter(e.target.value)}>
                    <option value="day">Per Hari</option>
                    <option value="month">Per Bulan</option>
                    <option value="year">Per Tahun</option>
                </select>
            </div>

        </div>
    );
}