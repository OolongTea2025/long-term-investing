/* 《時間》嗰版嘅模擬器 loader。
   模擬器本體 tbm-sim.js 有 39KB,但全站得一版用得着 —— 所以呢度只擺一個
   幾百 byte 嘅 loader 落 extra_javascript(每版都載),見到 .tbm 先至去攞本體。
   ⚠ 唔可以喺 md 度直接寫 <script src="../javascripts/tbm-sim.js">:
   zh-TW / en 版嘅頁深一層,相對路徑會指去 /zh-TW/javascripts/ 而嗰度冇檔。
   Material 會逐版計啱 extra_javascript 嘅路徑,所以由 currentScript.src 推
   出本體嘅位置先至三個語言都啱。 */
(function () {
  if (!document.querySelector('.tbm')) return;
  var me = document.currentScript;
  if (!me) { var all = document.getElementsByTagName('script'); me = all[all.length - 1]; }
  var s = document.createElement('script');
  s.src = new URL('tbm-sim.js', me.src).href;
  s.defer = true;
  document.head.appendChild(s);
})();
