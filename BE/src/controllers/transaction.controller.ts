import { Request, Response } from "express";
import { createTransaction, getTransaction } from "../services/transaction.service";


export const createTransactionController = async (req: Request, res: Response) => {
    try {

        const { eventId, quantity } = req.body;
        const userId = (req as any).user.id;

        if (!eventId || !quantity) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const trx = await createTransaction(userId, eventId, quantity);
        return res.status(201).json({
            message: "Transaction created successfully",
            data: trx
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getListTransaction = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const trx = await getTransaction(userId);
        return res.status(200).json({
            message: "Transaction list fetched successfully",
            data: trx
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}