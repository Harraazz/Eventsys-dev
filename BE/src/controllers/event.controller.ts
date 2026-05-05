import { Request, Response } from "express";
import { createEvent, getListEvent, updateEvent, deleteEvent } from "../services/event.service";

import prisma from "../lib/prisma";

export const createEventController = async (req: Request, res: Response) => {
    try {
        const { title, description, price, date, totalSeats } = req.body;

        if (!title || !description || !price || !date || !totalSeats) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // 🔥 ambil user dari JWT (nanti middleware)
        const userId = (req as any).user.id;

        // 🔥 cari organizer milik user
        const organizer = await prisma.organizer.findFirst({
            where: { userId },
        });

        if (!organizer) {
            return res.status(403).json({
                message: "You are not an organizer",
            });
        }

        const event = await createEvent(
            title,
            description,
            price,
            date,
            totalSeats,
            organizer.id // ✅ aman
        );

        return res.status(201).json({
            message: "Event created successfully",
            data: event,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getListEventController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const role = (req as any).user.role;

        const events = await getListEvent(userId, role);

        return res.json({
            data: events,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

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
        const eventId = Number(req.params.id);

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