/* 喺 Node 度用一個最小 DOM 跑真正嘅 index.html script，
   由標題畫面一路撳到結局，捉 runtime error。
   唔係代替真機測試，但捉得到打錯字、搵唔到 element、undefined 呢類問題。
   用法：node build.mjs && node domtest.mjs [語言碼]
   唔寫語言碼就跑預設（廣東話）。跑 `node domtest.mjs en` 會經 ?lang=en
   行一次，所以每個語言嘅 overlay 都真係畫得出嚟先算數。          */
import { readFileSync } from 'fs';
import vm from 'vm';

const LANG = process.argv[2] || '';
const html = readFileSync(new URL('../docs/game/index.html', import.meta.url), 'utf8');
const script = html.split('<script>')[1].split('</script>')[0];

/* ---- 由 shell.html 度抽晒所有 id，自動整返個 fake DOM ---- */
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);

const warn = [];
class El {
  constructor(id, tag) {
    this.id = id || ''; this.tagName = (tag || 'div').toUpperCase();
    this.children = []; this.style = {}; this.dataset = {};
    this._cls = new Set(); this.textContent = ''; this._html = '';
    this.disabled = false; this.clientWidth = 480; this.clientHeight = 60;
    this.offsetHeight = 200; this.src = ''; this._attrs = {};
    this.classList = {
      add: (...c) => c.forEach(x => this._cls.add(x)),
      remove: (...c) => c.forEach(x => this._cls.delete(x)),
      toggle: (c, v) => { const on = v === undefined ? !this._cls.has(c) : !!v; on ? this._cls.add(c) : this._cls.delete(c); },
      contains: c => this._cls.has(c)
    };
  }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = v; if (v === '') this.children = []; }
  appendChild(c) { this.children.push(c); c.parent = this; return c; }
  getAttribute(k) { return k in this._attrs ? this._attrs[k] : null; }
  setAttribute(k, v) { this._attrs[k] = String(v); }
  addEventListener() {}
  scrollIntoView() {}
  getContext() {
    const noop = () => {};
    return new Proxy({}, {
      get: (t, k) => (k === 'canvas' ? {} : (typeof k === 'string' ? noop : undefined))
    });
  }
}

const registry = new Map();
for (const id of ids) registry.set(id, new El(id));
/* seg 掣：children 要有 dataset.v */
const segs = { segSpeed: [34, 17, 7, 0], segSound: [1, 0], segTags: [1, 0] };
for (const [sid, vals] of Object.entries(segs)) {
  const el = registry.get(sid);
  el.children = vals.map(v => { const b = new El('', 'button'); b.dataset.v = String(v); return b; });
}
registry.get('nameIn').value = '烏龍茶';

/* applyLocaleDOM() 靠 querySelectorAll('[data-t]') 換 shell.html 嘅靜態文字。
   如果呢度回一個空 array，換語言就變咗「乜都冇做但唔會報錯」——
   所以要由真正嘅 HTML 抽返啲帶 data-t* 嘅 element 出嚟。 */
const I18N_ATTRS = ['data-t', 'data-th', 'data-t-title', 'data-t-aria'];
const tagged = [];
for (const m of html.matchAll(/<([a-zA-Z][\w-]*)\s([^>]*data-t[^>]*)>/g)) {
  const attrs = m[2];
  const id = (attrs.match(/id="([^"]+)"/) || [])[1];
  const el = id && registry.has(id) ? registry.get(id) : new El(id || '', m[1]);
  for (const am of attrs.matchAll(/([\w-]+)="([^"]*)"/g))
    if (I18N_ATTRS.includes(am[1])) el.setAttribute(am[1], am[2]);
  tagged.push(el);
}
const metaDesc = new El('', 'meta');

const document = {
  title: '',
  getElementById: id => {
    if (!registry.has(id)) { warn.push('搵唔到 element #' + id); registry.set(id, new El(id)); }
    return registry.get(id);
  },
  createElement: tag => new El('', tag),
  querySelectorAll: sel => {
    if (sel === '.opt') return registry.get('opts').children;
    const a = (sel.match(/^\[([\w-]+)\]$/) || [])[1];
    return a ? tagged.filter(el => el.getAttribute(a) != null) : [];
  },
  querySelector: sel => (sel.includes('meta') ? metaDesc : null),
  addEventListener: () => {}
};

/* 打字速度設做「即時」，否則選項係 setInterval 之後先出，同步試玩見唔到 */
const store = { 'wulongcha:opts': JSON.stringify({ speed: 0, sound: 0, tags: 1 }) };
const sandbox = {
  document, console,
  window: {
    matchMedia: () => ({ matches: false }),
    localStorage: null, devicePixelRatio: 1, innerWidth: 390, innerHeight: 844,
    addEventListener: () => {}, ResizeObserver: null, AudioContext: null
  },
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  /* pickLang() 睇 location.search，所以換語言就係換呢一行。 */
  location: { protocol: 'https:', href: '', search: LANG ? '?lang=' + LANG : '' },
  navigator: { userAgent: 'node' },
  Image: class { set src(v) { this._s = v; setTimeout(() => this.onload && this.onload(), 0); } },
  requestAnimationFrame: fn => setTimeout(fn, 0),
  setTimeout, clearTimeout, setInterval, clearInterval,
  Math, Date, JSON, Promise, Object, Array, String, Number, isNaN, parseInt, parseFloat
};
sandbox.window.localStorage = sandbox.localStorage;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const errs = [];
try {
  vm.runInContext(script, sandbox, { filename: 'game.js' });
} catch (e) { errs.push('載入時出錯: ' + e.stack); }

/* ---- 由標題撳到結局 ---- */
const g = sandbox;
function pick(i) {
  const opts = registry.get('opts').children;
  if (!opts.length) return false;
  const b = opts[Math.min(i, opts.length - 1)];
  b.onclick && b.onclick();
  return true;
}

if (!errs.length) {
  try {
    registry.get('startBtn').onclick();
    let turns = 0, guard = 0;
    while (registry.get('end')._cls.has('on') === false && guard++ < 300) {
      if (registry.get('review')._cls.has('on')) { registry.get('rvNext').onclick(); continue; }
      if (!pick(guard % 4)) break;
      registry.get('next').onclick();
      turns++;
    }
    console.log('語言：', vm.runInContext('LANG', sandbox));
    console.log('跑咗', turns, '個回合，最後畫面 =',
      registry.get('end')._cls.has('on') ? '結局 ✓' : '仲喺遊戲中');
    if (!registry.get('end')._cls.has('on')) errs.push('撳唔到結局：跑咗 ' + turns + ' 個回合就停咗');
    if (registry.get('end')._cls.has('on')) {
      console.log('結局：', registry.get('eName').textContent, '|', registry.get('eTag').textContent);
      const h = registry.get('eExtra').innerHTML;
      console.log('結局頁長度：', h.length, '字元');
      /* 唔可以寫死廣東話 —— 逐個語言問返佢自己個 t()，
         咁呢個檢查先至喺三個語言都真係驗到嘢。 */
      ['secCompare', 'secAttr', 'secCostDetail', 'secMC', 'secBias', 'secKey', 'secMike']
        .map(k => vm.runInContext(`t(${JSON.stringify(k)})`, sandbox))
        .forEach(s => { if (!h.includes(s)) warn.push('結局頁少咗「' + s + '」'); });
      if (/⟪[a-zA-Z]+⟫/.test(h)) warn.push('結局頁有查唔到嘅 ui key：' + (h.match(/⟪[a-zA-Z]+⟫/g) || []).join(' '));
      if (/undefined|NaN|\$NaN/.test(h)) warn.push('結局頁有 undefined / NaN');
      /* 每個階段結算都應該行過 */
      if (!registry.get('rvTitle').textContent) warn.push('階段結算冇出現過');
    }
  } catch (e) { errs.push('試玩時出錯: ' + e.stack); }
}

/* ---- 換語言真係換到版面未 ----
   applyLocaleDOM() 靜靜雞乜都唔做嘅話，遊戲照玩得完，
   但玩家見到嘅係一版廣東話 —— 所以要獨立驗一次。 */
if (!errs.length && vm.runInContext('LANG !== DEFAULT_LANG', sandbox)) {
  /* 預設語言（廣東話）行唔到呢一段 —— applyLocaleDOM() 對預設語言係
     刻意乜都唔做嘅，因為 shell.html 本身就已經係廣東話。 */
  const want = vm.runInContext("[t('docTitle'), t('btnStart'), t('setHead')]", sandbox);
  if (document.title !== want[0]) errs.push(`<title> 冇跟語言換：「${document.title}」應該係「${want[0]}」`);
  if (metaDesc.getAttribute('content') !== vm.runInContext("t('metaDesc')", sandbox))
    errs.push('meta description 冇跟語言換');
  const texts = tagged.map(el => el.textContent).join('');
  if (!texts.includes(want[1])) errs.push(`版面上面搵唔到「${want[1]}」—— data-t 冇換到`);
  if (!texts.includes(want[2])) errs.push(`版面上面搵唔到「${want[2]}」—— data-t 冇換到`);
  console.log('版面文字：', want.join(' · '));
}

/* ---- 存檔 / 讀檔 來回測試 ----
   新格式只存 seed + 決定序列，讀檔時重播返出嚟。
   所以一定要驗證：讀返之後，淨值同每一個狀態都要一模一樣。 */
if (!errs.length) {
  try {
    vm.runInContext("G = newGame('存檔測試', 12345); G.turn = 0;", sandbox);
    const ALL_LEN = vm.runInContext('ALL_SCEN.length', sandbox);
    vm.runInContext(`
      for (var _t = 0; _t < 34; _t++) {
        if (isRuined(G)) break;
        G.turn++; drift(G);
        var sc = ALL_SCEN[G.turn - 1];
        var list = optionsFor(G, sc);
        commitChoice(G, list[(_t * 3) % list.length], sc);
      }
      __before = { eq: G.sim.eq, turn: G.turn, cost: G.sim.tradeCost,
                   conc: G.posture.conc, lev: G.posture.lev, bias: G.biasLog.length,
                   hist: G.sim.hist.length };
      saveGame();
    `, sandbox);
    const raw = store['wulongcha:save2'];
    const after = vm.runInContext(`
      G = null;
      applySave(JSON.parse(${JSON.stringify(raw)}));
      ({ eq: G.sim.eq, turn: G.turn, cost: G.sim.tradeCost,
         conc: G.posture.conc, lev: G.posture.lev, bias: G.biasLog.length,
         hist: G.sim.hist.length })
    `, sandbox);
    const before = vm.runInContext('__before', sandbox);
    console.log('存檔大小：', (raw.length / 1024).toFixed(1) + ' KB');
    let same = true;
    for (const k of Object.keys(before)) {
      const d = Math.abs(before[k] - after[k]);
      if (d > 1e-6) { same = false; warn.push(`讀檔後 ${k} 唔一致：${before[k]} -> ${after[k]}`); }
    }
    console.log('讀檔重播：', same ? '淨值／成本／集中度／槓桿／偏誤數全部一模一樣 ✓' : '有出入 ✗');
  } catch (e) { warn.push('存檔測試出錯: ' + e.message); }
}

console.log('\n--- 結果 ---');
if (errs.length) { errs.forEach(e => console.log('❌ ' + e)); process.exitCode = 1; }
if (warn.length) warn.forEach(w => console.log('⚠  ' + w));
if (!errs.length && !warn.length) console.log('✓ 由標題撳到結局，冇 runtime error，結局頁齊料');
