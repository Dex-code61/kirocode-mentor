/**
 * Advanced Code Analysis Service
 * Provides comprehensive code analysis including syntax errors, suggestions, and real-time feedback
 */

import {
  CodeAnalysis,
  CodeError,
  CodeWarning,
  CodeSuggestion,
  ComplexityMetrics,
  DetectedPattern,
} from '@/types';

export interface AnalysisOptions {
  language: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  realTime?: boolean;
  includePerformanceAnalysis?: boolean;
  includeSecurity?: boolean;
  customRules?: AnalysisRule[];
}

export interface AnalysisRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'syntax' | 'logic' | 'style' | 'performance' | 'security' | 'best-practice';
  languages: string[];
  check: (code: string, options: AnalysisOptions) => AnalysisResult[];
}

export interface AnalysisResult {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  explanation: string;
  fixSuggestion?: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  ruleId: string;
}

export interface FeedbackContext {
  previousAnalysis?: CodeAnalysis;
  userProgress?: {
    commonMistakes: string[];
    strengths: string[];
    improvementAreas: string[];
  };
  exerciseContext?: {
    expectedPatterns: string[];
    difficulty: number;
    topic: string;
  };
}

/**
 * Main Code Analysis Service
 */
export class CodeAnalysisService {
  private rules: AnalysisRule[] = [];
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeRules();
  }

  /**
   * Analyze code with comprehensive feedback
   */
  async analyzeCode(
    code: string,
    options: AnalysisOptions,
    context?: FeedbackContext
  ): Promise<CodeAnalysis> {
    try {
      // Get applicable rules for the language
      const applicableRules = this.getApplicableRules(options.language);

      // Run syntax analysis first
      const syntaxResults = await this.performSyntaxAnalysis(code, options);

      // Run semantic analysis
      const semanticResults = await this.performSemanticAnalysis(code, options);

      // Run style analysis
      const styleResults = await this.performStyleAnalysis(code, options);

      // Run performance analysis if requested
      const performanceResults = options.includePerformanceAnalysis
        ? await this.performPerformanceAnalysis(code, options)
        : [];

      // Run security analysis if requested
      const securityResults = options.includeSecurity
        ? await this.performSecurityAnalysis(code, options)
        : [];

      // Combine all results
      const allResults = [
        ...syntaxResults,
        ...semanticResults,
        ...styleResults,
        ...performanceResults,
        ...securityResults,
      ];

      // Categorize results
      const { errors, warnings, suggestions } = this.categorizeResults(allResults);

      // Calculate complexity metrics
      const complexity = this.calculateComplexityMetrics(code, options.language);

      // Detect patterns
      const patterns = this.detectCodePatterns(code, options);

      // Generate personalized feedback
      const personalizedFeedback = context
        ? this.generatePersonalizedFeedback(allResults, context, options)
        : [];

      // Generate contextual suggestions
      const contextualSuggestions = context?.exerciseContext
        ? this.getContextualSuggestions(code, options, context.exerciseContext)
        : [];

      // Convert personalized feedback to appropriate types
      const personalizedErrors = personalizedFeedback
        .filter(f => f.severity === 'error')
        .map(f => ({
          line: f.line,
          column: f.column,
          message: f.message,
          severity: 'error' as const,
          explanation: f.explanation,
          fixSuggestion: f.fixSuggestion,
        }));

      const personalizedWarnings = personalizedFeedback
        .filter(f => f.severity === 'warning')
        .map(f => ({
          line: f.line,
          column: f.column,
          message: f.message,
          type: f.category,
        }));

      const personalizedSuggestions = personalizedFeedback
        .filter(f => f.severity === 'info')
        .map(f => ({
          line: f.line,
          column: f.column,
          message: f.message,
          improvement: f.fixSuggestion || f.explanation,
        }));

      const analysis: CodeAnalysis = {
        id: `analysis-${Date.now()}`,
        code,
        language: options.language,
        errors: [...errors, ...personalizedErrors],
        warnings: [...warnings, ...personalizedWarnings],
        suggestions: [...suggestions, ...personalizedSuggestions, ...contextualSuggestions],
        complexity,
        patterns,
      };

      return analysis;
    } catch (error) {
      console.error('Code analysis failed:', error);
      return this.createErrorAnalysis(code, options.language, error as Error);
    }
  }

  /**
   * Real-time analysis with debouncing
   */
  analyzeCodeRealTime(
    code: string,
    options: AnalysisOptions,
    callback: (analysis: CodeAnalysis) => void,
    debounceMs: number = 500
  ): void {
    const key = `${options.language}-${Date.now()}`;

    // Clear existing timer
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      try {
        const analysis = await this.analyzeCode(code, { ...options, realTime: true });
        callback(analysis);
      } catch (error) {
        console.error('Real-time analysis failed:', error);
        callback(this.createErrorAnalysis(code, options.language, error as Error));
      } finally {
        this.debounceTimers.delete(key);
      }
    }, debounceMs);

    this.debounceTimers.set(key, timer);
  }

  /**
   * Get improvement suggestions based on user level
   */
  getImprovementSuggestions(
    code: string,
    options: AnalysisOptions,
    context?: FeedbackContext
  ): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Level-specific suggestions
    switch (options.userLevel) {
      case 'beginner':
        suggestions.push(...this.getBeginnerSuggestions(code, options));
        break;
      case 'intermediate':
        suggestions.push(...this.getIntermediateSuggestions(code, options));
        break;
      case 'advanced':
        suggestions.push(...this.getAdvancedSuggestions(code, options));
        break;
      case 'expert':
        suggestions.push(...this.getExpertSuggestions(code, options));
        break;
    }

    // Context-aware suggestions
    if (context?.exerciseContext) {
      suggestions.push(...this.getContextualSuggestions(code, options, context.exerciseContext));
    }

    return suggestions;
  }

  /**
   * Initialize analysis rules
   */
  private initializeRules(): void {
    this.rules = [
      ...this.getSyntaxRules(),
      ...this.getStyleRules(),
      ...this.getPerformanceRules(),
      ...this.getSecurityRules(),
      ...this.getBestPracticeRules(),
    ];
  }

  /**
   * Get applicable rules for a language
   */
  private getApplicableRules(language: string): AnalysisRule[] {
    return this.rules.filter(rule => rule.languages.includes(language));
  }

  /**
   * Perform syntax analysis
   */
  private async performSyntaxAnalysis(
    code: string,
    options: AnalysisOptions
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const syntaxRules = this.rules.filter(rule => rule.category === 'syntax');

    for (const rule of syntaxRules) {
      if (rule.languages.includes(options.language)) {
        const ruleResults = rule.check(code, options);
        results.push(...ruleResults);
      }
    }

    return results;
  }

  /**
   * Perform semantic analysis
   */
  private async performSemanticAnalysis(
    code: string,
    options: AnalysisOptions
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const semanticRules = this.rules.filter(rule => 
      rule.category === 'logic' || rule.category === 'best-practice'
    );

    for (const rule of semanticRules) {
      if (rule.languages.includes(options.language)) {
        const ruleResults = rule.check(code, options);
        results.push(...ruleResults);
      }
    }

    return results;
  }

  /**
   * Perform style analysis
   */
  private async performStyleAnalysis(
    code: string,
    options: AnalysisOptions
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const styleRules = this.rules.filter(rule => rule.category === 'style');

    for (const rule of styleRules) {
      if (rule.languages.includes(options.language)) {
        const ruleResults = rule.check(code, options);
        results.push(...ruleResults);
      }
    }

    return results;
  }

  /**
   * Perform performance analysis
   */
  private async performPerformanceAnalysis(
    code: string,
    options: AnalysisOptions
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const performanceRules = this.rules.filter(rule => rule.category === 'performance');

    for (const rule of performanceRules) {
      if (rule.languages.includes(options.language)) {
        const ruleResults = rule.check(code, options);
        results.push(...ruleResults);
      }
    }

    return results;
  }

  /**
   * Perform security analysis
   */
  private async performSecurityAnalysis(
    code: string,
    options: AnalysisOptions
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const securityRules = this.rules.filter(rule => rule.category === 'security');

    for (const rule of securityRules) {
      if (rule.languages.includes(options.language)) {
        const ruleResults = rule.check(code, options);
        results.push(...ruleResults);
      }
    }

    return results;
  }

  /**
   * Categorize analysis results
   */
  private categorizeResults(results: AnalysisResult[]): {
    errors: CodeError[];
    warnings: CodeWarning[];
    suggestions: CodeSuggestion[];
  } {
    const errors: CodeError[] = [];
    const warnings: CodeWarning[] = [];
    const suggestions: CodeSuggestion[] = [];

    results.forEach(result => {
      switch (result.severity) {
        case 'error':
          errors.push({
            line: result.line,
            column: result.column,
            message: result.message,
            severity: 'error',
            explanation: result.explanation,
            fixSuggestion: result.fixSuggestion,
          });
          break;
        case 'warning':
          warnings.push({
            line: result.line,
            column: result.column,
            message: result.message,
            type: result.category,
          });
          break;
        case 'info':
          suggestions.push({
            line: result.line,
            column: result.column,
            message: result.message,
            improvement: result.fixSuggestion || result.explanation,
          });
          break;
      }
    });

    return { errors, warnings, suggestions };
  }

  /**
   * Calculate complexity metrics
   */
  private calculateComplexityMetrics(code: string, language: string): ComplexityMetrics {
    const lines = code.split('\n').filter(line => line.trim());
    const nonEmptyLines = lines.length;

    // Cyclomatic complexity
    let cyclomaticComplexity = 1;
    const controlFlowPatterns = [
      /\bif\b/g,
      /\belse\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /&&/g,
      /\|\|/g,
      /\?/g,
    ];

    controlFlowPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      cyclomaticComplexity += matches?.length || 0;
    });

    // Cognitive complexity
    let cognitiveComplexity = 0;
    let nestingLevel = 0;

    lines.forEach(line => {
      const trimmed = line.trim();

      if (trimmed.includes('if') || trimmed.includes('for') || trimmed.includes('while')) {
        cognitiveComplexity += 1 + nestingLevel;
        nestingLevel++;
      }

      if (trimmed.includes('}') && nestingLevel > 0) {
        nestingLevel--;
      }

      const logicalOps = (trimmed.match(/&&|\|\|/g) || []).length;
      cognitiveComplexity += logicalOps;
    });

    // Maintainability index
    const maintainabilityIndex = Math.max(
      0,
      171 - 5.2 * Math.log(nonEmptyLines) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(nonEmptyLines)
    );

    return {
      cyclomatic: cyclomaticComplexity,
      cognitive: cognitiveComplexity,
      maintainability: Math.round(maintainabilityIndex),
    };
  }

  /**
   * Detect code patterns
   */
  private detectCodePatterns(code: string, options: AnalysisOptions): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];

    // Design patterns
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

    // Modern JavaScript patterns
    if (options.language === 'javascript' || options.language === 'typescript') {
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
    }

    return patterns;
  }

  /**
   * Generate personalized feedback based on context
   */
  private generatePersonalizedFeedback(
    results: AnalysisResult[],
    context: FeedbackContext,
    options: AnalysisOptions
  ): AnalysisResult[] {
    const personalizedResults: AnalysisResult[] = [];

    // Check for repeated mistakes
    if (context.userProgress?.commonMistakes) {
      const commonMistakePatterns = context.userProgress.commonMistakes;
      
      results.forEach(result => {
        if (commonMistakePatterns.some(mistake => result.message.includes(mistake))) {
          personalizedResults.push({
            ...result,
            message: `Repeated issue: ${result.message}`,
            explanation: `${result.explanation} This is a pattern we've seen before - let's focus on mastering this concept.`,
            severity: 'warning',
          });
        }
      });
    }

    // Provide encouragement for improvements
    if (context.previousAnalysis) {
      const previousErrorCount = context.previousAnalysis.errors.length;
      const currentErrorCount = results.filter(r => r.severity === 'error').length;

      if (currentErrorCount < previousErrorCount) {
        personalizedResults.push({
          line: 1,
          column: 1,
          message: 'Great improvement!',
          explanation: `You've reduced errors from ${previousErrorCount} to ${currentErrorCount}. Keep up the good work!`,
          severity: 'info',
          category: 'encouragement',
          ruleId: 'improvement-feedback',
        });
      }
    }

    return personalizedResults;
  }

  /**
   * Create error analysis when analysis fails
   */
  private createErrorAnalysis(code: string, language: string, error: Error): CodeAnalysis {
    return {
      id: `error-analysis-${Date.now()}`,
      code,
      language,
      errors: [
        {
          line: 1,
          column: 1,
          message: 'Analysis failed',
          severity: 'error',
          explanation: `Code analysis encountered an error: ${error.message}`,
        },
      ],
      warnings: [],
      suggestions: [],
      complexity: { cyclomatic: 0, cognitive: 0, maintainability: 0 },
      patterns: [],
    };
  }
  /**

   * Get syntax rules for different languages
   */
  private getSyntaxRules(): AnalysisRule[] {
    return [
      // JavaScript/TypeScript syntax rules
      {
        id: 'js-missing-semicolon',
        name: 'Missing Semicolon',
        description: 'Statements should end with semicolons',
        severity: 'warning',
        category: 'syntax',
        languages: ['javascript', 'typescript'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          lines.forEach((line, index) => {
            const trimmed = line.trim();
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
              (trimmed.includes('=') || trimmed.includes('return ') || trimmed.includes('console.'))
            ) {
              results.push({
                line: index + 1,
                column: line.length,
                message: 'Missing semicolon',
                explanation: 'JavaScript statements should end with semicolons for clarity and to avoid automatic semicolon insertion issues.',
                fixSuggestion: 'Add a semicolon at the end of the statement',
                severity: 'warning',
                category: 'syntax',
                ruleId: 'js-missing-semicolon',
              });
            }
          });

          return results;
        },
      },

      {
        id: 'js-unclosed-brackets',
        name: 'Unclosed Brackets',
        description: 'Check for unclosed brackets, parentheses, or braces',
        severity: 'error',
        category: 'syntax',
        languages: ['javascript', 'typescript', 'java', 'cpp', 'csharp'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const stack: Array<{ char: string; line: number; column: number }> = [];
          const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
          const lines = code.split('\n');

          lines.forEach((line, lineIndex) => {
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              
              if (['(', '[', '{'].includes(char)) {
                stack.push({ char, line: lineIndex + 1, column: i + 1 });
              } else if ([')', ']', '}'].includes(char)) {
                if (stack.length === 0) {
                  results.push({
                    line: lineIndex + 1,
                    column: i + 1,
                    message: `Unexpected closing ${char}`,
                    explanation: `Found closing ${char} without matching opening bracket`,
                    fixSuggestion: `Remove the extra ${char} or add matching opening bracket`,
                    severity: 'error',
                    category: 'syntax',
                    ruleId: 'js-unclosed-brackets',
                  });
                } else {
                  const last = stack.pop()!;
                  if (pairs[last.char] !== char) {
                    results.push({
                      line: lineIndex + 1,
                      column: i + 1,
                      message: `Mismatched brackets: expected ${pairs[last.char]} but found ${char}`,
                      explanation: `Opening ${last.char} at line ${last.line} doesn't match closing ${char}`,
                      fixSuggestion: `Change ${char} to ${pairs[last.char]} or fix the opening bracket`,
                      severity: 'error',
                      category: 'syntax',
                      ruleId: 'js-unclosed-brackets',
                    });
                  }
                }
              }
            }
          });

          // Check for unclosed brackets
          stack.forEach(item => {
            results.push({
              line: item.line,
              column: item.column,
              message: `Unclosed ${item.char}`,
              explanation: `Opening ${item.char} is not closed`,
              fixSuggestion: `Add closing ${pairs[item.char]}`,
              severity: 'error',
              category: 'syntax',
              ruleId: 'js-unclosed-brackets',
            });
          });

          return results;
        },
      },

      // Python syntax rules
      {
        id: 'python-missing-colon',
        name: 'Missing Colon',
        description: 'Control structures require colons',
        severity: 'error',
        category: 'syntax',
        languages: ['python'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          lines.forEach((line, index) => {
            const trimmed = line.trim();

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
              results.push({
                line: index + 1,
                column: line.length,
                message: 'Missing colon',
                explanation: 'Python control structures (if, for, while, def, class, etc.) must end with a colon.',
                fixSuggestion: 'Add a colon at the end of the statement',
                severity: 'error',
                category: 'syntax',
                ruleId: 'python-missing-colon',
              });
            }
          });

          return results;
        },
      },
    ];
  }

  /**
   * Get style rules
   */
  private getStyleRules(): AnalysisRule[] {
    return [
      {
        id: 'general-long-line',
        name: 'Long Line',
        description: 'Lines should not exceed recommended length',
        severity: 'info',
        category: 'style',
        languages: ['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp'],
        check: (code: string, options: AnalysisOptions) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');
          const maxLength = options.language === 'python' ? 79 : 120;

          lines.forEach((line, index) => {
            if (line.length > maxLength) {
              results.push({
                line: index + 1,
                column: maxLength + 1,
                message: `Line too long (${line.length} > ${maxLength} characters)`,
                explanation: 'Long lines can be hard to read and may not fit on smaller screens.',
                fixSuggestion: 'Break the line into multiple lines or refactor the code',
                severity: 'info',
                category: 'style',
                ruleId: 'general-long-line',
              });
            }
          });

          return results;
        },
      },

      {
        id: 'js-var-usage',
        name: 'Var Usage',
        description: 'Prefer const/let over var',
        severity: 'warning',
        category: 'style',
        languages: ['javascript', 'typescript'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          lines.forEach((line, index) => {
            if (line.includes('var ')) {
              const column = line.indexOf('var ') + 1;
              results.push({
                line: index + 1,
                column,
                message: 'Use const or let instead of var',
                explanation: 'var has function scope and can lead to unexpected behavior. Use const for constants and let for variables.',
                fixSuggestion: 'Replace var with const (if value doesn\'t change) or let (if it does)',
                severity: 'warning',
                category: 'style',
                ruleId: 'js-var-usage',
              });
            }
          });

          return results;
        },
      },
    ];
  }

  /**
   * Get performance rules
   */
  private getPerformanceRules(): AnalysisRule[] {
    return [
      {
        id: 'js-inefficient-loop',
        name: 'Inefficient Loop',
        description: 'Detect potentially inefficient loops',
        severity: 'warning',
        category: 'performance',
        languages: ['javascript', 'typescript'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          lines.forEach((line, index) => {
            // Check for array.length in loop condition
            if (line.includes('for') && line.includes('.length') && line.includes('i <')) {
              results.push({
                line: index + 1,
                column: line.indexOf('for') + 1,
                message: 'Consider caching array length in loop',
                explanation: 'Accessing array.length in every iteration can be inefficient for large arrays.',
                fixSuggestion: 'Cache the length: for (let i = 0, len = array.length; i < len; i++)',
                severity: 'warning',
                category: 'performance',
                ruleId: 'js-inefficient-loop',
              });
            }
          });

          return results;
        },
      },
    ];
  }

  /**
   * Get security rules
   */
  private getSecurityRules(): AnalysisRule[] {
    return [
      {
        id: 'js-eval-usage',
        name: 'Eval Usage',
        description: 'Avoid using eval() function',
        severity: 'error',
        category: 'security',
        languages: ['javascript', 'typescript'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          lines.forEach((line, index) => {
            if (line.includes('eval(')) {
              results.push({
                line: index + 1,
                column: line.indexOf('eval(') + 1,
                message: 'Avoid using eval()',
                explanation: 'eval() can execute arbitrary code and is a security risk. It can also hurt performance.',
                fixSuggestion: 'Use JSON.parse() for JSON data or find alternative approaches',
                severity: 'error',
                category: 'security',
                ruleId: 'js-eval-usage',
              });
            }
          });

          return results;
        },
      },
    ];
  }

  /**
   * Get best practice rules
   */
  private getBestPracticeRules(): AnalysisRule[] {
    return [
      {
        id: 'js-console-log',
        name: 'Console Log Usage',
        description: 'Console.log statements in production code',
        severity: 'info',
        category: 'best-practice',
        languages: ['javascript', 'typescript'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          lines.forEach((line, index) => {
            if (line.includes('console.log')) {
              results.push({
                line: index + 1,
                column: line.indexOf('console.log') + 1,
                message: 'Console.log statement found',
                explanation: 'Console.log statements are useful for debugging but should be removed from production code.',
                fixSuggestion: 'Remove console.log or replace with proper logging',
                severity: 'info',
                category: 'best-practice',
                ruleId: 'js-console-log',
              });
            }
          });

          return results;
        },
      },

      {
        id: 'python-list-comprehension',
        name: 'List Comprehension Opportunity',
        description: 'Suggest list comprehensions for better performance',
        severity: 'info',
        category: 'best-practice',
        languages: ['python'],
        check: (code: string) => {
          const results: AnalysisResult[] = [];
          const lines = code.split('\n');

          for (let i = 0; i < lines.length - 1; i++) {
            const currentLine = lines[i].trim();
            const nextLine = lines[i + 1]?.trim();

            if (currentLine.includes('for ') && nextLine?.includes('.append(')) {
              results.push({
                line: i + 1,
                column: 1,
                message: 'Consider using list comprehension',
                explanation: 'List comprehensions are more Pythonic and often more efficient than loops with append.',
                fixSuggestion: 'Replace loop with list comprehension: [expression for item in iterable]',
                severity: 'info',
                category: 'best-practice',
                ruleId: 'python-list-comprehension',
              });
            }
          }

          return results;
        },
      },
    ];
  }

  /**
   * Get beginner-level suggestions
   */
  private getBeginnerSuggestions(code: string, options: AnalysisOptions): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Encourage good practices for beginners
    if (options.language === 'javascript' || options.language === 'typescript') {
      if (!code.includes('const') && !code.includes('let')) {
        suggestions.push({
          line: 1,
          column: 1,
          message: 'Try using const or let for variables',
          improvement: 'Modern JavaScript uses const for constants and let for variables instead of var',
        });
      }

      if (code.includes('function') && !code.includes('//')) {
        suggestions.push({
          line: 1,
          column: 1,
          message: 'Consider adding comments to explain your code',
          improvement: 'Comments help others (and future you) understand what your code does',
        });
      }
    }

    return suggestions;
  }

  /**
   * Get intermediate-level suggestions
   */
  private getIntermediateSuggestions(code: string, options: AnalysisOptions): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (options.language === 'javascript' || options.language === 'typescript') {
      if (code.includes('for (') && !code.includes('forEach') && !code.includes('map')) {
        suggestions.push({
          line: 1,
          column: 1,
          message: 'Consider using array methods like forEach, map, or filter',
          improvement: 'Array methods are more functional and often more readable than traditional for loops',
        });
      }
    }

    return suggestions;
  }

  /**
   * Get advanced-level suggestions
   */
  private getAdvancedSuggestions(code: string, options: AnalysisOptions): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (options.language === 'javascript' || options.language === 'typescript') {
      if (code.includes('Promise') && !code.includes('async') && !code.includes('await')) {
        suggestions.push({
          line: 1,
          column: 1,
          message: 'Consider using async/await for asynchronous operations',
          improvement: 'Async/await makes asynchronous code more readable and easier to debug',
        });
      }
    }

    return suggestions;
  }

  /**
   * Get expert-level suggestions
   */
  private getExpertSuggestions(code: string, options: AnalysisOptions): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Advanced architectural suggestions
    if (code.length > 1000) {
      suggestions.push({
        line: 1,
        column: 1,
        message: 'Consider breaking this into smaller modules',
        improvement: 'Large files can be hard to maintain. Consider splitting into smaller, focused modules',
      });
    }

    return suggestions;
  }

  /**
   * Get contextual suggestions based on exercise
   */
  private getContextualSuggestions(
    code: string,
    options: AnalysisOptions,
    exerciseContext: { expectedPatterns: string[]; difficulty: number; topic: string }
  ): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Check if expected patterns are present
    exerciseContext.expectedPatterns.forEach(pattern => {
      if (!code.includes(pattern)) {
        suggestions.push({
          line: 1,
          column: 1,
          message: `Consider using ${pattern}`,
          improvement: `This exercise expects you to use ${pattern}. Try incorporating it into your solution.`,
        });
      }
    });

    // Topic-specific suggestions
    if (exerciseContext.topic === 'loops' && !code.includes('for') && !code.includes('while')) {
      suggestions.push({
        line: 1,
        column: 1,
        message: 'This exercise is about loops',
        improvement: 'Try using a for loop or while loop to solve this problem',
      });
    }

    if (exerciseContext.topic === 'functions' && !code.includes('function') && !code.includes('=>')) {
      suggestions.push({
        line: 1,
        column: 1,
        message: 'This exercise is about functions',
        improvement: 'Try creating a function to solve this problem',
      });
    }

    return suggestions;
  }

  /**
   * Cleanup method to clear debounce timers
   */
  cleanup(): void {
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
  }
}

// Export singleton instance
export const codeAnalysisService = new CodeAnalysisService();