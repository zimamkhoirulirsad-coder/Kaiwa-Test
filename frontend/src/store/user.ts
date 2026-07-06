import { storage } from "@/src/utils/storage";

export type UserProfile = {
  name: string;
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
  nativeLanguage: string;
  dailyGoalMinutes: number;
  xp: number;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  minutesToday: number;
  studyDate: string; // date for minutesToday
  vocabFavoritesJson: string; // JSON string array of vocab ids
  onboarded: boolean;
};

const KEY = "user_profile_v1";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Learner",
  jlptLevel: "N5",
  nativeLanguage: "English",
  dailyGoalMinutes: 15,
  xp: 0,
  streak: 0,
  lastStudyDate: "",
  minutesToday: 0,
  studyDate: "",
  vocabFavoritesJson: "[]",
  onboarded: false,
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function loadProfile(): Promise<UserProfile> {
  const p = await storage.getItem<UserProfile>(KEY, DEFAULT_PROFILE);
  return { ...DEFAULT_PROFILE, ...(p ?? DEFAULT_PROFILE) };
}

export async function saveProfile(p: UserProfile): Promise<void> {
  await storage.setItem(KEY, p);
}

export async function addXp(amount: number): Promise<UserProfile> {
  const p = await loadProfile();
  p.xp += amount;
  // streak
  const today = todayStr();
  if (p.lastStudyDate !== today) {
    if (p.lastStudyDate) {
      const last = new Date(p.lastStudyDate);
      const diff = Math.round((Date.parse(today) - last.getTime()) / 86400000);
      p.streak = diff === 1 ? p.streak + 1 : 1;
    } else {
      p.streak = 1;
    }
    p.lastStudyDate = today;
  }
  await saveProfile(p);
  return p;
}

export async function addStudyMinutes(mins: number): Promise<UserProfile> {
  const p = await loadProfile();
  const today = todayStr();
  if (p.studyDate !== today) {
    p.minutesToday = 0;
    p.studyDate = today;
  }
  p.minutesToday += mins;
  await saveProfile(p);
  return p;
}

export async function toggleFavorite(vocabId: string): Promise<string[]> {
  const p = await loadProfile();
  const list: string[] = JSON.parse(p.vocabFavoritesJson || "[]");
  const idx = list.indexOf(vocabId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(vocabId);
  p.vocabFavoritesJson = JSON.stringify(list);
  await saveProfile(p);
  return list;
}

export async function getFavorites(): Promise<string[]> {
  const p = await loadProfile();
  return JSON.parse(p.vocabFavoritesJson || "[]");
}

export async function resetProfile(): Promise<void> {
  await storage.setItem(KEY, DEFAULT_PROFILE);
}
