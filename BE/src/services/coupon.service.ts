import prisma from "../lib/prisma";

export const getCouponsByUser = async (userId: number) => {
  return await prisma.coupon.findMany({
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
};