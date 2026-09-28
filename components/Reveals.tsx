"use client";

import { gsap, ScrollTrigger, useGSAP, scramble, prefersReducedMotion } from "@/lib/gsap";

/**
 * Page-wide scroll effects: `[data-reveal]` fades up, `[data-decode]` decodes its text from random glyphs.
 * Rendered last so its triggers are created after the pinned work section.
 */
export default function Reveals() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 36,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-decode]").forEach((el) => {
      gsap.set(el, { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.set(el, { autoAlpha: 1 });
          scramble(el, { duration: 1.2 });
        },
      });
    });

    // Fonts can shift layout after first paint
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return null;
}
