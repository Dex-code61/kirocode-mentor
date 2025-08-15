'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { MonacoEditor } from './monaco-editor';
import { CodeAnalysisPanel } from './code-analysis-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { CodeAnalysis, CodeError, CodeWarning, CodeSuggestion } from '@/types';
import { validateCode, ValidationContext } from '@/utils/code-validator';
import { formatCode } from '@/utils/code-formatter';

export interface CodeEditorWithAnalysisProps {
  initialCode?: string;
  language: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  exerciseType?: 'coding' | 'quiz' | 'project' | 'debugging';
  onCodeChange?: (code: string) => void;
  onCodeRun?: (code: string) => void;
  onCodeSave?: (code: string) => void;
  readOnly?: boolean;
  showAnalysis?: boolean;
  realTimeAnalysis?: boolean;
  className?: string;
}

export const CodeEditorWithAnalysis: React.FC<CodeEditorWithAnalysisProps> = ({
  initialCode = '',
  language,
  userLevel = 'beginner',
  exerciseType = 'coding',
  onCodeChange,
  onCodeRun,
  onCodeSave,
  readOnly = false,
  showAnalysis = true,
  realTimeAnalysis = true,
  className = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [analysis, setAnalysis] = useState<CodeAnalysis | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(showAnalysis);
  const [activeTab, setActiveTab] = useState('editor');

  // Validation context
  const validationContext: ValidationContext = {
    language,
    userLevel,
    exerciseType,
  };

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  }, [onCodeChange]);

  // Perform code analysis
  const performAnalysis = useCallback(async () => {
    if (!code.trim()) {
      setAnalysis(undefined);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate async analysis (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analysisResult = validateCode(code, validationContext);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, validationContext]);

  // Auto-analyze on code changes (with debounce)
  useEffect(() => {
    if (!realTimeAnalysis) return;

    const timeoutId = setTimeout(() => {
      performAnalysis();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [code, realTimeAnalysis, performAnalysis]);

  // Handle running code
  const handleRunCode = useCallback(() => {
    onCodeRun?.(code);
    performAnalysis();
  }, [code, onCodeRun, performAnalysis]);

  // Handle saving code
  const handleSaveCode = useCallback(() => {
    onCodeSave?.(code);
  }, [code, onCodeSave]);

  // Handle formatting code
  const handleFormatCode = useCallback(() => {
    const formattedCode = formatCode(code, language);
    setCode(formattedCode);
    onCodeChange?.(formattedCode);
  }, [code, language, onCodeChange]);

  // Handle error/warning clicks
  const handleErrorClick = useCallback((error: CodeError) => {
    // In a real implementation, this would scroll to the error line
    console.log('Navigate to error:', error);
  }, []);

  const handleWarningClick = useCallback((warning: CodeWarning) => {
    console.log('Navigate to warning:', warning);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: CodeSuggestion) => {
    console.log('Navigate to suggestion:', suggestion);
  }, []);

  // Handle file operations
  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, language]);

  const handleUploadCode = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.ts,.py,.java,.cpp,.cs,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
          onCodeChange?.(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [onCodeChange]);

  return (
    <div className={`h-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            {showAnalysisPanel && (
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                Analysis
                {analysis && (
                  <Badge variant={analysis.errors.length > 0 ? 'destructive' : 'secondary'} className="text-xs">
                    {analysis.errors.length + analysis.warnings.length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex items-center gap-2">
            {onCodeRun && (
              <Button
                onClick={handleRunCode}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run
              </Button>
            )}

            <Button
              variant="outline"
              onClick={performAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>

            <Button
              variant="outline"
              onClick={handleFormatCode}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Format
            </Button>

            {onCodeSave && (
              <Button
                variant="outline"
                onClick={handleSaveCode}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleDownloadCode}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={handleUploadCode}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
            </Button>

            {showAnalysis && (
              <Button
                variant="outline"
                onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
                className="flex items-center gap-2"
              >
                {showAnalysisPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="editor" className="flex-1 m-0">
          {showAnalysisPanel ? (
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={70} minSize={50}>
                <MonacoEditor
                  initialCode={code}
                  language={language}
                  onCodeChange={handleCodeChange}
                  onAnalysisRequest={performAnalysis}
                  realTimeAnalysis={realTimeAnalysis}
                  readOnly={readOnly}
                  analysis={analysis}
                  height="100%"
                  className="h-full border-0"
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={30} minSize={25}>
                <CodeAnalysisPanel
                  analysis={analysis}
                  onErrorClick={handleErrorClick}
                  onWarningClick={handleWarningClick}
                  onSuggestionClick={handleSuggestionClick}
                  className="h-full border-0"
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <MonacoEditor
              initialCode={code}
              language={language}
              onCodeChange={handleCodeChange}
              onAnalysisRequest={performAnalysis}
              realTimeAnalysis={realTimeAnalysis}
              readOnly={readOnly}
              analysis={analysis}
              height="100%"
              className="h-full"
            />
          )}
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 m-0">
          <CodeAnalysisPanel
            analysis={analysis}
            onErrorClick={handleErrorClick}
            onWarningClick={handleWarningClick}
            onSuggestionClick={handleSuggestionClick}
            className="h-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};