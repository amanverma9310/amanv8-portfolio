import { lazy, Suspense } from "react";
import { marqueeSkills as staticMarqueeSkills } from "../data/skills";
import { getIcon } from "../utils/iconMap";
const TechBall = lazy(() => import("./TechBall"));

export default function TechMarquee() {
  const skills = staticMarqueeSkills;
  return (
    <section
      id="skills"
      className="tech-experience"
      aria-labelledby="tech-heading"
    >
      <div className="tech-heading">
        <span className="experience-eyebrow">THE TOOLKIT</span>
        <h2 id="tech-heading">From ideas to interfaces.</h2>
        <p>My everyday tools, with a little dimension. Drag to explore.</p>
      </div>
      <div className="tech-grid">
        {skills.map((skill) => {
          const Icon = skill.Icon || getIcon(skill.iconKey);
          return (
            <Suspense
              key={skill.name}
              fallback={
                <div className="tech-ball">
                  <Icon size={38} color={skill.color} />
                  <span>{skill.name}</span>
                </div>
              }
            >
              <TechBall skill={skill} Icon={Icon} />
            </Suspense>
          );
        })}
      </div>
    </section>
  );
}
