import type { DeckProfile } from "../types";

/** Placeholder portraits — solid color SVG data URIs keep the deck offline-friendly. */
function avatar(seed: string, from: string, to: string): string {
  const initial = seed.trim().charAt(0).toUpperCase();
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="640" height="800" fill="url(#g)"/>
      <circle cx="320" cy="300" r="120" fill="rgba(255,255,255,0.22)"/>
      <text x="320" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="rgba(255,255,255,0.92)">${initial}</text>
      <rect x="0" y="520" width="640" height="280" fill="rgba(11,61,58,0.35)"/>
    </svg>`,
  );
  return `data:image/svg+xml,${svg}`;
}

export const MOCK_EDUCATORS: DeckProfile[] = [
  {
    id: "edu-1",
    name: "Maya Chen",
    role: "educator",
    photoUrl: avatar("Maya Chen", "#1a5c57", "#2f9e8c"),
    pitch: "Accountancy board exam prep that finally clicks.",
    bio: "CPA reviewer and former audit associate. I break tough accounting problems into small wins for Accountancy and AIS majors.",
    subjects: ["BS Accountancy", "BS Accounting Information System", "BS Economics"],
    ratingAvg: 4.9,
    ratingCount: 128,
    hourlyRate: 55,
    yearsExperience: 8,
    teachingStyle: ["exam-prep", "patient", "visual"],
    languages: ["English", "Filipino"],
    preferredFormat: "either",
    availabilitySummary: "Weeknights & Saturday mornings",
  },
  {
    id: "edu-2",
    name: "Jordan Blake",
    role: "educator",
    photoUrl: avatar("Jordan Blake", "#0b3d3a", "#c5e063"),
    pitch: "CS and IT mentoring from first year to capstone.",
    bio: "Software engineer who loves mentoring BS Computer Science and IT students. Projects over slides — you'll leave with working code.",
    subjects: ["BS Computer Science", "BS Information Technology", "BS Information Systems"],
    ratingAvg: 4.8,
    ratingCount: 86,
    hourlyRate: 70,
    yearsExperience: 6,
    teachingStyle: ["hands-on", "project-based", "conversational"],
    languages: ["English"],
    preferredFormat: "online",
    availabilitySummary: "Flexible afternoons",
  },
  {
    id: "edu-3",
    name: "Sofia Alvarez",
    role: "educator",
    photoUrl: avatar("Sofia Alvarez", "#e07a5f", "#f4d35e"),
    pitch: "Comm and English tutoring for presentations that land.",
    bio: "Communication lecturer and writing coach. We practice real scenarios — thesis defenses, interviews, and campus orgs.",
    subjects: ["BA Communication", "BA English / Literature", "Psychology"],
    ratingAvg: 5.0,
    ratingCount: 64,
    hourlyRate: 40,
    yearsExperience: 10,
    teachingStyle: ["conversational", "immersive", "encouraging"],
    languages: ["English", "Filipino"],
    preferredFormat: "either",
    availabilitySummary: "Mornings Mon–Thu",
  },
  {
    id: "edu-4",
    name: "Dr. Amir Rahman",
    role: "educator",
    photoUrl: avatar("Dr. Amir Rahman", "#3d5a56", "#2f9e8c"),
    pitch: "Med and pharmacy concepts explained without the overwhelm.",
    bio: "Physician-educator with a knack for mechanism storytelling. Office-hours energy, exam-day results for Medicine and Allied Health.",
    subjects: ["Doctor of Medicine", "BS Pharmacy", "BS Nursing"],
    ratingAvg: 4.7,
    ratingCount: 41,
    hourlyRate: 85,
    yearsExperience: 12,
    teachingStyle: ["exam-prep", "structured", "visual"],
    languages: ["English", "Filipino"],
    preferredFormat: "online",
    availabilitySummary: "Sunday–Wednesday evenings",
  },
  {
    id: "edu-5",
    name: "Priya Nair",
    role: "educator",
    photoUrl: avatar("Priya Nair", "#1a5c57", "#f4d35e"),
    pitch: "Architecture and design critique that levels up your plates.",
    bio: "Practicing designer mentoring Architecture, Interior Design, and Fine Arts students through plates, portfolios, and juries.",
    subjects: ["BS Architecture", "BS Interior Design", "BFA Fine Arts"],
    ratingAvg: 4.85,
    ratingCount: 52,
    hourlyRate: 65,
    yearsExperience: 7,
    teachingStyle: ["hands-on", "critique", "career-focused"],
    languages: ["English", "Filipino"],
    preferredFormat: "online",
    availabilitySummary: "Tue / Thu after 6pm",
  },
  {
    id: "edu-6",
    name: "Leo Okonkwo",
    role: "educator",
    photoUrl: avatar("Leo Okonkwo", "#0b3d3a", "#e07a5f"),
    pitch: "Engineering fundamentals with problems you actually need.",
    bio: "Licensed engineer and patient tutor for Civil, Mechanical, and Computer Engineering coursework and board review.",
    subjects: ["BS Civil Engineering", "BS Mechanical Engineering", "BS Computer Engineering"],
    ratingAvg: 4.95,
    ratingCount: 73,
    hourlyRate: 45,
    yearsExperience: 15,
    teachingStyle: ["hands-on", "encouraging", "exam-prep"],
    languages: ["English"],
    preferredFormat: "in-person",
    availabilitySummary: "Weekends",
  },
];

export const MOCK_LEARNERS: DeckProfile[] = [
  {
    id: "lrn-1",
    name: "Alex Rivera",
    role: "learner",
    photoUrl: avatar("Alex Rivera", "#2f9e8c", "#c5e063"),
    pitch: "Civil Engineering major needing strength of materials help.",
    bio: "Third-year CE student. Looking for someone who can slow down when I get stuck on structural analysis.",
    subjects: ["BS Civil Engineering", "BS Mechanical Engineering"],
    ratingAvg: 0,
    ratingCount: 0,
    skillLevel: "intermediate",
    learningGoals: "Raise my major subject grades before finals.",
    budgetMin: 30,
    budgetMax: 60,
    preferredFormat: "online",
    availabilitySummary: "Evenings after 7pm",
  },
  {
    id: "lrn-2",
    name: "Sam Patel",
    role: "learner",
    photoUrl: avatar("Sam Patel", "#f4d35e", "#e07a5f"),
    pitch: "IT student building a portfolio — need a patient CS guide.",
    bio: "BS Information Technology student. Prefer project-based sessions over lectures for programming courses.",
    subjects: ["BS Information Technology", "BS Computer Science", "BS Entrepreneurship"],
    ratingAvg: 0,
    ratingCount: 0,
    skillLevel: "beginner",
    learningGoals: "Ship a personal portfolio site this semester.",
    budgetMin: 40,
    budgetMax: 80,
    preferredFormat: "either",
    availabilitySummary: "Lunch hours & weekends",
  },
];

/** Default deck for the mock swipe experience (learner browsing educators). */
export const MOCK_DECK = MOCK_EDUCATORS;
