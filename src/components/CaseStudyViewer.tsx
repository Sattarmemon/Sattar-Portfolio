"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./CaseStudyViewer.module.css";

export type CaseStudySlide = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type CaseStudyViewerProps = {
  slides: CaseStudySlide[];
  buttonLabel: string;
  title?: string;
};

export default function CaseStudyViewer({
  slides,
  buttonLabel,
  title = "Case Study",
}: CaseStudyViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstSlide = slides[0];
    if (!firstSlide) return;

    const image = new window.Image();
    image.src = firstSlide.src;
  }, [slides]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scrollRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key !== "Tab") return;

    const closeButton =
      dialogRef.current?.querySelector<HTMLButtonElement>("button");
    if (!closeButton) return;

    if (
      document.activeElement === scrollRef.current ||
      document.activeElement === closeButton
    ) {
      event.preventDefault();
      if (document.activeElement === scrollRef.current) closeButton.focus();
      else scrollRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-bg transition duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {buttonLabel}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="M11 3h6v6M17 3l-8 8M15 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={styles.viewer}
              onKeyDown={handleKeyDown}
            >
              <header className={styles.topBar}>
                <span className={styles.title}>{title}</span>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close case study"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={styles.closeIcon}
                  >
                    <path
                      d="m6 6 12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </header>

              <div
                ref={scrollRef}
                className={styles.scrollContainer}
                tabIndex={-1}
                aria-label="Full case study"
              >
                <div className={styles.imageColumn}>
                  {slides.map((slide, index) => (
                    <img
                      key={slide.src}
                      src={slide.src}
                      alt={slide.alt}
                      width={slide.width}
                      height={slide.height}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className={styles.slideImage}
                    />
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
