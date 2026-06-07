import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithFallback } from '@/lib/ai/analyze';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await analyzeWithFallback(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/analyze] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
