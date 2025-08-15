'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Target, 
  Code, 
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  Trophy
} from 'lucide-react'
import Link from 'next/link'

interface ModuleContentProps {
  module: {
    id: string
    title: string
    description: string
    type: string
    content: any
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
    learningPath: {
      id: string
    }
  }
  userProgress: {
    status: string
    completionRate: number
  } | null
}

export function ModuleContent({ module, userProgress }: ModuleContentProps) {
  const [activeTab, setActiveTab] = useState('content')
  const isCompleted = userProgress?.status === 'COMPLETED'

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Module Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="text-lg text-muted-foreground">{module.description}</p>
          </div>
          
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {/* Skills */}
        {module.skills && module.skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Skills you'll learn:</h3>
            <div className="flex flex-wrap gap-2">
              {module.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">
            <BookOpen className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="w-4 h-4 mr-2" />
            Challenges ({module.challenges.length})
          </TabsTrigger>
          <TabsTrigger value="examples">
            <Code className="w-4 h-4 mr-2" />
            Examples ({module.codeExamples.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Content</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              {module.content?.theory ? (
                <div dangerouslySetInnerHTML={{ __html: module.content.theory }} />
              ) : (
                <div className="space-y-4">
                  <p>
                    Welcome to <strong>{module.title}</strong>! This module will teach you the fundamentals 
                    and practical applications of the concepts covered.
                  </p>
                  
                  <h3>What you'll learn:</h3>
                  <ul>
                    <li>Core concepts and terminology</li>
                    <li>Practical implementation techniques</li>
                    <li>Best practices and common patterns</li>
                    <li>Real-world applications and examples</li>
                  </ul>

                  <h3>Learning approach:</h3>
                  <p>
                    This module combines theoretical knowledge with hands-on practice. 
                    You'll start with the fundamentals and gradually work through increasingly 
                    complex examples and challenges.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">💡 Pro Tip</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Take your time to understand each concept before moving on. 
                      Practice with the code examples and don't hesitate to experiment!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-4">
            {module.challenges.length > 0 && (
              <Button onClick={() => setActiveTab('challenges')}>
                <Target className="w-4 h-4 mr-2" />
                Start Challenges
              </Button>
            )}
            {module.codeExamples.length > 0 && (
              <Button variant="outline" onClick={() => setActiveTab('examples')}>
                <Code className="w-4 h-4 mr-2" />
                View Examples
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          {module.challenges.length > 0 ? (
            <div className="grid gap-4">
              {module.challenges.map((challenge, index) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{challenge.type}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Trophy className="w-3 h-3" />
                              <span>{challenge.points} points</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button asChild>
                        <Link href={`/learn/${module.learningPath.id}/challenge/${challenge.id}`}>
                          Start Challenge
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Challenges Yet</h3>
                <p className="text-muted-foreground">
                  Challenges for this module are coming soon. Check back later!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          {module.codeExamples.length > 0 ? (
            <div className="grid gap-4">
              {module.codeExamples.map((example, index) => (
                <Card key={example.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{example.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{example.language}</Badge>
                            <Badge variant="secondary">{example.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        View Example
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Code Examples Yet</h3>
                <p className="text-muted-foreground">
                  Code examples for this module are being prepared. Stay tuned!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}