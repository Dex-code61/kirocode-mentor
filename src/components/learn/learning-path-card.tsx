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
import { categoryColors, difficultyColors } from '@/style';


interface LearningPathCardProps {
  learningPath: LearningPath;
  userId: string;
}

export default function LearningPathCard({
  learningPath,
  userId
}: LearningPathCardProps) {
  const categoryColor =
    categoryColors[learningPath.category as keyof typeof categoryColors] ||
    'bg-gray-100 text-gray-800';
  const difficultyColor =
    difficultyColors[
      learningPath.difficulty as keyof typeof difficultyColors
    ] || 'bg-gray-100 text-gray-800';

    const isEnrolled = learningPath.enrollments.some(
        (enrollment) => enrollment.userId === userId
      )
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
        {
            isEnrolled ? (
                <Button variant="secondary" asChild className="w-full group border border-primary!">
                <Link href={`/learn/${learningPath.id}/lessons`}>
                  Continue learning
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) :(
                <Button asChild className="w-full group">
          <Link href={`/learn/${learningPath.id}`}>
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
            )
        }
        
      </CardFooter>
    </Card>
  );
}
