import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendNotifications } from "../utils/websocket";
import { cp } from "fs";
import { DesignationModel } from "../models/designation.model";

export const sendToRandomVolunteers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.user?.id;
    if (!id) {
      res.status(400).json({ error: "Not Authentificated" });
      return;
    }

    const languages = await UserModel.getLanguages(id);

    if (!languages) {
      res.status(400).json({ error: "Languages need to be set" });
      return;
    }

    let languagesSearchString = "";
    languages.forEach((language) => {
      languagesSearchString += `'${language}',`;
    });
    languagesSearchString = languagesSearchString.slice(0, -1);
    const availableVolunteersIds = await UserModel.getVolunteersIdByLanguages(
      languagesSearchString
    );

    sendNotifications(availableVolunteersIds, {
      title: "A visually impaired person needs help",
      callId: id,
    });

    res.status(200).json({ message: "Notifications Sent" });
  } catch (error) {
    res.status(500).json({
      error: "Server error during send notifications to random volunteers",
    });
  }
};

export const sendToDesignatedVolunteers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.user?.id;
    if (!id) {
      res.status(400).json({ error: "Not Authentificated" });
      return;
    }

    const availableVolunteersIds =
      await DesignationModel.getDesignatedVolunteersIdByBlindId(id);

    const blind_user = await UserModel.findById(id);

    sendNotifications(availableVolunteersIds, {
      title: `${blind_user?.email} needs help`,
      callId: id,
    });

    res.status(200).json({ message: "Notifications Sent" });
  } catch (error) {
    res.status(500).json({
      error: "Server error during send notifications to designated volunteers",
    });
  }
};
