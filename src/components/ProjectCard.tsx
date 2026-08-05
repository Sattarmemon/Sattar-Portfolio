import Link from "next/link";
import { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col gap-0 border-b border-line/40 py-12 first:pt-0 last:border-none md:flex-row md:items-center md:gap-12 md:py-16"
    >
      {/* Image — large, left */}
      <div className="relative w-full shrink-0 overflow-hidden rounded-2xl md:w-[46%] lg:w-[48%]">
        <div className="aspect-[16/10] w-full overflow-hidden bg-white/5">
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="frame-tag text-white/20">{project.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Text — right */}
      <div className="mt-6 flex flex-1 flex-col md:mt-0 md:justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="frame-tag text-gold">{project.index}</span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-current/20 px-3 py-1 text-xs text-current opacity-70"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-4 font-display text-3xl leading-tight text-inherit transition-colors group-hover:text-gold md:text-4xl lg:text-5xl">
          {project.title}
        </h3>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-current opacity-80">
          {project.summary}
        </p>

        <div className="mt-8 flex items-center gap-2 text-sm text-current opacity-80 transition-colors group-hover:text-gold">
          <span>View case study</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
