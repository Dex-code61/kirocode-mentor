# Code Analysis Service

A comprehensive code analysis system that provides real-time feedback, syntax error detection, and intelligent suggestions for multiple programming languages.

## Features

### 🔍 **Comprehensive Analysis**
- **Syntax Error Detection**: Identifies syntax errors in JavaScript, TypeScript, and Python
- **Style Analysis**: Checks code formatting, naming conventions, and best practices
- **Performance Analysis**: Detects inefficient patterns and suggests optimizations
- **Security Analysis**: Identifies potential security vulnerabilities
- **Complexity Metrics**: Calculates cyclomatic, cognitive, and maintainability metrics

### 🎯 **User-Adaptive Feedback**
- **Beginner**: Basic syntax and good practices
- **Intermediate**: Array methods, error handling, modern patterns
- **Advanced**: Async/await, architectural suggestions
- **Expert**: Performance optimizations, security considerations

### ⚡ **Real-time Analysis**
- **Debounced Analysis**: 500ms debounce prevents excessive API calls
- **Visual Feedback**: Monaco Editor decorations for errors, warnings, and suggestions
- **Progressive Enhancement**: Contextual suggestions based on exercise requirements

## Usage

### Basic Analysis

```typescript
import { codeAnalysisService } from '@/services/code-analysis.service';

const analysis = await codeAnalysisService.analyzeCode(
  'const x = 5\nconsole.log(x)',
  {
    language: 'javascript',
    userLevel: 'beginner',
    includePerformanceAnalysis: false,
    includeSecurity: false,
  }
);

console.log('Errors:', analysis.errors);
console.log('Warnings:', analysis.warnings);
console.log('Suggestions:', analysis.suggestions);
```

### Real-time Analysis

```typescript
codeAnalysisService.analyzeCodeRealTime(
  code,
  options,
  (analysis) => {
    // Handle analysis results
    updateUI(analysis);
  },
  500 // debounce ms
);
```

### React Hook

```typescript
import { useCodeAnalysis } from '@/hooks/useCodeAnalysis';

const {
  analysis,
  isAnalyzing,
  analyzeCode,
  analyzeCodeRealTime,
} = useCodeAnalysis({
  language: 'javascript',
  userLevel: 'intermediate',
  realTime: true,
  autoAnalyze: true,
});
```

## API Endpoints

### POST /api/code-analysis
Full code analysis with comprehensive feedback.

### POST /api/code-analysis/suggestions
Get targeted improvement suggestions based on user level and context.

## Components

### EnhancedMonacoEditor
Monaco Editor with integrated real-time code analysis, visual decorations, and feedback panel.

### CodeFeedbackPanel
Interactive feedback panel with tabbed interface for issues, suggestions, and metrics.

## Supported Languages

- **JavaScript**: Syntax, style, performance, security analysis
- **TypeScript**: All JavaScript features plus type-specific suggestions
- **Python**: Syntax, style, list comprehensions, naming conventions

## Analysis Categories

1. **Syntax**: Critical errors that prevent code execution
2. **Style**: Code formatting and convention adherence
3. **Performance**: Efficiency improvements and optimizations
4. **Security**: Potential security vulnerabilities
5. **Best Practice**: Industry standards and maintainability

## Metrics

- **Cyclomatic Complexity**: ≤10 (Good), 11-20 (Moderate), >20 (High)
- **Cognitive Complexity**: ≤15 (Good), 16-25 (Moderate), >25 (High)
- **Maintainability Index**: ≥85 (Excellent), 70-84 (Good), 50-69 (Moderate), <50 (Poor)

## Testing

Run the comprehensive test suite:

```bash
pnpm test:run src/services/__tests__/code-analysis.service.test.ts
```

The test suite covers:
- JavaScript/TypeScript syntax analysis
- Python syntax analysis
- Security rule detection
- Performance analysis
- Pattern detection
- User-level suggestions
- Real-time debounced analysis
- Contextual feedback
- Error handling

## Architecture

The service follows a modular architecture with:

- **AnalysisRule**: Extensible rule system for different languages and categories
- **AnalysisResult**: Standardized result format with severity levels
- **FeedbackContext**: Context-aware suggestions based on user progress and exercise requirements
- **Debounced Real-time**: Performance-optimized real-time analysis

## Future Enhancements

- Support for more programming languages (Java, C++, Go, Rust)
- Advanced pattern recognition using AST parsing
- Machine learning-based suggestions
- Integration with external linting tools
- Custom rule configuration per project