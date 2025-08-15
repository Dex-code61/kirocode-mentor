'use client';

import React, { useState, useCallback } from 'react';
import { ChallengeCodeEditor } from '@/components/code-editor/challenge-code-editor';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ComponentChallenge, ComponentSubmission } from '@/types/challenge.types';

interface ChallengeEditorProps {
  challenge: ComponentChallenge;
  latestSubmission?: ComponentSubmission | null;
}

export const ChallengeEditor: React.FC<ChallengeEditorProps> = ({
  challenge,
  latestSubmission,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Determine initial code (latest submission or starter code)
  const initialCode = latestSubmission?.code || challenge.starterCode || getDefaultStarterCode(challenge.language);

  // Get user level based on challenge difficulty
  const getUserLevel = () => {
    switch (challenge.difficulty) {
      case 'BEGINNER':
        return 'beginner' as const;
      case 'INTERMEDIATE':
        return 'intermediate' as const;
      case 'ADVANCED':
        return 'advanced' as const;
      default:
        return 'beginner' as const;
    }
  };

  // Handle code testing
  const handleCodeTest = useCallback(async (code: string) => {
    setIsTesting(true);
    
    try {
      // Simulate API call to test code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results based on challenge test cases
      const results = challenge.testCases?.map((testCase, index) => ({
        passed: Math.random() > 0.3, // 70% chance of passing for demo
        description: testCase.description || `Test case ${index + 1}`,
        error: Math.random() > 0.7 ? 'Expected different output' : undefined,
      })) || [];

      const passed = results.filter(r => r.passed).length;
      const total = results.length;

      toast.success(`Tests completed: ${passed}/${total} passed`);

      return {
        passed,
        total,
        results,
      };
    } catch (error) {
      toast.error('Failed to run tests');
      throw error;
    } finally {
      setIsTesting(false);
    }
  }, [challenge.testCases]);

  // Handle code submission
  const handleCodeSubmit = useCallback(async (code: string) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit code
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock submission result
      const success = Math.random() > 0.4; // 60% chance of success for demo
      const score = success ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 60);
      
      if (success) {
        toast.success(`Solution submitted successfully! Score: ${score}%`);
        return {
          success: true,
          message: `Great job! Your solution passed all tests with a score of ${score}%.`,
          results: { score },
        };
      } else {
        toast.error(`Submission failed. Score: ${score}%`);
        return {
          success: false,
          message: `Your solution didn't pass all tests. Score: ${score}%. Keep trying!`,
          results: { score },
        };
      }
    } catch (error) {
      toast.error('Failed to submit solution');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="h-full p-6">
      <ChallengeCodeEditor
        challengeId={challenge.id}
        initialCode={initialCode}
        language={challenge.language}
        testCases={challenge.testCases}
        onCodeTest={handleCodeTest}
        onCodeSubmit={handleCodeSubmit}
        userLevel={getUserLevel()}
        className="h-full"
      />
    </div>
  );
};

// Helper function to get default starter code based on language
function getDefaultStarterCode(language: string): string {
  switch (language.toLowerCase()) {
    case 'javascript':
      return `// Write your solution here
function solution() {
    // Your code goes here
    
}

// Test your solution
console.log(solution());`;

    case 'typescript':
      return `// Write your solution here
function solution(): any {
    // Your code goes here
    
}

// Test your solution
console.log(solution());`;

    case 'python':
      return `# Write your solution here
def solution():
    # Your code goes here
    pass

# Test your solution
print(solution())`;

    case 'java':
      return `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.solution());
    }
    
    public Object solution() {
        // Your code goes here
        return null;
    }
}`;

    case 'cpp':
      return `#include <iostream>
using namespace std;

class Solution {
public:
    auto solution() {
        // Your code goes here
        
    }
};

int main() {
    Solution sol;
    cout << sol.solution() << endl;
    return 0;
}`;

    default:
      return `// Write your solution here
function solution() {
    // Your code goes here
    
}`;
  }
}