/* 圖表喺窄螢幕嘅可讀性。
   問題：所有 .lti-fig 嘅 SVG 都係 640 闊 viewBox、11.5–13px 字。
   喺 360px 闊嘅電話度，成張圖縮 1.78 倍，啲字得返大約 7px —— 讀唔到。
   縮放係整體嘅，冇得淨係放大文字。

   做法（兩層，冇 JS 都仲用得）：
   1. 將 SVG 包一個可以橫向捲動嘅盒，落 min-width，令字回到接近原本大小；
      邊緣加漸變同提示，話畀人知右邊仲有嘢。
   2. 撳一撳可以全螢幕睇，嗰度可以隨意捲同放大。
   兩樣都淨係喺窄螢幕先出現，電腦版完全冇分別。 */
(function () {
  var MIN_W = 540;          // 640 * 11/13 ≈ 540，即係字唔會細過 11px
  var NARROW = 700;

  /* 掣上面嘅字要跟返頁面語言。（加英文版之前呢啲字係 hardcode 廣東話嘅，
     所以台灣版一路都出緊「放大睇」；一併喺呢度修埋。） */
  var STRINGS = {
    'zh-HK': { zoom: '⤢ 放大睇', zoomAria: '放大睇呢張圖', close: '閂', fallback: '圖表' },
    'zh-TW': { zoom: '⤢ 放大看', zoomAria: '放大看這張圖', close: '關閉', fallback: '圖表' },
    'en':    { zoom: '⤢ Enlarge', zoomAria: 'Enlarge this figure', close: 'Close', fallback: 'Figure' }
  };
  var LANG = (document.documentElement.getAttribute('lang') || 'x').trim();
  var T = STRINGS[LANG] || STRINGS[LANG.split('-')[0]] || STRINGS['zh-HK'];

  function wrap(fig) {
    if (fig.dataset.zoomReady) return;
    var svg = fig.querySelector('svg');
    if (!svg) return;
    fig.dataset.zoomReady = '1';

    var box = document.createElement('div');
    box.className = 'lti-scroll';
    svg.parentNode.insertBefore(box, svg);
    box.appendChild(svg);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lti-zoom';
    btn.setAttribute('aria-label', T.zoomAria);
    btn.textContent = T.zoom;
    box.parentNode.insertBefore(btn, box.nextSibling);
    btn.addEventListener('click', function () { open(fig, svg); });

    // 有得捲先顯示「拉」提示
    function sync() {
      var more = box.scrollWidth - box.clientWidth > 8;
      fig.classList.toggle('lti-scrollable', more);
    }
    box.addEventListener('scroll', function () {
      fig.classList.toggle('lti-scrolled', box.scrollLeft > 8);
    }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(sync).observe(box);
    sync();
    setTimeout(sync, 300);
  }

  var ovl = null;
  function open(fig, svg) {
    if (!ovl) {
      ovl = document.createElement('div');
      ovl.className = 'lti-ovl';
      ovl.innerHTML =
        '<div class="lti-ovl-bar">' +
        '<span class="lti-ovl-t"></span>' +
        '<button type="button" class="lti-ovl-x" aria-label="' + T.close + '">✕</button>' +
        '</div><div class="lti-ovl-body"></div>';
      document.body.appendChild(ovl);
      ovl.addEventListener('click', function (e) {
        if (e.target === ovl || e.target.classList.contains('lti-ovl-x')) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
    }
    var titleEl = fig.querySelector('.lti-cap-title');
    ovl.querySelector('.lti-ovl-t').textContent = titleEl ? titleEl.textContent : T.fallback;
    var body = ovl.querySelector('.lti-ovl-body');
    body.innerHTML = '';
    var clone = svg.cloneNode(true);
    clone.removeAttribute('style');
    /* 一定要包一個 .lti-fig 返去。
       所有圖表樣式都係 scope 喺 .lti-fig 之下嘅（.lti-fig .fill-blue、
       .lti-fig .line-amber、.lti-fig text 嘅 halo…）。呢個 overlay 掛喺
       document.body,唔喺原本嗰個 <figure class="lti-fig"> 裡面 —— 所以
       如果直接擺個 svg 落去,一條規則都唔會中:
         fill: var(--chart-blue-fill) 解析唔到 → declaration 無效 →
         fill 跌返初始值 = 黑色。
       結果就係每張圖放大之後面積填色變成一大塊死黑、線同標籤都冇色。
       （用純 .lti-fig 而唔係 .md-typeset .lti-fig:後者帶 margin,
       而 overlay 唔喺 .md-typeset 裡面,所以呢個 class 唔會帶副作用。） */
    var holder = document.createElement('div');
    holder.className = 'lti-fig';
    holder.appendChild(clone);
    body.appendChild(holder);
    var cap = fig.querySelector('figcaption');
    if (cap) {
      var c = document.createElement('div');
      c.className = 'lti-ovl-cap';
      c.innerHTML = cap.innerHTML;
      body.appendChild(c);
    }
    ovl.classList.add('on');
    document.body.classList.add('lti-ovl-open');
  }
  function close() {
    if (!ovl) return;
    ovl.classList.remove('on');
    document.body.classList.remove('lti-ovl-open');
  }

  function run() {
    document.documentElement.style.setProperty('--lti-minw', MIN_W + 'px');
    var figs = document.querySelectorAll('.lti-fig');
    for (var i = 0; i < figs.length; i++) wrap(figs[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(run);
  }
})();
