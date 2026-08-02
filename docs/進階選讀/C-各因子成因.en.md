# C. Where the factors come from — size / value / momentum / profitability / investment

!!! who "Who this chapter is for"
    **🔴 Optional deep dive · hard theory**<span class="lvtag">optional</span>
    Chapter B introduced the five factors; this one takes each apart to find **what causes it**: are you being compensated by the market for carrying extra risk (risk compensation), or are humans making mistakes and creating mispricing (behavioural bias)? That distinction decides whether a factor still works in future.

!!! tip "The short version"
    Every factor premium is caused by something between **risk compensation** and **behavioural bias**. The **risk-based** ones (size, profitability, investment) tend to be more durable; the **behavioural / mispricing** ones (momentum most obviously) have strong premia but are easily arbitraged away. And **almost every factor has come under scrutiny in recent years** (weakening after publication, dead periods, value becoming redundant under five factors) — which is why diversifying across factors, rather than betting heavily on one, is the sound approach.

---

## 1. The size factor (SMB)

"Small caps returned slightly more over the long run" — there are several accounts of why:

!!! note "The risk-compensation view"
    - **Financial distress risk** (Chan & Chen 1991; Fama & French 1995/1996): small companies have often been through distress and large falls in market value, and carry more bankruptcy risk → they need a higher return to compensate.
    - **But there's contrary evidence** (Campbell et al. 2008): companies with high bankruptcy probability load more heavily on the size factor yet do **not** have higher expected returns → the pure risk explanation is imperfect.

!!! note "Behavioural and other views"
    - **Illiquidity**: size correlates with liquidity, and hard-to-trade small stocks demand a premium — though illiquidity alone explains only part of it.
    - **A small investor base**: institutions prefer large, liquid stocks, so small stocks lack visibility and buyers → they need higher returns to attract anyone.
    - **Model misspecification** (Berk 1995): if the pricing model is misspecified, company size will naturally correlate negatively with unexplained return.

!!! warning "The challenge to the size factor"
    Early evidence broadly supported the size effect, but **more recent research shows that once investors became familiar with it, its performance became unremarkable and the long-run excess return is no longer statistically significant** (observed in US, European and Chinese markets alike). → A textbook case of weakening after publication.

---

## 2. The value factor (HML)

"Beaten-down but cheap stocks (high book-to-market) returned slightly more over the long run" — with two camps on why:

!!! note "The risk-compensation view"
    - **Financial distress risk**: a high book-to-market ratio reflects higher distress risk.
    - **Business cycle risk**: high book-to-market firms load more on the term spread → they require higher expected returns.
    - **Operating leverage**: value firms have high operating leverage and are cycle-sensitive.

!!! note "The behavioural view"
    - **Over-extrapolation**: investors naively extrapolate past performance and become **excessively pessimistic** about firms with poor past earnings → prices get pushed down → producing the later reversion that is the value effect.
    - **Neglect of intangible information**: investors pay too little attention to intangible information, while book-to-market predicts intangible returns reasonably well → giving it predictive power for future returns.

!!! warning "The value factor's recent difficulties"
    - **The five-factor model makes value redundant** (Fama–French 2015, see Chapter B).
    - **Value performed poorly after the 2008 financial crisis**, drawing serious scrutiny.
    - Many researchers have therefore tried **redefining book-to-market** to improve the factor's performance, with some success.

    ← This is a living example of a factor trailing for many years (echoing Chapter 10: can you endure the tracking error?).

---

## 3. The momentum factor (MOM)

"Stocks that rose recently tend to keep rising in the short run" — the strongest premium, and the most behavioural in origin:

!!! note "The systematic risk view"
    - **Time-varying risk exposure** (Geczy & Samonov 2016): winner portfolios have negative exposure to the prevailing state early in a market regime → producing large losses in that period (momentum's tail risk).
    - Economic cycles and instability in aggregate profitability also help explain it.

!!! note "The behavioural view (the mainstream explanation)"
    - **Overconfidence + biased self-attribution** (Daniel et al. 1998): investors are overconfident about private information → producing momentum.
    - **Disposition effect / mental accounting**: widening the gap between price and fundamentals → producing momentum.
    - **Cultural factors** (Chui et al. 2010): **the more individualistic a country, the more severe investor overconfidence, the more active the trading, and the better the momentum factor performs.**
    - **News momentum** (Jiang et al. 2020): information-driven returns show stronger continuation.

!!! warning "Criticisms and costs of momentum"
    - Some research argues the momentum effect actually comes from **exposure to other classic factors**.
    - **Short selling is difficult in practice** → limiting its usefulness in real factor investing.
    - It carries **tail risk** (momentum crashes). Researchers have proposed "tail-risk-adjusted momentum" and "residual momentum" to improve it.

    ← Which explains why Chapter 10 describes momentum as having **the strongest premium, but a weak risk foundation and high costs**.

---

## 4. The profitability factor (RMW)

"Companies that earn well perform better long term":

!!! note "The theoretical basis"
    - **Derived from the dividend discount model** (Fama–French): the DDM implies a relationship between expected earnings and expected return.
    - **Real investment economics** (Hou et al.): establishing the link between expected profit and expected return.

!!! note "The many dimensions of earnings"
    - **Earnings quality** (Sloan): splitting earnings into cash flow and accruals — **the higher the cash-flow content, the better the quality**.
    - **Earnings persistence, volatility and predictability** (Dichev & Tang).
    - **Earnings growth** (Haugen & Baker): greater growth potential, higher expected future return.
    - **The quality factor** (= profitability + growth + safety): Frazzini et al. used it to **explain Buffett's long-run outperformance** — which underlines how important profitability is.

---

## 5. The investment factor (CMA)

"Companies that don't expand recklessly and invest conservatively perform better long term":

!!! note "The risk and theory view"
    - **q-theory** (Cochrane & Zhang).
    - **Real options** (Berk et al.).
    - **Diminishing returns to scale** (Lyandres et al.): heavy investment leads to diminishing returns.
    - **Differences in systematic risk** (Cooper & Priestley).

!!! note "The behavioural and mispricing view"
    - **Managerial market timing** (Baker & Wurgler): management uses its informational advantage to time the market (issuing shares when valuations are high) → producing a negative relationship between investment and future returns.
    - **Over-investment**: high-investment companies tend to over-invest, and valuations later revert → lower future returns.
    - **Earnings management**: inflating valuations through earnings management and then making favourable acquisitions (though the evidence is not conclusive).

---

## 6. One table: risk vs behaviour

!!! example "Factor causes at a glance"
    | Factor | Leans risk-based | Leans behavioural / mispricing | Main controversy |
    |---|---|---|---|
    | Size | Financial distress, illiquidity | Investor base, model misspecification | **Weakened, even insignificant**, after publication |
    | Value | Distress, cycle risk | Over-extrapolation, intangible information | Five factors make it **redundant**; trailed after 2008 |
    | Momentum | Time-varying risk, tail risk | **Overconfidence, disposition effect** | Hard to short, crash tail risk |
    | Profitability | q-theory, DDM | — | Relatively robust (quality explains Buffett) |
    | Investment | q-theory, diminishing returns | Managerial timing, over-investment | Behavioural explanation unsettled |

---

## 7. Why does the cause matter so much?

!!! quote "The cause decides whether it still works"
    - **Risk-compensation** factors are more **durable** (risk doesn't disappear just because everyone knows about it).
    - **Behavioural / mispricing** factors have **a strong premium, but once too many people trade them and money creates factor crowding, they get squeezed dry** (see Chapters D and F).

    So: **don't stake everything on one factor**, especially a purely behaviour-driven one. Factors take turns being strong and weak, and **spreading across several** is what makes it sustainable — which is the underlying logic of the Level 1–3 portfolios in Chapter 10.

---

!!! question "Something to think about 🤔"
    1. "The size factor weakened after publication" — what does that warn you about betting heavily on every newly discovered factor?
    2. Momentum has the strongest premium but the most behavioural cause — does that make you more wary of it?
    3. If a factor is purely the product of mispricing, will it still work out of sample?

---

## Summary

- Factor premia are caused by something between **risk compensation** and **behavioural bias**; the cause decides **whether it keeps working**.
- **Size**: distress / liquidity / investor base; **weakened after publication**.
- **Value**: distress and cycle risk vs over-extrapolation; **made redundant by five factors, and trailed after 2008**.
- **Momentum**: time-varying risk vs **overconfidence and the disposition effect**; strongest premium but hard to short and prone to crashes.
- **Profitability**: q-theory and earnings quality; **explains Buffett**, relatively robust.
- **Investment**: q-theory and diminishing returns vs managerial timing and over-investment.
- **The lesson**: don't stake everything on one factor; spreading across several is what makes it sustainable.

!!! note "Next chapter"
    👉 **[D. Behavioural finance & market anomalies — how people make mistakes systematically](D-行為金融學.md)**
    "Behavioural bias" keeps coming up above. This chapter is devoted to it: what systematic biases the human brain has, and why limits to arbitrage let mispricing persist.
