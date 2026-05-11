import prisma from "../lib/prisma";

export const createCheckout = async (
  userId: number,
  eventId: number,
  quantity: number,
  couponId?: number,
  usePoint?: boolean
) => {
  return await prisma.$transaction(async (tx) => {
    
    const event = await tx.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.availableSeats < quantity) {
      throw new Error("Seat not available");
    }

    let totalPrice = event.price * quantity;
    let finalPrice = totalPrice;

    if (couponId) {
      const coupon = await tx.coupon.findFirst({
        where: {
          id: couponId,
          userId,
          isUsed: false,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!coupon) {
        throw new Error("Coupon not valid");
      }

      finalPrice -= (finalPrice * coupon.discount) / 100;

      await tx.coupon.update({
        where: { id: couponId },
        data: {
          isUsed: true,
        },
      });
    }

    
    if (usePoint) {
      const points = await tx.point.findMany({
        where: {
          userId,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      const totalPoint = points.reduce((sum, p) => sum + p.amount, 0);

      const usedPoint = Math.min(totalPoint, finalPrice);

      finalPrice -= usedPoint;

      await tx.point.deleteMany({
        where: { userId },
      });
    }
    
    const trx = await tx.transaction.create({
      data: {
        userId,
        eventId,
        quantity,
        totalPrice,
        finalPrice,
      },
    });

    await tx.event.update({
      where: { id: eventId },
      data: {
        availableSeats: {
          decrement: quantity,
        },
      },
    });

    return trx;
  });
};