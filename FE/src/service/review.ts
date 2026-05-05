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

export const createReviewService = async (
    data: { eventId: number; rating: number; comment: string }
) => {
    const res = await api.post(`/reviews`, data); // ✅ TANPA /:id
    return res.data;
};
export const getReviewsByEventService = async (eventId: number) => {
    const res = await api.get(`/review/${eventId}`);
    return res.data;
};