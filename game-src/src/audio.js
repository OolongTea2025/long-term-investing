/* ============================================================
   音訊引擎
   所有事件都對齊 ctx.currentTime，用 lookahead scheduler 排，
   唔靠 setTimeout 排音符（嗰樣每個 tick 會漂移 5-30ms）。
   每個音 = detune 雙振盪器 + 泛音 + sub bass + 低通 + 完整 ADSR。
   三個階段各有自己嘅和弦進行同速度，由明亮行去沉重。
   ============================================================ */
var AUD = {
 ctx:null, on:true, started:false,
 master:null, musicBus:null, sfxBus:null, revSend:null,
 phase:'rookie', _look:null, _next:0, _step:0,
 MUSIC_MAX:0.32,
 /* 階段音樂之間，仲有一層跟住劇情走嘅緊張度。
    佢係由「你而家距離自己嘅高位跌咗幾多」計出嚟 —— 純粹係玩家已經
    知道嘅資料，唔會洩露下一個回合嘅市場。緊張度上升時：
    旋律變疏、濾波收暗、低頻嗡鳴浮返上嚟。 */
 tension:0, _tTarget:0,
 setTension:function(v){ this._tTarget=Math.max(0,Math.min(1,v||0)); },

 init:function(){
  if(this.ctx)return;
  var C=window.AudioContext||window.webkitAudioContext; if(!C)return;
  var t=this.ctx=new C();
  this.master=t.createGain(); this.master.gain.value=0.9;
  var comp=t.createDynamicsCompressor();
  comp.threshold.value=-14; comp.knee.value=22; comp.ratio.value=5;
  comp.attack.value=0.004; comp.release.value=0.22;
  var tone=t.createBiquadFilter();
  tone.type='highshelf'; tone.frequency.value=3400; tone.gain.value=-5;
  this.master.connect(comp); comp.connect(tone); tone.connect(t.destination);
  this.musicBus=t.createGain(); this.musicBus.gain.value=0;
  this.sfxBus=t.createGain();   this.sfxBus.gain.value=0.5;
  this.musicBus.connect(this.master); this.sfxBus.connect(this.master);
  var rev=t.createConvolver(); rev.buffer=this._ir(2.4,2.6);
  var rg=t.createGain(); rg.gain.value=0.9;
  rev.connect(rg); rg.connect(this.master);
  this.revSend=t.createGain(); this.revSend.gain.value=1; this.revSend.connect(rev);
  this.started=true;
 },
 _ir:function(dur,decay){
  var t=this.ctx, sr=t.sampleRate, n=Math.floor(sr*dur), b=t.createBuffer(2,n,sr);
  for(var ch=0;ch<2;ch++){ var d=b.getChannelData(ch);
   for(var i=0;i<n;i++){ var x=i/n, v=(Math.random()*2-1)*Math.pow(1-x,decay);
    if(i<sr*0.02)v*=0.35; d[i]=v; } }
  return b;
 },
 resume:function(){ if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); },
 _fade:function(to,dur){
  if(!this.ctx)return;
  var g=this.musicBus.gain,n=this.ctx.currentTime;
  g.cancelScheduledValues(n); g.setValueAtTime(g.value,n);
  g.linearRampToValueAtTime(to*this.MUSIC_MAX,n+(dur||0.4));
 },

 note:function(o){
  if(!this.ctx||!this.on)return;
  var t=this.ctx, at=o.at!=null?o.at:t.currentTime;
  var dur=o.dur||0.6, peak=o.gain!=null?o.gain:0.18, dest=o.dest||this.sfxBus;
  var vca=t.createGain(); vca.gain.value=0;
  var flt=t.createBiquadFilter(); flt.type='lowpass';
  flt.frequency.setValueAtTime(o.cutoff||2600,at);
  if(o.sweep)flt.frequency.exponentialRampToValueAtTime(Math.max(120,o.sweep),at+dur*0.9);
  flt.Q.value=o.q||0.7;
  var spread=o.spread==null?5:o.spread;      // was `-o.spread||-5` — a precedence bug
  var mk=function(type,det,lvl,mult){
   var osc=t.createOscillator(); osc.type=type;
   osc.frequency.setValueAtTime(o.f*(mult||1),at);
   if(o.glide)osc.frequency.exponentialRampToValueAtTime(o.glide*(mult||1),at+dur*0.8);
   osc.detune.value=det;
   var g=t.createGain(); g.gain.value=lvl;
   osc.connect(g); g.connect(flt); osc.start(at); osc.stop(at+dur+0.12);
  };
  var wave=o.type||'triangle';
  mk(wave,-spread,1.0); mk(wave,spread,1.0);
  if(o.harm)mk('sine',0,o.harm,2);
  if(o.sub) mk('sine',0,o.sub,0.5);
  var a=o.a!=null?o.a:0.012, d=o.d!=null?o.d:dur*0.35,
      s=o.s!=null?o.s:0.55,  r=o.r!=null?o.r:dur*0.5, g=vca.gain;
  g.setValueAtTime(0,at);
  g.linearRampToValueAtTime(peak,at+a);
  g.linearRampToValueAtTime(peak*s,at+a+d);
  g.setValueAtTime(peak*s,at+dur);
  g.exponentialRampToValueAtTime(0.0001,at+dur+r);   // never ramp to exactly 0
  flt.connect(vca); vca.connect(dest);
  if(o.rev&&this.revSend){var rs=t.createGain();rs.gain.value=o.rev;vca.connect(rs);rs.connect(this.revSend);}
 },
 noise:function(o){
  if(!this.ctx||!this.on)return;
  var t=this.ctx, at=o.at!=null?o.at:t.currentTime, dur=o.dur||0.2, sr=t.sampleRate;
  var n=Math.max(1,Math.floor(sr*dur)), buf=t.createBuffer(1,n,sr), d=buf.getChannelData(0);
  for(var i=0;i<n;i++)d[i]=Math.random()*2-1;
  var src=t.createBufferSource(); src.buffer=buf;
  var f=t.createBiquadFilter(); f.type=o.ftype||'bandpass';
  f.frequency.setValueAtTime(o.f||1200,at);
  if(o.sweep)f.frequency.exponentialRampToValueAtTime(Math.max(80,o.sweep),at+dur);
  f.Q.value=o.q||1.2;
  var g=t.createGain();
  g.gain.setValueAtTime(0,at);
  g.gain.linearRampToValueAtTime(o.gain||0.12,at+(o.a||0.006));
  g.gain.exponentialRampToValueAtTime(0.0001,at+dur);
  src.connect(f); f.connect(g); g.connect(o.dest||this.sfxBus);
  if(o.rev&&this.revSend){var rs=t.createGain();rs.gain.value=o.rev;g.connect(rs);rs.connect(this.revSend);}
  src.start(at); src.stop(at+dur+0.05);
 },
 duck:function(amt,dur){
  if(!this.ctx||!this.musicBus)return;
  var g=this.musicBus.gain,n=this.ctx.currentTime,base=this.MUSIC_MAX;
  g.cancelScheduledValues(n); g.setValueAtTime(g.value,n);
  g.linearRampToValueAtTime(base*(1-amt),n+0.04);
  g.linearRampToValueAtTime(base,n+(dur||0.55));
 },

 /* ---------- 音效 ---------- */
 click:function(){ if(!this.ctx)return; var t=this.ctx.currentTime;
  this.noise({at:t,dur:0.045,f:2000,q:1.6,gain:0.10});
  this.note({at:t,f:660,dur:0.05,gain:0.055,a:0.002,d:0.02,s:0.1,r:0.05,cutoff:3200}); },
 hover:function(){ if(!this.ctx)return;
  this.note({f:1180,dur:0.035,type:'sine',gain:0.022,a:0.002,d:0.015,s:0.1,r:0.03}); },
 select:function(){ if(!this.ctx)return; var t=this.ctx.currentTime;
  this.note({at:t,f:523.25,dur:0.10,gain:0.10,harm:0.25,rev:0.10,cutoff:3000});
  this.note({at:t+0.075,f:783.99,dur:0.20,gain:0.09,harm:0.30,rev:0.16,cutoff:3400}); },
 good:function(){ if(!this.ctx)return; this.duck(0.45,0.7); var t=this.ctx.currentTime,S=this;
  [523.25,659.25,783.99,1046.5].forEach(function(f,i){
   S.note({at:t+i*0.065,f:f,dur:0.16,gain:0.085,harm:0.28,rev:0.20,cutoff:3600,a:0.006,r:0.28}); }); },
 bad:function(){ if(!this.ctx)return; this.duck(0.55,0.9); var t=this.ctx.currentTime,S=this;
  [392,329.63,261.63].forEach(function(f,i){
   S.note({at:t+i*0.10,f:f,dur:0.26,type:'sine',gain:0.10,sub:0.4,rev:0.18,cutoff:1700,a:0.008,r:0.4}); });
  this.note({at:t,f:90,glide:62,dur:0.42,type:'sine',gain:0.16,a:0.004,d:0.12,s:0.3,r:0.35,cutoff:400}); },
 alarm:function(){ if(!this.ctx)return; this.duck(0.7,1.2); var t=this.ctx.currentTime;
  for(var k=0;k<2;k++){ var at=t+k*0.42;
   this.note({at:at,f:233.08,dur:0.30,type:'sawtooth',gain:0.075,cutoff:1500,sweep:600,rev:0.14,a:0.01,r:0.2});
   this.note({at:at,f:329.63,dur:0.30,type:'sawtooth',gain:0.065,cutoff:1500,sweep:600,a:0.01,r:0.2}); }
  this.noise({at:t,dur:0.5,f:300,q:0.8,gain:0.05,sweep:120}); },
 heartbeat:function(){ if(!this.ctx)return; this.duck(0.35,0.7);
  var t=this.ctx.currentTime,S=this;
  var thump=function(at,g){
   S.note({at:at,f:74,glide:44,dur:0.16,type:'sine',gain:g,a:0.006,d:0.05,s:0.25,r:0.16,cutoff:260});
   S.noise({at:at,dur:0.07,f:130,q:1.1,gain:g*0.28,ftype:'lowpass'}); };
  thump(t,0.28); thump(t+0.30,0.20); },
 page:function(){ if(!this.ctx)return;
  this.noise({dur:0.34,f:900,sweep:3200,q:0.7,gain:0.045,rev:0.25,a:0.05}); },
 type:function(){ if(!this.ctx||!this.on)return; if(Math.random()<0.55)return;
  this.noise({dur:0.014,f:1100+Math.random()*700,q:2.2,gain:0.016}); },

 /* ---------- 音樂 ---------- */
 PHASES:{
  rookie:{bpm:82,root:220.00,prog:[[0,4,7],[5,9,12],[-3,2,5],[2,5,9]],
   padType:'triangle',motif:[0,4,7,4,9,7,4,2],padGain:0.05,bassGain:0.10,leadGain:0.055,density:0.85},
  mid:{bpm:96,root:196.00,prog:[[0,3,7],[0,3,6],[-2,3,5],[-4,3,7]],
   padType:'sawtooth',motif:[0,3,7,6,3,0,-2,3],padGain:0.032,bassGain:0.11,leadGain:0.05,density:1.0},
  vet:{bpm:60,root:146.83,prog:[[0,7,12],[-5,2,7],[0,5,10],[-2,3,10]],
   padType:'sine',motif:[0,7,5,0,-5,0,3,0],padGain:0.055,bassGain:0.085,leadGain:0.04,density:0.55}
 },
 startMusic:function(p){
  this.init(); if(!this.ctx)return;
  this.phase=p; this.stopMusic(); if(!this.on)return;
  this._step=0; this._next=this.ctx.currentTime+0.1;
  this._fade(0.9,1.2);
  var S=this; this._look=setInterval(function(){S._sched();},25);
 },
 stopMusic:function(){ if(this._look){clearInterval(this._look);this._look=null;} },
 setPhase:function(p){
  if(p===this.phase&&this._look)return;
  if(!this.ctx){this.phase=p;return;}
  this._fade(0,0.6);
  var S=this; setTimeout(function(){S.startMusic(p);},640);
 },
 _sched:function(){
  if(!this.ctx||!this.on)return;
  var cfg=this.PHASES[this.phase]||this.PHASES.rookie;
  var spb=60/cfg.bpm/2, horizon=this.ctx.currentTime+0.12, guard=0;
  while(this._next<horizon&&guard++<24){
   this._emit(this._step,this._next,cfg); this._next+=spb; this._step++;
  }
 },
 _emit:function(step,at,cfg){
  var bar=Math.floor(step/8)%cfg.prog.length, beat=step%8, chord=cfg.prog[bar], S=this;
  var semi=function(n){return cfg.root*Math.pow(2,n/12);};
  /* 緊張度慢慢行去目標，唔會一格跳晒 —— 音樂唔應該喺一個回合之間急轉 */
  this.tension+=(this._tTarget-this.tension)*0.02;
  var T=this.tension;
  if(beat===0){
   this.note({at:at,f:semi(chord[0])/2,dur:0.9,type:'sine',gain:cfg.bassGain,
    sub:0.5,cutoff:420,a:0.02,d:0.2,s:0.6,r:0.5,dest:this.musicBus});
  }else if(beat===4&&cfg.density>0.7){
   this.note({at:at,f:semi(chord[0]+7)/2,dur:0.5,type:'sine',gain:cfg.bassGain*0.6,
    cutoff:380,a:0.02,d:0.15,s:0.5,r:0.3,dest:this.musicBus});
  }
  if(beat===0){
   var padCut=(this.phase==='mid'?1500:2000)*(1-T*0.45);   // 越緊張越暗
   chord.forEach(function(n,i){
    S.note({at:at,f:semi(n),dur:8*(60/cfg.bpm/2)*0.92,type:cfg.padType,
     gain:cfg.padGain*(i===0?1:0.72)*(1+T*0.25),spread:7+T*6,
     cutoff:padCut,a:0.55,d:0.6,s:0.75,r:1.4,rev:0.42,dest:S.musicBus});
   });
   /* 回撤深嗰陣，低音多一個小二度嘅摩擦 —— 唔會蓋過旋律，但坐喺底下唔舒服 */
   if(T>0.45)
    this.note({at:at,f:semi(chord[0]+1)/2,dur:1.6,type:'sine',gain:0.05*T,
     cutoff:260,a:0.6,d:0.4,s:0.7,r:1.2,rev:0.4,dest:this.musicBus});
  }
  var m=cfg.motif[beat];
  var play=this.phase==='vet'?(beat%2===0):(beat!==3&&beat!==7);
  if(play&&m!=null&&Math.random()<cfg.density*(1-T*0.55)){   // 越緊張旋律越疏
   this.note({at:at,f:semi(m+12),dur:0.30,gain:cfg.leadGain,harm:0.22,spread:4,
    cutoff:2800,a:0.02,d:0.12,s:0.4,r:0.5,rev:0.35,dest:this.musicBus});
  }
  if(this.phase==='mid'){
   if(beat===2||beat===6)
    this.note({at:at,f:semi(chord[1]+12),dur:0.11,gain:cfg.leadGain*0.5,
     cutoff:2200,a:0.005,d:0.05,s:0.25,r:0.14,dest:this.musicBus,rev:0.2});
   if(beat===7&&Math.floor(step/8)%2===1)
    this.noise({at:at,dur:0.07,f:5200,q:2.5,gain:0.013,dest:this.musicBus,rev:0.3});
  }
  if(this.phase==='vet'&&step%32===0){
   this.note({at:at,f:semi(chord[0])/4,dur:3.2,type:'sine',gain:0.06,
    a:1.0,d:0.8,s:0.7,r:2.0,cutoff:300,rev:0.5,dest:this.musicBus});
  }
 },
 setOn:function(v){
  this.on=!!v;
  if(this.on){ this.init(); this.resume();
   if(this.ctx){var g=this.master.gain,n=this.ctx.currentTime;
    g.cancelScheduledValues(n);g.setValueAtTime(g.value,n);g.linearRampToValueAtTime(0.9,n+0.25);}
   this.startMusic(this.phase);
  }else{ this.stopMusic();
   if(this.ctx){var g2=this.master.gain,n2=this.ctx.currentTime;
    g2.cancelScheduledValues(n2);g2.setValueAtTime(g2.value,n2);g2.linearRampToValueAtTime(0,n2+0.25);}
  }
  return this.on;
 },

 /* ---------- 結局終止式 ---------- */
 endSting:function(kind){
  this.stopMusic(); this.init(); if(!this.ctx)return;
  this._fade(0.9,0.3);
  var t=this.ctx.currentTime+0.15, B=this.musicBus, S=this;
  var N=function(at,f,dur,g,o){
   var base={at:at,f:f,dur:dur,gain:g,rev:0.45,dest:B,type:'triangle',a:0.03,r:dur*0.7};
   for(var k in (o||{}))base[k]=o[k];
   S.note(base);
  };
  if(kind==='BLOWUP'||kind==='EARLY_RUIN'){
   [220,174.61,138.59,110].forEach(function(f,i){N(t+i*0.34,f,1.5,0.11,{type:'sine',sub:0.5,cutoff:900});});
   N(t+1.5,103.83,3.0,0.09,{type:'sine',sub:0.6,cutoff:500});
   N(t+1.5,146.83,3.0,0.06,{type:'sine',cutoff:500});
  }else if(kind==='TRUE_ALPHA'||kind==='WU_WEI'){
   [261.63,392,523.25].forEach(function(f,i){N(t+i*0.42,f,1.6,0.085,{harm:0.3,cutoff:3000});});
   [261.63,329.63,392,523.25].forEach(function(f){N(t+1.5,f,3.2,0.055,{harm:0.25,cutoff:2600});});
  }else if(kind==='LUCKY_FOOL'){
   /* 先奏勝利大調，然後和聲變質 —— 用聲音講返「你贏咗，但唔係因為你叻」 */
   [523.25,659.25,783.99].forEach(function(f,i){N(t+i*0.28,f,0.9,0.085,{harm:0.3});});
   N(t+1.15,830.61,2.6,0.07,{type:'sawtooth',cutoff:1400,sweep:600});
   N(t+1.15,622.25,2.6,0.07,{type:'sawtooth',cutoff:1400,sweep:600});
   N(t+1.15,155.56,3.2,0.09,{type:'sine',sub:0.5,cutoff:400});
  }else if(kind==='AWAKENING'){
   [293.66,392,440].forEach(function(f,i){N(t+i*0.36,f,1.8,0.075,{cutoff:2400});});
   [329.63,440,493.88].forEach(function(f){N(t+1.5,f,3.0,0.055,{harm:0.2,cutoff:2400});});
  }else{
   [220,196,174.61].forEach(function(f,i){N(t+i*0.45,f,1.9,0.075,{type:'sine',cutoff:1300});});
   N(t+1.6,220,3.4,0.06,{type:'sine',cutoff:1000});
   N(t+1.6,261.63,3.4,0.045,{type:'sine',cutoff:1000});
  }
 }
};
