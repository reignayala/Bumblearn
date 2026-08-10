import { Router } from "express";
import {
  addMessage,
  demoIdentity,
  ensureMatch,
  getMatch,
  getMessages,
  listMatches,
} from "./store.js";

export function createChatRouter() {
  const router = Router();

  router.get("/me", (_req, res) => {
    res.json(demoIdentity);
  });

  router.get("/matches", (_req, res) => {
    res.json({ matches: listMatches() });
  });

  router.post("/matches", (req, res) => {
    const { peerId, peerName, peerRole, subjects, id } = req.body ?? {};
    if (typeof peerId !== "string" || typeof peerName !== "string") {
      res.status(400).json({ error: "peerId and peerName are required" });
      return;
    }
    const match = ensureMatch({
      id: typeof id === "string" ? id : undefined,
      peerId,
      peerName,
      peerRole: peerRole === "learner" ? "learner" : "educator",
      subjects: Array.isArray(subjects)
        ? subjects.filter((s: unknown) => typeof s === "string")
        : [],
    });
    res.status(201).json({ match });
  });

  router.get("/matches/:matchId", (req, res) => {
    const match = getMatch(req.params.matchId);
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    res.json({
      match,
      messages: getMessages(match.id),
      me: demoIdentity,
    });
  });

  router.get("/matches/:matchId/messages", (req, res) => {
    const match = getMatch(req.params.matchId);
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    res.json({ messages: getMessages(match.id) });
  });

  router.post("/matches/:matchId/messages", (req, res) => {
    const match = getMatch(req.params.matchId);
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    const content = typeof req.body?.content === "string" ? req.body.content : "";
    const message = addMessage({
      matchId: match.id,
      senderId: demoIdentity.userId,
      senderName: demoIdentity.name,
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
