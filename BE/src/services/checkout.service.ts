import prisma from "../lib/prisma";

export const createCheckout = async (
  userId: number,
  eventId: number,
  quantity: number,
  couponId?: number,
  usePoint?: boolean
) => {
  return await prisma.$transaction(async (tx) => {
    // GET EVENT
    const event = await tx.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // CEK SEAT
    if (event.availableSeats < quantity) {
      throw new Error("Seat not available");
    }

    
    let totalPrice = event.price * quantity;
    let finalPrice = totalPrice;

    // APPLY COUPON
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

      // DISCOUNT
      finalPrice -= (finalPrice * coupon.discount) / 100;

      // COUPON USED
      await tx.coupon.update({
        where: { id: couponId },
        data: {
          isUsed: true,
        },
      });
    }

    // APPLY POINT
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

    // CREATE TRANSACTION
    const trx = await tx.transaction.create({
      data: {
        userId,
        eventId,
        quantity,
        totalPrice,
        finalPrice,
      },
    });

    // REDUCE SEAT
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