import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createChatRouter } from "./chat/routes.js";
import { registerChatSockets } from "./chat/socket.js";

const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bumblearn-api" });
});

app.get("/api", (_req, res) => {
  res.json({
    name: "Bumblearn API",
    version: "0.2.0",
    status: "chat-enabled",
  });
});

app.use("/api", createChatRouter());
registerChatSockets(io);

httpServer.listen(PORT, () => {
  console.log(`Bumblearn API listening on http://localhost:${PORT}`);
});
