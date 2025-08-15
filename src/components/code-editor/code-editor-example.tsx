'use client';

import React, { useState } from 'react';
import { CodeEditorWithAnalysis } from './code-editor-with-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { testCodeValidator } from '@/utils/test-code-validator';

const SAMPLE_CODE = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));

// This function has some issues:
// 1. No input validation
// 2. Inefficient recursive approach
// 3. Missing semicolon on line 7`,

  typescript: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(userData: Partial<User>): User {
  const defaultUser: User = {
    id: Math.random(),
    name: 'Anonymous',
    email: 'user@example.com'
  };
  
  return { ...defaultUser, ...userData };
}

const user = createUser({ name: 'John Doe' });
console.log(user);`,

  python: `# Python Example
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# This has some issues:
# Missing type hints
# No input validation
# Could use iterative approach

for i in range(5)
    print(f"Factorial of {i} is {factorial(i)}")`,

  java: `// Java Example
public class Calculator {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));
    }
    
    public int add(int a, int b) {
        return a + b
    }
    
    public int multiply(int a, int b) {
        return a * b;
    }
}`,
};

export const CodeEditorExample: React.FC = () => {
  const [language, setLanguage] = useState<string>('javascript');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [code, setCode] = useState(SAMPLE_CODE.javascript);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(SAMPLE_CODE[newLanguage as keyof typeof SAMPLE_CODE] || '');
  };

  const handleCodeRun = (code: string) => {
    console.log('Running code:', code);
    // In a real implementation, this would execute the code
    alert('Code execution would happen here!');
  };

  const handleCodeSave = (code: string) => {
    console.log('Saving code:', code);
    // In a real implementation, this would save the code
    alert('Code saved successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Monaco Editor Integration Demo
            <Badge variant="secondary">Task 5 Complete</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userLevel">User Level</Label>
              <Select value={userLevel} onValueChange={(value: any) => setUserLevel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="realtime"
                checked={realTimeAnalysis}
                onCheckedChange={setRealTimeAnalysis}
              />
              <Label htmlFor="realtime">Real-time Analysis</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="analysis"
                checked={showAnalysis}
                onCheckedChange={setShowAnalysis}
              />
              <Label htmlFor="analysis">Show Analysis Panel</Label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                console.log('Running validator test...');
                testCodeValidator();
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Test Validator (Check Console)
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="h-[600px]">
        <CodeEditorWithAnalysis
          initialCode={code}
          language={language}
          userLevel={userLevel}
          exerciseType="coding"
          onCodeChange={setCode}
          onCodeRun={handleCodeRun}
          onCodeSave={handleCodeSave}
          realTimeAnalysis={realTimeAnalysis}
          showAnalysis={showAnalysis}
          className="h-full"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features Implemented</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Core Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Monaco Editor with TypeScript support</li>
                <li>• Syntax highlighting for multiple languages</li>
                <li>• Autocompletion and IntelliSense</li>
                <li>• Customizable themes (light/dark)</li>
                <li>• Real-time code analysis</li>
                <li>• Error and warning detection</li>
                <li>• Code formatting utilities</li>
                <li>• Validation with fix suggestions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">✅ Advanced Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Resizable panels</li>
                <li>• Fullscreen mode</li>
                <li>• File upload/download</li>
                <li>• Keyboard shortcuts</li>
                <li>• Complexity metrics</li>
                <li>• Pattern detection</li>
                <li>• Responsive design</li>
                <li>• Accessibility support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};