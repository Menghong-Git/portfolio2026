import { education, experience, profile, projects, skillGroups, socials } from "@/lib/data";
import { site, siteUrl } from "@/lib/site";

/** schema.org JSON-LD describing the person, the website and the projects, for search engines. */
export default function StructuredData() {
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        givenName: profile.firstName,
        familyName: profile.lastName,
        jobTitle: profile.role,
        description: profile.summary,
        url: siteUrl,
        image: `${siteUrl}/opengraph-image`,
        email: `mailto:${profile.email}`,
        telephone: profile.phone.replace(/\s/g, ""),
        address: { "@type": "PostalAddress", addressLocality: "Phnom Penh", addressCountry: "KH" },
        sameAs: socials.map((s) => s.url),
        knowsLanguage: ["km", "en"],
        knowsAbout: Array.from(new Set(skillGroups.flatMap((g) => g.items.flatMap((it) => it.split(" · "))))),
        alumniOf: education.slice(0, 2).map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
        worksFor: [
          { "@type": "Organization", name: "Scholarar", url: "https://scholarar.com" },
          { "@type": "Organization", name: "HushStack Cambodia", url: "https://hushstackcambodia.site" },
        ],
        hasOccupation: experience.map((job) => ({
          "@type": "Occupation",
          name: job.title,
          occupationLocation: { "@type": "City", name: "Phnom Penh" },
          skills: job.stack.join(", "),
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: site.title,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        dateModified: new Date().toISOString().slice(0, 10),
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#projects`,
        name: `Projects by ${profile.name}`,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.name,
            url: p.url,
            description: p.description,
            image: `${siteUrl}/projects/${p.slug}.webp`,
            creator: { "@id": personId },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
