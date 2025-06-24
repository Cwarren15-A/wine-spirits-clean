import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openaiConfigured = !!openaiApiKey;
    
    return NextResponse.json({
      openaiConfigured,
      model: openaiConfigured ? 'gpt-4' : 'Not configured',
      timestamp: new Date().toISOString(),
      status: 'operational'
    });
    
  } catch (error) {
    console.error('Error checking admin status:', error);
    
    return NextResponse.json(
      {
        openaiConfigured: false,
        model: 'Error checking configuration',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 