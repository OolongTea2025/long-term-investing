# E. Hardcore asset pricing — no-arbitrage, CCAPM, Shiller

!!! who "Who this chapter is for"
    **🔴 Optional deep dive · the hardest one (read it for the theory alone)**<span class="lvtag">optional</span>
    This is the most theoretical chapter on the site — the **mathematical skeleton** behind asset prices: no-arbitrage pricing, the stochastic discount factor, Shiller's excess volatility, why CCAPM failed, and the century-defining breakthroughs of three Nobel laureates. **None of it changes how you invest**; it's purely for people who want to dig all the way down.

!!! tip "The short version"
    An asset's price = the expected value of **future payoffs × a stochastic discount factor** (no-arbitrage pricing). From which: **short-term returns are unpredictable** (Fama); but **prices fluctuate far more than fundamentals do**, so **there is mean reversion and predictability over the long run** (Shiller). To explain that excess volatility, the discount factor must itself be highly volatile — which rational models (CCAPM) cannot deliver, and so **behavioural finance** enters. Those three threads are precisely the contributions of Fama, Hansen and Shiller.

---

## 1. The no-arbitrage pricing formula

Everything starts here:

!!! note "No-arbitrage pricing"
    An asset's **price today** should equal the **expected value** of **the payoffs it may produce in future × a discount factor** (a probability-weighted average across all possible future states).

    - **No arbitrage**: if the market is efficient, there should be no opportunity to make money without taking risk. Prices should reflect all information about future payoffs; otherwise someone would arbitrage the difference away.
    - **The stochastic discount factor (SDF)**: used to discount future payoffs to the present, reflecting **the time value of money** — a dollar today is worth more than a dollar in the future.

This formula is the common language of modern asset pricing, and everything that follows starts from it.

---

## 2. Unpredictable in the short run

!!! note "Pₜ = Eₜ[Pₜ₊₁]"
    In the short run, price changes are **random** — we cannot predict short-horizon returns.

    **Fama's** work established the efficient market hypothesis: if the market is efficient, prices already reflect all available information, so **analysing past price data cannot predict the future**. He also introduced the **event study** method — studying the effect of specific events on asset prices.

(Echoing the random walk in Chapter A.)

---

## 3. Excess volatility → long-run predictability (Shiller)

This is the most counterintuitive and most profound finding.

!!! quote "Shiller's variance ratio test"
    **Robert Shiller** used the **variance ratio test** to show that **short-run fluctuations in stocks and bonds are more violent than long-run ones.**

    Which means: **prices exhibit mean reversion over the long run** → long-run returns **can be predicted** to some degree. If an asset's return has been above average, future returns tend to be below average (and vice versa).

!!! note "A hard question: why is the SDF so volatile?"
    If the no-arbitrage formula holds, then **the high volatility of asset prices can only come from high volatility in the stochastic discount factor** (because payoffs and fundamentals fluctuate far less).

    Which leaves a large question: **what makes the SDF so volatile? Can economic theory support that much volatility?** ← That question leads straight into CCAPM's failure below.

---

## 4. Why the rational CCAPM failed

Researchers tried to explain the SDF's volatility within a rational framework — most famously with CCAPM.

!!! note "The consumption capital asset pricing model (CCAPM)"
    CCAPM links asset prices to people's **saving and risk decisions**; investors' risk preferences can vary over time (with consumption and wealth shocks).

    **But testing it ran into serious trouble:**
    - CCAPM is a **non-linear** model and requires specifying a complete stochastic process for consumption.
    - Serial correlation in the error terms of a dynamic system makes formal statistical methods very hard to apply.

!!! warning "Hansen's GMM — and CCAPM still rejected"
    - **Lars Peter Hansen** developed the **generalised method of moments (GMM)**, expressing CCAPM as a set of moment conditions that could be estimated and tested — a major methodological breakthrough.
    - **But even with GMM, CCAPM was still rejected by the data**: the time-varying discount factor estimated from the data **could not explain the high volatility of asset prices**.

    Academia was reluctant to abandon it and tried various refinements (different utility functions, heterogeneous investor preferences). But at exactly this moment — **behavioural finance, which takes investor irrationality seriously, was quietly germinating.**

---

## 5. Behavioural finance enters

When rational models couldn't explain the excess volatility, another road opened:

!!! note "Starting from psychology"
    - **Kahneman, Tversky and Thaler** (psychologists) analysed decision-making from a psychological angle.
    - **Shiller** proposed the **noise trader model**: markets contain "smart investors" and "noise traders", and the latter's irrational behaviour pushes prices away from value.

    Behavioural models explain things rational frameworks couldn't:
    - The **high volatility** of prices and trading volumes.
    - **Failures of the law of one price** (identical assets trading at different prices).
    - **The closed-end fund discount puzzle**.

    All pointing to the same conclusion: **investors' irrational behaviour and sentiment have a substantial effect on asset prices.** (Chapter D covers this in detail.)

---

## 6. Cross-sectional differences in expected returns

This thread takes us back to Chapter B:

!!! note "From CAPM to multiple factors"
    - Differences in asset returns were first explained with **CAPM** → and from the 1970s a pile of unexplained phenomena appeared.
    - **Fama–French three factors** added value and size → opening the era of empirical multi-factor pricing.
    - But **what state variables those two factors represent, and why they capture risk the market factor misses, remains unsettled to this day**.

---

## 7. Three Nobel laureates, one century-defining breakthrough

!!! success "The 2013 Nobel Prize in Economics (asset pricing)"
    - **Eugene Fama** — efficient markets, short-run unpredictability.
    - **Lars Peter Hansen** — GMM, making complex models rigorously testable.
    - **Robert Shiller** — excess volatility, long-run predictability, behavioural finance.

    The three look like they disagree (Fama argues efficiency, Shiller argues irrationality), but they are really **different faces of the same question** — and together they constitute our present understanding of asset prices. That spirit of "a real breakthrough always requires challenging yourself" is exactly what these three represent.

---

## 8. What does this chapter have to do with your investing?

!!! tip "The practical conclusions, extracted"
    Even if you remember not one formula, these three conclusions are enough to support your entire strategy:

    1. **The short run is unpredictable** → don't time; invest on a schedule.
    2. **The long run mean-reverts and is more predictable** → hold VT and trust the long-run rise.
    3. **Prices deviate from value (behaviour + limits to arbitrage)** → don't assume the market is always right, but don't assume you can easily beat it either — diversification, low costs and discipline are the ordinary person's optimum.

---

!!! question "Something to think about 🤔"
    1. Why does "prices fluctuate far more than fundamentals" imply long-run predictability?
    2. What was the core reason CCAPM was rejected (hint: SDF volatility)?
    3. Fama (efficiency) and Shiller (irrationality) look opposed — why could they share a Nobel Prize?

---

## Summary

- **No-arbitrage pricing**: price = the expected value of future payoffs × the stochastic discount factor (SDF).
- **Short-run unpredictability** (Fama): prices already reflect information → the short run can't be predicted.
- **Excess volatility → long-run predictability** (Shiller): price volatility > fundamental volatility → mean reversion → long-run predictability; and that volatility must come from a volatile SDF.
- **CCAPM's failure**: even with Hansen's GMM, rational models couldn't explain the volatility → **behavioural finance enters**.
- **Three Nobel laureates** (Fama / Hansen / Shiller) laid the foundations of modern asset pricing from different angles.
- Practical extract: the short run is unpredictable (don't time), the long run is predictable (hold), prices deviate from value (diversify, keep costs low, stay disciplined).

!!! note "Next chapter"
    👉 **[F. Factors, advanced — smart beta, timing, machine learning, portfolio optimisation](F-因子進階.md)**
    The last of the optional deep dives: the engineering practice of factor investing — smart beta tiers, whether factor timing is possible, machine learning and portfolio optimisation.
