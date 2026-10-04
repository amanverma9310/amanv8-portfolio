import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowDown, FiArrowUpRight, FiDownload } from "react-icons/fi";
import portrait from "../assets/hero-portrait.png";
import { site } from "../data/site";
import "./Hero.css";

import ScrollPortraitVideo from "./ScrollPortraitVideo";

// Calculate all phases from the same scroll value. Function transforms keep
// their timing consistent across browsers with and without native scroll timelines.
function mapProgress(progress, stops, values) {
  if (progress <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (progress <= stops[i]) {
      const fraction = (progress - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + fraction * (values[i] - values[i - 1]);
    }
  }
  return values.at(-1);
}

export default function Hero({ children }) {
  const heroRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const resumeUrl = site.resumeUrl;
  const [introVisible, setIntroVisible] = useState(true);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const introOpacity = useTransform(scrollYProgress, (progress) =>
    mapProgress(progress, [0, 0.1, 0.23], [1, 1, 0]),
  );
  const introY = useTransform(scrollYProgress, (progress) =>
    mapProgress(progress, [0, 0.23], [0, -35]),
  );
  const storyOpacity = useTransform(scrollYProgress, (progress) =>
    mapProgress(progress, [0.25, 0.35, 0.48, 0.63], [0, 1, 1, 0]),
  );
  const storyY = useTransform(scrollYProgress, (progress) =>
    mapProgress(progress, [0.25, 0.35, 0.63], [24, 0, -24]),
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setIntroVisible(progress < 0.23);
  });

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className={`portrait-hero${reducedMotion ? " portrait-hero--still" : ""}`}
    >
      <div className="portrait-hero-stage">
        {children}
        <motion.div
          className="portrait-hero-arrival"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.78, y: 65 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="portrait-hero-visual">
            <img
              className="portrait-hero-backdrop"
              src={portrait}
              alt=""
              aria-hidden="true"
            />
            <img
              className="portrait-hero-image"
              src={portrait}
              alt="Aman Verma standing in his blue-lit workspace"
              fetchPriority="high"
              decoding="async"
            />
            {!reducedMotion && (
              <ScrollPortraitVideo
                poster={portrait}
                progress={scrollYProgress}
              />
            )}
          </div>
        </motion.div>
        <div className="portrait-hero-shade" aria-hidden="true" />
        <div className="portrait-hero-content">
          <motion.div
            className="portrait-hero-intro"
            inert={!reducedMotion && !introVisible}
            style={
              reducedMotion ? undefined : { opacity: introOpacity, y: introY }
            }
          >
            <p className="portrait-hero-eyebrow">
              <span /> Available for work
            </p>
            <p className="portrait-hero-name">AMAN VERMA</p>
            <h1>
              Learning.
              <br />
              <span>Building.</span>
              <br />
              Improving.
            </h1>
            <p className="portrait-hero-description">
              BCA graduate. Frontend developer.
              <br />
              Building practical web experiences and learning backend
              development.
            </p>
            <div className="portrait-hero-actions">
              <button
                className="portrait-hero-primary"
                onClick={() => scrollTo("projects")}
              >
                See my projects <FiArrowUpRight aria-hidden="true" />
              </button>
              <button onClick={() => scrollTo("contact")}>
                Let’s talk <FiArrowUpRight aria-hidden="true" />
              </button>
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FiDownload aria-hidden="true" /> Resume
                </a>
              )}
            </div>
          </motion.div>
          {!reducedMotion && (
            <motion.div
              className="portrait-hero-story"
              style={{ opacity: storyOpacity, y: storyY }}
              aria-hidden="true"
            >
              <p className="portrait-hero-name">CURIOSITY INTO CODE</p>
              <h2>
                Frontend developer.
                <br />
                <span>Always learning.</span>
              </h2>
              <p>
                React, thoughtful interfaces,
                <br />
                and a growing understanding of the backend.
              </p>
            </motion.div>
          )}
        </div>
        <motion.div
          className="portrait-hero-footer"
          inert={!reducedMotion && !introVisible}
          style={reducedMotion ? undefined : { opacity: introOpacity }}
        >
          <span>BASED IN FARIDABAD, INDIA</span>
          <button onClick={() => scrollTo("hero-end")}>
            Scroll to explore <FiArrowDown aria-hidden="true" />
          </button>
        </motion.div>
      </div>
      <span id="hero-end" className="portrait-hero-end" aria-hidden="true" />
    </section>
  );
}
