"use client";

import { useEffect } from "react";
import { ScrollTrigger, onIntroDone } from "@/lib/gsap";
import { SECTIONS, sectionForPath, type SectionId } from "@/lib/sections";

function scrollToSection(id: SectionId, behavior: ScrollBehavior) {
  const el = id === "top" ? null : document.getElementById(id);
  const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top, behavior });
}

/**
 * Makes the single-page sections behave like routes:
 * - clicking a section link scrolls there and updates the URL (no reload, no #hash)
 * - opening /about (etc.) directly lands on that section
 * - the URL follows the section you're reading; back/forward scroll between sections
 */
export default function SectionRouter({ initial }: { initial?: SectionId }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const section = sectionForPath(url.pathname);
      if (!section) return;
      e.preventDefault();
      if (window.location.pathname !== section.path) window.history.pushState(null, "", section.path);
      scrollToSection(section.id, "smooth");
    };

    const onPop = () => {
      const section = sectionForPath(window.location.pathname);
      if (section) scrollToSection(section.id, "smooth");
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);

    // Deep link: once the boot screen is gone, jump to the requested section
    const offIntro =
      initial && initial !== "top"
        ? onIntroDone(() =>
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              scrollToSection(initial, "instant");
            }),
          )
        : () => {};

    // Keep the address bar in sync with the section being read (replaceState: no history spam)
    const triggers = SECTIONS.map(({ id, path }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive && window.location.pathname !== path) window.history.replaceState(window.history.state, "", path);
        },
      });
    });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      offIntro();
      triggers.forEach((t) => t?.kill());
    };
  }, [initial]);

  return null;
}
