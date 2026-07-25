/* 真係試玩幾千局，用嚟驗證場景數值調得啱唔啱。
   用法：node build.mjs && node test.mjs                              */
import * as W from './src/game.gen.mjs';
import { readFileSync } from 'fs';

/* bias.js 用咗 location（瀏覽器嘢），所以唔 import，直接抽佢啲 key 出嚟核對 */
const BIAS_SRC = readFileSync(new URL('./src/bias.js', import.meta.url), 'utf8');
const BIAS_KEYS = new Set(
  (BIAS_SRC.split('var BIAS = {')[1] || '').split('};')[0]
    .split('\n').map(l => (l.match(/^\s*([a-zA-Z]+)\s*:/) || [])[1]).filter(Boolean)
);

const N = +(process.argv[2] || 1500);
const q = (a, p) => a[Math.min(a.length - 1, Math.floor(a.length * p))];
const pct = v => (v * 100).toFixed(1) + '%';
const pad = (s, n) => { s = String(s); let w = 0; for (const c of s) w += /[一-鿿（）]/.test(c) ? 2 : 1; return s + ' '.repeat(Math.max(0, n - w)); };

/* ---- 選項策略 ---- */
const mkMix = (pBias) => (opts) => {
  const b = opts.filter(o => o.b), r = opts.filter(o => !o.b);
  if (b.length && (Math.random() < pBias || !r.length)) return b[Math.floor(Math.random() * b.length)];
  return r[Math.floor(Math.random() * r.length)];
};
const PICKERS = {
  /* 目標玩法：非偏誤選項之中，優先揀「定額 + 指數 + 唔郁 + 顧住份工」嗰啲。
     呢個應該打成平手甚至輕微跑贏 Mike —— 如果做唔到，就係場景數值調錯。 */
  '最佳玩法': (opts) => {
    const r = opts.filter(o => !o.b); if (!r.length) return opts[0];
    const score = o => {
      const d = o.d || {}; let s = 0;
      if (d.dca) s += 6; if (d.indexed) s += 5 * d.indexed;
      s += (d.income || 0) * 900;
      s -= (d.churn || 0) * 1.5; s -= (d.conc || 0) * 4; s -= (d.cashOut || 0) * 12;
      if (d.churnCap != null) s += 2;
      if (d.inv != null && d.inv < 0.5) s -= 5;
      s += (d.disc || 0) / 60;
      return s;
    };
    return r.slice().sort((a, b) => score(b) - score(a))[0];
  },
  '偏誤三成': mkMix(0.3),
  '偏誤五成': mkMix(0.5),
  '全部揀理性選項': (opts) => { const r = opts.filter(o => !o.b); return r.length ? r[0] : opts[0]; },
  '全部揀偏誤選項': (opts) => { const b = opts.filter(o => o.b); return b.length ? b[0] : opts[0]; },
  '隨機亂揀': (opts) => opts[Math.floor(Math.random() * opts.length)],
  /* 最貼近真人：多數揀偏誤，但唔係次次 */
  '典型玩家（7成偏誤）': (opts) => {
    const b = opts.filter(o => o.b), r = opts.filter(o => !o.b);
    if (b.length && (Math.random() < 0.7 || !r.length)) return b[Math.floor(Math.random() * b.length)];
    return r[Math.floor(Math.random() * r.length)];
  },
  /* 專門測「反面教材」：任何時候有得沽就沽，有得借就借 */
  '最自毀': (opts) => {
    const score = o => {
      const d = o.d || {}; let s = 0;
      s += (d.conc || 0) * 3 + (d.lev != null ? d.lev : 0) * 2 + (d.vol || 0) + (d.churn || 0);
      s += (d.ego || 0) / 20 - (d.disc || 0) / 20;
      return s;
    };
    return opts.slice().sort((a, b) => score(b) - score(a))[0];
  }
};

function play(pick, seed) {
  const G = W.newGame('test', seed);
  const ALL = W.SCEN_ROOKIE.concat(W.SCEN_MID, W.SCEN_VET);
  while (G.turn < W.TURNS) {
    if (W.isRuined(G)) { G.ruinTurn = G.turn; break; }
    G.turn++;
    W.drift(G);
    const sc = ALL[G.turn - 1];
    W.commitChoice(G, pick(W.optionsFor(G, sc)), sc);
  }
  G.mike = { eq: W.mikeAt(G, G.decs.length) };
  return G;
}

console.log(`=== 試玩 ${N} 局 × ${Object.keys(PICKERS).length} 種玩法 ===\n`);
console.log(pad('玩法', 22) + pad('跑贏Mike', 10) + pad('中位比率', 10) +
            pad('中位終值', 14) + pad('爆倉率', 9) + pad('中位成本', 12) + '中位偏誤數');

const store = {};
for (const [name, pick] of Object.entries(PICKERS)) {
  const ratios = [], navs = [], costs = [], biases = [], outs = [];
  let ruin = 0;
  for (let i = 0; i < N; i++) {
    const G = play(pick, 400000 + i);
    ratios.push(G.mike.eq > 0 ? G.sim.eq / G.mike.eq : 0);
    navs.push(G.sim.eq);
    costs.push(G.sim.tradeCost + G.sim.fundFee + G.sim.spent + G.sim.marginCost);
    biases.push(G.biasLog.length);
    outs.push(G.sim.invFracHist.filter(v => v < 0.5).length);
    if (G.ruinTurn) ruin++;
  }
  [ratios, navs, costs, biases, outs].forEach(a => a.sort((x, y) => x - y));
  store[name] = { ratios, ruin: ruin / N };
  console.log(
    pad(name, 22) +
    pad(pct(ratios.filter(r => r > 1).length / N), 10) +
    pad(q(ratios, .5).toFixed(2), 10) +
    pad('$' + Math.round(q(navs, .5)).toLocaleString(), 14) +
    pad(pct(ruin / N), 9) +
    pad('$' + Math.round(q(costs, .5)).toLocaleString(), 12) +
    q(biases, .5));
}

/* ---- 結局分佈（典型玩家） ---- */
console.log('\n=== 結局分佈 ===');
for (const label of ['最佳玩法', '偏誤三成', '偏誤五成', '典型玩家（7成偏誤）', '全部揀偏誤選項', '最自毀']) {
  const counts = {};
  const M = Math.min(N, 300);   // judge() 要跑 Monte Carlo，慢啲
  for (let i = 0; i < M; i++) {
    const G = play(PICKERS[label], 600000 + i);
    const mc = W.monteCarlo(G.decs, 60);
    const k = W.judge(G, mc.win);
    counts[k] = (counts[k] || 0) + 1;
  }
  console.log(pad(label, 22) + Object.entries(counts).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${W.ENDING_INFO[k].n} ${(v / M * 100).toFixed(0)}%`).join('  ·  '));
}

/* ---- 歸因 sanity check ---- */
console.log('\n=== 歸因（典型玩家，300 局中位數） ===');
{
  const keys = ['cost', 'timing', 'conc', 'lev', 'income'];
  const label = { cost: '交易成本', timing: '唔喺市場', conc: '集中持倉', lev: '槓桿', income: '你嘅人工' };
  const acc = {}; keys.forEach(k => acc[k] = []);
  const gaps = [];
  for (let i = 0; i < 300; i++) {
    const G = play(PICKERS['典型玩家（7成偏誤）'], 700000 + i);
    const A = W.attribute(G);
    gaps.push(A.gap);
    keys.forEach(k => acc[k].push(k === 'income' ? -A[k] : A[k]));
  }
  gaps.sort((a, b) => a - b);
  const f = v => (v < 0 ? '-$' : '+$') + Math.abs(Math.round(v)).toLocaleString();
  console.log(pad('中位差距 vs Mike', 20) + f(q(gaps, .5)));
  keys.forEach(k => {
    acc[k].sort((a, b) => a - b);
    console.log(pad(label[k], 20) + pad(f(q(acc[k], .5)), 14) +
      `[p25 ${f(q(acc[k], .25))}  p75 ${f(q(acc[k], .75))}]`);
  });
  console.log('\n（正數 = 熄咗佢你會多錢，即係佢係一個代價。人工嗰行已經反轉，正數 = 幫到你。）');
}

/* ---- 完整性檢查 ---- */
console.log('\n=== 完整性檢查 ===');
const ALL = W.SCEN_ROOKIE.concat(W.SCEN_MID, W.SCEN_VET);
let bad = [];
if (ALL.length !== 70) bad.push(`場景數目 ${ALL.length}，應該係 70`);
ALL.forEach((s, i) => {
  if (s.id !== i + 1) bad.push(`第 ${i + 1} 個場景 id=${s.id}`);
  if (!s.opts || s.opts.length !== 4) bad.push(`場景 ${s.id} 有 ${s.opts ? s.opts.length : 0} 個選項`);
  if (!s.opts.some(o => !o.b)) bad.push(`場景 ${s.id} 冇一個非偏誤選項`);
  s.opts.forEach(o => {
    if (!o.r) bad.push(`場景 ${s.id}「${o.t}」冇結果文字`);
    if (o.b && !(BIAS_KEYS.has(o.b))) bad.push(`場景 ${s.id} 用咗未定義嘅偏誤 ${o.b}`);
  });
});
console.log(bad.length ? bad.join('\n') : '70 個場景 · 280 個選項 · 全部有結果文字 · 每場都有出路 ✓');
