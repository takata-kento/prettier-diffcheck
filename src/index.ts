import * as prettier from 'prettier';
import { PrettierPlugin, PrettierOptions, DiffResult } from './types.js';
import { Differ } from './differ.js';

const plugin: PrettierPlugin = {
  options: {
    diffCheck: {
      type: 'boolean',
      category: 'Global',
      default: false,
      description: 'Show formatting differences in diff format instead of writing files',
      since: '1.0.0'
    }
  }
};

export async function checkFileDiff(
  filePath: string,
  originalContent: string,
  options: PrettierOptions = {}
): Promise<DiffResult> {
  try {
    const loadedOptions = await prettier.resolveConfig(filePath);

    const formattedContent = await prettier.format(originalContent, {
      ...loadedOptions,
      ...options,
      filepath: filePath
    });

    return Differ.generateDiff(originalContent, formattedContent, filePath);
  } catch (error) {
    throw new Error(`Failed to format ${filePath}: ${error}`);
  }
}

export async function checkMultipleFilesDiff(
  files: Array<{ path: string; content: string }>,
  options: PrettierOptions
): Promise<DiffResult[]> {
  const results = await Promise.allSettled(
    files.map(file => checkFileDiff(file.path, file.content, options))
  );

  return results.map((result, index) => {
    const file = files[index];

    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Error processing ${file.path}:`, result.reason);
      return {
        filePath: file.path,
        hasDifferences: false,
        diffOutput: '',
        originalContent: file.content,
        formattedContent: file.content
      };
    }
  });
}

export function outputDiffResults(diffResults: DiffResult[], colored: boolean = true): void {
  if (diffResults.length === 0) {
    console.log('No files to check.');
    return;
  }

  diffResults.forEach(result => {
    if (result.hasDifferences) {
      const output = colored 
        ? Differ.generateColoredDiff(result)
        : Differ.generatePlainDiff(result);
      console.log(output);
    }
  });

  const stats = Differ.generateStats(diffResults);
  console.log('\n' + stats);

  const hasAnyDifferences = diffResults.some(result => result.hasDifferences);
  if (hasAnyDifferences) {
    process.exit(1);
  }
}

export function handleDiffCheck(
  filePaths: string[],
  originalContents: string[],
  options: PrettierOptions
): void {
  if (!options.diffCheck) {
    return;
  }

  const files = filePaths.map((path, index) => ({
    path,
    content: originalContents[index] || ''
  }));

  checkMultipleFilesDiff(files, options)
    .then(results => {
      outputDiffResults(results);
    })
    .catch(error => {
      console.error('Error during diff check:', error);
      process.exit(1);
    });
}

export default plugin;
export { Differ } from './differ.js';
export * from './types.js';
