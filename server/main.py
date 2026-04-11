from __future__ import annotations

from pathlib import Path
import pickle
import re
from typing import Any, Literal

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pydantic import BaseModel, Field

model: Any | None = None
vectorizer: Any | None = None

BASE_DIR = Path(__file__).resolve().parent
MODEL_CANDIDATES = [
    BASE_DIR / "model" / "model.joblib",
    BASE_DIR / "model.joblib",
]
VECTORIZER_CANDIDATES = [
    BASE_DIR / "model" / "vectorizer.joblib",
    BASE_DIR / "vectorizer.joblib",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, vectorizer
    try:
        model_path = _find_existing_path(MODEL_CANDIDATES)
        vectorizer_path = _find_existing_path(VECTORIZER_CANDIDATES)

        if model_path is None or vectorizer_path is None:
            model = None
            vectorizer = None
            print("Model/vectorizer not found. Running in reasoning-only mode.")
        else:
            model = _load_pickle(model_path)
            vectorizer = _load_pickle(vectorizer_path)

            print(f"Model loaded: {model_path}")
            print(f"Vectorizer loaded: {vectorizer_path}")

    except Exception as e:
        model = None
        vectorizer = None
        print(f"Error loading model/vectorizer: {e}. Falling back to reasoning-only mode.")
    
    yield
    model = None
    vectorizer = None

app = FastAPI(title="Fake News Detection API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsRequest(BaseModel):
    text: str = Field(..., min_length=1)


class AnalysisBlock(BaseModel):
    linguistic_flags: list[str]
    credibility_assessment: str
    fact_check_reasoning: str
    final_explanation: str


class PredictionResponse(BaseModel):
    success: bool
    input_text: str
    predicted_label: Literal["REAL", "FAKE"]
    confidence_score: float
    class_probabilities: dict[str, float]
    analysis: AnalysisBlock


def clean_text(text: str) -> str:
    cleaned = text.lower().strip()
    cleaned = re.sub(r"https?://\S+|www\.\S+", " ", cleaned)
    cleaned = re.sub(r"[^a-z0-9\s]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned


def _round4(value: float) -> float:
    return round(float(value), 4)


def _normalize_probs(probabilities: dict[str, float]) -> dict[str, float]:
    cleaned = {
        "FAKE": max(0.0, float(probabilities.get("FAKE", 0.0))),
        "REAL": max(0.0, float(probabilities.get("REAL", 0.0))),
    }

    total = cleaned["FAKE"] + cleaned["REAL"]

    if total <= 0:
        return {"FAKE": 0.5, "REAL": 0.5}

    normalized = {
        "FAKE": _round4(cleaned["FAKE"] / total),
        "REAL": _round4(cleaned["REAL"] / total),
    }

    drift = _round4(1.0 - sum(normalized.values()))
    if drift != 0:
        normalized["REAL"] = _round4(normalized["REAL"] + drift)

    return normalized


def _find_existing_path(candidates: list[Path]) -> Path | None:
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def _load_pickle(path: Path) -> Any:
    try:
        return joblib.load(path)
    except Exception:
        with path.open("rb") as file:
            return pickle.load(file)


def _map_model_label(raw: Any) -> str:
    if hasattr(raw, "item"):
        try:
            raw = raw.item()
        except Exception:
            pass

    if isinstance(raw, str):
        value = raw.strip().lower()
        if value in {"0", "fake", "false", "f"}:
            return "FAKE"
        if value in {"1", "real", "true", "r"}:
            return "REAL"
        return "FAKE"

    if isinstance(raw, (int, float, bool)):
        value = int(raw)
        if value == 0:
            return "FAKE"
        if value == 1:
            return "REAL"

    return "FAKE"


def _extract_entities(original_text: str) -> dict[str, list[str]]:
    numbers = re.findall(r"\b\d+(?:\.\d+)?%?\b", original_text)
    proper_nouns = re.findall(r"\b[A-Z][a-z]{2,}\b", original_text)

    institution_terms = [
        "government", "ministry", "department", "agency", "court",
        "senate", "congress", "white house", "nasa", "who",
        "united nations", "reuters", "bbc", "associated press", "ap",
        "military", "parliament", "police", "idf", "hezbollah", "hamas",
        "pentagon", "eu", "nato", "president", "prime minister",
        "supreme court", "wall street journal", "new york times",
        "washington post", "al jazeera", "bloomberg", "authority",
        "authorities"
    ]

    lower_text = original_text.lower()
    institutions = [term for term in institution_terms if re.search(rf"\b{term}\b", lower_text)]

    return {
        "numbers": numbers[:5],
        "proper_nouns": proper_nouns[:8],
        "institutions": institutions[:8],
    }


def _linguistic_analysis(original_text: str, cleaned_text: str) -> tuple[list[str], float, float]:
    flags: list[str] = []
    fake_boost = 0.0
    real_boost = 0.0

    clickbait_terms = {
        "shocking", "you won t believe", "secret revealed", "bombshell", 
        "hidden truth", "they don t want you to know", "mainstream media won t show", 
        "miracle cure", "exposed"
    }

    emotional_terms = {
        "outrage", "terrifying", "horrifying", "panic", "furious", 
        "massive cover up", "blatant violation", "lacking decision"
    }

    absolute_terms = {
        "always", "never", "everyone", "nobody", "guaranteed", "proves once and for all"
    }

    weak_source_terms = {
        "anonymous insider", "anonymous insiders", "sources say", "rumors suggest", 
        "people are saying", "unverified reports", "many claim", "it is believed"
    }

    strong_source_terms = {
        "according to", "in a statement", "official statement", 
        "press release", "stated that", "announced on", "reported by", 
        "broadcast by", "spokesperson", "confirmed that"
    }

    lower_text = cleaned_text

    if any(term in lower_text for term in clickbait_terms):
        flags.append("clickbait_language")
        fake_boost += 0.10

    if any(term in lower_text for term in emotional_terms):
        flags.append("emotional_manipulation")
        fake_boost += 0.08

    if any(term in lower_text for term in absolute_terms):
        flags.append("absolute_claims")
        fake_boost += 0.07

    if any(term in lower_text for term in weak_source_terms):
        flags.append("weak_source_pattern")
        fake_boost += 0.08

    if "!!!" in original_text or re.search(r"[A-Z]{8,}", original_text):
        flags.append("sensational_formatting")
        fake_boost += 0.08

    words = cleaned_text.split()
    if len(words) < 5:
        flags.append("very_short_claim")
        fake_boost += 0.05

    if any(term in lower_text for term in strong_source_terms) or re.search(
        r"\b(according to|reported by|confirmed by|official statement|in a statement|broadcast by)\b", lower_text
    ):
        flags.append("source_reference_pattern")
        real_boost += 0.08

    if re.search(
        r"\b(announced|stated|said|reported|released|invest|funding|initiative|policy|program|negotiation|diplomacy|ceasefire|election|summit|legislation)\b",
        lower_text,
    ):
        real_boost += 0.06

    return flags, fake_boost, real_boost


def _fact_check_signals(cleaned_text: str) -> tuple[str, float, float]:
    impossible_patterns = {
        "aliens landed",
        "time travel proven",
        "cure for all diseases",
        "immortality pill",
        "flat earth confirmed",
    }

    high_risk_patterns = {
        "secret cure",
        "government hiding",
        "instant money",
        "guaranteed profit",
        "weather control",
        "election rigged by satellites",
    }

    for pattern in impossible_patterns:
        if pattern in cleaned_text:
            return (
                "Claim appears highly implausible against general world knowledge.",
                0.30,
                0.02,
            )

    for pattern in high_risk_patterns:
        if pattern in cleaned_text:
            return (
                "Claim includes common misinformation motifs and needs strong verification.",
                0.16,
                0.06,
            )

    return (
        "No clearly impossible claim detected, but direct source verification is still required.",
        0.0,
        0.10,
    )


def _model_probabilities(cleaned_text: str) -> dict[str, float] | None:
    if model is None or vectorizer is None:
        return None

    try:
        transformed = vectorizer.transform([cleaned_text])

        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(transformed)[0]
            classes = getattr(model, "classes_", None)

            mapped = {"FAKE": 0.0, "REAL": 0.0}

            if classes is None:
                if len(probs) >= 2:
                    mapped["FAKE"] = float(probs[0])
                    mapped["REAL"] = float(probs[1])
            else:
                for class_value, prob in zip(classes, probs):
                    label = _map_model_label(class_value)
                    if label in mapped:
                        mapped[label] = float(prob)

            return _normalize_probs(mapped)

        prediction = model.predict(transformed)[0]
        label = _map_model_label(prediction)

        if label == "REAL":
            return {"FAKE": 0.2, "REAL": 0.8}
        return {"FAKE": 0.8, "REAL": 0.2}

    except Exception:
        return None


def _hybrid_detect(original_text: str) -> PredictionResponse:
    cleaned_text = clean_text(original_text)
    entities = _extract_entities(original_text)

    flags, fake_ling, real_ling = _linguistic_analysis(original_text, cleaned_text)
    fact_reasoning, fake_fact, real_fact = _fact_check_signals(cleaned_text)

    heuristic = {
        "FAKE": 0.5 + fake_ling + fake_fact,
        "REAL": 0.5 + real_ling + real_fact,
    }

    proper_noun_count = len(entities["proper_nouns"])
    institution_count = len(entities["institutions"])
    number_count = len(entities["numbers"])

    structured_real_signals = 0
    if proper_noun_count >= 2:
        structured_real_signals += 1
    if institution_count >= 1:
        structured_real_signals += 1
    if number_count >= 1:
        structured_real_signals += 1

    if structured_real_signals >= 2:
        heuristic["REAL"] += 0.12
        heuristic["FAKE"] -= 0.06

    if structured_real_signals >= 3:
        heuristic["REAL"] += 0.08

    if entities["institutions"]:
        heuristic["REAL"] += 0.06

    if not entities["proper_nouns"] and not entities["institutions"]:
        heuristic["FAKE"] += 0.04

    heuristic_probs = _normalize_probs(heuristic)
    ml_probs = _model_probabilities(cleaned_text)

    if ml_probs is None:
        final_probs = heuristic_probs
        credibility = "Model unavailable; classification driven by linguistic and reasoning signals."
    else:
        # Dramatically heavily favor heuristics for very structured real-world data format
        if structured_real_signals >= 3:
            ml_weight = 0.20
            heuristic_weight = 0.80
            heuristic_probs["REAL"] += 0.08  # Ultimate news trust boost
        elif structured_real_signals >= 2:
            ml_weight = 0.35
            heuristic_weight = 0.65
        else:
            ml_weight = 0.65
            heuristic_weight = 0.35

        final_probs = _normalize_probs(
            {
                "FAKE": (ml_weight * ml_probs["FAKE"]) + (heuristic_weight * heuristic_probs["FAKE"]),
                "REAL": (ml_weight * ml_probs["REAL"]) + (heuristic_weight * heuristic_probs["REAL"]),
            }
        )
        credibility = f"Hybrid logic utilized (ML Weight: {ml_weight*100}%, Heuristics: {heuristic_weight*100}%)."

    fake_score = final_probs["FAKE"]
    real_score = final_probs["REAL"]

    if real_score >= fake_score:
        predicted_label: Literal["REAL", "FAKE"] = "REAL"
        confidence_score = _round4(real_score)
    else:
        predicted_label = "FAKE"
        confidence_score = _round4(fake_score)

    final_probs = _normalize_probs(final_probs)

    entity_summary = []
    if entities["proper_nouns"]:
        entity_summary.append(f"names/entities: {', '.join(entities['proper_nouns'][:3])}")
    if entities["institutions"]:
        entity_summary.append(f"institutions: {', '.join(entities['institutions'][:2])}")
    if entities["numbers"]:
        entity_summary.append(f"numbers: {', '.join(entities['numbers'][:2])}")

    entity_text = "; ".join(entity_summary) if entity_summary else "limited concrete entities detected"

    explanation = (
        f"Text assessed as {predicted_label} with confidence {confidence_score}. "
        f"Key signals: {', '.join(flags) if flags else 'no strong linguistic red flags'}."
    )

    return PredictionResponse(
        success=True,
        input_text=original_text,
        predicted_label=predicted_label,
        confidence_score=confidence_score,
        class_probabilities=final_probs,
        analysis=AnalysisBlock(
            linguistic_flags=flags,
            credibility_assessment=f"{credibility} Entity scan: {entity_text}.",
            fact_check_reasoning=fact_reasoning,
            final_explanation=explanation,
        ),
    )





@app.get("/")
def root():
    return {"message": "Fake News Detection API is running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "vectorizer_loaded": vectorizer is not None,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_news(request: NewsRequest):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty.")
        return _hybrid_detect(request.text)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/", response_model=PredictionResponse)
def predict_from_root(request: NewsRequest):
    return predict_news(request)