import About from "@/components/About";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Hud from "@/components/Hud";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import Projects from "@/components/Projects";
import Reveals from "@/components/Reveals";
import Scene from "@/components/Scene";
import SectionRouter from "@/components/SectionRouter";
import Skills from "@/components/Skills";
import StructuredData from "@/components/StructuredData";
import type { SectionId } from "@/lib/sections";

/** The whole one-page site. `section` is set when the page is opened at /about, /projects, etc. */
export default function Portfolio({ section }: { section?: SectionId }) {
  return (
    <>
      <StructuredData />
      <Preloader />
      <Scene />
      <Hud />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Reveals />
      <SectionRouter initial={section} />
    </>
  );
}
