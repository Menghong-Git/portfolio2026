import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Portfolio from "@/components/Portfolio";
import { SECTIONS, sectionForSlug } from "@/lib/sections";

type Props = { params: Promise<{ section: string }> };

// Only the known sections exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.filter((s) => s.id !== "top").map((s) => ({ section: s.path.slice(1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = sectionForSlug((await params).section);
  // Same content as the home page, so search engines should index "/" (canonical inherited from the layout)
  return section ? { title: section.title } : {};
}

export default async function SectionPage({ params }: Props) {
  const section = sectionForSlug((await params).section);
  if (!section) notFound();
  return <Portfolio section={section.id} />;
}
