"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile, stats } from "@/lib/data";
import SectionLabel from "./SectionLabel";

type Tok = [cls: string, text: string];
const s = (t: string): Tok => ["str", `"${t}"`];
const k = (t: string): Tok => ["key", t];
const p = (t: string): Tok => ["pun", t];
const arr = (items: string[]): Tok[] => [p("["), ...items.flatMap((it, i) => (i ? [p(", "), s(it)] : [s(it)])), p("]")];

const CODE: Tok[][] = [
  [["kw", "const "], ["var", "developer"], p(": "), ["type", "Engineer"], p(" = {")],
  [p("  "), k("name"), p(": "), s(profile.name), p(",")],
  [p("  "), k("role"), p(": "), s(profile.role), p(",")],
  [p("  "), k("base"), p(": "), s("Phnom Penh, KH"), p(",")],
  [p("  "), k("focus"), p(": "), ...arr(["Frontend", "REST APIs", "Dashboards", "SEO"]), p(",")],
  [p("  "), k("stack"), p(": {")],
  [p("    "), k("frontend"), p(": "), ...arr(["Next.js", "React", "Vue", "TypeScript"]), p(",")],
  [p("    "), k("backend"), p(": "), ...arr(["Laravel", "NestJS", "Node.js"]), p(",")],
  [p("    "), k("data"), p(": "), ...arr(["MySQL", "PostgreSQL"]), p(",")],
  [p("  },")],
  [p("  "), k("languages"), p(": "), ...arr(["Khmer", "English"]), p(",")],
  [p("  "), k("available"), p(": "), ["bool", "true"], p(",")],
  [p("};")],
  [],
  [["kw", "export default "], ["var", "developer"], p(";")],
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Type the code out line by line
      const tl = gsap.timeline({ scrollTrigger: { trigger: q(".code")[0], start: "top 75%" } });
      tl.from(q(".code"), { autoAlpha: 0, y: 40, duration: 0.8, ease: "expo.out" });
      q(".code__src").forEach((line) => {
        const len = Math.max(1, line.textContent?.length ?? 1);
        tl.fromTo(
          line,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: Math.min(0.28, len * 0.007), ease: `steps(${len})` },
        );
      });

      q(".stat__value").forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number((el as HTMLElement).dataset.value),
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v)).padStart(2, "0");
          },
        });
      });
      gsap.from(q(".stat"), {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: q(".stats")[0], start: "top 88%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section about" id="about">
      <div className="about__grid">
        <div className="about__copy">
          <SectionLabel index="01" file="about.ts">
            About the developer
          </SectionLabel>
          <p className="about__lead" data-reveal>
            I&apos;m <strong>Pen Menghong</strong> — a frontend-focused full stack developer from Phnom Penh, turning
            ideas into fast, responsive products people use every day.
          </p>
          <p className="about__text" data-reveal>
            {profile.summary}
          </p>
          <p className="about__text" data-reveal>
            Right now I ship production work at <span className="accent">Scholarar</span> and{" "}
            <span className="accent">HushStack Cambodia</span> while studying Information and Communication at the
            Institute of Technology of Cambodia.
          </p>
        </div>

        <div className="code panel" aria-label="Developer profile as TypeScript">
          <div className="code__bar mono">
            <span className="code__dots">
              <i />
              <i />
              <i />
            </span>
            <span>developer.config.ts</span>
            <span className="code__lang">TS</span>
          </div>
          <pre className="code__body mono">
            {CODE.map((line, i) => (
              <div className="code__line" key={i}>
                <span className="code__ln">{String(i + 1).padStart(2, "0")}</span>
                <span className="code__src">
                  {line.map(([cls, text], j) => (
                    <span key={j} className={`tok-${cls}`}>
                      {text}
                    </span>
                  ))}
                  {i === CODE.length - 1 && <span className="caret" />}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      <dl className="stats">
        {stats.map((st, i) => (
          <div className="stat panel" key={st.label}>
            <dt className="stat__label mono">
              <span className="accent">0{i + 1}</span> {st.label}
            </dt>
            <dd className="stat__num">
              <span className="stat__value" data-value={st.value}>
                00
              </span>
              <span className="accent">{st.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
