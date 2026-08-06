"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import SattuImage from "../../Sattu-2.png";

const badgeAnimationStyle = `
  @keyframes badgeFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1.6deg); }
  }

  @keyframes badgeOrbit {
    0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
    50% { transform: rotate(180deg) scale(1.04); opacity: 0.9; }
    100% { transform: rotate(360deg) scale(1); opacity: 0.5; }
  }

  @keyframes badgeGlow {
    0%, 100% {
      box-shadow: 0 14px 42px rgba(0, 0, 0, 0.35), 0 0 0 0 rgba(255, 255, 255, 0.08);
    }
    50% {
      box-shadow: 0 20px 58px rgba(0, 0, 0, 0.42), 0 0 0 12px rgba(255, 255, 255, 0.08);
    }
  }

  .animate-badge-float {
    animation: badgeFloat 4.3s ease-in-out infinite;
  }

  .animate-badge-orbit {
    animation: badgeOrbit 8s linear infinite;
    transform-origin: center;
  }

  .animate-badge-glow {
    animation: badgeGlow 4.6s ease-in-out infinite;
  }

  .badge-label {
    font-size: 0.58rem;
    line-height: 1.15;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
`;

const CARD_ICONS = [
  <svg key="01" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  <svg key="02" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 17.5h7M17.5 14v7"/></svg>,
  <svg key="03" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="04" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
];

// Each card: sticks at same top, scales down as next card arrives on top
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

  // Slightly offset each card so stack is visible
  const stackOffset = index * 10;

  return (
    <div style={{ top: 80 + stackOffset }} className="sticky px-4 md:px-0">
      <motion.div
        style={{ scale, y, transformOrigin: "top center" }}
        className="mx-auto max-w-3xl overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_12px_48px_rgba(26,26,24,0.13)]"
      >


        <div className="p-8 md:p-10">
          {/* Top row: large number left, icon right */}
          <div className="flex items-start justify-between">
            <span className="font-display text-[4.5rem] leading-none tracking-tight text-gold/20 select-none">
              {cap.index}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              {CARD_ICONS[index]}
            </span>
          </div>

          {/* Title + body */}
          <h3 className="mt-4 font-display text-2xl text-ink md:text-[1.75rem] leading-snug">{cap.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{cap.body}</p>

          {/* Tags */}
          <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
            {cap.tags.map((t) => (
              <li key={t} className="rounded-full border border-line bg-[#f2ede4] px-3 py-1 text-xs font-medium text-ink/60">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

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

const journey = [
  {
    period: "Mar 2026 — Present",
    duration: "5 mos",
    role: "User Experience Designer",
    org: "Gohil Infotech",
    location: "Ahmedabad, Gujarat, India — On-site",
    tags: ["User Experience (UX)", "User Interface Design", "Wireframing", "Prototyping"],
  },
  {
    period: "Dec 2024 — Mar 2026",
    duration: "1 yr 4 mos",
    role: "UI/UX & Graphics Designer",
    org: "Hyperlink Infosystem",
    location: "Ahmedabad, Gujarat, India — On-site",
    tags: ["User Experience Design (UED)", "Mobile Application Design", "Visual Design", "Design Systems"],
  },
  {
    period: "Apr 2024 — Dec 2024",
    duration: "9 mos",
    role: "UI/UX & Graphic Designer",
    org: "Impero IT Services Pvt. Ltd.",
    location: "Ahmedabad, Gujarat, India — On-site",
    tags: ["UX Research", "User Flows", "Wireframing", "UI Design", "Figma"],
  },
  {
    period: "Feb 2023 — Mar 2024",
    duration: "1 yr 2 mos",
    role: "UI/UX Designer",
    org: "Konzept Solutions",
    location: "Ahmedabad, Gujarat, India — On-site",
    tags: ["UX Research", "User Flows", "Information Architecture", "Prototyping", "Usability Testing"],
  },
];

const education = [
  {
    period: "2019 – 2021",
    title: "Bachelor of Computer Science (BSC-IT)",
    org: "Saraswati College, Saurashtra University — Dhoraji, Gujarat",
    description: "",
    icon: "degree",
  },
  {
    period: "2018",
    title: "Higher Secondary Certificate",
    org: "Dram International School — Dhoraji, Gujarat",
    description: "12th Standard — Status: Passed",
    icon: "doc",
  },
  {
    period: "2016",
    title: "Secondary School Certificate",
    org: "Dram International School — Dhoraji, Gujarat",
    description: "10th Standard — Status: Passed",
    icon: "check",
  },
  {
    period: "Aug 2022 – Dec 2023",
    title: "UI/UX Design Certified Course",
    org: "TOPS Technologies",
    description: "Wireframing, Prototyping, Figma, User Research, Typography.",
    icon: "layers",
  },
  {
    period: "June 2022 – Aug 2022",
    title: "Adobe Photoshop & Illustrator Course",
    org: "TOPS Technologies",
    description: "Digital editing, vector illustration, image retouching, and design basics.",
    icon: "browser",
  },
  {
    period: "Dec 2022 – Jan 2023",
    title: "Web Designer Certified Course",
    org: "TOPS Technologies",
    description: "HTML, CSS, Responsive Web Design, UI Layouts.",
    icon: "browser",
  },
];

const tools = ["Figma", "Adobe XD", "Photoshop", "Illustrator", "FigJam", "Prototyping"];

export default function Home() {
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: capabilitiesRef,
    offset: ["start start", "end end"],
  });

  return (
    <main>

{/* HERO */}
<section className="relative min-h-screen border-b border-line pt-4 md:pt-0">
  <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 md:px-10 lg:flex-row">

    {/* LEFT */}
    <div className="flex w-full items-center lg:w-1/2">
      <div className="max-w-xl">

        <p className="section-label">
          UI/UX &amp; Product Designer
        </p>

        <h1 className="mt-3 font-display text-[clamp(3rem,6vw,5.8rem)] leading-[0.88] tracking-[-0.03em] text-ink">
          <span className="block font-archivo uppercase text-[clamp(2.4rem,4.8vw,5.2rem)]">
            Every Design Start with
          </span>
          <span className="block font-archivo uppercase text-[clamp(2.4rem,4.8vw,5.2rem)]">
            
 </span>
          <span className="block italic text-gold">
            Empathize
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-muted leading-8">
          I'm Sattar Memon, a UI/UX Designer passionate about
          transforming complex problems into intuitive,
          user-centered digital experiences that create real business impact.
        </p>
        

        <div className="mt-8 flex gap-4">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-7 py-3 text-bg transition duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-bg"
          >
            Explore my work
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-1 rounded-full border border-ink px-7 py-3 transition duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-bg"
          >
            Let's Talk
          </Link>
        </div>

      </div>
    </div>

    {/* RIGHT */}
    <div className="mt-10 flex w-full items-end justify-center lg:mt-0 lg:w-1/2">

      <div className="relative flex w-full max-w-[520px] items-end justify-center overflow-visible">

        <img
          src="/Sattupseditimg2.png"
          alt="Sattar Memon"
          draggable={false}
          className="h-auto w-full object-contain object-bottom select-none"
        />

      </div>

    </div>

  </div>
</section>

      {/* WORK */}
      <section id="work" className="border-t border-white/10 bg-dark px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label">Selected work</p>
              <h2 className="mt-3 font-display text-4xl text-bg md:text-5xl">
                Case <span className="italic">studies</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              Six projects that show how I think — research, structure,
              interface, and outcome — across healthcare, SaaS, and
              on-demand platforms.
            </p>
          </div>

          <div className="mt-14 text-bg">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm text-bg transition-colors hover:bg-bg hover:text-dark"
            >
              All projects →
            </Link>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="border-t border-line bg-[#e8e2d8] px-6 pt-20 pb-0 md:px-10">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-10">
          <p className="section-label">Capabilities</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            What I <span className="italic text-gold">bring</span> to a product team
          </h2>
        </div>

        {/* Scroll-stack: 50vh per card so it's tight */}
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
      </section>

      {/* JOURNEY */}
      <section id="journey" className="border-t border-line bg-dark px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="section-label text-gold/80">Journey</p>
          <h2 className="mt-3 font-display text-4xl text-bg md:text-5xl">
            4 years, <span className="italic">four teams</span>
          </h2>

          <div className="mt-14 divide-y divide-white/10 border-t border-white/10">
            {journey.map((j) => (
              <div key={j.org} className="grid gap-2 py-8 md:grid-cols-[220px_1fr] md:gap-10">
                <span className="frame-tag text-white/40">{j.period}</span>
                <div>
                  <h3 className="font-display text-xl text-bg md:text-2xl">{j.role}</h3>
                  <p className="mt-1 text-sm text-gold">{j.org}</p>
                  <p className="mt-1 text-sm text-white/40">{j.location} &nbsp;·&nbsp; {j.duration}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {j.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <section className="overflow-hidden bg-gold py-6 md:py-8">
        <div className="marquee-track flex w-max items-center gap-5 whitespace-nowrap text-[#fff8f1]">
          {[
            "Interaction Design",
            "UX Research",
            "Design Systems",
            "Prototyping",
            "User Flows",
            "Visual Design",
          ].map((item, index) => (
            <div key={`first-${item}-${index}`} className="flex items-center gap-4 md:gap-5">
              <span className="text-[22px] leading-none text-[#fff8f1] md:text-[30px]">✳</span>
              <span className="font-hero text-[clamp(2.2rem,5vw,4.25rem)] italic leading-none tracking-[-0.03em] text-[#fff8f1]">
                {item}
              </span>
            </div>
          ))}
          {[
            "Interaction Design",
            "UX Research",
            "Design Systems",
            "Prototyping",
            "User Flows",
            "Visual Design",
          ].map((item, index) => (
            <div key={`second-${item}-${index}`} className="flex items-center gap-4 md:gap-5" aria-hidden="true">
              <span className="text-[22px] leading-none text-[#fff8f1] md:text-[30px]">✳</span>
              <span className="font-hero text-[clamp(2.2rem,5vw,4.25rem)] italic leading-none tracking-[-0.03em] text-[#fff8f1]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="section-label">
            Education &amp; Certification
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Academic <span className="italic">background</span>
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {education.map((e, i) => (
              <div
                key={e.title}
                className="group flex flex-col rounded-lg bg-white p-7 opacity-0 transition-transform hover:-translate-y-1 animate-[reveal-up_0.6s_ease_forwards]"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Top row: date + icon */}
                <div className="flex items-start justify-between">
                  <span className="frame-tag text-muted-2">{e.period}</span>
                  <span className="text-gold/70">
                    {e.icon === "degree" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    )}
                    {e.icon === "doc" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    )}
                    {e.icon === "check" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    )}
                    {e.icon === "layers" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    )}
                    {e.icon === "browser" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="8" y1="3" x2="8" y2="9"/></svg>
                    )}
                  </span>
                </div>

                {/* Heading */}
                <h4 className="mt-5 font-display text-lg leading-snug text-ink">{e.title}</h4>

                {/* Institution */}
                {e.org && (
                  <p className="mt-2 text-sm font-medium text-gold">{e.org}</p>
                )}

                {/* Description */}
                {e.description && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{e.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-line bg-surface px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="section-label">About</p>
          <h2 className="mt-1 max-w-2xl font-display text-3xl leading-snug text-ink md:text-5xl">
            I design <span className="italic text-gold">clarity</span> into
            complex systems — turning messy requirements into products people
            genuinely enjoy using.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="pointer-events-none absolute -left-1.5 -top-1.5 h-3 w-3 border-l border-t border-accent/60" />
                <div className="pointer-events-none absolute -right-1.5 -top-1.5 h-3 w-3 border-r border-t border-accent/60" />
                <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b border-l border-accent/60" />
                <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b border-r border-accent/60" />
                <div className="relative overflow-hidden md:overflow-visible border border-line bg-bg">
                  <style>{badgeAnimationStyle}</style>
                  <Image
                    src={SattuImage}
                    alt="Sattu"
                    className="h-full w-full object-cover"
                    priority
                  />
                  <div className="animate-badge-float absolute -bottom-5 -right-6 md:-bottom-6 md:-right-8">
                    <div className="animate-badge-orbit absolute inset-[-10px] rounded-full border border-white/30" />
                    <div className="absolute inset-[-18px] rounded-full border border-white/15" />
                    <div className="animate-badge-glow relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#0f0f0f] text-center text-white md:h-32 md:w-32">
                      <span className="badge-label flex w-[78%] flex-col items-center justify-center font-bold text-white">
                        Human centered
                        <span>design since 2022</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-sm leading-relaxed text-muted">
                Outside of Figma files and prototypes, I stay curious about
                what makes digital products feel effortless — studying
                design systems, exploring AI-assisted design workflows, and
                sharpening my print and branding skills alongside product UI.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                I believe in intentional design — every screen, every flow,
                every interaction should have a reason for existing and
                should make someone&apos;s task a little easier.
              </p>

              <div className="grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                <div>
                  <p className="text-muted-2">Based in</p>
                  <p className="mt-1 text-ink">Ahmedabad, Gujarat, India</p>
                </div>
                <div>
                  <p className="text-muted-2">Education</p>
                  <p className="mt-1 text-ink">B.Sc. Computer Science (IT), Saurashtra University</p>
                </div>
                <div>
                  <p className="text-muted-2">Industries</p>
                  <p className="mt-1 text-ink">
                    Healthcare, SaaS, FinTech, E-commerce, B2B Enterprise, Logistics
                  </p>
                </div>
                <div>
                  <p className="text-muted-2">Tools</p>
                  <p className="mt-1 text-ink">Figma, Adobe XD, Illustrator, Photoshop</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
