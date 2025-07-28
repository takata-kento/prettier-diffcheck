# prettier-diffcheck

A Prettier wrapper tool that displays formatting differences in diff format. You can see what changes Prettier would make to your files without actually modifying them.

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
# Single file
npx prettier-diffcheck src/index.js

# Multiple files  
npx prettier-diffcheck src/index.js lib/utils.js

# Glob patterns (recursive)
npx prettier-diffcheck "src/**/*.js"
npx prettier-diffcheck "**/*.{js,ts,tsx}"

# Mixed patterns
npx prettier-diffcheck "src/**/*.js" "test/**/*.ts"
```

Options:
- `--no-color`: Disable colored output
- `--help`: Show help message

**Note:** Use quotes around glob patterns to prevent shell expansion.

## Output Example

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
