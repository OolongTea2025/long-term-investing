# 長線投資入門 🪜

一個免費、廣東話、由零開始嘅**被動指數投資**教學網站。用 MkDocs Material 建，部署喺 GitHub Pages。

> 有人免費幫過我，我幫下一個。知識唔應該係少數人嘅專利。

## 本機預覽

```bash
pip install -r requirements.txt
python -m mkdocs serve
# 開瀏覽器去 http://127.0.0.1:8000
```

改完 `docs/` 入面嘅 `.md`，個網站會即時 reload。

## 出街（GitHub Pages）

1. 喺 GitHub 開一個新 repo，將成個 folder push 上去（branch：`main`）。
2. Repo → **Settings → Pages → Build and deployment → Source** 揀 **GitHub Actions**。
3. 之後每次 push 去 `main`，`.github/workflows/deploy.yml` 會自動 build 同部署。
4. （選）喺 `mkdocs.yml` 填返 `site_url` 做你嘅 Pages 網址。

## 結構

```
docs/                  所有內容（Markdown）
  stylesheets/         Ocean 主題 + 圖表樣式
  javascripts/         resume.js（記住上次睇邊頁）、figzoom.js（手機睇圖）
  game/                互動遊戲（index.html 係 build 出嚟嘅，唔好直接改）
mkdocs.yml             網站設定同目錄
jieba_user_dict.txt    中文搜尋詞典（唔加呢個，搵「再平衡」會搵唔到嘢）
requirements.txt       mkdocs-material + jieba
game-src/              遊戲原始碼（見下）
```

## 互動遊戲

第 6 章尾同目錄嘅「🎮 互動遊戲」指向 `docs/game/`，
但**唔好直接改 `docs/game/index.html`** —— 佢係砌出嚟嘅。

```bash
cd game-src
node build.mjs      # src/ -> ../docs/game/index.html
node test.mjs 1200  # 平衡測試：試玩 1200 局 × 8 種玩法
node domtest.mjs    # 由標題撳到結局，捉 runtime error + 存檔來回
```

詳情見 `game-src/README.md`。

> 遊戲入面 37 張立繪／背景／結局圖係 **AI 生成**嘅。
> 網站其他所有圖表都係手砌嘅原創 inline SVG。附錄 C 有講明。

## 授權同免責

- 內容為個人教育分享，**唔係投資建議**。
- 框架參考自 Nick Maggiulli《The Wealth Ladder》等；均為原創重寫並註明出處，非原文轉載。
- 歡迎自由分享、傳承。📖
