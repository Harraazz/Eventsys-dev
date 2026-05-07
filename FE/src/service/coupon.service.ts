import api from "./api";

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