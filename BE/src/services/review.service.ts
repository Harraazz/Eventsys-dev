import prisma from "../lib/prisma";

// 🔥 CREATE REVIEW
export const createReviewService = async (data: {
  userId: number;
  eventId: number;
  rating: number;
  comment?: string;
}) => {
  return prisma.review.create({
    data: {
      userId: data.userId,
      eventId: data.eventId,
      rating: data.rating,
      comment: data.comment || "",
    },
  });
};

// 🔥 GET REVIEWS BY EVENT
export const getReviewsByEvent = async (eventId: number) => {
  return prisma.review.findMany({
    where: { eventId },
    orderBy: { createdAt: "desc" },

    // 🔥 BONUS: sekalian ambil user (biar nanti bisa nampilin nama)
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