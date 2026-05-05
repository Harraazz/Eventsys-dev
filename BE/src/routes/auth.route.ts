import express from "express";
import { userSignup, userSignin, getProfileController } from "../controllers/auth.controller";
import { createEventController, getListEventController, updateEventController, deleteEventController } from "../controllers/event.controller";
import { becomeOrganizer } from "../controllers/organizer.controller";
import { pointController } from "../controllers/point.controller";
import { createTransactionController, getListTransaction } from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = express.Router();
// auth
router.post("/register", userSignup);
router.post("/login", userSignin);
router.get("/profile", verifyToken, getProfileController);
router.get("/point", verifyToken, pointController);

// event
router.post("/create-event", verifyToken, createEventController);
router.post("/create-organizer", verifyToken, becomeOrganizer)
router.get("/event-list", verifyToken, getListEventController);
router.put("/event/:id", verifyToken, updateEventController);
router.delete("/event/:id", verifyToken, deleteEventController);

// Transaction
router.get("/transactions-list", verifyToken, getListTransaction);
// router.put("/transaction/:id", verifyToken, updateTransactionController);
router.post("/transaction", verifyToken, createTransactionController);
// router.delete("/transaction/:id", verifyToken, deleteTransactionController);

export default router; 