"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects_work";
import {
  getProjectCoverImage,
} from "@/data/projects";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import styles from "./FeaturedWorkSlider.module.css";

type DragStart = {
  pointerId: number;
  startX: number;
  scrollLeft: number;
};

export default function FeaturedWorkSlider({
  autoSlideMs = 3000,
  pauseOnHover = false,
}: {
  autoSlideMs?: number;
  pauseOnHover?: boolean;
}) {
  const featuredProjects = projects;
  const projectCount = featuredProjects.length;
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());
  const dragStartRef = useRef<DragStart | null>(null);
  const draggedRef = useRef(false);
  const autoSlideIntervalRef = useRef<number | null>(null);
  const autoAnimationFrameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(false);
  const isAutoSlidePausedRef = useRef(false);
  const isInteractionPausedRef = useRef(false);
  const isHoverPausedRef = useRef(false);
  const isInViewportRef = useRef(false);
  const isDocumentVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);
  const activeIndexRef = useRef(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [activeTouchSlug, setActiveTouchSlug] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const pauseForInteraction = useCallback(() => {
    isInteractionPausedRef.current = true;
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractionPausedRef.current = false;
      resumeTimerRef.current = null;
    }, 4000);
  }, []);

  const syncScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setScrollProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 0);

    const trackLeft = track.getBoundingClientRect().left;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    featuredProjects.forEach((project, index) => {
      const card = cardRefs.current.get(project.slug);
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      if (bounds.right <= trackLeft || bounds.left >= trackLeft + track.clientWidth) return;

      const distance = Math.abs(bounds.left - trackLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    if (!isAutoScrollingRef.current) {
      setActiveIndex(nearestIndex);
      activeIndexRef.current = nearestIndex;

      if (isTouchDevice) {
        setActiveTouchSlug(featuredProjects[nearestIndex]?.slug ?? null);
      }
    }
  }, [featuredProjects, isTouchDevice]);
  const syncScrollStateRef = useRef(syncScrollState);
  useEffect(() => {
    syncScrollStateRef.current = syncScrollState;
  }, [syncScrollState]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.12 },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.intersectionRatio >= 0.2;
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    visibilityObserver.observe(section);
    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(hover: none)");
    const updatePreferences = () => {
      prefersReducedMotionRef.current = motionQuery.matches;
      setPrefersReducedMotion(motionQuery.matches);
      setIsTouchDevice(touchQuery.matches);
    };
    const updateDocumentVisibility = () => {
      isDocumentVisibleRef.current = document.visibilityState === "visible";
    };
    updatePreferences();
    updateDocumentVisibility();
    motionQuery.addEventListener("change", updatePreferences);
    touchQuery.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", updateDocumentVisibility);
    return () => {
      motionQuery.removeEventListener("change", updatePreferences);
      touchQuery.removeEventListener("change", updatePreferences);
      document.removeEventListener("visibilitychange", updateDocumentVisibility);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncScrollStateRef.current();

    const observer = new IntersectionObserver(
      () => syncScrollState(),
      { root: track, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    cardRefs.current.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [syncScrollState]);

  useEffect(() => {
    if (autoSlideMs <= 0 || projectCount < 2) return;
    const trackElement = trackRef.current;
    if (!trackElement) return;

    const advance = () => {
      const track = trackRef.current;
      if (
        !track ||
        isAutoSlidePausedRef.current ||
        isInteractionPausedRef.current ||
        isHoverPausedRef.current ||
        !isInViewportRef.current ||
        !isDocumentVisibleRef.current
      ) {
        return;
      }

      const nextIndex = (activeIndexRef.current + 1) % projectCount;
      const card = cardRefs.current.get(projects[nextIndex].slug);
      if (!card) return;

      if (autoAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(autoAnimationFrameRef.current);
      }
      isAutoScrollingRef.current = true;
      const originalSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = "none";

      const start = track.scrollLeft;
      const target =
        start +
        card.getBoundingClientRect().left -
        track.getBoundingClientRect().left;

      if (prefersReducedMotionRef.current) {
        track.scrollLeft = target;
        syncScrollStateRef.current();
        track.style.scrollSnapType = originalSnap;
        isAutoScrollingRef.current = false;
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        return;
      }

      const duration = 700;
      let startTime: number | null = null;
      const animate = (time: number) => {
        if (startTime === null) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        track.scrollLeft = start + (target - start) * eased;

        if (progress < 1) {
          autoAnimationFrameRef.current = window.requestAnimationFrame(animate);
          return;
        }

        track.scrollLeft = target;
        syncScrollStateRef.current();
        track.style.scrollSnapType = originalSnap;
        isAutoScrollingRef.current = false;
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        autoAnimationFrameRef.current = null;
      };
      autoAnimationFrameRef.current = window.requestAnimationFrame(animate);
    };

    autoSlideIntervalRef.current = window.setInterval(advance, autoSlideMs);
    return () => {
      if (autoSlideIntervalRef.current !== null) {
        window.clearInterval(autoSlideIntervalRef.current);
        autoSlideIntervalRef.current = null;
      }
      if (autoAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(autoAnimationFrameRef.current);
        autoAnimationFrameRef.current = null;
      }
      trackElement.style.scrollSnapType = "";
      isAutoScrollingRef.current = false;
    };
  }, [autoSlideMs, projectCount]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const track = trackRef.current;
      const card = cardRefs.current.get(featuredProjects[index]?.slug ?? "");
      if (!track || !card) return;

      const offset = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
      pauseForInteraction();
      track.scrollTo({ left: track.scrollLeft + offset, behavior });
    },
    [featuredProjects, pauseForInteraction],
  );

  const handleKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const nextIndex = index + (event.key === "ArrowRight" ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= featuredProjects.length) return;

    event.preventDefault();
    pauseForInteraction();
    scrollToIndex(nextIndex, prefersReducedMotion ? "auto" : "smooth");
    cardRefs.current.get(featuredProjects[nextIndex].slug)?.focus({
      preventScroll: true,
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLUListElement>) => {
    pauseForInteraction();
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    draggedRef.current = false;
  };

  const handlePointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;

    const distance = event.clientX - dragStart.startX;
    if (!draggedRef.current && Math.abs(distance) <= 6) return;
    pauseForInteraction();

    if (!draggedRef.current) {
      draggedRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = dragStart.scrollLeft - distance;
  };

  const finishPointerDrag = (event: PointerEvent<HTMLUListElement>) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) return;
    dragStartRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (draggedRef.current) {
      window.setTimeout(() => {
        draggedRef.current = false;
      }, 0);
    }
  };

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    const firstCard = cardRefs.current.get(featuredProjects[0].slug);
    if (!track || !firstCard) return;

    pauseForInteraction();
    const distance = firstCard.getBoundingClientRect().width + 8;
    const target = Math.max(
      0,
      Math.min(track.scrollLeft + distance * direction, track.scrollWidth - track.clientWidth),
    );
    track.scrollTo({
      left: target,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const isAtStart = scrollProgress <= 0.001;
  const isAtEnd = scrollProgress >= 0.999;

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`${styles.section} ${hasEntered ? styles.isVisible : ""}`}
      aria-labelledby="featured-work-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className="section-label">Selected work</p>
            <h2 id="featured-work-heading" className={styles.heading}>
              Case <span>studies</span>
            </h2>
          </div>

          <div className={styles.controls}>
            <span className={styles.counter} aria-live="polite" aria-atomic="true">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(featuredProjects.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Previous project"
              disabled={isAtStart}
              onClick={() => scrollByCard(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Next project"
              disabled={isAtEnd}
              onClick={() => scrollByCard(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
            <Link href="/work" className={styles.viewAllLink}>
              View all projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <div className={styles.sliderFrame}>
          <ul
            ref={trackRef}
            aria-label="Featured projects"
            aria-roledescription="horizontal slider"
            className={`${styles.track} ${isDragging ? styles.dragging : ""}`}
            onScroll={syncScrollState}
            onWheel={pauseForInteraction}
            onKeyDownCapture={pauseForInteraction}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => {
              finishPointerDrag(event);
              pauseForInteraction();
            }}
            onPointerCancel={(event) => {
              finishPointerDrag(event);
              pauseForInteraction();
            }}
            onPointerEnter={(event) => {
              if (pauseOnHover && event.pointerType === "mouse") {
                isHoverPausedRef.current = true;
              }
            }}
            onPointerLeave={(event) => {
              if (pauseOnHover && event.pointerType === "mouse") {
                isHoverPausedRef.current = false;
              }
            }}
            onClickCapture={(event) => {
              if (!draggedRef.current) return;
              event.preventDefault();
              event.stopPropagation();
              draggedRef.current = false;
            }}
          >
            {featuredProjects.map((project, index) => {
              const image = project.cardImage ?? getProjectCoverImage(project);
              const isTouchActive = activeTouchSlug === project.slug;
              const href = `/work/${project.slug}`;
              const category = project.tag || project.category || "Case Study";

              return (
                <li key={project.slug} className={styles.card}>
                  <Link
                    ref={(element) => {
                      if (element) cardRefs.current.set(project.slug, element);
                      else cardRefs.current.delete(project.slug);
                    }}
                    href={href}
                    prefetch={false}
                    aria-label={`View case study: ${project.title}`}
                    className={`${styles.cardLink} ${isTouchActive ? styles.touchActive : ""}`}
                    style={{ transitionDelay: `${index * 70}ms` }}
                    onMouseEnter={() => router.prefetch(href)}
                    onFocus={() => router.prefetch(href)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    {image && !failedImages.has(project.slug) ? (
                      <div className={styles.imageFrame}>
                        <Image
                          src={image}
                          alt={project.coverImageAlt || project.title}
                          fill
                          quality={95}
                          priority={index === 0}
                          sizes="(max-width: 768px) 80vw, 345px"
                          draggable={false}
                          className={styles.image}
                          style={{ objectPosition: project.focal ?? "center" }}
                          onError={() => {
                            setFailedImages((previous) =>
                              new Set(previous).add(project.slug),
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <div className={styles.imagePlaceholder} aria-hidden="true" />
                    )}
                    <div className={styles.wash} aria-hidden="true" />
                    <span className={styles.category}>{category}</span>
                    <span className={styles.title}>{project.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.scrollIndicator} aria-hidden="true">
            <span>Scroll</span>
            <span className={styles.progressTrack}>
              <span
                className={styles.progressFill}
                style={{ transform: `scaleY(${scrollProgress})` }}
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
