/**
 * Code validation utilities for real-time analysis
 */

import { CodeAnalysis, CodeError, CodeWarning, CodeSuggestion, ComplexityMetrics, DetectedPattern } from '@/types';

export interface ValidationContext {
  language: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  exerciseType?: 'coding' | 'quiz' | 'project' | 'debugging';
  expectedPatterns?: string[];
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  languages: string[];
  check: (code: string, context: ValidationContext) => ValidationResult[];
}

export interface ValidationResult {
  line: number;
  column: number;
  message: string;
  explanation: string;
  fixSuggestion?: string;
  category: 'syntax' | 'logic' | 'style' | 'performance' | 'security' | 'best-practice';
}

// Common validation rules
export const VALIDATION_RULES: ValidationRule[] = [
  // JavaScript/TypeScript Rules
  {
    id: 'js-missing-semicolon',
    name: 'Missing Semicolon',
    description: 'Statements should end with semicolons',
    severity: 'warning',
    languages: ['javascript', 'typescript'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed && 
            !trimmed.endsWith(';') && 
            !trimmed.endsWith('{') && 
            !trimmed.endsWith('}') &&
            !trimmed.startsWith('//') &&
            !trimmed.includes('if (') &&
            !trimmed.includes('for (') &&
            !trimmed.includes('while (') &&
            !trimmed.includes('function ') &&
            (trimmed.includes('=') || trimmed.includes('return ') || trimmed.includes('console.'))) {
          results.push({
            line: index + 1,
            column: line.length,
            message: 'Missing semicolon',
            explanation: 'JavaScript statements should end with semicolons for clarity and to avoid automatic semicolon insertion issues.',
            fixSuggestion: 'Add a semicolon at the end of the statement',
            category: 'style',
          });
        }
      });
      
      return results;
    },
  },
  
  {
    id: 'js-unused-variable',
    name: 'Unused Variable',
    description: 'Variables should be used after declaration',
    severity: 'warning',
    languages: ['javascript', 'typescript'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      const declaredVars = new Set<string>();
      const usedVars = new Set<string>();
      
      // Simple variable detection (not comprehensive)
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        // Find variable declarations
        const varMatch = trimmed.match(/(?:let|const|var)\s+(\w+)/);
        if (varMatch) {
          declaredVars.add(varMatch[1]);
        }
        
        // Find variable usage (simple pattern)
        const words = trimmed.match(/\b\w+\b/g) || [];
        words.forEach(word => {
          if (declaredVars.has(word) && !trimmed.includes(`${word} =`)) {
            usedVars.add(word);
          }
        });
      });
      
      // Check for unused variables
      declaredVars.forEach(varName => {
        if (!usedVars.has(varName)) {
          const line = lines.findIndex(l => l.includes(`${varName} =`) || l.includes(`${varName};`));
          if (line !== -1) {
            results.push({
              line: line + 1,
              column: 1,
              message: `Variable '${varName}' is declared but never used`,
              explanation: 'Unused variables can clutter code and may indicate logic errors.',
              fixSuggestion: `Remove the unused variable '${varName}' or use it in your code`,
              category: 'best-practice',
            });
          }
        }
      });
      
      return results;
    },
  },
  
  {
    id: 'js-console-log',
    name: 'Console Log Usage',
    description: 'Console.log statements in production code',
    severity: 'info',
    languages: ['javascript', 'typescript'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('console.log')) {
          results.push({
            line: index + 1,
            column: line.indexOf('console.log') + 1,
            message: 'Console.log statement found',
            explanation: 'Console.log statements are useful for debugging but should be removed from production code.',
            fixSuggestion: 'Remove console.log or replace with proper logging',
            category: 'best-practice',
          });
        }
      });
      
      return results;
    },
  },
  
  // Python Rules
  {
    id: 'python-indentation',
    name: 'Indentation Error',
    description: 'Python requires consistent indentation',
    severity: 'error',
    languages: ['python'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      const indentStack: number[] = [0];
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        const leadingSpaces = line.length - line.trimStart().length;
        
        if (trimmed.endsWith(':')) {
          indentStack.push(leadingSpaces + 4);
        } else if (leadingSpaces < indentStack[indentStack.length - 1]) {
          while (indentStack.length > 1 && indentStack[indentStack.length - 1] > leadingSpaces) {
            indentStack.pop();
          }
          
          if (indentStack[indentStack.length - 1] !== leadingSpaces) {
            results.push({
              line: index + 1,
              column: 1,
              message: 'Indentation error',
              explanation: 'Python uses indentation to define code blocks. Ensure consistent indentation.',
              fixSuggestion: 'Fix the indentation to match the expected level',
              category: 'syntax',
            });
          }
        }
      });
      
      return results;
    },
  },
  
  {
    id: 'python-missing-colon',
    name: 'Missing Colon',
    description: 'Control structures require colons',
    severity: 'error',
    languages: ['python'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        if ((trimmed.startsWith('if ') || 
             trimmed.startsWith('for ') || 
             trimmed.startsWith('while ') || 
             trimmed.startsWith('def ') || 
             trimmed.startsWith('class ') ||
             trimmed === 'else' ||
             trimmed === 'try' ||
             trimmed.startsWith('except')) && 
            !trimmed.endsWith(':')) {
          results.push({
            line: index + 1,
            column: line.length,
            message: 'Missing colon',
            explanation: 'Python control structures (if, for, while, def, class, etc.) must end with a colon.',
            fixSuggestion: 'Add a colon at the end of the statement',
            category: 'syntax',
          });
        }
      });
      
      return results;
    },
  },
  
  // General Rules
  {
    id: 'general-long-line',
    name: 'Long Line',
    description: 'Lines should not exceed recommended length',
    severity: 'info',
    languages: ['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      const maxLength = context.language === 'python' ? 79 : 120;
      
      lines.forEach((line, index) => {
        if (line.length > maxLength) {
          results.push({
            line: index + 1,
            column: maxLength + 1,
            message: `Line too long (${line.length} > ${maxLength} characters)`,
            explanation: 'Long lines can be hard to read and may not fit on smaller screens.',
            fixSuggestion: 'Break the line into multiple lines or refactor the code',
            category: 'style',
          });
        }
      });
      
      return results;
    },
  },
  
  {
    id: 'general-empty-catch',
    name: 'Empty Catch Block',
    description: 'Catch blocks should not be empty',
    severity: 'warning',
    languages: ['javascript', 'typescript', 'java', 'csharp'],
    check: (code: string, context: ValidationContext) => {
      const results: ValidationResult[] = [];
      const lines = code.split('\n');
      
      for (let i = 0; i < lines.length - 1; i++) {
        const currentLine = lines[i].trim();
        const nextLine = lines[i + 1]?.trim();
        
        if ((currentLine.includes('catch') && currentLine.includes('{')) ||
            (currentLine.includes('catch') && nextLine === '{')) {
          // Look for empty catch block
          let braceCount = 0;
          let isEmpty = true;
          let j = currentLine.includes('{') ? i : i + 1;
          
          for (; j < lines.length; j++) {
            const line = lines[j];
            for (const char of line) {
              if (char === '{') braceCount++;
              if (char === '}') braceCount--;
              if (braceCount === 0 && char === '}') {
                if (isEmpty) {
                  results.push({
                    line: i + 1,
                    column: 1,
                    message: 'Empty catch block',
                    explanation: 'Empty catch blocks hide errors and make debugging difficult.',
                    fixSuggestion: 'Add error handling or at least log the error',
                    category: 'best-practice',
                  });
                }
                break;
              }
            }
            
            if (lines[j].trim() && !lines[j].includes('{') && !lines[j].includes('}')) {
              isEmpty = false;
            }
            
            if (braceCount === 0) break;
          }
        }
      }
      
      return results;
    },
  },
];

/**
 * Validate code using all applicable rules
 */
export function validateCode(code: string, context: ValidationContext): CodeAnalysis {
  const errors: CodeError[] = [];
  const warnings: CodeWarning[] = [];
  const suggestions: CodeSuggestion[] = [];
  
  // Apply validation rules
  const applicableRules = VALIDATION_RULES.filter(rule => 
    rule.languages.includes(context.language)
  );
  
  applicableRules.forEach(rule => {
    const results = rule.check(code, context);
    
    results.forEach(result => {
      const baseItem = {
        line: result.line,
        column: result.column,
        message: result.message,
      };
      
      switch (rule.severity) {
        case 'error':
          errors.push({
            ...baseItem,
            severity: 'error',
            explanation: result.explanation,
            fixSuggestion: result.fixSuggestion,
          });
          break;
        case 'warning':
          warnings.push({
            ...baseItem,
            type: result.category,
          });
          break;
        case 'info':
          suggestions.push({
            ...baseItem,
            improvement: result.fixSuggestion || result.explanation,
          });
          break;
      }
    });
  });
  
  // Calculate complexity metrics
  const complexity = calculateComplexity(code, context.language);
  
  // Detect patterns
  const patterns = detectPatterns(code, context);
  
  return {
    id: `analysis-${Date.now()}`,
    code,
    language: context.language,
    errors,
    warnings,
    suggestions,
    complexity,
    patterns,
  };
}

/**
 * Calculate code complexity metrics
 */
function calculateComplexity(code: string, language: string): ComplexityMetrics {
  const lines = code.split('\n').filter(line => line.trim());
  const nonEmptyLines = lines.length;
  
  // Cyclomatic complexity (simplified)
  let cyclomaticComplexity = 1; // Base complexity
  const complexityKeywords = ['if', 'else', 'for', 'while', 'case', 'catch', '&&', '||', '?'];
  
  complexityKeywords.forEach(keyword => {
    const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
    if (matches) {
      cyclomaticComplexity += matches.length;
    }
  });
  
  // Cognitive complexity (simplified)
  let cognitiveComplexity = 0;
  let nestingLevel = 0;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Increase nesting for control structures
    if (trimmed.includes('if') || trimmed.includes('for') || trimmed.includes('while')) {
      cognitiveComplexity += 1 + nestingLevel;
      nestingLevel++;
    }
    
    // Decrease nesting
    if (trimmed.includes('}') && nestingLevel > 0) {
      nestingLevel--;
    }
    
    // Add complexity for logical operators
    const logicalOps = (trimmed.match(/&&|\|\|/g) || []).length;
    cognitiveComplexity += logicalOps;
  });
  
  // Maintainability index (simplified)
  const maintainabilityIndex = Math.max(0, 
    171 - 5.2 * Math.log(nonEmptyLines) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(nonEmptyLines)
  );
  
  return {
    cyclomatic: cyclomaticComplexity,
    cognitive: cognitiveComplexity,
    maintainability: Math.round(maintainabilityIndex),
  };
}

/**
 * Detect common coding patterns
 */
function detectPatterns(code: string, context: ValidationContext): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  
  // Design patterns detection (simplified)
  if (code.includes('class') && code.includes('constructor')) {
    patterns.push({
      name: 'Constructor Pattern',
      description: 'Uses constructor function to create objects',
      confidence: 0.8,
    });
  }
  
  if (code.includes('function') && code.includes('return function')) {
    patterns.push({
      name: 'Factory Pattern',
      description: 'Function that returns other functions',
      confidence: 0.7,
    });
  }
  
  if (code.includes('addEventListener') || code.includes('on(')) {
    patterns.push({
      name: 'Observer Pattern',
      description: 'Uses event listeners for decoupled communication',
      confidence: 0.6,
    });
  }
  
  // Code style patterns
  if (code.includes('const') && !code.includes('var')) {
    patterns.push({
      name: 'Modern JavaScript',
      description: 'Uses const/let instead of var',
      confidence: 0.9,
    });
  }
  
  if (code.includes('=>')) {
    patterns.push({
      name: 'Arrow Functions',
      description: 'Uses ES6 arrow function syntax',
      confidence: 0.9,
    });
  }
  
  if (code.includes('async') && code.includes('await')) {
    patterns.push({
      name: 'Async/Await Pattern',
      description: 'Uses modern asynchronous programming',
      confidence: 0.9,
    });
  }
  
  return patterns;
}

/**
 * Get suggestions for improving code quality
 */
export function getCodeImprovementSuggestions(
  code: string, 
  context: ValidationContext
): CodeSuggestion[] {
  const suggestions: CodeSuggestion[] = [];
  const lines = code.split('\n');
  
  // Language-specific suggestions
  switch (context.language) {
    case 'javascript':
    case 'typescript':
      // Suggest const over let when variable is not reassigned
      lines.forEach((line, index) => {
        if (line.includes('let ') && !code.includes(`${line.match(/let (\w+)/)?.[1]} =`)) {
          const varName = line.match(/let (\w+)/)?.[1];
          if (varName) {
            suggestions.push({
              line: index + 1,
              column: line.indexOf('let') + 1,
              message: `Consider using 'const' instead of 'let' for '${varName}'`,
              improvement: `Replace 'let ${varName}' with 'const ${varName}' if the variable is not reassigned`,
            });
          }
        }
      });
      break;
      
    case 'python':
      // Suggest list comprehensions
      lines.forEach((line, index) => {
        if (line.includes('for ') && line.includes('.append(')) {
          suggestions.push({
            line: index + 1,
            column: 1,
            message: 'Consider using list comprehension',
            improvement: 'List comprehensions are more Pythonic and often more readable',
          });
        }
      });
      break;
  }
  
  return suggestions;
}