import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";
import { initializeWebSocket } from "./utils/websocket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/notification", notificationRoutes);

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
initializeWebSocket(server);
