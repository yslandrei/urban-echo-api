import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  addDesignation,
  getVisuallyImpairedUsersDesignatedToVolunteer,
  removeDesignation,
  setLanguages,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/set-languages", authenticateToken, setLanguages);

router.post("/add-designation", authenticateToken, addDesignation);

router.delete("/remove-designation", authenticateToken, removeDesignation);

router.get(
  "/get-designated",
  authenticateToken,
  getVisuallyImpairedUsersDesignatedToVolunteer
);

export default router;
