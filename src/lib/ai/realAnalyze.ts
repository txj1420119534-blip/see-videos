import { AnalyzeRequest, AnalyzeResponse, AnalyzeResponseSchema } from './schema';
import { buildPrompts } from './promptBuilder';
import { callOpenAICompatible } from './providers/openaiCompatible';

export async function realAnalyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!baseUrl || !apiKey || !model) {
    throw new Error('MISSING_ENV');
  }

  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS || 18000);
  const { system, userText } = buildPrompts(req);

  const text = await callOpenAICompatible({
    baseUrl,
    apiKey,
    model,
    timeoutMs,
    system,
    userText,
    frameImageBase64: req.frameImageBase64,
    userImageBase64: req.userImageBase64,
  });

  const rawJson = extractJsonObject(text);
  if (!rawJson) {
    throw new Error('LLM_JSON_PARSE_FAILED');
  }

  const checked = AnalyzeResponseSchema.safeParse(rawJson);
  if (!checked.success) {
    throw new Error('LLM_SCHEMA_INVALID');
  }

  return {
    ...checked.data,
    mode: 'real',
    scenarioId: req.scenarioId,
    debug: {
      ...checked.data.debug,
      usedVision: Boolean(req.frameImageBase64),
      usedUserImage: Boolean(req.userImageBase64),
      rawModelName: model,
    },
  };
}

function extractJsonObject(text: string): unknown | null {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;

    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}
