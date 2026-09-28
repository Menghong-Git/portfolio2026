"use client";

import { useRef } from "react";
import { gsap, useGSAP, GLYPHS } from "@/lib/gsap";
import { profile, socials } from "@/lib/data";
import Clock from "./Clock";
import ContactForm from "./ContactForm";
import Magnetic from "./Magnetic";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".term__out"), { autoAlpha: 0 });

      const tl = gsap.timeline({ scrollTrigger: { trigger: q(".term")[0], start: "top 75%" } });
      tl.from(q(".term"), { autoAlpha: 0, y: 40, duration: 0.8, ease: "expo.out" }).to(q(".term__cmd"), {
        duration: 0.9,
        scrambleText: { text: "contact --menghong --verbose", chars: GLYPHS },
      });
      q(".term__out").forEach((line) => tl.to(line, { autoAlpha: 1, duration: 0.05 }, "+=0.12"));

      gsap.from(q(".contact__title-line"), {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".contact__title")[0], start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="contact" id="contact">
      <div className="section contact__inner">
        <div className="contact__copy">
          <p className="sec-tag mono">
            <span className="accent">{"//"} 06</span> · uplink.sh
            <span className="sec-tag__rule" />
          </p>
          <h2 className="contact__title">
            <span className="contact__title-line">Initiate</span>
            <span className="contact__title-line glitch accent" data-text="connection_">
              connection_
            </span>
          </h2>
          <p className="contact__lead">
            Have a product, platform or dashboard to build? I&apos;m available for freelance projects and full-time
            roles. Send a signal — I reply fast.
          </p>
          <div className="contact__cta">
            <Magnetic strength={0.25}>
              <a href={profile.emailHref} target="_blank" rel="noopener noreferrer" className="btn btn--big" data-cursor="send">
                <span>{profile.email}</span>
              </a>
            </Magnetic>
          </div>
          <ul className="socials" aria-label="Social profiles">
            {socials.map((s) => (
              <li key={s.key}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="social mono" data-cursor="open ↗">
                  <span className="social__label">{s.label}</span>
                  <span className="social__handle">{s.handle}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="term panel mono" aria-label="Contact details">
          <div className="code__bar">
            <span className="code__dots">
              <i />
              <i />
              <i />
            </span>
            <span>bash — uplink</span>
            <span className="ok">● connected</span>
          </div>
          <div className="term__body">
            <p>
              <span className="hero__user">visitor@pm-core</span>:<span className="hero__path">~</span>${" "}
              <span className="term__cmd" />
            </p>
            <p className="term__out muted">» resolving host… ok</p>
            <p className="term__out">
              <span className="term__key">email</span>{" "}
              <a href={profile.emailHref} target="_blank" rel="noopener noreferrer" className="term__link">
                {profile.email}
              </a>
            </p>
            <p className="term__out">
              <span className="term__key">phone</span>{" "}
              <a href={profile.phoneHref} className="term__link">
                {profile.phone}
              </a>
            </p>
            {socials.map((s) => (
              <p className="term__out" key={s.key}>
                <span className="term__key">{s.key}</span>{" "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="term__link">
                  {s.handle}
                </a>
              </p>
            ))}
            <p className="term__out">
              <span className="term__key">location</span> {profile.location}
            </p>
            <p className="term__out">
              <span className="term__key">local_time</span> <Clock /> (UTC+7)
            </p>
            <p className="term__out">
              <span className="term__key">status</span> <span className="ok">● available for work</span>
            </p>
            <p className="term__out">
              <span className="hero__user">visitor@pm-core</span>:<span className="hero__path">~</span>$ <span className="caret" />
            </p>
          </div>
        </div>

        <ContactForm />
      </div>

      <footer className="footer mono">
        <span>© 2026 {profile.name}</span>
        <span className="footer__links">
          {socials.map((s) => (
            <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label.toLowerCase()} ↗
            </a>
          ))}
        </span>
        <span>
          <span className="ok">●</span> all systems nominal
        </span>
        <a href="/">[ back_to_top ↑ ]</a>
      </footer>
    </section>
  );
}
