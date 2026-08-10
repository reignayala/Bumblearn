export type UserRole = "educator" | "learner";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type PreferredFormat = "online" | "in-person" | "either";

export type SwipeDirection = "like" | "pass";

export interface DeckProfile {
  id: string;
  name: string;
  role: UserRole;
  photoUrl: string;
  pitch: string;
  bio: string;
  subjects: string[];
  ratingAvg: number;
  ratingCount: number;
  hourlyRate?: number;
  yearsExperience?: number;
  teachingStyle?: string[];
  languages?: string[];
  skillLevel?: SkillLevel;
  learningGoals?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredFormat?: PreferredFormat;
  availabilitySummary: string;
}

export interface DeckFilters {
  subject: string;
  priceMin: number;
  priceMax: number;
  format: PreferredFormat | "any";
  skillLevel: SkillLevel | "any";
}

export const DEFAULT_FILTERS: DeckFilters = {
  subject: "all",
  priceMin: 0,
  priceMax: 200,
  format: "any",
  skillLevel: "any",
};
