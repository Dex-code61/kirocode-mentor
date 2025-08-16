/**
 * Simple test script to verify API endpoints
 */

const testCodeAnalysisAPI = async () => {
  const testCode = `
    const x = 5
    console.log(x)
    var oldStyle = 'should use const'
  `;

  const options = {
    language: 'javascript',
    userLevel: 'beginner' as const,
    includePerformanceAnalysis: false,
    includeSecurity: false,
  };

  try {
    // Test the analysis endpoint
    const response = await fetch('/api/code-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCode,
        options,
      }),
    });

    const result = await response.json();
    console.log('Analysis API Response:', result);

    // Test the suggestions endpoint
    const suggestionsResponse = await fetch('/api/code-analysis/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCode,
        options,
      }),
    });

    const suggestionsResult = await suggestionsResponse.json();
    console.log('Suggestions API Response:', suggestionsResult);
  } catch (error) {
    console.error('API Test failed:', error);
  }
};

export { testCodeAnalysisAPI };
