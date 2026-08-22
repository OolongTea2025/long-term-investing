/* ============================================================
   廣東話 —— 基準語言（canonical）

   場景、偏誤、結局嘅正文唔喺呢度，佢哋原封不動住喺
   scen1/2/3.js · bias.js · judge.js。呢度淨係放：

     · ui{}    ui.js 同 shell.html 用嘅介面字串
     · cur{}   貨幣（港元，倍率 1）
     · levels  財富階梯門檻，同教學網 level.md 一致

   其他語言（lang/zh-TW.js）係 overlay，key 對得返呢度就會蓋上去。
   ============================================================ */

LANGS['zh-HK'] = {
code: 'zh-HK', htmlLang: 'zh-HK', label: '廣東話',
cur: { sym: '$', rate: 1 },

/* 門檻用「顯示貨幣」計。模型內部個數 × cur.rate 之後先同呢度比。 */
levels: [
  [1e5,      'Level 1', '$10萬以下'],
  [1e6,      'Level 2', '$10萬 – $100萬'],
  [1e7,      'Level 3', '$100萬 – $1,000萬'],
  [5e7,      'Level 4', '$1,000萬 – $5,000萬'],
  [Infinity, 'Level 5', '$5,000萬以上']
],

ui: {
/* ---- shell.html（靜態版面）---- */
docTitle:     '烏龍茶的投資人生',
metaDesc:     '一個關於認知偏誤嘅廣東話互動故事。七十個決定，二十年，一個乜都冇做嘅對照組。',
titleEyebrow: '投資行為模擬',
titleMain:    '烏龍茶的<br>投資人生',
titleSub:     '七十個決定 · 二十年 · 一個對照組',
nameLabel:    '你嘅名',
btnStart:     '開始',
btnContinue:  '繼續上次進度',
titleNote:    '你三十歲，有 <b>{0}</b>，每個季度儲到啲錢。<br>' +
              '有個叫 <b>Mike</b> 嘅人同你一齊開始。佢第一日買晒指數基金，<br>' +
              '之後每個季度照供，二十年冇再做過任何嘢。<br><br>' +
              '遊戲完咗會話你知：你同佢嘅差距，<br>究竟係邊幾樣嘢造成，每樣值幾多錢。',
backToSite:   '← 返《長線投資入門》',
hudYou:       '你',
hudGap:       '差距',
logTitle:     '決定紀錄',
setTitle:     '設定',
chartZoom:    '點一下放大',
chartHint:    '你 vs Mike',
btnNextSpaced:'繼 續',
btnNext:      '繼續',
logHead:      '你嘅決定紀錄',
btnClose:     '閂',
setHead:      '設定',
setSpeed:     '文字速度',
spdSlow:      '慢',
spdNormal:    '正常',
spdFast:      '快',
spdInstant:   '即時',
setSound:     '音樂同音效',
setTags:      '顯示偏誤標籤',
onLabel:      '開',
offLabel:     '閂',
setFoot:      '「顯示偏誤標籤」會喺每個選項旁邊寫明佢對應邊種認知偏誤。' +
              '打完一次之後預設會開。你會發現：就算明知係偏誤，你依然想揀。',
setLang:      '語言',

/* ---- engine.js ---- */
defaultName:  '烏龍茶',
extraOptTxt:  '（將閒置現金投返落市場）',
extraOptRes:  '你將擺喺一邊嘅現金投返落去。',
extraOptWhy:  '你今次喺場外坐咗 {0} 個回合。呢段時間市場升定跌，你都冇份。',

/* ---- 回合迴圈 ---- */
turnWhen:     '第 {0} 年 · {1}歲',
tagForced:    '強制平倉',
forcedWhy:    '你嘅自有資金跌穿咗維持水平，券商幫你斬咗倉。' +
              '你唔係揀走 —— 你係被人趕走，而且要俾滑點。',
chartOutBand: '淺色 = 你唔喺市場嗰啲回合',

/* ---- 階段結算 ---- */
rvTitle20:    '新手期結算',
rvTitle45:    '中手期結算',
kvYourRet:    '你嘅回報',
kvMikeRet:    'Mike 回報',
kvYourNav:    '你嘅淨值',
kvMikeNav:    'Mike 淨值',
kvMaxDD:      '最大回撤',
kvEmoDec:     '情緒決定',
kvTradeCost:  '累計買賣成本',
kvOutTurns:   '唔喺市場嘅回合',
unitTimes:    '{0} / {1} 次',
unitCount:    '{0} 個',
rvVerdictWin: '呢個階段你跑贏咗 Mike。要留意嘅係：短期跑贏可以純粹係波幅，' +
              '唔一定係技術。你係咪承受咗更大風險換返嚟？',
rvVerdictTie: '你同 Mike 差唔多。但你做咗好多決定，佢乜都冇做。' +
              '同樣結果之下，你付出咗時間、精神同手續費。',
rvVerdictSoft:'你落後咗 Mike。差距睇落唔算大，但呢個就係「溫水煮蛙」嘅開始 —— ' +
              '每個階段輸少少，複利落去就係一層樓。',
rvVerdictBad: '你明顯落後。而家係最好嘅檢討時機：你嘅損失係嚟自市場，定係嚟自你自己嘅決定？',
rvBiasHead:   '呢個階段你最常觸發嘅偏誤：',
rvBiasNone:   '呢個階段你冇觸發過任何認知偏誤。',
btnSave:      '儲存進度',
btnSaved:     '已儲存 ✓',
btnSaveFail:  '儲存失敗',

/* ---- 決定紀錄 ---- */
logEmpty:     '仲未有決定。',
logTurn:      '第 {0} 回合 · 第 {1} 年',

/* ---- 結局 ---- */
eTag:         '第 {0} 回合 · {1} 年 · {2} · 最終 {3}',
secCompare:   '最終對照',
statYou:      '你（{0}）',
statMike:     'Mike（指數，乜都冇做）',
statGap:      '差距',
statGapAmt:   '相差金額',
statYourLvl:  '你嘅財富階梯',
statMikeLvl:  'Mike 嘅財富階梯',
footTotalIn:  '二十年入面你總共投入咗 {0}（起步 {1} + 儲蓄 {2}）。',
footLadder:   '階梯分級同教學網一致，見 {0}。',
footLadderCh: '退休篇',

noteLucky:    '<b>你贏咗，但唔係因為你叻。</b><br><br>' +
              '我哋攞你實際做過嘅 {0} 個決定，原封不動咁擺去 400 個唔同嘅市場歷史入面重跑。' +
              '同一套行為，唔同嘅市場：<b>只有 {1}% 嘅時空你會跑贏 Mike</b>，' +
              '中位數係佢嘅 {2} 倍。<br><br>' +
              '你今次贏咗，係因為你今次抽中咗嗰條路。你嘅做法本身冇優勢。',
noteAlpha:    '<b>而且唔係彩數。</b><br><br>' +
              '同一套行為擺去 400 個唔同市場，<b>{0}% 嘅時空你都跑贏</b>。' +
              '呢個唔係運氣，係結構性優勢。<br><br>' +
              '但你要睇清楚你贏喺邊 —— 睇返下面「你嘅人工」嗰一行。',
noteWuWei:    '<b>你做到咗最難嗰樣嘢。</b><br><br>' +
              '你嘅結果同 Mike 幾乎一模一樣。呢個唔係打和，呢個就係目標本身 —— ' +
              '因為 Mike 嘅回報就係市場嘅回報，而市場嘅回報，已經係絕大部分人攞唔到嘅嘢。',

secAttr:      '差距係邊度嚟嘅',
attrIntro:    '我哋攞返你今次玩嗰條一模一樣嘅市場路徑，同你一模一樣嘅七十個決定，' +
              '每次淨係熄咗其中一樣嘢再重跑一次。分別就係嗰樣嘢嘅代價。',
attrCost:     '交易成本',
attrCostWhy:  '買賣佣金、印花稅、價差、基金費用。',
attrTiming:   '唔喺市場',
attrTimingWhy:'你沽咗貨、或者留住現金冇入場嗰啲回合。',
attrConc:     '集中持倉',
attrConcWhy:  '押重注落單一注碼，包括爆地雷嘅風險。',
attrLev:      '槓桿',
attrLevWhy:   '借錢嘅利息，加上被強制平倉嘅損失。',
attrIncome:   '你嘅人工',
attrIncomeWhy:'事業選擇令你儲蓄增長快咗（或者慢咗）。',
attrNote:     '呢五個數字加埋唔會啱啱好等於總差距。' +
              '因為佢哋互相影響 —— 舉個例，如果你冇用槓桿，你嗰次強制平倉就唔會發生，' +
              '咁你被逼賣出嘅成本亦都會消失。<br><br>' +
              '四樣一齊熄嘅話：你會有 <b>{0}</b>，即係比而家多 {1}。<br><br>' +
              '<b>值得留意嘅係邊個數字最穩定。</b>成本係唯一一樣一定發生、' +
              '而且完全喺你控制範圍之內嘅嘢。集中同擇時係賭博 —— ' +
              '有時幫到你，有時害死你，但長期期望值係負。',

secCostDetail:'成本明細',
statTradeCost:'買賣成本（佣金／印花稅／價差）',
statFundFee:  '基金／產品費用',
statMargin:   '孖展利息',
statSpent:    '課程、訂閱、借出去嘅錢',
statForced:   '強制平倉次數',
statOutTurns: '唔喺市場嘅回合',
statEmoDec:   '情緒驅動嘅決定',
unitTimesN:   '{0} 次',
unitOutOf:    '{0} / {1} 個',

secMC:        '同樣嘅行為，四百個平行時空',
mcYou:        '你今次',
mcTxt:        '每一條柱 = 一個平行時空。橫軸係你最後有 Mike 嘅幾多倍。<br><br>' +
              '· 跑贏 Mike 嘅時空：<b>{0}%</b><br>' +
              '· 中位數：Mike 嘅 <b>{1}</b> 倍<br>' +
              '· 你今次嘅結果排喺第 <b>{2}</b> 百分位<br><br>{3}',
mcHigh:       '今次嘅行情對你嘅做法特別友好。同一套嘢，大部分時空結果差好遠。',
mcLow:        '今次嘅行情對你嘅做法特別唔友好。不過就算喺最好嘅時空，呢套做法嘅期望值一樣有限。',
mcMid:        '你今次嘅結果，喺你自己做法嘅正常範圍之內。',

secBias:      '你嘅偏誤，同要補返邊一課',
biasNone:     '你冇觸發過任何認知偏誤。呢個非常罕見。',
secKey:       '關鍵決定回顧',
keyNone:      '冇偏誤決定可以回顧。',
keyPicked:    '你揀咗：{0}',
keyAlt:       '另一個選擇：{0}',

secMike:      'Mike 嘅二十年',
mikeFoot:     '佢做咗大約五十次交易，全部係月供。佢冇睇過盤，冇追過消息，冇同人爭論過。' +
              '佢嘅回報，就係市場本身嘅回報。<br><br>' +
              '呢個遊戲唔係想話你聽「你贏唔到」。係想話你聽：<b>你唔使贏。</b>' +
              '攞到市場本身嘅回報，已經打贏咗絕大部分落場嘅人 —— 而攞到佢，唔需要技術，' +
              '只需要你喺二十年入面，每一次心郁郁嗰陣，都揀唔郁。',

secNext:      '跟住去邊',
nextCh6:      '點樣對付上面嗰啲偏誤',
nextCh2:      '費用點樣蠶食你嘅回報',
nextCh3:      '點解分散唔係「買多幾隻」',
nextCh5:      '實際上第一個組合應該點砌',
nextApA:      '點樣分辨真定假嘅投資主張',

btnAgain:     '再玩一次',
btnNg2:       '開住偏誤標籤再玩',
btnToSite:    '返教學網',
endFoot:      '開住偏誤標籤，每個選項旁邊會寫明佢對應邊種偏誤。' +
              '你會發現：就算你明知係偏誤，你依然想揀。',

/* ---- 標題頁「繼續」---- */
contInfo:     '{0} · 第 {1} 回合 · {2}',
contFail:     '讀取失敗，請開新遊戲'
}
};
