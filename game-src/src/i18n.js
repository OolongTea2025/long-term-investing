/* ============================================================
   多語言層

   設計原則：**廣東話係 canonical，其他語言係 overlay。**

   即係話 scen1/2/3.js、bias.js、judge.js 入面嗰啲廣東話字，
   全部原封不動留喺原位；`lang/zh-TW.js` 只係一份「同一個 key 換另一句」
   嘅對照表，開波嗰陣先蓋上去。

   咁樣做嘅好處係：漏咗一句冇譯，玩家見到嘅係一句廣東話，
   唔係一個爛咗嘅介面或者 undefined。譯漏嘅風險由「壞版面」
   降級做「未譯」，而未譯嗰啲由 test.mjs 嘅覆蓋率檢查捉返。

   唯一例外係 ui.js —— 佢啲字串本身寫死喺 function 入面，
   冇得「蓋」，所以全部抽咗出嚟做 `ui:{}` 查表，廣東話嗰份
   住喺 lang/zh-HK.js。
   ============================================================ */

var LANGS = {};                 /* 由 lang/*.js 自己註冊入嚟 */
var DEFAULT_LANG = 'zh-HK';
var LANG = DEFAULT_LANG;
var L = null;                   /* 而家生效嗰個 locale */

function LC() { return L || LANGS[LANG] || LANGS[DEFAULT_LANG] || {}; }
function LBASE() { return LANGS[DEFAULT_LANG] || {}; }

/* 查 UI 字串。{0} {1} … 會被之後嘅參數填返。
   查唔到就跌返廣東話；連廣東話都冇先至出 ⟪key⟫（即係我漏咗嘢）。 */
function t(k) {
  var s = (LC().ui || {})[k];
  if (s == null) s = (LBASE().ui || {})[k];
  if (s == null) return '⟪' + k + '⟫';
  for (var i = 1; i < arguments.length; i++) s = s.split('{' + (i - 1) + '}').join(arguments[i]);
  return s;
}

/* ---------- 貨幣 ----------
   模型內部永遠用同一套數（港元），唔會跟語言變 ——
   換語言唔可以換咗個遊戲嘅難度。呢度淨係換顯示：
   台灣版將所有金額 ×4 再標 NT$，所以兩邊玩落去嘅
   平衡、機率、結局分佈完全一樣。 */
function curRate() { var c = LC().cur; return (c && c.rate) || 1; }
function curSym() { var c = LC().cur; return (c && c.sym) || '$'; }
function fmt(n) { return curSym() + Math.round(n * curRate()).toLocaleString('en-US'); }
function fmtSigned(n) {
  return (n < 0 ? '-' : '+') + curSym() + Math.abs(Math.round(n * curRate())).toLocaleString('en-US');
}

/* ---------- 揀語言 ----------
   次序：網址 ?lang= > 上次揀過嗰個 > 廣東話。
   刻意唔睇 navigator.language —— 網站兩個版嘅遊戲連結
   都會明寫 ?lang=，讀者撳邊個版就係邊個版，唔會有驚喜。 */
function pickLang(saved) {
  var q = '';
  try { q = ((String(location.search).match(/[?&]lang=([\w-]+)/) || [])[1]) || ''; } catch (e) {}
  if (q && LANGS[q]) return q;
  if (saved && LANGS[saved]) return saved;
  return DEFAULT_LANG;
}
function setLang(code) { LANG = LANGS[code] ? code : DEFAULT_LANG; L = LANGS[LANG]; return LANG; }

/* ---------- 將 overlay 蓋落資料上面 ----------
   全部都係「有先蓋，冇就唔郁」。 */
function overlayPairs(target, src, fields) {
  if (!src) return;
  for (var k in src) {
    if (!target[k]) continue;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (src[k][f] != null) target[k][f] = src[k][f];
    }
  }
}
function applyLocale() {
  var lc = LC();
  /* NAMES 住喺 ui.js（瀏覽器側），Node 測試嗰邊冇，所以要 guard。 */
  if (lc.names && typeof NAMES !== 'undefined') for (var k in lc.names) NAMES[k] = lc.names[k];
  if (lc.phase) for (var p in lc.phase) PHASE_LABEL[p] = lc.phase[p];

  /* 章節連結：名同 href 兩樣都換（台灣版嘅章節喺 ../zh-TW/ 之下） */
  if (lc.ch) for (var c in lc.ch) if (CH[c]) CH[c] = lc.ch[c];

  /* 偏誤：[名, 一句話解釋]，第三個（對應章節）唔郁 */
  if (lc.bias) for (var b in lc.bias) {
    if (!BIAS[b]) continue;
    if (lc.bias[b][0]) BIAS[b][0] = lc.bias[b][0];
    if (lc.bias[b][1]) BIAS[b][1] = lc.bias[b][1];
  }

  /* 結局：n 名 / tag 標籤 / d 描述 */
  overlayPairs(ENDING_INFO, lc.ending, ['n', 'tag', 'd']);

  /* 場景：sig / txt / opts[i] 嘅 t / r / why。
     d{}（真正影響模型嗰啲數）同 b（偏誤 key）永遠唔會被 overlay 掂到，
     所以譯錯字都唔可能整壞平衡。 */
  if (lc.scen) applyScenLocale(lc.scen);
}
function applyScenLocale(tbl) {
  var all = SCEN_ROOKIE.concat(SCEN_MID, SCEN_VET);
  for (var i = 0; i < all.length; i++) {
    var s = all[i], o = tbl[s.id];
    if (!o) continue;
    if (o.sig != null) s.sig = o.sig;
    if (o.txt != null) s.txt = o.txt;
    if (o.opts) for (var j = 0; j < s.opts.length && j < o.opts.length; j++) {
      var a = s.opts[j], b = o.opts[j];
      if (!b) continue;
      if (b.t != null) a.t = b.t;
      if (b.r != null) a.r = b.r;
      if (b.why != null) a.why = b.why;
    }
  }
}

/* ---------- 版面上面嘅靜態文字 ----------
   shell.html 保留廣東話原文（可讀、亦係 fallback），
   元素身上掛 data-t / data-th / data-t-title / data-t-aria。
   廣東話版乜都唔使做，其他語言先至逐個換。 */
function applyLocaleDOM() {
  if (LANG === DEFAULT_LANG) return;
  var ui = LC().ui || {};
  var put = function (attr, fn) {
    var els = document.querySelectorAll('[' + attr + ']');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute(attr);
      if (ui[key] != null) fn(els[i], ui[key]);
    }
  };
  put('data-t', function (el, v) { el.textContent = v; });
  put('data-th', function (el, v) { el.innerHTML = v; });
  put('data-t-title', function (el, v) { el.setAttribute('title', v); });
  put('data-t-aria', function (el, v) { el.setAttribute('aria-label', v); });
  if (ui.docTitle) document.title = ui.docTitle;
  var md = document.querySelector('meta[name="description"]');
  if (md && ui.metaDesc) md.setAttribute('content', ui.metaDesc);
}

/* 開波：揀語言、蓋 overlay、set <html lang>。 */
function initLang(saved) {
  setLang(pickLang(saved));
  applyLocale();
  try { document.documentElement.setAttribute('lang', LC().htmlLang || LANG); } catch (e) {}
  applyLocaleDOM();
  return LANG;
}
