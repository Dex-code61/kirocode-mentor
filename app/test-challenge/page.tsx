import { ChallengeEditor } from '@/components/learn/challenge-editor';
import { ChallengeHeader } from '@/components/learn/challenge-header';
import { ChallengeSidebar } from '@/components/learn/challenge-sidebar';

// Mock data pour tester
const mockChallenge = {
  id: 'test-challenge-1',
  title: 'Two Sum Problem',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  instructions: `Write a function that takes an array of numbers and a target sum, then returns the indices of two numbers that add up to the target.

Requirements:
- You may assume that each input would have exactly one solution
- You may not use the same element twice
- You can return the answer in any order

Constraints:
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹`,
  language: 'javascript',
  difficulty: 'BEGINNER' as const,
  estimatedTime: 15,
  points: 100,
  starterCode: `function twoSum(nums, target) {
    // Write your solution here
    
}

// Test cases
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log(twoSum([3,2,4], 6)); // Expected: [1,2]`,
  testCases: [
    {
      input: { nums: [2, 7, 11, 15], target: 9 },
      expectedOutput: [0, 1],
      description: 'Basic case with target at beginning'
    },
    {
      input: { nums: [3, 2, 4], target: 6 },
      expectedOutput: [1, 2],
      description: 'Target requires middle elements'
    },
    {
      input: { nums: [3, 3], target: 6 },
      expectedOutput: [0, 1],
      description: 'Duplicate numbers'
    }
  ],
  examples: [
    {
      input: { nums: [2, 7, 11, 15], target: 9 },
      output: [0, 1],
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: { nums: [3, 2, 4], target: 6 },
      output: [1, 2],
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
    }
  ],
  hints: [
    'Try using a hash map to store numbers you\'ve seen and their indices.',
    'For each number, check if (target - current number) exists in your hash map.',
    'Remember to return the indices, not the actual numbers.'
  ],
  status: 'IN_PROGRESS' as const,
  module: {
    title: 'Arrays and Hashing',
    learningPath: {
      title: 'Data Structures & Algorithms'
    }
  }
};

const mockSubmission = {
  code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
  status: 'PASSED' as const,
  score: 85,
  feedback: 'Good solution! Consider edge cases.',
  testResults: [
    { passed: true, description: 'Basic case with target at beginning' },
    { passed: true, description: 'Target requires middle elements' },
    { passed: false, description: 'Duplicate numbers', error: 'Expected [0,1] but got [1,0]' }
  ]
};

export default function TestChallengePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <ChallengeHeader 
            pathId="test-path"
            challenge={mockChallenge}
            latestSubmission={mockSubmission}
          />

          {/* Editor */}
          <div className="flex-1">
            <ChallengeEditor 
              challenge={mockChallenge}
              latestSubmission={mockSubmission}
            />
          </div>
        </div>

        {/* Sidebar */}
        <ChallengeSidebar 
          pathId="test-path"
          challenge={mockChallenge}
          latestSubmission={mockSubmission}
        />
      </div>
    </div>
  );
}