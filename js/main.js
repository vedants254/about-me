let mx=innerWidth/2,my=innerHeight/2;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});

/* ===== paper-grid canvas (sparse) ===== */
const cv=document.getElementById('neural');
if(cv){
  const ctx=cv.getContext('2d');
  let W,H,nodes=[],DPR=Math.min(devicePixelRatio||1,2),tick=0;
  let pmx=mx*DPR,pmy=my*DPR;
  function build(){const n=Math.min(34,Math.floor(innerWidth*innerHeight/42000));nodes=[];for(let i=0;i<n;i++){nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.08*DPR,vy:(Math.random()-.5)*.08*DPR,r:(Math.random()*1.2+.7)*DPR,hot:Math.random()<.14})}}
  function resize(){W=cv.width=innerWidth*DPR;H=cv.height=innerHeight*DPR;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';build()}
  addEventListener('resize',resize);resize();
  addEventListener('mousemove',e=>{pmx=e.clientX*DPR;pmy=e.clientY*DPR});
  (function draw(){
    tick+=.012;
    ctx.clearRect(0,0,W,H);
    const step=84*DPR;                              // sparser grid
    ctx.fillStyle='rgba(17,19,21,.085)';            // fainter dots
    for(let x=(tick*18*DPR)%step;x<W;x+=step){
      for(let y=(tick*9*DPR)%step;y<H;y+=step){
        ctx.beginPath();ctx.arc(x,y,.85*DPR,0,7);ctx.fill();
      }
    }
    const link=170*DPR;
    for(const p of nodes){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      const dx=pmx-p.x,dy=pmy-p.y,d=Math.hypot(dx,dy);
      if(d<160*DPR){p.x-=dx/d*.18;p.y-=dy/d*.18}
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<link){const o=(1-d/link)*.16;ctx.strokeStyle=`rgba(17,19,21,${o})`;ctx.lineWidth=.5*DPR;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      }
    }
    for(const p of nodes){
      const dm=Math.hypot(pmx-p.x,pmy-p.y),near=dm<200*DPR;
      ctx.fillStyle=near||p.hot?'rgba(155,226,47,.85)':'rgba(17,19,21,.26)';
      ctx.beginPath();ctx.arc(p.x,p.y,near?p.r*1.8:p.r,0,7);ctx.fill();
    }
    requestAnimationFrame(draw);
  })();
}

/* ===== bottom dock — the only nav — + command panel ===== */
const ICON={
  home:'<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  about:'<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c0-3.7 3.4-5.6 7.5-5.6s7.5 1.9 7.5 5.6"/>',
  work:'<rect x="2.5" y="7" width="19" height="13.5" rx="2"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"/>',
  builds:'<path d="m8.5 6.5-5.5 5.5 5.5 5.5M15.5 6.5 21 12l-5.5 5.5"/>',
  stack:'<path d="m12 3 8.5 4.6L12 12.2 3.5 7.6z"/><path d="m3.5 12.8 8.5 4.6 8.5-4.6"/>',
  extra:'<path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2-4.4-4.3 6.1-.9z"/>',
  edu:'<path d="M2.5 8.5 12 4l9.5 4.5L12 13z"/><path d="M6.5 10.7v4.6c0 1.2 2.5 2.4 5.5 2.4s5.5-1.2 5.5-2.4v-4.6"/>',
  contact:'<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m2.5 7.5 9.5 5.6 9.5-5.6"/>'
};
const SECTIONS=[
  ['Home','hero','home'],['About','about','about'],['Edu','education','edu'],['Work','work','work'],
  ['Builds','projects','builds'],['Stack','stack','stack'],['Extra','extra','extra']
];
if(!document.querySelector('.dock')){
  const dock=document.createElement('div');
  dock.className='dock';
  dock.innerHTML=SECTIONS.map(([label,id,icon])=>
      `<a href="#${id}" data-sec="${id}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[icon]}</svg>${label}</a>`
    ).join('')
    +'<button class="cmd" type="button" aria-label="Open command menu"><span class="gl">⌘</span>Menu</button>';
  document.body.appendChild(dock);

  const panel=document.createElement('div');
  panel.className='cmd-panel';
  panel.innerHTML='<input type="search" placeholder="type a command: resume, github, email, projects..." aria-label="Command search"><div class="cmd-results"></div>';
  document.body.appendChild(panel);
  const results=panel.querySelector('.cmd-results'),input=panel.querySelector('input');
  const cmds=[
    ['Jump to education','#education','IIT Madras'],
    ['Jump to experience','#work','timeline'],
    ['Jump to selected work','#projects','systems and repos'],
    ['Jump to skills','#stack','tools'],
    ['Jump to extra-curriculars','#extra','leadership'],
    ['Download resume','Vedant_Shelkar_Resume.pdf','pdf'],
    ['Email Vedant','mailto:vedantshelkar@gmail.com','email'],
    ['GitHub','https://github.com/vedants254','external'],
    ['LinkedIn','https://www.linkedin.com/in/vedant-shelkar-5a9a59281/','external']
  ];
  function render(q=''){
    const f=cmds.filter(c=>(c[0]+' '+c[2]).toLowerCase().includes(q.toLowerCase()));
    results.innerHTML=f.map(c=>`<a href="${c[1]}" ${c[1].startsWith('http')?'target="_blank" rel="noopener"':''}><span>${c[0]}</span><span>${c[2]}</span></a>`).join('')||'<button type="button">No command found</button>';
  }
  function toggle(force){panel.classList.toggle('open',force??!panel.classList.contains('open'));if(panel.classList.contains('open')){render(input.value);setTimeout(()=>input.focus(),30)}}
  dock.querySelector('.cmd').addEventListener('click',()=>toggle());
  results.addEventListener('click',e=>{if(e.target.closest('a'))toggle(false)});
  input.addEventListener('input',()=>render(input.value));
  addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();toggle()}
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='j'){e.preventDefault();toggle()}
    if(e.key==='Escape')toggle(false);
  });
  render();

  /* active tab follows the section in view */
  const tabs=[...dock.querySelectorAll('a[data-sec]')];
  let spyQueued=false;
  function spy(){
    spyQueued=false;
    const mid=innerHeight*0.38;
    let current=SECTIONS[0][1];
    for(const [,id] of SECTIONS){
      const el=document.getElementById(id);
      if(el&&el.getBoundingClientRect().top<=mid)current=id;
    }
    // pin the last tab once the page bottom is reached
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)current=SECTIONS[SECTIONS.length-1][1];
    tabs.forEach(t=>t.classList.toggle('active',t.dataset.sec===current));
  }
  addEventListener('scroll',()=>{if(!spyQueued){spyQueued=true;requestAnimationFrame(spy)}},{passive:true});
  addEventListener('resize',()=>{if(!spyQueued){spyQueued=true;requestAnimationFrame(spy)}});
  spy();
}

/* ===== reveals + counters (scroll-based — no IntersectionObserver) ===== */
function reveal(el){
  if(el.classList.contains('in'))return;
  el.classList.add('in');
  const c=el.querySelector&&el.querySelector('[data-count]');if(c)countUp(c);
}
let ticking=false;
function checkReveals(){
  ticking=false;
  const vh=Math.max(innerHeight,document.documentElement.clientHeight||0,600);
  const trigger=vh*0.92;
  document.querySelectorAll('.rv:not(.in)').forEach(el=>{if(el.getBoundingClientRect().top<trigger)reveal(el)});
  if(typeof maybeType==='function')maybeType();
}
function observeReveals(){checkReveals()}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(checkReveals)}},{passive:true});
addEventListener('resize',()=>{if(!ticking){ticking=true;requestAnimationFrame(checkReveals)}});
addEventListener('load',checkReveals);

function countUp(el){
  const target=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),suf=el.dataset.suffix||'';
  let t0=null,dur=1500;
  function step(ts){if(!t0)t0=ts;const k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3),v=target*e;
    el.textContent=(dec?v.toFixed(dec):Math.floor(v).toLocaleString())+suf;
    if(k<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
}

/* ===== boot sequence — short (~1.2s total) ===== */
const boot=document.getElementById('boot');
if(boot){
  const log=document.getElementById('bootLog'),bar=document.getElementById('bootBar'),pct=document.getElementById('bootPct');
  const steps=['> mounting /neural_core ... <span class="ok">[ok]</span>','> loading weights: transformers, langgraph, qlora ... <span class="ok">[ok]</span>','> warming inference engine ... <span class="ok">[ok]</span>','> calibrating gradient descent ... <span class="ok">[ok]</span>','> booting VEDANT.SHELKAR ... <span class="ok">[ready]</span>'];
  let si=0,p=0;
  function run(){
    if(si<steps.length){log.innerHTML+=steps[si]+'\n';si++}
    p=Math.min(100,Math.round(si/steps.length*100));
    bar.style.left=(100-p)+'%';pct.textContent=p+'%';
    if(si<steps.length){setTimeout(run,170)}
    else{
      pct.textContent='100%';
      setTimeout(()=>{
        boot.classList.add('done');
        document.querySelectorAll('#hero .rv').forEach((el,i)=>setTimeout(()=>el.classList.add('in'),i*70));
        checkReveals();
      },140);
    }
  }
  setTimeout(run,110);
}else{
  observeReveals();
}

/* ===== projects ===== */
const grid=document.getElementById('projGrid');
if(grid){
  const projects=[
    {n:'Conversational Analytics',d:'A conversational analytics platform on LangGraph and async FastAPI, with a Celery task pipeline and a sandbox that runs LLM-generated Python without trusting it.',s:['LangGraph','FastAPI','Celery','Redis','PostgreSQL','Docker'],repo:'Survey-analysis-assistant',live:false},
    {n:'FinBot',d:'Chatbot that reads and compares financial PDFs — agentic RAG over layout-aware document segmentation.',s:['Llama 3.1','LangChain','Pinecone','LayoutLMv2','Detectron2'],repo:'FinBot',live:false},
    {n:'The Prompt Autopsy',d:'Blind evaluation of a debt-collection voice agent over 10 real call transcripts: finds the failure, fixes the prompt, keeps the eval loop.',s:['Anthropic','Gemini','Groq','Evals'],repo:'voice-agent-evals',live:false},
    {n:'Mini RAG',d:'A compact RAG service that answers with inline citations. Deployed live on HuggingFace Spaces.',s:['RAG','Streamlit','Docker','HF Spaces'],repo:'minirag',live:'https://huggingface.co/spaces/vedants254/minirag'},
    {n:'Prompted Segmentation',d:'Text-conditioned image segmentation on CLIPSeg — masks straight from free-text prompts, no custom conditioning.',s:['CLIPSeg','CLIP','PyTorch','Vision'],repo:'prompted-segmentation',live:false},
    {n:'Fine-tuned GPT-2 · Medical QA',d:'GPT-2 fine-tuned for medical Q&A with PEFT and QLoRA, cutting training memory 45%.',s:['GPT-2','QLoRA','PEFT','HuggingFace'],repo:'Finetuned-GPT2',live:false},
    {n:'UEFA Match Prediction',d:'Random Forest and XGBoost over 27 years of UEFA data, at 79.9% balanced accuracy and explained with SHAP.',s:['XGBoost','Random Forest','PCA','SHAP'],repo:'Match-Predictions-',live:false},
    {n:'Smart Outreach Agent',d:'Agent that finds matching companies, enriches them with live intel, and drafts the cold email.',s:['Agents','LangChain','Streamlit','Enrichment'],repo:'agent',live:false},
  ];
  projects.forEach((p,i)=>{
    const a=document.createElement('a');
    a.className='card rv';a.href=p.live||('https://github.com/vedants254/'+p.repo);a.target='_blank';a.rel='noopener';
    a.dataset.d=(i%3)+'';
    a.innerHTML=`
      <div class="ptitle">${p.n}${p.live?'<i class="live-dot" title="live"></i>':''}</div>
      <div class="pdesc">${p.d}</div>
      <div class="pstack">${p.s.map(x=>`<b>${x}</b>`).join('')}</div>`;
    grid.appendChild(a);
  });
  checkReveals();
}

/* ===== progressive disclosure (projects + extra-curriculars) ===== */
function wireMore(listId,btnId,shownLabel,hiddenLabel,visible){
  const list=document.getElementById(listId),btn=document.getElementById(btnId);
  if(!list||!btn)return;
  const total=list.children.length;
  if(total<=(visible||4)){btn.parentElement.remove();return}
  list.classList.add('collapsed');
  btn.innerHTML=hiddenLabel+' <i>⌄</i>';
  btn.addEventListener('click',()=>{
    const open=list.classList.toggle('collapsed')===false;
    btn.setAttribute('aria-expanded',String(open));
    btn.innerHTML=(open?shownLabel:hiddenLabel)+` <i>${open?'⌃':'⌄'}</i>`;
    checkReveals();
  });
}
wireMore('projGrid','projMore','Show fewer','Show all 8 projects',6);
wireMore('extraTiles','extraMore','Show fewer','Show all 7');

/* ===== skill filters ===== */
const skillGrid=document.getElementById('skillGrid');
if(skillGrid){
  const CATS=[['all','All Skills'],['ml','ML · DL'],['llm','LLM · Agents'],['infra','Infra · Backend'],['also','Also']];
  const tiles=[...skillGrid.querySelectorAll('.skill-tile')];
  const count=id=>id==='all'?tiles.length:tiles.filter(t=>t.dataset.cat===id).length;
  const bar=document.getElementById('skillFilters'),label=document.getElementById('skillCount');
  bar.innerHTML=CATS.map(([id,name],i)=>
    `<button type="button" role="tab" data-cat="${id}" class="${i===0?'on':''}">${name} <span class="n">${count(id)}</span></button>`
  ).join('');
  function apply(cat){
    tiles.forEach(t=>{t.hidden=cat!=='all'&&t.dataset.cat!==cat});
    bar.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.cat===cat));
    const n=count(cat);
    label.textContent=cat==='all'?`Showing ${n} total skills`:`Showing ${n} of ${tiles.length} skills`;
  }
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(b)apply(b.dataset.cat)});
  apply('all');
}

