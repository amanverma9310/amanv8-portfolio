import { motion } from "framer-motion";
import { projects as staticProjects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const projects=staticProjects;

  return (
    <section id="projects" className="relative py-20 sm:py-28 md:py-36 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="project-heading mb-10 sm:mb-14"
        >
          <div className="text-xs font-semibold tracking-widest text-purple-400 mb-3">
            02 / SELECTED WORK
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            <span className="text-white">Things I’ve </span>
            <span className="text-[#3d7bff]">built.</span>
          </h2>
          <p className="section-description">Real projects. Thoughtful interfaces. Built to be used.</p>
        </motion.div>

        <div className="project-gallery">
          {projects.map(project=><ProjectCard key={project.id || project._id} project={project}/>)}
        </div>
      </div>
    </section>
  );
}
