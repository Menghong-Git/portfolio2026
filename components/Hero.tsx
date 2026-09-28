"use client";

import { useRef } from "react";
import { gsap, useGSAP, onIntroDone, GLYPHS, scramble } from "@/lib/gsap";
import { profile } from "@/lib/data";
import Clock from "./Clock";
import Magnetic from "./Magnetic";

const ROLES = ["Full Stack Developer", "Next.js Engineer", "Laravel API Builder", "Frontend Specialist", "Dashboard Architect"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".hero__reveal"), { autoAlpha: 0, y: 20 });
      gsap.set(q(".hero__line"), { autoAlpha: 0 });

      const off = onIntroDone(() => {
        const tl = gsap.timeline();
        tl.to(q(".hero__typed"), { duration: 0.6, scrambleText: { text: "whoami", chars: GLYPHS } }, 0.2);
        q(".hero__line").forEach((line, i) => {
          tl.set(line, { autoAlpha: 1 }, 0.7 + i * 0.25).add(scramble(line, { duration: 1.1 }), 0.7 + i * 0.25);
        });
        tl.to(q(".hero__reveal"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 1.2);
        tl.from(q(".hero__panel-row"), { autoAlpha: 0, x: 20, duration: 0.5, stagger: 0.07, ease: "power2.out" }, 1.4);

        // Cycle through roles with a decode effect
        const role = q(".hero__role-text")[0];
        const cycle = gsap.timeline({ repeat: -1, delay: 2.6 });
        ROLES.slice(1)
          .concat(ROLES[0])
          .forEach((r) => cycle.to(role, { duration: 0.9, scrambleText: { text: r, chars: GLYPHS }, delay: 2.2 }));
      });

      // Drift away as you scroll past
      gsap.to(q(".hero__main"), {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "20% top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".hero__panel"), {
        yPercent: -40,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "10% top", end: "80% top", scrub: true },
      });

      return off;
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero__main">
        <p className="hero__prompt mono">
          <span className="hero__user">visitor@pm-core</span>:<span className="hero__path">~</span>$ <span className="hero__typed" />
          <span className="caret" />
        </p>

        <h1 className="hero__name" aria-label={profile.name}>
          <span className="glitch hero__line" data-text={profile.firstName.toUpperCase()} aria-hidden="true">
            {profile.firstName.toUpperCase()}
          </span>
          <span className="glitch hero__line hero__line--outline" data-text={profile.lastName.toUpperCase()} aria-hidden="true">
            {profile.lastName.toUpperCase()}
          </span>
        </h1>

        <p className="hero__role mono hero__reveal">
          <span className="accent">&gt;</span> role: <span className="hero__role-text">{ROLES[0]}</span>
        </p>
        <p className="hero__desc hero__reveal">
          I design and engineer fast, responsive web platforms — scholarship systems, admin portals, APIs and
          developer tools — with Next.js, React, Laravel and NestJS.
        </p>
        <div className="hero__cta hero__reveal">
          <Magnetic>
            <a href="/projects" className="btn">
              <span>[ view_projects ]</span>
            </a>
          </Magnetic>
          <a href="/contact" className="btn btn--ghost">
            <span>open_channel()</span>
          </a>
        </div>
      </div>

      <aside className="hero__panel panel mono" aria-label="Status">
        <p className="panel__title">
          <span>SYSTEM.STATUS</span>
          <span className="blink-dot" />
        </p>
        <dl>
          <div className="hero__panel-row">
            <dt>status</dt>
            <dd className="ok">● online · available</dd>
          </div>
          <div className="hero__panel-row">
            <dt>location</dt>
            <dd>Phnom Penh, KH</dd>
          </div>
          <div className="hero__panel-row">
            <dt>coords</dt>
            <dd>11.56°N 104.92°E</dd>
          </div>
          <div className="hero__panel-row">
            <dt>local_time</dt>
            <dd>
              <Clock />
            </dd>
          </div>
          <div className="hero__panel-row">
            <dt>core_stack</dt>
            <dd>next.js · laravel · nestjs</dd>
          </div>
          <div className="hero__panel-row">
            <dt>shipped</dt>
            <dd>7 live products</dd>
          </div>
        </dl>
      </aside>

      <a href="/about" className="hero__scroll mono" aria-label="Scroll to about">
        <span>scroll_to_explore</span>
        <span className="hero__scroll-line" />
      </a>
    </section>
  );
}
