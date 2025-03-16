import { Request, Response } from "express";
import { UserModel, UserType } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { DesignationModel } from "../models/designation.model";

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

export const addDesignation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const volunteer_id = req.user?.id;
    if (!volunteer_id) {
      res.status(400).json({ error: "Not Authentificated" });
      return;
    }

    const friend_code = req.body.friend_code;
    if (!friend_code) {
      res.status(400).json({ error: "Friend code is required" });
      return;
    }

    const blind_user = await UserModel.getUserByFriendCode(friend_code);
    if (blind_user === null) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    if (blind_user.type !== UserType.blind) {
      res.status(400).json({ error: "User is not visually impaired" });
      return;
    }

    await DesignationModel.addDesignation({
      blind_id: blind_user.id,
      volunteer_id: volunteer_id,
    });

    res.status(200).json({
      message: "Designated visually impaired person added successfully",
    });
  } catch (error) {
    console.error("Designated visually impaired person add error:", error);
    res.status(500).json({
      error: "Server error during Designated visually impaired person added",
    });
  }
};

export const removeDesignation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const volunteer_id = req.user?.id;
    const blind_id = req.body.blind_id;
    if (!volunteer_id) {
      res.status(400).json({ error: "Not Authentificated" });
      return;
    }
    if (!blind_id) {
      res.status(400).json({ error: "Visally impaired person is required" });
      return;
    }

    await DesignationModel.removeDesignation({
      blind_id,
      volunteer_id,
    });

    res.status(200).json({
      message: "Designated visually impaired person removed successfully",
    });
  } catch (error) {
    console.error("Designated visually impaired person remove error:", error);
    res.status(500).json({
      error: "Server error during Designated visually impaired person removed",
    });
  }
};

export const getVisuallyImpairedUsersDesignatedToVolunteer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const volunteer_id = req.user?.id;
    if (!volunteer_id) {
      res.status(400).json({ error: "Not Authentificated" });
      return;
    }

    const blind_users =
      await DesignationModel.getVisuallyImpairedUsersDesignatedToVolunteerId(
        volunteer_id
      );

    res.status(200).json({ blind_users });
  } catch (error) {
    console.error(
      "Get visually impaired users designated to volunteer error:",
      error
    );
    res.status(500).json({
      error:
        "Server error during get visually impaired user designated to volunteer",
    });
  }
};
