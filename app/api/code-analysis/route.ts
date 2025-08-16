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

    // Perform code analysis
    const analysis = await codeAnalysisService.analyzeCode(code, options, context);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Code analysis API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error during code analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Code Analysis API',
    endpoints: {
      'POST /api/code-analysis': 'Analyze code and get feedback',
    },
    example: {
      code: 'const x = 5;\nconsole.log(x);',
      options: {
        language: 'javascript',
        userLevel: 'beginner',
        includePerformanceAnalysis: false,
        includeSecurity: false,
      },
      context: {
        exerciseContext: {
          expectedPatterns: ['const', 'console.log'],
          difficulty: 1,
          topic: 'variables',
        },
      },
    },
  });
}