"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/doc" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b1120]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
          : "bg-[#0b1120]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="FakeNews AI Home"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/40 group-hover:shadow-blue-700/60 transition-shadow duration-300">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-white font-bold text-lg tracking-tight">
              FakeNews <span className="text-blue-400">AI</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 rounded-lg
                           hover:text-white hover:bg-white/5
                           transition-all duration-200
                           after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-px
                           after:bg-blue-400 after:scale-x-0 after:transition-transform after:duration-200
                           hover:after:scale-x-100 after:origin-left"
              >
                {label}
              </Link>
            ))}

            {/* Login Button */}
            {/* <Link
              href="/login"
              className="ml-3 inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg
                         bg-blue-600 text-white
                         hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30
                         active:scale-[0.97]
                         transition-all duration-200"
            >
              Login
            </Link> */}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block transition-all duration-300 ${
                menuOpen ? "rotate-90 opacity-100" : "rotate-0 opacity-100"
              }`}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0d1526] border-t border-white/5 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-300
                         rounded-lg hover:text-white hover:bg-white/5
                         transition-all duration-200"
            >
              {label}
            </Link>
          ))}

          <div className="pt-2">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold
                         rounded-lg bg-blue-600 text-white
                         hover:bg-blue-500
                         transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
