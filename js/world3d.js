"use strict";
/* ---------- Mundo 3D (Three.js) ---------- */
const HAS3=typeof THREE!=="undefined";
let ren,scn,cam,pm,legL,legR,arrowM,lastCs="",pt="",fo=0;
const grp={},dyn={},lim=[];
const X=x=>(x-240)/20,Z=y=>(y-160)/20;
const H3={"💨":1.8,"🔋":1.4,"🍽️":.9,"🔬":1,"🧪":1.1,"🖥️":1.3,"🧫":.9,"🌱":.6,"🥬":.6,"🍅":.8,"💧":.9,"📡":1.2,"🛰️":1.5,"🗺️":.5,"☀️":.5,"⛰️":1.3};
function tex(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);return new THREE.CanvasTexture(c)}
function sprite(t,emoji){const c=document.createElement("canvas");c.width=emoji?128:256;c.height=emoji?128:64;const g=c.getContext("2d");g.textAlign="center";g.textBaseline="middle";
 if(emoji){g.font="84px sans-serif";g.fillText(t,64,70)}else{g.font="bold 26px sans-serif";g.lineWidth=5;g.strokeStyle="rgba(0,0,0,.75)";g.strokeText(t,128,32);g.fillStyle="#fff";g.fillText(t,128,32)}
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));s.scale.set(emoji?1.3:3.2,emoji?1.3:.8,1);s.renderOrder=5;return s}
function box(w,h,d,col,x,y,z,basic){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),basic?new THREE.MeshBasicMaterial({color:col}):new THREE.MeshStandardMaterial({color:col,roughness:.7,metalness:.2}));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;return m}
function build(k){const s=SC[k],G=new THREE.Group();
 if(s.ext){
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(140,90),new THREE.MeshStandardMaterial({color:0xa85a38,roughness:1}));gr.rotation.x=-Math.PI/2;gr.position.z=-8;gr.receiveShadow=true;G.add(gr);
  for(let i=0;i<8;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(6+i%3*2,4+i%2*3,6),new THREE.MeshStandardMaterial({color:0x8e4a32}));h.position.set(-34+i*10,2,-24);G.add(h)}
  [[-9,5],[10,6.5],[-4,7.2],[8,-1],[-11,0.5],[11,2]].forEach(r=>{const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.6),new THREE.MeshStandardMaterial({color:0x7b3b27}));m.position.set(r[0],.3,r[1]);m.castShadow=true;G.add(m)});
  const sun=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0xffe6bf}));sun.position.set(14,9,-30);G.add(sun);
  G.add(box(6,3.2,3.4,0xd8d4e6,0,1.6,-3.7),box(4.6,.5,.2,0x1b3a5c,0,2.5,-1.95,1))}
 else{
  const ft=tex(128,128,(g,w,h)=>{g.fillStyle=s.fl;g.fillRect(0,0,w,h);g.strokeStyle="rgba(255,255,255,.14)";g.lineWidth=3;g.strokeRect(0,0,w,h)});ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(12,6);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(24,11.6),new THREE.MeshStandardMaterial({map:ft,roughness:.8}));fl.rotation.x=-Math.PI/2;fl.position.z=2.2;fl.receiveShadow=true;G.add(fl);
  G.add(box(24.6,3.4,.3,0x4b4a5c,0,1.7,-3.75),box(.3,3.4,11.6,0x413f52,-12.15,1.7,2.2),box(.3,3.4,11.6,0x413f52,12.15,1.7,2.2),box(8,.1,.3,0xfff2d8,0,3.1,-3.55,1));
  const wt=tex(128,96,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#2a1520");gr.addColorStop(.68,"#e49a62");gr.addColorStop(.68,"#8e4a32");gr.addColorStop(1,"#6a3320");g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle="#ffe6bf";g.beginPath();g.arc(w*.7,h*.4,8,0,7);g.fill()});
  [-8.5,0,8.5].forEach(x=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(4,2.3),new THREE.MeshBasicMaterial({map:wt}));w.position.set(x,2,-3.58);G.add(w,box(4.3,.12,.1,0x9a96b0,x,3.18,-3.55),box(4.3,.12,.1,0x9a96b0,x,.82,-3.55),box(.1,2.4,.1,0x9a96b0,x,2,-3.55))});
  const pl=new THREE.PointLight(0xffe0c0,.7,30);pl.position.set(0,5,2);G.add(pl)}
 s.obj.forEach(o=>{const w=o.w/20,d=o.h/20,h=H3[o.e]||1,x=X(o.x+o.w/2),z=Z(o.y+o.h/2);
  const m=box(w,h,d,o.c,x,h/2,z);m.material.emissive=new THREE.Color(0xffc15a);m.material.emissiveIntensity=0;G.add(m,box(w*.8,.08,d*.6,0x1b1a22,x,h+.04,z));
  for(let i=0;i<3;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.07),new THREE.MeshBasicMaterial({color:0x7be0a0}));l.position.set(x-w/2+.3+i*.25,h*.35,z+d/2+.02);G.add(l);lim.push({m:l.material,ph:i*2+o.x})}
  const e=sprite(o.e,1);e.position.set(x,h+.9,z);const t=sprite(o.l);t.position.set(x,.3,z+d/2+.55);G.add(e,t);if(o.st)dyn[o.st]=m});
 s.dr.forEach(d=>{const w=d.w/20,dd=d.h/20,x=X(d.x+d.w/2),z=Z(d.y+d.h/2);
  const pad=new THREE.Mesh(new THREE.BoxGeometry(w,.05,dd),new THREE.MeshBasicMaterial({color:0xffc15a,transparent:true,opacity:.5}));pad.position.set(x,.03,z);G.add(pad);
  const t=sprite(SC[d.to].n);t.position.set(x,2.7,z);G.add(t);
  if(d.y<100){const zz=s.ext?Z(d.y)-.02:-3.56;G.add(box(w,2.4,.12,0x15131b,x,1.2,zz),box(w+.3,.15,.14,0xffc15a,x,2.45,zz,1))}
  else if(d.x<10||d.x>440){const xx=d.x<10?-11.97:11.97;G.add(box(.12,2.4,dd,0x15131b,xx,1.2,z),box(.14,.15,dd+.3,0xffc15a,xx,2.45,z,1))}});
 G.visible=false;scn.add(G);grp[k]=G}
function mkPlayer(){const g=new THREE.Group(),M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.6}),add=(m,x,y,z,p)=>{m.position.set(x,y,z);m.castShadow=true;(p||g).add(m);return m};
 add(new THREE.Mesh(new THREE.CylinderGeometry(.34,.4,.9,12),M(0xf4f0ea)),0,.98,0);
 add(new THREE.Mesh(new THREE.SphereGeometry(.38,16,12),M(0xf4f0ea)),0,1.68,0);
 const v=add(new THREE.Mesh(new THREE.SphereGeometry(.3,16,12),new THREE.MeshStandardMaterial({color:0x1b3a5c,metalness:.6,roughness:.2})),0,1.68,.2);v.scale.set(1,.7,.6);
 add(new THREE.Mesh(new THREE.BoxGeometry(.5,.7,.25),M(0xff8a4c)),0,1,-.4);
 legL=new THREE.Group();legR=new THREE.Group();legL.position.set(-.16,.55,0);legR.position.set(.16,.55,0);
 add(new THREE.Mesh(new THREE.BoxGeometry(.22,.55,.25),M(0xd9d4cc)),0,-.27,0,legL);add(new THREE.Mesh(new THREE.BoxGeometry(.22,.55,.25),M(0xd9d4cc)),0,-.27,0,legR);g.add(legL,legR);return g}
function rs(){dpr=devicePixelRatio||1;if(!ren)return;ren.setPixelRatio(Math.min(dpr,2));ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
if(HAS3){
 ren=new THREE.WebGLRenderer({canvas:cv,antialias:true});ren.shadowMap.enabled=true;
 scn=new THREE.Scene();scn.background=new THREE.Color(0x0e0809);cam=new THREE.PerspectiveCamera(45,1,.1,200);
 scn.add(new THREE.AmbientLight(0xffffff,.75));
 const dir=new THREE.DirectionalLight(0xffe0c0,.7);dir.position.set(6,12,8);dir.castShadow=true;dir.shadow.mapSize.set(1024,1024);Object.assign(dir.shadow.camera,{left:-16,right:16,top:12,bottom:-12,near:1,far:40});scn.add(dir);
 Object.keys(SC).forEach(build);
 pm=mkPlayer();scn.add(pm);
 arrowM=new THREE.Mesh(new THREE.ConeGeometry(.35,.7,12),new THREE.MeshBasicMaterial({color:0xffc15a}));arrowM.rotation.x=Math.PI;scn.add(arrowM);
 addEventListener("resize",rs);rs()}
function loop(t){
 const dt=Math.min(.05,(t-last)/1000||0),T=t/1000;last=t;step(dt);
 if(cs!==lastCs){for(const k in grp)grp[k].visible=k===cs;scn.background.set(cs==="ext"?0xd98a5a:0x0e0809);scn.fog=cs==="ext"?new THREE.Fog(0xd98a5a,30,70):null}
 const px=X(p.x),pz=Z(p.y);pm.position.set(px,0,pz);
 if(p.mv&&p.ax!==undefined){const a=Math.atan2(p.ax,p.ay);let da=((a-pm.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;pm.rotation.y+=da*Math.min(1,dt*12)}
 const sw=p.mv?Math.sin(p.t*14)*.7:0;legL.rotation.x=sw;legR.rotation.x=-sw;pm.position.y=p.mv?Math.abs(Math.sin(p.t*14))*.06:0;
 const asp=innerWidth/innerHeight,k=asp<1?1.2+(1-asp)*.9:1,dx=Math.max(-5,Math.min(5,px)),want=new THREE.Vector3(dx,8.2*k,pz+7.6*k);
 if(cs!==lastCs)cam.position.copy(want);else cam.position.lerp(want,Math.min(1,dt*5));cam.lookAt(dx,.7,pz-.6);lastCs=cs;
 lim.forEach(l=>l.m.color.setHex(Math.sin(T*3+l.ph)>0?0x7be0a0:0x2a5a40));
 const tg=on?target():null;let ok=false;
 if(tg){let ax,az,ay;if(cs===PL[tg.k]){const o=SC[cs].obj.find(o=>o.st===tg.k);ax=X(o.x+o.w/2);az=Z(o.y+o.h/2);ay=(H3[o.e]||1)+2}
  else{const nx=cs==="hub"?PL[tg.k]:"hub",d=SC[cs].dr.find(d=>d.to===nx);if(d){ax=X(d.x+d.w/2);az=Z(d.y+d.h/2);ay=3.4}}
  if(ay!==undefined){arrowM.position.set(ax,ay+Math.sin(T*5)*.25,az);ok=true}}
 arrowM.visible=ok;
 for(const s in dyn)dyn[s].material.emissiveIntensity=(tg&&tg.k===s&&cs===PL[s])?.35+.25*Math.sin(T*4):0;
 const o=on&&!mo?nearObj():null,m=o&&tg&&o.st===tg.k?"E · "+(tg.k==="com"?"Enviar informe":ACT[tg.k].l):"";
 if(m!==pt){pt=m;$("#prm").textContent=m;$("#prm").classList.toggle("hide",!m)}
 const f=$("#fade");if(trans){const a=trans.t<trans.h?trans.t/trans.h:Math.max(0,2-trans.t/trans.h);f.style.opacity=Math.min(1,a);f.textContent=trans.txt||"";fo=1}else if(fo){f.style.opacity=0;f.textContent="";fo=0}
 ren.render(scn,cam);requestAnimationFrame(loop)}

addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(!on||mo)return;if(k.startsWith("arrow"))e.preventDefault();keys[k]=1;if(k==="e"&&!e.repeat)act()});
addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=0});
addEventListener("blur",()=>{for(const k in keys)keys[k]=0});
document.querySelectorAll("[data-d]").forEach(b=>{const d=b.dataset.d;b.addEventListener("pointerdown",e=>{e.preventDefault();tch[d]=1});["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>{tch[d]=0}))});
$("#actb").onclick=act;
if(HAS3){requestAnimationFrame(loop);menu()}else modal("<h2>Se necesita internet</h2><p>El motor 3D (Three.js) no pudo cargarse. Conéctate y recarga la página.</p>");
