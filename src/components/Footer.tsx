"use client";

import { motion } from "framer-motion";
import { useState, type MouseEvent } from "react";

const email = "sattarmemon499@gmail.com";
const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sattar-memon-44193524b",
  },
  {
    label: "Behance",
    href: "https://www.behance.net/sattarmemon1",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/sattar_07",
  },
  {
    label: "Email Me",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=sattarmemon499@gmail.com",
  },
];

const sharedEntrance = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [emailActive, setEmailActive] = useState(false);
  const [emailOffset, setEmailOffset] = useState({ x: 0, y: 0 });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleEmailMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    setEmailOffset({
      x: Math.max(-2.6, Math.min(2.6, relativeX * 2.6)),
      y: Math.max(-2.2, Math.min(2.2, relativeY * 2.2)),
    });
  };

  const resetEmailOffset = () => {
    setEmailOffset({ x: 0, y: 0 });
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#241a14] pt-28 pb-10 text-white">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-[0.5]"
        animate={{ rotate: 360, scale: [1, 1.04, 1] }}
        transition={{
          rotate: { duration: 48, repeat: Infinity, ease: "linear" },
          scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <img
          src="/Star 1.png"
          alt=""
          className="h-full w-full object-contain opacity-80 brightness-[1.35] saturate-[1.15] drop-shadow-[0_0_18px_rgba(232,98,58,0.16)]"
        />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 md:px-10">
        <motion.p
          {...sharedEntrance}
          transition={{ duration: 0.36, delay: 0.04 }}
          className="text-center text-[11px] uppercase tracking-[0.38em] text-gray-400"
        >
          HAVE A COMPLEX PROBLEM WORTH DESIGNING FOR?
        </motion.p>

        <motion.h2
          {...sharedEntrance}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-5xl text-center font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-white"
        >
          Let&apos;s make it <span className="italic text-gold">make sense.</span>
        </motion.h2>

        <motion.div
          {...sharedEntrance}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-3 border-b border-white/30 pb-1.5">
            <a
              href={`mailto:${email}`}
              onMouseEnter={() => setEmailActive(true)}
              onMouseLeave={() => {
                setEmailActive(false);
                resetEmailOffset();
              }}
              onMouseMove={handleEmailMove}
              onFocus={() => setEmailActive(true)}
              onBlur={() => {
                setEmailActive(false);
                resetEmailOffset();
              }}
              className={`footer-email-link ${emailActive ? "is-active" : ""} text-base font-medium text-white md:text-lg`}
              style={{ transform: `translate3d(${emailOffset.x}px, ${emailOffset.y}px, 0)` }}
            >
              <span className="footer-email-text" aria-hidden="true">
                <span className="footer-email-label">{email}</span>
                <span className="footer-email-duplicate">{email}</span>
              </span>
              <span className="footer-email-underline" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy email address"
              className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-200 transition hover:scale-105 hover:border-gold hover:text-gold"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-[#241a14] shadow-lg">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          {...sharedEntrance}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {socials.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -4, scale: 1.02 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-white"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: 0.04 * (index + 1) }}
            >
              <span>{item.label === "LinkedIn" ? "Connect on LinkedIn" : item.label === "Behance" ? "View Behance" : item.label === "Dribbble" ? "View Dribbble" : "Email Me"}</span>
              <span aria-hidden="true">→</span>
            </motion.a>
          ))}
        </motion.div>

        <div className="mt-12 border-t border-gray-600" />

        <div className="mt-5 flex flex-col gap-2 text-center text-[10px] uppercase tracking-[0.18em] text-gray-400 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© 2026 Sattar Memon. All rights reserved.</p>
          <p>UI/UX Designer · Ahmedabad, Gujarat</p>
        </div>
      </div>
    </footer>
  );
}
