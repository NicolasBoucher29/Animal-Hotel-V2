// ============================================================
// MINIGAMES.JS — Canvas minigames for Animal Hotel V2
// ============================================================

const Minigames = {
  active: null,
  canvas: null,
  ctx: null,
  animFrame: null,
  onComplete: null,

  init() {
    this.canvas = document.getElementById('mini-canvas');
    this.ctx = this.canvas.getContext('2d');
  },

  start(type, data, onComplete) {
    this.onComplete = onComplete;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.getElementById('screen-minigame').classList.add('active');

    const inst = document.getElementById('mini-instructions');
    const instructions = {
      cooking: { ico:'🍳', text:'Cuisine un plat !', hint:'Tape sur les ingrédients puis sur la cuisinière' },
      washing: { ico:'🛁', text:'Lave l\'animal !', hint:'Glisse ton doigt sur l\'animal pour frotter' },
      petting: { ico:'💕', text:'Caresse l\'animal !', hint:'Glisse ton doigt doucement sur l\'animal' },
      play_ball:{ ico:'⚽', text:'Lance la balle !', hint:'Tape pour choisir la force, l\'animal va chercher !' },
      log_jump: { ico:'🌿', text:'Saute-Bûches !', hint:'Tape pour sauter par-dessus les obstacles' },
      hidden:   { ico:'🔍', text:'Animaux Cachés !', hint:'Tape sur les animaux cachés dans la scène' },
      catch_stars:{ ico:'⭐', text:'Attrape-Étoiles !', hint:'Glisse ton doigt pour attraper les étoiles' },
      memory:   { ico:'🃏', text:'Jeu de Mémoire !', hint:'Retrouve les paires d\'animaux' },
    };

    const info = instructions[type] || { ico:'🎮', text:'Mini-jeu !', hint:'' };
    inst.innerHTML = `<span class="inst-ico">${info.ico}</span>${info.text}<br><span class="inst-hint">${info.hint}</span>`;
    inst.style.display = 'block';

    const GameClass = {
      cooking: CookingGame, washing: WashingGame, petting: PettingGame,
      play_ball: BallGame, log_jump: LogJumpGame, hidden: HiddenGame,
      catch_stars: CatchStarsGame, memory: MemoryGame,
    }[type];

    setTimeout(() => {
      inst.style.display = 'none';
      if (GameClass) {
        this.active = new GameClass(this, data);
        this._loop();
      }
    }, 2000);
  },

  stop(result) {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.active = null;
    document.getElementById('screen-minigame').classList.remove('active');
    document.getElementById('mini-instructions').style.display = 'none';
    if (this.onComplete) this.onComplete(result);
  },

  _loop() {
    if (!this.active) return;
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    this.active.update();
    this.active.render(ctx, w, h);
    this.animFrame = requestAnimationFrame(() => this._loop());
  },
};

// ===== BASE GAME =====
class MiniGameBase {
  constructor(host, data) {
    this.host = host;
    this.data = data;
    this.mouseX = 0; this.mouseY = 0;
    this.mouseDown = false;
    this.time = 0;
    this._bindEvents();
  }
  _bindEvents() {
    const c = this.host.canvas;
    this._handlers = {
      ts: (e) => { e.preventDefault(); const t=e.touches[0]; this.mouseX=t.clientX; this.mouseY=t.clientY; this.mouseDown=true; this.onTap(t.clientX,t.clientY); },
      tm: (e) => { e.preventDefault(); const t=e.touches[0]; this.mouseX=t.clientX; this.mouseY=t.clientY; this.onDrag(t.clientX,t.clientY); },
      te: () => { this.mouseDown=false; this.onRelease(); },
      md: (e) => { this.mouseX=e.clientX; this.mouseY=e.clientY; this.mouseDown=true; this.onTap(e.clientX,e.clientY); },
      mm: (e) => { this.mouseX=e.clientX; this.mouseY=e.clientY; if(this.mouseDown) this.onDrag(e.clientX,e.clientY); },
      mu: () => { this.mouseDown=false; this.onRelease(); },
    };
    c.addEventListener('touchstart', this._handlers.ts, {passive:false});
    c.addEventListener('touchmove', this._handlers.tm, {passive:false});
    c.addEventListener('touchend', this._handlers.te);
    c.addEventListener('mousedown', this._handlers.md);
    c.addEventListener('mousemove', this._handlers.mm);
    c.addEventListener('mouseup', this._handlers.mu);
  }
  destroy() {
    const c = this.host.canvas;
    c.removeEventListener('touchstart', this._handlers.ts);
    c.removeEventListener('touchmove', this._handlers.tm);
    c.removeEventListener('touchend', this._handlers.te);
    c.removeEventListener('mousedown', this._handlers.md);
    c.removeEventListener('mousemove', this._handlers.mm);
    c.removeEventListener('mouseup', this._handlers.mu);
  }
  onTap(x,y) {}
  onDrag(x,y) {}
  onRelease() {}
  update() { this.time += 1/60; }
  render(ctx,w,h) {}
  finish(result) { this.destroy(); this.host.stop(result); }
  drawRR(ctx,x,y,w,h,r,fill,stroke) {
    ctx.beginPath(); ctx.roundRect(x,y,w,h,r);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
  }
  text(ctx,txt,x,y,sz,col,al) {
    ctx.font=`bold ${sz}px Nunito,sans-serif`;
    ctx.fillStyle=col||'#4a3728'; ctx.textAlign=al||'center'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y);
  }
}

// ===== COOKING =====
class CookingGame extends MiniGameBase {
  constructor(host, data) {
    super(host, data);
    this.phase = 'select';
    this.selected = [];
    this.cookTimer = 0;
    this.particles = [];
    this.foodItems = [];
    const cats = Object.keys(FOOD_CATEGORIES);
    for (let i = 0; i < 8; i++) {
      const cat = cats[Math.floor(Math.random()*cats.length)];
      const idx = Math.floor(Math.random()*20)+1;
      this.foodItems.push({cat, idx, img:Assets.getFood(cat,idx)});
    }
  }
  onTap(x,y) {
    const w=this.host.canvas.width, h=this.host.canvas.height;
    if (this.phase==='select') {
      const iw=w*0.18, ih=h*0.14, sx=w*0.1;
      this.foodItems.forEach((item,i) => {
        const c=i%4, r=Math.floor(i/4);
        const ix=sx+c*(iw+10), iy=h*0.25+r*(ih+10);
        if(x>ix&&x<ix+iw&&y>iy&&y<iy+ih&&this.selected.length<3) {
          this.selected.push(item); Audio.play('pop');
        }
      });
      if(this.selected.length>0) {
        const bx=w/2-60, by=h*0.78;
        if(x>bx&&x<bx+120&&y>by&&y<by+50) { this.phase='cooking'; Audio.play('cook'); }
      }
    } else if (this.phase==='result') {
      this.finish({success:true, category:this.selected[0]?.cat||'protein'});
    }
  }
  update() {
    super.update();
    if(this.phase==='cooking') {
      this.cookTimer+=1/60;
      if(Math.random()<0.3) {
        const w=this.host.canvas.width, h=this.host.canvas.height;
        this.particles.push({x:w/2+(Math.random()-0.5)*60,y:h*0.5,vy:-2-Math.random()*2,life:1,emoji:Math.random()>0.5?'💨':'✨'});
      }
      if(this.cookTimer>=3) { this.phase='result'; Audio.play('success'); }
    }
    this.particles=this.particles.filter(p=>{p.y+=p.vy;p.life-=0.02;return p.life>0;});
  }
  render(ctx,w,h) {
    ctx.fillStyle='#fdebd0'; ctx.fillRect(0,0,w,h);
    if(this.phase==='select') {
      this.text(ctx,'🍳 Choisis tes ingrédients !',w/2,h*0.08,22);
      this.text(ctx,`${this.selected.length}/3 sélectionnés`,w/2,h*0.16,14,'#8b7355');
      const iw=w*0.18,ih=h*0.14,sx=w*0.1;
      this.foodItems.forEach((item,i)=>{
        const c=i%4,r=Math.floor(i/4);
        const ix=sx+c*(iw+10),iy=h*0.25+r*(ih+10);
        const sel=this.selected.includes(item);
        this.drawRR(ctx,ix,iy,iw,ih,12,sel?'#ffd35b':'#fff',sel?'#ff9a5c':'#ddd');
        if(item.img) ctx.drawImage(item.img,ix+iw/2-25,iy+5,50,50);
        else this.text(ctx,FOOD_CATEGORIES[item.cat].emoji,ix+iw/2,iy+ih/2,30);
      });
      if(this.selected.length>0) {
        this.drawRR(ctx,w/2-60,h*0.78,120,50,25,'#ff6b9d');
        this.text(ctx,'🔥 Cuisiner !',w/2,h*0.78+25,16,'#fff');
      }
    } else if(this.phase==='cooking') {
      this.text(ctx,'🔥 Ça mijote...',w/2,h*0.2,26);
      this.drawRR(ctx,w*0.2,h*0.35,w*0.6,16,8,'#eee');
      this.drawRR(ctx,w*0.2,h*0.35,w*0.6*(this.cookTimer/3),16,8,'#ff6b9d');
      this.text(ctx,'🍲',w/2,h*0.55,60+Math.sin(this.time*5)*5);
    } else {
      this.text(ctx,'✨ C\'est prêt ! ✨',w/2,h*0.3,28);
      this.text(ctx,'🍽️',w/2,h*0.5,80);
      this.text(ctx,'Tape pour continuer',w/2,h*0.75,14,'#8b7355');
    }
    this.particles.forEach(p=>{ctx.globalAlpha=p.life;this.text(ctx,p.emoji,p.x,p.y,14);ctx.globalAlpha=1;});
  }
}

// ===== WASHING =====
class WashingGame extends MiniGameBase {
  constructor(host, data) {
    super(host, data);
    this.phase='soap'; this.scrub=0; this.bubbles=[]; this.lastX=0;
    this.animalImg=Assets.getAnimal(data.animalType);
    this.drySpots=[];
    for(let i=0;i<8;i++) this.drySpots.push({x:0.3+Math.random()*0.4,y:0.3+Math.random()*0.35,ok:false});
  }
  onDrag(x,y) {
    if(this.phase==='soap'||this.phase==='rinse') {
      const d=Math.abs(x-this.lastX);
      if(d>5){this.scrub++;this.lastX=x;
        if(Math.random()>0.4) this.bubbles.push({x:x+(Math.random()-0.5)*40,y:y+(Math.random()-0.5)*40,s:8+Math.random()*12,l:1});
        const need=this.phase==='soap'?30:20;
        if(this.scrub>=need){this.phase=this.phase==='soap'?'rinse':'dry';this.scrub=0;Audio.play('splash');}
      }
    }
  }
  onTap(x,y) {
    const w=this.host.canvas.width,h=this.host.canvas.height;
    if(this.phase==='dry'){
      this.drySpots.forEach(s=>{if(!s.ok&&Math.abs(x/w-s.x)<0.08&&Math.abs(y/h-s.y)<0.08){s.ok=true;Audio.play('pop');}});
      if(this.drySpots.every(s=>s.ok)){this.phase='done';Audio.play('success');setTimeout(()=>this.finish({success:true}),1500);}
    }
    if(this.phase==='done') this.finish({success:true});
  }
  update(){super.update();this.bubbles=this.bubbles.filter(b=>{b.y-=1;b.l-=0.02;return b.l>0;});}
  render(ctx,w,h) {
    ctx.fillStyle='#d6eaf8';ctx.fillRect(0,0,w,h);
    if(this.animalImg) ctx.drawImage(this.animalImg,w/2-75,h*0.3,150,200);
    const labels={soap:'🧼 Frotte avec du savon !',rinse:'💧 Rince !',dry:'🌬️ Tape sur les gouttes !',done:'✨ Tout propre !'};
    this.text(ctx,labels[this.phase],w/2,h*0.08,20);
    if(this.phase==='soap'||this.phase==='rinse'){
      const need=this.phase==='soap'?30:20;
      this.drawRR(ctx,w*0.2,h*0.16,w*0.6,12,6,'#ddd');
      this.drawRR(ctx,w*0.2,h*0.16,w*0.6*Math.min(1,this.scrub/need),12,6,'#5ba3f5');
    }
    if(this.phase==='dry') this.drySpots.forEach(s=>{if(!s.ok) this.text(ctx,'💧',w*s.x,h*s.y,24);});
    this.bubbles.forEach(b=>{ctx.globalAlpha=b.l;ctx.fillStyle='rgba(173,216,230,0.6)';ctx.beginPath();ctx.arc(b.x,b.y,b.s,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;});
  }
}

// ===== PETTING =====
class PettingGame extends MiniGameBase {
  constructor(host, data) {
    super(host, data);
    this.strokes=0; this.need=25; this.hearts=[]; this.lastY=0; this.done=false;
    this.animalImg=Assets.getAnimal(data.animalType);
  }
  onDrag(x,y) {
    if(this.done)return;
    if(Math.abs(y-this.lastY)>8){
      this.strokes++;this.lastY=y;
      this.hearts.push({x:x+(Math.random()-0.5)*30,y:y-10,vy:-2-Math.random()*2,l:1,e:Math.random()>0.3?'💕':'✨'});
      if(this.strokes>=this.need){
        this.done=true;Audio.play('happy');
        for(let i=0;i<20;i++){
          const w=this.host.canvas.width,h=this.host.canvas.height;
          this.hearts.push({x:w/2+(Math.random()-0.5)*200,y:h/2+(Math.random()-0.5)*100,vy:-3-Math.random()*3,l:1.5,e:['💕','💖','✨','🌈','💫'][Math.floor(Math.random()*5)]});
        }
        setTimeout(()=>this.finish({success:true}),2000);
      }
    }
  }
  update(){super.update();this.hearts=this.hearts.filter(h=>{h.y+=h.vy;h.l-=0.02;return h.l>0;});}
  render(ctx,w,h) {
    if(this.done){const g=ctx.createLinearGradient(0,0,w,h);['#ff6b6b','#ffd35b','#5bd89a','#5ba3f5','#a78bfa','#ff6b9d'].forEach((c,i,a)=>g.addColorStop(i/(a.length-1),c));ctx.globalAlpha=0.3;ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;}
    else{ctx.fillStyle='#fff5ee';ctx.fillRect(0,0,w,h);}
    if(this.animalImg){const s=this.done?1.1:1,aw=180*s,ah=240*s;ctx.drawImage(this.animalImg,w/2-aw/2,h*0.25,aw,ah);}
    this.text(ctx,this.done?'💖 Trop bien !':'💕 Caresse doucement...',w/2,h*0.07,20);
    if(!this.done){this.drawRR(ctx,w*0.2,h*0.14,w*0.6,12,6,'#f5e0e0');this.drawRR(ctx,w*0.2,h*0.14,w*0.6*Math.min(1,this.strokes/this.need),12,6,'#ff6b9d');}
    this.hearts.forEach(p=>{ctx.globalAlpha=Math.max(0,p.l);this.text(ctx,p.e,p.x,p.y,18);ctx.globalAlpha=1;});
  }
}

// ===== BALL THROW =====
class BallGame extends MiniGameBase {
  constructor(host,data){super(host,data);this.phase='aim';this.power=0;this.dir=1;this.ballX=0;this.ballY=0;this.targetX=0;this.animalX=0;this.fetchT=0;this.animalImg=Assets.getAnimal(data.animalType);}
  onTap(x,y){
    if(this.phase==='aim'){this.phase='throw';this.targetX=this.host.canvas.width*(0.3+this.power*0.5);this.ballX=this.host.canvas.width*0.15;this.ballY=this.host.canvas.height*0.7;Audio.play('whoosh');}
    else if(this.phase==='done') this.finish({success:true});
  }
  update(){
    super.update();const w=this.host.canvas.width,h=this.host.canvas.height;
    if(this.phase==='aim'){this.power+=0.02*this.dir;if(this.power>=1||this.power<=0)this.dir*=-1;}
    else if(this.phase==='throw'){this.ballX+=(this.targetX-this.ballX)*0.1;this.ballY=h*0.7-Math.sin((this.ballX/w)*Math.PI)*h*0.3;if(Math.abs(this.ballX-this.targetX)<5){this.phase='fetch';this.animalX=w*0.15;}}
    else if(this.phase==='fetch'){this.animalX+=(this.targetX-this.animalX)*0.05;if(Math.abs(this.animalX-this.targetX)<10){this.fetchT++;if(this.fetchT>30){this.phase='done';Audio.play('happy');}}}
  }
  render(ctx,w,h){
    ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,w,h*0.6);ctx.fillStyle='#a5d6a7';ctx.fillRect(0,h*0.6,w,h*0.4);
    if(this.phase==='aim'){this.text(ctx,'⚽ Tape pour lancer !',w/2,h*0.1,22);this.drawRR(ctx,w*0.15,h*0.2,w*0.7,18,9,'#eee');const c=this.power<0.3?'#5bd89a':this.power<0.7?'#ffd35b':'#ff6b6b';this.drawRR(ctx,w*0.15,h*0.2,w*0.7*this.power,18,9,c);}
    if(this.phase!=='aim') this.text(ctx,'⚽',this.ballX,this.ballY,30);
    if(this.animalImg){const ax=this.phase==='fetch'||this.phase==='done'?this.animalX:w*0.15;ctx.drawImage(this.animalImg,ax-40,h*0.55,80,100);}
    if(this.phase==='done'){this.text(ctx,'🎉 Bravo !',w/2,h*0.1,22);this.text(ctx,'Tape pour continuer',w/2,h*0.88,14,'#8b7355');}
  }
}

// ===== LOG JUMP =====
class LogJumpGame extends MiniGameBase {
  constructor(host,data){super(host,data);this.pY=0;this.vY=0;this.grounded=true;this.obs=[];this.petals=[];this.score=0;this.speed=4;this.over=false;this.spawnT=0;}
  onTap(){if(this.over){this.finish({score:this.score});return;}if(this.grounded){this.vY=-14;this.grounded=false;Audio.play('pop');}}
  update(){
    super.update();if(this.over)return;
    const h=this.host.canvas.height,w=this.host.canvas.width,gy=h*0.75;
    if(!this.grounded){this.vY+=0.6;this.pY+=this.vY;if(this.pY>=0){this.pY=0;this.vY=0;this.grounded=true;}}
    this.speed=4+this.score*0.05;
    this.spawnT+=1/60;
    if(this.spawnT>1.2-Math.min(0.5,this.score*0.01)){this.spawnT=0;this.obs.push({x:w+50,w:30+Math.random()*20,h:25+Math.random()*15});if(Math.random()>0.4)this.petals.push({x:w+100+Math.random()*100,y:gy-60-Math.random()*80,ok:false});}
    const px=w*0.2;
    this.obs.forEach(o=>o.x-=this.speed);this.obs=this.obs.filter(o=>o.x>-60);
    this.petals.forEach(p=>p.x-=this.speed);this.petals=this.petals.filter(p=>p.x>-30);
    this.obs.forEach(o=>{if(px+15>o.x&&px-15<o.x+o.w){if(gy+this.pY>gy-o.h){this.over=true;Audio.play('fail');}}});
    this.petals.forEach(p=>{if(!p.ok&&Math.abs(px-p.x)<25&&Math.abs((gy+this.pY-20)-p.y)<25){p.ok=true;this.score++;Audio.play('coin');}});
  }
  render(ctx,w,h){
    ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,w,h);const gy=h*0.75;ctx.fillStyle='#a5d6a7';ctx.fillRect(0,gy,w,h-gy);ctx.fillStyle='#8bc34a';ctx.fillRect(0,gy,w,4);
    this.obs.forEach(o=>{this.drawRR(ctx,o.x,gy-o.h,o.w,o.h,5,'#795548');});
    this.petals.forEach(p=>{if(!p.ok)this.text(ctx,'🌸',p.x,p.y,22);});
    const px=w*0.2,py=gy+this.pY-20;
    ctx.fillStyle='#ff6b9d';ctx.beginPath();ctx.arc(px,py,18,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-5,py-4,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+5,py-4,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#333';ctx.beginPath();ctx.arc(px-5,py-4,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+5,py-4,2,0,Math.PI*2);ctx.fill();
    this.drawRR(ctx,10,10,100,36,18,'rgba(255,255,255,0.85)');this.text(ctx,`🌸 ${this.score}`,60,28,16);
    if(this.over){this.drawRR(ctx,w/2-120,h/2-50,240,100,20,'rgba(255,255,255,0.95)');this.text(ctx,`Game Over ! Score: ${this.score}`,w/2,h/2-15,16);this.text(ctx,'Tape pour continuer',w/2,h/2+20,13,'#8b7355');}
  }
}

// ===== HIDDEN ANIMALS =====
class HiddenGame extends MiniGameBase {
  constructor(host,data){
    super(host,data);this.found=0;this.total=8;this.timeLeft=30;this.over=false;this.animals=[];
    for(let i=0;i<this.total;i++){const t=HOTEL_ANIMALS[Math.floor(Math.random()*HOTEL_ANIMALS.length)];this.animals.push({type:t,x:0.1+Math.random()*0.8,y:0.2+Math.random()*0.6,ok:false,emoji:ANIMAL_TYPES[t].emoji});}
  }
  onTap(x,y){
    if(this.over){this.finish({score:this.found});return;}
    const w=this.host.canvas.width,h=this.host.canvas.height;
    this.animals.forEach(a=>{if(!a.ok&&Math.abs(x/w-a.x)<0.06&&Math.abs(y/h-a.y)<0.06){a.ok=true;this.found++;Audio.play('pop');if(this.found>=this.total){this.over=true;Audio.play('success');}}});
  }
  update(){super.update();if(!this.over){this.timeLeft-=1/60;if(this.timeLeft<=0){this.over=true;Audio.play('fail');}}}
  render(ctx,w,h){
    const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#87ceeb');g.addColorStop(0.5,'#a5d6a7');g.addColorStop(1,'#795548');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    this.text(ctx,'🌳',w*0.1,h*0.35,50);this.text(ctx,'🌲',w*0.85,h*0.3,55);this.text(ctx,'🌿',w*0.3,h*0.7,40);this.text(ctx,'🪨',w*0.7,h*0.75,35);this.text(ctx,'🌺',w*0.5,h*0.5,30);
    this.animals.forEach(a=>{if(a.ok){this.text(ctx,a.emoji,w*a.x,h*a.y,35);this.text(ctx,'✅',w*a.x+15,h*a.y-15,14);}else{ctx.globalAlpha=0.35;this.text(ctx,a.emoji,w*a.x,h*a.y,25);ctx.globalAlpha=1;}});
    this.drawRR(ctx,10,10,150,36,18,'rgba(255,255,255,0.85)');this.text(ctx,`🔍 ${this.found}/${this.total}  ⏰ ${Math.ceil(this.timeLeft)}s`,85,28,13);
    if(this.over){this.drawRR(ctx,w/2-130,h/2-50,260,100,20,'rgba(255,255,255,0.95)');this.text(ctx,this.found>=this.total?'🎉 Tous trouvés !':`⏰ ${this.found}/${this.total}`,w/2,h/2-15,16);this.text(ctx,'Tape pour continuer',w/2,h/2+20,13,'#8b7355');}
  }
}

// ===== CATCH STARS =====
class CatchStarsGame extends MiniGameBase {
  constructor(host,data){super(host,data);this.stars=[];this.score=0;this.timeLeft=20;this.over=false;this.bx=0.5;this.spawnT=0;}
  onDrag(x){this.bx=x/this.host.canvas.width;}
  onTap(x,y){if(this.over){this.finish({score:this.score});return;}this.bx=x/this.host.canvas.width;}
  update(){
    super.update();if(this.over)return;
    this.timeLeft-=1/60;if(this.timeLeft<=0){this.over=true;Audio.play('success');return;}
    this.spawnT+=1/60;if(this.spawnT>0.4){this.spawnT=0;this.stars.push({x:Math.random(),y:-0.05,sp:0.003+Math.random()*0.004,e:Math.random()>0.2?'⭐':'💎',pt:Math.random()>0.2?1:3});}
    this.stars.forEach(s=>s.y+=s.sp);
    this.stars=this.stars.filter(s=>{if(s.y>0.85&&Math.abs(s.x-this.bx)<0.08){this.score+=s.pt;Audio.play('coin');return false;}return s.y<1.1;});
  }
  render(ctx,w,h){
    ctx.fillStyle='#1a1a3e';ctx.fillRect(0,0,w,h);
    for(let i=0;i<30;i++){ctx.fillStyle=`rgba(255,255,255,${0.1+Math.random()*0.3})`;ctx.fillRect(((i*37+this.time*20)%w),(i*23)%h,2,2);}
    this.stars.forEach(s=>this.text(ctx,s.e,w*s.x,h*s.y,s.pt>1?28:22));
    this.text(ctx,'🧺',w*this.bx,h*0.88,40);
    this.drawRR(ctx,10,10,160,36,18,'rgba(255,255,255,0.15)');this.text(ctx,`⭐ ${this.score}  ⏰ ${Math.ceil(this.timeLeft)}s`,90,28,14,'#fff');
    if(this.over){this.drawRR(ctx,w/2-120,h/2-50,240,100,20,'rgba(255,255,255,0.95)');this.text(ctx,`Score: ${this.score} ⭐`,w/2,h/2-15,18);this.text(ctx,'Tape pour continuer',w/2,h/2+20,13,'#8b7355');}
  }
}

// ===== MEMORY =====
class MemoryGame extends MiniGameBase {
  constructor(host,data){
    super(host,data);this.pairs=6;this.flipped=[];this.matched=[];this.canFlip=true;this.over=false;
    const types=HOTEL_ANIMALS.slice(0,this.pairs);const deck=[...types,...types];
    for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
    this.cards=deck.map(t=>({type:t,emoji:ANIMAL_TYPES[t].emoji}));
  }
  onTap(x,y){
    if(this.over){this.finish({score:this.matched.length/2});return;}
    if(!this.canFlip)return;
    const w=this.host.canvas.width,h=this.host.canvas.height,cols=4,rows=3;
    const cw=w*0.18,ch=h*0.22,sx=(w-cols*(cw+10))/2,sy=h*0.15;
    for(let i=0;i<this.cards.length;i++){
      const c=i%cols,r=Math.floor(i/cols),cx=sx+c*(cw+10),cy=sy+r*(ch+10);
      if(x>cx&&x<cx+cw&&y>cy&&y<cy+ch&&!this.matched.includes(i)&&!this.flipped.includes(i)){
        this.flipped.push(i);Audio.play('pop');
        if(this.flipped.length===2){
          this.canFlip=false;const[a,b]=this.flipped;
          if(this.cards[a].type===this.cards[b].type){this.matched.push(a,b);this.flipped=[];this.canFlip=true;Audio.play('happy');if(this.matched.length===this.cards.length){this.over=true;Audio.play('success');}}
          else setTimeout(()=>{this.flipped=[];this.canFlip=true;},800);
        }
        break;
      }
    }
  }
  render(ctx,w,h){
    ctx.fillStyle='#f3e5f5';ctx.fillRect(0,0,w,h);
    this.text(ctx,`🃏 Paires: ${this.matched.length/2}/${this.pairs}`,w/2,h*0.06,18);
    const cols=4,rows=3,cw=w*0.18,ch=h*0.22,sx=(w-cols*(cw+10))/2,sy=h*0.12;
    this.cards.forEach((card,i)=>{
      const c=i%cols,r=Math.floor(i/cols),cx=sx+c*(cw+10),cy=sy+r*(ch+10);
      if(this.flipped.includes(i)||this.matched.includes(i)){this.drawRR(ctx,cx,cy,cw,ch,10,'#fff','#e1bee7');this.text(ctx,card.emoji,cx+cw/2,cy+ch/2,32);}
      else{this.drawRR(ctx,cx,cy,cw,ch,10,'#a78bfa');this.text(ctx,'❓',cx+cw/2,cy+ch/2,24,'#fff');}
    });
    if(this.over){this.drawRR(ctx,w/2-120,h/2-50,240,100,20,'rgba(255,255,255,0.95)');this.text(ctx,'🎉 Toutes les paires !',w/2,h/2-15,16);this.text(ctx,'Tape pour continuer',w/2,h/2+20,13,'#8b7355');}
  }
}
