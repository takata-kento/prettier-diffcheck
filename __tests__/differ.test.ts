import { Differ } from '../src/differ';
import { DiffResult } from '../src/types';

describe('Differ', () => {
  describe('generateDiff', () => {
    test('should return no differences when content is identical', () => {
      const original = 'const foo = "bar";';
      const formatted = 'const foo = "bar";';

      const result = Differ.generateDiff(original, formatted, 'test.js');

      expect(result.hasDifferences).toBe(false);
      expect(result.diffOutput).toBe('');
      expect(result.filePath).toBe('test.js');
    });

    test('should generate diff when content differs', () => {
      const original = 'const foo={a:1,b:2};';
      const formatted = 'const foo = { a: 1, b: 2 };';

      const result = Differ.generateDiff(original, formatted, 'test.js');

      expect(result.hasDifferences).toBe(true);
      expect(result.diffOutput).toContain('--- a/test.js');
      expect(result.diffOutput).toContain('+++ b/test.js');
      expect(result.diffOutput).toContain('-const foo={a:1,b:2};');
      expect(result.diffOutput).toContain('+const foo = { a: 1, b: 2 };');
    });

    test('should handle multiline content', () => {
      const original = 'function test(){\nreturn "hello";\n}';
      const formatted = 'function test() {\n  return "hello";\n}';

      const result = Differ.generateDiff(original, formatted, 'test.js');

      expect(result.hasDifferences).toBe(true);
      expect(result.diffOutput).toContain('function test()');
    });
  });

  describe('generateColoredDiff', () => {
    test('should return success message for no differences', () => {
      const diffResult: DiffResult = {
        filePath: 'test.js',
        hasDifferences: false,
        diffOutput: '',
        originalContent: 'const foo = "bar";',
        formattedContent: 'const foo = "bar";'
      };

      const output = Differ.generateColoredDiff(diffResult);

      expect(output).toContain('✓ test.js is already formatted');
    });

    test('should format diff with colors when differences exist', () => {
      const diffResult: DiffResult = {
        filePath: 'test.js',
        hasDifferences: true,
        diffOutput: '--- a/test.js\n+++ b/test.js\n@@ -1 +1 @@\n-const foo={a:1};\n+const foo = { a: 1 };',
        originalContent: 'const foo={a:1};',
        formattedContent: 'const foo = { a: 1 };'
      };

      const output = Differ.generateColoredDiff(diffResult);

      // より包括的な検証
      expect(output).toContain('⚠ test.js needs formatting:');
      expect(output).toContain('--- a/test.js');
      expect(output).toContain('+++ b/test.js');
      expect(output).toContain('-const foo={a:1};');
      expect(output).toContain('+const foo = { a: 1 };');
      expect(output).toContain('@@');
    });
  });

  describe('generateStats', () => {
    test('should generate correct stats for mixed results', () => {
      const diffResults: DiffResult[] = [
        {
          filePath: 'formatted.js',
          hasDifferences: false,
          diffOutput: '',
          originalContent: 'const a = 1;',
          formattedContent: 'const a = 1;'
        },
        {
          filePath: 'unformatted.js',
          hasDifferences: true,
          diffOutput: 'diff content',
          originalContent: 'const a=1;',
          formattedContent: 'const a = 1;'
        }
      ];

      const stats = Differ.generateStats(diffResults);

      expect(stats).toContain('Total files: 2');
      expect(stats).toContain('Already formatted: 1');
      expect(stats).toContain('Needs formatting: 1');
    });

    test('should handle empty results', () => {
      const stats = Differ.generateStats([]);

      expect(stats).toContain('Total files: 0');
      expect(stats).toContain('Already formatted: 0');
      expect(stats).toContain('Needs formatting: 0');
    });
  });

  describe('generatePlainDiff', () => {
    test('should generate plain text output without colors', () => {
      const diffResult: DiffResult = {
        filePath: 'test.js',
        hasDifferences: true,
        diffOutput: '--- a/test.js\n+++ b/test.js\n@@ -1 +1 @@\n-old\n+new',
        originalContent: 'old',
        formattedContent: 'new'
      };

      const output = Differ.generatePlainDiff(diffResult);

      // より包括的な検証
      expect(output).toContain('⚠ test.js needs formatting:');
      expect(output).toContain('--- a/test.js');
      expect(output).toContain('+++ b/test.js');
      expect(output).toContain('-old');
      expect(output).toContain('+new');
      expect(output).toContain('@@');
    });
  });
});
