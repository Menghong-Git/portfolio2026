export const profile = {
  name: "Pen Menghong",
  firstName: "Pen",
  lastName: "Menghong",
  role: "Full Stack Developer",
  location: "Phnom Penh, Cambodia",
  email: "penmenghong@xmus.me",
  phone: "+855 86 62 3507",
  phoneHref: "tel:+85586623507",
  // Opens Gmail's compose window (in a new tab) instead of the system mail app
  emailHref:
    "https://mail.google.com/mail/?view=cm&fs=1&to=penmenghong%40xmus.me&su=" +
    encodeURIComponent("Hello Menghong — project inquiry"),
  summary:
    "Frontend-focused Full Stack Developer building responsive, user-friendly web applications with React, Vue and Next.js — from RESTful APIs and admin dashboards to CMS platforms, data management and SEO.",
};

export type Social = { key: string; label: string; handle: string; url: string };

/** Shown in the contact terminal, the contact buttons and the footer. */
export const socials: Social[] = [
  { key: "github", label: "GitHub", handle: "Menghong-Git", url: "https://github.com/Menghong-Git" },
  { key: "linkedin", label: "LinkedIn", handle: "pen-menghong", url: "https://www.linkedin.com/in/pen-menghong-301b71341" },
  // Add your Telegram username here, e.g.:
  // { key: "telegram", label: "Telegram", handle: "@username", url: "https://t.me/username" },
];

export const stats = [
  { value: 7, suffix: "+", label: "Live products shipped" },
  { value: 230, suffix: "K+", label: "Users on Scholarar" },
  { value: 15, suffix: "+", label: "Qwasar full-stack projects" },
  { value: 3, suffix: "", label: "Active roles since 2025" },
];

export type Experience = {
  title: string;
  company: string;
  period: string;
  stack: string[];
  points: string[];
};

export const experience: Experience[] = [
  {
    title: "Web Developer",
    company: "Scholarar",
    period: "2025 — Present",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Strapi", "Axios"],
    points: [
      "Developed and maintained a responsive scholarship platform.",
      "Maintained the Admin Dashboard for scholarships, applicants, applications and platform data.",
      "Managed scholarship content through Strapi CMS and integrated backend services over RESTful APIs.",
      "Kept eligibility, deadlines, program details and requirements accurate and up to date.",
      "Improved SEO, performance, responsiveness and UX across desktop and mobile.",
    ],
  },
  {
    title: "Web & Admin Portal",
    company: "HushStack Cambodia",
    period: "2025 — Present",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Laravel", "Eloquent ORM"],
    points: [
      "Developed and maintained a full-stack platform with RESTful APIs.",
      "Built the HushStack Portal for user management and business operations.",
      "Shipped dashboard features for daily requests and user management.",
      "Implemented API rate limiting for security, stability and performance.",
      "Integrated business and contact features, and improved SEO and page speed.",
    ],
  },
  {
    title: "Frontend Web Portal",
    company: "Scholarar B2B Portal",
    period: "2025 — Present",
    stack: ["Next.js", "TypeScript", "MUI", "Tailwind CSS", "Laravel API"],
    points: [
      "Built Explore Applicants and Manage Applications with searchable, filterable tables, cards and detail views.",
      "Implemented role-based access control and secure session-based authentication.",
      "Built analytics dashboards with charts and Excel / PDF export for reporting.",
      "Designed reusable, responsive UI components shared across modules.",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  url: string;
  description: string;
  tags: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "scholarar",
    name: "Scholarar",
    kind: "Scholarship platform",
    url: "https://scholarar.com",
    description:
      "AI scholarship matching platform connecting students with scholarships, test prep and study-abroad services — 230K+ active users.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Strapi"],
    accent: "#2f7bff",
  },
  {
    slug: "scholarar-business",
    name: "Scholarar Business",
    kind: "B2B admin portal",
    url: "https://business.scholarar.com/",
    description:
      "University-facing portal to explore applicants, manage applications and report on scholarships with role-based access.",
    tags: ["Next.js", "MUI", "RBAC", "Analytics"],
    accent: "#0284c7",
  },
  {
    slug: "hushstack",
    name: "HushStack Cambodia",
    kind: "Agency site & portal",
    url: "https://hushstackcambodia.site/",
    description:
      "Website and admin portal for a Phnom Penh web & software team — services, trust, work and client contact.",
    tags: ["Next.js", "Laravel", "REST API", "SEO"],
    accent: "#e0183c",
  },
  {
    slug: "yello",
    name: "Yello",
    kind: "Developer social platform",
    url: "https://yello.cachewraith.com/",
    description:
      "Social platform for developers and tech communities — real-time chat, a feed with per-post visibility, communities and a project showcase.",
    tags: ["Real-time chat", "Feed", "Communities"],
    accent: "#ca8a04",
  },
  {
    slug: "devlearnhub",
    name: "DevLearnHub",
    kind: "Learn-to-code platform",
    url: "https://www.xmus.me/en",
    description:
      "Free programming tutorials, live code runner, quizzes, roadmaps and developer tools — available in 9 languages including Khmer.",
    tags: ["i18n · 9 languages", "Live code", "Dev tools"],
    accent: "#d4202a",
  },
  {
    slug: "khmer-tools",
    name: "Khmer Tools",
    kind: "Utilities for Cambodia",
    url: "https://tools.hushstackcambodia.site/en",
    description:
      "Calculators and converters built for Cambodia — currency, Buddhist Era, units, QR codes and in-browser PDF tools. No login, nothing uploaded.",
    tags: ["Client-side", "PDF tools", "i18n"],
    accent: "#ea580c",
  },
  {
    slug: "kroza",
    name: "Kroza",
    kind: "AI social video publisher",
    url: "https://kroza.hushstackcambodia.site/",
    description:
      "Download videos by URL, then let Gemini write titles, scripts, captions and Khmer translations and publish to Facebook and YouTube.",
    tags: ["Gemini AI", "Video", "Publishing"],
    accent: "#7c3aed",
  },
];

export const skillGroups = [
  { label: "Frontend", items: ["React", "Next.js", "Vue.js", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "MUI"] },
  { label: "Backend", items: ["PHP · Laravel", "Node.js · NestJS", "RESTful APIs", "Strapi CMS"] },
  { label: "Database", items: ["MySQL", "PostgreSQL"] },
  { label: "DevOps", items: ["Docker", "GitHub CI", "OVH Cloud", "Vultr"] },
  { label: "Tools", items: ["Git", "GitHub", "Postman", "VS Code"] },
  { label: "Workflow", items: ["OpenProject", "Notion", "Agile", "Scrum"] },
];

export const pmSkills = [
  "Project Planning & Delivery",
  "Requirements Analysis",
  "Task & Sprint Management",
  "Technical Team Coordination",
  "Risk & Issue Management",
];

export const marquee = [
  "Next.js", "React", "TypeScript", "Laravel", "NestJS", "Vue.js", "Tailwind CSS",
  "PostgreSQL", "MySQL", "Docker", "Strapi", "REST APIs", "SEO",
];

export const education = [
  { school: "Institute of Technology of Cambodia", detail: "Bachelor of Information and Communication", period: "2024 — Present" },
  { school: "DICHI Academy", detail: "Full Stack Development — 1 year, completed", period: "2024 — 2025" },
  { school: "Samdach Hun Sen Phnom Penh Thmey High School", detail: "High School Diploma", period: "2018 — 2023" },
];

export const certificates = [
  { title: "Full-Stack Development Certificate", issuer: "Qwasar Silicon Valley · 15+ projects", year: "" },
  { title: "Certificate of Appreciation", issuer: "IP & TechPreneur Award (Volunteer)", year: "2025" },
  { title: "Computer Skills Certificate", issuer: "Microsoft Word, Excel, PowerPoint, Internet & Email", year: "2023" },
];

export const languages = [
  { name: "Khmer", level: "Native" },
  { name: "English", level: "Intermediate" },
];
