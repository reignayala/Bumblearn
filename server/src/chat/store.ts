import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

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
  lastMessage: {
    content: string;
    sentAt: string;
    senderId: string;
  } | null;
  messageCount: number;
};

const AUTO_REPLIES = [
  "Sounds great — I'm free later this week if you want to lock in a time.",
  "Got it! Send me any topics you want to cover before we meet.",
  "Perfect. Tap Schedule when you're ready and I'll confirm.",
  "Love the enthusiasm. Let's make a plan that fits both of us.",
];

function pairIds(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function availabilitySummary(value: unknown): string {
  if (value && typeof value === "object" && "summary" in value) {
    const summary = (value as { summary?: unknown }).summary;
    if (typeof summary === "string") return summary;
  }
  return "Flexible schedule";
}

export async function ensureSeedEducators() {
  const educators = [
    {
      id: "edu-1",
      name: "Maya Chen",
      email: "maya.chen@bumblearn.demo",
      subjects: ["Calculus", "Algebra", "SAT Math"],
      hourlyRate: 55,
      yearsExperience: 8,
      teachingStyle: ["exam-prep", "patient", "visual"],
      pitch: "AP Calc that finally clicks — no intimidation, just clarity.",
      availability: "Weeknights & Saturday mornings",
    },
    {
      id: "edu-3",
      name: "Sofia Alvarez",
      email: "sofia.alvarez@bumblearn.demo",
      subjects: ["Spanish", "ESL"],
      hourlyRate: 40,
      yearsExperience: 10,
      teachingStyle: ["conversational", "immersive", "encouraging"],
      pitch: "Conversational Spanish that sticks beyond the textbook.",
      availability: "Mornings Mon–Thu",
    },
  ];

  for (const edu of educators) {
    await prisma.user.upsert({
      where: { id: edu.id },
      create: {
        id: edu.id,
        name: edu.name,
        email: edu.email,
        roles: [UserRole.EDUCATOR],
        bio: edu.pitch,
        onboardingComplete: true,
        educatorProfile: {
          create: {
            subjects: edu.subjects,
            hourlyRate: edu.hourlyRate,
            yearsExperience: edu.yearsExperience,
            teachingStyle: edu.teachingStyle,
            languages: ["English"],
            availability: { summary: edu.availability },
            pitch: edu.pitch,
            ratingAvg: 4.9,
            ratingCount: 40,
          },
        },
      },
      update: {
        name: edu.name,
        roles: [UserRole.EDUCATOR],
        onboardingComplete: true,
      },
    });

    await prisma.educatorProfile.upsert({
      where: { userId: edu.id },
      create: {
        userId: edu.id,
        subjects: edu.subjects,
        hourlyRate: edu.hourlyRate,
        yearsExperience: edu.yearsExperience,
        teachingStyle: edu.teachingStyle,
        languages: ["English"],
        availability: { summary: edu.availability },
        pitch: edu.pitch,
        ratingAvg: 4.9,
        ratingCount: 40,
      },
      update: {
        subjects: edu.subjects,
        hourlyRate: edu.hourlyRate,
        yearsExperience: edu.yearsExperience,
        teachingStyle: edu.teachingStyle,
        availability: { summary: edu.availability },
        pitch: edu.pitch,
      },
    });
  }
}

async function ensureStarterMatches(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.roles.includes(UserRole.LEARNER)) return;

  const existing = await prisma.match.count({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });
  if (existing > 0) return;

  for (const peerId of ["edu-1", "edu-3"]) {
    const [userAId, userBId] = pairIds(userId, peerId);
    const match = await prisma.match.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      create: {
        id: peerId === "edu-1" ? `m1_${userId.slice(-6)}` : `m2_${userId.slice(-6)}`,
        userAId,
        userBId,
      },
      update: {},
    });

    const count = await prisma.message.count({ where: { matchId: match.id } });
    if (count === 0) {
      if (peerId === "edu-1") {
        await prisma.message.create({
          data: {
            matchId: match.id,
            senderId: "edu-1",
            content: "Happy to start with derivatives this week!",
          },
        });
      } else {
        await prisma.message.create({
          data: {
            matchId: match.id,
            senderId: "edu-3",
            content: "¿Quieres practicar mañana por la mañana?",
          },
        });
      }
    }
  }
}

function mapMatch(
  match: {
    id: string;
    matchedAt: Date;
    userAId: string;
    userBId: string;
    userA: {
      id: string;
      name: string;
      roles: UserRole[];
      educatorProfile: { subjects: string[] } | null;
      learnerProfile: { subjectsWanted: string[] } | null;
    };
    userB: {
      id: string;
      name: string;
      roles: UserRole[];
      educatorProfile: { subjects: string[] } | null;
      learnerProfile: { subjectsWanted: string[] } | null;
    };
    messages: Array<{ content: string; sentAt: Date; senderId: string }>;
    _count: { messages: number };
  },
  viewerId: string,
): ChatMatch {
  const peer = match.userAId === viewerId ? match.userB : match.userA;
  const peerRole = peer.roles.includes(UserRole.EDUCATOR) ? "educator" : "learner";
  const subjects =
    peer.educatorProfile?.subjects ?? peer.learnerProfile?.subjectsWanted ?? [];
  const last = match.messages[0];
  return {
    id: match.id,
    peerId: peer.id,
    peerName: peer.name,
    peerRole,
    subjects,
    photoInitial: peer.name.trim().charAt(0).toUpperCase() || "?",
    createdAt: match.matchedAt.toISOString(),
    lastMessage: last
      ? {
          content: last.content,
          sentAt: last.sentAt.toISOString(),
          senderId: last.senderId,
        }
      : null,
    messageCount: match._count.messages,
  };
}

const matchInclude = {
  userA: {
    include: { educatorProfile: true, learnerProfile: true },
  },
  userB: {
    include: { educatorProfile: true, learnerProfile: true },
  },
  messages: {
    orderBy: { sentAt: "desc" as const },
    take: 1,
  },
  _count: { select: { messages: true } },
};

export async function listMatches(viewerId: string): Promise<ChatMatch[]> {
  await ensureSeedEducators();
  await ensureStarterMatches(viewerId);

  const rows = await prisma.match.findMany({
    where: {
      status: "ACTIVE",
      OR: [{ userAId: viewerId }, { userBId: viewerId }],
    },
    include: matchInclude,
  });

  return rows
    .map((row) => mapMatch(row, viewerId))
    .sort((a, b) => {
      const aTime = a.lastMessage?.sentAt ?? a.createdAt;
      const bTime = b.lastMessage?.sentAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    });
}

export async function getMatch(matchId: string, viewerId?: string) {
  const row = await prisma.match.findUnique({
    where: { id: matchId },
    include: matchInclude,
  });
  if (!row) return null;
  if (viewerId && row.userAId !== viewerId && row.userBId !== viewerId) {
    return null;
  }
  const viewer = viewerId ?? row.userAId;
  return mapMatch(row, viewer);
}

export async function getMessages(matchId: string): Promise<ChatMessage[]> {
  const rows = await prisma.message.findMany({
    where: { matchId },
    include: { sender: true },
    orderBy: { sentAt: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    matchId: row.matchId,
    senderId: row.senderId,
    senderName: row.sender.name,
    content: row.content,
    sentAt: row.sentAt.toISOString(),
  }));
}

export async function addMessage(input: {
  matchId: string;
  senderId: string;
  content: string;
}): Promise<ChatMessage | null> {
  const content = input.content.trim();
  if (!content) return null;

  const match = await prisma.match.findUnique({ where: { id: input.matchId } });
  if (!match) return null;
  if (match.userAId !== input.senderId && match.userBId !== input.senderId) {
    return null;
  }

  const row = await prisma.message.create({
    data: {
      matchId: input.matchId,
      senderId: input.senderId,
      content,
    },
    include: { sender: true },
  });

  return {
    id: row.id,
    matchId: row.matchId,
    senderId: row.senderId,
    senderName: row.sender.name,
    content: row.content,
    sentAt: row.sentAt.toISOString(),
  };
}

export async function ensureMatch(input: {
  viewerId: string;
  peerId: string;
  peerName?: string;
  peerRole?: "educator" | "learner";
  subjects?: string[];
  id?: string;
}) {
  await ensureSeedEducators();

  let peer = await prisma.user.findUnique({
    where: { id: input.peerId },
    include: { educatorProfile: true, learnerProfile: true },
  });

  if (!peer) {
    peer = await prisma.user.create({
      data: {
        id: input.peerId,
        name: input.peerName?.trim() || "Educator",
        email: `${input.peerId}@bumblearn.demo`,
        roles:
          input.peerRole === "learner" ? [UserRole.LEARNER] : [UserRole.EDUCATOR],
        onboardingComplete: true,
        bio: "",
        ...(input.peerRole === "learner"
          ? {
              learnerProfile: {
                create: {
                  subjectsWanted: input.subjects ?? [],
                  availability: { summary: "Flexible" },
                },
              },
            }
          : {
              educatorProfile: {
                create: {
                  subjects: input.subjects ?? [],
                  hourlyRate: 40,
                  teachingStyle: [],
                  languages: ["English"],
                  availability: { summary: "Flexible" },
                },
              },
            }),
      },
      include: { educatorProfile: true, learnerProfile: true },
    });
  }

  const [userAId, userBId] = pairIds(input.viewerId, peer.id);
  const match = await prisma.match.upsert({
    where: { userAId_userBId: { userAId, userBId } },
    create: {
      id: input.id,
      userAId,
      userBId,
    },
    update: {},
    include: matchInclude,
  });

  return mapMatch(match, input.viewerId);
}

export async function pickAutoReply(matchId: string): Promise<string> {
  const count = await prisma.message.count({ where: { matchId } });
  return AUTO_REPLIES[count % AUTO_REPLIES.length] ?? AUTO_REPLIES[0]!;
}

export { availabilitySummary };
