/**
 * Tests for Code Analysis Service
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { CodeAnalysisService, AnalysisOptions } from '../code-analysis.service';

describe('CodeAnalysisService', () => {
  let service: CodeAnalysisService;

  beforeEach(() => {
    service = new CodeAnalysisService();
  });

  afterEach(() => {
    service.cleanup();
  });

  describe('JavaScript Analysis', () => {
    const options: AnalysisOptions = {
      language: 'javascript',
      userLevel: 'beginner',
      includePerformanceAnalysis: false,
      includeSecurity: false,
    };

    test('should detect missing semicolons', async () => {
      const code = `
        const x = 5
        console.log(x)
      `;

      const analysis = await service.analyzeCode(code, options);

      expect(analysis.warnings).toHaveLength(2);
      expect(analysis.warnings[0].message).toContain('Missing semicolon');
      expect(analysis.warnings[1].message).toContain('Missing semicolon');
    });

    test('should detect console.log statements', async () => {
      const code = `
        const x = 5;
        console.log(x);
      `;

      const analysis = await service.analyzeCode(code, options);

      expect(
        analysis.suggestions.some(suggestion =>
          suggestion.message.includes('Console.log statement found')
        )
      ).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle analysis errors gracefully', async () => {
      const options: AnalysisOptions = {
        language: 'javascript',
        userLevel: 'beginner',
      };

      // This should not throw an error
      const analysis = await service.analyzeCode('', options);

      expect(analysis).toBeDefined();
      expect(analysis.errors).toBeDefined();
      expect(analysis.warnings).toBeDefined();
      expect(analysis.suggestions).toBeDefined();
    });
  });
});