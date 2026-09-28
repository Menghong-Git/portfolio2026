"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, scramble } from "@/lib/gsap";
import { projects } from "@/lib/data";
import SectionLabel from "./SectionLabel";

const host = (url: string) => new URL(url).host.replace(/^www\./, "");
const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scroll the cards sideways
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".work__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const counter = root.current?.querySelector(".work__count-now");
              if (counter) counter.textContent = pad(Math.min(projects.length, 1 + Math.floor(self.progress * projects.length)));
            },
          },
        });
        gsap.to(".work__progress-fill", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".work__pin", start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        });
        // Cards tilt in as they enter from the right
        gsap.utils.toArray<HTMLElement>(".project").forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: -12 },
            {
              rotateY: 0,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left right", end: "left 55%", scrub: true },
            },
          );
        });
      });

      mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".project").forEach((card) => {
          gsap.from(card, { y: 60, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } });
        });
      });

      // Decode the project name on hover
      const onEnter = contextSafe!((e: Event) => {
        const name = (e.currentTarget as HTMLElement).querySelector(".project__name");
        if (name && !gsap.isTweening(name)) scramble(name, { duration: 0.6 });
      });
      const links = root.current!.querySelectorAll<HTMLElement>(".project__link");
      links.forEach((l) => l.addEventListener("mouseenter", onEnter));
      return () => links.forEach((l) => l.removeEventListener("mouseenter", onEnter));
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work" id="work">
      <div className="work__pin">
        <div className="work__header">
          <SectionLabel index="03" file="ls ./projects">
            Deployed systems
          </SectionLabel>
          <div className="work__status mono">
            <span>
              <span className="work__count-now">01</span> / {pad(projects.length)}
            </span>
            <span className="work__progress">
              <span className="work__progress-fill" />
            </span>
            <span className="ok">● all systems live</span>
          </div>
        </div>

        <div className="work__track" ref={track}>
          {projects.map((p, i) => (
            <article className="project" key={p.slug} style={{ "--accent-p": p.accent } as CSSProperties}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="project__link" data-cursor="launch ↗">
                <div className="project__frame">
                  <span className="bracket bracket--tl" />
                  <span className="bracket bracket--tr" />
                  <span className="bracket bracket--bl" />
                  <span className="bracket bracket--br" />
                  <div className="project__bar mono">
                    <span>PRJ_{pad(i + 1)}</span>
                    <span className="project__host">{host(p.url)}</span>
                    <span className="ok">● LIVE</span>
                  </div>
                  <div className="project__shot">
                    <Image
                      src={`/projects/${p.slug}.webp`}
                      alt={`${p.name} homepage`}
                      width={1440}
                      height={900}
                      sizes="(max-width: 899px) 92vw, 44vw"
                      // Load during the boot screen so cards are never blank when they scroll in
                      loading="eager"
                    />                  </div>
                </div>
                <div className="project__meta">
                  <span className="project__index" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <p className="project__kind mono">{"//"} {p.kind}</p>
                  <h3 className="project__name">{p.name}</h3>
                  <p className="project__desc">{p.description}</p>
                  <div className="chips">
                    {p.tags.map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="project__cta mono">
                    &gt; launch_site <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
