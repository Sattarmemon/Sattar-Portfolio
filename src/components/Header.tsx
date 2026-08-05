"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Journey", href: "#journey" },
  { label: "About", href: "#about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-5 transition-all duration-300 md:px-8">
      <div
        className={`mx-auto flex w-full nav-strip items-center justify-between gap-2 rounded-full border border-ink/10 bg-[#faf6ee] px-2.5 shadow-[0_8px_30px_rgba(26,26,24,0.08)] transition-all duration-300 ${
          scrolled ? "backdrop-blur-2xl bg-[#faf6ee]/90" : ""
        }`}
        style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
      >
        <Link href="/" className="flex items-center pl-1 gap-2 group">
          <span className="inline-flex transition-transform duration-300 group-hover:scale-125">
            <svg viewBox="0 0 256 256" className="brand-icon w-[18px] h-[18px] transition-transform duration-300" fill="currentColor" aria-hidden="true">
              <path d="M 152 70.059 L 201.539 20.519 L 235.48 54.461 L 185.941 104 L 256 104 L 256 152 L 185.941 152 L 235.48 201.539 L 201.539 235.48 L 152 185.941 L 152 256 L 104 256 L 104 185.941 L 54.46 235.48 L 20.52 201.539 L 70.059 152 L 0 152 L 0 104 L 70.059 104 L 20.519 54.46 L 54.461 20.52 L 104 70.059 L 104 0 L 152 0 Z"></path>
            </svg>
          </span>
          <span className="text-base font-medium text-ink">Sattar</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-2.5 py-1 text-sm text-muted transition-colors duration-200 hover:bg-gold/10 hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex">
          <a href="/sattar-cv.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-bg transition duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-bg">
            Resume
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <button aria-label="Toggle menu" className="flex items-center justify-center md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-2 w-full nav-strip rounded-3xl border border-ink/10 bg-[#faf6ee] px-6 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm text-muted transition-colors duration-200 hover:text-gold">
                {item.label}
              </Link>
            ))}
            <a href="/sattar-cv.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors duration-200 hover:text-gold">
              Resume <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}