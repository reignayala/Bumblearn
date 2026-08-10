import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export type RoleChoice = "learner" | "educator" | "both";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: Array<"learner" | "educator">;
  bio: string;
  profilePhotoUrl: string | null;
  onboardingComplete: boolean;
  educator?: {
    subjects: string[];
    hourlyRate: number;
    yearsExperience: number;
    teachingStyle: string[];
    languages: string[];
    availabilitySummary: string;
    pitch: string;
  };
  learner?: {
    subjectsWanted: string[];
    skillLevel: "beginner" | "intermediate" | "advanced";
    learningGoals: string;
    budgetMin: number;
    budgetMax: number;
    preferredFormat: "online" | "in-person" | "either";
    availabilitySummary: string;
    pitch: string;
  };
  createdAt: string;
};

type Session = {
  token: string;
  userId: string;
  createdAt: string;
};

const usersByEmail = new Map<string, StoredUser>();
const usersById = new Map<string, StoredUser>();
const sessions = new Map<string, Session>();

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(3).toString("hex")}`;
}

function publicUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    bio: user.bio,
    profilePhotoUrl: user.profilePhotoUrl,
    onboardingComplete: user.onboardingComplete,
    educator: user.educator ?? null,
    learner: user.learner ?? null,
    createdAt: user.createdAt,
  };
}

export function findUserByEmail(email: string) {
  return usersByEmail.get(email.trim().toLowerCase()) ?? null;
}

export function findUserById(userId: string) {
  return usersById.get(userId) ?? null;
}

export function findUserByToken(token: string) {
  const session = sessions.get(token);
  if (!session) return null;
  return findUserById(session.userId);
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
  roleChoice: RoleChoice;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!name || !email || input.password.length < 6) {
    throw new Error("Name, email, and a password (6+ chars) are required");
  }
  if (usersByEmail.has(email)) {
    throw new Error("An account with that email already exists");
  }

  const roles: Array<"learner" | "educator"> =
    input.roleChoice === "both"
      ? ["learner", "educator"]
      : input.roleChoice === "educator"
        ? ["educator"]
        : ["learner"];

  const user: StoredUser = {
    id: id("user"),
    name,
    email,
    passwordHash: await bcrypt.hash(input.password, 10),
    roles,
    bio: "",
    profilePhotoUrl: null,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(email, user);
  usersById.set(user.id, user);
  const token = createSession(user.id);
  return { token, user: publicUser(user) };
}

export async function login(input: { email: string; password: string }) {
  const user = findUserByEmail(input.email);
  if (!user) throw new Error("Invalid email or password");
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");
  const token = createSession(user.id);
  return { token, user: publicUser(user) };
}

function createSession(userId: string) {
  const token = randomBytes(24).toString("hex");
  sessions.set(token, {
    token,
    userId,
    createdAt: new Date().toISOString(),
  });
  return token;
}

export function logout(token: string) {
  sessions.delete(token);
}

export function completeOnboarding(
  userId: string,
  payload: {
    bio?: string;
    educator?: StoredUser["educator"];
    learner?: StoredUser["learner"];
  },
) {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");

  if (typeof payload.bio === "string") {
    user.bio = payload.bio.trim();
  }

  if (user.roles.includes("educator")) {
    if (!payload.educator?.subjects?.length) {
      throw new Error("Add at least one subject you teach");
    }
    user.educator = {
      subjects: payload.educator.subjects,
      hourlyRate: Number(payload.educator.hourlyRate) || 40,
      yearsExperience: Number(payload.educator.yearsExperience) || 0,
      teachingStyle: payload.educator.teachingStyle ?? [],
      languages: payload.educator.languages?.length
        ? payload.educator.languages
        : ["English"],
      availabilitySummary:
        payload.educator.availabilitySummary?.trim() || "Flexible schedule",
      pitch: payload.educator.pitch?.trim() || "",
    };
  }

  if (user.roles.includes("learner")) {
    if (!payload.learner?.subjectsWanted?.length) {
      throw new Error("Add at least one subject you want to learn");
    }
    user.learner = {
      subjectsWanted: payload.learner.subjectsWanted,
      skillLevel: payload.learner.skillLevel ?? "beginner",
      learningGoals: payload.learner.learningGoals?.trim() || "",
      budgetMin: Number(payload.learner.budgetMin) || 0,
      budgetMax: Number(payload.learner.budgetMax) || 100,
      preferredFormat: payload.learner.preferredFormat ?? "either",
      availabilitySummary:
        payload.learner.availabilitySummary?.trim() || "Flexible schedule",
      pitch: payload.learner.pitch?.trim() || "",
    };
  }

  user.onboardingComplete = true;
  usersById.set(user.id, user);
  usersByEmail.set(user.email, user);
  return publicUser(user);
}

export function updateRoles(userId: string, roleChoice: RoleChoice) {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");
  user.roles =
    roleChoice === "both"
      ? ["learner", "educator"]
      : roleChoice === "educator"
        ? ["educator"]
        : ["learner"];
  if (!user.roles.includes("educator")) delete user.educator;
  if (!user.roles.includes("learner")) delete user.learner;
  user.onboardingComplete = false;
  usersById.set(user.id, user);
  usersByEmail.set(user.email, user);
  return publicUser(user);
}

export { publicUser };
