import { AnalyzeRequest, AnalyzeRequestSchema, AnalyzeResponse, ScenarioIdSchema } from './schema';
import { mockAnalyze } from './mockAnalyze';
import { realAnalyze } from './realAnalyze';

export async function analyzeWithFallback(input: unknown): Promise<AnalyzeResponse> {
  const parsed = AnalyzeRequestSchema.safeParse(input);

  if (!parsed.success) {
    const scenarioId = ScenarioIdSchema.safeParse(
      typeof input === 'object' && input !== null && 'scenarioId' in input
        ? (input as { scenarioId?: unknown }).scenarioId
        : undefined
    );

    return mockAnalyze(scenarioId.success ? scenarioId.data : 'bixie', 'REQUEST_SCHEMA_INVALID');
  }

  const req = parsed.data;

  if (process.env.AI_MODE !== 'real') {
    return mockAnalyze(req, 'AI_MODE_MOCK');
  }

  if (!process.env.LLM_BASE_URL || !process.env.LLM_API_KEY || !process.env.LLM_MODEL) {
    return mockAnalyze(req, 'MISSING_ENV');
  }

  try {
    return await realAnalyze(req);
  } catch (error) {
    console.error('[analyzeWithFallback] Real API failed, falling back to mock:', error);
    return mockAnalyze(req, normalizeFallbackReason(error));
  }
}

export async function analyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  return analyzeWithFallback(req);
}

function normalizeFallbackReason(error: unknown): string {
  if (!(error instanceof Error)) return 'LLM_UNKNOWN_ERROR';

  const [reason] = error.message.split(':');
  if (
    [
      'MISSING_ENV',
      'LLM_TIMEOUT',
      'LLM_HTTP_ERROR',
      'LLM_EMPTY_RESPONSE',
      'LLM_JSON_PARSE_FAILED',
      'LLM_SCHEMA_INVALID',
    ].includes(reason)
  ) {
    return reason;
  }

  return 'LLM_UNKNOWN_ERROR';
}
