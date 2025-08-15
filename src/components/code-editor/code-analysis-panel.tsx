'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Info, 
  Lightbulb, 
  CheckCircle, 
  TrendingUp,
  Code,
  Zap
} from 'lucide-react';
import { CodeAnalysis, CodeError, CodeWarning, CodeSuggestion } from '@/types';

export interface CodeAnalysisPanelProps {
  analysis?: CodeAnalysis;
  onErrorClick?: (error: CodeError) => void;
  onWarningClick?: (warning: CodeWarning) => void;
  onSuggestionClick?: (suggestion: CodeSuggestion) => void;
  className?: string;
}

export const CodeAnalysisPanel: React.FC<CodeAnalysisPanelProps> = ({
  analysis,
  onErrorClick,
  onWarningClick,
  onSuggestionClick,
  className = '',
}) => {
  if (!analysis) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Run analysis to see results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasIssues = analysis.errors.length > 0 || analysis.warnings.length > 0;
  const hasOnlySuggestions = !hasIssues && analysis.suggestions.length > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Analysis
          </div>
          <div className="flex items-center gap-1">
            {analysis.errors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {analysis.errors.length} errors
              </Badge>
            )}
            {analysis.warnings.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {analysis.warnings.length} warnings
              </Badge>
            )}
            {!hasIssues && (
              <Badge variant="default" className="text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Clean
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-4">
            {/* Errors Section */}
            {analysis.errors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <h4 className="font-medium text-sm">Errors</h4>
                </div>
                <div className="space-y-2">
                  {analysis.errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-3 border border-destructive/20 rounded-lg bg-destructive/5 cursor-pointer hover:bg-destructive/10 transition-colors"
                      onClick={() => onErrorClick?.(error)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-destructive">
                            {error.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Line {error.line}, Column {error.column}
                          </p>
                          {error.explanation && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {error.explanation}
                            </p>
                          )}
                          {error.fixSuggestion && (
                            <div className="mt-2 p-2 bg-background rounded border">
                              <p className="text-xs font-medium">Suggestion:</p>
                              <p className="text-xs text-muted-foreground">
                                {error.fixSuggestion}
                              </p>
                            </div>
                          )}
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {error.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings Section */}
            {analysis.warnings.length > 0 && (
              <>
                {analysis.errors.length > 0 && <Separator />}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-medium text-sm">Warnings</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                        onClick={() => onWarningClick?.(warning)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              {warning.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Line {warning.line}, Column {warning.column}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {warning.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Suggestions Section */}
            {analysis.suggestions.length > 0 && (
              <>
                {hasIssues && <Separator />}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-sm">Suggestions</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={() => onSuggestionClick?.(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              {suggestion.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Line {suggestion.line}, Column {suggestion.column}
                            </p>
                            <div className="mt-2 p-2 bg-background rounded border">
                              <p className="text-xs font-medium">Improvement:</p>
                              <p className="text-xs text-muted-foreground">
                                {suggestion.improvement}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Complexity Metrics */}
            {analysis.complexity && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-sm">Code Complexity</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {analysis.complexity.cyclomatic}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cyclomatic
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {analysis.complexity.cognitive}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cognitive
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {analysis.complexity.maintainability}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Maintainability
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Detected Patterns */}
            {analysis.patterns && analysis.patterns.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-sm">Detected Patterns</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/10 dark:border-green-800"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              {pattern.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {pattern.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(pattern.confidence * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* No Issues State */}
            {!hasIssues && analysis.suggestions.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-medium text-sm mb-1">Great job!</h3>
                <p className="text-xs text-muted-foreground">
                  Your code looks clean with no issues detected.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};