'use client';

import React, { useState, useCallback } from 'react';
import { MonacoEditor } from './monaco-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TestTube, 
  Play, 
  Eye, 
  EyeOff,
  FileCode,
  Settings
} from 'lucide-react';

interface UnitTestEditorProps {
  unitTests: string;
  language: string;
  framework: string;
  onTestsChange?: (tests: string) => void;
  onRunTests?: () => void;
  readOnly?: boolean;
  className?: string;
}

export const UnitTestEditor: React.FC<UnitTestEditorProps> = ({
  unitTests,
  language,
  framework,
  onTestsChange,
  onRunTests,
  readOnly = false,
  className = '',
}) => {
  const [showTests, setShowTests] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const handleTestsChange = useCallback((newTests: string) => {
    onTestsChange?.(newTests);
  }, [onTestsChange]);

  const getTestTemplate = useCallback(() => {
    switch (framework.toLowerCase()) {
      case 'jest':
      case 'vitest':
        return `// Jest/Vitest Test Template
describe('User Code Tests', () => {
  test('should work correctly', () => {
    // Your test code here
    expect(true).toBe(true);
  });

  test('should handle edge cases', () => {
    // Test edge cases
    expect(true).toBe(true);
  });
});`;

      case 'pytest':
        return `# PyTest Test Template
def test_basic_functionality():
    """Test basic functionality"""
    assert True == True

def test_edge_cases():
    """Test edge cases"""
    assert True == True`;

      case 'junit':
        return `// JUnit Test Template
import org.junit.Test;
import static org.junit.Assert.*;

public class UserCodeTest {
    @Test
    public void testBasicFunctionality() {
        // Your test code here
        assertTrue(true);
    }

    @Test
    public void testEdgeCases() {
        // Test edge cases
        assertTrue(true);
    }
}`;

      default:
        return `// Test Template
// Write your tests here
console.log('Test passed');`;
    }
  }, [framework]);

  const getLanguageForTests = () => {
    switch (framework.toLowerCase()) {
      case 'pytest':
        return 'python';
      case 'junit':
        return 'java';
      default:
        return language;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Unit Tests
            <Badge variant="outline" className="text-xs">
              {framework}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {onRunTests && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRunTests}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Run Tests</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTests(!showTests)}
              className="flex items-center gap-2"
            >
              {showTests ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showTests ? 'Hide' : 'Show'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {showTests && (
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs" disabled={readOnly}>
                <FileCode className="w-3 h-3 mr-1" />
                Edit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Test Code Preview</span>
                  <Badge variant="secondary" className="text-xs">
                    {getLanguageForTests().toUpperCase()}
                  </Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <MonacoEditor
                    initialCode={unitTests || getTestTemplate()}
                    language={getLanguageForTests()}
                    readOnly={true}
                    height="300px"
                    className="border-0"
                  />
                </div>
                
                {!unitTests && (
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <Settings className="w-4 h-4 inline mr-2" />
                    No tests defined yet. Switch to Edit mode to create tests.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Edit Test Code</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestsChange(getTestTemplate())}
                    className="text-xs"
                  >
                    Use Template
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <MonacoEditor
                    initialCode={unitTests || getTestTemplate()}
                    language={getLanguageForTests()}
                    onCodeChange={handleTestsChange}
                    readOnly={readOnly}
                    height="400px"
                    className="border-0"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                  <TestTube className="w-4 h-4 inline mr-2" />
                  Write your unit tests here. They will be executed against the user's code to verify correctness.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};