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

export const getAvailableLearningPaths = actionClient.inputSchema(
  z.object({
    category: z.enum([
      'FRONTEND',
      'BACKEND',
      'FULLSTACK',
      'DEVOPS',
      'MOBILE',
      'CYBERSECURITY',
      'DATA_SCIENCE'
    ]).optional(),
    difficulty: z.enum([
      'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
    ]).optional(),
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(12),
  })
).action(async ({parsedInput}) => {
  try {
    const whereClause = {
      ...(parsedInput.category && { category: parsedInput.category }),
      ...(parsedInput.difficulty && { difficulty: parsedInput.difficulty }),
        OR: [
          {title: {
            contains: parsedInput.search,
            mode: 'insensitive' as const,
          }},
          {description: {
            contains: parsedInput.search,
            mode: 'insensitive' as const,
          }},
        ]
    };

    // Get total count for pagination
    const totalCount = await prisma.learningPath.count({
      where: whereClause
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
        }
      },
      message: 'Learning paths fetched successfully',
      error: null
    };
  } catch (error) {
    console.error('Error fetcailable learning paths:', error);
    return {
      data: null,
      message: 'Failed to fetch learning paths',
      error
    };
  }
})
