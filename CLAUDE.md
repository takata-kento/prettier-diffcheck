# Prettier プラグイン開発に関する知識

## Prettierとは

Prettierは**「決まりきった（opinionated）」コードフォーマッター**で、複数のプログラミング言語とファイル形式をサポートしています：

- JavaScript
- TypeScript  
- CSS/SCSS
- HTML
- JSON
- Markdown
- GraphQL
- その他多数

### Prettierの特徴

1. **フォーマット哲学**
   - 元のスタイリングを全て削除し、一貫したスタイルに準拠したコードを出力
   - 行の長さを考慮してコードを再印刷し、必要に応じて自動的に折り返し

2. **独特なアプローチ**
   - 元のコードの抽象構文木（AST）を解析
   - 独自のフォーマットルールを使用してコードを再印刷
   - 元のフォーマットを保持するよりも、一貫性のある読みやすいコードを優先

3. **コード変換例**
```javascript
// 変換前
foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());

// 変換後
foo(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne(),
);
```

## Prettierプラグインシステム

### プラグインの5つの主要コンポーネント

1. **`languages`** - サポートする言語の詳細を定義
2. **`parsers`** - コード文字列を抽象構文木（AST）に変換
3. **`printers`** - ASTをPrettierの中間表現に変換
4. **`options`** - カスタム設定オプション
5. **`defaultOptions`** - デフォルトのPrettier設定を上書き

### 主要関数の実装例

#### languages
```javascript
export const languages = [{
  name: "MyLanguage",
  parsers: ["my-parser"]
}];
```

#### parsers
```javascript
export const parsers = {
  "my-parser": {
    parse(text, options) { /* テキストをASTに変換 */ },
    astFormat: "my-ast-format",
    locStart(node) { /* ノードの開始位置を返す */ },
    locEnd(node) { /* ノードの終了位置を返す */ }
  }
};
```

#### printers
```javascript
export const printers = {
  "my-ast-format": {
    print(path, options, print) { 
      // ASTノードを印刷可能な形式に再帰的に変換
    }
  }
};
```

### 高度な機能

- 埋め込み言語のサポート
- コメント処理
- カスタムフォーマットルール
- テキスト操作のためのユーティリティ関数

### プラグインの使用方法

```bash
# CLI
prettier --plugin=my-plugin

# API
prettier.format(code, { plugins: ['my-plugin'] })

# 設定ファイル
{
  "plugins": ["my-plugin"]
}
```

## 参考リソース

### 公式ドキュメント
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Plugin Development Guide](https://prettier.io/docs/en/plugins.html)

### GitHub実例プラグイン
- [PHP Plugin](https://github.com/prettier/plugin-php)
- [Ruby Plugin](https://github.com/prettier/plugin-ruby)
- [XML Plugin](https://github.com/prettier/plugin-xml)
- [Java Plugin](https://github.com/jhipster/prettier-java)
- [Tailwind CSS Plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

### 開発支援ツール
- [Create Prettier Plugin](https://github.com/nurulakbaral/create-prettier-plugin) - プラグイン作成用ボイラープレート
- TypeScript対応、Vitest設定済み、Rollupビルド設定付き

### 有用なチュートリアル
- [How to write a plugin for Prettier](https://medium.com/@fvictorio/how-to-write-a-plugin-for-prettier-a0d98c845e70) - TOMLプラグイン作成チュートリアル

## 実装のポイント

1. **パーサー実装** - 対象言語のソースコードをトラバース可能なデータ構造（通常はAST）に解析
2. **プリンター実装** - そのデータ構造を「美しい」スタイルで出力
3. **言語サポート** - JavaScript以外の言語の場合、JavaScriptで実装されたパーサーが必要
   - 例：Prettier-JavaはChevrotain Parser Building Toolkitを使用したJavaScriptパーサーを使用

## プラグイン開発の基本フロー

1. 対象言語のASTパーサーを作成または選択
2. `languages`配列で言語メタデータを定義
3. `parsers`オブジェクトでテキスト→AST変換を実装
4. `printers`オブジェクトでAST→フォーマット済みテキスト変換を実装
5. 必要に応じて`options`と`defaultOptions`を設定
6. テスト、ビルド、公開

---

## prettier-diffcheck プラグイン実装記録

### 実装概要
- **作成日**: 2025年1月
- **目的**: Prettierフォーマット前後の差分をdiff形式で表示する
- **言語**: TypeScript (ESM対応)
- **機能**: ファイルを上書きせずに、フォーマットが必要な箇所をdiff形式で表示

### 主要な技術的課題と解決策

#### 1. Prettier v3のESMサポート
**課題**: Prettier v3では動的インポートが使用されており、Jest環境で`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`エラーが発生

**解決策**:
- `package.json`に`"type": "module"`を追加してESMモードに設定
- TypeScript設定で`"module": "ES2020"`に変更
- Jest設定でESMプリセット使用: `ts-jest/presets/default-esm`
- テスト実行時に`--experimental-vm-modules`フラグを追加
- インポート文で`.js`拡張子を明示（ESMでは必須）

#### 2. プラグインアーキテクチャ
**実装方針**:
- 既存のPrettierエンジンを活用してフォーマットを実行
- 差分生成には`diff`ライブラリのunified diff形式を使用
- カラー出力には`chalk`ライブラリを使用

**主要コンポーネント**:
1. `differ.ts` - diff生成とカラー表示のロジック
2. `index.ts` - メインプラグイン実装
3. `cli.ts` - スタンドアローンCLIツール
4. `types.ts` - TypeScript型定義

#### 3. テスト環境の構築
- Jest + TypeScriptでESM環境でのテスト実行
- Prettier v3での実際のフォーマット動作をテスト
- 複数ファイル形式（JS/TS/CSS/JSON）への対応確認

### 使用方法

```bash
# スタンドアローンCLI
npx prettier-diffcheck src/**/*.js

# Prettierプラグインとして（理論上の使用方法）
prettier --plugin=prettier-diffcheck --diff-check src/**/*.js
```

### 出力例

```diff
⚠ example.js needs formatting:
--- a/example.js
+++ b/example.js
@@ -1,3 +1,5 @@
-const foo={a:1,b:2};
-function bar(){return "hello world";}
+const foo = { a: 1, b: 2 };
+function bar() {
+  return "hello world";
+}

Formatting Summary:
  Total files: 1
  ✓ Already formatted: 0
  ⚠ Needs formatting: 1
```

### 学んだ教訓

1. **ESM移行の複雑さ**: Node.js ESMは設定が複雑で、特にJest環境での動作には多くの調整が必要
2. **Prettierプラグインの制約**: 実際のPrettierプラグインとしての統合は複雑で、スタンドアローンツールとしての実装がより現実的
3. **TypeScript + ESM**: 拡張子の明示、設定の調整など、従来のCommonJSとは異なる考慮事項が多い

### 今後の改善点

1. Prettier設定ファイル（.prettierrc）の自動読み込み
2. グロブパターンによるファイル検索機能
3. より詳細なエラーハンドリング
4. CI/CDでの使用を考慮した追加オプション