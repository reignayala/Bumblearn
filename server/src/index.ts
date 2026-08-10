import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createAuthRouter } from "./auth/routes.js";
import { createChatRouter } from "./chat/routes.js";
import { ensureSeedEducators } from "./chat/store.js";
import { registerChatSockets } from "./chat/socket.js";

const PORT = Number(process.env.PORT ?? 4000);
const NODE_ENV = process.env.NODE_ENV ?? "development";
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

/** Allow a single origin, comma-separated list, or same-origin when unset in prod. */
function resolveCorsOrigin(): boolean | string | string[] {
  if (process.env.CORS_ORIGIN === "*") return true;
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (NODE_ENV === "production" && !process.env.CLIENT_URL) {
    // Same-origin: static client is served by this server
    return true;
  }
  return CLIENT_URL;
}

const corsOrigin = resolveCorsOrigin();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: corsOrigin,
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
    version: "0.5.0",
    status: "postgres-persisted",
  });
});

app.use("/api", createAuthRouter());
app.use("/api", createChatRouter());
registerChatSockets(io);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");

if (NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

async function boot() {
  await ensureSeedEducators();
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Bumblearn API listening on http://0.0.0.0:${PORT}`);
  });
}

boot().catch((err) => {
  console.error("Failed to start API", err);
  process.exit(1);
});
