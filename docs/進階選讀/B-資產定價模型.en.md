# B. Asset pricing models — CAPM → three factors → five factors

!!! who "Who this chapter is for"
    **🔴 Optional deep dive · hard theory**<span class="lvtag">optional</span>
    Chapter 10 taught you **how to use** factors; this one covers **the history of the models behind them**. From CAPM in the 1960s to the Fama–French five factors, it traces how academics closed in on the question of where return comes from. **Chapter 10 is enough for execution; this is for people who want to dig all the way down.**

!!! tip "The short version"
    **CAPM**: return is determined by market risk (β) alone, and explains about two-thirds. **Three factors** (+ size + value): about 90%. **Four factors** (+ momentum): about 95%. **Five factors** (+ profitability + investment): more complete still. Every time a factor is added, it's to explain an **anomaly** the previous generation of model couldn't.

---

## 1. The core question: cross-sectional differences in expected return

Asset pricing tries to answer one question: **why do different stocks have different long-run expected returns?**

!!! note "What determines return?"
    At the most basic level, an asset's price and return are determined by two things:
    1. **Future cash flows** (does the company make money?);
    2. **The discount factor** (investors' preferences about time and risk).

    Different assets have different cash flows, and investors have different time and risk preferences toward them → which creates differences in return. Academia has been searching for a **model** to explain those differences.

---

## 2. First generation: CAPM (the capital asset pricing model)

Proposed in the 1960s, it's the earliest and most elegant answer.

!!! note "The CAPM formula"
    **E(Rᵢ) = R_f + βᵢ × [ E(R_m) − R_f ]**

    - **E(Rᵢ)**: expected return on stock i
    - **R_f**: the risk-free rate
    - **βᵢ**: stock i's sensitivity to the market (a measure of its systematic risk)
    - **E(R_m) − R_f**: the market risk premium

    In plain terms: **your return comes from the market risk (β) you carry.** Higher β, higher risk, higher expected return.

CAPM was supported by the earliest tests. But by the 1970s, **a pile of phenomena it couldn't explain started appearing**.

!!! warning "The cracks in CAPM"
    - **It explains only about two-thirds of the variation in returns.**
    - **Small caps and value stocks** earned **abnormally high** returns relative to CAPM (alpha) — CAPM says there shouldn't be any, and empirically there was.

    Those anomalies forced researchers to ask: beyond market risk, are there other systematic risk factors?

---

## 3. Second generation: Fama–French three factors (1992)

To explain CAPM's cracks, **Fama and French** added two factors alongside the market.

!!! note "The three-factor formula"
    **E(Rᵢ) = R_f + β₁·[E(R_m)−R_f] + β₂·SMB + β₃·HML**

    | Factor | Full name | What it measures |
    |---|---|---|
    | Market | — | Systematic market risk (as in CAPM) |
    | **SMB** | Small Minus Big | The return difference between small- and large-cap stocks |
    | **HML** | High Minus Low | The return difference between high book-to-market (value) and low (growth) stocks |

    - Fama and French argued the value factor relates to **a company's financial distress risk** (beaten-down stock = higher risk = requires higher compensating return).
    - The model explains around **90%** of the variation in returns — a large leap.

**The three-factor model opened the era of empirical asset pricing with multiple factors.**

---

## 4. Third generation: four factors (+ momentum)

Three factors still couldn't explain one thing: **why do some funds outperform persistently?**

!!! note "Carhart's four factors"
    On top of the three factors, **add the momentum factor (MOM)** — the effect where stocks that have risen recently tend to keep rising in the short run.

    With that added, the model's explanatory power rises to around **95%**. Carhart (1997) used this four-factor model to successfully explain most of the performance of equity funds.

---

## 5. Fourth generation: Fama–French five factors (2015)

Fama and French later added two more factors to make the model more complete.

!!! note "The five-factor formula"
    **E(Rᵢ) = R_f + β₁·market + β₂·SMB + β₃·HML + β₄·RMW + β₅·CMA**

    | New factor | Full name | What it measures |
    |---|---|---|
    | **RMW** | Robust Minus Weak | High-profitability vs low-profitability companies (**the profitability factor**) |
    | **CMA** | Conservative Minus Aggressive | Conservatively investing vs aggressively expanding companies (**the investment factor**) |

    - **RMW**: companies that earn well tend to perform better long term.
    - **CMA**: companies that don't burn money expanding tend to do better long term.

!!! example "An interesting consequence: the value factor becomes 'redundant'"
    After the five-factor model appeared, one finding stood out: **the value factor (HML) becomes somewhat redundant inside it** — because most of its explanatory power is absorbed by the profitability and investment factors. Combined with value's mediocre performance after the 2008 financial crisis, this put it under real scrutiny. (Chapter C returns to this as "the challenge to the value factor".)

---

## 6. What's still unresolved?

!!! warning "What the factors represent is still contested"
    A key open question: **what "state variables" do these factors (SMB, HML, and so on) actually represent? Why do they capture risk that the market factor misses?** — academia has **no settled answer**.

    That leads into the **argument over the two sources of a factor premium** (see Chapters C and D):
    1. **Risk compensation**: the factor represents some systematic risk, and the return is the payment for it.
    2. **Behavioural bias / mispricing**: the premium comes from human irrationality.

---

## 7. What this means for actual investing

!!! note "From model to product"
    - **VTI and VOO** invest only in the **market factor** (β).
    - **Five-factor style ETFs** (Dimensional, or the Avantis range such as AVUV and AVGV) deliberately take exposure to **size, value, profitability and investment** (see Chapter 10).
    - Buying the whole market (VT) makes the factors **cancel each other out**, leaving only the market factor — the key point from Chapter 10.

!!! danger "One more reminder"
    Explanatory power going from two-thirds to 95% sounds seductive. But **factors are not guaranteed winners** (they can stop working, trail for years, and cost fees and tracking error — see Chapter 10). **Knowing the theory doesn't mean you should go all-in on factors. For most people the market factor (VT) is already enough.**

---

!!! question "Something to think about 🤔"
    1. Going from CAPM to five factors, what problem was each new factor added to solve?
    2. "The value factor becomes redundant in the five-factor model" — what does that imply about overweighting value?
    3. Why does it matter for a factor's future whether it represents "risk compensation" or "mispricing"?

---

## Summary

- **CAPM**: return = compensation for market risk (β), explains about two-thirds; can't explain the size and value anomalies.
- **Three factors (Fama–French 1992)**: + SMB (size) + HML (value), around 90%; value ~ financial distress risk.
- **Four factors (Carhart)**: + momentum (MOM), around 95%.
- **Five factors (2015)**: + RMW (profitability) + CMA (investment); which makes the value factor somewhat redundant.
- Whether factors represent **risk** or **mispricing** is still contested → Chapters C and D go deeper.
- In practice: VT carrying only the market factor is enough; factor ETFs are advanced, optional and not required.

!!! note "Next chapter"
    👉 **[C. Where the factors come from — size / value / momentum / profitability / investment](C-各因子成因.md)**
    Behind each factor, is it risk compensation or human error? We take the causes and the controversies one at a time.
