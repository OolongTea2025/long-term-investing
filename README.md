# 長線投資入門 🪜

一個免費、由零開始嘅**被動指數投資**教學網站。14 章正文 + 6 篇進階選讀 + 3 篇附錄 + 一個互動遊戲。

### 👉 [睇網站（廣東話）](https://OolongTea2025.github.io/long-term-investing/) · [繁體中文版](https://OolongTea2025.github.io/long-term-investing/zh-TW/) · [English](https://OolongTea2025.github.io/long-term-investing/en/) · [🎮 互動遊戲](https://OolongTea2025.github.io/long-term-investing/game/)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

> 有人免費幫過我，我幫下一個。知識唔應該係少數人嘅專利。

---

## 本機開發

```bash
pip install -r requirements.txt
python -m mkdocs serve      # → http://127.0.0.1:8000/long-term-investing/
```

改完 `docs/` 入面嘅 `.md` 就會即時 reload。**部署 = push 去 `main`**，`.github/workflows/deploy.yml` 會自動 build 同出街。

## 結構

```
docs/                  所有內容。xxx.md = 廣東話,xxx.zh-TW.md = 繁體中文,
                       xxx.en.md = English。檔名／URL 三種語言共用。
  javascripts/         resume.js(記住上次睇邊頁)、figzoom.js(手機睇圖)
  game/                遊戲成品 —— build 出嚟嘅,唔好直接改
game-src/              遊戲原始碼
hooks/                 build 用嘅兩個 hook,改之前睇檔頭註解
overrides/             og/twitter meta、自訂 404、zh-HK 語言檔
mkdocs.yml             設定、目錄、三種語言
jieba_user_dict.txt    中文搜尋詞典(冇佢就搵唔到「再平衡」)
```

## 互動遊戲

```bash
cd game-src
node build.mjs      # src/ -> ../docs/game/index.html
node test.mjs 1200  # 平衡測試:1200 局 × 8 種玩法
node domtest.mjs    # 由標題撳到結局,捉 runtime error + 存檔來回
```

詳情見 [`game-src/README.md`](game-src/README.md)。遊戲入面 37 張立繪／背景／結局圖係 **AI 生成**；網站其餘所有圖表都係手砌嘅原創 inline SVG（附錄 C 有講明）。

## 授權

內容同程式碼一律採用 **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)**（全文見 [`LICENSE`](LICENSE)）。

**任你轉載、剪輯、改寫、翻譯、拎去做教材，唔使問我。** 條件只有三個：

- **署名** —— 講明出處，連返嚟呢個網站
- **非商業** —— 唔可以攞去賺錢。**商用一律唔會授權，唔使問**
- **相同方式分享** —— 你改編出嚟嗰版，都要一樣用返 CC BY-NC-SA 4.0 放出嚟，唔可以鎖起

唔喺呢個範圍：本站**引用**嘅書、論文、帖文（版權屬原作者，本站只重寫框架同註明出處，冇轉載原文），同埋第三方套件（各有各授權）。

## 免責

內容係個人教育分享，**唔係投資建議**，唔收費、唔賣產品、唔收推薦佣金。投資有風險，一切決定同後果由讀者自己承擔。
