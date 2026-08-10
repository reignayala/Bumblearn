import { PreferredFormat, SkillLevel, UserRole } from "@prisma/client";
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
      subjects: ["BS Accountancy", "BS Accounting Information System", "BS Economics"],
      hourlyRate: 55,
      yearsExperience: 8,
      teachingStyle: ["exam-prep", "patient", "visual"],
      languages: ["English", "Filipino"],
      pitch: "Accountancy board exam prep that finally clicks.",
      availability: "Weeknights & Saturday mornings",
      ratingAvg: 4.9,
      ratingCount: 128,
    },
    {
      id: "edu-2",
      name: "Jordan Blake",
      email: "jordan.blake@bumblearn.demo",
      subjects: ["BS Computer Science", "BS Information Technology", "BS Information Systems"],
      hourlyRate: 70,
      yearsExperience: 6,
      teachingStyle: ["hands-on", "project-based", "conversational"],
      languages: ["English"],
      pitch: "CS and IT mentoring from first year to capstone.",
      availability: "Flexible afternoons",
      ratingAvg: 4.8,
      ratingCount: 86,
    },
    {
      id: "edu-3",
      name: "Sofia Alvarez",
      email: "sofia.alvarez@bumblearn.demo",
      subjects: ["BA Communication", "BA English / Literature", "Psychology"],
      hourlyRate: 40,
      yearsExperience: 10,
      teachingStyle: ["conversational", "immersive", "encouraging"],
      languages: ["English", "Filipino"],
      pitch: "Comm and English tutoring for presentations that land.",
      availability: "Mornings Mon–Thu",
      ratingAvg: 5.0,
      ratingCount: 64,
    },
    {
      id: "edu-4",
      name: "Dr. Amir Rahman",
      email: "amir.rahman@bumblearn.demo",
      subjects: ["Doctor of Medicine", "BS Pharmacy", "BS Nursing"],
      hourlyRate: 85,
      yearsExperience: 12,
      teachingStyle: ["exam-prep", "structured", "visual"],
      languages: ["English", "Filipino"],
      pitch: "Med and pharmacy concepts explained without the overwhelm.",
      availability: "Sunday–Wednesday evenings",
      ratingAvg: 4.7,
      ratingCount: 41,
    },
    {
      id: "edu-5",
      name: "Priya Nair",
      email: "priya.nair@bumblearn.demo",
      subjects: ["BS Architecture", "BS Interior Design", "BFA Fine Arts"],
      hourlyRate: 65,
      yearsExperience: 7,
      teachingStyle: ["hands-on", "critique", "career-focused"],
      languages: ["English", "Filipino"],
      pitch: "Architecture and design critique that levels up your plates.",
      availability: "Tue / Thu after 6pm",
      ratingAvg: 4.85,
      ratingCount: 52,
    },
    {
      id: "edu-6",
      name: "Leo Okonkwo",
      email: "leo.okonkwo@bumblearn.demo",
      subjects: ["BS Civil Engineering", "BS Mechanical Engineering", "BS Computer Engineering"],
      hourlyRate: 45,
      yearsExperience: 15,
      teachingStyle: ["hands-on", "encouraging", "exam-prep"],
      languages: ["English"],
      pitch: "Engineering fundamentals with problems you actually need.",
      availability: "Weekends",
      ratingAvg: 4.95,
      ratingCount: 73,
    },
    {
      id: "edu-7",
      name: "Nina Santos",
      email: "nina.santos@bumblearn.demo",
      subjects: ["BS Nursing", "BS Physical Therapy", "BS Medical Laboratory Science"],
      hourlyRate: 50,
      yearsExperience: 9,
      teachingStyle: ["hands-on", "exam-prep", "patient"],
      languages: ["English", "Filipino"],
      pitch: "Nursing skills lab practice without the panic.",
      availability: "Weeknights after duty",
      ratingAvg: 4.88,
      ratingCount: 97,
    },
    {
      id: "edu-8",
      name: "Marco Villanueva",
      email: "marco.villanueva@bumblearn.demo",
      subjects: ["BS Business Administration", "BS Entrepreneurship", "BS Economics"],
      hourlyRate: 48,
      yearsExperience: 11,
      teachingStyle: ["project-based", "career-focused", "conversational"],
      languages: ["English", "Filipino"],
      pitch: "Business cases and marketing plans that get marks.",
      availability: "Lunch breaks & Fri evenings",
      ratingAvg: 4.72,
      ratingCount: 58,
    },
    {
      id: "edu-9",
      name: "Elena Cruz",
      email: "elena.cruz@bumblearn.demo",
      subjects: ["BS Electronics Engineering (ECE)", "BS Electrical Engineering", "BS Computer Engineering"],
      hourlyRate: 60,
      yearsExperience: 8,
      teachingStyle: ["visual", "structured", "exam-prep"],
      languages: ["English"],
      pitch: "ECE circuits and signals made less scary.",
      availability: "Tue–Sat afternoons",
      ratingAvg: 4.91,
      ratingCount: 44,
    },
    {
      id: "edu-10",
      name: "Hannah Dela Cruz",
      email: "hannah.delacruz@bumblearn.demo",
      subjects: [
        "Bachelor of Elementary Education (BEEd)",
        "Bachelor of Secondary Education (BSEd)",
        "Bachelor of Early Childhood Education",
      ],
      hourlyRate: 38,
      yearsExperience: 14,
      teachingStyle: ["encouraging", "structured", "exam-prep"],
      languages: ["English", "Filipino"],
      pitch: "Education majors: lesson plans that actually work in class.",
      availability: "Weekday mornings",
      ratingAvg: 4.97,
      ratingCount: 112,
    },
    {
      id: "edu-11",
      name: "Kenji Torres",
      email: "kenji.torres@bumblearn.demo",
      subjects: ["BS Hotel and Restaurant Management", "BS Tourism Management", "BS Office Administration"],
      hourlyRate: 42,
      yearsExperience: 7,
      teachingStyle: ["hands-on", "career-focused", "conversational"],
      languages: ["English", "Filipino"],
      pitch: "Hotel ops and tourism practicum coaching.",
      availability: "Weekends only",
      ratingAvg: 4.65,
      ratingCount: 39,
    },
    {
      id: "edu-12",
      name: "Aisha Mendoza",
      email: "aisha.mendoza@bumblearn.demo",
      subjects: ["BS Criminology", "Bachelor of Laws / Juris Doctor", "BA Political Science"],
      hourlyRate: 58,
      yearsExperience: 10,
      teachingStyle: ["structured", "exam-prep", "patient"],
      languages: ["English", "Filipino"],
      pitch: "Criminology and pre-law writing that holds up.",
      availability: "Evenings Mon–Thu",
      ratingAvg: 4.8,
      ratingCount: 67,
    },
    {
      id: "edu-13",
      name: "Rico Lim",
      email: "rico.lim@bumblearn.demo",
      subjects: ["BS Chemical Engineering", "BS Industrial Engineering", "BS Environmental Science"],
      hourlyRate: 62,
      yearsExperience: 9,
      teachingStyle: ["hands-on", "visual", "project-based"],
      languages: ["English"],
      pitch: "Chem Eng thermo without drowning in formulas.",
      availability: "Sat mornings & Wed nights",
      ratingAvg: 4.76,
      ratingCount: 33,
    },
    {
      id: "edu-14",
      name: "Bea Ramos",
      email: "bea.ramos@bumblearn.demo",
      subjects: ["Psychology", "BA Sociology", "BA Philosophy"],
      hourlyRate: 46,
      yearsExperience: 6,
      teachingStyle: ["patient", "visual", "encouraging"],
      languages: ["English", "Filipino"],
      pitch: "Psych stats and research methods, gently.",
      availability: "Flexible evenings",
      ratingAvg: 4.93,
      ratingCount: 81,
    },
    {
      id: "edu-15",
      name: "Omar Reyes",
      email: "omar.reyes@bumblearn.demo",
      subjects: ["BS Marine Transportation", "BS Marine Engineering"],
      hourlyRate: 55,
      yearsExperience: 12,
      teachingStyle: ["exam-prep", "hands-on", "structured"],
      languages: ["English", "Filipino"],
      pitch: "Marine transportation seamanship & nav drills.",
      availability: "Between vessel rotations",
      ratingAvg: 4.7,
      ratingCount: 28,
    },
    {
      id: "edu-16",
      name: "Clara Ong",
      email: "clara.ong@bumblearn.demo",
      subjects: ["BS Accounting Information System", "BS Accountancy", "BS Information Systems"],
      hourlyRate: 52,
      yearsExperience: 5,
      teachingStyle: ["hands-on", "project-based", "exam-prep"],
      languages: ["English"],
      pitch: "Accounting Information Systems that click in labs.",
      availability: "Afternoons daily",
      ratingAvg: 4.84,
      ratingCount: 55,
    },
    {
      id: "edu-17",
      name: "Diego Navarro",
      email: "diego.navarro@bumblearn.demo",
      subjects: ["BS Agriculture", "BS Forestry", "BS Environmental Science"],
      hourlyRate: 36,
      yearsExperience: 8,
      teachingStyle: ["hands-on", "encouraging", "conversational"],
      languages: ["English", "Filipino"],
      pitch: "Agri and forestry fieldwork reports, demystified.",
      availability: "Weekend mornings",
      ratingAvg: 4.68,
      ratingCount: 24,
    },
    {
      id: "edu-18",
      name: "Lila Fernandez",
      email: "lila.fernandez@bumblearn.demo",
      subjects: ["BA International Studies", "BA Political Science", "BA English / Literature"],
      hourlyRate: 44,
      yearsExperience: 7,
      teachingStyle: ["conversational", "structured", "career-focused"],
      languages: ["English", "Filipino"],
      pitch: "International Studies essays with sharper arguments.",
      availability: "Mon / Wed / Fri nights",
      ratingAvg: 4.9,
      ratingCount: 47,
    },
    {
      id: "edu-19",
      name: "Theo Garcia",
      email: "theo.garcia@bumblearn.demo",
      subjects: ["BS Pharmacy", "BS Medical Laboratory Science", "BS Radiologic Technology"],
      hourlyRate: 57,
      yearsExperience: 9,
      teachingStyle: ["exam-prep", "visual", "patient"],
      languages: ["English"],
      pitch: "Pharmacy calculations and case quizzes.",
      availability: "Post-shift evenings",
      ratingAvg: 4.79,
      ratingCount: 61,
    },
    {
      id: "edu-20",
      name: "Grace Tan",
      email: "grace.tan@bumblearn.demo",
      subjects: ["BFA Fine Arts", "BS Interior Design", "BA Communication"],
      hourlyRate: 49,
      yearsExperience: 6,
      teachingStyle: ["critique", "hands-on", "encouraging"],
      languages: ["English", "Filipino"],
      pitch: "Fine arts portfolios ready for jury day.",
      availability: "Thu–Sun afternoons",
      ratingAvg: 4.86,
      ratingCount: 36,
    },
    {
      id: "edu-21",
      name: "Vincent Chua",
      email: "vincent.chua@bumblearn.demo",
      subjects: ["BS Information Systems", "BS Information Technology", "BS Office Administration"],
      hourlyRate: 53,
      yearsExperience: 8,
      teachingStyle: ["project-based", "career-focused", "structured"],
      languages: ["English"],
      pitch: "Info Systems projects from ERD to demo day.",
      availability: "Weeknights 8–10pm",
      ratingAvg: 4.74,
      ratingCount: 49,
    },
    {
      id: "edu-22",
      name: "Mara Quinto",
      email: "mara.quinto@bumblearn.demo",
      subjects: ["Doctor of Dental Medicine", "BS Nursing", "BS Medical Laboratory Science"],
      hourlyRate: 75,
      yearsExperience: 11,
      teachingStyle: ["visual", "exam-prep", "patient"],
      languages: ["English", "Filipino"],
      pitch: "Dental anatomy reviews that stick.",
      availability: "Clinic off-days",
      ratingAvg: 4.82,
      ratingCount: 31,
    },
    {
      id: "edu-23",
      name: "Paolo Esguerra",
      email: "paolo.esguerra@bumblearn.demo",
      subjects: ["BS Economics", "BS Business Administration", "BS Accountancy"],
      hourlyRate: 47,
      yearsExperience: 7,
      teachingStyle: ["visual", "structured", "exam-prep"],
      languages: ["English", "Filipino"],
      pitch: "Economics graphs and problem sets, clarified.",
      availability: "Weekday lunch hours",
      ratingAvg: 4.77,
      ratingCount: 42,
    },
    {
      id: "edu-24",
      name: "Ivy Cabrera",
      email: "ivy.cabrera@bumblearn.demo",
      subjects: ["BS Radiologic Technology", "BS Physical Therapy", "BS Nursing"],
      hourlyRate: 51,
      yearsExperience: 10,
      teachingStyle: ["hands-on", "exam-prep", "encouraging"],
      languages: ["English"],
      pitch: "Radiologic tech positioning & physics review.",
      availability: "After hospital shifts",
      ratingAvg: 4.71,
      ratingCount: 27,
    },
    {
      id: "edu-25",
      name: "Noah Villar",
      email: "noah.villar@bumblearn.demo",
      subjects: ["BS Architecture", "BS Interior Design", "BFA Fine Arts"],
      hourlyRate: 68,
      yearsExperience: 13,
      teachingStyle: ["critique", "project-based", "career-focused"],
      languages: ["English", "Filipino"],
      pitch: "Architecture plates and presentation coaching.",
      availability: "Sat studio hours",
      ratingAvg: 4.89,
      ratingCount: 54,
    },
    {
      id: "edu-26",
      name: "Camille Sy",
      email: "camille.sy@bumblearn.demo",
      subjects: ["BS Computer Science", "BS Information Technology", "BS Computer Engineering"],
      hourlyRate: 66,
      yearsExperience: 5,
      teachingStyle: ["hands-on", "project-based", "conversational"],
      languages: ["English"],
      pitch: "CS data structures without the intimidation.",
      availability: "Flexible remote hours",
      ratingAvg: 4.94,
      ratingCount: 90,
    },
  ];

  const learners = [
    {
      id: "lrn-1",
      name: "Alex Rivera",
      email: "alex.rivera@bumblearn.demo",
      subjectsWanted: ["BS Civil Engineering", "BS Mechanical Engineering"],
      skillLevel: SkillLevel.INTERMEDIATE,
      learningGoals: "Raise my major subject grades before finals.",
      budgetMin: 30,
      budgetMax: 60,
      preferredFormat: PreferredFormat.ONLINE,
      availability: "Evenings after 7pm",
      pitch: "Civil Engineering major needing strength of materials help.",
    },
    {
      id: "lrn-2",
      name: "Sam Patel",
      email: "sam.patel@bumblearn.demo",
      subjectsWanted: ["BS Information Technology", "BS Computer Science", "BS Entrepreneurship"],
      skillLevel: SkillLevel.BEGINNER,
      learningGoals: "Ship a personal portfolio site this semester.",
      budgetMin: 40,
      budgetMax: 80,
      preferredFormat: PreferredFormat.EITHER,
      availability: "Lunch hours & weekends",
      pitch: "IT student building a portfolio — need a patient CS guide.",
    },
    {
      id: "lrn-3",
      name: "Kai Domingo",
      email: "kai.domingo@bumblearn.demo",
      subjectsWanted: ["BS Nursing", "BS Pharmacy"],
      skillLevel: SkillLevel.BEGINNER,
      learningGoals: "Pass return demonstration and midterms.",
      budgetMin: 25,
      budgetMax: 50,
      preferredFormat: PreferredFormat.IN_PERSON,
      availability: "After clinicals",
      pitch: "Nursing student prepping for skills return demo.",
    },
    {
      id: "lrn-4",
      name: "Yuna Mercado",
      email: "yuna.mercado@bumblearn.demo",
      subjectsWanted: ["BS Accountancy", "BS Accounting Information System"],
      skillLevel: SkillLevel.INTERMEDIATE,
      learningGoals: "Climb from 2.5 to 1.75 in AdvAc.",
      budgetMin: 35,
      budgetMax: 65,
      preferredFormat: PreferredFormat.ONLINE,
      availability: "Nights after review class",
      pitch: "Accountancy major stuck on advanced accounting.",
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
      },
      update: {
        name: edu.name,
        roles: [UserRole.EDUCATOR],
        bio: edu.pitch,
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
        languages: edu.languages,
        availability: { summary: edu.availability },
        pitch: edu.pitch,
        ratingAvg: edu.ratingAvg,
        ratingCount: edu.ratingCount,
      },
      update: {
        subjects: edu.subjects,
        hourlyRate: edu.hourlyRate,
        yearsExperience: edu.yearsExperience,
        teachingStyle: edu.teachingStyle,
        languages: edu.languages,
        availability: { summary: edu.availability },
        pitch: edu.pitch,
        ratingAvg: edu.ratingAvg,
        ratingCount: edu.ratingCount,
      },
    });
  }

  for (const learner of learners) {
    await prisma.user.upsert({
      where: { id: learner.id },
      create: {
        id: learner.id,
        name: learner.name,
        email: learner.email,
        roles: [UserRole.LEARNER],
        bio: learner.pitch,
        onboardingComplete: true,
      },
      update: {
        name: learner.name,
        roles: [UserRole.LEARNER],
        bio: learner.pitch,
        onboardingComplete: true,
      },
    });

    await prisma.learnerProfile.upsert({
      where: { userId: learner.id },
      create: {
        userId: learner.id,
        subjectsWanted: learner.subjectsWanted,
        skillLevel: learner.skillLevel,
        learningGoals: learner.learningGoals,
        budgetMin: learner.budgetMin,
        budgetMax: learner.budgetMax,
        preferredFormat: learner.preferredFormat,
        availability: { summary: learner.availability },
        pitch: learner.pitch,
      },
      update: {
        subjectsWanted: learner.subjectsWanted,
        skillLevel: learner.skillLevel,
        learningGoals: learner.learningGoals,
        budgetMin: learner.budgetMin,
        budgetMax: learner.budgetMax,
        preferredFormat: learner.preferredFormat,
        availability: { summary: learner.availability },
        pitch: learner.pitch,
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
            content: "Happy to review Accountancy topics this week!",
          },
        });
      } else {
        await prisma.message.create({
          data: {
            matchId: match.id,
            senderId: "edu-3",
            content: "Want to practice presentation skills tomorrow morning?",
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
