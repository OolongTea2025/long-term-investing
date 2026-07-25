/* ============================================================
   經濟模型 — the honest version.

   Design rule: every dollar the player loses relative to Mike must be
   traceable to a named mechanism the teaching site actually explains.
   There are NO hidden "ego tax" or "discipline bonus" return modifiers;
   自我同紀律只係敘事變數，唔會直接加減回報。

   Mechanisms, and where the site covers them:
     1. 交易成本 / 產品費用        -> Ch2 費用蠶食
     2. 唔喺市場（擇時、恐慌沽）   -> Ch2 錯過最好嘅日子
     3. 集中持倉（個股中位數效應） -> Ch3 分散 / 99-01 法則
     4. 槓桿（利息 + 強制平倉）    -> Ch7 槓桿
     5. 持續投入同人工增長         -> Ch5 定額定投 / Ch7 人力資本

   數字全部係名義港元。一個回合約等於一季。
   ============================================================ */

var TURNS = 70;
var START = 300000;      // 起步淨值
var CONTRIB0 = 20000;    // 每回合儲到嘅錢（基準）

/* ---------- 時間 ----------
   turn 1-20  -> 第 0-5 年    (每回合 .25 年)
   turn 21-45 -> 第 5-12 年   (每回合 .28 年)
   turn 46-70 -> 第 12-20 年  (每回合 .32 年)
   Explicit, so the HUD and the script can never contradict each other. */
var TURN_YEAR = (function () {
  var a = [0];
  for (var t = 1; t <= TURNS; t++) a[t] = a[t - 1] + (t <= 20 ? 0.25 : t <= 45 ? 0.28 : 0.32);
  return a;
})();
var START_AGE = 30;
function yearAt(t) { return Math.round(TURN_YEAR[Math.max(0, Math.min(TURNS, t))] * 10) / 10; }
function ageAt(t) { return Math.floor(START_AGE + TURN_YEAR[Math.max(0, Math.min(TURNS, t))]); }

/* ---------- 利率（每回合，名義） ---------- */
var CASH_YIELD = 0.005;     // 現金放銀行 2%/年
var MARGIN_RATE = 0.0134;   // 孖展息 5.5%/年
var ROUND_TRIP = 0.0028;    // 一買一賣 0.28%：佣金 + 印花稅 + 價差
var FUND_FEE = 0.0002;      // 廣泛指數 ETF 0.08%/年
var MIKE_FEE = 0.0002;      // Mike 一樣要俾基金費 —— 冇免費午餐
var MAINT = 0.25;           // 孖展維持保證金：自有資金 / 總持倉
var FORCED_SLIP = 0.03;     // 被強制平倉嘅滑點（自己揀走就冇）

/* ---------- 市場：regime-switching，每回合一季 ---------- */
var REG = {
  bull: { mu: 0.032, sd: 0.055, next: { bull: .87, chop: .10, crash: .03 } },
  chop: { mu: 0.004, sd: 0.075, next: { bull: .26, chop: .64, crash: .10 } },
  crash: { mu: -0.105, sd: 0.115, next: { crash: .50, recov: .50 } },
  recov: { mu: 0.058, sd: 0.090, next: { bull: .45, recov: .40, chop: .15 } }
};

function mulberry32(a) {
  var f = function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  f.getState = function () { return a; };
  f.setState = function (v) { a = v | 0; };
  return f;
}
function gauss(rng) {
  var u = 0, v = 0;
  while (!u) u = rng();
  while (!v) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* 一次過生成成條市場路徑，並且記低每一個隨機數。
   咁樣「逐項移除」歸因先至係精確嘅：反事實重播用完全一樣嘅市場，
   兩者嘅差別就只可能係我哋郁咗嗰一樣嘢。 */
function makePath(seed, turns) {
  turns = turns || TURNS;
  var rng = mulberry32(seed), path = [], regime = 'bull';
  for (var t = 0; t < turns; t++) {
    var R = REG[regime];
    path.push({
      r: R.mu + R.sd * gauss(rng),   // 指數回報
      z: gauss(rng),                 // 個股特有衝擊
      uJump: rng(),                  // 會唔會爆單一股票地雷
      mJump: rng(),                  // 爆嘅話有幾深
      regime: regime
    });
    var p = rng(), acc = 0, nx = regime;
    for (var k in R.next) { acc += R.next[k]; if (p < acc) { nx = k; break; } }
    regime = nx;
  }
  return path;
}

/* ---------- 決定紀錄 ----------
   玩家揀完之後，我哋 snapshot 佢當時嘅姿態。
   用 dec[] 重播 path[] 可以完全重現成局遊戲。 */
function blankDecision() {
  return {
    invFrac: 0,   // 淨值入面有幾多成落咗市場 (0..1)
    conc: 0,      // 落咗市場嗰啲錢，有幾多成押喺一注度
    lev: 1,       // 總持倉倍數 (>=1)
    churn: 0,     // 呢個回合自主買賣幾多次
    volMult: 1,   // 嗰注有幾投機
    dca: 0,       // 有冇長期定額計劃
    indexed: 0,   // 落咗市場嗰啲錢係咪廣泛指數基金
    cashOut: 0,   // 一次性現金支出（課程、訂閱、借畀人）
    ig: 0.006     // 嗰個回合嘅人工增長率（事業選擇會郁佢）
  };
}

function newSim(contribRate) {
  return {
    cash: START, invested: 0, eq: START, levPrev: 1,
    contribRate: contribRate || CONTRIB0, contributed: 0, incomeGrowth: 0.006,
    tradeCost: 0, fundFee: 0, spent: 0, forced: 0, marginCost: 0,
    hist: [START], invFracHist: []
  };
}

/* ---------- 一個回合 ----------
   knobs 可以精確咁熄咗其中一個機制，用嚟做歸因。 */
function step(S, dec, p, knobs) {
  knobs = knobs || {};
  var invFrac = knobs.noTiming ? 1 : Math.max(0, Math.min(1, dec.invFrac));
  var conc = knobs.noConc ? 0 : Math.max(0, Math.min(1, dec.conc));
  var lev = knobs.noLev ? 1 : Math.max(1, dec.lev);
  var noCost = !!knobs.noCost;

  /* --- 1. 出糧，儲蓄入袋 --- */
  S.contributed += S.contribRate;
  S.cash += S.contribRate;
  var eq = S.cash + S.invested;

  /* --- 2. 一次性現金支出 --- */
  if (!noCost && dec.cashOut > 0) {
    var spend = Math.min(S.cash, eq * dec.cashOut);
    S.cash -= spend; S.spent += spend; eq -= spend;
  }

  /* --- 3. 調倉去目標姿態，買賣要俾錢 --- */
  var oldExposure = S.invested * S.levPrev;
  var newExposure = eq * invFrac * lev;
  if (!noCost) {
    var traded = Math.abs(newExposure - oldExposure) + Math.max(0, dec.churn) * newExposure;
    var cost = traded * ROUND_TRIP;
    S.tradeCost += cost;
    eq -= cost;
  }
  S.cash = eq * (1 - invFrac);
  S.invested = eq * invFrac;
  S.levPrev = lev;

  /* --- 4. 市場郁 ---
     集中持倉唔係「指數但波幅大啲」。指數嘅回報係由一小撮股票拉起，
     所以單一股票嘅平均數同指數一樣，但中位數低過指數 —— 大部分個股
     跑輸，得幾隻孭起晒成個市。呢個就係第 3 章嘅 99/01 效應，
     所以呢度照字面模擬：個股衝擊係平均值為 0 嘅對數常態，
     佢嘅中位數自然就係負數。 */
  var r = p.r, idio = 0;
  if (conc > 0) {
    /* 波幅封頂：就算你買咗全世界最投機嗰隻嘢，一個季度嘅個股波幅
       都唔應該離譜到令「揀錯一次」等同「一定死」。冇咗呢個上限，
       「大部分時候都醒目」同「次次都癲」嘅結果會一模一樣 ——
       咁個遊戲就變成講「你點做都冇用」，而唔係講機制。 */
    var sd = Math.min(0.20 * dec.volMult * Math.sqrt(conc), 0.42);
    idio = Math.exp(sd * p.z - sd * sd / 2) - 1;
    var pJump = 0.006 * conc * conc * Math.min(dec.volMult, 3);   // 造假、盈警、供股、除牌
    if (p.uJump < pJump) idio = (1 + idio) * (1 - (0.35 + p.mJump * 0.40)) - 1;
  }
  var concRet = (1 + r) * (1 + idio) - 1;
  var rp = (1 - conc) * r + conc * concRet;

  var exposure = S.invested * lev;
  var debt = S.invested * (lev - 1);
  var pnl = exposure * rp;
  var mc = debt * MARGIN_RATE;
  S.marginCost += mc;
  pnl -= mc;
  if (!noCost) {
    var fee = exposure * FUND_FEE * (dec.indexed ? 1 : 0.15);
    S.fundFee += fee;
    pnl -= fee;
  }
  S.invested += pnl;
  S.cash *= (1 + CASH_YIELD);

  /* --- 5. 強制平倉 --- */
  var forced = false;
  if (lev > 1.02) {
    var assets = S.invested * lev;
    if (assets <= 0 || S.invested / assets < MAINT) {
      forced = true; S.forced++;
      S.invested = Math.max(0, S.invested) * (1 - FORCED_SLIP);
      S.levPrev = 1;
      S.wasForced = true;   // engine 會順手幫你解除槓桿同集中 —— 你已經被斬晒
    }
  }
  if (S.invested < 0) { S.cash += S.invested; S.invested = 0; }

  S.eq = Math.max(0, S.cash + S.invested);
  S.hist.push(S.eq);
  S.invFracHist.push(invFrac);

  /* --- 6. 人工增長（第 7 章：人力資本先係後生仔最大嘅資產）---
     每個回合嘅增長率記喺 dec 度，所以反事實重播完全對得返。
     knobs.baseIncome = 「如果你嘅人工由頭到尾都冇特別加過會點」 */
  var g = knobs.baseIncome ? 0.006 : (dec.ig != null ? dec.ig : S.incomeGrowth);
  S.contribRate *= (1 + g);

  return { r: r, rp: rp, forced: forced, eq: S.eq };
}

/* Mike：第一日全部入市，之後每個回合照供，永遠唔郁。 */
function runMike(path, contribRate, turns) {
  var S = newSim(contribRate);
  S.invested = S.cash; S.cash = 0;
  turns = turns == null ? path.length : turns;
  for (var t = 0; t < turns; t++) {
    S.contributed += S.contribRate;
    S.invested += S.contribRate;
    var fee = S.invested * MIKE_FEE;
    S.fundFee += fee;
    S.invested = S.invested * (1 + path[t].r) - fee;
    S.eq = S.invested;
    S.hist.push(S.eq);
    S.contribRate *= (1 + S.incomeGrowth);
  }
  return S;
}

/* 用同一條市場路徑重播，但熄咗其中一個機制。 */
function replay(path, decs, knobs, contribRate) {
  var S = newSim(contribRate);
  for (var t = 0; t < decs.length; t++) step(S, decs[t], path[t], knobs);
  return S;
}
