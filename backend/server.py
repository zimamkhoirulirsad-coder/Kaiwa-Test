from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import json
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-haiku-4-5-20251001"

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ==================== Models ====================

class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    text: str


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Client-generated session identifier")
    jlpt_level: str = Field("N5", description="Target JLPT level: N5, N4, N3, N2, N1")
    native_language: str = Field("English", description="Native language of the learner")
    scenario: Optional[str] = Field(None, description="Optional scenario context")
    message: str
    history: List[ChatTurn] = Field(default_factory=list)


class VocabItem(BaseModel):
    word: str
    reading: str
    meaning: str


class ChatResponse(BaseModel):
    reply: str
    romaji: str
    translation: str
    grammar: str
    jlpt: str
    difficulty: str
    vocabulary: List[VocabItem] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


class PronunciationRequest(BaseModel):
    target_japanese: str
    target_romaji: str
    spoken_text: str
    native_language: str = "English"


class PronunciationResponse(BaseModel):
    pronunciation: int
    fluency: int
    accuracy: int
    naturalness: int
    overall: int
    word_feedback: List[dict] = Field(default_factory=list)
    ai_suggestion: str


# ==================== Helpers ====================

def _system_prompt(jlpt: str, native: str, scenario: Optional[str]) -> str:
    scenario_line = (
        f"\nRole-play scenario context: {scenario}. Stay in character as the Japanese speaker in this setting."
        if scenario
        else ""
    )
    return f"""You are a world-class Japanese language tutor for a premium mobile learning app.
The learner's target JLPT level is {jlpt}. Their native language is {native}.
Match the vocabulary and grammar complexity to {jlpt} level (do not use grammar above their level unless they use it first).
{scenario_line}

CRITICAL: You MUST respond with a SINGLE valid JSON object and NOTHING else. No markdown, no code fences, no commentary before or after. The JSON schema is:

{{
  "reply": "<your Japanese response, natural and warm, 1-3 sentences>",
  "romaji": "<full romaji transliteration of reply>",
  "translation": "<translation of the reply into {native}>",
  "grammar": "<short explanation of the key grammar in the reply, in {native}, one sentence>",
  "jlpt": "<JLPT level used, e.g. N5>",
  "difficulty": "<Easy | Medium | Hard>",
  "vocabulary": [
    {{"word": "<kanji/kana>", "reading": "<hiragana reading>", "meaning": "<meaning in {native}>"}}
  ],
  "suggestions": ["<alternative natural way to say the reply>", "<another variation>"]
}}

Rules:
- Return 2-4 vocabulary items pulled from your reply.
- Return exactly 2 suggestions.
- Never leave any field empty. Never wrap the JSON in ```.
- If the user writes in {native}, still reply in Japanese but keep it {jlpt}-appropriate.
- If the user makes a Japanese mistake, gently correct it inside the "grammar" field."""


_JSON_RE = re.compile(r"\{[\s\S]*\}")


def _extract_json(text: str) -> dict:
    """Robustly extract the first JSON object from the model output."""
    text = text.strip()
    if text.startswith("```"):
        # strip code fences like ```json ... ```
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    m = _JSON_RE.search(text)
    if not m:
        raise ValueError(f"No JSON object in model output: {text[:200]}")
    return json.loads(m.group(0))


# ==================== Routes ====================

@api_router.get("/")
async def root():
    return {"message": "AI Japanese Tutor API"}


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=req.session_id,
            system_message=_system_prompt(req.jlpt_level, req.native_language, req.scenario),
        ).with_model(MODEL_PROVIDER, MODEL_NAME)

        # Prepend history as a compact context inside the current user message
        # (emergentintegrations LlmChat manages its own session but we want
        # deterministic short-context per call from client-side history).
        context_snippet = ""
        if req.history:
            recent = req.history[-8:]
            lines = [f"{t.role.upper()}: {t.text}" for t in recent]
            context_snippet = "Prior turns (for context):\n" + "\n".join(lines) + "\n\n"

        user_text = f"{context_snippet}Learner says: {req.message}"

        result = await chat_client.send_message(UserMessage(text=user_text))
        parsed = _extract_json(result)
        # Guarantee all fields
        parsed.setdefault("vocabulary", [])
        parsed.setdefault("suggestions", [])
        for v in parsed["vocabulary"]:
            v.setdefault("word", "")
            v.setdefault("reading", "")
            v.setdefault("meaning", "")
        return ChatResponse(**parsed)
    except Exception as e:
        logging.exception("chat error")
        raise HTTPException(status_code=500, detail=f"chat_failed: {e}")


@api_router.post("/pronounce", response_model=PronunciationResponse)
async def pronounce(req: PronunciationRequest):
    system = f"""You are a strict but encouraging Japanese pronunciation coach.
Given a target Japanese phrase, its romaji, and what the learner actually said (transcribed by speech-to-text), evaluate the learner.
Respond with a SINGLE JSON object and NOTHING else:
{{
  "pronunciation": <0-100 int>,
  "fluency": <0-100 int>,
  "accuracy": <0-100 int>,
  "naturalness": <0-100 int>,
  "overall": <0-100 int>,
  "word_feedback": [
    {{"word": "<expected token>", "score": <0-100>, "note": "<short note in {req.native_language}>"}}
  ],
  "ai_suggestion": "<one crisp actionable tip in {req.native_language}>"
}}
Be fair: transcription errors count as low accuracy. Do not wrap in code fences."""

    user_text = (
        f"Target Japanese: {req.target_japanese}\n"
        f"Target romaji: {req.target_romaji}\n"
        f"Learner spoken (STT): {req.spoken_text}"
    )
    try:
        client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"pron-{req.target_japanese[:20]}",
            system_message=system,
        ).with_model(MODEL_PROVIDER, MODEL_NAME)
        result = await client.send_message(UserMessage(text=user_text))
        parsed = _extract_json(result)
        parsed.setdefault("word_feedback", [])
        parsed.setdefault("ai_suggestion", "")
        return PronunciationResponse(**parsed)
    except Exception as e:
        logging.exception("pronounce error")
        raise HTTPException(status_code=500, detail=f"pronounce_failed: {e}")


@api_router.get("/health")
async def health():
    return {"status": "ok", "model": f"{MODEL_PROVIDER}/{MODEL_NAME}"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
