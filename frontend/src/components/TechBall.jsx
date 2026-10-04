import './MobileScrollTiming.css';
import { useRef } from 'react';

// CSS faces share the browser compositor instead of allocating a WebGL
// context for every skill. The logo stays an ordinary, reliable inline SVG.
const phi = (1 + Math.sqrt(5)) / 2;
const vertices = [[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]].map(v=>v.map(n=>n*19));
const indices = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const faces = indices.map(([a,b,c])=>{
  const A=vertices[a], B=vertices[b], C=vertices[c];
  const u=B.map((n,i)=>n-A[i]), v=C.map((n,i)=>n-A[i]);
  const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const length=Math.hypot(...normal); const n=normal.map(x=>x/length);
  const shade=Math.round(94+32*(n[0]*-.3+n[1]*-.5+n[2]*.8));
  return {transform:`matrix3d(${[...u.map(x=>x/100),0,...v.map(x=>x/100),0,...n,0,...A,1].join(',')})`,background:`rgb(${shade} ${shade+7} ${shade+12})`};
});

export default function TechBall({ skill, Icon }) {
  const body=useRef(null), drag=useRef(null), angle=useRef([0,0]);
  const turn=(dx,dy)=>{angle.current=[angle.current[0]+dx,angle.current[1]+dy];if(body.current)body.current.style.transform=`rotateX(${angle.current[1]}deg) rotateY(${angle.current[0]}deg)`;};
  const reset=()=>{angle.current=[0,0];turn(0,0);};
  return <button type="button" className="tech-ball" aria-label={`${skill.name}: drag to rotate, arrow keys to turn, Enter to reset`}
    onPointerDown={e=>{if(e.button!==0)return;drag.current=[e.clientX,e.clientY];e.currentTarget.setPointerCapture(e.pointerId);}}
    onPointerMove={e=>{if(!drag.current)return;turn((e.clientX-drag.current[0])*.8,(e.clientY-drag.current[1])*.8);drag.current=[e.clientX,e.clientY];}}
    onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}
    onDoubleClick={reset} onKeyDown={e=>{const steps={ArrowLeft:[-17,0],ArrowRight:[17,0],ArrowUp:[0,-17],ArrowDown:[0,17]};if(steps[e.key]){e.preventDefault();turn(...steps[e.key]);}if(e.key==='Enter'||e.key===' '){e.preventDefault();reset();}}}>
    <span aria-hidden="true" style={{position:'absolute',top:0,left:0,width:'100%',height:'80%',perspective:500,display:'grid',placeItems:'center',pointerEvents:'none'}}>
      <span ref={body} style={{position:'relative',width:0,height:0,transformStyle:'preserve-3d'}}>
        {faces.map((face,i)=><span key={i} style={{position:'absolute',left:0,top:0,width:100,height:100,transformOrigin:'0 0',clipPath:'polygon(0 0,100% 0,0 100%)',backfaceVisibility:'visible',...face}}/>)}
        <span style={{position:'absolute',left:-23,top:-23,width:46,height:46,transform:'translateZ(33px)',display:'grid',placeItems:'center',background:skill.bg||'#142633',borderRadius:10,backfaceVisibility:'hidden'}}><Icon size={33} color={skill.color||'#fff'}/></span>
        <span style={{position:'absolute',left:-23,top:-23,width:46,height:46,transform:'rotateY(180deg) translateZ(33px)',display:'grid',placeItems:'center',background:skill.bg||'#142633',borderRadius:10,backfaceVisibility:'hidden'}}><Icon size={33} color={skill.color||'#fff'}/></span>
      </span>
    </span>
    <span className="tech-ball-name">{skill.name}</span>
  </button>;
}
