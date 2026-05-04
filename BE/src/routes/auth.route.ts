import express from "express";
import { userSignup, userSignin, getProfileController } from "../controllers/auth.controller";
import { createEventController, getListEventController, updateEventController, deleteEventController } from "../controllers/event.controller";
import { becomeOrganizer } from "../controllers/organizer.controller";
import { listTransactionController } from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = express.Router();
// auth
router.post("/register", userSignup);
router.post("/login", userSignin);
router.get("/profile", verifyToken, getProfileController);

// event
router.post("/create-event", verifyToken, createEventController);
router.post("/create-organizer", verifyToken, becomeOrganizer)
router.get("/event-list", getListEventController);
router.put("/event/:id", verifyToken, updateEventController);
router.delete("/event/:id", verifyToken, deleteEventController);

// Transaction
router.get("/transactions", listTransactionController);

export default router; 