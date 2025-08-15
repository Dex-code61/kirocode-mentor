/**
 * Code formatting utilities for Monaco Editor
 */

export interface FormattingOptions {
  tabSize: number;
  insertSpaces: boolean;
  trimTrailingWhitespace: boolean;
  insertFinalNewline: boolean;
  trimFinalNewlines: boolean;
}

export interface LanguageFormattingRules {
  [language: string]: {
    defaultOptions: FormattingOptions;
    customRules?: (code: string, options: FormattingOptions) => string;
  };
}

export const DEFAULT_FORMATTING_OPTIONS: FormattingOptions = {
  tabSize: 2,
  insertSpaces: true,
  trimTrailingWhitespace: true,
  insertFinalNewline: true,
  trimFinalNewlines: true,
};

export const LANGUAGE_FORMATTING_RULES: LanguageFormattingRules = {
  javascript: {
    defaultOptions: {
      ...DEFAULT_FORMATTING_OPTIONS,
      tabSize: 2,
    },
    customRules: (code: string, options: FormattingOptions) => {
      // Add semicolons if missing
      let formatted = code;

      // Basic semicolon insertion for simple statements
      const lines = formatted.split('\n');
      const processedLines = lines.map(line => {
        const trimmed = line.trim();

        // Skip empty lines, comments, and lines that already end with semicolon or specific characters
        if (
          !trimmed ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('/*') ||
          trimmed.endsWith(';') ||
          trimmed.endsWith('{') ||
          trimmed.endsWith('}') ||
          trimmed.endsWith(',') ||
          trimmed.endsWith(':') ||
          trimmed.includes('if (') ||
          trimmed.includes('for (') ||
          trimmed.includes('while (') ||
          trimmed.includes('function ') ||
          trimmed.includes('class ') ||
          trimmed.includes('export ') ||
          trimmed.includes('import ')
        ) {
          return line;
        }

        // Add semicolon to simple statements
        if (
          trimmed.includes('=') ||
          trimmed.includes('return ') ||
          trimmed.includes('console.') ||
          trimmed.includes('throw ') ||
          trimmed.includes('break') ||
          trimmed.includes('continue')
        ) {
          return line + ';';
        }

        return line;
      });

      return processedLines.join('\n');
    },
  },

  typescript: {
    defaultOptions: {
      ...DEFAULT_FORMATTING_OPTIONS,
      tabSize: 2,
    },
    customRules: (code: string, options: FormattingOptions) => {
      // Similar to JavaScript but with TypeScript-specific rules
      let formatted = code;

      const lines = formatted.split('\n');
      const processedLines = lines.map(line => {
        const trimmed = line.trim();

        if (
          !trimmed ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('/*') ||
          trimmed.endsWith(';') ||
          trimmed.endsWith('{') ||
          trimmed.endsWith('}') ||
          trimmed.endsWith(',') ||
          trimmed.endsWith(':') ||
          trimmed.includes('interface ') ||
          trimmed.includes('type ') ||
          trimmed.includes('enum ') ||
          trimmed.includes('if (') ||
          trimmed.includes('for (') ||
          trimmed.includes('while (') ||
          trimmed.includes('function ') ||
          trimmed.includes('class ') ||
          trimmed.includes('export ') ||
          trimmed.includes('import ')
        ) {
          return line;
        }

        if (
          trimmed.includes('=') ||
          trimmed.includes('return ') ||
          trimmed.includes('console.') ||
          trimmed.includes('throw ') ||
          trimmed.includes('break') ||
          trimmed.includes('continue')
        ) {
          return line + ';';
        }

        return line;
      });

      return processedLines.join('\n');
    },
  },

  python: {
    defaultOptions: {
      ...DEFAULT_FORMATTING_OPTIONS,
      tabSize: 4,
    },
    customRules: (code: string, options: FormattingOptions) => {
      // Python-specific formatting
      let formatted = code;

      // Ensure proper indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const processedLines = lines.map(line => {
        const trimmed = line.trim();

        if (!trimmed) return '';

        // Decrease indent for dedent keywords
        if (
          trimmed.startsWith('except') ||
          trimmed.startsWith('elif') ||
          trimmed.startsWith('else') ||
          trimmed.startsWith('finally')
        ) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        // Apply current indentation
        const indent = ' '.repeat(indentLevel * options.tabSize);
        const formattedLine = indent + trimmed;

        // Increase indent for indent keywords
        if (
          trimmed.endsWith(':') &&
          (trimmed.includes('if ') ||
            trimmed.includes('for ') ||
            trimmed.includes('while ') ||
            trimmed.includes('def ') ||
            trimmed.includes('class ') ||
            trimmed.includes('try:') ||
            trimmed.includes('except') ||
            trimmed.includes('elif') ||
            trimmed.includes('else:') ||
            trimmed.includes('finally:') ||
            trimmed.includes('with '))
        ) {
          indentLevel++;
        }

        return formattedLine;
      });

      return processedLines.join('\n');
    },
  },

  java: {
    defaultOptions: {
      ...DEFAULT_FORMATTING_OPTIONS,
      tabSize: 4,
    },
  },

  cpp: {
    defaultOptions: {
      ...DEFAULT_FORMATTING_OPTIONS,
      tabSize: 4,
    },
  },

  csharp: {
    defaultOptions: {
      ...DEFAULT_FORMATTING_OPTIONS,
      tabSize: 4,
    },
  },
};

/**
 * Format code based on language-specific rules
 */
export function formatCode(
  code: string,
  language: string,
  options?: Partial<FormattingOptions>
): string {
  const languageRules = LANGUAGE_FORMATTING_RULES[language];
  const formattingOptions = {
    ...(languageRules?.defaultOptions || DEFAULT_FORMATTING_OPTIONS),
    ...options,
  };

  let formatted = code;

  // Apply language-specific custom rules
  if (languageRules?.customRules) {
    formatted = languageRules.customRules(formatted, formattingOptions);
  }

  // Apply common formatting rules
  formatted = applyCommonFormatting(formatted, formattingOptions);

  return formatted;
}

/**
 * Apply common formatting rules across all languages
 */
function applyCommonFormatting(
  code: string,
  options: FormattingOptions
): string {
  let formatted = code;

  // Trim trailing whitespace
  if (options.trimTrailingWhitespace) {
    formatted = formatted
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n');
  }

  // Trim final newlines
  if (options.trimFinalNewlines) {
    formatted = formatted.replace(/\n+$/, '');
  }

  // Insert final newline
  if (options.insertFinalNewline && !formatted.endsWith('\n')) {
    formatted += '\n';
  }

  // Convert tabs to spaces or vice versa
  if (options.insertSpaces) {
    const spaces = ' '.repeat(options.tabSize);
    formatted = formatted.replace(/\t/g, spaces);
  } else {
    const spacePattern = new RegExp(`^( {${options.tabSize}})`, 'gm');
    formatted = formatted.replace(spacePattern, '\t');
  }

  return formatted;
}

/**
 * Validate code syntax for basic errors
 */
export function validateCodeSyntax(
  code: string,
  language: string
): {
  isValid: boolean;
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
} {
  const errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }> = [];

  const lines = code.split('\n');

  // Basic syntax validation based on language
  switch (language) {
    case 'javascript':
    case 'typescript':
      validateJavaScriptSyntax(lines, errors);
      break;
    case 'python':
      validatePythonSyntax(lines, errors);
      break;
    case 'java':
      validateJavaSyntax(lines, errors);
      break;
  }

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
  };
}

function validateJavaScriptSyntax(
  lines: string[],
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>
): void {
  let braceCount = 0;
  let parenCount = 0;
  let bracketCount = 0;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      return;
    }

    // Check for unmatched brackets
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      switch (char) {
        case '{':
          braceCount++;
          break;
        case '}':
          braceCount--;
          if (braceCount < 0) {
            errors.push({
              line: lineNumber,
              column: i + 1,
              message: 'Unmatched closing brace',
              severity: 'error',
            });
          }
          break;
        case '(':
          parenCount++;
          break;
        case ')':
          parenCount--;
          if (parenCount < 0) {
            errors.push({
              line: lineNumber,
              column: i + 1,
              message: 'Unmatched closing parenthesis',
              severity: 'error',
            });
          }
          break;
        case '[':
          bracketCount++;
          break;
        case ']':
          bracketCount--;
          if (bracketCount < 0) {
            errors.push({
              line: lineNumber,
              column: i + 1,
              message: 'Unmatched closing bracket',
              severity: 'error',
            });
          }
          break;
      }
    }

    // Check for missing semicolons (warning)
    if (
      trimmed &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.startsWith('//') &&
      !trimmed.includes('if (') &&
      !trimmed.includes('for (') &&
      !trimmed.includes('while (') &&
      !trimmed.includes('function ') &&
      (trimmed.includes('=') || trimmed.includes('return '))
    ) {
      errors.push({
        line: lineNumber,
        column: line.length,
        message: 'Missing semicolon',
        severity: 'warning',
      });
    }
  });

  // Check for unmatched brackets at end
  if (braceCount > 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `${braceCount} unmatched opening brace(s)`,
      severity: 'error',
    });
  }

  if (parenCount > 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `${parenCount} unmatched opening parenthesis(es)`,
      severity: 'error',
    });
  }

  if (bracketCount > 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `${bracketCount} unmatched opening bracket(s)`,
      severity: 'error',
    });
  }
}

function validatePythonSyntax(
  lines: string[],
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>
): void {
  let expectedIndent = 0;
  const indentStack: number[] = [0];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    // Check indentation
    const leadingSpaces = line.length - line.trimStart().length;

    if (trimmed.endsWith(':')) {
      // This line should increase indentation
      indentStack.push(leadingSpaces + 4);
    } else if (leadingSpaces < indentStack[indentStack.length - 1]) {
      // Dedent - find matching indentation level
      while (
        indentStack.length > 1 &&
        indentStack[indentStack.length - 1] > leadingSpaces
      ) {
        indentStack.pop();
      }

      if (indentStack[indentStack.length - 1] !== leadingSpaces) {
        errors.push({
          line: lineNumber,
          column: 1,
          message: 'Indentation error',
          severity: 'error',
        });
      }
    }

    // Check for missing colons
    if (
      (trimmed.startsWith('if ') ||
        trimmed.startsWith('for ') ||
        trimmed.startsWith('while ') ||
        trimmed.startsWith('def ') ||
        trimmed.startsWith('class ') ||
        trimmed === 'else' ||
        trimmed === 'try' ||
        trimmed.startsWith('except')) &&
      !trimmed.endsWith(':')
    ) {
      errors.push({
        line: lineNumber,
        column: line.length,
        message: 'Missing colon',
        severity: 'error',
      });
    }
  });
}

function validateJavaSyntax(
  lines: string[],
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>
): void {
  let braceCount = 0;
  let parenCount = 0;
  let hasMainMethod = false;
  let hasClass = false;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      return;
    }

    // Check for class declaration
    if (trimmed.includes('class ')) {
      hasClass = true;
    }

    // Check for main method
    if (trimmed.includes('public static void main')) {
      hasMainMethod = true;
    }

    // Check brackets
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      switch (char) {
        case '{':
          braceCount++;
          break;
        case '}':
          braceCount--;
          break;
        case '(':
          parenCount++;
          break;
        case ')':
          parenCount--;
          break;
      }
    }

    // Check for missing semicolons
    if (
      trimmed &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.startsWith('//') &&
      !trimmed.includes('if (') &&
      !trimmed.includes('for (') &&
      !trimmed.includes('while (') &&
      !trimmed.includes('class ') &&
      !trimmed.includes('public ') &&
      !trimmed.includes('private ') &&
      !trimmed.includes('protected ') &&
      (trimmed.includes('=') ||
        trimmed.includes('return ') ||
        trimmed.includes('System.'))
    ) {
      errors.push({
        line: lineNumber,
        column: line.length,
        message: 'Missing semicolon',
        severity: 'warning',
      });
    }
  });

  // Java-specific validations
  if (!hasClass) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Java code should contain at least one class',
      severity: 'warning',
    });
  }
}
