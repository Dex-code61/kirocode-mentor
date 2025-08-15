/**
 * Test utility to verify code validator functionality
 */

import { validateCode, ValidationContext } from './code-validator';

export function testCodeValidator() {
  const testCases = [
    {
      name: 'JavaScript with logical operators',
      code: `
function test(a, b) {
  if (a && b) {
    return a || b;
  }
  return a ? b : null;
}
      `,
      language: 'javascript',
    },
    {
      name: 'Simple Python code',
      code: `
def hello():
    print("Hello, World!")
    
hello()
      `,
      language: 'python',
    },
    {
      name: 'TypeScript with types',
      code: `
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
      `,
      language: 'typescript',
    },
  ];

  console.log('Testing Code Validator...');
  
  testCases.forEach(testCase => {
    console.log(`\nTesting: ${testCase.name}`);
    
    const context: ValidationContext = {
      language: testCase.language,
      userLevel: 'beginner',
      exerciseType: 'coding',
    };
    
    try {
      const analysis = validateCode(testCase.code, context);
      console.log(`✅ Analysis completed successfully`);
      console.log(`   Errors: ${analysis.errors.length}`);
      console.log(`   Warnings: ${analysis.warnings.length}`);
      console.log(`   Suggestions: ${analysis.suggestions.length}`);
      console.log(`   Complexity: Cyclomatic=${analysis.complexity.cyclomatic}, Cognitive=${analysis.complexity.cognitive}`);
      console.log(`   Patterns: ${analysis.patterns.length} detected`);
    } catch (error) {
      console.error(`❌ Analysis failed:`, error);
    }
  });
  
  console.log('\nCode Validator test completed!');
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testCodeValidator = testCodeValidator;
}