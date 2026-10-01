"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const capabilities = [
  {
    index: "01",
    title: "UX Research & Strategy",
    body: "Understanding the brief, the business goal, and the real user problem before a single pixel is placed.",
    tags: ["User research", "Competitor audits", "Journey mapping", "Problem framing"],
  },
  {
    index: "02",
    title: "Architecture & Flows",
    body: "Structuring content and flows so people always know where they are — and where to go next.",
    tags: ["Information architecture", "User flows", "Wireframing", "Low-fi prototyping"],
  },
  {
    index: "03",
    title: "Interface & Visual Design",
    body: "Clean, consistent interfaces with clear hierarchy — built to feel effortless, not empty.",
    tags: ["UI design", "Visual systems", "Typography", "Responsive layouts"],
  },
  {
    index: "04",
    title: "Systems & Prototyping",
    body: "Reusable components and interactive prototypes that keep design and development moving fast.",
    tags: ["Design systems", "Component libraries", "Prototyping", "Handoff"],
  },
];

const cardIcons = [
  <svg key="01" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  <svg key="02" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 17.5h7M17.5 14v7"/></svg>,
  <svg key="03" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="04" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
];

function CapabilityCard({
  cap,
  index,
  total,
  scrollYProgress,
}: {
  cap: (typeof capabilities)[number];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const isLast = index === total - 1;
  const start = index / total;
  const end = Math.min((index + 1) / total, 0.999);
  const scale = useTransform(scrollYProgress, [start, end], isLast ? [1, 1] : [1, 0.92]);
  const y = useTransform(scrollYProgress, [start, end], isLast ? [0, 0] : [0, -24]);
  const stackOffset = index * 10;

  return (
    <div style={{ top: 80 + stackOffset }} className="sticky px-4 md:px-0">
      <motion.div
        style={{ scale, y, transformOrigin: "top center" }}
        className="mx-auto max-w-3xl overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_12px_48px_rgba(26,26,24,0.13)]"
      >
        <div className="p-8 md:p-10">
          <div className="flex items-start justify-between">
            <span className="font-display text-[4.5rem] leading-none tracking-tight text-gold/20 select-none">
              {cap.index}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              {cardIcons[index]}
            </span>
          </div>
          <h3 className="mt-4 font-display text-2xl text-ink md:text-[1.75rem] leading-snug">{cap.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{cap.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
            {cap.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line bg-[#f2ede4] px-3 py-1 text-xs font-medium text-ink/60">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function CapabilitiesStack() {
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: capabilitiesRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={capabilitiesRef} style={{ height: `${capabilities.length * 50 + 50}vh` }}>
      {capabilities.map((cap, index) => (
        <CapabilityCard
          key={cap.index}
          cap={cap}
          index={index}
          total={capabilities.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
