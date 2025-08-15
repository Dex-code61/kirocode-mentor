
import { Category, Difficulty } from '@prisma/client';

export { Category, Difficulty };

export type learningPathSearchParams = {
    category?: Category,
    difficulty?: Difficulty,
    search?: string,
    page?: number,
    limit?: number
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    category: Category;
    difficulty: Difficulty;
    estimatedHours: number;
    totalEnrollments: number;
    averageRating: number | null;
  }
  