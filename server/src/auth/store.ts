import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  PreferredFormat,
  SkillLevel,
  UserRole,
  type EducatorProfile,
  type LearnerProfile,
  type User,
} from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export type RoleChoice = "learner" | "educator" | "both";

export type PublicUser = {
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

type UserWithProfiles = User & {
  educatorProfile: EducatorProfile | null;
  learnerProfile: LearnerProfile | null;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES = "30d";

function rolesFromChoice(choice: RoleChoice): UserRole[] {
  if (choice === "both") return [UserRole.LEARNER, UserRole.EDUCATOR];
  if (choice === "educator") return [UserRole.EDUCATOR];
  return [UserRole.LEARNER];
}

function toPublicRoles(roles: UserRole[]): Array<"learner" | "educator"> {
  return roles.map((r) => (r === UserRole.EDUCATOR ? "educator" : "learner"));
}

function availabilitySummary(value: unknown): string {
  if (value && typeof value === "object" && "summary" in value) {
    const summary = (value as { summary?: unknown }).summary;
    if (typeof summary === "string") return summary;
  }
  if (typeof value === "string") return value;
  return "Flexible schedule";
}

export function publicUser(user: UserWithProfiles): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: toPublicRoles(user.roles),
    bio: user.bio ?? "",
    profilePhotoUrl: user.profilePhotoUrl,
    onboardingComplete: user.onboardingComplete,
    educator: user.educatorProfile
      ? {
          subjects: user.educatorProfile.subjects,
          hourlyRate: Number(user.educatorProfile.hourlyRate),
          yearsExperience: user.educatorProfile.yearsExperience,
          teachingStyle: user.educatorProfile.teachingStyle,
          languages: user.educatorProfile.languages,
          availabilitySummary: availabilitySummary(user.educatorProfile.availability),
          pitch: user.educatorProfile.pitch ?? "",
        }
      : null,
    learner: user.learnerProfile
      ? {
          subjectsWanted: user.learnerProfile.subjectsWanted,
          skillLevel: user.learnerProfile.skillLevel.toLowerCase() as
            | "beginner"
            | "intermediate"
            | "advanced",
          learningGoals: user.learnerProfile.learningGoals ?? "",
          budgetMin: Number(user.learnerProfile.budgetMin ?? 0),
          budgetMax: Number(user.learnerProfile.budgetMax ?? 100),
          preferredFormat:
            user.learnerProfile.preferredFormat === PreferredFormat.ONLINE
              ? "online"
              : user.learnerProfile.preferredFormat === PreferredFormat.IN_PERSON
                ? "in-person"
                : "either",
          availabilitySummary: availabilitySummary(user.learnerProfile.availability),
          pitch: user.learnerProfile.pitch ?? "",
        }
      : null,
    createdAt: user.createdAt.toISOString(),
  };
}

async function loadUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { educatorProfile: true, learnerProfile: true },
  });
}

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: string };
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function findUserByToken(token: string) {
  const userId = verifyToken(token);
  if (!userId) return null;
  return loadUser(userId);
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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("An account with that email already exists");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(input.password, 10),
      roles: rolesFromChoice(input.roleChoice),
      onboardingComplete: false,
    },
    include: { educatorProfile: true, learnerProfile: true },
  });

  return { token: signToken(user.id), user: publicUser(user) };
}

export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    include: { educatorProfile: true, learnerProfile: true },
  });
  if (!user?.passwordHash) throw new Error("Invalid email or password");
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");
  return { token: signToken(user.id), user: publicUser(user) };
}

export function logout(_token: string) {
  // JWT is stateless; client discards the token.
}

export async function completeOnboarding(
  userId: string,
  payload: {
    bio?: string;
    educator?: PublicUser["educator"];
    learner?: PublicUser["learner"];
  },
) {
  const user = await loadUser(userId);
  if (!user) throw new Error("User not found");

  const isEducator = user.roles.includes(UserRole.EDUCATOR);
  const isLearner = user.roles.includes(UserRole.LEARNER);

  if (isEducator) {
    if (!payload.educator?.subjects?.length) {
      throw new Error("Add at least one course you teach");
    }
    await prisma.educatorProfile.upsert({
      where: { userId },
      create: {
        userId,
        subjects: payload.educator.subjects,
        hourlyRate: Number(payload.educator.hourlyRate) || 40,
        yearsExperience: Number(payload.educator.yearsExperience) || 0,
        teachingStyle: payload.educator.teachingStyle ?? [],
        languages: payload.educator.languages?.length
          ? payload.educator.languages
          : ["English"],
        availability: {
          summary: payload.educator.availabilitySummary?.trim() || "Flexible schedule",
        },
        pitch: payload.educator.pitch?.trim() || "",
      },
      update: {
        subjects: payload.educator.subjects,
        hourlyRate: Number(payload.educator.hourlyRate) || 40,
        yearsExperience: Number(payload.educator.yearsExperience) || 0,
        teachingStyle: payload.educator.teachingStyle ?? [],
        languages: payload.educator.languages?.length
          ? payload.educator.languages
          : ["English"],
        availability: {
          summary: payload.educator.availabilitySummary?.trim() || "Flexible schedule",
        },
        pitch: payload.educator.pitch?.trim() || "",
      },
    });
  }

  if (isLearner) {
    if (!payload.learner?.subjectsWanted?.length) {
      throw new Error("Add at least one course you want help with");
    }
    const skill =
      payload.learner.skillLevel === "advanced"
        ? SkillLevel.ADVANCED
        : payload.learner.skillLevel === "intermediate"
          ? SkillLevel.INTERMEDIATE
          : SkillLevel.BEGINNER;
    const format =
      payload.learner.preferredFormat === "online"
        ? PreferredFormat.ONLINE
        : payload.learner.preferredFormat === "in-person"
          ? PreferredFormat.IN_PERSON
          : PreferredFormat.EITHER;

    await prisma.learnerProfile.upsert({
      where: { userId },
      create: {
        userId,
        subjectsWanted: payload.learner.subjectsWanted,
        skillLevel: skill,
        learningGoals: payload.learner.learningGoals?.trim() || "",
        budgetMin: Number(payload.learner.budgetMin) || 0,
        budgetMax: Number(payload.learner.budgetMax) || 100,
        preferredFormat: format,
        availability: {
          summary: payload.learner.availabilitySummary?.trim() || "Flexible schedule",
        },
        pitch: payload.learner.pitch?.trim() || "",
      },
      update: {
        subjectsWanted: payload.learner.subjectsWanted,
        skillLevel: skill,
        learningGoals: payload.learner.learningGoals?.trim() || "",
        budgetMin: Number(payload.learner.budgetMin) || 0,
        budgetMax: Number(payload.learner.budgetMax) || 100,
        preferredFormat: format,
        availability: {
          summary: payload.learner.availabilitySummary?.trim() || "Flexible schedule",
        },
        pitch: payload.learner.pitch?.trim() || "",
      },
    });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      bio: typeof payload.bio === "string" ? payload.bio.trim() : user.bio,
      onboardingComplete: true,
    },
    include: { educatorProfile: true, learnerProfile: true },
  });

  return publicUser(updated);
}

export async function updateRoles(userId: string, roleChoice: RoleChoice) {
  const roles = rolesFromChoice(roleChoice);
  if (!roles.includes(UserRole.EDUCATOR)) {
    await prisma.educatorProfile.deleteMany({ where: { userId } });
  }
  if (!roles.includes(UserRole.LEARNER)) {
    await prisma.learnerProfile.deleteMany({ where: { userId } });
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      roles,
      onboardingComplete: false,
    },
    include: { educatorProfile: true, learnerProfile: true },
  });
  return publicUser(updated);
}
