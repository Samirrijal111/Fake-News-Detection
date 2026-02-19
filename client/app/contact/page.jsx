import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Facebook,
  Send,
  MapPin,
  MessageSquare,
} from "lucide-react";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "shamrizal100@gmail.com",
    href: "mailto:shamrizal100@gmail.com",
    description: "Send me an email anytime",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    hover: "hover:border-blue-500/50 hover:bg-blue-500/15",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+977-9816338276",
    href: "tel:+9779816338276",
    description: "Available Mon–Fri, 9am–6pm",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    hover: "hover:border-emerald-500/50 hover:bg-emerald-500/15",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/samirrijal",
    href: "https://github.com/samirrijal",
    description: "Check out my projects",
    color: "text-slate-300",
    bg: "bg-white/5",
    border: "border-white/15",
    hover: "hover:border-white/30 hover:bg-white/10",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/samirrijal",
    href: "https://linkedin.com/in/samirrijal",
    description: "Let's connect professionally",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    hover: "hover:border-sky-500/50 hover:bg-sky-500/15",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "facebook.com/samir.rijal.899474",
    href: "https://www.facebook.com/samir.rijal.899474",
    description: "Follow me on Facebook",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    hover: "hover:border-indigo-500/50 hover:bg-indigo-500/15",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kathmandu, Nepal",
    href: "https://www.google.com/maps/place/Jorpati,+44600/@27.7256053,85.3595314,14z/data=!3m1!4b1!4m6!3m5!1s0x39eb1bbeb021a8c3:0xf5da322eefd636cd!8m2!3d27.7278388!4d85.3782068!16s%2Fm%2F04jl70j?authuser=0&entry=ttu&g_ep=EgoyMDI2MDIxNy4wIKXMDSoASAFQAw%3D%3D",
    description: "Nepal Standard Time (UTC+5:45)",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    hover: "hover:border-rose-500/50 hover:bg-rose-500/15",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#080e1c] text-white">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-700/15 blur-[130px]" />
        <div className="absolute bottom-[15%] left-[-5%] w-[300px] h-[300px] rounded-full bg-indigo-700/10 blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[300px] h-[300px] rounded-full bg-cyan-700/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* ── Page Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, collaboration idea, or just want to say hi? Reach
            out through any of the channels below.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Contact Cards ── */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTACT_LINKS.map(
              ({
                icon: Icon,
                label,
                value,
                href,
                description,
                color,
                bg,
                border,
                hover,
              }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`group flex items-start gap-4 p-5 rounded-2xl border ${border} ${bg} ${hover} transition-all duration-250 cursor-pointer`}
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-0.5">
                      {label}
                    </p>
                    <p
                      className={`text-sm font-semibold ${color} truncate mb-0.5`}
                    >
                      {value}
                    </p>
                    <p className="text-xs text-slate-600 leading-snug">
                      {description}
                    </p>
                  </div>
                </a>
              ),
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-700 text-xs mt-8">
          Samir Rijal · Kathmandu, Nepal · All messages are replied within 24
          hours
        </p>
      </div>
    </main>
  );
}
