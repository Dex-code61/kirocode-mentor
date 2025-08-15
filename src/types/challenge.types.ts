/**
 * Types for challenge components
 */

export interface ComponentSubmission {
  code?: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  score?: number;
  feedback?: string;
  testResults?: Array<{
    passed: boolean;
    description?: string;
    error?: string;
  }>;
}

export interface ComponentChallenge {
  id: string;
  title: string;
  description: string;
  instructions: string;
  language: string;
  starterCode?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: number;
  points: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  testCases?: Array<{
    input: any;
    expectedOutput: any;
    description?: string;
  }>;
  examples?: Array<{
    input: any;
    output: any;
    explanation?: string;
  }>;
  hints?: string[];
  // Unit tests fields
  unitTests?: string;
  testFramework?: 'JEST' | 'MOCHA' | 'VITEST' | 'PYTEST' | 'JUNIT' | 'GTEST' | 'CUSTOM';
  testTimeout?: number;
  testSetup?: string;
  testTeardown?: string;
  allowedImports?: string[];
  memoryLimit?: number;
  timeLimit?: number;
  module: {
    title: string;
    learningPath: {
      title: string;
    };
  };
}

/**
 * Flexible challenge type that matches database structure more closely
 */
export interface FlexibleChallenge {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  language?: string;
  starterCode?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime?: number;
  points?: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  testCases?: Array<{
    input: any;
    expectedOutput: any;
    description?: string;
  }>;
  examples?: Array<{
    input: any;
    output: any;
    explanation?: string;
  }>;
  hints?: string[];
  module?: {
    title?: string;
    learningPath?: {
      title?: string;
    };
  };
}

export interface ChallengePageProps {
  challenge: ComponentChallenge;
  latestSubmission?: ComponentSubmission | null;
  pathId: string;
}