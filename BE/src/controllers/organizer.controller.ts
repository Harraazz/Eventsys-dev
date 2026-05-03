import { Request, Response } from "express";
import { createOrganizer } from "../services/organizer.service";

export const becomeOrganizer = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || 1;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Organizer name is required",
            });
        }

        const organizer = await createOrganizer(userId, name);

        return res.status(201).json({
            message: "You are now an organizer",
            data: organizer,
        });
    } catch (error: any) {
        return res.status(400).json({
            message: error.message,
        });
    }
};