import prisma from "../lib/prisma";

  export const createReviewService = async (
    userId: number,
    eventId: number,
    rating: number,
    comment?: string
  ) => {

    const transaction = await prisma.transaction.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (!transaction) {
      throw new Error("You must buy ticket before reviewing this event");
    }

    return prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment: comment ?? "",
      },
    });
  };

export const getReviewsByEvent = async (eventId: number) => {
  return prisma.review.findMany({
    where: { eventId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const getReviewsService = async (eventId: number) => {
  return await prisma.review.findMany({
    where: { eventId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};