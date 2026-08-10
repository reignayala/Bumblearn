import type { ApiMatch, ApiMessage, AuthUser } from "./api";

/** GitHub Pages is static-only — run the app in demo mode with local mock data. */
export const isDemoMode = import.meta.env.VITE_GITHUB_PAGES === "true";

export const DEMO_USER: AuthUser = {
  id: "demo-user",
  name: "Demo Learner",
  email: "demo@bumblearn.app",
  roles: ["learner"],
  bio: "Exploring Bumblearn on GitHub Pages.",
  profilePhotoUrl: null,
  onboardingComplete: true,
  educator: null,
  learner: {
    subjectsWanted: ["BS Computer Science"],
    skillLevel: "intermediate",
    learningGoals: "Find a great tutor for finals week.",
    budgetMin: 30,
    budgetMax: 70,
    preferredFormat: "either",
    availabilitySummary: "Evenings",
    pitch: "CS major looking for patient mentors.",
  },
  createdAt: new Date().toISOString(),
};

const DEMO_MATCHES_KEY = "bumblearn_demo_matches";

export function loadDemoMatches(): ApiMatch[] {
  if (!isDemoMode) return [];
  try {
    const raw = localStorage.getItem(DEMO_MATCHES_KEY);
    return raw ? (JSON.parse(raw) as ApiMatch[]) : [];
  } catch {
    return [];
  }
}

export function saveDemoMatch(match: ApiMatch) {
  if (!isDemoMode) return;
  const existing = loadDemoMatches();
  localStorage.setItem(DEMO_MATCHES_KEY, JSON.stringify([match, ...existing]));
}

export function getDemoMatch(matchId: string): ApiMatch | null {
  return loadDemoMatches().find((m) => m.id === matchId) ?? null;
}

const DEMO_MESSAGES_KEY = "bumblearn_demo_messages";

type DemoMessageStore = Record<string, ApiMessage[]>;

function loadAllDemoMessages(): DemoMessageStore {
  if (!isDemoMode) return {};
  try {
    const raw = localStorage.getItem(DEMO_MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as DemoMessageStore) : {};
  } catch {
    return {};
  }
}

export function loadDemoMessages(matchId: string): ApiMessage[] {
  return loadAllDemoMessages()[matchId] ?? [];
}

function saveDemoMessages(matchId: string, messages: ApiMessage[]) {
  if (!isDemoMode) return;
  const store = loadAllDemoMessages();
  store[matchId] = messages;
  localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(store));
}

export function appendDemoMessage(matchId: string, message: ApiMessage) {
  saveDemoMessages(matchId, [...loadDemoMessages(matchId), message]);
}

export function createDemoPeerReply(
  matchId: string,
  peerId: string,
  peerName: string,
  content: string,
): ApiMessage {
  return {
    id: `demo-reply-${Date.now()}`,
    matchId,
    senderId: peerId,
    senderName: peerName,
    content,
    sentAt: new Date().toISOString(),
  };
}
