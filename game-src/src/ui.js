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
function fmt(n){return '$'+Math.round(n).toLocaleString('en-US');}
function fmtSigned(n){return (n<0?'-$':'+$')+Math.abs(Math.round(n)).toLocaleString('en-US');}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

var G=null, typing=null, curScen=null, locked=false;
var OPTS={speed:17,sound:1,tags:0};

/* ---------- 設定 ---------- */
var OPT_KEY='wulongcha:opts';
function loadOpts(){
 try{var o=JSON.parse(localStorage.getItem(OPT_KEY));if(o)for(var k in o)OPTS[k]=o[k];}catch(e){}
 if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches&&OPTS.speed>7)OPTS.speed=0;
}
function saveOpts(){try{localStorage.setItem(OPT_KEY,JSON.stringify(OPTS));}catch(e){}}
function syncSeg(id,val){
 var seg=$(id);if(!seg)return;
 [].forEach.call(seg.children,function(b){b.classList.toggle('on',+b.dataset.v===+val);});
}
function applyOpts(){
 syncSeg('segSpeed',OPTS.speed);syncSeg('segSound',OPTS.sound);syncSeg('segTags',OPTS.tags);
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
 $('tWhen').textContent='第 '+Math.round(yearAt(G.turn))+' 年 · '+ageAt(G.turn)+'歲';
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
  why+=(why?'<br>':'')+'<span class="tag">強制平倉</span> 你嘅自有資金跌穿咗維持水平，券商幫你斬咗倉。'+
   '你唔係揀走 —— 你係被人趕走，而且要俾滑點。';
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
  x.fillText('淺色 = 你唔喺市場嗰啲回合',8,H-7);
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
 20:{eyebrow:'PHASE I · REVIEW',title:'新手期結算'},
 45:{eyebrow:'PHASE II · REVIEW',title:'中手期結算'}
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
 $('rvTitle').textContent=M0.title;
 var pc=function(v){return (v>=0?'+':'')+(v*100).toFixed(1)+'%';};
 var cls=function(v){return v>=0?'up':'dn';};
 $('rvStats').innerHTML=
  kv('你嘅回報','<span class="'+cls(d.mine)+'">'+pc(d.mine)+'</span>')+
  kv('Mike 回報','<span class="'+cls(d.bench)+'">'+pc(d.bench)+'</span>')+
  kv('你嘅淨值',fmt(G.sim.hist[turn]))+
  kv('Mike 淨值',fmt(G.mikeHist[turn]))+
  kv('最大回撤','<span class="dn">'+(d.dd*100).toFixed(1)+'%</span>')+
  kv('情緒決定',d.biases+' / '+(d.to-d.from)+' 次')+
  kv('累計買賣成本',fmt(G.sim.tradeCost))+
  kv('唔喺市場嘅回合',d.out+' 個');
 drawReviewChart(d);
 var gap=d.mine-d.bench,v;
 if(gap>0.05)v='呢個階段你跑贏咗 Mike。要留意嘅係：短期跑贏可以純粹係波幅，唔一定係技術。你係咪承受咗更大風險換返嚟？';
 else if(gap>-0.03)v='你同 Mike 差唔多。但你做咗好多決定，佢乜都冇做。同樣結果之下，你付出咗時間、精神同手續費。';
 else if(gap>-0.15)v='你落後咗 Mike。差距睇落唔算大，但呢個就係「溫水煮蛙」嘅開始 —— 每個階段輸少少，複利落去就係一層樓。';
 else v='你明顯落後。而家係最好嘅檢討時機：你嘅損失係嚟自市場，定係嚟自你自己嘅決定？';
 $('rvVerdict').textContent=v;
 $('rvBias').innerHTML=d.top.length
  ? '呢個階段你最常觸發嘅偏誤：<br>'+d.top.map(function(p){
     return '· <b style="color:var(--gold)">'+esc(BIAS[p[0]][0])+'</b> ×'+p[1]+' — '+esc(BIAS[p[0]][1]);}).join('<br>')
  : '呢個階段你冇觸發過任何認知偏誤。';
 var sv=$('rvSave');sv.textContent='儲存進度';sv.classList.remove('ok');
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
 if(!G.choices.length)h='<div style="color:var(--dim);font-size:12.5px">仲未有決定。</div>';
 for(var i=G.choices.length-1;i>=0;i--){
  var c=G.choices[i];
  h+='<div class="logrow"><div class="t">第 '+c.turn+' 回合 · 第 '+Math.round(yearAt(c.turn))+' 年</div>'+
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
 $('eTag').textContent='第 '+endTurn+' 回合 · '+Math.round(yearAt(endTurn))+' 年 · '+
  G.name+' · 最終 '+fmt(G.sim.eq);
 $('eDesc').textContent=inf.d;

 var A=attribute(G);
 var h='';

 /* --- 對照 --- */
 h+='<div class="sec">最終對照</div>';
 h+=stat('你（'+esc(G.name)+'）',fmt(G.sim.eq));
 h+=stat('Mike（指數，乜都冇做）',fmt(mikeEq));
 var gapPc=mikeEq>0?(G.sim.eq/mikeEq-1)*100:0;
 h+=stat('差距','<span class="'+(gapPc>=0?'up':'dn')+'">'+(gapPc>=0?'+':'')+gapPc.toFixed(1)+'%</span>');
 h+=stat('相差金額','<span class="'+(gapPc>=0?'up':'dn')+'">'+fmt(Math.abs(A.gap))+'</span>');
 var L=levelOf(G.sim.eq),LM=levelOf(mikeEq);
 h+=stat('你嘅財富階梯',L[0]+'　<span style="color:var(--dim);font-size:11px">'+L[1]+'</span>');
 h+=stat('Mike 嘅財富階梯',LM[0]+'　<span style="color:var(--dim);font-size:11px">'+LM[1]+'</span>');
 h+='<div class="foot">二十年入面你總共投入咗 '+fmt(START+G.sim.contributed)+
    '（起步 '+fmt(START)+' + 儲蓄 '+fmt(G.sim.contributed)+'）。'+
    (HAS_SITE?'階梯分級同教學網一致，見 '+chLink('CH13','退休篇')+'。':'')+'</div>';

 /* --- 幸運兒 / 真 Alpha 揭盅 --- */
 if(kind==='LUCKY_FOOL'){
  h+='<div class="note"><b>你贏咗，但唔係因為你叻。</b><br><br>'+
   '我哋攞你實際做過嘅 '+G.decs.length+' 個決定，原封不動咁擺去 400 個唔同嘅市場歷史入面重跑。'+
   '同一套行為，唔同嘅市場：<b>只有 '+(mc.win*100).toFixed(0)+'% 嘅時空你會跑贏 Mike</b>，'+
   '中位數係佢嘅 '+mc.med.toFixed(2)+' 倍。<br><br>'+
   '你今次贏咗，係因為你今次抽中咗嗰條路。你嘅做法本身冇優勢。</div>';
 }else if(kind==='TRUE_ALPHA'){
  h+='<div class="note good"><b>而且唔係彩數。</b><br><br>'+
   '同一套行為擺去 400 個唔同市場，<b>'+(mc.win*100).toFixed(0)+'% 嘅時空你都跑贏</b>。'+
   '呢個唔係運氣，係結構性優勢。<br><br>'+
   '但你要睇清楚你贏喺邊 —— 睇返下面「你嘅人工」嗰一行。</div>';
 }else if(kind==='WU_WEI'){
  h+='<div class="note good"><b>你做到咗最難嗰樣嘢。</b><br><br>'+
   '你嘅結果同 Mike 幾乎一模一樣。呢個唔係打和，呢個就係目標本身 —— '+
   '因為 Mike 嘅回報就係市場嘅回報，而市場嘅回報，已經係絕大部分人攞唔到嘅嘢。</div>';
 }

 /* --- 歸因（重點） --- */
 h+='<div class="sec">差距係邊度嚟嘅</div>';
 h+='<div class="foot" style="margin:-4px 0 12px">'+
  '我哋攞返你今次玩嗰條一模一樣嘅市場路徑，同你一模一樣嘅七十個決定，'+
  '每次淨係熄咗其中一樣嘢再重跑一次。分別就係嗰樣嘢嘅代價。</div>';
 var items=[
  ['交易成本',A.cost,'買賣佣金、印花稅、價差、基金費用。','CH2'],
  ['唔喺市場',A.timing,'你沽咗貨、或者留住現金冇入場嗰啲回合。','CH2'],
  ['集中持倉',A.conc,'押重注落單一注碼，包括爆地雷嘅風險。','CH3'],
  ['槓桿',A.lev,'借錢嘅利息，加上被強制平倉嘅損失。','CH7'],
  ['你嘅人工',-A.income,'事業選擇令你儲蓄增長快咗（或者慢咗）。','CH7']
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
 h+='<div class="note plain">呢五個數字加埋唔會啱啱好等於總差距。'+
  '因為佢哋互相影響 —— 舉個例，如果你冇用槓桿，你嗰次強制平倉就唔會發生，'+
  '咁你被逼賣出嘅成本亦都會消失。<br><br>'+
  '四樣一齊熄嘅話：你會有 <b>'+fmt(A.you+A.all)+'</b>，'+
  '即係比而家多 '+fmt(Math.abs(A.all))+'。<br><br>'+
  '<b>值得留意嘅係邊個數字最穩定。</b>成本係唯一一樣一定發生、而且完全喺你控制範圍之內嘅嘢。'+
  '集中同擇時係賭博 —— 有時幫到你，有時害死你，但長期期望值係負。</div>';

 /* --- 成本明細 --- */
 h+='<div class="sec">成本明細</div>';
 h+=stat('買賣成本（佣金／印花稅／價差）',fmt(G.sim.tradeCost));
 h+=stat('基金／產品費用',fmt(G.sim.fundFee));
 h+=stat('孖展利息',fmt(G.sim.marginCost));
 h+=stat('課程、訂閱、借出去嘅錢',fmt(G.sim.spent));
 h+=stat('強制平倉次數',(G.sim.forced||0)+' 次');
 var outTurns=G.sim.invFracHist.filter(function(v){return v<0.5;}).length;
 h+=stat('唔喺市場嘅回合',outTurns+' / '+G.decs.length+' 個');
 h+=stat('情緒驅動嘅決定',G.biasLog.length+' / '+G.decs.length+' 次');

 /* --- Monte Carlo --- */
 h+='<div class="sec">同樣嘅行為，四百個平行時空</div>';
 h+='<canvas class="cv" id="mc" height="170"></canvas>';
 h+='<div class="note plain" id="mcTxt"></div>';

 /* --- 偏誤 + 返去邊一課 --- */
 var ent=Object.keys(G.biasCount).map(function(k){return [k,G.biasCount[k]];})
  .sort(function(a,b){return b[1]-a[1];});
 h+='<div class="sec">你嘅偏誤，同要補返邊一課</div>';
 if(!ent.length){
  h+='<div class="e-desc" style="font-size:13.5px">你冇觸發過任何認知偏誤。呢個非常罕見。</div>';
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
 h+='<div class="sec">關鍵決定回顧</div>';
 var key=G.choices.filter(function(c){return c.bias;}).slice(0,8);
 if(!key.length)h+='<div class="e-desc" style="font-size:13.5px">冇偏誤決定可以回顧。</div>';
 key.forEach(function(c){
  var sc=ALL_SCEN[c.scen-1],alt=sc?sc.opts.filter(function(o){return !o.b;})[0]:null;
  h+='<div class="logrow"><div class="t">第 '+c.turn+' 回合 · 第 '+Math.round(yearAt(c.turn))+' 年</div>'+
   '<div>你揀咗：'+esc(c.opt)+'</div>'+
   '<div class="b">'+esc(BIAS[c.bias][0])+' — '+esc(BIAS[c.bias][1])+'</div>'+
   (alt?'<div class="t" style="margin-top:4px">另一個選擇：'+esc(alt.t)+'</div>':'')+'</div>';
 });

 /* --- Mike --- */
 h+='<div class="sec">Mike 嘅二十年</div>';
 h+='<img class="mikeimg" src="'+uiURL('ui_mike_four_seasons')+'" alt="">';
 h+='<div class="foot">佢做咗大約五十次交易，全部係月供。佢冇睇過盤，冇追過消息，冇同人爭論過。'+
    '佢嘅回報，就係市場本身嘅回報。<br><br>'+
    '呢個遊戲唔係想話你聽「你贏唔到」。係想話你聽：<b>你唔使贏。</b>'+
    '攞到市場本身嘅回報，已經打贏咗絕大部分落場嘅人 —— 而攞到佢，唔需要技術，'+
    '只需要你喺二十年入面，每一次心郁郁嗰陣，都揀唔郁。</div>';

 /* --- 返教學網 --- */
 if(HAS_SITE){
  h+='<div class="sec">跟住去邊</div>';
  h+='<div class="foot" style="font-size:12.5px;line-height:2.1">'+
   '· '+chLink('CH6','點樣對付上面嗰啲偏誤')+'<br>'+
   '· '+chLink('CH2','費用點樣蠶食你嘅回報')+'<br>'+
   '· '+chLink('CH3','點解分散唔係「買多幾隻」')+'<br>'+
   '· '+chLink('CH5','實際上第一個組合應該點砌')+'<br>'+
   '· '+chLink('APA','點樣分辨真定假嘅投資主張')+'</div>';
 }

 h+='<div class="endbtns">'+
  '<button class="btn sm" id="again">再玩一次</button>'+
  '<button class="btn sm ghost" id="ng2">開住偏誤標籤再玩</button>'+
  (HAS_SITE?'<button class="btn sm ghost" id="toSite">返教學網</button>':'')+
  '</div>';
 h+='<div class="foot">開住偏誤標籤，每個選項旁邊會寫明佢對應邊種偏誤。'+
  '你會發現：就算你明知係偏誤，你依然想揀。</div>';

 $('eExtra').innerHTML=h;
 /* 即刻鎖定個比率再傳入去 —— 唔可以喺 timer 入面先讀 G，
    因為嗰陣玩家可能已經撳咗「再玩一次」，G 換咗做新一局。 */
 var mineRatio=mikeEq>0?G.sim.eq/mikeEq:0;
 setTimeout(function(){drawMC(mc,mineRatio);},50);
 $('again').onclick=function(){AUD.click();OPTS.tags=0;saveOpts();show('title');AUD.startMusic('rookie');};
 $('ng2').onclick=function(){AUD.click();OPTS.tags=1;saveOpts();applyOpts();startGame(G.name);};
 if($('toSite'))$('toSite').onclick=function(){location.href='../新手篇/06-行為偏誤點應對/';};
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
 x.fillStyle='#e8e4d9';x.fillText('你今次',xm,H-12);
 x.textAlign='left';

 $('mcTxt').innerHTML=
  '每一條柱 = 一個平行時空。橫軸係你最後有 Mike 嘅幾多倍。<br><br>'+
  '· 跑贏 Mike 嘅時空：<b>'+(mc.win*100).toFixed(1)+'%</b><br>'+
  '· 中位數：Mike 嘅 <b>'+mc.med.toFixed(2)+'</b> 倍<br>'+
  '· 你今次嘅結果排喺第 <b>'+pctl.toFixed(0)+'</b> 百分位<br><br>'+
  (pctl>85?'今次嘅行情對你嘅做法特別友好。同一套嘢，大部分時空結果差好遠。'
   :pctl<15?'今次嘅行情對你嘅做法特別唔友好。不過就算喺最好嘅時空，呢套做法嘅期望值一樣有限。'
   :'你今次嘅結果，喺你自己做法嘅正常範圍之內。');
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

loadOpts();applyOpts();
$('titleBg').style.backgroundImage="url('"+uiURL('ui_title_keyart')+"')";
if(!HAS_SITE){var lk=$('lnkCh6');if(lk)lk.style.display='none';}

$('startBtn').onclick=function(){
 AUD.init();AUD.resume();AUD.select();
 var nm=($('nameIn').value||'烏龍茶').trim().slice(0,8)||'烏龍茶';
 startGame(nm);
};
$('nameIn').addEventListener('keydown',function(e){if(e.key==='Enter')$('startBtn').click();});
$('next').onclick=function(){AUD.click();nextTurn();};
$('rvNext').onclick=function(){AUD.click();$('review').classList.remove('on');nextTurn();};
$('rvSave').onclick=function(){AUD.select();var b=$('rvSave');
 if(saveGame()){b.textContent='已儲存 ✓';b.classList.add('ok');}else b.textContent='儲存失敗';};
$('logBtn').onclick=function(){AUD.click();showLog();};
$('logClose').onclick=function(){AUD.click();$('logOvl').classList.remove('on');};
$('setBtn').onclick=function(){AUD.click();applyOpts();$('setOvl').classList.add('on');};
$('setClose').onclick=function(){AUD.click();$('setOvl').classList.remove('on');};
$('setSave').onclick=function(){AUD.select();var b=$('setSave');
 if(G&&saveGame()){b.textContent='已儲存 ✓';b.classList.add('ok');}else b.textContent='儲存失敗';};

function bindSeg(id,key,after){
 var seg=$(id);if(!seg)return;
 [].forEach.call(seg.children,function(b){
  b.onclick=function(){OPTS[key]=+b.dataset.v;saveOpts();applyOpts();AUD.click();after&&after();};
 });
}
bindSeg('segSpeed','speed');
bindSeg('segSound','sound',function(){AUD.setOn(OPTS.sound);});
bindSeg('segTags','tags',function(){if(curScen&&!locked)renderOpts(curScen);});

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

/* 有存檔先出「繼續」 */
readSaveRaw().then(function(raw){
 if(!raw)return;
 var o=null;try{o=JSON.parse(raw);}catch(e){}
 if(!o||o.v!==SAVE_VER)return;
 $('contWrap').style.display='block';
 $('contInfo').textContent=(o.name||'烏龍茶')+' · 第 '+o.turn+' 回合 · '+
  new Date(o.t||Date.now()).toLocaleDateString();
 $('contBtn').onclick=function(){
  AUD.init();AUD.resume();AUD.select();
  if(applySave(o))resumeGame();
  else $('contInfo').textContent='讀取失敗，請開新遊戲';
 };
});
