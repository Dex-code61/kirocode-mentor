'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  Target, 
  BookOpen,
  PlayCircle,
  ArrowRight,
  Trophy,
  Code
} from 'lucide-react'
import { updateModuleProgress } from '@/actions/cursus.actions'
import { toast } from 'sonner'

interface ModuleSidebarProps {
  pathId: string
  module: {
    id: string
    title: string
    estimatedTime: number
    challenges: Array<{
      id: string
      title: string
      points: number
    }>
    codeExamples: Array<{
      id: string
      title: string
    }>
  }
  userProgress: {
    status: string
    completionRate: number
    timeSpent: number
  } | null
}

export function ModuleSidebar({ pathId, module, userProgress }: ModuleSidebarProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const progress = userProgress?.completionRate || 0
  const timeSpent = userProgress?.timeSpent || 0
  const isCompleted = userProgress?.status === 'COMPLETED'

  const handleMarkComplete = async () => {
    if (isCompleted) return

    setIsUpdating(true)
    try {
      const result = await updateModuleProgress({
        moduleId: module.id,
        status: 'COMPLETED',
        completionRate: 100,
        timeSpent: 5 // Add 5 minutes for completion
      })

      if (result?.data?.success) {
        toast.success('Module marked as complete!')
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        toast.error('Failed to update progress')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span className="font-medium">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 rounded bg-muted/50">
              <div className="font-semibold">{timeSpent}m</div>
              <div className="text-xs text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center p-2 rounded bg-muted/50">
              <div className="font-semibold">{module.estimatedTime}m</div>
              <div className="text-xs text-muted-foreground">Estimated</div>
            </div>
          </div>

          {!isCompleted && progress >= 80 && (
            <Button 
              onClick={handleMarkComplete}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? (
                'Updating...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          )}

          {isCompleted && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Module Completed!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Module Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Duration</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{module.estimatedTime} minutes</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Challenges</span>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>{module.challenges.length}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Examples</span>
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              <span>{module.codeExamples.length}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Points</span>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>{module.challenges.reduce((acc, c) => acc + c.points, 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges List */}
      {module.challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {module.challenges.map((challenge, index) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium truncate max-w-[120px]">
                      {challenge.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {challenge.points} points
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <a href={`/learn/${pathId}/challenge/${challenge.id}`}>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Code Examples List */}
      {module.codeExamples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="w-5 h-5" />
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {module.codeExamples.map((example, index) => (
              <div key={example.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium truncate max-w-[120px]">
                    {example.title}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <PlayCircle className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <a href={`/learn/${pathId}/start`}>
              <BookOpen className="w-4 h-4 mr-2" />
              Back to Course
            </a>
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <a href="/dashboard">
              <Target className="w-4 h-4 mr-2" />
              Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}