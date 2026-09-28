import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const alt = `${profile.name} — Full Stack Developer in Phnom Penh, Cambodia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLUE = "#2563eb";
const VIOLET = "#7c3aed";
const INK = "#0f1b33";
const MUTED = "#5b6b86";

/** Share preview used by Facebook, LinkedIn, Telegram, X, etc. */
export default function OpengraphImage() {
  const host = new URL(siteUrl).host;
  const stack = ["Next.js", "React", "TypeScript", "Laravel", "NestJS"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #f4f7fd 0%, #e3ebf8 100%)",
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        {/* Decorative "core": concentric rings on the right */}
        {[470, 390, 280].map((d, i) => (
          <div
            key={d}
            style={{
              position: "absolute",
              right: 110 - d / 2 + 140,
              top: 315 - d / 2,
              width: d,
              height: d,
              borderRadius: "50%",
              border: `${i === 0 ? 2 : 3}px ${i === 0 ? "dashed" : "solid"} ${i === 1 ? VIOLET : BLUE}`,
              opacity: 0.35 + i * 0.2,
              display: "flex",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 180,
            top: 245,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, #c7d7fb 45%, ${BLUE} 100%)`,
            boxShadow: `0 0 60px rgba(37, 99, 235, 0.45)`,
            display: "flex",
          }}
        />

        {/* HUD corners */}
        {[
          { top: 28, left: 28, borderTop: `3px solid ${BLUE}`, borderLeft: `3px solid ${BLUE}` },
          { top: 28, right: 28, borderTop: `3px solid ${BLUE}`, borderRight: `3px solid ${BLUE}` },
          { bottom: 28, left: 28, borderBottom: `3px solid ${BLUE}`, borderLeft: `3px solid ${BLUE}` },
          { bottom: 28, right: 28, borderBottom: `3px solid ${BLUE}`, borderRight: `3px solid ${BLUE}` },
        ].map((corner, i) => (
          // Only defined keys are passed — Satori fails on undefined style values
          <div key={i} style={{ position: "absolute", width: 36, height: 36, display: "flex", ...corner }} />
        ))}

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>
            <span style={{ background: BLUE, color: "#fff", padding: "4px 12px" }}>PM</span>
            <span style={{ color: BLUE, marginLeft: 6 }}>://core</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontSize: 108, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
            <span>PEN</span>
            <span style={{ color: BLUE }}>MENGHONG</span>
          </div>

          <div style={{ display: "flex", marginTop: 26, fontSize: 34, color: INK }}>
            <span style={{ color: BLUE, marginRight: 12 }}>&gt;</span> Full Stack Developer
          </div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 24, color: MUTED }}>Phnom Penh, Cambodia</div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
            {stack.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 20,
                  padding: "6px 14px",
                  border: `1.5px solid rgba(37, 99, 235, 0.35)`,
                  background: "rgba(255, 255, 255, 0.8)",
                  color: INK,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 80,
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            color: MUTED,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#059669", marginRight: 10, display: "flex" }} />
          {host}
        </div>
      </div>
    ),
    size,
  );
}
