'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TestTube,
  AlertTriangle,
  TrendingUp,
  MemoryStick
} from 'lucide-react';
import { TestResult, CodeExecutionResult } from '@/services/code-execution.service';

interface TestResultsPanelProps {
  results?: CodeExecutionResult;
  isLoading?: boolean;
  className?: string;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  results,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TestTube className="w-4 h-4 animate-spin" />
            Running Tests...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <TestTube className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Run your code to see test results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { testResults = [], success, executionTime, memoryUsage, output } = results;
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test Results
          </CardTitle>
          <Badge variant={success ? 'default' : 'destructive'} className="text-xs">
            {passedTests}/{totalTests} Passed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Success Rate</span>
            <span className="font-medium">{Math.round(successRate)}%</span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        {/* Execution Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">{executionTime}ms</span>
          </div>
          {memoryUsage && (
            <div className="flex items-center gap-2 text-sm">
              <MemoryStick className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Memory:</span>
              <span className="font-medium">{memoryUsage}MB</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Individual Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Individual Tests
            </h4>
            
            <ScrollArea className="max-h-64">
              <div className="space-y-2">
                {testResults.map((test, index) => (
                  <TestResultItem key={index} test={test} index={index} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Output */}
        {output && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Console Output</h4>
              <ScrollArea className="max-h-32">
                <pre className="text-xs bg-muted p-3 rounded font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Error Message */}
        {results.error && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                Execution Error
              </h4>
              <div className="text-xs bg-destructive/10 text-destructive p-3 rounded border border-destructive/20">
                {results.error}
              </div>
            </div>
          </>
        )}

        {/* Success Message */}
        {success && totalTests > 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium text-green-600">All tests passed! 🎉</p>
            <p className="text-xs text-muted-foreground">Great job on your implementation!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component for individual test result
const TestResultItem: React.FC<{ test: TestResult; index: number }> = ({ test, index }) => {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <div className="flex-shrink-0 mt-0.5">
        {test.passed ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">{test.testName}</span>
          <Badge variant={test.passed ? 'default' : 'destructive'} className="text-xs">
            {test.passed ? 'PASS' : 'FAIL'}
          </Badge>
        </div>
        
        {test.description && (
          <p className="text-xs text-muted-foreground mb-2">{test.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {test.executionTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {test.executionTime}ms
            </span>
          )}
        </div>
        
        {test.error && (
          <div className="mt-2 text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
            {test.error}
          </div>
        )}
        
        {test.output && test.output !== '✓ Test passed' && test.output !== '✗ Test failed' && (
          <div className="mt-2 text-xs bg-muted p-2 rounded font-mono">
            {test.output}
          </div>
        )}
      </div>
    </div>
  );
};