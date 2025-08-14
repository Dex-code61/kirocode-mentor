// User types
export interface User {
  id: string;
  email: string;
  username: string;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  currentLevel: SkillLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  preferredLanguages: string[];
  difficultyPreference: 'adaptive' | 'challenging' | 'comfortable';
  sessionDuration: number;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reminders: boolean;
  achievements: boolean;
}

// Learning types
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'quiz' | 'project' | 'debugging';
  difficulty: number;
  content: ExerciseContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseContent {
  instructions: string;
  startingCode?: string;
  expectedSolution?: string;
  testCases: TestCase[];
  hints: Hint[];
}

export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description?: string;
}

export interface Hint {
  id: string;
  content: string;
  order: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  exerciseId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  attempts: number;
  timeSpent: number;
  masteryScore: number;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Code Analysis types
export interface CodeAnalysis {
  id: string;
  code: string;
  language: string;
  errors: CodeError[];
  warnings: CodeWarning[];
  suggestions: CodeSuggestion[];
  complexity: ComplexityMetrics;
  patterns: DetectedPattern[];
}

export interface CodeError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fixSuggestion?: string;
  explanation: string;
}

export interface CodeWarning {
  line: number;
  column: number;
  message: string;
  type: string;
}

export interface CodeSuggestion {
  line: number;
  column: number;
  message: string;
  improvement: string;
}

export interface ComplexityMetrics {
  cyclomatic: number;
  cognitive: number;
  maintainability: number;
}

export interface DetectedPattern {
  name: string;
  description: string;
  confidence: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}