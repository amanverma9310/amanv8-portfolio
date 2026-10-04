import { lazy, Suspense, useState } from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { site } from "../data/site";
import "./ContactEarth.css";
import MovingStars from "./MovingStars";
const EarthGlobe = lazy(() => import("./EarthGlobe"));

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [draftUrl, setDraftUrl] = useState("");
  const handleChange = (e) => {
    setForm((value) => ({ ...value, [e.target.name]: e.target.value }));
    setDraftUrl("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `Name: ${form.name.trim()}\nReply email: ${form.email.trim()}\n\n${form.message.trim()}`;
    const url = `mailto:${site.email}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(body)}`;
    setDraftUrl(url);
    window.location.href = url;
  };
  return (
    <section
      id="contact"
      className="contact-earth-section"
      aria-labelledby="contact-title"
    >
      <MovingStars />
      <div className="contact-earth-layout">
        <div className="contact-earth-panel">
          <span className="experience-eyebrow">LET'S CONNECT</span>
          <h2 id="contact-title">Contact.</h2>
          <p className="contact-earth-intro">
            Have a project in mind? Let's build something together.
          </p>
          <form onSubmit={handleSubmit} className="contact-earth-form">
            <div>
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="contact-email">Your Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                maxLength={150}
              />
            </div>
            <div>
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What do you want to say?"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
              />
            </div>
            <button type="submit">Open email draft</button>
            <p className="contact-earth-draft-note">
              This opens your email app. Review the draft and press Send there.
            </p>
            {draftUrl && (
              <div className="contact-earth-status" role="status">
                Email draft prepared.{" "}
                <a href={draftUrl}>Open the draft again ↗</a>
              </div>
            )}
          </form>
          <p className="contact-earth-direct-email">
            Or email me directly:{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <div className="contact-earth-socials">
            <a
              href="https://github.com/amanverma9310"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/aman-verma-9315s"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
            <a href={`mailto:${site.email}`} aria-label="Email">
              <FiMail />
            </a>
          </div>
        </div>
        <div className="contact-earth-globe">
          <Suspense
            fallback={
              <div className="contact-earth-loading" role="status">
                Loading Earth…
              </div>
            }
          >
            <EarthGlobe />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
