"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  ExternalLink,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const TOC = [
  { id: "introduction", label: "1. Introduction" },
  { id: "problem-statement", label: "2. Problem Statement" },
  { id: "objectives", label: "3. Objectives" },
  { id: "scope", label: "4. Scope" },
  { id: "significance", label: "5. Significance" },
  { id: "literature-review", label: "6. Literature Review" },
  { id: "methodology", label: "7. Proposed Methodology" },
  { id: "system-requirements", label: "8. System Requirements" },
  { id: "architecture", label: "9. System Architecture" },
  { id: "modules", label: "10. Modules & Functional Description" },
  { id: "deliverables", label: "11. Expected Deliverables" },
  { id: "timeline", label: "12. Project Timeline" },
  { id: "limitations", label: "13. Limitations" },
  { id: "future", label: "14. Future Enhancements" },
  { id: "conclusion", label: "15. Conclusion" },
  { id: "references", label: "16. References" },
];

const MODULES = [
  {
    name: "User Interface (Next.js)",
    description:
      "Accepts user input via a textarea, triggers API calls, and renders the prediction result with clear FAKE/REAL indicators.",
  },
  {
    name: "API Gateway (FastAPI)",
    description:
      "Exposes a POST /predict endpoint. Validates incoming JSON, passes text to the ML pipeline, and returns the prediction.",
  },
  {
    name: "Text Preprocessing",
    description:
      "Cleans raw input by removing stop words, HTML tags, special characters, and applying tokenization and stemming/lemmatization.",
  },
  {
    name: "Feature Extraction (TF-IDF)",
    description:
      "Converts processed text into numerical feature vectors using TF-IDF, capturing term frequency and inverse document frequency.",
  },
  {
    name: "ML Classification Model",
    description:
      "Trained classifier (Logistic Regression / Passive Aggressive) that outputs FAKE or REAL based on the feature vector.",
  },
  {
    name: "Result Display Module",
    description:
      "Frontend component rendering color-coded verdict cards, confidence indicators, and user-friendly explanations.",
  },
];

const TIMELINE = [
  {
    week: "Week 1–2",
    activity:
      "Research, literature review, dataset collection and initial analysis",
  },
  {
    week: "Week 3–4",
    activity: "Data preprocessing, feature engineering, and model training",
  },
  {
    week: "Week 5–6",
    activity: "Model evaluation, hyperparameter tuning, and saving pipeline",
  },
  {
    week: "Week 7–8",
    activity: "FastAPI backend development and /predict endpoint testing",
  },
  {
    week: "Week 9–10",
    activity: "Next.js frontend development (UI components, API integration)",
  },
  {
    week: "Week 11",
    activity: "End-to-end integration testing, bug fixing, and UI refinement",
  },
  {
    week: "Week 12",
    activity: "Documentation, final review, and project submission",
  },
];

const REFERENCES = [
  "Ahmed, H., Traore, I., & Saad, S. (2017). Detection of Online Fake News Using N-Gram Analysis and Machine Learning Techniques. Springer.",
  "Shu, K., Sliva, A., Wang, S., Tang, J., & Liu, H. (2017). Fake News Detection on Social Media: A Data Mining Perspective. ACM SIGKDD.",
  "Pérez-Rosas, V., Kleinberg, B., Lefevre, A., & Mihalcea, R. (2018). Automatic Detection of Fake News. COLING.",
  "Rashkin, H., Choi, E., Jang, J. Y., Volkova, S., & Choi, Y. (2017). Truth of Varying Shades. EMNLP.",
  "Kaggle. (2020). Fake and Real News Dataset. https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset",
  "FastAPI Documentation. https://fastapi.tiangolo.com",
  "Next.js Documentation. https://nextjs.org/docs",
  "Scikit-learn Documentation. https://scikit-learn.org",
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeading({ id, number, title }) {
  return (
    <div className="flex items-center gap-3 mb-5" id={id}>
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 text-xs font-bold">
        {number}
      </span>
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}

function SectionCard({ children }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 sm:p-8 mb-8">
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed"
        >
          <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-blue-500/25 bg-blue-500/10 text-blue-300 mr-2 mb-2">
      {children}
    </span>
  );
}

function DiagramPlaceholder({ label }) {
  return (
    <div className="my-5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center py-12 gap-2">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-1">
        <BookOpen className="w-5 h-5 text-slate-600" />
      </div>
      <p className="text-slate-600 text-sm font-medium">
        [Diagram Placeholder]
      </p>
      <p className="text-slate-700 text-xs">{label}</p>
    </div>
  );
}

function SubHeading({ children }) {
  return (
    <h3 className="text-base font-semibold text-slate-200 mt-5 mb-2">
      {children}
    </h3>
  );
}

function Para({ children }) {
  return (
    <p className="text-slate-400 text-sm leading-relaxed mb-3">{children}</p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocPage() {
  const [tocOpen, setTocOpen] = useState(true);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#080e1c] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-blue-700/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* ── Title Block ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            Project Synopsis
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Fake News Detection:{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              A Machine Learning Approach
            </span>
          </h1>

          {/* Submitted By Card */}
          <div className="mt-8 inline-block text-left rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-6 w-full max-w-lg mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-4">
              Submitted By
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {[
                ["Name", "Samir Rijal"],
                ["Section", "B"],
                ["Student ID", "LC00017002045"],
                ["Program", "Bachelor of Information Technology"],
                ["Faculty", "Faculty of Computer Science and Multimedia"],
                ["Submission Date", "Feb 17, 2026"],
              ].map(([key, val]) => (
                <div key={key} className="col-span-2 sm:col-span-1">
                  <span className="text-slate-600 text-xs">{key}</span>
                  <p className="text-slate-200 font-medium text-sm leading-snug">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table of Contents ── */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 mb-10 overflow-hidden">
          <button
            onClick={() => setTocOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-blue-500/10 transition-colors duration-200"
          >
            <span className="text-blue-300 font-semibold text-sm tracking-wide uppercase">
              Table of Contents
            </span>
            {tocOpen ? (
              <ChevronDown className="w-4 h-4 text-blue-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-400" />
            )}
          </button>
          {tocOpen && (
            <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {TOC.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-sm text-slate-400 hover:text-blue-300 py-1 transition-colors duration-150 flex items-center gap-1.5 group"
                >
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        {/* ══════════════════════════════════════════
            1. Introduction
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="introduction"
            number="1"
            title="Introduction / Background"
          />
          <Para>
            The rapid proliferation of digital media has fundamentally altered
            how information is consumed and shared. While this democratization
            of publishing has many benefits, it has also created fertile ground
            for the spread of misinformation and deliberately fabricated news
            stories — commonly referred to as "fake news."
          </Para>
          <Para>
            Fake news poses a significant threat to democratic processes, public
            health, and social cohesion. Manual fact-checking is slow,
            expensive, and cannot scale to the volume of content published
            daily. Automated detection using{" "}
            <strong className="text-slate-200">Machine Learning (ML)</strong>{" "}
            and{" "}
            <strong className="text-slate-200">
              Natural Language Processing (NLP)
            </strong>{" "}
            offers a promising and scalable alternative — capable of analyzing
            articles in milliseconds.
          </Para>
          <Para>
            This project proposes a full-stack web application that leverages a
            trained NLP classification model served via a FastAPI backend,
            accessible through a modern Next.js frontend. Users can paste any
            article and receive an instant FAKE or REAL verdict.
          </Para>
        </SectionCard>

        {/* ══════════════════════════════════════════
            2. Problem Statement
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="problem-statement"
            number="2"
            title="Problem Statement"
          />
          <Para>
            Despite growing awareness, fake news detection remains an unsolved
            challenge at scale. Key problems this project addresses include:
          </Para>
          <BulletList
            items={[
              "The sheer volume of online content makes manual verification practically impossible.",
              "Average readers often lack the tools or skills to evaluate the credibility of an article.",
              "Existing automated tools are often proprietary, inaccessible, or not user-friendly.",
              "Linguistic manipulation, satire, and biased framing make classification non-trivial.",
              "There is a need for an open, transparent, and fast detection system accessible to all.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            3. Objectives
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="objectives" number="3" title="Objectives" />
          <SubHeading>General Objective</SubHeading>
          <Para>
            To design, develop, and deploy an AI-powered web application that
            can accurately classify news articles as FAKE or REAL using machine
            learning and NLP techniques.
          </Para>
          <SubHeading>Specific Objectives</SubHeading>
          <BulletList
            items={[
              "Collect, preprocess, and analyze a labeled fake news dataset.",
              "Train and evaluate multiple ML classifiers and select the best-performing model.",
              "Build a RESTful FastAPI backend that serves predictions via a /predict endpoint.",
              "Develop a clean, responsive Next.js frontend for user interaction.",
              "Integrate the frontend and backend into a seamless full-stack application.",
              "Ensure the system achieves at least 90% classification accuracy on the test set.",
              "Document the system thoroughly for reproducibility and future extension.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            4. Scope
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="scope" number="4" title="Scope" />
          <Para>This project covers the following areas:</Para>
          <BulletList
            items={[
              "Binary classification of English-language news articles (FAKE or REAL).",
              "Text-based analysis only — no image, audio, or video content analysis.",
              "Training on publicly available labeled datasets (e.g., Kaggle Fake and Real News Dataset).",
              "A FastAPI backend deployed locally or on a cloud platform.",
              "A Next.js frontend accessible via web browser on desktop and mobile.",
              "Basic error handling, input validation, and user feedback mechanisms.",
            ]}
          />
          <SubHeading>Out of Scope</SubHeading>
          <BulletList
            items={[
              "Real-time social media monitoring or scraping.",
              "Multilingual news detection (non-English articles).",
              "Source credibility scoring or URL-based analysis.",
              "User authentication, accounts, or history storage.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            5. Significance
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="significance" number="5" title="Significance" />
          <Para>
            This project contributes to the growing field of computational
            journalism and information integrity. Its significance includes:
          </Para>
          <BulletList
            items={[
              "Empowering ordinary users with an accessible, instant tool for news verification.",
              "Demonstrating the practical application of NLP and ML in a real-world web context.",
              "Providing an open-architecture template that can be extended with more advanced models.",
              "Raising awareness about misinformation and encouraging critical media consumption.",
              "Serving as a practical academic artifact demonstrating full-stack ML integration skills.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            6. Literature Review
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="literature-review"
            number="6"
            title="Literature Review"
          />
          <Para>
            Research in automated fake news detection has expanded significantly
            since 2016. Several key approaches have been identified in the
            literature:
          </Para>
          <SubHeading>Linguistic Pattern Analysis</SubHeading>
          <Para>
            Ahmed et al. (2017) demonstrated that N-gram based feature
            extraction combined with Linear SVM achieves high accuracy on binary
            fake news classification. Fake articles tend to use more emotionally
            charged vocabulary, superlatives, and informal language.
          </Para>
          <SubHeading>Sentiment & Stylistic Analysis</SubHeading>
          <Para>
            Rashkin et al. (2017) found that propaganda-style writing exhibits
            distinct stylistic markers — including hedge words, exaggerated
            claims, and absence of attribution. Sentiment polarity features can
            complement lexical approaches.
          </Para>
          <SubHeading>Source Credibility</SubHeading>
          <Para>
            Shu et al. (2017) proposed a framework combining content-based
            features with social context (shares, user reactions) for improved
            detection. While effective, social signals are not available for
            real-time text-only analysis — motivating a purely text-driven
            approach.
          </Para>
          <SubHeading>Deep Learning Approaches</SubHeading>
          <Para>
            More recent work explores BERT and transformer-based models for
            contextual understanding. While more accurate, these require
            significant compute resources. This project focuses on classical ML
            for accessibility and speed.
          </Para>
        </SectionCard>

        {/* ══════════════════════════════════════════
            7. Methodology
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="methodology"
            number="7"
            title="Proposed Methodology / System Approach"
          />
          <SubHeading>Development Model</SubHeading>
          <Para>
            An{" "}
            <strong className="text-slate-200">Agile iterative approach</strong>{" "}
            is used, with development broken into sprints covering data
            preparation, model training, backend development, and frontend
            integration.
          </Para>
          <SubHeading>Workflow</SubHeading>
          <BulletList
            items={[
              "Data Collection: Acquire labeled FAKE/REAL dataset from Kaggle.",
              "Preprocessing: Clean text (remove HTML, stop words, punctuation), tokenize, lemmatize.",
              "Feature Extraction: Apply TF-IDF vectorization to convert text to numeric features.",
              "Model Training: Train Logistic Regression and Passive Aggressive classifiers; evaluate using accuracy, precision, recall, F1.",
              "Model Serialization: Save trained model and vectorizer using Joblib/Pickle.",
              "Backend API: Build FastAPI app that loads the model and exposes POST /predict.",
              "Frontend UI: Build Next.js app with form input, API calls, and result display.",
              "Integration & Testing: End-to-end testing and bug fixing.",
            ]}
          />
          <SubHeading>Tools & Technologies</SubHeading>
          <div className="flex flex-wrap mt-3">
            {[
              "Python",
              "Scikit-learn",
              "Pandas",
              "NumPy",
              "NLTK",
              "FastAPI",
              "Uvicorn",
              "Joblib",
              "Next.js 14",
              "Tailwind CSS",
              "Lucide React",
              "Vercel",
            ].map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            8. System Requirements
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="system-requirements"
            number="8"
            title="System Requirements"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <SubHeading>Hardware Requirements</SubHeading>
              <BulletList
                items={[
                  "Processor: Intel Core i5 or equivalent (i7 recommended for training)",
                  "RAM: Minimum 8 GB (16 GB recommended)",
                  "Storage: At least 5 GB free disk space",
                  "Internet connection for API calls and package installation",
                ]}
              />
            </div>
            <div>
              <SubHeading>Software Requirements</SubHeading>
              <BulletList
                items={[
                  "OS: Windows 10 / macOS / Ubuntu 20.04+",
                  "Python 3.9+",
                  "Node.js 18+ and npm / yarn",
                  "FastAPI + Uvicorn",
                  "Scikit-learn, Pandas, NLTK",
                  "Next.js 14 (App Router)",
                  "Git for version control",
                ]}
              />
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            9. Architecture
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="architecture"
            number="9"
            title="System Architecture / Design"
          />
          <Para>
            The system follows a{" "}
            <strong className="text-slate-200">
              client-server architecture
            </strong>{" "}
            with three distinct layers:
          </Para>
          <BulletList
            items={[
              "Presentation Layer: Next.js frontend — user inputs article text, result is displayed.",
              "Application Layer: FastAPI backend — receives POST /predict, runs the ML pipeline, returns JSON.",
              "ML Layer: Pre-trained Scikit-learn pipeline — TF-IDF vectorizer + classifier loaded at server startup.",
            ]}
          />
          <DiagramPlaceholder label="System Architecture Diagram (Client → FastAPI → ML Model)" />
          <DiagramPlaceholder label="Data Flow Diagram (User Input → Preprocess → Vectorize → Classify → Result)" />
        </SectionCard>

        {/* ══════════════════════════════════════════
            10. Modules
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="modules"
            number="10"
            title="Modules & Functional Description"
          />
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-semibold py-3 pr-6 whitespace-nowrap">
                    Module
                  </th>
                  <th className="text-left text-slate-400 font-semibold py-3">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/[0.015] transition-colors duration-150"
                  >
                    <td className="py-3 pr-6 text-blue-300 font-medium whitespace-nowrap align-top">
                      {mod.name}
                    </td>
                    <td className="py-3 text-slate-400 leading-relaxed">
                      {mod.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            11. Deliverables
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading
            id="deliverables"
            number="11"
            title="Expected Output / Deliverables"
          />
          <BulletList
            items={[
              "A trained and serialized ML model pipeline (model.pkl + vectorizer.pkl).",
              "A FastAPI backend application with documented /predict endpoint.",
              "A fully responsive Next.js web application with Navbar, Hero, NewsForm, and About pages.",
              "End-to-end integration between frontend and backend.",
              "A project synopsis / documentation page (this document).",
              "Source code hosted on GitHub with a clear README.",
              "A final project report and presentation.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            12. Timeline
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="timeline" number="12" title="Project Timeline" />
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-semibold py-3 pr-6 whitespace-nowrap">
                    Period
                  </th>
                  <th className="text-left text-slate-400 font-semibold py-3">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIMELINE.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/[0.015] transition-colors duration-150"
                  >
                    <td className="py-3 pr-6 text-blue-300 font-medium whitespace-nowrap align-top">
                      {row.week}
                    </td>
                    <td className="py-3 text-slate-400 leading-relaxed">
                      {row.activity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            13. Limitations
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="limitations" number="13" title="Limitations" />
          <BulletList
            items={[
              "The model is trained on English-language data only and will perform poorly on other languages.",
              "Classical ML models may struggle with nuanced satire or highly sophisticated misinformation.",
              "The system relies entirely on text content — fabricated but well-written articles may evade detection.",
              "Model accuracy is bounded by the quality and diversity of the training dataset.",
              "No real-time data pipeline; the model reflects the state of news patterns at training time.",
              "The application does not verify the source URL or cross-check facts against external databases.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            14. Future Enhancements
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="future" number="14" title="Future Enhancements" />
          <BulletList
            items={[
              "Integrate transformer-based models (BERT, RoBERTa) for improved contextual understanding.",
              "Add a confidence score / probability output alongside FAKE/REAL prediction.",
              "Support multilingual detection using multilingual NLP models.",
              "Develop a browser extension for on-the-fly detection while browsing news websites.",
              "Incorporate source credibility analysis and URL verification.",
              "Add user accounts with detection history and bookmarking.",
              "Deploy to cloud infrastructure (Vercel + Railway / AWS) for public access.",
              "Build an admin dashboard to retrain the model with new data over time.",
            ]}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            15. Conclusion
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="conclusion" number="15" title="Conclusion" />
          <Para>
            The <strong className="text-slate-200">Fake News Detection</strong>{" "}
            project addresses one of the most pressing challenges of the digital
            information age. By combining classical NLP techniques with a modern
            full-stack web architecture, this project delivers a practical,
            accessible tool that empowers users to verify news content in real
            time.
          </Para>
          <Para>
            The system demonstrates the effective integration of machine
            learning into a production-grade web application — covering the
            complete lifecycle from data preprocessing and model training to API
            development and frontend design. The chosen architecture is
            intentionally modular, making it straightforward to upgrade the ML
            core, extend functionality, or adapt the system to new domains.
          </Para>
          <Para>
            This project not only fulfills the academic requirements of the
            Bachelor of Information Technology program but also contributes a
            meaningful artifact toward combating misinformation and promoting
            informed media consumption.
          </Para>
        </SectionCard>

        {/* ══════════════════════════════════════════
            16. References
        ══════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeading id="references" number="16" title="References" />
          <ol className="space-y-3 mt-2">
            {REFERENCES.map((ref, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                  {i + 1}
                </span>
                <span>{ref}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        {/* Footer */}
        <p className="text-center text-slate-700 text-xs mt-8">
          Samir Rijal · LC00017002075 · Bachelor of Information Technology · Feb
          2026
        </p>
      </div>
    </main>
  );
}
