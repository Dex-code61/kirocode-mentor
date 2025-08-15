/**
 * Code Editor Components
 * 
 * This module provides Monaco Editor integration with real-time code analysis,
 * syntax highlighting, autocompletion, and validation features.
 */

export { MonacoEditor } from './monaco-editor';
export type { MonacoEditorProps, EditorTheme } from './monaco-editor';

export { CodeAnalysisPanel } from './code-analysis-panel';
export type { CodeAnalysisPanelProps } from './code-analysis-panel';

export { CodeEditorWithAnalysis } from './code-editor-with-analysis';
export type { CodeEditorWithAnalysisProps } from './code-editor-with-analysis';

export { CodeEditorExample } from './code-editor-example';
export { ChallengeCodeEditor } from './challenge-code-editor';
export type { ChallengeCodeEditorProps } from './challenge-code-editor';

// Re-export utilities
export { formatCode, validateCodeSyntax } from '../../utils/code-formatter';
export { validateCode, getCodeImprovementSuggestions } from '../../utils/code-validator-fixed';
export type { ValidationContext, ValidationRule, ValidationResult } from '../../utils/code-validator-fixed';