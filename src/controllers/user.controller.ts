import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const setLanguages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, languages } = req.body;

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
