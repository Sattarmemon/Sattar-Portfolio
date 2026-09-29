import Link from "next/link";
import { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  variant = "dark",
}: {
  project: Project;
  variant?: "dark" | "light";
}) {
  const thumbnail =
    project.coverImage && project.coverImage.length > 0
      ? project.coverImage
      : project.sections && project.sections.length
      ? // prefer the last image in the first section that has images
        (() => {
          const s = project.sections.find((sec) => sec.images && sec.images.length);
          if (!s) return "";
          const imgs = s.images ?? [];
          return imgs[imgs.length - 1] || imgs[0] || "";
        })()
      : "";

  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View case study: ${project.title}`}
      className={`project-card group flex h-full flex-col overflow-hidden rounded-[24px] border text-white transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 ${
        variant === "light"
          ? "border-black/[0.06] bg-[#F8F5F0] text-ink shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-black/[0.09] hover:shadow-[0_12px_34px_rgba(0,0,0,0.07)]"
          : "border-white/[0.06] bg-[#181818] shadow-[0_18px_50px_rgba(0,0,0,0.12)] hover:border-white/[0.12] hover:shadow-[0_28px_70px_rgba(0,0,0,0.24)]"
      }`}
    >
      {thumbnail ? (
        <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-[20px] ${variant === "light" ? "bg-[#eee9e1]" : "bg-[#222]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={project.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 items-center justify-between gap-5 px-6 py-6 md:px-8 md:py-7">
        <div className="min-w-0">
          <p className={`mb-2 text-[11px] font-medium uppercase tracking-[0.16em] ${variant === "light" ? "text-ink/45" : "text-white/45"}`}>
            {project.tag}
          </p>
          <h3 className={`font-display text-[clamp(1.5rem,2.5vw,2.2rem)] leading-[1.05] transition-colors duration-300 group-hover:text-gold ${variant === "light" ? "text-ink" : "text-white"}`}>
            {project.title}
          </h3>
        </div>

        <span className={`project-card-arrow flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:rotate-45 group-hover:bg-white group-hover:text-ink ${variant === "light" ? "border-ink/15 bg-ink/[0.06] text-ink shadow-[0_8px_20px_rgba(0,0,0,0.06)]" : "border-white/15 bg-white/[0.08] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)]"}`} aria-hidden="true">
          <span className="text-xl leading-none">↗</span>
          <span className="sr-only">Open case study</span>
        </span>
      </div>
    </Link>
  );
}
