import { NextRequest, NextResponse } from 'next/server';
import { codeAnalysisService, AnalysisOptions, FeedbackContext } from '@/services/code-analysis.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, options, context }: {
      code: string;
      options: AnalysisOptions;
      context?: FeedbackContext;
    } = body;

    // Validate required fields
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required and must be a string' },
        { status: 400 }
      );
    }

    if (!options || !options.language) {
      return NextResponse.json(
        { error: 'Analysis options with language are required' },
        { status: 400 }
      );
    }

    // Get improvement suggestions
    const suggestions = codeAnalysisService.getImprovementSuggestions(code, options, context);

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        count: suggestions.length,
        userLevel: options.userLevel,
        language: options.language,
      },
    });
  } catch (error) {
    console.error('Code suggestions API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error during suggestion generation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Code Suggestions API',
    description: 'Get personalized code improvement suggestions based on user level and context',
    endpoints: {
      'POST /api/code-analysis/suggestions': 'Get improvement suggestions for code',
    },
    example: {
      code: 'var x = 5;\nfor (var i = 0; i < 10; i++) {\n  console.log(i);\n}',
      options: {
        language: 'javascript',
        userLevel: 'intermediate',
      },
      context: {
        exerciseContext: {
          expectedPatterns: ['const', 'let'],
          difficulty: 2,
          topic: 'modern-javascript',
        },
      },
    },
  });
}