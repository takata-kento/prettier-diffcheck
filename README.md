# prettier-diffcheck

A Prettier plugin that displays formatting differences in diff format. You can see what changes Prettier would make to your files without actually modifying them.

## Features

- 🔍 Display Prettier formatting differences in diff format
- 🎨 Beautiful colored output
- 📁 Multiple file support
- 🚫 No file modifications (dry-run)
- 📊 Formatting statistics display
- 🔧 Support for all Prettier-compatible languages

## Installation

```bash
npm install prettier-diffcheck --save-dev
# or
yarn add prettier-diffcheck --dev
```

## Usage

### As CLI Tool

```bash
npx prettier-diffcheck src/**/*.js
```

Options:
- `--no-color`: Disable colored output
- `--help`: Show help message

### As Prettier Plugin

```bash
prettier --plugin=prettier-diffcheck --diff-check src/**/*.js
```

### Programmatically

```typescript
import { checkFileDiff, outputDiffResults } from 'prettier-diffcheck';

const originalContent = 'const foo={a:1,b:2};';
const options = { diffCheck: true, parser: 'babel' };

const result = await checkFileDiff('example.js', originalContent, options);
outputDiffResults([result]);
```

## Output Example

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

## Configuration

Configure via `.prettierrc` file or `prettier.config.js`:

```json
{
  "plugins": ["prettier-diffcheck"],
  "diffCheck": true,
  "semi": false,
  "singleQuote": true
}
```

## License

MIT
