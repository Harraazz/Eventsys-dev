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

export const getEvents = async () => {
    const res = await api.get("/event-list");
    return res.data;
};

export const createEvent = async (data: any) => {
    const token = localStorage.getItem("token");
    const res = await api.post("/create-event", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const updateEvent = async (id: number, data: any) => {
    const res = await api.put(`/event/${id}`, data);
    return res.data;
};

export const getAccount = async () => {
    const res = await api.get(`/profile`);
    return res.data;
}

export const login = async (data: any) => {
    const res = await api.post("/login", data);
    return res.data;
};

export const register = async (data: any) => {
    const res = await api.post("/register", data);
    return res.data;
};


export const becomeOrganizer = async (data: any) => {
    const res = await api.post("/create-organizer", data);
    return res.data;
};

export const deleteEvent = async (id: number) => {
    const res = await api.delete(`/event/${id}`);
    return res.data;
}


export const getEventById = async (id: number) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};