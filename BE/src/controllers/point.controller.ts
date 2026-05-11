import { Request, Response } from "express";
import { getPoint } from "../services/point.service";

export const pointController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const points = await getPoint(userId);
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
            });
        }
        return res.status(200).json({
            message: "Point retrieved successfully",
            data: points,
        });
    } catch (error) {

    }
}