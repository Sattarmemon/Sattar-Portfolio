import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects_work";

export const metadata: Metadata = {
  title: "Work — Sattar Memon",
  description:
    "Case studies across Healthcare, B2B SaaS, Marketplace and Restaurant Tech by Sattar Memon, UI/UX Designer.",
};

export default function WorkPage() {
  return (
    <main className="px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28" data-motion="stagger">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-8 border-b border-line pb-10 md:pb-14">
          <div data-motion-item>
            <p className="frame-tag text-gold">Selected work</p>
            <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] text-ink md:text-7xl">
          Every project, <span className="italic text-accent">start to finish.</span>
            </h1>
          </div>
          <p className="hidden max-w-[190px] pb-1 text-right text-xs leading-relaxed text-muted md:block" data-motion-item>
            {projects.length} products shaped through research, systems, and detail.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 text-ink md:grid-cols-2" data-motion="stagger">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="light" />
          ))}
        </div>
      </div>
    </main>
  );
}
