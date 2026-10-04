import { site } from '../data/site';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';
import { arsenal as staticArsenal } from '../data/skills';
import portrait from '../assets/hero-photo.jpeg';

// Mirror the opening around the middle of the section for either scroll direction.
// Keep the doors closed through the approach, then ease slowly into the reveal.
function doorOpening(progress) {
  const amount = Math.max(0, Math.min(1, (.2 - Math.abs(progress - .5)) / .16));
  return amount * amount * (3 - 2 * amount);
}

export default function Manifesto() {
  const section=useRef(null);
  const arsenal=staticArsenal;
  const [scrollOpen,setScrollOpen]=useState(false);
  const reduced=useReducedMotion();
  const scrollYProgress=useMotionValue(0);
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;
      const el=section.current;
      if(!el)return;
      const viewport=window.innerHeight;
      const progress=(viewport-el.getBoundingClientRect().top)/(el.offsetHeight+viewport);
      scrollYProgress.set(Math.max(0,Math.min(1,progress)));
    };
    const queue=()=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        update();
        // Read once more after the browser commits a large/reversed scroll jump.
        frame=requestAnimationFrame(update);
      });
    };
    window.addEventListener('scroll',queue,{passive:true});
    window.addEventListener('resize',queue);
    const observer=new ResizeObserver(queue);
    observer.observe(section.current);
    update();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);};
  },[scrollYProgress]);
  const leftAngle=useTransform(scrollYProgress,(progress)=>-110 * doorOpening(progress));
  const rightAngle=useTransform(leftAngle,(angle)=>-angle);
  useMotionValueEvent(scrollYProgress,'change',(v)=>setScrollOpen(doorOpening(v)>.1));
  const isOpen=scrollOpen;
  const angleStyle=(side)=> reduced ? {opacity:isOpen?0:1} : {rotateY:side==='left'?leftAngle:rightAngle};
  return <section ref={section} id="about" className="about-experience" aria-labelledby="about-heading">
    <div className="about-sticky">
      <div className="about-title"><span className="experience-eyebrow">01 / BEHIND THE CODE</span><h2 id="about-heading">A little more <span>about me.</span></h2></div>
      <div className="about-window">
        <motion.div className="about-profile" animate={{opacity:isOpen?1:0,scale:isOpen?1:.96}} transition={{duration:reduced?0:.4}} aria-hidden={!isOpen} inert={!isOpen}>
          <img className="about-portrait" src={portrait} alt="Aman Verma" loading="lazy" />
          <h3>Aman Verma</h3><span className="about-role">FRONTEND DEVELOPER</span>
          <p>I'm a BCA graduate based in Faridabad, Haryana. I build responsive interfaces with React, JavaScript, and Tailwind CSS, and I'm currently learning backend development.</p>
          <p className="about-secondary">I also use Claude AI and other development tools to help build complete MERN applications, while strengthening my understanding through hands-on projects.</p>
          <div className="about-socials">
            <a href="https://github.com/amanverma9310" target="_blank" rel="noopener noreferrer"><FiGithub/>GitHub<FiArrowUpRight/></a>
            <a href="https://www.linkedin.com/in/aman-verma-9315s" target="_blank" rel="noopener noreferrer"><FiLinkedin/>LinkedIn<FiArrowUpRight/></a>
            <a href={`mailto:${site.email}`}><FiMail/>Email<FiArrowUpRight/></a>
          </div>
          <div className="about-arsenal" aria-label="My technologies">{arsenal.map(({name,Icon,color})=><span key={name}><Icon size={12} color={color}/>{name}</span>)}</div>
          <a className="about-project-link" href="#projects">EXPLORE MY WORK <FiArrowUpRight/></a>
        </motion.div>
        <motion.div className="about-door about-door-left" style={angleStyle('left')} aria-hidden="true" />
        <motion.div className="about-door about-door-right" style={angleStyle('right')} aria-hidden="true" />
        {!isOpen && <div className="about-seal" aria-hidden="true"><span aria-hidden="true">✦</span><span className="about-seal-label">SCROLL TO OPEN</span></div>}
      </div>
      <div className="about-actions"><p>{isOpen?'Keep scrolling to continue.':'Scroll through to open the doors.'}</p></div>
    </div>
    <div className="about-horizon" aria-hidden="true"/>
  </section>;
}
