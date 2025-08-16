'use server';

import { authServer, getServerSession } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import { actionClient } from '@/lib/safe-action';
import { headers } from 'next/headers';
import z from 'zod';

export interface CurrentLearningPathData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  currentModule?: {
    id: string;
    title: string;
    description: string;
    order: number;
  };
  enrollment: {
    progress: number;
    status: string;
    lastAccessedAt: Date;
  };
  totalModules: number;
  completedModules: number;
}

export async function getCurrentLearningPath(): Promise<CurrentLearningPathData | null> {
  try {
    // Get current session
    const session = await getServerSession();

    if (!session?.user?.id) {
      return null;
    }

    // Find the most recent active enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        learningPath: {
          include: {
            modules: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });

    if (!enrollment) {
      return null;
    }

    // Get module progress for this user
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: {
        userId: session.user.id,
        module: {
          learningPathId: enrollment.learningPathId,
        },
      },
      include: {
        module: true,
      },
    });

    // Find current module (first incomplete module)
    const currentModule = enrollment.learningPath.modules.find(module => {
      const progress = moduleProgress.find(mp => mp.moduleId === module.id);
      return !progress || progress.status !== 'COMPLETED';
    });

    // Calculate completed modules
    const completedModules = moduleProgress.filter(
      mp => mp.status === 'COMPLETED'
    ).length;
    const totalModules = enrollment.learningPath.modules.length;

    return {
      id: enrollment.learningPath.id,
      title: enrollment.learningPath.title,
      description: enrollment.learningPath.description,
      category: enrollment.learningPath.category,
      difficulty: enrollment.learningPath.difficulty,
      currentModule: currentModule
        ? {
            id: currentModule.id,
            title: currentModule.title,
            description: currentModule.description,
            order: currentModule.order,
          }
        : undefined,
      enrollment: {
        progress: enrollment.progress,
        status: enrollment.status,
        lastAccessedAt: enrollment.lastAccessedAt,
      },
      totalModules,
      completedModules,
    };
  } catch (error) {
    console.error('Error fetching current learning path:', error);
    return null;
  }
}

export async function updateLearningPathProgress(
  learningPathId: string,
  moduleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await authServer.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Update last accessed time for enrollment
    await prisma.enrollment.updateMany({
      where: {
        userId: session.user.id,
        learningPathId: learningPathId,
      },
      data: {
        lastAccessedAt: new Date(),
      },
    });

    // Update or create module progress
    await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId: moduleId,
        },
      },
      update: {
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        moduleId: moduleId,
        status: 'IN_PROGRESS',
        lastAccessedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating learning path progress:', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export const getAvailableLearningPaths = actionClient
  .inputSchema(
    z.object({
      category: z
        .enum([
          'FRONTEND',
          'BACKEND',
          'FULLSTACK',
          'DEVOPS',
          'MOBILE',
          'CYBERSECURITY',
          'DATA_SCIENCE',
        ])
        .optional(),
      difficulty: z
        .enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
        .optional(),
      search: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(12),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const whereClause = {
        ...(parsedInput.category && { category: parsedInput.category }),
        ...(parsedInput.difficulty && { difficulty: parsedInput.difficulty }),
        OR: [
          {
            title: {
              contains: parsedInput.search,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: parsedInput.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      };

      // Get total count for pagination
      const totalCount = await prisma.learningPath.count({
        where: whereClause,
      });

      // Calculate pagination
      const skip = (parsedInput.page - 1) * parsedInput.limit;
      const totalPages = Math.ceil(totalCount / parsedInput.limit);

      const learningPaths = await prisma.learningPath.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          enrollments: {
            select: {
              userId: true,
            },
          },
          estimatedHours: true,
          totalEnrollments: true,
          averageRating: true,
        },
        orderBy: [{ totalEnrollments: 'desc' }, { title: 'asc' }],
        skip,
        take: parsedInput.limit,
      });

      return {
        data: {
          learningPaths,
          pagination: {
            currentPage: parsedInput.page,
            totalPages,
            totalCount,
            limit: parsedInput.limit,
            hasNextPage: parsedInput.page < totalPages,
            hasPreviousPage: parsedInput.page > 1,
          },
        },
        message: 'Learning paths fetched successfully',
        error: null,
      };
    } catch (error) {
      console.error('Error fetching available learning paths:', error);
      return {
        data: null,
        message: 'Failed to fetch learning paths',
        error,
      };
    }
  });

export const getLearningPathById = actionClient
  .inputSchema(
    z.object({
      pathId: z.cuid('Invalid pathID'),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      if (!prisma) {
        console.error('Prisma instance is undefined');
        return null;
      }

      const learningPath = await prisma.learningPath.findUnique({
        where: {
          id: parsedInput.pathId,
        },
        include: {
          modules: {
            orderBy: {
              order: 'asc',
            },
            include: {
              challenges: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  points: true,
                },
              },
              codeExamples: {
                select: {
                  id: true,
                  title: true,
                  language: true,
                  difficulty: true,
                },
              },
            },
          },
          enrollments: {
            select: {
              id: true,
              userId: true,
              status: true,
              progress: true,
              enrolledAt: true,
              lastAccessedAt: true,
            },
          },
        },
      });

      if (!learningPath) {
        return null;
      }

      // Calculate some statistics
      const totalChallenges = learningPath.modules.reduce(
        (acc, module) => acc + module.challenges.length,
        0
      );

      const totalCodeExamples = learningPath.modules.reduce(
        (acc, module) => acc + module.codeExamples.length,
        0
      );

      return {
        ...learningPath,
        stats: {
          totalModules: learningPath.modules.length,
          totalChallenges,
          totalCodeExamples,
          activeEnrollments: learningPath.enrollments.filter(
            e => e.status === 'ACTIVE'
          ).length,
        },
      };
    } catch (error) {
      console.error('Error fetching learning path:', error);
      return null;
    }
  });

export const enrollInLearningPath = actionClient
  .inputSchema(
    z.object({
      pathId: z.cuid('Invalid pathID'),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      if (!prisma) {
        console.error('Prisma instance is undefined');
        throw new Error('Database connection error');
      }

      // Check if user is already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_learningPathId: {
            userId: session.user.id,
            learningPathId: parsedInput.pathId,
          },
        },
      });

      if (existingEnrollment) {
        if (existingEnrollment.status === 'ACTIVE') {
          return {
            success: false,
            message: 'Already enrolled in this learning path',
          };
        } else {
          // Reactivate enrollment
          const enr = await prisma.enrollment.update({
            where: {
              id: existingEnrollment.id,
            },
            data: {
              status: 'ACTIVE',
              lastAccessedAt: new Date(),
            },
          });
          return {
            data: enr,
            success: true,
            message: 'Enrollment reactivated successfully',
          };
        }
      }

      // Create new enrollment
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          learningPathId: parsedInput.pathId,
          status: 'ACTIVE',
          progress: 0,
          enrolledAt: new Date(),
          lastAccessedAt: new Date(),
        },
      });

      // Update total enrollments count
      await prisma.learningPath.update({
        where: {
          id: parsedInput.pathId,
        },
        data: {
          totalEnrollments: {
            increment: 1,
          },
        },
      });

      return {
        success: true,
        message: 'Successfully enrolled in learning path',
      };
    } catch (error) {
      console.error('Error enrolling in learning path:', error);
      return { success: false, message: 'Failed to enroll in learning path' };
    }
  });

export const getModuleById = actionClient
  .inputSchema(
    z.object({
      moduleId: z.cuid('Module ID is invalid'),
      pathId: z.cuid("Path ID is not valid")
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      if (!prisma) {
        console.error('Prisma instance is undefined');
        return null;
      }

      const [module, modulesList] = await Promise.allSettled([
        prisma.module.findUnique({
          where: {
            id: parsedInput.moduleId,
          },
          include: {
            learningPath: {
              select: {
                id: true,
                title: true,
                category: true,
                difficulty: true,
              },
            },
            challenges: {
              orderBy: {
                createdAt: 'asc',
              },
            },
            codeExamples: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        }),
        prisma.learningPath.findUnique({
          where: {
            id: parsedInput.pathId,
          },
          select: {
            id: true,
            modules: {
              orderBy: {
                order: 'asc',
              },
              select: {
                id: true
              }
            },
          },
        }),
      ])

      if (module.status === "rejected" || !module.value) {
        return null;
      }

      // Check if user is enrolled in the learning path
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_learningPathId: {
            userId: session.user.id,
            learningPathId: parsedInput.pathId,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'ACTIVE') {
        throw new Error('Not enrolled in this learning path');
      }

      // Get user's progress for this module
      const moduleProgress = await prisma.moduleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: session.user.id,
            moduleId: parsedInput.moduleId,
          },
        },
      });

      return {
        ...module.value,
        userProgress: moduleProgress,
        isEnrolled: true,
        modulesList: modulesList.status === "fulfilled" ? modulesList.value?.modules.map((m) => m.id) : [module.value.id]
      };
    } catch (error) {
      console.error('Error fetching module:', error);
      return null;
    }
  });

export const getChallengeById = actionClient
  .inputSchema(
    z.object({
      challengeId: z.cuid('Challenge ID is required'),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      if (!prisma) {
        console.error('Prisma instance is undefined');
        return null;
      }

      const challenge = await prisma.challenge.findUnique({
        where: {
          id: parsedInput.challengeId,
        },
        include: {
          module: {
            include: {
              learningPath: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          submissions: {
            where: {
              userId: session.user.id,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      if (!challenge) {
        return null;
      }

      // Check if user is enrolled in the learning path
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_learningPathId: {
            userId: session.user.id,
            learningPathId: challenge.module.learningPath.id,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'ACTIVE') {
        throw new Error('Not enrolled in this learning path');
      }

      return {
        ...challenge,
        latestSubmission: challenge.submissions[0] || null,
        isEnrolled: true,
      };
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return null;
    }
  });

export const submitChallenge = actionClient
  .inputSchema(
    z.object({
      challengeId: z.string().min(1, 'Challenge ID is required'),
      code: z.string().min(1, 'Code is required'),
      language: z.enum([
        'JAVASCRIPT',
        'TYPESCRIPT',
        'PYTHON',
        'JAVA',
        'CPP',
        'RUST',
        'GO',
      ]),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      if (!prisma) {
        console.error('Prisma instance is undefined');
        throw new Error('Database connection error');
      }

      // Get challenge details
      const challenge = await prisma.challenge.findUnique({
        where: {
          id: parsedInput.challengeId,
        },
        include: {
          module: {
            include: {
              learningPath: true,
            },
          },
        },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Check enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_learningPathId: {
            userId: session.user.id,
            learningPathId: challenge.module.learningPath.id,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'ACTIVE') {
        throw new Error('Not enrolled in this learning path');
      }

      // Get previous attempts count
      const previousAttempts = await prisma.codeSubmission.count({
        where: {
          userId: session.user.id,
          challengeId: parsedInput.challengeId,
        },
      });

      // Create submission
      const submission = await prisma.codeSubmission.create({
        data: {
          userId: session.user.id,
          challengeId: parsedInput.challengeId,
          code: parsedInput.code,
          language: parsedInput.language,
          status: 'PENDING',
          attempts: previousAttempts + 1,
          kiroAnalysis: {
            feedback: 'Code submitted successfully. Analysis in progress...',
            score: null,
            improvements: [],
          },
          improvements: {
            suggestions: [],
            priority: 'low',
            categories: [],
          },
          codeQuality: {
            readability: 0,
            performance: 0,
            maintainability: 0,
            overall: 0,
          },
          testResults: {
            passed: 0,
            total: 0,
            results: [],
          },
        },
      });

      // TODO: Here you would typically run the code against test cases
      // For now, we'll simulate a basic analysis
      const mockScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      const passed = mockScore >= 70;

      // Update submission with results
      await prisma.codeSubmission.update({
        where: {
          id: submission.id,
        },
        data: {
          status: 'COMPLETED',
          score: mockScore,
          kiroAnalysis: {
            feedback: passed
              ? 'Great job! Your solution works correctly.'
              : 'Your solution needs some improvements. Check the test cases.',
            score: mockScore,
            improvements: passed
              ? []
              : ['Consider edge cases', 'Optimize for performance'],
          },
          improvements: {
            suggestions: passed
              ? []
              : [
                  'Consider edge cases in your solution',
                  'Optimize for better performance',
                  'Add input validation',
                ],
            priority: passed ? 'low' : 'medium',
            categories: passed ? [] : ['logic', 'performance', 'validation'],
          },
          codeQuality: {
            readability: Math.floor(Math.random() * 30) + 70, // 70-100
            performance: Math.floor(Math.random() * 40) + (passed ? 60 : 40), // Variable based on pass
            maintainability: Math.floor(Math.random() * 30) + 65, // 65-95
            overall: mockScore,
          },
          testResults: {
            passed: passed ? 3 : 1,
            total: 3,
            results: [
              { test: 'Basic functionality', passed: true },
              { test: 'Edge cases', passed },
              { test: 'Performance', passed },
            ],
          },
        },
      });

      return {
        success: true,
        submissionId: submission.id,
        score: mockScore,
        passed,
        message: passed
          ? 'Challenge completed successfully!'
          : 'Keep trying! You can do better.',
      };
    } catch (error) {
      console.error('Error submitting challenge:', error);
      return {
        success: false,
        message: 'Failed to submit challenge',
      };
    }
  });

export const updateModuleProgress = actionClient
  .inputSchema(
    z.object({
      moduleId: z.cuid("Module ID is not valid").optional(),
      challengeId: z.cuid('Module ID is not valid').optional(),
      status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
      completionRate: z.number().min(0).max(100).optional(),
      timeSpent: z.number().min(0).optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      if (!prisma) {
        console.error('Prisma instance is undefined');
        throw new Error('Database connection error');
      }

      if(!parsedInput.moduleId && parsedInput.challengeId){
        console.error('Invalid request, ID not found');
        throw new Error('Invalid request, ID not found');
      }


      const module = await prisma.module.findFirst({
        where: {
          OR: [
            {
              challenges: {
                some: {
                  id: parsedInput.challengeId
                }
              }
            },
            {
              id: parsedInput.moduleId
            }
          ]
        },
        select: {
          id: true
        }
      })

      if (!module) {
        console.error('Module not found instance is undefined');
        throw new Error('Module not found error');
      }

      // Update or create module progress
      const moduleProgress = await prisma.moduleProgress.upsert({
        where: {
          userId_moduleId: {
            userId: session.user.id,
            moduleId: module.id,
          },
        },
        update: {
          ...(parsedInput.status && { status: parsedInput.status }),
          ...(parsedInput.completionRate !== undefined && {
            completionRate: parsedInput.completionRate,
          }),
          ...(parsedInput.timeSpent !== undefined && {
            timeSpent: { increment: parsedInput.timeSpent },
          }),
          lastAccessedAt: new Date(),
          ...(parsedInput.status === 'COMPLETED' && {
            completedAt: new Date(),
          }),
        },
        create: {
          userId: session.user.id,
          moduleId: module.id,
          status: parsedInput.status || 'IN_PROGRESS',
          completionRate: parsedInput.completionRate || 0,
          timeSpent: parsedInput.timeSpent || 0,
          lastAccessedAt: new Date(),
          ...(parsedInput.status === 'IN_PROGRESS' && {
            startedAt: new Date(),
          }),
          ...(parsedInput.status === 'COMPLETED' && {
            startedAt: new Date(),
            completedAt: new Date(),
          }),
        },
      });

      return {
        success: true,
        moduleProgress,
      };
    } catch (error) {
      console.error('Error updating module progress:', error);
      return {
        success: false,
        message: 'Failed to update progress',
      };
    }
  });

