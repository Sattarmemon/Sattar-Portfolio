import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects_work";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Sattar Memon`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIdx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(currentIdx + 1) % projects.length];
  const prev = projects[(currentIdx - 1 + projects.length) % projects.length];

  return (
    <main>

      {/* HERO — cream bg to match main site */}
      <section className="bg-bg px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-6xl">

          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted-2"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-display text-4xl leading-tight text-ink md:text-6xl lg:text-7xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {project.summary}
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 text-sm md:grid-cols-4">
            <div>
              <p className="frame-tag text-muted-2">Role</p>
              <p className="mt-2 text-ink">{project.role}</p>
            </div>
            <div>
              <p className="frame-tag text-muted-2">Category</p>
              <p className="mt-2 text-ink">{project.category}</p>
            </div>
            <div>
              <p className="frame-tag text-muted-2">Tools</p>
              <p className="mt-2 text-ink">{project.tools}</p>
            </div>
            <div>
              <p className="frame-tag text-muted-2">Links</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.androidLink ? (
                  <a
                    href={project.androidLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[8px] border border-ink/40 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-ink hover:text-bg"
                  >
                    Android ↗
                  </a>
                ) : null}
                {project.iosLink ? (
                  <a
                    href={project.iosLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[8px] border border-ink/40 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-ink hover:text-bg"
                  >
                    iOS ↗
                  </a>
                ) : null}
                {project.liveLink && !project.androidLink && !project.iosLink ? (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-ink/40 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-ink hover:text-bg"
                  >
                    Live link ↗
                  </a>
                ) : null}
                {project.figmaLink && (
                  <a
                    href={project.figmaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-ink/40 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-ink hover:text-bg"
                  >
                    Figma file ↗
                  </a>
                )}
                {!project.androidLink && !project.iosLink && !project.liveLink && !project.figmaLink ? (
                  <span className="text-muted-2">Coming soon</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COVER IMAGE */}
      <div className="w-full bg-bg px-6 pb-8 pt-2 md:px-10 md:pb-10">
        <div className="mx-auto max-w-6xl">
          {project.coverImage ? (
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[12px]">
              {project.slug === "agentflow" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-auto object-contain object-center"
                />
              ) : (
                <div className="aspect-[16/10] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center border border-dashed border-white/10 bg-white/5">
              <span className="frame-tag text-white/20">Cover image — {project.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* CASE STUDY CONTENT — light bg */}
      <section className="bg-bg px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl">

          <div className="space-y-20">
            {project.sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <span className="frame-tag text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="frame-tag text-muted-2">{section.eyebrow}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl text-ink md:text-4xl">
                  {section.heading}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                  {section.body}
                </p>
                {section.bullets && (
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-ink">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Outcomes */}
          <div className="mt-24 border-t border-line pt-12">
            <p className="section-label">Outcomes</p>
            <div className="mt-8 grid grid-cols-2 gap-px bg-line md:grid-cols-4">
              {project.outcomes.map((o) => (
                <div key={o} className="bg-bg px-6 py-8">
                  <p className="font-display text-lg text-ink">{o}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* NAV — previous / next project */}
      <section className="px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href={`/work/${prev.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-line p-4 transition-colors hover:bg-bg"
            >
              <div className="w-20 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prev.coverImage || '/'} alt={prev.title} className="w-full h-12 object-cover object-center" />
              </div>
              <div>
                <p className="text-xs text-muted-2">Previous project</p>
                <h4 className="mt-1 font-medium text-ink group-hover:text-gold">{prev.title}</h4>
              </div>
              <span className="ml-auto text-ink group-hover:text-gold">←</span>
            </Link>

            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-line p-4 transition-colors hover:bg-bg justify-end"
            >
              <div className="text-right">
                <p className="text-xs text-muted-2">Next project</p>
                <h4 className="mt-1 font-medium text-ink group-hover:text-gold">{next.title}</h4>
              </div>
              <div className="w-20 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={next.coverImage || '/'} alt={next.title} className="w-full h-12 object-cover object-center" />
              </div>
              <span className="ml-3 text-ink group-hover:text-gold">→</span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
