import * as THREE from 'three';

// One WebGL context renders every ball. Each visible canvas holds a 2D copy
// of its own scene, so phones do not need eight independent GPU contexts.
let renderer = null, frame = 0, disposal = 0, lost = false;
const views = new Set();
const pending = new Set();
function flush() {
  frame = 0;
  if (!renderer || lost) return;
  for (const view of pending) {
    if (!views.has(view)) continue;
    const width = view.host.clientWidth, height = view.host.clientHeight;
    if (!width || !height) continue;
    try {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      view.camera.aspect = width / height;
      view.camera.updateProjectionMatrix();
      renderer.render(view.scene, view.camera);
      view.canvas.width = renderer.domElement.width;
      view.canvas.height = renderer.domElement.height;
      view.context.clearRect(0, 0, view.canvas.width, view.canvas.height);
      view.context.drawImage(renderer.domElement, 0, 0);
      view.onRender();
    } catch { view.onUnavailable(); }
  }
  pending.clear();
}
function request(view) {
  pending.add(view);
  if (!frame && !lost) frame = requestAnimationFrame(flush);
}
function contextLost(event) {
  event.preventDefault(); lost = true;
  cancelAnimationFrame(frame); frame = 0;
  // Keep the last complete bitmap visible while the GPU recovers.
}
function contextRestored() {
  lost = false;
  for (const view of views) request(view);
}
function release() {
  if (views.size || !renderer) return;
  cancelAnimationFrame(frame); frame = 0; pending.clear();
  renderer.domElement.removeEventListener('webglcontextlost', contextLost);
  renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
  renderer.dispose(); renderer.forceContextLoss(); renderer = null; lost = false;
}
export function createTechStage(host, onRender, onUnavailable) {
  clearTimeout(disposal);
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
  }
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) { disposal = setTimeout(release, 0); throw new Error('Canvas unavailable'); }
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 40);
  camera.position.set(0, 0, 3.9);
  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const key = new THREE.DirectionalLight(0xffe2f1, 3.2); key.position.set(-3, 4, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0x6d9fff, 2); fill.position.set(3, -2, 3); scene.add(fill);
  const view = { host, canvas, context, scene, camera, onRender, onUnavailable };
  views.add(view);
  const resize = new ResizeObserver(() => request(view)); resize.observe(host);
  request(view);
  return { scene, camera, render: () => request(view), dispose() {
    views.delete(view); pending.delete(view); resize.disconnect(); canvas.remove();
    const resources = new Set();
    scene.traverse(node => {
      if (node.geometry) resources.add(node.geometry);
      for (const material of (Array.isArray(node.material) ? node.material : [node.material])) {
        if (!material) continue;
        resources.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
      }
    });
    for (const resource of resources) resource.dispose();
    if (!views.size) disposal = setTimeout(release, 0);
  }};
}
export { THREE };
