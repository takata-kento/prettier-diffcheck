import { createTwoFilesPatch } from 'diff';
import chalk from 'chalk';
import { DiffResult } from './types.js';

export class Differ {
  static generateDiff(
    original: string,
    formatted: string,
    filePath: string = 'file'
  ): DiffResult {
    const hasDifferences = original !== formatted;

    if (!hasDifferences) {
      return {
        filePath,
        hasDifferences: false,
        diffOutput: '',
        originalContent: original,
        formattedContent: formatted,
      };
    }

    const patch = createTwoFilesPatch(
      `a/${filePath}`,
      `b/${filePath}`,
      original,
      formatted,
      undefined,
      undefined,
      { context: 3 }
    );

    return {
      filePath,
      hasDifferences: true,
      diffOutput: patch,
      originalContent: original,
      formattedContent: formatted,
    };
  }

  static generateColoredDiff(diffResult: DiffResult): string {
    if (!diffResult.hasDifferences) {
      return chalk.green(`✓ ${diffResult.filePath} is already formatted`);
    }

    const lines = diffResult.diffOutput.split('\n');
    const coloredLines = lines.map(line => {
      if (line.startsWith('---') || line.startsWith('+++')) {
        return chalk.bold(line);
      } else if (line.startsWith('@@')) {
        return chalk.cyan(line);
      } else if (line.startsWith('+')) {
        return chalk.green(line);
      } else if (line.startsWith('-')) {
        return chalk.red(line);
      } else {
        return line;
      }
    });

    return [
      chalk.yellow(`⚠ ${diffResult.filePath} needs formatting:`),
      ...coloredLines,
      ''
    ].join('\n');
  }

  static generateStats(diffResults: DiffResult[]): string {
    const total = diffResults.length;
    const needsFormatting = diffResults.filter(result => result.hasDifferences).length;
    const alreadyFormatted = total - needsFormatting;

    const stats = [
      chalk.bold('Formatting Summary:'),
      `  Total files: ${total}`,
      `  ${chalk.green(`✓ Already formatted: ${alreadyFormatted}`)}`,
      `  ${chalk.yellow(`⚠ Needs formatting: ${needsFormatting}`)}`
    ];

    return stats.join('\n');
  }

  static generatePlainDiff(diffResult: DiffResult): string {
    if (!diffResult.hasDifferences) {
      return `✓ ${diffResult.filePath} is already formatted`;
    }

    return [
      `⚠ ${diffResult.filePath} needs formatting:`,
      diffResult.diffOutput,
      ''
    ].join('\n');
  }
}
