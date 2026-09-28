"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { pmSkills, skillGroups } from "@/lib/data";
import SectionLabel from "./SectionLabel";

const ORBIT = Array.from(new Set(skillGroups.flatMap((g) => g.items.flatMap((it) => it.split(" · ")))));

/** Technologies distributed on a rotating sphere (fibonacci lattice), steered by the pointer. */
function TechOrbit() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const items = gsap.utils.toArray<HTMLElement>(".orbit__item", el);
      const n = items.length;
      const pts = items.map((_, i) => {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = Math.PI * (3 - Math.sqrt(5)) * i;
        return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
      });

      let ax = 0.25;
      let ay = 0;
      const vel = { x: 0.0025, y: 0.004 };
      const aim = { x: 0.0025, y: 0.004 };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        aim.y = ((e.clientX - r.left) / r.width - 0.5) * 0.03;
        aim.x = -((e.clientY - r.top) / r.height - 0.5) * 0.03;
      };
      const onLeave = () => {
        aim.x = 0.0025;
        aim.y = 0.004;
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      const speed = prefersReducedMotion() ? 0.15 : 1;
      const render = () => {
        vel.x += (aim.x - vel.x) * 0.05;
        vel.y += (aim.y - vel.y) * 0.05;
        ax += vel.x * speed;
        ay += vel.y * speed;
        const R = el.clientWidth * 0.4;
        const [sx, cx, sy, cy] = [Math.sin(ax), Math.cos(ax), Math.sin(ay), Math.cos(ay)];
        pts.forEach((p, i) => {
          const x1 = p.x * cy + p.z * sy;
          const z1 = -p.x * sy + p.z * cy;
          const y2 = p.y * cx - z1 * sx;
          const z2 = p.y * sx + z1 * cx;
          const depth = (z2 + 1) / 2; // 0 back → 1 front
          const it = items[i];
          it.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${0.6 + depth * 0.6})`;
          it.style.opacity = String(0.2 + depth * 0.8);
          it.style.zIndex = String(Math.round(depth * 100));
          it.classList.toggle("is-front", depth > 0.82);
        });
      };
      // Only animate while the sphere is on screen
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(render) : gsap.ticker.remove(render)),
      });
      render();

      return () => {
        st.kill();
        gsap.ticker.remove(render);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="orbit" data-cursor="drag">
      <span className="orbit__ring orbit__ring--1" />
      <span className="orbit__ring orbit__ring--2" />
      {ORBIT.map((t) => (
        <span className="orbit__item mono" key={t}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q(".module"), {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: q(".modules")[0], start: "top 85%" },
      });
      gsap.from(q(".orbit"), {
        scale: 0.6,
        autoAlpha: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".orbit")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section skills" id="skills">
      <SectionLabel index="04" file="package.json">
        Tech stack
      </SectionLabel>

      <div className="skills__grid">
        <TechOrbit />

        <div className="modules">
          {skillGroups.map((g) => (
            <div className="module panel" key={g.label}>
              <p className="module__head mono">
                <span>
                  <span className="accent">[</span>
                  {g.label.toLowerCase()}
                  <span className="accent">]</span>
                </span>
                <span className="muted">{String(g.items.length).padStart(2, "0")} pkgs</span>
              </p>
              <div className="chips">
                {g.items.map((it) => (
                  <span className="chip" key={it}>
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="module module--wide panel">
            <p className="module__head mono">
              <span>
                <span className="accent">[</span>project_management<span className="accent">]</span>
              </span>
              <span className="muted">{String(pmSkills.length).padStart(2, "0")} skills</span>
            </p>
            <ul className="checklist mono">
              {pmSkills.map((it) => (
                <li key={it}>
                  <span className="ok">✓</span> {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
