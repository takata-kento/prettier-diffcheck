export interface PrettierOptions {
  diffCheck?: boolean;
  [key: string]: any;
}

export interface OptionDefinition {
  type: 'boolean' | 'choice' | 'int' | 'path' | 'string';
  category: string;
  default?: any;
  description: string;
  since?: string;
  deprecated?: string | boolean;
  choices?: Array<{
    value: any;
    description: string;
    since?: string;
  }>;
  range?: {
    start: number;
    end: number;
    step: number;
  };
}

export interface DiffResult {
  filePath: string;
  hasDifferences: boolean;
  diffOutput: string;
  originalContent: string;
  formattedContent: string;
}
