import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, BookOpen, Target, Award, ChevronRight } from 'lucide-react'
import { EnrollButton } from './enroll-button'
import { categoryColors, difficultyColors } from '@/style'
import Link from 'next/link'

interface LearningPathHeaderProps {
  learningPath: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    isEnrolled: boolean
    estimatedHours: number
    totalEnrollments: number
    averageRating: number | null
    enrollments: {
      id: string;
      userId: string;
      status: any;
      progress: number;
      enrolledAt: Date;
  }[];
    stats: {
      totalModules: number
      totalChallenges: number
      totalCodeExamples: number
      activeEnrollments: number
    }
  }
}

export function LearningPathHeader({ learningPath }: LearningPathHeaderProps) {
  const categoryColor = categoryColors[learningPath.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
  const difficultyColor = difficultyColors[learningPath.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <span>/</span>
        <span className="text-foreground">{learningPath.title}</span>
      </nav>

      {/* Main Header */}
      <div className="space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={categoryColor}>
            {learningPath.category.replace('_', ' ')}
          </Badge>
          <Badge className={difficultyColor}>
            {learningPath.difficulty}
          </Badge>
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            {learningPath.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {learningPath.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{learningPath.estimatedHours} hours</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{learningPath.totalEnrollments.toLocaleString()} enrolled</span>
          </div>

          {learningPath.averageRating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span>{learningPath.averageRating.toFixed(1)} rating</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{learningPath.stats.totalModules} modules</span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{learningPath.stats.totalChallenges} challenges</span>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>{learningPath.stats.totalCodeExamples} examples</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">

        {
          learningPath.isEnrolled ? (
            <Button asChild className="w-full md:w-auto">
              <Link href={`/learn/${learningPath.id}/start`}>
              Continue Learning
              <ChevronRight /></Link>
            </Button>
          ) : (
          <EnrollButton pathId={learningPath.id} />
          )
        }
        </div>
        
      </div>
    </div>
  )
}