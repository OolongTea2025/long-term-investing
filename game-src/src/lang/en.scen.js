/* The 70 scenarios in English.

   Only sig / txt / opts[i].t / .r / .why live here — all plain prose.
   d{} (the numbers that drive the model) and b (the bias key) are NOT
   in this file, so nothing here can affect game balance.

   Amounts are scaled by hand at cur.rate = 0.125, because prose
   numbers never pass through fmt(). Setting is generic-international:
   the diner became a diner anywhere, 師兄 became Kenny. */

LANGS['en'].scen = {

/* ===== Rookie years, 1–20 ===== */
1:{sig:'Fifth record high in a row. The business pages: "The bull market is confirmed."',
 txt:'You are thirty. There is $37,500 in the account. You stare at the green screen and your heart is going fast. This is the first time you have taken the word "investing" seriously.',
 opts:[
  {t:'All in, while the momentum lasts',r:'You throw the whole lot in. You feel frightened and thrilled at once.'},
  {t:'Buy half, keep half in cash',r:'You buy half. Keeping some dry powder feels safer.'},
  {t:'Watch a while longer, wait for a dip',r:'You decide to wait. The index keeps climbing.'},
  {t:'Fixed amount every month, whatever the price',r:'You set up an automatic monthly purchase. Dull, but you never have to think about it again.',
   why:'A regular contribution plan quietly pushes your savings into the market for you, so you never have to judge whether now is a good moment.'}
 ]},
2:{sig:'Your holding is up 8% in three days.',
 txt:'So making money is this easy? You start checking the account a dozen times a day. Every time you see that green number there is a small, warm hit of pleasure.',
 opts:[
  {t:'Add more — my read was good',r:'You top up. You decide you have a talent for this.'},
  {t:'Take the profit now, lock it in',r:'You sell most of it. About $3,000 made, and you take yourself out for a good dinner.'},
  {t:'Do nothing',r:'You close the app and go to bed.'},
  {t:'Go find out why it went up',r:'You read research for two hours and discover you understand none of it.'}
 ]},
3:{sig:'A diner. Kenny claps you on the shoulder.',
 txt:'"Kid, there\'s no meat on those big boring things you\'re buying. I\'ve got one — results out next month, safe as houses. Trust me, I\'ve been doing this fifteen years."',
 opts:[
  {t:'Follow Kenny, he has the experience',r:'You buy it. Kenny grins from ear to ear.'},
  {t:'Take a small position, just to test',r:'You put a little in. In your head it has already tripled.'},
  {t:'Smile, and pass',r:'You finish your coffee and leave. Behind your back Kenny tells people you don\'t get it.'},
  {t:'Ask him why he is so certain',r:'Kenny talks for a while, and you notice he never answers the one question that matters.'}
 ]},
4:{sig:'The index drops 3% in a day. Your position goes from +8% to -2%.',
 txt:'Red. A whole screen of red. Your stomach feels wrong. That number was green yesterday.',
 opts:[
  {t:'Cut the loss now, get out',r:'You sell everything. It rebounds 2% the next day.',
   why:'You are on the sidelines now. When the market comes back, you have to guess a second time.'},
  {t:'Average down, it is cheap now',r:'You add more and bring your average cost down.'},
  {t:'Do nothing',r:'You move the app off your home screen.'},
  {t:'Check whether anything fundamental changed',r:'You look, and find it is just a broad market pullback. Nothing to do with the company.'}
 ]},
5:{sig:'A park. You run into Mike.',
 txt:'"Me? I bought an index fund and never touched it again. How much is it up? I don\'t remember, honestly — thirty, forty percent?" He looks at the trees. He genuinely does not seem to care.',
 opts:[
  {t:'That dull? How much can that make',r:'You decide Mike is too conservative. You have a better way.'},
  {t:'Ask him how he manages not to check',r:'"Because checking never changed anything." He says it as if it were obvious.'},
  {t:'Think: I am going to beat him',r:'You quietly set yourself a target. That target will follow you for a long time.'},
  {t:'Consider buying some index funds',r:'You put part of it in. At least that part you never have to worry about.'}
 ]},
6:{sig:'Your feed is flooded: a small-cap is up 120% in three days.',
 txt:'Everybody is talking about it. Someone posts a screenshot of a month\'s gain the size of a car. The comments are wall-to-wall "got in too".',
 opts:[
  {t:'Chase it, before it is too late',r:'You buy near the high. It opens down 30% the next morning.'},
  {t:'Wait for a dip, then chase',r:'You wait for the "dip" before buying. That was not a dip. That was the start.'},
  {t:'Leave it alone',r:'You scroll past. Three weeks later it is back where it started.'},
  {t:'Buy call options for the ride',r:'You buy the options. Too excited to sleep.'}
 ]},
7:{sig:'A working day. You checked the price 47 times.',
 txt:'Your manager walks past behind you and you alt-tab fast. That spreadsheet has been open since morning with not one cell filled in.',
 opts:[
  {t:'Never mind, this matters more than work',r:'You keep watching. The project slips.',
   why:'Your salary is the biggest source of cash flow you have right now. The moment it stops, every investment decision you make gets more desperate.'},
  {t:'Phone in the drawer',r:'You do not look all day. At home you find out it went up 1%.'},
  {t:'Just set a price alert',r:'You set an alert. At least you stop refreshing.'},
  {t:'Take a day off and trade properly',r:'You take the day. The market goes sideways all of it.'}
 ]},
8:{sig:'The small-cap you bought is down 35%.',
 txt:'Winning became losing, and a small loss became a big one. You keep running the same calculation: once it gets back to my cost, I am out.',
 opts:[
  {t:'Hold on, wait to get back to even',r:'You decide not to sell. That decision will keep you holding for another two years.'},
  {t:'Average down one more time',r:'You bring the cost down again. The hole gets deeper.'},
  {t:'Take the loss, close it out',r:'It hurts. But you move the money into the index.'},
  {t:'Sell half, ease the pressure',r:'You sell half. You feel a little better.'}
 ]},
9:{sig:'Kenny lowers his voice.',
 txt:'"I\'m only telling you this. Someone\'s taking them over, it gets announced next week. Don\'t tell anyone." He glances around the room.',
 opts:[
  {t:'Go in heavy',r:'You take a large position. The "news" never arrives.'},
  {t:'Go in small',r:'You take a small position, and it is down 40% a month later.'},
  {t:'Refuse — this is inside information',r:'You say no. Kenny calls you a lot less after that.'},
  {t:'Ask how much he bought himself',r:'He hedges and mumbles. You understand perfectly.'}
 ]},
10:{sig:'The market rebounds. Your account is back to +5%.',
 txt:'So holding on does get you back to even. You start to believe that not selling on the way down was the right call.',
 opts:[
  {t:'This proves holding on works',r:'You file the experience away. Unfortunately you filed the wrong lesson.'},
  {t:'Get out now that I am even',r:'You leave. The market rises 30% over the next six months.'},
  {t:'Do nothing',r:'You keep holding.'},
  {t:'Use the chance to rebalance',r:'You bring the weights back to where they should be.'}
 ]},
11:{sig:'A business channel.',
 txt:'"We are maintaining our target price. We see 25% upside over the next twelve months." The analyst sounds completely certain, and the charts behind him look very professional.',
 opts:[
  {t:'Buy at the target price',r:'You follow him. The target gets cut three times afterwards.'},
  {t:'Look up his past accuracy',r:'You find that six out of ten of his calls over two years did not land.'},
  {t:'Trust only my own judgement',r:'You ignore him. Your own judgement is not doing any better.'},
  {t:'Treat it as input, not a conclusion',r:'You note it down and change nothing about your position.'}
 ]},
12:{sig:'You notice commissions cost you $475 last month.',
 txt:'You count how many trades you made in a month… 29. You had thought of yourself as diligent.',
 opts:[
  {t:'Find a cheaper broker',r:'You switch platforms. Cheaper per trade, and you trade even more often.'},
  {t:'Trade less',r:'You set a rule: two trades a month, maximum.',
   why:'Cost is the only thing that is entirely within your control and absolutely certain to happen. Returns are neither.'},
  {t:'It is fine, I will make it back',r:'You let it go. A year later it has added up to nearly $6,000.'},
  {t:'Trade more to spread the cost',r:'The logic does not hold up, but at the time it felt perfectly reasonable.'}
 ]},
13:{sig:'Mike has fallen asleep in the park.',
 txt:'You walk over and see his phone dropped on the bench, screen dark. You have been up until two in the morning three nights running.',
 opts:[
  {t:'Laugh at how lazy he is',r:'You think to yourself he will never get rich. You genuinely believed that.'},
  {t:'Feel, suddenly, very tired',r:'You sit down and think about nothing for five minutes. It has been a long time.'},
  {t:'Wake him and ask what his account is worth',r:'He says he has forgotten the password and will have to dig it out.'},
  {t:'Take a photo to laugh at him with',r:'Years later you find that photo again, and it does not feel the same at all.'}
 ]},
14:{sig:'Breaking news, geopolitical. Overnight futures drop 4%.',
 txt:'Half past one in the morning. You cannot sleep. The phone buzzes next to your pillow.',
 opts:[
  {t:'Sell everything in the overnight session',r:'You sell out near the low. It opens 3% higher.',
   why:'You are entirely in cash now. To get back in you have to pick a moment again — and it is usually after the market has already recovered.'},
  {t:'Put the phone down and sleep',r:'By morning the market has taken most of it back.'},
  {t:'Bet on the bounce, add more',r:'You call it right. Getting it right this once will cost you far more later.'},
  {t:'Watch the news until dawn',r:'You watch for three hours. The conclusion is that nobody knows.'}
 ]},
15:{sig:'A colleague asks you for a tip.',
 txt:'They have seen you watching stocks all day and assume you know what you are doing. In fact you have just taken a loss.',
 opts:[
  {t:'Recommend what I am holding',r:'You say it with real conviction. Now you can never admit you were wrong.'},
  {t:'Say honestly that I am down',r:'You tell the truth. They look disappointed, and you feel lighter.'},
  {t:'Tell them to buy index funds',r:'After you say it you think: so why don\'t I do that myself?'},
  {t:'Dodge the question',r:'You change the subject.'}
 ]},
16:{sig:'Three correct calls in a row. The account is up 14%.',
 txt:'This is not luck. You are starting to believe you can read this market. You buy a notebook to write down your "system".',
 opts:[
  {t:'Size up while the touch is hot',r:'You double your position sizes.'},
  {t:'Borrow on margin to amplify returns',r:'You open a margin account. That decision will be waiting for you in the next downturn.'},
  {t:'Change nothing about position size',r:'You hold back. It is one of the best decisions you ever make.'},
  {t:'Note that three could just be luck',r:'You write "sample too small" in the notebook. You will forget that page.'}
 ]},
17:{sig:'Kenny has been gone a while. Today he calls you out of nowhere.',
 txt:'"I… I\'m short this month. Could you lend me something? I\'ll pay you back next month, definitely." His shirt is a mess and his eyes are bloodshot.',
 opts:[
  {t:'Lend it, we go back a long way',r:'You lend it. He never repays. You never see him again.'},
  {t:'No, but buy him a meal',r:'He eats and leaves. You feel bad about it, and you were right.'},
  {t:'Ask what actually happened',r:'It turns out he was ten times levered. That is the moment you understand what his "experience" was.'},
  {t:'Never reply',r:'You do not answer him. It sits badly with you.'}
 ]},
18:{sig:'Your portfolio now holds 11 stocks.',
 txt:'Each one had its own reason. You can no longer remember why you bought four of them.',
 opts:[
  {t:'Add a few more, spread the risk',r:'You go to 15. Your returns start to look exactly like the index, at a far higher cost.',
   why:'Fifteen stocks already move about like the index — except you pay fifteen sets of trading costs. You bought an index, at a much worse price.'},
  {t:'Sell the four I cannot justify',r:'You clear them out. The portfolio feels cleaner.'},
  {t:'Concentrate into the best two',r:'You concentrate. The swings get much bigger.'},
  {t:'Switch the whole thing to index funds',r:'You admit defeat. This particular defeat is a win.'}
 ]},
19:{sig:'You go up to the roof to breathe.',
 txt:'You made 4% this year. The index made 11%. You placed 180 trades and spent roughly 900 hours watching prices.',
 opts:[
  {t:'My technique is not good enough yet',r:'You sign up for a course. $375.'},
  {t:'Maybe I should not be doing this at all',r:'The thought passes quickly. But it has been planted.'},
  {t:'Give myself one more year',r:'You decide to try one more year.'},
  {t:'Work out my hourly rate',r:'You do the arithmetic and it is negative. You laugh, and it is not a good laugh.'}
 ]},
20:{sig:'Five years. Mike buys you a coffee.',
 txt:'"I hear you\'ve been putting the hours in." He smiles. You ask what he has made, and he thinks about it: "Let me see… oh, about the same as the market."',
 opts:[
  {t:'Do what he does',r:'You move most of the money into the index. Your second five years will look very different.'},
  {t:'I was just unlucky this year',r:'You blame luck. That habit will stay with you a long time.'},
  {t:'He is dull, but he is right',r:'You admit it, and do nothing about it yet.'},
  {t:'I will prove there is a better way',r:'You decide to upgrade your method. The mid-game begins.'}
 ]},

/* ===== Mid-game, 21–45 ===== */
21:{sig:'You have finished building your own trading system.',
 txt:'Three monitors, five indicators, one spreadsheet. You backtest it over ten years: 34% a year. You look at the result and your hands shake a little.',
 opts:[
  {t:'Go live with real money now',r:'You switch it on. In month one it trails the market by 6%.'},
  {t:'Paper trade it for six months first',r:'Six months later you find live results look nothing like the backtest.'},
  {t:'Add a few more indicators to optimise it',r:'It becomes 41% a year. You do not notice that this is overfitting.'},
  {t:'Test it on out-of-sample data',r:'It comes out at 6%. Your system does not actually work.',
   why:'A system tuned to perfection on old data has usually just memorised the noise.'}
 ]},
22:{sig:'The analyst points at a chart.',
 txt:'"Textbook cup-and-handle, volume confirms, the breakout is imminent." You look at the chart and it really does look like one. You saw an identical pattern last week.',
 opts:[
  {t:'Buy the pattern',r:'The breakout fails. You stop out.'},
  {t:'Pull the stats on the last 50 of these',r:'A 51% hit rate. That is a coin.'},
  {t:'Fade it — if everyone sees it, it is useless',r:'This time it works. You decide you have found a rule.'},
  {t:'Ignore it, keep contributing',r:'You do not move.'}
 ]},
23:{sig:'Bad news breaks on a stock you own.',
 txt:'You go looking straight away. Ten articles: seven bearish, three bullish.',
 opts:[
  {t:'Focus on the three bullish ones',r:'You feel better. Those three were placed by the company\'s PR.'},
  {t:'Read all seven bearish ones properly',r:'You find the problem is worse than you thought. You cut the position back.'},
  {t:'Ask around for opinions',r:'You ask three people. Two say hold. You choose to believe those two.'},
  {t:'Sell everything without asking why',r:'You get out. The story later turns out to be false.'}
 ]},
24:{sig:'A private dinner. The analyst has had a couple of drinks.',
 txt:'"When we publish… look, sometimes it isn\'t what we actually think. The client wants to hear something, so we write that." His laugh has no warmth in it.',
 opts:[
  {t:'Never trust sell-side research again',r:'You delete five apps. The world gets quieter.'},
  {t:'So I need to learn to see through them',r:'You believe you can see through them. You cannot.'},
  {t:'So the trick is to do the opposite',r:'That conclusion is too easy. The market is not that stupid.'},
  {t:'So I have been playing someone else\'s game',r:'You go quiet for a long time.'}
 ]},
25:{sig:'Your concentrated position is down 28%.',
 txt:'You have checked everything, and you are convinced the market has it wrong. This company is worth more than this.',
 opts:[
  {t:'Add more, the market will come round',r:'You average down. It then falls another 40%.'},
  {t:'Halve it, accept I might be wrong',r:'Hard to do. But you keep half.'},
  {t:'Hold, add nothing, sell nothing',r:'You do not move.'},
  {t:'Write down what it means if I am wrong',r:'You write three scenarios. The second one happens. You are ready for it.'}
 ]},
26:{sig:'A new technology theme goes vertical across the board.',
 txt:'Every report calls it a once-in-a-decade revolution. The story is airtight: technical breakthrough, demand explosion, winner takes all.',
 opts:[
  {t:'Go in heavy, this time is different',r:'You buy at the high. The story is true — the price already reflected all of it.'},
  {t:'Buy a sector ETF, spread it out',r:'You buy the ETF. At least no single name can wipe you out.'},
  {t:'Work out the growth the price implies',r:'You calculate that it needs 60% growth for eight straight years to make sense. You do not buy.'},
  {t:'Leave it, stick to the plan',r:'You miss the run. That "miss" will take its revenge before long.'}
 ]},
27:{sig:'You start to look down on how your colleagues handle money.',
 txt:'Deposits, insurance policies. When they ask your opinion you cannot be bothered to answer properly. You are now the one who knows.',
 opts:[
  {t:'Start a group chat and teach them',r:'You have an audience now. Which makes admitting a mistake that much harder.'},
  {t:'Keep quiet',r:'You say less. You keep the freedom to change your mind.'},
  {t:'Charge for a course',r:'You take their money. Now your identity is welded to your positions.'},
  {t:'Remember that I am actually behind',r:'You check the numbers. You are behind. You tell nobody.'}
 ]},
28:{sig:'The analyst\'s target price blows up in his face.',
 txt:'On camera he explains, awkwardly: "The macro environment moved in ways we had not anticipated…"',
 opts:[
  {t:'I always knew he was useless',r:'You did not always know. You bought on his call at the time.'},
  {t:'Check whether I make the same excuse',r:'You go back through your own notes and find the identical excuse written four times.'},
  {t:'So experts are useless, trust yourself',r:'Half right. The second half is the mistake.'},
  {t:'Nobody can forecast, including me',r:'You can say the sentence. You cannot yet live by it.'}
 ]},
29:{sig:'Three in the morning. You are still watching the US market.',
 txt:'Two weeks now of four hours\' sleep a night. Your wife asks if everything is all right. You say it is.',
 opts:[
  {t:'Keep going, this is a critical stretch',r:'You push on for another three weeks. Then you are ill for five days.'},
  {t:'Make a rule: nothing after eleven',r:'The first three days are hard. By the fourth you notice it makes no difference.'},
  {t:'Go long-term so I never watch nights',r:'Your sleep comes back. Your returns do not get any worse.'},
  {t:'Take something to sleep and push through',r:'You push through. The bill comes later.'}
 ]},
30:{sig:'Year eight. You compare numbers with Mike.',
 txt:'His account is up 22%. Yours is up 9%. You have placed 240 trades. He has placed 12 — all of them scheduled contributions.',
 opts:[
  {t:'I took less risk to get there',r:'Your volatility is twice his. You never worked that out.'},
  {t:'Add up exactly what the costs took',r:'Commissions and spreads: 4.2%. Which is to say your entire excess return went to the broker.'},
  {t:'Move half into the index',r:'You split half out. That half saves you later.'},
  {t:'This year does not count, I am changing strategy',r:'You say that every year.'}
 ]},
31:{sig:'The one you passed on is up another 80%.',
 txt:'You look at the chart and your stomach twists. If you had bought… you did the sum. About $75,000.',
 opts:[
  {t:'Buy now, I cannot miss it twice',r:'You chase it at the top. Three months later it halves.'},
  {t:'A small position, just to be in it',r:'You chase small. You still lose.'},
  {t:'Accept the miss — you cannot catch them all',r:'One of the hardest decisions in the whole game. You made it.',
   why:'You will not catch every move. You only need to avoid boarding the last train at the highest price.'},
  {t:'Go find the next one like it',r:'You find three. All three go nowhere.'}
 ]},
32:{sig:'An old café. You meet an old hand.',
 txt:'"How long have you been at it, son?" "Seven, eight years." He nods. "Forty for me. My best ten years were the ten where I did nothing at all."',
 opts:[
  {t:'He is old, the market has changed',r:'You do not really listen. You understand that sentence many years later.'},
  {t:'Ask him why',r:'He talks for two hours. It comes down to one line: "Not losing is winning."'},
  {t:'Ask about his worst loss',r:'He tells you. You realise his mistake is the one you are making right now.'},
  {t:'Think: so I wasted seven years',r:'The thought hurts. It is also useful.'}
 ]},
33:{sig:'You decide to lever up.',
 txt:'Cost of funds 5.5%. Your strategy makes 12% a year. Mathematically, borrowing is correct. You have checked the sum many times.',
 opts:[
  {t:'Borrow the lot — two times leverage',r:'The maths is right. The maths did not include volatility drag or a forced liquidation.',
   why:'Leverage magnifies more than returns; it magnifies the swings. The same drawdown costs you double, and you may not survive to see the rebound.'},
  {t:'1.3 times, keep it conservative',r:'You borrow a little. More pressure, still bearable.'},
  {t:'Do not borrow',r:'You skip it. In the next downturn you will be glad.'},
  {t:'Model the worst case first',r:'You work out that a 45% fall wipes you out. You do not borrow.'}
 ]},
34:{sig:'You are doing less and less at work.',
 txt:'Your manager asks for a word. "Is something distracting you lately?" Your annual review has gone from A to C.',
 opts:[
  {t:'Quit and trade full time',r:'You resign. With no salary, every decision you make gets more urgent.'},
  {t:'Rein it in, focus on the job',r:'Your review is back to an A the following year. Your returns are no worse.',
   why:'Your salary is the largest asset you own in your thirties. A 30% raise usually beats every trade you make put together.'},
  {t:'Do both, I can take it',r:'You manage a year. Then you come apart.'},
  {t:'Realise the salary is my steadiest cash flow',r:'You start treating your pay as a bond with no maturity. That framing saves you.'}
 ]},
35:{sig:'The market goes sideways for three months.',
 txt:'No rise, no fall. Your system gives no signal. Your hands itch.',
 opts:[
  {t:'Find something to do, anything',r:'You place seven trades and lose the commission on all of them.'},
  {t:'Do nothing',r:'The hardest kind of action. You manage it.'},
  {t:'Go study a new market — crypto?',r:'You step into an arena you understand nothing about.'},
  {t:'Use the time to tidy the portfolio',r:'You rebalance. Reasonable.'}
 ]},
36:{sig:'Kenny is back, and he is an influencer now.',
 txt:'On camera he is magnificent. His paid group costs $110 a month and has three thousand members. He earns far more than you do — off people like you.',
 opts:[
  {t:'I should start one too',r:'You do. Your income shifts from investing to selling opinions.'},
  {t:'Call him out',r:'Nobody believes you. His followers pile on.'},
  {t:'Understand it: selling shovels is the business',r:'You understand, and you do not do it. You keep yourself intact.'},
  {t:'Subscribe to see what he is saying',r:'You pay the $110. The content is free news, restated.'}
 ]},
37:{sig:'You dig out the notebook from five years ago.',
 txt:'Page one says: "Sample too small." You have no memory of writing it. Your current strategy rests on the results of 11 trades.',
 opts:[
  {t:'Stop now and revalidate everything',r:'You stop for two months. In those two months you lose nothing.'},
  {t:'11 is enough, I have live experience',r:'You carry on.'},
  {t:'Tear the page out',r:'You do not want to look at it. That gesture is itself the answer.'},
  {t:'Start logging every decision from today',r:'You begin a decision journal. That habit is what eventually saves you.'}
 ]},
38:{sig:'⚠ The market falls 12% in a single day.',
 txt:'If you are levered, your broker is dialling your number right now. The roof is cold.',
 opts:[
  {t:'Post more margin and hold the line',r:'You pledge the last of your cash.'},
  {t:'Cut leverage now and eat the loss',r:'You cut. It hurts, and you survive.'},
  {t:'Liquidate everything, get out',r:'You leave at the low. Six months later the market is at a new high.'},
  {t:'Buy the fall, this is the opportunity',r:'If you have cash, this is correct. If you do not…'}
 ]},
39:{sig:'The old hand sees the colour of your face.',
 txt:'"Are you levered?" You do not answer. He sighs. "So was I, once. It took me eight years to pay it off."',
 opts:[
  {t:'Ask how he got through it',r:'"I didn\'t get through it. I gave up and started again."'},
  {t:'My situation is different',r:'Everybody thinks that.'},
  {t:'Call the broker right now and cut',r:'You call from the table. The old hand nods.'},
  {t:'I do not want to talk about it',r:'You leave.'}
 ]},
40:{sig:'Mike notices how much weight you have lost.',
 txt:'"I hear it\'s been rough lately?" He does not push, just hands you a coffee. His account is down 18% this year. He has done nothing about it.',
 opts:[
  {t:'He is down 18% too, so I am not so bad',r:'You are down 44%. You avoided doing that arithmetic.'},
  {t:'Ask how he is not frightened by that',r:'"I don\'t need the money right now." He says it completely flatly.'},
  {t:'Say honestly that I am in a bad way',r:'You say it out loud. You have not felt this light in a long time.'},
  {t:'Lie and say everything is fine',r:'You say it with a smile. You cry when you get home.'}
 ]},
41:{sig:'The market starts to recover.',
 txt:'Your account goes from -44% back to -22%. You start thinking you should size up and win the losses back.',
 opts:[
  {t:'Size up to win it back',r:'That is a gambler\'s reasoning. Your capital does not know it ever lost money.'},
  {t:'Keep the same pace, no extra',r:'You do not rush.'},
  {t:'Buy index funds while it is low',r:'You buy the index. This is the part of the portfolio that ends up worth the most.'},
  {t:'Sell it all and take a break',r:'You step out. You miss the recovery, and you keep your sanity.'}
 ]},
42:{sig:'Your group is asking why everything you recommended is down.',
 txt:'People start leaving. You took money from these people.',
 opts:[
  {t:'Tell them they held it wrong',r:'Your credibility is gone. Your ego is intact.'},
  {t:'Admit it publicly and refund them',r:'It hurts. You are buying your freedom back.'},
  {t:'Double down on the calls to prove myself',r:'You have now staked your self-respect on a position.'},
  {t:'Shut the group down',r:'You close it. At last you are allowed to change your mind.'}
 ]},
43:{sig:'You sit down to total up eleven years.',
 txt:'This is the calculation you have been avoiding. You open the spreadsheet and your hand stops in mid-air.',
 opts:[
  {t:'Do the sum',r:'3.1% a year. The index did 9.4%. You look at that number for a long time.'},
  {t:'Forget it, do not calculate',r:'You close the spreadsheet. You protect how you feel.'},
  {t:'Only count the winners',r:'That comes out at 28%. You screenshot it and post it.'},
  {t:'Include commissions and my time',r:'With time costed in, you are negative. It is the most valuable spreadsheet of your life.'}
 ]},
44:{sig:'The old hand says nothing, and drinks his tea.',
 txt:'You ask him: "If you could start over, what would you do?" He looks into the cup for a long, long time. "I\'d start doing nothing twenty years earlier."',
 opts:[
  {t:'Would that not be a boring life?',r:'"Boring?" He laughs. "It took me forty years to buy that word."'},
  {t:'Understand it, right there',r:'In that moment you truly understand. The problem is that understanding and doing are two different things.'},
  {t:'But he is rich now, isn\'t he?',r:'You never asked how many people did the same thing in the same years and lost everything.'},
  {t:'Ask whether there is still a way out',r:'"There is. You can stop today."'}
 ]},
45:{sig:'Twelve years. The turning point.',
 txt:'You are standing on the roof. You are forty-two. You have spent twelve years proving one thing: you are not a genius at this. The question is whether you will admit it.',
 opts:[
  {t:'All into the index, and finish',r:'You do it. Your veteran years will look very different.'},
  {t:'Keep 10% to play with, 90% index',r:'You keep a toy box. It is the most practical arrangement there is.',
   why:'Giving yourself a safe place to play beats forcing yourself to quit outright and then breaking the rule all at once one day.'},
  {t:'I simply have not found the right method',r:'You decide to keep trying. The veteran years begin.'},
  {t:'I am too deep in to quit now',r:'Twelve years is not capital. It is money already spent. But you treat it as capital.'}
 ]},

/* ===== Veteran years, 46–70 ===== */
46:{sig:'Twelve years. There is one monitor left on your desk.',
 txt:'You no longer look at minute charts. You have a "style" now. You can explain every decision you make. The problem is that being able to explain it does not make it right.',
 opts:[
  {t:'Trust the style, stay the course',r:'The difference between style and stubbornness is the outcome.'},
  {t:'Force a review of my assumptions each year',r:'You book a review every January. That habit beats any indicator.'},
  {t:'Start teaching the next generation',r:'You are teaching things you have not managed to do yourself.'},
  {t:'Trim down, start planning the exit',r:'You begin thinking about the endgame. Very few people do, at this point.'}
 ]},
47:{sig:'You are invited onto a finance programme.',
 txt:'They introduce you as a "veteran investor". You look around the studio; the lights are very bright. You have five seconds to decide what to say.',
 opts:[
  {t:'Make a bold prediction',r:'Great television. You are now locked in.'},
  {t:'Say honestly that I cannot forecast',r:'The ratings collapse. They never call again. You keep your freedom.'},
  {t:'Stick to the basic principles',r:'Dull, and not wrong.'},
  {t:'Recommend what I am holding',r:'You have turned your own position into a public commitment.'}
 ]},
48:{sig:'A sector you do not understand goes vertical.',
 txt:'Young people are making fast money using methods you cannot follow at all. Your first reaction is: this is a bubble.',
 opts:[
  {t:'Definitely a bubble, stay away',r:'You may be right. You may also just not want to learn something new.'},
  {t:'Learn it properly before judging',r:'You spend three months on it. Your conclusion is the same as before — but now it has a basis.'},
  {t:'Short it',r:'The market can stay irrational longer than you can stay solvent.'},
  {t:'Take a small position against my ignorance',r:'You buy a very small amount. Reasonable humility.'}
 ]},
49:{sig:'The old hand is ill.',
 txt:'He is in hospital. His son says the thing his father regretted most was that at sixty he could not resist going back into the market, and lost half his retirement.',
 opts:[
  {t:'He got old and careless, I would not',r:'When you are sixty, you will remember this moment.'},
  {t:'Write down my exit plan right now',r:'You write it. Date, amount, conditions. That sheet of paper is worth a great deal.'},
  {t:'Ask his son for the details',r:'It turns out the trigger was one sentence from a friend.'},
  {t:'Do not want to face it, change the subject',r:'You leave. The story stays in your head anyway.'}
 ]},
50:{sig:'Mike says he has done the sums, and he no longer has to work.',
 txt:'He has not quit, but he knows he could. You ask how many trades he has made. He thinks about it: "Fifty-ish? All of them contributions."',
 opts:[
  {t:'There is still time to catch up',r:'You have twenty rounds left.'},
  {t:'Ask what the number actually is',r:'He tells you. Yours is 40% of his. You cannot make yourself smile.'},
  {t:'Move everything into the index now',r:'A decision fifteen years in the making. Late beats never.'},
  {t:'Congratulate him, go home and count',r:'You spend the night with a calculator.'}
 ]},
51:{sig:'Your strategy has trailed for three years running.',
 txt:'Your explanation is that the environment does not suit your style. You have used that explanation for three years.',
 opts:[
  {t:'Wait, the style always comes back',r:'Some styles never come back.'},
  {t:'Admit the strategy may simply be dead',r:'The hardest sentence there is. You say it.'},
  {t:'Size up while it is out of favour',r:'You have converted a belief into a position size.'},
  {t:'Set an objective stop line',r:'"If I trail for two more years, I switch to the index." You write it down.'}
 ]},
52:{sig:'You are forty-three. Someone much younger becomes your boss.',
 txt:'For fifteen years half your mind has been somewhere other than your job. Your career curve looks exactly as flat as your investment curve.',
 opts:[
  {t:'Never mind, I will be financially free eventually',r:'You have been saying "eventually" for ten years.'},
  {t:'Take the job seriously — human capital is the biggest asset',r:'Your salary goes up 30%. That return beats every trade you have ever made.',
   why:'This is the only route in the whole game that beats Mike without needing luck.'},
  {t:'Cannot let go of either one',r:'You keep being pulled in both directions.'},
  {t:'Switch careers into finance',r:'You get in, and discover that the people inside are all selling shovels too.'}
 ]},
53:{sig:'You have held one stock for eight years.',
 txt:'It is your "core holding". You can tell its story. You will not sell it. You have started to feel it is a part of you.',
 opts:[
  {t:'Never selling, this one is mine',r:'If you did not already own it, would you buy it at today\'s price? You never asked yourself.'},
  {t:'Ask: would I buy it today at this price',r:'The answer is no. You sell.'},
  {t:'Cut it to a sensible weight',r:'You take it from 40% down to 15%.'},
  {t:'Add more, conviction must be firm',r:'Conviction does not move the share price.'}
 ]},
54:{sig:'Kenny\'s paid group collapses.',
 txt:'The news says he is under investigation for market manipulation. He has vanished. Three thousand subscribers, many of them wiped out. You very nearly followed him once.',
 opts:[
  {t:'I always knew there was something wrong',r:'You did not. You followed him twice.'},
  {t:'Ask whether I am doing anything similar',r:'You go back over your own posts in the group. Some of them you cannot bear to reread.'},
  {t:'Feel lucky',r:'Luck is not a strategy. But at least you are honest about it.'},
  {t:'Go and pick up his customers',r:'You take them on. You have become the man you once despised.'}
 ]},
55:{sig:'Your son asks you: "Dad, what is investing?"',
 txt:'You open your mouth and realise you do not know what to teach him. You do not want him walking your road.',
 opts:[
  {t:'Tell him: buy the index, leave it alone',r:'After you say it there is a long silence. You know what you just said.'},
  {t:'Teach him my stock-picking method',r:'You are teaching him a method you have not been able to prove yourself.'},
  {t:'Tell him never to touch stocks',r:'An overreaction. An understandable one.'},
  {t:'Tell him we will talk about it later',r:'You dodge it, because the honest answer is too hard to say.'}
 ]},
56:{sig:'A bear market. The index is 38% off its high.',
 txt:'You have lived through three of these. You know how it goes. The problem is that knowing and doing are still two different things.',
 opts:[
  {t:'Keep contributing on schedule, touch nothing',r:'Fifteen years of experience finally does something genuinely useful.'},
  {t:'Sell out and wait for the dust to settle',r:'You avoid the last 12% down, and miss the 60% that follows.',
   why:'Timing means getting two calls right: when to leave, and when to come back. The second is the hard one.'},
  {t:'Borrow to buy the bottom',r:'There is always another floor underneath the floor.'},
  {t:'Halve the position, keep dry powder',r:'A compromise. Not wrong.'}
 ]},
57:{sig:'That analyst is a fund manager now.',
 txt:'"We are 4% behind the market this year." He is perfectly calm. "But I charge 1.5% on a billion. I don\'t need to beat anything."',
 opts:[
  {t:'Understand the whole industry, right there',r:'You get it: you are their product, not their client.'},
  {t:'I want to run a fund',r:'You want to charge other people that fee. You have become part of the structure.'},
  {t:'Then I am better off doing it myself',r:'Half right. Your own costs are in fact higher than his.'},
  {t:'Just buy the cheapest index fund',r:'You pick the one with the lowest fee.'}
 ]},
58:{sig:'Sixteen years, annualised: 5.8%.',
 txt:'The index over the same period: 10.2%. A gap of 4.4%. Compounded over sixteen years, that gap is a house.',
 opts:[
  {t:'Work out exactly what it cost',r:'You calculate it. You sit looking at the number.'},
  {t:'I learned things, it was not wasted',r:'The tuition was expensive. The lesson is: do not pay this tuition.'},
  {t:'Switch it all to the index now',r:'Sixteen years. You finally do it.'},
  {t:'Do not look, carry on as before',r:'You close the spreadsheet.'}
 ]},
59:{sig:'Mike is in the park with a small child.',
 txt:'He has stopped working. He says the money is still there and he only draws 4% a year. He asks you: "Are you out yet?"',
 opts:[
  {t:'Nearly, just a bit more to go',r:'You have been saying "a bit more" for ten years.'},
  {t:'Say honestly: no, and maybe never',r:'He does not try to comfort you. He just sits next to you.'},
  {t:'Ask how the 4% is worked out',r:'He explains it. It is simple. So simple that the last fifteen years feel absurd.'},
  {t:'Change the subject',r:'You talk about the weather.'}
 ]},
60:{sig:'Your wife asks: "When can we buy a place?"',
 txt:'Over fifteen years your investment account has gone from $37,500 to… you do not want to say the number.',
 opts:[
  {t:'Tell the truth',r:'She does not shout at you. She just says: "Then we work it out together."'},
  {t:'Inflate the number',r:'This is a lie you now have to keep up.'},
  {t:'Say two more years',r:'Two more years, and then two more.'},
  {t:'Liquidate everything and buy',r:'You leave the market. At least you have a home.'}
 ]},
61:{sig:'A new opportunity. Someone wants you in on a private fund.',
 txt:'The claim is 20% a year, locked up for three. On paper it looks beautiful. Fifteen years of experience tell you: too beautiful.',
 opts:[
  {t:'In — this is the last chance to turn it around',r:'Two years later they stop answering the phone.'},
  {t:'Check the audit and the custodian first',r:'You find there is no independent custodian. You walk away.'},
  {t:'Take a small piece',r:'A small piece is still a total loss.'},
  {t:'Refuse — I do not do this any more',r:'Fifteen years of experience finally buy you one "no".'}
 ]},
62:{sig:'Someone asks you to write a book.',
 txt:'The suggested title is My Road Through the Markets. The editor says: "Readers like success stories."',
 opts:[
  {t:'Write it, but write the truth',r:'It sells badly. What you wrote is true.'},
  {t:'Write the success story, pick the winners',r:'It sells thirty thousand copies. You have misled thirty thousand people.'},
  {t:'Do not write it',r:'You are not qualified to teach anyone. You know that.'},
  {t:'Write one telling people not to copy me',r:'That book saves a few people. You will never know which ones.'}
 ]},
63:{sig:'You are forty-seven.',
 txt:'You are standing on the same roof. You stood here thirteen years ago. You were thirty-four then, and you thought you were going to win.',
 opts:[
  {t:'I have years left, I can still catch up',r:'Compounding needs time. You are running out of it.'},
  {t:'Accept it, switch to the index, finish',r:'Going back down the stairs, your step is lighter.'},
  {t:'One more big bet',r:'Desperate position sizing has never ended well.'},
  {t:'Write down what I learned, for my son',r:'You write three pages. The first line is: "Don\'t do what I did."'}
 ]},
64:{sig:'You are sitting in the old hand\'s seat now.',
 txt:'A young man sits down and asks: "How long have you been doing this?" You hear yourself say: "Seventeen, eighteen years." His eyes light up.',
 opts:[
  {t:'Teach him my method',r:'You have packaged your own failure as experience and handed it on.'},
  {t:'Tell him to buy the index and not copy me',r:'He looks disappointed. Years from now he will thank you.'},
  {t:'Tell him about my worst mistake',r:'You talk for forty-five minutes. You end up in tears yourself.'},
  {t:'Tell him there are no shortcuts',r:'He does not take it in. Neither did you.'}
 ]},
65:{sig:'You realise you have not checked a price in six months.',
 txt:'Not out of discipline. Out of exhaustion. While you were not looking, the portfolio went up 14%.',
 opts:[
  {t:'Get back to managing it actively',r:'Your intervention gives it all back within six months.'},
  {t:'Keep not looking',r:'Your doing nothing is the best strategy of your last fifteen years.'},
  {t:'Write this down',r:'You note: "My intervention has negative value."'},
  {t:'Decide it was luck',r:'You refuse to accept a conclusion this simple.'}
 ]},
66:{sig:'A bull market. Everyone is making money.',
 txt:'The newcomers are up 60% this year. They tell you your approach is obsolete. It sounds very familiar.',
 opts:[
  {t:'Add and catch up, I refuse to be left behind',r:'You chase. You did exactly this fifteen years ago.'},
  {t:'Cut back, call the top',r:'Bull markets can run a very long time.'},
  {t:'Stick to the plan, no change',r:'You do not move. That is discipline, not luck.'},
  {t:'Tell them the bubble will burst',r:'Nobody listens. You did not listen either.'}
 ]},
67:{sig:'Mike spreads his hands.',
 txt:'"I really didn\'t do anything special." He means it. "I just… never stopped buying, and never sold."',
 opts:[
  {t:'He got lucky with his era',r:'Partly true. His era was the same as yours.'},
  {t:'Accept it: simple is the answer',r:'You spent fifteen years learning something that takes five minutes to say.'},
  {t:'Ask if he ever regretted anything',r:'"Yes. I regret not starting three years earlier."'},
  {t:'Still not willing to accept it',r:'Refusing to accept it is the most expensive emotion there is.'}
 ]},
68:{sig:'Third from last. You have to set the final allocation.',
 txt:'There is not much time left. Every decision now carries far more weight than it did fifteen years ago.',
 opts:[
  {t:'All index, locked down',r:'You make the final simplification.'},
  {t:'Conservative, add bonds',r:'You cut the volatility. A reasonable choice at a reasonable age.'},
  {t:'One last roll of the dice',r:'You stake fifteen years on the final three rounds.'},
  {t:'Leave it as it is',r:'You do not move.'}
 ]},
69:{sig:'Second from last.',
 txt:'You open the spreadsheet and look at nineteen years of records. Every line is a decision. At the moment you made each one, you thought you were being reasonable.',
 opts:[
  {t:'Go line by line and mark the emotional ones',r:'You count a great many emotional decisions.'},
  {t:'Close it, I do not want to look',r:'You close it.'},
  {t:'Export it and send it to my son',r:'You write: "This is a record of what not to do."'},
  {t:'Only look at the best ten lines',r:'Those ten lines are beautiful. They mean nothing.'}
 ]},
70:{sig:'The last round. You are fifty.',
 txt:'You are on the same bench as Mike. You talked here fifteen years ago. He asks: "Was it worth it?"',
 opts:[
  {t:'Worth it, I learned a lot',r:'You are not entirely sure of it as you say it.'},
  {t:'No. I should have listened to you on day one',r:'He says nothing. He hands you a coffee.'},
  {t:'I do not know',r:'That may be the most honest answer available.'},
  {t:'Next time I will do better',r:'There is no next time. This is the last round.'}
 ]}

};
