# A. How markets work — efficient markets, random walks, mean reversion

!!! who "Who this chapter is for"
    **🔴 Optional deep dive · hard theory (read only if interested; it doesn't change what you do)**<span class="lvtag">optional</span>
    From here on we're in the optional deep dives, explaining the **theoretical foundations** behind everything above. **You can act on all of it without reading this** (the beginner and intermediate sections are enough for a lifetime). But if you want to know why the market is so hard to beat, and why the short run is unpredictable while the long run isn't, the answers are here.

!!! tip "The short version"
    **The efficient market hypothesis**: prices already reflect all public information, so short-term movements **can't be predicted** and neither technical nor fundamental analysis reliably beats the market. **Random walk**: short-term price changes are close to random. **Mean reversion**: over the long run prices tend to return to their average. Together these explain the core of this whole site — **the short run is unpredictable (so don't time), but the long run has high odds in your favour (so buy VT and hold).**

---

## 1. First, what is a "hypothesis"?

!!! note "Hypothesis"
    An explanation of a natural phenomenon, built on scientific facts and principles and on analysis of data, which **can be accepted and can also be refuted**.

    Note the word "hypothesis" — it is **the best explanation currently available**, not iron truth. Efficient markets and random walks below are both hypotheses, each with its own domain of validity and its own exceptions.

---

## 2. The efficient market hypothesis (EMH)

Developed in depth by the economist **Eugene Fama** in 1970, it's one of the most important ideas in investing.

!!! quote "The core definition"
    If, in a given market, **prices fully reflect all available information**, that market is efficient.

    The implication: share prices are **unpredictable**. Whether you rely on luck or on inside information, the time, money and effort you spend trying to predict prices is **wasted** — and in theory no technical analysis works.

**Three underlying assumptions:**

1. The market reflects new information **immediately** and adjusts to a new price → price changes depend on the arrival of new information.
2. New information arrives **randomly** (good news and bad news come together, and you don't know which comes first).
3. There are many **rational, profit-maximising** investors in the market, each analysing independently rather than influencing one another.

### Three strengths of efficiency

=== "Weak form"

    **Prices already reflect all past price information.**

    - You cannot predict the future by analysing **past prices**.
    - Which means — **technical analysis (charts, moving averages) is worthless.**
    - This is the basis of the random walk hypothesis.

=== "Semi-strong form"

    **Prices already reflect all public information.**

    - You cannot earn excess returns by analysing **public data** (financial statements, news).
    - Which means — **fundamental analysis doesn't work either.**

=== "Strong form"

    **Prices reflect all information, including non-public (inside) information.**

    - Even with inside information you couldn't earn an excess return.
    - This is the most extreme version and the most contested in reality.

---

## 3. When does EMH get it wrong?

EMH isn't universal. It rests on one big premise — **that investors are rational** — and that premise doesn't always hold.

!!! warning "Where EMH breaks down"
    - **In bubbles**: the dot-com bubble, for example, where valuations detached entirely from fundamentals.
    - **In extreme panic**: the early stages of a sudden crisis, when the market sells irrationally.
    - **On crash days** (historical examples like Black Monday).

    All of which shows that **people are not rational over the long run** — precisely because they're people, they have behavioural biases, and biases produce irrational behaviour (that's the subject of Chapter D).

    Also: **small markets** (poor liquidity, small total capitalisation) are inherently more prone to inefficiency. And historically **some people genuinely have outperformed over long periods** (Buffett) — so EMH is a **very good approximation**, not an absolute truth.

!!! tip "What this means for you in practice"
    Even if the market isn't 100% efficient, for **an ordinary person with only public information** it remains **extremely hard to beat**. So the conclusion doesn't change: **don't expect to outperform through timing or stock selection; buying the whole market and holding it is the play with the odds in your favour.**

---

## 4. The random walk hypothesis

Popularised by **Malkiel** in *A Random Walk Down Wall Street* (1973).

!!! note "Random walk"
    Short-term changes in share prices are **random and unpredictable** — which is the weak-form efficiency claim. Past prices **cannot** accurately predict future prices.

    Malkiel's conclusion is blunt: **trying to predict prices and beat the market is a waste of time and makes your performance worse. He recommends buying and holding a broad index fund.** ← which is exactly this site's central argument.

### Challenges to the random walk

No hypothesis is perfect, and the random walk has its critics:

- **Over-simplification**: it ignores how the behaviour and actions of market participants affect prices.
- **Information asymmetry**: the random walk assumes everyone has the same information, but in reality information is unevenly distributed.
- **Mandelbrot's fractal theory**: he argued prices aren't purely random but exhibit **long-range dependence**, and are better modelled by the **fractal market hypothesis**.

---

## 5. The key insight: the longer the horizon, the better the odds

This is the most important bridge from theory to execution.

!!! example "Randomness vs probability"
    You buy a broad index (the S&P 500, say) and hold it:

    - **The shorter the holding period** (less than a day, say): movement is close to **random**, and the random walk may well be correct.
    - **The longer the holding period**: randomness falls and the **statistical signal** in the data becomes clearer — **probability** increasingly dominates, and the **odds** of a positive long-run return rise substantially.

!!! danger "But be careful with this sentence"
    **Long-term investing only buys you the side with better odds; it doesn't guarantee you win.**

    Good odds ≠ certainty (echoing Howard Marks in Chapter 9: the future is a probability distribution). You hold VT for the long run because **the data says it's the bet with the best chance**, not because it "must" pay. That clarity is what lets you hold on.

---

## 6. Mean reversion

!!! note "Mean reversion"
    An asset's price **tends to return to its average level** over the long run.

    - When the market price is **below** the long-run average → expect it to recover.
    - When the market price is **above** the long-run average → expect it to fall back.

    Departures from the average are expected to **return toward it**.

This concept matters because it explains several things at once:

- **Why the value and size factors have a premium**: stocks beaten down away from their value have a chance to revert over the long run (see Chapter C).
- **Why rebalancing does a little work**: assets that ran up fall back and those that fell recover (see Chapter 7).
- **Why regional diversification helps**: a market that has lagged for a long time has a chance to take its turn (see Chapter 4).

!!! warning "But mean reversion is not a timing tool"
    "Below average, so it'll rise" sounds like technical analysis working — but **predicting exactly *when* it will revert, and to what level, is extremely hard**. Mean reversion is a **long-run tendency**, not a **short-term signal**. Don't use it to bet on timing.

---

## 7. How did factor investing "overturn" pure EMH?

Here's the interesting part: Fama proposed EMH himself, and then he and French found **anomalies CAPM couldn't explain** (small caps and value stocks earning abnormally high returns).

!!! note "From anomalies to factors"
    - Pure CAPM/EMH says there should be no systematic excess return beyond market risk.
    - But the evidence showed **the size and value anomalies persisted**.
    - So Fama and French used **multi-factor models** (the three-factor model, for example) to absorb those anomalies — reinterpreting them as **systematic risks that require higher expected returns**.

    That moved EMH from "the market has one factor" to "the market has several systematic risk factors". That bridge takes us to Chapter B.

---

!!! question "Something to think about 🤔"
    1. If the market really is semi-strong efficient, is "reading financial statements to pick stocks that beat the market" theoretically possible?
    2. "Random in the short run, good odds in the long run" — how does that sentence support buying VT on a schedule and holding?
    3. Is mean reversion a long-run tendency or a short-term signal? Why can't you use it for timing?

---

## Summary

- **The efficient market hypothesis (Fama)**: prices reflect all public information → short-run prices are unpredictable; forms are weak (technical analysis doesn't work), semi-strong (fundamental analysis doesn't work) and strong (even inside information doesn't work).
- EMH assumes rational people, so it breaks down in **bubbles, panics and small markets**; but for an ordinary person, **the market is still extremely hard to beat**.
- **The random walk (Malkiel)**: short-term prices are close to random → the conclusion is to **buy and hold a broad index**.
- **The key point**: longer horizon, less randomness, better odds — but **good odds ≠ certainty**.
- **Mean reversion**: a long-run tendency back to the average, which explains factor premia, rebalancing and regional diversification, but **is not a timing signal**.
- Factor investing moved EMH from a single market factor to several systematic risk factors → which leads into Chapter B.

!!! note "Next chapter"
    👉 **[B. Asset pricing models — CAPM → three factors → five factors](B-資產定價模型.md)**
    How has academia answered "where does return come from", step by step? From the simplest CAPM to the Fama–French five factors.
