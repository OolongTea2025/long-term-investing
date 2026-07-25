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
    btn.setAttribute('aria-label', '放大睇呢張圖');
    btn.innerHTML = '⤢ 放大睇';
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
        '<button type="button" class="lti-ovl-x" aria-label="閂">✕</button>' +
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
    ovl.querySelector('.lti-ovl-t').textContent = titleEl ? titleEl.textContent : '圖表';
    var body = ovl.querySelector('.lti-ovl-body');
    body.innerHTML = '';
    var clone = svg.cloneNode(true);
    clone.removeAttribute('style');
    body.appendChild(clone);
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
