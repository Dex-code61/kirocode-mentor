'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Target, 
  Code, 
  Trophy, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  Lock
} from 'lucide-react'
import Link from 'next/link'

interface Module {
  id: string
  title: string
  description: string
  order: number
  type: string
  estimatedTime: number
  difficulty: string
  challenges: Array<{ id: string; title: string }>
  codeExamples: Array<{ id: string; title: string }>
}

interface ModulesListProps {
  pathId: string
  modules: Module[]
  userEnrollment: {
    progress: number
    status: string
  }
}

const moduleTypeIcons = {
  THEORY: BookOpen,
  PRACTICE: Target,
  PROJECT: Code,
  ASSESSMENT: Trophy,
  INTERACTIVE: PlayCircle,
}

const moduleTypeColors = {
  THEORY: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  PRACTICE: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  PROJECT: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
  ASSESSMENT: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300',
  INTERACTIVE: 'text-pink-600 bg-pink-100 dark:bg-pink-900 dark:text-pink-300',
}

export function ModulesList({ pathId, modules, userEnrollment }: ModulesListProps) {
  // Mock progress data - in real app, this would come from the server
  const getModuleProgress = (moduleIndex: number) => {
    const overallProgress = userEnrollment.progress
    const progressPerModule = 100 / modules.length
    const moduleProgress = Math.max(0, Math.min(100, overallProgress - (moduleIndex * progressPerModule)))
    
    if (moduleProgress >= progressPerModule) return 'completed'
    if (moduleProgress > 0) return 'in-progress'
    if (moduleIndex === 0 || overallProgress > (moduleIndex - 1) * progressPerModule) return 'available'
    return 'locked'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        <div className="text-sm text-muted-foreground">
          {modules.length} modules • {modules.reduce((acc, m) => acc + m.estimatedTime, 0)} minutes total
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => {
          const IconComponent = moduleTypeIcons[module.type as keyof typeof moduleTypeIcons] || BookOpen
          const typeColor = moduleTypeColors[module.type as keyof typeof moduleTypeColors] || 'text-gray-600 bg-gray-100'
          const progress = getModuleProgress(index)
          const isLocked = progress === 'locked'
          const isCompleted = progress === 'completed'
          const isInProgress = progress === 'in-progress'

          return (
            <Card key={module.id} className={`transition-all hover:shadow-md ${isLocked ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-600' :
                      isInProgress ? 'bg-blue-100 text-blue-600' :
                      isLocked ? 'bg-gray-100 text-gray-400' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <Badge className={typeColor}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {module.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{module.description}</p>
                      
                      {/* Progress bar for in-progress modules */}
                      {isInProgress && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{module.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{module.challenges.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        <span>{module.codeExamples.length}</span>
                      </div>
                    </div>

                    <Button 
                      asChild={!isLocked}
                      disabled={isLocked}
                      variant={isCompleted ? "outline" : "default"}
                      size="sm"
                    >
                      {isLocked ? (
                        <span>Locked</span>
                      ) : (
                        <Link href={`/learn/${pathId}/module/${module.id}`}>
                          {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Module content preview */}
              {!isLocked && (module.challenges.length > 0 || module.codeExamples.length > 0) && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {module.challenges.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Challenges ({module.challenges.length})
                        </h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {module.challenges.slice(0, 2).map((challenge) => (
                            <li key={challenge.id} className="truncate">• {challenge.title}</li>
                          ))}
                          {module.challenges.length > 2 && (
                            <li className="text-xs">+{module.challenges.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {module.codeExamples.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Examples ({module.codeExamples.length})
                        </h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {module.codeExamples.slice(0, 2).map((example) => (
                            <li key={example.id} className="truncate">• {example.title}</li>
                          ))}
                          {module.codeExamples.length > 2 && (
                            <li className="text-xs">+{module.codeExamples.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}