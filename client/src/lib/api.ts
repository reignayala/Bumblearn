export type ApiMessage = {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
};

export type ApiMatch = {
  id: string;
  peerId: string;
  peerName: string;
  peerRole: "educator" | "learner";
  subjects: string[];
  photoInitial: string;
  createdAt: string;
  lastMessage: {
    content: string;
    sentAt: string;
    senderId: string;
  } | null;
  messageCount: number;
};

export type DemoIdentity = {
  userId: string;
  name: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchMatches() {
  return request<{ matches: ApiMatch[] }>("/api/matches");
}

export function fetchMatchThread(matchId: string) {
  return request<{ match: ApiMatch; messages: ApiMessage[]; me: DemoIdentity }>(
    `/api/matches/${matchId}`,
  );
}

export function createMatch(input: {
  peerId: string;
  peerName: string;
  peerRole?: "educator" | "learner";
  subjects?: string[];
  id?: string;
}) {
  return request<{ match: ApiMatch }>("/api/matches", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
