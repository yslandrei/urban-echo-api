import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const setLanguages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { languages } = req.body;
    const id = req.user?.id;
    if (!id) {
      res.status(400).json({ error: "Not Authentificated" });
      return;
    }

    if (!languages) {
      res.status(400).json({ error: "Languages are required" });
      return;
    }

    await UserModel.updateLanguages(id, languages);

    res.status(200).json({ message: "Languages updated successfully" });
  } catch (error) {
    console.error("Set languages error:", error);
    res.status(500).json({ error: "Server error during set languages" });
  }
};
