import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";

export default function ProjectCard({ project }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const reduced = useReducedMotion();
  const tilt = (event) => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rotateX.set(
      (-(event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 5,
    );
    rotateY.set(
      ((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 5,
    );
  };

  return (
    <motion.article
      className="work-card"
      style={{ rotateX, rotateY }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      onPointerMove={tilt}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <div className="work-image-stage">
        <div className="work-browser">
          <div className="browser-toolbar">
            <span />
            <span />
            <span />
            <p>PROJECT PREVIEW</p>
          </div>
          <img
            src={project.image}
            alt={`${project.title} homepage preview`}
            loading="lazy"
            width="1440"
            height="810"
          />
        </div>
        <span className="work-category">
          {project.category || "WEB APPLICATION"}
        </span>
      </div>
      <div className="work-copy">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="work-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <ul className="work-features">
          {project.features?.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="work-links">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Explore ${project.title}`}
          >
            Explore project <FiArrowUpRight />
          </a>
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code`}
            >
              <FiGithub /> Source
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
