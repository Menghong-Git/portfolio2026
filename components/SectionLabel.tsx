import type { ReactNode } from "react";

/** `// 01 · about.ts` tag + decoded heading. */
export default function SectionLabel({ index, file, children }: { index: string; file: string; children: ReactNode }) {
  return (
    <header className="sec-head">
      <p className="sec-tag mono" data-reveal>
        <span className="accent">{"//"} {index}</span> · {file}
        <span className="sec-tag__rule" />
      </p>
      <h2 className="sec-title" data-decode>
        {children}
      </h2>
    </header>
  );
}
