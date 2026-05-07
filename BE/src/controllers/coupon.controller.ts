import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getUserCoupons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const coupons = await prisma.coupon.findMany({
      where: {
        userId,
        isUsed: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        expiresAt: "asc",
      },
    });

    return res.json({
      data: coupons,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch coupons",
    });
  }
};