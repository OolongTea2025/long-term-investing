"""令根目錄嘅 404.html 保持係預設語言（廣東話）嗰版。

問題
----
`site/404.html` 唔係一版文件，係主題模板，MkDocs 每次 build 都會直接寫落
`site_dir/404.html`，唔會加語言前綴。而 mkdocs-static-i18n 係**一個語言 build
一次**，所以最後 build 嗰個語言（台灣版）會覆寫返廣東話嗰版。

後果（未修之前係真係咁）：
    site/404.html  →  <html lang="zh-TW"> · <title>長期投資入門</title>
                      · og:locale zh_TW · 頁尾係台灣版文案
    …但 overrides/404.html 個內文由頭到尾都係廣東話。

GitHub Pages 全站只用根目錄嗰一個 404.html（唔存在嘅 /zh-TW/xxx 都係送呢一頁），
所以佢應該係預設語言嗰版。

點修
----
`on_post_template` 喺每個主題模板 render 完之後會叫一次 —— 每個語言各叫一次。
喺預設語言嗰次將 404 嘅 HTML 收起，build 完晒再寫返落 site/404.html。

咁做係用返 Jinja 真正 render 出嚟嘅 output，唔係喺 HTML 度搵字換字,所以主題
或者文案點改都唔會鬆脫。

priority -150 嘅原因同 hooks/i18n_search_split.py 一樣：i18n 個 on_post_build
掛住 -100，所有語言嘅 build 都係喺佢入面行,要排喺佢之後先算數。
"""

from __future__ import annotations

import logging
import os

from mkdocs.plugins import event_priority

log = logging.getLogger("mkdocs.hooks.default_lang_404")

TEMPLATE = "404.html"

# {locale: 該語言 render 出嚟嘅 404 HTML}。每次 build 都會覆寫,所以 mkdocs
# serve 一路改一路 reload 都唔會攞到舊嘢。
_rendered: dict[str, str] = {}


def on_post_template(output, template_name, config, **kwargs):
    if template_name != TEMPLATE:
        return output
    i18n = config.plugins.get("i18n")
    current = getattr(i18n, "current_language", None) if i18n else None
    if current:
        _rendered[current] = output
    return output


@event_priority(-150)  # 一定要細過 i18n 個 -100,見檔頭
def on_post_build(config, **kwargs) -> None:
    i18n = config.plugins.get("i18n")
    if i18n is None:
        return  # 冇開 i18n,根本冇呢個問題

    default = getattr(i18n, "default_language", None)
    build_languages = getattr(i18n, "build_languages", None) or []

    # 唔好靠 current_language 分邊次係最後一次 —— i18n 行完個 loop 之後
    # 佢仍然停喺最後嗰個語言度。改為等到每個語言都 render 過 404 先郁手。
    if not default or len(_rendered) < len(build_languages):
        return

    wanted = _rendered.get(default)
    if wanted is None:
        return

    path = os.path.join(config["site_dir"], TEMPLATE)
    if not os.path.exists(path):
        return

    with open(path, encoding="utf-8") as fh:
        if fh.read() == wanted:
            return  # 已經係啱嗰版,唔使寫

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(wanted)
    log.info("default_lang_404: 根目錄 404.html 寫返做 '%s' 版", default)
