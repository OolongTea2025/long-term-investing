/* ============================================================
   場景 — 新手期（第 1-20 回合，第 0-5 年，30-35 歲）

   d{} 嘅意思（全部都係真嘢，冇一樣係「暗中扣分」）：
     inv     設定投入市場嘅比例 0..1
     dInv    相對調整投入比例
     conc    調整集中度（+ 係更集中）
     lev     設定槓桿倍數        dLev  相對調整
     churn   呢個回合自主買賣次數（直接變成交易成本）
     vol     嗰注有幾投機（1 = 大路，4 = 賭場）
     dca     1 = 開咗長期定額計劃
     indexed 1 = 啲錢擺咗落廣泛指數基金（同時會令集中度歸零）
     cashOut 一次性現金支出，佔淨值比例
     income  人工增長率調整 —— 唯一一條唔靠運氣嘅跑贏路
     ego / disc / health  純敘事計數，唔會直接影響回報
   ============================================================ */

var SCEN_ROOKIE = [
{id:1,bg:'HOME_NIGHT',spr:['wulong','rookie'],who:null,
 sig:'指數連續第五日新高。財經版標題：「牛市確立」。',
 txt:'你三十歲。戶口入面有 30 萬。你望住個綠色嘅螢幕，個心跳得好快。呢個係你第一次認真諗「投資」呢兩個字。',
 opts:[
  {t:'All-in 落去，趁勢頭好',b:'recency',d:{ego:8,disc:-10,inv:1,conc:0.2,churn:0.4},r:'你成筆錢掟晒落去。個心又驚又興奮。'},
  {t:'買一半，留一半現金',b:null,d:{disc:5,inv:0.5,conc:0.1,churn:0.2},r:'你買咗一半。留返啲彈藥，感覺穩陣啲。'},
  {t:'先睇多陣，等回調先入',b:'anchoring',d:{disc:-2,inv:0},r:'你決定等。個指數繼續升。'},
  {t:'每個月定額入，唔理價位',b:null,d:{disc:12,inv:0.3,dca:1,indexed:1,churn:0.05},r:'你設定咗每月自動買入。悶，但你唔使再諗。',
   why:'定額計劃會慢慢將你嘅儲蓄自動推入市場，唔使你每次判斷「而家係咪好時機」。'}
 ]},
{id:2,bg:'APP_VOID',spr:['wulong','rookie_excited'],who:null,
 sig:'你嘅持倉三日內升咗 8%。',
 txt:'原來賺錢咁易？你開始日日睇十幾次戶口。每次見到個綠色數字，都有一種微微嘅快感。',
 opts:[
  {t:'加碼！我睇得好準',b:'overconf',d:{ego:15,disc:-8,dInv:0.3,conc:0.15,churn:0.6},r:'你追加咗。你覺得自己有天份。'},
  {t:'即刻獲利離場，袋袋平安',b:'lossaver',d:{churn:1.0,dInv:-0.6},r:'你賣咗大部分。賺咗兩萬幾，你請自己食咗餐好。'},
  {t:'咩都唔做',b:null,d:{disc:6},r:'你關咗個 app 去瞓覺。'},
  {t:'去搵吓點解會升',b:null,d:{disc:3},r:'你睇咗兩個鐘研究報告，發現自己乜都唔明。'}
 ]},
{id:3,bg:'CHA_TENG',spr:['sinhing','smug'],who:'sinhing',
 sig:'茶餐廳，師兄拍你膊頭。',
 txt:'「後生仔，你買嗰啲大路嘢邊有肉食？我有隻嘢，下個月出業績，穩陣。你信我啦，我做咗十幾年。」',
 opts:[
  {t:'跟師兄買，佢咁有經驗',b:'herding',d:{ego:5,disc:-12,churn:1.0,conc:0.3,dInv:0.3,vol:2},r:'你買咗。師兄笑到見牙唔見眼。'},
  {t:'買細注試吓水',b:'herding',d:{disc:-4,churn:0.6,conc:0.12,dInv:0.1,vol:2},r:'你落咗細注。心裡面已經幻想住佢升三倍。'},
  {t:'笑笑口，唔跟',b:null,d:{disc:10},r:'你飲埋杯奶茶就走。師兄背後同人講你唔識嘢。'},
  {t:'問佢點解咁肯定',b:null,d:{disc:8},r:'師兄講咗一堆，你發現佢答唔到最關鍵嗰條問題。'}
 ]},
{id:4,bg:'HOME_NIGHT',spr:['wulong','rookie'],who:null,
 sig:'指數單日跌 3%。你嘅持倉由 +8% 變 -2%。',
 txt:'紅色。成版紅色。你個胃有啲唔舒服。呢個數字尋日仲係綠色嘅。',
 opts:[
  {t:'即刻止蝕，走為上著',b:'lossaver',d:{churn:1.0,disc:-6,inv:0.1},r:'你賣晒。第二日反彈 2%。',
   why:'你而家喺場外。個市幾時返，你要再估多一次。'},
  {t:'溝貨，而家係平嘢',b:'anchoring',d:{ego:6,disc:-8,dInv:0.4,churn:0.5},r:'你加碼溝低咗成本價。'},
  {t:'咩都唔做',b:null,d:{disc:10},r:'你將個 app 由主畫面移走。'},
  {t:'查吓係咪基本面有變',b:null,d:{disc:6},r:'你查完發現只係大市回調，同公司無關。'}
 ]},
{id:5,bg:'PARK',spr:['mike','calm'],who:'mike',
 sig:'公園。你撞到 Mike。',
 txt:'「我？我買咗個指數基金，之後就冇再理。你問我升咗幾多？我唔記得喎，大概⋯⋯幾成？」佢望住啲樹，好似真係唔太在意。',
 opts:[
  {t:'咁悶？咁樣賺得幾多啫',b:'lottery',d:{ego:8,disc:-6},r:'你覺得 Mike 太保守。你有更好嘅方法。'},
  {t:'問佢點解可以唔理',b:null,d:{disc:12},r:'「因為我理極都冇用囉。」佢答得好自然。'},
  {t:'心諗：我要跑贏佢',b:'overconf',d:{ego:12,disc:-8},r:'你暗暗立咗個目標。呢個目標會跟住你好耐。'},
  {t:'考慮買啲指數基金',b:null,d:{disc:15,dInv:0.2,dca:1,indexed:1},r:'你買咗一部分。至少呢部分你唔使煩。'}
 ]},
{id:6,bg:'APP_VOID',spr:['wulong','rookie_excited'],who:null,
 sig:'社交平台洗版：某隻細價股三日升 120%。',
 txt:'每個人都喺度講。有人 post 咗張截圖，一個月賺咗架車錢。留言區全部係「我都上咗車」。',
 opts:[
  {t:'追，遲咗就冇份',b:'herding',d:{ego:10,disc:-15,churn:1.2,conc:0.4,dInv:0.35,vol:3},r:'你喺高位入咗。第二日開市直插 30%。'},
  {t:'等佢回調先追',b:'herding',d:{disc:-5,churn:0.8,conc:0.15,dInv:0.15,vol:3},r:'你等到「回調」先入。原來嗰個唔係回調，係開始。'},
  {t:'唔掂',b:null,d:{disc:14},r:'你 scroll 走咗。三個禮拜後嗰隻嘢跌返落起步點。'},
  {t:'買 call option 博一鋪',b:'lottery',d:{ego:12,disc:-18,churn:1.2,lev:1.6,dInv:0.2,vol:4},r:'你買咗期權。刺激到訓唔著。'}
 ]},
{id:7,bg:'OFFICE',spr:['wulong','rookie'],who:null,
 sig:'返工時間。你一日睇咗 47 次股價。',
 txt:'老細行過你身後，你迅速 alt-tab。個 spreadsheet 由朝早開到而家一格都冇填過。',
 opts:[
  {t:'算啦，賺錢緊要過返工',b:null,d:{ego:8,disc:-10,income:-0.0015},r:'你繼續睇。個 project 遲咗交。',
   why:'你嘅人工係你而家最大嘅現金流來源。佢一停低，你嘅每一個投資決定都會變得更加急。'},
  {t:'手機收埋落抽屜',b:null,d:{disc:12,income:0.0008},r:'你成日冇睇。收工先發現升咗 1%。'},
  {t:'設定價格提示就算',b:null,d:{disc:6},r:'你設咗 alert。至少唔使成日 refresh。'},
  {t:'索性請假專心炒',b:'doingsth',d:{ego:10,disc:-15,income:-0.0025,churn:0.8},r:'你請咗一日假。嗰日大市橫行。'}
 ]},
{id:8,bg:'HOME_NIGHT',spr:['wulong','rookie'],who:null,
 sig:'你買咗嘅細價股跌咗 35%。',
 txt:'由賺變蝕，由細蝕變大蝕。你成日喺度計：等返到成本價我就走。',
 opts:[
  {t:'死揸，等返家鄉',b:'lossaver',d:{disc:-12,ego:4,conc:0.1},r:'你決定唔賣。呢個決定會令你揸多兩年。'},
  {t:'再溝多次',b:'sunkcost',d:{ego:8,disc:-15,conc:0.25,dInv:0.3,churn:0.6},r:'你溝低咗成本。個坑越掘越深。'},
  {t:'認蝕，清倉',b:null,d:{disc:16,churn:0.8,conc:-0.35},r:'好痛。但你將啲錢調返去指數。'},
  {t:'賣一半，減低壓力',b:null,d:{disc:8,churn:0.5,conc:-0.18},r:'你賣咗一半。心情好返少少。'}
 ]},
{id:9,bg:'CHA_TENG',spr:['sinhing','secretive'],who:'sinhing',
 sig:'師兄壓低聲線。',
 txt:'「呢個消息我淨係話畀你知。有人接手，下個禮拜公佈。你唔好同人講。」佢望一望四周。',
 opts:[
  {t:'重注跟',b:'herding',d:{ego:12,disc:-20,churn:1.2,conc:0.45,dInv:0.4,vol:3.5},r:'你落咗重注。「消息」冇出現。'},
  {t:'細注跟',b:'herding',d:{disc:-8,churn:0.6,conc:0.15,dInv:0.12,vol:3.5},r:'你落咗細注，一個月後蝕咗四成。'},
  {t:'唔跟，呢啲係內幕消息',b:null,d:{disc:14},r:'你拒絕咗。師兄之後少咗搵你。'},
  {t:'問佢自己買咗幾多',b:null,d:{disc:12},r:'佢支支吾吾。你明白晒。'}
 ]},
{id:10,bg:'APP_VOID',spr:['wulong','rookie'],who:null,
 sig:'大市反彈。你戶口回到 +5%。',
 txt:'原來揸住都會返家鄉。你開始覺得，跌嗰陣唔賣先係啱。',
 opts:[
  {t:'證明咗死揸係啱',b:'hindsight',d:{ego:15,disc:-10},r:'你將呢次經驗記低。可惜你記錯咗重點。'},
  {t:'趁回本走人',b:'anchoring',d:{churn:0.9,disc:-4,inv:0.15},r:'你走咗。之後半年大市升三成。'},
  {t:'咩都唔做',b:null,d:{disc:10},r:'你繼續揸住。'},
  {t:'趁機會 rebalance 返',b:null,d:{disc:14,churn:0.4,conc:-0.15},r:'你將比例調返均衡。'}
 ]},
{id:11,bg:'TV_STUDIO',spr:['analyst','pro'],who:'analyst',
 sig:'電視財經節目。',
 txt:'「我哋維持目標價，預期未來十二個月有 25% 上升空間。」個分析師講得好肯定，背後啲圖表好專業。',
 opts:[
  {t:'跟目標價買入',b:'authority',d:{ego:6,disc:-10,churn:0.8,conc:0.2,dInv:0.25},r:'你跟咗。目標價之後被下調三次。'},
  {t:'去搵佢過往準確率',b:null,d:{disc:16},r:'你查到佢過去兩年有六成預測落空。'},
  {t:'只信自己嘅判斷',b:'overconf',d:{ego:10,disc:-4},r:'你唔信佢。但你自己嘅判斷都冇好過。'},
  {t:'當佢係參考，唔當結論',b:null,d:{disc:10},r:'你記低咗，但冇因此改變倉位。'}
 ]},
{id:12,bg:'HOME_NIGHT',spr:['wulong','rookie'],who:null,
 sig:'你發現交易手續費一個月食咗 3,800。',
 txt:'你數返自己一個月做咗幾多次買賣⋯⋯29 次。你以為自己好勤力。',
 opts:[
  {t:'搵間平啲嘅券商',b:null,d:{disc:6,churn:0.3},r:'你轉咗平台。手續費平咗，但你交易得更加密。'},
  {t:'減少交易次數',b:null,d:{disc:18,churnCap:0.15},r:'你定咗規矩：一個月最多兩次。',
   why:'成本係唯一一樣你完全控制到、而且一定會發生嘅嘢。回報唔係。'},
  {t:'唔緊要，賺得返',b:'mental',d:{ego:8,disc:-12,churn:1.5},r:'你唔理。呢筆錢一年後累積到成五萬。'},
  {t:'做多啲交易攤薄成本',b:'doingsth',d:{disc:-15,churn:2.2},r:'呢個邏輯有問題，但你當時覺得好合理。'}
 ]},
{id:13,bg:'PARK',spr:['mike','yawn'],who:'mike',
 sig:'Mike 喺公園瞓著咗。',
 txt:'你行過去，見到佢個電話跌咗喺長櫈度，screen 都熄咗。你已經連續三晚睇盤睇到兩點。',
 opts:[
  {t:'嘲笑佢咁懶',b:null,d:{ego:8,disc:-4},r:'你心諗佢唔會發達。你當時真心咁諗。'},
  {t:'突然覺得好攰',b:null,d:{disc:12,health:2},r:'你坐咗低，五分鐘乜都冇諗。好耐冇試過。'},
  {t:'叫醒佢問佢戶口幾多',b:null,d:{disc:4},r:'佢話唔記得咗密碼，要慢慢搵返。'},
  {t:'影低佢張相笑佢',b:null,d:{ego:5},r:'幾年後你翻返出呢張相，感覺完全唔同。'}
 ]},
{id:14,bg:'APP_VOID',spr:['wulong','rookie'],who:null,
 sig:'突發：地緣政治新聞。期指夜盤急挫 4%。',
 txt:'凌晨一點半。你瞓唔著。個手機喺枕頭邊震。',
 opts:[
  {t:'即刻喺夜盤沽晒',b:'panic',d:{disc:-18,churn:1.2,inv:0.05,health:-2},r:'你喺最低位附近沽晒。開市反彈 3%。',
   why:'你而家全部係現金。想返場，你要再揀一次時機 —— 而通常都會揀喺個市升返之後。'},
  {t:'放低電話，瞓覺',b:null,d:{disc:18,health:1},r:'第二朝起身，個市已經收復咗大半。'},
  {t:'博反彈，加注',b:'overconf',d:{ego:10,disc:-8,dInv:0.3,churn:0.6,vol:2},r:'你估中咗。呢次估中會令你之後輸得更多。'},
  {t:'開電視睇新聞睇到天光',b:'doingsth',d:{disc:-6,health:-2},r:'你睇咗三個鐘，個結論係：冇人知會點。'}
 ]},
{id:15,bg:'OFFICE',spr:['wulong','rookie'],who:null,
 sig:'同事問你有咩好介紹。',
 txt:'佢見你成日睇股票，以為你好識。你其實只係啱啱蝕完一筆。',
 opts:[
  {t:'介紹自己揸緊嗰隻',b:'confirm',d:{ego:12,disc:-10,commit:1,conc:0.1},r:'你講到好肯定。而家你更加唔可以認錯。'},
  {t:'照直講自己都蝕緊',b:null,d:{disc:16},r:'你講咗真話。佢有啲失望，但你舒服咗。'},
  {t:'叫佢買指數基金',b:null,d:{disc:14},r:'你講完之後諗：咁點解我自己唔咁做？'},
  {t:'避開唔答',b:null,d:{disc:6},r:'你轉咗話題。'}
 ]},
{id:16,bg:'HOME_NIGHT',spr:['wulong','rookie_excited'],who:null,
 sig:'你連續三次判斷正確。戶口 +14%。',
 txt:'唔係彩數。你開始相信，你係睇得明個市嘅。你買咗本筆記簿，準備記低自己嘅「系統」。',
 opts:[
  {t:'加大注碼，把握手感',b:'hotHand',d:{ego:20,disc:-15,dInv:0.4,conc:0.25,vol:1.8,churn:0.8},r:'你將注碼加大一倍。'},
  {t:'借孖展放大回報',b:'overconf',d:{ego:22,disc:-20,lev:1.5,vol:2,churn:0.6},r:'你開咗孖展戶口。呢個決定會喺跌市嗰陣等你。'},
  {t:'照舊，唔改注碼',b:null,d:{disc:16},r:'你忍住咗。呢個係你做過最好嘅決定之一。'},
  {t:'記低三次都係彩數嘅可能',b:null,d:{disc:20},r:'你喺筆記寫低：「樣本太細。」你之後會忘記呢一頁。'}
 ]},
{id:17,bg:'CHA_TENG',spr:['sinhing','panic'],who:'sinhing',
 sig:'師兄好耐冇出現，今日突然搵你。',
 txt:'「我⋯⋯我周轉唔到。你有冇 quota 可以借我啲？我下個月一定還。」佢件恤衫皺晒，眼有紅筋。',
 opts:[
  {t:'借，大家兄弟',b:null,d:{disc:-10,cashOut:0.12},r:'你借咗。佢冇還。你之後再冇見過佢。'},
  {t:'唔借，但請佢食餐飯',b:null,d:{disc:12},r:'佢食完就走。你覺得有啲唔忍心，但你係啱嘅。'},
  {t:'問佢究竟發生咩事',b:null,d:{disc:14},r:'原來佢用咗十倍槓桿。你嗰刻先明白佢啲「經驗」係咩。'},
  {t:'避開唔覆',b:null,d:{disc:4},r:'你冇覆佢。心裡面有啲唔舒服。'}
 ]},
{id:18,bg:'APP_VOID',spr:['wulong','rookie'],who:null,
 sig:'你嘅組合而家有 11 隻股票。',
 txt:'每隻都有唔同理由買。你已經記唔起其中四隻當初點解會買。',
 opts:[
  {t:'再加多幾隻，分散風險',b:'complexity',d:{ego:8,disc:-12,churn:1.4,conc:-0.05},r:'你加到 15 隻。你嘅回報開始同指數一樣，但成本高好多。',
   why:'十五隻股票已經接近指數嘅波動，但你要俾十五次買賣成本。你買咗個指數，用咗貴好多嘅價錢。'},
  {t:'清走講唔出理由嗰四隻',b:null,d:{disc:18,churn:0.5,conc:-0.08},r:'你清走咗。個組合清爽咗。'},
  {t:'集中火力落最好嗰兩隻',b:'overconf',d:{ego:12,disc:-8,conc:0.4,vol:2,churn:0.7},r:'你集中咗。波幅大咗好多。'},
  {t:'全部換成指數基金',b:null,d:{disc:22,churn:0.8,dca:1,indexed:1},r:'你認咗輸。但呢個「輸」其實係贏。'}
 ]},
{id:19,bg:'ROOFTOP',spr:['wulong','rookie'],who:null,
 sig:'你上咗天台抖氣。',
 txt:'呢一年你賺咗 4%。同期指數升咗 11%。你做咗 180 次交易，睇咗大概 900 個鐘盤。',
 opts:[
  {t:'我技術仲未夠好，要學多啲',b:'illusion',d:{ego:10,disc:-6,cashOut:0.012},r:'你報咗個課程。三千蚊。'},
  {t:'可能我根本唔應該咁做',b:null,d:{disc:20},r:'呢個念頭好快就過去。但佢種咗落去。'},
  {t:'再畀多一年自己',b:null,d:{disc:4},r:'你決定再試一年。'},
  {t:'計吓自己時薪',b:null,d:{disc:16},r:'你計完發現係負數。你笑咗出嚟，笑得好苦。'}
 ]},
{id:20,bg:'PARK',spr:['mike','smile'],who:'mike',
 sig:'五年。Mike 請你飲奶茶。',
 txt:'「聽講你好勤力喎。」佢笑笑口。你問返佢賺咗幾多，佢諗咗陣：「我睇吓⋯⋯哦，同大市差唔多囉。」',
 opts:[
  {t:'跟佢咁做',b:null,d:{disc:25,dca:1,indexed:1,churn:0.6,churnCap:0.1},r:'你將大部分錢轉咗去指數。你嘅第二個五年會好唔同。'},
  {t:'我今年只係唔好彩',b:'selfserve',d:{ego:15,disc:-12},r:'你歸咎於運氣。呢個習慣會跟你好耐。'},
  {t:'佢係悶，但佢係啱',b:null,d:{disc:18},r:'你承認咗，但冇即刻改。'},
  {t:'我要證明有更好嘅方法',b:'ego',d:{ego:20,disc:-15},r:'你決定升級自己嘅方法。中手期開始。'}
 ]}
];
