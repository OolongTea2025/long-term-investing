"""將搜尋索引按語言拆開（廣東話 / 繁體中文 / English）。

點解要呢個 hook
---------------
mkdocs-static-i18n 只會出一個 `site/search/search_index.json`，入面所有語言
嘅頁全部撈埋一齊，而且每一頁嘅 `base` 都指返網站根目錄，所以每個語言都係
fetch 同一個檔 —— 結果就係喺台灣版搜「風險」，會彈埋廣東話版同英文版嘅結果
出嚟。個 plugin 冇任何選項拆得開（`reconfigure_search` 只係改 lunr 嘅 `lang`）。

點拆
----
build 完之後，將 docs 按 `location` 嘅語言前綴分開：

    site/search/search_index.json         ← 預設語言（廣東話，無前綴嗰啲）
    site/zh-TW/search/search_index.json   ← 台灣版
    site/en/search/search_index.json      ← 英文版

語言前綴（`zh-TW/`、`en/`）**原封不動保留**。Material 係用
`new URL(doc.location, config.base)` 砌搜尋結果嘅連結，而 base 喺任何深度都
係指返網站根 —— 所以保留前綴先至解得返啱條 URL。唔好「順手」剝走佢。

另一半喺 `overrides/main.html`：非預設語言嘅頁要改去 fetch 自己嗰個檔。

⚠ 次序 —— 呢度踩過一次
--------------------
唔可以用預設 priority。mkdocs-static-i18n 個 `on_post_build` 掛住
`@event_priority(-100)`，即係**排喺所有 hook 後面**；而佢會喺入面：

  1. 逐個非預設語言開一個 nested build（嗰次 build 嘅索引只得嗰個語言嘅頁），
  2. 最後先至 `reconfigure_search_index()`，將所有語言合併，
     再叫多次 search plugin 嘅 on_post_build 覆寫返 site/search/search_index.json。

用預設 priority 嘅話，本 hook 會喺 (2) 之前行，成果即刻畀佢覆寫返做撈埋一齊
嘅版本 —— 表面 build 得好靚，實際上乜都冇做過。所以要 `-150`，排喺佢之後。

同一個原因，本 hook 一個 build 會被叫多次（外層、每個 nested build、最終）。
下面個「每個語言都要有」嘅 guard 就係用嚟認出邊次先係最終合併嗰次。
"""

from __future__ import annotations

import json
import logging
import os

from mkdocs.plugins import event_priority

log = logging.getLogger("mkdocs.hooks.i18n_search_split")


def _write(path: str, payload: dict) -> int:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        # separators 同 Material 個 search plugin 一樣，方便 diff 對比
        json.dump(payload, fh, separators=(",", ":"), ensure_ascii=False)
    return os.path.getsize(path)


def _locales(config) -> tuple[str | None, list[str]]:
    """(預設語言, 其餘語言) —— 直接問返 i18n plugin，唔好喺呢度硬寫語言碼。"""
    i18n = config.plugins.get("i18n")
    if i18n is None:
        return None, []
    default = getattr(i18n, "default_language", None)
    build_languages = getattr(i18n, "build_languages", None) or []
    others = [lang for lang in build_languages if lang != default]
    return default, others


@event_priority(-150)  # 見上面「次序」;一定要細過 i18n 個 -100
def on_post_build(config, **kwargs) -> None:
    site_dir = config["site_dir"]
    root_index = os.path.join(site_dir, "search", "search_index.json")

    if not os.path.exists(root_index):
        # search plugin 熄咗，冇嘢好拆
        return

    default, others = _locales(config)
    if not default or not others:
        return  # 冇開 i18n,或者得一個語言 —— 冇嘢好拆

    with open(root_index, encoding="utf-8") as fh:
        data = json.load(fh)

    docs = data.get("docs", [])

    # 按前綴分堆。預設語言 ＝ 唔屬於任何其他語言前綴嗰啲。
    buckets: dict[str, list] = {lang: [] for lang in others}
    default_docs = []
    for doc in docs:
        loc = doc.get("location", "")
        for lang in others:
            if loc.startswith(lang + "/"):
                buckets[lang].append(doc)
                break
        else:
            default_docs.append(doc)

    # 每個語言都要齊，先至係最終合併嗰個索引。有一邊係空嘅話,即係我哋撞正
    # i18n 中途嘅其中一次 nested build —— 唔關我事,唔好郁佢,更加唔好喺
    # --strict 度出 warning 搞冧 CI。
    if not default_docs or any(not buckets[lang] for lang in others):
        log.info(
            "i18n_search_split: 索引未齊全 (%s),跳過",
            ", ".join(
                [f"{default} {len(default_docs)}"]
                + [f"{lang} {len(buckets[lang])}" for lang in others]
            ),
        )
        return

    summary = []
    for lang in others:
        size = _write(
            os.path.join(site_dir, lang, "search", "search_index.json"),
            {**data, "docs": buckets[lang]},
        )
        summary.append(f"{lang} {len(buckets[lang])} 條 ({size / 1024:.0f} KB)")

    size = _write(root_index, {**data, "docs": default_docs})
    summary.insert(0, f"{default} {len(default_docs)} 條 ({size / 1024:.0f} KB)")

    log.info("i18n_search_split: %s", " · ".join(summary))
