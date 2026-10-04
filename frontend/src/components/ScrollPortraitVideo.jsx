import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import motionVideo from "../assets/hero-motion.mp4";

export default function ScrollPortraitVideo({ progress, poster }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  // Move the crop upward as the camera approaches, keeping the hair in frame
  // when a tall source clip fills a wide desktop viewport.
  const objectPosition = useTransform(progress, (p) => `55% ${18 - 14 * Math.min(Math.max(p / .8, 0), 1)}%`);
  useEffect(() => {
    const video = videoRef.current;
    let desired = 0, raf = 0, disposed = false;
    const seek = () => {
      raf = 0;
      if (disposed || !Number.isFinite(video.duration) || video.seeking) return;
      const target = Math.min(video.duration - .04, desired * video.duration);
      if (Math.abs(video.currentTime - target) > .025) video.currentTime = Math.max(0, target);
    };
    const update = () => {
      // The clip completes early and holds its last frame until the hero exits.
      desired = Math.max(0, Math.min(1, progress.get() / .8));
      if (!raf) raf = requestAnimationFrame(seek);
    };
    const handleReady = () => { setReady(true); update(); };
    const unsubscribe = progress.on("change", update);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("loadedmetadata", update);
    video.addEventListener("seeked", update);
    if (video.readyState >= 2) handleReady();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("loadedmetadata", update);
      video.removeEventListener("seeked", update);
    };
  }, [progress]);
  return <motion.video style={{ objectPosition }} ref={videoRef} className={`portrait-hero-video${ready ? " is-ready" : ""}`} src={motionVideo} poster={poster} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />;
}
