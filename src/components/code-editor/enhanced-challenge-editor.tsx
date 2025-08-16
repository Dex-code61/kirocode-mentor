'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MonacoEditor } from './monaco-editor';
import { EnhancedMonacoEditor } from './enhanced-monaco-editor';
import { TestResultsPanel } from './test-results-panel';
import { UnitTestEditor } from './unit-test-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { 
  Play, 
  RotateCcw, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap,
  TestTube,
  FileCode,
  Terminal
} from 'lucide-react';
import { CodeAnalysis, CodeError, CodeWarning, CodeSuggestion } from '@/types';
import { validateCode, ValidationContext } from '@/utils/code-validator-fixed';
import { formatCode } from '@/utils/code-formatter';
import { 
  executeCodeWithTests, 
  validateUserCode, 
  CodeExecutionResult, 
  TestConfiguration 
} from '@/services/code-execution.service';
import { toast } from 'sonner';
import ChallengeTimeOut from './challenge-timeout';

export interface EnhancedChallengeEditorProps {
  challengeId: string;
  estimatedTime: number;
  initialCode?: string;
  language: string;
  unitTests?: string;
  testFramework?: string;
  testConfig?: Partial<TestConfiguration>;
  onCodeSubmit?: (code: string) => Promise<{ success: boolean; message: string; results?: any }>;
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  readOnly?: boolean;
  className?: string;
}

export const EnhancedChallengeEditor: React.FC<EnhancedChallengeEditorProps> = ({
  challengeId,
  estimatedTime,
  initialCode = '',
  language,
  unitTests = '',
  testFramework = 'JEST',
  testConfig = {},
  onCodeSubmit,
  userLevel = 'beginner',
  readOnly = false,
  className = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [analysis, setAnalysis] = useState<CodeAnalysis | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<CodeExecutionResult | undefined>();
  const [activeTab, setActiveTab] = useState('editor');
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Refs pour optimiser les performances
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // Configuration des tests
  const fullTestConfig: TestConfiguration = {
    framework: testFramework as any,
    timeout: 5000,
    memoryLimit: 128,
    timeLimit: 10,
    allowedImports: [],
    ...testConfig,
  };

  // Validation context
  const validationContext: ValidationContext = {
    language,
    userLevel,
    exerciseType: 'coding',
  };

  // Check screen size for responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
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

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  // Perform code analysis
  const performAnalysis = useCallback(async () => {
    if (!code.trim()) {
      setAnalysis(undefined);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analysisResult = validateCode(code, validationContext);
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

  // Handle code testing with unit tests
  const handleTestCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please write some code first.');
      return;
    }

    // Validate user code first
    const validation = validateUserCode(code, language);
    if (!validation.valid) {
      toast.error(`Code validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    setIsRunning(true);
    
    try {
      const result = await executeCodeWithTests(
        code,
        unitTests,
        language,
        fullTestConfig
      );
      
      setTestResults(result);
      
      if (result.success) {
        toast.success(`All tests passed! 🎉`);
      } else {
        const passedTests = result.testResults?.filter(t => t.passed).length || 0;
        const totalTests = result.testResults?.length || 0;
        toast.warning(`${passedTests}/${totalTests} tests passed. Keep trying!`);
      }
    } catch (error) {
      console.error('Test execution failed:', error);
      toast.error('Test execution failed: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  }, [code, unitTests, language, fullTestConfig]);

  // Handle code submission
  const handleSubmitCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please write some code first.');
      return;
    }

    // Run tests first if available
    if (unitTests) {
      await handleTestCode();
      
      // Check if tests passed
      if (!testResults?.success) {
        toast.warning('Please make sure all tests pass before submitting.');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      if (onCodeSubmit) {
        const result = await onCodeSubmit(code);
        
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } else {
        // Fallback: simulate submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Code submitted successfully!');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Submission failed: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, onCodeSubmit, unitTests, testResults, handleTestCode]);

  // Handle code formatting
  const handleFormatCode = useCallback(() => {
    try {
      const formattedCode = formatCode(code, language);
      setCode(formattedCode);
    } catch (error) {
      console.error('Formatting failed:', error);
      toast.error('Code formatting failed');
    }
  }, [code, language]);

  // Handle code reset
  const handleResetCode = useCallback(() => {
    setCode(initialCode);
    setAnalysis(undefined);
    setTestResults(undefined);
    toast.info('Code reset to initial state');
  }, [initialCode]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header avec les actions - Responsive */}
      <Card className="mb-4">
        <CardHeader className="">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {language.toUpperCase()}
              </Badge>
              <span className="hidden sm:inline">Enhanced Challenge Editor</span>
              {unitTests && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <TestTube className="w-3 h-3" />
                  {testFramework}
                </Badge>
              )}
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
            </CardTitle> */}

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performAnalysis()}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFormatCode}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Format</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCode}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>

              <Separator orientation="vertical" className="h-6 hidden sm:block" />

              <Button
                variant="outline"
                onClick={handleTestCode}
                disabled={isRunning || !code.trim()}
                className="flex items-center gap-2"
              >
                <TestTube className="w-4 h-4" />
                {isRunning ? 'Testing...' : 'Run Tests'}
              </Button>

              <Button
                onClick={handleSubmitCode}
                disabled={isSubmitting || !code.trim()}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
            
            {/* Compter le temps passé */}
            <ChallengeTimeOut estimatedTime={estimatedTime} challengeId={challengeId} />
          </div>
        </CardHeader>
      </Card>

      {/* Main Content - Responsive Tabs */}
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="editor" className="text-xs">
              <FileCode className="w-3 h-3 mr-1" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">
              <TestTube className="w-3 h-3 mr-1" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="results" className="text-xs">
              <Terminal className="w-3 h-3 mr-1" />
              Results
            </TabsTrigger>
            <TabsTrigger value="split" className="text-xs hidden lg:flex">
              <Play className="w-3 h-3 mr-1" />
              Split
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 m-0">
            <EnhancedMonacoEditor
              initialCode={code}
              language={language}
              onCodeChange={handleCodeChange}
              onAnalysisRequest={() => performAnalysis()}
              realTimeAnalysis={true}
              readOnly={readOnly}
              height="100%"
              className="h-full"
              userLevel={userLevel}
              showFeedbackPanel={true}
              exerciseContext={{
                expectedPatterns: [],
                difficulty: 1,
                topic: 'coding',
              }}
            />
          </TabsContent>

          <TabsContent value="tests" className="flex-1 m-0">
            <UnitTestEditor
              unitTests={unitTests}
              language={language}
              framework={testFramework}
              onRunTests={handleTestCode}
              readOnly={true}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="results" className="flex-1 m-0">
            <TestResultsPanel
              results={testResults}
              isLoading={isRunning}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="split" className="flex-1 m-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={30}>
                <EnhancedMonacoEditor
                  initialCode={code}
                  language={language}
                  onCodeChange={handleCodeChange}
                  onAnalysisRequest={() => performAnalysis()}
                  realTimeAnalysis={true}
                  readOnly={readOnly}
                  height="100%"
                  className="h-full"
                  userLevel={userLevel}
                  showFeedbackPanel={false}
                  exerciseContext={{
                    expectedPatterns: [],
                    difficulty: 1,
                    topic: 'coding',
                  }}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col gap-4">
                  <div className="flex-1">
                    <TestResultsPanel
                      results={testResults}
                      isLoading={isRunning}
                      className="h-full"
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};