import { Request, Response } from "express";
import { createReviewService,  getReviewsService } from "../services/review.service";


export const createReviewController = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const userId = (req as any).user?.id; 
    const eventId = Number(req.body.eventId);

    if (rating === undefined || rating === null) {
      return res.status(400).json({
        message: "Rating is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        message: "Event ID is not valid",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating should be between 1-5",
      });
    }

    const review = await createReviewService(
      userId,
      eventId,
      rating,
      comment
    );

    return res.status(201).json(review);
  } catch (error: any) {

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "You have already reviewed this event",
      });
    }

    return res.status(500).json({
      message: error.message || "Failed to create review",
    });
  }
};


export const getReviewsController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.eventId);

    if (!eventId) {
      return res.status(400).json({
        message: "eventId is not valid",
      });
    }

    const reviews = await getReviewsService(eventId);

    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Failed get reviews",
    });
  }
};