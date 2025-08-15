/**
 * Utility functions to map database submission data to component-expected formats
 */

import { SubmissionStatus } from '@prisma/client';

export type ComponentSubmissionStatus = 'PENDING' | 'PASSED' | 'FAILED';

/**
 * Maps database SubmissionStatus to component-expected status
 */
export function mapSubmissionStatus(dbStatus: SubmissionStatus): ComponentSubmissionStatus {
  switch (dbStatus) {
    case 'PENDING':
    case 'ANALYZING':
      return 'PENDING';
    case 'COMPLETED':
      return 'PASSED';
    case 'FAILED':
    case 'NEEDS_REVISION':
      return 'FAILED';
    default:
      return 'PENDING';
  }
}

/**
 * Maps full database submission to component-expected format
 */
export function mapSubmissionForComponent(dbSubmission: any) {
  if (!dbSubmission) return null;

  return {
    code: dbSubmission.code,
    status: mapSubmissionStatus(dbSubmission.status),
    score: dbSubmission.score,
    feedback: dbSubmission.feedback,
    testResults: dbSubmission.testResults ? JSON.parse(dbSubmission.testResults) : undefined,
  };
}

/**
 * Maps database challenge to component-expected format
 */
export function mapChallengeForComponent(dbChallenge: any) {
  if (!dbChallenge) return null;

  // Safely parse JSON fields
  let requirements = {};
  let testCases = [];
  let kiroSpecs = {};

  try {
    requirements = typeof dbChallenge.requirements === 'string' 
      ? JSON.parse(dbChallenge.requirements) 
      : (dbChallenge.requirements || {});
  } catch (e) {
    console.warn('Failed to parse requirements JSON:', e);
  }

  try {
    testCases = typeof dbChallenge.testCases === 'string' 
      ? JSON.parse(dbChallenge.testCases) 
      : (dbChallenge.testCases || []);
  } catch (e) {
    console.warn('Failed to parse testCases JSON:', e);
  }

  try {
    kiroSpecs = typeof dbChallenge.kiroSpecs === 'string' 
      ? JSON.parse(dbChallenge.kiroSpecs) 
      : (dbChallenge.kiroSpecs || {});
  } catch (e) {
    console.warn('Failed to parse kiroSpecs JSON:', e);
  }

  // Determine difficulty with fallback
  let difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER';
  const difficultyValue = requirements.difficulty || kiroSpecs.difficulty || 'BEGINNER';
  if (['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficultyValue.toUpperCase())) {
    difficulty = difficultyValue.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }

  return {
    id: dbChallenge.id,
    title: dbChallenge.title || 'Untitled Challenge',
    description: dbChallenge.description || 'No description available.',
    instructions: requirements.instructions || kiroSpecs.instructions || dbChallenge.description || 'Complete this challenge.',
    language: requirements.language || kiroSpecs.language || 'javascript',
    starterCode: dbChallenge.startingCode || requirements.starterCode || kiroSpecs.starterCode || undefined,
    difficulty,
    estimatedTime: requirements.estimatedTime || kiroSpecs.estimatedTime || 30,
    points: dbChallenge.points || 100,
    status: mapChallengeStatus(requirements.status || 'NOT_STARTED'),
    testCases: Array.isArray(testCases) ? testCases : [],
    examples: requirements.examples || kiroSpecs.examples || [],
    hints: requirements.hints || kiroSpecs.hints || [],
    module: {
      title: dbChallenge.module?.title || 'Unknown Module',
      learningPath: {
        title: dbChallenge.module?.learningPath?.title || 'Unknown Learning Path',
      },
    },
  };
}

/**
 * Maps challenge status from database to component format
 */
export function mapChallengeStatus(dbStatus: string): 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' {
  switch (dbStatus) {
    case 'NOT_STARTED':
      return 'NOT_STARTED';
    case 'IN_PROGRESS':
      return 'IN_PROGRESS';
    case 'COMPLETED':
      return 'COMPLETED';
    default:
      return 'NOT_STARTED';
  }
}