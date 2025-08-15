import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { LearningPath } from '@/types/learningpath.types';


interface LearningPathCardProps {
  learningPath: LearningPath;
}

const categoryColors = {
  FRONTEND:
    'text-blue-800 bg-blue-500/30 dark:text-blue-300 border border-blue-500',
  BACKEND:
    'text-green-800 bg-green-500/30 dark:text-green-300 border border-green-500',
  FULLSTACK:
    'text-purple-800 bg-purple-500/30 dark:text-purple-300 border border-purple-500',
  MOBILE:
    'text-orange-800 bg-orange-500/30 dark:text-orange-300 border border-orange-500',
  DATA_SCIENCE:
    'text-pink-800 bg-pink-500/30 dark:text-pink-300 border border-pink-500',
  DEVOPS:
    'text-yellow-800 bg-yellow-500/30 dark:text-yellow-300 border border-yellow-500',
  CYBERSECURITY:
    'text-red-800 bg-red-500/30 dark:text-red-300 border border-red-500',
};

const difficultyColors = {
  BEGINNER:
    'text-blue-800 dark:text-blue-300 bg-blue-500/30 border border-blue-500',
  INTERMEDIATE:
    'text-yellow-800 dark:text-yellow-300 bg-yellow-500/30 border border-yellow-500',
  ADVANCED:
    'text-orange-800 dark:text-orange-300 bg-orange-500/30 border border-orange-500',
  EXPERT: 'text-red-800 dark:text-red-300 bg-red-500/30 border border-red-500',
};

export default function LearningPathCard({
  learningPath,
}: LearningPathCardProps) {
  const categoryColor =
    categoryColors[learningPath.category as keyof typeof categoryColors] ||
    'bg-gray-100 text-gray-800';
  const difficultyColor =
    difficultyColors[
      learningPath.difficulty as keyof typeof difficultyColors
    ] || 'bg-gray-100 text-gray-800';

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-start items-center gap-1 mb-2">
          <Badge className={categoryColor}>
            {learningPath.category.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className={difficultyColor}>
            {learningPath.difficulty}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold line-clamp-2">
          {learningPath.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {learningPath.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{learningPath.estimatedHours}h</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{learningPath.totalEnrollments}</span>
          </div>

          {learningPath.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span>{learningPath.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button asChild className="w-full group">
          <Link href={`/learn/${learningPath.id}`}>
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
