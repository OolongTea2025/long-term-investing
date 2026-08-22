/* ============================================================
   English —— overlay

   Localisation policy (same as the site's /en/ edition):
   the setting is generic-international, not Hong Kong. 茶餐廳
   becomes a diner, 連登 becomes an online forum, 師兄 becomes
   Kenny — an older colleague who is always sure of himself.

   Money: the model always runs in HKD internally; cur.rate = 0.125
   only changes what is displayed, so balance, probabilities and
   the ending distribution are identical in every language.
   Hard-coded amounts inside the scenario prose do NOT go through
   fmt(), so they are scaled by hand in en.scen.js.
   ============================================================ */

LANGS['en'] = {
code: 'en', htmlLang: 'en', label: 'English',
cur: { sym: '$', rate: 0.125 },

/* Thresholds are re-derived from level.en.md, not FX-converted —
   same rule the zh-TW edition follows. */
levels: [
  [1e4,      'Level 1', 'Under $10k'],
  [1e5,      'Level 2', '$10k – $100k'],
  [1e6,      'Level 3', '$100k – $1M'],
  [1e7,      'Level 4', '$1M – $10M'],
  [Infinity, 'Level 5', 'Over $10M']
],

names: { mike: 'Mike', sinhing: 'Kenny', analyst: 'Analyst Chan', elder: 'Uncle Chan' },
phase: { rookie: 'Rookie', mid: 'Mid-game', vet: 'Veteran' },

ch: {
  CH2:  ['Chapter 2 · What indexing is',            '../en/新手篇/02-被動指數係咩/'],
  CH3:  ['Chapter 3 · How diversification works',   '../en/新手篇/03-分散風險原理/'],
  CH5:  ['Chapter 5 · Your first portfolio',        '../en/新手篇/05-你嘅第一個組合/'],
  CH6:  ['Chapter 6 · Handling your own biases',    '../en/新手篇/06-行為偏誤點應對/'],
  CH7:  ['Chapter 7 · Allocation path & leverage',  '../en/進階篇/07-配置路線與槓桿/'],
  CH9:  ['Chapter 9 · What risk really is',         '../en/進階篇/09-真正嘅風險/'],
  CH13: ['Chapter 13 · How much you need to retire','../en/退休篇/13-提早退休要幾多錢/'],
  APA:  ['Appendix A · Fallacies & thinking tools', '../en/附錄/01-邏輯謬誤與思維/'],
  APB:  ['Appendix B · Investing when money is tight','../en/附錄/02-窮人點投資/'],
  XD:   ['Deep dive D · Behavioural finance',       '../en/進階選讀/D-行為金融學/']
},

bias: {
  recency:    ['Recency bias',        'You assume what just happened will keep happening'],
  herding:    ['Herding',             'You do it because everyone else is doing it'],
  lottery:    ['Lottery preference',  'You accept a large chance of a small loss for a small chance of a big win'],
  lossaver:   ['Loss aversion',       'Losing hurts about twice as much as winning feels good — so you sell winners and hold losers'],
  anchoring:  ['Anchoring',           'Your purchase price means nothing to the market, but everything to you'],
  overconf:   ['Overconfidence',      'You mistook luck for ability'],
  hotHand:    ['Hot-hand fallacy',    'Three wins in a row says nothing about the fourth'],
  confirm:    ['Confirmation bias',   'You look things up to feel better, not to find out'],
  illusion:   ['Illusion of control', 'A complicated method makes you feel in control of something you are not'],
  narrative:  ['Narrative fallacy',   'A good story makes you forget to look at the price'],
  sunkcost:   ['Sunk cost',           'Money already lost should not affect today\'s decision, but it did'],
  hindsight:  ['Hindsight bias',      'Afterwards you feel you knew all along. You did not'],
  complexity: ['Complexity bias',     'You assume complicated means professional'],
  survivor:   ['Survivorship bias',   'You only see the ones who made it, never the ones who did not'],
  pattern:    ['Apophenia',           'The human brain finds patterns in randomness'],
  contrarian: ['Contrarian dogma',    'Being different for its own sake is not a strategy'],
  authority:  ['Authority bias',      'Someone sounding certain does not make them right'],
  panic:      ['Panic response',      'Making your most important decision at the worst possible moment'],
  mental:     ['Mental accounting',   'You treat money differently depending on where it came from'],
  doingsth:   ['Action bias',         'Sitting still makes you anxious, so you act — even when acting is wrong'],
  regret:     ['Regret aversion',     'You chase the top so you never have to miss out again'],
  smallsample:['Small-sample fallacy','A dozen trades prove nothing'],
  ego:        ['Ego investment',      'Once your identity is tied to your position, you can never be wrong'],
  selfserve:  ['Self-serving bias',   'Wins are skill, losses are the market'],
  excuse:     ['The excuse loop',     'Every year there is a reason this year does not count'],
  comparison: ['Selective comparison','You picked a benchmark that makes you feel good'],
  facesave:   ['Face-saving cost',    'You paid real money to avoid looking foolish'],
  breakeven:  ['Break-even fallacy',  'Your capital does not know you once lost money'],
  markettime: ['Market-timing illusion','You have to get two calls right: when to leave, and when to come back'],
  avoid:      ['Avoidance',           'Not looking at the number does not change the number'],
  selective:  ['Selective memory',    'You only remember the ones that worked'],
  blame:      ['Blame-shifting',      'It protects the ego and costs you the lesson'],
  doubledown: ['Doubling down',       'Using position size to prove you were right'],
  identity:   ['Identity lock-in',    'Your strategy has become who you are'],
  endowment:  ['Endowment effect',    'You value it more simply because it is yours'],
  exception:  ['Exceptionalism',      'Everyone believes they are the exception'],
  dismiss:    ['Contemptuous dismissal','Calling it a bubble saves you from having to understand it'],
  fomo:       ['Fear of missing out', 'Being left behind scares you more than losing money'],
  attention:  ['Attention seeking',   'You said something you do not believe, because people were listening'],
  talkbook:   ['Talking your book',   'You describe your position hoping others will bid it up'],
  fantasy:    ['Fantasy deferral',    '"Eventually" is a promise with no date on it'],
  consolation:['Consolation reframe', 'Repackaging a loss as tuition'],
  desperation:['Desperation bet',     'Out of time, so bet bigger — the most expensive logic there is'],
  scarcity:   ['Scarcity mindset',    'The less money you have, the harder long-term decisions get — this is not a character flaw']
},

ending: {
EARLY_RUIN: { n: 'Knocked out', tag: 'Ended early',
  d: 'You did not make it to the end. Concentration, leverage, a single bet — any one of them alone might not have killed you, but you brought all three. The market does not need long to finish its work. You never even got the chance to lose slowly.' },
BLOWUP: { n: 'Blow-up', tag: 'Wiped out',
  d: 'Your net worth fell below a tenth of where you started. This ending needs no explanation — you know exactly what happened.' },
BOILED_FROG: { n: 'Boiled frog', tag: 'The most common ending',
  d: 'You did not blow up. No disaster, no story to tell. You simply lost a little every year, for twenty years, to a man who did nothing at all. This is the most common ending, and the one fewest people notice.' },
LEEK_LIFE: { n: 'Eaten by costs', tag: 'The fees got it all',
  d: 'You traded diligently. Your broker is very grateful. You spent your time, your attention and your health, and bought yourself a stack of commission statements.' },
AWAKENING: { n: 'Waking up', tag: 'Changed course',
  d: 'You woke up partway through. You never fully made back what you lost, but you stopped the bleeding — and the rest of your life will not be spent staring at a screen. It is not a win, but it is a decent way to finish.' },
WU_WEI: { n: 'Doing nothing', tag: 'The hardest ending',
  d: 'You barely did anything, start to finish. No story, no climax, not one moment of "I knew it at the time". You bought, and then you left it alone.\n\nThis is the hardest ending in the game to reach — not because it takes skill, but because it takes twenty years of choosing, every single time your hands itched, not to act.' },
TRUE_ALPHA: { n: 'Real alpha', tag: 'You beat it, and not by luck',
  d: 'You beat the index. And not by luck — run the same behaviour through hundreds of different markets and you win in most of them.\n\nBut look closely at where the win actually came from.' },
LUCKY_FOOL: { n: 'Lucky fool', tag: 'You beat it, but…',
  d: 'You beat the index. Congratulations.\n\nBut ——' }
},

ui: {
/* ---- shell.html (static layout) ---- */
docTitle:     'An Investing Life',
metaDesc:     'An interactive story about cognitive bias. Seventy decisions, twenty years, and one control group who did nothing.',
titleEyebrow: 'A simulation of investor behaviour',
titleMain:    'An<br>Investing Life',
titleSub:     'Seventy decisions · twenty years · one control group',
nameLabel:    'Your name',
btnStart:     'Start',
btnContinue:  'Continue where you left off',
titleNote:    'You are thirty. You have <b>{0}</b>, and you save a little every quarter.<br>' +
              'A man called <b>Mike</b> starts on the same day. He buys index funds on day one,<br>' +
              'keeps contributing every quarter, and does nothing else for twenty years.<br><br>' +
              'When the game ends it will tell you exactly which things<br>' +
              'created the gap between you — and what each one cost.',
backToSite:   '← Back to Long-Term Investing 101',
hudYou:       'You',
hudGap:       'Gap',
logTitle:     'Decision log',
setTitle:     'Settings',
chartZoom:    'Tap to enlarge',
chartHint:    'You vs Mike',
btnNextSpaced:'C O N T I N U E',
btnNext:      'Continue',
logHead:      'Your decision log',
btnClose:     'Close',
setHead:      'Settings',
setSpeed:     'Text speed',
spdSlow:      'Slow',
spdNormal:    'Normal',
spdFast:      'Fast',
spdInstant:   'Instant',
setSound:     'Music & sound',
setTags:      'Show bias labels',
onLabel:      'On',
offLabel:     'Off',
setFoot:      'With bias labels on, each option is marked with the cognitive bias it corresponds to. ' +
              'They turn on by default after your first playthrough. You will notice something: ' +
              'even knowing an option is a bias, you still want to pick it.',
setLang:      'Language',

/* ---- engine.js ---- */
defaultName:  'Oolong',
extraOptTxt:  '(Put the idle cash back into the market)',
extraOptRes:  'You put the money you had parked on the sidelines back in.',
extraOptWhy:  'You sat out {0} rounds this time. Whatever the market did over those rounds, you had no part in it.',

/* ---- turn loop ---- */
turnWhen:     'Year {0} · age {1}',
tagForced:    'Forced liquidation',
forcedWhy:    'Your own capital fell below the maintenance margin and the broker closed you out. ' +
              'You did not choose to leave — you were thrown out, and you paid the slippage for it.',
chartOutBand: 'Pale band = rounds you were out of the market',

/* ---- phase review ---- */
rvTitle20:    'End of the rookie years',
rvTitle45:    'End of the mid-game',
kvYourRet:    'Your return',
kvMikeRet:    'Mike\'s return',
kvYourNav:    'Your net worth',
kvMikeNav:    'Mike\'s net worth',
kvMaxDD:      'Largest drawdown',
kvEmoDec:     'Emotional decisions',
kvTradeCost:  'Trading costs to date',
kvOutTurns:   'Rounds out of the market',
unitTimes:    '{0} of {1}',
unitCount:    '{0}',
rvVerdictWin: 'You beat Mike over this stretch. Worth noting: beating the market over a short window ' +
              'can be pure volatility rather than skill. Did you take on more risk to get it?',
rvVerdictTie: 'You are roughly level with Mike. But you made a great many decisions and he made none. ' +
              'Same result — except you paid for it in time, attention and commissions.',
rvVerdictSoft:'You are behind Mike. The gap does not look like much, but this is exactly how the boiled frog starts — ' +
              'lose a little each stage, compound it, and it adds up to a house.',
rvVerdictBad: 'You are clearly behind. This is the best possible moment to review: did the losses come from the market, or from your own decisions?',
rvBiasHead:   'The biases you triggered most this stage:',
rvBiasNone:   'You did not trigger a single cognitive bias this stage.',
btnSave:      'Save progress',
btnSaved:     'Saved ✓',
btnSaveFail:  'Save failed',

/* ---- decision log ---- */
logEmpty:     'No decisions yet.',
logTurn:      'Round {0} · year {1}',

/* ---- ending ---- */
eTag:         'Round {0} · {1} years · {2} · final {3}',
secCompare:   'Final comparison',
statYou:      'You ({0})',
statMike:     'Mike (index, did nothing)',
statGap:      'Gap',
statGapAmt:   'Gap in money',
statYourLvl:  'Your wealth Level',
statMikeLvl:  'Mike\'s wealth Level',
footTotalIn:  'Over twenty years you put in {0} in total ({1} to start + {2} saved).',
footLadder:   'The Levels match the ones used across the site — see {0}.',
footLadderCh: 'the retirement chapters',

noteLucky:    '<b>You won, but not because you were good.</b><br><br>' +
              'We took the {0} decisions you actually made and dropped them, unchanged, into 400 different market histories. ' +
              'Same behaviour, different markets: <b>you beat Mike in only {1}% of them</b>, ' +
              'with a median of {2}× his result.<br><br>' +
              'You won this time because this time you drew that path. The behaviour itself has no edge.',
noteAlpha:    '<b>And it was not a fluke.</b><br><br>' +
              'Run the same behaviour through 400 different markets and <b>you win in {0}% of them</b>. ' +
              'That is not luck, that is a structural edge.<br><br>' +
              'But look closely at where the edge came from — check the "your salary" line below.',
noteWuWei:    '<b>You did the hardest thing there is.</b><br><br>' +
              'Your result is almost identical to Mike\'s. That is not a draw — that is the target itself. ' +
              'Mike\'s return is the market\'s return, and the market\'s return is already more than most people ever get.',

secAttr:      'Where the gap came from',
attrIntro:    'We take the exact market path you just played and the exact seventy decisions you made, ' +
              'switch off one thing at a time, and run it again. The difference is what that one thing cost you.',
attrCost:     'Trading costs',
attrCostWhy:  'Commissions, transaction taxes, spreads and fund fees.',
attrTiming:   'Out of the market',
attrTimingWhy:'The rounds you spent sold out, or holding cash you never put to work.',
attrConc:     'Concentration',
attrConcWhy:  'Betting heavily on a single position, including the risk of it blowing up.',
attrLev:      'Leverage',
attrLevWhy:   'Interest on borrowed money, plus what forced liquidation cost you.',
attrIncome:   'Your salary',
attrIncomeWhy:'Career choices that made your savings grow faster (or slower).',
attrNote:     'These five numbers will not add up exactly to the total gap. ' +
              'They interact — for instance, without the leverage that forced liquidation never happens, ' +
              'and the cost of being sold out disappears along with it.<br><br>' +
              'Switch all four off together and you would have <b>{0}</b>, which is {1} more than you do now.<br><br>' +
              '<b>Notice which number is the steadiest.</b> Costs are the one thing that is certain to happen ' +
              'and entirely within your control. Concentration and timing are gambles — ' +
              'sometimes they save you, sometimes they ruin you, but over a lifetime the expected value is negative.',

secCostDetail:'Cost breakdown',
statTradeCost:'Trading costs (commission / tax / spread)',
statFundFee:  'Fund & product fees',
statMargin:   'Margin interest',
statSpent:    'Courses, subscriptions, money lent out',
statForced:   'Forced liquidations',
statOutTurns: 'Rounds out of the market',
statEmoDec:   'Emotion-driven decisions',
unitTimesN:   '{0}',
unitOutOf:    '{0} of {1}',

secMC:        'The same behaviour, four hundred parallel universes',
mcYou:        'You',
mcTxt:        'Each bar is one parallel universe. The axis is how many times Mike\'s result you ended up with.<br><br>' +
              '· Universes where you beat Mike: <b>{0}%</b><br>' +
              '· Median: <b>{1}×</b> Mike<br>' +
              '· This run sits at the <b>{2}</b>th percentile<br><br>{3}',
mcHigh:       'This particular market was unusually kind to the way you played. Same behaviour, and most universes turn out very differently.',
mcLow:        'This particular market was unusually harsh on the way you played. Even so, the expected value of this approach is limited in the best of universes.',
mcMid:        'This run sits within the normal range for the way you played.',

secBias:      'Your biases, and the chapter for each',
biasNone:     'You did not trigger a single cognitive bias. That is extremely rare.',
secKey:       'Key decisions, revisited',
keyNone:      'No biased decisions to revisit.',
keyPicked:    'You chose: {0}',
keyAlt:       'The alternative: {0}',

secMike:      'Mike\'s twenty years',
mikeFoot:     'He made about fifty trades, all of them scheduled contributions. He never watched the market, never chased a headline, never argued with anyone about it. ' +
              'His return is simply the market\'s return.<br><br>' +
              'This game is not telling you that you cannot win. It is telling you that <b>you do not need to.</b> ' +
              'Capturing the market\'s own return already puts you ahead of almost everyone who plays — and capturing it takes no skill at all. ' +
              'It only takes twenty years of deciding, every time your hands itch, not to act.',

secNext:      'Where to go next',
nextCh6:      'How to handle the biases above',
nextCh2:      'How fees eat your return',
nextCh3:      'Why diversification is not "own a few more"',
nextCh5:      'What a first portfolio actually looks like',
nextApA:      'How to tell a real investment claim from a fake one',

btnAgain:     'Play again',
btnNg2:       'Play again with bias labels on',
btnToSite:    'Back to the site',
endFoot:      'With bias labels on, each option is marked with the bias it corresponds to. ' +
              'You will notice something: even knowing it is a bias, you still want to pick it.',

/* ---- title screen "continue" ---- */
contInfo:     '{0} · round {1} · {2}',
contFail:     'Could not load — please start a new game'
},

scen: {}   /* scenarios live in en.scen.js */
};
