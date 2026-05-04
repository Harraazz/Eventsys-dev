import { Request, Response } from "express";
import prisma from "../lib/prisma";

// 🔥 CREATE REVIEW
export const createReviewController = async (req: Request, res: Response) => {
  try {
    const { rating, comment, userId, eventId } = req.body;

    // ✅ VALIDASI
    if (!rating) {
      return res.status(400).json({
        message: "Rating wajib diisi",
      });
    }

    if (!userId || !eventId) {
      return res.status(400).json({
        message: "userId & eventId wajib",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus 1-5",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        userId,
        eventId,
        comment: comment || null, // biar gak error kalau kosong
      },
    });

    console.log("✅ Review created:", review);

    res.status(201).json(review);
  } catch (error: any) {
    console.log("❌ ERROR CREATE REVIEW:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Kamu sudah review event ini",
      });
    }

    res.status(500).json({
      message: "Failed create review",
    });
  }
};

// 🔥 GET REVIEWS BY EVENT
export const getReviewsController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.eventId);

    if (!eventId) {
      return res.status(400).json({
        message: "eventId tidak valid",
      });
    }

    console.log("📥 GET reviews for eventId:", eventId);

    const reviews = await prisma.review.findMany({
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

    console.log("📦 Reviews found:", reviews.length);

    res.json(reviews);
  } catch (error) {
    console.log("❌ ERROR GET REVIEWS:", error);

    res.status(500).json({
      message: "Failed get reviews",
    });
  }
};