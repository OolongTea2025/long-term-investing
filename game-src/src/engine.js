/* ============================================================
   純遊戲邏輯（完全冇掂 DOM）
   分開一份，係為咗可以喺 Node 度真係試玩幾千局嚟驗證數值，
   而唔係靠肉眼估。見 test.mjs。
   ============================================================ */

function newGame(name, seed) {
  seed = seed == null ? Math.floor(Math.random() * 1e9) : seed;
  var path = makePath(seed);
  return {
    seed: seed, name: name || '烏龍茶', turn: 0,
    path: path, mikeHist: runMike(path).hist,
    sim: newSim(), decs: [],
    posture: { invFrac: 0, conc: 0, lev: 1, volMult: 1, dca: 0, indexed: 0, ig: 0.006, churnCap: 99 },
    ego: 0, disc: 0, health: 0, commit: 0,
    biasCount: {}, biasLog: [], choices: [], reviewed: {},
    idleTurns: 0, ruinTurn: 0, ended: null
  };
}
function mikeAt(G, t) { return G.mikeHist[Math.min(t, G.mikeHist.length - 1)]; }
function phaseOf(t) { return t <= 20 ? 'rookie' : t <= 45 ? 'mid' : 'vet'; }
var PHASE_LABEL = { rookie: '新手期', mid: '中手期', vet: '老手期' };

/* 每回合開始，姿態自然演變。
   呢啲全部係真實嘅慣性，唔係暗中加減分：
   · 集中持倉黐身 —— 冇人會靜靜雞自己分散返
   · 槓桿同投機性會慢慢褪
   · 有長期定額計劃，你嘅儲蓄會自動流入市場（呢個就係計劃嘅意義） */
function drift(G) {
  var P = G.posture;
  /* 被強制平倉之後你冇得再揀 —— 券商幫你斬晒，槓桿同集中一次過清零。 */
  if (G.sim.wasForced) { G.sim.wasForced = false; P.lev = 1; P.conc *= 0.35; P.volMult = 1; }
  P.conc *= 0.92;
  P.lev = 1 + (P.lev - 1) * 0.96;
  P.volMult = 1 + (P.volMult - 1) * 0.85;
  if (P.dca) P.invFrac = Math.max(0, Math.min(1, P.invFrac + (1 - P.invFrac) * 0.08));
  if (P.invFrac < 0.75) G.idleTurns++; else G.idleTurns = 0;
}

/* 將一個選項嘅 d{} 套落姿態上面，然後 snapshot 出一個 decision。 */
function applyChoice(G, d, opt, scen) {
  var P = G.posture, cl = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  G.ego = cl(G.ego + (d.ego || 0), 0, 400);
  G.disc = cl(G.disc + (d.disc || 0), -300, 1400);
  G.health += (d.health || 0);
  G.commit = Math.max(0, G.commit + (d.commit || 0));
  if (d.inv != null) P.invFrac = cl(d.inv, 0, 1);
  if (d.dInv) P.invFrac = cl(P.invFrac + d.dInv, 0, 1);
  /* 集中度用遞減方式加：你已經好集中嘅時候，再「加注」實際上加得有限，
     而且冇人會 100% 押晒喺一注度（總會有啲現金、強積金、其他嘢）。
     用直加嘅話，玩幾個回合就會釘死喺 100%，跟住「醒目啲」同「癲晒」
     嘅結果就冇分別 —— 呢個唔係真實，亦都教唔到嘢。 */
  if (d.conc > 0) P.conc = cl(P.conc + d.conc * (1 - P.conc / 0.85), 0, 0.85);
  else if (d.conc < 0) P.conc = cl(P.conc + d.conc, 0, 0.85);
  if (d.lev != null) P.lev = Math.max(1, d.lev);
  if (d.dLev) P.lev = Math.max(1, P.lev + d.dLev);
  if (d.vol) P.volMult = Math.min(4, Math.max(P.volMult, d.vol));
  if (d.dca) P.dca = 1;
  if (d.indexed != null) {
    P.indexed = d.indexed;
    P.conc = P.conc * (1 - cl(d.indexed, 0, 1));   // 廣泛指數基金按定義唔係集中持倉
  }
  if (d.churnCap != null) P.churnCap = d.churnCap;
  if (d.income) P.ig = cl(P.ig + d.income, -0.004, 0.02);

  var churn = d.churn ? Math.min(d.churn, P.churnCap)
                      : Math.min(P.indexed >= 0.9 ? 0.01 : 0.04, P.churnCap);

  var dec = blankDecision();
  dec.invFrac = P.invFrac; dec.conc = P.conc; dec.lev = P.lev;
  dec.churn = churn; dec.volMult = P.volMult; dec.dca = P.dca;
  dec.indexed = P.indexed >= 0.5 ? 1 : 0; dec.cashOut = d.cashOut || 0; dec.ig = P.ig;
  G.decs.push(dec);

  if (opt && opt.b) {
    G.biasCount[opt.b] = (G.biasCount[opt.b] || 0) + 1;
    G.biasLog.push({ turn: G.turn, b: opt.b, scen: scen ? scen.id : 0 });
  }
  if (opt) G.choices.push({ turn: G.turn, scen: scen ? scen.id : 0, opt: opt.t, bias: opt.b || null });
  return dec;
}

/* 玩家揸咗好耐現金嗰陣，額外畀返一個返場選項。
   遊戲一定要有條路返場，否則一次恐慌沽貨就等於玩完 —— 咁就唔係教緊嘢，係懲罰。
   你隔咗幾耐先肯撳呢粒掣，本身就係「擇時代價」嘅量度。 */
function extraOption(G) {
  if (G.posture.invFrac >= 0.75 || G.idleTurns < 2) return null;
  return {
    t: '（將閒置現金投返落市場）', b: null, extra: true,
    d: { inv: 0.95, churn: 0.3, disc: 6 },
    r: '你將擺喺一邊嘅現金投返落去。',
    why: '你今次喺場外坐咗 ' + G.idleTurns + ' 個回合。呢段時間市場升定跌，你都冇份。'
  };
}
function optionsFor(G, scen) {
  var list = scen.opts.slice(), ex = extraOption(G);
  if (ex) list.push(ex);
  return list;
}

/* 一個回合嘅純邏輯部分：套用選擇 -> 跑經濟 -> 回結果。 */
function commitChoice(G, opt, scen) {
  applyChoice(G, opt.d || {}, opt, scen);
  return step(G.sim, G.decs[G.decs.length - 1], G.path[G.turn - 1]);
}
function isRuined(G) { return G.sim.eq <= (START + G.sim.contributed) * 0.06; }
