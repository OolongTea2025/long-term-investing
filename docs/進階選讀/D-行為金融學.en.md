# D. Behavioural finance & market anomalies — how people make mistakes systematically

!!! who "Who this chapter is for"
    **🔴 Optional deep dive · hard theory**<span class="lvtag">optional</span>
    Chapter A said markets are efficient in theory, while Chapter C kept mentioning behavioural bias. This chapter supplies the other half: **the human brain has a set of systematic biases that push market prices away from value**. It also answers a classic question — if there is mispricing, why doesn't smart money instantly arbitrage it away?

!!! tip "The short version"
    Traditional finance assumes people are rational, but **behavioural finance** shows that people make systematic errors in **expectations, risk preferences and cognition**. Add **limits to arbitrage** (fundamental risk, noise trader risk, implementation costs) and smart money cannot arbitrage fully → **prices can deviate from value for long periods**. The conclusion (Statman's "behavioural efficient market"): **"price = value" usually doesn't hold, but "the market is hard to beat" still does.**

---

## 1. What does behavioural finance challenge?

Traditional finance rests on two assumptions: **people have rational expectations** and **decide by maximising expected utility**. Three elements follow from that, and behavioural finance challenges each:

!!! note "Three elements under challenge"
    | Traditional assumption | The behavioural challenge |
    |---|---|
    | **Rational expectations** | Expectations aren't fully rational; there is overconfidence, anchoring and more |
    | **Processing all information promptly** | Cognitive research shows the brain's processing capacity is **limited** and can't do this |
    | **Fully rational risk preferences** | Under uncertainty people struggle to be rational; see prospect theory and ambiguity aversion |

---

## 2. Limits to arbitrage: why doesn't mispricing disappear immediately?

This is the crucial question. Even if something is mispriced, in theory smart money should arbitrage it away instantly — and in reality it doesn't.

!!! example "The Kobe earthquake (1995) — the market isn't instantly rational"
    On 17 January 1995 a magnitude 7.3 earthquake struck Kobe, Japan. **The Tokyo market fell only slightly on the day**; it took a week for the market to properly reflect the impact — by 23 January the Nikkei had fallen 5.6%, and about 8% cumulatively over the ten days after the quake.

    Stranger still: on the day the Nikkei fell hard, **London's FTSE fell 1.4%, Paris's CAC 2.2%, Germany's DAX 1.8%, and Brazil and Argentina around 3%** — none of these countries were directly affected by the earthquake. Those price movements **cannot have come from purely rational behaviour**, showing that information takes time to travel and be digested, and that markets are interconnected.

!!! note "The noise trader model + three limits to arbitrage"
    Behavioural finance sees markets as made up of **rational investors** and **noise traders**. But rational investors can't fully exploit mispricing, because of **limits to arbitrage**:

    1. **Fundamental risk**: the arbitrage position can lose money if fundamentals deteriorate.
    2. **Noise trader risk**: irrationality can persist longer than you can; the arbitrageur may blow up before prices revert.
    3. **Implementation costs**: trading costs, short-selling restrictions and so on.

    So mispricing **can persist** rather than being immediately erased.

---

## 3. A map of the biases: three classes of systematic error

(These echo the "12 traps" in Chapter 6 of the beginner section, but this is the **theoretical taxonomy** version.)

### (1) Biases in expectations

!!! example "Errors when assessing the future"
    - **Overconfidence**: excessive confidence in your own judgement → this explains the huge daily trading volume in markets.
    - **Optimism**: innate optimism, amplified by the illusion of control.
    - **Representativeness heuristic**: judging by similarity while ignoring base rates.
    - **Conservatism**: once a view forms, refusing to update it, and changing very slowly.
    - **Confirmation bias**: selectively recalling and gathering supportive information while ignoring contradictory evidence.
    - **Anchoring**: over-relying on the first piece of information (the anchor) even when it's irrelevant.
    - **Availability heuristic**: judging by whichever example comes to mind most easily.

### (2) Biases in risk preferences

!!! note "Errors under uncertainty"
    - **Prospect theory** (Kahneman & Tversky): describes how people decide under uncertainty; its core is a **value function** (how gains and losses are evaluated, with losses hurting more than equivalent gains) and a **weighting function** (distorted probabilities, with small probabilities overweighted).
    - **Ambiguity aversion**: when the distribution of outcomes is unknown, people prefer the familiar option; but because of optimism and confirmation bias, people often **lose worse** in domains they merely believe they know well.

### (3) Cognitive limits

!!! note "Innate limits on processing capacity"
    - **Limited attention**: the brain has finite processing capacity and responds only to the most salient information. (An old piece of news gets widely covered by mass media, and only then do investors suddenly pay attention.)
    - **Categorical thinking**: sorting assets into categories to simplify thinking → judging by the category rather than individual fundamentals. (A stock gets added to an index, and its price starts moving with the index's other constituents.)

---

## 4. How biases produce market anomalies

!!! example "From bias to anomaly"
    - **Post-earnings announcement drift (PEAD)**: limited attention means people under-react to new fundamentals → prices **keep drifting** after earnings are announced. (The drift is more pronounced when the news lands on a Friday.)
    - **Investor sentiment models**: driven by conservatism and the representativeness heuristic → producing momentum and value anomalies.
    - **Overconfidence about private information**: deep research produces overconfidence, and confirmation bias suppresses the contrary case → producing momentum and earnings momentum.
    - **Under-reaction / over-reaction**: fundamental traders and momentum traders interact → short-run under-reaction (momentum profits), and as a mass of momentum traders adopt the same strategy → eventual over-reaction and reversal.
    - **Lottery stocks (right-skewed returns)**: people overweight tail probabilities → over-chasing right-skewed "might hit the jackpot" stocks → pushing prices up and **lowering future returns**.
    - **The disposition effect**: unable to hold winners (taking profits fast) and unable to let go of losers (hoping to break even) — related to loss aversion.

---

## 5. The behavioural efficient market: two claims to keep separate

!!! quote "Statman's 'behavioural efficient market'"
    The efficient market hypothesis actually contains **two layers**, and they need separating:

    1. **"Price = value"** — because of behavioural bias plus limits to arbitrage, prices **can deviate from value without being corrected** → this layer **usually doesn't hold**.
    2. **"The market is hard to beat"** — for an ordinary investor with only public information → this layer **still holds**.

    **The key insight**: "there's no free lunch" (the market is hard to beat) **does not mean** "price = value". Even in an inefficient market, "no free lunch" holds — but you **cannot** infer "price = value" from it.

    > Fischer Black put it well: noise makes markets less efficient, but **it also prevents people from exploiting that inefficiency** — which is the best summary of the behavioural efficient market there is.

---

## 6. Real anomalies and fake ones: three possibilities

When you find a variable that predicts returns, there are three possible reasons behind it — and **telling them apart matters**:

!!! note "Risk compensation vs mispricing vs data snooping"
    1. **Risk compensation**: the high-return stocks carry more systematic risk → the return is payment for it. (Testable via β in an asset pricing model.)
    2. **Mispricing**: cumulative returns keep rising after portfolio formation → reflecting a price discovery process where prices absorb information slowly.
    3. **Data snooping (overfitting)**: too many people testing too many variables on the same dataset → a published "significant anomaly" is guaranteed to look good **in sample** but may be spurious **out of sample**.

!!! warning "How do you tell them apart? Out-of-sample data"
    Because publication bias and data snooping bias are severe, simply raising the t-statistic threshold helps only so much. **Checking against genuinely new out-of-sample data is the best way to weed out spurious factors.** ← This is the theoretical basis for Chapter 10's warning that factors fail out of sample.

---

## 7. Investor sentiment

!!! note "Sentiment as a composite indicator"
    **Investor sentiment** captures the combined effect of various biases on expected returns:

    - When sentiment is high: **hard-to-value, hard-to-arbitrage stocks get overpriced**, with lower future returns.
    - When sentiment is low: speculative stocks actually perform better, and the market shows a pronounced **high-risk, high-return** pattern.
    - When sentiment is high: expected excess return and risk **stop being related** at all (risk compensation breaks down).

    Which echoes Marks in Chapter 9: **the most dangerous moment is when everyone believes there's no risk** (peak sentiment).

---

!!! question "Something to think about 🤔"
    1. How does the Kobe earthquake show that markets aren't instantly rational? What does that imply about chasing news the moment it breaks?
    2. Why are "the market is hard to beat" and "price = value" two different things? Which holds and which doesn't?
    3. Why should a factor that looks beautiful in a paper be re-tested on out-of-sample data before you trust it?

---

## Summary

- Behavioural finance challenges rationality: people err systematically in **expectations, risk preferences and cognition**.
- **Limits to arbitrage** (fundamental risk / noise trader risk / implementation costs) mean mispricing **doesn't disappear immediately** (the Kobe earthquake being one example).
- Three classes of bias: expectations (overconfidence, anchoring, confirmation…) / risk preference (prospect theory, ambiguity aversion) / cognition (limited attention, categorical thinking).
- Biases create anomalies: PEAD, momentum, lottery stocks, the disposition effect and more.
- **The behavioural efficient market** (Statman): "price = value" usually doesn't hold, but "the market is hard to beat" does; **no free lunch ≠ price = value**.
- Real vs fake anomalies: risk compensation / mispricing / data snooping — **verify with out-of-sample data**.
- The most dangerous moment is peak sentiment (echoing Marks).

!!! note "Next chapter"
    👉 **[E. Hardcore asset pricing — no-arbitrage, CCAPM, Shiller](E-硬核資產定價.md)**
    The hardest chapter: the mathematical skeleton behind asset prices (the no-arbitrage formula, the stochastic discount factor), and the century-defining breakthroughs of three Nobel laureates.
