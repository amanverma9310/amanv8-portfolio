import { site } from "../data/site";
import { FiArrowUp, FiArrowUpRight } from "react-icons/fi";
export default function Footer() {
  return (
    <footer className="design-footer">
      <div className="footer-top">
        <div>
          <p className="experience-eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>
            Let’s make it
            <br />
            <span>something good.</span>
          </h2>
        </div>
        <div className="footer-connect">
          <a href={`mailto:${site.email}`}>
            Start a conversation <FiArrowUpRight />
          </a>
          <p>
            Faridabad, India
            <br />
            Open to frontend opportunities.
          </p>
        </div>
      </div>
      <div className="footer-signature" aria-hidden="true">
        AMAN VERMA<span>↗</span>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Aman Verma</p>
        <div>
          <a
            href="https://github.com/amanverma9310"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/aman-verma-9315s"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top <FiArrowUp />
        </button>
      </div>
    </footer>
  );
}
