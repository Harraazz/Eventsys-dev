import prisma from "../lib/prisma";


export const createTransaction = async (
  userId: number,
  eventId: number,
  quantity: number,
  couponId?: number,
  usePoint?: boolean
) => {
  return await prisma.$transaction(async (tx) => {

    // 1. ambil event
    const event = await tx.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new Error("Event not found");

    // 2. cek seat
    if (event.availableSeats < quantity) {
      throw new Error("Not enough seats");
    }

    // 3. hitung harga
    let totalPrice = event.price * quantity;
    let finalPrice = totalPrice;

    // 4. apply coupon
    if (couponId) {
      const coupon = await tx.coupon.findFirst({
        where: {
          id: couponId,
          userId,
          isUsed: false,
          expiresAt: {
            gte: new Date()
          }
        },
      });

      if (!coupon) throw new Error("Invalid coupon");

      finalPrice -= (finalPrice * coupon.discount) / 100;

      await tx.coupon.update({
        where: { id: couponId },
        data: { isUsed: true },
      });
    }

    // 5. apply point
    if (usePoint) {
      const points = await tx.point.findMany({
        where: { userId },
      });

      const totalPoint = points.reduce((sum, p) => sum + p.amount, 0);

      const usedPoint = Math.min(totalPoint, finalPrice);

      finalPrice -= usedPoint;

      await tx.point.deleteMany({
        where: { userId },
      });
    }

    // 6. update seat 🔥
    await tx.event.update({
      where: { id: eventId },
      data: {
        availableSeats: event.availableSeats - quantity,
      },
    });

    // 7. create transaction
    const trx = await tx.transaction.create({
      data: {
        userId,
        eventId,
        quantity,
        totalPrice,
        finalPrice,
      },
    });

    return trx;
  });
};

export const deleteTransaction = async (transactionId: number) => {
  return await prisma.$transaction(async (tx) => {
    const trx = await tx.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!trx) throw new Error("Transaction not found");


    await tx.transaction.delete({
      where: { id: transactionId },
    });

    return trx;
  });
};

export const listTransaction = async (userId: number) => {
  return await prisma.transaction.findMany({
    where: {
      event: {
        organizer: {
          userId: userId,
        },
      },
    },
    include: {
      user: true,
      event: true,
    },
  });
};