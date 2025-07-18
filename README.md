# prettier-diffcheck

Prettierプラグインで、フォーマット前後の差分をdiff形式で表示します。ファイルを実際に変更することなく、Prettierがどのような変更を加えるかを確認できます。

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

### Prettierプラグインとして

```bash
prettier --plugin=prettier-diffcheck --diff-check src/**/*.js
```

### プログラムから

```typescript
import { checkFileDiff, outputDiffResults } from 'prettier-diffcheck';

const originalContent = 'const foo={a:1,b:2};';
const options = { diffCheck: true, parser: 'babel' };

const result = await checkFileDiff('example.js', originalContent, options);
outputDiffResults([result]);
```

## 出力例

```diff
⚠ src/example.js needs formatting:

--- a/src/example.js
+++ b/src/example.js
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

## API

### `checkFileDiff(filePath, originalContent, options)`

単一ファイルの差分チェックを行います。

**パラメータ:**
- `filePath` (string): ファイルパス
- `originalContent` (string): 元のファイル内容
- `options` (PrettierOptions): Prettierオプション

**戻り値:** `Promise<DiffResult>`

### `checkMultipleFilesDiff(files, options)`

複数ファイルの差分チェックを行います。

**パラメータ:**
- `files` (Array): `{ path: string, content: string }[]`
- `options` (PrettierOptions): Prettierオプション

**戻り値:** `Promise<DiffResult[]>`

### `outputDiffResults(diffResults, colored?)`

差分結果をコンソールに出力します。

**パラメータ:**
- `diffResults` (DiffResult[]): 差分結果の配列
- `colored` (boolean, optional): カラー出力の有効/無効（デフォルト: true）

## 型定義

```typescript
interface DiffResult {
  filePath: string;
  hasDifferences: boolean;
  diffOutput: string;
  originalContent: string;
  formattedContent: string;
}

interface PrettierOptions {
  diffCheck?: boolean;
  [key: string]: any;
}
```

## CI/CDでの使用

このツールは、CI/CDパイプラインでコードフォーマットの確認に使用できます：

```yaml
# GitHub Actions example
- name: Check code formatting
  run: npx prettier-diffcheck "src/**/*.{js,ts,tsx}"
```

差分が検出された場合、プロセスは終了コード1で終了します。

## 対応言語

Prettierがサポートする全ての言語に対応：

- JavaScript / TypeScript
- CSS / SCSS / Less
- HTML
- JSON / YAML
- Markdown
- GraphQL
- その他Prettierプラグインで対応している言語

## 開発

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# テスト実行
npm test

# 開発モード（ウォッチ）
npm run dev
```

## ライセンス

MIT

## 貢献

プルリクエストや問題報告を歓迎します。

## 関連プロジェクト

- [Prettier](https://prettier.io/) - コードフォーマッター
- [diff](https://github.com/kpdecker/jsdiff) - テキスト差分ライブラリ
- [chalk](https://github.com/chalk/chalk) - ターミナルカラーライブラリ