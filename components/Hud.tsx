"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, onIntroDone, scramble } from "@/lib/gsap";

const SECTIONS = [
  { sel: "#top", code: "SYS.BOOT" },
  { sel: "#about", code: "ABOUT.TS" },
  { sel: "#experience", code: "GIT.LOG" },
  { sel: "#work", code: "PROJECTS.DIR" },
  { sel: "#skills", code: "TECH.STACK" },
  { sel: "#education", code: "MODULES.CFG" },
  { sel: "#contact", code: "UPLINK.SH" },
];

/** Fixed heads-up display framing the viewport. */
export default function Hud() {
  const root = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const section = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.set(root.current, { autoAlpha: 0 });
      const off = onIntroDone(() => gsap.to(root.current, { autoAlpha: 1, duration: 1, delay: 0.8 }));

      let frame = 0;
      const onMove = (e: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (coords.current)
            coords.current.textContent = `X:${String(Math.round(e.clientX)).padStart(4, "0")} Y:${String(Math.round(e.clientY)).padStart(4, "0")}`;
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (pct.current) pct.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
          gsap.set(".hud__progress-fill", { scaleY: self.progress });
        },
      });

      SECTIONS.forEach(({ sel, code }) => {
        const trigger = document.querySelector(sel);
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: "top 50%",
          end: "bottom 50%",
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive && section.current) scramble(section.current, { text: code, duration: 0.5 });
          },
        });
      });

      return () => {
        off();
        window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="hud" aria-hidden="true">
      <span className="hud__corner hud__corner--tl" />
      <span className="hud__corner hud__corner--tr" />
      <span className="hud__corner hud__corner--bl" />
      <span className="hud__corner hud__corner--br" />
      <div className="hud__readout hud__readout--bl">
        <span className="hud__blink" /> <span ref={section}>SYS.BOOT</span>
        <span className="hud__sep">//</span>
        <span ref={coords}>X:0000 Y:0000</span>
      </div>
      <div className="hud__readout hud__readout--br">
        SCROLL <span ref={pct}>000</span>%
      </div>
      <div className="hud__progress">
        <span className="hud__progress-fill" />
      </div>
    </div>
  );
}
