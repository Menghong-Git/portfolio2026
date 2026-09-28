import { profile } from "./data";

/**
 * Public address of the site, used for canonical links, the sitemap and share previews.
 * NEXT_PUBLIC_SITE_URL can override it (e.g. for a preview deployment).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://penmenghong.xmus.me").replace(/\/$/, "");

export const site = {
  name: `${profile.name} — ${profile.role}`,
  shortName: profile.name,
  title: `${profile.name} — Full Stack Developer in Phnom Penh, Cambodia`,
  description:
    "Pen Menghong is a frontend-focused Full Stack Developer in Phnom Penh, Cambodia, building fast, responsive web apps, admin dashboards and REST APIs with Next.js, React, Vue, Laravel and NestJS.",
  keywords: [
    "Pen Menghong",
    "Full Stack Developer",
    "Full Stack Developer Cambodia",
    "Web Developer Phnom Penh",
    "Next.js Developer",
    "React Developer",
    "Laravel Developer",
    "NestJS",
    "TypeScript",
    "Frontend Developer Cambodia",
    "Portfolio",
    "Scholarar",
    "HushStack Cambodia",
  ],
  locale: "en_US",
  themeColor: "#e8effa",
};
