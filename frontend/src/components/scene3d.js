import * as THREE from 'three';

// One lifecycle for both experiences: stop offscreen, respect reduced motion,
// limit mobile resolution, and release every GPU resource on unmount.
export function createStage(host, frame) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 40);
  camera.position.set(0, 0, 4.8);
  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const key = new THREE.DirectionalLight(0xffe2f1, 3.2);
  key.position.set(-3, 4, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0x6d9fff, 2);
  fill.position.set(3, -2, 3); scene.add(fill);
  let raf = 0, visible = false, alive = true, last = 0;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const draw = (time) => {
    raf = 0;
    if (!alive || !visible || document.hidden) return;
    const dt = Math.min((time - (last || time)) / 1000, .04); last = time;
    frame(dt, mq.matches);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(draw);
  };
  const resume = () => {
    if (alive && visible && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(draw); }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) { cancelAnimationFrame(raf); raf = 0; } else resume();
  }, { rootMargin: '80px' });
  observer.observe(host);
  const resize = new ResizeObserver(() => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  });
  resize.observe(host);
  document.addEventListener('visibilitychange', resume);
  return { renderer, scene, camera, dispose() {
    alive = false; cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
    document.removeEventListener('visibilitychange', resume);
    const resources = new Set();
    scene.traverse((node) => {
      if (node.geometry) resources.add(node.geometry);
      if (node.material) for (const mat of (Array.isArray(node.material) ? node.material : [node.material])) {
        resources.add(mat); for (const value of Object.values(mat)) if (value?.isTexture) resources.add(value);
      }
    });
    for (const resource of resources) resource.dispose();
    renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  }};
}
export { THREE };
