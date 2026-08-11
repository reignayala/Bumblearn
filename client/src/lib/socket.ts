import { io, type Socket } from "socket.io-client";
import { getToken, type ApiMessage, type DemoIdentity } from "./api";
import { socketOrigin } from "./config";

let socket: Socket | null = null;

export function getSocket() {
  const token = getToken();
  if (!socket) {
    socket = io(socketOrigin ?? window.location.origin, {
      path: "/socket.io",
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: { token },
    });
  } else {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
  }
  return socket;
}

export function resetSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export type MatchUpdatedEvent = {
  matchId: string;
  lastMessage: {
    content: string;
    sentAt: string;
    senderId: string;
  };
};

export function sendChatMessage(
  matchId: string,
  content: string,
): Promise<ApiMessage> {
  const s = getSocket();
  return new Promise((resolve, reject) => {
    s.emit(
      "chat:send",
      { matchId, content },
      (result: { ok: boolean; message?: ApiMessage; error?: string }) => {
        if (!result?.ok || !result.message) {
          reject(new Error(result?.error ?? "Failed to send"));
          return;
        }
        resolve(result.message);
      },
    );
  });
}

export function onChatReady(handler: (me: DemoIdentity) => void) {
  const s = getSocket();
  const listener = (payload: { me: DemoIdentity }) => handler(payload.me);
  s.on("chat:ready", listener);
  return () => {
    s.off("chat:ready", listener);
  };
}

export function onChatMessage(handler: (message: ApiMessage) => void) {
  const s = getSocket();
  s.on("chat:message", handler);
  return () => {
    s.off("chat:message", handler);
  };
}

export function onMatchUpdated(handler: (event: MatchUpdatedEvent) => void) {
  const s = getSocket();
  s.on("chat:match_updated", handler);
  return () => {
    s.off("chat:match_updated", handler);
  };
}
