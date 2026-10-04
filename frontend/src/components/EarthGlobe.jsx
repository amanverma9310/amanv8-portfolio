import { useEffect, useRef, useState } from 'react';
import { THREE, createStage } from './scene3d';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function disposeModel(root) {
  const resources = new Set();
  root.traverse((node) => {
    if (node.geometry) resources.add(node.geometry);
    for (const material of (Array.isArray(node.material) ? node.material : [node.material])) {
      if (!material) continue;
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
  });
  for (const resource of resources) resource.dispose();
}

export default function EarthGlobe({ compact=false }) {
  const mount=useRef(null), model=useRef(null), drag=useRef(null), pausedRef=useRef(false);
  const [paused,setPaused]=useState(false), [failed,setFailed]=useState(false), [ready,setReady]=useState(false);
  useEffect(() => {
    let stage, alive=true;
    try {
      const globe=new THREE.Group();
      model.current=globe;
      stage=createStage(mount.current,(dt,reduced) => {
        // Match the reference's OrbitControls auto-rotation (2 rpm).
        if (!reduced && !pausedRef.current && !drag.current) globe.rotation.y+=dt*Math.PI/15;
      });
      stage.camera.fov=45;
      stage.camera.position.set(-4,0,6);
      stage.camera.lookAt(0,0,0);
      stage.camera.updateProjectionMatrix();
      stage.scene.add(globe);
      new GLTFLoader().load(`${import.meta.env.BASE_URL}3d/earth-reference/scene.gltf`,(gltf) => {
        if (!alive) { disposeModel(gltf.scene); return; }
        // Preserve the original geometry, orientation and baked pink/blue textures.
        gltf.scene.scale.setScalar(2.5);
        globe.add(gltf.scene);
        setReady(true);
      },undefined,() => { if (alive) setFailed(true); });
    } catch { queueMicrotask(() => { if (alive) setFailed(true); }); }
    const lose = (e) => { e.preventDefault(); if(alive) setFailed(true); };
    stage?.renderer.domElement.addEventListener('webglcontextlost',lose);
    return () => { alive=false; model.current=null; stage?.renderer.domElement.removeEventListener('webglcontextlost',lose); stage?.dispose(); };
  },[]);
  const reset=() => model.current?.rotation.set(0,0,0);
  const turn=(dx,dy) => { if(model.current) { model.current.rotation.y+=dx; model.current.rotation.x=Math.max(-1.2,Math.min(1.2,model.current.rotation.x+dy)); } };
  return <div className={`earth-experience ${compact ? 'earth-compact' : ''}`}>
    <div ref={mount} className="earth-canvas" role="img" aria-label="Interactive ribbon-wrapped Earth. Drag to rotate; arrow keys to turn." tabIndex={0}
      onPointerDown={(e) => { if(e.button !== 0) return; drag.current=[e.clientX,e.clientY]; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if(!drag.current) return; turn((e.clientX-drag.current[0])*.009,(e.clientY-drag.current[1])*.009); drag.current=[e.clientX,e.clientY]; }}
      onPointerUp={() => { drag.current=null; }} onPointerCancel={() => { drag.current=null; }}
      onKeyDown={(e) => { const steps={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,-.16],ArrowDown:[0,.16]}; if(steps[e.key]) { e.preventDefault(); turn(...steps[e.key]); } if(e.key==='Home') {e.preventDefault();reset();} }}>
      {(failed || !ready) && <div className="earth-fallback" aria-hidden="true"><span>🌍</span></div>}
    </div>
    <div className="earth-controls">
      <button type="button" onClick={() => { pausedRef.current=!pausedRef.current; setPaused(pausedRef.current); }} aria-pressed={paused}>{paused ? 'Resume rotation' : 'Pause rotation'}</button>
      <button type="button" onClick={reset}>Reset view</button>
    </div>
    {!compact && <p className="earth-hint">Drag to explore · “Stylized planet” </p>}
  </div>;
}
