#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { checkFileDiff, outputDiffResults } from './index.js';
import { PrettierOptions } from './types.js';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: prettier-diffcheck <file-path> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --no-color    Disable colored output');
    console.log('  --help        Show this help message');
    process.exit(0);
  }

  if (args.includes('--help')) {
    console.log('prettier-diffcheck - Show Prettier formatting differences');
    console.log('');
    console.log('Usage: prettier-diffcheck <file-path> [options]');
    console.log('');
    console.log('This tool shows what changes Prettier would make to your files');
    console.log('without actually modifying them.');
    console.log('');
    console.log('Options:');
    console.log('  --no-color    Disable colored output');
    console.log('  --help        Show this help message');
    process.exit(0);
  }

  const noColor = args.includes('--no-color');
  const filePaths = args.filter(arg => !arg.startsWith('--'));

  if (filePaths.length === 0) {
    console.error('Error: No file paths provided');
    process.exit(1);
  }

  const results = [];

  for (const filePath of filePaths) {
    try {
      const resolvedPath = resolve(filePath);
      const content = readFileSync(resolvedPath, 'utf8');

      const options: PrettierOptions = {
        diffCheck: true,
        filepath: resolvedPath
      };

      const result = await checkFileDiff(resolvedPath, content, options);
      results.push(result);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      process.exit(1);
    }
  }

  outputDiffResults(results, !noColor);
}

// ESモジュールでのメイン実行チェック
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
