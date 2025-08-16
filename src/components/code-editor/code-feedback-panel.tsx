'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  TrendingUp,
  Zap,
  Target,
  BookOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { CodeAnalysis, CodeError, CodeWarning, CodeSuggestion } from '@/types';

interface CodeFeedbackPanelProps {
  analysis?: CodeAnalysis;
  isLoading?: boolean;
  onFixSuggestion?: (line: number, column: number, suggestion: string) => void;
  className?: string;
}

interface FeedbackItemProps {
  type: 'error' | 'warning' | 'suggestion';
  line: number;
  column: number;
  message: string;
  explanation?: string;
  fixSuggestion?: string;
  improvement?: string;
  onApplyFix?: () => void;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({
  type,
  line,
  column,
  message,
  explanation,
  fixSuggestion,
  improvement,
  onApplyFix,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'suggestion':
        return 'outline';
    }
  };

  const detailText = explanation || improvement;
  const hasDetails = detailText || fixSuggestion;

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={getBadgeVariant()} className="text-xs">
              Line {line}:{column}
            </Badge>
            <span className="text-sm font-medium">{message}</span>
          </div>
          
          {hasDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronRight className="w-3 h-3 mr-1" />
                  Show details
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {isExpanded && hasDetails && (
        <div className="ml-6 space-y-2">
          {detailText && (
            <p className="text-sm text-muted-foreground">{detailText}</p>
          )}
          
          {fixSuggestion && (
            <div className="bg-muted/50 rounded p-2">
              <p className="text-sm font-medium mb-1">💡 Suggestion:</p>
              <p className="text-sm text-muted-foreground">{fixSuggestion}</p>
              {onApplyFix && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onApplyFix}
                  className="mt-2 h-7 text-xs"
                >
                  Apply fix
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CodeFeedbackPanel: React.FC<CodeFeedbackPanelProps> = ({
  analysis,
  isLoading = false,
  onFixSuggestion,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            Analyzing code...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Code Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Write some code to see analysis and suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { errors, warnings, suggestions, complexity, patterns } = analysis;
  const totalIssues = errors.length + warnings.length;
  const hasIssues = totalIssues > 0;

  const getOverallStatus = () => {
    if (errors.length > 0) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        text: 'Issues found',
        color: 'text-red-600',
      };
    } else if (warnings.length > 0) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        text: 'Minor issues',
        color: 'text-yellow-600',
      };
    } else {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        text: 'Looking good!',
        color: 'text-green-600',
      };
    }
  };

  const status = getOverallStatus();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Code Analysis
          </div>
          <div className="flex items-center gap-2">
            {status.icon}
            <span className={`text-sm font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-xs">
              Issues ({totalIssues})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">
              Tips ({suggestions.length})
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{errors.length}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{warnings.length}</div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{suggestions.length}</div>
                <div className="text-xs text-muted-foreground">Suggestions</div>
              </div>
            </div>

            <Separator />

            {patterns.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Detected Patterns
                </h4>
                <div className="space-y-2">
                  {patterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <div className="text-sm font-medium">{pattern.name}</div>
                        <div className="text-xs text-muted-foreground">{pattern.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(pattern.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasIssues && suggestions.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Great job!</p>
                <p className="text-xs text-muted-foreground">Your code looks clean and follows best practices.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-3">
            <ScrollArea className="h-64">
              {errors.length === 0 && warnings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No issues found!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {errors.map((error, index) => (
                    <FeedbackItem
                      key={`error-${index}`}
                      type="error"
                      line={error.line}
                      column={error.column}
                      message={error.message}
                      explanation={error.explanation}
                      fixSuggestion={error.fixSuggestion}
                      onApplyFix={
                        onFixSuggestion && error.fixSuggestion
                          ? () => onFixSuggestion(error.line, error.column, error.fixSuggestion!)
                          : undefined
                      }
                    />
                  ))}
                  
                  {warnings.map((warning, index) => (
                    <FeedbackItem
                      key={`warning-${index}`}
                      type="warning"
                      line={warning.line}
                      column={warning.column}
                      message={warning.message}
                      explanation={`Warning: ${warning.type}`}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-3">
            <ScrollArea className="h-64">
              {suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No suggestions at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <FeedbackItem
                      key={`suggestion-${index}`}
                      type="suggestion"
                      line={suggestion.line}
                      column={suggestion.column}
                      message={suggestion.message}
                      improvement={suggestion.improvement}
                      onApplyFix={
                        onFixSuggestion && suggestion.improvement
                          ? () => onFixSuggestion(suggestion.line, suggestion.column, suggestion.improvement)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <div className="text-sm font-medium">Cyclomatic Complexity</div>
                  <div className="text-xs text-muted-foreground">Measures code complexity</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{complexity.cyclomatic}</div>
                  <div className="text-xs text-muted-foreground">
                    {complexity.cyclomatic <= 10 ? 'Good' : complexity.cyclomatic <= 20 ? 'Moderate' : 'High'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <div className="text-sm font-medium">Cognitive Complexity</div>
                  <div className="text-xs text-muted-foreground">How hard is it to understand</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{complexity.cognitive}</div>
                  <div className="text-xs text-muted-foreground">
                    {complexity.cognitive <= 15 ? 'Good' : complexity.cognitive <= 25 ? 'Moderate' : 'High'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <div className="text-sm font-medium">Maintainability Index</div>
                  <div className="text-xs text-muted-foreground">How easy to maintain</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{complexity.maintainability}</div>
                  <div className="text-xs text-muted-foreground">
                    {complexity.maintainability >= 85 ? 'Excellent' : 
                     complexity.maintainability >= 70 ? 'Good' : 
                     complexity.maintainability >= 50 ? 'Moderate' : 'Poor'}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Cyclomatic: ≤10 (Good), 11-20 (Moderate), &gt;20 (High)</p>
              <p>• Cognitive: ≤15 (Good), 16-25 (Moderate), &gt;25 (High)</p>
              <p>• Maintainability: ≥85 (Excellent), 70-84 (Good), 50-69 (Moderate), &lt;50 (Poor)</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};