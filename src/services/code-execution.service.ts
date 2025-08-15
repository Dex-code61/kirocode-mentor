/**
 * Service pour l'exécution de code et tests unitaires
 */

export interface TestResult {
  passed: boolean;
  testName: string;
  description?: string;
  error?: string;
  executionTime?: number;
  output?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  testResults?: TestResult[];
}

export interface TestConfiguration {
  framework: 'JEST' | 'MOCHA' | 'VITEST' | 'PYTEST' | 'JUNIT' | 'GTEST' | 'CUSTOM';
  timeout: number;
  memoryLimit: number;
  timeLimit: number;
  allowedImports: string[];
  setup?: string;
  teardown?: string;
}

/**
 * Exécute le code utilisateur avec les tests unitaires
 */
export async function executeCodeWithTests(
  userCode: string,
  unitTests: string,
  language: string,
  config: TestConfiguration
): Promise<CodeExecutionResult> {
  const startTime = Date.now();
  
  try {
    // Simulation d'exécution de tests (en production, cela appellerait un service d'exécution sécurisé)
    const result = await simulateTestExecution(userCode, unitTests, language, config);
    
    const executionTime = Date.now() - startTime;
    
    return {
      ...result,
      executionTime,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    };
  }
}

/**
 * Simule l'exécution de tests (à remplacer par un vrai service d'exécution)
 */
async function simulateTestExecution(
  userCode: string,
  unitTests: string,
  language: string,
  config: TestConfiguration
): Promise<Omit<CodeExecutionResult, 'executionTime'>> {
  // Simulation d'un délai d'exécution
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Parse les tests pour extraire les noms des tests
  const testNames = extractTestNames(unitTests, config.framework);
  
  // Simule les résultats des tests
  const testResults: TestResult[] = testNames.map((testName, index) => {
    const passed = Math.random() > 0.3; // 70% de chance de réussir
    
    return {
      passed,
      testName,
      description: `Test case ${index + 1}: ${testName}`,
      error: passed ? undefined : generateRandomError(language),
      executionTime: Math.floor(Math.random() * 100) + 10,
      output: passed ? '✓ Test passed' : '✗ Test failed',
    };
  });
  
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  
  return {
    success: passedTests === totalTests,
    output: generateExecutionOutput(testResults, userCode),
    testResults,
    memoryUsage: Math.floor(Math.random() * 50) + 10, // MB
  };
}

/**
 * Extrait les noms des tests du code de test
 */
function extractTestNames(unitTests: string, framework: string): string[] {
  const testNames: string[] = [];
  
  switch (framework) {
    case 'JEST':
    case 'VITEST':
      // Recherche des patterns test() ou it()
      const jestMatches = unitTests.match(/(?:test|it)\s*\(\s*['"`]([^'"`]+)['"`]/g);
      if (jestMatches) {
        jestMatches.forEach(match => {
          const nameMatch = match.match(/['"`]([^'"`]+)['"`]/);
          if (nameMatch) {
            testNames.push(nameMatch[1]);
          }
        });
      }
      break;
      
    case 'PYTEST':
      // Recherche des fonctions test_*
      const pytestMatches = unitTests.match(/def\s+(test_\w+)/g);
      if (pytestMatches) {
        pytestMatches.forEach(match => {
          const nameMatch = match.match(/def\s+(test_\w+)/);
          if (nameMatch) {
            testNames.push(nameMatch[1]);
          }
        });
      }
      break;
      
    case 'JUNIT':
      // Recherche des méthodes @Test
      const junitMatches = unitTests.match(/@Test[\s\S]*?public\s+void\s+(\w+)/g);
      if (junitMatches) {
        junitMatches.forEach(match => {
          const nameMatch = match.match(/public\s+void\s+(\w+)/);
          if (nameMatch) {
            testNames.push(nameMatch[1]);
          }
        });
      }
      break;
      
    default:
      // Fallback: cherche des patterns génériques
      const genericMatches = unitTests.match(/test\w*/gi);
      if (genericMatches) {
        testNames.push(...genericMatches.slice(0, 5)); // Limite à 5 tests
      }
  }
  
  // Si aucun test trouvé, génère des tests par défaut
  if (testNames.length === 0) {
    testNames.push('Basic functionality test', 'Edge case test', 'Error handling test');
  }
  
  return testNames;
}

/**
 * Génère une erreur aléatoire selon le langage
 */
function generateRandomError(language: string): string {
  const errors = {
    javascript: [
      'ReferenceError: variable is not defined',
      'TypeError: Cannot read property of undefined',
      'SyntaxError: Unexpected token',
      'AssertionError: Expected 5 but got 3',
    ],
    typescript: [
      'Type error: Argument of type string is not assignable to parameter of type number',
      'Property does not exist on type',
      'Cannot find name',
      'AssertionError: Expected true but got false',
    ],
    python: [
      'NameError: name is not defined',
      'TypeError: unsupported operand type(s)',
      'IndexError: list index out of range',
      'AssertionError: Expected 10 but got 5',
    ],
    java: [
      'NullPointerException',
      'ArrayIndexOutOfBoundsException',
      'AssertionError: Expected <5> but was <3>',
      'CompilationError: cannot find symbol',
    ],
  };
  
  const languageErrors = errors[language as keyof typeof errors] || errors.javascript;
  return languageErrors[Math.floor(Math.random() * languageErrors.length)];
}

/**
 * Génère la sortie d'exécution
 */
function generateExecutionOutput(testResults: TestResult[], userCode: string): string {
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  
  let output = `Running ${totalTests} test(s)...\n\n`;
  
  testResults.forEach((test, index) => {
    output += `${index + 1}. ${test.testName}\n`;
    output += `   ${test.passed ? '✓ PASS' : '✗ FAIL'}\n`;
    if (test.error) {
      output += `   Error: ${test.error}\n`;
    }
    if (test.executionTime) {
      output += `   Time: ${test.executionTime}ms\n`;
    }
    output += '\n';
  });
  
  output += `\nResults: ${passedTests}/${totalTests} tests passed\n`;
  
  if (passedTests === totalTests) {
    output += '🎉 All tests passed! Great job!\n';
  } else {
    output += `❌ ${totalTests - passedTests} test(s) failed. Keep trying!\n`;
  }
  
  return output;
}

/**
 * Valide le code utilisateur avant l'exécution
 */
export function validateUserCode(code: string, language: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!code.trim()) {
    errors.push('Code cannot be empty');
    return { valid: false, errors };
  }
  
  // Vérifications de sécurité basiques
  const dangerousPatterns = [
    /eval\s*\(/,
    /exec\s*\(/,
    /system\s*\(/,
    /import\s+os/,
    /require\s*\(\s*['"]fs['"]/,
    /require\s*\(\s*['"]child_process['"]/,
  ];
  
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(code)) {
      errors.push('Code contains potentially dangerous operations');
    }
  });
  
  // Vérifications spécifiques au langage
  switch (language) {
    case 'javascript':
    case 'typescript':
      if (!code.includes('function') && !code.includes('=>') && !code.includes('class')) {
        errors.push('Code should contain at least one function or class');
      }
      break;
      
    case 'python':
      if (!code.includes('def ') && !code.includes('class ')) {
        errors.push('Code should contain at least one function or class definition');
      }
      break;
      
    case 'java':
      if (!code.includes('public ') && !code.includes('class ')) {
        errors.push('Java code should contain at least one public method or class');
      }
      break;
  }
  
  return { valid: errors.length === 0, errors };
}