"use client";

import { useRef } from "react";
import { gsap, useGSAP, INTRO_DONE, GLYPHS, prefersReducedMotion } from "@/lib/gsap";

const BOOT = [
  { task: "Loading kernel modules", value: "next.js@16" },
  { task: "Mounting render engine", value: "three.js · webgl" },
  { task: "Initializing motion core", value: "gsap" },
  { task: "Indexing projects", value: "7 found" },
  { task: "Compiling experience", value: "3 roles" },
  { task: "Establishing uplink", value: "phnom-penh · utc+7" },
];

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const finish = () => {
        document.documentElement.dataset.intro = "done";
        document.documentElement.classList.remove("is-loading");
        window.dispatchEvent(new Event(INTRO_DONE));
      };

      if (prefersReducedMotion()) {
        gsap.set(root.current, { display: "none" });
        finish();
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => gsap.set(root.current, { display: "none" }) });
      tl.from(".boot__head", { autoAlpha: 0, duration: 0.3 })
        .to(".boot__head-text", { duration: 0.8, scrambleText: { text: "BOOT SEQUENCE // PM-CORE v2026", chars: GLYPHS } }, "<")
        .to(
          counter,
          {
            v: 100,
            duration: 2.4,
            ease: "power2.inOut",
            onUpdate: () => {
              if (pct.current) pct.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.2,
        )
        .to(".boot__fill", { scaleX: 1, duration: 2.4, ease: "power2.inOut" }, 0.2);

      gsap.utils.toArray<HTMLElement>(".boot__line").forEach((line, i) => {
        const at = 0.3 + i * 0.34;
        tl.set(line, { autoAlpha: 1 }, at)
          .to(line.querySelector(".boot__task"), { duration: 0.35, scrambleText: { text: "{original}", chars: GLYPHS } }, at)
          .from(line.querySelector(".boot__dots"), { scaleX: 0, transformOrigin: "left", duration: 0.25 }, at + 0.1)
          .from(line.querySelector(".boot__val"), { autoAlpha: 0, duration: 0.1 }, at + 0.3)
          .call(
            () => {
              const status = line.querySelector(".boot__status")!;
              status.textContent = "[ OK ]";
              status.classList.add("is-ok");
            },
            [],
            at + 0.32,
          );
      });

      tl.to(".boot__ready", { autoAlpha: 1, duration: 0.1 }, "+=0.1")
        .to(".boot__ready-text", { duration: 0.5, scrambleText: { text: "SYSTEM READY", chars: GLYPHS } }, "<")
        .to(".boot__inner", { x: 8, skewX: -8, duration: 0.05, repeat: 5, yoyo: true, ease: "steps(1)" }, "+=0.2")
        .to(root.current, { clipPath: "inset(50% 0 50% 0)", duration: 0.7, ease: "expo.inOut" })
        .add(finish, "-=0.35");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="boot" aria-hidden="true">
      <div className="boot__inner">
        <p className="boot__head">
          <span className="boot__prompt">&gt;</span> <span className="boot__head-text" />
        </p>
        <ul className="boot__log">
          {BOOT.map((b) => (
            <li className="boot__line" key={b.task}>
              <span className="boot__status">[ .. ]</span>
              <span className="boot__task">{b.task}</span>
              <span className="boot__dots" />
              <span className="boot__val">{b.value}</span>
            </li>
          ))}
        </ul>
        <p className="boot__ready">
          <span className="boot__prompt">&gt;</span> <span className="boot__ready-text" />
          <span className="caret" />
        </p>
        <div className="boot__bar">
          <span className="boot__fill" />
        </div>
        <div className="boot__meta">
          <span>PEN MENGHONG · FULL STACK DEVELOPER</span>
          <span>
            <span ref={pct}>000</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
