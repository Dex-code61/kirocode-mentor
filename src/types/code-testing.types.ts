/**
 * Types pour les tests de code et soumissions
 */

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
  output?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  testResults?: TestResult[];
  executionTime?: number;
  memoryUsage?: number;
  error?: string;
  output?: string;
  coverage?: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
}

export interface SubmissionData {
  id: string;
  code: string;
  language: string;
  score: number | null;
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVISION';
  attempts: number;
  testResults: CodeExecutionResult | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgressStats {
  totalSubmissions: number;
  completedChallenges: number;
  totalChallenges: number;
  completionRate: number;
  averageScore: number;
  languageStats: Record<string, {
    count: number;
    completed: number;
    averageScore: number;
    totalScore: number;
  }>;
  recentActivity: {
    submissionsLastWeek: number;
    completedLastWeek: number;
  };
}

export interface TestConfiguration {
  framework: 'JEST' | 'MOCHA' | 'VITEST' | 'PYTEST' | 'JUNIT' | 'GTEST' | 'CUSTOM';
  timeout: number;
  memoryLimit: number;
  timeLimit: number;
  allowedImports: string[];
  setup?: string;
  teardown?: string;
}