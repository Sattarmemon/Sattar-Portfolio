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
    <main className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="frame-tag text-gold">All work</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-6xl">
          Every project, <span className="italic text-accent">start to finish.</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
          {projects.length} case studies spanning healthcare, B2B SaaS,
          marketplaces and restaurant tech — each one covering the problem,
          the process, and the outcome.
        </p>

        <div className="mt-16 text-ink">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
