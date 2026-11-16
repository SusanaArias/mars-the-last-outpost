"use strict";
/* Lógica del juego: datos, tareas, eventos, movimiento e interfaz */
const $=s=>document.querySelector(s),cv=$("#cv");
const NAMES={e:"Energía",o:"Oxígeno",f:"Alimentos",s:"Blindaje",c:"Ciencia",d:"Radiación"},SOLS=30;
const NASA=["Gravedad en Marte: 3,71 m/s², cerca del 38 % de la terrestre (NASA Mars Facts).","Atmósfera: ~95 % CO₂, con presión menor al 1 % de la terrestre (NASA Mars Facts).","El instrumento RAD de Curiosity midió ~0,67 mSv/día en la superficie (NASA MSL).","MOXIE, en Perseverance, produjo oxígeno a partir del CO₂ marciano (NASA Mars 2020).","Una señal tarda entre ~3 y ~22 minutos entre la Tierra y Marte (NASA/JPL).","La tormenta global de polvo de 2018 dejó sin energía solar a Opportunity (NASA/JPL)."];
const SCEN={jezero:{n:"Cráter Jezero",d:"Antiguo delta de un lago. Equilibrado.",sun:1,rad:1},arcadia:{n:"Arcadia Planitia",d:"Mucha luz solar, algo más de radiación.",sun:1.3,rad:1.1},hellas:{n:"Cuenca Hellas",d:"Menos radiación, pero poca energía solar.",sun:.75,rad:.8}};
const ACT={
sol:{l:"Limpiar los paneles solares",fx:{e:15},edu:"Marte recibe ~43 % de la luz solar terrestre; paneles limpios son clave."},
gre:{l:"Cultivar en el invernadero",fx:{f:13,e:-4},edu:"Los cultivos reducen la dependencia de alimentos enviados desde la Tierra."},
mox:{l:"Activar el generador de oxígeno",fx:{o:13,e:-7},edu:"MOXIE separa oxígeno del CO₂ atmosférico mediante electrólisis."},
shi:{l:"Cubrir el hábitat con regolito",fx:{s:9,e:-3},edu:"Sin campo magnético global, el regolito y el agua frenan la radiación."},
sci:{l:"Analizar muestras en el laboratorio",fx:{c:10,e:-4},edu:"La ciencia es el propósito de la base: rocas, clima y rastros de vida."}};
const EV=[
{t:"Tormenta de polvo",d:"El cielo se vuelve ocre y los paneles pierden luz.",c:[
{l:"Hibernar sistemas no esenciales",fx:{e:-3,c:-3},echo:{n:3,fx:{e:-8},m:"El polvo cubre los paneles tras la tormenta."},edu:"Ahorras energía, pero el polvo depositado exige limpieza luego."},
{l:"Seguir operando con normalidad",fx:{e:-16,c:6},edu:"Sin sol, las baterías se vacían rápido. Opportunity murió así en 2018."},
{l:"Salir a limpiar los paneles",fx:{e:4,d:7},edu:"Fuera del hábitat hay más radiación: la salida debe justificarse."}]},
{t:"Llamarada solar",d:"Los sensores detectan partículas solares energéticas.",c:[
{l:"Refugiarse en el módulo blindado",fx:{d:1,c:-3},edu:"Estos eventos duran horas; un refugio reduce mucho la dosis."},
{l:"Continuar el trabajo",fx:{d:14,c:5},echo:{n:4,fx:{c:-6},m:"Un tripulante sufre náuseas por la dosis recibida."},edu:"La exposición aguda tiene efectos inmediatos y a largo plazo."},
{l:"Cubrir el hábitat con agua y regolito",fx:{s:7,f:-4},edu:"El agua es excelente blindaje porque el hidrógeno frena las partículas."}]},
{t:"Fuga en la esclusa",d:"La presión baja en el módulo de acceso.",c:[
{l:"Reparación completa ahora",fx:{e:-8,o:-3},edu:"Reparar bien cuesta tiempo, pero evita que el fallo vuelva."},
{l:"Parche rápido",fx:{o:-8},echo:{n:3,fx:{o:-12},m:"El parche cede y la fuga reaparece."},edu:"Los atajos en soporte vital suelen volver con intereses."},
{l:"Sellar el módulo",fx:{o:-4,c:-6},edu:"Aislar un módulo sacrifica espacio y ciencia, pero protege el resto."}]},
{t:"Hongos en el invernadero",d:"Aparecen manchas blancas en las plantas.",c:[
{l:"Descartar y replantar",fx:{f:-12},echo:{n:4,fx:{f:12},m:"La nueva cosecha madura."},edu:"Sacrificar hoy cultivos infectados protege la producción futura."},
{l:"Tratamiento químico",fx:{f:-4,o:-3},edu:"Funciona, pero en aire cerrado los químicos se recirculan."},
{l:"Ignorarlo",fx:{f:-7},echo:{n:2,fx:{f:-12},m:"La plaga se extiende a todo el invernadero."},edu:"En ecosistemas cerrados, un problema pequeño se amplifica."}]},
{t:"Perclorato en el suelo",d:"El análisis del regolito muestra sales tóxicas.",c:[
{l:"Lavar el suelo antes de cultivar",fx:{e:-5,f:-2,c:6},edu:"La sonda Phoenix (NASA, 2008) detectó percloratos en Marte."},
{l:"Usarlo sin tratar",fx:{f:8},echo:{n:3,fx:{c:-9,f:-6},m:"La tripulación enferma levemente por el polvo tóxico."},edu:"El perclorato afecta a la tiroides y es peligroso al respirarlo."},
{l:"Usar tierra de reserva",fx:{f:4,e:-3},edu:"Las reservas son finitas: úsalas con criterio."}]},
{t:"Roca con posible biofirma",d:"El rover marca una roca sedimentaria muy interesante.",c:[
{l:"Expedición larga de campo",fx:{c:18,e:-8,d:8},edu:"Perseverance estudia el delta de Jezero buscando vida antigua."},
{l:"Enviar el rover",fx:{c:9,e:-5},edu:"Los robots amplían la exploración con menos riesgo humano."},
{l:"Posponer el estudio",fx:{c:0},echo:{n:4,fx:{c:-4},m:"Una tormenta entierra el afloramiento."},edu:"Marte cambia: algunas oportunidades científicas no esperan."}]},
{t:"Fallo de baterías",d:"El banco principal pierde capacidad.",c:[
{l:"Reiniciar y recalibrar",fx:{e:-6},edu:"Los sistemas redundantes son la regla de oro en misiones espaciales."},
{l:"Racionar energía y aire",fx:{e:4,o:-6},edu:"Sin energía, los depuradores de aire pierden eficiencia."},
{l:"Usar el reactor de reserva",fx:{e:12,d:3},echo:{n:3,fx:{e:-8},m:"El reactor exige mantenimiento forzoso."},edu:"NASA estudia reactores compactos (Kilopower) para bases marcianas."}]},
{t:"Impacto de micrometeorito",d:"Un fragmento atraviesa un panel exterior.",c:[
{l:"Reparar con el kit de emergencia",fx:{e:-4,o:-4},edu:"La atmósfera marciana es fina y frena poco a los meteoroides."},
{l:"Reforzar y cubrir",fx:{s:5,e:-6},edu:"Cubrir el hábitat protege de impactos y de radiación."},
{l:"Ignorar el daño",fx:{o:-3},echo:{n:2,fx:{o:-14,e:-6},m:"La grieta crece y provoca una fuga importante."},edu:"Los daños estructurales rara vez se arreglan solos."}]}];
const TIPS=[{t:"Prioriza el oxígeno antes de cada tormenta.",fx:{o:6}},{t:"Reserva baterías: los sistemas críticos van primero.",fx:{e:8}},{t:"Verifica el blindaje: la radiación se acumula.",fx:{s:6}}];

/* ---------- Escenas ---------- */
const PL={sol:"ext",shi:"ext",mox:"hub",gre:"gre",sci:"lab",com:"ctl"};
const SC={
hub:{n:"Módulo central",fl:"#3a3947",obj:[{x:50,y:116,w:70,h:62,e:"💨",c:"#2e5560",st:"mox",l:"Generador de O₂"},{x:350,y:104,w:90,h:42,e:"🔋",c:"#44415a",l:"Baterías"},{x:320,y:206,w:80,h:34,e:"🍽️",c:"#4a3f3a",l:"Comedor"}],
 dr:[{x:218,y:62,w:44,h:26,to:"lab",tx:240,ty:268},{x:4,y:178,w:24,h:56,to:"gre",tx:420,ty:205},{x:452,y:178,w:24,h:56,to:"ctl",tx:60,ty:205},{x:218,y:300,w:44,h:20,to:"ext",tx:240,ty:150}]},
lab:{n:"Laboratorio",fl:"#2c4250",obj:[{x:190,y:112,w:100,h:44,e:"🔬",c:"#3d5a70",st:"sci",l:"Microscopio"},{x:50,y:108,w:64,h:48,e:"🧪",c:"#3b4f66",l:"Reactivos"},{x:370,y:108,w:70,h:48,e:"🖥️",c:"#3b4f66",l:"Datos"},{x:60,y:220,w:70,h:40,e:"🧫",c:"#3b4f66",l:"Cultivos"}],
 dr:[{x:218,y:300,w:44,h:20,to:"hub",tx:240,ty:118}]},
gre:{n:"Invernadero",fl:"#2d4636",obj:[{x:60,y:112,w:150,h:36,e:"🌱",c:"#4b3a2a",st:"gre",l:"Cultivos"},{x:60,y:196,w:150,h:36,e:"🥬",c:"#4b3a2a",l:"Lechugas"},{x:270,y:112,w:100,h:36,e:"🍅",c:"#4b3a2a",l:"Tomates"},{x:270,y:196,w:100,h:36,e:"💧",c:"#2f5a70",l:"Agua"}],
 dr:[{x:452,y:178,w:24,h:56,to:"hub",tx:60,ty:205}]},
ctl:{n:"Sala de control",fl:"#35304a",obj:[{x:170,y:108,w:140,h:44,e:"📡",c:"#4a4468",st:"com",l:"Consola a la Tierra"},{x:50,y:108,w:70,h:44,e:"🖥️",c:"#4a4468",l:"Monitores"},{x:360,y:108,w:70,h:44,e:"🛰️",c:"#4a4468",l:"Satélite"},{x:190,y:218,w:100,h:30,e:"🗺️",c:"#4a4468",l:"Mapa"}],
 dr:[{x:4,y:178,w:24,h:56,to:"hub",tx:420,ty:205}]},
ext:{n:"Exterior",ext:1,obj:[{x:60,y:170,w:120,h:50,e:"☀️",c:"#26384e",st:"sol",l:"Paneles solares"},{x:300,y:170,w:120,h:50,e:"⛰️",c:"#6a3a28",st:"shi",l:"Regolito"}],
 dr:[{x:218,y:96,w:44,h:24,to:"hub",tx:240,ty:268}]}};

/* ---------- Estado ---------- */
let S,R,seed=1,cs="hub",on=false,mo=false,trans=null,dpr=1,last=0;
const p={x:240,y:150,d:1,t:0,mv:false},keys={},tch={},fl=[];
const rnd=()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const cl=v=>Math.max(0,Math.min(100,Math.round(v)));
const apply=fx=>{for(const k in fx)S[k]=k==="d"?Math.max(0,S.d+fx[k]):cl(S[k]+fx[k])};
const fxText=fx=>Object.keys(fx).filter(k=>fx[k]).map(k=>NAMES[k]+" "+(fx[k]>0?"+":"")+fx[k]).join(", ");
const dl=()=>Math.round(3+19*(.5+.5*Math.sin(S.sol/5)));
function toast(h,ms=6500){const t=document.createElement("div");t.className="to";t.innerHTML=h;$("#toast").appendChild(t);while($("#toast").children.length>3)$("#toast").firstChild.remove();setTimeout(()=>t.remove(),ms)}
function modal(h){mo=true;$("#box").innerHTML=h;$("#modal").classList.remove("hide")}
function closeModal(){mo=false;$("#modal").classList.add("hide")}

/* ---------- Flujo del juego ---------- */
function menu(){on=false;$("#hud").classList.add("hide");$("#pad").classList.add("hide");
 modal(`<h2>MARS: THE LAST OUTPOST</h2><p>Eres el astronauta de la base. Recorre los módulos, cumple las tareas de la lista y toma decisiones durante ${SOLS} soles marcianos.</p><p class="mu">Mueve con WASD o flechas (o los botones) y pulsa E para actuar. Camina hacia las puertas para cambiar de sala.</p>${Object.keys(SCEN).map(k=>`<button data-s="${k}"><b>${SCEN[k].n}</b><br><span class="mu">${SCEN[k].d}</span></button>`).join("")}<p class="mu">${NASA[Math.floor(Math.random()*NASA.length)]}</p>`);
 document.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>start(b.dataset.s))}
function start(k){seed=Math.floor(Math.random()*1e9);R=SCEN[k];
 S={sol:1,e:70,o:80,f:75,s:25,c:0,d:0,sent:-9,ev:null,seen:[],q:[],inbox:[],log:[],tasks:[],evd:0};
 S.ev=pick();newTasks();cs="hub";p.x=240;p.y=150;fl.length=0;closeModal();on=true;
 $("#hud").classList.remove("hide");$("#pad").classList.remove("hide");hud();
 toast("<b>Control de misión:</b> sigue la lista de tareas. La flecha amarilla te guía hasta la puerta o el equipo.",9000)}
function pick(){let pool=EV.filter(e=>!S.seen.includes(e.t));if(!pool.length){S.seen=[];pool=EV}const e=pool[Math.floor(rnd()*pool.length)];S.seen.push(e.t);return e}
function newTasks(){
 const lows=[["e","sol"],["o","mox"],["f","gre"],["s","shi"]].filter(x=>S[x[0]]<55).sort((a,b)=>S[a[0]]-S[b[0]]).map(x=>x[1]);
 const ks=lows.slice(0,2),rest=Object.keys(ACT).filter(k=>!ks.includes(k)).sort(()=>rnd()-.5);
 while(ks.length<2)ks.push(rest.pop());
 S.tasks=ks.map(k=>({k,done:0}));if(S.sol-S.sent>=3)S.tasks.push({k:"com",opt:1,done:0});S.evd=0}
function target(){return S&&S.tasks.find(t=>!t.done&&!t.opt)||S&&S.tasks.find(t=>!t.done)}
function hud(){
 const m=(c,i,n,v,low)=>`<div class="m ${c} ${low?"low":""}" title="${n}"><span>${i}</span><i><b style="width:${Math.min(100,v)}%"></b></i><em>${Math.round(v)}</em></div>`;
 $("#bars").innerHTML=m("e","⚡","Energía",S.e,S.e<25)+m("o","💨","Oxígeno",S.o,S.o<25)+m("f","🌱","Alimentos",S.f,S.f<25)+m("s","🛡️","Blindaje",S.s,S.s<15)+m("d","☢️","Radiación",S.d,S.d>70)+`<span class="chip">🔬 ${S.c} · Sol ${S.sol}/${SOLS} · ${R.n} · Tierra ${dl()} min</span>`;
 const req=S.tasks.filter(t=>!t.opt).every(t=>t.done);
 $("#tasks").innerHTML=`<h3>Tareas · Sol ${S.sol}</h3>`+S.tasks.map(t=>`<div class="t ${t.done?"dn":""} ${t===target()?"cur":""}">${t.done?"✔":"☐"} ${t.opt?"(opcional) ":""}${t.k==="com"?"Enviar informe a la Tierra":ACT[t.k].l}<small>${SC[PL[t.k]].n}</small></div>`).join("")+(req&&!S.evd?"":req?`<div class="t cur">⚠️ Atiende la emergencia</div>`:"");
}
function act(){
 if(!on||mo||trans)return;const o=nearObj();if(!o)return;
 const t=S.tasks.find(t=>t.k===o.st&&!t.done);
 if(!t){toast("Esa no es tu tarea ahora. Revisa la lista.",3500);return}
 t.done=1;let txt;
 if(t.k==="com"){S.sent=S.sol;const tip=TIPS[Math.floor(rnd()*TIPS.length)];S.inbox.push({at:S.sol+2,t:tip.t,fx:tip.fx,done:0});txt="Informe enviado";
  toast("<b>Informe enviado.</b> La respuesta llega en 2 soles: la Tierra no puede ayudarte en emergencias.<br><small>La luz tarda ~3 a ~22 min en cruzar el espacio, así que la tripulación debe decidir sola.</small>",9000)}
 else{apply(ACT[t.k].fx);txt=fxText(ACT[t.k].fx).replace(/, /g," · ");toast(`<b>${ACT[t.k].l}</b><br>${fxText(ACT[t.k].fx)}<br><small>${ACT[t.k].edu}</small>`,8000)}
 fl.push({x:o.x+o.w/2,y:o.y,t:0,txt});hud();
 if(S.tasks.filter(t=>!t.opt).every(t=>t.done)&&!S.evd){S.evd=1;setTimeout(()=>{hud();showEvent()},1100)}}
function showEvent(){const E=S.ev;
 modal(`<h2>🚨 ${E.t}</h2><p>${E.d}</p>${E.c.map((c,i)=>`<button data-c="${i}">${c.l}</button>`).join("")}`);
 document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>choose(+b.dataset.c))}
function choose(i){const E=S.ev,c=E.c[i];apply(c.fx);
 if(c.echo)S.q.push({at:S.sol+c.echo.n,fx:c.echo.fx,m:c.echo.m});
 S.log.push({sol:S.sol,ev:E.t,ch:c.l,edu:c.edu});hud();
 modal(`<h2>${E.t}</h2><p>Decisión: «${c.l}»<br><span class="mu">${fxText(c.fx)}${c.echo?" · Podría tener consecuencias en "+c.echo.n+" soles.":""}</span></p><div class="edu"><b>Aprende:</b> ${c.edu}</div><button class="main" id="nx">${S.sol>=SOLS?"Ver informe final":"Dormir y pasar al sol "+(S.sol+1)}</button>`);
 $("#nx").onclick=nextSol;$("#nx").focus()}
function nextSol(){
 S.e=cl(S.e-7+Math.round(10*R.sun));S.o=cl(S.o-5-(S.e<10?4:0));S.f=cl(S.f-4);S.d+=Math.max(.5,3.4*R.rad*(1-S.s/130));
 const msgs=[];
 S.q=S.q.filter(q=>{if(q.at<=S.sol+1){apply(q.fx);msgs.push("⏳ "+q.m+" ("+fxText(q.fx)+")");return false}return true});
 S.inbox.forEach(m=>{if(m.at<=S.sol+1&&!m.done){m.done=1;apply(m.fx);msgs.push("📡 <b>Tierra:</b> "+m.t+" (respuesta con retraso)")}});
 S.sol++;
 if(S.o<=0||S.f<=0||S.d>=100)return end(false);
 if(S.sol>SOLS)return end(true);
 S.ev=pick();newTasks();closeModal();go("hub",240,150,"SOL "+S.sol,.7);hud();
 msgs.forEach(m=>toast(m,9000));toast("<small>Dato NASA: "+NASA[S.sol%NASA.length]+"</small>",7000)}
function end(win){on=false;$("#hud").classList.add("hide");$("#pad").classList.add("hide");
 const why=S.o<=0?"Te quedaste sin oxígeno.":S.f<=0?"Se agotaron los alimentos.":S.d>=100?"La tripulación superó el límite de radiación.":"";
 const sc=Math.round((win?300:S.sol*6)+S.c*3+(S.e+S.o+S.f+S.s)/4-S.d),g=sc>520?"A":sc>420?"B":sc>300?"C":"D";
 modal(`<p class="big">${g}</p><h2>${win?"Misión completada":"Misión fallida"}</h2><p>${win?`Sobreviviste ${SOLS} soles en ${R.n}.`:`${why} Duraste ${S.sol-1} soles en ${R.n}.`}</p><p>Puntuación <b>${sc}</b> · Ciencia ${S.c} · Radiación ${Math.round(S.d)}/100</p><p class="mu">Energía ${S.e} · Oxígeno ${S.o} · Alimentos ${S.f} · Blindaje ${S.s}</p><h2>Informe de decisiones</h2>${S.log.map(l=>`<p><b>Sol ${l.sol} · ${l.ev}:</b> ${l.ch}<br><span class="mu">${l.edu}</span></p>`).join("")||"<p>Sin decisiones.</p>"}<p class="mu">Fuentes: NASA Mars Facts, MSL/RAD, Mars 2020 MOXIE, JPL.</p><button class="main" id="again">Jugar de nuevo</button>`);
 $("#again").onclick=menu}

/* ---------- Movimiento ---------- */
function go(to,x,y,txt,h=.2){trans={t:0,h,to,x,y,txt,sw:0}}
const hit=(x,y)=>SC[cs].obj.some(o=>x+7>o.x&&x-7<o.x+o.w&&y>o.y&&y-8<o.y+o.h);
function nearObj(){const py=p.y-6;let b=null,m=24;for(const o of SC[cs].obj){if(!o.st)continue;const d=Math.hypot(Math.max(o.x-p.x,0,p.x-o.x-o.w),Math.max(o.y-py,0,py-o.y-o.h));if(d<m){m=d;b=o}}return b}
function step(dt){
 fl.forEach(f=>f.t+=dt);while(fl.length&&fl[0].t>1.8)fl.shift();
 if(trans){trans.t+=dt;if(!trans.sw&&trans.t>=trans.h){cs=trans.to;p.x=trans.x;p.y=trans.y;trans.sw=1}if(trans.t>=2*trans.h)trans=null;p.mv=false;return}
 if(mo||!on){p.mv=false;return}
 const dx=(keys.arrowright||keys.d||tch.r?1:0)-(keys.arrowleft||keys.a||tch.l?1:0),dy=(keys.arrowdown||keys.s||tch.d?1:0)-(keys.arrowup||keys.w||tch.u?1:0);
 p.mv=!!(dx||dy);if(p.mv){p.ax=dx;p.ay=dy}
 if(p.mv){const l=Math.hypot(dx,dy),v=105*dt,b=SC[cs].ext?[20,460,124,304]:[30,450,94,304];if(dx)p.d=dx>0?1:-1;p.t+=dt;
  let nx=Math.max(b[0],Math.min(b[1],p.x+dx/l*v));if(!hit(nx,p.y))p.x=nx;
  let ny=Math.max(b[2],Math.min(b[3],p.y+dy/l*v));if(!hit(p.x,ny))p.y=ny}
 for(const d of SC[cs].dr)if(p.x+7>d.x&&p.x-7<d.x+d.w&&p.y>d.y&&p.y-8<d.y+d.h){go(d.to,d.tx,d.ty);break}
}

