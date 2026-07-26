/* 記住上次睇到邊頁 + 自動返到嗰度。
   - 每頁記低當前位置（首頁、404 除外），並記低首頁 URL。
   - 首頁行為：只要有紀錄就「永遠」自動跳返上次嗰頁（用 replace）。
     例外：URL 帶住 ?home（由固定「🏠 首頁」掣去），就唔跳、正常顯示首頁。
   - 每個內容頁都注入一個固定「🏠 首頁」掣，畀用家隨時返首頁簡介。
   - 新訪客冇紀錄 → 唔跳。撳「繼續睇返」旁邊嘅 ✕ 清除 → 唔再跳。
   - 相容 Material instant navigation（document$）。 */
(function () {
  /* 紀錄要「逐個語言版本」分開存。
     自從加咗台灣版（廣東話留喺根、zh-TW 行 /zh-TW/），兩個版本係同一個
     origin，即係共用同一份 localStorage；而兩個首頁都有 #resume-slot,
     兩邊都會自動 replace 去「上次嗰頁」。如果得一條 key,就會出現：
     讀者睇完台灣版第 7 章 → 之後開廣東話首頁 → 被掟返去台灣版第 7 章
     （反方向一樣中招）,而且佢除咗 ?home 之外冇路可逃 —— 同之前個 404
     bug 係同一種「困住讀者」嘅模式。
     用 <html lang>（根 = zh-HK, 台灣版 = zh-TW）做 key 嘅後綴,
     兩邊各自記各自嘅進度,永遠唔會互相掟。
     舊 key 唔使 migrate：現有讀者最多係首頁正常顯示一次,之後照記。 */
  var LANG = (document.documentElement.getAttribute('lang') || 'x').trim();
  var KEY = 'lti:lastpage:' + LANG;   // 上次嗰頁 {u,t}
  var HOME = 'lti:home:' + LANG;      // 首頁 URL（capture 返嚟，方便砌「返首頁」連結）

  /* 站根喺邊，要問返 Material 攞，唔可以用 location.origin + '/'。
     GitHub Pages 嘅 project site 住喺 https://<user>.github.io/<repo>/ 之下，
     origin + '/' 會去咗 <user>.github.io/ —— 即係 404 或者第二個網站。
     呢個 bug 平時睇唔到：只要有紀錄就會用返 localStorage 嗰個。
     但一個由分享連結／搜尋結果直接入到內容頁、未去過首頁嘅新讀者，
     撳「🏠 首頁」就會中招 —— 而嗰個正正係最常見嘅第一次到訪路徑。
     Material 每頁都有一個 [data-md-component="logo"]，佢個 href 永遠係
     指返站根嘅相對路徑，擺喺任何子路徑都啱。 */
  function siteRoot() {
    var logo = document.querySelector('[data-md-component="logo"]');
    if (logo && logo.href) return logo.href;
    return location.origin + '/';   // 真係搵唔到先用（例如 root site）
  }

  /* 呢一頁係唔係 404？
     千萬唔可以只靠 location.pathname 睇有冇 "404" —— GitHub Pages 係喺
     「原本嗰條唔存在嘅 URL」上面送 404.html 嘅內容,所以訪客入
     /新手篇/99-唔存在/ 嘅時候,pathname 就係 /新手篇/99-唔存在/,
     完全唔含 "404"。舊版就係咁走漏,將 404 記成「上次嗰頁」,
     令讀者之後每次入首頁都被 replace 去嗰個 404,永遠出唔嚟。
     所以真正嘅判斷係 overrides/404.html 裡面嗰個 #lti-404 標記;
     pathname 嗰個 test 留住做多一層保險（例如有人直接開 /404.html）。 */
  function is404() {
    if (document.getElementById('lti-404')) return true;
    return /(^|\/)404(\.html)?\/?$/.test(location.pathname);
  }

  function homeHref() {
    var base;
    try { base = localStorage.getItem(HOME); } catch (e) {}
    if (!base) base = siteRoot();
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'home';
  }

  function ensureHomeBtn(isHome) {
    var b = document.getElementById('resume-home-btn');
    if (isHome) { if (b) b.style.display = 'none'; return; }
    if (!b) {
      b = document.createElement('a');
      b.id = 'resume-home-btn';
      b.className = 'resume-home-btn';
      b.setAttribute('aria-label', '返首頁');
      b.innerHTML = '🏠 首頁';
      document.body.appendChild(b);
    }
    b.href = homeHref();
    b.style.display = '';
  }

  function showBanner(slot, d, path) {
    slot.innerHTML =
      '<span class="resume-ico">↩</span> 繼續睇返上次：' +
      '<a href="' + d.u + '">' + (d.t || '上次嗰頁') + '</a>' +
      '<button type="button" class="resume-x" aria-label="清除">✕</button>';
    slot.style.display = '';
    var x = slot.querySelector('.resume-x');
    if (x) x.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      slot.style.display = 'none';
    });
  }

  function run() {
    try {
      var slot = document.getElementById('resume-slot');
      var isHome = !!slot;                 // 首頁先有呢個 slot
      var path = location.pathname;
      var title = (document.title || '').split(' - ')[0].trim();

      ensureHomeBtn(isHome);

      if (!isHome) {
        // 內容頁：記低位置（404 除外）
        if (!is404()) {
          localStorage.setItem(KEY, JSON.stringify({ u: path, t: title }));
        }
        return;
      }

      // ── 以下淨係喺首頁行 ──
      // capture 首頁 URL（乾淨版，去埋 query / hash）
      try { localStorage.setItem(HOME, location.origin + location.pathname); } catch (e) {}

      var stay = /(^|[?&])home(=|&|$)/.test(location.search);   // 由「🏠 首頁」掣入嚟

      var raw = localStorage.getItem(KEY);
      if (!raw) { slot.style.display = 'none'; return; }
      var d;
      try { d = JSON.parse(raw); } catch (e) { return; }
      if (!d || !d.u || d.u === path) { slot.style.display = 'none'; return; }

      // 冇帶 ?home → 永遠自動跳返上次嗰頁
      if (!stay) { location.replace(d.u); return; }

      // 帶 ?home（用家主動返首頁）→ 唔跳，顯示「繼續睇返」畀佢一撳返去
      showBanner(slot, d, path);
    } catch (e) { /* storage 唔用得就靜靜算數 */ }
  }

  // (1) 即刻處理當前頁面（hard load / 直入 URL 都 work）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // (2) 之後每次 instant navigation 再跑
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(run);
  }
})();
