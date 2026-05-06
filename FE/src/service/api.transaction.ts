import axios from "axios";
const BASE_URL = "http://localhost:3000/api";
const api = axios.create({
    baseURL: BASE_URL,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export const getTransactions = async () => {
    const res = await api.get("/transaction-list");
    return res.data;
};

export const updateTransaction = async (id: number, data: any) => {
    const res = await api.put(`/Transactions/${id}`, data);
    return res.data;
};

export const createTransaction = async (data: any) => {
    const res = await api.post("/Transactions", data);
    return res.data;
};

export const deleteTransaction = async (id: number) => {
    const res = await api.delete(`/Transactions/${id}`);
    return res.data;
};