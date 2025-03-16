import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { StreamChat } from "stream-chat";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY || "",
  process.env.STREAM_API_SECRET || ""
);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      res.status(400).json({ error: "Email, password and type are required" });
      return;
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.create(email, hashedPassword, type);

    const jwtToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    await streamClient.upsertUser({
      id: newUser.id.toString(),
      email,
      name: newUser.email,
    });

    const streamToken = streamClient.createToken(newUser.id.toString());

    res.status(201).json({
      message: "User registered successfully",
      jwtToken,
      streamToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        type: newUser.type,
        languages: newUser.languages || [],
        friendCode: newUser.friend_code,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const streamToken = streamClient.createToken(user.id.toString());

    res.status(200).json({
      message: "Login successful",
      jwtToken,
      streamToken,
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        languages: user.languages || [],
        friendCode: user.friend_code,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};
