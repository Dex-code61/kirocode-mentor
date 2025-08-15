import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Target, Code, Trophy, Clock, Zap } from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  order: number
  type: string
  estimatedTime: number
  difficulty: string
  skills: string[]
  challenges: Array<{
    id: string
    title: string
    type: string
    points: number
  }>
  codeExamples: Array<{
    id: string
    title: string
    language: string
    difficulty: string
  }>
}

interface LearningPathContentProps {
  learningPath: {
    id: string
    title: string
    description: string
    learningObjectives: string[]
    prerequisites: string[]
    modules: Module[]
    curriculum: any
  }
}

const moduleTypeIcons = {
  THEORY: BookOpen,
  PRACTICE: Target,
  PROJECT: Code,
  ASSESSMENT: Trophy,
  INTERACTIVE: Zap,
}

const moduleTypeColors = {
  THEORY: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  PRACTICE: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  PROJECT: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
  ASSESSMENT: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300',
  INTERACTIVE: 'text-pink-600 bg-pink-100 dark:bg-pink-900 dark:text-pink-300',
}

export function LearningPathContent({ learningPath }: LearningPathContentProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Learning Objectives */}
          {learningPath.learningObjectives && learningPath.learningObjectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {learningPath.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Prerequisites */}
          {learningPath.prerequisites && learningPath.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {learningPath.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          {learningPath.modules.map((module, index) => {
            const IconComponent = moduleTypeIcons[module.type as keyof typeof moduleTypeIcons] || BookOpen
            const typeColor = moduleTypeColors[module.type as keyof typeof moduleTypeColors] || 'text-gray-600 bg-gray-100'

            return (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                      <p className="text-muted-foreground">{module.description}</p>
                    </div>
                    <Badge className={typeColor}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {module.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Module Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{module.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{module.challenges.length} challenges</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        <span>{module.codeExamples.length} examples</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {module.skills && module.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Skills you'll learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {module.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Challenges Preview */}
                    {module.challenges.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Challenges:</h4>
                        <div className="space-y-1">
                          {module.challenges.slice(0, 3).map((challenge) => (
                            <div key={challenge.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{challenge.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {challenge.points} pts
                              </Badge>
                            </div>
                          ))}
                          {module.challenges.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{module.challenges.length - 3} more challenges
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="objectives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              {learningPath.learningObjectives && learningPath.learningObjectives.length > 0 ? (
                <div className="space-y-4">
                  {learningPath.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="flex-1">{objective}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific learning objectives defined for this path.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}