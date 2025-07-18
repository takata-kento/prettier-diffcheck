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

## API

### `checkFileDiff(filePath, originalContent, options)`

Performs diff checking for a single file.

**Parameters:**
- `filePath` (string): File path
- `originalContent` (string): Original file content
- `options` (PrettierOptions): Prettier options

**Returns:** `Promise<DiffResult>`

### `checkMultipleFilesDiff(files, options)`

Performs diff checking for multiple files.

**Parameters:**
- `files` (Array): `{ path: string, content: string }[]`
- `options` (PrettierOptions): Prettier options

**Returns:** `Promise<DiffResult[]>`

### `outputDiffResults(diffResults, colored?)`

Outputs diff results to console.

**Parameters:**
- `diffResults` (DiffResult[]): Array of diff results
- `colored` (boolean, optional): Enable/disable colored output (default: true)

## Type Definitions

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

## CI/CD Usage

This tool can be used in CI/CD pipelines to check code formatting:

```yaml
# GitHub Actions example
- name: Check code formatting
  run: npx prettier-diffcheck "src/**/*.{js,ts,tsx}"
```

If differences are detected, the process exits with code 1.

## Supported Languages

Supports all languages that Prettier supports:

- JavaScript / TypeScript
- CSS / SCSS / Less
- HTML
- JSON / YAML
- Markdown
- GraphQL
- Other languages supported by Prettier plugins

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Development mode (watch)
npm run dev
```

## License

MIT

## Contributing

Pull requests and issue reports are welcome.

## Related Projects

- [Prettier](https://prettier.io/) - Code formatter
- [diff](https://github.com/kpdecker/jsdiff) - Text diff library
- [chalk](https://github.com/chalk/chalk) - Terminal color library