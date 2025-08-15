/**
 * Validation utilities for challenge data
 */

import { ComponentChallenge, ComponentSubmission } from '@/types/challenge.types';

/**
 * Validates that a challenge object has all required properties
 */
export function validateChallenge(challenge: any): challenge is ComponentChallenge {
  if (!challenge) return false;

  const requiredFields = [
    'id',
    'title', 
    'description',
    'instructions',
    'language',
    'difficulty',
    'estimatedTime',
    'points'
  ];

  for (const field of requiredFields) {
    if (!(field in challenge) || challenge[field] === undefined || challenge[field] === null) {
      console.warn(`Challenge validation failed: missing or invalid field '${field}'`);
      return false;
    }
  }

  // Validate difficulty enum
  if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(challenge.difficulty)) {
    console.warn(`Challenge validation failed: invalid difficulty '${challenge.difficulty}'`);
    return false;
  }

  // Validate module structure
  if (!challenge.module || !challenge.module.title || !challenge.module.learningPath || !challenge.module.learningPath.title) {
    console.warn('Challenge validation failed: invalid module structure');
    return false;
  }

  return true;
}

/**
 * Validates that a submission object has all required properties
 */
export function validateSubmission(submission: any): submission is ComponentSubmission {
  if (!submission) return true; // null submissions are valid

  const requiredFields = ['status'];

  for (const field of requiredFields) {
    if (!(field in submission) || submission[field] === undefined || submission[field] === null) {
      console.warn(`Submission validation failed: missing or invalid field '${field}'`);
      return false;
    }
  }

  // Validate status enum
  if (!['PENDING', 'PASSED', 'FAILED'].includes(submission.status)) {
    console.warn(`Submission validation failed: invalid status '${submission.status}'`);
    return false;
  }

  return true;
}

/**
 * Creates a default challenge object with safe fallbacks
 */
export function createDefaultChallenge(id: string = 'default'): ComponentChallenge {
  return {
    id,
    title: 'Default Challenge',
    description: 'This is a default challenge created as a fallback.',
    instructions: 'Complete the challenge requirements.',
    language: 'javascript',
    difficulty: 'BEGINNER',
    estimatedTime: 30,
    points: 100,
    status: 'NOT_STARTED',
    testCases: [],
    examples: [],
    hints: [],
    module: {
      title: 'Default Module',
      learningPath: {
        title: 'Default Learning Path',
      },
    },
  };
}

/**
 * Safely maps and validates challenge data
 */
export function safeMapChallenge(dbChallenge: any, fallbackId?: string): ComponentChallenge {
  // Try to map the challenge
  const mapped = mapChallengeForComponent(dbChallenge);
  
  // Validate the mapped challenge
  if (validateChallenge(mapped)) {
    return mapped;
  }
  
  // If validation fails, return a default challenge
  console.warn('Challenge mapping/validation failed, using default challenge');
  return createDefaultChallenge(fallbackId || dbChallenge?.id || 'fallback');
}

// Import the mapping function
import { mapChallengeForComponent } from './submission-mapper';