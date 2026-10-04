"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { showcaseGraphics } from "@/data/graphics";
import styles from "./GraphicsShowcase.module.css";

export default function GraphicsShowcase() {
  const [failedGraphicIds, setFailedGraphicIds] = useState<Set<string>>(() => new Set());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const availableGraphics = showcaseGraphics.filter((graphic) => !failedGraphicIds.has(graphic.id));
  const visibleGraphics = availableGraphics;
  const useBentoLayout = visibleGraphics.length === 7;
  const selectedGraphic = selectedIndex === null ? null : availableGraphics[selectedIndex];
  const selectedImages = selectedGraphic?.galleryImages ?? [selectedGraphic?.image ?? ""];

  const openLightbox = (graphicId: string) => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const nextIndex = availableGraphics.findIndex((graphic) => graphic.id === graphicId);
    if (nextIndex === -1) return;
    setSelectedIndex(nextIndex);
    setSelectedSlide(0);
  };

  const showRelativeGraphic = (offset: number) => {
    if (!availableGraphics.length) return;

    if (selectedImages.length > 1) {
      setSelectedSlide((currentSlide) =>
        (currentSlide + offset + selectedImages.length) % selectedImages.length,
      );
      return;
    }
    setSelectedIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex + offset + availableGraphics.length) % availableGraphics.length,
    );
    setSelectedSlide(0);
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showRelativeGraphic(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showRelativeGraphic(1);
      } else if (event.key === "Tab") {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (!dialogRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          firstElement.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflow = previousHtmlOverflow;
      previouslyFocusedRef.current?.focus();
    };
    // The open state controls the modal lifecycle; the selected image changes without resetting focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex !== null]);

  const revealVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { staggerChildren: 0.07, delayChildren: 0.04 },
    },
  };

  const tileVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <section id="graphics" className="border-t border-white/10 bg-dark px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label">Selected work</p>
            <h2 className="mt-3 font-display text-4xl text-bg md:text-5xl">Graphic Design</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/50">
            Branding, social media and print work — visuals that communicate at a glance.
          </p>
        </div>

        <motion.div
          className={`${styles.grid} mt-8`}
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <AnimatePresence mode="popLayout">
            {visibleGraphics.map((graphic, index) => {
              const compactDesktopSpan = getLastRowSpan(index, visibleGraphics.length, 4);
              const compactTabletSpan = getLastRowSpan(index, visibleGraphics.length, 2);
              const layout = useBentoLayout ? graphic.layout : { colSpan: 1, rowSpan: 1 };
              const tabletLayout = useBentoLayout ? graphic.tabletLayout : { colSpan: compactTabletSpan, rowSpan: 1 };

              return (
                <motion.button
                  key={graphic.id}
                  type="button"
                  className={`${styles.tile} ${useBentoLayout ? "" : styles.tileCompact}`}
                  style={{
                    "--desktop-col-span": layout.colSpan,
                    "--desktop-row-span": layout.rowSpan,
                    "--tablet-col-span": tabletLayout.colSpan,
                    "--tablet-row-span": tabletLayout.rowSpan,
                    "--compact-desktop-span": compactDesktopSpan,
                    "--image-ratio": `${graphic.imageWidth} / ${graphic.imageHeight}`,
                  } as CSSProperties}
                  variants={tileVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ layout: { duration: prefersReducedMotion ? 0 : 0.28 } }}
                  onClick={() => openLightbox(graphic.id)}
                  aria-label={`Open ${graphic.title}, ${graphic.category}`}
                >
                  <Image
                    src={graphic.image}
                    alt={graphic.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={styles.tileImage}
                    style={{ objectPosition: graphic.objectPosition ?? "center" }}
                    onError={() => {
                      setFailedGraphicIds((failedIds) => {
                        if (failedIds.has(graphic.id)) return failedIds;
                        return new Set(failedIds).add(graphic.id);
                      });
                    }}
                  />
                  <span className={styles.tileOverlay}>
                    <span className={styles.tileCaption}>
                      <span className={styles.tileTitle}>{graphic.title}</span>
                      <span className={styles.tileCategory}>{graphic.category}</span>
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      <AnimatePresence>
        {selectedGraphic ? (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedIndex(null);
            }}
          >
            <motion.div
              ref={dialogRef}
              className={styles.lightbox}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedGraphic.title} graphic`}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.lightboxClose}
                aria-label="Close image viewer"
                onClick={() => setSelectedIndex(null)}
              >
                <X size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxPrevious}`}
                aria-label="Previous graphic"
                onClick={() => showRelativeGraphic(-1)}
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <Image
                src={selectedImages[selectedSlide]}
                alt={`${selectedGraphic.title} presentation ${selectedSlide + 1}`}
                width={1600}
                height={1200}
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 85vw"
                className={styles.lightboxImage}
              />
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
                aria-label="Next graphic"
                onClick={() => showRelativeGraphic(1)}
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
              <div className={styles.lightboxCaption}>
                <strong>{selectedGraphic.title}</strong>
                <span>
                  {selectedGraphic.category}
                  {selectedImages.length > 1 ? ` · ${selectedSlide + 1} / ${selectedImages.length}` : ""}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function getLastRowSpan(index: number, itemCount: number, columnCount: number) {
  const remainingItems = itemCount % columnCount;
  if (remainingItems === 0) return 1;

  const lastRowStart = itemCount - remainingItems;
  if (index < lastRowStart) return 1;
  if (remainingItems === 1) return columnCount;
  if (remainingItems === 2) return columnCount / 2;
  return index === itemCount - 1 ? 2 : 1;
}