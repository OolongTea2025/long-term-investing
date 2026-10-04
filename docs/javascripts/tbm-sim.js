/* 蒙地卡羅模擬器 —— 《你最大嘅本金，係時間》嗰版用。
   · 淨係喺有 .tbm 個 div 嘅頁先行，其他頁一入嚟就 return。
   · 介面文字跟 <html lang>，唔使喺三個 md 度各自複製一次 markup。
   · 圖表顏色全部由網站嘅 CSS 變數攞，所以深色／淺色模式都啱色；
     撳 Material 個燈掣會即刻重畫。
   · 模型本身冇貨幣概念 —— 條數 scale-invariant，三個語言跑出嚟嘅
     CAGR／勝率／跌幅完全一樣，只係銀碼差個匯率倍數。 */
(function () {
  var root = document.querySelector('.tbm');
  if (!root) return;

  var STR = {
    "zh-HK": {
      "money": {
        "sym": "$",
        "k": 1,
        "monthly": 3000,
        "min": 500,
        "max": 20000,
        "step": 500
      },
      "labHAsset": "資產（決定回報）",
      "labHDom": "基金註冊地（決定成本）",
      "labHPlan": "你嘅計劃",
      "labAssetGroupA": "揀資產",
      "labAssetGroupB": "揀註冊地",
      "labGlobalName": "全球股票",
      "labGlobalDesc": "VT / VWRA · 全世界約 4,000–10,000 隻<br>1900–2025：實質 5.2% · 波幅 17.7%",
      "labUSName": "全美股",
      "labUSDesc": "VTI / VOO / CSPX · 淨美國<br>1900–2025：實質 6.6% · 波幅 20.3%",
      "labIEName": "愛爾蘭 UCITS",
      "labIEDesc": "VWRA / CSPX · 股息預扣 15%",
      "labUSDName": "美國註冊",
      "labUSDDesc": "VT / VOO · 香港人被預扣 30%",
      "labFee": " · 每年 {0}%",
      "labMonthly": "每月供款 ",
      "labPay": "供款年期 ",
      "labYears": "總投資年期 ",
      "labYearsVal": "{0} 年",
      "labRun": "行 {0} 次人生",
      "labRerun": "再行一次 {0} 次人生",
      "labRunning": "行緊…",
      "labAdv": "假設同參數（可以自己改）",
      "labFReal": "實質年回報（幾何、已扣通脹）%",
      "labFSig": "年波幅（標準差）%",
      "labFFee": "每年總成本 %",
      "labFInfl": "通脹 %",
      "labFDist": "回報分佈",
      "labFSeq": "次序風險",
      "labFPaths": "模擬次數",
      "labFSeed": "隨機種子",
      "labDistNormal": "常態（教科書）",
      "labDistT5": "肥尾（極端跌市較常見）",
      "labSeq0": "冇特別安排",
      "labSeq1": "最差 1 年排最前",
      "labSeq3": "最差 3 年排最前",
      "labSeq5": "最差 5 年排最前",
      "labIdx": "供款每年跟通脹加",
      "labMetaInit": "未跑。",
      "labAssume": "<b>回報參數唔係用 ETF 成立以來嘅數據。</b>VT 只有 2008 年起、VWRA 2019 年起，樣本太短，唔夠定 30 年假設。呢度用 Dimson-Marsh-Staunton（DMS）資料庫 1900–2025 共 126 年：世界指數實質年化 5.2%、美國 6.6%，名義年波幅世界 17.7%、美國 20.3%，美國長期通脹 2.9%。名義回報 =（1+實質）×（1+通脹）− 1，再用對數常態（或 t 分佈）精確反推月參數。<br><br>成本按 Bogleheads 對「無美國稅務協定嘅非美居民」估算（基金費＋股息預扣稅拖累）：VWRA 0.32%、VT 0.69%、CSPX/VUAA 0.33%、VOO/VTI 0.54%。<br><br>留意：美國過去 126 年跑贏全球，但呢個係事後先知；美國而家已經佔全球指數約 65%，買全球即係已經有大半注落美國。{0}頁面前面幾段用 7% 保守假設，模擬器用返實際歷史數據推算，所以會略高。教學用途，並非投資建議。",
      "labAssumeCur": "金額以港元顯示，假設港元繼續掛鈎美元。",
      "labTLog": "Log 刻度",
      "labTReal": "今日購買力",
      "labTHist": "睇分佈圖",
      "labChartAlt": "模擬結果圖表",
      "labLegMed": "中位數",
      "labLegMid": "中間一半（25–75）",
      "labLegMost": "大部分情況（10–90）",
      "labLegPut": "你放入去嘅本金",
      "labStatP10": "差運（10% 情況比呢個仲差）",
      "labStatP50": "中位數（一半好過、一半差過）",
      "labStatP90": "好運（只有 10% 情況贏過佢）",
      "labCagr": "年化 {0}%",
      "labOddCost": "總共放入嘅本金",
      "labOddWin": "最尾多過本金嘅機會",
      "labOddDbl": "最尾至少翻一倍嘅機會",
      "labOddDD": "途中最傷跌幅（中位數）",
      "labDelayH3": "如果遲 10 年先開始？",
      "labDelayP": "用<b>完全一樣</b>嘅市場走勢重跑，唯一分別係遲咗開始。",
      "labDelayNow": "準時開始（中位）",
      "labDelayLate": "遲 10 年（中位）",
      "labDelayGap": "遲 10 年 = 少咗 {0}（跌 {1}%）",
      "labDelayNone": "呢個設定下遲開始冇蝕底 — 試下拉長總年期。",
      "labAxisYear": "{0}年",
      "labHistCap": "最終資產分佈（每條 = 幾多 % 情況落喺呢個範圍）",
      "labHistLoss": "蝕本 ←",
      "labHistHi": "→ {0}+",
      "labMkPut": "本金",
      "labMkMed": "中位",
      "labMeta": "{0} · DMS 1900–2025 · 實質 {1}% / 波幅 {2}% · 通脹 {3}% · 成本 {4}% → 扣費後名義 CAGR {5}%（實質 {6}%） · {7} · 路徑 {8} · seed {9}",
      "labMetaSeq": " · 最差 {0} 年排最前",
      "labDistNormalShort": "對數常態",
      "labDistT5Short": "肥尾 t(5)"
    },
    "zh-TW": {
      "money": {
        "sym": "NT$",
        "k": 4,
        "monthly": 12000,
        "min": 2000,
        "max": 80000,
        "step": 1000
      },
      "labHAsset": "資產（決定報酬）",
      "labHDom": "基金註冊地（決定成本）",
      "labHPlan": "你的計畫",
      "labAssetGroupA": "選資產",
      "labAssetGroupB": "選註冊地",
      "labGlobalName": "全球股票",
      "labGlobalDesc": "VT / VWRA · 全世界約 4,000–10,000 檔<br>1900–2025：實質 5.2% · 波動 17.7%",
      "labUSName": "全美股",
      "labUSDesc": "VTI / VOO / CSPX · 只有美國<br>1900–2025：實質 6.6% · 波動 20.3%",
      "labIEName": "愛爾蘭 UCITS",
      "labIEDesc": "VWRA / CSPX · 股息預扣 15%",
      "labUSDName": "美國註冊",
      "labUSDDesc": "VT / VOO · 無租稅協定（如台灣）預扣 30%",
      "labFee": " · 每年 {0}%",
      "labMonthly": "每月投入 ",
      "labPay": "投入年期 ",
      "labYears": "總投資年期 ",
      "labYearsVal": "{0} 年",
      "labRun": "跑 {0} 次人生",
      "labRerun": "再跑一次 {0} 次人生",
      "labRunning": "跑著…",
      "labAdv": "假設與參數（可以自己改）",
      "labFReal": "實質年報酬（幾何、已扣通膨）%",
      "labFSig": "年波動（標準差）%",
      "labFFee": "每年總成本 %",
      "labFInfl": "通膨 %",
      "labFDist": "報酬分布",
      "labFSeq": "順序風險",
      "labFPaths": "模擬次數",
      "labFSeed": "隨機種子",
      "labDistNormal": "常態（教科書）",
      "labDistT5": "厚尾（極端跌勢較常見）",
      "labSeq0": "沒有特別安排",
      "labSeq1": "最差 1 年排最前",
      "labSeq3": "最差 3 年排最前",
      "labSeq5": "最差 5 年排最前",
      "labIdx": "投入金額每年跟著通膨調升",
      "labMetaInit": "尚未執行。",
      "labAssume": "<b>報酬參數不是用 ETF 成立以來的資料。</b>VT 只有 2008 年起、VWRA 2019 年起，樣本太短，不足以訂 30 年的假設。這裡用 Dimson-Marsh-Staunton（DMS）資料庫 1900–2025 共 126 年：世界指數實質年化 5.2%、美國 6.6%，名目年波動世界 17.7%、美國 20.3%，美國長期通膨 2.9%。名目報酬 =（1+實質）×（1+通膨）− 1，再用對數常態（或 t 分布）精確反推月參數。<br><br>成本依 Bogleheads 對「無美國稅務協定的非美國居民」估算（基金費＋股息預扣稅拖累）：VWRA 0.32%、VT 0.69%、CSPX/VUAA 0.33%、VOO/VTI 0.54%。<br><br>注意：美國過去 126 年贏過全球，但這是事後才知道的；美國現在已經佔全球指數約 65%，買全球等於已經有大半押在美國。{0}頁面前面幾段用 7% 保守假設，模擬器用實際歷史資料推算，所以會略高。教學用途，並非投資建議。",
      "labAssumeCur": "金額以新台幣顯示，匯率變動未計入。",
      "labTLog": "Log 刻度",
      "labTReal": "今日購買力",
      "labTHist": "看分布圖",
      "labChartAlt": "模擬結果圖表",
      "labLegMed": "中位數",
      "labLegMid": "中間一半（25–75）",
      "labLegMost": "大部分情況（10–90）",
      "labLegPut": "你放進去的本金",
      "labStatP10": "運氣差（10% 情況比這個更差）",
      "labStatP50": "中位數（一半好過、一半差過）",
      "labStatP90": "運氣好（只有 10% 情況贏過它）",
      "labCagr": "年化 {0}%",
      "labOddCost": "總共放進去的本金",
      "labOddWin": "最後多過本金的機率",
      "labOddDbl": "最後至少翻一倍的機率",
      "labOddDD": "過程中最重跌幅（中位數）",
      "labDelayH3": "如果晚 10 年才開始？",
      "labDelayP": "用<b>完全一樣</b>的市場走勢重跑，唯一差別是晚了開始。",
      "labDelayNow": "準時開始（中位）",
      "labDelayLate": "晚 10 年（中位）",
      "labDelayGap": "晚 10 年 = 少了 {0}（跌 {1}%）",
      "labDelayNone": "這個設定下晚開始沒有吃虧 — 試著拉長總年期。",
      "labAxisYear": "{0}年",
      "labHistCap": "最終資產分布（每條 = 多少 % 的情況落在這個範圍）",
      "labHistLoss": "虧損 ←",
      "labHistHi": "→ {0}+",
      "labMkPut": "本金",
      "labMkMed": "中位",
      "labMeta": "{0} · DMS 1900–2025 · 實質 {1}% / 波動 {2}% · 通膨 {3}% · 成本 {4}% → 扣費後名目 CAGR {5}%（實質 {6}%） · {7} · 路徑 {8} · seed {9}",
      "labMetaSeq": " · 最差 {0} 年排最前",
      "labDistNormalShort": "對數常態",
      "labDistT5Short": "厚尾 t(5)"
    },
    "en": {
      "money": {
        "sym": "$",
        "k": 0.125,
        "monthly": 375,
        "min": 100,
        "max": 2500,
        "step": 25
      },
      "labHAsset": "Asset (sets the return)",
      "labHDom": "Fund domicile (sets the cost)",
      "labHPlan": "Your plan",
      "labAssetGroupA": "Choose an asset",
      "labAssetGroupB": "Choose a domicile",
      "labGlobalName": "Global equities",
      "labGlobalDesc": "VT / VWRA · roughly 4,000–10,000 companies worldwide<br>1900–2025: real 5.2% · volatility 17.7%",
      "labUSName": "US total market",
      "labUSDesc": "VTI / VOO / CSPX · United States only<br>1900–2025: real 6.6% · volatility 20.3%",
      "labIEName": "Irish UCITS",
      "labIEDesc": "VWRA / CSPX · 15% dividend withholding",
      "labUSDName": "US domiciled",
      "labUSDDesc": "VT / VOO · 30% withheld if your country has no US tax treaty",
      "labFee": " · {0}% a year",
      "labMonthly": "Paid in each month ",
      "labPay": "Years of paying in ",
      "labYears": "Total years invested ",
      "labYearsVal": "{0} yrs",
      "labRun": "Run {0} lives",
      "labRerun": "Run another {0} lives",
      "labRunning": "Running…",
      "labAdv": "Assumptions and parameters (yours to change)",
      "labFReal": "Real annual return (geometric, after inflation) %",
      "labFSig": "Annual volatility (std. dev.) %",
      "labFFee": "Total annual cost %",
      "labFInfl": "Inflation %",
      "labFDist": "Return distribution",
      "labFSeq": "Sequence risk",
      "labFPaths": "Simulation runs",
      "labFSeed": "Random seed",
      "labDistNormal": "Normal (textbook)",
      "labDistT5": "Fat tails (bad years come round more often)",
      "labSeq0": "No special ordering",
      "labSeq1": "Worst 1 year first",
      "labSeq3": "Worst 3 years first",
      "labSeq5": "Worst 5 years first",
      "labIdx": "Raise the contribution with inflation each year",
      "labMetaInit": "Not run yet.",
      "labAssume": "<b>The return parameters do not come from the ETFs&rsquo; own track records.</b> VT only starts in 2008 and VWRA in 2019 — far too short a sample to set a 30-year assumption on. These use the Dimson-Marsh-Staunton (DMS) database, 1900–2025, 126 years in all: the world index returned 5.2% a year in real terms and the US 6.6%, with nominal annual volatility of 17.7% for the world and 20.3% for the US, and long-run US inflation of 2.9%. Nominal return = (1 + real) × (1 + inflation) − 1, and the monthly parameters are then solved exactly from a lognormal (or t) distribution.<br><br>Costs follow the Bogleheads estimate for a non-US resident with no US tax treaty (fund fee plus the drag from dividend withholding): VWRA 0.32%, VT 0.69%, CSPX/VUAA 0.33%, VOO/VTI 0.54%.<br><br>Worth noting: the US beat the rest of the world over the past 126 years, but only in hindsight — and the US is already about 65% of the global index today, so buying the world already puts most of your money there. {0}The sections above use a flat 7% for simplicity; the simulator works from the actual historical figures, so it lands a little higher. Educational only, not investment advice.",
      "labAssumeCur": "Amounts are shown in US dollars.",
      "labTLog": "Log scale",
      "labTReal": "Today's purchasing power",
      "labTHist": "Show distribution",
      "labChartAlt": "Chart of the simulation results",
      "labLegMed": "Median",
      "labLegMid": "Middle half (25–75)",
      "labLegMost": "Most outcomes (10–90)",
      "labLegPut": "What you paid in",
      "labStatP10": "Unlucky (10% of runs end below this)",
      "labStatP50": "Median (half better, half worse)",
      "labStatP90": "Lucky (only 10% of runs beat it)",
      "labCagr": "{0}% a year",
      "labOddCost": "Total money paid in",
      "labOddWin": "Chance of ending above what you paid in",
      "labOddDbl": "Chance of at least doubling it",
      "labOddDD": "Worst fall along the way (median)",
      "labDelayH3": "What if you start 10 years later?",
      "labDelayP": "Re-run against the <b>exact same</b> markets. The only difference is the late start.",
      "labDelayNow": "Starting on time (median)",
      "labDelayLate": "10 years late (median)",
      "labDelayGap": "10 years late = {0} less ({1}% lower)",
      "labDelayNone": "Starting late costs nothing with these settings — try a longer total horizon.",
      "labAxisYear": "yr {0}",
      "labHistCap": "Where the final total lands (each bar = % of runs in that range)",
      "labHistLoss": "below cost ←",
      "labHistHi": "→ {0}+",
      "labMkPut": "paid in",
      "labMkMed": "median",
      "labMeta": "{0} · DMS 1900–2025 · real {1}% / vol {2}% · inflation {3}% · cost {4}% → nominal CAGR after costs {5}% (real {6}%) · {7} · paths {8} · seed {9}",
      "labMetaSeq": " · worst {0} years first",
      "labDistNormalShort": "lognormal",
      "labDistT5Short": "fat-tailed t(5)"
    }
  };
  var LANG = document.documentElement.lang || 'zh-HK';
  if (!STR[LANG]) LANG = 'zh-HK';
  var L = STR[LANG], CUR = L.money;

  function t(key) {
    var s = L[key];
    if (s === undefined) s = STR['zh-HK'][key];
    if (s === undefined) return '⟪' + key + '⟫';
    if (arguments.length > 1) {
      var a = arguments;
      s = String(s).replace(/\{(\d)\}/g, function (mm, i) {
        var v = a[+i + 1];
        return v === undefined ? mm : v;
      });
    }
    return s;
  }
  function grp(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fullMoney(v) { return CUR.sym + grp(Math.round(v)); }
  function shortMoney(v) {
    var s = v < 0 ? '-' : '';
    v = Math.abs(v);
    if (v >= 1e6) return s + CUR.sym + (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + 'M';
    if (v >= 1e3) return s + CUR.sym + Math.round(v / 1e3) + 'k';
    return s + CUR.sym + Math.round(v);
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function field(id, label, val, step) {
    return '<div class="tbm-field"><label for="' + id + '">' + esc(label) + '</label>' +
      '<input type="number" id="' + id + '" value="' + val + '" step="' + step + '"></div>';
  }
  function sel(id, label, opts, cur) {
    return '<div class="tbm-field"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '">' +
      opts.map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
      }).join('') + '</select></div>';
  }
  function stat(vid, cid, label, cls) {
    return '<div class="tbm-stat"><b id="' + vid + '" class="' + cls + '">—</b><span>' + esc(label) +
      '</span><em id="' + cid + '">—</em></div>';
  }
  function odd(id, label, cls) {
    return '<div class="tbm-odd"><span>' + esc(label) + '</span><b id="' + id + '" class="' + cls + '">—</b></div>';
  }

  /* ---------- 介面 ---------- */
  root.innerHTML = [
    '<div class="tbm-shell">',
    '<div class="tbm-side">',
    '<h4>', esc(t('labHAsset')), '</h4>',
    '<div class="tbm-pick" role="group" aria-label="', esc(t('labAssetGroupA')), '">',
    '<button type="button" id="tbmGlobal" aria-pressed="true"><strong>', esc(t('labGlobalName')), '</strong><span>', t('labGlobalDesc'), '</span></button>',
    '<button type="button" id="tbmUS" aria-pressed="false"><strong>', esc(t('labUSName')), '</strong><span>', t('labUSDesc'), '</span></button>',
    '</div>',
    '<h4>', esc(t('labHDom')), '</h4>',
    '<div class="tbm-pick" role="group" aria-label="', esc(t('labAssetGroupB')), '">',
    '<button type="button" id="tbmIE" aria-pressed="true"><strong>', esc(t('labIEName')), '</strong><span>', esc(t('labIEDesc')), '<span id="tbmFeeIE"></span></span></button>',
    '<button type="button" id="tbmUSD" aria-pressed="false"><strong>', esc(t('labUSDName')), '</strong><span>', esc(t('labUSDDesc')), '<span id="tbmFeeUS"></span></span></button>',
    '</div>',
    '<h4>', esc(t('labHPlan')), '</h4>',
    '<div class="tbm-row"><label for="tbmMonthly">', esc(t('labMonthly')), '<output id="tbmOMonthly"></output></label>',
    '<input type="range" id="tbmMonthly"></div>',
    '<div class="tbm-row"><label for="tbmPay">', esc(t('labPay')), '<output id="tbmOPay"></output></label>',
    '<input type="range" id="tbmPay" min="1" max="40" step="1" value="10"></div>',
    '<div class="tbm-row"><label for="tbmYears">', esc(t('labYears')), '<output id="tbmOYears"></output></label>',
    '<input type="range" id="tbmYears" min="5" max="40" step="1" value="30"></div>',
    '<button class="tbm-run" id="tbmRun" type="button"></button>',
    '<div class="tbm-prog"><i id="tbmProg"></i></div>',
    '<details class="tbm-adv"><summary>', esc(t('labAdv')), '</summary><div class="tbm-grid2">',
    field('tbmReal', t('labFReal'), '5.2', '0.1'),
    field('tbmSig', t('labFSig'), '17.7', '0.1'),
    field('tbmFee', t('labFFee'), '0.32', '0.01'),
    field('tbmInfl', t('labFInfl'), '2.9', '0.1'),
    sel('tbmDist', t('labFDist'), [['normal', t('labDistNormal')], ['t5', t('labDistT5')]], 'normal'),
    sel('tbmSeq', t('labFSeq'), [['0', t('labSeq0')], ['1', t('labSeq1')], ['3', t('labSeq3')], ['5', t('labSeq5')]], '0'),
    sel('tbmPaths', t('labFPaths'), [['1000', '1,000'], ['2000', '2,000'], ['5000', '5,000']], '2000'),
    field('tbmSeed', t('labFSeed'), '12345', '1'),
    '</div>',
    '<label class="tbm-check"><input type="checkbox" id="tbmIdx" checked> <span>', esc(t('labIdx')), '</span></label>',
    '<p class="tbm-meta" id="tbmMeta">', esc(t('labMetaInit')), '</p>',
    '<p class="tbm-assume">', t('labAssume').replace('{0}', t('labAssumeCur')), '</p>',
    '</details>',
    '</div>',
    '<div class="tbm-main">',
    '<div class="tbm-toggles">',
    '<button type="button" id="tbmTLog" aria-pressed="false">', esc(t('labTLog')), '</button>',
    '<button type="button" id="tbmTReal" aria-pressed="false">', esc(t('labTReal')), '</button>',
    '<button type="button" id="tbmTHist" aria-pressed="false">', esc(t('labTHist')), '</button>',
    '</div>',
    '<div class="tbm-cvbox" id="tbmCvbox"><canvas id="tbmCv" role="img" aria-label="', esc(t('labChartAlt')), '"></canvas></div>',
    '<div class="tbm-legend">',
    '<span><i class="k-med"></i>', esc(t('labLegMed')), '</span>',
    '<span><i class="k-mid"></i>', esc(t('labLegMid')), '</span>',
    '<span><i class="k-most"></i>', esc(t('labLegMost')), '</span>',
    '<span><i class="k-put"></i>', esc(t('labLegPut')), '</span>',
    '</div>',
    '<div class="tbm-stats">',
    stat('tbmP10', 'tbmC10', t('labStatP10'), 'lo'),
    stat('tbmP50', 'tbmC50', t('labStatP50'), 'mid'),
    stat('tbmP90', 'tbmC90', t('labStatP90'), 'hi'),
    '</div>',
    '<div class="tbm-bottom"><div class="tbm-odds">',
    odd('tbmCost', t('labOddCost'), ''),
    odd('tbmWin', t('labOddWin'), 'good'),
    odd('tbmDbl', t('labOddDbl'), ''),
    odd('tbmDD', t('labOddDD'), 'bad'),
    '</div>',
    '<div class="tbm-delay"><h4>', esc(t('labDelayH3')), '</h4><p>', t('labDelayP'), '</p>',
    '<div class="tbm-delaygrid">',
    '<div><span>', esc(t('labDelayNow')), '</span><b id="tbmDNow" class="good">—</b></div>',
    '<div><span>', esc(t('labDelayLate')), '</span><b id="tbmDLate">—</b></div>',
    '</div><p class="tbm-delayline" id="tbmDGap">—</p></div>',
    '</div></div></div>'
  ].join('');

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 顏色：全部由 CSS 變數攞，深色模式跟得住 ---------- */
  var C = {};
  function rgba(col, a) {
    col = String(col).trim();
    var m = col.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      var h = m[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' +
        parseInt(h.slice(4, 6), 16) + ',' + a + ')';
    }
    var n = col.match(/rgba?\(([^)]+)\)/);
    if (n) { var p = n[1].split(/[,\s\/]+/); return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')'; }
    return col;
  }
  function readColors() {
    var cs = getComputedStyle(root);
    function v(name, fb) { var x = cs.getPropertyValue(name); return (x && x.trim()) || fb; }
    C.blue = v('--chart-blue', '#2563a8');
    C.amber = v('--chart-amber', '#c26a1b');
    C.rose = v('--chart-rose', '#ad3a70');
    C.fg = v('--md-default-fg-color', '#14171a');
    C.dim = v('--md-default-fg-color--light', '#5c6066');
    C.grid = v('--md-default-fg-color--lightest', 'rgba(0,0,0,.07)');
    C.band1 = rgba(C.blue, 0.14);
    C.band2 = rgba(C.blue, 0.30);
    C.histMid = rgba(C.blue, 0.45);
  }
  readColors();

  /* ---------- RNG（有種子，跑幾多次都一樣） ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var x = Math.imul(a ^ a >>> 15, 1 | a);
      x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x;
      return ((x ^ x >>> 14) >>> 0) / 4294967296;
    };
  }
  function makeNormal(rand) {
    var spare = null;
    return function () {
      if (spare !== null) { var s = spare; spare = null; return s; }
      var u, v, s2;
      do { u = rand() * 2 - 1; v = rand() * 2 - 1; s2 = u * u + v * v; } while (s2 >= 1 || s2 === 0);
      var f = Math.sqrt(-2 * Math.log(s2) / s2);
      spare = v * f; return u * f;
    };
  }

  /* ---------- 模型 ---------- */
  function buildCfg(delayYears) {
    var real = +$('tbmReal').value / 100,
        sig = +$('tbmSig').value / 100,
        fee = +$('tbmFee').value / 100,
        infl = +$('tbmInfl').value / 100,
        years = +$('tbmYears').value,
        payY = Math.min(+$('tbmPay').value, years - delayYears);
    var g = (1 + real) * (1 + infl) - 1;          /* 名義幾何回報 */
    /* 精確反推對數常態參數：給定幾何均值 g 同簡單回報標準差 sig，
       m = ln(1+g)；若 u = e^(s²)，則 (sig/(1+g))² = u² − u → u = (1+√(1+4k))/2 */
    var m = Math.log(1 + g),
        k = Math.pow(sig / (1 + g), 2),
        s2 = Math.log((1 + Math.sqrt(1 + 4 * k)) / 2),
        sigL = Math.sqrt(s2),
        muL = m + Math.log(1 - fee);
    return {
      months: years * 12, payMonths: Math.max(0, payY) * 12, delay: delayYears * 12,
      monthly: +$('tbmMonthly').value,
      muM: muL / 12, sigM: sigL / Math.sqrt(12),
      netCagr: Math.exp(muL) - 1,
      netReal: Math.exp(muL) / (1 + infl) - 1,
      infl: infl, indexContrib: $('tbmIdx').checked,
      dist: $('tbmDist').value, seq: +$('tbmSeq').value,
      paths: +$('tbmPaths').value, seed: +$('tbmSeed').value,
      years: years
    };
  }

  function runSim(cfg, onProgress, onDone) {
    var rand = mulberry32(cfg.seed), nrm = makeNormal(rand),
        NU = 5, tScale = Math.sqrt((NU - 2) / NU),
        M = cfg.months, Y = cfg.years, P = cfg.paths,
        yearly = [], p = 0, i;
    for (i = 0; i <= Y; i++) yearly.push(new Float64Array(P));
    var ends = new Float64Array(P), cagrs = new Float64Array(P), dds = new Float64Array(P),
        r = new Float64Array(M), yr = new Float64Array(Y), ord = new Int32Array(Y),
        tmp = new Float64Array(M), contribTotal = 0;

    function draw() {
      if (cfg.dist === 'normal') return nrm();
      var w = 0, k;                              /* t(5)：卡方(5) 由 5 個常態平方和造 */
      for (k = 0; k < NU; k++) { var z = nrm(); w += z * z; }
      return nrm() / Math.sqrt(w / NU) * tScale;
    }

    function onePath(pi) {
      var m, y;
      for (m = 0; m < M; m++) r[m] = cfg.muM + cfg.sigM * draw();
      if (cfg.seq > 0 && Y > cfg.seq) {          /* 次序風險：最差嗰幾年排最前 */
        for (y = 0; y < Y; y++) { var s = 0; for (m = 0; m < 12; m++) s += r[y * 12 + m]; yr[y] = s; ord[y] = y; }
        var arr = Array.prototype.slice.call(ord).sort(function (a, b) { return yr[a] - yr[b]; });
        var worst = arr.slice(0, cfg.seq).sort(function (a, b) { return a - b; });
        var isW = {}; worst.forEach(function (v) { isW[v] = 1; });
        var rest = []; for (y = 0; y < Y; y++) if (!isW[y]) rest.push(y);
        var order = worst.concat(rest), tt = 0;
        for (y = 0; y < Y; y++) for (m = 0; m < 12; m++) tmp[tt++] = r[order[y] * 12 + m];
        r.set(tmp);
      }
      var bal = 0, idx = 1, peak = 1, mdd = 0, ctb = 0;
      for (m = 0; m < M; m++) {
        var g = Math.exp(r[m]);
        bal *= g; idx *= g;
        if (idx > peak) peak = idx;
        var dd = idx / peak - 1; if (dd < mdd) mdd = dd;
        if (m >= cfg.delay && m < cfg.delay + cfg.payMonths) {
          var c = cfg.indexContrib ? cfg.monthly * Math.pow(1 + cfg.infl, Math.floor(m / 12)) : cfg.monthly;
          bal += c; ctb += c;
        }
        if ((m + 1) % 12 === 0) yearly[(m + 1) / 12][pi] = bal;
      }
      ends[pi] = bal; cagrs[pi] = Math.pow(idx, 12 / M) - 1; dds[pi] = mdd;
      if (pi === 0) contribTotal = ctb;          /* 供款唔受回報影響，條條路徑一樣 */
    }

    (function chunk() {                          /* 250 條一批，讓返 main thread */
      var stop = Math.min(p + 250, P);
      for (; p < stop; p++) onePath(p);
      onProgress(p / P);
      if (p < P) setTimeout(chunk, 0);
      else onDone({ yearly: yearly, ends: ends, cagrs: cagrs, dds: dds, contrib: contribTotal, cfg: cfg });
    })();
  }

  /* ---------- 統計 ---------- */
  function pct(sorted, q) {
    var i = (sorted.length - 1) * q, lo = Math.floor(i), hi = Math.ceil(i);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
  }
  function sortedCopy(ta) { return Float64Array.from(ta).sort(); }
  function share(arr, thr) { var n = 0; for (var i = 0; i < arr.length; i++) if (arr[i] >= thr) n++; return n / arr.length; }
  /* 排序結果 cache 落結果物件本身 —— RES / LATE 每次 run 都係新物件，所以唔使手動清 */
  function sortedEnds() { return RES._e || (RES._e = sortedCopy(RES.ends)); }
  function sortedCagrs() { return RES._c || (RES._c = sortedCopy(RES.cagrs)); }
  function sortedDds() { return RES._d || (RES._d = sortedCopy(RES.dds)); }
  function sortedLate() { return LATE._e || (LATE._e = sortedCopy(LATE.ends)); }

  var RES = null, LATE = null, showLog = false, showReal = false, showHist = false;
  /* DMS 1900–2025：實質幾何回報 % / 名義年波幅 % */
  var ASSET = { global: { real: 5.2, sig: 17.7, name: t('labGlobalName') },
                us: { real: 6.6, sig: 20.3, name: t('labUSName') } };
  /* 每年總成本 %（基金費 + 股息預扣稅拖累，非美稅務居民） */
  var COST = { global: { ie: 0.32, us: 0.69 }, us: { ie: 0.33, us: 0.54 } };
  var curAsset = 'global', curDom = 'ie';

  /* ---------- 畫圖 ---------- */
  var cv = $('tbmCv'), ctx = cv.getContext('2d'), box = $('tbmCvbox');
  var MONO = '10px ui-monospace,SFMono-Regular,Menlo,monospace';
  function sizeCanvas() {
    var w = box.clientWidth, h = box.clientHeight, dpr = window.devicePixelRatio || 1;
    if (!h) h = window.innerWidth < 560 ? 250 : 280;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h };
  }
  function defl(v, yearIdx) { return showReal ? v / Math.pow(1 + RES.cfg.infl, yearIdx) : v; }

  function drawFan() {
    if (!RES) return;
    var d = sizeCanvas(), W = d.w, H = d.h,
        L2 = 52, R = 10, T = 14, B = 26,
        Y = RES.cfg.years, i, bands = [[0.10, 0.90], [0.25, 0.75]];
    ctx.clearRect(0, 0, W, H);
    /* 每年嘅排序結果 cache 落 RES —— 一次 run 只排一次。
       以前每次 render（撳 toggle、拉窗、轉手機方向）都重排 31 × 2,000 個數。 */
    if (!RES._P) {
      RES._P = [];
      for (i = 0; i <= Y; i++) RES._P.push(i === 0 ? null : sortedCopy(RES.yearly[i]));
    }
    var P = RES._P;
    function val(i2, q) { return i2 === 0 ? 0 : defl(pct(P[i2], q), i2); }
    var top = 0;
    for (i = 1; i <= Y; i++) top = Math.max(top, val(i, 0.95));
    var cum = [], run = 0;
    for (i = 0; i <= Y; i++) {
      if (i > 0) for (var mo = 0; mo < 12; mo++) {
        var m2 = (i - 1) * 12 + mo;
        if (m2 >= RES.cfg.delay && m2 < RES.cfg.delay + RES.cfg.payMonths)
          run += RES.cfg.indexContrib ? RES.cfg.monthly * Math.pow(1 + RES.cfg.infl, Math.floor(m2 / 12)) : RES.cfg.monthly;
      }
      cum.push(defl(run, i));
    }
    var lo = showLog ? Math.max(1000, val(1, 0.10) || 1000) : 0;
    top = Math.max(top, cum[Y]) * 1.06;
    function X(i2) { return L2 + (W - L2 - R) * i2 / Y; }
    function Yp(v) {
      if (showLog) {
        var a = Math.log10(Math.max(v, lo)), b = Math.log10(lo), t2 = Math.log10(top);
        return T + (H - T - B) * (1 - (a - b) / (t2 - b));
      }
      return T + (H - T - B) * (1 - v / top);
    }
    ctx.font = MONO; ctx.fillStyle = C.dim; ctx.textAlign = 'right';
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    var ticks = showLog
      ? (function () { var a = [], e = Math.ceil(Math.log10(lo)); for (; Math.pow(10, e) <= top; e++) a.push(Math.pow(10, e)); return a; })()
      : [0, 0.25, 0.5, 0.75, 1].map(function (f) { return top * f; });
    /* 左邊留幾多位由最闊嗰個刻度字決定。寫死 52 係按 "$2.80M" 度嘅，"NT$43.9M" 會頂到格線。 */
    var tickTxt = ticks.map(function (v) { return v === 0 ? '0' : shortMoney(v); }), wid = 0;
    tickTxt.forEach(function (s2) { wid = Math.max(wid, ctx.measureText(s2).width); });
    L2 = Math.min(Math.max(52, Math.ceil(wid) + 14), Math.round(W * 0.42));
    ticks.forEach(function (v, ti) {
      var y = Yp(v);
      ctx.beginPath(); ctx.moveTo(L2, y); ctx.lineTo(W - R, y); ctx.stroke();
      ctx.fillText(tickTxt[ti], L2 - 7, y + 3);
    });
    ctx.textAlign = 'center';
    /* 年份刻度要夾返喺畫布入面 —— 英文係 'yr 30',闊過中文嘅 '30年',
       最後嗰個 label 置中就會俾右邊切一半。 */
    for (i = 0; i <= Y; i += Math.max(5, Math.round(Y / 6 / 5) * 5)) {
      var lb = t('labAxisYear', i), lw = ctx.measureText(lb).width / 2;
      ctx.fillText(lb, Math.min(Math.max(X(i), L2 - lw + 6), W - lw), H - 8);
    }
    var fills = [C.band1, C.band2];
    bands.forEach(function (bd, bi) {
      ctx.beginPath();
      for (i = 0; i <= Y; i++) { var x = X(i), y = Yp(val(i, bd[1])); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (i = Y; i >= 0; i--) ctx.lineTo(X(i), Yp(val(i, bd[0])));
      ctx.closePath(); ctx.fillStyle = fills[bi]; ctx.fill();
    });
    ctx.beginPath(); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.amber; ctx.lineWidth = 1.6;
    for (i = 0; i <= Y; i++) { var x1 = X(i), y1 = Yp(cum[i]); i ? ctx.lineTo(x1, y1) : ctx.moveTo(x1, y1); }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.strokeStyle = C.blue; ctx.lineWidth = 2.4;
    for (i = 0; i <= Y; i++) { var x2 = X(i), y2 = Yp(val(i, 0.5)); i ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2); }
    ctx.stroke();
  }

  function drawHist() {
    var d = sizeCanvas(), W = d.w, H = d.h, L2 = 10, R = 10, T = 14, B = 30;
    ctx.clearRect(0, 0, W, H);
    var s = sortedEnds(), Yl = RES.cfg.years;
    var hi = defl(pct(s, 0.97), Yl), N = 44, bins = new Array(N).fill(0), i;
    for (i = 0; i < s.length; i++) {
      var v = defl(s[i], Yl), k = Math.min(N - 1, Math.floor(v / hi * N));
      if (k >= 0) bins[k]++;
    }
    var mx = Math.max.apply(null, bins), bw = (W - L2 - R) / N;
    var ctb = defl(RES.contrib, Yl), med = defl(pct(s, 0.5), Yl);
    for (i = 0; i < N; i++) {
      var h = (H - T - B) * bins[i] / mx, x = L2 + i * bw, mid = (i + 0.5) / N * hi;
      ctx.fillStyle = mid < ctb ? C.rose : (mid < med ? C.histMid : C.blue);
      ctx.fillRect(x, H - B - h, bw - 1.5, h);
    }
    [[ctb, C.amber, t('labMkPut')], [med, C.fg, t('labMkMed')]].forEach(function (mk) {
      var x = L2 + (W - L2 - R) * Math.min(mk[0] / hi, 1);
      ctx.beginPath(); ctx.setLineDash([4, 3]); ctx.strokeStyle = mk[1]; ctx.lineWidth = 1.4;
      ctx.moveTo(x, T); ctx.lineTo(x, H - B); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = mk[1]; ctx.font = MONO; ctx.textAlign = 'center';
      ctx.fillText(mk[2], x, T + 9);
    });
    ctx.fillStyle = C.dim; ctx.font = MONO;
    ctx.textAlign = 'left'; ctx.fillText(t('labHistLoss'), L2, H - 10);
    ctx.textAlign = 'right'; ctx.fillText(t('labHistHi', shortMoney(hi)), W - R, H - 10);
    ctx.textAlign = 'center'; ctx.fillText(t('labHistCap'), W / 2, H - 10);
  }

  function render() {
    if (!RES) return;
    showHist ? drawHist() : drawFan();
    /* ⚠ 下面個 forEach 參數千祈唔好叫 t —— 會喺呢個 scope 影死全域嘅 t() 查表函數 */
    var Yl = RES.cfg.years, s = sortedEnds(), cg = sortedCagrs(), dd = sortedDds();
    [[0.10, 'tbmP10', 'tbmC10'], [0.50, 'tbmP50', 'tbmC50'], [0.90, 'tbmP90', 'tbmC90']].forEach(function (row) {
      $(row[1]).textContent = shortMoney(defl(pct(s, row[0]), Yl));
      $(row[2]).textContent = t('labCagr', (pct(cg, row[0]) * 100).toFixed(1));
    });
    $('tbmCost').textContent = fullMoney(defl(RES.contrib, Yl));
    $('tbmWin').textContent = (share(RES.ends, RES.contrib) * 100).toFixed(1) + '%';
    $('tbmDbl').textContent = (share(RES.ends, RES.contrib * 2) * 100).toFixed(1) + '%';
    $('tbmDD').textContent = (pct(dd, 0.5) * 100).toFixed(1) + '%';
    if (LATE) {
      var a = pct(s, 0.5), b = pct(sortedLate(), 0.5);
      $('tbmDNow').textContent = shortMoney(defl(a, Yl));
      $('tbmDLate').textContent = shortMoney(defl(b, Yl));
      $('tbmDGap').textContent = b < a
        ? t('labDelayGap', shortMoney(a - b), ((1 - b / a) * 100).toFixed(0))
        : t('labDelayNone');
    }
    $('tbmMeta').textContent = t('labMeta',
      ASSET[curAsset].name, $('tbmReal').value, $('tbmSig').value, $('tbmInfl').value, $('tbmFee').value,
      (RES.cfg.netCagr * 100).toFixed(2), (RES.cfg.netReal * 100).toFixed(2),
      t(RES.cfg.dist === 'normal' ? 'labDistNormalShort' : 'labDistT5Short'),
      RES.cfg.paths.toLocaleString(), RES.cfg.seed)
      + (RES.cfg.seq ? t('labMetaSeq', RES.cfg.seq) : '');
  }

  /* ---------- 接線 ---------- */
  function fmtSliders() {
    if (+$('tbmPay').value > +$('tbmYears').value) $('tbmPay').value = $('tbmYears').value;
    $('tbmOMonthly').textContent = fullMoney(+$('tbmMonthly').value);
    $('tbmOPay').textContent = t('labYearsVal', $('tbmPay').value);
    $('tbmOYears').textContent = t('labYearsVal', $('tbmYears').value);
  }
  /* 每月供款嘅範圍同預設跟語言行（模型冇貨幣概念，乘幾多都係同一條數） */
  $('tbmMonthly').min = CUR.min; $('tbmMonthly').max = CUR.max;
  $('tbmMonthly').step = CUR.step; $('tbmMonthly').value = CUR.monthly;
  ['tbmMonthly', 'tbmPay', 'tbmYears'].forEach(function (id) { $(id).addEventListener('input', fmtSliders); });
  fmtSliders();

  var pendingRerun = false;
  function applyPreset(rerun) {
    $('tbmGlobal').setAttribute('aria-pressed', curAsset === 'global');
    $('tbmUS').setAttribute('aria-pressed', curAsset === 'us');
    $('tbmIE').setAttribute('aria-pressed', curDom === 'ie');
    $('tbmUSD').setAttribute('aria-pressed', curDom === 'us');
    $('tbmReal').value = ASSET[curAsset].real;
    $('tbmSig').value = ASSET[curAsset].sig;
    $('tbmFee').value = COST[curAsset][curDom].toFixed(2);
    $('tbmFeeIE').textContent = t('labFee', COST[curAsset].ie.toFixed(2));
    $('tbmFeeUS').textContent = t('labFee', COST[curAsset].us.toFixed(2));
    /* 跑緊嗰陣個掣係 disabled，直接 click() 會靜靜雞唔見咗次重跑 */
    if (rerun && RES) { if ($('tbmRun').disabled) pendingRerun = true; else $('tbmRun').click(); }
  }
  $('tbmGlobal').addEventListener('click', function () { curAsset = 'global'; applyPreset(true); });
  $('tbmUS').addEventListener('click', function () { curAsset = 'us'; applyPreset(true); });
  $('tbmIE').addEventListener('click', function () { curDom = 'ie'; applyPreset(true); });
  $('tbmUSD').addEventListener('click', function () { curDom = 'us'; applyPreset(true); });
  applyPreset(false);

  function toggle(id, get, set) {
    $(id).addEventListener('click', function () {
      set(!get());
      $(id).setAttribute('aria-pressed', get());
      render();
    });
  }
  toggle('tbmTLog', function () { return showLog; }, function (v) { showLog = v; });
  toggle('tbmTReal', function () { return showReal; }, function (v) { showReal = v; });
  toggle('tbmTHist', function () { return showHist; }, function (v) { showHist = v; });

  $('tbmRun').addEventListener('click', function () {
    var btn = $('tbmRun');
    btn.disabled = true; btn.textContent = t('labRunning');
    $('tbmProg').style.width = '0%';
    runSim(buildCfg(0),
      function (f) { $('tbmProg').style.width = (f * 50).toFixed(0) + '%'; },
      function (res) {
        RES = res;
        runSim(buildCfg(10),                     /* 用完全一樣嘅種子重跑「遲 10 年」 */
          function (f) { $('tbmProg').style.width = (50 + f * 50).toFixed(0) + '%'; },
          function (late) {
            LATE = late; render();
            btn.disabled = false;
            btn.textContent = t('labRerun', (+$('tbmPaths').value).toLocaleString());
            setTimeout(function () { $('tbmProg').style.width = '0%'; }, 500);
            if (pendingRerun) { pendingRerun = false; btn.click(); }
          });
      });
  });
  $('tbmPaths').addEventListener('change', function () {
    $('tbmRun').textContent = t('labRun', (+this.value).toLocaleString());
  });
  $('tbmRun').textContent = t('labRun', (+$('tbmPaths').value).toLocaleString());

  /* resize 要 debounce：手機收埋／彈返個網址列都會連環發 resize */
  var rsz = null;
  window.addEventListener('resize', function () {
    if (!RES) return;
    clearTimeout(rsz);
    rsz = setTimeout(render, 120);
  });
  /* 撳 Material 個燈掣 → 重讀顏色再畫過 */
  if (window.MutationObserver) {
    new MutationObserver(function () { readColors(); render(); })
      .observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
  }
  /* 捲到入視野先跑第一次，唔好一入頁就搶 CPU */
  var fired = false;
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !fired) { fired = true; $('tbmRun').click(); io2.disconnect(); }
    }, { threshold: 0.15 });
    io2.observe(root);
  } else { $('tbmRun').click(); }
})();
