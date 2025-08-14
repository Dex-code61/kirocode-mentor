import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Clock, Users, Star, ArrowRight } from 'lucide-react'

interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  estimatedHours: number
  totalEnrollments: number
  averageRating: number | null
}

interface LearningPathCardProps {
  learningPath: LearningPath
}

const categoryColors = {
  FRONTEND: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  BACKEND: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  FULLSTACK: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  MOBILE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  DATA_SCIENCE: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  DEVOPS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  CYBERSECURITY: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const difficultyColors = {
  BEGINNER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  INTERMEDIATE: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  ADVANCED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  EXPERT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export default function LearningPathCard({ learningPath }: LearningPathCardProps) {
  const categoryColor = categoryColors[learningPath.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
  const difficultyColor = difficultyColors[learningPath.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
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
  )
}