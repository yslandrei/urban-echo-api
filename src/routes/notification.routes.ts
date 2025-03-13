import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { sendToRandomVolunteers } from "../controllers/notification.controller";

const router = express.Router();

router.post(
  "/sendToRandomVolunteers",
  authenticateToken,
  sendToRandomVolunteers
);

export default router;
