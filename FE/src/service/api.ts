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


export const getEventById = async (eventId: number) => {
    const res = await api.get(`/event/${eventId}`);
    return res.data.data;
};

export const getPoint = async () => {
    const res = await api.get(`/point`);
    return res.data;
}

export const getDashboard = async () => {
    const res = await api.get("/dashboard");
    return res.data;
};

export const getMyCoupons = async () => {
  try {
    const res = await api.get("/coupon/me");

    return res.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed get coupons"
    );
  }
};

export const createReviewService = async (
    data: { eventId: number; rating: number; comment: string }
) => {
    const res = await api.post(`/reviews`, data);
    return res.data;
};

export const getReviewsByEventService = async (eventId: number) => {
    const res = await api.get(`/reviews/${eventId}`);
    return res.data;
};

export const createCheckout = async ({
  eventId,
  quantity,
  couponId,
  usePoint,
}: {
  eventId: number;
  quantity: number;
  couponId?: number;
  usePoint?: boolean;
}) => {
  try {
    const res = await api.post("/checkout", {
      eventId,
      quantity,
      ...(couponId && { couponId }),
      ...(usePoint && { usePoint }),
    });

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Checkout gagal"
    );
  }
};


