"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080e1c]">
      {/* ── Gradient mesh background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow top-center */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-700/20 blur-[120px]" />
        {/* Accent glow bottom-left */}
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-800/20 blur-[100px]" />
        {/* Accent glow bottom-right */}
        <div className="absolute bottom-10 right-[-8%] w-[350px] h-[350px] rounded-full bg-cyan-800/15 blur-[100px]" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full
            border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          AI-Powered Fake News Detection
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "120ms" }}
        >
          Detect Fake News{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              in Seconds
            </span>
            {/* Underline accent */}
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 opacity-60" />
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "240ms" }}
        >
          Use AI-powered analysis to instantly verify whether a news article is{" "}
          <span className="text-slate-200 font-medium">real or fake</span>. Stay
          informed. Stay protected.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "360ms" }}
        >
          {/* Primary */}
          <Link
            href="/check"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
              bg-blue-600 text-white font-semibold text-base
              hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30
              active:scale-[0.97]
              transition-all duration-200"
          >
            <ShieldCheck className="w-5 h-5" />
            Check News
            <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          {/* Secondary */}
          <Link
            href="/doc"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
              border border-white/10 bg-white/5 text-slate-300 font-semibold text-base
              hover:border-white/20 hover:bg-white/10 hover:text-white
              active:scale-[0.97]
              transition-all duration-200 backdrop-blur-sm"
          >
            Documentation
          </Link>
        </div>

        {/* Social proof strip */}
        <div
          className={`mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10
            text-sm text-slate-500
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "500ms" }}
        >
          {[
            { value: "99.2%", label: "Detection Accuracy" },
            { value: "<2s", label: "Analysis Speed" },
            { value: "10M+", label: "Articles Checked" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-white font-bold text-lg">{value}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom fade edge ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080e1c] to-transparent pointer-events-none" />
    </section>
  );
}
