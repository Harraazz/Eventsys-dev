import { useEffect, useState } from "react";
import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from "../service/api.transaction";
import { getEvents, getAccount } from "../service/api";

export default function Events() {
    const [account, setAccount] = useState<any>(null);
    const [eventList, setEventList] = useState<any[]>([]);
    const [transactions, setTransactions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        fetchEventList();
        fetchTransactionList();
        fetchAccount();
    }, []);

    const fetchEventList = () => {
        getEvents().then((res) => {
            setEventList(res.data);
        });
    };

    const fetchTransactionList = () => {
        getTransactions().then((res) => {
            setTransactions(res.data);
        });
    };

    const fetchAccount = () => {
        getAccount().then((res) => {
            setAccount(res.data);
        });
    };

    const handleDelete = async (id: number) => {
        try {
            if (confirm("Are you sure to delete this event?")) {
                await deleteTransaction(id);
                fetchTransactionList();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (tx: any) => {
        setIsEdit(true);
        setIsOpen(true);
        setSelectedId(tx.id);

        setForm({
            eventId: tx.eventId,
            quantity: tx.quantity,
        });
    };


    const [form, setForm] = useState({
        eventId: "",
        quantity: "",
    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // const handleCreate = () => {
    //     setIsEdit(false);
    //     setForm({
    //         eventId: "",
    //         quantity: "",
    //     });
    //     setIsOpen(true);
    // };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await updateTransaction(selectedId, {
                    eventId: Number(form.eventId),
                    quantity: Number(form.quantity),
                });
            } else {
                await createTransaction({
                    eventId: Number(form.eventId),
                    quantity: Number(form.quantity),
                });
            }

            setIsOpen(false);
            fetchEventList();
        } catch (err) {
            console.log(err);
            alert("Error bro");
        }
    };

    return (
        <div className="text-white">
            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yellow-400">
                    {account?.role === "CUSTOMER" ? "Purchase History" : "Transactions"}
                </h1>

                {/* <button
                    onClick={handleCreate}
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
                >
                    + Transactions
                </button> */}
            </div>

            {/* 🔥 EMPTY STATE */}
            {transactions.length === 0 ? (
                <p className="text-gray-400">No Transactions available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden">
                        <thead className="bg-gray-800 text-yellow-400 text-sm">
                            <tr>
                                <th className="p-3 text-left">Event</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Quantity</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Date</th>
                                {account?.role === "ORGANIZER" && (
                                    <th className="p-3 text-left">User</th>
                                )}
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((tx: any) => (
                                <tr
                                    key={tx.id}
                                    className="border-b border-gray-800 hover:bg-gray-800 text-sm"
                                >
                                    {/* 🔥 ambil dari relation */}
                                    <td className="p-3">
                                        {tx.event?.title}
                                    </td>

                                    <td className="p-3">
                                        Rp {tx.event?.price}
                                    </td>

                                    <td className="p-3">
                                        {tx.quantity}
                                    </td>

                                    <td className="p-3">
                                        Rp {tx.totalPrice}
                                    </td>

                                    <td className="p-3">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>

                                    {account?.role === "ORGANIZER" && (
                                        <td className="p-3">{tx.user?.email}</td>
                                    )}

                                    <td className="p-3 flex gap-2 justify-center">
                                        {account?.role === "ORGANIZER" && (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(tx)}
                                                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-xs"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(tx.id)}
                                                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-yellow-400 text-xl font-bold mb-4">
                            Create Event
                        </h2>

                        <div className="flex flex-col gap-3">
                            <select
                                name="eventId"
                                value={form.eventId}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-800 text-white"
                            >
                                <option value="">Select Event</option>
                                {eventList.map((ev) => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.title} (Rp {ev.price})
                                    </option>
                                ))}
                            </select>
                            <input
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Quantity"
                                className="p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-700 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded font-semibold"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

