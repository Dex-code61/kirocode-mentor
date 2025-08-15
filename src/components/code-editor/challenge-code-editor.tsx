'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MonacoEditor } from './monaco-editor';
import { CodeAnalysisPanel } from './code-analysis-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { 
  Play, 
  RotateCcw, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { CodeAnalysis, CodeError, CodeWarning, CodeSuggestion } from '@/types';
import { validateCode, ValidationContext } from '@/utils/code-validator-fixed';
import { formatCode } from '@/utils/code-formatter';

export interface ChallengeCodeEditorProps {
  challengeId: string;
  initialCode?: string;
  language: string;
  expectedOutput?: string;
  testCases?: Array<{
    input: any;
    expectedOutput: any;
    description?: string;
  }>;
  onCodeSubmit?: (code: string) => Promise<{ success: boolean; message: string; results?: any }>;
  onCodeTest?: (code: string) => Promise<{ passed: number; total: number; results: any[] }>;
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  readOnly?: boolean;
  className?: string;
}

export const ChallengeCodeEditor: React.FC<ChallengeCodeEditorProps> = ({
  challengeId,
  initialCode = '',
  language,
  expectedOutput,
  testCases = [],
  onCodeSubmit,
  onCodeTest,
  userLevel = 'beginner',
  readOnly = false,
  className = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [analysis, setAnalysis] = useState<CodeAnalysis | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: number; total: number; results: any[] } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [output, setOutput] = useState<string>('');

  // Refs pour optimiser les performances
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // Validation context
  const validationContext: ValidationContext = {
    language,
    userLevel,
    exerciseType: 'coding',
  };

  // Handle code changes avec debounce optimisé
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce analysis pour éviter les plantages
    debounceTimeoutRef.current = setTimeout(() => {
      if (isComponentMountedRef.current && newCode.trim()) {
        performAnalysis(newCode);
      }
    }, 3000); // 3 secondes pour éviter les plantages
  }, []);

  // Perform code analysis de manière optimisée
  const performAnalysis = useCallback(async (codeToAnalyze?: string) => {
    const currentCode = codeToAnalyze || code;
    if (!currentCode.trim()) {
      setAnalysis(undefined);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Analyse plus rapide sans simulation de délai
      const analysisResult = validateCode(currentCode, validationContext);
      if (isComponentMountedRef.current) {
        setAnalysis(analysisResult);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      if (isComponentMountedRef.current) {
        setAnalysis(undefined);
      }
    } finally {
      if (isComponentMountedRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, [code, validationContext]);

  // Handle code testing
  const handleTestCode = useCallback(async () => {
    if (!onCodeTest || !code.trim()) return;

    setIsRunning(true);
    setOutput('Running tests...');
    
    try {
      const results = await onCodeTest(code);
      setTestResults(results);
      setOutput(`Tests completed: ${results.passed}/${results.total} passed`);
    } catch (error) {
      console.error('Test execution failed:', error);
      setOutput('Test execution failed: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  }, [code, onCodeTest]);

  // Handle code submission
  const handleSubmitCode = useCallback(async () => {
    if (!onCodeSubmit || !code.trim()) return;

    setIsSubmitting(true);
    
    try {
      const result = await onCodeSubmit(code);
      setOutput(result.message);
      
      if (result.success) {
        // Success feedback
        setOutput(`✅ ${result.message}`);
      } else {
        setOutput(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setOutput('Submission failed: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, onCodeSubmit]);

  // Handle code formatting
  const handleFormatCode = useCallback(() => {
    try {
      const formattedCode = formatCode(code, language);
      setCode(formattedCode);
    } catch (error) {
      console.error('Formatting failed:', error);
    }
  }, [code, language]);

  // Handle code reset
  const handleResetCode = useCallback(() => {
    setCode(initialCode);
    setAnalysis(undefined);
    setTestResults(null);
    setOutput('');
  }, [initialCode]);

  // Handle error/warning clicks
  const handleErrorClick = useCallback((error: CodeError) => {
    console.log('Navigate to error:', error);
  }, []);

  const handleWarningClick = useCallback((warning: CodeWarning) => {
    console.log('Navigate to warning:', warning);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: CodeSuggestion) => {
    console.log('Navigate to suggestion:', suggestion);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header avec les actions */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {language.toUpperCase()}
              </Badge>
              Challenge Editor
              {analysis && (
                <div className="flex items-center gap-1">
                  {analysis.errors.length > 0 && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {analysis.errors.length}
                    </Badge>
                  )}
                  {analysis.warnings.length > 0 && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {analysis.warnings.length}
                    </Badge>
                  )}
                  {analysis.errors.length === 0 && analysis.warnings.length === 0 && (
                    <Badge variant="default" className="text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Clean
                    </Badge>
                  )}
                </div>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performAnalysis()}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFormatCode}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Format
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCode}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {onCodeTest && (
                <Button
                  variant="outline"
                  onClick={handleTestCode}
                  disabled={isRunning || !code.trim()}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isRunning ? 'Testing...' : 'Test'}
                </Button>
              )}

              {onCodeSubmit && (
                <Button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || !code.trim()}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="flex items-center gap-2"
              >
                {showAnalysis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Editor et Analysis Panel */}
      <div className="flex-1">
        {showAnalysis ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={70} minSize={50}>
              <MonacoEditor
                initialCode={code}
                language={language}
                onCodeChange={handleCodeChange}
                onAnalysisRequest={() => performAnalysis()}
                realTimeAnalysis={false} // Désactivé pour éviter les plantages
                readOnly={readOnly}
                analysis={analysis}
                height="100%"
                className="h-full"
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30} minSize={25}>
              <CodeAnalysisPanel
                analysis={analysis}
                onErrorClick={handleErrorClick}
                onWarningClick={handleWarningClick}
                onSuggestionClick={handleSuggestionClick}
                className="h-full"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <MonacoEditor
            initialCode={code}
            language={language}
            onCodeChange={handleCodeChange}
            onAnalysisRequest={() => performAnalysis()}
            realTimeAnalysis={false} // Désactivé pour éviter les plantages
            readOnly={readOnly}
            analysis={analysis}
            height="100%"
            className="h-full"
          />
        )}
      </div>

      {/* Output Panel */}
      {(output || testResults) && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Output</CardTitle>
          </CardHeader>
          <CardContent>
            {output && (
              <div className="text-sm font-mono bg-muted p-3 rounded mb-3">
                {output}
              </div>
            )}
            
            {testResults && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={testResults.passed === testResults.total ? 'default' : 'destructive'}>
                    {testResults.passed}/{testResults.total} Tests Passed
                  </Badge>
                </div>
                
                {testResults.results.map((result, index) => (
                  <div key={index} className="text-sm p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium">Test {index + 1}</span>
                    </div>
                    {result.description && (
                      <p className="text-muted-foreground mt-1">{result.description}</p>
                    )}
                    {!result.passed && result.error && (
                      <p className="text-red-600 text-xs mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};