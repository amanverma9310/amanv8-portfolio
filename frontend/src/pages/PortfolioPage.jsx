import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TechMarquee from "../components/TechMarquee";
import Manifesto from "../components/Manifesto";
import Certifications from "../components/Certifications";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import FloatingDock from "../components/FloatingDock";
import "../components/CharcoalTheme.css";
import "../components/PortfolioDesign.css";

export default function PortfolioPage({ dark, setDark }) {
  return (
    <div className="portfolio-charcoal min-h-screen selection:bg-white/20">
      <main>
        <Hero><Navbar dark={dark} setDark={setDark} /></Hero>
        <Manifesto />
        <TechMarquee />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
}
