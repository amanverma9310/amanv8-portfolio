import { useEffect, useRef, useState } from 'react';
import { THREE, createTechStage } from './techBallRenderer';
import './MobileScrollTiming.css';

export default function TechBall({ skill, Icon }) {
  const mount = useRef(null), icon = useRef(null), object = useRef(null), drag = useRef(null), stageRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let stage, alive = true, texture, logoLoaded = false;
    queueMicrotask(() => { if (alive) setReady(false); });
    try {
      const group = new THREE.Group();
      stage = createTechStage(mount.current, () => { if (alive && logoLoaded) setReady(true); }, () => { if (alive) setReady(false); });
      stageRef.current = stage;
      stage.camera.position.z = 3.9;
      const body = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1),
        new THREE.MeshStandardMaterial({ color: '#747c7f', roughness: .65, metalness: .22, flatShading: true }));
      group.add(body);
      const face = new THREE.Mesh(new THREE.CircleGeometry(.6, 8),
        new THREE.MeshStandardMaterial({ color: skill.bg || '#142633', roughness: .5 }));
      face.position.z = .975; group.add(face);
      stage.scene.add(group); object.current = group;
      const svg = icon.current.querySelector('svg').cloneNode(true);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '256'); svg.setAttribute('height', '256');
      svg.setAttribute('fill', skill.color || '#ffffff'); svg.style.color = skill.color || '#ffffff';
      const img = new Image();
      img.onload = () => {
        if (!alive) return;
        texture = new THREE.Texture(img); texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true;
        const logo = new THREE.Mesh(new THREE.PlaneGeometry(.85, .85), new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }));
        logo.position.z = .99; group.add(logo); logoLoaded = true; stage.render();
      };
      img.onerror = () => { if (alive) setReady(false); };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    } catch { /* The visible SVG fallback remains usable without WebGL. */ }
    return () => { alive = false; object.current = null; stageRef.current = null; stage?.dispose(); texture?.dispose(); };
  }, [skill.color, skill.bg, Icon]);
  const turn = (dx, dy) => {
    if (!object.current) return;
    object.current.rotation.y += dx; object.current.rotation.x += dy;
    stageRef.current?.render();
  };
  const reset = () => { object.current?.rotation.set(0,0,0); stageRef.current?.render(); };
  return <button type="button" className="tech-ball" aria-label={`${skill.name}: drag to rotate, arrow keys to turn, Enter to reset`}
    onPointerDown={(e) => { drag.current = [e.clientX, e.clientY]; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={(e) => { if (!drag.current) return; turn((e.clientX-drag.current[0])*.018, (e.clientY-drag.current[1])*.018); drag.current=[e.clientX,e.clientY]; }}
    onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
    onKeyDown={(e) => {
      const turns = { ArrowLeft: [-.3,0], ArrowRight: [.3,0], ArrowUp: [0,-.3], ArrowDown: [0,.3] };
      if (turns[e.key]) { e.preventDefault(); turn(...turns[e.key]); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reset(); }
    }} onDoubleClick={reset}>
    <span ref={mount} className="tech-ball-canvas" />
    <span ref={icon} className={`tech-ball-fallback ${ready ? 'is-ready' : ''}`} aria-hidden="true"><Icon size={38} color={skill.color} /></span>
    <span className="tech-ball-name">{skill.name}</span>
  </button>;
}
