import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, BookOpen, Target, Award } from 'lucide-react'
import { EnrollButton } from './enroll-button'

interface LearningPathHeaderProps {
  learningPath: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    estimatedHours: number
    totalEnrollments: number
    averageRating: number | null
    stats: {
      totalModules: number
      totalChallenges: number
      totalCodeExamples: number
      activeEnrollments: number
    }
  }
}

const categoryColors = {
  FRONTEND: 'text-blue-800 bg-blue-500/30 dark:text-blue-300 border border-blue-500',
  BACKEND: 'text-green-800 bg-green-500/30 dark:text-green-300 border border-green-500',
  FULLSTACK: 'text-purple-800 bg-purple-500/30 dark:text-purple-300 border border-purple-500',
  MOBILE: 'text-orange-800 bg-orange-500/30 dark:text-orange-300 border border-orange-500',
  DATA_SCIENCE: 'text-pink-800 bg-pink-500/30 dark:text-pink-300 border border-pink-500',
  DEVOPS: 'text-yellow-800 bg-yellow-500/30 dark:text-yellow-300 border border-yellow-500',
  CYBERSECURITY: 'text-red-800 bg-red-500/30 dark:text-red-300 border border-red-500',
}

const difficultyColors = {
  BEGINNER: 'text-emerald-800 bg-emerald-500/30 dark:text-emerald-300 border border-emerald-500',
  INTERMEDIATE: 'text-amber-800 bg-amber-500/30 dark:text-amber-300 border border-amber-500',
  ADVANCED: 'text-orange-800 bg-orange-500/30 dark:text-orange-300 border border-orange-500',
  EXPERT: 'text-red-800 bg-red-500/30 dark:text-red-300 border border-red-500',
}

export function LearningPathHeader({ learningPath }: LearningPathHeaderProps) {
  const categoryColor = categoryColors[learningPath.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
  const difficultyColor = difficultyColors[learningPath.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <a href="/learn" className="hover:text-foreground">Learn</a>
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
          <EnrollButton pathId={learningPath.id} />
        </div>
      </div>
    </div>
  )
}