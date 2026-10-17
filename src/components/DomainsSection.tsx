"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { getProjectBySlug } from "@/data/projects_work";

const domainMappings = [
  {
    id: "healthcare",
    label: "Healthcare",
    projects: ["hospital-management-system"],
  },
  {
    id: "saas",
    label: "SaaS",
    projects: ["recruit-limitless", "hospital-management-system"],
  },
  {
    id: "restaurant-pos",
    label: "Restaurant POS",
    projects: ["gvoice"],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    projects: ["multiservice-platform"],
  },
  {
    id: "security",
    label: "Security",
    projects: ["2fa-authenticator-app"],
  },
  {
    id: "beauty-lifestyle",
    label: "Beauty & Lifestyle",
    projects: ["30sec-nails-app"],
  },
  {
    id: "photo-creative-tools",
    label: "Photo & Creative Tools",
    projects: ["black-white-photo-editor"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  projects: readonly string[];
}>;

type DomainProject = Pick<Project, "slug" | "title"> & {
  image?: string;
};

function getProjectImage(project: Project): string | undefined {
  if (project.coverImage?.trim()) return project.coverImage;
  return project.sections.find((section) => section.images?.length)?.images?.[0];
}

const domains = domainMappings.map((domain, index) => ({
  ...domain,
  index: String(index + 1).padStart(2, "0"),
  projects: domain.projects.map((slug): DomainProject => {
    const project = getProjectBySlug(slug);
    if (!project) {
      throw new Error(`DomainsSection references unknown project "${slug}".`);
    }

    return {
      slug: project.slug,
      title: project.title,
      image: getProjectImage(project),
    };
  }),
}));

function ProjectImage({
  project,
  className,
}: {
  project: DomainProject;
  className: string;
}) {
  const [failedImage, setFailedImage] = useState<string | undefined>();

  if (!project.image || failedImage === project.image) {
    return <div className={`${className} bg-[#d8d2c6]`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={`${project.title} case study`}
      className={className}
      draggable={false}
      onError={() => setFailedImage(project.image)}
    />
  );
}

export default function DomainsSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hoverQuery = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateHover = () => setIsTouch(hoverQuery.matches);
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches);

    updateHover();
    updateMotion();
    hoverQuery.addEventListener("change", updateHover);
    motionQuery.addEventListener("change", updateMotion);

    return () => {
      hoverQuery.removeEventListener("change", updateHover);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  const activeDomain = domains.find((domain) => domain.id === activeId);

  useEffect(() => {
    if (!activeDomain || activeDomain.projects.length < 2 || isTouch) {
      return;
    }

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % activeDomain.projects.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, [activeDomain, isTouch, prefersReducedMotion]);

  useEffect(() => {
    if (!activeDomain || isTouch || !previewRef.current) return;

    const preview = previewRef.current;
    let animationFrame = 0;

    const animate = () => {
      const current = currentPosition.current;
      const target = targetPosition.current;
      const easing = prefersReducedMotion ? 1 : 0.12;

      current.x += (target.x - current.x) * easing;
      current.y += (target.y - current.y) * easing;
      preview.style.left = `${current.x}px`;
      preview.style.top = `${current.y}px`;

      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeDomain, isTouch, prefersReducedMotion]);

  const setPointerPosition = (x: number, y: number) => {
    targetPosition.current = { x, y };
    if (!previewRef.current) return;
    currentPosition.current = { x, y };
    previewRef.current.style.left = `${x}px`;
    previewRef.current.style.top = `${y}px`;
  };

  const activateDomain = (id: string) => {
    setActiveImageIndex(0);
    setActiveId(id);
  };

  return (
    <section
      aria-labelledby="domains-heading"
      className="bg-bg px-6 py-24 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="domains-heading"
          className="mb-8 text-sm font-medium uppercase tracking-wider text-[#9DB0D0]"
        >
          Domains I design and grow with
        </h2>

        <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          {domains.map((domain) => {
            const isActive = activeId === domain.id;
            const isFaded = activeId !== null && !isActive;
            const primaryProject = domain.projects[0];

            return (
              <li key={domain.id}>
                <Link
                  href={`/work/${primaryProject.slug}`}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "touch" || isTouch) return;
                    setPointerPosition(event.clientX, event.clientY);
                    activateDomain(domain.id);
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType === "touch" || isTouch) return;
                    if (prefersReducedMotion) {
                      setPointerPosition(event.clientX, event.clientY);
                    } else {
                      targetPosition.current = {
                        x: event.clientX,
                        y: event.clientY,
                      };
                    }
                  }}
                  onPointerLeave={(event) => {
                    if (
                      event.pointerType === "touch" ||
                      event.currentTarget.matches(":focus-visible")
                    ) {
                      return;
                    }
                    setActiveId((current) =>
                      current === domain.id ? null : current,
                    );
                  }}
                  onFocus={(event) => {
                    activateDomain(domain.id);
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setPointerPosition(
                      bounds.left + bounds.width / 2,
                      bounds.top + bounds.height / 2,
                    );
                  }}
                  onBlur={() =>
                    setActiveId((current) =>
                      current === domain.id ? null : current,
                    )
                  }
                  onClick={(event) => {
                    if (isTouch && activeId !== domain.id) {
                      event.preventDefault();
                      activateDomain(domain.id);
                    }
                  }}
                  className={`relative inline-flex items-start text-left text-[clamp(2.5rem,7vw,6.5rem)] font-light uppercase leading-[1.05] tracking-[-0.055em] transition-[color,opacity] duration-300 focus-visible:outline-none ${
                    isActive
                      ? "text-[#0A52EF]"
                      : `text-[#1B2B40] ${isFaded ? "opacity-25" : "opacity-100"}`
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-full top-[0.12em] mr-2 text-xs font-normal leading-none tracking-normal text-[#8c8880]"
                  >
                    {domain.index}
                  </span>
                  {domain.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-sm text-muted-2">
          Hover a domain to preview the project. Click to open the case study.
        </p>

        {isTouch && activeDomain ? (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {activeDomain.projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-line bg-white/60 transition-colors hover:border-[#0A52EF]/40 focus-visible:outline-[#0A52EF]"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <ProjectImage
                      project={project}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                  <p className="px-4 py-3 text-sm font-medium text-ink">
                    {project.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-50 h-80 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full transition-[opacity,scale] duration-300 motion-reduce:transition-none ${
          !isTouch && activeDomain
            ? "scale-100 opacity-100"
            : "scale-[0.6] opacity-0"
        }`}
      >
        {activeDomain?.projects.map((project, index) => (
          <div
            key={project.slug}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <ProjectImage
              project={project}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
