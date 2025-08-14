import { prisma } from "@/lib/prisma";

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample exercises
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        title: 'Hello World in JavaScript',
        description: 'Write your first JavaScript program that prints "Hello, World!" to the console.',
        type: 'coding',
        difficulty: 1,
        content: {
          instructions: 'Create a function that prints "Hello, World!" to the console.',
          startingCode: '// Write your code here\nfunction helloWorld() {\n  \n}',
          expectedSolution: 'function helloWorld() {\n  console.log("Hello, World!");\n}',
          testCases: [
            {
              id: 'test1',
              input: null,
              expectedOutput: 'Hello, World!',
              description: 'Should print Hello, World!'
            }
          ],
          hints: [
            {
              id: 'hint1',
              content: 'Use console.log() to print to the console',
              order: 1
            },
            {
              id: 'hint2',
              content: 'Remember to include the exact text "Hello, World!"',
              order: 2
            }
          ]
        }
      }
    }),
    prisma.exercise.create({
      data: {
        title: 'Variables and Data Types',
        description: 'Learn about JavaScript variables and basic data types.',
        type: 'coding',
        difficulty: 2,
        content: {
          instructions: 'Create variables of different data types and display their values.',
          startingCode: '// Create variables here\nlet name;\nlet age;\nlet isStudent;\n\n// Display the values\nconsole.log(name, age, isStudent);',
          expectedSolution: 'let name = "John";\nlet age = 25;\nlet isStudent = true;\n\nconsole.log(name, age, isStudent);',
          testCases: [
            {
              id: 'test1',
              input: null,
              expectedOutput: 'John 25 true',
              description: 'Should display string, number, and boolean values'
            }
          ],
          hints: [
            {
              id: 'hint1',
              content: 'Assign a string value to the name variable',
              order: 1
            },
            {
              id: 'hint2',
              content: 'Assign a number value to the age variable',
              order: 2
            },
            {
              id: 'hint3',
              content: 'Assign a boolean value to the isStudent variable',
              order: 3
            }
          ]
        }
      }
    })
  ]);

  console.log(`✅ Created ${exercises.length} sample exercises`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });