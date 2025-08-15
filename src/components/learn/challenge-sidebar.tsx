'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  TestTube, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Clock,
  Trophy
} from 'lucide-react';
import { ComponentChallenge, ComponentSubmission } from '@/types/challenge.types';

interface ChallengeSidebarProps {
  pathId: string;
  challenge: ComponentChallenge;
  latestSubmission?: ComponentSubmission | null;
}

export const ChallengeSidebar: React.FC<ChallengeSidebarProps> = ({
  pathId,
  challenge,
  latestSubmission,
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="w-96 border-l bg-muted/30 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Challenge Details</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="description" className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Info
          </TabsTrigger>
          <TabsTrigger value="examples" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Examples
          </TabsTrigger>
          <TabsTrigger value="tests" className="text-xs">
            <TestTube className="w-3 h-3 mr-1" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="hints" className="text-xs">
            <Lightbulb className="w-3 h-3 mr-1" />
            Hints
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 p-4">
          <TabsContent value="description" className="mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Description</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {challenge.description}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {challenge.instructions}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Challenge Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge variant="outline">{challenge.difficulty.toLowerCase()}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {challenge.estimatedTime} min
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Points:</span>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {challenge.points} pts
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="examples" className="mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {challenge.examples && challenge.examples.length > 0 ? (
                  challenge.examples.map((example, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Example {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Input:</div>
                          <div className="text-sm font-mono bg-muted p-2 rounded">
                            {JSON.stringify(example.input, null, 2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Output:</div>
                          <div className="text-sm font-mono bg-muted p-2 rounded">
                            {JSON.stringify(example.output, null, 2)}
                          </div>
                        </div>
                        {example.explanation && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Explanation:</div>
                            <div className="text-sm text-muted-foreground">
                              {example.explanation}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No examples available for this challenge.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tests" className="mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {latestSubmission?.testResults && latestSubmission.testResults.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Latest Test Results</div>
                    {latestSubmission.testResults.map((result, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm font-medium">Test {index + 1}</span>
                            <Badge variant={result.passed ? 'default' : 'destructive'} className="text-xs">
                              {result.passed ? 'PASSED' : 'FAILED'}
                            </Badge>
                          </div>
                          {result.description && (
                            <div className="text-xs text-muted-foreground mb-2">
                              {result.description}
                            </div>
                          )}
                          {result.error && (
                            <div className="text-xs text-red-600 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                              {result.error}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Run your code to see test results here.
                  </div>
                )}

                {challenge.testCases && challenge.testCases.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="text-sm font-medium">Test Cases</div>
                    <div className="text-xs text-muted-foreground">
                      Your solution will be tested against these cases:
                    </div>
                    {challenge.testCases.slice(0, 3).map((testCase, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="text-xs font-medium mb-2">Test Case {index + 1}</div>
                          {testCase.description && (
                            <div className="text-xs text-muted-foreground mb-2">
                              {testCase.description}
                            </div>
                          )}
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs text-muted-foreground">Input:</div>
                              <div className="text-xs font-mono bg-muted p-1 rounded">
                                {JSON.stringify(testCase.input)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Expected:</div>
                              <div className="text-xs font-mono bg-muted p-1 rounded">
                                {JSON.stringify(testCase.expectedOutput)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {challenge.testCases.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        ... and {challenge.testCases.length - 3} more test cases
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="hints" className="mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {challenge.hints && challenge.hints.length > 0 ? (
                  <div className="space-y-3">
                    {!showHints ? (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Lightbulb className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                          <div className="text-sm font-medium mb-2">Need a hint?</div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {challenge.hints.length} hint{challenge.hints.length > 1 ? 's' : ''} available
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowHints(true)}
                          >
                            Show Hints
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      challenge.hints.map((hint, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Hint {index + 1}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            {hint}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No hints available for this challenge.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};