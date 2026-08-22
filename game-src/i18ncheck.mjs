/* 譯文覆蓋率 + 一致性檢查。
   用法：node build.mjs && node i18ncheck.mjs [語言碼…]

   點解要有呢個：i18n 係「overlay」設計 —— 譯漏一句唔會爆，
   只會靜靜雞跌返廣東話。咁樣好處係永遠唔會爛版，壞處係
   *冇人會發現譯漏咗*。呢個 script 就係負責發現。

   檢查五樣嘢：
     1. 覆蓋率   —— 每個 scen / bias / ending / ui key 有冇譯
     2. 佔位符   —— {0} {1} … 一個都唔可以走失或者多咗
     3. HTML tag —— <b> <br> 之類要對得返數
     4. 多餘 key —— 譯咗一個原文冇嘅 key = 打錯字，永遠唔會生效
     5. 語言純度 —— zh-TW 唔可以有廣東話殘留；en 唔可以有漢字

   shell.html 嘅 data-t attribute 亦都會同 zh-HK 嘅 ui{} 對一次數。 */
import * as W from './src/game.gen.mjs';
import { readFileSync } from 'fs';

const BASE = W.DEFAULT_LANG;
const ALL_SCEN = W.SCEN_ROOKIE.concat(W.SCEN_MID, W.SCEN_VET);
const SRC_UI = (W.LANGS[BASE] || {}).ui || {};

const errs = [];
const warns = [];
const E = m => errs.push(m);
const A = m => warns.push(m);

/* ---------- 通用比對 ---------- */
const holes = s => (String(s).match(/\{\d+\}/g) || []).sort().join(',');
const tags = s => (String(s).match(/<\/?[a-zA-Z][^>]*>/g) || [])
  .map(t => t.toLowerCase().replace(/\s+[^>]*>/, '>')).sort().join(',');

/* 一句譯文同原文之間，凡係「機器讀」嗰部分都要一模一樣。 */
function cmp(where, src, dst) {
  if (dst == null) return;
  if (holes(src) !== holes(dst))
    E(`${where}：佔位符唔對　原文 [${holes(src) || '冇'}] → 譯文 [${holes(dst) || '冇'}]`);
  if (tags(src) !== tags(dst))
    E(`${where}：HTML tag 唔對　原文 [${tags(src) || '冇'}] → 譯文 [${tags(dst) || '冇'}]`);
}

/* ---------- 語言純度 ----------
   廣東話功能詞：喺 zh-TW 譯文入面出現 = 譯漏咗嗰一句。
   同網站嗰個 leakcheck.py 同一套思路，但呢度係跑 string value，唔係跑檔案。 */
const CANTO = ['嘅', '嗰', '啲', '咗', '喺', '唔', '乜', '咁', '嘢', '哋', '睇', '俾',
  '畀', '冇', '嚟', '返嚟', '揸', '沽', '諗', '搵', '幾時', '點解', '而家', '依家',
  '梗係', '一陣', '好彩', '衰咗', '仲有', '同埋', '之嘛', '啦', '喎', '囉', '咩'];
/* 呢啲喺正常國語入面都會出現，唔算殘留。 */
const CANTO_OK = [/沒關係/g, /關係/g, /係數/g, /系統/g, /同時/g, /同樣/g, /同意/g,
  /相同/g, /認同/g, /贊同/g, /共同/g, /如同/g, /不同/g, /同事/g, /同學/g, /陪同/g,
  /一陣子/g, /一陣風/g];
const HAN = /[㐀-䶿一-鿿]/;

function purity(lang, where, s) {
  if (s == null) return;
  s = String(s);
  if (lang === 'en') {
    /* 英文版容許喺 <!-- keep --> 之間留漢字（例如刻意引用中文），其餘一律當譯漏。 */
    const stripped = s.replace(/<!--\s*keep\s*-->[\s\S]*?<!--\s*\/keep\s*-->/g, '');
    const hits = (stripped.match(new RegExp(HAN.source, 'g')) || []);
    if (hits.length) E(`${where}：英文版仲有漢字「${hits.slice(0, 12).join('')}」`);
    return;
  }
  if (lang.startsWith('zh')) {
    let t = s;
    for (const re of CANTO_OK) t = t.replace(re, '');
    const hits = CANTO.filter(c => t.includes(c));
    if (hits.length) E(`${where}：仲有廣東話「${hits.join('、')}」→ ${s.slice(0, 60)}`);
  }
}

/* ---------- 逐個語言查 ---------- */
const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(W.LANGS).filter(c => c !== BASE);

for (const lang of targets) {
  const L = W.LANGS[lang];
  if (!L) { E(`冇 lang/${lang}.js 呢個語言`); continue; }
  const P = s => `[${lang}] ` + s;

  /* --- 貨幣同財富階梯 --- */
  if (!L.cur || !L.cur.sym || !L.cur.rate) E(P('cur{} 冇 sym / rate'));
  if (!Array.isArray(L.levels) || L.levels.length !== 5) E(P('levels 應該有 5 級'));
  else {
    for (let i = 1; i < L.levels.length; i++)
      if (L.levels[i][0] <= L.levels[i - 1][0]) E(P(`levels 第 ${i + 1} 級門檻冇升`));
    L.levels.forEach((lv, i) => purity(lang, P(`levels[${i}]`), lv[2]));
  }
  if (!L.label) E(P('冇 label（換語言個掣要用）'));

  /* --- UI 字串 --- */
  const ui = L.ui || {};
  const missUI = Object.keys(SRC_UI).filter(k => ui[k] == null);
  if (missUI.length) E(P(`ui 譯漏 ${missUI.length} 個 key：${missUI.join(' ')}`));
  Object.keys(ui).forEach(k => {
    if (SRC_UI[k] == null) { E(P(`ui 多咗一個原文冇嘅 key「${k}」—— 打錯字？永遠唔會生效`)); return; }
    cmp(P(`ui.${k}`), SRC_UI[k], ui[k]);
    purity(lang, P(`ui.${k}`), ui[k]);
  });

  /* --- 偏誤 --- */
  const bias = L.bias || {};
  const missB = Object.keys(W.BIAS).filter(k => !bias[k] || !bias[k][0] || !bias[k][1]);
  if (missB.length) E(P(`偏誤譯漏 ${missB.length} 個：${missB.join(' ')}`));
  Object.keys(bias).forEach(k => {
    if (!W.BIAS[k]) { E(P(`偏誤多咗一個原文冇嘅 key「${k}」`)); return; }
    purity(lang, P(`bias.${k}`), bias[k][0]);
    purity(lang, P(`bias.${k}`), bias[k][1]);
  });

  /* --- 章節連結 ---
     名要譯，href 亦都要換去嗰個語言嘅子目錄，唔係會撳返廣東話版。 */
  const ch = L.ch || {};
  const missCH = Object.keys(W.CH).filter(k => !ch[k]);
  if (missCH.length) E(P(`章節連結譯漏：${missCH.join(' ')}`));
  Object.keys(ch).forEach(k => {
    if (!W.CH[k]) { E(P(`章節多咗一個原文冇嘅 key「${k}」`)); return; }
    if (!Array.isArray(ch[k]) || ch[k].length !== 2) { E(P(`ch.${k} 應該係 [名, href]`)); return; }
    purity(lang, P(`ch.${k}`), ch[k][0]);
    if (!ch[k][1].includes('/' + lang + '/'))
      E(P(`ch.${k} 條 href「${ch[k][1]}」冇指去 /${lang}/ —— 會跳返廣東話版`));
  });

  /* --- 結局 --- */
  const end = L.ending || {};
  const missE = Object.keys(W.ENDING_INFO).filter(k => {
    const o = end[k]; return !o || !o.n || !o.tag || !o.d;
  });
  if (missE.length) E(P(`結局譯漏 ${missE.length} 個：${missE.join(' ')}`));
  Object.keys(end).forEach(k => {
    const s = W.ENDING_INFO[k];
    if (!s) { E(P(`結局多咗一個原文冇嘅 key「${k}」`)); return; }
    ['n', 'tag', 'd'].forEach(f => {
      cmp(P(`ending.${k}.${f}`), s[f], end[k][f]);
      purity(lang, P(`ending.${k}.${f}`), end[k][f]);
    });
  });

  /* --- 場景 --- */
  const sc = L.scen || {};
  Object.keys(sc).forEach(id => {
    if (!ALL_SCEN.some(s => String(s.id) === String(id)))
      E(P(`場景多咗一個唔存在嘅 id「${id}」`));
  });
  let nMiss = 0;
  ALL_SCEN.forEach(s => {
    const o = sc[s.id];
    const at = f => P(`場景 ${s.id}.${f}`);
    if (!o) { nMiss++; return; }
    if (s.sig && o.sig == null) E(at('sig') + ' 冇譯');
    if (s.txt && o.txt == null) E(at('txt') + ' 冇譯');
    cmp(at('sig'), s.sig || '', o.sig); purity(lang, at('sig'), o.sig);
    cmp(at('txt'), s.txt || '', o.txt); purity(lang, at('txt'), o.txt);
    if (!o.opts || o.opts.length !== s.opts.length) {
      E(at('opts') + ` 應該有 ${s.opts.length} 個，而家 ${o.opts ? o.opts.length : 0} 個`);
      return;
    }
    s.opts.forEach((so, j) => {
      const d = o.opts[j] || {};
      const w = f => P(`場景 ${s.id} 選項 ${j + 1}.${f}`);
      if (so.t && d.t == null) E(w('t') + ' 冇譯');
      if (so.r && d.r == null) E(w('r') + ' 冇譯');
      /* why 係可選嘅：原文有先要譯，原文冇就唔應該憑空加。 */
      if (so.why && d.why == null) E(w('why') + ' 冇譯');
      if (!so.why && d.why != null) A(w('why') + ' 原文冇 why，譯文多咗一段');
      ['t', 'r', 'why'].forEach(f => { cmp(w(f), so[f] || '', d[f]); purity(lang, w(f), d[f]); });
    });
  });
  if (nMiss) E(P(`場景完全冇譯：${nMiss} / ${ALL_SCEN.length}`));

  /* --- 進度總結 --- */
  const doneScen = ALL_SCEN.filter(s => sc[s.id]).length;
  console.log(`${lang.padEnd(6)} ui ${String(Object.keys(ui).length).padStart(3)}/${Object.keys(SRC_UI).length}` +
    ` · 偏誤 ${String(Object.keys(bias).length).padStart(2)}/${Object.keys(W.BIAS).length}` +
    ` · 結局 ${Object.keys(end).length}/${Object.keys(W.ENDING_INFO).length}` +
    ` · 章節 ${Object.keys(ch).length}/${Object.keys(W.CH).length}` +
    ` · 場景 ${String(doneScen).padStart(2)}/${ALL_SCEN.length}`);
}

/* ---------- shell.html 嘅 data-t 要對得返 zh-HK 個 ui{} ---------- */
const shell = readFileSync(new URL('./src/shell.html', import.meta.url), 'utf8');
const domKeys = [...shell.matchAll(/data-t(?:h|-title|-aria)?="([^"]+)"/g)].map(m => m[1]);
[...new Set(domKeys)].forEach(k => {
  if (SRC_UI[k] == null) E(`shell.html 用咗 data-t="${k}"，但係 lang/${BASE}.js 個 ui{} 冇呢個 key`);
});

/* ---------- 出結果 ---------- */
console.log('');
if (warns.length) { console.log('--- 提醒 ---'); warns.forEach(w => console.log('· ' + w)); console.log(''); }
if (errs.length) {
  console.log(`--- ✗ ${errs.length} 個問題 ---`);
  errs.slice(0, 200).forEach(e => console.log('· ' + e));
  if (errs.length > 200) console.log(`… 仲有 ${errs.length - 200} 個`);
  process.exit(1);
}
console.log('✓ 譯文覆蓋率 · 佔位符 · HTML tag · 語言純度 全部過');
