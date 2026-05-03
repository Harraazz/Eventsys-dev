import axios from "axios";
const BASE_URL = "http://localhost:3000/api";
const api = axios.create({
    baseURL: BASE_URL,
});

export const getEvents = async () => {
    const res = await api.get("/event-list");
    return res.data;
};

export const createEvent = async (data: any) => {
    // const token = localStorage.getItem("token");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Ik9SR0FOSVpFUiIsImlhdCI6MTc3NzgwMzc0NiwiZXhwIjoxNzc3ODkwMTQ2fQ.k4Ll7eicXzV81xfieCjxFcsoz8CeQ4TfZkjcmHmhjg4"

    const res = await axios.post(`${BASE_URL}/create-event`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getAccount = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Ik9SR0FOSVpFUiIsImlhdCI6MTc3NzgwMzc0NiwiZXhwIjoxNzc3ODkwMTQ2fQ.k4Ll7eicXzV81xfieCjxFcsoz8CeQ4TfZkjcmHmhjg4"
    const res = await axios.get(`${BASE_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}