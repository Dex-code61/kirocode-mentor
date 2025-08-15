import { prisma } from '@/lib/prisma';

async function main() {
  console.log('🌱 Starting enhanced database seed...');

  console.log('📛 Deleting all data...');
  // Delete in correct order due to foreign key constraints
  await prisma.userAchievement.deleteMany();
  await prisma.mentorFeedback.deleteMany();
  await prisma.codeSubmission.deleteMany();
  await prisma.mentorSession.deleteMany();
  await prisma.moduleProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.collaborativeSession.deleteMany();
  await prisma.codeExample.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.module.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.skillAssessment.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.learningProfile.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log('❌ All data deleted.');

  // Create sample users
  console.log('👤 Creating sample users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_13',
        email: 'john.doe@example.com',
        name: 'John Doe',
        emailVerified: true,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        profile: {
          create: {
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Passionate developer learning new technologies',
            currentLevel: 'INTERMEDIATE',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          },
        },
        preferences: {
          create: {
            language: 'en',
            timezone: 'UTC',
            theme: 'dark',
            preferredLanguages: ['JAVASCRIPT', 'TYPESCRIPT', 'PYTHON'],
            difficultyLevel: 'INTERMEDIATE',
            sessionDuration: 45,
            notifications: {
              email: true,
              push: false,
              achievements: true,
              reminders: true,
            },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_21',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        emailVerified: true,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        profile: {
          create: {
            firstName: 'Jane',
            lastName: 'Smith',
            bio: 'Full-stack developer with a passion for clean code',
            currentLevel: 'ADVANCED',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          },
        },
        preferences: {
          create: {
            language: 'en',
            timezone: 'America/New_York',
            theme: 'light',
            preferredLanguages: ['TYPESCRIPT', 'RUST', 'GO'],
            difficultyLevel: 'ADVANCED',
            sessionDuration: 60,
            notifications: {
              email: true,
              push: true,
              achievements: true,
              reminders: false,
            },
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} sample users`);

  // Create learning paths
  console.log('📚 Creating learning paths...');
  const learningPaths = await Promise.all([
    prisma.learningPath.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'Master the basics of JavaScript programming from variables to functions and beyond.',
        category: 'FRONTEND',
        difficulty: 'BEGINNER',
        estimatedHours: 40,
        totalEnrollments: 1250,
        averageRating: 4.7,
        curriculum: {
          overview: 'Complete JavaScript fundamentals course',
          objectives: ['Variables and data types', 'Functions', 'Objects and arrays', 'DOM manipulation'],
          prerequisites: ['Basic computer literacy'],
        },
        prerequisites: [],
        learningObjectives: [
          'Understand JavaScript syntax and semantics',
          'Work with variables, functions, and objects',
          'Manipulate the DOM',
          'Handle events and user interactions',
        ],
        kiroPrompts: {
          personality: 'patient_teacher',
          adaptations: ['beginner_friendly', 'lots_of_examples'],
        },
      },
    }),
    prisma.learningPath.create({
      data: {
        title: 'React Development Mastery',
        description: 'Build modern web applications with React, hooks, and state management.',
        category: 'FRONTEND',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 60,
        totalEnrollments: 890,
        averageRating: 4.8,
        curriculum: {
          overview: 'Comprehensive React development course',
          objectives: ['Components and JSX', 'Hooks and state', 'Context API', 'Testing'],
          prerequisites: ['JavaScript fundamentals', 'HTML/CSS basics'],
        },
        prerequisites: [],
        learningObjectives: [
          'Build React components and applications',
          'Manage state with hooks and context',
          'Test React applications',
          'Deploy React apps to production',
        ],
        kiroPrompts: {
          personality: 'practical_mentor',
          adaptations: ['project_based', 'real_world_examples'],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${learningPaths.length} learning paths`);

  // Create modules
  console.log('📖 Creating modules...');
  const modules = await Promise.all([
    prisma.module.create({
      data: {
        title: 'Variables and Data Types',
        description: 'Learn about JavaScript variables, primitive types, and type conversion.',
        order: 1,
        type: 'THEORY',
        learningPathId: learningPaths[0].id,
        estimatedTime: 120,
        difficulty: 'BEGINNER',
        skills: ['variables', 'data_types', 'type_conversion'],
        content: {
          theory: 'JavaScript variables and data types explanation',
          examples: ['let vs const', 'string manipulation', 'number operations'],
          exercises: ['variable_practice', 'type_conversion_exercise'],
        },
        kiroInstructions: {
          teaching_style: 'step_by_step',
          emphasis: ['practical_examples', 'common_mistakes'],
        },
      },
    }),
    prisma.module.create({
      data: {
        title: 'Functions and Scope',
        description: 'Master JavaScript functions, parameters, return values, and scope.',
        order: 2,
        type: 'PRACTICE',
        learningPathId: learningPaths[0].id,
        estimatedTime: 180,
        difficulty: 'BEGINNER',
        skills: ['functions', 'scope', 'closures'],
        content: {
          theory: 'Functions and scope in JavaScript',
          examples: ['function declarations', 'arrow functions', 'closure examples'],
          exercises: ['function_exercises', 'scope_challenges'],
        },
        kiroInstructions: {
          teaching_style: 'interactive',
          emphasis: ['hands_on_practice', 'debugging_skills'],
        },
      },
    }),
    prisma.module.create({
      data: {
        title: 'React Components',
        description: 'Learn to create and manage React components.',
        order: 1,
        type: 'PRACTICE',
        learningPathId: learningPaths[1].id,
        estimatedTime: 200,
        difficulty: 'INTERMEDIATE',
        skills: ['react', 'jsx', 'components'],
        content: {
          theory: 'React components and JSX fundamentals',
          examples: ['functional components', 'props usage', 'JSX patterns'],
          exercises: ['component_creation', 'props_practice'],
        },
        kiroInstructions: {
          teaching_style: 'component_focused',
          emphasis: ['modern_react', 'functional_approach'],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${modules.length} modules`);

  // Create comprehensive challenges with unit tests
  console.log('🎯 Creating challenges with unit tests...');
  const challenges = await Promise.all([
    // JavaScript Challenges
    prisma.challenge.create({
      data: {
        title: 'Sum Two Numbers',
        description: 'Create a function that takes two numbers and returns their sum.',
        type: 'CODING',
        moduleId: modules[0].id,
        requirements: {
          language: 'javascript',
          instructions: 'Write a function called `sum` that takes two parameters and returns their sum.',
          difficulty: 'BEGINNER',
          estimatedTime: 15,
          examples: [
            { input: [2, 3], output: 5, explanation: 'sum(2, 3) should return 5' },
            { input: [-1, 1], output: 0, explanation: 'sum(-1, 1) should return 0' },
            { input: [0, 0], output: 0, explanation: 'sum(0, 0) should return 0' },
          ],
          hints: [
            'Use the + operator to add two numbers',
            'Make sure to return the result',
            'Test with positive, negative, and zero values',
          ],
        },
        startingCode: `// Write your function here
function sum(a, b) {
  // Your code here
}

// Test your function
console.log(sum(2, 3)); // Should output: 5`,
        solution: `function sum(a, b) {
  return a + b;
}`,
        testCases: {
          tests: [
            {
              input: [2, 3],
              expectedOutput: 5,
              description: 'Basic addition with positive numbers',
            },
            {
              input: [-1, 1],
              expectedOutput: 0,
              description: 'Addition with negative and positive numbers',
            },
            {
              input: [0, 0],
              expectedOutput: 0,
              description: 'Addition with zeros',
            },
            {
              input: [100, 200],
              expectedOutput: 300,
              description: 'Addition with larger numbers',
            },
            {
              input: [-5, -10],
              expectedOutput: -15,
              description: 'Addition with negative numbers',
            },
          ],
        },
        unitTests: `describe('sum function', () => {
  test('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('should add negative and positive numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });

  test('should add zeros', () => {
    expect(sum(0, 0)).toBe(0);
  });

  test('should add larger numbers', () => {
    expect(sum(100, 200)).toBe(300);
  });

  test('should add negative numbers', () => {
    expect(sum(-5, -10)).toBe(-15);
  });

  test('should handle decimal numbers', () => {
    expect(sum(1.5, 2.5)).toBe(4);
  });
});`,
        testFramework: 'JEST',
        testTimeout: 5000,
        allowedImports: [],
        memoryLimit: 128,
        timeLimit: 10,
        kiroSpecs: {
          difficulty: 'beginner',
          concepts: ['functions', 'arithmetic', 'parameters', 'return_values'],
          hints: ['Use the + operator', 'Remember to return the result'],
          teaching_approach: 'step_by_step',
        },
        points: 100,
        badges: ['first_function'],
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Find Maximum Number',
        description: 'Create a function that finds the maximum number in an array.',
        type: 'CODING',
        moduleId: modules[1].id,
        requirements: {
          language: 'javascript',
          instructions: 'Write a function called `findMax` that takes an array of numbers and returns the largest number.',
          difficulty: 'BEGINNER',
          estimatedTime: 20,
          examples: [
            { input: [[1, 2, 3, 4, 5]], output: 5, explanation: 'findMax([1, 2, 3, 4, 5]) should return 5' },
            { input: [[-1, -2, -3]], output: -1, explanation: 'findMax([-1, -2, -3]) should return -1' },
            { input: [[42]], output: 42, explanation: 'findMax([42]) should return 42' },
          ],
          hints: [
            'You can use Math.max() with the spread operator',
            'Or iterate through the array to find the maximum',
            'Handle edge cases like empty arrays',
          ],
        },
        startingCode: `// Write your function here
function findMax(numbers) {
  // Your code here
}

// Test your function
console.log(findMax([1, 2, 3, 4, 5])); // Should output: 5`,
        solution: `function findMax(numbers) {
  if (numbers.length === 0) {
    return undefined;
  }
  return Math.max(...numbers);
}`,
        testCases: {
          tests: [
            {
              input: [[1, 2, 3, 4, 5]],
              expectedOutput: 5,
              description: 'Find max in ascending array',
            },
            {
              input: [[5, 4, 3, 2, 1]],
              expectedOutput: 5,
              description: 'Find max in descending array',
            },
            {
              input: [[-1, -2, -3]],
              expectedOutput: -1,
              description: 'Find max in negative numbers',
            },
            {
              input: [[42]],
              expectedOutput: 42,
              description: 'Find max in single element array',
            },
            {
              input: [[1, 5, 2, 8, 3]],
              expectedOutput: 8,
              description: 'Find max in unsorted array',
            },
            {
              input: [[]],
              expectedOutput: undefined,
              description: 'Handle empty array',
            },
          ],
        },
        unitTests: `describe('findMax function', () => {
  test('should find max in ascending array', () => {
    expect(findMax([1, 2, 3, 4, 5])).toBe(5);
  });

  test('should find max in descending array', () => {
    expect(findMax([5, 4, 3, 2, 1])).toBe(5);
  });

  test('should find max in negative numbers', () => {
    expect(findMax([-1, -2, -3])).toBe(-1);
  });

  test('should find max in single element array', () => {
    expect(findMax([42])).toBe(42);
  });

  test('should find max in unsorted array', () => {
    expect(findMax([1, 5, 2, 8, 3])).toBe(8);
  });

  test('should handle empty array', () => {
    expect(findMax([])).toBeUndefined();
  });

  test('should handle array with duplicates', () => {
    expect(findMax([3, 3, 3, 3])).toBe(3);
  });

  test('should handle decimal numbers', () => {
    expect(findMax([1.5, 2.7, 1.2])).toBe(2.7);
  });
});`,
        testFramework: 'JEST',
        testTimeout: 5000,
        allowedImports: [],
        memoryLimit: 128,
        timeLimit: 10,
        kiroSpecs: {
          difficulty: 'beginner',
          concepts: ['arrays', 'functions', 'math_operations', 'edge_cases'],
          hints: ['Consider using Math.max()', 'Handle empty arrays', 'Use spread operator'],
          teaching_approach: 'problem_solving',
        },
        points: 150,
        badges: ['array_master'],
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'String Reverser',
        description: 'Create a function that reverses a string.',
        type: 'CODING',
        moduleId: modules[1].id,
        requirements: {
          language: 'javascript',
          instructions: 'Write a function called `reverseString` that takes a string and returns it reversed.',
          difficulty: 'BEGINNER',
          estimatedTime: 15,
          examples: [
            { input: ['hello'], output: 'olleh', explanation: 'reverseString("hello") should return "olleh"' },
            { input: ['JavaScript'], output: 'tpircSavaJ', explanation: 'reverseString("JavaScript") should return "tpircSavaJ"' },
            { input: [''], output: '', explanation: 'reverseString("") should return ""' },
          ],
          hints: [
            'You can split the string into an array, reverse it, and join it back',
            'Or use a loop to build the reversed string',
            'Handle empty strings',
          ],
        },
        startingCode: `// Write your function here
function reverseString(str) {
  // Your code here
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"`,
        solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
        testCases: {
          tests: [
            {
              input: ['hello'],
              expectedOutput: 'olleh',
              description: 'Reverse simple string',
            },
            {
              input: ['JavaScript'],
              expectedOutput: 'tpircSavaJ',
              description: 'Reverse string with mixed case',
            },
            {
              input: [''],
              expectedOutput: '',
              description: 'Handle empty string',
            },
            {
              input: ['a'],
              expectedOutput: 'a',
              description: 'Reverse single character',
            },
            {
              input: ['12345'],
              expectedOutput: '54321',
              description: 'Reverse numeric string',
            },
            {
              input: ['Hello World!'],
              expectedOutput: '!dlroW olleH',
              description: 'Reverse string with spaces and punctuation',
            },
          ],
        },
        unitTests: `describe('reverseString function', () => {
  test('should reverse simple string', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  test('should reverse string with mixed case', () => {
    expect(reverseString('JavaScript')).toBe('tpircSavaJ');
  });

  test('should handle empty string', () => {
    expect(reverseString('')).toBe('');
  });

  test('should reverse single character', () => {
    expect(reverseString('a')).toBe('a');
  });

  test('should reverse numeric string', () => {
    expect(reverseString('12345')).toBe('54321');
  });

  test('should reverse string with spaces and punctuation', () => {
    expect(reverseString('Hello World!')).toBe('!dlroW olleH');
  });

  test('should handle palindrome', () => {
    expect(reverseString('racecar')).toBe('racecar');
  });
});`,
        testFramework: 'JEST',
        testTimeout: 5000,
        allowedImports: [],
        memoryLimit: 128,
        timeLimit: 10,
        kiroSpecs: {
          difficulty: 'beginner',
          concepts: ['strings', 'functions', 'array_methods', 'string_manipulation'],
          hints: ['Use split(), reverse(), and join()', 'Consider edge cases', 'Test with different string types'],
          teaching_approach: 'method_chaining',
        },
        points: 120,
        badges: ['string_manipulator'],
      },
    }),
    // React Challenge
    prisma.challenge.create({
      data: {
        title: 'User Profile Component',
        description: 'Create a React component that displays user profile information.',
        type: 'CODING',
        moduleId: modules[2].id,
        requirements: {
          language: 'javascript',
          instructions: 'Create a UserProfile component that accepts name, email, and avatar props and displays them in a card format.',
          difficulty: 'INTERMEDIATE',
          estimatedTime: 25,
          examples: [
            { 
              input: [{ name: 'John Doe', email: 'john@example.com', avatar: 'avatar.jpg' }], 
              output: 'Rendered component with user info', 
              explanation: 'Component should display name, email, and avatar' 
            },
          ],
          hints: [
            'Use functional component syntax',
            'Destructure props for cleaner code',
            'Add proper JSX structure',
            'Include alt text for images',
          ],
        },
        startingCode: `import React from 'react';

// Create your UserProfile component here
function UserProfile(props) {
  // Your code here
}

export default UserProfile;`,
        solution: `import React from 'react';

function UserProfile({ name, email, avatar }) {
  return (
    <div className="user-profile">
      <img src={avatar} alt={name} className="avatar" />
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

export default UserProfile;`,
        testCases: {
          tests: [
            {
              input: [{ name: 'John Doe', email: 'john@example.com', avatar: 'avatar.jpg' }],
              expectedOutput: 'Component renders correctly',
              description: 'Should render user profile with all props',
            },
            {
              input: [{ name: 'Jane Smith', email: 'jane@example.com', avatar: 'jane.jpg' }],
              expectedOutput: 'Component renders correctly',
              description: 'Should render different user data',
            },
          ],
        },
        unitTests: `import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile component', () => {
  const mockProps = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'avatar.jpg'
  };

  test('should render user name', () => {
    render(<UserProfile {...mockProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('should render user email', () => {
    render(<UserProfile {...mockProps} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('should render avatar image', () => {
    render(<UserProfile {...mockProps} />);
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');
  });

  test('should render with different props', () => {
    const differentProps = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'jane.jpg'
    };
    render(<UserProfile {...differentProps} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});`,
        testFramework: 'JEST',
        testTimeout: 10000,
        allowedImports: ['react', '@testing-library/react'],
        memoryLimit: 256,
        timeLimit: 15,
        kiroSpecs: {
          difficulty: 'intermediate',
          concepts: ['react', 'jsx', 'props', 'functional_components', 'destructuring'],
          hints: ['Use destructuring for props', 'Include proper JSX structure', 'Add alt text for accessibility'],
          teaching_approach: 'component_building',
        },
        points: 200,
        badges: ['react_component_creator'],
      },
    }),
  ]);

  console.log(`✅ Created ${challenges.length} challenges with comprehensive tests`);

  // Create enrollments
  console.log('📝 Creating enrollments...');
  const enrollments = await Promise.all([
    prisma.enrollment.create({
      data: {
        userId: users[0].id,
        learningPathId: learningPaths[0].id,
        status: 'ACTIVE',
        progress: 35.5,
        enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    }),
    prisma.enrollment.create({
      data: {
        userId: users[0].id,
        learningPathId: learningPaths[1].id,
        status: 'ACTIVE',
        progress: 15.0,
        enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`✅ Created ${enrollments.length} enrollments`);

  // Create sample code submissions with test results
  console.log('💻 Creating code submissions...');
  const codeSubmissions = await Promise.all([
    prisma.codeSubmission.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[0].id,
        code: `function sum(a, b) {
  return a + b;
}`,
        language: 'JAVASCRIPT',
        status: 'COMPLETED',
        score: 100,
        attempts: 1,
        testResults: {
          success: true,
          testResults: [
            { name: 'Basic addition', passed: true, duration: 2 },
            { name: 'Negative numbers', passed: true, duration: 1 },
            { name: 'Zero values', passed: true, duration: 1 },
            { name: 'Large numbers', passed: true, duration: 2 },
            { name: 'Decimal numbers', passed: true, duration: 1 },
          ],
          executionTime: 7,
          memoryUsage: 45,
        },
        kiroAnalysis: {
          feedback: 'Excellent work! Your solution is clean and efficient.',
          strengths: ['Correct implementation', 'Clean code', 'Handles all test cases'],
          personality: 'encouraging',
          approach: 'detailed_feedback',
        },
        improvements: [],
        codeQuality: { 
          readability: 95, 
          performance: 90, 
          maintainability: 95,
          complexity: 'low',
          bestPractices: 'excellent'
        },
      },
    }),
    prisma.codeSubmission.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[1].id,
        code: `function findMax(numbers) {
  if (numbers.length === 0) {
    return undefined;
  }
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}`,
        language: 'JAVASCRIPT',
        status: 'COMPLETED',
        score: 85,
        attempts: 2,
        testResults: {
          success: true,
          testResults: [
            { name: 'Ascending array', passed: true, duration: 3 },
            { name: 'Descending array', passed: true, duration: 2 },
            { name: 'Negative numbers', passed: true, duration: 2 },
            { name: 'Single element', passed: true, duration: 1 },
            { name: 'Unsorted array', passed: true, duration: 3 },
            { name: 'Empty array', passed: true, duration: 1 },
            { name: 'Duplicates', passed: true, duration: 2 },
            { name: 'Decimal numbers', passed: false, error: 'Expected 2.7, got 2.6999999999999997', duration: 2 },
          ],
          executionTime: 16,
          memoryUsage: 52,
        },
        kiroAnalysis: {
          feedback: 'Good implementation using a manual loop! Consider using Math.max() for cleaner code.',
          strengths: ['Handles edge cases', 'Clear logic', 'Good variable naming'],
          personality: 'constructive',
          approach: 'improvement_focused',
        },
        improvements: [
          'Could use Math.max() for simplicity',
          'Minor floating point precision issue',
          'Consider adding input validation'
        ],
        codeQuality: { 
          readability: 85, 
          performance: 80, 
          maintainability: 85,
          complexity: 'medium',
          bestPractices: 'good'
        },
      },
    }),
    prisma.codeSubmission.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[2].id,
        code: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
        language: 'JAVASCRIPT',
        status: 'COMPLETED',
        score: 100,
        attempts: 1,
        testResults: {
          success: true,
          testResults: [
            { name: 'Simple string', passed: true, duration: 1 },
            { name: 'Mixed case', passed: true, duration: 1 },
            { name: 'Empty string', passed: true, duration: 1 },
            { name: 'Single character', passed: true, duration: 1 },
            { name: 'Numeric string', passed: true, duration: 1 },
            { name: 'With punctuation', passed: true, duration: 2 },
            { name: 'Palindrome', passed: true, duration: 1 },
          ],
          executionTime: 8,
          memoryUsage: 38,
        },
        kiroAnalysis: {
          feedback: 'Perfect! You used the most elegant solution with method chaining.',
          strengths: ['Concise and readable', 'Uses built-in methods effectively', 'Handles all cases'],
          personality: 'enthusiastic',
          approach: 'best_practices_focused',
        },
        improvements: [],
        codeQuality: { 
          readability: 100, 
          performance: 95, 
          maintainability: 100,
          complexity: 'low',
          bestPractices: 'excellent'
        },
      },
    }),
  ]);

  console.log(`✅ Created ${codeSubmissions.length} code submissions`);

  console.log('🎉 Enhanced database seed completed successfully!');
  console.log(`
📊 Summary:
- ${users.length} users created
- ${learningPaths.length} learning paths created
- ${modules.length} modules created
- ${challenges.length} challenges with comprehensive unit tests
- ${enrollments.length} enrollments created
- ${codeSubmissions.length} code submissions with test results
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });