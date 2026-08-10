import type { Server, Socket } from "socket.io";
import {
  addMessage,
  demoIdentity,
  getMatch,
  pickAutoReply,
} from "./store.js";

type SendPayload = {
  matchId: string;
  content: string;
  clientId?: string;
};

export function registerChatSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.emit("chat:ready", { me: demoIdentity });

    socket.on("join_match", (matchId: string) => {
      if (typeof matchId !== "string" || !getMatch(matchId)) return;
      socket.join(`match:${matchId}`);
      socket.emit("chat:joined", { matchId });
    });

    socket.on("leave_match", (matchId: string) => {
      if (typeof matchId !== "string") return;
      socket.leave(`match:${matchId}`);
    });

    socket.on("chat:send", (payload: SendPayload, ack?: (result: unknown) => void) => {
      const matchId = payload?.matchId;
      const content = payload?.content;
      if (typeof matchId !== "string" || typeof content !== "string") {
        ack?.({ ok: false, error: "Invalid payload" });
        return;
      }

      const match = getMatch(matchId);
      if (!match) {
        ack?.({ ok: false, error: "Match not found" });
        return;
      }

      const message = addMessage({
        matchId,
        senderId: demoIdentity.userId,
        senderName: demoIdentity.name,
        content,
      });

      if (!message) {
        ack?.({ ok: false, error: "Empty message" });
        return;
      }

      io.to(`match:${matchId}`).emit("chat:message", message);
      io.emit("chat:match_updated", {
        matchId,
        lastMessage: {
          content: message.content,
          sentAt: message.sentAt,
          senderId: message.senderId,
        },
      });
      ack?.({ ok: true, message });

      // Solo-demo helper: peer auto-replies so chat feels alive without a second user.
      setTimeout(() => {
        const reply = addMessage({
          matchId,
          senderId: match.peerId,
          senderName: match.peerName,
          content: pickAutoReply(matchId),
        });
        if (!reply) return;
        io.to(`match:${matchId}`).emit("chat:message", reply);
        io.emit("chat:match_updated", {
          matchId,
          lastMessage: {
            content: reply.content,
            sentAt: reply.sentAt,
            senderId: reply.senderId,
          },
        });
      }, 900 + Math.random() * 700);
    });
  });
}
