import { checkFileDiff, checkMultipleFilesDiff } from '../src/index';
import { PrettierOptions } from '../src/types';

// Jest環境でのconsole.errorを無効化
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('prettier-diffcheck', () => {
  describe('checkFileDiff', () => {
    test('should detect formatting differences in JavaScript', async () => {
      const originalContent = 'const foo={a:1,b:2};';
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'babel'
      };

      const result = await checkFileDiff('test.js', originalContent, options);

      expect(result.hasDifferences).toBe(true);
      expect(result.filePath).toBe('test.js');
      expect(result.formattedContent).toContain('const foo = { a: 1, b: 2 };');
    });

    test('should return no differences for already formatted code', async () => {
      const originalContent = 'const foo = { a: 1, b: 2 };\n';
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'babel'
      };

      const result = await checkFileDiff('test.js', originalContent, options);

      expect(result.hasDifferences).toBe(false);
    });

    test('should handle TypeScript files', async () => {
      const originalContent = 'interface Foo{bar:string;}';
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'typescript'
      };

      const result = await checkFileDiff('test.ts', originalContent, options);

      expect(result.hasDifferences).toBe(true);
      expect(result.formattedContent).toContain('interface Foo {');
    });

    test('should handle CSS files', async () => {
      const originalContent = 'body{margin:0;padding:0;}';
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'css'
      };

      const result = await checkFileDiff('test.css', originalContent, options);

      expect(result.hasDifferences).toBe(true);
      expect(result.formattedContent).toContain('body {');
    });

    test('should handle JSON files', async () => {
      const originalContent = '{"name":"test","version":"1.0.0"}';
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'json'
      };

      const result = await checkFileDiff('package.json', originalContent, options);

      expect(result.hasDifferences).toBe(true);
      expect(result.formattedContent).toContain('\n');
    });

    test('should throw error for invalid syntax', async () => {
      const originalContent = 'const foo = {';
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'babel'
      };

      await expect(checkFileDiff('invalid.js', originalContent, options))
        .rejects.toThrow();
    });
  });

  describe('checkMultipleFilesDiff', () => {
    test('should process multiple files', async () => {
      const files = [
        { path: 'file1.js', content: 'const a=1;' },
        { path: 'file2.js', content: 'const b = 2;\\n' }
      ];
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'babel'
      };

      const results = await checkMultipleFilesDiff(files, options);

      expect(results).toHaveLength(2);
      expect(results[0].hasDifferences).toBe(true);
      expect(results[1].hasDifferences).toBe(false);
    });

    test('should handle mixed file types', async () => {
      const files = [
        { path: 'script.js', content: 'const foo={bar:"baz"};' },
        { path: 'style.css', content: 'body{margin:0;}' },
        { path: 'data.json', content: '{"key":"value"}' }
      ];
      const options: PrettierOptions = {
        diffCheck: true
      };

      const results = await checkMultipleFilesDiff(files, options);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.hasDifferences).toBe(true);
      });
    });

    test('should continue processing after error', async () => {
      const files = [
        { path: 'valid.js', content: 'const a=1;' },
        { path: 'invalid.js', content: 'const broken = {' },
        { path: 'another.js', content: 'const b=2;' }
      ];
      const options: PrettierOptions = {
        diffCheck: true,
        parser: 'babel'
      };

      // エラーが発生してもスキップして処理を続行
      const results = await checkMultipleFilesDiff(files, options);

      expect(results).toHaveLength(3);
      expect(results[0].hasDifferences).toBe(true);
      expect(results[1].hasDifferences).toBe(false); // エラーファイルは差分なしとしてスキップ
      expect(results[2].hasDifferences).toBe(true);
    });
  });
});
