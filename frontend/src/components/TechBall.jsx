import { useEffect, useRef, useState } from "react";
import { THREE, createStage } from "./scene3d";

export default function TechBall({ skill, Icon }) {
  const mount = useRef(null),
    icon = useRef(null),
    object = useRef(null),
    drag = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let stage,
      alive = true,
      texture;
    try {
      const group = new THREE.Group();
      stage = createStage(mount.current, () => {});
      stage.camera.position.z = 3.9;
      const body = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1, 1),
        new THREE.MeshStandardMaterial({
          color: "#747c7f",
          roughness: 0.65,
          metalness: 0.22,
          flatShading: true,
        }),
      );
      group.add(body);
      const face = new THREE.Mesh(
        new THREE.CircleGeometry(0.6, 8),
        new THREE.MeshStandardMaterial({
          color: skill.bg || "#142633",
          roughness: 0.5,
        }),
      );
      face.position.z = 0.975;
      group.add(face);
      stage.scene.add(group);
      object.current = group;
      const svg = icon.current.querySelector("svg").cloneNode(true);
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("width", "256");
      svg.setAttribute("height", "256");
      svg.setAttribute("fill", skill.color || "#ffffff");
      svg.style.color = skill.color || "#ffffff";
      const img = new Image();
      img.onload = () => {
        if (!alive) return;
        texture = new THREE.Texture(img);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        const logo = new THREE.Mesh(
          new THREE.PlaneGeometry(0.85, 0.85),
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          }),
        );
        logo.position.z = 0.99;
        group.add(logo);
        setReady(true);
      };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    } catch {
      /* The visible SVG fallback remains usable without WebGL. */
    }
    return () => {
      alive = false;
      object.current = null;
      stage?.dispose();
      texture?.dispose();
    };
  }, [skill.color, skill.bg, Icon]);
  const turn = (dx, dy) => {
    if (!object.current) return;
    object.current.rotation.y += dx;
    object.current.rotation.x += dy;
  };
  return (
    <button
      type="button"
      className="tech-ball"
      aria-label={`${skill.name}: drag to rotate, arrow keys to turn, Enter to reset`}
      onPointerDown={(e) => {
        drag.current = [e.clientX, e.clientY];
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        turn(
          (e.clientX - drag.current[0]) * 0.018,
          (e.clientY - drag.current[1]) * 0.018,
        );
        drag.current = [e.clientX, e.clientY];
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(e) => {
        const turns = {
          ArrowLeft: [-0.3, 0],
          ArrowRight: [0.3, 0],
          ArrowUp: [0, -0.3],
          ArrowDown: [0, 0.3],
        };
        if (turns[e.key]) {
          e.preventDefault();
          turn(...turns[e.key]);
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          object.current?.rotation.set(0, 0, 0);
        }
      }}
      onDoubleClick={() => object.current?.rotation.set(0, 0, 0)}
    >
      <span ref={mount} className="tech-ball-canvas" />
      <span
        ref={icon}
        className={`tech-ball-fallback ${ready ? "is-ready" : ""}`}
        aria-hidden="true"
      >
        <Icon size={38} color={skill.color} />
      </span>
      <span className="tech-ball-name">{skill.name}</span>
    </button>
  );
}
