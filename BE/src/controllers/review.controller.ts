import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { createReviewService } from "../services/review.service";

// 🔥 CREATE REVIEW
export const createReviewController = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const userId = (req as any).user?.id; // ✅ ambil id, bukan object
    const eventId = Number(req.body.eventId);

    // 🔍 DEBUG (optional, tapi sangat membantu)
    console.log({
      rating,
      comment,
      userId,
      eventId,
      params: req.params,
      body: req.body,
    });

    // ✅ VALIDASI
    if (rating === undefined || rating === null) {
      return res.status(400).json({
        message: "Rating wajib diisi",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        message: "Event ID tidak valid",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus 1-5",
      });
    }

    // ✅ KIRIM KE SERVICE
    const review = await createReviewService(
      userId,
      eventId,
      rating,
      comment
    );

    return res.status(201).json(review);
  } catch (error: any) {
    console.log("❌ ERROR CREATE REVIEW:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Kamu sudah review event ini",
      });
    }

    return res.status(500).json({
      message: error.message || "Failed create review",
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