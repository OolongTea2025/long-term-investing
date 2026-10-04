/* ============================================================
   結局判定 · 歸因分解 · Monte Carlo

   舊版嘅「技術分數」係循環論證：技術本身就係一個寫死嘅回報加成，
   所以「你係靠技術定靠彩數」呢條問題，答案早就寫咗喺公式入面。

   新版係咁分嘅：攞你實際做過嘅七十個決定，原封不動咁擺去幾百個
   唔同嘅市場歷史入面重跑。同一套行為，唔同嘅市場。
   如果你嘅行為喺大部分平行時空都跑贏 Mike —— 咁就係真嘢。
   如果淨係今次贏 —— 咁就係彩數。
   ============================================================ */

/* 攞你嘅決定序列，喺 n 個全新市場度重播。 */
function monteCarlo(decs, n) {
  n = n || 400;
  var ratios = [], win = 0;
  for (var i = 0; i < n; i++) {
    var p = makePath(Math.floor(Math.random() * 1e9), decs.length);
    var you = replay(p, decs, {}, CONTRIB0).eq;
    var mk = runMike(p, CONTRIB0, decs.length).eq;
    var r = mk > 0 ? you / mk : 0;
    ratios.push(r);
    if (r > 1) win++;
  }
  ratios.sort(function (a, b) { return a - b; });
  return { ratios: ratios, win: win / n, med: ratios[Math.floor(n / 2)] };
}

/* 逐項移除歸因：每次淨係熄一樣嘢，用返同一條市場路徑重播。 */
function attribute(G) {
  var path = G.path, decs = G.decs, you = G.sim.eq;
  var f = function (knobs) { return replay(path, decs, knobs, CONTRIB0).eq - you; };
  return {
    you: you,
    mike: G.mike.eq,
    gap: you - G.mike.eq,
    cost: f({ noCost: 1 }),
    timing: f({ noTiming: 1 }),
    conc: f({ noConc: 1 }),
    lev: f({ noLev: 1 }),
    all: f({ noCost: 1, noTiming: 1, noConc: 1, noLev: 1 }),
    income: -f({ baseIncome: 1 })   // 你嘅人工增長貢獻咗幾多（正數 = 幫到你）
  };
}

var ENDING_INFO = {
EARLY_RUIN:{n:'出局',cg:'cg_end_01_blowup',tag:'提前結束',
 d:'你冇捱到最後。集中持倉、槓桿、單一注碼 —— 當中任何一樣單獨都未必致命，但你三樣一齊嚟。市場唔需要好耐就可以完成佢嘅工作。你連「慢慢輸」嘅機會都冇。'},
BLOWUP:{n:'爆倉',cg:'cg_end_01_blowup',tag:'淨值歸零',
 d:'你嘅淨值跌到唔夠你總投入（起步本金加埋所有供款）嘅一成半。呢個結局唔需要解釋 —— 你自己知發生咗咩事。'},
BOILED_FROG:{n:'溫水煮蛙',cg:'cg_end_02_boiled_frog',tag:'最常見嘅結局',
 d:'你冇爆倉，冇災難，冇故事可以講。你只係喺二十年入面，慢慢咁、每一年輸少少畀一個乜都冇做嘅人。呢個係最常見嘅結局，亦都係最少人為意嘅。'},
LEEK_LIFE:{n:'韭菜的一生',cg:'cg_end_03_leek_life',tag:'成本食晒',
 d:'你嘅交易好勤力。券商好多謝你。你付出咗時間、精神同健康，買咗一堆手續費單據。'},
AWAKENING:{n:'醒覺',cg:'cg_end_04_awakening',tag:'中途轉軚',
 d:'你中途醒咗。你冇完全追返之前輸咗嘅，但你止住咗血，而且你嘅餘生唔使再對住個螢幕。呢個唔算贏，但呢個係體面嘅收場。'},
WU_WEI:{n:'無為',cg:'cg_end_04_awakening',tag:'最難嘅結局',
 d:'你由頭到尾冇做過幾多嘢。冇故事、冇高潮、冇一次「我當時就知」。你淨係買咗，然後由得佢。\n\n呢個係全個遊戲最難攞到嘅結局 —— 唔係因為佢需要技術，而係因為佢需要你二十年入面，喺每一次心郁郁嘅時候，都揀咗唔郁。'},
TRUE_ALPHA:{n:'真 Alpha',cg:'cg_end_05_true_alpha',tag:'跑贏，而且唔係彩數',
 d:'你打敗咗指數。而且唔係好彩 —— 同一套做法擺去幾百個唔同嘅市場，大部分時空你都一樣贏。\n\n但你要睇清楚你贏喺邊。'},
LUCKY_FOOL:{n:'幸運兒',cg:'cg_end_06_lucky_fool',tag:'跑贏，但係⋯⋯',
 d:'你打敗咗指數。恭喜。\n\n但係 ——'}
};

/* mcWin = 同一套行為喺其他市場跑贏 Mike 嘅比例 */
function judge(G, mcWin) {
  var S = G.sim;
  var base = START + S.contributed;
  var ratio = G.mike.eq > 0 ? S.eq / G.mike.eq : 0;
  var totalCost = S.tradeCost + S.fundFee + S.spent + S.marginCost;
  var biasN = G.biasLog.length;

  if (G.ruinTurn && G.ruinTurn <= 45) return 'EARLY_RUIN';
  if (S.eq < base * 0.15) return 'BLOWUP';
  if (ratio > 1.0) return mcWin >= 0.5 ? 'TRUE_ALPHA' : 'LUCKY_FOOL';
  /* 完全紀律嘅玩家會同 Mike 打成平手 —— 呢個唔係輸，呢個先係目標。 */
  if (ratio >= 0.98 && biasN <= 12 && totalCost < S.eq * 0.04) return 'WU_WEI';
  if (ratio >= 0.85 && G.posture.dca && G.posture.indexed >= 0.9) return 'AWAKENING';
  /* 「韭菜」講嘅係成本，唔係「做得差」。你落場二十年，付出去嘅
     佣金／印花稅／利息／學費，佔咗你一世投入嘅一成二以上 —— 咁先叫韭菜。 */
  if (totalCost > base * 0.12) return 'LEEK_LIFE';
  return 'BOILED_FROG';
}

/* 財富階梯 Level（同教學網一致，唔計自住樓）。
   門檻同標籤由 locale 提供 —— 廣東話版係港元，台灣版係新台幣，
   兩邊各自對返自己嗰版 level.md 嘅級距。
   注意：v 係模型內部嘅數，要先 × 匯率變成顯示貨幣先好同門檻比。 */
function levelOf(v) {
  var rows = LC().levels || [[Infinity, 'Level 5', '']];
  var d = v * curRate();
  for (var i = 0; i < rows.length; i++) if (d < rows[i][0]) return [rows[i][1], rows[i][2]];
  return [rows[rows.length - 1][1], rows[rows.length - 1][2]];
}
