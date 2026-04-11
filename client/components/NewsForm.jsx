"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldX,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const MIN_LOADING_MS = 10000;
const LOADING_STAGES = [
  {
    label: "Clean",
    detail: "Parsing and cleaning article text",
  },
  {
    label: "Linguistics",
    detail: "Detecting manipulation and clickbait signals",
  },
  {
    label: "Reasoning",
    detail: "Cross-checking plausibility and context",
  },
  {
    label: "Scoring",
    detail: "Finalizing authenticity score",
  },
];

const RESULT_CONFIG = {
  FAKE: {
    label: "Fake News Detected",
    description:
      "Our AI analysis indicates this article contains misinformation or is likely fabricated.",
    icon: ShieldX,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    badgeBg: "bg-red-500/20",
    badgeText: "text-red-300",
    badgeBorder: "border-red-500/30",
    glow: "shadow-red-900/20",
  },
  REAL: {
    label: "News",
    description:
      "Our AI analysis suggests this article appears to be credible and factually consistent.",
    icon: ShieldCheck,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500/30",
    glow: "shadow-emerald-900/20",
  },
};

export default function NewsForm() {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null); // { predicted_label, confidence_score, class_probabilities } | null
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      setLoadingProgress(0);
      return;
    }

    const startedAt = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const linearProgress = Math.min(1, elapsed / MIN_LOADING_MS);
      const easedProgress = 1 - (1 - linearProgress) ** 1.35;
      const nextProgress = Math.min(100, easedProgress * 100);
      setLoadingProgress(nextProgress);
    }, 80);

    return () => clearInterval(intervalId);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");

    if (!newsText.trim()) {
      setError("Please paste a news article before submitting.");
      return;
    }

    if (newsText.trim().split(/\s+/).length < 10) {
      setError("Please enter at least a few sentences for accurate detection.");
      return;
    }

    setLoading(true);
    const minLoadingPromise = new Promise((resolve) =>
      setTimeout(resolve, MIN_LOADING_MS),
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newsText }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const prediction = data.predicted_label?.toUpperCase();
      const confidence = Number(data.confidence_score);
      const probabilities = data.class_probabilities;

      if (prediction !== "FAKE" && prediction !== "REAL") {
        throw new Error("Unexpected response from server.");
      }

      if (Number.isNaN(confidence) || typeof probabilities !== "object" || !probabilities) {
        throw new Error("Unexpected score payload from server.");
      }

      await minLoadingPromise;

      setResult({
        predicted_label: prediction,
        confidence_score: confidence,
        class_probabilities: probabilities,
      });
    } catch (err) {
      await minLoadingPromise;

      if (err.message.includes("fetch")) {
        setError(
          "Unable to reach the server. Make sure your backend is running on port 8000.",
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoadingProgress(100);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNewsText("");
    setResult(null);
    setError("");
  };

  const config = result ? RESULT_CONFIG[result.predicted_label] : null;
  const charCount = newsText.length;
  const wordCount = newsText.trim() ? newsText.trim().split(/\s+/).length : 0;
  const activeStageIndex = Math.min(
    LOADING_STAGES.length - 1,
    Math.floor((loadingProgress / 100) * LOADING_STAGES.length),
  );
  const activeStage = LOADING_STAGES[activeStageIndex];
  const visualProgress = loading ? Math.max(6, loadingProgress) : loadingProgress;

  return (
    <section className="relative w-full flex items-center justify-center bg-[#080e1c] py-20 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-700/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Verification
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Check Your Article
          </h2>
          <p className="text-slate-400 text-base max-w-md mx-auto">
            Paste any news article below and our AI will analyze it for
            authenticity in seconds.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Textarea */}
            <div className="mb-2">
              <label
                htmlFor="news-input"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                News Article
              </label>
              <textarea
                id="news-input"
                value={newsText}
                onChange={(e) => {
                  setNewsText(e.target.value);
                  if (error) setError("");
                  if (result) setResult(null);
                }}
                placeholder="Paste the news article content here..."
                rows={10}
                className={`w-full rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600
                  bg-[#0d1526] border resize-none leading-relaxed
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  transition-colors duration-200 scrollbar-thin
                  ${error ? "border-red-500/50" : "border-white/8 hover:border-white/15"}`}
              />
            </div>

            {/* Meta: word/char count */}
            <div className="flex items-center justify-between mb-5 text-xs text-slate-600">
              <span>
                {wordCount} word{wordCount !== 1 ? "s" : ""}
              </span>
              <span>{charCount} characters</span>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 mb-5 p-3.5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5
                  rounded-xl bg-blue-600 text-white font-semibold text-sm
                  hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600
                  active:scale-[0.98] transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Detect Now
                  </>
                )}
              </button>

              {(newsText || result) && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 bg-white/5
                    text-slate-400 font-semibold text-sm
                    hover:text-white hover:border-white/20 hover:bg-white/10
                    disabled:opacity-40 disabled:cursor-not-allowed
                    active:scale-[0.98] transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Result Card */}
        {config && (
          <div
            className={`mt-5 rounded-2xl border p-6 flex items-start gap-4
              shadow-xl ${config.bg} ${config.border} ${config.glow}
              animate-in fade-in slide-in-from-bottom-3 duration-500`}
          >
            <div
              className={`flex-shrink-0 p-2.5 rounded-xl ${config.badgeBg} border ${config.badgeBorder}`}
            >
              <config.icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h3 className="text-white font-bold text-base">
                  {config.label}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                >
                  {result.predicted_label}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {config.description}
              </p>
              <div className="mt-3 text-xs text-slate-300 space-y-1">
                <p>Confidence: {(result.confidence_score * 100).toFixed(2)}%</p>
                <p>
                  Probabilities: FAKE {((result.class_probabilities?.FAKE ?? 0) * 100).toFixed(2)}% | REAL {((result.class_probabilities?.REAL ?? 0) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state card */}
        {loading && (
          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-900/90 to-blue-950/40 p-6 shadow-2xl shadow-blue-950/30">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-300/25">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm mb-1">
                  Running multi-pass verification
                </p>
                <p className="text-cyan-100/80 text-xs">
                  {activeStage.detail}
                </p>

                <div className="mt-4 h-2 w-full rounded-full bg-slate-800/80 overflow-hidden border border-cyan-300/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-[width] duration-300 ease-out"
                    style={{ width: `${visualProgress}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{activeStage.label}</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>

                
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
