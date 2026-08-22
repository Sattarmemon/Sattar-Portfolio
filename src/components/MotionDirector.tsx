"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function MotionDirector() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lenis = reduceMotion
      ? null
      : new Lenis({
          autoRaf: false,
          lerp: coarsePointer ? 0.1 : 0.075,
          syncTouch: false,
        });

    gsap.registerPlugin(ScrollTrigger);
    const cleanup: Array<() => void> = [];

    if (lenis) {
      const onFrame = (time: number) => lenis.raf(time * 1000);
      const onScroll = () => ScrollTrigger.update();
      gsap.ticker.add(onFrame);
      lenis.on("scroll", onScroll);
      gsap.ticker.lagSmoothing(1000, 16);
      cleanup.push(() => {
        gsap.ticker.remove(onFrame);
        lenis.off("scroll", onScroll);
        lenis.destroy();
      });
    }

    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.utils.toArray<HTMLElement>("[data-motion=hero-line]").forEach((element, index) => {
          gsap.fromTo(element, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05, delay: 0.22 + index * 0.12, ease: "power4.out" });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion=hero-copy]").forEach((element) => {
          gsap.fromTo(element, { y: 24, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, delay: 0.58, ease: "power3.out" });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion=hero-visual]").forEach((element) => {
          gsap.fromTo(element, { y: 30, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.35, ease: "power3.out" });
          gsap.to(element, { y: -12, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 1.2 } });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion=stagger]").forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-motion-item]");
          gsap.fromTo(items, { y: 32, opacity: 0 }, {
            y: 0,
            opacity: 1,
            stagger: 0.09,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion=mask]").forEach((element) => {
          gsap.fromTo(element, { clipPath: "inset(0 0 100% 0)" }, {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.15,
            ease: "power4.inOut",
            scrollTrigger: { trigger: element, start: "top 82%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion=timeline]").forEach((group) => {
          const line = group.querySelector<HTMLElement>("[data-motion-line]");
          const items = group.querySelectorAll<HTMLElement>("[data-motion-item]");
          if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: group, start: "top 75%", once: true } });
          gsap.fromTo(items, { x: -18, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.14, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: group, start: "top 78%", once: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion=detail-image]").forEach((element) => {
          gsap.fromTo(element, { clipPath: "inset(0 8% 0 8%)", scale: 1.05 }, { clipPath: "inset(0 0% 0 0%)", scale: 1, duration: 1.2, ease: "power4.inOut", scrollTrigger: { trigger: element, start: "top 82%", once: true } });
        });
      }

    });

    return () => {
      context.revert();
      cleanup.forEach((dispose) => dispose());
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
