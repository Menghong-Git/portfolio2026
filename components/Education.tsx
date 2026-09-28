import { certificates, education, languages } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function Education() {
  return (
    <section className="section education" id="education">
      <SectionLabel index="05" file="modules.cfg">
        Training &amp; certs
      </SectionLabel>

      <div className="edu__grid">
        <div className="panel edu__panel" data-reveal>
          <p className="edu__head mono">
            <span className="accent">$</span> cat education.log
          </p>
          <ul className="edu__list">
            {education.map((e, i) => (
              <li key={e.school}>
                <span className="edu__id mono">EDU_{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{e.school}</strong>
                  <span>{e.detail}</span>
                </div>
                <span className="edu__period mono">{e.period}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel edu__panel" data-reveal>
          <p className="edu__head mono">
            <span className="accent">$</span> ls ./certificates
          </p>
          <ul className="edu__list">
            {certificates.map((c, i) => (
              <li key={c.title}>
                <span className="edu__id mono">CRT_{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{c.title}</strong>
                  <span>{c.issuer}</span>
                </div>
                <span className="edu__period mono">{c.year || "verified"}</span>
              </li>
            ))}
          </ul>

          <p className="edu__head edu__head--gap mono">
            <span className="accent">$</span> locale --list
          </p>
          <ul className="langs">
            {languages.map((l) => (
              <li key={l.name} className="mono">
                <span>{l.name.toLowerCase()}</span>
                <span className="langs__bar" data-level={l.level}>
                  <span />
                </span>
                <span className="muted">{l.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
