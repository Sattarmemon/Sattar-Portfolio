"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export default function PageLoader() {
  const [loaded, setLoaded] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBrand, setShowBrand] = useState(false);
  const [showLineOne, setShowLineOne] = useState(false);
  const [showLineTwo, setShowLineTwo] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setShowBrand(true);
      setShowLineOne(true);
      setShowLineTwo(true);
      setShowCopy(true);
      setProgress(100);

          const exitTimer = window.setTimeout(() => setExiting(true), 60);
          const finishTimer = window.setTimeout(() => setLoaded(true), 130);

      return () => {
        window.clearTimeout(exitTimer);
        window.clearTimeout(finishTimer);
      };
    }

    let isReady = false;
    const handleReady = () => {
      isReady = true;
    };

    if (document.readyState === "complete") {
      handleReady();
    } else {
      window.addEventListener("load", handleReady, { once: true });
    }

    const timeouts: number[] = [];
    timeouts.push(window.setTimeout(() => setShowBrand(true), 50));
      timeouts.push(window.setTimeout(() => setShowLineOne(true), 180));
      timeouts.push(window.setTimeout(() => setShowLineTwo(true), 315));
      timeouts.push(window.setTimeout(() => setShowCopy(true), 380));

    const motionStart = performance.now();
      const minimumDisplay = 900;
      const maximumDisplay = 1250;
      const animationDuration = 850;
    let frameId = 0;

    const step = (timestamp: number) => {
      const elapsed = timestamp - motionStart;
      const progressRatio = easeOutCubic(Math.min(elapsed / animationDuration, 1));
      setProgress(Math.min(100, Math.round(progressRatio * 100)));

      const hasElapsedMin = elapsed >= minimumDisplay;
      const hasElapsedMax = elapsed >= maximumDisplay;
      const hasCompletedAnimation = elapsed >= animationDuration;
      const canFinish = isReady || hasElapsedMax;

      if (hasCompletedAnimation && canFinish && hasElapsedMin) {
        setProgress(100);
        window.setTimeout(() => setExiting(true), 120);
        return;
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("load", handleReady);
      timeouts.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(frameId);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!exiting) {
      return;
    }

    const exitTimer = window.setTimeout(() => setLoaded(true), 380);
      return () => window.clearTimeout(exitTimer);
  }, [exiting]);

  if (loaded) {
    return null;
  }

  const dotPosition = Math.max(0, Math.min(progress, 100));

  return (
    <div
      className={`page-loader fixed inset-0 z-[1000] overflow-hidden bg-[#14110e] text-white ${
        exiting ? "pointer-events-none" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex min-h-screen items-center justify-center px-6 text-center">
        <div
          className={`mx-auto w-full max-w-[28rem] transition-all duration-[450ms] ease-[cubic-bezier(.16,.8,.35,1)] ${
            exiting ? "translate-y-[-12%] opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
            <div className="overflow-hidden">
            <p
              className="text-[0.74rem] uppercase tracking-[0.32em] text-white/40 transition-all duration-[350ms] ease-[cubic-bezier(.16,.8,.35,1)]"
              style={{
                opacity: showBrand ? 1 : 0,
                transform: showBrand ? "translateY(0)" : "translateY(10px)",
                letterSpacing: showBrand ? "0.18em" : "0.36em",
              }}
            >
              SATTAR
            </p>
          </div>

          <div className="mt-4 space-y-1">
            <div className="overflow-hidden">
                <p
                  className="text-[3.6rem] sm:text-[4.75rem] md:text-[5.75rem] font-display uppercase leading-[0.88] tracking-[-0.04em] transition-all duration-[400ms] ease-[cubic-bezier(.16,.8,.35,1)]"
                style={{
                  opacity: showLineOne ? 1 : 0,
                  transform: showLineOne ? "translateY(0)" : "translateY(110%)",
                }}
              >
                UI/UX
              </p>
            </div>
            <div className="overflow-hidden">
                <p
                  className="text-[3.6rem] sm:text-[4.75rem] md:text-[5.75rem] font-display uppercase leading-[0.88] tracking-[-0.04em] transition-all duration-[400ms] delay-[75ms] ease-[cubic-bezier(.16,.8,.35,1)]"
                style={{
                  opacity: showLineTwo ? 1 : 0,
                  transform: showLineTwo ? "translateY(0)" : "translateY(110%)",
                }}
              >
                DESIGNER
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.3em] text-white/40">
              <span>0%</span>
              <span>100%</span>
            </div>

            <div className="relative mt-3 h-px overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 h-full rounded-full bg-white/20 transition-all duration-[150ms] ease-[cubic-bezier(.16,.8,.35,1)]"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.18)]"
                style={{ left: `calc(${dotPosition}% - 0.38rem)` }}
              />
            </div>

            <div className="mt-4 overflow-hidden text-sm uppercase tracking-[0.26em] text-white/40">
              <p
                  className="inline-block transition-all duration-[350ms] ease-[cubic-bezier(.16,.8,.35,1)]"
                style={{
                  opacity: showCopy ? 1 : 0,
                  transform: showCopy ? "translateY(0)" : "translateY(8px)",
                  letterSpacing: showCopy ? "0.24em" : "0.16em",
                }}
              >
                CREATING PREMIUM DIGITAL EXPERIENCES
              </p>
            </div>

            <div className="mt-3 text-[0.67rem] uppercase tracking-[0.28em] text-white/30">
              LOADING — {progress}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
