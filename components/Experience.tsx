"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience, profile } from "@/lib/data";
import SectionLabel from "./SectionLabel";

// Decorative commit ids and branch refs for the git-log styling
const COMMITS = [
  { hash: "a7f3c91", ref: "HEAD -> main" },
  { hash: "4be08d2", ref: "origin/hushstack" },
  { hash: "e19c5fa", ref: "feature/b2b-portal" },
];

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Branch line draws itself as you scroll through the log
      gsap.fromTo(
        q(".gitlog__line-fill"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".gitlog")[0], start: "top 70%", end: "bottom 60%", scrub: true } },
      );

      q(".commit").forEach((commit) => {
        const c = gsap.utils.selector(commit);
        gsap
          .timeline({
            scrollTrigger: {
              trigger: commit,
              start: "top 75%",
              onEnter: () => commit.classList.add("is-active"),
              onLeaveBack: () => commit.classList.remove("is-active"),
            },
          })
          .from(c(".commit__node"), { scale: 0, duration: 0.5, ease: "back.out(3)" })
          .from(c(".commit__head > *"), { autoAlpha: 0, x: -16, duration: 0.5, stagger: 0.05, ease: "power3.out" }, "-=0.2")
          .from(c(".diff__line"), { autoAlpha: 0, x: -10, duration: 0.35, stagger: 0.06, ease: "power2.out" }, "-=0.2")
          .from(c(".chip"), { autoAlpha: 0, y: 10, duration: 0.3, stagger: 0.03 }, "-=0.2");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section experience" id="experience">
      <SectionLabel index="02" file="git log --graph">
        Commit history
      </SectionLabel>

      <ol className="gitlog">
        <span className="gitlog__line" aria-hidden="true">
          <span className="gitlog__line-fill" />
        </span>
        {experience.map((job, i) => (
          <li className="commit" key={job.company}>
            <span className="commit__node" aria-hidden="true" />
            <div className="commit__card panel">
              <div className="commit__head mono">
                <span className="commit__hash">commit {COMMITS[i]?.hash}</span>
                <span className="commit__ref">({COMMITS[i]?.ref})</span>
                <span className="commit__date">{job.period}</span>
              </div>
              <h3 className="commit__company">{job.company}</h3>
              <p className="commit__role mono">
                <span className="accent">role:</span> {job.title} <span className="muted">· author: {profile.name}</span>
              </p>
              <ul className="diff mono">
                {job.points.map((pt) => (
                  <li className="diff__line" key={pt}>
                    <span className="diff__sign">+</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="chips">
                {job.stack.map((st) => (
                  <span className="chip" key={st}>
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
