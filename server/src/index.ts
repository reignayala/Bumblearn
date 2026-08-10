import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

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

// Placeholder — auth, swipe, match, and chat routes land in later milestones.
app.get("/api", (_req, res) => {
  res.json({
    name: "Bumblearn API",
    version: "0.1.0",
    status: "scaffolded",
  });
});

io.on("connection", (socket) => {
  socket.on("join_match", (matchId: string) => {
    socket.join(`match:${matchId}`);
  });

  socket.on("leave_match", (matchId: string) => {
    socket.leave(`match:${matchId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Bumblearn API listening on http://localhost:${PORT}`);
});
