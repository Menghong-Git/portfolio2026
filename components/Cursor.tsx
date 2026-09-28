"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Decorative reticle that trails the system cursor. The real cursor stays visible,
 * so pointing never lags even when the page is busy rendering.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const rx = gsap.quickTo(ring.current, "x", { duration: 0.12, ease: "power2" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.12, ease: "power2" });

    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set(ring.current, { x: e.clientX, y: e.clientY });
        gsap.to(ring.current, { opacity: 1, duration: 0.3 });
      }
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      const text = el?.dataset.cursor ?? "";
      ring.current?.classList.toggle("is-hover", !!el);
      ring.current?.classList.toggle("has-label", !!text);
      if (label.current) label.current.textContent = text;
    };
    const leave = () => gsap.to(ring.current, { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to(ring.current, { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div ref={ring} className="cursor-ring" aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
