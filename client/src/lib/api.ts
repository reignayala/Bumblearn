export type RoleChoice = "learner" | "educator" | "both";

import {
  DEMO_USER,
  getDemoMatch,
  isDemoMode,
  loadDemoMatches,
  loadDemoMessages,
  saveDemoMatch,
} from "./demo";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: Array<"learner" | "educator">;
  bio: string;
  profilePhotoUrl: string | null;
  onboardingComplete: boolean;
  educator: {
    subjects: string[];
    hourlyRate: number;
    yearsExperience: number;
    teachingStyle: string[];
    languages: string[];
    availabilitySummary: string;
    pitch: string;
  } | null;
  learner: {
    subjectsWanted: string[];
    skillLevel: "beginner" | "intermediate" | "advanced";
    learningGoals: string;
    budgetMin: number;
    budgetMax: number;
    preferredFormat: "online" | "in-person" | "either";
    availabilitySummary: string;
    pitch: string;
  } | null;
  createdAt: string;
};

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

const TOKEN_KEY = "bumblearn_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function signup(input: {
  name: string;
  email: string;
  password: string;
  roleChoice: RoleChoice;
}) {
  return request<{ token: string; user: AuthUser }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { email: string; password: string }) {
  return request<{ token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchMe() {
  if (isDemoMode) {
    return Promise.resolve({ user: DEMO_USER });
  }
  return request<{ user: AuthUser }>("/api/auth/me");
}

export function logoutRequest() {
  return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export function completeOnboarding(payload: {
  bio?: string;
  educator?: AuthUser["educator"];
  learner?: AuthUser["learner"];
}) {
  return request<{ user: AuthUser }>("/api/auth/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRoles(roleChoice: RoleChoice) {
  return request<{ user: AuthUser }>("/api/auth/roles", {
    method: "POST",
    body: JSON.stringify({ roleChoice }),
  });
}

export function fetchMatches() {
  if (isDemoMode) {
    return Promise.resolve({ matches: loadDemoMatches() });
  }
  return request<{ matches: ApiMatch[] }>("/api/matches");
}

export function fetchMatchThread(matchId: string) {
  if (isDemoMode) {
    const match = getDemoMatch(matchId);
    if (!match) {
      return Promise.reject(new Error("Match not found"));
    }
    return Promise.resolve({
      match,
      messages: loadDemoMessages(matchId),
      me: { userId: DEMO_USER.id, name: DEMO_USER.name },
    });
  }
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
  if (isDemoMode) {
    const match: ApiMatch = {
      id: input.id ?? `demo-${input.peerId}-${Date.now()}`,
      peerId: input.peerId,
      peerName: input.peerName,
      peerRole: input.peerRole ?? "educator",
      subjects: input.subjects ?? [],
      photoInitial: input.peerName.trim().charAt(0).toUpperCase(),
      createdAt: new Date().toISOString(),
      lastMessage: null,
      messageCount: 0,
    };
    saveDemoMatch(match);
    return Promise.resolve({ match });
  }
  return request<{ match: ApiMatch }>("/api/matches", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
