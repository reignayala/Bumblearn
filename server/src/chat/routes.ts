import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../auth/routes.js";
import { findUserByToken } from "../auth/store.js";
import {
  addMessage,
  ensureMatch,
  getMatch,
  getMessages,
  listMatches,
} from "./store.js";

export function createChatRouter() {
  const router = Router();

  router.get("/matches", requireAuth, async (req, res) => {
    const userId = (req as AuthedRequest).userId!;
    const matches = await listMatches(userId);
    res.json({ matches });
  });

  router.post("/matches", requireAuth, async (req, res) => {
    const userId = (req as AuthedRequest).userId!;
    const { peerId, peerName, peerRole, subjects, id } = req.body ?? {};
    if (typeof peerId !== "string") {
      res.status(400).json({ error: "peerId is required" });
      return;
    }
    try {
      const match = await ensureMatch({
        viewerId: userId,
        peerId,
        peerName: typeof peerName === "string" ? peerName : undefined,
        peerRole: peerRole === "learner" ? "learner" : "educator",
        subjects: Array.isArray(subjects)
          ? subjects.filter((s: unknown) => typeof s === "string")
          : [],
        id: typeof id === "string" ? id : undefined,
      });
      res.status(201).json({ match });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : "Could not create match",
      });
    }
  });

  router.get("/matches/:matchId", requireAuth, async (req, res) => {
    const userId = (req as AuthedRequest).userId!;
    const matchId = String(req.params.matchId);
    const token = req.headers.authorization?.slice(7) ?? "";
    const user = await findUserByToken(token);
    const match = await getMatch(matchId, userId);
    if (!match || !user) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    res.json({
      match,
      messages: await getMessages(match.id),
      me: { userId: user.id, name: user.name },
    });
  });

  router.get("/matches/:matchId/messages", requireAuth, async (req, res) => {
    const userId = (req as AuthedRequest).userId!;
    const match = await getMatch(String(req.params.matchId), userId);
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    res.json({ messages: await getMessages(match.id) });
  });

  router.post("/matches/:matchId/messages", requireAuth, async (req, res) => {
    const userId = (req as AuthedRequest).userId!;
    const match = await getMatch(String(req.params.matchId), userId);
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    const content = typeof req.body?.content === "string" ? req.body.content : "";
    const message = await addMessage({
      matchId: match.id,
      senderId: userId,
      content,
    });
    if (!message) {
      res.status(400).json({ error: "Message content required" });
      return;
    }
    res.status(201).json({ message });
  });

  return router;
}
