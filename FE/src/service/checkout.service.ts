import api from "./api";

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