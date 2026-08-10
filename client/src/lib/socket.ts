import { io, type Socket } from "socket.io-client";
import { getToken, type ApiMessage, type DemoIdentity } from "./api";
import {
  appendDemoMessage,
  createDemoPeerReply,
  DEMO_USER,
  getDemoMatch,
  isDemoMode,
} from "./demo";

let socket: Socket | null = null;

export function getSocket() {
  if (isDemoMode) {
    return null;
  }
  const token = getToken();
  if (!socket) {
    socket = io("/", {
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
  if (isDemoMode) {
    const match = getDemoMatch(matchId);
    const message: ApiMessage = {
      id: `demo-msg-${Date.now()}`,
      matchId,
      senderId: DEMO_USER.id,
      senderName: DEMO_USER.name,
      content,
      sentAt: new Date().toISOString(),
    };
    appendDemoMessage(matchId, message);
    if (match) {
      window.setTimeout(() => {
        appendDemoMessage(
          matchId,
          createDemoPeerReply(
            matchId,
            match.peerId,
            match.peerName,
            "Thanks for reaching out! This is a demo reply on GitHub Pages.",
          ),
        );
      }, 900);
    }
    return Promise.resolve(message);
  }
  const s = getSocket();
  if (!s) {
    return Promise.reject(new Error("Chat unavailable"));
  }
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
  if (!s) return () => {};
  const listener = (payload: { me: DemoIdentity }) => handler(payload.me);
  s.on("chat:ready", listener);
  return () => {
    s.off("chat:ready", listener);
  };
}

export function onChatMessage(handler: (message: ApiMessage) => void) {
  const s = getSocket();
  if (!s) return () => {};
  s.on("chat:message", handler);
  return () => {
    s.off("chat:message", handler);
  };
}

export function onMatchUpdated(handler: (event: MatchUpdatedEvent) => void) {
  const s = getSocket();
  if (!s) return () => {};
  s.on("chat:match_updated", handler);
  return () => {
    s.off("chat:match_updated", handler);
  };
}
