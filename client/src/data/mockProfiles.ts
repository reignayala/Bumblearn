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
      <rect x="0" y="520" width="640" height="280" fill="rgba(193,18,31,0.35)"/>
    </svg>`,
  );
  return `data:image/svg+xml,${svg}`;
}

export const MOCK_EDUCATORS: DeckProfile[] = [
  {
    id: "edu-1",
    name: "Maya Chen",
    role: "educator",
    photoUrl: avatar("Maya Chen", "#9a2a5c", "#e8437a"),
    pitch: "AP Calc that finally clicks — no intimidation, just clarity.",
    bio: "Former high-school math lead turned full-time tutor. I break tough problems into small wins and celebrate the messy middle of learning.",
    subjects: ["Calculus", "Algebra", "SAT Math"],
    ratingAvg: 4.9,
    ratingCount: 128,
    hourlyRate: 55,
    yearsExperience: 8,
    teachingStyle: ["exam-prep", "patient", "visual"],
    languages: ["English", "Mandarin"],
    preferredFormat: "either",
    availabilitySummary: "Weeknights & Saturday mornings",
  },
  {
    id: "edu-2",
    name: "Jordan Blake",
    role: "educator",
    photoUrl: avatar("Jordan Blake", "#c1121f", "#ff9ec0"),
    pitch: "Python from zero to building things you actually use.",
    bio: "Software engineer who loves mentoring beginners. Projects over slides — you'll leave each session with working code.",
    subjects: ["Python", "Web Dev", "Data Science"],
    ratingAvg: 4.8,
    ratingCount: 86,
    hourlyRate: 70,
    yearsExperience: 6,
    teachingStyle: ["hands-on", "project-based", "conversational"],
    languages: ["English"],
    preferredFormat: "online",
    availabilitySummary: "Flexible afternoons (UTC-5)",
  },
  {
    id: "edu-3",
    name: "Sofia Alvarez",
    role: "educator",
    photoUrl: avatar("Sofia Alvarez", "#c44b6a", "#ffc4d6"),
    pitch: "Conversational Spanish that sticks beyond the textbook.",
    bio: "Native speaker and certified language coach. We role-play real scenarios — cafés, interviews, travel — so fluency feels natural.",
    subjects: ["Spanish", "ESL"],
    ratingAvg: 5.0,
    ratingCount: 64,
    hourlyRate: 40,
    yearsExperience: 10,
    teachingStyle: ["conversational", "immersive", "encouraging"],
    languages: ["Spanish", "English"],
    preferredFormat: "either",
    availabilitySummary: "Mornings Mon–Thu",
  },
  {
    id: "edu-4",
    name: "Dr. Amir Rahman",
    role: "educator",
    photoUrl: avatar("Dr. Amir Rahman", "#6b4456", "#e8437a"),
    pitch: "Organic chemistry demystified for pre-meds.",
    bio: "PhD chemist with a knack for mechanism storytelling. Office-hours energy, exam-day results.",
    subjects: ["Chemistry", "Biology"],
    ratingAvg: 4.7,
    ratingCount: 41,
    hourlyRate: 85,
    yearsExperience: 12,
    teachingStyle: ["exam-prep", "structured", "visual"],
    languages: ["English", "Arabic"],
    preferredFormat: "online",
    availabilitySummary: "Sunday–Wednesday evenings",
  },
  {
    id: "edu-5",
    name: "Priya Nair",
    role: "educator",
    photoUrl: avatar("Priya Nair", "#9a2a5c", "#ffc4d6"),
    pitch: "Design critique that levels up your UX portfolio.",
    bio: "Product designer at a growth-stage startup. Together we'll tighten case studies, critique flows, and practice whiteboard interviews.",
    subjects: ["UX Design", "Figma", "Portfolio"],
    ratingAvg: 4.85,
    ratingCount: 52,
    hourlyRate: 65,
    yearsExperience: 7,
    teachingStyle: ["hands-on", "critique", "career-focused"],
    languages: ["English", "Hindi"],
    preferredFormat: "online",
    availabilitySummary: "Tue / Thu after 6pm",
  },
  {
    id: "edu-6",
    name: "Leo Okonkwo",
    role: "educator",
    photoUrl: avatar("Leo Okonkwo", "#c1121f", "#c44b6a"),
    pitch: "Guitar fundamentals with songs you love from day one.",
    bio: "Session guitarist and patient teacher. Chord progressions, rhythm, and ear training without the boredom.",
    subjects: ["Guitar", "Music Theory"],
    ratingAvg: 4.95,
    ratingCount: 73,
    hourlyRate: 45,
    yearsExperience: 15,
    teachingStyle: ["hands-on", "encouraging", "song-based"],
    languages: ["English"],
    preferredFormat: "in-person",
    availabilitySummary: "Weekends downtown",
  },
];

export const MOCK_LEARNERS: DeckProfile[] = [
  {
    id: "lrn-1",
    name: "Alex Rivera",
    role: "learner",
    photoUrl: avatar("Alex Rivera", "#e8437a", "#ff9ec0"),
    pitch: "Need Calc II help before midterms — motivated and curious.",
    bio: "Sophomore engineering student. Looking for someone who can slow down when I get stuck on integrals.",
    subjects: ["Calculus", "Physics"],
    ratingAvg: 0,
    ratingCount: 0,
    skillLevel: "intermediate",
    learningGoals: "Raise my Calc II grade from B- to A before finals.",
    budgetMin: 30,
    budgetMax: 60,
    preferredFormat: "online",
    availabilitySummary: "Evenings after 7pm",
  },
  {
    id: "lrn-2",
    name: "Sam Patel",
    role: "learner",
    photoUrl: avatar("Sam Patel", "#ffc4d6", "#c44b6a"),
    pitch: "Career switcher diving into Python — looking for a patient guide.",
    bio: "Marketing background, learning to code. Prefer project-based sessions over lectures.",
    subjects: ["Python", "Web Dev"],
    ratingAvg: 0,
    ratingCount: 0,
    skillLevel: "beginner",
    learningGoals: "Ship a personal portfolio site in 8 weeks.",
    budgetMin: 40,
    budgetMax: 80,
    preferredFormat: "either",
    availabilitySummary: "Lunch hours & weekends",
  },
];

/** Default deck for the mock swipe experience (learner browsing educators). */
export const MOCK_DECK = MOCK_EDUCATORS;
