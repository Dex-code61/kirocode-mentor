import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react'

interface LearningPathSidebarProps {
  learningPath: {
    id: string
    estimatedHours: number
    totalEnrollments: number
    averageRating: number | null
    difficulty: string
    category: string
    stats: {
      totalModules: number
      totalChallenges: number
      totalCodeExamples: number
      activeEnrollments: number
    }
  }
}

export function LearningPathSidebar({ learningPath }: LearningPathSidebarProps) {
  const completionRate = learningPath.stats.activeEnrollments > 0 
    ? Math.round((learningPath.stats.activeEnrollments / learningPath.totalEnrollments) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{learningPath.estimatedHours}</div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{learningPath.stats.totalModules}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{learningPath.stats.totalChallenges}</div>
              <div className="text-xs text-muted-foreground">Challenges</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{learningPath.stats.totalCodeExamples}</div>
              <div className="text-xs text-muted-foreground">Examples</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Enrolled</span>
              <span className="font-semibold">{learningPath.totalEnrollments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Active Learners</span>
              <span className="font-semibold">{learningPath.stats.activeEnrollments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span className="font-semibold">{completionRate}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      {learningPath.averageRating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{learningPath.averageRating.toFixed(1)}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(learningPath.averageRating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {learningPath.totalEnrollments} reviews
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Path Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Path Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Category</span>
            <Badge variant="secondary">
              {learningPath.category.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Difficulty</span>
            <Badge variant="outline">
              {learningPath.difficulty}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="text-sm font-medium">{learningPath.estimatedHours} hours</span>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            What's Included
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{learningPath.stats.totalModules} interactive modules</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{learningPath.stats.totalChallenges} coding challenges</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{learningPath.stats.totalCodeExamples} code examples</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Community support</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Lifetime access</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}