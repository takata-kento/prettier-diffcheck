#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import { checkFileDiff, outputDiffResults } from './index.js';
import { PrettierOptions } from './types.js';

async function expandGlobPatterns(patterns: string[]): Promise<string[]> {
  const allFiles: string[] = [];
  
  for (const pattern of patterns) {
    if (pattern.includes('*') || pattern.includes('?') || pattern.includes('[')) {
      const files = await glob(pattern, { 
        ignore: ['node_modules/**', '.git/**', 'dist/**', 'coverage/**'],
        nodir: true
      });
      allFiles.push(...files);
    } else {
      allFiles.push(pattern);
    }
  }
  
  return [...new Set(allFiles)].sort();
}

/**
 * .gitignoreと.prettierignoreのパターンを読み込む
 */
function loadIgnorePatterns(): string[] {
  const ignoreFiles = ['.gitignore', '.prettierignore'];
  const patterns: string[] = [];
  
  for (const file of ignoreFiles) {
    if (existsSync(file)) {
      try {
        const content = readFileSync(file, 'utf8');
        patterns.push(...content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
        );
      } catch (error) {
        // ignore error
      }
    }
  }
  
  return patterns;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: prettier-diffcheck <file-path|glob-pattern> [options]');
    console.log('');
    console.log('Examples:');
    console.log('  prettier-diffcheck src/index.js');
    console.log('  prettier-diffcheck "src/**/*.js"');
    console.log('  prettier-diffcheck "**/*.{js,ts,tsx}"');
    console.log('  prettier-diffcheck src/*.js test/*.ts');
    console.log('');
    console.log('Options:');
    console.log('  --no-color    Disable colored output');
    console.log('  --help        Show this help message');
    process.exit(0);
  }

  if (args.includes('--help')) {
    console.log('prettier-diffcheck - Show Prettier formatting differences');
    console.log('');
    console.log('Usage: prettier-diffcheck <file-path|glob-pattern> [options]');
    console.log('');
    console.log('This tool shows what changes Prettier would make to your files');
    console.log('without actually modifying them.');
    console.log('');
    console.log('Examples:');
    console.log('  prettier-diffcheck src/index.js');
    console.log('  prettier-diffcheck "src/**/*.js"');
    console.log('  prettier-diffcheck "**/*.{js,ts,tsx}"');
    console.log('  prettier-diffcheck src/*.js test/*.ts');
    console.log('');
    console.log('Options:');
    console.log('  --no-color    Disable colored output');
    console.log('  --help        Show this help message');
    process.exit(0);
  }

  const noColor = args.includes('--no-color');
  const patterns = args.filter(arg => !arg.startsWith('--'));

  if (patterns.length === 0) {
    console.error('Error: No file paths or patterns provided');
    process.exit(1);
  }

  // グロブパターンを展開
  const expandedFiles = await expandGlobPatterns(patterns);

  if (expandedFiles.length === 0) {
    console.error('Error: No matching files found');
    process.exit(1);
  }

  console.log(`Checking ${expandedFiles.length} file(s)...`);

  // ファイル処理を並列実行
  const filePromises = expandedFiles.map(async (filePath) => {
    try {
      const content = readFileSync(filePath, 'utf8');
      const options: PrettierOptions = {
        diffCheck: true,
        filepath: filePath
      };
      return await checkFileDiff(filePath, content, options);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  });

  const results = await Promise.allSettled(filePromises);
  const validResults = results
    .filter(result => result.status === 'fulfilled' && result.value !== null)
    .map(result => (result as PromiseFulfilledResult<any>).value);

  outputDiffResults(validResults, !noColor);
}

main();
