import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, useGSAP);
}

export const INTRO_DONE = "intro:done";
export const GLYPHS = "01<>/{}[]#$%&*+=_ABCDEFX";

/** Resolves immediately if the boot sequence already finished, otherwise on its event. */
export function onIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (document.documentElement.dataset.intro === "done") {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Decode an element's own text from random glyphs. */
export function scramble(el: Element, opts: { duration?: number; delay?: number; text?: string } = {}) {
  const text = opts.text ?? el.textContent ?? "";
  return gsap.to(el, {
    duration: opts.duration ?? Math.min(1.6, 0.4 + text.length * 0.03),
    delay: opts.delay ?? 0,
    scrambleText: { text, chars: GLYPHS, speed: 0.6, revealDelay: 0.1 },
    ease: "none",
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
