/* ============================================================
   遊戲迴圈 · 介面 · 存檔
   ============================================================ */
var AB='assets/',EXT='.webp';
var SPRITES={
 wulong:{rookie:'chr_wulong_01_rookie',rookie_excited:'chr_wulong_02_rookie_excited',
  mid:'chr_wulong_03_mid',mid_anxious:'chr_wulong_04_mid_anxious',
  vet:'chr_wulong_05_vet',vet_broken:'chr_wulong_06_vet_broken'},
 mike:{calm:'chr_mike_01_calm',smile:'chr_mike_02_smile',yawn:'chr_mike_03_yawn',shrug:'chr_mike_04_shrug'},
 sinhing:{smug:'chr_sinhing_01_smug',secretive:'chr_sinhing_02_secretive',
  panic:'chr_sinhing_03_panic',vanish:'chr_sinhing_04_vanish'},
 analyst:{pro:'chr_analyst_01_pro',point:'chr_analyst_02_point',
  awkward:'chr_analyst_03_awkward',smirk:'chr_analyst_04_smirk'},
 elder:{serene:'chr_elder_01_serene',lecture:'chr_elder_02_lecture',
  silent:'chr_elder_03_silent',collapse:'chr_elder_04_collapse'}
};
var BGS={HOME_NIGHT:'bg_01_home_desk_night',CHA_TENG:'bg_02_cha_chaan_teng',
 OFFICE:'bg_03_office',ROOFTOP:'bg_04_rooftop_night',PARK:'bg_05_park_bench',
 TV_STUDIO:'bg_06_tv_studio',APP_VOID:'bg_07_app_void'};
var NAMES={mike:'Mike',sinhing:'師兄',analyst:'陳分析師',elder:'陳伯'};
function chrURL(w,s){return AB+'chr/'+SPRITES[w][s]+EXT;}
function bgURL(k){return AB+'bg/'+BGS[k]+EXT;}
function cgURL(n){return AB+'cg/'+n+EXT;}
function uiURL(n){return AB+'ui/'+n+EXT;}

var ALL_SCEN=SCEN_ROOKIE.concat(SCEN_MID,SCEN_VET);
function $(id){return document.getElementById(id);}
/* fmt / fmtSigned 搬咗去 i18n.js —— 佢哋要跟語言換貨幣。 */
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

var G=null, typing=null, curScen=null, locked=false;
var OPTS={speed:17,sound:1,tags:0,lang:''};

/* ---------- 設定 ---------- */
var OPT_KEY='wulongcha:opts';
function loadOpts(){
 try{var o=JSON.parse(localStorage.getItem(OPT_KEY));if(o)for(var k in o)OPTS[k]=o[k];}catch(e){}
 if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches&&OPTS.speed>7)OPTS.speed=0;
}
function saveOpts(){try{localStorage.setItem(OPT_KEY,JSON.stringify(OPTS));}catch(e){}}
function syncSeg(id,val){
 var seg=$(id);if(!seg)return;
 [].forEach.call(seg.children,function(b){b.classList.toggle('on',b.dataset.v===String(val));});
}
function applyOpts(){
 syncSeg('segSpeed',OPTS.speed);syncSeg('segSound',OPTS.sound);syncSeg('segTags',OPTS.tags);
 syncSeg('segLang',LANG);
 AUD.on=!!OPTS.sound;
}

/* newGame / drift / applyChoice / optionsFor / phaseOf 全部喺 engine.js，
   同 Node 測試共用同一份，唔會走樣。 */

/* ---------- 畫面切換 ---------- */
function show(id){
 ['title','game','end'].forEach(function(s){$(s).classList.toggle('on',s===id);});
}

/* ---------- 回合迴圈 ---------- */
function nextTurn(){
 if(G.turn>=TURNS){finish();return;}
 if(isRuined(G)){G.ruinTurn=G.turn;finish();return;}
 if((G.turn===20||G.turn===45)&&!G.reviewed[G.turn]){
  G.reviewed[G.turn]=1;showReview(G.turn);return;
 }
 G.turn++;
 /* 自動存檔要喺 drift() 之前 —— 讀檔嗰陣 nextTurn() 會再行一次 drift()，
    如果存嘅係 drift 之後嘅姿態，讀返嚟就會被 drift 兩次。 */
 if(G.turn>1)saveGame();
 drift(G);
 var sc=ALL_SCEN[G.turn-1]; curScen=sc; locked=false;
 var ph=phaseOf(G.turn);
 AUD.setPhase(ph);
 /* 音樂緊張度跟你自己嘅回撤走。用你已經見到嘅淨值歷史計，
    唔會攞下一個回合嘅市場資料 —— 音樂唔可以劇透。 */
 var pk=0,h=G.sim.hist;
 for(var i=0;i<h.length;i++)pk=Math.max(pk,h[i]);
 AUD.setTension(pk>0?clamp((1-h[h.length-1]/pk)/0.32,0,1):0);
 $('tNum').textContent=G.turn;
 $('tWhen').textContent=t('turnWhen',Math.round(yearAt(G.turn)),ageAt(G.turn));
 $('tPhase').textContent=PHASE_LABEL[ph];

 var nb=bgURL(sc.bg);
 if($('bg').dataset.cur!==nb){
  $('bg').style.opacity='0';
  setTimeout(function(){$('bg').style.backgroundImage="url('"+nb+"')";
   $('bg').dataset.cur=nb;$('bg').style.opacity='1';},160);
 }
 setFigure(sc);
 if(sc.who&&NAMES[sc.who]){$('nameTag').style.display='block';$('spkName').textContent=NAMES[sc.who];}
 else $('nameTag').style.display='none';

 $('sig').textContent=sc.sig;
 $('res').classList.remove('on');
 $('opts').innerHTML='';
 AUD.page();
 typeText(sc.txt,function(){renderOpts(sc);});
 drawChart(); updHUD();
}

function setFigure(sc){
 var who=sc.spr[0], st=sc.spr[1];
 if(who==='wulong'){
  var stage=G.turn<=20?'rookie':G.turn<=45?'mid':'vet';
  var behind=G.sim.eq<mikeAt(G,G.turn-1)*0.85;
  var auto=stage;
  if(G.ego>200&&stage==='mid')auto='mid_anxious';
  else if(behind&&stage==='mid')auto='mid_anxious';
  else if(behind&&stage==='vet')auto='vet_broken';
  else if(!behind&&stage==='rookie'&&G.turn>1)auto='rookie_excited';
  if(SPRITES.wulong[auto])st=auto;
 }
 var src=chrURL(who,st), A=$('figA'), B=$('figB');
 if(A.dataset.cur===src){A.classList.add('in');return;}
 /* 真正嘅 crossfade：
    舊圖搬去後層之後，要即刻設做完全不透明（暫時熄咗 transition），
    否則佢會由 0 淡「入」—— 即係舊圖同新圖一齊淡入，
    睇落就好似舊人物遲遲唔肯消失。
    然後兩張喺同一幀開始反方向過渡，先至係交叉淡出。 */
 var done=false;
 var swap=function(){
  if(done)return; done=true;      // cache 命中時 onload 同 complete 可能兩邊都行
  if(A.dataset.cur){
   B.src=A.src;
   B.style.transition='none'; B.classList.add('in');
   void B.offsetWidth;                       // 迫佢即刻套用
   B.style.transition='';
  }
  A.style.transition='none'; A.classList.remove('in');
  void A.offsetWidth;
  A.style.transition='';
  A.src=src; A.dataset.cur=src;
  requestAnimationFrame(function(){
   A.classList.add('in');       // 新圖 0 -> 1
   B.classList.remove('in');    // 舊圖 1 -> 0，同一幀開始
  });
 };
 var img=new Image();
 img.onload=img.onerror=swap;
 img.src=src;
 if(img.complete)swap();        // 已經喺 cache 嘅話 onload 可能唔會再射
}

function typeText(txt,cb){
 var el=$('body');el.textContent='';
 if(typing){clearInterval(typing);typing=null;}
 if(!OPTS.speed){el.textContent=txt;cb&&cb();el.onclick=null;return;}
 var i=0;
 typing=setInterval(function(){
  el.textContent=txt.slice(0,++i);
  if(i%2===0)AUD.type();
  if(i>=txt.length){clearInterval(typing);typing=null;cb&&cb();}
 },OPTS.speed);
 el.onclick=function(){
  if(typing){clearInterval(typing);typing=null;el.textContent=txt;cb&&cb();}
 };
}

function renderOpts(sc){
 var box=$('opts');box.innerHTML='';
 optionsFor(G,sc).forEach(function(o,i){
  var b=document.createElement('button');
  b.className='opt'+(o.extra?' extra':'');
  var tag=(OPTS.tags&&o.b)?'<span class="btag">'+esc(BIAS[o.b][0])+'</span>':'';
  b.innerHTML='<span class="k">'+('ABCDE'[i]||'·')+'</span><span class="otxt">'+esc(o.t)+'</span>'+tag;
  b.onmouseenter=function(){AUD.hover();};
  b.onclick=function(){choose(o,sc);};
  box.appendChild(b);
 });
}

function choose(opt,sc){
 if(locked)return; locked=true;
 AUD.select();
 [].forEach.call(document.querySelectorAll('.opt'),function(b){b.disabled=true;});
 var out=commitChoice(G,opt,sc);

 setTimeout(function(){
  if(G.sim.forced&&G.sim.forced!==G._forcedSeen){G._forcedSeen=G.sim.forced;AUD.alarm();}
  else if(out.rp>0.06)AUD.good();
  else if(out.rp<-0.08)AUD.bad();
  else if(G.posture.lev>1.3||G.posture.conc>0.55)AUD.heartbeat();
 },240);

 $('resTxt').textContent=opt.r;
 var why='';
 if(opt.why)why+=opt.why;
 if(G.sim.forced&&G.sim.forced!==G._forcedShown){
  G._forcedShown=G.sim.forced;
  why+=(why?'<br>':'')+'<span class="tag">'+esc(t('tagForced'))+'</span> '+t('forcedWhy');
 }
 if(opt.b&&OPTS.tags)
  why+=(why?'<br>':'')+'<span class="tag">'+esc(BIAS[opt.b][0])+'</span> '+esc(BIAS[opt.b][1]);
 if(why){$('resWhy').style.display='block';$('resWhy').innerHTML=why;}
 else $('resWhy').style.display='none';

 $('res').classList.add('on');
 drawChart(); updHUD(); shock(out.rp);
 $('res').scrollIntoView({block:'nearest',behavior:OPTS.speed?'smooth':'auto'});
}

function shock(rp){
 var f=$('flash');if(!f)return;
 var col=null,mag=0;
 if(rp<=-0.12){col='rgba(192,74,62,';mag=Math.min(1,(-rp-0.12)/0.35);}
 else if(rp>=0.10){col='rgba(79,148,99,';mag=Math.min(1,(rp-0.10)/0.30);}
 if(!col)return;
 f.style.background='radial-gradient(ellipse at center, transparent 28%, '+col+(0.18+mag*0.42).toFixed(2)+') 100%)';
 f.classList.add('hit');
 if(rp<=-0.20){$('app').classList.add('shake');setTimeout(function(){$('app').classList.remove('shake');},420);}
 setTimeout(function(){f.classList.remove('hit');},110);
}

/* ---------- HUD ---------- */
function updHUD(){
 var m=mikeAt(G,G.turn);
 $('hNav').textContent=fmt(G.sim.eq);
 $('hBen').textContent=fmt(m);
 var gap=m>0?(G.sim.eq/m-1)*100:0;
 var g=$('hGap');
 g.textContent=(gap>=0?'+':'')+gap.toFixed(1)+'%';
 g.className=gap>=0?'up':'dn';
}

function drawChart(){
 var c=$('chart'),W=c.clientWidth,H=c.clientHeight;
 if(!W||!H)return;
 var dpr=window.devicePixelRatio||1;
 c.width=W*dpr;c.height=H*dpr;
 var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);
 x.clearRect(0,0,W,H);
 var a=G.sim.hist,b=G.mikeHist,n=a.length;
 var mx=0,mn=Infinity;
 for(var i=0;i<n;i++){mx=Math.max(mx,a[i],b[i]);mn=Math.min(mn,a[i],b[i]);}
 var pad=5,rng=(mx-mn)||1;
 var X=function(i){return pad+(W-pad*2)*(i/TURNS);};
 var Y=function(v){return H-pad-(H-pad*2)*((v-mn)/rng);};
 var big=$('chartWrap').classList.contains('big');
 /* 你唔喺市場嘅時段：底色帶 */
 if(big){
  x.fillStyle='rgba(232,228,217,.07)';
  for(var k=0;k<G.sim.invFracHist.length;k++){
   if(G.sim.invFracHist[k]<0.5)x.fillRect(X(k),pad,Math.max(1,X(k+1)-X(k)),H-pad*2);
  }
 }
 x.strokeStyle='rgba(122,158,143,.9)';x.lineWidth=1.4;x.beginPath();
 for(i=0;i<n;i++)i?x.lineTo(X(i),Y(b[i])):x.moveTo(X(i),Y(b[i]));
 x.stroke();
 var last=a[n-1],lb=b[n-1];
 x.strokeStyle=last>=lb?'rgba(79,148,99,1)':'rgba(192,74,62,1)';
 x.lineWidth=1.9;x.beginPath();
 for(i=0;i<n;i++)i?x.lineTo(X(i),Y(a[i])):x.moveTo(X(i),Y(a[i]));
 x.stroke();
 x.fillStyle=x.strokeStyle;x.beginPath();x.arc(X(n-1),Y(last),2.6,0,7);x.fill();
 x.font='9px sans-serif';x.fillStyle='rgba(122,158,143,.95)';
 x.fillText('Mike',Math.min(W-28,X(n-1)+4),Y(lb)+3);
 if(big){
  x.fillStyle='rgba(232,228,217,.55)';
  x.fillText(t('chartOutBand'),8,H-7);
 }
}
$('chartWrap').onclick=function(){
 this.classList.toggle('big');
 setTimeout(drawChart,320);
};

/* ---------- 存檔 ----------
   只存 seed + 決定序列 + 敘事計數。
   讀檔時用 seed 重生成市場、用決定序列重播出淨值 —— 完全對得返，
   而且檔案細好多。 */
var SAVE_KEY='wulongcha:save2', SAVE_VER=3;
function serialise(){
 return JSON.stringify({v:SAVE_VER,t:Date.now(),seed:G.seed,name:G.name,turn:G.turn,
  decs:G.decs,posture:G.posture,ego:G.ego,disc:G.disc,health:G.health,commit:G.commit,
  biasCount:G.biasCount,biasLog:G.biasLog,choices:G.choices,reviewed:G.reviewed,
  idleTurns:G.idleTurns});
}
function saveGame(){
 try{
  var blob=serialise();
  if(window.storage&&window.storage.set){try{window.storage.set(SAVE_KEY,blob)['catch'](function(){});}catch(e){}}
  try{localStorage.setItem(SAVE_KEY,blob);}catch(e){}
  return true;
 }catch(e){return false;}
}
function applySave(o){
 if(!o||o.v!==SAVE_VER)return false;
 G=newGame(o.name,o.seed);
 G.turn=o.turn; G.decs=o.decs||[]; G.posture=o.posture||G.posture;
 G.ego=o.ego||0; G.disc=o.disc||0; G.health=o.health||0; G.commit=o.commit||0;
 G.biasCount=o.biasCount||{}; G.biasLog=o.biasLog||[]; G.choices=o.choices||[];
 G.reviewed=o.reviewed||{}; G.idleTurns=o.idleTurns||0;
 G.sim=replay(G.path,G.decs,{});
 return true;
}
function readSaveRaw(){
 return new Promise(function(res){
  if(window.storage&&window.storage.get){
   try{window.storage.get(SAVE_KEY).then(function(r){
    if(r&&r.value)return res(r.value);
    try{res(localStorage.getItem(SAVE_KEY));}catch(e){res(null);}
   })['catch'](function(){try{res(localStorage.getItem(SAVE_KEY));}catch(e){res(null);}});
   return;
  }catch(e){}
  }
  try{res(localStorage.getItem(SAVE_KEY));}catch(e){res(null);}
 });
}
function clearSave(){
 if(window.storage&&window.storage['delete']){try{window.storage['delete'](SAVE_KEY)['catch'](function(){});}catch(e){}}
 try{localStorage.removeItem(SAVE_KEY);}catch(e){}
}

/* ---------- 階段結算 ---------- */
var PHASE_META={
 20:{eyebrow:'PHASE I · REVIEW',title:'rvTitle20'},
 45:{eyebrow:'PHASE II · REVIEW',title:'rvTitle45'}
};
function phaseSlice(turn){
 var from=turn===20?0:20,a=G.sim.hist,b=G.mikeHist;
 var mine=a[from]>0?(a[turn]/a[from]-1):0;
 var bench=b[from]>0?(b[turn]/b[from]-1):0;
 var biases=G.biasLog.filter(function(x){return x.turn>from&&x.turn<=turn;});
 var cnt={};biases.forEach(function(x){cnt[x.b]=(cnt[x.b]||0)+1;});
 var top=Object.keys(cnt).map(function(k){return [k,cnt[k]];})
  .sort(function(p,q){return q[1]-p[1];}).slice(0,3);
 var peak=-Infinity,dd=0;
 for(var i=from;i<=turn;i++){peak=Math.max(peak,a[i]);if(peak>0)dd=Math.min(dd,a[i]/peak-1);}
 var out=0;for(i=from;i<G.sim.invFracHist.length&&i<turn;i++)if(G.sim.invFracHist[i]<0.5)out++;
 return {from:from,to:turn,mine:mine,bench:bench,biases:biases.length,top:top,dd:dd,out:out};
}
function kv(l,v){return '<div class="kv"><span class="l">'+l+'</span><span class="v">'+v+'</span></div>';}
function showReview(turn){
 var M0=PHASE_META[turn];if(!M0){nextTurn();return;}
 var d=phaseSlice(turn);
 AUD.page();
 $('rvEyebrow').textContent=M0.eyebrow;
 $('rvTitle').textContent=t(M0.title);
 var pc=function(v){return (v>=0?'+':'')+(v*100).toFixed(1)+'%';};
 var cls=function(v){return v>=0?'up':'dn';};
 $('rvStats').innerHTML=
  kv(t('kvYourRet'),'<span class="'+cls(d.mine)+'">'+pc(d.mine)+'</span>')+
  kv(t('kvMikeRet'),'<span class="'+cls(d.bench)+'">'+pc(d.bench)+'</span>')+
  kv(t('kvYourNav'),fmt(G.sim.hist[turn]))+
  kv(t('kvMikeNav'),fmt(G.mikeHist[turn]))+
  kv(t('kvMaxDD'),'<span class="dn">'+(d.dd*100).toFixed(1)+'%</span>')+
  kv(t('kvEmoDec'),t('unitTimes',d.biases,d.to-d.from))+
  kv(t('kvTradeCost'),fmt(G.sim.tradeCost))+
  kv(t('kvOutTurns'),t('unitCount',d.out));
 drawReviewChart(d);
 var gap=d.mine-d.bench,v;
 if(gap>0.05)v=t('rvVerdictWin');
 else if(gap>-0.03)v=t('rvVerdictTie');
 else if(gap>-0.15)v=t('rvVerdictSoft');
 else v=t('rvVerdictBad');
 $('rvVerdict').textContent=v;
 $('rvBias').innerHTML=d.top.length
  ? t('rvBiasHead')+'<br>'+d.top.map(function(p){
     return '· <b style="color:var(--gold)">'+esc(BIAS[p[0]][0])+'</b> ×'+p[1]+' — '+esc(BIAS[p[0]][1]);}).join('<br>')
  : t('rvBiasNone');
 var sv=$('rvSave');sv.textContent=t('btnSave');sv.classList.remove('ok');
 $('review').classList.add('on');
}
function drawReviewChart(d){
 var c=$('rvChart');if(!c)return;
 var W=c.clientWidth||480,H=120,dpr=window.devicePixelRatio||1;
 c.width=W*dpr;c.height=H*dpr;
 var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
 var a=G.sim.hist,b=G.mikeHist,n=d.to+1,mx=0,mn=Infinity;
 for(var i=0;i<n;i++){mx=Math.max(mx,a[i],b[i]);mn=Math.min(mn,a[i],b[i]);}
 var pad=8,rng=(mx-mn)||1;
 var X=function(i){return pad+(W-pad*2)*(i/Math.max(1,n-1));};
 var Y=function(v){return H-pad-(H-pad*2)*((v-mn)/rng);};
 if(d.from>0){
  x.strokeStyle='rgba(232,228,217,.18)';x.setLineDash([3,3]);x.lineWidth=1;
  x.beginPath();x.moveTo(X(d.from),pad);x.lineTo(X(d.from),H-pad);x.stroke();x.setLineDash([]);
 }
 x.strokeStyle='rgba(122,158,143,.9)';x.lineWidth=1.5;x.beginPath();
 for(i=0;i<n;i++)i?x.lineTo(X(i),Y(b[i])):x.moveTo(X(i),Y(b[i]));x.stroke();
 x.strokeStyle=a[n-1]>=b[n-1]?'rgba(79,148,99,1)':'rgba(192,74,62,1)';
 x.lineWidth=2;x.beginPath();
 for(i=0;i<n;i++)i?x.lineTo(X(i),Y(a[i])):x.moveTo(X(i),Y(a[i]));x.stroke();
 x.font='9px sans-serif';x.fillStyle='rgba(122,158,143,.95)';
 x.fillText('Mike',Math.max(4,X(n-1)-26),Y(b[n-1])-5);
}

/* ---------- 決定紀錄 ---------- */
function showLog(){
 var h='';
 if(!G.choices.length)h='<div style="color:var(--dim);font-size:12.5px">'+esc(t('logEmpty'))+'</div>';
 for(var i=G.choices.length-1;i>=0;i--){
  var c=G.choices[i];
  h+='<div class="logrow"><div class="t">'+esc(t('logTurn',c.turn,Math.round(yearAt(c.turn))))+'</div>'+
     '<div>'+esc(c.opt)+'</div>'+
     (c.bias?'<div class="b">'+esc(BIAS[c.bias][0])+' — '+esc(BIAS[c.bias][1])+'</div>':'')+
     '</div>';
 }
 $('logList').innerHTML=h;
 $('logOvl').classList.add('on');
}

/* ---------- 結局 ---------- */
function finish(){
 var mikeEq=mikeAt(G,G.decs.length);
 G.mike={eq:mikeEq};
 var mc=monteCarlo(G.decs,400);
 var kind=judge(G,mc.win);
 G.ended=kind;
 var inf=ENDING_INFO[kind];
 clearSave();
 AUD.endSting(kind);
 show('end');
 $('end').scrollTop=0;
 $('endCg').style.backgroundImage="url('"+cgURL(inf.cg)+"')";
 $('eName').textContent=inf.n;
 var endTurn=G.ruinTurn||G.decs.length;
 $('eTag').textContent=t('eTag',endTurn,Math.round(yearAt(endTurn)),G.name,fmt(G.sim.eq));
 $('eDesc').textContent=inf.d;

 var A=attribute(G);
 var h='';

 /* --- 對照 --- */
 h+='<div class="sec">'+esc(t('secCompare'))+'</div>';
 h+=stat(esc(t('statYou',G.name)),fmt(G.sim.eq));
 h+=stat(esc(t('statMike')),fmt(mikeEq));
 var gapPc=mikeEq>0?(G.sim.eq/mikeEq-1)*100:0;
 h+=stat(esc(t('statGap')),'<span class="'+(gapPc>=0?'up':'dn')+'">'+(gapPc>=0?'+':'')+gapPc.toFixed(1)+'%</span>');
 h+=stat(esc(t('statGapAmt')),'<span class="'+(gapPc>=0?'up':'dn')+'">'+fmt(Math.abs(A.gap))+'</span>');
 var LV=levelOf(G.sim.eq),LM=levelOf(mikeEq);
 h+=stat(esc(t('statYourLvl')),LV[0]+'　<span style="color:var(--dim);font-size:11px">'+LV[1]+'</span>');
 h+=stat(esc(t('statMikeLvl')),LM[0]+'　<span style="color:var(--dim);font-size:11px">'+LM[1]+'</span>');
 h+='<div class="foot">'+t('footTotalIn',fmt(START+G.sim.contributed),fmt(START),fmt(G.sim.contributed))+
    (HAS_SITE?t('footLadder',chLink('CH13',t('footLadderCh'))):'')+'</div>';

 /* --- 幸運兒 / 真 Alpha 揭盅 --- */
 if(kind==='LUCKY_FOOL'){
  h+='<div class="note">'+t('noteLucky',G.decs.length,(mc.win*100).toFixed(0),mc.med.toFixed(2))+'</div>';
 }else if(kind==='TRUE_ALPHA'){
  h+='<div class="note good">'+t('noteAlpha',(mc.win*100).toFixed(0))+'</div>';
 }else if(kind==='WU_WEI'){
  h+='<div class="note good">'+t('noteWuWei')+'</div>';
 }

 /* --- 歸因（重點） --- */
 h+='<div class="sec">'+esc(t('secAttr'))+'</div>';
 h+='<div class="foot" style="margin:-4px 0 12px">'+t('attrIntro')+'</div>';
 var items=[
  [t('attrCost'),A.cost,t('attrCostWhy'),'CH2'],
  [t('attrTiming'),A.timing,t('attrTimingWhy'),'CH2'],
  [t('attrConc'),A.conc,t('attrConcWhy'),'CH3'],
  [t('attrLev'),A.lev,t('attrLevWhy'),'CH7'],
  [t('attrIncome'),-A.income,t('attrIncomeWhy'),'CH7']
 ];
 var maxAbs=1;
 items.forEach(function(it){maxAbs=Math.max(maxAbs,Math.abs(it[1]));});
 items.forEach(function(it){
  var v=it[1],w=Math.abs(v)/maxAbs*100;
  var cost=v>0;   // 正數 = 熄咗佢你會多錢 = 佢係一個代價
  h+='<div class="attr"><div class="top"><span>'+it[0]+'</span>'+
   '<span class="amt '+(cost?'dn':'up')+'">'+(cost?'−':'+')+fmt(Math.abs(v))+'</span></div>'+
   '<div class="track"><i style="width:'+w.toFixed(1)+'%;background:'+
   (cost?'var(--red)':'var(--green)')+'"></i></div>'+
   '<div class="why">'+it[2]+(HAS_SITE?'　'+chLink(it[3]):'')+'</div></div>';
 });
 h+='<div class="note plain">'+t('attrNote',fmt(A.you+A.all),fmt(Math.abs(A.all)))+'</div>';

 /* --- 成本明細 --- */
 h+='<div class="sec">'+esc(t('secCostDetail'))+'</div>';
 h+=stat(esc(t('statTradeCost')),fmt(G.sim.tradeCost));
 h+=stat(esc(t('statFundFee')),fmt(G.sim.fundFee));
 h+=stat(esc(t('statMargin')),fmt(G.sim.marginCost));
 h+=stat(esc(t('statSpent')),fmt(G.sim.spent));
 h+=stat(esc(t('statForced')),esc(t('unitTimesN',G.sim.forced||0)));
 var outTurns=G.sim.invFracHist.filter(function(v){return v<0.5;}).length;
 h+=stat(esc(t('statOutTurns')),esc(t('unitOutOf',outTurns,G.decs.length)));
 h+=stat(esc(t('statEmoDec')),esc(t('unitTimes',G.biasLog.length,G.decs.length)));

 /* --- Monte Carlo --- */
 h+='<div class="sec">'+esc(t('secMC'))+'</div>';
 h+='<canvas class="cv" id="mc" height="170"></canvas>';
 h+='<div class="note plain" id="mcTxt"></div>';

 /* --- 偏誤 + 返去邊一課 --- */
 var ent=Object.keys(G.biasCount).map(function(k){return [k,G.biasCount[k]];})
  .sort(function(a,b){return b[1]-a[1];});
 h+='<div class="sec">'+esc(t('secBias'))+'</div>';
 if(!ent.length){
  h+='<div class="e-desc" style="font-size:13.5px">'+esc(t('biasNone'))+'</div>';
 }else{
  var mxb=ent[0][1];
  ent.slice(0,12).forEach(function(p){
   h+='<div class="biasrow"><span class="bn">'+esc(BIAS[p[0]][0])+'</span>'+
    '<span class="bar"><i style="width:'+(p[1]/mxb*100)+'%"></i></span>'+
    '<span class="bc">'+p[1]+'</span></div>'+
    '<div class="biasdesc">'+esc(BIAS[p[0]][1])+
    (HAS_SITE?'　→ '+biasLink(p[0]):'')+'</div>';
  });
 }

 /* --- 關鍵決定回顧 --- */
 h+='<div class="sec">'+esc(t('secKey'))+'</div>';
 var key=G.choices.filter(function(c){return c.bias;}).slice(0,8);
 if(!key.length)h+='<div class="e-desc" style="font-size:13.5px">'+esc(t('keyNone'))+'</div>';
 key.forEach(function(c){
  var sc=ALL_SCEN[c.scen-1],alt=sc?sc.opts.filter(function(o){return !o.b;})[0]:null;
  h+='<div class="logrow"><div class="t">'+esc(t('logTurn',c.turn,Math.round(yearAt(c.turn))))+'</div>'+
   '<div>'+esc(t('keyPicked',c.opt))+'</div>'+
   '<div class="b">'+esc(BIAS[c.bias][0])+' — '+esc(BIAS[c.bias][1])+'</div>'+
   (alt?'<div class="t" style="margin-top:4px">'+esc(t('keyAlt',alt.t))+'</div>':'')+'</div>';
 });

 /* --- Mike --- */
 h+='<div class="sec">'+esc(t('secMike'))+'</div>';
 h+='<img class="mikeimg" src="'+uiURL('ui_mike_four_seasons')+'" alt="">';
 h+='<div class="foot">'+t('mikeFoot')+'</div>';

 /* --- 返教學網 --- */
 if(HAS_SITE){
  h+='<div class="sec">'+esc(t('secNext'))+'</div>';
  h+='<div class="foot" style="font-size:12.5px;line-height:2.1">'+
   '· '+chLink('CH6',t('nextCh6'))+'<br>'+
   '· '+chLink('CH2',t('nextCh2'))+'<br>'+
   '· '+chLink('CH3',t('nextCh3'))+'<br>'+
   '· '+chLink('CH5',t('nextCh5'))+'<br>'+
   '· '+chLink('APA',t('nextApA'))+'</div>';
 }

 h+='<div class="endbtns">'+
  '<button class="btn sm" id="again">'+esc(t('btnAgain'))+'</button>'+
  '<button class="btn sm ghost" id="ng2">'+esc(t('btnNg2'))+'</button>'+
  (HAS_SITE?'<button class="btn sm ghost" id="toSite">'+esc(t('btnToSite'))+'</button>':'')+
  '</div>';
 h+='<div class="foot">'+t('endFoot')+'</div>';

 $('eExtra').innerHTML=h;
 /* 即刻鎖定個比率再傳入去 —— 唔可以喺 timer 入面先讀 G，
    因為嗰陣玩家可能已經撳咗「再玩一次」，G 換咗做新一局。 */
 var mineRatio=mikeEq>0?G.sim.eq/mikeEq:0;
 setTimeout(function(){drawMC(mc,mineRatio);},50);
 $('again').onclick=function(){AUD.click();OPTS.tags=0;saveOpts();show('title');AUD.startMusic('rookie');};
 $('ng2').onclick=function(){AUD.click();OPTS.tags=1;saveOpts();applyOpts();startGame(G.name);};
 /* 返教學網：跟返 locale 嘅第 6 章位置（台灣版喺 ../zh-TW/ 之下） */
 if($('toSite'))$('toSite').onclick=function(){location.href=CH.CH6[1];};
}
function stat(l,v){return '<div class="stat"><span>'+l+'</span><span class="v">'+v+'</span></div>';}

function drawMC(mc,mine){
 var c=$('mc');if(!c)return;
 var W=c.clientWidth,H=170,dpr=window.devicePixelRatio||1;
 if(!W)return;
 c.width=W*dpr;c.height=H*dpr;
 var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);
 var res=mc.ratios,N=res.length;
 var below=0;for(var i=0;i<N;i++)if(res[i]<mine)below++;
 var pctl=below/N*100;
 var lo=0,hi=Math.max(1.35,res[Math.floor(N*0.985)]);
 var B=42,bins=new Array(B);for(i=0;i<B;i++)bins[i]=0;
 res.forEach(function(r){var b=Math.min(B-1,Math.floor((r-lo)/(hi-lo)*B));if(b>=0)bins[b]++;});
 var mxb=Math.max.apply(null,bins),pad=20;
 bins.forEach(function(v,i){
  var bw=(W-pad*2)/B,bx=pad+i*bw,bh=(H-34)*(v/mxb);
  var ctr=lo+(i+0.5)/B*(hi-lo);
  x.fillStyle=ctr>1?'rgba(79,148,99,.55)':'rgba(192,74,62,.42)';
  x.fillRect(bx,H-24-bh,Math.max(1,bw-1),bh);
 });
 var x1=pad+(1-lo)/(hi-lo)*(W-pad*2);
 x.strokeStyle='rgba(122,158,143,.9)';x.lineWidth=1.4;x.setLineDash([4,3]);
 x.beginPath();x.moveTo(x1,6);x.lineTo(x1,H-24);x.stroke();x.setLineDash([]);
 x.font='9px sans-serif';x.textAlign='center';
 x.fillStyle='rgba(122,158,143,.95)';x.fillText('Mike',x1,H-12);
 var xm=pad+(Math.min(mine,hi)-lo)/(hi-lo)*(W-pad*2);
 x.strokeStyle='#e8e4d9';x.lineWidth=2;
 x.beginPath();x.moveTo(xm,6);x.lineTo(xm,H-24);x.stroke();
 x.fillStyle='#e8e4d9';x.fillText(t('mcYou'),xm,H-12);
 x.textAlign='left';

 $('mcTxt').innerHTML=t('mcTxt',(mc.win*100).toFixed(1),mc.med.toFixed(2),pctl.toFixed(0),
  pctl>85?t('mcHigh'):pctl<15?t('mcLow'):t('mcMid'));
}

/* ---------- 啟動 ---------- */
function startGame(name){
 G=newGame(name);
 show('game');
 AUD.startMusic('rookie');
 nextTurn();
}
function resumeGame(){
 show('game');
 AUD.startMusic(phaseOf(Math.max(1,G.turn)));
 G.turn=Math.max(0,G.turn-1);   // nextTurn() 會加返
 nextTurn();
}

loadOpts();
/* 語言要喺任何嘢畫出嚟之前定 —— applyLocale() 會蓋咗場景／偏誤／結局嘅文字。 */
initLang(OPTS.lang);
applyOpts();
$('titleBg').style.backgroundImage="url('"+uiURL('ui_title_keyart')+"')";
/* 跟語言填返啲有金額／預設名嘅位 */
$('nameIn').value=t('defaultName');
$('tNote').innerHTML=t('titleNote',fmt(START));
$('hNav').textContent=fmt(START);
$('hBen').textContent=fmt(START);
var lk=$('lnkCh6');
if(lk){ if(!HAS_SITE)lk.style.display='none'; else lk.href=CH.CH6[1]; }

/* ---------- 換語言 ----------
   換咗之後成版嘢都要重新蓋一次 overlay，最乾淨嘅做法係 reload。
   打緊機嘅話先自動存檔，再帶住 resume=1 返嚟，接返落去同一個回合。 */
function switchLang(code){
 if(!LANGS[code]||code===LANG)return;
 AUD.click();
 OPTS.lang=code;saveOpts();
 var mid=!!(G&&$('game').classList.contains('on'));
 if(mid)saveGame();
 location.replace(location.pathname+'?lang='+encodeURIComponent(code)+(mid?'&resume=1':''));
}
/* 自動接返落去嗰陣，瀏覽器仲未收過用戶手勢，開唔到音訊。
   等佢第一下撳／撳掣先補開。 */
function armAudioOnce(){
 var go=function(){
  document.removeEventListener('pointerdown',go);document.removeEventListener('keydown',go);
  AUD.init();AUD.resume();AUD.startMusic(phaseOf(Math.max(1,G?G.turn:1)));
 };
 document.addEventListener('pointerdown',go);document.addEventListener('keydown',go);
}

$('startBtn').onclick=function(){
 AUD.init();AUD.resume();AUD.select();
 var nm=($('nameIn').value||t('defaultName')).trim().slice(0,8)||t('defaultName');
 startGame(nm);
};
$('nameIn').addEventListener('keydown',function(e){if(e.key==='Enter')$('startBtn').click();});
$('next').onclick=function(){AUD.click();nextTurn();};
$('rvNext').onclick=function(){AUD.click();$('review').classList.remove('on');nextTurn();};
$('rvSave').onclick=function(){AUD.select();var b=$('rvSave');
 if(saveGame()){b.textContent=t('btnSaved');b.classList.add('ok');}else b.textContent=t('btnSaveFail');};
$('logBtn').onclick=function(){AUD.click();showLog();};
$('logClose').onclick=function(){AUD.click();$('logOvl').classList.remove('on');};
$('setBtn').onclick=function(){AUD.click();applyOpts();$('setOvl').classList.add('on');};
$('setClose').onclick=function(){AUD.click();$('setOvl').classList.remove('on');};
$('setSave').onclick=function(){AUD.select();var b=$('setSave');
 if(G&&saveGame()){b.textContent=t('btnSaved');b.classList.add('ok');}else b.textContent=t('btnSaveFail');};

function bindSeg(id,key,after){
 var seg=$(id);if(!seg)return;
 [].forEach.call(seg.children,function(b){
  b.onclick=function(){OPTS[key]=+b.dataset.v;saveOpts();applyOpts();AUD.click();after&&after();};
 });
}
bindSeg('segSpeed','speed');
bindSeg('segSound','sound',function(){AUD.setOn(OPTS.sound);});
bindSeg('segTags','tags',function(){if(curScen&&!locked)renderOpts(curScen);});
/* 語言唔行 bindSeg —— 佢個值係字串，而且改完要 reload。
   啲掣跟 LANGS 生成，label 用該語言自己嘅寫法（廣東話 / 繁體中文 / English），
   所以加語言唔使改 shell.html。 */
(function(){var seg=$('segLang');if(!seg)return;
 var codes=[DEFAULT_LANG];for(var c in LANGS)if(c!==DEFAULT_LANG)codes.push(c);
 codes.forEach(function(code){
  var b=document.createElement('button');
  b.dataset.v=code;b.textContent=LANGS[code].label||code;
  if(code===LANG)b.classList.add('on');
  b.onclick=function(){switchLang(code);};
  seg.appendChild(b);
 });})();

document.addEventListener('keydown',function(e){
 if($('review').classList.contains('on')){if(e.key==='Enter'||e.key===' ')$('rvNext').click();return;}
 if($('logOvl').classList.contains('on')||$('setOvl').classList.contains('on')){
  if(e.key==='Escape'){$('logOvl').classList.remove('on');$('setOvl').classList.remove('on');}return;
 }
 if(!$('game').classList.contains('on'))return;
 if($('res').classList.contains('on')){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();$('next').click();}return;
 }
 var i='abcde'.indexOf(e.key.toLowerCase());
 if(i>=0){var b=document.querySelectorAll('.opt')[i];if(b&&!b.disabled)b.click();}
});
window.addEventListener('resize',function(){if(G&&$('game').classList.contains('on'))drawChart();});

/* 有存檔先出「繼續」。
   如果係啱啱換完語言返嚟（resume=1），就唔使佢再撳一次，直接接返落去。 */
var WANT_RESUME=/[?&]resume=1/.test(String(location.search));
readSaveRaw().then(function(raw){
 if(!raw)return;
 var o=null;try{o=JSON.parse(raw);}catch(e){}
 if(!o||o.v!==SAVE_VER)return;
 if(WANT_RESUME&&applySave(o)){resumeGame();armAudioOnce();return;}
 $('contWrap').style.display='block';
 $('contInfo').textContent=t('contInfo',o.name||t('defaultName'),o.turn,
  new Date(o.t||Date.now()).toLocaleDateString());
 $('contBtn').onclick=function(){
  AUD.init();AUD.resume();AUD.select();
  if(applySave(o))resumeGame();
  else $('contInfo').textContent=t('contFail');
 };
});
