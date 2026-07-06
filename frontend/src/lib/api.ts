// Thin API client for backend LLM endpoints.
const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type ChatReply = {
  reply: string;
  romaji: string;
  translation: string;
  grammar: string;
  jlpt: string;
  difficulty: string;
  vocabulary: { word: string; reading: string; meaning: string }[];
  suggestions: string[];
};

export type PronunciationReply = {
  pronunciation: number;
  fluency: number;
  accuracy: number;
  naturalness: number;
  overall: number;
  word_feedback: { word: string; score: number; note: string }[];
  ai_suggestion: string;
};

export async function sendChat(params: {
  sessionId: string;
  jlptLevel: string;
  nativeLanguage: string;
  message: string;
  history: ChatTurn[];
  scenario?: string;
}): Promise<ChatReply> {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: params.sessionId,
      jlpt_level: params.jlptLevel,
      native_language: params.nativeLanguage,
      message: params.message,
      history: params.history,
      scenario: params.scenario ?? null,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`chat_http_${res.status}: ${t}`);
  }
  return res.json();
}

export async function scorePronunciation(params: {
  targetJapanese: string;
  targetRomaji: string;
  spokenText: string;
  nativeLanguage: string;
}): Promise<PronunciationReply> {
  const res = await fetch(`${BASE}/api/pronounce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target_japanese: params.targetJapanese,
      target_romaji: params.targetRomaji,
      spoken_text: params.spokenText,
      native_language: params.nativeLanguage,
    }),
  });
  if (!res.ok) throw new Error(`pron_http_${res.status}`);
  return res.json();
}
