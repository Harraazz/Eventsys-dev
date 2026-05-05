import { Request, Response } from "express";
import { createEvent, getListEvent, updateEvent, deleteEvent } from "../services/event.service";

import prisma from "../lib/prisma";

export const createEventController = async (req: Request, res: Response) => {
  try {
    const { title, description, price, date, totalSeats, location, category } = req.body;

    // ✅ VALIDASI (fix price + field tambahan)
    if (
      !title ||
      !description ||
      price === undefined ||
      !date ||
      !totalSeats ||
      !location ||
      !category
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ AMANIN USER
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = user.id;

    // 🔥 cari organizer milik user
    const organizer = await prisma.organizer.findFirst({
      where: { userId },
    });

    if (!organizer) {
      return res.status(403).json({
        message: "You are not an organizer",
      });
    }

    // ✅ KIRIM KE SERVICE (tambah param baru)
    const event = await createEvent(
      title,
      description,
      price,
      date,
      totalSeats,
      organizer.id,
      location,   // 🔥 tambah ini
      category    // 🔥 tambah ini
    );

    return res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error: any) {
    console.log("❌ CREATE EVENT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Internal server error", // 🔥 biar keliatan error asli
    });
  }
};

export const getListEventController = async (req: Request, res: Response) => {
    try {
        const events = await getListEvent();
        return res.status(200).json({
            message: "Events fetched successfully",
            data: events,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateEventController = async (req: Request, res: Response) => {
    try {
        const { title, description, price, date, totalSeats } = req.body;
        const eventId = Number(req.params.id);
        const userId = (req as any).user.id;

        const event = await updateEvent(
            title,
            description,
            price,
            date,
            totalSeats,
            eventId,
            userId
        );

        return res.status(200).json({
            message: "Event updated successfully",
            data: event,
        });
    } catch (error: any) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


export const deleteEventController = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required",
            });
        }

        const event = await deleteEvent(eventId);
        return res.status(200).json({
            message: "Event deleted successfully",
            data: event,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Event fetched successfully",
      data: event, // ✅ konsisten
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};