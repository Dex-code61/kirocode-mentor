import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  CheckCircle
} from 'lucide-react'

interface LearningPathProgressProps {
  pathId: string
  enrollment: {
    progress: number
    status: string
    enrolledAt: Date
    lastAccessedAt: Date
  }
  totalModules: number
}

export function LearningPathProgress({ pathId, enrollment, totalModules }: LearningPathProgressProps) {
  const completedModules = Math.floor((enrollment.progress / 100) * totalModules)
  const daysEnrolled = Math.floor((Date.now() - new Date(enrollment.enrolledAt).getTime()) / (1000 * 60 * 60 * 24))
  const lastAccessed = Math.floor((Date.now() - new Date(enrollment.lastAccessedAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{enrollment.progress.toFixed(1)}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedModules} of {totalModules} modules completed</span>
            <span>{totalModules - completedModules} remaining</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{completedModules}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{daysEnrolled}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              Days Active
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">
              {lastAccessed === 0 ? 'Today' : `${lastAccessed}d`}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Last Visit
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">
              {Math.floor(enrollment.progress / 10)}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              Achievements
            </div>
          </div>
        </div>

        {/* Status and Encouragement */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {enrollment.status}
              </Badge>
              <span className="text-sm font-medium">
                {enrollment.progress < 25 ? 'Just Getting Started!' :
                 enrollment.progress < 50 ? 'Making Great Progress!' :
                 enrollment.progress < 75 ? 'More Than Halfway There!' :
                 enrollment.progress < 100 ? 'Almost Done!' :
                 'Congratulations! 🎉'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {enrollment.progress < 25 ? 'Keep going! Every expert was once a beginner.' :
               enrollment.progress < 50 ? 'You\'re building momentum. Stay consistent!' :
               enrollment.progress < 75 ? 'Excellent work! You\'re in the home stretch.' :
               enrollment.progress < 100 ? 'So close! Finish strong!' :
               'You\'ve completed this learning path! Time to apply your skills.'}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {enrollment.progress.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}