import type { AnalyzeResponse } from '@/lib/ai/schema';

export type AnalysisResult = AnalyzeResponse;
export { MOCK_RESULTS as mockResults, getMockResult } from '@/lib/ai/mockAnalyze';
