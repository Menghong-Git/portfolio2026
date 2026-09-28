"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, onIntroDone, scramble } from "@/lib/gsap";
import Magnetic from "./Magnetic";

const links = [
  { href: "/about", label: "about" },
  { href: "/experience", label: "experience" },
  { href: "/projects", label: "projects" },
  { href: "/skills", label: "stack" },
  { href: "/contact", label: "contact" },
];

export default function Nav() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      gsap.set(root.current, { yPercent: -120 });
      const off = onIntroDone(() => {
        gsap.to(root.current, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.5 });
        root.current!.querySelectorAll(".nav__text").forEach((el, i) => scramble(el, { delay: 0.7 + i * 0.06 }));
      });

      // Hide on scroll down, reveal on scroll up
      ScrollTrigger.create({
        start: 200,
        end: "max",
        onUpdate: (self) =>
          gsap.to(root.current, { yPercent: self.direction === 1 ? -120 : 0, duration: 0.5, ease: "power3.out", overwrite: true }),
        onLeaveBack: () => gsap.to(root.current, { yPercent: 0, duration: 0.5, overwrite: true }),
      });

      // Decode effect on hover
      const onEnter = contextSafe!((e: Event) => {
        const el = (e.currentTarget as HTMLElement).querySelector(".nav__text");
        if (el && !gsap.isTweening(el)) scramble(el, { duration: 0.45 });
      });
      const items = root.current!.querySelectorAll<HTMLElement>("[data-scramble]");
      items.forEach((a) => a.addEventListener("mouseenter", onEnter));

      return () => {
        off();
        items.forEach((a) => a.removeEventListener("mouseenter", onEnter));
      };
    },
    { scope: root },
  );

  return (
    <header ref={root} className="nav">
      <a href="/" className="nav__logo" aria-label="Pen Menghong — back to top">
        <span className="nav__logo-mark">PM</span>
        <span className="nav__logo-path">://core</span>
      </a>
      <nav aria-label="Primary">
        <ul className="nav__links">
          {links.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} data-scramble>
                <span className="nav__num">0{i + 1}.</span>
                <span className="nav__text">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Magnetic>
        <a href="/contact" className="btn btn--small" data-scramble>
          <span className="nav__text">[ hire_me ]</span>
        </a>
      </Magnetic>
    </header>
  );
}
