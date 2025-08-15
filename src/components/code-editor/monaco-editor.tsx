'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Maximize2, 
  Minimize2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { CodeAnalysis, CodeError } from '@/types';

export interface MonacoEditorProps {
  initialCode?: string;
  language: string;
  onCodeChange?: (code: string) => void;
  onAnalysisRequest?: () => void;
  realTimeAnalysis?: boolean;
  readOnly?: boolean;
  height?: string;
  analysis?: CodeAnalysis;
  className?: string;
}

export interface EditorTheme {
  name: string;
  displayName: string;
  type: 'light' | 'dark';
}

const EDITOR_THEMES: EditorTheme[] = [
  { name: 'vs', displayName: 'Visual Studio Light', type: 'light' },
  { name: 'vs-dark', displayName: 'Visual Studio Dark', type: 'dark' },
  { name: 'hc-black', displayName: 'High Contrast Dark', type: 'dark' },
  { name: 'hc-light', displayName: 'High Contrast Light', type: 'light' },
];

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  initialCode = '',
  language,
  onCodeChange,
  onAnalysisRequest,
  realTimeAnalysis = false,
  readOnly = false,
  height = '400px',
  analysis,
  className = '',
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { theme } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('vs-dark');
  const [decorations, setDecorations] = useState<string[]>([]);

  // Auto-select theme based on system theme
  useEffect(() => {
    const defaultTheme = theme === 'dark' ? 'vs-dark' : 'vs';
    setCurrentTheme(defaultTheme);
  }, [theme]);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure TypeScript compiler options
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      });

      // Add common type definitions
      const libSource = `
        declare var console: {
          log(message?: any, ...optionalParams: any[]): void;
          error(message?: any, ...optionalParams: any[]): void;
          warn(message?: any, ...optionalParams: any[]): void;
        };
        declare var setTimeout: (callback: () => void, ms: number) => number;
        declare var setInterval: (callback: () => void, ms: number) => number;
      `;
      
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        libSource,
        'ts:lib.dom.d.ts'
      );
    }

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      lineHeight: 1.5,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
      },
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onAnalysisRequest?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onAnalysisRequest?.();
    });
  }, [language, onAnalysisRequest]);

  // Handle code changes
  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);

    // Trigger real-time analysis with debounce
    if (realTimeAnalysis && onAnalysisRequest) {
      const timeoutId = setTimeout(() => {
        onAnalysisRequest();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [onCodeChange, onAnalysisRequest, realTimeAnalysis]);

  // Update decorations when analysis changes
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !analysis) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;

    // Clear previous decorations
    if (decorations.length > 0) {
      editor.deltaDecorations(decorations, []);
    }

    // Create new decorations for errors and warnings
    const newDecorations = [
      ...analysis.errors.map((error: CodeError) => ({
        range: new monaco.Range(error.line, error.column, error.line, error.column + 10),
        options: {
          isWholeLine: false,
          className: 'monaco-error-decoration',
          glyphMarginClassName: 'monaco-error-glyph',
          hoverMessage: {
            value: `**Error:** ${error.message}\n\n${error.explanation}${error.fixSuggestion ? `\n\n**Suggestion:** ${error.fixSuggestion}` : ''}`,
          },
          minimap: {
            color: '#ff0000',
            position: monaco.editor.MinimapPosition.Inline,
          },
        },
      })),
      ...analysis.warnings.map((warning) => ({
        range: new monaco.Range(warning.line, warning.column, warning.line, warning.column + 10),
        options: {
          isWholeLine: false,
          className: 'monaco-warning-decoration',
          glyphMarginClassName: 'monaco-warning-glyph',
          hoverMessage: {
            value: `**Warning:** ${warning.message}`,
          },
          minimap: {
            color: '#ffaa00',
            position: monaco.editor.MinimapPosition.Inline,
          },
        },
      })),
    ];

    const decorationIds = editor.deltaDecorations([], newDecorations);
    setDecorations(decorationIds);
  }, [analysis, decorations]);

  // Format code
  const formatCode = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  }, []);

  // Reset code
  const resetCode = useCallback(() => {
    setCode(initialCode);
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
  }, [initialCode]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          {analysis && (
            <div className="flex items-center gap-1">
              {analysis.errors.length > 0 && (
                <Badge variant="destructive" className="text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {analysis.errors.length} errors
                </Badge>
              )}
              {analysis.warnings.length > 0 && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {analysis.warnings.length} warnings
                </Badge>
              )}
              {analysis.errors.length === 0 && analysis.warnings.length === 0 && (
                <Badge variant="default" className="text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  No issues
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onAnalysisRequest && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAnalysisRequest}
              className="h-8 px-2"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="h-8 px-2"
            title="Format Code (Ctrl+Shift+F)"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetCode}
            className="h-8 px-2"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-4" />

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 px-2"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="relative w-full h-full flex">
        <Editor
          height={isFullscreen ? 'calc(100vh - 120px)' : height}
          language={language}
          value={code}
          theme={currentTheme}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: !isFullscreen },
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </Card>
  );
};