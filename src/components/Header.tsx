"use client";
import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
  const [activeSection, setActiveSection] = useState("work");

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleSectionNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    const header = document.querySelector<HTMLElement>("header");
    const offset = (header?.offsetHeight ?? 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.history.pushState(null, "", href);
    window.scrollTo({ top, behavior: "smooth" });
    setActiveSection(href.slice(1));
    closeMenu();
  };

  const handleCvDownload = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const link = document.createElement("a");
    link.href = "/SattarfinalCV.pdf";
    link.download = "SattarfinalCV.pdf";
    link.rel = "noopener noreferrer";
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <header className="fixed top-0 z-50 w-full px-4 pt-4 md:px-8">
      <div
        className={`mx-auto flex w-full nav-strip items-center justify-between gap-2 rounded-full border border-ink/10 bg-[#faf6ee] px-5 py-2.5 h-[64px] md:px-2.5 md:py-[0.4375rem] md:h-auto shadow-[0_8px_30px_rgba(26,26,24,0.08)] transition-all duration-300 ${
          scrolled ? "backdrop-blur-2xl bg-[#faf6ee]/90" : ""
        }`}
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
            <Link key={item.href} href={item.href} onClick={(event) => handleSectionNavigation(event, item.href)} className={`rounded-full px-2.5 py-1 text-sm transition-colors duration-200 hover:bg-gold/10 hover:text-gold ${activeSection === item.href.slice(1) ? "bg-gold/10 text-gold" : "text-muted"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex">
          <a
            href="/SattarfinalCV.pdf"
            onClick={handleCvDownload}
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-bg transition duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-bg"
          >
            Resume
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <button aria-label="Toggle menu" className="flex items-center justify-center md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
        </button>
      </div>
    </header>

    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[55] bg-[#f7efe4]/80 backdrop-blur-[12px] md:hidden"
            onClick={closeMenu}
          />
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))] md:hidden"
          >
            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col rounded-[32px] border border-black/10 bg-[#f7efe4]/95 p-4 shadow-[0_20px_70px_rgba(15,15,15,0.16)]">
              <div className="flex items-center justify-end">
                <button
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors duration-200 hover:bg-[#E56A2E] hover:text-white"
                  onClick={closeMenu}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 flex-1">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.24, ease: "easeOut", delay: index * 0.06 }}
                      className="group"
                    >
                      <Link
                        href={item.href}
                        onClick={(event) => handleSectionNavigation(event, item.href)}
                        className={`flex min-h-[56px] items-center gap-4 border-b border-black/10 py-4 transition-colors duration-200 hover:text-[#E56A2E] ${activeSection === item.href.slice(1) ? "text-[#E56A2E]" : ""}`}
                      >
                        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#E56A2E]">
                          {`0${index + 1}`}
                        </span>
                        <span className="font-display text-[1.95rem] leading-none tracking-[-0.02em] text-ink sm:text-[2.2rem]">
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: "easeOut", delay: navItems.length * 0.06 + 0.04 }}
                href="/SattarfinalCV.pdf"
                onClick={(event) => {
                  closeMenu();
                  handleCvDownload(event);
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-bg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E56A2E]"
              >
                Resume <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}