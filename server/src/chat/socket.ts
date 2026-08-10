import type { Server, Socket } from "socket.io";
import { findUserByToken } from "../auth/store.js";
import {
  addMessage,
  getMatch,
  pickAutoReply,
} from "./store.js";

type SendPayload = {
  matchId: string;
  content: string;
};

async function userFromSocket(socket: Socket) {
  const token =
    typeof socket.handshake.auth?.token === "string"
      ? socket.handshake.auth.token
      : typeof socket.handshake.headers.authorization === "string" &&
          socket.handshake.headers.authorization.startsWith("Bearer ")
        ? socket.handshake.headers.authorization.slice(7)
        : null;
  if (!token) return null;
  return findUserByToken(token);
}

export function registerChatSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    void userFromSocket(socket).then((user) => {
      if (!user) {
        socket.emit("chat:error", { error: "Unauthorized" });
        return;
      }
      socket.data.userId = user.id;
      socket.data.userName = user.name;
      socket.emit("chat:ready", { me: { userId: user.id, name: user.name } });
    });

    socket.on("join_match", async (matchId: string) => {
      const userId = socket.data.userId as string | undefined;
      if (!userId || typeof matchId !== "string") return;
      const match = await getMatch(matchId, userId);
      if (!match) return;
      socket.join(`match:${matchId}`);
      socket.emit("chat:joined", { matchId });
    });

    socket.on("leave_match", (matchId: string) => {
      if (typeof matchId !== "string") return;
      socket.leave(`match:${matchId}`);
    });

    socket.on("chat:send", async (payload: SendPayload, ack?: (result: unknown) => void) => {
      try {
        const userId = socket.data.userId as string | undefined;
        if (!userId) {
          ack?.({ ok: false, error: "Unauthorized" });
          return;
        }

        const matchId = payload?.matchId;
        const content = payload?.content;
        if (typeof matchId !== "string" || typeof content !== "string") {
          ack?.({ ok: false, error: "Invalid payload" });
          return;
        }

        const match = await getMatch(matchId, userId);
        if (!match) {
          ack?.({ ok: false, error: "Match not found" });
          return;
        }

        const message = await addMessage({
          matchId,
          senderId: userId,
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

        const replyText = await pickAutoReply(matchId);
        setTimeout(() => {
          void (async () => {
            const reply = await addMessage({
              matchId,
              senderId: match.peerId,
              content: replyText,
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
          })();
        }, 900 + Math.random() * 700);
      } catch (err) {
        ack?.({
          ok: false,
          error: err instanceof Error ? err.message : "Send failed",
        });
      }
    });
  });
}
