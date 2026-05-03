import { Request, Response } from "express";
import { createTransaction } from "../services/transaction.service";


const transactionController = async (req: Request, res: Response) => {
    try {

        const { userId, eventId, totalPrice, finalPrice } = req.body;

        if (!userId || !eventId || !totalPrice || !finalPrice) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const trx = await createTransaction(userId, eventId, totalPrice, finalPrice);
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