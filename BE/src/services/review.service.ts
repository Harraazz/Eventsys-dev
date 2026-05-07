import prisma from "../lib/prisma";



export const createReviewService = async (
  userId: number,
  eventId: number,
  rating: number,
  comment?: string
) => {
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