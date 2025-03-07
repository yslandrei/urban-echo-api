import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { setLanguages } from "../controllers/user.controller";

const router = express.Router();

router.post("/setLanguages", authenticateToken, setLanguages);

export default router;
