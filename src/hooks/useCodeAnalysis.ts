'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CodeAnalysis } from '@/types';
import { 
  codeAnalysisService, 
  AnalysisOptions, 
  FeedbackContext 
} from '@/services/code-analysis.service';

export interface UseCodeAnalysisOptions {
  language: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  realTime?: boolean;
  debounceMs?: number;
  includePerformanceAnalysis?: boolean;
  includeSecurity?: boolean;
  autoAnalyze?: boolean;
}

export interface UseCodeAnalysisReturn {
  analysis: CodeAnalysis | undefined;
  isAnalyzing: boolean;
  error: string | undefined;
  analyzeCode: (code: string, context?: FeedbackContext) => Promise<void>;
  analyzeCodeRealTime: (code: string, context?: FeedbackContext) => void;
  clearAnalysis: () => void;
  getImprovementSuggestions: (code: string, context?: FeedbackContext) => any[];
}

/**
 * Hook for code analysis with real-time feedback
 */
export function useCodeAnalysis(options: UseCodeAnalysisOptions): UseCodeAnalysisReturn {
  const [analysis, setAnalysis] = useState<CodeAnalysis | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const optionsRef = useRef(options);
  const isComponentMountedRef = useRef(true);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      codeAnalysisService.cleanup();
    };
  }, []);

  /**
   * Analyze code manually
   */
  const analyzeCode = useCallback(async (code: string, context?: FeedbackContext) => {
    if (!code.trim()) {
      setAnalysis(undefined);
      setError(undefined);
      return;
    }

    setIsAnalyzing(true);
    setError(undefined);

    try {
      const analysisOptions: AnalysisOptions = {
        language: optionsRef.current.language,
        userLevel: optionsRef.current.userLevel || 'beginner',
        realTime: false,
        includePerformanceAnalysis: optionsRef.current.includePerformanceAnalysis || false,
        includeSecurity: optionsRef.current.includeSecurity || false,
      };

      const result = await codeAnalysisService.analyzeCode(code, analysisOptions, context);
      
      if (isComponentMountedRef.current) {
        setAnalysis(result);
      }
    } catch (err) {
      console.error('Code analysis failed:', err);
      if (isComponentMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }
    } finally {
      if (isComponentMountedRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, []);

  /**
   * Analyze code with real-time debouncing
   */
  const analyzeCodeRealTime = useCallback((code: string, context?: FeedbackContext) => {
    if (!optionsRef.current.realTime) {
      return;
    }

    if (!code.trim()) {
      setAnalysis(undefined);
      setError(undefined);
      return;
    }

    setIsAnalyzing(true);
    setError(undefined);

    const analysisOptions: AnalysisOptions = {
      language: optionsRef.current.language,
      userLevel: optionsRef.current.userLevel || 'beginner',
      realTime: true,
      includePerformanceAnalysis: optionsRef.current.includePerformanceAnalysis || false,
      includeSecurity: optionsRef.current.includeSecurity || false,
    };

    codeAnalysisService.analyzeCodeRealTime(
      code,
      analysisOptions,
      (result) => {
        if (isComponentMountedRef.current) {
          setAnalysis(result);
          setIsAnalyzing(false);
        }
      },
      optionsRef.current.debounceMs || 500
    );
  }, []);

  /**
   * Clear current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysis(undefined);
    setError(undefined);
    setIsAnalyzing(false);
  }, []);

  /**
   * Get improvement suggestions
   */
  const getImprovementSuggestions = useCallback((code: string, context?: FeedbackContext) => {
    const analysisOptions: AnalysisOptions = {
      language: optionsRef.current.language,
      userLevel: optionsRef.current.userLevel || 'beginner',
      realTime: false,
      includePerformanceAnalysis: optionsRef.current.includePerformanceAnalysis || false,
      includeSecurity: optionsRef.current.includeSecurity || false,
    };

    return codeAnalysisService.getImprovementSuggestions(code, analysisOptions, context);
  }, []);

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeCode,
    analyzeCodeRealTime,
    clearAnalysis,
    getImprovementSuggestions,
  };
}

/**
 * Hook for automatic code analysis on code changes
 */
export function useAutoCodeAnalysis(
  code: string,
  options: UseCodeAnalysisOptions,
  context?: FeedbackContext
): UseCodeAnalysisReturn {
  const analysisHook = useCodeAnalysis(options);
  const { analyzeCodeRealTime, analyzeCode } = analysisHook;

  // Auto-analyze when code changes
  useEffect(() => {
    if (!options.autoAnalyze) {
      return;
    }

    if (options.realTime) {
      analyzeCodeRealTime(code, context);
    } else {
      // For non-real-time, debounce manually
      const timer = setTimeout(() => {
        analyzeCode(code, context);
      }, options.debounceMs || 1000);

      return () => clearTimeout(timer);
    }
  }, [code, analyzeCodeRealTime, analyzeCode, options.autoAnalyze, options.realTime, options.debounceMs, context]);

  return analysisHook;
}

/**
 * Hook for tracking user progress and providing contextual feedback
 */
export function useProgressiveCodeAnalysis(
  code: string,
  options: UseCodeAnalysisOptions,
  userProgress?: {
    commonMistakes: string[];
    strengths: string[];
    improvementAreas: string[];
  }
): UseCodeAnalysisReturn & {
  progressFeedback: string[];
  improvementTrends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
} {
  const [previousAnalysis, setPreviousAnalysis] = useState<CodeAnalysis | undefined>();
  const [progressFeedback, setProgressFeedback] = useState<string[]>([]);
  const [improvementTrends, setImprovementTrends] = useState<{
    improving: string[];
    declining: string[];
    stable: string[];
  }>({
    improving: [],
    declining: [],
    stable: [],
  });

  const context: FeedbackContext = {
    previousAnalysis,
    userProgress,
  };

  const analysisHook = useAutoCodeAnalysis(code, options, context);
  const { analysis } = analysisHook;

  // Track progress when analysis changes
  useEffect(() => {
    if (!analysis || !previousAnalysis) {
      setPreviousAnalysis(analysis);
      return;
    }

    // Compare current analysis with previous
    const currentErrorCount = analysis.errors.length;
    const previousErrorCount = previousAnalysis.errors.length;
    const currentWarningCount = analysis.warnings.length;
    const previousWarningCount = previousAnalysis.warnings.length;

    const feedback: string[] = [];
    const trends = {
      improving: [] as string[],
      declining: [] as string[],
      stable: [] as string[],
    };

    // Error trend analysis
    if (currentErrorCount < previousErrorCount) {
      feedback.push(`Great! You fixed ${previousErrorCount - currentErrorCount} error(s).`);
      trends.improving.push('Error reduction');
    } else if (currentErrorCount > previousErrorCount) {
      feedback.push(`${currentErrorCount - previousErrorCount} new error(s) introduced.`);
      trends.declining.push('Error increase');
    } else if (currentErrorCount === 0) {
      trends.stable.push('Error-free code');
    }

    // Warning trend analysis
    if (currentWarningCount < previousWarningCount) {
      feedback.push(`You addressed ${previousWarningCount - currentWarningCount} warning(s).`);
      trends.improving.push('Warning reduction');
    } else if (currentWarningCount > previousWarningCount) {
      trends.declining.push('Warning increase');
    }

    // Complexity trend analysis
    const currentComplexity = analysis.complexity.cyclomatic;
    const previousComplexity = previousAnalysis.complexity.cyclomatic;

    if (currentComplexity < previousComplexity) {
      feedback.push('Code complexity improved!');
      trends.improving.push('Complexity reduction');
    } else if (currentComplexity > previousComplexity) {
      trends.declining.push('Complexity increase');
    }

    // Pattern recognition improvements
    const currentPatterns = analysis.patterns.length;
    const previousPatterns = previousAnalysis.patterns.length;

    if (currentPatterns > previousPatterns) {
      feedback.push('New coding patterns detected!');
      trends.improving.push('Pattern recognition');
    }

    setProgressFeedback(feedback);
    setImprovementTrends(trends);
    setPreviousAnalysis(analysis);
  }, [analysis, previousAnalysis]);

  return {
    ...analysisHook,
    progressFeedback,
    improvementTrends,
  };
}