import { Request, Response } from "express";
import { getCouponsByUser } from "../services/coupon.service";

export const getUserCoupons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const coupons = await getCouponsByUser(userId);

    return res.json({
      data: coupons,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch coupons",
    });
  }
};