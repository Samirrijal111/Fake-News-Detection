import {
  ShieldCheck,
  Brain,
  Globe,
  Code2,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ML + NLP Core",
    description:
      "Trained on thousands of labeled articles using natural language processing to identify linguistic patterns of misinformation.",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Detection",
    description:
      "Instant verdict on any article via a FastAPI backend, returning REAL or FAKE predictions with sub-second response times.",
  },
  {
    icon: Globe,
    title: "Modern Frontend",
    description:
      "Built with Next.js App Router and Tailwind CSS for a fast, accessible, and fully responsive user experience.",
  },
  {
    icon: Code2,
    title: "Open Architecture",
    description:
      "Clean separation between the ML backend and UI frontend — easy to extend, retrain, or swap models as needed.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080e1c] text-white">
      {/* ── Background glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-700/15 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-indigo-800/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* ── Hero Title ── */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            FakeNews AI
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              This Project
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A full-stack AI application combining machine learning and modern
            web technologies to help people instantly verify the authenticity of
            news articles.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

        {/* ── Project Overview ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Project Overview
            </h2>
          </div>

          <div className="space-y-5 text-slate-400 text-base leading-relaxed">
            <p>
              Misinformation spreads faster than ever in today's digital
              landscape. A single fabricated article can influence public
              opinion, cause panic, or undermine trust in institutions.{" "}
              <span className="text-slate-200 font-medium">FakeNews AI</span>{" "}
              was built to address this challenge — giving anyone a fast,
              reliable tool to fact-check content before sharing it.
            </p>
            <p>
              The system works by feeding article text through a trained{" "}
              <span className="text-slate-200 font-medium">
                Natural Language Processing (NLP) model
              </span>{" "}
              that has learned to distinguish real journalism from fabricated
              content. The ML model is served via a{" "}
              <span className="text-slate-200 font-medium">FastAPI</span>{" "}
              backend, which exposes a simple{" "}
              <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-sm">
                /predict
              </code>{" "}
              endpoint. The Next.js frontend handles user input, sends requests
              to the API, and displays the verdict in real time.
            </p>
            <p>
              The goal is not just to build a working classifier — but to make
              the tool{" "}
              <span className="text-slate-200 font-medium">
                accessible, fast, and trustworthy
              </span>
              . Future plans include confidence scores, source credibility
              checks, and a browser extension for on-the-fly detection while
              browsing the web.
            </p>
          </div>
        </section>

        {/* ── Feature Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 mb-4 group-hover:bg-blue-500/25 transition-colors duration-300">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

        {/* ── Developer Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Developer Information
            </h2>
          </div>

          {/* Developer Card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
            {/* Card top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

            <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-900/40">
                  <span className="text-3xl font-black text-white select-none">
                    SR
                  </span>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#080e1c]"
                    title="Available for work"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Samir Rijal
                </h3>
                <p className="text-blue-400 font-medium text-sm mb-4">
                  Full Stack &amp; ML Developer
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-lg">
                  Passionate about building intelligent web applications that
                  solve real-world problems. Samir combines a strong background
                  in machine learning with modern full-stack development —
                  crafting systems that are both technically rigorous and
                  genuinely useful. FakeNews AI is one of his flagship projects,
                  built to demonstrate the practical application of NLP in
                  everyday tools.
                </p>

                {/* Tech stack tags */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
                  {[
                    "Next.js",
                    "FastAPI",
                    "Python",
                    "Scikit-learn",
                    "Tailwind CSS",
                    "NLP",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/25 bg-blue-500/10 text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social links */}
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  {[
                    {
                      icon: Github,
                      label: "GitHub",
                      href: "https://github.com",
                    },
                    {
                      icon: Linkedin,
                      label: "LinkedIn",
                      href: "https://linkedin.com",
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      href: "mailto:samir@example.com",
                    },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5
                        text-slate-400 text-xs font-medium
                        hover:text-white hover:border-white/20 hover:bg-white/10
                        transition-all duration-200"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer note ── */}
        <p className="text-center text-slate-700 text-sm mt-16">
          Built with Next.js · FastAPI · Tailwind CSS · Scikit-learn
        </p>
      </div>
    </main>
  );
}
