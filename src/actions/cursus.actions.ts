'use server';

import { authServer, getServerSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

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
    const session = await getServerSession()

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

export async function getAvailableLearningPaths() {
  try {
    const learningPaths = await prisma.learningPath.findMany({
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
    });

    return learningPaths;
  } catch (error) {
    console.error('Error fetching available learning paths:', error);
    return [];
  }
}
