import { prisma } from '@/lib/prisma';

async function main() {
  console.log('🌱 Starting database seed...');

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
  // await prisma.session.deleteMany();
  // await prisma.account.deleteMany();
  // await prisma.verification.deleteMany();
  // await prisma.user.deleteMany();
  console.log('❌ All data deleted.');

  // Create sample users
  console.log('👤 Creating sample users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        emailVerified: true,
        image:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        profile: {
          create: {
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Passionate developer learning new technologies',
            currentLevel: 'INTERMEDIATE',
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
        learningProfile: {
          create: {
            learningStyle: 'VISUAL',
            pace: 'NORMAL',
            complexity: 'INTERMEDIATE',
            focusTime: 45,
            errorPatterns: {
              common: ['syntax_errors', 'logic_errors'],
              frequency: { syntax_errors: 15, logic_errors: 8 },
            },
            strengths: ['problem_solving', 'debugging'],
            weaknesses: ['algorithms', 'system_design'],
            kiroPersonality: {
              tone: 'encouraging',
              style: 'detailed',
              patience: 'high',
            },
            adaptations: {
              codeExamples: 'verbose',
              explanations: 'step_by_step',
            },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_2',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        emailVerified: true,
        image:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        profile: {
          create: {
            firstName: 'Jane',
            lastName: 'Smith',
            bio: 'Full-stack developer with a passion for clean code',
            currentLevel: 'ADVANCED',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
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
        description:
          'Master the basics of JavaScript programming from variables to functions and beyond.',
        category: 'FRONTEND',
        difficulty: 'BEGINNER',
        estimatedHours: 40,
        totalEnrollments: 1250,
        averageRating: 4.7,
        curriculum: {
          overview: 'Complete JavaScript fundamentals course',
          objectives: [
            'Variables and data types',
            'Functions',
            'Objects and arrays',
            'DOM manipulation',
          ],
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
        description:
          'Build modern web applications with React, hooks, and state management.',
        category: 'FRONTEND',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 60,
        totalEnrollments: 890,
        averageRating: 4.8,
        curriculum: {
          overview: 'Comprehensive React development course',
          objectives: [
            'Components and JSX',
            'Hooks and state',
            'Context API',
            'Testing',
          ],
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
    prisma.learningPath.create({
      data: {
        title: 'Node.js Backend Development',
        description:
          'Create scalable backend applications with Node.js, Express, and databases.',
        category: 'BACKEND',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 55,
        totalEnrollments: 720,
        averageRating: 4.6,
        curriculum: {
          overview: 'Complete backend development with Node.js',
          objectives: [
            'Express.js',
            'Database integration',
            'Authentication',
            'API design',
          ],
          prerequisites: ['JavaScript fundamentals', 'Basic web concepts'],
        },
        prerequisites: [],
        learningObjectives: [
          'Build REST APIs with Express.js',
          'Integrate with databases',
          'Implement authentication and authorization',
          'Deploy Node.js applications',
        ],
        kiroPrompts: {
          personality: 'technical_expert',
          adaptations: ['architecture_focused', 'best_practices'],
        },
      },
    }),
    prisma.learningPath.create({
      data: {
        title: 'Full Stack Web Development',
        description:
          'Complete full-stack development course covering frontend, backend, and deployment.',
        category: 'FULLSTACK',
        difficulty: 'ADVANCED',
        estimatedHours: 120,
        totalEnrollments: 450,
        averageRating: 4.9,
        curriculum: {
          overview: 'End-to-end web development mastery',
          objectives: [
            'Frontend frameworks',
            'Backend APIs',
            'Databases',
            'DevOps',
          ],
          prerequisites: [
            'JavaScript fundamentals',
            'Basic programming concepts',
          ],
        },
        prerequisites: [],
        learningObjectives: [
          'Build complete web applications',
          'Integrate frontend and backend',
          'Manage databases and data flow',
          'Deploy and maintain applications',
        ],
        kiroPrompts: {
          personality: 'comprehensive_guide',
          adaptations: ['project_portfolio', 'industry_standards'],
        },
      },
    }),
    prisma.learningPath.create({
      data: {
        title: 'Python for Data Science',
        description:
          'Learn Python programming for data analysis, visualization, and machine learning.',
        category: 'DATA_SCIENCE',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 80,
        totalEnrollments: 650,
        averageRating: 4.5,
        curriculum: {
          overview: 'Python data science fundamentals',
          objectives: [
            'NumPy and Pandas',
            'Data visualization',
            'Machine learning basics',
            'Statistical analysis',
          ],
          prerequisites: [
            'Basic programming knowledge',
            'Mathematics fundamentals',
          ],
        },
        prerequisites: [],
        learningObjectives: [
          'Manipulate data with Pandas',
          'Create visualizations',
          'Build machine learning models',
          'Perform statistical analysis',
        ],
        kiroPrompts: {
          personality: 'data_scientist',
          adaptations: ['math_heavy', 'practical_examples'],
        },
      },
    }),
    prisma.learningPath.create({
      data: {
        title: 'Mobile App Development with React Native',
        description:
          'Build cross-platform mobile applications using React Native and modern tools.',
        category: 'MOBILE',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 70,
        totalEnrollments: 380,
        averageRating: 4.4,
        curriculum: {
          overview: 'Cross-platform mobile development',
          objectives: [
            'React Native basics',
            'Navigation',
            'Native modules',
            'App store deployment',
          ],
          prerequisites: ['React fundamentals', 'JavaScript proficiency'],
        },
        prerequisites: [],
        learningObjectives: [
          'Build mobile apps with React Native',
          'Implement navigation and state management',
          'Access device features',
          'Deploy to app stores',
        ],
        kiroPrompts: {
          personality: 'mobile_expert',
          adaptations: ['device_specific', 'platform_differences'],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${learningPaths.length} learning paths`);

  // Create modules for each learning path
  console.log('📖 Creating modules...');
  const modules = [];

  // JavaScript Fundamentals modules
  const jsModules = await Promise.all([
    prisma.module.create({
      data: {
        title: 'Variables and Data Types',
        description:
          'Learn about JavaScript variables, primitive types, and type conversion.',
        order: 1,
        type: 'THEORY',
        learningPathId: learningPaths[0].id,
        estimatedTime: 120,
        difficulty: 'BEGINNER',
        skills: ['variables', 'data_types', 'type_conversion'],
        content: {
          theory: 'JavaScript variables and data types explanation',
          examples: [
            'let vs const',
            'string manipulation',
            'number operations',
          ],
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
        description:
          'Master JavaScript functions, parameters, return values, and scope.',
        order: 2,
        type: 'PRACTICE',
        learningPathId: learningPaths[0].id,
        estimatedTime: 180,
        difficulty: 'BEGINNER',
        skills: ['functions', 'scope', 'closures'],
        content: {
          theory: 'Functions and scope in JavaScript',
          examples: [
            'function declarations',
            'arrow functions',
            'closure examples',
          ],
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
        title: 'Objects and Arrays',
        description: 'Work with JavaScript objects, arrays, and their methods.',
        order: 3,
        type: 'PRACTICE',
        learningPathId: learningPaths[0].id,
        estimatedTime: 150,
        difficulty: 'BEGINNER',
        skills: ['objects', 'arrays', 'methods'],
        content: {
          theory: 'Objects and arrays in JavaScript',
          examples: ['object creation', 'array methods', 'destructuring'],
          exercises: ['object_manipulation', 'array_operations'],
        },
        kiroInstructions: {
          teaching_style: 'example_driven',
          emphasis: ['real_world_usage', 'best_practices'],
        },
      },
    }),
  ]);

  modules.push(...jsModules);

  // React Development modules
  const reactModules = await Promise.all([
    prisma.module.create({
      data: {
        title: 'React Components and JSX',
        description: 'Learn to create React components using JSX syntax.',
        order: 1,
        type: 'THEORY',
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
    prisma.module.create({
      data: {
        title: 'State and Hooks',
        description: 'Master React state management with hooks.',
        order: 2,
        type: 'PRACTICE',
        learningPathId: learningPaths[1].id,
        estimatedTime: 240,
        difficulty: 'INTERMEDIATE',
        skills: ['hooks', 'state', 'effects'],
        content: {
          theory: 'React hooks and state management',
          examples: ['useState', 'useEffect', 'custom hooks'],
          exercises: ['state_management', 'effect_handling'],
        },
        kiroInstructions: {
          teaching_style: 'hook_focused',
          emphasis: ['state_patterns', 'performance'],
        },
      },
    }),
  ]);

  modules.push(...reactModules);

  console.log(`✅ Created ${modules.length} modules`);

  // Create challenges for modules
  console.log('🎯 Creating challenges...');
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: 'Variable Declaration Challenge',
        description: 'Practice declaring and using variables in JavaScript.',
        type: 'CODING',
        moduleId: jsModules[0].id,
        requirements: {
          task: 'Create variables of different types and display them',
          constraints: [
            'Use let and const appropriately',
            'Include all primitive types',
          ],
        },
        startingCode:
          '// Declare your variables here\n\n// Display the values\nconsole.log(/* your variables */);',
        solution:
          'const name = "John";\nlet age = 25;\nconst isStudent = true;\nlet score = null;\nlet data;\n\nconsole.log(name, age, isStudent, score, data);',
        testCases: {
          tests: [
            {
              input: '',
              expected: 'John 25 true null undefined',
              description: 'All variable types',
            },
          ],
        },
        kiroSpecs: {
          difficulty: 'beginner',
          concepts: ['variables', 'data_types', 'console_output'],
          hints: [
            'Use different variable declarations',
            'Include all primitive types',
          ],
          teaching_approach: 'step_by_step',
        },
        points: 100,
        badges: ['first_variables'],
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Function Creation Challenge',
        description:
          'Create and use functions with different parameter patterns.',
        type: 'CODING',
        moduleId: jsModules[1].id,
        requirements: {
          task: 'Create functions with various parameter patterns',
          constraints: [
            'Use both function declarations and arrow functions',
            'Include default parameters',
          ],
        },
        startingCode:
          '// Create your functions here\n\n// Test your functions\nconsole.log(/* function calls */);',
        solution:
          'function greet(name = "World") {\n  return `Hello, ${name}!`;\n}\n\nconst add = (a, b) => a + b;\n\nconsole.log(greet(), greet("Alice"), add(5, 3));',
        testCases: {
          tests: [
            {
              input: '',
              expected: 'Hello, World! Hello, Alice! 8',
              description: 'Function calls work correctly',
            },
          ],
        },
        kiroSpecs: {
          difficulty: 'intermediate',
          concepts: ['functions', 'arrow_functions', 'default_parameters'],
          hints: [
            'Try both function declaration and arrow function syntax',
            'Use default parameters',
          ],
          teaching_approach: 'hands_on_practice',
        },
        points: 150,
        badges: ['function_master'],
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'React Component Challenge',
        description: 'Create a React component that displays user information.',
        type: 'CODING',
        moduleId: reactModules[0].id,
        requirements: {
          task: 'Create a UserCard component that displays user info',
          constraints: [
            'Use functional component',
            'Accept props',
            'Use JSX properly',
          ],
        },
        startingCode:
          'import React from "react";\n\n// Create your UserCard component here\n\nexport default UserCard;',
        solution:
          'import React from "react";\n\nfunction UserCard({ name, email, role }) {\n  return (\n    <div className="user-card">\n      <h2>{name}</h2>\n      <p>Email: {email}</p>\n      <p>Role: {role}</p>\n    </div>\n  );\n}\n\nexport default UserCard;',
        testCases: {
          tests: [
            {
              input:
                '{ name: "John", email: "john@example.com", role: "Developer" }',
              expected: 'Component renders correctly',
              description: 'UserCard displays all props',
            },
          ],
        },
        kiroSpecs: {
          difficulty: 'intermediate',
          concepts: ['react', 'jsx', 'props', 'functional_components'],
          hints: [
            'Use destructuring for props',
            'Remember to export the component',
          ],
          teaching_approach: 'component_focused',
        },
        points: 200,
        badges: ['react_beginner'],
      },
    }),
  ]);

  console.log(`✅ Created ${challenges.length} challenges`);

  // Create code examples
  console.log('💻 Creating code examples...');
  const codeExamples = await Promise.all([
    prisma.codeExample.create({
      data: {
        moduleId: jsModules[0].id,
        title: 'Variable Declaration Examples',
        description: 'Different ways to declare variables in JavaScript',
        code: 'let name = "John";          // Mutable variable\nconst age = 25;            // Immutable variable\nvar oldStyle = "legacy";   // Old-style declaration\n\n// Template literals\nconst greeting = `Hello, ${name}! You are ${age} years old.`;\nconsole.log(greeting);',
        language: 'JAVASCRIPT',
        explanation:
          'This example shows the three ways to declare variables in JavaScript and demonstrates template literal usage.',
        difficulty: 'BEGINNER',
        tags: ['variables', 'const', 'let', 'template-literals'],
        order: 1,
      },
    }),
    prisma.codeExample.create({
      data: {
        moduleId: jsModules[1].id,
        title: 'Function Examples',
        description: 'Different function syntax patterns in JavaScript',
        code: '// Function declaration\nfunction add(a, b) {\n  return a + b;\n}\n\n// Arrow function\nconst multiply = (a, b) => a * b;\n\n// Function with default parameters\nfunction greet(name = "World") {\n  return `Hello, ${name}!`;\n}\n\n// Higher-order function\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\n\nconsole.log(add(5, 3));        // 8\nconsole.log(multiply(4, 6));   // 24\nconsole.log(greet());          // Hello, World!\nconsole.log(doubled);          // [2, 4, 6, 8, 10]',
        language: 'JAVASCRIPT',
        explanation:
          'This example demonstrates various function syntax patterns including declarations, arrow functions, default parameters, and higher-order functions.',
        difficulty: 'BEGINNER',
        tags: [
          'functions',
          'arrow-functions',
          'default-parameters',
          'higher-order',
        ],
        order: 1,
      },
    }),
  ]);

  console.log(`✅ Created ${codeExamples.length} code examples`);

  // Create enrollments for users
  console.log('📝 Creating enrollments...');
  const enrollments = await Promise.all([
    prisma.enrollment.create({
      data: {
        userId: users[0].id,
        learningPathId: learningPaths[0].id,
        status: 'ACTIVE',
        progress: 35.5,
        enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
    prisma.enrollment.create({
      data: {
        userId: users[0].id,
        learningPathId: learningPaths[1].id,
        status: 'ACTIVE',
        progress: 15.0,
        enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        lastAccessedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.enrollment.create({
      data: {
        userId: users[1].id,
        learningPathId: learningPaths[2].id,
        status: 'ACTIVE',
        progress: 60.0,
        enrolledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        lastAccessedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    }),
  ]);

  console.log(`✅ Created ${enrollments.length} enrollments`);

  // Create module progress
  console.log('📊 Creating module progress...');
  const moduleProgress = await Promise.all([
    // User 1 progress in JavaScript Fundamentals
    prisma.moduleProgress.create({
      data: {
        userId: users[0].id,
        moduleId: jsModules[0].id,
        status: 'COMPLETED',
        completionRate: 100.0,
        timeSpent: 150,
        startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.moduleProgress.create({
      data: {
        userId: users[0].id,
        moduleId: jsModules[1].id,
        status: 'IN_PROGRESS',
        completionRate: 65.0,
        timeSpent: 120,
        startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    }),
    // User 2 progress in Node.js Backend
    prisma.moduleProgress.create({
      data: {
        userId: users[1].id,
        moduleId: reactModules[0].id,
        status: 'COMPLETED',
        completionRate: 100.0,
        timeSpent: 200,
        startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`✅ Created ${moduleProgress.length} module progress records`);

  // Create some exercises
  console.log('♻ Creating sample exercises...');
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        title: 'Hello World in JavaScript',
        description:
          'Write your first JavaScript program that prints "Hello, World!" to the console.',
        type: 'CODING',
        difficulty: 1,
        content: {
          instructions:
            'Create a function that prints "Hello, World!" to the console.',
          startingCode:
            '// Write your code here\nfunction helloWorld() {\n  \n}',
          expectedSolution:
            'function helloWorld() {\n  console.log("Hello, World!");\n}',
          testCases: [
            {
              id: 'test1',
              input: null,
              expectedOutput: 'Hello, World!',
              description: 'Should print Hello, World!',
            },
          ],
          hints: [
            {
              id: 'hint1',
              content: 'Use console.log() to print to the console',
              order: 1,
            },
            {
              id: 'hint2',
              content: 'Remember to include the exact text "Hello, World!"',
              order: 2,
            },
          ],
        },
      },
    }),
    prisma.exercise.create({
      data: {
        title: 'Variables and Data Types',
        description: 'Learn about JavaScript variables and basic data types.',
        type: 'CODING',
        difficulty: 2,
        content: {
          instructions:
            'Create variables of different data types and display their values.',
          startingCode:
            '// Create variables here\nlet name;\nlet age;\nlet isStudent;\n\n// Display the values\nconsole.log(name, age, isStudent);',
          expectedSolution:
            'let name = "John";\nlet age = 25;\nlet isStudent = true;\n\nconsole.log(name, age, isStudent);',
          testCases: [
            {
              id: 'test1',
              input: null,
              expectedOutput: 'John 25 true',
              description: 'Should display string, number, and boolean values',
            },
          ],
          hints: [
            {
              id: 'hint1',
              content: 'Assign a string value to the name variable',
              order: 1,
            },
            {
              id: 'hint2',
              content: 'Assign a number value to the age variable',
              order: 2,
            },
            {
              id: 'hint3',
              content: 'Assign a boolean value to the isStudent variable',
              order: 3,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${exercises.length} sample exercises`);

  // Create user progress for exercises
  console.log('📈 Creating user progress...');
  const userProgress = await Promise.all([
    prisma.userProgress.create({
      data: {
        userId: users[0].id,
        exerciseId: exercises[0].id,
        status: 'COMPLETED',
        attempts: 2,
        timeSpent: 300,
        masteryScore: 95.0,
        lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: users[0].id,
        exerciseId: exercises[1].id,
        status: 'IN_PROGRESS',
        attempts: 1,
        timeSpent: 180,
        masteryScore: 70.0,
        lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`✅ Created ${userProgress.length} user progress records`);

  // Create achievements
  console.log('🏆 Creating achievements...');
  const achievements = await Promise.all([
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        type: 'COMPLETION',
        title: 'First Steps',
        description: 'Completed your first exercise',
        badgeUrl: '/badges/first-steps.svg',
        points: 100,
        relatedId: exercises[0].id,
        metadata: {
          exerciseTitle: exercises[0].title,
          completionTime: '5 minutes',
        },
      },
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        type: 'STREAK',
        title: 'Learning Streak',
        description: 'Practiced for 3 days in a row',
        badgeUrl: '/badges/streak-3.svg',
        points: 150,
        metadata: {
          streakDays: 3,
          category: 'consistency',
        },
      },
    }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  console.log('🎉 Database seed completed successfully!');
  console.log(`
📊 Summary:
- Users: ${users.length}
- Learning Paths: ${learningPaths.length}
- Modules: ${modules.length}
- Challenges: ${challenges.length}
- Code Examples: ${codeExamples.length}
- Enrollments: ${enrollments.length}
- Module Progress: ${moduleProgress.length}
- Exercises: ${exercises.length}
- User Progress: ${userProgress.length}
- Achievements: ${achievements.length}
  `);
}

main()
  .catch(e => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
