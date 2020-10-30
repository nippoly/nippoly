# nippoly

![logo](./images/nippo_logo.png)

## What is nippoly

**「読んだ！が 10 倍速くなる」** を実現する 24 時間以内に読んだ記事をまとめてマークダウン形式で出力してくれる Chrome Extension です。

## How to set up Developer mode

### 手順

1. **ツール > 拡張機能** にアクセス
2. **デベロッパーモード > パッケージ化されていない拡張機能を読み込む** を選択肢します
3. **chrome_extension** というフォルダを選択します

### 開発環境

- yarn
- Next.js
- node.js 14.14.0 (nodenv を使用)

### セットアップ手順

- `yarn install`を実行
- `yarn export && yarn convert`で chrome_extension フォルダの書き出し

### 参考 URL

[チュートリアル: Chrome アプリを作成する](https://support.google.com/chrome/a/answer/2714278?hl=ja)
