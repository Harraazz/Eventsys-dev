import { Request, Response } from "express";
import { createCheckout } from "../services/checkout.service";

export const createCheckoutController = async (
  req: Request,
  res: Response
) => {
  try {
    const { eventId, quantity, couponId, usePoint } = req.body;
    const userId = (req as any).user.id;

    //  VALIDASI
    if (!eventId || !quantity) {
      return res.status(400).json({
        message: "eventId & quantity required",
      });
    }

    const trx = await createCheckout(
      userId,
      Number(eventId),
      Number(quantity),
      couponId ? Number(couponId) : undefined,
      usePoint || false
    );

    return res.status(201).json({
      message: "Checkout successful",
      data: trx,
    });
  } catch (error: any) {
    console.log("CHECKOUT ERROR:", error);

    return res.status(400).json({
      message: error.message || "Internal server error",
    });
  }
};