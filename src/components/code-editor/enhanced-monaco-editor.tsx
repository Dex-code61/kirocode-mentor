'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { CodeAnalysis } from '@/types';
import { useCodeAnalysis } from '@/hooks/useCodeAnalysis';
import { CodeFeedbackPanel } from './code-feedback-panel';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

export interface EnhancedMonacoEditorProps {
  initialCode?: string;
  language: string;
  onCodeChange?: (code: string) => void;
  onAnalysisRequest?: () => void;
  realTimeAnalysis?: boolean;
  readOnly?: boolean;
  height?: string | number;
  className?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  showFeedbackPanel?: boolean;
  theme?: 'vs-dark' | 'light' | 'vs';
  exerciseContext?: {
    expectedPatterns: string[];
    difficulty: number;
    topic: string;
  };
}

export const EnhancedMonacoEditor: React.FC<EnhancedMonacoEditorProps> = ({
  initialCode = '',
  language,
  onCodeChange,
  onAnalysisRequest,
  realTimeAnalysis = true,
  readOnly = false,
  height = '400px',
  className = '',
  userLevel = 'beginner',
  showFeedbackPanel = true,
  theme = 'vs-dark',
  exerciseContext,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showPanel, setShowPanel] = useState(showFeedbackPanel);
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  // Use code analysis hook
  const {
    analysis,
    isAnalyzing,
    error: analysisError,
    analyzeCode,
    analyzeCodeRealTime,
    clearAnalysis,
  } = useCodeAnalysis({
    language,
    userLevel,
    realTime: realTimeAnalysis,
    debounceMs: 500,
    includePerformanceAnalysis:
      userLevel === 'advanced' || userLevel === 'expert',
    includeSecurity: userLevel === 'expert',
    autoAnalyze: true,
  });

  // Handle code changes
  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || '';
      setCode(newCode);
      onCodeChange?.(newCode);

      // Trigger real-time analysis if enabled
      if (realTimeAnalysis) {
        analyzeCodeRealTime(newCode, {
          exerciseContext,
        });
      }
    },
    [onCodeChange, realTimeAnalysis, analyzeCodeRealTime, exerciseContext]
  );

  // Manual analysis trigger
  const handleAnalyzeClick = useCallback(async () => {
    await analyzeCode(code, {
      exerciseContext,
    });
    onAnalysisRequest?.();
  }, [analyzeCode, code, exerciseContext, onAnalysisRequest]);

  // Apply fix suggestion
  const handleApplyFix = useCallback(
    (line: number, column: number, suggestion: string) => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      // Simple fix application - in a real implementation, this would be more sophisticated
      const lineContent = model.getLineContent(line);
      const range = {
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: lineContent.length + 1,
      };

      // This is a simplified fix application
      // In practice, you'd parse the suggestion and apply specific fixes
      editor.executeEdits('apply-fix', [
        {
          range,
          text: suggestion,
        },
      ]);
    },
    []
  );

  // Setup Monaco editor decorations for analysis results
  const updateEditorDecorations = useCallback(() => {
    if (!editorRef.current || !monacoInstance || !analysis) return;

    const editor = editorRef.current;
    const monaco = monacoInstance;

    // Clear previous decorations
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      []
    );

    const decorations: editor.IModelDeltaDecoration[] = [];

    // Add error decorations
    analysis.errors.forEach(error => {
      decorations.push({
        range: new monaco.Range(
          error.line,
          error.column,
          error.line,
          error.column + 10
        ),
        options: {
          isWholeLine: false,
          className: 'error-decoration',
          glyphMarginClassName: 'error-glyph',
          hoverMessage: {
            value: `**Error:** ${error.message}\n\n${error.explanation}${error.fixSuggestion ? `\n\n**Suggestion:** ${error.fixSuggestion}` : ''}`,
          },
          minimap: {
            color: '#ff0000',
            position: monaco.editor.MinimapPosition.Inline,
          },
        },
      });
    });

    // Add warning decorations
    analysis.warnings.forEach(warning => {
      decorations.push({
        range: new monaco.Range(
          warning.line,
          warning.column,
          warning.line,
          warning.column + 10
        ),
        options: {
          isWholeLine: false,
          className: 'warning-decoration',
          glyphMarginClassName: 'warning-glyph',
          hoverMessage: {
            value: `**Warning:** ${warning.message}\n\n*Type:* ${warning.type}`,
          },
          minimap: {
            color: '#ffaa00',
            position: monaco.editor.MinimapPosition.Inline,
          },
        },
      });
    });

    // Add suggestion decorations
    analysis.suggestions.forEach(suggestion => {
      decorations.push({
        range: new monaco.Range(
          suggestion.line,
          suggestion.column,
          suggestion.line,
          suggestion.column + 5
        ),
        options: {
          isWholeLine: false,
          className: 'suggestion-decoration',
          glyphMarginClassName: 'suggestion-glyph',
          hoverMessage: {
            value: `**Suggestion:** ${suggestion.message}\n\n${suggestion.improvement}`,
          },
          minimap: {
            color: '#0088ff',
            position: monaco.editor.MinimapPosition.Inline,
          },
        },
      });
    });

    // Apply decorations
    decorationsRef.current = editor.deltaDecorations([], decorations);
  }, [monacoInstance, analysis]);

  // Setup Monaco editor
  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      setMonacoInstance(monaco);

      // Configure editor options
      editor.updateOptions({
        fontSize: 14,
        lineHeight: 20,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        glyphMargin: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectionHighlight: true,
        occurrencesHighlight: 'singleFile',
        codeLens: true,
        folding: true,
        foldingHighlight: true,
        showFoldingControls: 'always',
      });

      // Add custom CSS for decorations
      const style = document.createElement('style');
      style.textContent = `
      .error-decoration {
        background-color: rgba(255, 0, 0, 0.1);
        border-bottom: 2px wavy red;
      }
      .warning-decoration {
        background-color: rgba(255, 170, 0, 0.1);
        border-bottom: 2px wavy orange;
      }
      .suggestion-decoration {
        background-color: rgba(0, 136, 255, 0.1);
        border-bottom: 1px dotted blue;
      }
      .error-glyph {
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiNGRjAwMDAiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTJBNCA0IDAgMSAwIDggNEE0IDQgMCAwIDAgOCAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=') no-repeat center;
      }
      .warning-glyph {
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTJBNCA0IDAgMSAwIDggNEE0IDQgMCAwIDAgOCAxMloiIGZpbGw9IiNGRkFBMDAiLz4KPC9zdmc+Cg==') no-repeat center;
      }
      .suggestion-glyph {
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiMwMDg4RkYiLz4KPHBhdGggZD0iTTggMTJBNCA0IDAgMSAwIDggNEE0IDQgMCAwIDAgOCAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=') no-repeat center;
      }
    `;
      document.head.appendChild(style);

      // Trigger initial analysis if code exists
      if (initialCode.trim()) {
        if (realTimeAnalysis) {
          analyzeCodeRealTime(initialCode, { exerciseContext });
        }
      }
    },
    [initialCode, realTimeAnalysis, analyzeCodeRealTime, exerciseContext]
  );

  // Update decorations when analysis changes
  useEffect(() => {
    updateEditorDecorations();
  }, [updateEditorDecorations]);

  // Get status info
  const getStatusInfo = () => {
    if (isAnalyzing) {
      return {
        icon: <Zap className="w-4 h-4 animate-pulse" />,
        text: 'Analyzing...',
        color: 'text-blue-500',
      };
    }

    if (analysisError) {
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: 'Analysis failed',
        color: 'text-red-500',
      };
    }

    if (!analysis) {
      return {
        icon: <Eye className="w-4 h-4" />,
        text: 'Ready',
        color: 'text-muted-foreground',
      };
    }

    const errorCount = analysis.errors.length;
    const warningCount = analysis.warnings.length;
    const suggestionCount = analysis.suggestions.length;

    if (errorCount > 0) {
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `${errorCount} error${errorCount > 1 ? 's' : ''}`,
        color: 'text-red-500',
      };
    }

    if (warningCount > 0) {
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `${warningCount} warning${warningCount > 1 ? 's' : ''}`,
        color: 'text-yellow-500',
      };
    }

    if (suggestionCount > 0) {
      return {
        icon: <Lightbulb className="w-4 h-4" />,
        text: `${suggestionCount} suggestion${suggestionCount > 1 ? 's' : ''}`,
        color: 'text-blue-500',
      };
    }

    return {
      icon: <CheckCircle className="w-4 h-4" />,
      text: 'All good!',
      color: 'text-green-500',
    };
  };

  const status = getStatusInfo();

  const editorContent = (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1">
            {status.icon}
            <span className={`text-xs ${status.color}`}>{status.text}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!realTimeAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing || !code.trim()}
              className="h-7 text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              Analyze
            </Button>
          )}

          {showFeedbackPanel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPanel(!showPanel)}
              className="h-7 text-xs"
            >
              {showPanel ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
            </Button>
          )}

          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{
            readOnly,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: true },
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );

  if (!showFeedbackPanel || !showPanel) {
    return <div className={`h-full ${className}`}>{editorContent}</div>;
  }

  return (
    <div className={`h-full ${className}`}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={65} minSize={40}>
          {editorContent}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={35} minSize={25}>
          <CodeFeedbackPanel
            analysis={analysis}
            isLoading={isAnalyzing}
            onFixSuggestion={handleApplyFix}
            className="h-full"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
