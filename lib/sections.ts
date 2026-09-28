/** Each page section has its own clean URL (e.g. /projects) instead of a #hash. */
export const SECTIONS = [
  { id: "top", path: "/", title: "" },
  { id: "about", path: "/about", title: "About" },
  { id: "experience", path: "/experience", title: "Experience" },
  { id: "work", path: "/projects", title: "Projects" },
  { id: "skills", path: "/skills", title: "Skills" },
  { id: "education", path: "/education", title: "Education" },
  { id: "contact", path: "/contact", title: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const pathFor = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.path;

export const sectionForPath = (path: string) => {
  const clean = path.length > 1 ? path.replace(/\/$/, "") : path;
  return SECTIONS.find((s) => s.path === clean);
};

/** URL segment (without the leading slash) → section, for the /[section] route. */
export const sectionForSlug = (slug: string) => sectionForPath(`/${slug}`);
