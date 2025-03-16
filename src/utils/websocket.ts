import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import http from "http";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

let clients: { [userId: string]: Socket } = {};

interface NotificationData {
  title: string;
  callId: string;
}

export const initializeWebSocket = (server: http.Server) => {
  const io = new Server(server);

  io.on("connection", (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("register", (token: string) => {
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as {
          id: string;
          email: string;
        };
      } catch (error) {
        console.error(`Client ${socket.id} sent invalid token: ${token}`);
        socket.disconnect();
        return;
      }
      console.log(`Client ${socket.id} registered with userId: ${decoded.id}`);
      clients[decoded.id] = socket;
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      for (let userId in clients) {
        if (clients[userId].id === socket.id) {
          delete clients[userId];
          break;
        }
      }
    });
  });

  return io;
};

export const sendNotifications = (
  userIds: string[],
  notificationData: NotificationData
) => {
  for (let i in userIds) {
    const clientSocket = clients[userIds[i]];
    if (clientSocket) {
      clientSocket.emit("notification", notificationData);
    }
  }
};
