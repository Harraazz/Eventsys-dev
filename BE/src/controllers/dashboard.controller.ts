// controllers/dashboard.controller.ts
import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";

export const dashboardController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const data = await getDashboardStats(userId);

        res.json(data);
    } catch (err: any) {
        res.status(400).json({
            message: err.message,
        });
    }
};