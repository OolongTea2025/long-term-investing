"""將搜尋索引按語言拆開（廣東話 / 繁體中文）。

點解要呢個 hook
---------------
mkdocs-static-i18n 只會出一個 `site/search/search_index.json`，入面兩種語言
嘅頁全部撈埋一齊（225 zh-HK + 224 zh-TW），而且每一頁嘅 `base` 都指返網站
根目錄，所以兩邊都係 fetch 同一個檔 —— 結果就係喺台灣版搜「風險」，會彈埋
廣東話版嘅結果出嚟。個 plugin 冇任何選項拆得開（`reconfigure_search` 只係
改 lunr 嘅 `lang`）。

點拆
----
build 完之後，將 docs 按 `location` 嘅 `zh-TW/` 前綴分兩份：

    site/search/search_index.json         ← 淨低廣東話（無前綴嗰啲）
    site/zh-TW/search/search_index.json   ← 淨低台灣版

`location` **原封不動保留 `zh-TW/` 前綴**。Material 係用
`new URL(doc.location, config.base)` 砌搜尋結果嘅連結，而 base 喺任何深度都
係指返網站根 —— 所以保留前綴先至解得返啱條 URL。唔好「順手」剝走佢。

另一半喺 `overrides/main.html`：台灣版嘅頁要改去 fetch 上面第二個檔。

⚠ 次序 —— 呢度踩過一次
--------------------
唔可以用預設 priority。mkdocs-static-i18n 個 `on_post_build` 掛住
`@event_priority(-100)`，即係**排喺所有 hook 後面**；而佢會喺入面：

  1. 開一個 nested build 砌台灣版（嗰次 build 嘅索引只得台灣版嘅頁），
  2. 最後先至 `reconfigure_search_index()`，將兩種語言合併，
     再叫多次 search plugin 嘅 on_post_build 覆寫返 site/search/search_index.json。

用預設 priority 嘅話，本 hook 會喺 (2) 之前行，成果即刻畀佢覆寫返做撈埋一齊
嘅版本 —— 表面 build 得好靚，實際上乜都冇做過。所以要 `-150`，排喺佢之後。

同一個原因，本 hook 一個 build 會被叫三次（外層、nested、最終）。下面兩個
「兩種語言都要有」嘅 guard 就係用嚟認出邊次先係最終合併嗰次。
"""

from __future__ import annotations

import json
import logging
import os

from mkdocs.plugins import event_priority

log = logging.getLogger("mkdocs.hooks.i18n_search_split")

TW_PREFIX = "zh-TW/"


def _write(path: str, payload: dict) -> int:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        # separators 同 Material 個 search plugin 一樣，方便 diff 對比
        json.dump(payload, fh, separators=(",", ":"), ensure_ascii=False)
    return os.path.getsize(path)


@event_priority(-150)  # 見上面「次序」;一定要細過 i18n 個 -100
def on_post_build(config, **kwargs) -> None:
    site_dir = config["site_dir"]
    root_index = os.path.join(site_dir, "search", "search_index.json")

    if not os.path.exists(root_index):
        # search plugin 熄咗，冇嘢好拆
        return

    with open(root_index, encoding="utf-8") as fh:
        data = json.load(fh)

    docs = data.get("docs", [])
    tw_docs = [d for d in docs if d.get("location", "").startswith(TW_PREFIX)]
    hk_docs = [d for d in docs if not d.get("location", "").startswith(TW_PREFIX)]

    # 兩種語言都要齊，先至係最終合併嗰個索引。淨得一邊嘅話,即係我哋撞正
    # i18n 中途嘅其中一次 build（或者根本冇開 i18n）—— 唔關我事,唔好郁佢,
    # 更加唔好喺 --strict 度出 warning 搞冧 CI。
    if not tw_docs or not hk_docs:
        log.info(
            "i18n_search_split: 索引淨得一種語言 (zh-HK %d / zh-TW %d),跳過",
            len(hk_docs),
            len(tw_docs),
        )
        return

    tw_size = _write(
        os.path.join(site_dir, "zh-TW", "search", "search_index.json"),
        {**data, "docs": tw_docs},
    )
    hk_size = _write(root_index, {**data, "docs": hk_docs})

    log.info(
        "i18n_search_split: zh-HK %d 條 (%.0f KB) · zh-TW %d 條 (%.0f KB)",
        len(hk_docs),
        hk_size / 1024,
        len(tw_docs),
        tw_size / 1024,
    )
