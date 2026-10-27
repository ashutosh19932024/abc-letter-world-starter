import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';

// Geometry is authored here; no external models, textures, trackers or asset requests.
export default function Scene({type='island',cells=[],position=[0,0],phase=0,onUnavailable}) {
  const host=useRef(null);
  useEffect(()=>{
    const element=host.current; let renderer,observer,disposed=false;
    const scene=new THREE.Scene(); scene.background=new THREE.Color('#dceff1');
    const camera=new THREE.OrthographicCamera(-7,7,5,-5,.1,80); camera.position.set(9,11,13); camera.lookAt(0,0,0);
    const geometries=[],materials=[];
    const box=(x,y,z,w,h,d,color)=>{
      const g=new THREE.BoxGeometry(w,h,d),m=new THREE.MeshLambertMaterial({color}); geometries.push(g);materials.push(m);
      const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);scene.add(mesh);return mesh;
    };
    const cone=(x,y,z,color)=>{
      const g=new THREE.ConeGeometry(.62,1.6,5),m=new THREE.MeshLambertMaterial({color});geometries.push(g);materials.push(m);
      const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);scene.add(mesh);
    };
    scene.add(new THREE.HemisphereLight(0xffffff,0x57744a,2.5));
    const light=new THREE.DirectionalLight(0xfff3d6,3);light.position.set(4,10,6);scene.add(light);
    if(type==='island') {
      box(0,-1.1,0,13,.3,10,'#7dc8d4');
      for(const x of [-3.6,3.6]) {box(x,-.35,0,4.2,1.3,5.8,'#b99d77');box(x,.35,0,4.3,.25,5.9,'#a5c780');}
      for(const [x,z] of [[-4.6,-1.7],[4.8,-1.6],[-4.5,1.7],[4.4,1.8]]) {box(x,.9,z,.25,1,.25,'#947257');cone(x,1.9,z,'#5d9770');}
      for(let i=0;i<3;i++) box(-1.3+i*1.3,.3,0,1.1,.3,1.4,cells.includes(i)?'#f5c46d':'#b5c6c1');
      box(-3,1,0,.65,1,.65,'#6e70ad');box(-3,1.8,0,.8,.65,.8,'#f5d3a2');
      box(3,1,0,.16,1.6,.16,'#8d7355');box(3.5,1.6,0,.8,.6,.1,phase===3?'#69ad82':'#f3bc5d');
      for(let i=0;i<3;i++) box(2.3+i*.6,.7,-1.6,.35,.45+((phase+i)%3)*.25,.35,['#dc927a','#e8bd5d','#8d9dce'][i]);
    } else if(type==='robot') {
      for(let i=0;i<16;i++){const x=i%4,z=Math.floor(i/4);box((x-1.5)*1.4,0,(z-1.5)*1.4,1.3,.3,1.3,cells.includes(i)?'#899a94':'#c7d9be');if(cells.includes(i))box((x-1.5)*1.4,.6,(z-1.5)*1.4,1.1,.9,1.1,'#7c9190');}
      const x=(position[0]-1.5)*1.4,z=(position[1]-1.5)*1.4;
      box(x,.8,z,.8,1,.65,'#8c91d1');box(x,1.55,z,.95,.55,.8,'#f5cc76');box(x,1.55,z+.42,.6,.2,.03,'#2d4e57');
    } else if(type==='eco') {
      const palette={tree:'#79a67c',solar:'#6776af',water:'#74bfd1',home:'#ebbb79',recycle:'#b6b177'};
      for(let i=0;i<9;i++){const x=(i%3-1)*2,z=(Math.floor(i/3)-1)*2;box(x,0,z,1.85,.4,1.85,'#bccca0');if(cells[i]){box(x,.65,z,1.1,1,1.1,palette[cells[i]]);if(cells[i]==='tree')cone(x,1.7,z,'#74a67a');if(cells[i]==='home')cone(x,1.6,z,'#c78269');}}
    } else if(type==='math') {
      scene.background=new THREE.Color('#222f4c');box(0,-.5,0,.5,1,.5,'#9a9bb3');box(0,.2,0,8,.2,2,'#e5cf9c');
      for(let i=0;i<cells.length;i++)box(-3+(i%6)*1.2,.9+Math.floor(i/6),0,.7,.8,.8,'#f0b96d');
      cone(4,1.4,0,'#e6e2d6');box(4,.3,0,.85,1.3,.85,'#b7c5d1');
    } else {
      box(0,-.2,0,8,.4,5,'#b4d7cc');box(-2,.4,0,1.2,1,1,'#eecc75');box(2,.5,0,1,1.2,1,phase?'#f9d264':'#889b9d');
      for(const z of [-1.5,1.5])box(0,.15,z,4.5,.1,.12,'#8a8eb9');
      box(-2,.15,0,.1,.1,3,'#8a8eb9');box(2,.15,0,.1,.1,3,'#8a8eb9');
    }
    const cleanup=()=>{disposed=true;observer?.disconnect();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());if(renderer){renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.dispose();renderer.domElement.remove();}};
    const lost=e=>{e.preventDefault();onUnavailable();};
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
      renderer.domElement.setAttribute('aria-hidden','true');element.appendChild(renderer.domElement);renderer.domElement.addEventListener('webglcontextlost',lost);
      const resize=()=>{if(disposed)return;const width=element.clientWidth,height=element.clientHeight;renderer.setSize(width,height,false);const aspect=width/height;camera.left=-5*aspect;camera.right=5*aspect;camera.updateProjectionMatrix();renderer.render(scene,camera);};
      observer=new ResizeObserver(resize);observer.observe(element);resize();
    } catch { cleanup();onUnavailable(); }
    return cleanup;
  },[type,JSON.stringify(cells),JSON.stringify(position),phase,onUnavailable]);
  return <div className="discovery-scene" ref={host} aria-label="Decorative three-dimensional view. Use the game controls below."/>;
}
