// Presentación teórica con diapositivas 16:9 y tarjetas. Datos: data.js (S) y notes.js (H,K)
const $=s=>document.querySelector(s);
const slides=[];let cur=0,reveal=null;
const add=(sec,kick,html,after,cls)=>slides.push({sec,kick,html,after,cls:cls||''});
const jump=k=>go(slides.findIndex(x=>x.sec==k));
const NOM='Ingeniería de Seguridad de Software';

add(0,'Unidad 1 · Fundamentos',`<p class="eyebrow">Presentación teórica</p><h1>Seguridad de software:<br>de los conceptos a los controles</h1><p class="sub">Conceptos básicos · CIA y Hexad · Trazabilidad · Riesgo · Amenazas y ataques · Controles</p><p class="sub">Integrantes: ______________________</p>`,null,'hero');
add(0,'Agenda',`<h2>Seis videos, un recorrido</h2><div class="cards">${S.map((s,i)=>`<div class="card" onclick="jump(${i+1})"><span class="n">${i+1}</span><h4>${s.t}</h4><p>Tema ${s.n}</p></div>`).join('')}</div><p class="hint">Haz clic en una tarjeta para ir al video · atajos 1 a 6</p>`);
S.forEach((s,i)=>{
  const k=i+1,tag=`Video ${k} · ${s.n}`;
  add(k,tag,`<div class="vt"><span class="big">0${k}</span><div><p class="eyebrow">Tema ${s.n}</p><h1>${s.t}</h1><div class="obj"><b>Objetivo</b>${s.o}</div></div></div>`,null,'hero');
  add(k,'Pregunta de inicio',`<div class="cards q2"><div class="card hl"><span class="lbl">Pregunta de inicio</span><h2>${H[i]}</h2></div><div class="card"><span class="lbl">Problema</span><p class="big">${s.p}</p></div></div>`);
  add(k,'Mapa de ideas',`<h2>Mapa de ideas</h2><div class="steps" id="st">${s.f.map((x,j)=>`<div class="step dim"><b>${j+1}</b>${x}</div>`).join('')}</div><p class="hint">Clic, Enter o R para revelar paso a paso</p>`,()=>{
    const n=[...document.querySelectorAll('.step')];let r=0;reveal=()=>{if(r<n.length)n[r++].classList.remove('dim')};$('#st').onclick=reveal});
  [...new Set(s.c.map(c=>c[2]||''))].forEach(g=>{
    const it=s.c.filter(c=>(c[2]||'')==g),parts=Math.ceil(it.length/6),sz=Math.ceil(it.length/parts);
    for(let p=0;p<parts;p++){
      const ch=it.slice(p*sz,p*sz+sz),cols=ch.length==4?'c2':ch.length==2?'c2':'';
      add(k,`Teoría${g?' · '+g+'s':''}${parts>1?` (${p+1}/${parts})`:''}`,`<div class="cards ${cols}">${ch.map((c,j)=>`<div class="card" data-g="${g}"><span class="n">${p*sz+j+1}</span><h4>${c[0]}</h4><p>${c[1]}</p></div>`).join('')}</div><p class="hint">Clic en una tarjeta para destacarla · Enter o R recorre una por una</p>`,()=>{
        const cs=[...document.querySelectorAll('.cards .card')],box=cs[0].parentNode;let a=-1;
        const foc=j=>{cs.forEach((c,n)=>c.classList.toggle('on',n==j));box.classList.toggle('f',j>=0)};
        cs.forEach((c,n)=>c.onclick=()=>{a=c.classList.contains('on')?-1:n;foc(a)});
        reveal=()=>{a=a+1>=cs.length?-1:a+1;foc(a)}});
    }
  });
  add(k,'Ideas clave',`<h2>Lo que debe quedar claro</h2><div class="keys">${K[i].map((x,j)=>`<div class="key"><b>${j+1}</b><span>${x}</span></div>`).join('')}</div>`);
  add(k,'Actividad',`<h2>Clasifica · clic para ver la respuesta</h2><div class="qa">${s.q.map(q=>`<div class="qi" onclick="this.classList.toggle('o')">${q[0]}<span>${q[1]}</span></div>`).join('')}</div>`);
});
add(0,'Cierre',`<p class="eyebrow">Conclusión</p><h1>Seguridad = funcionalidad<br>+ controles verificados</h1><p class="sub">Herramientas citadas · Apoyo de IA declarado · Datos ficticios · Sin claves ni tokens.</p>`,null,'hero');

const chips=$('#chips');
['Inicio',...S.map((s,i)=>'V'+(i+1)+' · '+s.n.split(' ')[0])].forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>jump(i);chips.append(b)});

function go(i){
  cur=Math.max(0,Math.min(slides.length-1,i));const s=slides[cur];reveal=null;
  $('#stage').innerHTML=`<section class="slide ${s.cls}"><div class="top"><span class="chip">${s.kick}</span><span class="vn">${s.sec?'Video '+s.sec+' de 6':'Introducción'}</span></div><div class="body">${s.html}</div><div class="ft"><span>${NOM}</span><span>${cur+1} / ${slides.length}</span></div></section>`;
  if(s.after)s.after();
  $('#ct').textContent=`${cur+1} / ${slides.length}`;$('#pg').style.width=(cur+1)/slides.length*100+'%';
  [...chips.children].forEach((b,k)=>b.classList.toggle('on',k==s.sec));
}
$('#nx').onclick=()=>go(cur+1);$('#pv').onclick=()=>go(cur-1);
$('#th').onclick=()=>{const h=document.documentElement;h.dataset.theme=h.dataset.theme=='dark'?'light':'dark'};
$('#fs').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
addEventListener('keydown',e=>{
  const inp=e.target.tagName=='INPUT';
  if(['ArrowRight','PageDown'].includes(e.key))go(cur+1);
  if(['ArrowLeft','PageUp'].includes(e.key))go(cur-1);
  if((e.key=='r'||e.key=='R'||e.key=='Enter')&&reveal&&!inp)reveal();
  if(/^[1-6]$/.test(e.key)&&!inp)jump(+e.key);
  if(e.key=='f'||e.key=='F')$('#fs').click();
  if(e.key=='t'||e.key=='T')$('#th').click();
  if(e.key==' '&&!inp){e.preventDefault();$('#ts').click()}
});
let sec=0,iv=null;const tm=$('#tm');
const fmt=()=>{tm.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');tm.style.color=sec>420?'var(--bad)':sec>=240?'var(--ok)':''};
$('#ts').onclick=()=>{if(iv){clearInterval(iv);iv=null;$('#ts').textContent='▶'}else{iv=setInterval(()=>{sec++;fmt()},1000);$('#ts').textContent='⏸'}};
$('#tr').onclick=()=>{sec=0;fmt()};
go(0);
