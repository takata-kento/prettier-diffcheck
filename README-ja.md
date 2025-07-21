# prettier-diffcheck

Prettierのラッパーツールです。
フォーマット前後の差分をdiff形式で表示します。ファイルを実際に変更することなく、Prettierがどのような変更を加えるかを確認できます。

## 機能

- 🔍 Prettierフォーマット前後の差分をdiff形式で表示
- 🎨 カラー付きの見やすい出力
- 📁 複数ファイル対応
- 🚫 ファイルを実際には変更しない（dry-run）
- 📊 フォーマット結果の統計表示
- 🔧 全てのPrettier対応言語をサポート

## インストール

```bash
npm install prettier-diffcheck --save-dev
# または
yarn add prettier-diffcheck --dev
```

## 使用方法

### CLIツールとして

```bash
npx prettier-diffcheck src/**/*.js
```

オプション:
- `--no-color`: カラー出力を無効化
- `--help`: ヘルプを表示

## 出力例

```diff
⚠ src/example.js needs formatting:
===================================================================
@@ -1,3 +1,3 @@
-const foo={a:1,b:2};
-function bar(){return "hello";}
+const foo = { a: 1, b: 2 };
+function bar() {
+  return "hello";
+}

Formatting Summary:
  Total files: 1
  ✓ Already formatted: 0
  ⚠ Needs formatting: 1
```

## 設定

`.prettierrc`ファイルまたは`prettier.config.js`で設定できます：

```json
{
  "plugins": ["prettier-diffcheck"],
  "diffCheck": true,
  "semi": false,
  "singleQuote": true
}
```

## ライセンス

MIT
