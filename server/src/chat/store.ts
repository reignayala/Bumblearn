export type ChatMessage = {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
};

export type ChatMatch = {
  id: string;
  peerId: string;
  peerName: string;
  peerRole: "educator" | "learner";
  subjects: string[];
  photoInitial: string;
  createdAt: string;
};

const DEMO_USER_ID = "learner-demo";
const DEMO_USER_NAME = "You";

const matches = new Map<string, ChatMatch>();
const messages = new Map<string, ChatMessage[]>();

function seed() {
  const seeded: ChatMatch[] = [
    {
      id: "m1",
      peerId: "edu-1",
      peerName: "Maya Chen",
      peerRole: "educator",
      subjects: ["Calculus", "Algebra"],
      photoInitial: "M",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: "m2",
      peerId: "edu-3",
      peerName: "Sofia Alvarez",
      peerRole: "educator",
      subjects: ["Spanish", "ESL"],
      photoInitial: "S",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];

  for (const match of seeded) {
    matches.set(match.id, match);
    messages.set(match.id, []);
  }

  addMessage({
    matchId: "m1",
    senderId: "edu-1",
    senderName: "Maya Chen",
    content: "Happy to start with derivatives this week!",
  });
  addMessage({
    matchId: "m1",
    senderId: DEMO_USER_ID,
    senderName: DEMO_USER_NAME,
    content: "That would be perfect — midterms are coming up.",
  });
  addMessage({
    matchId: "m2",
    senderId: "edu-3",
    senderName: "Sofia Alvarez",
    content: "¿Quieres practicar mañana por la mañana?",
  });
}

function id(): string {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addMessage(input: {
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
}): ChatMessage | null {
  if (!matches.has(input.matchId)) return null;
  const content = input.content.trim();
  if (!content) return null;

  const message: ChatMessage = {
    id: id(),
    matchId: input.matchId,
    senderId: input.senderId,
    senderName: input.senderName,
    content,
    sentAt: new Date().toISOString(),
  };

  const list = messages.get(input.matchId) ?? [];
  list.push(message);
  messages.set(input.matchId, list);
  return message;
}

export function listMatches() {
  return [...matches.values()]
    .map((match) => {
      const thread = messages.get(match.id) ?? [];
      const last = thread[thread.length - 1];
      return {
        ...match,
        lastMessage: last
          ? {
              content: last.content,
              sentAt: last.sentAt,
              senderId: last.senderId,
            }
          : null,
        messageCount: thread.length,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage?.sentAt ?? a.createdAt;
      const bTime = b.lastMessage?.sentAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    });
}

export function getMatch(matchId: string) {
  return matches.get(matchId) ?? null;
}

export function getMessages(matchId: string) {
  return messages.get(matchId) ?? [];
}

export function ensureMatch(input: {
  id?: string;
  peerId: string;
  peerName: string;
  peerRole?: "educator" | "learner";
  subjects?: string[];
}): ChatMatch {
  const existing = [...matches.values()].find((m) => m.peerId === input.peerId);
  if (existing) return existing;

  const match: ChatMatch = {
    id: input.id ?? `m_${input.peerId}`,
    peerId: input.peerId,
    peerName: input.peerName,
    peerRole: input.peerRole ?? "educator",
    subjects: input.subjects ?? [],
    photoInitial: input.peerName.trim().charAt(0).toUpperCase() || "?",
    createdAt: new Date().toISOString(),
  };
  matches.set(match.id, match);
  if (!messages.has(match.id)) messages.set(match.id, []);
  return match;
}

export const demoIdentity = {
  userId: DEMO_USER_ID,
  name: DEMO_USER_NAME,
};

const AUTO_REPLIES = [
  "Sounds great — I'm free later this week if you want to lock in a time.",
  "Got it! Send me any topics you want to cover before we meet.",
  "Perfect. Tap Schedule when you're ready and I'll confirm.",
  "Love the enthusiasm. Let's make a plan that fits both of us.",
];

export function pickAutoReply(matchId: string): string {
  const count = (messages.get(matchId) ?? []).length;
  return AUTO_REPLIES[count % AUTO_REPLIES.length] ?? AUTO_REPLIES[0]!;
}

seed();
