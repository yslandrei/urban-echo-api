import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  sendToDesignatedVolunteers,
  sendToRandomVolunteers,
} from "../controllers/notification.controller";

const router = express.Router();

router.post(
  "/send-to-random-volunteers",
  authenticateToken,
  sendToRandomVolunteers
);

router.post(
  "/send-to-designated-volunteers",
  authenticateToken,
  sendToDesignatedVolunteers
);

export default router;
